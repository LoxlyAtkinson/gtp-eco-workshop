import { chromium } from 'playwright-core';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

const base = process.env.GTP_BASE_URL || 'http://127.0.0.1:8767/';
const output = join(process.cwd(), 'experience', 'evidence', process.env.GTP_EVIDENCE_DIR || 'motion-examples-local');
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const rows = [];
for (const viewport of [{ name: 'projector', width: 1366, height: 768 }, { name: 'phone', width: 390, height: 844 }]) {
  const page = await browser.newPage({ viewport, reducedMotion: 'no-preference' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(new URL('motion-examples/', base).href, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  for (const name of ['evidence', 'ad', 'reply']) {
    const section = page.locator(`[data-study="${name}"]`);
    await section.scrollIntoViewIfNeeded();
    for (const [beat, progress] of [['start', 0], ['middle', .5], ['end', 1]]) {
      await page.evaluate(({ name, progress }) => window.GTPMotionStudies.seek(name, progress), { name, progress });
      const file = `${viewport.name}-${name}-${beat}.png`;
      await section.locator('.stage').screenshot({ path: join(output, file) });
      const measure = await page.evaluate(() => ({ horizontalOverflow: document.documentElement.scrollWidth > innerWidth + 1, viewport: { width: innerWidth, height: innerHeight } }));
      rows.push({ route: `motion-examples/#study-${['evidence', 'ad', 'reply'].indexOf(name) + 1}`, state: `${name}-${beat}`, viewport: measure.viewport, file, errors: [...errors], horizontalOverflow: measure.horizontalOverflow, result: errors.length || measure.horizontalOverflow ? 'FAIL' : 'PASS' });
    }
    await page.evaluate(name => window.GTPMotionStudies.seek(name, 0), name);
    await section.locator('.play').click();
    await page.waitForTimeout(180);
    const play = await section.locator('.motion-status').innerText();
    await section.locator('.pause').click();
    const pause = await section.locator('.motion-status').innerText();
    rows.push({ route: `motion-examples/#study-${['evidence', 'ad', 'reply'].indexOf(name) + 1}`, state: `${name}-controls`, viewport: page.viewportSize(), play, pause, result: play === 'Playing' && pause === 'Paused' ? 'PASS' : 'FAIL' });
  }
  await page.close();
  const reduced = await browser.newPage({ viewport, reducedMotion: 'reduce' });
  await reduced.goto(new URL('motion-examples/#study-2', base).href, { waitUntil: 'networkidle' });
  const reducedStatus = await reduced.locator('[data-study="ad"] .motion-status').innerText();
  rows.push({ route: 'motion-examples/#study-2', state: 'reduced-motion', viewport: reduced.viewportSize(), actual: reducedStatus, result: reducedStatus.includes('Reduced motion') ? 'PASS' : 'FAIL' });
  await reduced.close();
}
await browser.close();
const files = ['motion-examples/index.html', 'motion-examples/motion.css', 'motion-examples/motion.js', 'motion-examples/vendor/gsap.min.js', 'motion-examples/vendor/ScrollTrigger.min.js'];
const hashes = Object.fromEntries(files.map(file => [file, createHash('sha256').update(readFileSync(file)).digest('hex')]));
writeFileSync(join(output, 'browser-log.json'), JSON.stringify({ checkedAt: new Date().toISOString(), base, hashes, observations: rows }, null, 2));
console.log(JSON.stringify({ observations: rows.length, pass: rows.filter(row => row.result === 'PASS').length, fail: rows.filter(row => row.result !== 'PASS').length, output }));
