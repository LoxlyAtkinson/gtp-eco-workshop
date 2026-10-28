#!/usr/bin/env node
// Builds chapters/voice-cues.json from experience/presentation-script.md section 4.
// Deterministic, no network. Run: node scripts/build-voice-cues.mjs
//
// Each spoken beat becomes a cue: its trigger phrases (the first words of each
// quoted line, [bracket] cues and placeholders removed) and where the deck shows
// that beat. Landing positions use the same model as the chapter scripts: a beat's
// share of its scene's talk seconds, scaled to 0.92 of the scene's scroll travel.
// The scene totals come from sceneSeconds in scroll-presentation.js, so a beat the
// script cut but the deck timeline still reserves (09-5) keeps its slot.

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const scriptPath = join(root, 'experience', 'presentation-script.md');
const deckPath = join(root, 'scroll-presentation.js');
const outPath = join(root, 'chapters', 'voice-cues.json');

const SCALE = 0.92; // auto-scroll and the beat plates stop at 0.92 of scene travel
const PHRASE_WORDS = 8, PHRASE_MAX = 10, MIN_KEYS = 4, MAX_TRIGGERS = 4;

// ---- normalisation (keep identical to chapters/voice-cues.js) ----
const NUMS = { zero: '0', one: '1', two: '2', three: '3', four: '4', five: '5', six: '6', seven: '7', eight: '8', nine: '9', ten: '10', eleven: '11', twelve: '12', thirteen: '13', fourteen: '14', fifteen: '15', sixteen: '16', seventeen: '17', eighteen: '18', nineteen: '19', twenty: '20', thirty: '30', forty: '40', fifty: '50', sixty: '60', seventy: '70', eighty: '80', ninety: '90', hundred: '100' };
const STOP = new Set('a an the and or but so to of in on at for with from by is are was were be been being it its this that these those i im you your youre youve youll we weve well our us they theyre their them he she his her my me do does did just now then than there theres here heres okay ok right oh um uh lets let also very really as if up out about into get got go going gonna can will would could should has have had not dont thats whats s ll re ve d t'.split(' '));
// Spelled letters join into one token, so "E, C, O" and "C-R-O" match Chrome's "ECO" and "CRO".
function words(text) {
  const raw = String(text).toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, ' ').trim().split(' ').filter(Boolean);
  const out = [];
  for (let i = 0; i < raw.length; i++) {
    if (/^[a-z]$/.test(raw[i]) && /^[a-z]$/.test(raw[i + 1] || '')) { let run = raw[i]; while (/^[a-z]$/.test(raw[i + 1] || '')) run += raw[++i]; out.push(run); }
    else out.push(NUMS[raw[i]] || raw[i]);
  }
  return out;
}
const keysOf = (ws) => [...new Set(ws.filter((w) => !STOP.has(w)))];

// ---- read sources ----
const md = readFileSync(scriptPath, 'utf8').replace(/\r\n/g, '\n');
const deck = readFileSync(deckPath, 'utf8');
const secMatch = /sceneSeconds\s*=\s*\[([\d,\s]+)\]/.exec(deck);
const sceneSeconds = secMatch ? secMatch[1].split(',').map((n) => Number(n.trim())) : [];

const s3 = md.slice(md.indexOf('## 3.'), md.indexOf('## 4.'));
const openers = {};
for (const m of s3.matchAll(/^- \*\*([ABC]),[^*]*\*\*\s*"([^"]+)"/gm)) openers[m[1]] = m[2];

const s4start = md.indexOf('## 4.'), s4end = md.indexOf('## 5.');
if (s4start < 0 || s4end < 0) throw new Error('Section 4 or 5 heading not found in presentation-script.md');
const lines = md.slice(s4start, s4end).split('\n');

// ---- parse scenes and beat blocks ----
const SCENE = /^### Scene (\d{2}) · ([^·]+)·/;
const BEAT = /^\*\*(\d{2})-(\d+)(?:\s+(to|and)\s+(\d{2})-(\d+))?\s*·\s*(\d+):(\d{2})([^*]*)\*\*(.*)$/;
const scenes = [];
let scene = null, beat = null;
for (const line of lines) {
  const sm = SCENE.exec(line);
  if (sm) { scene = { scene: sm[1], title: sm[2].trim(), beats: [] }; scenes.push(scene); beat = null; continue; }
  const bm = BEAT.exec(line);
  if (bm && scene) {
    const n = Number(bm[2]), last = bm[5] ? Number(bm[5]) : n;
    beat = { id: `${bm[1]}-${n}`, label: bm[3] ? `${bm[1]}-${n} ${bm[3]} ${bm[4]}-${last}` : `${bm[1]}-${n}`, n, last, sec: Number(bm[6]) * 60 + Number(bm[7]), main: [bm[9]], bullets: [] };
    scene.beats.push(beat);
    continue;
  }
  if (!beat) continue;
  if (!line.trim() || line.startsWith('#')) { beat = null; continue; }
  if (/^\s*- /.test(line)) beat.bullets.push(line.replace(/^\s*- /, ''));
  else beat.main.push(line);
}

