// Spend ledger: one JSON line per run start and per run end. The runner refuses
// a new `claude -p` run (HELD_SPEND) once the ceiling for the window is reached.
import { appendFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
export const SPEND_LOG = process.env.LIVE_RUNNER_SPEND_LOG
  || join(HERE, '..', '..', 'experience', 'evidence', 'g02-runs', 'spend.log');
// Overnight ceilings from amendment A2.9 (PROVISIONAL): 60 claude -p runs, 60 Firecrawl credits.
export const MAX_CLAUDE_RUNS = Number(process.env.LIVE_RUNNER_MAX_CLAUDE_RUNS || 60);
const WINDOW_MS = Number(process.env.LIVE_RUNNER_SPEND_WINDOW_H || 12) * 3600_000;

function entries() {
  if (!existsSync(SPEND_LOG)) return [];
  return readFileSync(SPEND_LOG, 'utf8').split('\n').filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
}

export function claudeRunsInWindow() {
  const since = Date.now() - WINDOW_MS;
  return entries().filter((e) => e.event === 'start' && e.class === 'claude-p' && Date.parse(e.time) >= since).length;
}

export const MAX_FIRECRAWL_CREDITS = Number(process.env.LIVE_RUNNER_MAX_FIRECRAWL_CREDITS || 60);

export function firecrawlCreditsInWindow() {
  const since = Date.now() - WINDOW_MS;
  return entries().filter((e) => e.event === 'firecrawl' && Date.parse(e.time) >= since).reduce((n, e) => n + (Number(e.credits) || 0), 0);
}

export function spendAllowed(cls) {
  if (cls === 'claude-p') {
    const used = claudeRunsInWindow();
    return used < MAX_CLAUDE_RUNS ? { ok: true, used } : { ok: false, used, max: MAX_CLAUDE_RUNS };
  }
  if (cls === 'firecrawl') {
    const used = firecrawlCreditsInWindow();
    return used < MAX_FIRECRAWL_CREDITS ? { ok: true, used } : { ok: false, used, max: MAX_FIRECRAWL_CREDITS };
  }
  return { ok: true };
}

export function logSpend(entry) {
  mkdirSync(dirname(SPEND_LOG), { recursive: true });
  appendFileSync(SPEND_LOG, `${JSON.stringify({ time: new Date().toISOString(), ...entry })}\n`);
}
