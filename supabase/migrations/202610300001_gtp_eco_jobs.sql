-- PDF report jobs: the eco-api queues one job per scan, and the owner's local
-- report worker claims it, builds the PDF and hands it back for email delivery.
create table if not exists public.gtp_eco_jobs (
  id uuid primary key default gen_random_uuid(),
  scan_id uuid not null references public.gtp_eco_scans(id) on delete cascade,
  contact_id uuid not null references public.gtp_eco_contacts(id) on delete cascade,
  status text not null default 'queued' check (status in ('queued','running','done','failed')),
  attempts integer not null default 0,
  claimed_at timestamptz,
  heartbeat_at timestamptz,
  finished_at timestamptz,
  error text,
  created_at timestamptz not null default now()
);
create index if not exists gtp_eco_jobs_status_idx on public.gtp_eco_jobs(status, created_at);

-- One row per worker; seen_at tells the form whether the report machine is online.
create table if not exists public.gtp_eco_worker (
  id text primary key,
  seen_at timestamptz not null default now()
);

alter table public.gtp_eco_jobs enable row level security;
alter table public.gtp_eco_worker enable row level security;
revoke all on public.gtp_eco_jobs, public.gtp_eco_worker from anon, authenticated;

-- Claims the oldest queued job, or a running job whose worker stopped sending
-- heartbeats, at most 3 attempts. SKIP LOCKED keeps two workers from taking one job.
create or replace function public.gtp_eco_claim_job(p_worker text, p_stale_minutes integer default 15)
returns setof public.gtp_eco_jobs language plpgsql security definer set search_path = public, pg_temp as $$
declare v_id uuid;
begin
  insert into public.gtp_eco_worker(id, seen_at) values (p_worker, now())
  on conflict (id) do update set seen_at = now();
  select id into v_id from public.gtp_eco_jobs
   where attempts < 3 and (status = 'queued' or (status = 'running' and heartbeat_at < now() - make_interval(mins => p_stale_minutes)))
   order by created_at
   limit 1
   for update skip locked;
  if v_id is null then return; end if;
  return query update public.gtp_eco_jobs
     set status = 'running', attempts = attempts + 1, claimed_at = now(), heartbeat_at = now(), error = null
   where id = v_id returning *;
end $$;
revoke all on function public.gtp_eco_claim_job(text, integer) from public, anon, authenticated;
grant execute on function public.gtp_eco_claim_job(text, integer) to service_role;

-- Private bucket for finished PDFs. eco-api deletes each file after emailing it.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('gtp-eco-reports', 'gtp-eco-reports', false, 15728640, array['application/pdf'])
on conflict (id) do nothing;
