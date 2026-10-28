# GTP live runner

Start it before the talk (about 5 seconds). From the project root:

```bash
netstat -ano | grep ":8790 .*LISTEN"     # empty output means the port is free (RULE 10)
node live-runner/server.mjs              # prints: GTP live runner on http://127.0.0.1:8790
```

If 8790 is taken, pick another free port and set `LIVE_RUNNER_PORT=<port>`. The deck must then use the same URL in `createLiveRun({ runnerUrl })`.

## 1. What it does
- A dependency-free Node 22 server, bound to `127.0.0.1` only. It runs the named marketing skills for real on the presenter laptop, so no key ever reaches the public deck.
- `POST /run/<kind>` takes JSON `{ consent: true, business, url, category, area }` and streams Server-Sent Events: `started`, `progress`, then `result` or `error`.
- `GET /health` lists every kind, whether it is ready or blocked on a key, and how many runs are left before the spend ceiling.

## 2. Kinds (strict allow-list, one named skill each)
| Kind | Runs | Needs |
|---|---|---|
| `competitor-scan` | competitor-analysis | - |
| `content` | social | - |
| `seo-plan` | seo-plan | - |
| `blog-calendar` | blog-calendar | - |
| `keywords` | competitor-keyword-decoder | - |
| `seo-audit` | Firecrawl scan, then seo-audit | `url` |
| `backlink-analyzer` | Firecrawl scan, then backlink-analyzer | `url` |
| `geo-citability` | Firecrawl scan, then geo-citability | `url` |
| `last30days` | last30days | DISABLED in code until the G02-T02K tool review (answers `BLOCKED_REVIEW` even with keys), then `SCRAPECREATORS_API_KEY` |
| `b2b-find` | Apify `compass/crawler-google-places` | `APIFY_API_TOKEN` (BLOCKED today; untested) |

## 3. The real command
- Each skill runs as `claude.exe -p --output-format stream-json --verbose --model sonnet --settings {hooks off, CLAUDE.md excluded} --strict-mcp-config --no-session-persistence --permission-mode dontAsk --tools Skill,WebSearch,WebFetch,TodoWrite --allowedTools Skill,WebSearch,WebFetch,TodoWrite --disallowedTools Bash,Read,Glob,Grep,Write,Edit,NotebookEdit,Agent,Task`.
- `--tools` limits what the model is offered. The `init` event of every recorded run lists only `Skill`, `WebFetch` and `WebSearch`; this CLI build has no `TodoWrite`.
- The prompt goes in on stdin and says: load this one skill, then follow it.
- When a `url` is given, the runner first scans it with the Firecrawl CLI (`node firecrawl-cli/dist/index.js scrape <url>`). It passes the page in as data and reuses the scan for 30 minutes.
- Nothing runs through a shell. Every process is spawned with an args array.

## 4. Safety
- CORS allows only `http://localhost:8765` and `http://127.0.0.1:8765`. Any other Origin gets 403, and any other Host header gets 421, which guards against DNS rebinding.
- No consent, no run: without `consent: true` the runner returns 400 `CONSENT_REQUIRED`. Requests with no website are tagged `category-provisional`.
- Input fields allow only letters, digits, spaces and `. , ' & ( ) - / +`. URLs must be plain http(s).
- Each kind has its own timeout (5-7 min). At most 3 runs at once. Closing the page kills the run's process tree.
- Every event passes a secret redactor: env values whose names contain KEY, TOKEN, SECRET or PASSWORD, plus known key patterns.
- Spend ceiling: every run is logged to `experience/evidence/g02-runs/spend.log`. Past 90 `claude -p` runs (raised from 60 on 2026-10-28 for the stage chapter) or 60 Firecrawl credits in 12 h (amendment A2.9, PROVISIONAL), the runner answers `HELD_SPEND`. Override with `LIVE_RUNNER_MAX_CLAUDE_RUNS` or `LIVE_RUNNER_MAX_FIRECRAWL_CREDITS` only with the owner's yes.

## 5. How the deck uses it (G02-T07)
```js
import { createLiveRun } from './live-runner/client.js';
const run = createLiveRun({
  kind: 'competitor-scan',
  request: { business, url, category, area },
  consent: volunteerConsented,            // false means no request is sent
  cachedUrl: './assets/cached-runs/competitor-scan.json',
  mount: document.querySelector('#scan-slot'),   // or onUpdate for a custom view
});
run.start();   // at the chapter opener (G02-Q2), or when the presenter clicks Run
run.reveal();  // when the scene is revealed; this starts the 20 s deadline
```

Fallback contract (owner decision G4b):
- An error, an unreachable runner or a lost runner shows the cached run with its "cached run" tag in under 1 s.
- If no complete result has rendered 20 s after `reveal()`, the cached run shows, even while progress is still streaming.
- A live result carries the "live" tag and a source line: business · time · skill.

