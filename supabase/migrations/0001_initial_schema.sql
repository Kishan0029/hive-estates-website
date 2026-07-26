-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────
-- PROPERTIES
-- ─────────────────────────────────────────────
create table properties (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,               -- SEO-friendly URL, e.g. "3bhk-villa-whitefield"
  title           text not null,
  description     text,
  listing_type    text not null check (listing_type in ('sale', 'rent')),
  property_type   text not null,                       -- 'apartment' | 'villa' | 'plot' | 'commercial' | ...
  price           numeric not null,
  currency        text not null default 'INR',
  bedrooms        integer,
  bathrooms       integer,
  area_sqft       numeric,
  address_line    text,
  city            text not null,
  state           text,
  pincode         text,
  latitude        numeric,
  longitude       numeric,
  amenities       jsonb default '[]'::jsonb,           -- array of strings, e.g. ["parking","gym"]
  status          text not null default 'draft'        -- 'draft' | 'active' | 'sold' | 'rented'
                    check (status in ('draft','active','sold','rented')),
  featured        boolean not null default false,
  created_by      uuid references auth.users(id),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index idx_properties_status on properties(status);
create index idx_properties_city on properties(city);
create index idx_properties_price on properties(price);
create index idx_properties_type on properties(property_type);
create index idx_properties_listing_type on properties(listing_type);

-- ─────────────────────────────────────────────
-- PROPERTY IMAGES  (R2 stores the file, this table stores the reference)
-- ─────────────────────────────────────────────
create table property_images (
  id           uuid primary key default gen_random_uuid(),
  property_id  uuid not null references properties(id) on delete cascade,
  r2_key       text not null,                -- object key/path in R2, not a full URL
  alt_text     text,
  sort_order   integer not null default 0,
  is_cover     boolean not null default false,
  created_at   timestamptz not null default now()
);

create index idx_property_images_property_id on property_images(property_id);

-- ─────────────────────────────────────────────
-- LEADS / INQUIRIES  (contact form submissions)
-- ─────────────────────────────────────────────
create table leads (
  id            uuid primary key default gen_random_uuid(),
  property_id   uuid references properties(id) on delete set null,
  name          text not null,
  phone         text,
  email         text,
  message       text,
  created_at    timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- STAFF PROFILES  (extends auth.users with role info)
-- ─────────────────────────────────────────────
create table staff_profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text,
  role       text not null default 'admin' check (role in ('admin','agent')),
  created_at timestamptz not null default now()
);

-- updated_at auto-touch trigger
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_properties_updated_at
before update on properties
for each row execute function set_updated_at();

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────────
alter table properties enable row level security;
alter table property_images enable row level security;
alter table leads enable row level security;
alter table staff_profiles enable row level security;

-- Public can read only ACTIVE properties (never draft/sold/rented internals)
create policy "public_read_active_properties"
on properties for select
using (status = 'active');

-- Public can read images belonging to active properties
create policy "public_read_active_property_images"
on property_images for select
using (
  exists (
    select 1 from properties
    where properties.id = property_images.property_id
    and properties.status = 'active'
  )
);

-- Authenticated staff (any role) can do everything on properties
create policy "staff_full_access_properties"
on properties for all
using (auth.uid() is not null)
with check (auth.uid() is not null);

create policy "staff_full_access_images"
on property_images for all
using (auth.uid() is not null)
with check (auth.uid() is not null);

-- Anyone (including anonymous visitors) can INSERT a lead (contact form),
-- but only staff can read/manage leads
create policy "public_insert_leads"
on leads for insert
with check (true);

create policy "staff_read_leads"
on leads for select
using (auth.uid() is not null);

-- Staff profiles: a user can read their own profile; only existing staff can manage others
create policy "staff_read_own_profile"
on staff_profiles for select
using (auth.uid() = id);
