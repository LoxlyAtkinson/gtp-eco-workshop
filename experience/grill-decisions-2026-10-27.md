# Grill decisions, 2026-10-27 (owner-locked)

Source brief: `experience/owner-brief-2026-10-27.md`. Every answer below was given by the owner through AskUserQuestion during the `grilling` skill session. These are Phase-0 decisions: no builder may re-decide them.

| # | Decision | Owner's answer |
|---|----------|----------------|
| T1-a | Focus | GTP is the ship target; DeskcommCRM parked (CLAUDE.md + registry updated 2026-10-27) |
| T1-b | Design system for brand scanning | Claude Design System type |
| G1 | The tool(s) | **Two separate tools.** (A) Analysis tool: public GitHub Pages URL, scans company (Firecrawl), socials (Apify), competitors (competitive-analysis skill built in), AI-crawler reach, AEO/GEO citations; gives strengths, gaps, next steps. Builds on existing `tool/` + `supabase/functions/eco-api`. (B) Claude-powered page: ICP scanner + brand kit (find brand, create on-brand assets) on the Claude Design System type. |
| G2 | Base deck | **Local working tree, corrected** against the owner's exact notes (restore "Start with the people who actually buy, inquire, and come back"). |
| G3 | Race in personas | **Only when customers state it themselves** (opt-in survey), never inferred, with a one-line POPIA note. |
| G4 | Tools shown as links | **Live run during the talk** (no more plain links). |
| G4b | Live-run safety | **Auto-fallback to a cached run** after a time limit (~20 s) or on failure, with a small "cached run" tag. |
| G5 | Platform logos | **Official logos, 7 platforms:** WhatsApp, Facebook, Instagram, TikTok, LinkedIn, Google Business Profile, Website/Google Search. Choosing one spins a platform wheel and that platform's scene comes alive with why it fits. |
| G6 | Ad examples | **Mix:** real ads via their public sources (Meta Ad Library, brand posts, embeds where allowed) with attribution, plus our own generated Good vs Average pairs. No third-party asset is re-hosted. |
| G7 | Hero business | **New invented local product brand** (suits the floating-3D-product look) carrying the whole journey, with B2B swap-ins so every point lands for B2B and B2C. |
| G7b | Live-run target | **A volunteer's real business** from the room; the invented brand supplies the story and the cached fallback runs. |
| G8 | Running order | **Open > ECO loop > Engage > Convert > Optimize > Attract > Interact > Responsible AI > live participant tools (A + B) > where to learn + skills download.** |
| G8b | Smaller live tools | **In their own scenes:** Last 30 Days in Engage, SEO/keyword/backlink + AEO/GEO check + 30/60/90 plan in the website scene, competitor scan in Engage "what". The two participant tools are the finale. |
| G9 | Auto-scroll pace | **Timed per scene** from the speaker-note talk time; starts on arrival, stops just before the next scene and waits for Next; Next restarts motion; Space pauses/resumes; speed control in presenter view. |
| G10 | Media generator | **ElevenLabs only.** No fallback. Anything ElevenLabs cannot produce from here waits. (MCP needs owner authorisation via /mcp.) |
| G10b | Credit spend | **Storyboard + estimated credits per batch**, generate only after the owner's yes. |
| G11 | Video lesson | **Frames + captions are enough.** `experience/research/video-claude-video-2-lesson.md` stands. |
| G12 | Attract/Interact analogy | **Keep the idea, neutral image** (e.g. a beautifully lit shop window or perfume counter that invites you in). The owner's original line stays in his speaker notes only. |
| G13 | Anthropic marketing skills | **Download page + zip** on the public site, built from `anthropics/knowledge-work-plugins/marketing` (8 skills: brand-review, campaign-plan, competitive-brief, content-creation, draft-content, email-sequence, performance-report, seo-audit; Apache-2.0, licence + source link included), 3-step install guide, QR on the final scene. |
| G14 | Palette | **Warm R5 studio for product/ad scenes, green and cream for ECO teaching scenes,** with scroll colour bridges marking chapters. |
| G15 | Stop point | **Slides 1-3 first, then keep going** through the whole journey (credit-spend gates still pause for the owner). |

## Facts established (not decisions)

- Deck has 15 numbered scenes plus 14 JS-inserted connector scenes (`experience/research/current-deck-map.md`).
- Main deck uses no GSAP or WebGL today; the owner named the GSAP skills, so GSAP is adopted.
- Existing analysis tool: `tool/` front end (submit disabled, `GTP_API_BASE = ''`), `supabase/functions/eco-api` uses Firecrawl v2 scrape/search and optional Apify social sampling; not deployed; no keys configured.
- oryzo.ai = Lusion build: fixed WebGL canvas, progress-range sections, one persistent hero object, exits that become entries (`experience/research/oryzo-teardown.md`).
- R5 floating-product spec and motion spec: `experience/research/refs-r4-r5.md`. R1-R3 teardowns: `experience/research/refs-r1-r3.md`.
- Third-party study media is git-ignored (`experience/research/*/`).

## Open checks (to resolve during Phase 0, not owner decisions yet)

- Tool B: confirm what a participant needs to use a Claude-powered page (e.g. a Claude sign-in). If sign-in is required, put that trade-off to the owner.
- ElevenLabs: after authorisation, list which image and video tools its MCP exposes.
