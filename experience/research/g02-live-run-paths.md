Next action (owner, about 10 minutes): set `APIFY_API_TOKEN` on the presenter laptop (OG-KEYS). That unblocks `b2b-find`. `last30days` also needs `SCRAPECREATORS_API_KEY`, but it stays disabled in code until G02-T02K reviews its tool needs. Then veto or keep decisions D1-D19 in section 5.

# G02-T02 live-run paths (measured 2026-10-27, re-measured 22:43-22:47 local after BV-1)

## 1. Status per live run
- **How each time was measured:** one real headless run on this machine, through `live-runner/run-once.mjs`, which calls `lib/run-kind.mjs`. That is the same code the server uses.
- **Tool set:** the current locked tool set, `--tools` plus the allow and deny lists in section 2. The model was `sonnet`.
- **Batching:** `keywords` ran alone first, as the `--tools` check. The other 4 site-less kinds then ran 4 at a time, and the 3 site kinds ran 3 at a time.
- **Ready** is when the Claude Code session started. **Skill** is when the skill's text was loaded into the run.
- **Raw logs:** all in `experience/evidence/g02-runs/cached/`. These same runs are the G02-T06 cached recordings.

| Live run (scene) | Kind | Named skill / tool | Status | Wall time | Ready / Skill | Turns · cost | Tools used | Raw log (`g02-runs/cached/`) |
|---|---|---|---|---|---|---|---|---|
| Competitor scan (05) | `competitor-scan` | competitor-analysis | PROVEN | **51.7 s** | 10.3 s / 14.9 s | 8 · $0.15 | Skill, WebSearch, WebFetch | `competitor-scan-2026-10-27T20-45-23-220Z.*` |
| Content generation (06) | `content` | social | PROVEN | **21.9 s** | 10.3 s / 13.6 s | 3 · $0.10 | Skill | `content-2026-10-27T20-45-23-181Z.*` |
| 30/60/90 plan (07), part 1 | `seo-plan` | seo-plan | PROVEN | **22.2 s** | 10.5 s / 12.7 s | 3 · $0.09 | Skill | `seo-plan-2026-10-27T20-45-23-540Z.*` |
| 30/60/90 plan (07), part 2 | `blog-calendar` | blog-calendar | PROVEN | **27.6 s** | 10.4 s / 14.1 s | 3 · $0.11 | Skill | `blog-calendar-2026-10-27T20-45-23-528Z.*` |
| Keyword targets (07) | `keywords` | competitor-keyword-decoder (Path B) | PROVEN | **43.2 s** | 12.0 s / 14.8 s | 6 · $0.25 | Skill, WebSearch | `keywords-2026-10-27T20-43-17-147Z.*` |
| SEO check (07) | `seo-audit` | Firecrawl CLI scan + seo-audit | PROVEN | **40.1 s** (scan 2.6 s) | 11.6 s / 20.6 s | 5 · $0.16 | Skill, WebFetch | `seo-audit-2026-10-27T20-46-15-443Z.*` |
| Backlink check (07) | `backlink-analyzer` | Firecrawl CLI scan + backlink-analyzer | PROVEN | **34.7 s** (scan 2.3 s) | 10.9 s / 13.5 s | 5 · $0.19 | Skill, WebSearch | `backlink-analyzer-2026-10-27T20-46-15-505Z.*` |
| Citation / AI citability (07) | `geo-citability` | Firecrawl CLI scan + geo-citability | PROVEN | **24.8 s** (scan 2.2 s) | 11.1 s / 13.8 s | 3 · $0.15 | Skill | `geo-citability-2026-10-27T20-46-15-558Z.*` |
| Last 30 Days (06) | `last30days` | last30days | **BLOCKED (review + key)** | not run | - | - | - | none (see 4.1) |
| B2B find (05, B2B swap) | `b2b-find` | Apify `compass/crawler-google-places` | **BLOCKED (key)** | not run | - | - | - | none (see 4.2) |

What every PROVEN row's files show:
- **`.stream.jsonl`** carries the execution marker (section 3), and its `init` event offers exactly `["Skill","WebFetch","WebSearch"]`.
- **`.timing.json`** holds:
  - the exact args, which include `--tools`;
  - the prompt text and its sha256;
  - `tools_offered`;
  - `permission_denials: []`.
- **`.result.md`** holds the skill's answer.
- **`_console-<kind>.log`** is the console output of each recording.

Targets:
- **The 5 site-less kinds** use the hero request: Amberkloof, "small-batch botanical body care (marula face oil, rooibos body butter)", Pretoria East, Gauteng, South Africa.
  - That is a category-only request, so it is PROVISIONAL (coordinator rule 3, spine D-06).
