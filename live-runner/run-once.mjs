#!/usr/bin/env node
// Record one real run of an allow-listed kind, through the same code path the
// server uses. Used for Phase-0 timing (G02-T02) and cached-run recording (G02-T06).
// Usage: node live-runner/run-once.mjs <kind> '<json request>' <outDir>
import { createWriteStream, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { validateRequest, claudeArgs, CLAUDE_EXE } from './lib/kinds.mjs';
import { runKind, redact } from './lib/run-kind.mjs';

const [kindName, json, outDirArg] = process.argv.slice(2);
if (!kindName || !json || !outDirArg) {
  console.error('Usage: node live-runner/run-once.mjs <kind> <json request> <outDir>');
  process.exit(2);
}
const v = validateRequest(kindName, JSON.parse(json));
if (v.error) { console.error(`Invalid request: ${v.error}`); process.exit(2); }

const outDir = resolve(outDirArg);
mkdirSync(outDir, { recursive: true });
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const base = join(outDir, `${kindName}-${stamp}`);
const raw = createWriteStream(`${base}.stream.jsonl`);
const events = createWriteStream(`${base}.events.jsonl`);
const prompt = v.kind.prompt ? v.kind.prompt(v.request) : null;
const startedAt = new Date().toISOString();
let resultText = null;

const run = runKind({
  kindName,
  kind: v.kind,
  request: v.request,
  cwd: join(tmpdir(), 'gtp-live-runner', `${kindName}-${stamp}`),
  onRaw: (line) => raw.write(`${line}\n`),
  onEvent: (type, data) => {
    events.write(`${JSON.stringify({ type, ...data })}\n`);
    if (type === 'result') resultText = data.text || JSON.stringify(data.rows, null, 2);
    process.stdout.write(`[${(data.t_ms / 1000).toFixed(1)}s] ${type}: ${data.text || data.message || data.skill || ''}\n`.slice(0, 220));
  },
});

const summary = await run.done;
raw.end(); events.end();
const timing = {
  kind: kindName,
  skill: v.kind.skill,
  request: v.request,
  started_at: startedAt,
  ended_at: new Date().toISOString(),
  invocation: v.kind.type === 'claude' && !v.kind.disabledUntilReview
    ? { exe: CLAUDE_EXE, args: claudeArgs(v.kind), prompt_via: 'stdin', prompt_sha256: createHash('sha256').update(prompt).digest('hex'), prompt_text: prompt }
    : { type: v.kind.type, actor: v.kind.actor },
  ...summary,
};
writeFileSync(`${base}.timing.json`, redact(JSON.stringify(timing, null, 2)));
if (resultText) writeFileSync(`${base}.result.md`, redact(resultText));
console.log(`\nwall ${(summary.wall_ms / 1000).toFixed(1)} s -> ${base}.timing.json`);