const quotesIn = (text) => [...text.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
function phraseOf(quote) {
  const ws = quote.replace(/\[[^\]]*\]/g, ' ').replace(/\*/g, ' ');
  const all = words(ws);
  if (all.length < 3) return null;
  let take = Math.min(all.length, PHRASE_WORDS);
  while (take < Math.min(all.length, PHRASE_MAX) && keysOf(all.slice(0, take)).length < MIN_KEYS) take++;
  const phrase = all.slice(0, take);
  const keys = keysOf(phrase);
  return keys.length >= 2 ? { phrase: phrase.join(' '), keys } : null;
}

const cues = [], silent = [], report = [];
for (const sc of scenes) {
  const num = Number(sc.scene);
  const scriptTotal = sc.beats.reduce((a, b) => a + b.sec, 0);
  const deckTotal = sceneSeconds[num - 1] || scriptTotal;
  // Beat numbers the script skips inside the scene (cut beats). If the deck's scene
  // total is longer than the script's, the difference sits in those slots.
  const present = new Set();
  sc.beats.forEach((b) => { for (let i = b.n; i <= b.last; i++) present.add(i); });
  const maxN = Math.max(...present);
  const missing = [];
  for (let i = 1; i <= maxN; i++) if (!present.has(i)) missing.push(i);
  const gap = Math.max(0, deckTotal - scriptTotal);
  const timeline = [...sc.beats.map((b) => ({ n: b.n, sec: b.sec, beat: b }))];
  if (gap && missing.length) missing.forEach((i) => timeline.push({ n: i, sec: gap / missing.length, beat: null }));
  timeline.sort((a, b) => a.n - b.n);
  const total = timeline.reduce((a, t) => a + t.sec, 0);
  let at = 0;
  timeline.forEach((t) => { t.p0 = at / total * SCALE; at += t.sec; t.p1 = at / total * SCALE; });
  report.push({ scene: sc.scene, scriptSeconds: scriptTotal, deckSeconds: deckTotal, reservedGapSeconds: gap && missing.length ? gap : 0, cutBeats: missing.map((i) => `${sc.scene}-${i}`) });

  let firstInScene = true;
  for (const t of timeline) {
    const b = t.beat;
    if (!b) continue;
    const mainText = b.main.join(' ');
    const triggers = [];
    const add = (q) => { const p = q && phraseOf(q); if (p && !triggers.some((x) => x.phrase === p.phrase) && triggers.length < MAX_TRIGGERS) triggers.push(p); };
    const mainQuotes = quotesIn(mainText);
    add(mainQuotes[0]);
    b.bullets.forEach((line) => add(quotesIn(line)[0]));
    mainQuotes.slice(1).forEach(add);
    // "Say your opener (A or C)" and "If you picked opener B" pull the opener lines from section 3.
    const blockText = [mainText, ...b.bullets].join(' ');
    for (const m of blockText.matchAll(/opener \(?([ABC])(?: or ([ABC]))?\)?/g)) [m[1], m[2]].filter(Boolean).forEach((k) => add(openers[k]));
    if (!triggers.length) { silent.push(b.label); continue; }
    const width = t.p1 - t.p0;
    const lo = Math.ceil(t.p0 * 100), hi = Math.floor(t.p1 * 100);
    let pct = Math.round((t.p0 + Math.min(0.04, 0.35 * width)) * 100);
    pct = hi >= lo ? Math.max(lo, Math.min(hi, pct)) : Math.round((t.p0 + t.p1) / 2 * 100);
    pct = Math.max(0, Math.min(99, pct));
    cues.push({
      id: b.id,
      label: b.label,
      scene: sc.scene,
      sceneTitle: sc.title,
      seconds: b.sec,
      p0: Number(t.p0.toFixed(4)),
      p1: Number(t.p1.toFixed(4)),
      triggers,
      action: { kind: firstInScene ? 'enter-scene' : 'reveal-beat', hash: `#${sc.scene}-${String(pct).padStart(2, '0')}`, pct }
    });
    firstInScene = false;
  }
}

const out = {
  generated: 'node scripts/build-voice-cues.mjs',
  source: 'experience/presentation-script.md section 4',
  model: 'landing pct = beat start share of scene talk seconds x 0.92 (+ a small step into the beat); scene totals from scroll-presentation.js sceneSeconds',
  counts: { scenes: scenes.length, cues: cues.length, triggers: cues.reduce((a, c) => a + c.triggers.length, 0), silentBeats: silent.length },
  silentBeats: silent,
  scenes: report,
  cues
};
writeFileSync(outPath, JSON.stringify(out, null, 1) + '\n');
console.log(`voice cues: ${cues.length} cues, ${out.counts.triggers} trigger phrases, ${scenes.length} scenes, ${silent.length} silent beats skipped (${silent.join(', ') || 'none'})`);
for (const r of report) if (r.reservedGapSeconds || r.scriptSeconds !== r.deckSeconds) console.log(`  scene ${r.scene}: script ${r.scriptSeconds}s, deck ${r.deckSeconds}s, reserved gap ${r.reservedGapSeconds}s for ${r.cutBeats.join(', ') || 'no cut beat'}`);
console.log(`wrote ${outPath}`);
