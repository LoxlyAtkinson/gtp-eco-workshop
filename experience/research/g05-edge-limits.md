Owner (2 minutes): tell us the plan of the `smmartaisolutions` Supabase project, Free or Pro. It sets the background wall clock at 150 s or 400 s, and the job model below is sized for the Free plan's 150 s until we know.

# G05-T03: Supabase Edge limits, bundling of the `api/` imports, and cron

All checks ran on 2026-10-27. Docs are cited by URL. The bundle proof is a local run: no Supabase account was used, nothing was deployed and no secret was set. Builder decisions are PROVISIONAL (A1.2).

## 1. Runtime limits (https://supabase.com/docs/guides/functions/limits, checked 2026-10-27; the page shows no last-updated date)

| Limit | Value (quoted) | What it means for Tool A |
|---|---|---|
| Memory | "Maximum Memory: 256MB" | Path B (Agent SDK, 1 GiB per agent) cannot run here (`g05-skill-paths.md`) |
| Wall clock | "Free plan: 150s"; "Paid plans: 400s" | Caps one invocation, including background work. The plan is unknown: **owner item** |
| CPU | "Maximum CPU Time: 2s (Amount of actual time spent on the CPU per request - does not include async I/O.)" | Waiting on Firecrawl, Apify or Claude costs no CPU. HTML parsing does, so it is measured in T07 |
| Idle timeout | "Request idle timeout: 150s"; after that "504 Gateway Timeout will be returned" | A synchronous 5-stage scan is not safe. The POST must return fast (§5) |
| Function size | "20MB (bundled locally via the CLI)"; "5MB (bundled server-side, e.g. via the Management API or Dashboard)" | The current bundle is 8.2 MB (§3). Deploy with the CLI's Docker bundler, not `--use-api` or the Dashboard |
| Nested calls | "Recursive/Nested Function Calling: 30 requests per trace, within a 60-second window" | Don't chain stages by self-invocation; let client polls drive them (§5) |
| Secrets | 100 per project; up to 48 KiB each; no `SUPABASE_` prefix | Fits the OG-KEYS list in goal-05 T05 |
| Other | Ports 25 and 587 blocked; "Web Worker API and Node vm API are unavailable"; "Static files can't be deployed via the API flag" | Email stays on the Resend HTTPS API (already the case). Use no static files, or deploy them with the Docker CLI |

## 2. Background work: `EdgeRuntime.waitUntil` (https://supabase.com/docs/guides/functions/background-tasks, checked 2026-10-27)

1. "You can use `EdgeRuntime.waitUntil(promise)` to explicitly mark background tasks." It can be called inside the request handler, so the response returns without waiting for the task.
2. Duration: there is no separate number. "The maximum duration is capped based on the wall-clock, CPU, and memory limits." Background work therefore shares the 150 s / 400 s wall clock and the 2 s CPU of §1.
3. Shutdown: "Use beforeunload event handler to be notified when function is about to shutdown". Use it to write the stage state as `interrupted` so the next poll can resume.
4. **Local caveat:** the CLI terminates instances after each request. To keep background tasks alive during local tests, set `[edge_runtime] policy = "per_worker"` in `supabase/config.toml`. The current `config.toml` has no `[edge_runtime]` section; it was not changed here and is a G05-T07 action.

## 3. Do the `../../../api/*.js` imports bundle on deploy? **Yes, with the CLI from the project root. Proven locally, with a negative control.**

`supabase/functions/eco-api/index.ts:2-3` imports `../../../api/analysis.js` and `../../../api/social.js`, and `api/social.js:1` imports `./analysis.js`.

### 3.1 How the CLI collects files (source of the installed CLI v2.95.4, read via `gh api` on 2026-10-27)

1. **Both deploy modes call the same import walker.**
   - Docker bundling, the default in v2.95.4, uses `utils.BindHostModules(...)`. It "Resolv[es] all Import Graph" and bind-mounts every file found read-only into the bundler container (`internal/utils/deno.go:212-257` @ v2.95.4).
   - `--use-api` uses `importMap.WalkImportPaths(meta.EntrypointPath, addFile)` and uploads every file found (`pkg/function/deploy.go:184` @ v2.95.4).
