import { chromium } from 'playwright-core';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

const out = join(process.cwd(), 'experience', 'evidence', process.env.GTP_EVIDENCE_DIR || 'speaker-notes-final');
mkdirSync(out, { recursive: true });
const base = process.env.GTP_BASE_URL || 'http://127.0.0.1:8767/';
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const rows = [];
for (const viewport of [{ label: 'projector', width: 1366, height: 768 }, { label: 'phone', width: 390, height: 844 }]) {
  const page = await browser.newPage({ viewport, reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (let number = 1; number <= 15; number++) {
    const scene = String(number).padStart(2, '0');
    await page.goto(new URL(`#${scene}`, base).href, { waitUntil: 'networkidle' });
    await page.waitForFunction(scene => document.body.dataset.scene === scene, scene, { timeout: 4000 });
    if (await page.locator('#notesButton').getAttribute('aria-pressed') !== 'true') await page.locator('#notesButton').click();
    const observed = await page.evaluate(scene => {
      const card = document.querySelector('#presenterNotesPanel');
      const rect = card.getBoundingClientRect();
      return { active: document.body.dataset.scene, text: card.querySelector('#presenterNotesText').innerText.trim(), visible: !card.hidden && getComputedStyle(card).display !== 'none' && rect.width > 0 && rect.height > 0, overflow: document.documentElement.scrollWidth - innerWidth };
    }, scene);
    const file = `${viewport.label}-${scene}-notes.png`;
    await page.screenshot({ path: join(out, file) });
    rows.push({ route: page.url(), scene, viewport: page.viewportSize(), ...observed, errors: [...errors], file, result: observed.active === scene && observed.visible && observed.text.length > 45 && observed.overflow <= 1 && errors.length === 0 ? 'PASS' : 'FAIL' });
  }
  await page.close();
}
await browser.close();
const files = ['index.html', 'scroll-experience.css', 'scroll-presentation.js'];
const hashes = Object.fromEntries(files.map(file => [file, createHash('sha256').update(readFileSync(file)).digest('hex')]));
writeFileSync(join(out, 'browser-log.json'), JSON.stringify({ checkedAt: new Date().toISOString(), hashes, observations: rows }, null, 2));
console.log(JSON.stringify({ checks: rows.length, failed: rows.filter(row => row.result !== 'PASS').map(row => row.file), out }));
if (rows.some(row => row.result !== 'PASS')) process.exitCode = 1;
