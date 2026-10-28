// Browser proof for the scene 15 closing beat (15-8, chapters/closing.js|css).
// Checklist, written before capture:
//  A. From the 15-7 close, the engine's own auto-scroll (no manual scroll) carries the page into 15-8.
//  B. Each of the four lines lights in turn while the scroll moves (line 1..4 screenshots).
//  C. Headline, four lines, credit line, tree visual and QR card sit fully inside the stage (not under header or controls).
//  D. The quote is credited to "the T.D. Jakes and Prayer YouTube channel".
//  E. The scroll stops at the end of scene 15 with the status "End of scene · press Next" and 15-8 still on screen.
//  F. No horizontal overflow, no page errors, scene count 15 / 15.
//  G. Reduced motion: 15-8 reads in normal flow with all four lines and the grown tree.
//  H. Scene 15 speaker notes carry the 15-8 spoken script.
import { chromium } from 'playwright-core';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

const out = join(process.cwd(), 'experience', 'evidence', 'stage-live', 'closing');
mkdirSync(out, { recursive: true });
const base = process.env.GTP_BASE_URL || 'http://127.0.0.1:8765/';
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const rows = [];
const now = () => new Date().toISOString();

const layout = () => {
  const beat = document.querySelector('.c15-still');
  const cs = getComputedStyle(beat);
  const header = document.querySelector('.site-bar')?.getBoundingClientRect();
  const controls = document.querySelector('.deck-controls').getBoundingClientRect();
  const topLimit = header && header.bottom < innerHeight / 3 ? header.bottom - 1 : 0;
  const box = el => { const r = el.getBoundingClientRect(); return { top: Math.round(r.top), bottom: Math.round(r.bottom), left: Math.round(r.left), right: Math.round(r.right), h: Math.round(r.height) }; };
  const parts = { title: '.c15-still__title', grow: '.c15-still__grow', list: '.c15-still__beats', cite: '.c15-still__cite', keep: '.c15-still__keep' };
  const boxes = Object.fromEntries(Object.entries(parts).map(([k, s]) => [k, box(beat.querySelector(s))]));
  const inside = Object.entries(boxes).filter(([k]) => k !== 'keep' || getComputedStyle(beat.querySelector('.c15-still__keep')).display !== 'none')
    .every(([, b]) => b.top >= topLimit && b.bottom <= controls.top + 1 && b.left >= 0 && b.right <= innerWidth + 1);
  const lines = [...beat.querySelectorAll('.c15-still__beats li')];
  const close = document.querySelector('.c15-close');
  return {
    scrollY: Math.round(scrollY), hash: location.hash, scene: document.body.dataset.scene, count: document.getElementById('sceneCount').textContent,
    status: document.getElementById('autoStatus').dataset.state, statusText: document.getElementById('autoStatusText').textContent,
    beatVisible: cs.visibility === 'visible' && Number(cs.opacity) > .9, closeHidden: getComputedStyle(close).visibility === 'hidden' || Number(getComputedStyle(close).opacity) < .1,
    lit: lines.findIndex(li => li.classList.contains('is-on')), linesShown: lines.filter(li => Number(getComputedStyle(li).opacity) > .9).length,
    lineText: lines.map(li => li.firstChild.textContent.trim()), title: beat.querySelector('.c15-still__title').innerText.replace(/\s+/g, ' ').trim(),
    cite: beat.querySelector('.c15-still__cite').innerText.trim(), tags: [...beat.querySelectorAll('.c15-still__tag')].map(t => t.innerText.trim()),
    boxes, topLimit: Math.round(topLimit), controlsTop: Math.round(controls.top), inside, overflow: document.documentElement.scrollWidth - innerWidth
  };
};

