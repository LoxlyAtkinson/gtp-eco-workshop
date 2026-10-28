-- Stage chapter intake (2026-10-28): the audience posts a website from the public
-- join page with the anon key. Anon may INSERT only (no SELECT, UPDATE or DELETE),
-- so the join page must post with "Prefer: return=minimal". The presenter reads the
-- table through the local live runner with the service role key (env only).
create table if not exists public.stage_submissions (
  id uuid default gen_random_uuid() primary key,
  website text not null check (char_length(website) between 8 and 200 and website ~ '^https://'),
  name text check (name is null or char_length(name) <= 40),
  created_at timestamptz default now()
);

alter table public.stage_submissions enable row level security;

-- No browser role keeps any default privilege; anon gets INSERT on the two
-- audience columns only (id and created_at always come from their defaults).
revoke all on table public.stage_submissions from anon, authenticated;
grant insert (website, name) on table public.stage_submissions to anon;

drop policy if exists stage_submissions_anon_insert on public.stage_submissions;
create policy stage_submissions_anon_insert
  on public.stage_submissions
  for insert
  to anon
  with check (true);
