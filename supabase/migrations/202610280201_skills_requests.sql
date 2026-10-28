-- Skills pack email requests (skills/get/ -> Edge Function skills-request).
-- Only the service-role Edge Function reads or writes this table.
-- Browsers get no grants: no anon or authenticated select, insert, update or delete.
create table if not exists public.skills_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 40),
  email text not null check (char_length(email) between 6 and 254 and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  consent boolean not null check (consent = true),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '30 days'),
  delivery_status text not null default 'pending' check (delivery_status in ('pending', 'sent', 'failed')),
  provider_message_id text
);
create index if not exists skills_requests_email_created_idx on public.skills_requests (email, created_at desc);
create index if not exists skills_requests_created_idx on public.skills_requests (created_at desc);

alter table public.skills_requests enable row level security;
-- RLS is on and no policy exists, so anon and authenticated roles match no rows.
-- The revoke removes the table grants as well, belt and braces.
revoke all on public.skills_requests from anon, authenticated;

-- Retention: the consent covers one email with one link. Rows go after 30 days.
create or replace function public.skills_requests_purge_expired()
returns void language plpgsql security definer set search_path = public, pg_temp as $$
begin
  delete from public.skills_requests where expires_at < now();
end $$;
revoke all on function public.skills_requests_purge_expired() from public, anon, authenticated;
grant execute on function public.skills_requests_purge_expired() to service_role;

-- Private bucket for the pack. scripts/upload-skills-pack.mjs uploads the zip;
-- the Edge Function signs a 7-day download link. No public read.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('skills-pack', 'skills-pack', false, 5242880, array['application/zip'])
on conflict (id) do update set public = false;