for (const viewport of [{ label: 'projector', width: 1366, height: 768 }, { label: 'phone', width: 390, height: 844 }]) {
  const page = await browser.newPage({ viewport, reducedMotion: 'no-preference' });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  const route = new URL('#15-76', base).href;
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => document.body.dataset.scene === '15', null, { timeout: 8000 });
  await page.waitForTimeout(800);
  const startState = await page.evaluate(layout);
  const startShot = `${viewport.label}-0-start-15-7.png`;
  await page.screenshot({ path: join(out, startShot) });
  rows.push({ route, state: 'start at 15-7 close', viewport: page.viewportSize(), timestamp: now(), action: 'land on #15-76 (15-7 close) and wait 0.8 s', expected: 'scene 15, auto-scroll running, 15-8 not yet shown', actual: startState, result: startState.scene === '15' && startState.status === 'running' && !startState.beatVisible ? 'PASS' : 'FAIL', screenshot: startShot });
  // Let the engine's auto-scroll run with no input; shoot each time a new line lights.
  const seen = new Set();
  const t0 = Date.now();
  let last = startState;
  while (Date.now() - t0 < 90000) {
    await page.waitForTimeout(250);
    last = await page.evaluate(layout);
    const key = last.status === 'waiting' ? 'end' : last.lit >= 0 ? `line${last.lit + 1}` : null;
    if (key && !seen.has(key)) {
      seen.add(key);
      if (key !== 'end') await page.waitForTimeout(900);
      const s = await page.evaluate(layout);
      const file = `${viewport.label}-${key === 'end' ? '5-end-hold' : `${last.lit + 1}-${key}`}.png`;
      await page.screenshot({ path: join(out, file) });
      const ok = key === 'end'
        ? s.status === 'waiting' && /End of scene/.test(s.statusText) && s.beatVisible && s.closeHidden && s.linesShown === 4 && s.inside && s.overflow <= 1 && s.count.startsWith('15')
        : s.beatVisible && s.closeHidden && s.inside && s.overflow <= 1 && s.scrollY > startState.scrollY;
      rows.push({ route, state: key === 'end' ? 'auto-scroll end hold on 15-8' : `15-8 ${key} lit by auto-scroll`, viewport: page.viewportSize(), timestamp: now(), action: 'no input; engine auto-scroll at 1x', expected: key === 'end' ? 'status waiting "End of scene", 15-8 with four lines, title, credit, tree and QR inside the stage' : `line ${key.slice(4)} lit, 15-8 visible inside the stage, scroll moved`, actual: { ...s, secondsSinceStart: Math.round((Date.now() - t0) / 1000) }, result: ok ? 'PASS' : 'FAIL', screenshot: file });
    }
    if (last.status === 'waiting' && seen.has('end')) break;
  }
  for (const k of ['line1', 'line2', 'line3', 'line4', 'end']) if (!seen.has(k)) rows.push({ route, state: `missing ${k}`, viewport: page.viewportSize(), timestamp: now(), action: 'auto-scroll', expected: `${k} reached`, actual: last, result: 'FAIL', screenshot: null });
  // Speaker notes for scene 15.
  await page.locator('#notesButton').click();
  await page.waitForTimeout(400);
  const notes = await page.evaluate(() => document.getElementById('presenterNotesText').innerText);
  const notesShot = `${viewport.label}-6-notes.png`;
  await page.screenshot({ path: join(out, notesShot) });
  const want = ['15-8 · 1:25', 'Still here'.toLowerCase(), 'T.D. Jakes and Prayer YouTube channel', 'You are still here. Now keep going. Thank you.'];
  rows.push({ route, state: 'speaker notes open on scene 15', viewport: page.viewportSize(), timestamp: now(), action: 'click Notes', expected: 'notes include the 15-8 script and credit', actual: { hits: want.map(w => notes.toLowerCase().includes(w.toLowerCase())), dashes: /[\u2013\u2014]/.test(notes) }, result: want.every(w => notes.toLowerCase().includes(w.toLowerCase())) && !/[\u2013\u2014]/.test(notes) ? 'PASS' : 'FAIL', screenshot: notesShot });
  rows.push({ route, state: 'page errors', viewport: page.viewportSize(), timestamp: now(), action: 'whole run', expected: 'no page errors', actual: errors, result: errors.length ? 'FAIL' : 'PASS', screenshot: null });
  await page.close();

  // Reduced motion: static flow.
  const rp = await browser.newPage({ viewport, reducedMotion: 'reduce' });
  const rerr = []; rp.on('pageerror', e => rerr.push(e.message));
  await rp.goto(new URL('#15', base).href, { waitUntil: 'networkidle' });
  await rp.evaluate(() => document.fonts.ready);
  await rp.evaluate(() => document.querySelector('.c15-still').scrollIntoView({ block: 'center', behavior: 'instant' }));
  await rp.waitForTimeout(600);
  const rs = await rp.evaluate(() => { const b = document.querySelector('.c15-still'); const lis = [...b.querySelectorAll('li')]; const r = b.getBoundingClientRect(); return { motion: document.documentElement.classList.contains('c15-motion'), visible: getComputedStyle(b).visibility === 'visible', lines: lis.filter(li => getComputedStyle(li).opacity === '1' && li.getBoundingClientRect().height > 0).length, stemOffset: getComputedStyle(b.querySelector('.st-stem')).strokeDashoffset, canopy: getComputedStyle(b.querySelector('.st-canopy circle')).transform, top: Math.round(r.top), bottom: Math.round(r.bottom), overflow: document.documentElement.scrollWidth - innerWidth }; });
  const rShot = `${viewport.label}-7-reduced-motion.png`;
  await rp.screenshot({ path: join(out, rShot) });
  rows.push({ route: rp.url(), state: 'reduced motion static flow', viewport: rp.viewportSize(), timestamp: now(), action: 'scroll 15-8 into view', expected: 'no c15-motion, four lines, tree fully drawn', actual: { ...rs, errors: rerr }, result: !rs.motion && rs.visible && rs.lines === 4 && /^0/.test(rs.stemOffset) && rs.canopy === 'none' && rs.overflow <= 1 && !rerr.length ? 'PASS' : 'FAIL', screenshot: rShot });
  await rp.close();
}
await browser.close();
const files = ['index.html', 'chapters/closing.js', 'chapters/closing.css', 'chapters/ch-1115.js', 'scroll-presentation.js'];
const hashes = Object.fromEntries(files.map(f => [f, createHash('sha256').update(readFileSync(f)).digest('hex')]));
writeFileSync(join(out, 'browser-log.json'), JSON.stringify({ checkedAt: now(), base, hashes, observations: rows }, null, 2));
console.log(JSON.stringify({ checks: rows.length, failed: rows.filter(r => r.result !== 'PASS').map(r => `${r.viewport?.width} ${r.state}`), out }));
if (rows.some(r => r.result !== 'PASS')) process.exitCode = 1;
