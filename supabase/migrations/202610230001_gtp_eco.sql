-- Dedicated GTP tables in public for the service-role Edge Function.
-- RLS and revoked browser grants prevent direct participant access.
create table if not exists public.gtp_eco_scans (
  id uuid primary key default gen_random_uuid(),
  input_json jsonb not null,
  report_json jsonb not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);
create table if not exists public.gtp_eco_contacts (
  id uuid primary key default gen_random_uuid(),
  scan_id uuid not null references public.gtp_eco_scans(id) on delete cascade,
  name text not null,
  email text not null,
  marketing_consent boolean not null default false,
  notice_version text not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  report_hash text not null unique,
  delivery_status text not null default 'pending',
  provider_message_id text
);
create index if not exists gtp_eco_contacts_created_idx on public.gtp_eco_contacts(created_at desc);
create index if not exists gtp_eco_contacts_scan_idx on public.gtp_eco_contacts(scan_id);
create table if not exists public.gtp_eco_rate_events (
  key text not null,
  bucket timestamptz not null,
  count integer not null default 0,
  primary key (key, bucket)
);
alter table public.gtp_eco_scans enable row level security;
alter table public.gtp_eco_contacts enable row level security;
alter table public.gtp_eco_rate_events enable row level security;
revoke all on public.gtp_eco_scans, public.gtp_eco_contacts, public.gtp_eco_rate_events from anon, authenticated;

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

create or replace function public.gtp_eco_purge_expired()
returns void language plpgsql security definer set search_path = public, pg_temp as $$
begin
  delete from public.gtp_eco_contacts where expires_at < now();
  delete from public.gtp_eco_scans where expires_at < now();
  delete from public.gtp_eco_rate_events where bucket < now() - interval '2 days';
end $$;
revoke all on function public.gtp_eco_purge_expired() from public, anon, authenticated;
grant execute on function public.gtp_eco_purge_expired() to service_role;

-- Install and verify a daily Supabase Cron job in the selected project before
-- enabling collection. It must call: select public.gtp_eco_purge_expired();
