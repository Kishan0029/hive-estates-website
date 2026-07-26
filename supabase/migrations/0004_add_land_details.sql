alter table properties add column dimensions text;
alter table properties add column layout_name text;
alter table properties add column price_on_request boolean not null default false;