2. **Relative imports are followed with no "stay inside `supabase/functions`" check.** `if isRelPath(mod) && !substituted { mod = path.Join(path.Dir(curr), mod) }` (`pkg/function/deno.go:165-166` @ v2.95.4, unchanged on `main` as `apps/cli-go/pkg/function/deno.go:165-166`).
   - From `supabase/functions/eco-api/index.ts`, the path `../../../api/analysis.js` resolves to `api/analysis.js`, relative to the CLI's working directory.
   - Host paths are built as `filepath.Join(cwd, …)` (`internal/utils/deno.go:260-266`). So the deploy must run **from the project root**, or with `--workdir` pointing there.

### 3.2 Local bundle run (`experience/evidence/g05-edge-bundle/bundle-run.log`, 2026-10-27 20:43 UTC)

1. `deno info` shows 4 dependencies, including `api/analysis.js` and `api/social.js`.
2. **Positive run.** I ran the edge-runtime `bundle` command with the CLI's mount layout: the functions dir read-only, each walked module read-only, the output read-write, and the working dir set to the project root.
   - Result: exit 0, `output.eszip` = **8,220,071 bytes**, sha256 `424bb439…eff854`.
   - The eszip contains the specifiers `../../../api/analysis.js` and `../../../api/social.js` (2 hits each), plus `api/social.js` code (`apify~instagram-scraper`, `samplePublicSocial`).
3. **Negative control.** The same command without the `api/` mounts fails with `Module not found ".../api/analysis.js" at .../index.ts:2:68`, exit 1. This shows the mounts the walker adds are what make the bundle work.
4. **Limits of this proof.**
   - The image used was `edge-runtime:v1.77.4`, already local. CLI v2.95.4 pins `v1.73.13`, which was not pulled, to save a 1.1 GB download.
   - Module-graph resolution is standard Deno behaviour, but T17's real deploy log is the final proof.
   - The CLI itself was not run in deploy mode, because that contacts the Supabase API.
5. **Size risk (inference, not measured):** the 8.2 MB bundle is under the 20 MB CLI limit but over the 5 MB server-side limit. Do not deploy with `--use-api` or the Dashboard editor.
6. **Housekeeping:** `deno info` silently added a `workspace` block to the tracked `deno.lock`. It was restored with `git restore deno.lock`. Use `deno info --no-lock` next time.

**Decision (PROVISIONAL):** keep the shared modules in `api/`, since T07 does not need to move them. Deploy with `supabase functions deploy eco-api` (Docker bundling) from the project root. Any vendored skill text must be an **imported** module, such as `_vendor/skills.generated.js`, so the walker includes it (`g05-skill-paths.md` §1.5).

## 4. Cron options