- **The 3 site kinds** use the owner's own published deck, `https://loxlyatkinson.github.io/gtp-eco-workshop/` (D9).
  - The request's business field is "GTP ECO workshop (owner own public site)".
  - The cached files label this target as a stand-in (D18).

### Does any run fit ~20 s?
No.
- The fastest full run is `content` at 21.9 s.
- Startup alone takes 10.3-12.0 s before the session is ready.
- Under G02-Q2, a run starts at the chapter opener and the deadline is 20 s after the scene reveal.
- So a slot shows live only if its run starts at least (wall time − 20 s) before the reveal:

| Kind | Minimum head start before reveal |
|---|---|
| `content`, `seo-plan` | about 2 s |
| `geo-citability` | about 5 s |
| `blog-calendar` | about 8 s |
| `backlink-analyzer` | about 15 s |
| `seo-audit` | about 20 s |
| `keywords` | about 23 s |
| `competitor-scan` | about 32 s |

These are single runs. Wall time varies from run to run: the same kinds took 24.6-71.7 s on the older tool sets below. Allow a margin.

Proof that the head-start pattern works:
- In the browser proof, `geo-citability` started 20 s before the reveal and landed live 11 s after it (`experience/evidence/g02-runner/proof-results.md`, S1).
- That run was on tool set v2, before `--tools`.

### Older measurements (superseded; kept for honesty, not used for any claim above)

| Folder | Tool set | Runs | Why superseded |
|---|---|---|---|
| `phase0/attempt1-slash-no-marker/` | slash-command prompts | competitor 64.9 s, content 26.3 s, keywords 69.8 s | No skill marker |
| `phase0/` (19:19 and 19:37), 5 site-less kinds | **v1**: `--allowedTools Skill,WebSearch,WebFetch,Read,Glob,Grep,TodoWrite,Bash(firecrawl:*)`, no deny list | competitor 71.7 s, content 28.5 s, seo-plan 24.6 s, blog-calendar 28.5 s, keywords 47.3 s | Bash, PowerShell, Read, Write and Edit were offered, and the user-level allow rules applied (BV-1 D-T02-1) |
| `phase0/superseded-toolset-v1/`, 3 site kinds | v1 | seo-audit 42.4 s, backlink 45.6 s, geo 38.7 s | Same reason, and one run executed `curl` (D5) |
| `phase0/` (19:47), 3 site kinds | **v2**: allow list `Skill,WebSearch,WebFetch,TodoWrite` plus deny list, no `--tools` | seo-audit 35.5 s, backlink 41.3 s, geo 29.5 s | About 22 non-web tools were still offered, among them CronCreate, Workflow, PushNotification and RemoteTrigger (BV-1 D-T02R-1) |

## 2. The exact invocation (tool set v3, current)
1. **Runner side, site kinds only.**
   - Command: `node C:/Users/loxly/.npm-global/node_modules/firecrawl-cli/dist/index.js scrape <url>`, spawned with an args array and no shell.
   - Its markdown, up to 24 KB, is passed to the skill as data.
   - Measured at 2.2-4.6 s and 1 credit per page. The scan is reused for 30 minutes within one runner process.
   - `run-once.mjs` is a separate process per kind, so each recording scanned once.
2. **The skill.**
   - Command: `C:/Users/loxly/.npm-global/node_modules/@anthropic-ai/claude-code/bin/claude.exe`, spawned with an args array and no shell. Claude Code 2.1.311.
   - The working folder is a fresh temp folder per run.
   ```
   -p --output-format stream-json --verbose --model sonnet
   --settings {"disableAllHooks":true,"claudeMdExcludes":["C:/Users/loxly/.claude/CLAUDE.md","**/CLAUDE.md","**/AGENTS.md"]}
   --strict-mcp-config --no-session-persistence --permission-mode dontAsk
   --tools Skill,WebSearch,WebFetch,TodoWrite
   --allowedTools Skill,WebSearch,WebFetch,TodoWrite
   --disallowedTools Bash,Read,Glob,Grep,Write,Edit,NotebookEdit,Agent,Task
   ```
   - **Tools actually offered** (the `init` event `tools`, all 8 runs): `["Skill","WebFetch","WebSearch"]`. Nothing else.
   - `TodoWrite` is requested but this CLI build has no built-in tool of that name, so it is simply absent. No CronCreate, Workflow, PushNotification, RemoteTrigger, SendMessage, Task* or Artifact* tool is offered.
   - Proof: `cached/*.stream.jsonl` line 1, and `tools_offered` in each `.timing.json`.
