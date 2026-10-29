-- Aligns the live skills_requests table (project efkgdafxzbsdhjbspavs) with 202610280201.
-- The live table was created earlier with a `pack` column and without the delivery columns.
-- Additive only: no column or row is dropped.
alter table public.skills_requests add column if not exists expires_at timestamptz not null default (now() + interval '30 days');
alter table public.skills_requests add column if not exists delivery_status text not null default 'pending';
alter table public.skills_requests add column if not exists provider_message_id text;
do $$ begin
  alter table public.skills_requests add constraint skills_requests_delivery_status_chk check (delivery_status in ('pending', 'sent', 'failed'));
exception when duplicate_object then null; end $$;
alter table public.skills_requests alter column pack set default 'gtp-workshop-skills';
create index if not exists skills_requests_email_created_idx on public.skills_requests (email, created_at desc);
create index if not exists skills_requests_created_idx on public.skills_requests (created_at desc);

-- Only the service-role Edge Function touches this table.
alter table public.skills_requests enable row level security;
revoke all on public.skills_requests from anon, authenticated;

create or replace function public.skills_requests_purge_expired()
returns void language plpgsql security definer set search_path = public, pg_temp as $$
begin
  delete from public.skills_requests where expires_at < now();
end $$;
revoke all on function public.skills_requests_purge_expired() from public, anon, authenticated;
grant execute on function public.skills_requests_purge_expired() to service_role;

-- Rate limit storage shared with eco-api (same definition as 202610230001).
create table if not exists public.gtp_eco_rate_events (
  key text not null,
  bucket timestamptz not null,
  count integer not null default 0,
  primary key (key, bucket)
);
alter table public.gtp_eco_rate_events enable row level security;
revoke all on public.gtp_eco_rate_events from anon, authenticated;
create or replace function public.gtp_eco_claim_rate_limit(p_key text, p_bucket timestamptz, p_limit integer)
returns boolean language plpgsql security definer set search_path = public, pg_temp as $$
declare v_count integer;
begin
  insert into public.gtp_eco_rate_events(key, bucket, count) values(p_key, p_bucket, 1)
  on conflict (key, bucket) do update set count = public.gtp_eco_rate_events.count + 1
  returning count into v_count;
  return v_count <= p_limit;
end $$;
revoke all on function public.gtp_eco_claim_rate_limit(text,timestamptz,integer) from public, anon, authenticated;
grant execute on function public.gtp_eco_claim_rate_limit(text,timestamptz,integer) to service_role;

-- Private bucket for the pack. 10 MB covers the combined zip.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('skills-pack', 'skills-pack', false, 10485760, array['application/zip'])
on conflict (id) do update set public = false, file_size_limit = 10485760;