1. **Supabase Cron** (https://supabase.com/docs/guides/cron, checked 2026-10-27):
   - "a Postgres Module that simplifies scheduling recurring Jobs with cron syntax", built on `pg_cron`.
   - Schedules range from "every second to once a year".
   - Advice: "no more than 8 Jobs" concurrently, and each should "run no more than 10 minutes".
   - Runs are recorded in `cron.job_run_details`; jobs live in `cron.job`.
2. **Scheduling an Edge Function** (https://supabase.com/docs/guides/functions/schedule-functions, checked 2026-10-27):
   - Uses `pg_cron` + `pg_net` (`net.http_post`), with the project URL and secret key stored in Vault (`vault.create_secret`).
   - Caution from the page: the decrypted key sits in `net.http_request_queue` until sent, so any login role can read it.
   - No minimum interval is stated, and no other scheduler is listed.
3. **Our retention purge does not need an Edge call.**
   - `supabase/retention-job.sql:4-8` schedules the pure-SQL `select public.gtp_eco_purge_expired();` at `'17 * * * *'`, which is hourly.
   - The migration comment at `202610230001_gtp_eco.sql:58` still says "daily". Fix it in T15, as goal-05 notes.
4. **Recommendation (PROVISIONAL):** keep the hourly SQL-only job. Add no Edge-invoking cron for scans: the job model in §5 needs none, which also avoids the Vault/`pg_net` key exposure.

## 5. Job model that fits these limits (PROVISIONAL; built in G05-T07)

1. `POST /v1/scans`: validate, rate-limit and insert a `scans` row with 5 stage rows (`company`, `social`, `competitors`, `ai-reach`, `aeo`), each `pending`. Start stage 1 in `EdgeRuntime.waitUntil(...)` and return `{scanId}` at once. This meets the 150 s idle timeout.
2. `GET /v1/scans/:id`: the client polls about every 2-3 s.
   - The endpoint returns each stage's status (`pending | running | done | partial | failed`) and partial findings.
   - If the next stage is `pending`, or `running` with an expired lease, the poll claims the lease in Postgres and starts that stage in `waitUntil`.
   - Stages are driven by polls, not by self-invocation, so the 30-requests-per-trace limit never applies.
3. **One stage per invocation.** Each stage has an internal `AbortSignal.timeout` below the wall clock: about 120 s on Free, about 360 s on Pro.
   - The competitor-analysis Messages call can return `stop_reason: "pause_turn"`. The stage stores the partial response and resumes it in the next invocation.
   - Long skill runs therefore span several invocations instead of breaking the wall clock.
4. `beforeunload` marks the running stage `interrupted`, and the next poll resumes it.
5. **Front-end impact (T16):** `tool/tool.js:13` aborts any request after 55 s. It must become a polling loop with a per-stage display, matching goal-05 §8's "5 named stages".

## 6. Open items for the morning brief

1. **Owner: the Supabase plan** (Free 150 s or Pro 400 s) and the project ref of `smmartaisolutions` (`participant-tool-plan.md:66` says it is not visible in the CLI login).
2. **T17:** the real deploy with the owner's CLI must show both `api/` files in the deploy log, as the final bundle proof.
3. **CLI update:** v2.122.0 (released 2026-10-23) is available; v2.95.4 is installed. The import walker is unchanged on `main`, but re-check the deploy flags after any update.
4. **Apify (item 3) and Firecrawl (item 4)** are now cited in §7 and §8 (BV-3 D-T03-1). **Venue NAT (item 5)** stays HELD (G05-Q4); see §9.

## 7. Apify actors: ids, prices and terms (G05-T03 item 3, checked 2026-10-27)

**How to read the prices.**
- A Store page shows "from $X / 1,000". That is the cheapest paid tier (GOLD in the actor's public API record).
- An account on Apify's Free plan pays the **FREE** tier. The Instagram README gives the tier ladder: Free $2.70, Starter $2.30, Scale $1.90, Business $1.50 per 1,000.
- All FREE and GOLD event prices below come from each actor's newest `pricingInfos` entry at `https://api.apify.com/v2/acts/<id>`.
- **Re-verified by the coordinator** with raw `curl` on 2026-10-27, for the 5 actors that have API prices.

| Need | Actor id | Source | Model and price (newest API entry, FREE tier; Store headline in brackets) | Terms and limits the page states |
|---|---|---|---|---|
| Instagram (used by `api/social.js`) | `apify~instagram-scraper` | https://apify.com/apify/instagram-scraper ; https://api.apify.com/v2/acts/apify~instagram-scraper | Pay per event, entry from 2026-02-20. Result $0.0027 = **$2.70 per 1,000** (Store "from $1.50 / 1,000 results" = GOLD). No actor-start event | "only collects data that is publicly available on Instagram". Public data "may be considered personal data under regulations like the GDPR"; "Only scrape data if you have a legitimate reason." No private profiles. No login needed |
| Facebook (used by `api/social.js`) | `apify~facebook-posts-scraper` | https://apify.com/apify/facebook-posts-scraper ; https://api.apify.com/v2/acts/apify~facebook-posts-scraper | Pay per event, entry from 2026-03-11. Post $0.005 = **$5.00 per 1,000**, plus actor-start $0.001 per run. Date filter +$0.002 per post (Store "from $2.00 / 1,000 posts") | Input schema: "you can only scrape public pages with this Actor, not personal profiles". The FAQ contradicts this (pages and profiles). "your results could contain personal data". "You should not scrape personal data unless you have a legitimate reason." |
| TikTok (used by `api/social.js`) | `clockworks~tiktok-scraper` | https://apify.com/clockworks/tiktok-scraper ; https://api.apify.com/v2/acts/clockworks~tiktok-scraper | Pay per event, entry from 2026-08-18. Result $0.0037 = **$3.70 per 1,000**, plus actor-start $0.001. Add-ons are priced per event (Store "from $1.70 / 1,000 results") | Extracts only "what the user has chosen to share publicly"; no email addresses, gender or location. Results "might contain personal data", which GDPR protects. Private and sensitive-flagged posts error out |
| Google Maps (B2B find, `kinds.mjs` `b2b-find`) | `compass~crawler-google-places` | https://apify.com/compass/crawler-google-places ; https://api.apify.com/v2/acts/compass~crawler-google-places | Pay per event, entry from 2026-06-30. Place $0.004 = **$4.00 per 1,000**, plus actor-start $0.00005. Place details +$0.002, contacts +$0.002, review +$0.0005 (Store "from $1.50 / 1,000 scraped places"; "not charged for the Apify platform usage") | Contact enrichment "returns personal data. You're responsible for having a legal basis". "factor in Google's Terms of Use". Some details are shown "mostly to logged-in users, so they are often missing" |
| Google Search results | `apify~google-search-scraper` | https://apify.com/apify/google-search-scraper ; https://api.apify.com/v2/acts/apify~google-search-scraper | Pay per event, entry from 2026-10-07. Search page (about 10 results) $0.0045 = **$4.50 per 1,000 pages**, plus actor-start $0.00005. AI Overview +$0.003, full website page +$0.008 (Store "from $1.80 / 1,000") | Lead enrichment "returns personal data"; legal basis is the user's. "Web scraping is legal if you are extracting publicly available data" (vendor statement) |
| Website content (T08 fallback) | `apify~website-content-crawler` | https://apify.com/apify/website-content-crawler ; https://apify.com/pricing | Pay per usage: "free to use, and you only pay for the Apify platform usage". README estimates: "$0.2 per 1,000 web pages with raw HTTP crawler" and "$0.5 - $5 per 1,000 web pages with a headless browser". Free-plan compute "$0.2 / CU". The API record has no `pricingInfos` | "Web scraping is generally legal if you scrape publicly available non-personal data". Content may be "protected by copyright". It can crawl "pages behind a login by providing cookies"; PROVISIONAL rule: Tool A never passes cookies |
| LinkedIn company pages | `harvestapi~linkedin-company` (most-used company-page actor: 29,974 users, 7,361 in 30 days, per the Store search API) | https://apify.com/harvestapi/linkedin-company ; https://api.apify.com/v2/store?search=linkedin%20company%20scraper&limit=30 | Pay per event. Company $0.004 = **$4.00 per 1,000** (FREE tier, Store search API; Store "from $2.50 / 1,000 companies"). Not re-verified by raw curl | "No cookies or account required." Not affiliated with LinkedIn. **LinkedIn User Agreement** (https://www.linkedin.com/legal/user-agreement, effective 3 Nov 2025) §8.2 says you agree not to "Develop, support or use software … to scrape or copy the Services, including profiles and other data" |

**Apify platform** (checked 2026-10-27):
- **Free plan** (https://apify.com/pricing): "$0" per month with "$5" of usage. Max 5 concurrent runs. When usage runs out, access is "blocked until the beginning of the next monthly cycle". Starter is $19 per month.
- **General Terms** (https://docs.apify.com/legal/general-terms-and-conditions, effective 9 July 2026):
  - §5.8: the customer is "solely responsible for the legality … and use of all Customer Data".
  - §7.1: Actor pricing "is specified by the Actor Developer".
  - §11.1: the customer is liable for data from "unauthorized sources".
- **Acceptable Use Policy** (https://docs.apify.com/legal/acceptable-use-policy, updated 20 Feb 2026): §2.1 item 10 bans activities that breach law or third-party rights.

**What this means for G05** (arithmetic from the rates above; PROVISIONAL):
- **Cost per social sample.** `api/social.js` samples 3 posts from one profile, so one sample costs cents:
  - Instagram: 3 × $0.0027 = $0.0081.
  - Facebook: 3 × $0.005 + $0.001 = $0.016.
  - TikTok: 3 × $0.0037 + $0.001 = $0.0121.
  - Each is far under the $1 per-run cap in `api/social.js`.
- **Free plan.** The $5 Free plan covers several hundred samples a month. The binding limit is 5 concurrent runs, not cost: a room of N participants needs a queue (see §5).
- **LinkedIn stays off (PROVISIONAL).** G05-T09 allows LinkedIn "only if T03 found a permitted actor". A technical actor exists, but LinkedIn's own terms forbid scraping, so no actor is *permitted*. The owner can veto this.
- **Legal basis.** Every actor and Apify's terms put the legal basis for personal data on the customer. That feeds OG-DATA (G05-T04 notice v2), which already lists Apify as a processor.

## 8. Firecrawl v2 credits per scan (G05-T03 item 4, checked 2026-10-27)

The **coordinator re-verified** these rows from the raw `https://docs.firecrawl.dev/billing.md` and `https://docs.firecrawl.dev/features/search.md` with `curl` on 2026-10-27: scrape, crawl, search, JSON, enhanced proxy and free plan.

| Operation | Credits (quoted from official docs) | Source |
|---|---|---|
| `/v2/scrape`, one page, markdown | "1 credit / page" | https://docs.firecrawl.dev/billing ; https://docs.firecrawl.dev/features/scrape |
| JSON (LLM extraction) | "+4 credits / page" | https://docs.firecrawl.dev/billing |
| Enhanced proxy or `auto` escalation (default `proxy: auto`) | "+0". "Billed at the same 1 credit as a basic request. An escalated retry is not charged separately" | https://docs.firecrawl.dev/billing.md ; https://docs.firecrawl.dev/api-reference/endpoint/scrape |
| Zero Data Retention | "+1 credit / page" | https://docs.firecrawl.dev/billing |
| PDF | "+1 credit / PDF page" (billing). The pricing page says "1 credit per PDF page", so it is unclear whether this is on top of the page credit | https://docs.firecrawl.dev/billing ; https://www.firecrawl.dev/pricing |
| `/v2/search` | "2 credits per 10 results, rounded up (1–10 results = 2 credits, 11–20 = 4 credits …)". Scraping the results adds "the standard scraping costs" per result | https://docs.firecrawl.dev/features/search |
| `/v2/map` | "1 credit per call, regardless of the number of URLs returned" | https://docs.firecrawl.dev/features/map |
| `/v2/crawl` | "Each page crawled consumes 1 credit" | https://docs.firecrawl.dev/features/crawl |
| Actions, screenshots, stealth proxy | Not stated on the billing, scrape API reference or advanced-scraping pages | (same) |
| Free plan | "1,000 credits per month". "Unused free credits do not roll over." HTTP 402 when used up (no pay-as-you-go on Free). Hobby is $19 per month for 5,000 credits | https://docs.firecrawl.dev/billing.md ; https://www.firecrawl.dev/pricing |

**Credits per Tool A scan** (an estimate from the documented unit rates above, not a measurement):
- **The scan.** G05-T08's company scan plus G05-T10's search candidates: homepage + up to 4 key pages (markdown, no JSON) + one `/v2/search` of 10 results, not scraped.
- **Full scan:** 1 + 4 + 2 = **7 credits**. **Minimum** (homepage only): 1 + 0 + 2 = **3 credits**. Proxy escalation adds 0.
- **Free plan:** 1,000 ÷ 7 = **142 full scans per month**.
- **Optional extras:**
  - one `/v2/map` call to find key pages: +1;
  - scraping the 10 search results: +10;
  - JSON on 5 pages: +20.
- **Local data point** (not a doc source): the project's own spend ledger logged the Firecrawl CLI `scrape <url>` at 1 credit per page (`experience/evidence/g02-runs/spend.log`, 2026-10-27 20:46Z). That matches the documented rate.

## 9. Venue NAT (G05-T03 item 5): HELD

Venue NAT sizing (N participants behind one public IP: per-IP rate limits, captcha risk at Apify, Firecrawl and Google, and the daily scan limit) stays **HELD on G05-Q4**. It needs the owner's venue Wi-Fi or hotspot facts. Nothing here measures it. The §7 concurrency limit (Apify Free: 5 runs) and the §8 credit budget are inputs to that answer.

Next action: G05-T07 adds `[edge_runtime] policy = "per_worker"` locally and builds the §5 job model with Deno tests.
