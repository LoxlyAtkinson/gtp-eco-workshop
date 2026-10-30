-- Email open tracking for scanner reports (owner 2026-10-30; the form's privacy notice says so).
alter table public.gtp_eco_contacts add column if not exists opened_at timestamptz;
alter table public.gtp_eco_contacts add column if not exists open_count integer not null default 0;
