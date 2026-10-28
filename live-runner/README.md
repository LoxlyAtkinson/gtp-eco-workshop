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
- Spend ceiling: every run is logged to `experience/evidence/g02-runs/spend.log`. Past 60 `claude -p` runs or 60 Firecrawl credits in 12 h (amendment A2.9, PROVISIONAL), the runner answers `HELD_SPEND`. Override with `LIVE_RUNNER_MAX_CLAUDE_RUNS` or `LIVE_RUNNER_MAX_FIRECRAWL_CREDITS` only with the owner's yes.

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

Next step for the deck: wire `client.js` into the Engage live slots in G02-T07, and add `live-runner/client.js` to the Pages file list then.
