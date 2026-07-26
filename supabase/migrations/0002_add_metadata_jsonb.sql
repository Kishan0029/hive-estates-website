alter table properties add column metadata jsonb default '{}'::jsonb;
alter table property_images add column metadata jsonb default '{}'::jsonb;
alter table leads add column metadata jsonb default '{}'::jsonb;
alter table staff_profiles add column metadata jsonb default '{}'::jsonb;
