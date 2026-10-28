# Morning brief for 04:00 (built overnight 2026-10-27/28)

Read top to bottom. Each item is one action of under 2 minutes. Items are ranked by what blocks the 08:00 presentation most.

## Held for you (only you can do these)

| # | Item | Why it waits for you | Your action | Unblocks |
|---|---|---|---|---|
| 1 | ElevenLabs connection (OG-EL-AUTH) | Only you can authorise the MCP | Run `/mcp`, choose elevenlabs, connect | All generated images and videos |
| 2 | Media storyboard approval (OG-SPEND) | Paid credits need your yes per batch (decision G10b) | Read `experience/story-spine.md` section 5, then reply "approve batch 1" (or edit) | Generation starts right after |
| 3 | Public deploy (OG-RELEASE) | Publishing is outward-facing | Reply "deploy" | Live github.io deck + skills download page |
| 3b | Skills upload test (OG-INSTALL) | All 8 Anthropic marketing skill descriptions are 278-343 characters; the Claude Help Center says uploads allow at most 200, so claude.ai may refuse them | Upload `skills/downloads/seo-audit.zip` at claude.ai, Customize > Skills > + > Upload a skill, and tell me whether it was accepted | Decides the install path shown to participants |
| 3c | Platform logos (OG-BRAND) | WhatsApp, Facebook, Instagram and LinkedIn logo downloads need you to accept each brand's terms; Google Business Profile needs a Partner Hub account; TikTok needs written permission. Instagram's rules also forbid showing its logo next to other networks, which clashes with the 7-logo wheel (decision G5) | Accept the terms and download the 4 packs (about 10 min), then choose: TikTok as a text label or ask permission; Instagram kept in the wheel or shown on its own | Real logos in the platform wheel (text wordmarks until then) |
| 4 | Live-tool keys (OG-KEYS) | Secrets and spend | See the Keys section below | Live (non-cached) tool runs |

## Session save (asked at 04:00, not before)
The session-save hook asked to run the save-session skill at 22:44. I deferred it because you said "no questions until 4am". Choose one: save now (full protocol), save local artifacts only, or skip. All work state is already on disk in `.claude/goals/2026-10-27-gtp-cinematic-eco/progress.json`.

## Keys status (checked 20:38, presence only, no values read)
- FIRECRAWL_API_KEY: set on this machine.
- APIFY_API_TOKEN: not set (social scans run cached until it is).
- SCRAPECREATORS_API_KEY: not set (`last30days` needs it; its trend brief runs cached until then).
- ElevenLabs: MCP not authorised (item 1).

## Decisions I made overnight (veto any)
(filled during the night, see `.claude/goals/2026-10-27-gtp-cinematic-eco/decision-register.md`)

## What works now
(filled during the night, with how to see it)

## Opener options for slide 1 (OG-OPENER)
(filled from G01-T04)
