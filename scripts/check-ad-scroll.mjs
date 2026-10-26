import { chromium } from 'playwright-core';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const out = join(process.cwd(), 'experience', 'evidence', process.env.GTP_EVIDENCE_DIR || 'scroll-ad-journey');
const base = process.env.GTP_BASE_URL || 'http://127.0.0.1:8767/';
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const rows = [];

async function open(viewport, reducedMotion = 'no-preference') {
  const page = await browser.newPage({ viewport, reducedMotion });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(new URL('#05', base).href, { waitUntil: 'networkidle' });
  await page.locator('.scene-handoff--after-14').waitFor({ state: 'attached' });
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; return document.fonts.ready; });
  return { page, errors };
}

async function observe(page, errors, label, progress, expected) {
  await page.evaluate(progress => {
    const scene = document.querySelector('.scene[data-scene="05"]');
    scrollTo({ top: scene.getBoundingClientRect().top + scrollY + progress * Math.max(0, scene.offsetHeight - innerHeight), behavior: 'auto' });
  }, progress);
  await page.waitForTimeout(160);
  const state = await page.evaluate(() => {
    const stage = document.querySelector('.ad-stage');
    return {
      route: location.hash,
      viewport: { width: innerWidth, height: innerHeight },
      state: stage.dataset.adState,
      alphas: ['--ad-feed','--ad-vertical','--ad-search'].map(name => stage.style.getPropertyValue(name)),
      panelOpacity: [...document.querySelectorAll('[data-ad-panel]')].map(panel => [panel.dataset.adPanel, getComputedStyle(panel).opacity]),
      visiblePanel: [...document.querySelectorAll('[data-ad-panel]')].filter(panel => !panel.hidden && Number(getComputedStyle(panel).opacity) > .95).map(panel => panel.dataset.adPanel),
      pressed: [...document.querySelectorAll('[data-ad]')].filter(button => button.getAttribute('aria-pressed') === 'true').map(button => button.dataset.ad),
      overflow: document.documentElement.scrollWidth - innerWidth,
    };
  });
  const file = `${label}.png`;
  await page.screenshot({ path: join(out, file) });
  const pass = state.state === expected && state.visiblePanel.length === 1 && state.visiblePanel[0] === expected && state.pressed.length === 1 && state.pressed[0] === expected && state.overflow <= 1 && errors.length === 0;
  rows.push({ label, progress, expected, ...state, errors: [...errors], file, result: pass ? 'PASS' : 'FAIL' });
}

const projector = await open({ width: 1366, height: 768 });
await observe(projector.page, projector.errors, 'projector-feed', 0, 'feed');
await observe(projector.page, projector.errors, 'projector-vertical', .5, 'vertical');
await observe(projector.page, projector.errors, 'projector-search', .9, 'search');
await observe(projector.page, projector.errors, 'projector-reverse', .1, 'feed');
await projector.page.locator('[data-ad="search"]').click();
await observe(projector.page, projector.errors, 'projector-manual-override', .5, 'search');
await projector.page.close();

const phone = await open({ width: 390, height: 844 });
await observe(phone.page, phone.errors, 'phone-manual-choice', .5, 'feed');
await phone.page.close();

const reduced = await open({ width: 1366, height: 768 }, 'reduce');
await observe(reduced.page, reduced.errors, 'reduced-motion-choice', .5, 'feed');
await reduced.page.close();

await browser.close();
writeFileSync(join(out, 'browser-log.json'), JSON.stringify(rows, null, 2));
console.log(JSON.stringify({ observations: rows.length, failed: rows.filter(row => row.result === 'FAIL'), out }));
