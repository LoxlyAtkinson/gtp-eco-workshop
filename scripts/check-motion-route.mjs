import { chromium } from 'playwright-core';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

const out = join(process.cwd(), 'experience', 'evidence', process.env.GTP_EVIDENCE_DIR || 'motion-route-final');
mkdirSync(out, { recursive: true });
const base = process.env.GTP_BASE_URL || 'http://127.0.0.1:8767/';
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const rows = [];
for (const viewport of [{ label: 'projector', width: 1366, height: 768 }, { label: 'phone', width: 390, height: 844 }]) {
  for (const mode of ['paused', 'reduced', 'static']) {
    const page = await browser.newPage({ viewport, reducedMotion: mode === 'reduced' ? 'reduce' : 'no-preference' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    if (mode === 'static') await page.route('**/motion-examples/vendor/*.js', route => route.abort());
    await page.goto(new URL('motion-examples/#study-2', base).href, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const section = page.locator('[data-study="ad"]');
    await section.scrollIntoViewIfNeeded();
    let keyboardStatus = null;
    if (mode === 'paused') {
      await section.locator('.play').focus();
      await page.keyboard.press('Enter');
      await page.waitForTimeout(220);
      await section.locator('.pause').focus();
      await page.keyboard.press('Enter');
      keyboardStatus = await section.locator('.motion-status').innerText();
      await page.evaluate(() => window.GTPMotionStudies.seek('ad', .56));
    }
    await page.evaluate(() => { const section = document.querySelector('[data-study="ad"]'); scrollTo({ top: section.getBoundingClientRect().top + scrollY - 115, behavior: 'instant' }); });
    await page.waitForTimeout(150);
    const status = await section.locator('.motion-status').innerText();
    const focused = await page.evaluate(() => ({ tag: document.activeElement?.tagName, label: document.activeElement?.getAttribute('aria-label') }));
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    const file = `${viewport.label}-${mode}.png`;
    await page.screenshot({ path: join(out, file) });
    await section.screenshot({ path: join(out, `${viewport.label}-${mode}-section.png`) });
    await page.screenshot({ path: join(out, `${viewport.label}-${mode}-full.png`), fullPage: true });
    const expected = mode === 'paused' ? 'Held for inspection' : mode === 'reduced' ? 'Reduced motion · final frame' : 'Static example available';
    rows.push({ route: page.url(), state: mode, viewport: page.viewportSize(), status, keyboardStatus, expected, focused, overflow, errors, file, result: status === expected && (mode !== 'paused' || keyboardStatus === 'Paused') && overflow <= 1 && errors.length === 0 ? 'PASS' : 'FAIL' });
    await page.close();
  }
}
await browser.close();
const files = ['motion-examples/index.html', 'motion-examples/motion.css', 'motion-examples/motion.js', 'motion-examples/vendor/gsap.min.js', 'motion-examples/vendor/ScrollTrigger.min.js', 'assets/amina-lunch-3d.webp'];
const hashes = Object.fromEntries(files.map(file => [file, createHash('sha256').update(readFileSync(file)).digest('hex')]));
writeFileSync(join(out, 'browser-log.json'), JSON.stringify({ checkedAt: new Date().toISOString(), hashes, observations: rows }, null, 2));
console.log(JSON.stringify({ checks: rows.length, failed: rows.filter(row => row.result !== 'PASS').map(row => `${row.file}: ${row.status}`), out }));
if (rows.some(row => row.result !== 'PASS')) process.exitCode = 1;