## 6. Record a run for evidence or cached files
```bash
node live-runner/run-once.mjs <kind> '{"consent":true,"business":"Amberkloof","category":"...","area":"..."}' experience/evidence/g02-runs/cached
```
This writes `<kind>-<stamp>.stream.jsonl` (raw, redacted), `.events.jsonl`, `.timing.json` and `.result.md`.

Proof of this runner: `experience/evidence/g02-runner/proof-results.md`.

## 7. Stage chapter (audience websites, scan, ideas, ads)
Start: `npm run stage` (same as `node live-runner/server.mjs`, port 8790; check the port first). Code: `lib/stage.mjs`. Tests: `node --test live-runner/test/stage.test.mjs`.

Websites from the room:
- The public join page posts to Supabase table `stage_submissions` with the anon key (INSERT only, send `Prefer: return=minimal`). Migration: `supabase/migrations/202610280100_stage_submissions.sql`.
- The runner reads that table only when `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set in its env. The key never leaves this laptop.
- Until then (today) the list is local: `live-runner/.stage/submissions.jsonl` (git-ignored). The presenter adds websites called out by the room.

| Route | Does |
|---|---|
| `GET /stage/submissions` | `{items:[{id,website,name,at,origin}], count, source:'supabase'\|'local', joinUrl, skipped, clearedAt?, warning?}`. Only valid https public domains, one per domain, earliest first. Local adds are merged in when Supabase is on. |
| `POST /stage/submissions/add` `{website, name?}` | Local list only. Bare `oryzo.ai` becomes `https://oryzo.ai/`. Rejects http, IPs, ports, logins, private or unknown domains. Same domain again answers `duplicate:true`. |
| `POST /stage/submissions/clear` `{}` | Archives the local list (`submissions-cleared-<time>.jsonl`) and hides Supabase rows older than now. Nothing is deleted. |

Stage kinds on `POST /run/<kind>` with `{consent:true, target:'https://...', context?}`. `context` is text (a scan brief) or `{brief?, idea?:{title,hook,fact,format}}`. Same SSE events, consent, spend ledger and fallback as the other kinds. Raw claude streams and the Firecrawl response go to `live-runner/.stage/runs/` (or `LIVE_RUNNER_STAGE_RAW_DIR`).

| Kind | Runs | `result.data` | Needs |
|---|---|---|---|
| `stage-scan` | Firecrawl v2 scrape: markdown, summary, branding, screenshot, json (5 credits). No Claude. Reuses a scan younger than 30 min (0 credits). | `{colors, fonts, type, spacing, radii, shadows, components, assets, logo, screenshot, product:{name,what,who,proof}}`; `result.text` is the design brief. Proof quotes are checked word for word against the page. | `FIRECRAWL_API_KEY` |
| `stage-ideas` | claude -p + `ad-creative` (tools: Skill only) | `{ideas:[{title,hook,fact,format,factFound}]}` | a scan, else it reads the page with the Firecrawl CLI |
| `stage-competitors` | claude -p + `competitor-analysis` (Skill, WebSearch, WebFetch); Apify `google-search-scraper` (South Africa) first when `APIFY_API_TOKEN` is set | `{competitors:[{name,url,whatTheyDo,whatWorks}], gaps, source}` | - (Apify optional, untested) |
| `stage-keywords` | DataForSEO Labs `ranked_keywords` + `keywords_for_site`, location 2710, en. No Claude. | `{keywords:[{phrase,volume,difficulty,position}], advice}` | `DATAFORSEO_LOGIN`, `DATAFORSEO_PASSWORD` (else `BLOCKED_KEY`) |
| `stage-ad-plain` | claude -p, one-line prompt, NO skill, no tools (`--tools ""`, `--disable-slash-commands`). Label "Plain prompt, no skill". | `{headline, body, cta, format}` | - |
| `stage-ad-video` | Label "With a skill: Higgsfield video". Phase 1: claude -p with ONLY the Higgsfield MCP (`--mcp-config` + `--strict-mcp-config`, stored OAuth) + `higgsfield-generate`; calls `balance` and picks a model. The runner then prices it with `higgsfield generate cost` (no job). Phase 2 runs only if the balance covers it and the price is under `LIVE_RUNNER_HIGGSFIELD_MAX_CREDITS` (default 10). | `{status, videoUrl, jobId, creditsUsed, model, quote}` | Higgsfield credits (else `BLOCKED_HIGGSFIELD`; over the cap: `HELD_SPEND`) |

Errors carry `code` (`BLOCKED_KEY`, `BLOCKED_HIGGSFIELD`, `HELD_SPEND`, `BAD_WEBSITE`, `BAD_OUTPUT`, `RUN_FAILED`, `TIMEOUT`) and, for the video, `data.quote`.

Spend: the claude -p ceiling is 90 runs per 12 h (raised 2026-10-28). Each stage claude run is capped at `--max-budget-usd 1.5` (0.5 for the plain ad, 2 per video phase).

Next step for the deck: wire `client.js` into the Engage live slots in G02-T07, and add `live-runner/client.js` to the Pages file list then.
