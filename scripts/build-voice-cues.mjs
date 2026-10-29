#!/usr/bin/env node
// Builds chapters/voice-cues.json from experience/presentation-script.md section 4.
// Deterministic, no network. Run: node scripts/build-voice-cues.mjs
// Options (for tests against a sample file): --script <md> --cards <md> --out <json>
//
// Every beat of the script becomes one entry (silent beats too, with no trigger), with
// where the deck shows it: p0/p1 = the beat's share of its scene's talk seconds,
// scaled to 0.92 of the scene's scroll travel (the same model as the chapter scripts).
// Scene totals come from sceneSeconds in scroll-presentation.js, so a beat the script
// cut but the deck timeline still reserves (09-5) keeps its slot.
//
// The trigger for a beat, first match wins:
//   1. experience/cue-cards.md, when it exists and has a line for the beat:
//        - SS-N · cue: <word or two> · card: <short prompt>
//      The cue word is the whole trigger: one heard cue word is enough. The card text is
//      what the presenter screen shows under the cue word.
//   2. A {{cue}} marker in the beat's line in the script: the braced words, plus up to
//      3 content words just before the braces for context. The presenter shows the line
//      with the cue marked (text + cueSpan).
//   3. Otherwise the first words of each quoted line (the trigger used before cue words).
//
// Word rules come from chapters/voice-match.js (loaded with node:vm), the same file the
// browser uses, so the keys written here match what the browser hears.

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const arg = (name, fallback) => { const i = process.argv.indexOf(name); return i > 0 && process.argv[i + 1] ? resolve(process.argv[i + 1]) : fallback; };
const scriptPath = arg('--script', join(root, 'experience', 'presentation-script.md'));
const cardsPath = arg('--cards', join(root, 'experience', 'cue-cards.md'));
const outPath = arg('--out', join(root, 'chapters', 'voice-cues.json'));
const deckPath = join(root, 'scroll-presentation.js');

const SCALE = 0.92; // auto-scroll and the beat plates stop at 0.92 of scene travel
const PHRASE_WORDS = 8, PHRASE_MAX = 10, MIN_KEYS = 4, MAX_TRIGGERS = 4, CONTEXT_WORDS = 3;

// ---- word rules: the browser's own file ----
const sandbox = {};
vm.runInNewContext(readFileSync(join(root, 'chapters', 'voice-match.js'), 'utf8'), sandbox, { filename: 'voice-match.js' });
const { words, keysOf, contentOf } = sandbox.GTPVoiceMatch;

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

