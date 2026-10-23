-- Apply once in the chosen GTP Supabase project after the schema migration.
-- Check existing jobs first; the name is deliberately project-specific.
create extension if not exists pg_cron;
select cron.schedule(
  'gtp-eco-30-day-purge',
  '17 2 * * *',
  $$ select public.gtp_eco_purge_expired(); $$
);

-- Verify installation and daily success in cron.job and cron.job_run_details.
