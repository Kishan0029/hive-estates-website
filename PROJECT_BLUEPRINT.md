# PROJECT BLUEPRINT — Real Estate Listings Website

> **READ THIS FILE FIRST, ALWAYS.**
> Before generating, editing, or refactoring any code in this repository, you must read this
> document in full. This is the single source of truth for architecture, database schema,
> naming conventions, security rules, and UI conventions. If any instruction elsewhere
> conflicts with this file, this file wins. If something is ambiguous, follow the closest
> existing pattern in this document rather than inventing a new one.

---

## 1. Project Overview

A real estate listings website for a client (Nextverse), showcasing property listings with
detailed pages, image galleries, filtering/search, and an admin panel for staff to manage
listings.

- **Current scale:** ~500–1,000 properties, ~15 images per property
- **Must scale to:** 1,000+ properties, thousands of images, without an architecture change
- **Primary goals:** SEO performance, fast image-heavy pages, safe non-technical admin usage,
  near-zero hosting cost
- **Built solo, AI-assisted ("vibe coded")** — so conventions in this doc exist specifically to
  keep the codebase consistent and safe even when generated incrementally by an AI agent.

---

## 2. Tech Stack (do not substitute without updating this file)

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Next.js (TypeScript, App Router)** | Fallback: Nuxt + Nitro if Cloudflare Pages compatibility issues arise — do not switch without explicit instruction |
| Hosting | **Cloudflare Pages** | Free tier, commercial use permitted, edge-deployed |
| Database | **Supabase (Postgres)** | Managed, includes pooling (PgBouncer), Auth, and RLS |
| Auth | **Supabase Auth** | Used only for `/admin` staff login — public site has no user accounts |
| Image storage | **Cloudflare R2** | No egress/bandwidth fees; images never touch app server disk |
| Image delivery | **Cloudflare CDN + `next/image`** | Resizing/format conversion at the edge |
| Styling | **Tailwind CSS** | Utility-first, no separate CSS-in-JS library |
| DNS / Security | **Cloudflare (free plan)** | DDoS protection, SSL, sits in front of Pages and R2 |
| Automation | **n8n (separate VPS)** | Fully decoupled — website must never depend on this VPS being online |

**Non-negotiable architecture rule:** the browser must never talk to Supabase or R2 directly.
All reads/writes go through this app's own API routes (server-side only). See Section 7.

---

## 3. High-Level Architecture

```
Visitor Browser
      │
      │  requests page / calls /api/*
      ▼
Cloudflare Pages (Next.js app — Edge/Server runtime)
      │
      ├── Server Components / API routes ──► Supabase (Postgres + Auth)
      │                                        (server-side client + service role key,
      │                                         NEVER exposed to browser)
      │
      └── Server Components / API routes ──► Cloudflare R2 (images)
                                               (server-side upload/signed URLs only)

Admin Browser (/admin, authenticated)
      │
      ▼
Same Next.js app, protected routes ──► Supabase Auth session check ──► CRUD via API routes
```

- Public pages are rendered via **ISR** (Incremental Static Regeneration), not full SSG and not
  pure client-side rendering.
- When an admin edits a property, an **on-demand revalidation** call regenerates only that one
  property's page — never a full site rebuild.
- Bulk operations (e.g. CSV import of many properties) must run as **chunked/background jobs**,
  never as a single long-running request — Cloudflare Pages Functions have CPU execution-time
  limits per request.

---

## 4. Folder Structure (target shape — align new files to this)

