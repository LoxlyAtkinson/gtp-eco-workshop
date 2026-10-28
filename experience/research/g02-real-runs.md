# G02-T04 real runs on the hero brand (Amberkloof)

**Next action for the owner (3 min):** answer Q-FACT (section a). Your line "AI cannot go into social media all by itself. So majority of the time it searches the web." came back MOSTLY-TRUE. Your words stay as spoken until you decide.

- Status: REVIEW. All five runs are done and their raw files are kept. Q-FACT is HELD (A1.2, G02-Q8), and the builder decisions below are PROVISIONAL.
- Brand: Amberkloof and Tumelo Print & Pack are INVENTED (story-spine §1). All market statistics are South Africa-wide.
- Raw evidence root: `experience/evidence/g02-runs/real/`. It is internal: `experience/evidence/` is git-ignored, and `experience/` is never copied into the public Pages artifact.
- Spend: logged in `experience/evidence/g02-runs/spend.log`.
  - This task added 4 `claude -p` starts (1 bare attempt with no API call, plus 3 drafts), 6 `codex exec` draft runs and 3 `codex exec` cleanse runs. No Firecrawl credits.
  - The night's `claude -p` total is now 26 of the 30 allowed (A1.12), including other agents.

| Run | Skill or tool (invoked) | Raw input | Raw output | Result |
|---|---|---|---|---|
| a1 | `customer-research` (Skill tool) + WebSearch ×6, WebFetch ×6 | `a-customer-research/input.md` | `a-customer-research/output.md`, `sources-raw.md` | Where 3 personas live online, with 7 sources and 9 sourced infographic rows |
| a2 | `fact-checker-loxly` (Skill tool) + WebSearch ×5, WebFetch ×4 | `a-fact-check/input.md` | `a-fact-check/fact-check-report.md`, `verification-raw.md` | 18 claims: 12 TRUE, 5 MOSTLY-TRUE, 1 UNVERIFIABLE, 0 FALSE |
| b | `content-strategy` (Skill tool) | `b-content-strategy/input.md` | `b-content-strategy/output.md` | 4 pillars, a daily 15-min habit with the Last 30 Days brief as step 1, a 4-week calendar (2-27 Nov 2026), scored priority topics |
| c | `artifact-capabilities` + `artifact-design` (Skill tool), then Artifact quickstart (intent "other") and a create from the Design System type | `c-design-system/RUN.md` | https://claude.ai/artifact/Ef41LWvyrcRgSgfs5ybzWR, files copied to `c-design-system/published/project/` | Amberkloof Design System (private) |
| d | `slopmonster` (Skill tool): `deslop.py`, rewrite, `cleanse.sh` (rival GPT via codex), `deslop.py` | `d-slopmonster/without/prompt-N-*.txt` | `d-slopmonster/PAIRS.md`, `RUN.md`, `without/`, `rewrite/`, `cleanse/`, `with/`, `lint/` | 3 pairs. Before: 5/5, 5/5, 4/5. After: 5/5 ×3 |
| e | `claude-video-studio` (Skill tool), `bash scripts/doctor.sh` | `e-video-studio/doctor-output.txt` (command header) | same file | node v22.18.0 ok, ffmpeg ok, ffprobe ok, python3 ok, "ready", exit 0 |

---

## (a) Where do these customers live online?

What the scene-04 infographic can show (every row sourced; full table in `a-customer-research/output.md`):

