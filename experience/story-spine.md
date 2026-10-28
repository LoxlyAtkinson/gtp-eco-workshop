**Next action (owner, about 15 minutes at 04:00):**
1. Read the ranked cut list in `story-spine-v2-timing.md` section 8: keep everything (69:55) or pick cuts.
2. Answer Q-REVEAL, Q-HELPER, Q-VOLUNTEER, Q-INSTAGRAM, Q-QUESTIONNAIRE and Q-DATA (timing file section 9) and veto any of D-21..D-27 (section 9 below).
3. Builders: read the Spine fix round 3 receipt, then the Spine v2 receipt, then your scene card in section 3.2; a fresh CR-VF-SPINE-3 critic must pass v2.1 before G02-T05 and G03-T02 use it (A2.1).

# GTP story spine (G01-T02)

- **Status:** plan. Nothing in this file is built. Every "live run" depends on the gates named in it.
- **Sources (read in full):**
  - `owner-brief-2026-10-27.md` (Paste A, Paste B, Addendum)
  - `grill-decisions-2026-10-27.md` (G1-G15)
  - `phase1-worksheet.md` (U01-U106) and `goal-01.md`
  - `research/oryzo-teardown.md`, `refs-r1-r3.md`, `refs-r4-r5.md`, `video-claude-video-2-lesson.md`, `current-deck-map.md`
  - `contract-and-section-map.md`, `presenter-guide.md`, `index.html` (15 scenes and their notes)
- **Method:** the `scroll-craft` planning steps: brief, journey, grammar, feeling curve, peak, signature move, dimensional scenes and mobile composition.
  - The receipts are Sequential Thinking thoughts 1-4 on 2026-10-27.
  - The engine is GSAP + ScrollTrigger (the owner named it). `scrollcraft.js` is not used.
  - ElevenLabs is the only media generator (G10). Media appear below as briefs only, and nothing was generated.
- **Shared copy:** section 4 is identical to `experience/g01-slide-spec.md` (checklist lines and the viewport, motion and data rules, v2). If one changes, change both.

---

## Spine fix round 3 receipt (2026-10-27, night, v2.1)

- **Trigger:** the fresh CR-VF-SPINE-2 critic FAILED v2 with 3 material findings (NV-01, NV-02, NV-03) and 10 minor ones (`.claude/goals/2026-10-27-gtp-cinematic-eco/critics/cr-vf-spine-2.md`).
- **Policy (orchestrator, PROVISIONAL):** build everything the owner asked for and time it honestly; cuts go on the ranked owner list with what is lost; goal shortfalls go to Tier 4, HELD; owner words win and builder wording is labelled PROVISIONAL; skill names on screen are checked against the live repo.
- **Result:** 142 beats, **4195 s = 69:55** (v2: 69:00). `sceneSeconds` v2.1 = `[120,180,370,340,285,435,325,260,340,180,310,325,180,280,265]`. Tiers 1-3 end at 61:00, the outer edge of the rehearsal window (60:00 +/- 60 s) with no margin, with no goal floor lost and three owner-OK readings. The first total at or under 60:00 needs Tier 4 (rank 33, 59:55). Six owner questions (Q-DATA is new).
- **Scenes 01-03:** the card bodies are not rewritten (G01 is building them). Only the spine's "v2 timing" annotation under the scene 03 card changed; the card changes are G01 follow-ups F-05 and F-08 (section 11).
- **Status:** PROVISIONAL (A1.2). A fresh CR-VF-SPINE-3 critic must pass v2.1 before G02-T05 and G03-T02 use it (A2.1).

| Finding | Fix in v2.1 | Where |
|---|---|---|
| NV-01 the 40 s write-down had no seconds | It is a planned wait counted in its beat: 03-4 = 47 s GATHER + 40 s writing = 87 s, scene 03 = 370 s. Timing rule 3 now says planned waits never sit in the 15% slack. Dropping it is K31 (Tier 4: goal-01 journey row and G01-T09 proof item). Every cut-list total and claim was recomputed | 03-4; timing §1-§4, §8; F-05, F-08 |
| NV-02 skill names absent from the named repo | Checked with `gh api` on 2026-10-27: the repo now has cro, popups and signup; commit 30f9b9a (2026-05-14) renamed page-cro, popup-cro and signup-flow-cro and moved form-cro into cro/references/form.md. 08-8 and 15-4 show the current names and github.com/coreyhaines31/marketingskills/tree/main/skills; 09-14 adds the old names with the pinned URL (commit f3990f7). K02 no longer claims links on /skills/ (G07-T08 has no such part) | 08-8, 09-14, 15-4; D-26; K02 |
| NV-03 K17 hid a G04-T08 shortfall in Tier 2 | K17 keeps only the 10 s step-through trim (Tier 2); dropping the shatter is K30, Tier 4, GOAL SHORTFALL, HELD. Every Tier 1-2 row was re-checked against goal-01..07 text (timing §8 lists the checks); no other floor was found. Three honest Tier 2 rows were added (K32, K33 and K34, 45 s) | timing §8 |
| NV-m1 builder line labelled as the owner's | "Copy what works. Then fill the gap." is PROVISIONAL builder copy (D-12), shown with the owner's own words beside it | 05-7, 06-14; D-12; VS-02 row |
| NV-m2 consent scope | The consent card names the questionnaire answers and the processors (PROVISIONAL wording); the questionnaire is business-level, aggregate and optional; D-21 says no personal contact details are typed; Q-DATA routes the wording to OG-DATA | 04-1, 04-2, 13-6; D-21; Q-DATA |
| NV-m3 per-slot reading used before Q-REVEAL | The binding A1.4 wording ("from scene reveal") is the default. The helper's prefilled question starts at 04-2 with the other runs (1325 s of head start), so every slot is live under either reading. The helper input is prefilled, never typed (R6 now matches 08-3) | timing §1, §4, §9; legend; R6; D-27; scene 04 and 08 cards |
| NV-m4 blocked live seconds | 330 of 780 live-result seconds are not runnable today (05-6, 06-13, Tool A, Tool B); the script recomputes the figure | timing §2 |
| NV-m5 unit labels | U78: 5 of 13 sourced, PRESENT as beat; U31: % split WEAK until F-04; U100: reason given; U73: no fallback claimed for LS-2 or LS-4 | timing §6 |
| NV-m6 run tray | 04-2's tray now lists Last 30 Days and the AI helper | 04-2 |
| NV-m7 mis-tiered rows | K08, K09 and K10 are Tier 2; Tier 1 now means nothing the owner asked for leaves the deck | timing §8 |
| NV-m8 checker gaps | Case-insensitive "don't copy" scan over the cards and the beat table; card text must equal beat text; new checks for clocks, scene starts, head starts, live-result and not-runnable seconds, planned waits, the run tray, skill paths, unit totals and labels, slot sourcing counts, tier labels and every cut-list claim | `scripts/check-spine-v2.py` |
| NV-m9 stale text | D-09's total, the section 10 critic line and the DD-03 seconds (about 25) corrected; the scene 03 "Talk minutes" label is G01 follow-up F-08 | D-09; section 10; 3.3; F-08 |
| NV-m10 15-6 too tight | 15-6 = 75 s (35 s talk + 40 s writing); K32 lets the owner take it back to 60 s | 15-6; K32 |

## Spine v2 receipt (2026-10-27, night)