3. **Prompt on stdin.**
   - It starts: "Use the Skill tool to load the `<skill>` skill first, then follow it. Load no other skill."
   - Then come a non-interactive line, the task, a data-only rule, the request fields, and the scan if there is one.
   - Templates: `live-runner/lib/kinds.mjs`.

## 3. Execution marker (how to prove the skill ran, not a re-implementation)
In each `.stream.jsonl`, three lines appear in order:
1. An assistant `tool_use` with `"name":"Skill","input":{"skill":"<name>"}`.
2. The `tool_result` "Launching skill: `<name>`".
3. A user message starting "Base directory for this skill: C:\Users\loxly\.claude\skills\<name>", followed by the skill's own SKILL.md text.

How the marker is used:
- The runner streams the third line to the deck as the progress line "Skill loaded: `<name>`".
- `.timing.json` keeps it in `skill_markers`.
- `scripts/build-cached-runs.mjs` refuses to build a cached file unless all three appear in order, the result is `success`, and the args include `--tools`.

## 4. Keys and blockers
- **`FIRECRAWL_API_KEY`:** set. It is used only by the runner's scan.
- **Claude Code:** the presenter's logged-in subscription (OAuth). There is no `ANTHROPIC_API_KEY`, so `--bare` mode cannot be used.

### 4.1 BLOCKED: Last 30 Days
- **WHAT:** the `last30days` live run.
- **WHY:**
  1. It is **disabled in code** until G02-T02K reviews its tool needs. The engine needs `Bash(python)`, and this runner never grants Bash (BV-1 D-T02R-2).
     - `kinds.mjs` sets `disabledUntilReview`.
     - `runKind` refuses the kind with `BLOCKED_REVIEW` before any key check, even when every key is set.
     - `claudeArgs()` throws for it.
     - It no longer carries a Bash allow list, so removing the flag alone arms nothing.
  2. `SCRAPECREATORS_API_KEY` is not set.
- **EVIDENCE:**
  - `/health` reports `ready: false` and `blocked_on: ["REVIEW (G02-T02K)", "SCRAPECREATORS_API_KEY"]`.
  - With a dummy key set, `runKind` still returned `BLOCKED_REVIEW` (console check, 22:42).
  - In the browser, the runner sent an SSE `error` event with code `BLOCKED_REVIEW`, and the page showed "Live run blocked: Blocked until review: G02-T02K …" (`experience/evidence/g02-runner/s8-last30days-blocked.png`, `proof-reasons.json` S8).
- **OWNER:**
  - G02-T02K, for the tool review: either spawn the engine directly from the runner, as Firecrawl is, or grant a reviewed, minimal tool set.
  - The owner, for the key.
- **RESUME CONDITION:**
  - the review is recorded;
  - `disabledUntilReview` is removed;
  - `/health` shows `last30days` as ready;
  - one run log contains the engine footer.
- **SAFE TO DO MEANWHILE:** everything else.

### 4.2 BLOCKED: B2B find
- **WHAT:** the `b2b-find` live run.
- **WHY:** `APIFY_API_TOKEN` is not set.
- **EVIDENCE:** `/health` reports `blocked_on: ["APIFY_API_TOKEN"]`, and the runner answers `BLOCKED_KEY`.
- **ATTEMPTS:** none. The code path is UNTESTED: Apify `run-sync-get-dataset-items`, with the token sent in a header, returning the top 10 places.
- **OWNER:** the owner.
- **EXACT ACTION REQUIRED:** set `APIFY_API_TOKEN` with a monthly spend cap.
- **RESUME CONDITION:** one real run returns real rows.
- **SAFE TO DO MEANWHILE:** everything else.

