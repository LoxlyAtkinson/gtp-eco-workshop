import { chromium } from 'playwright-core';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const out = join(root, 'experience', 'evidence', process.env.GTP_EVIDENCE_DIR || 'scroll-motion');
const base = process.env.GTP_BASE_URL || 'http://127.0.0.1:8767/';
mkdirSync(out, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  args: ['--disable-features=OverscrollHistoryNavigation'],
});
const observations = [];

for (const viewport of [
  { width: 1366, height: 768, label: 'projector' },
  { width: 390, height: 844, label: 'phone' },
]) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
    reducedMotion: 'no-preference',
    recordVideo: { dir: out, size: { width: viewport.width, height: viewport.height } },
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(new URL('#01', base).href, { waitUntil: 'networkidle' });
  await page.locator('.scene-handoff--after-14').waitFor({ state: 'attached', timeout: 10000 });
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    return document.fonts.ready;
  });
  const maxScroll = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  const steps = 720;
  const started = Date.now();
  for (let step = 0; step <= steps; step++) {
    await page.evaluate(y => scrollTo({ top: y, behavior: 'auto' }), maxScroll * step / steps);
    await page.waitForTimeout(44);
  }
  // Mobile scene height can grow after a beat is activated; settle at the real end.
  for (let settle = 0; settle < 4; settle++) {
    await page.evaluate(() => scrollTo({ top: document.documentElement.scrollHeight, behavior: 'auto' }));
    await page.waitForTimeout(100);
  }
  await page.waitForTimeout(500);
  const finalState = await page.evaluate(() => ({
    hash: location.hash,
    scrollY,
    horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  }));
  const video = page.video();
  await page.close();
  const file = join(out, `${viewport.label}-journey.webm`);
  await video.saveAs(file);
  observations.push({ viewport, maxScroll, steps, elapsedMs: Date.now() - started, finalState, errors, file });
  await context.close();
}

await browser.close();
writeFileSync(join(out, 'motion-log.json'), JSON.stringify(observations, null, 2));
console.log(JSON.stringify(observations));
