Owner (about 10 minutes): pick the AEO provider at OG-KEYS. The PROVISIONAL default is below: Perplexity, now via the Agent API, because the Sonar Chat Completions API it was chosen for ended on 2026-09-27. Then create one key, `PERPLEXITY_API_KEY`.

All facts were checked on 2026-10-27 against the URL given beside them. Anything labelled "estimate" is arithmetic on stated assumptions, not a measurement. No calls, sign-ups or keys were used.

## 1. Recommendation (PROVISIONAL)

1. **Primary: Perplexity Agent API with the Perplexity model `perplexity/sonar` and the `web_search` tool. Location set with `user_location: {"country": "ZA"}`. Estimated cost: about $0.05 per 10-prompt scan.**
   - **This challenges the G05-Q5 default as worded and keeps the provider.** Perplexity's official migration page says: "Sonar Chat Completions support ended on September 27, 2026." Synchronous and streaming Sonar requests are now "reformulated as Agent API requests" ([migrate overview](https://docs.perplexity.ai/docs/agent-api/migrate-from-sonar/overview.md), checked 2026-10-27).
   - That changes three things: the endpoint (`POST https://api.perplexity.ai/v1/agent`), the request shape and the response parsing. The old `citations` array and the per-1,000-request fee tiers no longer apply.
   - Why it stays primary:
     - It is the cheapest developer API here that still runs a Perplexity-native model. `perplexity/sonar` is listed as "Perplexity's grounded search model" ([Agent API models](https://docs.perplexity.ai/docs/agent-api/models.md), checked 2026-10-27).
     - Each response returns both the sources consulted (`search_results`) and the answer text. So citation and mention can both be detected.
     - Each response reports its real cost in `usage.cost.total_cost` ([Agent API](https://docs.perplexity.ai/docs/agent-api), checked 2026-10-27). The backend can store actual spend instead of estimates.
     - The API terms say the customer "owns all Output". No clause on storing or caching was found ([API ToS](https://www.perplexity.ai/hub/legal/perplexity-api-terms-of-service), last updated 2026-01-23, checked 2026-10-27).
   - **Do not use `effort: "fast"`.** That is the migration guide's suggested replacement for `sonar`, but it runs `openai/gpt-6-luna` ([effort](https://docs.perplexity.ai/docs/agent-api/effort.md), checked 2026-10-27). The answer would come from an OpenAI model, so a "Perplexity" label would be misleading.
2. **Secondary (optional, adds a ChatGPT-family engine): OpenAI Responses API `web_search` tool on `gpt-4.1-mini`, with `user_location.country = "ZA"`. Estimated cost: about $0.14 per scan.** Condition: OpenAI requires inline citations to be "clearly visible and clickable" in the UI ([web search guide](https://developers.openai.com/api/docs/guides/tools-web-search), checked 2026-10-27).
3. **Not recommended: Gemini Grounding with Google Search.** The Gemini API terms forbid you, your end users and any third party to "cache, frame, syndicate, resell, analyze, train on, or otherwise learn from Grounded Results or Search Suggestions" ([Gemini API terms](https://ai.google.dev/gemini-api/terms), last updated 2026-04-28, checked 2026-10-27). They also forbid collecting Links "for another purpose".
   - This tool's core job is to analyse which domains are cited and to store competitor URLs. My reading is that this conflicts with those terms; legal confirmation is open item 6.4.
4. **Consumer-surface option for the owner to decide (6.2): DataForSEO Google AI Mode SERP, Live. About $0.04 per scan.** It is the only option here that captures the actual consumer Google product, and Google lists South Africa for AI Mode. Its terms were not checked in this pass.

## 2. Comparison table

These assumptions apply to every cost below. A1 is the task's working figure. A2-A4 are estimates, not measurements.

- **A1:** 10 prompts per scan (3 terms x about 3 prompts).
- **A2 (estimate):** 1,000 input + 500 output tokens per prompt, before search content.
- **A3 (estimate):** +5,000 input tokens of search content per search, where the vendor bills search content at model rates. Basis: Anthropic's own example response shows `input_tokens: 6039` for one search ([Claude web search](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool)). OpenAI `gpt-4.1-mini` instead uses its documented fixed 8,000-token block.
- **A4 (estimate):** 1 search per prompt. Claude can be capped with `max_uses: 1`. OpenAI, Gemini 3 and the Perplexity model may run more, and each extra search is billed.
- Reasoning tokens are not estimated.

| # | Option | Price per query (official) | Cost per 10-prompt scan (estimate) | Citations field | Mention detectable | ToS notes | ZA location | Key name | Source URLs |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Claude API `web_search` (Haiku 5.5) | $10 / 1,000 searches + tokens (Haiku 5.5: $0.10 in / $0.50 out per MTok, prompts up to 100k tokens) | **~$0.11** (Sonnet 5.5: ~$0.27) | `text[].citations[]` of type `web_search_result_location` (`url`, `title`, `cited_text`, `encrypted_index`); results in `web_search_tool_result.content[]` (`url`, `title`, `page_age`) | Yes (text blocks) | When showing outputs to end users, "citations must be included to the original source" | `user_location.country` ISO alpha-2; "the API rejects an unsupported code with a 400 error" | `ANTHROPIC_API_KEY` | [tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool), [pricing](https://platform.claude.com/docs/en/about-claude/pricing) |
| 2 | OpenAI Responses `web_search` (gpt-4.1-mini) | $10 / 1,000 calls; content tokens at model rates (gpt-4.1-mini: fixed 8,000-token block per call); $0.40 in / $1.60 out per MTok | **~$0.14** (gpt-5.5: ~$0.55) | `url_citation` annotations (`url`, `title`, `start_index`, `end_index`); full list via `web_search_call.action.sources` | Yes (`output_text`) | Inline citations "clearly visible and clickable" | `user_location` `type: approximate`, `country` two-letter ISO | `OPENAI_API_KEY` (name not shown on checked pages) | [guide](https://developers.openai.com/api/docs/guides/tools-web-search), [pricing](https://developers.openai.com/api/docs/pricing) |
| 3 | **Perplexity Agent API, `perplexity/sonar` + `web_search`** | `web_search` $2.50 / 1,000 (or $1.00 / 1,000 with `search_type: "fast"`) + $0.25 in / $2.50 out per MTok | **~$0.05** (fast search: ~$0.04) | `output[]` item `type: "search_results"` → `results[]` (`id`, `url`, `title`, `snippet`, `date`, `last_updated`, `source`); inline `[n]` markers map to `id` | Yes (`output_text`) | Output displayed "solely within the Customer Applications"; customer "owns all Output"; no storage clause found | `web_search.user_location.country` ISO alpha-2 (+ `city`, `region`, lat/long) | `PERPLEXITY_API_KEY` | [models](https://docs.perplexity.ai/docs/agent-api/models.md), [web search](https://docs.perplexity.ai/docs/agent-api/tools/web-search.md), [ToS](https://www.perplexity.ai/hub/legal/perplexity-api-terms-of-service) |
| 4 | Gemini Grounding with Google Search (3.8 Flash) | Gemini 3+: 5,000 free search queries/month (shared), then $14 / 1,000 queries; $0.75 in / $3.75 out per MTok until 2026-12-31 | **~$0.03** within the free quota; **~$0.17** after it | `groundingMetadata.groundingChunks[].web.uri/title`, `groundingSupports[].segment/groundingChunkIndices`, `webSearchQueries`, `searchEntryPoint.renderedContent`; Interactions API: `url_citation` | Yes | **Blocking:** no "analyze"; Links not to be collected "for another purpose"; Search Suggestions must be shown with the result; text storage up to 2 years, only for the listed purposes | No location parameter documented; Gemini API is available in South Africa | `GEMINI_API_KEY` (name not shown on checked pages) | [grounding](https://ai.google.dev/gemini-api/docs/google-search), [pricing](https://ai.google.dev/gemini-api/docs/pricing), [terms](https://ai.google.dev/gemini-api/terms) |
| 5a | DataForSEO: Google AI Mode SERP (consumer surface) | Live $0.004 / SERP; Priority $0.0024; Standard $0.0012 | **$0.04** Live / $0.024 Priority / $0.012 Standard (exact, no tokens) | `ai_overview` item → `references[]` type `ai_overview_reference` (`source`, `domain`, `url`, `title`, `text`) | Yes (`markdown`, `items[].text`) | Not checked | `location_code` / `location_name` (from the locations endpoint); Google lists South Africa for AI Mode | DataForSEO API login + password (env names e.g. `DATAFORSEO_LOGIN`, `DATAFORSEO_PASSWORD`) | [AI Mode pricing](https://dataforseo.com/pricing/serp/google-ai-mode-serp-api), [docs](https://docs.dataforseo.com/v3/serp/google/ai_mode/live/advanced/) |
| 5a | DataForSEO: Google AI Overview (Organic SERP + `load_async_ai_overview`) | 2x base: Live $0.004 / SERP, Standard $0.0012 | $0.04 Live / $0.012 Standard | AI Overview block in the organic SERP (fields not re-checked) | Yes, when an Overview appears | Not checked | Same as above | Same as above | [Organic pricing](https://dataforseo.com/pricing/serp/google-organic-serp-api) |
| 5a | DataForSEO: LLM Responses (developer APIs of ChatGPT, Claude, Gemini, Perplexity) | Live: $0.0006 + "price charged by LLM" per task | ~$0.15 (with gpt-4.1-mini; LLM part estimated as in row 2) | `items[] → message → sections[] → annotations[]` (`title`, `url`, `start_index`, `end_index`, `text`) | Yes (`sections[].text`) | Not checked | `web_search_country_iso_code` (ZA not confirmed; example is `FR`) | Same as above | [pricing](https://dataforseo.com/pricing/ai-optimization/llm-responses), [ChatGPT live](https://docs.dataforseo.com/v3/ai_optimization/chat_gpt/llm_responses/live/) |
| 5a | DataForSEO: LLM Mentions | $0.1 per request + $0.001 per row | Does not fit: it queries a database of past prompts, not our disclosed prompts | Not checked | Not checked | Not checked | Countries not stated | Same as above | [pricing](https://dataforseo.com/pricing/ai-optimization/llm-mentions) |
| 5b | SerpApi: Google AI Mode API (consumer surface) | Starter $25 / month for 1,000 searches (= $0.025 per search); Free plan 250 / month | **$0.25** on Starter (Free plan = 25 scans/month), if 1 request = 1 search (not stated) | `references[]` (`title`, `link`, `snippet`, `source`, `index`); `text_blocks[].reference_indexes` | Yes (`text_blocks[].snippet`, `reconstructed_markdown`) | Not checked | `gl=za` is in SerpApi's country list; `location` / `uule` parameters | `SERPAPI_API_KEY` (`api_key` parameter) | [AI Mode](https://serpapi.com/google-ai-mode-api), [pricing](https://serpapi.com/pricing), [countries](https://serpapi.com/google-countries) |
| 5b | SerpApi: Google AI Overview API | Needs a Google Search API request first, then a `page_token` request | Up to $0.50 on Starter (2 searches per prompt, not stated) | Not stated on the page checked | Yes, when an Overview appears | Not checked | `gl=za` (via the Google Search request) | Same as above | [AI Overview](https://serpapi.com/google-ai-overview-api) |

## 3. Per-option notes

### 3.1 Anthropic Claude API `web_search` server tool

1. **Price.** "$10 USD per 1,000 searches, plus standard token costs for search-generated content". Search results "are counted as input tokens". "If an error occurs during web search, the web search will not be billed." ([tool doc](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool), checked 2026-10-27)
   - Token prices: Haiku 5.5 is $0.10 in / $0.50 out per MTok (prompts up to 100,000 tokens). Sonnet 5.5 is $2 / $10 ([pricing](https://platform.claude.com/docs/en/about-claude/pricing), checked 2026-10-27).
2. **Scan arithmetic (estimate):**
   - Searches: 10 x $0.01 = $0.100.
   - Input: 10 x 6,000 = 60,000 tokens x $0.10/M = $0.006.
   - Output: 5,000 tokens x $0.50/M = $0.0025.
   - **Total about $0.11.**
   - With Sonnet 5.5: 60,000 x $2/M = $0.12, plus 5,000 x $10/M = $0.05, plus $0.10 = **about $0.27**.
3. **Returns.**
   - Answer text in `text` blocks.
   - `web_search_tool_result.content[]` with `url`, `title`, `page_age`, `encrypted_content`.
   - Text citations of type `web_search_result_location` with `url`, `title`, `encrypted_index`, `cited_text` ("Up to 150 characters").
   - The search query sits in `server_tool_use.input.query`.
   - Search errors still return HTTP 200, with `web_search_tool_result_error` in the body. The backend must check for it.
4. **Versions.** The tool comes in `web_search_20250305`, `web_search_20260209` and `web_search_20260318`.
   - From 20260209 on, dynamic filtering runs by default.
   - To call search directly, set `allowed_callers: ["direct"]` or use `web_search_20250305`.
   - Use `max_uses: 1` to cap spend.
5. **Terms.** "When displaying API outputs directly to end users, citations must be included to the original source." Web search can be turned off by an organisation admin in the Console.
6. **ZA.** `user_location` takes `type: "approximate"`, `city`, `region`, `country` (ISO 3166-1 alpha-2) and `timezone`. Whether `ZA` is accepted is not confirmed until a real call.
7. **Latency.** Not documented.
8. **Model support.** Whether Haiku 5.5 supports web search was not verified. Check `capabilities.server_tools.web_search.supported` in the Models API.
9. **Key.** `ANTHROPIC_API_KEY`. The project has no Anthropic API key today; Claude Code uses OAuth (`experience/research/g02-live-run-paths.md:68`).

### 3.2 OpenAI Responses API `web_search` tool

1. **Price.** "Web search (all models)" is $10.00 per 1k calls, and search content tokens are "billed at model rates" ([pricing](https://developers.openai.com/api/docs/pricing), checked 2026-10-27).
   - Exception: for gpt-4o-mini and gpt-4.1-mini, "search content tokens are billed as a fixed block of 8,000 input tokens per call".
   - The older "Web search preview" for non-reasoning models costs $25.00 per 1k calls, with content tokens free.
   - Token prices per MTok: gpt-4.1-mini $0.40 / $1.60; gpt-5-mini $0.25 / $2.00; gpt-5.5 $5.00 / $30.00.
2. **Scan arithmetic (estimate):**
   - gpt-4.1-mini: 10 calls x $0.01 = $0.100. Input 10 x (1,000 + 8,000) = 90,000 x $0.40/M = $0.036. Output 5,000 x $1.60/M = $0.008. **Total about $0.14.**
   - gpt-5.5: 60,000 x $5/M = $0.30, plus 5,000 x $30/M = $0.15, plus $0.10 = **about $0.55**, plus reasoning tokens (not estimated).
   - gpt-5-mini would be about $0.13, but web search support for gpt-5-mini is not listed on the guide page checked.
3. **Returns** ([guide](https://developers.openai.com/api/docs/guides/tools-web-search), checked 2026-10-27).
   - Answer text in `output_text`.
   - `url_citation` annotations with `type`, `start_index`, `end_index`, `url`, `title`.
   - The full list of consulted URLs via the `sources` field (request `web_search_call.action.sources` in `include`).
   - Supported models listed on the page: `gpt-5.5`, `gpt-4.1`, `gpt-4.1-mini`, `o4-mini`. Web search "does not support `gpt-5` with `minimal` reasoning".
4. **Terms.** "inline citations must be made clearly visible and clickable in your user interface". No storage restriction on the guide page. The OpenAI Service Terms page returned HTTP 403, so it was not checked.
5. **ZA.** `user_location` takes `type: "approximate"`, `country` (two-letter ISO), `city`, `region`, `timezone`. It is "not supported for deep research models".
6. **Latency.** Not documented numerically. The page only says agentic searches "take longer than quick lookups".
7. **Key.** `OPENAI_API_KEY` is the conventional name. It was not shown on the pages checked.

### 3.3 Perplexity: Sonar is retired; use the Agent API

1. **Status.** "Sonar Chat Completions support ended on September 27, 2026." Asynchronous Sonar requests "are no longer supported" ([migrate overview](https://docs.perplexity.ai/docs/agent-api/migrate-from-sonar/overview.md), checked 2026-10-27).
   - The how-to maps "`sonar` → `fast`, `sonar-pro` → `fast`" ([how-to](https://docs.perplexity.ai/docs/agent-api/migrate-from-sonar/how-to.md), checked 2026-10-27).
   - `web_search_options.search_context_size` has "No named-size equivalent".
   - `user_location` moves onto the `web_search` tool.
2. **Old Sonar request-fee figures are not used here.** The figures circulating ($5 / $8 / $12 per 1,000 requests by context size) appear only on third-party blogs. They are not on the current official pricing page ([pricing](https://docs.perplexity.ai/docs/getting-started/pricing.md), checked 2026-10-27).
3. **Price.**
   - `perplexity/sonar`: $0.25 input / $2.50 output per MTok ([models](https://docs.perplexity.ai/docs/agent-api/models.md), checked 2026-10-27).
   - `web_search`: "$2.50 per 1,000 invocations, or $1.00 per 1,000 invocations with `search_type: "fast"`" ([web search tool](https://docs.perplexity.ai/docs/agent-api/tools/web-search.md), checked 2026-10-27). The pricing page agrees: $0.0025 and $0.001 per invocation.
   - Effort `fast` = `openai/gpt-6-luna` ($0.10 / $0.50), 1 step, `web_search` with `search_type: "fast"` ([effort](https://docs.perplexity.ai/docs/agent-api/effort.md), checked 2026-10-27).
4. **Scan arithmetic (estimate; A3 applied conservatively, because whether search content is billed as input is not stated):**
   - `perplexity/sonar` + standard search: 10 x $0.0025 = $0.025. Input 60,000 x $0.25/M = $0.015. Output 5,000 x $2.50/M = $0.0125. **Total about $0.05.**
   - With fast search: $0.010 + $0.015 + $0.0125 = **about $0.04**.
   - Effort `fast`: $0.010 + 60,000 x $0.10/M ($0.006) + 5,000 x $0.50/M ($0.0025) = **about $0.02**. Not recommended: the answer model is OpenAI's.
5. **Returns** ([Agent API](https://docs.perplexity.ai/docs/agent-api), checked 2026-10-27).
   - The `output[]` array has an item `type: "search_results"` (with `queries` and `results[]`: `id`, `url`, `title`, `snippet`, `date`, `last_updated`, `source`).
   - The answer is an item `type: "message"` → `content[].type: "output_text"`.
   - `usage.cost` includes `total_cost` and `tool_calls_cost`.
   - **Contradiction to handle:** the how-to says markers are `[n]`, mapping to result `id`. The Agent API page's examples show `[web:1]`, and `annotations` arrays are empty in its examples. The parser must accept both forms.
6. **Terms** ([API ToS](https://www.perplexity.ai/hub/legal/perplexity-api-terms-of-service), last updated 2026-01-23, checked 2026-10-27).
   - Output may be displayed "solely within the Customer Applications in accordance with the API Documentation".
   - Customer "owns all Output".
   - No storage or caching clause.
   - No explicit attribution requirement found.
   - Perplexity may act against an application that is "competitive with Perplexity".
   - The Acceptable Use Policy applies but was not read.
7. **ZA.** The `web_search` tool's `user_location` takes `country` (ISO alpha-2), `region`, `city`, and `latitude` / `longitude` ([user location](https://docs.perplexity.ai/docs/grounded-llm/filters/user-location-filter), checked 2026-10-27). No list of supported countries is published.
8. **Latency.** Not documented numerically. "Fast Search" is described as "lower-latency".
9. **Key.** `PERPLEXITY_API_KEY`, sent as `Authorization: Bearer $PERPLEXITY_API_KEY`.

### 3.4 Gemini API Grounding with Google Search

1. **Price** ([pricing](https://ai.google.dev/gemini-api/docs/pricing), checked 2026-10-27).
   - Gemini 3 and newer: "5,000 free search requests per month (shared across all Gemini 3 and newer models), then $14 per 1,000 requests". Billing is "for each search query that the model decides to execute" ([grounding](https://ai.google.dev/gemini-api/docs/google-search), checked 2026-10-27).
   - Gemini 2.5: "1,500 RPD (free), then $35 / 1,000 grounded prompts", billed per prompt.
   - Gemini 3.8 Flash tokens: $0.75 / $3.75 until 2026-12-31, then $1.50 / $7.50 from 2027-01-01. Gemini 2.5 Flash-Lite: $0.10 / $0.40.
2. **Scan arithmetic (estimate).** Whether search content is billed as tokens is not stated, so it is excluded.
   - 3.8 Flash: input 10,000 x $0.75/M = $0.0075. Output 5,000 x $3.75/M = $0.01875. Tokens = **about $0.03**.
   - Past the free quota, add 10 x $0.014 = $0.14, for **about $0.17**.
   - From 2027: about $0.05 within the quota and about $0.19 after it.
   - The free quota covers about 500 scans per month at 1 query per prompt.
   - 2.5 Flash-Lite: $0.003 within the free RPD; $0.353 after it.
3. **Returns** ([API reference](https://ai.google.dev/api/generate-content), checked 2026-10-27).
   - `groundingMetadata.webSearchQueries`.
   - `searchEntryPoint.renderedContent`, described as a "Web content snippet that can be embedded in a web page".
   - `groundingChunks[].web.uri` / `title`.
   - `groundingSupports[].segment` / `groundingChunkIndices`.
   - The current grounding guide uses the Interactions API instead: `google_search_call.queries`, `url_citation` annotations and `search_suggestions`.
   - The claim that chunk URIs are Google redirect URLs is **not stated in the docs checked**.
4. **Terms. This is the blocker** ([terms](https://ai.google.dev/gemini-api/terms), last updated 2026-04-28, checked 2026-10-27).
   - You must display "any associated Search Suggestions or other Links (as applicable) with the final Grounded Result". You may "not modify, or intersperse any other content with" them.
   - "You will not, and will not allow your end user or any third party to, cache, frame, syndicate, resell, analyze, train on, or otherwise learn from Grounded Results or Search Suggestions."
   - Storage of Grounded Result text is allowed "for up to two (2) years" only "to evaluate and optimize the display" or "in chat history of an end user".
   - It is "a violation of these terms to use Grounding with Google Search to extract or collect one or more of these components for another purpose (for example, using programmatic or automated means to collect Links".
   - It may be used only "in an application that is owned and operated by you".
5. **ZA.** South Africa is in the Gemini API available-regions list ([regions](https://ai.google.dev/gemini-api/docs/available-regions), checked 2026-10-27). No user-location parameter is documented for grounding.
6. **Latency.** Not documented.
7. **Key.** `GEMINI_API_KEY` is the conventional name. It was not shown on the pages checked.

### 3.5 Paid SERP and AI-answer data APIs (DataForSEO, SerpApi)

1. **DataForSEO Google AI Mode SERP** ([pricing](https://dataforseo.com/pricing/serp/google-ai-mode-serp-api), checked 2026-10-27).
   - Standard queue: $0.0012 per SERP, "about 5 minutes on average", target 45 minutes.
   - Priority: $0.0024, "up to 1 minute".
   - Live: $0.004, "up to 6 seconds on average".
   - Scan cost (exact, no tokens): Live 10 x $0.004 = **$0.04**; Priority $0.024; Standard $0.012.
   - Response ([docs](https://docs.dataforseo.com/v3/serp/google/ai_mode/live/advanced/), checked 2026-10-27): item `type: "ai_overview"` with `markdown` and `items[]` (`ai_overview_element`: `title`, `text`, `markdown`, `links`), and references `ai_overview_reference` (`source`, `domain`, `url`, `title`, `text`).
   - Location via `location_code`, `location_name` or `location_coordinate`. Setting `calculate_rectangles: true` doubles the price.
2. **DataForSEO AI Overview** ([Organic pricing](https://dataforseo.com/pricing/serp/google-organic-serp-api), checked 2026-10-27).
   - Base prices: Standard $0.0006, Priority $0.0012, Live $0.002.
   - `load_async_ai_overview` adds "+1 base price", for a "Total = 2x base price".
   - An AI Overview does not appear for every query; how often is not documented.
3. **DataForSEO LLM Responses** ([pricing](https://dataforseo.com/pricing/ai-optimization/llm-responses), [ChatGPT live doc](https://docs.dataforseo.com/v3/ai_optimization/chat_gpt/llm_responses/live/), checked 2026-10-27).
   - Price per task: Live "$0.0006 + price charged by LLM", "Up to 120 seconds on average". Standard "$0.0002 + $0.01 advance payment", up to 72 hours.
   - Fields: `web_search`, `web_search_country_iso_code`, `user_prompt` (up to 500 characters). Citations are in `annotations` (`title`, `url`, `start_index`, `end_index`, `text`).
   - Perplexity is Live only.
   - This wraps the vendors' developer APIs, so it has the same fidelity limits as options 1-4. Whether the web-search tool fee is included in the LLM charge is not stated.
4. **DataForSEO LLM Mentions** ([pricing](https://dataforseo.com/pricing/ai-optimization/llm-mentions), checked 2026-10-27).
   - $0.1 per request + $0.001 per row, "Up to 2 seconds on average".
   - It is a database of "real prompts and answers from ChatGPT and Google AI Overviews", so it cannot run our disclosed prompts. Countries are not stated.
5. **SerpApi** ([pricing](https://serpapi.com/pricing), checked 2026-10-27).
   - Free plan: 250 searches per month, 50 per hour. Starter: $25 per month for 1,000 searches, 200 per hour.
   - "Cached, errored, and failed searches are not" counted.
   - AI Mode API ([doc](https://serpapi.com/google-ai-mode-api), checked 2026-10-27): parameters `q`, `location`, `uule`, `gl`, `hl`. Returns `text_blocks`, `references` and `reconstructed_markdown`.
   - AI Overview API ([doc](https://serpapi.com/google-ai-overview-api), checked 2026-10-27): needs `ai_overview.page_token` from the Google Search API, which "expires within 1 minute".
   - `gl=za` is listed as "za South Africa" ([countries](https://serpapi.com/google-countries), checked 2026-10-27).
   - Whether each AI Mode or AI Overview request counts as exactly one search is **not stated in official docs** (pages checked above).
6. **ZA for Google consumer surfaces.** Google's AI Mode help page lists "South Africa" under "AI Mode availability" ([Google Help](https://support.google.com/websearch/answer/16011537?hl=en), checked 2026-10-27).
7. **Terms.** DataForSEO and SerpApi terms, and Google Search's own terms for automated querying, were **not checked in this pass**.
8. **Keys.**
   - DataForSEO: API login + password from its API access page. Suggested env names: `DATAFORSEO_LOGIN`, `DATAFORSEO_PASSWORD`. The auth scheme was not re-verified.
   - SerpApi: `SERPAPI_API_KEY`, sent as the `api_key` parameter.

## 4. Fidelity caveat

1. **Options 1-4 call developer APIs, not the consumer products.**
   - A Claude API answer is not claude.ai.
   - An OpenAI Responses answer is not ChatGPT search.
   - A Perplexity Agent API answer is not perplexity.ai.
   - A Gemini grounded answer is not Google AI Overviews.
   - Models, system prompts, search depth and personalisation differ, and none of these vendors documents parity.
2. **Option 5 (DataForSEO SERP, SerpApi) captures the consumer Google AI Overview / AI Mode output.** It does so through the vendor's collection method, for a set location, without a logged-in user.
3. **Every stored row and report line must carry:**
   - Engine label, for example "Perplexity (`perplexity/sonar`) via API", "OpenAI `gpt-4.1-mini` web search via API", "Google AI Mode via DataForSEO".
   - The exact prompt text.
   - The run date and time with timezone.
   - The location sent (for example "ZA").
   - "Mentioned" (business name or domain found in the answer text) and "Cited" (domain found in the citation or source URL list), kept separate.
   - The competitor domains cited.
   - **No score.**
4. **Suggested report wording:** "What [engine] via API answered on [date] for: [prompt]". Never "what Perplexity users see".

## 5. Open owner items

1. **OG-KEYS: confirm Perplexity (Agent API, `perplexity/sonar`) as primary, or pick another option.** (5 min)
2. **Decide whether to add a consumer Google surface** (DataForSEO AI Mode Live, about $0.04 per scan, or SerpApi AI Mode, $0.25 per scan on Starter). If yes, read that vendor's terms first. (15 min)
3. **Decide whether to add a ChatGPT-family engine** (OpenAI, about $0.14 per scan) and accept its "clickable citations" display rule. (5 min)
4. **Legal reading of the Gemini terms.** Confirm that "analyze" plus "collect Links for another purpose" rules Gemini grounding out. (10 min)
5. **First validation run after keys exist (not yet run):**
   - Hypothesis: `user_location.country = "ZA"` is accepted and localises sources.
   - Setup: 1 known South African business, 3 prompts.
   - Metric: HTTP 200 plus the share of `.za` domains among cited or source URLs, compared with the same prompts without a location.
   - Pass threshold: no 400 error, and the share of `.za` domains rises.
   - Also record `usage.cost.total_cost` to replace the token estimates above.
6. **Read Perplexity's Acceptable Use Policy** (linked from the API ToS; not read in this pass). (5 min)

## 6. Sources (all checked 2026-10-27)

1. https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool
2. https://platform.claude.com/docs/en/about-claude/pricing
3. https://developers.openai.com/api/docs/guides/tools-web-search
4. https://developers.openai.com/api/docs/pricing
5. https://openai.com/policies/service-terms/ (HTTP 403; not read)
6. https://docs.perplexity.ai/docs/getting-started/pricing.md
7. https://docs.perplexity.ai/docs/agent-api/models.md
8. https://docs.perplexity.ai/docs/agent-api
9. https://docs.perplexity.ai/docs/agent-api/tools/web-search.md
10. https://docs.perplexity.ai/docs/agent-api/effort.md
11. https://docs.perplexity.ai/docs/agent-api/migrate-from-sonar/overview.md
12. https://docs.perplexity.ai/docs/agent-api/migrate-from-sonar/how-to.md
13. https://docs.perplexity.ai/docs/grounded-llm/filters/user-location-filter
14. https://www.perplexity.ai/hub/legal/perplexity-api-terms-of-service
15. https://ai.google.dev/gemini-api/docs/google-search
16. https://ai.google.dev/gemini-api/docs/pricing
17. https://ai.google.dev/gemini-api/terms
18. https://ai.google.dev/gemini-api/docs/available-regions
19. https://ai.google.dev/api/generate-content
20. https://dataforseo.com/pricing/serp/google-ai-mode-serp-api
21. https://docs.dataforseo.com/v3/serp/google/ai_mode/live/advanced/
22. https://dataforseo.com/pricing/serp/google-organic-serp-api
23. https://dataforseo.com/pricing/ai-optimization/llm-responses
24. https://docs.dataforseo.com/v3/ai_optimization/llm_responses/overview/
25. https://docs.dataforseo.com/v3/ai_optimization/chat_gpt/llm_responses/live/
26. https://dataforseo.com/pricing/ai-optimization/llm-mentions
27. https://serpapi.com/pricing
28. https://serpapi.com/google-ai-mode-api
29. https://serpapi.com/google-ai-overview-api
30. https://serpapi.com/google-countries
31. https://support.google.com/websearch/answer/16011537?hl=en
