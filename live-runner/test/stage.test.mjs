// Unit tests for lib/stage.mjs. Run: node --test live-runner/test/
// TEST FIXTURES ONLY: the Supabase rows and the Firecrawl document below are made up for
// these tests; fetch is stubbed, so no network call and no real project is touched.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

process.env.LIVE_RUNNER_STAGE_DIR = mkdtempSync(join(tmpdir(), 'gtp-stage-test-'));
process.env.LIVE_RUNNER_SPEND_LOG = join(process.env.LIVE_RUNNER_STAGE_DIR, 'spend.log');
const stage = await import('../lib/stage.mjs');

test('normalizeWebsite accepts https public domains and rejects the rest', () => {
  assert.deepEqual(stage.normalizeWebsite('oryzo.ai'), { website: 'https://oryzo.ai/', host: 'oryzo.ai' });
  assert.equal(stage.normalizeWebsite('https://www.Example.co.za/a#b').website, 'https://www.example.co.za/a');
  assert.equal(stage.normalizeWebsite('https://www.example.co.za/').host, 'example.co.za');
  for (const bad of ['', 'http://oryzo.ai', 'https://127.0.0.1/', 'https://[::1]/', 'https://localhost/', 'https://printer.local/',
    'https://user:pw@oryzo.ai/', 'https://oryzo.ai:8443/', 'javascript:alert(1)', `https://${'a'.repeat(200)}.com/`, 'https://oryzo.ai/<x>']) {
    assert.ok(stage.normalizeWebsite(bad).error, `should reject ${bad}`);
  }
});

test('validateStageRequest needs consent and an https target', () => {
  assert.equal(stage.validateStageRequest('stage-scan', { target: 'https://oryzo.ai/' }).code, 'CONSENT_REQUIRED');
  assert.equal(stage.validateStageRequest('stage-scan', { consent: true, target: 'http://oryzo.ai/' }).code, 'BAD_WEBSITE');
  const ok = stage.validateStageRequest('stage-ad-video', { consent: true, target: 'oryzo.ai', context: { brief: 'b', idea: { title: 't', hook: 'h' } } });
  assert.equal(ok.request.target, 'https://oryzo.ai/');
  assert.equal(ok.request.idea.title, 't');
  assert.ok(stage.validateStageRequest('stage-ideas', { consent: true, target: 'https://oryzo.ai/', context: [1] }).error);
  assert.equal(stage.validateStageRequest('stage-nope', { consent: true }).error, 'unknown kind');
});

test('extractJson reads fenced JSON and repairs a stray closing bracket', () => {
  assert.deepEqual(stage.extractJson('x ```json\n{"a":1}\n``` y'), { a: 1 });
  // Seen live on 2026-10-28 in a stage-ad-video quote answer.
  assert.deepEqual(stage.extractJson('```json\n{"g":{"m":"s","d":5}],"p":"x"}\n```'), { g: { m: 's', d: 5 }, p: 'x' });
  assert.equal(stage.extractJson('no json here'), null);
});

test('local list: add, de-duplicate by domain, clear', async () => {
  const a = await stage.addSubmission({ website: 'https://oryzo.ai/', name: 'Ama' });
  assert.equal(a.duplicate, false);
  const b = await stage.addSubmission({ website: 'www.oryzo.ai' });
  assert.equal(b.duplicate, true);
  await assert.rejects(stage.addSubmission({ website: 'https://oryzo.ai/', name: '<script>' }), /not allowed/);
  const list = await stage.listSubmissions();
  assert.equal(list.source, 'local');
  assert.equal(list.count, 1);
  assert.equal(list.joinUrl, 'https://loxlyatkinson.github.io/gtp-eco-workshop/?join=1');
  const c = stage.clearSubmissions();
  assert.equal(c.cleared, 1);
  assert.equal((await stage.listSubmissions()).count, 0);
});