```
/app
  /(public)
    /page.tsx                     → homepage
    /properties
      /page.tsx                   → listing/search page
      /[slug]/page.tsx            → single property page
  /admin
    /layout.tsx                   → auth-gated layout, redirects if no session
    /page.tsx                     → dashboard
    /properties
      /page.tsx                   → table view (search/filter/paginate)
      /new/page.tsx
      /[id]/edit/page.tsx
  /api
    /properties
      /route.ts                   → GET (list, paginated), POST (create)
      /[id]/route.ts               → GET, PATCH, DELETE
    /properties/[id]/images/route.ts → image upload (server-side to R2)
    /revalidate/route.ts          → on-demand ISR trigger, called after admin edits
    /leads/route.ts                → inquiry/contact form submissions
    /auth/*                        → Supabase Auth server helpers if needed
/components
  /ui/                            → shared, generic components (Button, Input, Modal, etc.)
  /property/                      → PropertyCard, PropertyGallery, PropertyFilters, etc.
  /admin/                         → AdminTable, AdminForm, ImageUploader, etc.
/lib
  /supabase/
    server.ts                     → server-only Supabase client (service role / pooled conn)
    client.ts                     → ONLY for Auth session state in client components, never for data
  /r2.ts                          → server-only R2 upload/signed URL helpers
  /types.ts                       → shared TypeScript types (mirrors DB schema, see Section 5)
  /validators.ts                  → input validation (e.g. zod schemas) for API routes
/styles
  /globals.css
.env.example                       → documented env var names, NEVER real values
```

---

## 5. Database Schema (Supabase / Postgres)

> Run these as migrations. Keep migrations in `/supabase/migrations/`. Do not modify the schema
> by hand-editing existing migration files after they've been applied — always add a new one.

```sql
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
  approved_banks  text,                                -- free-form text, e.g. "SBI, HDFC"
  dimensions      text,                                -- e.g. "30*40 and 30*50"
  layout_name     text,                                -- e.g. "Hive Estate Knp"
  price_on_request boolean not null default false,     -- if true, UI shows 'Request call' instead of price
  status          text not null default 'draft'        -- 'draft' | 'active' | 'sold' | 'rented'
                    check (status in ('draft','active','sold','rented')),
  featured        boolean not null default false,
  metadata        jsonb default '{}'::jsonb,           -- flexible column for unforeseen fields
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
  metadata     jsonb default '{}'::jsonb,
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
  metadata      jsonb default '{}'::jsonb,
  created_at    timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- STAFF PROFILES  (extends auth.users with role info)
-- ─────────────────────────────────────────────
create table staff_profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text,
  role       text not null default 'admin' check (role in ('admin','agent')),
  metadata   jsonb default '{}'::jsonb,
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
```

### Row Level Security (RLS)

```sql
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
```

> **Note on roles:** currently one flat `admin`/`agent` distinction exists as a placeholder.
> If per-agent listing ownership is required later (agents editing only their own listings),
> extend the `staff_full_access_*` policies to check `created_by = auth.uid()` for the `agent`
> role specifically. Do not build this now — only when explicitly requested.

---

## 6. Environment Variables

Store real values only in Cloudflare Pages' environment variable settings and a local
`.env.local` (gitignored). `.env.example` should list names only, never real values.

```
# Server-side ONLY — never prefix with NEXT_PUBLIC_
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_DB_POOL_URL=          # pooled (PgBouncer) connection string

R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_BASE_URL=            # public CDN URL prefix for serving images

# Client-safe (only if Supabase Auth session handling needs it in the browser)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=  # anon key only — never the service role key
```

**Rule:** the service role key, R2 secret keys, and the pooled DB URL must NEVER appear in any
file under `/app` that runs in a client component, never in anything prefixed
`NEXT_PUBLIC_`, and never logged to the browser console.

---

## 7. API & Data-Access Rules (critical — do not violate)

1. **No direct browser-to-Supabase data calls.** The Supabase JS client may only be imported in:
   - Files under `/app/api/**/route.ts`
   - Server Components (no `"use client"` directive)
   - `/lib/supabase/server.ts`

   It must never be imported into a file with `"use client"` for the purpose of fetching or
   mutating property/lead data. (The one exception: reading the current Auth session client-side
   for UI state, via `/lib/supabase/client.ts`, using only the anon key.)

2. **No direct browser-to-R2 uploads with exposed credentials.** Image uploads from the admin
   panel go: browser → `/api/properties/[id]/images` (server route) → R2, using server-only
   credentials. If pre-signed upload URLs are used instead, they must be short-lived and
   generated server-side per upload.

3. **All property data fetching for public pages happens server-side** (Server Components or
   route handlers), so the browser's network tab never shows a Supabase or R2 URL — only calls
   to this app's own domain.

