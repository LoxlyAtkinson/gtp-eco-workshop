// Live-stage join form (deck popup and join/ page). Written by scripts/write-join-config.mjs
// from .env.local: the Supabase project URL and its anon (public) key ONLY.
// RLS lets the anon key INSERT into stage_submissions and nothing else.
// Never put the service-role key here: this file is public.
window.GTP_JOIN_CONFIG = { supabaseUrl: "https://efkgdafxzbsdhjbspavs.supabase.co", anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVma2dkYWZ4emJzZGhqYnNwYXZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MDMzODEsImV4cCI6MjA4OTA3OTM4MX0.DhNOXIc2IRa8U_Fz7KEBod89D-WHVWU7h5sx_wTXnno" };
