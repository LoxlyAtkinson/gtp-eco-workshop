Owner (about 10 minutes): accept or veto the PROVISIONAL skill path in section 1, then answer the 4 trade-offs in section 5 at OG-KEYS. The path needs one secret, `ANTHROPIC_API_KEY`.

# G05-T01: how the three skills run inside the Tool A backend

Every fact below was checked on 2026-10-27 against the URL beside it. No API key was used, so no Path A/C latency or cost was measured. The one measured run is the native Claude Code golden reference in section 7.1 (OAuth, no API key). Every latency or cost figure is either a documented limit or an estimate labelled as one. Builder decisions are PROVISIONAL (amendment A1.2).

## 1. Decision (PROVISIONAL)

All three skills run through **Path A: the Messages API, with the unchanged SKILL.md bytes as the instructions**. The call is made from the Supabase Edge Function with `fetch`. Before each call, the backend checks the file's sha256 against the pinned value; if they differ, the call is refused.

1. **competitor-analysis.**
   - The system prompt is the vendored `SKILL.md`, byte for byte. `$ARGUMENTS` is replaced by the business name, which is the same substitution Claude Code makes when it runs a skill with arguments.
   - The user message carries the provided data: the company scan, town, offer and the Firecrawl search candidates. The skill itself allows this: "If the user provides market research, competitor data ... read and analyze them directly" (`SKILL.md:18`).
   - Tools: the `web_search` server tool, because the skill says "Use web search to identify 5 primary direct competitors" (`SKILL.md:23`), and the `web_fetch` server tool for competitor pages. Both have `max_uses` caps.
   - Model: `claude-sonnet-5-5`.
2. **geo-crawlers.**
   - The backend fetches the raw files itself, through the existing `publicUrl` SSRF guard:
     - `/robots.txt`;
     - the homepage HTML **and its response headers** (`X-Robots-Tag`);
     - `/llms.txt`, `/llms-full.txt`, `/ai.txt` and `/.well-known/ai-plugin.json`.
   - These go to Claude as provided data, with the verbatim skill as instructions.
   - A deterministic cross-check then verifies the model's allow/deny map instead of trusting it. The crawler list is **parsed at runtime from the skill file** (section 4.2), not retyped, and the backend's own code evaluates `robots.txt` against it.
   - Model: `claude-haiku-5-5`, or Sonnet if the golden comparison shows a quality gap.