| Row | Value | Source | Fact-check |
|---|---|---|---|
| Online | 79.6% of South Africans (51.7 m), Oct 2025 | DataReportal Digital 2026 | TRUE |
| Social media identities | 29.1 m, 44.9% | DataReportal Digital 2026 | TRUE |
| Time on social | 3 h 36 min a day | Meltwater 2025 | TRUE (2025 edition) |
| Google | 91.75% of all search, Sept 2026 | StatCounter | TRUE |
| Google on mobile | Use **94.95% (Sept 2026)**, not the 93.87% June figure | StatCounter | MOSTLY-TRUE → fix |
| Search vs social for product research | 62% vs 58% | GWI via Time Out, Nov 2025 | MOSTLY-TRUE (label the data period) |
| WhatsApp / Facebook / TikTok / Instagram | 93.8 / 88.6 / 76.9 / 71.4% of active social users | Meltwater 2025 | TRUE (name the base) |
| Facebook | 27.9 m; 61.7% of adults | DataReportal | TRUE |
| TikTok | ads reach 64.8% of adults; audience 60.7% male | DataReportal | TRUE |
| Instagram | 8.60 m, 13.2% of population; audience 54.6% female | DataReportal | TRUE |
| LinkedIn (B2B) | 17.0 m members | DataReportal | TRUE |
| Brand content on social | 63% look for it (global 50%) | Meltwater 2025 | TRUE |
| TikTok for gift ideas | 65% of millennials and Gen Z | Time Out, Nov 2025 | MOSTLY-TRUE (drop "citing GWI") |
| LinkedIn brand use | 85% | Ornico 2025 summary | MOSTLY-TRUE (2026 edition exists; brands, not founders) |

Answer lines per persona (from the run):
- **Gift Planner:** "Searches Google, scrolls Facebook and TikTok, orders on WhatsApp."
- **Self-care regulars:** "Finds you on Instagram and Google, reorders on WhatsApp."
- **Launching Founder (Tumelo B2B):** "Searches Google for suppliers, checks you on LinkedIn, asks for a quote on WhatsApp." Confidence is LOW: no South African SME survey was found (gap G2).

### Owner line fact-check (G02-Q8 HELD: his words unchanged)
- Line: "So, and what AI does is AI cannot go into social media all by itself. So majority of the time it searches the web."
- Verdict: **MOSTLY-TRUE**.
  - Sentence 1 is MOSTLY-TRUE. Assistants search web indexes and don't scroll feeds or DMs. But public social posts do reach AI: Google and Bing have indexed public Instagram professional-account posts since July 2025 (trade press), and OpenAI has had real-time Reddit access through Reddit's Data API since May 2024.
  - "Majority of the time" is UNVERIFIABLE. No source measures it.
- **Q-FACT (for the owner):** keep the words as spoken, or add this speaker-note qualifier?
  > "Public posts can show up through Google, and a few deals feed Reddit into some AI tools. But AI doesn't scroll your feed or read your DMs. It mostly finds you through the web, so the website has to carry your proof."

## (b) 4-week content plan (`b-content-strategy/output.md`)
- **Habit (every weekday morning, 15 min):**
  1. **Read the Last 30 Days brief** (5 min).
  2. Draft with AI (4 min).
  3. Your edit with slopmonster and the voice card (4 min).
  4. Schedule (2 min).
- **Weekly rhythm:**
  - Monday: education or opinion from a trend.
  - Wednesday: a competitor gap.
  - Friday: a promotion.
  - Tuesday and Thursday: Stories only.
  - Saturday: market capture (5 photos, 3 questions heard).
  - Sunday: a 10-minute look back (the Optimize bridge).
- **Pillars:** P1 Gentle answers, P2 The gift sorted, P3 Small batch, P4 Guesthouse refills.
- **Calendar:** 2-27 Nov 2026. Monday topics say "from the brief", with examples marked as examples. There is one `[needs date]` placeholder: the December delivery cut-off. No search volumes are given, because no keyword tool was run.
- **Scene 06 use:** a week strip where each day carries Brief → Draft → Your edit → Schedule, with the Brief icon lit every day (A1.10).

