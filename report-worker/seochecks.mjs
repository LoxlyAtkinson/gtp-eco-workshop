// SEO basics and AI-readiness checks for the report. The five scored signals and their weights
// match the Smart AI Solutions website report (geo-signals runQuickChecks: robots AI crawlers 25,
// schema 25, llms.txt 20, sitemap 15, security headers 15), plus page basics from the homepage.
import { assertPublicHost } from '../live-runner/lib/stage.mjs';

const AI_BOTS = ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', 'CCBot'];

async function get(url, timeout = 12_000) {
  try {
    const res = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(timeout), headers: { 'user-agent': 'Mozilla/5.0 (GTP ECO report; +https://smartaisolutions.co.za)' } });
    return { status: res.status, headers: res.headers, text: res.ok ? (await res.text()).slice(0, 400_000) : '' };
  } catch { return { status: 0, headers: new Headers(), text: '' }; }
}

// Is `bot` blocked from "/" by robots.txt? Only the groups that name it, else the * group.
function blocked(robots, bot) {
  const groups = []; let cur = null;
  for (const raw of robots.split(/\r?\n/)) {
    const line = raw.replace(/#.*/, '').trim(); if (!line) continue;
    const [k, ...rest] = line.split(':'); const key = k.trim().toLowerCase(), val = rest.join(':').trim();
    if (key === 'user-agent') { if (!cur || cur.rules.length) { cur = { agents: [], rules: [] }; groups.push(cur); } cur.agents.push(val.toLowerCase()); }
    else if (cur && (key === 'disallow' || key === 'allow')) cur.rules.push([key, val]);
  }
  const own = groups.filter(g => g.agents.includes(bot.toLowerCase()));
  const use = own.length ? own : groups.filter(g => g.agents.includes('*'));
  return use.some(g => g.rules.some(([k, v]) => k === 'disallow' && v === '/') && !g.rules.some(([k, v]) => k === 'allow' && v === '/'));
}

export async function seoChecks(website) {
  const origin = new URL(website).origin;
  await assertPublicHost(new URL(website).hostname);
  const [home, robots, llms, sitemap] = await Promise.all([get(website), get(`${origin}/robots.txt`), get(`${origin}/llms.txt`), get(`${origin}/sitemap.xml`)]);
  const html = home.text;
  const pick = re => (html.match(re) || [])[1]?.replace(/\s+/g, ' ').trim() || '';
  const title = pick(/<title[^>]*>([^<]*)<\/title>/i);
  const description = pick(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) || pick(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i);
  const h1s = (html.match(/<h1[\s>]/gi) || []).length;
  const imgs = html.match(/<img\b[^>]*>/gi) || [];
  const noAlt = imgs.filter(t => !/\balt=["'][^"']+["']/i.test(t)).length;
  const schemaTypes = [...html.matchAll(/"@type"\s*:\s*"([^"]+)"/g)].map(m => m[1]).filter((v, i, a) => a.indexOf(v) === i).slice(0, 8);
  const hasSitemap = sitemap.status === 200 && /<urlset|<sitemapindex/i.test(sitemap.text) || /^sitemap:/im.test(robots.text);
  const blockedBots = robots.text ? AI_BOTS.filter(b => blocked(robots.text, b)) : [];
  const h = home.headers;
  const secHeaders = { hsts: !!h.get('strict-transport-security'), nosniff: /nosniff/i.test(h.get('x-content-type-options') || ''), frame: !!(h.get('x-frame-options') || /frame-ancestors/i.test(h.get('content-security-policy') || '')), referrer: !!h.get('referrer-policy') };
  const secCount = Object.values(secHeaders).filter(Boolean).length;
  const signals = [
    { signal: 'AI search tools may read the site (robots.txt)', points: robots.status === 200 ? Math.round(25 * (AI_BOTS.length - blockedBots.length) / AI_BOTS.length) : 25, max: 25, detail: robots.status === 200 ? (blockedBots.length ? `Blocks: ${blockedBots.join(', ')}` : 'No AI crawler is blocked') : 'No robots.txt found, so nothing is blocked' },
    { signal: 'Business details in Google-readable form (schema)', points: schemaTypes.length ? 25 : 0, max: 25, detail: schemaTypes.length ? `Found: ${schemaTypes.join(', ')}` : 'No schema (JSON-LD) found on the homepage' },
    { signal: 'A summary file for AI tools (llms.txt)', points: llms.status === 200 && llms.text.trim().length > 20 ? 20 : 0, max: 20, detail: llms.status === 200 ? 'llms.txt is present' : 'No llms.txt' },
    { signal: 'A site map for Google (sitemap.xml)', points: hasSitemap ? 15 : 0, max: 15, detail: hasSitemap ? 'Sitemap found' : 'No sitemap found' },
    { signal: 'Security headers', points: Math.round(15 * secCount / 4), max: 15, detail: `${secCount} of 4 present (HSTS, nosniff, frame protection, referrer policy)` },
  ];
  const basics = [
    { check: 'Secure connection (https)', pass: website.startsWith('https://') && home.status === 200 },
    { check: 'Page title', pass: title.length >= 15 && title.length <= 65, detail: title ? `${title.length} characters: "${title.slice(0, 90)}"` : 'Missing' },
    { check: 'Search description', pass: description.length >= 70 && description.length <= 165, detail: description ? `${description.length} characters` : 'Missing' },
    { check: 'One main heading (H1)', pass: h1s === 1, detail: `${h1s} found` },
    { check: 'Works on phones (viewport tag)', pass: /<meta[^>]+name=["']viewport["']/i.test(html) },
    { check: 'Canonical link', pass: /<link[^>]+rel=["']canonical["']/i.test(html) },
    { check: 'Images described for Google (alt text)', pass: imgs.length === 0 || noAlt / imgs.length < 0.2, detail: `${imgs.length - noAlt} of ${imgs.length} images have alt text` },
    { check: 'Social sharing preview (Open Graph)', pass: /<meta[^>]+property=["']og:image["']/i.test(html) },
  ];
  return { readable: home.status === 200, score: signals.reduce((n, s) => n + s.points, 0), signals, basics };
}