3. **geo-llmstxt.** Same pattern as geo-crawlers, in the skill's "Analysis Mode" only. Its "Generation Mode" is out of scope unless the owner asks for it.
4. **Owner-requested additions** (social-action suggestions, handling of fields that don't fit a small business, score suppression) form a **separate, labelled tool layer**.
   - It is a second Messages call that reads the skill's output plus the Apify social sample.
   - The tool layer has its own sha256 and version.
   - It never edits or joins the skill text, and each skill is invoked separately (A1.5).
5. **The vendored skill text never enters the public repository.** `LoxlyAtkinson/gtp-eco-workshop` is **PUBLIC** (checked with `gh repo view`, 2026-10-27), and G06-Q6 keeps skill text unpublished (HELD).
   - A build script copies the three files from `~/.claude/skills/`, checks their sha256 and writes a **gitignored** module, `supabase/functions/eco-api/_vendor/skills.generated.js`.
   - The CLI bundles that module because it is imported (proof in `g05-edge-limits.md` §3).
   - The Pages artifact copies only `tool/` (`.github/workflows/pages.yml:27`), so the skill text never reaches github.io either.

Why this path wins:
- It is the only path that is all three of the following: proven to run inside the chosen Supabase host, GA with no beta header, and able to show a byte-level "the skill was used, not imitated" receipt on every run.
- Path C (Skills API) is the fidelity upgrade if a real call proves it fits the time limits (section 3).
- Path B (Agent SDK) cannot run inside Supabase Edge at all.

## 2. Comparison

| | A: Messages API + verbatim SKILL.md | B: Claude Agent SDK + skill files | C: Skills API (`/v1/skills`) + code execution | D: Managed Agents (for completeness) |
|---|---|---|---|---|
| Runs inside the Supabase Edge Function | **Yes**: one HTTPS `fetch` per call | **No**: the SDK "spawns and supervises a `claude` CLI subprocess" and needs "1 GiB RAM, 5 GiB disk, and 1 CPU per agent" [B1]. Edge gives 256MB memory, 2 s CPU and a 20MB bundle [E1] | **Yes**: one HTTPS `fetch`; the container runs at Anthropic | **Yes, as a client**: REST plus SSE or event history; the agent runs at Anthropic |
| How the skill text reaches Claude | System prompt, byte-identical to the pinned file | Loaded "from your project's `.claude/` and from `~/.claude/`, same as Claude Code" [B2] | Uploaded unchanged; Claude reads `SKILL.md` "from the filesystem using bash" when triggered [C2] | Agent `skills` list [D1] |
| Web research for competitor-analysis | `web_search` + `web_fetch` server tools | Claude Code's own WebSearch/WebFetch | Container: "No network access" [C1][C2]. Mixing `container.skills` with the `web_search` server tool in one request is **not documented** (open item 7.2) | Sandbox has "network access"; "Web search and fetch" tools [D1] |
| Raw robots.txt + **HTTP headers** for the geo skills | Backend fetches them; passed as data | WebFetch/Bash on the host | Backend must fetch them: the container has no network, and `web_fetch` returns only `url`, `content` and `retrieved_at`, never response headers [C3] | Bash in the sandbox could fetch them |
| Per-run "skill used" receipt | sha256 of the bytes sent (pre-substitution) + `$ARGUMENTS` value + API `request-id` | sha256 of the files on the host + session id | sha256 of the uploaded bytes + pinned `skver_…` version id; the version content can be downloaded and re-hashed [C1] | Skill version id + session id |
| Status | GA | GA library, self-hosted | **GA**: "The Skills API is out of beta and needs no beta header" [C1] | **Beta**: header `managed-agents-2026-04-01` [D1] |
| Latency | Not measured (no key). Bounded by the edge wall clock (§3 of `g05-edge-limits.md`) | Not measured; needs a warm container | Not measured; adds container start + a bash read of `SKILL.md` | Not measured; built for "minutes or hours" tasks [D1] |
| Cost per competitor run (estimate, section 2.1) | ≈ $0.20 (Sonnet 5.5, lower bound) | Same tokens + Claude Code harness tokens (not documented) + host ≈ $0.05/h [B1] | Same as A + about 1.3k tokens for the skill read. Code execution is "free when used with web search or web fetch (`web_search_20260209`, `web_fetch_20260209`, or later)"; otherwise billed with a 5-min minimum after 1,550 free hours per month [C4] | Tokens + $0.08 per session-hour [P1] |
| Keys needed (OG-KEYS) | `ANTHROPIC_API_KEY` | `ANTHROPIC_API_KEY` on a **new** container host (not Supabase), plus that host's own account | `ANTHROPIC_API_KEY` + non-secret `*_SKILL_ID` / `*_SKILL_VERSION` config. Skills are workspace-scoped, so a dedicated GTP workspace is advised [C1] | `ANTHROPIC_API_KEY` + agent and environment ids |
| Main risk | Long competitor runs vs the 150 s / 400 s wall clock | Re-decides the protected host (Supabase is fixed by the owner) | Undocumented skills + `web_search` combination; extra latency | Beta; long sessions; not ZDR-eligible [D1] |

Path B is already in use where it fits: the local presenter runner (G02-T02R) uses `claude -p` on the presenter's laptop. It is never used for the public participant tool. The Agent SDK overview also says third parties may not "offer claude.ai login or rate limits for their products" [B2], so a public tool must use an API key.

### 2.1 Cost arithmetic (estimates, not measurements)

Prices: Sonnet 5.5 is $2 in / $10 out per MTok; Haiku 5.5 is $0.10 / $0.50 per MTok for prompts up to 100k tokens; web search is $10 per 1,000 searches; web fetch has "no additional charges beyond standard token costs" [P1][C3].

1. **competitor-analysis, Path A, Sonnet 5.5.**
   - Input:
     - Skill text: 4,924 bytes, about 1,250 tokens (bytes/4).
     - Provided data: about 3,000 tokens.
     - 6 searches at about 5,000 result tokens each = 30,000 (basis: `g05-aeo-providers.md` A3).
     - 3 fetches capped at `max_content_tokens: 6000` = 18,000.
     - Total about 52k tokens, so $0.104.
   - Output: about 4,000 tokens, so $0.04.
   - Searches: $0.06.
   - **Total about $0.20, as a lower bound.** If the server-tool loop re-bills context on each sampling step, the cost is higher. The `usage` block of the first real call settles it.
2. **geo-crawlers or geo-llmstxt, Path A, Haiku 5.5.**
   - Skill text is about 4.2k / 4.0k tokens; raw files are about 2-6k.
   - That is about 10k in + 2k out, roughly $0.002 per skill run. On Sonnet 5.5 it is about $0.04.

## 3. When to switch to Path C

Path C is the most literal "execute the skill": Anthropic's own skill runtime does the progressive loading. It also keeps the skill text out of the repository entirely.

Switch to C when one real call (after OG-KEYS) shows all three of these:
1. `container.skills` + `code_execution` + `web_search` work in one request.
2. A competitor run finishes inside the edge wall clock.
3. The fidelity critic scores C's output against the golden run no worse than A's.

Until then, C stays an A/B experiment at G05-T10. It is not the build path.

## 4. Skill file receipts (installed copies, 2026-10-27)

### 4.1 Hashes

| Skill | sha256 | Bytes | Lines | Bundled files |
|---|---|---|---|---|
| competitor-analysis | `ef66dae4ba0fa149efe63cdbae7744b5d6f0af86079e5b086d2dfed9e503176a` | 4,924 | 110 | SKILL.md only |
| geo-crawlers | `64c8b2dac8c072e8f5334cd86fcb9ad71545c220a21adad8cceb17ba1c85bf28` | 16,888 | 345 | SKILL.md only |
| geo-llmstxt | `3694867cdd1f74798a90efef09ef777d7d41d9e6f4b54584d3c2e99ec67a5038` | 16,171 | 432 | SKILL.md only |

The geo skills' frontmatter lists `allowed-tools: Read, Grep, Glob, Bash, WebFetch, Write` (Claude Code tool names). Under Path A, these map to backend-fetched data plus `web_fetch`; under C, to the code execution container.

### 4.2 The crawler list loads from the skill file, not retyped

These are the `#### <name>` headings between `## Complete AI Crawler Reference` and `## Recommendation Matrix` in `geo-crawlers/SKILL.md`, extracted by script on 2026-10-27:

`GPTBot | OAI-SearchBot | ChatGPT-User | ClaudeBot | PerplexityBot | Google-Extended | GoogleOther | Applebot-Extended | Amazonbot | FacebookBot | CCBot | anthropic-ai | Bytespider | cohere-ai` (14 crawlers in 3 tiers)

Each entry carries a ``- **User-Agent:** `<token>` `` line (`SKILL.md:33`, `:41`, ...), which the backend parses for the robots.txt evaluation. If the skill file changes, the sha256 pin fails first, so the list cannot drift silently.

## 5. Trade-offs that need the owner (not asked: owner asleep; PROVISIONAL defaults applied)

1. **The skill fields don't fit a small business.**
   - The skill asks for 5 competitors with market size, market share, funding and founding date (`SKILL.md:31-49`).
   - PROVISIONAL default (decision register G05-Q7): run the skill unchanged and show such fields as "unknown". Any limit to fewer than 5 competitors goes in the tool layer, not the skill.
2. **The skills print scores; the goal forbids an "AI visibility score".**
   - The geo-crawlers output format contains `## AI Visibility Score: [X]/100` (`SKILL.md:302`), and geo-llmstxt contains `## Overall llms.txt Score: [X]/100` (`SKILL.md:368`).
   - goal-05 §3 rules out "an 'AI visibility score'".
   - PROVISIONAL default: keep the skill unchanged and store its raw output in evidence. The report renders only the per-crawler map and the per-check findings, with the score lines suppressed by the tool layer.
3. **Wall clock.** A 5-competitor research run may not fit 150 s on the Supabase Free plan. Pro allows 400 s (`g05-edge-limits.md` §1).
   - PROVISIONAL default: one stage per invocation, with `pause_turn` continuation in the next invocation (`g05-edge-limits.md` §5).
   - Owner item: the plan of the `smmartaisolutions` project.
4. **Where the skill text lives.**
   - A (PROVISIONAL): a gitignored generated module inside the deployed bundle.
   - C: Anthropic workspace storage. Workspace-scoped, readable by any key in that workspace.
   - Either way, nothing is published (G06-Q6 HELD).

## 6. Keys for OG-KEYS (names only)

1. **Path A:** `ANTHROPIC_API_KEY`.
   - The organisation must have web search and web fetch enabled. An admin can turn web fetch off on the Console Capabilities page, and requests then fail with a 400 [C3].
   - The existing `FIRECRAWL_API_KEY` feeds the provided data.
2. **Path C adds** non-secret `COMPETITOR_SKILL_ID`, `COMPETITOR_SKILL_VERSION`, `GEO_CRAWLERS_SKILL_ID`/`_VERSION` and `GEO_LLMSTXT_SKILL_ID`/`_VERSION`. The owner runs the upload once, with his own key in his own shell.
3. **Path B:** a container host account + `ANTHROPIC_API_KEY` there. Not recommended.
4. **Path D:** `ANTHROPIC_API_KEY` + beta access (on by default) [D1].

## 7. What T01 still needs (goal-05 row G05-T01)

1. **Golden reference:** competitor-analysis is **done** (section 7.1, BV-3 D-T01-1). geo-crawlers and geo-llmstxt golden runs are not done: this fix was scoped to one `claude -p` run. A second golden on the owner-named proof business waits on that business (HELD).
2. **One real Path A call per skill** after OG-KEYS, recording latency, `usage` and `request-id`. Optionally one Path C call, to settle open item 2.2 (the skills + `web_search` combination).
3. **Owner answers** to section 5 (AskUserQuestion after 04:00).
4. **File name:** goal-05 names this output `g05-skill-execution.md`; the caller asked for `g05-skill-paths.md`. A pointer or rename is needed at bundle sync.

### 7.1 Golden reference: competitor-analysis, run natively once (2026-10-27 21:28Z)

Evidence folder: `experience/evidence/g05-golden/`.

| Item | Value |
|---|---|
| Sample business | The owner's own public site, https://loxlyatkinson.github.io/gtp-eco-workshop/ (G02-Q9 default). Business "GTP ECO workshop", category "small-business marketing workshop", area "South Africa" |
| How it ran | One `claude -p` run through the live runner's own `runKind()` (`live-runner/lib/run-kind.mjs`), with the same `claude.exe` and the same `claudeArgs()` flags as `live-runner/lib/kinds.mjs`: `--model sonnet`, `--tools Skill,WebSearch,WebFetch,TodoWrite`, `--disallowedTools Bash,Read,Glob,Grep,Write,Edit,NotebookEdit,Agent,Task`, hooks and CLAUDE.md files excluded, `--strict-mcp-config`, `--permission-mode dontAsk`. The prompt went on stdin. Only the prompt differs from the stage kind: there is no word cap, so the skill's own full output format stands. No Firecrawl scan was used (`scrape: false`), so the skill read the site with WebFetch. Driver: `g05-golden-run.mjs` (copy in the evidence folder) |
| Skill receipt | Init event `tools: ["Skill","WebFetch","WebSearch"]`. The model called `Skill {"skill":"competitor-analysis","args":"GTP ECO workshop"}`. Marker "Skill loaded: competitor-analysis" at 14.3 s. Installed SKILL.md sha256 `ef66dae4…176a`, which matches section 4.1 |
| Model, turns, time | `claude-sonnet-5-5`, 5 turns. Wall clock 50.5 s; result at 49.9 s; API duration 41.7 s |
| Cost and tokens | $0.1394 (`total_cost_usd`). 6 input, 3,592 output, 21,463 cache-write and 44,039 cache-read tokens. 0 permission denials |
| Research done | 1 WebFetch (the site) and 1 WebSearch. The output has all of the skill's sections: market overview, set summary, 5 competitor profiles, differentiation and positioning. It cites 9 source URLs and writes "unknown" for founding, funding, market share and size |
| Fidelity note for the T10 critic | This golden is **thin**. The skill asks for deep research per competitor, and this run did one search. Two of the five are dated (a 2022 chamber event and a 2021 free programme), and the run flags both. Treat it as the lower bar a Path A/C run must match or beat, not a ceiling |
| Files (sha256) | `competitor-analysis-golden-2026-10-27T21-28-25-307Z.stream.jsonl` (raw stream) `75fd5c96…00c2`<br>`.result.md` (the result text) `ea6753d9…0989`<br>`.events.jsonl` `5f7f7ef2…cc6`<br>`.timing.json` (args, prompt, prompt sha256, marks) `b4cf9f8e…63de` |
| Spend | Logged by the runner in `experience/evidence/g02-runs/spend.log` (start 21:28:25Z, end 21:29:15Z). Claude runs went from 36 to 37 of 60. Firecrawl credits: 0 |
| Secret scan | No `sk-ant`, `fc-` or Bearer strings in the stream. The runner's `redact()` ran on every line |

Relies on PROVISIONAL: G02-Q9 (the owner's own site as the sample business); D18 (the stand-in site label).

## 8. Sources (all checked 2026-10-27)

- [C1] Skills API guide: https://platform.claude.com/docs/en/build-with-claude/skills-guide (upload `POST /v1/skills`, `container.skills`, 20 skills per request, 30 MB, "No network access", GA/no beta header, version pinning `skver_…`, not ZDR)
- [C2] Agent Skills overview: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview ("Skills on the API run in a sandboxed container with no network access and no runtime package installation"; progressive disclosure; Claude Code skills are filesystem-based)
- [C3] Web fetch tool: https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-fetch-tool (`web_fetch_20260318`; result fields `url`, `content`, `retrieved_at`; no JS rendering; `url_not_allowed` for robots.txt and private addresses; URLs must appear earlier in the conversation; no additional charge)
- [C4] Code execution tool: https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool (free with `web_search_20260209`/`web_fetch_20260209` or later; otherwise a 5-min minimum, 1,550 free hours per month, then $0.05 per container-hour; "Internet access: Completely disabled")
- [B1] Agent SDK hosting: https://code.claude.com/docs/en/agent-sdk/hosting (subprocess model; 1 GiB RAM / 5 GiB disk / 1 CPU per agent; container about $0.05/h)
- [B2] Agent SDK overview: https://code.claude.com/docs/en/agent-sdk/overview ("A library that runs the Claude Code binary"; skills load from `.claude/`; no claude.ai login for third-party products)
- [D1] Managed Agents overview: https://platform.claude.com/docs/en/managed-agents/overview (beta `managed-agents-2026-04-01`; skills on the agent; sandbox network access; not ZDR-eligible)
- [P1] Pricing: https://platform.claude.com/docs/en/about-claude/pricing (Sonnet 5.5 $2/$10; Haiku 5.5 $0.10/$0.50 up to 100k tokens; Opus 5.5 $4/$20; web search $10 per 1,000; Managed Agents $0.08 per session-hour)
- [E1] Supabase Edge limits: https://supabase.com/docs/guides/functions/limits (see `g05-edge-limits.md`)
- Repository visibility: `gh repo view LoxlyAtkinson/gtp-eco-workshop --json visibility` returned `PUBLIC` (2026-10-27).

Next action: after OG-KEYS, run one Path A competitor-analysis call on the owner's own site and record `usage`, `request-id` and wall time in `experience/evidence/g05-backend/`.
