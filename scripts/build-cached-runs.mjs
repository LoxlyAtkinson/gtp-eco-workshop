#!/usr/bin/env node
// G02-T06: build assets/cached-runs/<kind>.json from REAL recorded runs.
// Never hand-written: each file is generated from the newest run of its kind in
// experience/evidence/g02-runs/cached/ (written by live-runner/run-once.mjs), and
// the build fails unless that run's raw log carries the skill marker and a
// successful result. Run from the project root: node scripts/build-cached-runs.mjs
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const RUNS = 'experience/evidence/g02-runs/cached';
const OUT = 'assets/cached-runs';
const KINDS = ['competitor-scan', 'content', 'keywords', 'seo-plan', 'blog-calendar', 'seo-audit', 'backlink-analyzer', 'geo-citability'];
const SECRETS = [/fc-[A-Za-z0-9]{16,}/, /sk-ant-[A-Za-z0-9_-]{16,}/, /apify_api_[A-Za-z0-9]{16,}/, /sk-[A-Za-z0-9]{32,}/];

const files = readdirSync(RUNS);
const report = [];
for (const kind of KINDS) {
  const timingName = files.filter((f) => f.startsWith(`${kind}-20`) && f.endsWith('.timing.json')).sort().pop();
  if (!timingName) throw new Error(`${kind}: no recorded run in ${RUNS}`);
  const base = timingName.replace('.timing.json', '');
  const timing = JSON.parse(readFileSync(join(RUNS, timingName), 'utf8'));
  const lines = readFileSync(join(RUNS, `${base}.stream.jsonl`), 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
  const init = lines.find((m) => m.type === 'system' && m.subtype === 'init');
  const result = lines.find((m) => m.type === 'result');
  const skill = timing.skill;
  // Execution marker, in order: Skill tool_use -> "Launching skill" -> "Base directory for this skill".
  const iUse = lines.findIndex((m) => m.type === 'assistant' && (m.message.content || []).some((c) => c.type === 'tool_use' && c.name === 'Skill' && (c.input || {}).skill === skill));
  const iLaunch = lines.findIndex((m) => m.type === 'user' && JSON.stringify(m).includes(`Launching skill: ${skill}`));
  const iBase = lines.findIndex((m) => m.type === 'user' && JSON.stringify(m).includes('Base directory for this skill') && JSON.stringify(m).includes(skill));
  if (!(iUse >= 0 && iLaunch > iUse && iBase > iLaunch)) throw new Error(`${kind}: skill marker missing or out of order (${iUse}, ${iLaunch}, ${iBase})`);
  if (!result || result.subtype !== 'success' || result.is_error) throw new Error(`${kind}: run did not end in success`);
  if (!timing.invocation.args.includes('--tools')) throw new Error(`${kind}: recorded without --tools (superseded path)`);
  const text = readFileSync(join(RUNS, `${base}.result.md`), 'utf8');
  if (SECRETS.some((re) => re.test(text))) throw new Error(`${kind}: secret pattern in result text`);

  const req = timing.request;
  const siteRun = req.target === 'business-site';
  const label = siteRun
    ? 'Scan target: the workshop\'s own published deck, a stand-in because the Amberkloof demo site does not exist yet'
    : 'Demo data: Amberkloof is an invented brand · category-only request, no website';
  const out = {
    kind,
    skill,
    business: req.business,
    label,
    recorded_at: timing.started_at,
    request: req,
    target: siteRun
      ? { type: 'stand-in site', url: req.url, owner: 'the presenter (his own public workshop deck)', note: 'Not Amberkloof. The hero brand has no website yet (D9), so the site kinds scan the owner\'s own published deck.' }
      : { type: 'category-only', note: 'The hero brand Amberkloof is invented and has no website; the request names its category and area only (PROVISIONAL, spine D-06).' },
    text,
    source_log: `${RUNS}/${base}.stream.jsonl`,
    cached_run: {
      tag: 'cached run',
      what: 'A real recorded run of the named skill, replayed when the live run fails, cannot reach the runner, or has no complete result 20 s after the scene reveal.',
      recorded_at: timing.started_at,
      recorded_via: 'live-runner/run-once.mjs (the same code path as live-runner/server.mjs)',
      claude_code_version: init && init.claude_code_version,
      model: init && init.model,
      tools_offered: init && init.tools,
      wall_ms: timing.wall_ms,
      num_turns: timing.num_turns,
      firecrawl_scan: timing.firecrawl_scan ? { ok: timing.firecrawl_scan.ok, bytes: timing.firecrawl_scan.bytes } : null,
      skill_marker: `stream line ${iBase + 1}: "Base directory for this skill" for ${skill}`,
      timing_file: `${RUNS}/${timingName}`,
      result_file: `${RUNS}/${base}.result.md`,
      prompt_sha256: timing.invocation.prompt_sha256,
    },
  };
  writeFileSync(join(OUT, `${kind}.json`), `${JSON.stringify(out, null, 2)}\n`);
  report.push(`${kind}.json <- ${base} (${(timing.wall_ms / 1000).toFixed(1)} s, marker line ${iBase + 1})`);
}
console.log(report.join('\n'));