- **Trigger:** the fresh CR-VF-SPINE critic FAILED the A2.6 spine with 16 material and 11 minor findings (`.claude/goals/2026-10-27-gtp-cinematic-eco/critics/cr-vf-spine.md`). Root cause: the owner's content plus the goal floors do not fit 60 minutes, and A2.6 hid that with ID-only coverage and title-card beats.
- **Policy (orchestrator, PROVISIONAL, on the owner's veto list):** build every beat the owner asked for with a p-range, seconds and on-screen substance; time it honestly; never compress below what a beat needs; put every possible cut on a ranked owner list; the owner's words always win (A1.2, G02-Q8).
- **Result (totals updated in v2.1 by the round 3 receipt above):** 142 beats, **69:55** of real talk time, 9:55 over the 60-minute goal (v2 said 69:00 before the scene 03 write-down and 15-6 were timed honestly). `sceneSeconds` v2.1 = `[120,180,370,340,285,435,325,260,340,180,310,325,180,280,265]`. Nothing is silently cut. The ranked cut list (Option 0 keeps everything; Tiers 1-3 end at 61:00) and six owner questions are in `experience/story-spine-v2-timing.md` sections 8 and 9.
- **Single source:** the timing file's beat table and the scene cards below come from one beat list. `python scripts/check-spine-v2.py` re-checks the sums, p-ranges, card match, per-unit coverage (beat + p-range + seconds + substance) and the slot floors.
- **Status:** PROVISIONAL (A1.2) until the owner's acceptance is quoted (G01-T02A). A fresh CR-VF-SPINE critic must pass v2 before G02-T05 and G03-T02 use it (A2.1).

| Finding | Fix in v2 | Where |
|---|---|---|
| VS-01 live runs fall back before they start | Consent at 04-1, before every run. All volunteer runs (Engage skills, Tool A, Tool B) start together at 04-2 Submit and reach their reveals with 280-3010 s of head start. The helper's prefilled fictional question starts at 04-2 too (v2.1, NV-m3; in v2 it started at scene 08 arrival, 45 s before its reveal) | 04-1, 04-2; timing §4; D-21; Q-REVEAL |
| VS-02 "Don't copy them" reversed the owner | PROVISIONAL builder copy on screen (D-12), carrying the owner's meaning, not his own line (v2.1, NV-m1): "Copy what works. Then fill the gap." Average = copying only; Good = their recipe plus the gap | 05-7, 06-14 |
| VS-03 no channels or Slack | Channel picker: website chatbot, WhatsApp, social DMs, and the honest Slack answer | 09-2..09-5; D-24 |
| VS-04 no Claude + Claude Code beat; device owner unclear | 06-3 names Claude and Claude Code with the one-step how-to. Scene 06 owns the claude-video-studio devices (G02-T11); 12-9 reuses the same-prompt component for G04-T08; DD-11's default beat moves from 11 to 06 | 06-3..06-6, 12-9; D-22 |
| VS-05 ads short of every floor; pins counted | Named slots: AD-E1..E4 (06, sourced and browser-tested), AD-C1..C3 (08), AD-A1..A6 (11). Pins and the R1 reel are references and never count. Unsourced slots are HELD | timing §5; D-18 |
| VS-06 R1 labelled Average | R1: "Good" for 0-7.9 s, "Average" on its end card only | 08-5; D-18 |
| VS-07 B2B find and content generation not live | Live slots LS-2 (05-6, BLOCKED on the Apify key, PARTIAL) and LS-3 (06-2, path proven at 21.9 s) | timing §4 |
| VS-08 one slopmonster pair | Three real pairs (caption, product description, post idea), each with scores and at least 3 marked differences, plus Tumelo's | 06-9..06-12 |
| VS-09 no guideline beat in 06 | Current content, then Claude Design System guideline, then an on-brand asset | 06-7 |
| VS-10 teach-AI covered beauty only | Judge (design-loop rounds), recreate the look (Design System), recreate an interaction (G04-T05(d)) | 12-9..12-14; D-23 |
| VS-11 AI = Attract + Interact was a title card | A 40 s teaching beat: "AI" resolves into Attract and Interact beside a ghosted E and C, one line each on the difference | 11-1 |
| VS-12 no interaction signals; websites as links | Every ad card shows its public signals or "not public"; 12-3 shows what people do with ads; 3 websites in-scene (live frame or presenter live window, never a bare link) | 06-8, 08-7, 11-8, 12-3, 12-5..12-7 |
| VS-13 scenes 11, 13, 14, 15 unteachable in their minutes | Real times: 11 = 5:10, 13 = 3:00 (three exercises), 14 = 4:40, 15 = 4:25 in v2.1 (8 skills, with/without, conversion skills, 12 sites, plan card, QR) | timing §2 |
| VS-14 false skills claim | Skills named with verified sources (v2.1, NV-02): cro, popups and signup at github.com/coreyhaines31/marketingskills/tree/main/skills (MIT), with the names used before 2026-05-14 (page-cro, form-cro, popup-cro, signup-flow-cro) only beside a pinned commit URL (09-14); email-sequence from Anthropic's pack (in the download); whatsapp-sequences source not found, so never called downloadable | 08-8, 09-14, 15-4; D-26 |
| VS-15 deep-dive beats unplaced; heights unchanged | Every beat has a p-range and seconds; scroll heights revised (section 3.1) | section 3.2, 3.3 |
| VS-16 ID-only coverage | Per-unit table (beat, scene, p-range, seconds, substance) and the script check; every shortfall listed as HELD | timing §6, §7 |
| VS-m1 brand terms | Wordmarks labelled "logo pending brand-terms acceptance" until OG-BRAND; Instagram conflict HELD | 04-5; D-15; Q-INSTAGRAM |
| VS-m2 stale "consent in 13" text | Feeling curve, scene 12 exit and section 3.1 corrected; 13-6 is a recap only | section 0, 3.1, 3.2 |
| VS-m3 section 1 heading | Marked PROVISIONAL (G7 decided only "a new invented local product brand") | section 1 |
| VS-m4 live minutes | The earlier figure was 9.0 min, not 9.5; v2 counts the helper: 780 s of live-result beats | timing §2 |
| VS-m5, VS-m7 scenes 02-03 | Not rebuilt here (G01 is building 01-03 now): G01 follow-ups F-01..F-04 | section 11 |
| VS-m6 section 4 not identical | The spec's viewport, motion and data rules added; the 03 tag text aligned | section 4; F-06 |
| VS-m8 one QR for both tools | One QR per tool (QR-A, QR-B) plus QR-S to /skills/ | 14-12, 15-7 |
| VS-m9 U04 label | U04 = skills, GSAP, craft a story; U07 = Claude and Claude Code | timing §6 |
| VS-m10 U23 gaps | Response clock (09-6); review request on Google and social (09-10) | 09-6, 09-10 |
| VS-m11 education vs promotions chips only | Hero-brand examples plus an audience toggle (05-2); weak competitor post split for "what doesn't work" (05-4) | 05-2, 05-4 |

- **Superseded in the A2.6 receipt below:** R1 (deep-dive table), R2 (minutes), R3 (C1-C6, M1 and "Nothing is cut"), and R4's consent placement. R5-R8 still hold. R8's timer follows A1.4's binding wording (20 ± 2 s from scene reveal) until the owner answers Q-REVEAL, and R6's helper input is prefilled, never typed live (v2.1, NV-m3).
- **Untouched:** the structure of the scene 01-03 cards (G01 is building them now), the keep-sentence, the section 4 checklist lines, the owner's words and the 15 numbered scenes.
- **Why still 15 scenes:** every scene holds its beats on one topic. Splitting the longest (06 at 7:15) would add a 16th scene and two seams without saving time, and would break the owner's "one to fifteen".

## Amendment receipt A2.6 (2026-10-27, night)

- **Superseded by the Spine v2 receipt above where they conflict** (R1, R2, R3 and R4's consent placement).

- **Authority:** `.claude/goals/2026-10-27-gtp-cinematic-eco/amendment-A2.md` §A2.6 and §A2.7, and `amendment-A1.md` §A1.1, A1.4, A1.5, A1.6, A1.9 and A1.10 (A2 wins where they conflict). Precedence (A1.1): owner brief > owner answers > goal tasks + amendments > this spine > builder decisions. This receipt overrides any older text in this file. The lines it changed are marked "(A2.6)" in place.
- **Status:** every builder choice below, like every row of section 9, is **PROVISIONAL** until the owner's acceptance is quoted (G01-T02A; silence is not acceptance). A fresh CR-VF-SPINE critic must pass this amended spine before G02-T05 and G03-T02 use it (A2.1).
- **Untouched:** the keep-sentence, section 4 (still identical to `g01-slide-spec.md`), the owner's words, and the 15 numbered scenes.

### R1. Deep dives are no longer zero-height
Each deep-dive beat now has a default beat in the auto-scroll path. The default beat shows the substance of the owner sentences behind it, judged per unit, not a title card. Only the remaining expanded part is presenter-optional.

| DD | Scene | Owner units | Default beat in the auto-scroll path (what is on screen) | Default | Expanded remainder (presenter-optional) |
|---|---|---|---|---:|---:|
| DD-03 | 03 | U30, U37 (B2B: "Google Scraper ... Appify ... scrape those customers") | The B2B toggle runs two labelled steps (A1.10, VF-20): **Step 1, Google scrape** ("skincare brands Gauteng" business listings), then **Step 2, Apify enrichment** (website, socials, size). The cached, real run shows as a short list with names blurred on the public site. The POPIA direct-marketing line is on screen: use lead lists only within POPIA direct-marketing rules | 0.5 min | 1.0 min |
| DD-06 | 06 | U13, U20 (slopmonster with vs without; AI makes posts, captions, visuals) | Tumelo's real LinkedIn post, without and with slopmonster, side by side with both `deslop.py` scores and the removed AI tells marked. Then the AI tools wheel turns once, naming each tool and what it makes | 0.5 min | 0.5 min |
| DD-07 | 07 | U39, U40, U72 (SEO, AEO and GEO "dive a bit deeper"; AI can't go into social media by itself; check backlinks, citations, references) | SEO, AEO and GEO each land as a one-word beat with a one-line plain definition (Google ranks you; an AI answers with you; an AI cites you). Then backlinks and citations each get a plain one-line meaning and one example taken from the live (or cached) website check | 1.0 min | 1.0 min |
| DD-09 | 09 | U52, U53 (abandoned-cart funnel, onboarding funnel, keeping track; AI builds funnels, skills, CRMs, a custom build) | The abandoned-cart timeline fires its reminders at 1 h, 24 h and 72 h. The onboarding funnel sends the company's sections in turn. One screen of a custom CRM built with AI shows the same customer moving between boxes | 1.0 min | 1.0 min |
| DD-11 | 11 | U04, U07 (U04: skills, GSAP, Claude Video Studio, craft a story; U07: how to use Claude and Claude Code) | The chef analogy as one line, the five habits as a five-step strip (pick a style, use real references, write the brief in numbers, decide whether it loops, check frames not code), and one flip of the "Graphics / With media" toggle | 0.5 min | 1.0 min |
| DD-12 | 12 | U66, U67 (a bunch of websites and ads that look good; providers on interaction and appeal) | Two more real interactive websites shown in-scene where the site allows it (embed or live frame, attributed; a bare link does not count, U73), each with what you do there and how it pays off, plus one provider statement on interaction and appeal (quoted in under 15 words, linked) | 0.5 min | 0.5 min |
| | | | **Total** | **4.0 min** | **5.0 min** |

The expanded remainders (5.0 min) sit outside the 60 minutes and are presenter-optional. Each default beat is at least 30 s, above the A1.6 floor of 15 s.

### R2. Minutes re-fit to 60, including the default beats
Arithmetic:
- Overnight array `[2,3,5,4,5,6,6,4,4,3,4,3,2,6,3]` = 60.0 min.
- Add the deep-dive default beats: 03 +0.5, 06 +0.5, 07 +1.0, 09 +1.0, 11 +0.5, 12 +0.5 = **+4.0** → 64.0.
- Move the volunteer consent beat (A1.5: consent before the first run): 13 −0.5, 05 +0.5 = **0.0** → 64.0.
- Compress (each item is on the veto list in R3): 04 −0.5, 05 −0.5, 06 −0.5, 07 −0.5, 14 −1.5, 15 −0.5 = **−4.0** → **60.0**.

| Scene | Overnight | DD default | Consent move | Compression | **A2.6** |
|---|---:|---:|---:|---:|---:|
| 01 | 2 | | | | **2** |
| 02 | 3 | | | | **3** |
| 03 | 5 | +0.5 | | | **5.5** |
| 04 | 4 | | | −0.5 (C1) | **3.5** |
| 05 | 5 | | +0.5 | −0.5 (C2) | **5** |
| 06 | 6 | +0.5 | | −0.5 (C3) | **6** |
| 07 | 6 | +1.0 | | −0.5 (C4) | **6.5** |
| 08 | 4 | | | | **4** |
| 09 | 4 | +1.0 | | | **5** |
| 10 | 3 | | | | **3** |
| 11 | 4 | +0.5 | | | **4.5** |
| 12 | 3 | +0.5 | | | **3.5** |
| 13 | 2 | | −0.5 | | **1.5** |
| 14 | 6 | | | −1.5 (C5) | **4.5** |
| 15 | 3 | | | −0.5 (C6) | **2.5** |
| **Sum** | **60** | **+4.0** | **0.0** | **−4.0** | **60** |

**`sceneMinutes` (A2.6, PROVISIONAL):** `[2,3,5.5,3.5,5,6,6.5,4,5,3,4.5,3.5,1.5,4.5,2.5]`, sum 60. Live-run talk time inside the 60 drops from about 9.0 min (v2 correction, VS-m4) to about 6.0 min (05 1.0, 06 1.0, 07 1.5, 14 2.5). The scroll heights in section 3.1 are proposals; scenes that gained a default beat need more height, which G01-T03 sets.

### R3. For owner veto (compressions and moves) (WITHDRAWN by Spine v2: replaced by the ranked cut list in `story-spine-v2-timing.md` section 8)
| ID | Change | What is shortened | What stays |
|---|---|---|---|
| C1 | 04: 4 → 3.5 min | Shorter dwell on the second and third wheel landings (WhatsApp, Google Business Profile) | All 7 official logos (v2: text wordmarks until OG-BRAND, D-15), the "Ask AI" card, the alive view and why-it-fits, the verdict card |
| C2 | 05: live talk 1.5 → 1.0 min | Narration around the competitor scan. The wait is already capped at 20 ± 2 s (A1.4) | The recipe split, the gap scan, ~~"Don't copy them. Fill the gap."~~ (v2: this reversed the owner's words; the screen says "Copy what works. Then fill the gap.") |
| C3 | 06: live talk 1.5 → 1.0 min | Narration around Last 30 Days | The daily brief card, the habit week with the brief as a daily step |
| C4 | 07: live talk 2.0 → 1.5 min | Narration around the website check | The exploded search, the 30/60/90 track, the authority page |
| C5 | 14: 6 → 4.5 min; live talk 4.0 → 2.5 min | Walk-through time for the Tool A panels and the Tool B ICP + brand kit + one asset | Both tools run live (or show their tagged cached run), the persona card returns filled, both tool QR codes |
| C6 | 15: 3 → 2.5 min | Shorter box-open and skill-card rise | The 8 skills, the learn cards, the 40 s 7-day test, the QR to /skills/ |
| M1 | Consent beat 0.5 min: from 13 to the start of 05's first run | Nothing; the beat moves (A1.5) | Scene 13 keeps its 1.5 min Responsible AI lesson. If the owner accepts D-07, the beat moves back to 13 |

~~Nothing is cut.~~ (v2: false against the goal floors, VS-05 and VS-16; see the Spine v2 receipt.) Any cut is HELD for the owner (A1.6).

### R4. Live targets and consent (A1.5)
- **D-06 and D-07 are PROVISIONAL.** They apply only if the owner accepts them.
- Default until then: the Engage and Convert in-scene live runs target the **volunteer's consented business**. The consent card (OG-DATA wording) is shown and accepted **before the first run**, and no run happens without the consent flag. Each named skill is invoked separately.

### R5. Amina assets (A1.9)
D-01 changes: `amina-lunch-3d.*` and `amina-ad-motion.mp4` are retired **only after approved replacements are integrated**. Until then they stay where they are.

### R6. Live helper, scene 08 (A1.10, A2.7)
On stage the AI helper is live through the local presenter runner. The helper uses **fictional demo details only**, labelled "Demo data" (v2.1: prefilled, never typed live on stage; 08-3, Q-HELPER). Real participant details are never typed. Typed text goes to Anthropic through `claude -p`, so the earlier "stays on 127.0.0.1" claim is withdrawn. A tagged scripted fallback shows within 1 s of an error, or at 20 ± 2 s from scene reveal if the answer is late (A1.4). The public deck keeps the scripted demo, labelled as such.

### R7. Real ads (A1.10, A2.7)
Every real ad example must be embeddable in-scene: the official embed inside an attributed card. Link-only ads do not count toward the minimums (≥4 in G02, ≥3 in G03). Where a candidate ad allows no embed, pick a different real ad. An offline link card is a failure state only.

### R8. In-scene runs and the fallback contract (CR-GC-13, A1.4)
In-scene live runs call the local presenter runner (G02-T02R; decision register "In-scene live runs use a local presenter runner"), not the Tool A backend, and each named skill is invoked separately (A1.5). Every live slot follows the one fallback contract: the tagged cached run shows within 1 s of an error or unreachable runner, and at 20 ± 2 s from scene reveal if the complete result is late, even while progress streams. Scene 14's Tool A run still uses the Tool A backend.

### R9. Lines changed in place
Section 0 row 8; section 2 journey (scene 13); section 3.1 rows 03-15; section 3.2 card notes; scene cards 03-15 (talk minutes, DD-03/06/07/09/11/12, scene 05 consent, target, runner and ads, scene 06 target, scene 07 target and runner, scene 08 helper and offline card, scene 11 ads, scene 13 consent); section 3.3 (`sceneMinutes`, live total, overflow table); section 8 items 3-4; section 9 header and D-01, D-06, D-07, D-08, D-10, D-14, D-18; section 10.

---

## 0. Brief (scroll-craft Step 0)

Authored under explicit delegation: the overnight autonomous mode in `decision-register.md` ("do not ask any questions... find a way to resolve"). The owner's words are quoted where he supplied them. Everything else is an authored decision, listed for veto in section 9.

| scroll-craft topic | Answer |
|---|---|
| 1. Vibe and references | A warm, physical teaching film. References: oryzo.ai ("this is what success looks like"), R5 floating products, R1 continuous product reel, R2 click-to-burst, R3 transitions that carry the message, and R4 type set in depth. |
| 2. Journey in his words | G8: "Open > ECO loop > Engage > Convert > Optimize > Attract > Interact > Responsible AI > live participant tools (A + B) > where to learn + skills download." |
| 3. Energy curve | Calm open. Rising through Engage. Brisk through Convert. A deliberately quiet Optimize. The loudest moment is Attract. Playful Interact. A sober Responsible AI. A live, high-stakes finale. A calm, resolved close. |
| 4. Feeling and the one moment | See the feeling curve below. The peak is in scene 11. |
| 5. What no other deck does | One product follows the audience through all 15 scenes. At the peak, a flat product photo rebuilds itself, layer by layer, into a floating ad. At the end, the audience's own business goes through the same tools live. |
| 6. Distance from premium-minimal | Premium editorial with tactile warmth. Not neon-tech: the "R3 look" is the cautionary example. |
| 7. One world or distinct scenes | One persistent stage (oryzo's fixed canvas with a protagonist), cut into 15 timed acts that stop and wait for Next. The owner's "one to fifteen" model is kept. |
| 8. Assets on hand | No usable brand assets. The Amina assets are retired only after approved replacements are integrated (A2.6; section 9, D-01). Everything is generated through ElevenLabs after OG-EL-AUTH and OG-SPEND, or built in code. |

### Grammar: "Presented film" (a new grammar, authored here)

None of scroll-craft's eight grammars fits a presenter-driven 60-minute lecture:

| Grammar | Why it loses |
|---|---|
| Filmic one-shot | It forbids visible sequence and more than one entry point. The deck needs Next, the Overview and `#NN` jumps. |
| Chaptered editorial | It bans pinned crossfade acts and a scrub hero, which are the core of the owner's "keeps moving". |
| Live surface | It is right for scene 14 only. It bans the marketing chrome the other 14 scenes need. |
| Continuous world | It bans section boundaries, but every scene must stop and wait for Next. |
| Typographic poster | It bans photographic ground and scrub, but R5 floating products are mandatory. |
| Gallery / catalog | It bans an argument-shaped act, and ECO is an argument. |
| Split stage | It fits Good vs Average, but only as a device inside a scene, not as the whole deck. |
| Rhythmic cutlist | It caps acts at about 1.4 viewports, and talk time needs long, living holds. |

**Presented film, defined:**
- **The stage:** one fixed stage layer holds one protagonist (section 6) that never leaves.
- **The acts:** 15 timed acts, each auto-scrolling from arrival and stopping just before the next act (G9).
- **Navigation:** the presenter owns it (Next, Space, speed, Notes, chapter rail) in the presenter chrome. The audience sees only chapter colour.
- **Seams:** every act ends on a payoff, and its focal element becomes the next act's entry.
- **The ending:** the close hands over a takeaway (QR and download) and holds.
- **Bans:**
  - a static hold
  - an audience-layer paragraph longer than 2 lines
  - a hard cut without a shared element
  - scroll cues or arrows
  - audience-visible `01 / 15` counters (they stay in the presenter bar only)
  - em dashes in visible copy
  - text baked into generated images
  - invented live counters

### Fingerprint gate

`scrollcraft/FINGERPRINTS.md` is empty, so the gate passes trivially. This deck's row is appended when the deck ships (G07), not now: this task may write only two files.

| Dimension | Value for this deck's row |
|---|---|
| Grammar | Presented film |
| Nav treatment | Presenter-owned (Next, Space, rail). Audience sees colour only |
| Hero device | Layered product stage with the protagonist |
| Act sequence | 15 timed acts in 5 chapters, with the peak at act 11 after a quiet act |
| Close pattern | Download box with QR and a 7-day commitment |
| Signature move | Layer switchboard rebuild |

### Feeling curve (written before the scene table, one line per act)

| Act | Feeling | What on screen causes it |
|---|---|---|
| 01 | Curiosity | A product nobody knows floats in a dark warm studio, lit like a photograph |
| 02 | Clarity | Three words orbit the product, and each one steps forward when clicked |
| 03 | Doubt, then recognition | "Our customer is women 25-34" is stamped "A feeling", then the data streams contradict it |
| 04 | Playful choice | A volunteer answers the questionnaire; then a wheel of 7 platforms bursts out and spins, and the chosen platform comes alive on the phone |
| 05 | Intrigue | A live scan lays real competitors' posts on a shelf and splits one open to show its recipe |
| 06 | Empowerment, then relief | AI bursts out 5 kinds of content, a generic caption shatters into a human one, and the week fills itself |
| 07 | Confidence | The search bar lifts off the phone and an AI answer panel cites the brand's page |
| 08 | Momentum | The product jumps out of an ad and lands inside a chat, and details fill in |
| 09 | Trust | The order rides a track through welcome, WhatsApp, quote, invoice and review |
| 10 | Sober honesty (quiet) | The same week of posts seen through a results lens, and 1,200 likes beside 0 inquiries |
| 11 | **Awe (the peak)** | "AI" resolves into Attract and Interact; Tuesday's flat failed photo rebuilds itself, layer by layer, into a floating studio ad |
| 12 | Delight, then insight | A lit shop window where every tap makes the product answer; then AI is judged and taught to recreate what good looks like |
| 13 | Responsibility | A red pen strikes AI's false claims, and the room sorts what is safe to paste into AI |
| 14 | Excitement and ownership | That volunteer's real business comes up on the pedestal |
| 15 | Resolve | The product settles into a gift box of skills, the lid closes on a QR code, and everyone writes one test |

No two adjacent acts share a feeling. Act 10 is deliberately quiet so the peak has silence in front of it.

- **The peak, as a visitor would say it:** "they took a terrible phone photo of a gift box and, one click at a time, it turned into a floating ad that looked like a real brand campaign."
- **Tell-someone sentence:** "It's the presentation where one little bottle followed us through the whole hour, a bad product photo turned into a real-looking ad in front of us, and then they ran someone in the room's business through the tools live."
- **Deck signature move:** the **Layer switchboard** (scene 11). Five layers (Light, Depth, Break-out, Offer, CTA) add one at a time to an average photo. Each can then be toggled off and on by click, so the room sees which single decision made it "good". This is coded in the page, not a kit device. It echoes the "Every layer, off" idea from the V1 lesson.
- **Authored silences:**
  - the near-black hold at the end of act 10 (p 0.88-0.92), before the peak;
  - the reveal of a live result in acts 05, 06, 07, 08 and 14. The runs start at 04-2, so the result is usually waiting; a late one holds for at most 22 s (A1.4), and the scene keeps moving.

### Device families (at least 4, never the same family twice in a row)

| Act | 01 | 02 | 03 | 04 | 05 | 06 | 07 | 08 | 09 | 10 | 11 | 12 | 13 | 14 | 15 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Device family | parallax | spotlight (orbit) | flow + Flip | dial (burst) | live surface | reveal (shatter) | parallax (exploded) | Flip (screen-to-world) | pan | reveal (lens) | layered scrub | pointer | kinetic | live surface | converge + pin |

There are 10 distinct families, and no family repeats in adjacent acts.

---

## 1. Hero brand (decision G7 decided only "a new invented local product brand"; Amberkloof and Tumelo are PROVISIONAL builder choices, D-01 to D-03)

### Amberkloof: small-batch botanical body care, Pretoria East

- **What it sells:** body and face care made in small batches from South African botanicals (marula, rooibos, buchu, baobab). It sells at weekend markets, through an online shop and WhatsApp orders, and in refill packs to guesthouses and spas. The team is two people with a part-time packer.
- **Why this category:**
  1. The R5 floating-product look is natively amber glass, jars, tins and kraft boxes in matte real textures under warm studio light.
  2. The Attract argument (beauty, retail packing, merchandising, G12's "perfume counter") lands without a metaphor.
  3. Responsible AI gets a concrete stake: AI writes "heals eczema" and "clinically proven", and the room sees why accuracy matters.
  4. The persona reveal works for any audience (gift buyers are not who the owner assumed). The B2C brand even hides a B2B segment (guesthouses), which proves U37 ("it doesn't matter").
- **Name check:** a web search on 2026-10-27 for "Amberkloof" (alone, and with skincare or botanicals) found no brand or company. "Kloof" is a common South African landscape word, so "Amberkloof" reads local. This was a web search only, not a CIPC or trademark-register search (section 9, D-03).

**Hero products** (every render follows the R5 spec in `refs-r4-r5.md` §3. No text or logos appear inside any image. The brand name is set in HTML.)

| ID | Product | One-line visual description (R5) |
|---|---|---|
| P1 | **Marula Face Oil, 30 ml (THE PROTAGONIST, "the bottle")** | An amber glass dropper bottle with a brushed-brass collar, a caramel rubber bulb and a blank kraft label band. One golden drop hangs from the pipette. It floats weightless, turned 30 degrees, with a warm rim light on its right edge |
| P2 | Rooibos Body Butter, 200 ml | A wide frosted cream-glass jar. Its travertine-look lid floats a hand's width above it, and the whipped butter has a soft swirl peak |
| P3 | Buchu Hand Wash, 250 ml | A matte sand-coloured bottle with a brushed-bronze pump. A fresh buchu sprig floats beside it |
| P4 | Baobab Lip Balm, 15 g | A small brushed-aluminium tin with its lid tilted open, showing caramel balm with a fingertip swirl |
| P5 | The Gift Set | A kraft carton (printed by Tumelo, below) with a linen ribbon and a dried fynbos sprig. The lid is lifted to show P1, P2 and P4 nested in shredded kraft paper |
| P6 | Botanical satellites | A marula fruit half (pale green skin, cream flesh, stone), a cluster of rooibos needle-leaves, and a buchu sprig. Each is a separate cutout |

**Voice:**
- warm, plain and a little dry, like the founder talking at a market stall;
- South African English, with "you" more than "we", and short sentences;
- no medical claims, ever. "Gentle" is fine. "Heals" never is.
- Sample line: "Two drops at night. That's it. Marula does the quiet work."

The slopmonster "with" runs (scene 06) use this voice card.

**Palette** (it sits inside G14, so the brand bridges both chapter palettes)

| Token | Hex | Use |
|---|---|---|
| Amber glass | `#B8692A` | Brand accent and the bottle highlight. Use it as a large-text accent only on cream |
| Kraft | `#C9A57A` | Packaging, chips |
| Marula cream | `#F3EAD8` | The deck's existing cream. Ground for ECO teaching scenes |
| Buchu green | `#153C2F` | The deck's existing teaching green. Amberkloof's secondary colour, so the brand and the ECO chapter share one green |
| Espresso | `#1E1A17` | Text on cream, the studio's near-black |
| Studio set (G14 warm) | sand `#BEAB97`, stone `#A79887`, taupe `#9F836B`, caramel `#AA7B55` | Product and ad scenes only (R5 sampled) |

Body text stays espresso on cream, or cream on green or espresso. Check each pair at 4.5:1 or better before shipping (oryzo checklist item 9).

**Customers** (all illustrative. These are the scene 03 groups from an "illustrative sample of 60 orders")

| Group | Who (age group, sex, area, circumstances) | Share in the sample |
|---|---|---|
| The owner's assumption | "Women 25-34 who love natural skincare" (stamped "A feeling") | not a group in the data |
| Gift planners | 35-49, mostly men by the checkout survey, Midrand and Centurion. Busy, buy twice a year before birthdays and December, want it wrapped and delivered. Found on Instagram, order on WhatsApp | 24 of 60 |
| Self-care regulars | 25-44, mostly women by the survey, Pretoria East. Sensitive skin, reorder every 6-8 weeks. Found on Google and at markets | 21 of 60 |
| Guesthouses and spas (B2B inside a B2C brand) | Owner-managers of 4-12 room guesthouses in Gauteng and Limpopo. Monthly refill orders. Found through Google Business Profile and a referral | 15 of 60 |

Race: shown on the persona card only as a field marked "Only if they tell you". The POPIA line is on screen (G3).

### B2B swap-in: Tumelo Print & Pack (Johannesburg)

- **What it sells:** a 12-person label and carton printer that sells custom kraft gift boxes, product labels and sleeves to small product brands. **It prints Amberkloof's gift box (P5).** So the B2B story rides the same object, and the protagonist thread never breaks.
- **ICP ("The Launching Founder"):**
  - Industry: small product brands (skincare, candles, sauces, coffee)
  - Company size: 1-10 staff
  - Area: Gauteng
  - Buyer role: the founder-owner
  - Circumstances: launching or rebranding, needs 500-2,000 units before a market date
  - Found us on: Google search and LinkedIn
- **Channels:** LinkedIn, Google Search and Google Business Profile, WhatsApp for quotes.
- **Pipeline:** Quote, Proof, Order, Invoice, Delivery, Reorder.
- **Name check:** a web search on 2026-10-27 for "Tumelo Print" found no company. This was not a CIPC or trademark search (section 9, D-03).
- **Where it swaps in:** each scene card has a "B2B swap" line. Scene 03 (persona toggle) and scene 09 (pipeline) use Tumelo as their core example.

---

## 2. Journey (owner order G8) and the unit map

```
Open      01 Open: Be found. Be chosen. Keep learning.
ECO       02 Growth is a loop
Engage    03 Who?   04 Where?   05 What?   06 Make it yours   07 Be found
Convert   08 Capture   09 Follow up
Optimize  10 Optimize
Attract   11 Attract (PEAK)
Interact  12 Interact
Resp. AI  13 Use AI responsibly   (consent was given at 04-1; every run, Tool A, Tool B and the helper's fictional question included, started at 04-2, D-21)
Tools     14 Your turn: Tool A + Tool B live
Learn     15 Keep learning: skills download, where to learn, 7-day test
```

This keeps 15 numbered scenes. No 16th scene is needed:
- the content plan and consistency topic (T5) folds into 06, where the current deck already holds the Mon-Fri habit;
- Responsible AI takes slot 13; "teach AI" (judge, recreate the look, recreate an interaction) closes scene 12, after both Attract and Interact, as Paste A orders it (v2, D-23);
- the two tools share 14, and learn plus download is 15 (G13 puts the QR on the final scene).

### Units mapped to scenes (v2: generated from the beat list)

Every deck unit below has at least one beat with a p-range, seconds and on-screen substance; the per-unit table with all of them is section 6 of `story-spine-v2-timing.md`. A unit listed by ID only would fail `scripts/check-spine-v2.py`.

| Scene | Units with a beat in this scene |
|---|---|
| 01 Open: Be found. Be chosen. Keep learning. | U01, U02, U03, U05, U77, U80, U81, U82, U84, U86, U87, U88, U89, U90 |
| 02 ECO loop: Growth is a loop. Make each turn useful. | U05, U27, U54, U76, U91, U92, U93, U94, U95, U96 |
| 03 Engage > Who? | U03, U05, U09, U18, U27, U28, U30, U31, U32, U37, U76, U79, U97, U98, U99, U100, U101, U102 |
| 04 Engage > Where? | U05, U06, U09, U10, U18, U19, U25, U28, U29, U33, U37, U73, U76, U81 |
| 05 Engage > What? | U28, U30, U34, U35, U36, U37, U41, U42, U73, U76, U81 |
| 06 Engage > Make it yours (AI content, voice, habit) | U01, U02, U04, U06, U07, U11, U13, U20, U21, U22, U37, U38, U42, U43, U66, U73, U76, U78, U79, U80, U81 |
| 07 Engage > Be found (website, SEO/AEO/GEO, 30/60/90) | U05, U37, U39, U40, U41, U59, U60, U70, U71, U72, U73, U76, U81 |
| 08 Convert > Capture | U05, U23, U37, U44, U45, U46, U47, U48, U68, U73, U76, U78, U79, U81, U82 |
| 09 Convert > Follow up (where AI answers, funnel, pipeline, reviews) | U05, U14, U23, U37, U44, U48, U49, U50, U51, U52, U53, U76, U81 |
| 10 Optimize: what worked, and for whom? | U05, U24, U37, U54, U76, U81 |
| 11 Attract (THE PEAK) | U01, U02, U05, U37, U62, U63, U64, U66, U68, U76, U78, U80, U82, U84 |
| 12 Interact, then teach AI | U05, U07, U08, U11, U25, U37, U62, U65, U66, U67, U68, U69, U76, U79, U84 |
| 13 Use AI responsibly | U05, U25, U37, U73, U76, U101 |
| 14 Your turn: Tool A + Tool B live | U05, U06, U09, U11, U21, U26, U29, U37, U55, U56, U57, U58, U59, U60, U61, U81 |
| 15 Keep learning (skills download, where to learn, your 7-day plan) | U05, U15, U26, U48, U76, U77, U87 |
| Process units (no beat; receipt in the timing file, section 6) | U12, U16, U17, U74, U75, U83, U85, U103, U104, U105, U106 |

---

## 3. Scene table

### 3.1 Summary

**v2.1 (PROVISIONAL, generated from the beat list).** Talk seconds are real; the total is over 60:00 and the cut list is the owner's. Scroll heights: 100vh plus 45vh per beat (60vh per beat in scene 11), scenes 01-03 unchanged. Live slots and their start times: timing file section 4.

| # | Title (working) | Chapter / palette | Talk (s) | Talk (min) | Live-result s | Beats | Scroll height |
|---|---|---|---:|---:|---:|---:|---|
| 01 | Open: Be found. Be chosen. Keep learning. | Open / warm studio to green | 120 | 2 | 0 | 5 | 200vh |
| 02 | ECO loop: Growth is a loop. Make each turn useful. | ECO / green and cream | 180 | 3 | 0 | 4 | 240vh |
| 03 | Engage > Who? | Engage / cream | 370 | 6.167 | 0 | 6 | 340vh |
| 04 | Engage > Where? | Engage / cream, platform tints | 340 | 5.667 | 0 | 11 | 600vh |
| 05 | Engage > What? | Engage / deep green | 285 | 4.75 | 190 | 8 | 460vh |
| 06 | Engage > Make it yours (AI content, voice, habit) | Engage / warm studio | 435 | 7.25 | 135 | 15 | 780vh |
| 07 | Engage > Be found (website, SEO/AEO/GEO, 30/60/90) | Engage / cream | 325 | 5.417 | 175 | 11 | 600vh |
| 08 | Convert > Capture | Convert / warm to cream | 260 | 4.333 | 60 | 10 | 560vh |
| 09 | Convert > Follow up (where AI answers, funnel, pipeline, reviews) | Convert / green | 340 | 5.667 | 0 | 15 | 780vh |
| 10 | Optimize: what worked, and for whom? | Optimize / dark green, amber data | 180 | 3 | 0 | 5 | 340vh |
| 11 | Attract (THE PEAK) | Attract / warm studio | 310 | 5.167 | 0 | 10 | 700vh |
| 12 | Interact, then teach AI | Interact / warm dusk | 325 | 5.417 | 0 | 16 | 820vh |
| 13 | Use AI responsibly | Responsible AI / cream, red-pen accent | 180 | 3 | 0 | 6 | 380vh |
| 14 | Your turn: Tool A + Tool B live | Tools / green workbench | 280 | 4.667 | 220 | 13 | 700vh |
| 15 | Keep learning (skills download, where to learn, your 7-day plan) | Learn / cream to warm | 265 | 4.417 | 0 | 7 | 420vh |
| | **Total** | | **4195** | **69.92** | **780** | **142** | |

### 3.2 Scene cards

How to read a card:
- **Motion beats** use the scene's scroll progress `p` from 0 to 1. Auto-scroll stops at `p ≈ 0.92`, so the next scene is not yet visible (G9).
- **Interaction holds:** a click on an in-scene control holds auto-scroll. Next always moves on and restarts motion within 1 s.
- **Live-run beats (v2):** consent is accepted at 04-1; every run starts at 04-2 Submit, the AI helper's prefilled fictional question included (v2.1). At the slot's beat the result shows live. The tagged cached run shows within 1 s of an error or unreachable runner, and at 20 ± 2 s from scene reveal if the complete result is late (A1.4, binding; the per-slot reading waits on Q-REVEAL). The scene content area keeps moving during any wait (a spinner is not motion).
- **Deep-dive beats (v2):** each DD default is a numbered beat with its own p-range and seconds (section 3.3 lists them); only the expanded remainder is presenter-optional.
- **Beat lines (v2, scenes 04-15):** `ID · p-range · seconds · what is on screen`. Scenes 01-03 keep the p-range lines of the cards G01 is building; their seconds and units are in the timing file, and their changes are G01 follow-ups (section 11).
- **"Exit becomes entry":** names the shared element across the seam (oryzo move 4).

#### Scene 01 · Open: "Be found. Be chosen. Keep learning."
- **One point:** In one hour you'll learn how a small business gets found, gets chosen and keeps learning. One product will show us how.
- **Units:** U86, U87, U88, U89, U90 (plus all-scene units).
- **Talk minutes:** 2 (no live run).
- **Interaction:** an opener show of hands. The presenter can drag or tap the bottle to turn it (turntable frames, response within 100 ms).
- **Motion beats:**
  - 0.00-0.08: arrive on warm near-black. The bottle (P1) is already on the travertine plinth under one key light. The label "Sales, Marketing and AI" settles top-left, large (S1-03).
  - 0.08-0.30: the plate warms to the studio (L0 scale 1.00 to 1.04 push-in). "Be found." "Be chosen." "Keep learning." land line by line (SplitText), and the giant word "found" slides behind the bottle (type in depth).
  - 0.30-0.55: the bottle turns 0 to 60 degrees on the scrubbed turntable while a light sweep crosses the glass. The satellites (marula half, rooibos, buchu) drift in at different depths (L6 parallax 1.2).
  - 0.55-0.75: the opener card fades up bottom-left. Idle float keeps the hold alive.
  - 0.75-0.92: three small dots marked E, C and O start to orbit the bottle. The colour bridge begins (green creeps in from the frame edges). Stop.
- **Signature move (scene):** a dimensional layered hero, built in planes: plate (L0), stone blocks (L1), plinth and bottle (L2), satellites (L6), light sweep (L8), with the headline set between the planes.
- **Exit becomes entry:** the E, C and O dots grow into the orbiting words of scene 02. The bottle shrinks to the orbit's core.
- **Live run:** none.
- **Good vs Average:** none labelled. The moving, dimensional open is itself the contrast to the old static title slide.
- **Actual ad example:** none.
- **B2B swap:** none.
- **Opener directions** (T04 writes 3 options in the notes, run through slopmonster; OG-OPENER):
  - (A) Question: "Who has posted on three platforms this month and still can't tell which one brought in a customer?"
  - (B) Product: "This bottle doesn't exist. In the next hour we'll find out who buys it, where they hang out, and how a like becomes a sale. Then we'll do it for one of your businesses."
  - (C) Challenge: "Hands up if you know who your best customer is. Keep it up if you could prove it from your records."
- **Media:** M01, M02, M03, M04, M09, M10.
- **The current ECO compass image:** it leaves the stage in 01. The compass ring returns as the orbit track in 02 (D-19).
- **v2 timing:** 120 s; beats 01-1..01-5 in `story-spine-v2-timing.md` (10, 29, 33, 26, 22 s). No change to this card.

#### Scene 02 · ECO loop: "Growth is a loop. Make each turn useful."
- **One point:** Engage gets attention. Convert turns it into a clear next step. Optimize learns what worked, why, and for whom.
- **Units:** U27, U54, U91, U92, U93, U94, U95, U96.
- **Talk minutes:** 3 (no live run).
- **Interaction:** click Engage, Convert or Optimize. A click holds auto-scroll on that state. Next moves on.
- **Motion beats:**
  - 0.00-0.12: the three words orbit the bottle at equal size, on a flattened ellipse (T14). The orbit ring passes in front of and behind the words (T11). Headline: "Growth is a loop. Make each turn useful."
  - 0.12-0.40: **ENGAGE** swings to front-centre and grows 2.5 times. Convert and Optimize step aside to the edges at 45% opacity. Underneath, four catalyst chips (a question answered, a striking picture, an offer, a story) burst into reactions (like, comment, save, message). An example bubble reads "Is this OK for sensitive skin?"
  - 0.40-0.70: **CONVERT** takes the centre.
    - Back-link: "Engagement got their attention."
    - Headline: "While you have their attention, give them a clear next step."
    - Line: "You can't convert people you don't know."
    - A form fills Name, Surname, Email.
    - Tactic 1: get their details while they engage. Tactic 2: offer value (a free 5 ml sample for an email).
  - 0.70-0.92: **OPTIMIZE** takes the centre.
    - Two lanes (engagement, conversion) feed in.
    - FAILURES rise with thumbnails: "no engagement, no conversion" and "engagement, no conversion".
    - SUCCESSES rise: "drove both", a WHY chip, and a TO WHOM chip, which is the largest. Stop.
- **Signature move (scene):** click-to-centre orbit around the protagonist.
- **Exit becomes entry:** the TO WHOM chip lifts off, flies at the camera and becomes the giant "?" of "ENGAGE · WITH WHO?" in scene 03.
- **Live run:** none.
- **Good vs Average:** none.
- **Actual ad example:** none.
- **B2B swap:** none (Tumelo enters in 03).
- **Media:** none new. The post thumbnails are crops of the B1 composites (M03 on M01).
- **Spec:** section 4, S2-01 to S2-53.
- **v2 timing:** 180 s; beats 02-1..02-4 (23, 55, 59, 43 s). G01 follow-up F-03 (S2-17).

#### Scene 03 · Engage > Who?
- **One point:** You probably don't know your best customer yet. Start with the people who actually buy, inquire, and come back. Capture it, group it, and the persona comes from the data, not a feeling.
- **Units:** U09, U18, U28, U29, U30, U31, U32, U37, U79, U97-U102.
- **Talk minutes:** 5.5 (A2.6: includes the 0.5 min DD-03 default beat; no live run). Includes a 40-second write-down.
- **Interaction:** a B2C/B2B toggle (it swaps to Tumelo's persona); tap a group to open its persona; a 40 s timer chip for "write down your last 10 customers".
- **Motion beats:**
  - 0.00-0.12: the title animates in order: ENGAGE (highlighted), then WITH WHO, then a giant "?" (S3-09).
  - 0.12-0.24: headline "Do you really know who buys from you?" An assumption card floats beside the bottle, "Our customer: women 25-34 who love natural skincare", and gets stamped "A feeling".
  - 0.24-0.45: the keep-sentence "Start with the people who actually buy, inquire, and come back." lights verb by verb. Three streams fly in from the edges: BUY (order tokens), INQUIRE (message bubbles), COME BACK (loop tokens). They pour into the bottle's label band, which **unrolls into a data table** (Flip). Columns: Product, Area, Found us on, Repeat?, Age group, Sex, Circumstances, Race (only if stated).
  - 0.45-0.58: the GATHER beat. A capture loop draws each sale, inquiry and repeat adding a row, and a 3-question opt-in checkout survey filling Age group, Sex and Circumstances. "No data? You're guessing." Nothing is uploaded to a public AI.
  - 0.58-0.75: the rows sort into 3 groups (Gift planners 24, Self-care regulars 21, Guesthouses and spas 15, tagged "Illustrative sample, not research"; 60 orders). The assumption card cracks.
  - 0.75-0.92: the persona card **rolls back up out of the table**, with a customer picture (M11). "The Gift Planner":
    - Age group 35-49
    - Sex: mostly men (survey)
    - Area: Midrand and Centurion
    - Circumstances: busy, buys twice a year, wants it wrapped and delivered
    - Found us on: Instagram, orders on WhatsApp
    - Race: only if they tell you, plus the POPIA line

    The any-industry strip slides in: "A salon: bookings and rebookings. A plumber: call-outs and repeat clients. A label printer: quotes and reorders." Stop.
- **Signature move (scene):** the protagonist answers "who". Its own label unrolls into the evidence table and re-rolls as the persona card.
- **Exit becomes entry:** the persona's "Found us on" field pops off as a chip and becomes the hub of the platform wheel in 04.
- **Live run:** none. **Deep dive DD-03 (A2.6): default beat 0.5 min in the auto-scroll path; the remaining 1 min is presenter-optional.** B2B prospecting. The B2B toggle runs a cached, real run in two labelled steps (A1.10, VF-20): Step 1, Google scrape, then Step 2, Apify enrichment, for "skincare brands Gauteng": public business listings, with names blurred on the public site. On screen and in the speaker line: use lead lists only within POPIA direct-marketing rules.
- **Good vs Average:** Average is the assumption card (a feeling). Good is the persona card built from records.
- **Actual ad example:** none.
- **B2B swap:** the toggle shows Tumelo's "Launching Founder" fields (industry, company size, area, buyer role, circumstances, found us on).
- **Media:** M03, M08, M11 (x3).
- **Spec:** section 4, S3-01 to S3-61.
- **v2 timing (v2.1, spine annotation, not card content):** 370 s; beats 03-1..03-6 (43, 43, 75, 87, 61, 61 s). The 40 s write-down is a planned wait timed inside 03-4 (47 s GATHER + 40 s writing, NV-01), not hidden in the hold slack; the DD-03 cached list (about 25 s) sits in 03-6. This line supersedes the card's "Talk minutes" line until G01 updates it (F-08). G01 follow-ups F-01, F-02, F-04, F-05, F-06, F-08. The live B2B find is now 05-6.

#### Scene 04 · Engage > Where?
- **One point:** Don't try to be everywhere. Ask the people who buy, then choose the 2 or 3 platforms where your persona already spends time, and know why.
- **Talk time (v2):** 340 s = 5:40 (11 beats). Live-result seconds: 0. Scroll height: 600vh. Chapter / palette: Engage / cream, platform tints.
- **Units:** U05, U06, U09, U10, U18, U19, U25, U28, U29, U33, U37, U73, U76, U81.
- **Interaction:** The volunteer accepts consent and answers the questionnaire; click to burst and spin the wheel; click any of the 7 tiles; room vote.
- **Beats** (ID · p-range · seconds · what is on screen):
  - 04-1 · 0.000-0.095 · 35 s · The pre-agreed volunteer comes up. The consent card (PROVISIONAL builder wording for OG-DATA, Q-DATA: "We'll scan your public pages and socials and use your questionnaire answers about your business. Anthropic (Claude), Firecrawl and Apify process them to run the tools; Tool A's notice adds Supabase and Resend. No customer contact details. Deleted after 30 days.") is read aloud and accepted; the consent flag arms the Run controls. Nothing runs before this
  - 04-2 · 0.095-0.284 · 70 s · The questionnaire (Tool B's ICP questions, owner's Paste A order; business-level, aggregate and optional, no personal contact details): the volunteer answers 6 questions aloud while the presenter types them: business and URL, what you sell, who buys most (age group, sex split %), area, where they find you, B2B or B2C. On Submit a run tray shows every run starting with its "Skill loaded" line: competitor scan, B2B find, content, Last 30 Days, keywords, SEO, backlinks, citations, 30/60/90 (2 parts), AI helper (fictional demo question), Tool A scan, Tool B ICP + brand kit
  - 04-3 · 0.284-0.325 · 15 s · The persona chip (the Gift Planner, plus the volunteer's answers chip) sits at the hub; a phone rises; headline "Where do they spend their time?"
  - 04-4 · 0.325-0.446 · 45 s · "Ask AI where they live online": the real customer-research answer (G02-T04a) animates as an infographic, Google vs Facebook, Instagram, TikTok, LinkedIn, per persona and for the Tumelo buyer, with sources and the tag "AI research: check it against your own data"
  - 04-5 · 0.446-0.487 · 15 s · Seven platform tiles burst into an arc (T5): WhatsApp, Facebook, Instagram, TikTok, LinkedIn, Google Business Profile, Website/Google Search. Until OG-BRAND closes they are text wordmarks labelled "logo pending brand-terms acceptance" (A2.9); the Google G only where its classroom terms allow
  - 04-6 · 0.487-0.568 · 30 s · The dial spins (smear on neutral plates only) and lands on Instagram: the phone comes alive with the gift-set post (M20) and a "why it fits" card (gift planners find gifts here)
  - 04-7 · 0.568-0.649 · 30 s · Next landing: WhatsApp comes alive as an order chat (HTML) with "why it fits" (they order here)
  - 04-8 · 0.649-0.731 · 30 s · Next landing: Google Business Profile comes alive: map pin, "gift shop near me" (M24), "why it fits" (self-care regulars search nearby)
  - 04-9 · 0.731-0.798 · 25 s · B2B swap: Tumelo's wheel lands on LinkedIn and Website/Google Search, each alive with its why
  - 04-10 · 0.798-0.866 · 25 s · Verdict card: "Amberkloof: Instagram to be seen, WhatsApp to sell, Google Business to be found. TikTok later." All 7 named with a why or why-not line. Average: the same post copied to all 7 ("be everywhere"). Good: 2-3 platforms, each with a reason
  - 04-11 · 0.866-0.920 · 20 s · Room vote on the volunteer's 2-3 platforms; any tile stays clickable; the Instagram post slides off the phone onto the scene 05 shelf
- **Live slots:** None revealed here. Consent at 04-1, then every run (the helper's fictional question included) starts at 04-2 Submit (D-21).
- **Good vs Average:** Average: the same post copied to all 7 platforms. Good: 2 or 3 platforms, each with a reason (04-10).
- **Real ads:** None. The native-style posts are original Amberkloof work.
- **B2B swap:** Tumelo lands on LinkedIn and Website/Google Search (04-9).
- **Signature move:** The platform wheel: a click bursts the tiles out (R2) and the dial lands on a platform that comes alive on the phone.
- **Exit becomes entry:** The Instagram post slides off the phone onto the scene 05 shelf.
- **Media:** M20, M21 (only if TikTok is clicked), M22, M23, M24, M25. Logos are official files only after OG-BRAND; text wordmarks until then (D-15).

#### Scene 05 · Engage > What?
- **One point:** See what works for competitors and what they're missing, then decide what you provide: education, promotions, or both. Copy what works. Then fill the gap.
- **Talk time (v2):** 285 s = 4:45 (8 beats). Live-result seconds: 190. Scroll height: 460vh. Chapter / palette: Engage / deep green.
- **Units:** U28, U30, U34, U35, U36, U37, U41, U42, U73, U76, U81.
- **Interaction:** Education/promotions toggle and audience toggle; tap a competitor card to split its recipe; Run B2B find.
- **Beats** (ID · p-range · seconds · what is on screen):
  - 05-1 · 0.000-0.048 · 15 s · The shelf with Amberkloof's post alone; headline "What are they engaging with?"; recap chips Who, Where, What
  - 05-2 · 0.048-0.145 · 30 s · Education vs promotions: a toggle swaps Amberkloof examples (education: "Is marula OK for sensitive skin?"; promotion: "Gift set, wrapped, delivered Friday"), and an audience toggle shows which mix each group responds to (self-care regulars: education; gift planners: promotion)
  - 05-3 · 0.145-0.387 · 75 s · LIVE competitor scan result (competitor-analysis, started at 04-2 on the volunteer's consented business): three competitor cards land with where they post (Facebook, TikTok, Instagram), their messages, their top public posts embedded where allowed with attribution and engagement signals; "live" source line, or the tagged cached run
  - 05-4 · 0.387-0.549 · 50 s · The top post splits into an exploded recipe in depth: Hook, Body, Offer or giveaway, Format, Platform. A weak competitor post splits the same way: what works vs what doesn't. "What really drives their engagement?"
  - 05-5 · 0.549-0.646 · 30 s · The gap scan from the same run: three or more things none of them do ("nobody answers sensitive-skin questions", "nobody shows the gift wrapped"); a glowing slot opens and the bottle slides in
  - 05-6 · 0.646-0.759 · 35 s · LIVE B2B find (started at 04-2): Step 1 "Google scrape" (Apify Google Maps scraper: businesses that could buy from the volunteer, in their area), Step 2 "Apify enrichment" (website, socials, size); names blurred on the public deck; POPIA direct-marketing line. BLOCKED on APIFY_API_TOKEN: no live or cached run exists yet (PARTIAL)
  - 05-7 · 0.759-0.872 · 35 s · "B2B or B2C: it doesn't matter." Then the line on screen, PROVISIONAL builder copy (D-12) for the owner's "not just copying what they are doing, but I'm also actively looking for other things": "Copy what works. Then fill the gap." with an education and promotion mix chip. Average: copying their post only. Good: their recipe plus the gap
  - 05-8 · 0.872-0.920 · 15 s · A spotlight lands on the bottle in the gap; the slot becomes a blank post canvas (exit into 06)
- **Live slots:** LS-1 competitor-analysis (`competitor-scan`) (05-3, 05-4, 05-5; starts 04-2 Submit; path PROVEN; live needs the volunteer (HELD: proof business)); LS-2 Apify Google Maps scraper + Apify enrichment (`b2b-find`) (05-6; starts 04-2 Submit; BLOCKED: APIFY_API_TOKEN (OG-KEYS); no cached run exists).
- **Good vs Average:** Average: copying their post only. Good: their recipe plus the gap (05-7). Also the working vs weak competitor post (05-4).
- **Real ads:** Competitor posts surfaced by the live scan, embedded with attribution where allowed (not counted toward any ad floor).
- **B2B swap:** The live B2B find (05-6); Tumelo's competitors are other label printers, gap "nobody shows turnaround times".
- **Signature move:** The exploded recipe: a real competitor post separates into its layers in depth.
- **Exit becomes entry:** A spotlight lands on the bottle in the gap; the slot becomes a blank post canvas for 06.
- **Media:** None generated.

#### Scene 06 · Engage > Make it yours (AI content, voice, habit)
- **One point:** AI makes post ideas, captions, product descriptions, simple visuals and short videos fast. A design-system guideline and your own voice make them yours, and a daily trend brief plus a weekly rhythm makes it a habit.
- **Talk time (v2):** 435 s = 7:15 (15 beats). Live-result seconds: 135. Scroll height: 780vh. Chapter / palette: Engage / warm studio.
- **Units:** U01, U02, U04, U06, U07, U11, U13, U20, U21, U22, U37, U38, U42, U43, U66, U73, U76, U78, U79, U80, U81.
- **Interaction:** Generate (live); flip Graphics | With media; step the five habits; click an ad to play; Without/With slopmonster toggle; drag a trend into the week.
- **Beats** (ID · p-range · seconds · what is on screen):
  - 06-1 · 0.000-0.032 · 15 s · The blank canvas from 05; headline "AI drafts fast. You make it yours."
  - 06-2 · 0.032-0.159 · 60 s · LIVE content generation (social skill, started at 04-2 on the volunteer's business): five outputs burst around the bottle (T5): 3 post ideas, a caption, a product description (from the run), a simple visual (M26b) and an 8 s short video (M27, or the code-rendered video until media is approved)
  - 06-3 · 0.159-0.201 · 20 s · How we made that: Claude (the app and chat) and Claude Code (the same assistant on your computer, running skills) named on screen, with the one-step how-to from the lesson file: paste the skill link into Claude and say "Follow this skill, please." (or copy the skill folder into ~/.claude/skills); a normal Claude Pro plan is enough
  - 06-4 · 0.201-0.222 · 10 s · The chef line: world-class ingredients (brand, photos, customer data) plus a recipe (a skill) vs a bare prompt
  - 06-5 · 0.222-0.264 · 20 s · claude-video-studio devices: the chat bar types "Make me a launch video"; three identical cards (Theirs, Yours, Everyone's) with red chips "Big text", "A gradient", "A fade", "Same as everyone"; then one flip of the Graphics / With media toggle (plain graphic vs the same with the real product photo)
  - 06-6 · 0.264-0.317 · 25 s · The five habits light in order (pick a style, use real references, write the brief in numbers, decide whether it loops, check frames not code); a short code-rendered claude-video-studio clip plays muted
  - 06-7 · 0.317-0.391 · 35 s · Brand guideline: Amberkloof's current content (posts, labels, site) goes into the Claude Design System, which returns a guideline (colours, type, voice rules), which returns one on-brand asset (real G02-T04c run). "This is how AI learns your look and your voice."
  - 06-8 · 0.391-0.486 · 45 s · Ad wall: 4 real ads in attributed embed cards (AD-E1..AD-E4), each with its public interaction signals on the capture date (views, likes, or "not public"), next to our own Good vs Average pair (M26a vs M26b); click one to play
  - 06-9 · 0.486-0.539 · 25 s · "slopmonster" named on screen. Pair 1, caption: the real output without the skill and the real output with it, deslop scores before and after, at least 3 differences marked on the text (cut phrases, added specifics, rhythm); the generic pane shatters (T9)
  - 06-10 · 0.539-0.592 · 25 s · Pair 2, product description: the same treatment, scores and at least 3 marked differences
  - 06-11 · 0.592-0.645 · 25 s · Pair 3, post idea: the same treatment, scores and at least 3 marked differences
  - 06-12 · 0.645-0.677 · 15 s · DD-06 default: Tumelo's LinkedIn post without and with slopmonster, both scores, AI tells marked
  - 06-13 · 0.677-0.835 · 75 s · LIVE Last 30 Days (started at 04-2 on the volunteer's niche): a daily brief card with what people talk about and what they complain about, dated sources, turned into one opinion or education post idea. BLOCKED on the G02-T02K tool review and SCRAPECREATORS_API_KEY: no live or cached run exists yet (PARTIAL)
  - 06-14 · 0.835-0.899 · 30 s · The habit week fills Mon-Fri: trend card to a Monday education or opinion post, competitor gap to Wednesday, promotion to Friday; the daily step "Every morning: Last 30 Days brief, draft, your edit, schedule" (A1.10); the content plan from the real content-strategy run; the PROVISIONAL line (D-12) "Copy what works. Then fill the gap."
  - 06-15 · 0.899-0.920 · 10 s · Friday's card lifts and becomes a typed search query, "gentle face oil for sensitive skin Johannesburg" (exit into 07)
- **Live slots:** LS-3 social (`content`) (06-2; starts 04-2 Submit; path PROVEN); LS-4 last30days (06-13; starts 04-2 Submit; BLOCKED: G02-T02K review + SCRAPECREATORS_API_KEY; no cached run exists).
- **Good vs Average:** Same-prompt cards vs the system (06-5); M26a vs M26b next to the real ads (06-8); without vs with slopmonster (06-9..06-12).
- **Real ads:** AD-E1..AD-E4 (G02 floor of 4, all sourced and browser-tested).
- **B2B swap:** Tumelo's slopmonster pair (06-12).
- **Signature move:** Shatter-to-voice: the generic AI pane breaks and your voice is behind it.
- **Exit becomes entry:** Friday's card becomes a typed search query that opens 07.
- **Media:** M26a, M26b, M27, plus the code-rendered claude-video-studio clip.

#### Scene 07 · Engage > Be found (website, SEO/AEO/GEO, 30/60/90)
- **One point:** People still start on Google or ask an AI, and AI reads the web, not your Instagram. So the website must prove you're the authority, guided by tools that check keywords, SEO, backlinks and citations and by a 30/60/90-day plan.
- **Talk time (v2):** 325 s = 5:25 (11 beats). Live-result seconds: 175. Scroll height: 600vh. Chapter / palette: Engage / cream.
- **Units:** U05, U37, U39, U40, U41, U59, U60, U70, U71, U72, U73, U76, U81.
- **Interaction:** Tap the 30, 60 and 90 tabs; open any live result.
- **Beats** (ID · p-range · seconds · what is on screen):
  - 07-1 · 0.000-0.042 · 15 s · The search bar holds Friday's query; headline "Be found where people ask."; the website and Google are still the main place
  - 07-2 · 0.042-0.127 · 30 s · Google plus ChatGPT, Copilot, Gemini, Claude and Perplexity named as text; "They trust what they bring back."; the owner's line "AI cannot go into social media all by itself" (with "mostly" only if the fact-check flags it, G02-Q8); social cards bounce off a glass wall
  - 07-3 · 0.127-0.212 · 30 s · DD-07 default: SEO, AEO and GEO each land as a one-word beat with a one-line meaning (Google ranks you; an AI answers with you; an AI cites you)
  - 07-4 · 0.212-0.283 · 25 s · LIVE keyword targets (competitor-keyword-decoder, started at 04-2): the words to rank for, on the volunteer's niche
  - 07-5 · 0.283-0.354 · 25 s · LIVE SEO check (Firecrawl scan + seo-audit) on the volunteer's site: what blocks being found
  - 07-6 · 0.354-0.425 · 25 s · LIVE backlinks (backlink-analyzer, public evidence only): "a backlink is another site pointing to you", with one example from the run
  - 07-7 · 0.425-0.495 · 25 s · LIVE citations (geo-citability): "citations: who the AI quotes; references: the sources your page names", with who gets cited for the sample question
  - 07-8 · 0.495-0.580 · 30 s · Two ways to show up: (1) authority: Amberkloof's answer page (Good) vs "We are the best natural skincare" homepage (Average); (2) social media: see where competitors post and in what format, and copy that (back to 05's recipe)
  - 07-9 · 0.580-0.793 · 75 s · LIVE 30/60/90 plan (seo-plan + blog-calendar, two separate runs): blogs and landing pages drift along a depth track at 30, 60 and 90 days; tap the 30, 60, 90 tabs
  - 07-10 · 0.793-0.878 · 30 s · B2B swap: Tumelo, "custom product labels Johannesburg", with LinkedIn articles as authority
  - 07-11 · 0.878-0.920 · 15 s · The answer card punches through (T12) and becomes the full-screen landing page of 08
- **Live slots:** LS-5 competitor-keyword-decoder (`keywords`) (07-4; starts 04-2 Submit; path PROVEN); LS-6 Firecrawl CLI scan + seo-audit (07-5; starts 04-2 Submit; path PROVEN); LS-7 Firecrawl CLI scan + backlink-analyzer (07-6; starts 04-2 Submit; path PROVEN); LS-8 Firecrawl CLI scan + geo-citability (07-7; starts 04-2 Submit; path PROVEN); LS-9 seo-plan + blog-calendar (two runs) (07-9; starts 04-2 Submit; path PROVEN).
- **Good vs Average:** Average: a homepage that answers nothing. Good: an answer page with sources, an FAQ and a next step (07-8).
- **Real ads:** None. The live citations are the real-world example.
- **B2B swap:** Tumelo, "custom product labels Johannesburg" (07-10).
- **Signature move:** The exploded search: the search bar lifts off the phone, results fan out in depth, and the AI panel cites you.
- **Exit becomes entry:** The answer card punches through and becomes the landing page of 08.
- **Media:** M25, M28 (x3).

#### Scene 08 · Convert > Capture
- **One point:** Know which pages people land on, then capture their details while you have their attention: an AI helper that helps first and then asks, a timed offer where people linger, and a call to action inside the ad.
- **Talk time (v2):** 260 s = 4:20 (10 beats). Live-result seconds: 60. Scroll height: 560vh. Chapter / palette: Convert / warm to cream.
- **Units:** U05, U23, U37, U44, U45, U46, U47, U48, U68, U73, U76, U78, U79, U81, U82.
- **Interaction:** The live helper (fictional demo data on stage); dwell-timer fast-forward; click a CTA ad to play.
- **Beats** (ID · p-range · seconds · what is on screen):
  - 08-1 · 0.000-0.053 · 15 s · The landing page from 07; headline "While you have their attention, give them a next step."; owner line: capture their details as soon as possible, online or on social media
  - 08-2 · 0.053-0.159 · 30 s · "Where do they land?": a demo analytics pane ranks the pages by visits and inquiries (labelled demo data); the best page lights up and becomes the stage; "Put your capture where people land."
  - 08-3 · 0.159-0.372 · 60 s · LIVE AI helper (runner; its prefilled fictional question starts at 04-2 Submit with the other runs, A1.4 binding reading, Q-REVEAL and Q-HELPER; scripted and labelled "Demo" on the public deck): the helper pops up "Looking for a gift? I can help you choose.", answers "gift for my mom, sensitive skin", then asks for name, surname, email and WhatsApp number; the capture card fills with prefilled fictional details labelled "Demo data" (nothing is typed live)
  - 08-4 · 0.372-0.478 · 30 s · Dwell time: a visible timer on 2 capture points (gift page and FAQ); past 30 s, "We're here to help" opens with capture; a presenter fast-forward speeds the same timer
  - 08-5 · 0.478-0.548 · 20 s · R1 (Instagram embed, @iananaseu, attributed) plays: labelled "Good" for 0-7.9 s (ideas, elements, motion), then "Average" on its end card only (a flat, bolted-on coupon)
  - 08-6 · 0.548-0.602 · 15 s · Our Good: Amberkloof's ad (M31): the gift set floats out of the phone into a WhatsApp chat ("Order for Friday?"); the CTA lives inside the world
  - 08-7 · 0.602-0.761 · 45 s · 3 real ads whose CTA captures details or opens a conversation (AD-C1 click-to-WhatsApp or Send message, AD-C2 lead form or sign-up, AD-C3 B2B quote request), each in an attributed embed card with its CTA type and public signals
  - 08-8 · 0.761-0.832 · 20 s · Skills that set this up, named with where to find them today (github.com/coreyhaines31/marketingskills/tree/main/skills, MIT, checked 2026-10-27): cro (which page, and the fields in cro's references/form.md), popups (the helper and the dwell pop-up), signup (newsletter or freebie); "the full panel is in scene 09"
  - 08-9 · 0.832-0.885 · 15 s · B2B swap: Tumelo's "Quote in 24 hours" form captures company, role and quantity
  - 08-10 · 0.885-0.920 · 10 s · The filled capture card drops into the first box of the follow-up track (exit into 09)
- **Live slots:** LS-10 AI helper via the runner (`claude -p`) (08-3; starts 04-2 Submit with its prefilled fictional question (v2.1, A1.4 binding reading; Q-HELPER); stage: live under either reading; public deck: scripted demo).
- **Good vs Average:** R1: Good for 0-7.9 s, Average on its end card only (08-5); our CTA inside the world (08-6).
- **Real ads:** AD-C1..AD-C3 (G03 floor of 3 with 1 B2B; not sourced yet). R1 is a design reference, not counted.
- **B2B swap:** Tumelo's "Quote in 24 hours" form (08-9).
- **Signature move:** Screen-to-world CTA: the product leaves the ad and lands in the chat.
- **Exit becomes entry:** The filled capture card drops into the first box of the follow-up track.
- **Media:** M30, M31.

#### Scene 09 · Convert > Follow up (where AI answers, funnel, pipeline, reviews)
- **One point:** AI answers where your customers already talk (your website, WhatsApp, social DMs; Slack is mostly for your team). A funnel is what happens after they give you their details: a welcome, then email and WhatsApp journeys that build trust, a pipeline, and a review request. AI can build it with you.
- **Talk time (v2):** 340 s = 5:40 (15 beats). Live-result seconds: 0. Scroll height: 780vh. Chapter / palette: Convert / green.
- **Units:** U05, U14, U23, U37, U44, U48, U49, U50, U51, U52, U53, U76, U81.
- **Interaction:** Pick a channel; volunteer picks Helpful or Vague; "Send"; "Advance deal"; funnel tabs.
- **Beats** (ID · p-range · seconds · what is on screen):
  - 09-1 · 0.000-0.041 · 15 s · The capture card arrives; headline "A sale is often won after the first reply."
  - 09-2 · 0.041-0.081 · 15 s · Where does AI come in? Channel picker, place 1: the website chatbot (the 08 helper) answers questions and captures details
  - 09-3 · 0.081-0.122 · 15 s · Place 2: WhatsApp: AI drafts replies and quick answers; opt-in for business-started messages, approved templates and the 24-hour service window
  - 09-4 · 0.122-0.162 · 15 s · Place 3: social DMs: Instagram and Facebook DM automation answers "price?" and captures details from comments and DMs (capture on social)
  - 09-5 · 0.162-0.216 · 20 s · Place 4, the honest Slack answer: "Is it on Slack? Mostly for your team: AI posts the new-lead alert and helps you reply. Customers rarely message a small business there; some B2B clients share a Slack Connect channel." (Slack's mark only if its terms allow, else text)
  - 09-6 · 0.216-0.298 · 30 s · Respond quickly: a response clock (2 minutes vs 2 days) with Good vs Average reply; a volunteer picks Helpful or Vague ("Hi, price is R450.")
  - 09-7 · 0.298-0.338 · 15 s · The plain line: "A 'sales lifecycle' is a fancy way to say we'll WhatsApp you and email you a series of useful things, so you trust us and see we know our stuff."
  - 09-8 · 0.338-0.474 · 50 s · The funnel: "Send" fires the welcome and thank-you email at once, then the email journey and the WhatsApp journey run together on a day timeline (from real email-sequence and whatsapp-sequences runs); every message shows permission and opt-out (POPIA s69)
  - 09-9 · 0.474-0.595 · 45 s · CRM and pipeline built with AI: Tumelo's deal (the Amberkloof gift box) moves quotation, order, invoice, follow-up on "Advance deal", counts updating; "A pipeline puts each customer in a box, so nobody gets forgotten."
  - 09-10 · 0.595-0.649 · 20 s · The follow-up box fires a review request on Google and on social (no incentives, no selective asking); stars fill
  - 09-11 · 0.649-0.704 · 20 s · DD-09 default, funnel tab 1: abandoned cart, reminders at 1 h, 24 h and 72 h, automated; "A funnel sends something with a specific goal in mind."
  - 09-12 · 0.704-0.758 · 20 s · Funnel tab 2: onboarding, the company's sections sent in turn
  - 09-13 · 0.758-0.812 · 20 s · One screen of a custom CRM built with AI: the same customer moving between boxes; "Ask AI to build it with you: the funnels, a simple CRM, the emails."
  - 09-14 · 0.812-0.893 · 30 s · Skills panel with true sources: cro, popups and signup at github.com/coreyhaines31/marketingskills/tree/main/skills (MIT; form advice is in cro/references/form.md); older installs call them page-cro, form-cro, popup-cro and signup-flow-cro, the names before that repo's v2.0 renames of 2026-05-14 (commit 30f9b9a), pinned at github.com/coreyhaines31/marketingskills/tree/f3990f7f99ae63b9e26eaa61114f60e0408742ff/skills; email-sequence (Anthropic knowledge-work-plugins marketing pack, Apache-2.0, in the scene 15 download); whatsapp-sequences (installed on the presenter's Claude Code; upstream source not found, G03-T01 records it before it is named as downloadable)
  - 09-15 · 0.893-0.920 · 10 s · Review stars and the week's results pour off the end of the track (exit into 10)
- **Live slots:** none.
- **Good vs Average:** Average: the vague reply and no follow-up. Good: a helpful reply in minutes, an agreed next step and a sequence (09-6).
- **Real ads:** None here (CTA ads are in 08).
- **B2B swap:** The pipeline is Tumelo's deal (09-9).
- **Signature move:** The product rides the track sideways through the lifecycle and the pipeline.
- **Exit becomes entry:** Review stars and the week's results pour off the end of the track into 10.
- **Media:** M32 (x4), M33, M08.

#### Scene 10 · Optimize: what worked, and for whom?
- **One point:** Measure both ends. Find the failures (no engagement, or engagement without conversion) and the successes (both: why, and to whom), then double down on what works.
- **Talk time (v2):** 180 s = 3:00 (5 beats). Live-result seconds: 0. Scroll height: 340vh. Chapter / palette: Optimize / dark green, amber data.
- **Units:** U05, U24, U37, U54, U76, U81.
- **Interaction:** Tap a post to sort it; "Double down".
- **Beats** (ID · p-range · seconds · what is on screen):
  - 10-1 · 0.000-0.102 · 20 s · The week's 5 posts from 06 sit in a row; OPTIMIZE takes the centre (echo of 02); the lights lower
  - 10-2 · 0.102-0.307 · 40 s · Lens switch: the website pane morphs into an analytics dashboard; each post shows impressions, comments and inquiries (labelled demo data)
  - 10-3 · 0.307-0.613 · 60 s · Tap to sort: FAILURES (Tuesday's flat photo: low engagement, 0 inquiries; Thursday's giveaway: 1,200 likes, 0 inquiries) and SUCCESSES (Monday's answer: WHY it answered a real question, TO WHOM self-care regulars; Friday's ad: WHY it looked like a gift worth giving, TO WHOM gift planners). Average: counting likes. Good: engagement and conversion, by who
  - 10-4 · 0.613-0.843 · 45 s · "Double down": the success cards clone into next week; failures are marked stop or fix. B2B: Tumelo counts quote requests from founders, not followers
  - 10-5 · 0.843-0.920 · 15 s · Authored silence: near-black; only Tuesday's flat photo stays lit, "Tuesday's post. Let's fix it."
- **Live slots:** none.
- **Good vs Average:** Average: counting likes. Good: engagement and conversion, by who (10-3).
- **Real ads:** None.
- **B2B swap:** Tumelo counts quote requests, not followers (10-4).
- **Signature move:** The same week seen through a new lens.
- **Exit becomes entry:** Tuesday's flat photo is the first frame of 11.
- **Media:** None new (reuses M40 and the M27 poster).

#### Scene 11 · Attract (THE PEAK)
- **One point:** AI here means Attract + Interact. People are drawn to beautiful things: that's why retail packs shelves neatly, why merchandising is an industry and why beauty is a huge one. So everything people see from you must be attractive.
- **Talk time (v2):** 310 s = 5:10 (10 beats). Live-result seconds: 0. Scroll height: 700vh. Chapter / palette: Attract / warm studio.
- **Units:** U01, U02, U05, U37, U62, U63, U64, U66, U68, U76, U78, U80, U82, U84.
- **Interaction:** The Layer switchboard (the room calls a layer, the presenter clicks it); click a gallery ad to load it.
- **Beats** (ID · p-range · seconds · what is on screen):
  - 11-1 · 0.000-0.119 · 40 s · The letters "AI" resolve into ATTRACT and INTERACT beside a ghosted E and C. One line each: "Engage gets them responding. Attract is why they stop at all: it looks worth it." "Convert asks for the next step. Interact lets them get to know you first."
  - 11-2 · 0.119-0.178 · 20 s · Tuesday's flat photo (M40) on white under harsh flash, labelled "Average"; layer 1, LIGHT: the warm plaster plate, a key light from the upper right, a clean cutout
  - 11-3 · 0.178-0.231 · 18 s · Layer 2, DEPTH: the plinth rises, stone blocks blur behind, the planes separate as the plate pushes in
  - 11-4 · 0.231-0.297 · 22 s · Layer 3, BREAK-OUT: a phone on the plinth; the bottle, jar, tin and gift box break out of the screen and float (R5); the giant word ATTRACT passes behind them
  - 11-5 · 0.297-0.341 · 15 s · Layer 4, OFFER: a glass card "Gift set. Wrapped. Delivered Friday."
  - 11-6 · 0.341-0.430 · 30 s · Layer 5, CTA inside the world: "Order on WhatsApp"; the label flips to "Good"; the switchboard appears and the room calls a layer to switch off
  - 11-7 · 0.430-0.594 · 55 s · Why beauty wins, the owner's argument: neat retail packing (Good) vs a messy shelf (Average); a merchandised display vs a pile; beauty, makeup and clothing presented well vs carelessly; the neutral image (a lit perfume counter, G12); the owner's line on screen "Whatever you're creating, it needs to be attractive."
  - 11-8 · 0.594-0.825 · 78 s · Gallery: 6 real ads in attributed embed cards that load on click (AD-A1, AD-A2 beauty or makeup; AD-A3, AD-A4 clothing or fashion; AD-A5 retail packing or merchandising; AD-A6 B2B), each with the attraction mechanism it shows and what people do with it (public signals on the capture date, or "not public")
  - 11-9 · 0.825-0.884 · 20 s · Our own Good vs Average ad pair (M42 vertical ad vs the M40 snapshot), and the B2B pair: Tumelo's carton, "Your packaging is your shelf ad."
  - 11-10 · 0.884-0.920 · 12 s · The R5 reference card (the owner's pin, attributed: "the look we copied, ideas not assets"); the camera pulls back and reveals the stage inside a shop window at dusk (M44)
- **Live slots:** none.
- **Good vs Average:** The whole scene: the flat photo vs the full stage; three beauty pairs (11-7); our ad pair (11-9).
- **Real ads:** AD-A1..AD-A6 (G04 floors; AD-A6 sourced). R5 is a design reference, not counted.
- **B2B swap:** Tumelo's carton: "Your packaging is your shelf ad." (11-9).
- **Signature move:** The Layer switchboard rebuild (deck signature).
- **Exit becomes entry:** The camera pulls back from the stage and reveals it inside a shop window at dusk.
- **Media:** M40, M41 (16:9 and 9:16), M42, M44, plus B1 reuse (M01-M09).

#### Scene 12 · Interact, then teach AI
- **One point:** Attraction makes them stop; interaction lets them get to know you, so every click, tap and reply must pay off. AI doesn't know what good looks like or how good interactions work, so you teach it by showing it success, and a system can judge and recreate both.
- **Talk time (v2):** 325 s = 5:25 (16 beats). Live-result seconds: 0. Scroll height: 820vh. Chapter / palette: Interact / warm dusk.
- **Units:** U05, U07, U08, U11, U25, U37, U62, U65, U66, U67, U68, U69, U76, U79, U84.
- **Interaction:** Tap products in the window; pick "See the range" or "Build a gift set"; click a website; step the design-loop rounds.
- **Beats** (ID · p-range · seconds · what is on screen):
  - 12-1 · 0.000-0.071 · 25 s · The shop window at dusk (M44, M45 push-in); "First attract, then interact." "Interaction lets them get to know you." (the owner's own analogy stays in the notes, G12)
  - 12-2 · 0.071-0.170 · 35 s · Tap the bottle: a detail arc bursts out (ingredients, size, price, proof, "Ask us on WhatsApp"); tap the jar for its own arc; product, detail, proof, ask; every tap pays off within 100 ms (R2 click-to-burst, attributed reference card)
  - 12-3 · 0.170-0.226 · 20 s · What people do with ads: the demo ad carries comment, save, share, tap a product tag, try on, message; each action lights up with its payoff
  - 12-4 · 0.226-0.311 · 30 s · Average: a "Contact us" button that leads nowhere visible. Good: a gift-set builder that ends in a WhatsApp chat with the order prefilled
  - 12-5 · 0.311-0.368 · 20 s · Website 1, oryzo.ai, in-scene in a live frame (or a presenter live window if it refuses framing), attributed: what you do there and how it pays off
  - 12-6 · 0.368-0.425 · 20 s · Website 2, House Down Studio, in-scene the same way: its work-to-contact path
  - 12-7 · 0.425-0.481 · 20 s · Website 3 (DD-12 default; chosen by G04-T03), in-scene the same way
  - 12-8 · 0.481-0.538 · 20 s · Two provider statements on interaction and appeal, each quoted in under 15 words with its link (fact-checked)
  - 12-9 · 0.538-0.566 · 10 s · Teach AI: "AI doesn't know what good looks like, or how good interactions work. Show it success." The same-prompt cards from 06 return for one beat (G04-T08 reuse)
  - 12-10 · 0.566-0.609 · 15 s · One prompt vs with the system: a before/after slider of the real G04-T05(a) outputs (one-line prompt vs the claude-video-studio brief)
  - 12-11 · 0.609-0.694 · 30 s · Judge: a design-loop step-through, round verdicts from 3 critics with scores, the fix, then 3 of 3 agree (strings match the raw reports)
  - 12-12 · 0.694-0.750 · 20 s · Recreate the look: the Claude Design System artifact for Amberkloof recreates the look on a new asset
  - 12-13 · 0.750-0.821 · 25 s · Recreate an interaction: AI is given a successful interaction reference (the R2 click-to-burst) and recreates it for Amberkloof (real G04-T05(d) run)
  - 12-14 · 0.821-0.849 · 10 s · Our recreation of the generic AI look shatters (T9) into the taught result; "Show AI what success looks like."
  - 12-15 · 0.849-0.892 · 15 s · B2B swap: Tumelo's "build your box" configurator (size, finish, then an instant quote)
  - 12-16 · 0.892-0.920 · 10 s · "Ask us" opens a chat that asks "May we use your details?" (exit into 13)
- **Live slots:** none.
- **Good vs Average:** Contact-us dead end vs the gift-set builder (12-4); one prompt vs the system (12-10); generic AI look vs taught result (12-14).
- **Real ads:** None counted here. W1-W3 websites and PS-1, PS-2 provider statements (G04 floors). R2 is a design reference.
- **B2B swap:** Tumelo's "build your box" configurator (12-15).
- **Signature move:** Detail arcs bursting out of products in the shop window.
- **Exit becomes entry:** The chat's "May we use your details?" grows into scene 13's draft page.
- **Media:** M44, M45, M46 (optional).

#### Scene 13 · Use AI responsibly
- **One point:** Check what AI claims, be honest with customers, and protect their information.
- **Talk time (v2):** 180 s = 3:00 (6 beats). Live-result seconds: 0. Scroll height: 380vh. Chapter / palette: Responsible AI / cream, red-pen accent.
- **Units:** U05, U25, U37, U73, U76, U101.
- **Interaction:** Click each claim; sort what you'd paste into AI; pick the honest version.
- **Beats** (ID · p-range · seconds · what is on screen):
  - 13-1 · 0.000-0.077 · 15 s · AI's product description for the bottle on a white page; "Before you post: check, be honest, protect."
  - 13-2 · 0.077-0.332 · 50 s · Exercise 1, check accuracy: click each claim in the draft ("clinically proven", "heals eczema", "#1 in South Africa"); the real fact-checker-loxly verdict and source appear (G04-T04 raw report) and the red pen strikes
  - 13-3 · 0.332-0.588 · 50 s · Exercise 2, protect their information: sort what you would paste into a public AI tool (a customer list with names and numbers; anonymised sales totals; a product description; a customer's WhatsApp chat; a race field); each item gets feedback with its POPIA reason (anonymise or aggregate first; race only if the customer stated it)
  - 13-4 · 0.588-0.767 · 35 s · Exercise 3, be honest: a fake 5-star review vs a real review; an invented claim vs an honest line with an AI disclosure
  - 13-5 · 0.767-0.869 · 20 s · Three words settle: Check. Be honest. Protect. B2B line: don't scrape personal emails off LinkedIn for cold mail; direct marketing needs consent under POPIA
  - 13-6 · 0.869-0.920 · 10 s · Consent recap: "The volunteer agreed in scene 04: public pages, socials and business-level questionnaire answers only, no customer contact details, deleted after 30 days." Their runs are ready; the progress line draws the pedestal of 14
- **Live slots:** none.
- **Good vs Average:** Average: publishing the AI draft unchecked. Good: the checked, honest version (13-2, 13-4).
- **Real ads:** None.
- **B2B swap:** No scraping personal emails off LinkedIn for cold mail (13-5).
- **Signature move:** A red-pen strike-through on AI's claims.
- **Exit becomes entry:** The progress line of the volunteer's runs stretches across and draws the pedestal of 14.
- **Media:** None generated.

#### Scene 14 · Your turn: Tool A + Tool B live
- **One point:** Now we do it for a real business in the room: scan it (Tool A), then see its ideal customer and brand kit (Tool B). Then you scan your own.
- **Talk time (v2):** 280 s = 4:40 (13 beats). Live-result seconds: 220. Scroll height: 700vh. Chapter / palette: Tools / green workbench.
- **Units:** U05, U06, U09, U11, U21, U26, U29, U37, U55, U56, U57, U58, U59, U60, U61, U81.
- **Interaction:** Report tabs; the volunteer confirms their answers; scan a QR.
- **Beats** (ID · p-range · seconds · what is on screen):
  - 14-1 · 0.000-0.049 · 15 s · A pedestal rises: "Now for a real business in the room." The volunteer's business name and the run's start time (scene 04) show on the source line
  - 14-2 · 0.049-0.099 · 15 s · Tool A panel 1, What you do (Firecrawl scan of the volunteer's site)
  - 14-3 · 0.099-0.148 · 15 s · Panel 2, Socials (Apify social sampling)
  - 14-4 · 0.148-0.214 · 20 s · Panel 3, Competitors (competitive-analysis skill built into the tool), with platform names and what we suggest they do on social media
  - 14-5 · 0.214-0.263 · 15 s · Panel 4, AI crawler reach: is AI reaching the site?
  - 14-6 · 0.263-0.312 · 15 s · Panel 5, AEO/GEO citations: are they cited or mentioned by AI for what they want to rank for?
  - 14-7 · 0.312-0.444 · 40 s · Strengths, Gaps and Next steps tabs (doing well, not doing well, what to do next)
  - 14-8 · 0.444-0.493 · 15 s · Tool B: the volunteer's scene 04 questionnaire answers replay as the questionnaire (6 questions)
  - 14-9 · 0.493-0.591 · 30 s · The persona card returns in the same format as scene 03, filled with the volunteer's answers (firmographic fields if they are B2B)
  - 14-10 · 0.591-0.690 · 30 s · The brand kit on the Claude Design System from their current content: colours, type, voice
  - 14-11 · 0.690-0.772 · 25 s · One on-brand asset made from the kit: a post for the volunteer's best platform from 04, with the live source line
  - 14-12 · 0.772-0.887 · 35 s · Two QR codes, one per tool (Tool A, Tool B), with typed URLs: "Scan now and run your own business."
  - 14-13 · 0.887-0.920 · 10 s · Next steps collapse into one card, "Where to learn next", which drops into the gift box of 15
- **Live slots:** LS-11 Tool A (G05 backend: Firecrawl, Apify, competitive-analysis, crawler + AEO checks) (14-2, 14-3, 14-4, 14-5, 14-6, 14-7; starts 04-2 Submit; BLOCKED: G05 deploy + OG-KEYS); LS-12 Tool B (Claude page, stage live-run mode G06-T16) (14-8, 14-9, 14-10, 14-11; starts 04-2 Submit; HELD: OG-CLAUDE-PAGE).
- **Good vs Average:** None labelled.
- **Real ads:** None.
- **B2B swap:** If the volunteer is B2B, Tool B shows the firmographic fields from 03 (14-9).
- **Signature move:** The pedestal reveal, with the persona card from 03 returning filled with the volunteer's data.
- **Exit becomes entry:** Next steps collapse into "Where to learn next", which drops into the gift box of 15.
- **Media:** None generated. The volunteer's own site assets render live.

#### Scene 15 · Keep learning (skills download, where to learn, your 7-day plan)
- **One point:** Keep learning: practical places to go, Anthropic's marketing skills to take home, and one 7-day test that you write before you leave.
- **Talk time (v2):** 265 s = 4:25 (7 beats). Live-result seconds: 0. Scroll height: 420vh. Chapter / palette: Learn / cream to warm.
- **Units:** U05, U15, U26, U48, U76, U77, U87.
- **Interaction:** Click a stage to bring its sites forward; build and copy your 7-day plan card; scan the QR.
- **Beats** (ID · p-range · seconds · what is on screen):
  - 15-1 · 0.000-0.035 · 10 s · The kraft gift box (made by Tumelo) opens; headline "Keep learning."
  - 15-2 · 0.035-0.191 · 45 s · The 8 Anthropic marketing skills rise one by one, each with a one-line use: brand-review, campaign-plan, competitive-brief, content-creation, draft-content, email-sequence, performance-report, seo-audit; the source link and the Apache-2.0 line below
  - 15-3 · 0.191-0.295 · 30 s · With vs without a skill: the same request run with campaign-plan and without it (real G07-T07 outputs), Good vs Average excerpts
  - 15-4 · 0.295-0.365 · 20 s · Where to find conversion-tactic skills: cro (pages and forms), popups and signup at github.com/coreyhaines31/marketingskills/tree/main/skills (MIT; older installs call them page-cro, form-cro, popup-cro and signup-flow-cro); email-sequence in this download; whatsapp-sequences listed only once its source is recorded
  - 15-5 · 0.365-0.573 · 60 s · Where to learn, by stage: click Engage, Convert, Optimize, Attract and Interact, AI skills or Support and its verified sites come forward with one line each (12 links from g07-learn-links.md: Meta Blueprint, WhatsApp Business app, HubSpot Academy, Google Skillshop, Search Console Help, Analytics Academy, Google Business Profile, Grow with Google Africa, Claude Academy, Claude Help Center skills, Information Regulator POPIA guidance, SEDFA)
  - 15-6 · 0.573-0.833 · 75 s · Your next steps = your 7-day test: pick one customer (persona fields), one platform (the 7), one action (create, convert or follow up) and one measure; the plan card builds (tonight, this week, 30-60-90); Copy works with 0 network requests. Everyone writes theirs: a 40 s timed write inside this beat (35 s of talk)
  - 15-7 · 0.833-0.920 · 25 s · The bottle settles into the box, the lid closes, the QR to /skills/ and the typed URL appear with "Be found. Be chosen. Keep learning."; final hold
- **Live slots:** none.
- **Good vs Average:** Without vs with a skill (15-3). Average close: "Thank you. Any questions?"; Good: a takeaway plus a test.
- **Real ads:** None.
- **B2B swap:** None.
- **Signature move:** The gift box of skills as the takeaway.
- **Exit becomes entry:** None. It resolves and holds.
- **Media:** M50, M51, plus M08 reused.

### 3.3 Timing, scene seconds and overflow (v2)

- **Full timing:** `experience/story-spine-v2-timing.md` (every beat, every unit, live slots, ad slots, shortfalls, the cut list). Re-check with `python scripts/check-spine-v2.py`.
- **`sceneSeconds` v2.1 (PROVISIONAL):** `[120,180,370,340,285,435,325,260,340,180,310,325,180,280,265]` = 4195 s = **69:55**. `sceneMinutes` = sceneSeconds / 60 = `[2,3,6.167,5.667,4.75,7.25,5.417,4.333,5.667,3,5.167,5.417,3,4.667,4.417]`. This replaces the A2.6 array `[2,3,5.5,3.5,5,6,6.5,4,5,3,4.5,3.5,1.5,4.5,2.5]`, which reached 60 only by compressing scenes and leaving deep-dive beats unplaced (VS-13, VS-15).
- **Overflow:** 9:55 over the goal. Nothing is cut until the owner picks from the ranked list (timing file section 8). Option 0 keeps everything (ask for a 75-minute slot; 70 minutes leaves 5 s); Tiers 1-3 end at 61:00, the outer edge of the rehearsal window (60:00 +/- 60 s) with no margin, with three owner-OK readings and no goal floor lost.

| Scene | A2.6 (s) | v2.1 (s) | Change | Main reason |
|---|---:|---:|---:|---|
| 01 | 120 | 120 | 0 | Unchanged (G01 building) |
| 02 | 180 | 180 | 0 | Unchanged (G01 building) |
| 03 | 330 | 370 | +40 | The 40 s write-down is timed inside 03-4 (v2.1, NV-01); live B2B find moved to 05-6 |
| 04 | 210 | 340 | +130 | Consent and the questionnaire open the scene; the wheel gets real time |
| 05 | 300 | 285 | -15 | Consent moved to 04; the live B2B find added |
| 06 | 360 | 435 | +75 | Claude and Claude Code, the devices, the guideline, 3 slopmonster pairs, 4 real ads |
| 07 | 390 | 325 | -65 | Results are pre-started, so the live beats need no wait |
| 08 | 240 | 260 | +20 | 3 CTA ad slots, R1 labelled correctly |
| 09 | 300 | 340 | +40 | The channel picker with the honest Slack answer |
| 10 | 180 | 180 | 0 | Unchanged |
| 11 | 270 | 310 | +40 | AI = Attract + Interact teaching beat; 6-ad gallery |
| 12 | 210 | 325 | +115 | Websites in-scene; teach AI (judge, recreate) moved in |
| 13 | 90 | 180 | +90 | Three Responsible AI exercises |
| 14 | 270 | 280 | +10 | One QR per tool, scan time |
| 15 | 150 | 265 | +115 | With/without skills, conversion skills, 12 sites, the plan card (15-6 at 75 s with the 40 s write, v2.1) |
| **Total** | **3600** | **4195** | **+595** | |

**Deep dives (v2):** every default beat is a numbered beat in the auto-scroll path; the expanded remainder is presenter-optional (proposed key: D).

| Deep dive | Default beat(s) in the path | Default seconds | Expanded remainder (optional) |
|---|---|---:|---:|
| DD-03 B2B prospecting | 03-6 (cached two-step list inside the persona beat) and the live 05-6 | about 25 + 35 | 1.0 min |
| DD-06 second slopmonster pair | 06-12 | 15 | 0.5 min |
| DD-07 SEO, AEO, GEO deeper | 07-3, plus the meanings in 07-6 and 07-7 | 30 + 50 | 1.0 min |
| DD-09 funnels and a CRM built with AI | 09-11, 09-12, 09-13 | 60 | 1.0 min |
| DD-11 the V1 lesson | 06-3, 06-4, 06-5, 06-6 (moved from 11, D-22) | 75 | 1.0 min (the live claude-video-studio workflow, scene 11) |
| DD-12 more interactive websites and providers | 12-7, 12-8 | 40 | 0.5 min |

A second timing risk: if a volunteer run is still not complete at its reveal, its tagged cached run shows (A1.4). With the 04-2 start, the shortest head start is 280 s (LS-1) against a measured 51.7 s run. Since v2.1 the helper (LS-10) also starts at 04-2 (1325 s of head start), so no slot sits near the line under either A1.4 reading. Unmeasured: LS-2, LS-4, LS-11 and LS-12 (all BLOCKED or HELD today).

---

## 4. Slides 1-3 spec checklist (identical to `experience/g01-slide-spec.md`: the checklist lines and the viewport, motion and data rules; heading levels differ)

### Preamble

- [ ] P-01 "I'd like to talk through this presentation so that it's aligned with how I want to do things." -> CONTEXT: the owner's notes, not the builder's taste, decide slides 1-3.
- [ ] P-02 "So I'm just going to scroll through it and give my thoughts page by page." -> CONTEXT: each slide has its own contract. The page numbers follow the 15-scene deck.

### Slide 1 (scene 01, Open) and the navigation rules he gave there

- [ ] S1-01 "Beginning page, number one, or page number one, looks good." -> BUILD: keep slide 1's structure (subject label, the three-part promise, a moving visual). Restage it with the Amberkloof bottle, but do not tear the slide down.
- [ ] S1-02 "The only thing is I wouldn't probably say at the left-hand side, top, GPT Field Guide." -> BUILD: "GTP Field Guide" (or "GPT Field Guide") appears nowhere in the deck header. Flag `tool/index.html:16,43`, which still says "GTP FIELD GUIDE", to G05.
- [ ] S1-03 "I would probably just say Sales, Marketing and AI, and I'll make that bigger so people can see it." -> BUILD: the top-left label reads exactly "Sales, Marketing and AI". It renders at 28 px or more at 1366x768 (twice the current 14.4 px), is the dominant top-left identity, and is visible at 390x844 (it is hidden there today by `scroll-experience.css:183`).
- [ ] S1-04 "Be found, be chosen and keep learning, that is fine." -> BUILD: keep the headline "Be found. Be chosen. Keep learning." exactly.
- [ ] S1-05 "So I can open with, I can think of an opener." -> BUILD: the scene gives the presenter an opening moment (an audience question beat) before the scroll reaches the ECO preview.
- [ ] S1-06 "You can help me with thinking of an opener for that beginning slide." -> BUILD: write three opener options (the directions are in story-spine 3.2, scene 01), run them through `slopmonster`, and keep a before and after record in `experience/g01-opener.md`.
- [ ] S1-07 "Let's see." -> CONTEXT: no requirement.
- [ ] S1-08 "You do have notes, so maybe add this to the notes and then we can go through it together." -> BUILD: the three opener options sit in the scene 01 speaker note, and the presenter can see them in the Notes panel. OG-OPENER (the owner picks one) stays open until he answers.
- [ ] S1-09 "The other thing is I always need to scroll down, right?" -> CONTEXT: the problem statement for auto-scroll.
- [ ] S1-10 "So the problem is with scrolling down while talking is my focus." -> BUILD: the presenter never has to scroll to make a scene progress.
- [ ] S1-11 "My focus isn't consistently going to be on having to scroll down." -> BUILD: opening Notes, clicking an in-scene control or talking for a long time must not freeze the deck in a state that needs a manual scroll to recover. Notes open with motion still running is an acceptance item.
- [ ] S1-12 "So I would probably say that each and every page, one to fifteen, should just start scrolling, but on its own and at a certain pace." -> BUILD: all 15 scenes auto-scroll at a pace set from their talk minutes (`sceneMinutes` in story-spine 3.3), with a presenter speed control.
- [ ] S1-13 "So as it, so I would probably say just before it transitions into the next page, it should start scrolling." -> BUILD (read together with S1-14 and S1-15, which correct it): motion runs from the scene's start and **stops just before** the next scene's transition, then waits for Next.
- [ ] S1-14 "And the scroll starts at the beginning of each and every page already." -> BUILD: motion starts within 1 s of arriving on any scene, whether you arrive on open, by Next, by Overview or by a chapter jump.
- [ ] S1-15 "So page one starts scrolling as soon as I open the page, and it scrolls until just before the next page comes up, which is going to be, The growth is a loop, make each turn useful." -> BUILD: on open, scene 01 moves within 1 s. It stops with the scene 02 headline "Growth is a loop. Make each turn useful." not yet on screen, and holds until Next.

### Slide 2 (scene 02, ECO loop)

- [ ] S2-01 "Now there we've got this engage, convert and optimize section." -> CONTEXT: slide 2 is the ECO section.
- [ ] S2-02 "The only thing with that is we can start off by showing all three: engage, convert and optimize." -> BUILD: the arrival state shows Engage, Convert and Optimize together at equal weight.
- [ ] S2-03 "And then what I'd like is as you scroll down, the word engage becomes more prominent, or it moves to the center and it becomes bigger, so that at that stage I can mention engage and then talk about engagement: what is engagement, etc." -> BUILD: at the first scroll beat (auto or manual), the word Engage moves to the centre and grows to at least 2x its arrival size.
- [ ] S2-04 "So in the slide itself, it says know who, where and what matters." -> CONTEXT: the old live copy.
- [ ] S2-05 "I don't know if that really is going to convey what engage means." -> BUILD: the string "Know who, where and what matters." is absent.
- [ ] S2-06 "So engagement is what catalysts are there, or what catalysts drive engagement." -> BUILD: the Engage explanation names catalysts, the things that make people respond. Shown as 3 or 4 picture chips (a question answered, a striking picture, an offer, a story) that turn into reactions (like, comment, save, message).
- [ ] S2-07 "So you want people to be able to interact with you, or engage with what you're doing, or what you're posting, or what they are seeing." -> BUILD: the Engage line says people interact with what you do, post or show. Amberkloof example: a post of the face-oil bottle gets a comment, "Is this OK for sensitive skin?"
- [ ] S2-08 "So, but engagement, I would probably..." -> CONTEXT: an unfinished thought, no requirement.
- [ ] S2-09 "So that's what I give the title of engagement." -> BUILD: the Engage heading carries that meaning (for example "What makes people respond?"), not a generic label.
- [ ] S2-10 "It just needs to be clear." -> BUILD: a blind reader shown only the Engage state can say what engagement means in one sentence (the G01 O1 mini-critic covers this).
- [ ] S2-11 "And then convert becomes after engagement starts." -> BUILD: the order is fixed as Engage, then Convert, then Optimize.
- [ ] S2-12 "So that'll be the next section." -> BUILD: Convert is the second beat.
- [ ] S2-13 "Again, convert would then come up to the center and it will become bigger, and it will explain what convert is." -> BUILD: at the second beat (or a click), Convert takes the centre and grows, with its explanation underneath.
- [ ] S2-14 "And convert is right after engagement, meaning that engagement gets the attention and gets people talking, or engaging with your content." -> BUILD: the Convert state shows a link back to Engage: "Engagement got their attention."
- [ ] S2-15 "Conversion, or convert, means that while you have their attention, there's a clear next step." -> BUILD: the Convert headline says this. Proposed wording: "While you have their attention, give them a clear next step." It gets a slopmonster pass.
- [ ] S2-16 "And one of the biggest things in conversion is you cannot convert without knowing who you're converting to." -> BUILD: a visible line says you cannot convert people you do not know.
- [ ] S2-17 "Sorry, who your audience is that is engaging with you." -> BUILD: that line is about the people engaging with you right now (the commenter from S2-07), not a generic audience.
- [ ] S2-18 "So conversion, there's a step of accumulating information." -> BUILD: a capture step is drawn as a small form that fills in.
- [ ] S2-19 "This normally starts with a simple thing like a name and a surname and an email address." -> BUILD: the form shows exactly three fields, Name, Surname and Email, filling in.
- [ ] S2-20 "And conversion tactics involve multiple things, and we can mention these things." -> BUILD: a short "Tactics" list follows the form.
- [ ] S2-21 "Conversion tactics could mean that while these people are engaging, we get their details." -> BUILD: tactic 1 is "Get their details while they are engaging".
- [ ] S2-22 "That's number one." -> BUILD: tactic 1 is numbered 1.
- [ ] S2-23 "Number two, we could offer something to the people that are engaging, like a newsletter, like an email, like something free or something worth value, as long as we are thinking in the spectrum of converting them to a client." -> BUILD: tactic 2 is "Offer something of value: a newsletter, an email guide or a free sample", with the aim "on the way to becoming a client" visible. Amberkloof example: a free 5 ml sample in exchange for an email.
- [ ] S2-24 "And then after that is optimize, and it's exactly what it says." -> BUILD: Optimize is the third beat.
- [ ] S2-25 "So it does measure the outcomes that you received from both ends." -> BUILD: the Optimize explanation says it measures results from both ends, engagement and conversion, shown as two input lanes.
- [ ] S2-26 "Right?" -> CONTEXT.
- [ ] S2-27 "So we need to frame it like optimize again, by the way." -> BUILD: Optimize gets the same treatment as Engage and Convert (centred and bigger).
- [ ] S2-28 "So it comes to the middle, gets bigger, and then we have things coming up that says failures and successes." -> BUILD: in the Optimize state, two labelled visual elements, FAILURES and SUCCESSES, rise in after the word centres.
- [ ] S2-29 "Failures is you need to know where you're failing, meaning which posts, which things that you did did not work." -> BUILD: FAILURES holds post thumbnails (Amberkloof posts), not abstract text.
- [ ] S2-30 "So which did not drive engagement or conversion." -> BUILD: failure type A, "No engagement, no conversion".
- [ ] S2-31 "Even within that, which drove engagement, but it didn't drive conversion." -> BUILD: failure type B, "Engagement, but no conversion" (for example, many likes and 0 inquiries, labelled as illustrative).
- [ ] S2-32 "So that's one." -> CONTEXT.
- [ ] S2-33 "Number two is successes." -> BUILD: SUCCESSES is the second element.
- [ ] S2-34 "So which ones did do both, and why?" -> BUILD: a success card shows "Drove both", plus a WHY chip (for example "Answered a real question").
- [ ] S2-35 "Right?" -> CONTEXT.
- [ ] S2-36 "So, and to who." -> BUILD: the success card shows a TO WHOM chip (for example "Gift planners, 35-49").
- [ ] S2-37 "That's very important." -> BUILD: TO WHOM is visually the strongest chip on the success card, larger or accented.
- [ ] S2-38 "So why and to who it drove that conversion to." -> BUILD: WHY and TO WHOM appear together on the success card.
- [ ] S2-39 "Then we close that slide." -> BUILD: the scene holds after Optimize and waits for Next.
- [ ] S2-40 "Let's keep all of that information and animation that I've just said in the second slide, where the words like engage, convert and optimize come to the center, and then there's a brief explanation of what it means and what it entails." -> BUILD: all of S2-02 to S2-38 lives in scene 02. Each explanation is brief: at most a heading plus 2 short lines plus the visual chips. No paragraphs.
- [ ] S2-41 "And again, it should auto-scroll, but for this specific slide, I would like to be able to click on it." -> BUILD: scene 02 auto-scrolls through the three beats, and each word is also a button.
- [ ] S2-42 "So I would like to be able to click on engage, and then the animation happens for engage." -> BUILD: clicking Engage plays the Engage animation (centre, grow, explanation) from any state.
- [ ] S2-43 "And then I would like to be able to click on convert and click on optimize when I get to that section." -> BUILD: Convert and Optimize clicks do the same. A click holds auto-scroll on the chosen state, and Next moves on.
- [ ] S2-44 "So obviously convert and optimize is not going to be completely off of the page." -> BUILD: the two words that are not selected stay visible, at least 40% opacity, on screen and readable.
- [ ] S2-45 "It's just that engage is going to be highlighted into the middle." -> BUILD: only the selected word is centred and highlighted.
- [ ] S2-46 "Convert and optimize is going to move away." -> BUILD: the words not selected step aside to the edges, smaller.
- [ ] S2-47 "And when I click on convert, then convert goes to the middle, centered, all the attention there, everything that has to do with convert comes underneath it, and so on and so forth." -> BUILD: each word's details render underneath it when it is centred, and only that word's details show.
- [ ] S2-48 "Once I finish off with optimize, I'll probably click on next." -> BUILD: Next is visible and pulses when the Optimize state has played.
- [ ] S2-49 "Now when I click on next, whether I click on next, so when I click on next, it's going to go to the next page, right?" -> BUILD: Next always lands on the next numbered scene's top.
- [ ] S2-50 "However, again, the animation on that page is going to not show." -> BUILD: the reported defect must not occur. The landing scene's animation shows.
- [ ] S2-51 "If I click on next, then it happens pretty quickly and the page is stationary." -> BUILD: the landing scene is never stationary after Next.
- [ ] S2-52 "So again, when I click on next, that animation should start, or that scroll effect should start." -> BUILD: after Next, scrollY increases within 1 s with no other input. Proof-of-proof: disable the restart call and the check must fail.
- [ ] S2-53 "For now, I'm going to finish here because I want you to first do the changes for me on the first two slides, as well as number three." -> CONTEXT: G15. Slides 1-3 are built first, then the build continues.

### Slide 3 (scene 03, Engage > Who?)

- [ ] S3-01 "All right, so then there is a title that says engage and then who." -> CONTEXT: the "ENGAGE / WHO" title.
- [ ] S3-02 "Now the problem is that you cannot see the title, right?" -> BUILD: the ENGAGE and WHO? title is display size (at least 72 px at 1366x768) and is the first thing that animates.
- [ ] S3-03 "You can see your ideal customer is a hypothesis." -> CONTEXT: the old live headline.
- [ ] S3-04 "However, that sentence doesn't convey what exactly we are saying." -> BUILD: "Your ideal customer is a hypothesis." is not the headline anywhere in scene 03.
- [ ] S3-05 "It doesn't convey in any way or means." -> CONTEXT.
- [ ] S3-06 "So those are the biggest words on the slide, meaning that people are going to focus on it." -> BUILD: whatever the biggest words are, they must carry the slide's message on their own.
- [ ] S3-07 "But if it doesn't say, if the people don't understand it immediately, it really has no effect." -> BUILD: a blind O1 mini-critic shown only a scene 03 capture answers "you probably don't know your best customer yet; your records tell you" (G01 evidence row).
- [ ] S3-08 "So we need to change that." -> BUILD: the headline is replaced. Proposed: "Do you really know who buys from you?" with the sub-line "Most owners guess. Your records know." It gets a slopmonster pass.
- [ ] S3-09 "So number one, I would probably say that the title there, engage and with who, should be animated, so I can start saying, you know, we're firstly going to discuss engagement, and then the word engage needs to be again highlighted, and then who, and then a question mark, and then we go to your ICP, and we explain what we mean here." -> BUILD: the title animates in this order, one at a time, at the presenter's talking pace: (1) ENGAGE highlighted, (2) WHO, (3) a large "?", (4) the ICP explanation. The term "ideal customer profile (ICP)" is spelled out once.
- [ ] S3-10 "So what we mean by your ideal customer is a hypothesis is we want to explain that currently you probably don't know who your ideal customer is." -> BUILD: the slide's first message is "you probably don't know who your ideal customer is yet".
- [ ] S3-11 "And this slide has to convey that, that you don't actually know." -> BUILD: it is conveyed visually. The "assumption" card ("Our customer: women 25-34 who love natural skincare", tagged "A feeling") is contradicted by the data animation.
- [ ] S3-12 "And if you do, kudos to you, but most people don't know." -> BUILD: the speaker note carries the "kudos if you do, most people don't" line.
- [ ] S3-13 "Your ideal customer isn't something you thumb suck, and it isn't something that you just know." -> BUILD: the assumption card is visibly stamped "Guess" or "Thumb-suck" before the data replaces it.
- [ ] S3-14 "It shouldn't be that." -> CONTEXT.
- [ ] S3-15 "It shouldn't be a feeling." -> BUILD: the words "not a feeling" or "A feeling" appear on the assumption card.
- [ ] S3-16 "It shouldn't be a..." -> CONTEXT: an unfinished thought.
- [ ] S3-17 "All right." -> CONTEXT.
- [ ] S3-18 "So what I wanted to say now was, we start with your ideal customer hypothesis, although we need to change it." -> BUILD: the hypothesis framing is reworded (see S3-08). The idea that a first guess gets tested survives in the notes.
- [ ] S3-19 "But it starts by saying, Start with the people who actually buy, inquire, and come back." -> BUILD: the DOM contains, verbatim, "Start with the people who actually buy, inquire, and come back." This is a string check.
- [ ] S3-20 "That's perfect." -> BUILD: no rewording of that sentence, not even "for flow".
- [ ] S3-21 "We need to keep that there." -> BUILD: the sentence stays visible through the infographic beats.
- [ ] S3-22 "Although that sentence has no animation." -> BUILD: the sentence animates. Its three verbs light up in step with three data streams.
- [ ] S3-23 "So that's actually what you want to convey." -> CONTEXT.
- [ ] S3-24 "You want to convey it in an animated form, something that people can pay attention to, what you're saying in the slide, which is start with people who actually buy, inquire, and come back." -> BUILD: three animated streams run, each tied to a verb. BUY is order tokens (shop and markets). INQUIRE is message bubbles (WhatsApp and DMs). COME BACK is repeat-order tokens with a loop arrow.
- [ ] S3-25 "And you want to convey it not with words." -> BUILD: the infographic beats use icons, pictures and motion. On-screen text in them is limited to labels of 3 words or fewer.
- [ ] S3-26 "You want to convey it with animations, pictures, etc." -> BUILD: generated customer pictures (media M11) and product pictures (M03, M08) appear in the scene.
- [ ] S3-27 "Even an infographic that's animated that shows you exactly what analysis of your customer looks like." -> BUILD: the infographic runs capture, then rows, then groups, then a persona card. The streams land as table rows. The rows sort into 3 groups (Gift planners, Self-care regulars, Guesthouses and spas). One group becomes a persona card. Every number is tagged "Illustrative sample".
- [ ] S3-28 "The next sentence says, Ask what job they need done before guessing demographics." -> CONTEXT.
- [ ] S3-29 "Now that sentence in general doesn't say anything." -> BUILD: the DOM does not contain "Ask what job they need done before guessing demographics." This is a string check.
- [ ] S3-30 "There's no clear— when I read that sentence, even me, I'm confused." -> BUILD: no replacement sentence may use jargon (no "jobs to be done", "JTBD" or "demographics" as a bare noun).
- [ ] S3-31 "What the hell are you saying, right?" -> CONTEXT.
- [ ] S3-32 "What are you talking about?" -> CONTEXT.
- [ ] S3-33 "Ask them what job they need done?" -> BUILD: the word "job" appears nowhere in scene 03's visible copy or notes.
- [ ] S3-34 "What are we talking about?" -> CONTEXT.
- [ ] S3-35 "In what industry is this?" -> BUILD: the slide states that the method works in any industry.
- [ ] S3-36 "If the rest of this slide, by the way, is about the food industry, what job would somebody need done that's coming to eat somewhere, right?" -> BUILD: the slide is not tied to food. Amberkloof (a product brand) is the worked example, Tumelo Print & Pack (B2B) is the swap, and an "any industry" strip names other industries.
- [ ] S3-37 "And then it goes on to say before guessing demographics." -> CONTEXT.
- [ ] S3-38 "What does that mean, before guessing demographics?" -> CONTEXT.
- [ ] S3-39 "I don't get it." -> CONTEXT.
- [ ] S3-40 "So we need to make that whole sentence clearer, and we probably need to put an example there, or at least be much more clear in our sentence structures." -> BUILD: the replacement is one short, plain sentence plus an example. Proposed: "Get to know them from your records: who bought, what they asked, who came back." Example strip: "A salon: bookings and rebookings. A plumber: call-outs and repeat clients. A label printer: quotes and reorders."
- [ ] S3-41 "Right?" -> CONTEXT.
- [ ] S3-42 "So the whole point is actually just to get to know them." -> BUILD: the phrase "get to know them" (or the same meaning in plain words) is visible.
- [ ] S3-43 "I wouldn't say ask what job they need done." -> BUILD: the same as S3-33, no "job" wording.
- [ ] S3-44 "It really isn't." -> CONTEXT.
- [ ] S3-45 "It's not specific." -> BUILD: the example is concrete (real field names and illustrative values), not abstract.
- [ ] S3-46 "It's not talking to anything specific." -> CONTEXT, covered by S3-45.
- [ ] S3-47 "It really just doesn't even—it needs to be allocated to be able to be allocated to any industry, and it doesn't allow for that." -> BUILD: there is a B2C to B2B toggle. Tapping "B2B" swaps the persona fields to Tumelo's (industry, company size, area, buyer role, circumstances) without leaving the scene.
- [ ] S3-48 "So we need to be saying there that we need to go and see who is our ICP, obviously, and before we— sorry, how we know who they are is we go and delve into the data." -> BUILD: the visible line says how we know: "We look in the data." The data table is on screen.
- [ ] S3-49 "We need to know age group, even race, and then sex, like male or female." -> BUILD: the persona card shows Age group and Sex. Race is shown as a field marked "Only if they tell you". The POPIA line reads: "Race is special personal information under POPIA. Record it only when customers choose to tell you, never guess it." (decision G3).
- [ ] S3-50 "They're male or female." -> BUILD: the Sex field shows survey-stated values (for example "Mostly men, from the checkout survey").
- [ ] S3-51 "Simple things like that." -> BUILD: the persona card has at most 6 fields: Age group, Sex, Area, Circumstances, Found us on, Race (only if stated).
- [ ] S3-52 "It's, I think you also need to do some research on how to take data and then create a persona for that data." -> BUILD: `experience/persona-research.md` gains cited sources on turning records into a persona (G01-T06). The method on screen (capture, group, describe, test) matches it.
- [ ] S3-53 "And that's it." -> CONTEXT.
- [ ] S3-54 "We also need— well, we need the ability to, number one, gather that data, because it's one thing." -> BUILD: a "Gather" step is drawn first: orders, inquiries, repeat orders, plus a 3-question opt-in checkout survey.
- [ ] S3-55 "So otherwise, if you don't have that data, you are guessing." -> BUILD: the visible line reads "No data? You're guessing."
- [ ] S3-56 "You are basically guessing and going off of a feeling." -> BUILD: this is echoed by the assumption card stamped "A feeling" (S3-15).
- [ ] S3-57 "So you need a process that captures that data." -> BUILD: the capture process is shown as a loop: every sale, inquiry and repeat adds a row, and the 3-question survey fills Age group, Sex and Circumstances. Nothing is uploaded to a public AI. Anonymised counts only.
- [ ] S3-58 "That's very important." -> BUILD: the capture process gets its own beat (at least 10% of the scene's scroll), not a footnote.
- [ ] S3-59 "And then something like circumstances, obviously." -> BUILD: the persona card has a Circumstances field (for example "Busy, buys gifts twice a year, wants it wrapped and delivered").
- [ ] S3-60 "What circumstances are they in?" -> BUILD: the Circumstances field is phrased as their situation, not a demographic.
- [ ] S3-61 "But go and do research about personas and let's teach around building a persona, which is your ideal customer profile, and then just fix everything that I've just said." -> BUILD: the scene teaches building a persona and names it as your ideal customer profile (ICP). Every BUILD line above is ticked against a screenshot.

### Viewport, motion and data rules for these three slides

1. Capture at 1366x768, 1440x900 and 390x844, plus reduced motion.
2. With reduced motion there is no auto-scroll. Each scene shows its complete end state, and the clicks on slide 2 still work.
3. On a phone, scene 01's label is visible. In scene 02 the centred word is stacked above the other two. In scene 03 the streams run vertically and the persona card sits at the bottom.
4. Every figure is tagged "Illustrative sample, not research". No figure animates as a live counter.
5. The proof is checklist-first per RULE 19. Write the expected facts, then capture, then tick each line here.

---

## 5. Media storyboard (for the morning brief, OG-SPEND)

Rules:
1. **ElevenLabs only (G10).** Nothing is generated until OG-EL-AUTH (/mcp) and the owner's "yes" for each batch (G10b). If ElevenLabs cannot make an asset, that asset waits. No other generator is used.
2. **One style preamble, reused verbatim** at the top of every product and studio prompt. Paste it exactly:

   > Photoreal studio product photography, premium editorial catalogue look. Large warm softbox key light from the upper right at 45 degrees, soft rim light on the right edges, gentle warm bounce fill from the left, 4000K. Matte real-world textures with fine micro-detail, subtle specular highlights. Muted sand, taupe, caramel and amber palette. No text, no letters, no logos, no watermark, no people unless stated.
3. Prompt templates A (isolated product), B (plate), C (composite) and D (image-to-video) are in `refs-r4-r5.md` §3.3. Products are generated on flat `#D9D2C8`, and each asset passes the 8-point QC in §3.7 before use.
4. **Credit estimates are ESTIMATES.** They assume about 5,000 ElevenLabs credits per US$1 and public per-unit prices: a premium photoreal image about US$0.20, a standard image about US$0.05, video without audio about US$0.17-0.20 per second (ElevenLabs enterprise price references, 2026). Check the in-app price before spending. Every batch adds a 50% allowance for rerolls.

### Batch B1: brand kit and slides 1-3 (G01-T07)

| ID | Scene | What it shows (R5 spec) | Format / aspect / duration | Credits (estimate) |
|---|---|---|---|---:|
| M01 | 01, 11, all studio scenes | Empty stage plate (template B): a rough travertine plinth in the lower fifth, a warm limewash plaster room, soft stepped stone blocks behind, faint haze, 60 mm at plinth height | Image, 16:9, 2560x1440 | 1,000 |
| M02 | 01, 11 (phone) | The same plate composed for portrait | Image, 9:16, 1080x1920 | 1,000 |
| M03 | All (protagonist) | P1 Marula Face Oil bottle, isolated (template A), turned 30 degrees, one golden drop on the pipette | Image, 1:1, 1536 (cutout 1024/512) | 1,000 |
| M04 | 01, 03, 15 | P1 slow turntable, 0 to 180 degrees about the vertical axis, locked camera, flat `#D9D2C8` ground (frames extracted to 36 WebP) | Video, 1:1, 5 s, no audio | 5,000 |
| M05 | 01, 06, 11, 15 | P2 Rooibos Body Butter jar with the lid floating above | Image, 1:1 | 1,000 |
| M06 | 06, 11 | P3 Buchu Hand Wash pump bottle | Image, 1:1 | 1,000 |
| M07 | 06, 11, 15 | P4 Baobab Lip Balm tin with the lid tilted open | Image, 1:1 | 1,000 |
| M08 | 03, 09, 11, 15 | P5 Gift Set, a closed kraft carton with a linen ribbon and a dried fynbos sprig | Image, 1:1 | 1,000 |
| M09 | 01, 11 | P6 satellites: marula fruit half, rooibos needle-leaf cluster, buchu sprig (3 separate generations) | 3 images, 1:1 | 3,000 |
| M10 | 01 | Ambient clip (template D on an M01, M03 and M09 composite): very slow push-in, the bottle turning slowly, a diagonal light sweep, no new objects, no text changes | Video, 16:9, 8 s, no audio | 8,000 |
| M11 | 03 | Three customer vignettes, photoreal, natural South African settings, no text: (a) a man in his 40s at an office desk with a wrapped gift box; (b) a woman in her 30s at a bathroom shelf with an amber bottle; (c) a guesthouse owner setting an amenity tray on a bed. People are shown for the story only. The persona's race field stays "only if they tell you" | 3 images, 4:5 | 3,000 |
| | | **B1 subtotal** | 15 generations | **26,000** (+50% = **39,000**) |

### Batch B2: Engage chapter, scenes 04-07 (G02)

| ID | Scene | What it shows | Format / aspect / duration | Credits (estimate) |
|---|---|---|---|---:|
| M20 | 04 (Instagram), 10 | The gift set and bottle in an editorial still, warm studio, square crop room | Image, 4:5 | 1,000 |
| M21 | 04 (TikTok) | Hands placing one drop of oil on the back of a hand, macro, warm window light, no face | Video, 9:16, 6 s, no audio | 6,000 |
| M22 | 04 (Facebook) | A family birthday table with the wrapped gift set being handed over, faces soft or out of frame | Image, 4:5 | 1,000 |
| M23 | 04 (LinkedIn, B2B) | Tumelo: kraft cartons stacking off a small press, a worker's gloved hands, industrial warm light | Image, 1.91:1 | 1,000 |
| M24 | 04 (Google Business) | A small workshop-shopfront in a Pretoria East suburb, an amber-lit window, no readable signage | Image, 4:3 | 1,000 |
| M25 | 04 (Website), 07 | The Amberkloof demo-site hero: the bottle on the plinth with wide negative space on the left for HTML text | Image, 16:9 | 1,000 |
| M26a | 06, 10, 11 (as M40's sibling) | **Average** simple visual: the bottle on a cluttered kitchen counter, a phone snapshot with flat light | Image, 1:1 (standard model is fine) | 250 |
| M26b | 06 | **Good** simple visual: an R5 composite of the bottle and satellites (template C, no phone) | Image, 1:1 | 1,000 |
| M27 | 06, 10 | An 8 s vertical ad: the gift box lid lifts and the bottle, jar and tin rise and float, a light sweep, a slow push-in. Last frame matches the first (loop) | Video, 9:16, 8 s, no audio | 8,000 |
| M28 | 07 | Search satellites: a brushed-brass magnifier, a ceramic map pin, a star-rating token (3 cutouts) | 3 images, 1:1 | 3,000 |
| | | **B2 subtotal** | 12 generations | **23,250** (+50% = **34,875**) |

### Batch B3: Convert and Optimize, scenes 08-10 (G03)

| ID | Scene | What it shows | Format / aspect / duration | Credits (estimate) |
|---|---|---|---|---:|
| M30 | 08 | Composite keyframe (template C): a dark phone with a bronze frame on the plinth, the gift set and bottle bursting out of the screen toward the camera, a frosted chat-bubble shape floating to the right (left blank for HTML) | Image, 16:9 | 1,000 |
| M31 | 08 | Image-to-video from M30 (template D): the products drift out and settle toward the chat bubble, a light sweep, no new objects | Video, 16:9, 8 s, no audio | 8,000 |
| M32 | 09 | Interact satellites (R5 set): a glass chat bubble, a calendar card, a quote document, a matte ceramic bell (4 cutouts) | 4 images, 1:1 | 4,000 |
| M33 | 09 | Tumelo: a flat kraft carton blank on a press bed, top-down three-quarter view (cutout) | Image, 1:1 | 1,000 |
| | | **B3 subtotal** | 7 generations | **14,000** (+50% = **21,000**) |

Scene 10 is built in code (lens switch, bars, cards) and needs no generation.

### Batch B4: Attract, Interact and Responsible AI, scenes 11-13 (G04)

| ID | Scene | What it shows | Format / aspect / duration | Credits (estimate) |
|---|---|---|---|---:|
| M40 | 10, 11 | **Average** start frame: the gift box shot flat on a white kitchen counter with harsh on-camera flash, a hard shadow, slightly tilted | Image, 1:1 (standard model) | 250 |
| M41 | 11 | **Good** full R5 stage (template C): phone on the plinth, the bottle breaking out, satellites, two blank glass-card shapes | 2 images, 16:9 and 9:16 | 2,000 |
| M42 | 11 | The Good vertical ad: floating products turning slowly, a light sweep, a flare blooming top-right (template D) | Video, 9:16, 8 s, no audio | 8,000 |
| M44 | 11 exit, 12 | Neutral analogy (G12): a beautifully lit boutique shop window at dusk, Amberkloof products on travertine steps inside, warm interior glow against a blue-hour street, no readable text | Image, 16:9 | 1,000 |
| M45 | 12 | Image-to-video from M44: a slow push-in toward the window, interior light breathing, no people, no new objects | Video, 16:9, 6 s, no audio | 6,000 |
| M46 | 12 (optional) | An alternate analogy: a perfume and skincare counter close-up, glass and brass, inviting | Image, 16:9 | 1,000 |
| | | **B4 subtotal** | 7 generations | **18,250** (+50% = **27,375**) |

Scene 13 is built in code (red pen, cards). The scene 11 "same prompt" generic cards are deliberately code-made, so no credits are spent making slop.

### Batch B5: close, scenes 14-15 (G07)

| ID | Scene | What it shows | Format / aspect / duration | Credits (estimate) |
|---|---|---|---|---:|
| M50 | 15 | The gift box open and empty, top-down three-quarter view, shredded kraft inside (cutout) | Image, 1:1 | 1,000 |
| M51 | 15 | The gift box lid alone, matching angle and light (cutout) | Image, 1:1 | 1,000 |
| | | **B5 subtotal** | 2 generations | **2,000** (+50% = **3,000**) |

Scene 14 is code-made (pedestal T18). The volunteer's own assets render live.

**Grand total (estimate):** 43 generations (36 images, 7 videos), about **83,500 credits** before rerolls and about **125,250 credits** with the 50% allowance. **Order of approval:** B1 first, because it is needed by every other batch and by G01.

**Not generated anywhere:**
- platform logos (official files);
- real ads (embeds or links);
- all text, prices, CTAs and UI (HTML);
- charts and diagrams (code).

---

## 6. Protagonist thread (oryzo's main move)

**The bottle (P1, Amberkloof Marula Face Oil) is on stage in every scene.** It lives on one `position: fixed` stage layer outside the sections, and a master GSAP timeline moves it between per-scene "slots" with `Flip.fit`. Its context changes and the object stays (oryzo teardown §3.1). Each scene has the bottle **answer that scene's question**:

| Scene | Question | What the bottle does |
|---|---|---|
| 01 | What is this hour? | It floats on the plinth, turns, and catches the light. The promise is set around it |
| 02 | How does growth work? | It is the core that Engage, Convert and Optimize orbit |
| 03 | Who buys? | Its label band unrolls into the customer data table, then re-rolls as the persona card |
| 04 | Where are they? | It stands before the phone while the platform wheel spins around it, and it appears in each platform's live post |
| 05 | What works? | It slides into the gap on the competitor shelf |
| 06 | How do we make content? | It is the subject of every AI output, and its caption shatters into the human voice |
| 07 | How are we found? | It sits on the answer page that the AI panel cites |
| 08 | How do we capture? | It jumps out of the ad into the WhatsApp chat |
| 09 | How do we follow up? | It rides inside Tumelo's gift box through quote, order, invoice and review |
| 10 | What worked? | It appears in Friday's winning ad and in Tuesday's failed flat photo |
| 11 | Why does beauty win? | It is rebuilt from a flat snapshot into the floating hero, one layer at a time (the peak) |
| 12 | How do we invite interaction? | It sits in the shop window and bursts its details when tapped |
| 13 | How do we use AI responsibly? | Its AI-written description is struck through by the red pen |
| 14 | And for your business? | It steps aside on the pedestal. Its persona-card format returns, holding the volunteer's data |
| 15 | What now? | It settles into the gift box, and the lid closes on the QR |

The gift box (P5, made by Tumelo) is the second continuous object. It carries the B2B story (09), the attraction argument (11) and the takeaway (15).

---

## 7. Mobile composition (390x844) and reduced motion

Mobile is composed separately, not shrunk (scroll-craft, hero-depth §mobile):
- the stage is portrait (M02);
- the bottle sits top-centre at about 40% of the height;
- the copy panel sits at the bottom with text at 14 px or more;
- tap targets are 44 px or more;
- type sits above the subject where it passes behind on desktop.

| Scene | Phone composition |
|---|---|
| 01 | The label "Sales, Marketing and AI" is visible (S1-03). The headline sits above the bottle with no type-behind. There are 2 satellites instead of 3 |
| 02 | The centred word is stacked full-width above the other two, which sit in a row of smaller pills. Failures and Successes stack vertically |
| 03 | The streams run top to bottom. The table shows 4 columns (Product, Area, Found us on, Repeat?) and the rest move into the persona card. The persona card is a bottom sheet |
| 04 | Consent and the questionnaire are presenter-laptop sheets. The wheel becomes a horizontal swipe carousel of the 7 platforms (wordmarks until OG-BRAND) above the phone. Tapping one makes it come alive |
| 05 | The competitor shelf becomes a vertical stack. The recipe splits downward |
| 06 | The 5 outputs become a 2-column grid. The voice pair becomes a before/after swipe |
| 07 | The exploded search fans vertically. The 30/60/90 plan becomes tabs |
| 08 | The landing page is full-screen and the helper is a bottom sheet. The Average/Good CTA is a toggle |
| 09 | The channel picker becomes 4 stacked tabs. The horizontal pan becomes a vertical track. The pipeline boxes stack |
| 10 | Posts in a 2-column grid. The lens wipe goes top to bottom |
| 11 | The switchboard becomes 5 pills under the stage. The stage uses the 9:16 assets (M41 portrait, M42) |
| 12 | Window crop centred on the bottle. Detail arcs become bottom sheets. Websites open in a full-screen live window. Design-loop rounds stack |
| 13 | The three exercises stack vertically. The consent recap is one line (consent itself was at 04-1, on the presenter laptop) |
| 14 | Report tabs stacked. The two QR codes become two direct link buttons |
| 15 | Skill cards in a vertical list, a full-width download button, and the commitment as 4 stacked lines |

**Reduced motion** (`gsap.matchMedia`, oryzo checklist item 15, where oryzo itself fails):
- no auto-scroll, no scrub timelines, no idle float;
- every scene shows its p ≈ 0.92 end state, with 200 ms crossfades;
- the turntable rests on its three-quarter frame and videos are paused behind a play button;
- clicks, toggles, the switchboard and the live runs still work;
- deep dives stay reachable.

---

## 8. Stage system and chapter colour rhythm (handoff to T03)

1. **Stage layer:** a fixed `.stage` holds L0-L8 from `refs-r4-r5.md` §4.1. Scenes declare a bottle slot (`data-slot`), and the master timeline Flips the bottle between slots across each seam.
2. **Each scene declares** `data-minutes`, `data-height` (the vh from 3.1), `data-palette` (studio, green, cream, dusk or workbench) and any `data-live-run` and `data-deep-dive` beats.
3. **Live-run beats:** auto-scroll holds at the beat until the result arrives; on an error or unreachable runner the cached run tagged "cached run" shows within 1 s, and if the complete result has not rendered by 20 ± 2 s from scene reveal it shows then, even while progress streams (A1.4). Then auto-scroll resumes.
4. **Deep-dive beats (A2.6):** each has a default beat with real scroll height in the auto-scroll path. The presenter toggle expands the current scene's remainder.
5. **Colour bridges** happen in the last 8% of the outgoing scene, by scrubbing `--bg` and `--fg` on `:root`:

| Seam | Bridge |
|---|---|
| 01 to 02 | warm to green |
| 04 to 05 | cream to deep green |
| 05 to 06 | green to warm studio |
| 06 to 07 | warm to cream |
| 07 to 08 | cream to warm |
| 08 to 09 | warm to green |
| 09 to 10 | green to dark green |
| 10 to 11 | near-black to warm (the peak) |
| 11 to 12 | warm to dusk |
| 12 to 13 | dusk to cream |
| 13 to 14 | cream to green workbench |
| 14 to 15 | green to cream, then warm |

The chapter boundaries (Engage, Convert, Optimize, Attract, Interact) each show a visible colour or light shift (oryzo checklist item 12).

6. **Type in depth** in at least 3 scenes: 01 ("found" behind the bottle), 04 (the platform name behind the phone), 11 ("ATTRACT" behind the products), and 15 (the wordmark behind the box).

---

## 9. Decisions the owner may veto (taken overnight under delegation)

Every row below is **PROVISIONAL** (A1.2) until the owner's acceptance is quoted with a timestamp in `decision-register.md` (G01-T02A). Silence is not acceptance. A veto reopens the tasks that cite the row and the tasks touching the same scene or files (A2.5). The A2.6 compressions C1-C6 and move M1 are withdrawn (v2); the v2 cut list in `story-spine-v2-timing.md` section 8 is on the same veto list, with D-21..D-27 below.

| ID | Decision | Why | Cost of reversing |
|---|---|---|---|
| D-01 | The hero brand is **Amberkloof** (botanical body care, Pretoria East). It replaces Amina's Kitchen throughout. `amina-lunch-3d.*` and `amina-ad-motion.mp4` are retired **only after approved replacements are integrated** (A1.9, A2.6); until then they stay in place | G7 asked for a new invented product brand suited to floating 3D renders. Skincare is the R5 archetype and gives Responsible AI a concrete stake | Rename is cheap before B1 media; costly after |
| D-02 | The B2B swap-in is **Tumelo Print & Pack**, which prints Amberkloof's gift box | One object carries both stories | Low |
| D-03 | Both names were checked by web search only (no hits). CIPC and trademark registers were not searched | It was night, and no register access was available | A 5-minute owner check |
| D-04 | The grammar is "Presented film", authored new (section 0) | The eight standard grammars each break a presenter requirement | Planning only |
| D-05 | Build a small, clearly labelled **fictional Amberkloof demo website** on the public site, so the cached runs are real recorded runs and scene 07 has a scan target | A cached run of a site that doesn't exist would be fabricated | Adds about 2 hours to G02/G05. Without it the cached runs use a volunteer-type real site |
| D-06 | **PROVISIONAL, applies only if the owner accepts it (A1.5).** In-scene live runs (05, 06, 07) query the real market category ("natural skincare Gauteng"), so real competitor names appear on stage with attribution. Default until then: the runs target the volunteer's consented business | The fictional brand can't be scanned. Real market data is the honest demo | The default already uses the volunteer business (G7b, A1.5) |
| D-07 | **Superseded by D-21 (v2).** Consent is at 04-1 and Tool A, like every volunteer run, starts at 04-2. Scene 13 keeps a 10 s consent recap (13-6). The old D-07 (consent and the Tool A start in 13) would leave Tool A about 3 minutes of head start and the Engage slots without consent | A full scan takes longer than the in-scene limit; consent must come before every run (A1.5) | Move the intake back to 13 and accept likely cached fallbacks |
| D-08 | `sceneSeconds` v2.1 is `[120,180,370,340,285,435,325,260,340,180,310,325,180,280,265]` (69:55; v2 was 69:00), replacing the A2.6 array, until the owner picks cuts (timing file section 8) | Every beat timed honestly (VS-13, VS-15) | Edit one array |
| D-09 | Consistency and the content plan (T5) fold into scene 06. There is no 16th scene | Keeps "one to fifteen". The current 06 already holds the weekly habit | A 16th scene would add an arrival and an exit beat (about 25 s) to the 69:55 total without adding content (v2.1, NV-m9) |
| D-10 | Responsible AI gets 3:00 with three exercises (13-2..13-4, G04-T09). Each deep-dive default is a numbered beat in the path (section 3.3); expanded remainders are presenter-optional | Paste A topic T8 and G04-T09 | Owner picks cuts; any cut is HELD |
| D-11 | The `NN / 15` counter shows only in the presenter bar, not on the audience layer | scroll-craft bans section counters on the visible page | Low |
| D-12 | Proposed copy: the slide 3 headline "Do you really know who buys from you?", the slide 2 Convert headline, the any-industry strip, and "Copy what works. Then fill the gap." (05-7, 06-14). That last line is builder wording for the owner's "not just copying what they are doing, but I'm also actively looking for other things" (Paste A); it is not the owner's line and must not be frozen as owner words (G02-Q8; v2.1, NV-m1) | Paste B asks for clarity. Final copy gets a slopmonster pass | Copy only |
| D-13 | Persona numbers are an "illustrative sample of 60 orders" (24/21/15) | No real data exists for a fictional brand. Labelled, and never animated as live counters | Low |
| D-14 | **Superseded on stage by A1.10 and A2.7:** on stage the scene 08 AI helper is live through the local presenter runner, with fictional demo details only and a tagged scripted fallback. The scripted local demo ("Nothing is sent") stays on the public deck only | Keeps visitor data local on a public page; no real details reach Anthropic on stage | The stage helper needs OG-DATA approval of its demo-data label |
| D-15 | Platform logos are official brand files, crisp and unmodified, **only after OG-BRAND closes** (A2.9). Until then the wheel shows text wordmarks labelled "logo pending brand-terms acceptance"; the Google G only where its classroom terms allow; TikTok as text unless written permission arrives. Instagram's rule against sitting beside other networks conflicts with G5 and is HELD (Q-INSTAGRAM) | Accepting brand terms is the owner's act | Needs OG-BRAND and the Instagram answer |
| D-16 | Cutting products out needs a **non-generative background-removal step** after ElevenLabs generates them on `#D9D2C8`. If ElevenLabs offers no matting tool, a local matting tool is used | G10 limits generators. Matting edits an asset, it doesn't generate one | If vetoed, products ship as composites only, with no independent float planes |
| D-17 | Credit estimates assume about 5,000 credits per US$1 and public per-unit prices | No in-app price is visible before OG-EL-AUTH | Re-estimate after auth |
| D-18 | Real-ad slots are named per scene (timing file section 5): AD-E1..E4 in 06 (sourced, embed browser-tested), AD-C1..C3 in 08, AD-A1..A6 in 11. The R1 reel and the R2 and R5 pins are design references and never count as ads. R1 is labelled "Good" for 0-7.9 s and "Average" on its end card only (A1.10). Every ad is embedded in-scene with attribution and its public signals; link-only ads do not count (A2.7); an empty slot is HELD | G6, U78 (the owner's priority) | Swap picks freely for embeddable ads |
| D-19 | Scene 01's ECO compass image leaves the stage. The compass ring returns as the orbit track in 02. The bottle is the opening visual | The protagonist must be present from frame one (oryzo move 1). S1-01's "looks good" is kept as structure | Keep the compass behind the bottle as L1 |
| D-20 | Last 30 Days needs the G02-T02K tool review and the SCRAPECREATORS key. Until both exist there is no live or cached run, and 06-13 stays PARTIAL (v2 correction) | G4b, OG-KEYS | None |
| D-21 | Volunteer consent (04-1) and the questionnaire (04-2) open scene 04. Every run (competitor scan, B2B find, content, Last 30 Days, keywords, SEO, backlinks, citations, 30/60/90, the AI helper's prefilled fictional question, Tool A, Tool B) starts at 04-2 Submit; the runner queues them 4 at a time in reveal order. The questionnaire is business-level, aggregate and optional; no personal contact details are typed, and the consent card names the answers and the processors (v2.1, NV-m2; Q-DATA) | Consent before every run (A1.5); head starts of 280 s or more make every volunteer slot live; Paste A puts the questionnaire before "where they live"; scene 03 is being built (G01), so the start is after it rather than at the Engage opener (G02-Q2) | Move the intake; later starts risk cached fallbacks |
| D-22 | Scene 06 owns the claude-video-studio devices, the Claude + Claude Code beat, the chef line and the five habits (G02-T11 outranks the spine's DD-11 placement, A1.1). 12-9 reuses the same-prompt component for G04-T08. DD-11's default moves from 11 to 06; its expanded remainder stays in 11 | One build, shown once in full; both goals met | Move 06-3..06-6 to 11 (+75 s there) |
| D-23 | Teach AI (judge with design-loop, recreate the look with the Claude Design System, recreate an interaction) closes scene 12 | Paste A teaches "what is attractive ... and how interactions work" after both are explained | Move to 11 |
| D-24 | The channel picker (website chatbot, WhatsApp, social DMs, Slack with the honest answer) opens scene 09 | G03-T08, U14 | Low |
| D-25 | Scene 15's next-steps card (G07-T10) and the 7-day test are one beat (15-6): the same four picks | Saves a duplicate beat | Split into two beats (+40 s) |
| D-26 | Conversion-skill sources, re-checked 2026-10-27 with `gh api repos/coreyhaines31/marketingskills/contents/skills` and its commit history (v2.1, NV-02). Today the repo (MIT) has cro, popups and signup at github.com/coreyhaines31/marketingskills/tree/main/skills. Commit 30f9b9a (2026-05-14, "v2.0 skill renames and CRO consolidation") renamed page-cro to cro, popup-cro to popups and signup-flow-cro to signup, and moved form-cro into cro/references/form.md. The old names are readable at its parent commit: github.com/coreyhaines31/marketingskills/tree/f3990f7f99ae63b9e26eaa61114f60e0408742ff/skills (which has no cro). On screen, 08-8 and 15-4 use the current names and the main path; 09-14 adds the old names with the pinned URL. Local copies were not byte-compared. email-sequence comes from Anthropic's knowledge-work-plugins marketing pack (G03-Q1, G13). whatsapp-sequences: source not found | VS-14 and NV-02: say exactly where to find them, with a path that works today | G03-T01 confirms or corrects |
| D-27 | Pacing: each beat's p-width is proportional to its seconds; the engine keeps `PACE_SHARE = .85`; `sceneSeconds` v2 is the pace until the owner picks cuts. Live slots are timed from scene reveal, as A1.4 (binding) words it, until the owner answers Q-REVEAL; the runner's per-slot `reveal()` (D15) is the alternative (v2.1, NV-m3) | One honest timing model | Q-REVEAL |

---

## 10. Exclusions and verification of this file

- **Not done here (by design):**
  - no code, no HTML changes, no media generation;
  - no edits to `MASTER-PLAN.md`, `progress.md`, the morning brief or the fingerprint registry (this task may write only two files);
  - final copy is not slopmonster-processed;
  - the "where to learn" URLs are not verified (G07);
  - the real ads are not selected (G04);
  - the ElevenLabs in-app prices are not checked (OG-EL-AUTH pending).
- **Checked (v2.1):** `python scripts/check-spine-v2.py` passes (receipt in the timing file, section 10): scene sums, p-ranges, clocks and head starts, card match (text included), per-unit beat + p-range + seconds + substance for every deck unit, the slot floors and sourcing counts, and every cut-list total and claim. The v2.1 total is 69:55, not 60. Section 4 now also carries the spec's viewport, motion and data rules.
- ~~Checked: every unit U01-U106 appears in section 2 (script check after writing). The talk minutes sum to 60.~~ (A2.6 claim, withdrawn by v2: an ID-only check, VS-16.)
- **Amended 2026-10-27 (A2.6 receipt; superseded by the Spine v2 receipt where they conflict):** deep-dive default beats in the auto-scroll path, minutes re-fit to 60 (`[2,3,5.5,3.5,5,6,6.5,4,5,3,4.5,3.5,1.5,4.5,2.5]`), D-06 and D-07 PROVISIONAL, Amina retired only after approved replacements, the stage helper live with fictional demo data, real ads embedded in-scene. Section 4 and the keep-sentence were not touched. Checked since by CR-VF-SPINE (FAIL, 16 material) and CR-VF-SPINE-2 (FAIL, 3 material, fixed in spine fix round 3, v2.1); CR-VF-SPINE-3 is next.

---

## 11. G01 follow-ups (scenes 01-03, recorded, not rebuilt here)

G01 is building scenes 01-03 now, so v2 does not change their cards' structure. These are the changes the critic asked for, for the G01 builder:

1. **F-01 (VS-m5, S3-13):** stamp the 03-2 assumption card "Guess" (or "Thumb-suck") before the data replaces it; "A feeling" stays (S3-15).
2. **F-02 (VS-m5, S3-54, S3-27):** draw GATHER first. The capture loop (sales, inquiries, repeats, plus the 3-question survey) should appear before the rows fill the table, so the infographic reads capture, then rows, then groups, then persona. Either swap the content of 03-3 and 03-4 or let the streams draw the capture loop as they land. The keep-sentence and its streams stay.
   - **G01 repair receipt (2026-10-28):** resolved by keeping GATHER first, as the owner spec S3-54 requires ("a Gather step is drawn first"), which outranks the v2 beat table (A1.1). Built order in scene 03: 03-3 GATHER plus the 40 s write-down at p 0.24-0.45 (timer starts by itself at p 0.43 and holds the auto-scroll 40 s), 03-4 streams pour into the bottle's label band, which unrolls into the table, at p 0.45-0.58, then GROUP 0.58-0.75 and DESCRIBE plus TEST 0.75-1. Scene travel stays 330 s; the 40 s timer hold makes the 370 s of v2.1. `story-spine-v2-timing.md` rows 03-3 and 03-4 swap content, not p-ranges.
3. **F-03 (VS-m5, S2-17):** in 02-3, point "You can't convert people you don't know" at the commenter from 02-2 (the "Is this OK for sensitive skin?" bubble returns beside the line).
4. **F-04 (VS-m7, U31 "What's the size in terms of percentage for both?"):** the persona's Sex field and the group cards show an illustrative split, for example "Sex: 70% men, 30% women (illustrative, checkout survey)". G02's D-SPEC-03 asks for the same.
5. **F-05 (VS-15, NV-01, changed in v2.1):** the 40 s write-down is now timed: 03-4 = 87 s (47 s GATHER + 40 s writing) and scene 03 = 370 s, so `sceneSeconds[2]` = 370. Build it as the goal-01 journey row says: a visible 40 s countdown chip that holds auto-scroll while ambient motion continues. It is a planned wait counted in 03-4's seconds, never in the 15% hold slack. If G01 wants 03's p-widths to stay proportional to seconds, widen 03-4 and narrow the others in the same ratio; the timing file then follows G01's p-ranges. The DD-03 default (about 25 s) still has no own p-range inside 03-6: for example split 03-6 into the persona at 0.75-0.84 and the B2B toggle plus DD-03 at 0.84-0.92, or, if the owner takes cut K01, drop the cached two-step list from 03 because the live B2B find is 05-6. Dropping the write-down itself is K31, a Tier 4 goal shortfall (HELD).
6. **F-06 (VS-m6):** the 03 tag now reads "Illustrative sample, not research" (spec rule 4), and section 4 now carries the spec's viewport, motion and data rules.
7. **F-07 (VS-01):** scene 03 needs no consent or live-run code; every run starts at 04-2. When G01 next touches `scroll-presentation.js:392`, the engine array takes the v2.1 values (or the owner's cut values); scenes 01-03 take 120, 180 and 370 s.
8. **F-08 (NV-m9, NV-01, new in v2.1):** the scene 03 card's "Talk minutes: 5.5 (A2.6: includes the 0.5 min DD-03 default beat; no live run). Includes a 40-second write-down." line is stale. It should read: "Talk time (v2.1): 370 s = 6:10 (6 beats), including the 40 s write-down timed inside 03-4 and the DD-03 default (about 25 s) inside 03-6; no live run." The spine's "v2 timing" line under the card already says this; the card body is G01's to change.

**Next action (about 2 minutes):** the owner picks Option 0 or his cuts from `story-spine-v2-timing.md` section 8, then approves or vetoes D-01 and batch B1 so G01-T07 can generate the slide 1-3 media.
