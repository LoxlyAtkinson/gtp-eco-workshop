// Exports every GTP workshop lead in the Smart AI Solutions CRM (lead_source gtp_workshop) to a CSV
// for Excel / Google Sheets: details, report status, results summary and the PDF link.
//   node report-worker/export-participants.mjs [out.csv]
// Default output is live-runner/.stage/ (git-ignored): participant details never go in the repo.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const envFile = join(here, '..', '.env.local');
const env = existsSync(envFile) ? Object.fromEntries(readFileSync(envFile, 'utf8').split(/\r?\n/).map(l => l.match(/^([A-Z0-9_]+)=(.*)$/)).filter(Boolean).map(m => [m[1], m[2].replace(/^['"]|['"]$/g, '')])) : {};
const out = process.argv[2] || join(here, '..', 'live-runner', '.stage', `gtp-participants-${new Date().toISOString().slice(0, 10)}.csv`);
const res = await fetch(`${env.SUPABASE_URL}/rest/v1/crm_leads?lead_source=eq.gtp_workshop&select=created_at,contact_name,email,company,location_city,form_data&order=created_at.asc`, { headers: { apikey: env.SUPABASE_SERVICE_ROLE_KEY, authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` } });
if (!res.ok) throw new Error(`CRM read HTTP ${res.status}`);
const rows = await res.json();
const cols = ['Date', 'Name', 'Email', 'Business', 'Website', 'Town', 'What they sell', 'Main goal', 'Came from', 'Report', 'Report PDF (link valid 30 days)', 'AI-readiness /100', 'Page basics passed', 'Searches ranked', 'Best ranking', 'Sites linking to them', 'On Google Business', 'Competitors found', 'Marketing tips opt-in'];
const cell = v => { const s = Array.isArray(v) ? v.join('; ') : v === null || v === undefined ? '' : String(v); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
const lines = [cols.join(',')];
for (const r of rows) {
  const f = r.form_data || {}, s = f.results || {};
  lines.push([String(f.requestedAt || r.created_at).slice(0, 16).replace('T', ' '), r.contact_name, r.email, r.company, f.website, r.location_city, f.offer, f.mainGoal, f.source, f.report || '', f.reportPdf || '', s.aiReadiness, s.basicsPassed, s.rankedSearches, s.bestRanking, s.linkingSites, s.googleBusiness === true ? 'yes' : s.googleBusiness === false ? 'no' : '', s.competitors, f.marketingConsent ? 'yes' : ''].map(cell).join(','));
}
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, '﻿' + lines.join('\r\n'));
console.log(JSON.stringify({ rows: rows.length, out }));
