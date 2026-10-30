// Runs the live stage chapter's steps for one website, in the order and with the context the
// deck uses (chapters/stage.js): scan -> ideas + competitors + keywords -> website check -> plan
// -> unslop the first idea -> plain ad. Same code path as the stage: live-runner/lib/stage.mjs.
// A failed step is recorded and the rest still run; the report says what is missing.
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const ROOT = process.env.REPORT_JOBS_DIR || join(tmpdir(), 'gtp-report-jobs');
// Stage scans and the spend ledger live with the jobs, never in the repo; the report machine has its own ceiling.
process.env.LIVE_RUNNER_STAGE_DIR ||= join(ROOT, 'stage-cache');
process.env.LIVE_RUNNER_SPEND_LOG ||= join(ROOT, 'spend.log');
process.env.LIVE_RUNNER_MAX_CLAUDE_RUNS ||= '400';
process.env.LIVE_RUNNER_MAX_FIRECRAWL_CREDITS ||= '400';
process.env.LIVE_RUNNER_DFS_LEAN ||= '1';
await import('../live-runner/lib/load-env.mjs');
const { validateStageRequest } = await import('../live-runner/lib/stage.mjs');
const { runKind } = await import('../live-runner/lib/run-kind.mjs');

const str = (v, n) => String(v ?? '').slice(0, n);
const arr = v => (Array.isArray(v) ? v : []);

function run(kindName, website, context, jobDir, log) {
  const v = validateStageRequest(kindName, { consent: true, target: website, ...(context ? { context } : {}) });
  if (v.error) return Promise.resolve({ error: v.error });
  let result = null, failure = null;
  const t0 = Date.now();
  const r = runKind({ kindName, kind: v.kind, request: v.request, cwd: join(jobDir, kindName), onEvent: (type, d) => { if (type === 'result') result = d; if (type === 'error') failure = d; } });
  return r.done.then(() => {
    log('stage.step', { step: kindName, ok: !!result, ms: Date.now() - t0, error: failure?.message });
    return result ? { data: result.data || {}, text: result.text || '' } : { error: failure?.message || 'no result' };
  });
}

// chapters/stage.js briefContext() and researchContext(), same fields and limits.
function briefContext(scan, max = 1800) {
  const pr = scan?.data?.product || {};
  return [
    pr.name || pr.what ? `Product or service: ${str(pr.name, 80)}${pr.what ? ` - ${str(pr.what, 240)}` : ''}` : '',
    pr.who ? `Customer: ${str(pr.who, 200)}` : '',
    arr(pr.proof).length ? `Facts quoted from the page: ${arr(pr.proof).slice(0, 4).map(x => str(x, 160)).join(' | ')}` : '',
    scan?.text ? `Design brief: ${str(scan.text, 900)}` : '',
  ].filter(Boolean).join('\n').slice(0, max);
}
const host = u => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return ''; } };
function researchContext(comp, kw, check) {
  const c = comp?.data || {}, k = kw?.data || {};
  return [
    arr(c.competitors).length ? `Competitors: ${arr(c.competitors).slice(0, 5).map(x => `${str(x?.name, 60)} (${host(x?.url)}): ${str(x?.whatWorks, 160)}`).join(' | ')}` : '',
    arr(c.gaps).length ? `Gaps no competitor fills: ${arr(c.gaps).slice(0, 5).map(g => str(g, 160)).join(' | ')}` : '',
    arr(k.keywords).length ? `Keywords (phrase, searches a month): ${arr(k.keywords).slice(0, 10).map(x => `${str(x?.phrase, 60)} (${str(x?.volume, 10) || '?'})`).join(', ')}` : '',
    arr(check?.data?.fixes).length ? `Website check (DataForSEO) found: ${arr(check.data.fixes).slice(0, 6).map(f => str(f, 200)).join(' | ')}` : '',
  ].filter(Boolean).join('\n').slice(0, 4200);
}

export async function runStages(website, jobDir, log = () => {}) {
  mkdirSync(jobDir, { recursive: true });
  const scan = await run('stage-scan', website, null, jobDir, log);
  const brief = briefContext(scan);
  const [ideas, comp, kw] = await Promise.all([
    run('stage-ideas', website, brief, jobDir, log),
    run('stage-competitors', website, briefContext(scan, 1200), jobDir, log),
    run('stage-keywords', website, null, jobDir, log),
  ]);
  const competitors = arr(comp?.data?.competitors).map(c => ({ name: c.name, url: c.url }));
  const check = await run('stage-sitecheck', website, { brief: '', competitors }, jobDir, log);
  const research = researchContext(comp, kw, check);
  const plan = await run('stage-plan', website, [brief.slice(0, 1500), research].filter(Boolean).join('\n').slice(0, 5800), jobDir, log);
  const idea = arr(ideas?.data?.ideas)[0];
  let unslop = { error: 'no idea to unslop' }, adPlain = { error: 'no idea for the ad' };
  if (idea) {
    const pick = { title: str(idea.title, 120), hook: str(idea.hook, 240), fact: str(idea.fact, 240), format: str(idea.format, 60), product: str(idea.product, 120) };
    unslop = await run('stage-unslop', website, { brief: '', idea: pick }, jobDir, log);
    const after = unslop?.data?.after;
    const chosen = { ...pick, title: str(after?.title || pick.title, 120), hook: str(after?.hook || pick.hook, 240) };
    adPlain = await run('stage-ad-plain', website, { brief: [briefContext(scan, 1600), research].filter(Boolean).join('\n').slice(0, 5500), idea: chosen }, jobDir, log);
  }
  return { scan, ideas, competitors: comp, keywords: kw, check, plan, unslop, adPlain };
}