## 5. Decisions taken overnight (all PROVISIONAL; veto in the morning brief)
| # | Decision | Why | Evidence |
|---|---|---|---|
| D1 | Pin `--model sonnet` | A trivial reply took 16.3 s on the default model vs 9.4 s on sonnet; stage time matters | Probes 2-3, scratchpad |
| D2 | Hooks off and CLAUDE.md excluded in skill runs | Otherwise the global session rules (nlm login, IFP and so on) would run inside every skill run. With the excludes, the model saw no CLAUDE.md; without them, it named the global rules heading | Probe pair, 19:11 |
| D3 | No MCP servers in skill runs (`--strict-mcp-config`) | Faster startup; no skill needs MCP | Args |
| D4 | Load the skill through the Skill tool, not a slash command | The slash form leaves no marker in stream-json, so nothing proves the skill ran | `attempt1-slash-no-marker/` |
| D5 | Lock the tool set: `dontAsk`, web tools only, with Bash, Read, Glob, Grep, Write, Edit, Agent and Task disallowed | The user-level allow rules (python, powershell, node, curl, broad Read) apply to headless runs, and a volunteer's web page could steer them. A v1 run really did execute `curl` through Bash | `superseded-toolset-v1/geo-citability-*.stream.jsonl` |
| D6 | The runner does the Firecrawl CLI scan and passes the page in as data | Keeps "Firecrawl CLI where a site is scanned" with no Bash in the skill run | `firecrawl_scan` in timing files |
| D7 | One named skill per run | Coordinator rule 4: 30/60/90 becomes `seo-plan` + `blog-calendar`, and the website check becomes `seo-audit` + `backlink-analyzer` + `geo-citability` | `kinds.mjs` |
| D8 | `consent: true` required by both server and client; category-only requests tagged `category-provisional` | G7b plus coordinator rule 3 | Proof S4, server 400 `CONSENT_REQUIRED` |
| D9 | The site target is the owner's own published deck | The Amberkloof demo site (G02-Q6) does not exist yet. The deck is the owner's own, and the scan reads public pages only | Timing files |
| D10 | Hero request for site-less kinds = the Amberkloof category | The invented brand supplies the cached story (G7). Not the stage default | Timing files |
| D11 | backlink-analyzer uses public search evidence only; the prompt forbids invented metrics | G02-Q4 | Prompt in `kinds.mjs` |
| D12 | seo-plan STOP gates are answered from the request fields | G02-Q3 | Prompt in `kinds.mjs` |
| D13 | Content generation uses the `social` skill (post ideas, caption, product description) | The closest single installed skill; the alternative is `copywriting` | Content run |
| D14 | Runner port 8790 | Checked free; 8765 and 8766 are in use (RULE 10) | netstat |
| D15 | Fallback deadline 20 s from `reveal()`, not from the start | Owner decision G4b and the coordinator's single fallback contract; the head start comes from G02-Q2 | Proof S6 flips |
| D16 | Add `--tools Skill,WebSearch,WebFetch,TodoWrite` to every skill run (tool set v3) | Allow and deny lists do not shrink the offered set; `--tools` does. The init event shows only Skill, WebFetch and WebSearch | `cached/*.stream.jsonl` line 1 |
| D17 | Disable `last30days` in code (`BLOCKED_REVIEW`) whatever keys are set, and drop its Bash allow list | BV-1 D-T02R-2: setting the key must not arm Bash plus every user-level Bash rule | `kinds.mjs`, `run-kind.mjs`, proof S8 |
| D18 | The site-kind cached files keep the business "GTP ECO workshop (owner own public site)" and say in `label` and `target` that the site is a stand-in, not Amberkloof | Putting "Amberkloof" next to the owner's URL would make the skill's answer describe the wrong business, which is dishonest on stage. Veto: re-record on the Amberkloof demo site once it exists | `assets/cached-runs/seo-audit.json` and the other two |
| D19 | Runner ceilings synced to A2.9: 60 `claude -p` runs and 60 Firecrawl credits in 12 h | A2.9 replaced A1.12's 30/40 | `live-runner/lib/spend.mjs`, `/health` |

## 6. Spend tonight (ceiling A2.9, PROVISIONAL: 60 `claude -p` runs and 60 Firecrawl credits)
- **Ledger:** `experience/evidence/g02-runs/spend.log`. Entries before 19:42 were backfilled from run files.
- **This task, first pass:** 22 `claude -p` runs and about 7 Firecrawl credits. That covers:
  - 5 probes;
  - 3 marker-less runs;
  - 3 + 5 + 3 measured runs;
  - 3 browser-proof runs.
- **This task, BV-1 re-measure (20:43-20:47 UTC):** 8 `claude -p` runs (the 8 recordings above) and 3 Firecrawl credits. The round-2 browser proofs (S3b, S5b, S7, S8) and the ad embed tests spent 0 runs and 0 credits; a note line in the ledger records this.
- **All agents, ledger at 20:50 UTC:** 34 `claude -p` starts and 11 Firecrawl credits in the window. That leaves **26 runs and 49 credits** under the A2.9 ceiling.

## 7. Open items
1. Live runs depend on the head start: a cold run never beats 20 s. The deck must call `start()` at the chapter opener (G02-Q2).
2. `last30days` needs the G02-T02K tool review and the key.
3. The `b2b-find` code is untested until the key exists.
4. Reaching `127.0.0.1` from the public https deck (Chrome private-network access) is G07-T03's job. The runner already allows only the 8765 origins.
5. The 3 site kinds are recorded on the owner's deck, a stand-in. Re-record them on the Amberkloof demo site if one is built (D18).

Next step: G02-T07 wires `live-runner/client.js` into the Engage live slots, using `assets/cached-runs/<kind>.json` as each slot's `cachedUrl`.