4. **Validate all API route inputs** (e.g. with `zod`) before touching the database. Never trust
   client-submitted data as-is, especially on `/admin` write routes.

5. **Bulk/CSV imports** must be chunked (e.g., batches of 20–50 rows) and processed via multiple
   requests or a queued background job — never as one unbounded request.

---

## 8. Admin Panel Spec

- Route: `/admin/**`, protected by a layout-level Supabase Auth session check — unauthenticated
  users are redirected to `/admin/login`.
- Features required:
  - Property list: paginated table, search by title/city, filter by status/type/listing_type
  - Create/edit property form: all fields from Section 5, plus drag-and-drop image uploader
    (multi-image, reorderable, one marked as cover image)
  - Delete property (should cascade-delete its images, both DB rows and R2 objects)
  - Status toggle: draft / active / sold / rented
  - Leads view: read-only list of contact form submissions, newest first
  - Data Entry Rule (Landmarks): For nearby landmarks, only include those within 0.5 km and do NOT include the distance explicitly in the text (e.g., 'KLE School', not 'KLE School (0.8 km)').
- Only one role tier (`admin`) is required right now. `agent` role exists in the schema as a
  placeholder for future scoped access — do not build agent-specific UI unless asked.

---

## 9. Frontend / UI Conventions

- **Language:** TypeScript everywhere — no untyped `.js`/`.jsx` files. Shared types live in
  `/lib/types.ts` and should mirror the DB schema in Section 5 exactly (keep them in sync
  whenever the schema changes).
- **Styling:** Tailwind CSS utility classes only. No inline `style={{}}` unless truly dynamic
  (e.g. a computed width). No separate CSS modules unless a Tailwind utility genuinely can't
  express something.
- **Components:** functional components only, one component per file, colocated by feature
  (see folder structure). Reusable primitives go in `/components/ui/`.
- **Images:** always rendered via `next/image`, never a bare `<img>` tag, so resizing/lazy-load
  is automatic.
- **Forms:** use a single consistent form-handling approach across the admin panel (pick one —
  e.g. `react-hook-form` — and use it everywhere, don't mix approaches file to file).
- **Naming:** PascalCase for components, camelCase for functions/variables, kebab-case for
  route segments/file names where Next.js requires it.

---

## 10. SEO Requirements (public pages only)

- Each property page must have a unique `<title>` and meta description generated from its data
  (e.g. "3 BHK Villa for Sale in Whitefield — ₹85L | [Site Name]").
- Use Next.js `generateMetadata` per property page — do not hardcode static metadata for dynamic
  pages.
- Structured data: include JSON-LD (`schema.org/RealEstateListing` or `Product`) on property
  pages where feasible.
- Property pages must be server-rendered (ISR), never client-only rendered — search engines
  must see full content without executing JS.

---

## 11. Deployment & Revalidation

- Hosting: Cloudflare Pages, connected to the GitHub repo, auto-deploys on push to `main`.
- ISR: property pages use a `revalidate` interval AND on-demand revalidation.
- On-demand flow: admin saves a property → API route writes to Supabase → API route calls
  `/api/revalidate?slug=...` (protected by a secret token env var) → Next.js regenerates just
  that page.
- Before building new features, confirm ISR + API routes behave as expected on Cloudflare's
  runtime (this should already be validated early in the project — see project setup notes).

---

## 12. Things Explicitly Out of Scope (do not build unless asked)

- Payments/checkout
- Realtime features (live chat, live updates)
- Multi-tenant support (multiple agencies on one instance)
- Elasticsearch/Algolia search — Postgres indexes are sufficient at current scale
- Mobile app — web only

---

## 13. How to Use This Document

- Before writing or modifying any code, re-read the relevant section above.
- If a requested feature isn't covered here, implement it in the style/pattern established by
  the closest existing section, and flag the gap rather than silently inventing a divergent
  convention.
- If the database schema changes, update Section 5 in the same change set — this file and the
  actual schema must never drift apart.
- Treat Section 7 (data-access rules) as a hard security boundary, not a style preference.