// ---- cue cards (optional) ----
const cards = {};
let cardsUsed = false;
if (existsSync(cardsPath)) {
  const CARD = /^\s*-\s*(\d{2})-(\d+)\s*·\s*cue:\s*(.+?)\s*·\s*card:\s*(.+?)\s*$/;
  for (const line of readFileSync(cardsPath, 'utf8').replace(/\r\n/g, '\n').split('\n')) {
    const m = CARD.exec(line);
    if (m) cards[`${m[1]}-${Number(m[2])}`] = { cue: m[3].replace(/[`*"]/g, '').trim(), card: m[4].replace(/\*\*/g, '').trim() };
  }
  cardsUsed = Object.keys(cards).length > 0;
}

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
const spokenWords = (text) => words(quotesIn(text).join(' ').replace(/\[[^\]]*\]/g, ' ').replace(/\{\{|\}\}/g, ' '));
function phraseOf(quote) {
  const ws = quote.replace(/\[[^\]]*\]/g, ' ').replace(/\*/g, ' ').replace(/\{\{|\}\}/g, ' ');
  const all = words(ws);
  if (all.length < 3) return null;
  let take = Math.min(all.length, PHRASE_WORDS);
  while (take < Math.min(all.length, PHRASE_MAX) && keysOf(all.slice(0, take)).length < MIN_KEYS) take++;
  const phrase = all.slice(0, take);
  const keys = keysOf(phrase);
  return keys.length >= 2 ? { kind: 'first-words', phrase: phrase.join(' '), keys } : null;
}
// Display text: markdown bold gone, braces gone, the cue's place kept as a char span.
function displayOf(mainText, bullets) {
  let text = [mainText.trim(), ...bullets.map((b) => '• ' + b.trim())].join('\n').replace(/\*\*/g, '').replace(/[ \t]+/g, ' ');
  const at = text.indexOf('{{'), end = text.indexOf('}}', at + 2);
  let cueSpan = null;
  if (at >= 0 && end > at) {
    const inner = text.slice(at + 2, end).trim();
    text = text.slice(0, at) + inner + text.slice(end + 2);
    cueSpan = [at, at + inner.length];
  }
  return { text: text.replace(/\{\{|\}\}/g, ''), cueSpan };
}
const firstWordsOf = (s, n, keepBrackets = false) => { const ws = (keepBrackets ? s : s.replace(/\[[^\]]*\]/g, ' ')).replace(/\s+/g, ' ').trim().split(' ').filter((w) => /[a-z0-9]/i.test(w)); return ws.slice(0, n).join(' ').replace(/[.,;:!?…]+$/, '') + (ws.length > n ? ' …' : ''); };

const cues = [], silent = [], report = [], sources = { 'cue-cards': 0, 'script-braces': 0, 'first-words': 0 };
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
    const shown = displayOf(mainText, b.bullets);
    const triggers = [];
    let source = null, cue = null, card = null, cueAt = 0;
    const card0 = cardsUsed && (cards[b.id] || cards[`${sc.scene}-${b.last}`]);
    const braces = /\{\{([^}]+)\}\}/.exec(mainText);
    if (card0) {
      const cueKeys = [...new Set(words(card0.cue))];
      if (cueKeys.length) { triggers.push({ kind: 'cue', phrase: cueKeys.join(' '), keys: cueKeys, cue: cueKeys }); source = 'cue-cards'; cue = card0.cue; card = card0.card; }
    }
    if (!source && braces) {
      const cueKeys = [...new Set(words(braces[1]))];
      const before = mainText.slice(0, braces.index).replace(/\[[^\]]*\]/g, ' ').replace(/\*\*/g, ' ');
      const context = [...new Set(contentOf(words(before)).reverse())].filter((w) => !cueKeys.includes(w)).slice(0, CONTEXT_WORDS).reverse();
      if (cueKeys.length) {
        triggers.push({ kind: 'cue', phrase: [...context, ...cueKeys].join(' '), keys: [...cueKeys, ...context], cue: cueKeys });
        source = 'script-braces'; cue = braces[1].trim();
        // Glide over the words still to come after the cue, at the script's pace.
        const all = spokenWords(mainText).length, prior = spokenWords(mainText.slice(0, braces.index) + '"').length;
        cueAt = all ? Math.min(0.9, prior / all) : 0;
      }
    }
    if (!source) {
      const add = (q) => { const p = q && phraseOf(q); if (p && !triggers.some((x) => x.phrase === p.phrase) && triggers.length < MAX_TRIGGERS) triggers.push(p); };
      const mainQuotes = quotesIn(mainText);
      add(mainQuotes[0]);
      b.bullets.forEach((line) => add(quotesIn(line)[0]));
      mainQuotes.slice(1).forEach(add);
      // "Say your opener (A or C)" and "If you picked opener B" pull the opener lines from section 3.
      const blockText = [mainText, ...b.bullets].join(' ');
      for (const m of blockText.matchAll(/opener \(?([ABC])(?: or ([ABC]))?\)?/g)) [m[1], m[2]].filter(Boolean).forEach((k) => add(openers[k]));
      if (triggers.length) {
        source = 'first-words';
        const q = mainQuotes[0] || quotesIn(b.bullets.join(' '))[0] || (openers.A || '');
        cue = firstWordsOf(q, 4); card = firstWordsOf(q, 16, true);
      }
    }
    if (!source) {
      silent.push(b.label);
      card = shown.text.replace(/^\[|\]$/g, '');
    } else sources[source]++;
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
      // Glide length at script pace: the beat's seconds after the cue word.
      glideSeconds: Math.round(b.sec * (1 - cueAt)),
      p0: Number(t.p0.toFixed(4)),
      p1: Number(t.p1.toFixed(4)),
      // Where the beat's visual is showing: a small step past p0. The glide reaches it fast.
      lead: Number((pct / 100).toFixed(4)),
      silent: !source,
      source,
      cue,
      card,
      text: shown.text,
      cueSpan: shown.cueSpan,
      triggers,
      action: { kind: firstInScene ? 'enter-scene' : 'reveal-beat', hash: `#${sc.scene}-${String(pct).padStart(2, '0')}`, pct }
    });
    firstInScene = false;
  }
}

const spoken = cues.filter((c) => !c.silent);
const out = {
  generated: 'node scripts/build-voice-cues.mjs',
  source: cardsUsed ? 'experience/cue-cards.md (cue words) + experience/presentation-script.md section 4 (timing)' : 'experience/presentation-script.md section 4',
  model: 'p0/p1 = beat share of scene talk seconds x 0.92; lead = p0 + a small step into the beat; scene totals from scroll-presentation.js sceneSeconds',
  counts: { scenes: scenes.length, beats: cues.length, cues: spoken.length, triggers: spoken.reduce((a, c) => a + c.triggers.length, 0), silentBeats: silent.length, sources },
  silentBeats: silent,
  scenes: report,
  cues
};
writeFileSync(outPath, JSON.stringify(out, null, 1) + '\n');
console.log(`voice cues: ${cues.length} beats, ${spoken.length} with a trigger (cue-cards ${sources['cue-cards']}, script {{cue}} ${sources['script-braces']}, first words ${sources['first-words']}), ${scenes.length} scenes, silent: ${silent.join(', ') || 'none'}`);
console.log(cardsUsed ? `cue cards: ${Object.keys(cards).length} lines from ${cardsPath}` : `cue cards: none (${existsSync(cardsPath) ? 'no lines in the cue format' : 'file not found'}: ${cardsPath})`);
for (const r of report) if (r.reservedGapSeconds || r.scriptSeconds !== r.deckSeconds) console.log(`  scene ${r.scene}: script ${r.scriptSeconds}s, deck ${r.deckSeconds}s, reserved gap ${r.reservedGapSeconds}s for ${r.cutBeats.join(', ') || 'no cut beat'}`);
console.log(`wrote ${outPath}`);
