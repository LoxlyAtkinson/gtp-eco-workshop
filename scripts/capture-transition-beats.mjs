import { chromium } from 'playwright-core';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const out = join(process.cwd(), 'experience', 'evidence', process.env.GTP_EVIDENCE_DIR || 'scroll-transition-beats');
const base = process.env.GTP_BASE_URL || 'http://127.0.0.1:8767/';
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const log = [];

for (const sceneId of ['06', '13', '14']) {
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 }, reducedMotion: 'no-preference' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(new URL(`#${sceneId}`, base).href, { waitUntil: 'networkidle' });
  await page.locator(`.scene[data-scene="${sceneId}"]`).waitFor();
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; return document.fonts.ready; });
  for (const progress of [.22, .36, .5, .56, .64, .72, .8]) {
    await page.evaluate(({ sceneId, progress }) => {
      const scene = document.querySelector(`.scene[data-scene="${sceneId}"]`);
      const travel = Math.max(0, scene.offsetHeight - innerHeight);
      scrollTo({ top: scene.getBoundingClientRect().top + scrollY + progress * travel, behavior: 'auto' });
    }, { sceneId, progress });
    await page.waitForTimeout(100);
    const state = await page.evaluate(sceneId => {
      const scene = document.querySelector(`.scene[data-scene="${sceneId}"]`);
      const selectors = sceneId === '06' ? ['.voice-comparison', '.voice-week'] : sceneId === '13' ? ['.taste-grid', '.taste-demo', '.taste-proof'] : ['.report-preview__parts', '.report-preview__finding', '.report-preview__plan'];
      return {
        route: location.hash,
        observedProgress: Number(scene.style.getPropertyValue('--p')),
        viewport: { width: innerWidth, height: innerHeight },
        overflow: document.documentElement.scrollWidth - innerWidth,
        layers: selectors.map(selector => ({ selector, opacity: getComputedStyle(scene.querySelector(selector)).opacity })),
      };
    }, sceneId);
    const file = `projector-${sceneId}-${String(Math.round(progress * 100)).padStart(2, '0')}.png`;
    await page.screenshot({ path: join(out, file) });
    log.push({ sceneId, progress, file, ...state, errors: [...errors] });
  }
  await page.close();
}
await browser.close();
writeFileSync(join(out, 'browser-log.json'), JSON.stringify(log, null, 2));
console.log(JSON.stringify({ captures: log.length, errors: log.filter(row => row.errors.length).length, overflow: log.filter(row => row.overflow > 1).length, out }));
