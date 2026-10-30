-- Scanner participants land in the Smart AI Solutions CRM as their own lead source (owner 2026-10-30).
alter type public.crm_lead_source add value if not exists 'gtp_workshop';