## (c) Claude Design System brand guideline
- **URL:** https://claude.ai/artifact/Ef41LWvyrcRgSgfs5ybzWR. Private: share it from its Share menu before showing it on stage.
- **Type:** Design System (type_url https://claude.ai/artifact/5M7UeXXcx16TP3vzVFNDzd), confirmed listable through quickstart. Current version: 2 (id 1793131310-d3cd).
- **Contents:**
  - 14 colour tokens in 2 themes: the spine's 9 brand hex values exactly, plus 5 semantic tokens.
  - 2 font families (Fraunces display, DM Sans body), 6 type styles, 4 spacing steps, 3 radii.
  - A README brand book: voice rules with real lines, the claims rule, product names, audiences, colour rules with contrast ratios, imagery spec, "no logo, name set in type".
  - A cover (palette blocks + the drop motif + the name).
- **Built from:** the story-spine brand card, the slopmonster "with" copy and the content plan's rules.
- **Not verified:** the artifact was not seen rendered in a browser (claude.ai needs the owner's session). G02-T11 must capture it in scene.

## (d) slopmonster: 3 pairs for the voice scene (U13)
- **"Without" source:** plain one-prompt GPT runs (`codex exec`, gpt-6-sol) with typical owner prompts, extracted unedited.
- **"With" source:** a Claude rewrite (3 passes with the voice card), then the rival-model cleanse with `cleanse.sh` (GPT through codex: the skill's default route from Claude Code), then a re-lint.

| Pair | Piece | deslop before | after | Biggest differences |
|---|---|---:|---:|---|
| 1 | Instagram caption | 5/5 | 5/5 | "One little night-time ritual ✨" and "A little piece of South Africa 🇿🇦" became "That's it." and "Marula does the quiet work."; added "Honestly, that's plenty."; 4 emoji to 0; 6 hashtags to 3 |
| 2 | Product description | 5/5 | 5/5 | Invented benefit claims cut ("helps moisturise and soften skin … looking radiant by morning"), replaced by "No promises about how you'll look by morning."; added "count your two drops in the dark"; stock phrases cut ("South African glow", "nourishing finish") |
| 3 | WhatsApp follow-up | **4/5** | 5/5 | Double em-dash removed; "we" became "I"; generic "Your feedback means a lot" became "a short review helps a two-person business like ours a lot"; added "which one she reached for first" |

- **Honest finding:** `deslop.py` caught 1 tell in 3 drafts. The visible difference is voice and the removed claims, which the linter does not measure. The scene must show the called-out differences, not only the scores.
- **Attempt history:** attempts 0-2 were kept and are explained in `d-slopmonster/RUN.md`. `claude -p` drafts on this machine came back already clean, because the global config injects writing rules. The neutral-prompt GPT drafts were also 5/5.
- **Byte-match source for T12:** `d-slopmonster/without/without-N.txt` and `d-slopmonster/with/with-N.txt`. Their sha256 hashes are in `PAIRS.md`.

## (e) claude-video-studio doctor
- **Output:** `bash ~/.claude/skills/claude-video-studio/scripts/doctor.sh` printed:
  - `node ok (v22.18.0)`
  - `ffmpeg ok`
  - `ffprobe ok`
  - `python3 ok`
  - `ready`
- **Exit and timing:** exit 0, at 21:33 SAST.
- **Script hash:** doctor.sh sha256 `c87be7e5…cf0296`.
- **Scope:** no render and no Higgsfield call (G10).

## Decisions taken tonight (PROVISIONAL, A1.2; veto in `decision-register.md`)
| ID | Decision |
|---|---|
| D-SLOP-01 | The "without" drafts are attempt 3: GPT with a typical owner prompt. Attempts 1-2 are kept as evidence |
| D-DS-01 | Fraunces + DM Sans for Amberkloof (the source names no font) |
| D-DS-02 | 3 added colour tokens: ink-soft, the lifted dark green, the accent alias |
| D-DS-03 | No components: a "small first system" per the type's rule |
| D-DS-04 | No logo drawn; the name is set in type |
| D-CS-01 | Content plan defaults: WhatsApp orders first, 15 min a day, TikTok parked until week 5, plan window 2-27 Nov 2026 |

## Owner questions raised (HELD)
- **Q-FACT:** the owner line verdict, MOSTLY-TRUE (above).
- **Q-FIT:** scene 06 is 25 s over budget. See `experience/g02-engage-spec.md` §4.

**Next action:** answer Q-FACT and Q-FIT, then share the Design System artifact if it will be shown on stage.