test('Supabase adapter: service-role read, validation, de-duplication, clearedAt filter', async () => {
  process.env.SUPABASE_URL = 'https://fixture-project.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'fixture-service-role-value-123456';
  const realFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url: String(url), headers: init.headers });
    return new Response(JSON.stringify([
      { id: 'r1', website: 'https://shop.example.co.za/', name: 'Thandi', created_at: '2026-10-28T08:00:00+00:00' },
      { id: 'r2', website: 'https://www.shop.example.co.za/', name: 'dup', created_at: '2026-10-28T08:01:00+00:00' },
      { id: 'r3', website: 'https://10.0.0.1/', name: null, created_at: '2026-10-28T08:02:00+00:00' },
      { id: 'r4', website: 'https://bakery.example.com/', name: 'Bad <b>', created_at: '2026-10-28T08:03:00+00:00' },
    ]), { status: 200, headers: { 'content-type': 'application/json' } });
  };
  try {
    const list = await stage.listSubmissions();
    assert.equal(list.source, 'supabase');
    assert.deepEqual(list.items.map((i) => i.website), ['https://shop.example.co.za/', 'https://bakery.example.com/']);
    assert.equal(list.items[0].name, 'Thandi');
    assert.equal(list.items[1].name, null, 'unsafe names are dropped');
    assert.equal(list.skipped, 2);
    assert.equal(calls[0].headers.apikey, process.env.SUPABASE_SERVICE_ROLE_KEY);
    assert.equal(calls[0].headers.authorization, `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`);
    assert.match(calls[0].url, /^https:\/\/fixture-project\.supabase\.co\/rest\/v1\/stage_submissions\?select=id%2Cwebsite%2Cname%2Ccreated_at&order=created_at\.asc/);
    assert.match(calls[0].url, /created_at=gt\./, 'rows before the last clear are hidden');

    globalThis.fetch = async () => new Response('{"message":"bad key fixture-service-role-value-123456"}', { status: 401 });
    const down = await stage.listSubmissions();
    assert.equal(down.source, 'local');
    assert.match(down.warning, /Supabase read failed \(Supabase HTTP 401\)/);
    assert.ok(!JSON.stringify(down).includes(process.env.SUPABASE_SERVICE_ROLE_KEY), 'no key in the answer');
  } finally {
    globalThis.fetch = realFetch;
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  }
});

test('mapScan maps Firecrawl branding into the stage contract and keeps only quotes found on the page', () => {
  const doc = {
    markdown: '# Fixture Coffee\nRoasted in Durban since 2009.\nFree delivery over R500.',
    summary: 'A Durban coffee roaster.',
    screenshot: 'https://storage.example.com/shot.png',
    metadata: { title: 'Fixture Coffee', description: 'Coffee from Durban' },
    json: { name: 'Fixture Coffee', what: 'Coffee roaster', who: 'Home brewers', proof: ['Roasted in Durban since 2009.', 'Invented claim not on the page'] },
    branding: {
      colorScheme: 'light',
      colors: { primary: '#112233', background: '#FFFFFF', bogus: 'not-a-colour' },
      fonts: [{ family: 'Inter' }, { family: 'Lora' }],
      typography: { fontFamilies: { primary: 'Inter' }, fontSizes: { h1: '48px' } },
      spacing: { baseUnit: 8, borderRadius: '12px' },
      components: { buttonPrimary: { background: '#112233', borderRadius: '999px', boxShadow: '0 1px 2px #0003' } },
      images: { logo: 'https://example.com/logo.svg', favicon: 'javascript:alert(1)' },
    },
  };
  const d = stage.mapScan(doc, 'https://fixture.example.com/');
  assert.deepEqual(d.colors, [{ hex: '#112233', role: 'primary' }, { hex: '#FFFFFF', role: 'background' }]);
  assert.deepEqual(d.fonts, [{ family: 'Inter', role: 'primary' }, { family: 'Lora', role: 'used' }]);
  assert.deepEqual(d.radii.sort(), ['12px', '999px']);
  assert.deepEqual(d.shadows, ['0 1px 2px #0003']);
  assert.deepEqual(d.assets, [{ url: 'https://example.com/logo.svg', kind: 'logo' }]);
  assert.equal(d.logo, 'https://example.com/logo.svg', 'images.logo is the fallback when branding.logo is missing');
  assert.deepEqual(d.product.proof, ['Roasted in Durban since 2009.']);
  assert.equal(d.product.proofDropped, 1);
  assert.match(stage.scanBrief(d, 'fixture.example.com'), /Corner radius/);
});
