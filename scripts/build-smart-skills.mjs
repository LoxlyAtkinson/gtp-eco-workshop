#!/usr/bin/env node
// Build the Smart skills pack (owner item 20): three extra skills behind a separate
// special link, renamed with a "Smart" prefix, each keeping its original licence and
// credit. A skill without a licence that allows sharing is left out and reported.
//
// The pack never ships on GitHub Pages: it is written to build/ (git-ignored) and
// uploaded to a private Supabase bucket by scripts/upload-smart-skills.mjs.
//
// Usage: node scripts/build-smart-skills.mjs
// Writes: build/smart-skills/gtp-smart-skills.zip and build/smart-skills/manifest.json
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = process.env.SMART_SKILLS_SRC || path.join(os.homedir(), '.claude', 'skills');
const OUT_DIR = path.join(root, 'build', 'smart-skills');
const ZIP = path.join(OUT_DIR, 'gtp-smart-skills.zip');

// licence: where the licence text comes from. null = no licence that allows sharing (left out).
const SKILLS = [
  { from: 'slopmonster', to: 'smart-slopmonster', title: 'SmartSlopMonster', author: 'Jack Roberts', licence: 'MIT', licenceFile: 'LICENSE', source: 'the slopmonster skill folder (LICENSE included by its author)' },
  { from: 'last30days', to: 'smart-last30days', title: 'SmartLast30Days', author: 'Matt Van Horn', licence: 'MIT', licenceFile: path.join(root, 'scripts', 'smart-skills', 'last30days-LICENSE'), source: 'https://github.com/mvanhorn/last30days-skill' },
  { from: 'competitor-analysis', to: 'smart-market-scan', title: 'SmartMarketScan', author: null, licence: null, source: null },
];
const SKIP = (p) => /(^|[\\/])(__pycache__|\.git|node_modules)([\\/]|$)|\.pyc$/.test(p);

const stage = fs.mkdtempSync(path.join(os.tmpdir(), 'gtp-smart-skills-'));
const packDir = path.join(stage, 'gtp-smart-skills');
fs.mkdirSync(packDir);
const included = [];
const excluded = [];

for (const s of SKILLS) {
  const src = path.join(SRC, s.from);
  if (!fs.existsSync(path.join(src, 'SKILL.md'))) { excluded.push({ skill: s.from, reason: 'not installed on this laptop' }); continue; }
  if (!s.licence) { excluded.push({ skill: s.from, reason: 'no licence or author in its folder, so sharing it is not allowed' }); continue; }
  const dest = path.join(packDir, s.to);
  fs.cpSync(src, dest, { recursive: true, filter: (p) => !SKIP(p) });
  // Rename only the skill's name field; the body stays as its author wrote it.
  const md = path.join(dest, 'SKILL.md');
  const text = fs.readFileSync(md, 'utf8');
  const renamed = text.replace(/^(---\r?\n[\s\S]*?^name:\s*)["']?[^\r\n"']+["']?/m, `$1${s.to}`);
  if (renamed === text) throw new Error(`${s.from}: no name field found in SKILL.md frontmatter`);
  fs.writeFileSync(md, renamed);
  const licSrc = path.isAbsolute(s.licenceFile) ? s.licenceFile : path.join(src, s.licenceFile);
  if (!fs.existsSync(path.join(dest, 'LICENSE'))) fs.copyFileSync(licSrc, path.join(dest, 'LICENSE'));
  fs.writeFileSync(path.join(dest, 'NOTICE.txt'), [
    `${s.title} (folder ${s.to})`,
    '',
    `This is the "${s.from}" skill by ${s.author}, renamed for the GTP ECO workshop.`,
    `Only the name field in SKILL.md changed. Everything else is the author's work, unchanged.`,
    `Licence: ${s.licence} (see LICENSE in this folder). Source: ${s.source}.`,
    '',
  ].join('\n'));
  included.push({ skill: s.from, as: s.to, title: s.title, author: s.author, licence: s.licence });
}

fs.writeFileSync(path.join(packDir, 'README.txt'), [
  'GTP ECO workshop: Smart skills pack',
  '',
  'How to install (Claude Code): unzip, then copy each smart-* folder into ~/.claude/skills/.',
  'In the Claude app: Settings > Capabilities > Skills, upload each folder as its own zip.',
  '',
  'What is inside:',
  ...included.map((i) => `- ${i.title} (${i.as}): the "${i.skill}" skill by ${i.author}, ${i.licence} licence.`),
  '',
  'Each folder keeps its original LICENSE and a NOTICE.txt naming the author and source.',
  ...(excluded.length ? ['', 'Left out:', ...excluded.map((e) => `- ${e.skill}: ${e.reason}.`)] : []),
  '',
].join('\n'));

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.rmSync(ZIP, { force: true });
// Windows bsdtar writes zip archives with -a; elsewhere fall back to the zip command.
if (process.platform === 'win32') execFileSync(path.join(process.env.SystemRoot || 'C:\\Windows', 'System32', 'tar.exe'), ['-a', '-cf', ZIP, '-C', stage, 'gtp-smart-skills']);
else execFileSync('zip', ['-qr', ZIP, 'gtp-smart-skills'], { cwd: stage });
fs.rmSync(stage, { recursive: true, force: true });

const buf = fs.readFileSync(ZIP);
const manifest = { built: new Date().toISOString(), zip: path.relative(root, ZIP).replace(/\\/g, '/'), bytes: buf.length, sha256: createHash('sha256').update(buf).digest('hex'), included, excluded };
fs.writeFileSync(path.join(OUT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(JSON.stringify(manifest, null, 2));
