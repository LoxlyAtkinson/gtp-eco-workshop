**Next action (owner, about 15 minutes at 04:00):** read section 8 (the ranked cut list) and pick Option 0 (run the full 69:55) or the cuts you accept. Then answer the 6 questions in section 9. Until then the deck paces at the 69:55 array below, and nothing is cut.

# Story spine v2: per-beat and per-unit timing

- **Date:** 2026-10-27 (night); v2.1 after the CR-VF-SPINE-2 critic (spine fix round 3, receipt in `story-spine.md`). **Status:** PROVISIONAL builder plan (A1.2), for the owner's 04:00 review. It replaces the A2.6 minutes in `story-spine.md`.
- **Why it exists:** the CR-VF-SPINE critic failed the A2.6 spine (`.claude/goals/2026-10-27-gtp-cinematic-eco/critics/cr-vf-spine.md`, VS-01..VS-16). The owner's content plus the goal floors do not fit 60 minutes. This file times every beat honestly instead of compressing it.
- **Source of truth:** every table below is generated from one beat list, and the scene cards in `story-spine.md` section 3.2 carry the same IDs, p-ranges, seconds and on-screen text. `scripts/check-spine-v2.py` re-checks the sums, the p-ranges, the clocks and head starts, the card match (text included), the unit coverage, the slot floors and every cut-list claim.

## 1. How the numbers work

1. **Seconds** are talk seconds: what the presenter needs to say and the room needs to see for that beat. They are not compressed to fit 60 minutes.
2. **p-ranges** run from 0.00 to 0.92 in every scene (auto-scroll stops at 0.92, G9). In scenes 04-15 each beat's p-width is proportional to its seconds. Scenes 01-03 keep the p-ranges of the cards being built now (G01); their seconds follow from those widths, except 03-4, which also carries the 40 s write-down (rule 3): 47 + 40 = 87 s (G01 follow-up F-05).
3. **Pacing:** the engine already scrolls each scene in 85% of its minutes (`PACE_SHARE = .85` in `scroll-presentation.js`). The other 15% is slack for click-holds, a late live result (at most 22 s, A1.4) and the end hold before Next. Planned waits (write-downs, votes, QR scans) are counted in their beat's seconds, never in that slack: the scene 03 write-down (03-4), the vote (04-11), the QR scan (14-12) and the 7-day-test write (15-6) (v2.1, NV-01).
4. **Scroll height** for scenes 04-15 is 100vh plus 45vh per beat (60vh per beat in the peak, scene 11), rounded up to 20vh. Scenes 01-03 keep their G01 heights.
5. **Live runs (VS-01):** consent (04-1) comes before every run. All runs start together at 04-2 Submit: every volunteer run, Tool A, Tool B and the AI helper's prefilled fictional question (v2.1, NV-m3). The runner queues them 4 at a time in reveal order; the measured runs (24.8-51.7 s each, 3 queue batches) finish about 2.5 minutes after Submit, and the first reveal (05-3) comes 280 s after Submit. Each slot keeps the one fallback contract (A1.4, binding): the tagged cached run within 1 s of an error, or at 20 +/- 2 s from scene reveal if the complete result is late. The plan follows that binding wording until the owner answers Q-REVEAL.
6. **Clock** assumes no holds: the session starts at 0:00 on scene 01.

## 2. Scene totals

| Scene | Title | Beats | Seconds | Minutes | Live-result s | Scroll height | Starts at |
|---|---|---:|---:|---:|---:|---|---|
| 01 | Open: Be found. Be chosen. Keep learning. | 5 | 120 | 2 | 0 | 200vh | 0:00 |
| 02 | ECO loop: Growth is a loop. Make each turn useful. | 4 | 180 | 3 | 0 | 240vh | 2:00 |
| 03 | Engage > Who? | 6 | 370 | 6.167 | 0 | 340vh | 5:00 |
| 04 | Engage > Where? | 11 | 340 | 5.667 | 0 | 600vh | 11:10 |
| 05 | Engage > What? | 8 | 285 | 4.75 | 190 | 460vh | 16:50 |
| 06 | Engage > Make it yours (AI content, voice, habit) | 15 | 435 | 7.25 | 135 | 780vh | 21:35 |
| 07 | Engage > Be found (website, SEO/AEO/GEO, 30/60/90) | 11 | 325 | 5.417 | 175 | 600vh | 28:50 |
| 08 | Convert > Capture | 10 | 260 | 4.333 | 60 | 560vh | 34:15 |
| 09 | Convert > Follow up (where AI answers, funnel, pipeline, reviews) | 15 | 340 | 5.667 | 0 | 780vh | 38:35 |
| 10 | Optimize: what worked, and for whom? | 5 | 180 | 3 | 0 | 340vh | 44:15 |
| 11 | Attract (THE PEAK) | 10 | 310 | 5.167 | 0 | 700vh | 47:15 |
| 12 | Interact, then teach AI | 16 | 325 | 5.417 | 0 | 820vh | 52:25 |
| 13 | Use AI responsibly | 6 | 180 | 3 | 0 | 380vh | 57:50 |
| 14 | Your turn: Tool A + Tool B live | 13 | 280 | 4.667 | 220 | 700vh | 60:50 |
| 15 | Keep learning (skills download, where to learn, your 7-day plan) | 7 | 265 | 4.417 | 0 | 420vh | 65:30 |
| **Total** | | **142** | **4195** | **69.917** | **780** | | ends 69:55 |

- **Overall real talk time: 4195 s = 69:55 (69.92 min).** That is 9:55 over the 60:00 goal and 8:55 over the rehearsal window (60:00 +/- 60 s, A1.6). v2.1 adds 55 s to v2's 69:00: the scene 03 write-down gets its own 40 s inside 03-4 (NV-01) and 15-6 gets 75 s instead of 60 s (NV-m10).
- **Live-result seconds:** 780 s (13.0 min) of beats that show a live result. 330 s of them are not runnable today: 05-6 and 06-13 (110 s, BLOCKED on keys or review), Tool A 14-2..14-7 (120 s, BLOCKED on G05 + OG-KEYS) and Tool B 14-8..14-11 (100 s, HELD on OG-CLAUDE-PAGE) (NV-m4). The A2.6 figure of 6.0 min left out the scene 08 helper and the earlier figure was 9.0 min, not 9.5 (VS-m4).

**`sceneSeconds` (v2.1, PROVISIONAL, matches the beats):**

```js
const sceneSeconds=[120,180,370,340,285,435,325,260,340,180,310,325,180,280,265]; // sum 4195 s = 69:55
const sceneMinutes=sceneSeconds.map(s=>s/60);
```

**`sceneMinutes` (v2.1, rounded to 3 decimals for reading):** `[2,3,6.167,5.667,4.75,7.25,5.417,4.333,5.667,3,5.167,5.417,3,4.667,4.417]`, sum 69.92 min. If the owner accepts cuts, the engine array is rebuilt from the cut beats' new seconds (section 8 gives the scene each cut touches).

## 3. Every beat (unit, beat, scene, p-range, seconds, substance shown)

| Beat | Scene | p-range | Seconds | Clock | Substance on screen | Units | Live slot | Ad / site / QR slots |
|---|---|---|---:|---|---|---|---|---|
| 01-1 | 01 | 0.000-0.080 | 10 | 0:00 | Arrive on warm near-black: the bottle (P1) on the travertine plinth under one key light; the label "Sales, Marketing and AI" settles top-left, large (S1-03) | U86, U01, U77, U84, U89 | - | - |
| 01-2 | 01 | 0.080-0.300 | 29 | 0:10 | The plate warms (push-in); "Be found." "Be chosen." "Keep learning." land line by line; the word "found" passes behind the bottle (type in depth) | U87, U81 | - | - |
| 01-3 | 01 | 0.300-0.550 | 33 | 0:39 | The bottle turns 0-60 degrees on the turntable, a light sweep crosses the glass, the marula, rooibos and buchu satellites drift in at different depths (R5 floating products) | U82, U03, U02, U80 | - | - |
| 01-4 | 01 | 0.550-0.750 | 26 | 1:12 | The opener card fades up bottom-left (OG-OPENER options in notes); show of hands; idle float keeps the hold alive | U88, U05 | - | - |
| 01-5 | 01 | 0.750-0.920 | 22 | 1:38 | E, C and O dots start to orbit the bottle; green creeps in from the edges; motion stops before the scene 02 headline is visible | U90, U89 | - | - |
| 02-1 | 02 | 0.000-0.120 | 23 | 2:00 | Engage, Convert and Optimize orbit the bottle at equal size; headline "Growth is a loop. Make each turn useful." | U27, U91 | - | - |
| 02-2 | 02 | 0.120-0.400 | 55 | 2:23 | ENGAGE swings to the centre at 2.5x (clickable); four catalyst chips burst into like, comment, save, message; the comment "Is this OK for sensitive skin?" | U91, U92, U95, U05 | - | - |
| 02-3 | 02 | 0.400-0.700 | 59 | 3:18 | CONVERT takes the centre: "Engagement got their attention." "While you have their attention, give them a clear next step." "You can't convert people you don't know." Name, Surname, Email fill; tactic 1 details while engaging, tactic 2 a free 5 ml sample for an email | U93, U95, U27 | - | - |
| 02-4 | 02 | 0.700-0.920 | 43 | 4:17 | OPTIMIZE takes the centre: two lanes feed in; FAILURES (no engagement no conversion; engagement no conversion) and SUCCESSES (drove both, WHY, TO WHOM largest); hold, Next pulses and restarts motion on the next scene | U94, U54, U96, U76 | - | - |
| 03-1 | 03 | 0.000-0.120 | 43 | 5:00 | Title animates in order: ENGAGE highlighted, WITH WHO, a giant "?"; "ideal customer profile (ICP)" spelled out once | U97, U27 | - | - |
| 03-2 | 03 | 0.120-0.240 | 43 | 5:43 | "Do you really know who buys from you?" The assumption card "Our customer: women 25-34 who love natural skincare" is stamped "A feeling" (G01 follow-up F-01 adds "Guess") | U98, U31, U03 | - | - |
| 03-3 | 03 | 0.240-0.450 | 75 | 6:26 | The keep-sentence "Start with the people who actually buy, inquire, and come back." lights verb by verb; BUY, INQUIRE and COME BACK streams pour into the label band, which unrolls into the data table (Product, Area, Found us on, Repeat?, Age group, Sex, Circumstances, Race only if stated) | U99, U18, U31, U32 | - | - |
| 03-4 | 03 | 0.450-0.580 | 87 | 7:41 | GATHER: every sale, inquiry and repeat adds a row; a 3-question opt-in checkout survey fills Age group, Sex, Circumstances; "No data? You're guessing." Then the 40 s write-down ("your last 10 customers"): a planned wait inside this beat's 87 s (47 s GATHER + 40 s writing); the timer chip holds auto-scroll while ambient motion continues (goal-01 journey row; G01 follow-up F-05) | U102, U05, U101, U79 | - | - |
| 03-5 | 03 | 0.580-0.750 | 61 | 9:08 | Rows sort into 3 groups (Gift planners 24, Self-care regulars 21, Guesthouses and spas 15; illustrative sample); the assumption card cracks | U28, U31, U32, U18 | - | - |
| 03-6 | 03 | 0.750-0.920 | 61 | 10:09 | The persona card rolls up (The Gift Planner: age group, sex, area, circumstances, found us on, race only if they tell you + POPIA line); any-industry strip (salon, plumber, label printer); B2B toggle swaps to Tumelo's Launching Founder; DD-03 cached two-step list (Google scrape, then Apify enrichment) with the POPIA direct-marketing line (BLOCKED: no b2b-find run exists yet; cut K01) | U101, U100, U09, U37, U30, U32, U79, U76 | - | - |
| 04-1 | 04 | 0.000-0.095 | 35 | 11:10 | The pre-agreed volunteer comes up. The consent card (PROVISIONAL builder wording for OG-DATA, Q-DATA: "We'll scan your public pages and socials and use your questionnaire answers about your business. Anthropic (Claude), Firecrawl and Apify process them to run the tools; Tool A's notice adds Supabase and Resend. No customer contact details. Deleted after 30 days.") is read aloud and accepted; the consent flag arms the Run controls. Nothing runs before this | U73, U25 | - | - |
| 04-2 | 04 | 0.095-0.284 | 70 | 11:45 | The questionnaire (Tool B's ICP questions, owner's Paste A order; business-level, aggregate and optional, no personal contact details): the volunteer answers 6 questions aloud while the presenter types them: business and URL, what you sell, who buys most (age group, sex split %), area, where they find you, B2B or B2C. On Submit a run tray shows every run starting with its "Skill loaded" line: competitor scan, B2B find, content, Last 30 Days, keywords, SEO, backlinks, citations, 30/60/90 (2 parts), AI helper (fictional demo question), Tool A scan, Tool B ICP + brand kit | U29, U28, U06, U73, U05 | starts all runs | - |
| 04-3 | 04 | 0.284-0.325 | 15 | 12:55 | The persona chip (the Gift Planner, plus the volunteer's answers chip) sits at the hub; a phone rises; headline "Where do they spend their time?" | U18, U09 | - | - |
| 04-4 | 04 | 0.325-0.446 | 45 | 13:10 | "Ask AI where they live online": the real customer-research answer (G02-T04a) animates as an infographic, Google vs Facebook, Instagram, TikTok, LinkedIn, per persona and for the Tumelo buyer, with sources and the tag "AI research: check it against your own data" | U33, U18, U09 | - | - |
| 04-5 | 04 | 0.446-0.487 | 15 | 13:55 | Seven platform tiles burst into an arc (T5): WhatsApp, Facebook, Instagram, TikTok, LinkedIn, Google Business Profile, Website/Google Search. Until OG-BRAND closes they are text wordmarks labelled "logo pending brand-terms acceptance" (A2.9); the Google G only where its classroom terms allow | U10 | - | - |
| 04-6 | 04 | 0.487-0.568 | 30 | 14:10 | The dial spins (smear on neutral plates only) and lands on Instagram: the phone comes alive with the gift-set post (M20) and a "why it fits" card (gift planners find gifts here) | U10, U19 | - | - |
| 04-7 | 04 | 0.568-0.649 | 30 | 14:40 | Next landing: WhatsApp comes alive as an order chat (HTML) with "why it fits" (they order here) | U10, U19 | - | - |
| 04-8 | 04 | 0.649-0.731 | 30 | 15:10 | Next landing: Google Business Profile comes alive: map pin, "gift shop near me" (M24), "why it fits" (self-care regulars search nearby) | U10, U19 | - | - |
| 04-9 | 04 | 0.731-0.798 | 25 | 15:40 | B2B swap: Tumelo's wheel lands on LinkedIn and Website/Google Search, each alive with its why | U37, U10 | - | - |
| 04-10 | 04 | 0.798-0.866 | 25 | 16:05 | Verdict card: "Amberkloof: Instagram to be seen, WhatsApp to sell, Google Business to be found. TikTok later." All 7 named with a why or why-not line. Average: the same post copied to all 7 ("be everywhere"). Good: 2-3 platforms, each with a reason | U19, U10, U76 | - | - |
| 04-11 | 04 | 0.866-0.920 | 20 | 16:30 | Room vote on the volunteer's 2-3 platforms; any tile stays clickable; the Instagram post slides off the phone onto the scene 05 shelf | U05, U81 | - | - |
| 05-1 | 05 | 0.000-0.048 | 15 | 16:50 | The shelf with Amberkloof's post alone; headline "What are they engaging with?"; recap chips Who, Where, What | U34 | - | - |
| 05-2 | 05 | 0.048-0.145 | 30 | 17:05 | Education vs promotions: a toggle swaps Amberkloof examples (education: "Is marula OK for sensitive skin?"; promotion: "Gift set, wrapped, delivered Friday"), and an audience toggle shows which mix each group responds to (self-care regulars: education; gift planners: promotion) | U34, U42 | - | - |
| 05-3 | 05 | 0.145-0.387 | 75 | 17:35 | LIVE competitor scan result (competitor-analysis, started at 04-2 on the volunteer's consented business): three competitor cards land with where they post (Facebook, TikTok, Instagram), their messages, their top public posts embedded where allowed with attribution and engagement signals; "live" source line, or the tagged cached run | U35, U41, U73 | LS-1 | - |
| 05-4 | 05 | 0.387-0.549 | 50 | 18:50 | The top post splits into an exploded recipe in depth: Hook, Body, Offer or giveaway, Format, Platform. A weak competitor post splits the same way: what works vs what doesn't. "What really drives their engagement?" | U35, U76 | LS-1 | - |
| 05-5 | 05 | 0.549-0.646 | 30 | 19:40 | The gap scan from the same run: three or more things none of them do ("nobody answers sensitive-skin questions", "nobody shows the gift wrapped"); a glowing slot opens and the bottle slides in | U36 | LS-1 | - |
| 05-6 | 05 | 0.646-0.759 | 35 | 20:10 | LIVE B2B find (started at 04-2): Step 1 "Google scrape" (Apify Google Maps scraper: businesses that could buy from the volunteer, in their area), Step 2 "Apify enrichment" (website, socials, size); names blurred on the public deck; POPIA direct-marketing line. BLOCKED on APIFY_API_TOKEN: no live or cached run exists yet (PARTIAL) | U30, U37, U73, U28 | LS-2 | - |
| 05-7 | 05 | 0.759-0.872 | 35 | 20:45 | "B2B or B2C: it doesn't matter." Then the line on screen, PROVISIONAL builder copy (D-12) for the owner's "not just copying what they are doing, but I'm also actively looking for other things": "Copy what works. Then fill the gap." with an education and promotion mix chip. Average: copying their post only. Good: their recipe plus the gap | U37, U41, U36, U76 | - | - |
| 05-8 | 05 | 0.872-0.920 | 15 | 21:20 | A spotlight lands on the bottle in the gap; the slot becomes a blank post canvas (exit into 06) | U81 | - | - |
| 06-1 | 06 | 0.000-0.032 | 15 | 21:35 | The blank canvas from 05; headline "AI drafts fast. You make it yours." | U20 | - | - |
| 06-2 | 06 | 0.032-0.159 | 60 | 21:50 | LIVE content generation (social skill, started at 04-2 on the volunteer's business): five outputs burst around the bottle (T5): 3 post ideas, a caption, a product description (from the run), a simple visual (M26b) and an 8 s short video (M27, or the code-rendered video until media is approved) | U20, U11, U73, U02, U80, U01 | LS-3 | - |
| 06-3 | 06 | 0.159-0.201 | 20 | 22:50 | How we made that: Claude (the app and chat) and Claude Code (the same assistant on your computer, running skills) named on screen, with the one-step how-to from the lesson file: paste the skill link into Claude and say "Follow this skill, please." (or copy the skill folder into ~/.claude/skills); a normal Claude Pro plan is enough | U07, U04 | - | - |
| 06-4 | 06 | 0.201-0.222 | 10 | 23:10 | The chef line: world-class ingredients (brand, photos, customer data) plus a recipe (a skill) vs a bare prompt | U07, U04, U21 | - | - |
| 06-5 | 06 | 0.222-0.264 | 20 | 23:20 | claude-video-studio devices: the chat bar types "Make me a launch video"; three identical cards (Theirs, Yours, Everyone's) with red chips "Big text", "A gradient", "A fade", "Same as everyone"; then one flip of the Graphics / With media toggle (plain graphic vs the same with the real product photo) | U04, U07, U20, U76 | - | - |
| 06-6 | 06 | 0.264-0.317 | 25 | 23:40 | The five habits light in order (pick a style, use real references, write the brief in numbers, decide whether it loops, check frames not code); a short code-rendered claude-video-studio clip plays muted | U04, U07, U20 | - | - |
| 06-7 | 06 | 0.317-0.391 | 35 | 24:05 | Brand guideline: Amberkloof's current content (posts, labels, site) goes into the Claude Design System, which returns a guideline (colours, type, voice rules), which returns one on-brand asset (real G02-T04c run). "This is how AI learns your look and your voice." | U11, U21, U06 | - | - |
| 06-8 | 06 | 0.391-0.486 | 45 | 24:40 | Ad wall: 4 real ads in attributed embed cards (AD-E1..AD-E4), each with its public interaction signals on the capture date (views, likes, or "not public"), next to our own Good vs Average pair (M26a vs M26b); click one to play | U78, U76, U20, U66 | - | AD-E1, AD-E2, AD-E3, AD-E4 |
| 06-9 | 06 | 0.486-0.539 | 25 | 25:25 | "slopmonster" named on screen. Pair 1, caption: the real output without the skill and the real output with it, deslop scores before and after, at least 3 differences marked on the text (cut phrases, added specifics, rhythm); the generic pane shatters (T9) | U13, U21, U79 | - | - |
| 06-10 | 06 | 0.539-0.592 | 25 | 25:50 | Pair 2, product description: the same treatment, scores and at least 3 marked differences | U13 | - | - |
| 06-11 | 06 | 0.592-0.645 | 25 | 26:15 | Pair 3, post idea: the same treatment, scores and at least 3 marked differences | U13 | - | - |
| 06-12 | 06 | 0.645-0.677 | 15 | 26:40 | DD-06 default: Tumelo's LinkedIn post without and with slopmonster, both scores, AI tells marked | U13, U37 | - | - |
| 06-13 | 06 | 0.677-0.835 | 75 | 26:55 | LIVE Last 30 Days (started at 04-2 on the volunteer's niche): a daily brief card with what people talk about and what they complain about, dated sources, turned into one opinion or education post idea. BLOCKED on the G02-T02K tool review and SCRAPECREATORS_API_KEY: no live or cached run exists yet (PARTIAL) | U43, U42, U73 | LS-4 | - |
| 06-14 | 06 | 0.835-0.899 | 30 | 28:10 | The habit week fills Mon-Fri: trend card to a Monday education or opinion post, competitor gap to Wednesday, promotion to Friday; the daily step "Every morning: Last 30 Days brief, draft, your edit, schedule" (A1.10); the content plan from the real content-strategy run; the PROVISIONAL line (D-12) "Copy what works. Then fill the gap." | U22, U38, U42, U43 | - | - |
| 06-15 | 06 | 0.899-0.920 | 10 | 28:40 | Friday's card lifts and becomes a typed search query, "gentle face oil for sensitive skin Johannesburg" (exit into 07) | U81 | - | - |
| 07-1 | 07 | 0.000-0.042 | 15 | 28:50 | The search bar holds Friday's query; headline "Be found where people ask."; the website and Google are still the main place | U39 | - | - |
| 07-2 | 07 | 0.042-0.127 | 30 | 29:05 | Google plus ChatGPT, Copilot, Gemini, Claude and Perplexity named as text; "They trust what they bring back."; the owner's line "AI cannot go into social media all by itself" (with "mostly" only if the fact-check flags it, G02-Q8); social cards bounce off a glass wall | U40 | - | - |
| 07-3 | 07 | 0.127-0.212 | 30 | 29:35 | DD-07 default: SEO, AEO and GEO each land as a one-word beat with a one-line meaning (Google ranks you; an AI answers with you; an AI cites you) | U39 | - | - |
| 07-4 | 07 | 0.212-0.283 | 25 | 30:05 | LIVE keyword targets (competitor-keyword-decoder, started at 04-2): the words to rank for, on the volunteer's niche | U71, U73 | LS-5 | - |
| 07-5 | 07 | 0.283-0.354 | 25 | 30:30 | LIVE SEO check (Firecrawl scan + seo-audit) on the volunteer's site: what blocks being found | U72, U59, U73 | LS-6 | - |
| 07-6 | 07 | 0.354-0.425 | 25 | 30:55 | LIVE backlinks (backlink-analyzer, public evidence only): "a backlink is another site pointing to you", with one example from the run | U72 | LS-7 | - |
| 07-7 | 07 | 0.425-0.495 | 25 | 31:20 | LIVE citations (geo-citability): "citations: who the AI quotes; references: the sources your page names", with who gets cited for the sample question | U72, U60 | LS-8 | - |
| 07-8 | 07 | 0.495-0.580 | 30 | 31:45 | Two ways to show up: (1) authority: Amberkloof's answer page (Good) vs "We are the best natural skincare" homepage (Average); (2) social media: see where competitors post and in what format, and copy that (back to 05's recipe) | U41, U76 | - | - |
| 07-9 | 07 | 0.580-0.793 | 75 | 32:15 | LIVE 30/60/90 plan (seo-plan + blog-calendar, two separate runs): blogs and landing pages drift along a depth track at 30, 60 and 90 days; tap the 30, 60, 90 tabs | U70, U72, U73, U05 | LS-9 | - |
| 07-10 | 07 | 0.793-0.878 | 30 | 33:30 | B2B swap: Tumelo, "custom product labels Johannesburg", with LinkedIn articles as authority | U37 | - | - |
| 07-11 | 07 | 0.878-0.920 | 15 | 34:00 | The answer card punches through (T12) and becomes the full-screen landing page of 08 | U81 | - | - |
| 08-1 | 08 | 0.000-0.053 | 15 | 34:15 | The landing page from 07; headline "While you have their attention, give them a next step."; owner line: capture their details as soon as possible, online or on social media | U44 | - | - |
| 08-2 | 08 | 0.053-0.159 | 30 | 34:30 | "Where do they land?": a demo analytics pane ranks the pages by visits and inquiries (labelled demo data); the best page lights up and becomes the stage; "Put your capture where people land." | U45 | - | - |
| 08-3 | 08 | 0.159-0.372 | 60 | 35:00 | LIVE AI helper (runner; its prefilled fictional question starts at 04-2 Submit with the other runs, A1.4 binding reading, Q-REVEAL and Q-HELPER; scripted and labelled "Demo" on the public deck): the helper pops up "Looking for a gift? I can help you choose.", answers "gift for my mom, sensitive skin", then asks for name, surname, email and WhatsApp number; the capture card fills with prefilled fictional details labelled "Demo data" (nothing is typed live) | U46, U44, U79, U73 | LS-10 | - |
| 08-4 | 08 | 0.372-0.478 | 30 | 36:00 | Dwell time: a visible timer on 2 capture points (gift page and FAQ); past 30 s, "We're here to help" opens with capture; a presenter fast-forward speeds the same timer | U47, U05 | - | - |
| 08-5 | 08 | 0.478-0.548 | 20 | 36:30 | R1 (Instagram embed, @iananaseu, attributed) plays: labelled "Good" for 0-7.9 s (ideas, elements, motion), then "Average" on its end card only (a flat, bolted-on coupon) | U76, U68 | - | R1 |
| 08-6 | 08 | 0.548-0.602 | 15 | 36:50 | Our Good: Amberkloof's ad (M31): the gift set floats out of the phone into a WhatsApp chat ("Order for Friday?"); the CTA lives inside the world | U76, U82, U23 | - | - |
| 08-7 | 08 | 0.602-0.761 | 45 | 37:05 | 3 real ads whose CTA captures details or opens a conversation (AD-C1 click-to-WhatsApp or Send message, AD-C2 lead form or sign-up, AD-C3 B2B quote request), each in an attributed embed card with its CTA type and public signals | U78, U44, U23 | - | AD-C1, AD-C2, AD-C3 |
| 08-8 | 08 | 0.761-0.832 | 20 | 37:50 | Skills that set this up, named with where to find them today (github.com/coreyhaines31/marketingskills/tree/main/skills, MIT, checked 2026-10-27): cro (which page, and the fields in cro's references/form.md), popups (the helper and the dwell pop-up), signup (newsletter or freebie); "the full panel is in scene 09" | U48 | - | - |
| 08-9 | 08 | 0.832-0.885 | 15 | 38:10 | B2B swap: Tumelo's "Quote in 24 hours" form captures company, role and quantity | U37 | - | - |
| 08-10 | 08 | 0.885-0.920 | 10 | 38:25 | The filled capture card drops into the first box of the follow-up track (exit into 09) | U81 | - | - |
| 09-1 | 09 | 0.000-0.041 | 15 | 38:35 | The capture card arrives; headline "A sale is often won after the first reply." | U23 | - | - |
| 09-2 | 09 | 0.041-0.081 | 15 | 38:50 | Where does AI come in? Channel picker, place 1: the website chatbot (the 08 helper) answers questions and captures details | U14 | - | - |
| 09-3 | 09 | 0.081-0.122 | 15 | 39:05 | Place 2: WhatsApp: AI drafts replies and quick answers; opt-in for business-started messages, approved templates and the 24-hour service window | U14 | - | - |
| 09-4 | 09 | 0.122-0.162 | 15 | 39:20 | Place 3: social DMs: Instagram and Facebook DM automation answers "price?" and captures details from comments and DMs (capture on social) | U14, U44 | - | - |
| 09-5 | 09 | 0.162-0.216 | 20 | 39:35 | Place 4, the honest Slack answer: "Is it on Slack? Mostly for your team: AI posts the new-lead alert and helps you reply. Customers rarely message a small business there; some B2B clients share a Slack Connect channel." (Slack's mark only if its terms allow, else text) | U14 | - | - |
| 09-6 | 09 | 0.216-0.298 | 30 | 39:55 | Respond quickly: a response clock (2 minutes vs 2 days) with Good vs Average reply; a volunteer picks Helpful or Vague ("Hi, price is R450.") | U23, U76, U05 | - | - |
| 09-7 | 09 | 0.298-0.338 | 15 | 40:25 | The plain line: "A 'sales lifecycle' is a fancy way to say we'll WhatsApp you and email you a series of useful things, so you trust us and see we know our stuff." | U14 | - | - |
| 09-8 | 09 | 0.338-0.474 | 50 | 40:40 | The funnel: "Send" fires the welcome and thank-you email at once, then the email journey and the WhatsApp journey run together on a day timeline (from real email-sequence and whatsapp-sequences runs); every message shows permission and opt-out (POPIA s69) | U49, U14, U05 | - | - |
| 09-9 | 09 | 0.474-0.595 | 45 | 41:30 | CRM and pipeline built with AI: Tumelo's deal (the Amberkloof gift box) moves quotation, order, invoice, follow-up on "Advance deal", counts updating; "A pipeline puts each customer in a box, so nobody gets forgotten." | U50, U53, U37 | - | - |
| 09-10 | 09 | 0.595-0.649 | 20 | 42:15 | The follow-up box fires a review request on Google and on social (no incentives, no selective asking); stars fill | U51, U23 | - | - |
| 09-11 | 09 | 0.649-0.704 | 20 | 42:35 | DD-09 default, funnel tab 1: abandoned cart, reminders at 1 h, 24 h and 72 h, automated; "A funnel sends something with a specific goal in mind." | U52 | - | - |
| 09-12 | 09 | 0.704-0.758 | 20 | 42:55 | Funnel tab 2: onboarding, the company's sections sent in turn | U52 | - | - |
| 09-13 | 09 | 0.758-0.812 | 20 | 43:15 | One screen of a custom CRM built with AI: the same customer moving between boxes; "Ask AI to build it with you: the funnels, a simple CRM, the emails." | U53, U52 | - | - |
| 09-14 | 09 | 0.812-0.893 | 30 | 43:35 | Skills panel with true sources: cro, popups and signup at github.com/coreyhaines31/marketingskills/tree/main/skills (MIT; form advice is in cro/references/form.md); older installs call them page-cro, form-cro, popup-cro and signup-flow-cro, the names before that repo's v2.0 renames of 2026-05-14 (commit 30f9b9a), pinned at github.com/coreyhaines31/marketingskills/tree/f3990f7f99ae63b9e26eaa61114f60e0408742ff/skills; email-sequence (Anthropic knowledge-work-plugins marketing pack, Apache-2.0, in the scene 15 download); whatsapp-sequences (installed on the presenter's Claude Code; upstream source not found, G03-T01 records it before it is named as downloadable) | U48, U53 | - | - |
| 09-15 | 09 | 0.893-0.920 | 10 | 44:05 | Review stars and the week's results pour off the end of the track (exit into 10) | U81 | - | - |
| 10-1 | 10 | 0.000-0.102 | 20 | 44:15 | The week's 5 posts from 06 sit in a row; OPTIMIZE takes the centre (echo of 02); the lights lower | U54, U24 | - | - |
| 10-2 | 10 | 0.102-0.307 | 40 | 44:35 | Lens switch: the website pane morphs into an analytics dashboard; each post shows impressions, comments and inquiries (labelled demo data) | U54, U24 | - | - |
| 10-3 | 10 | 0.307-0.613 | 60 | 45:15 | Tap to sort: FAILURES (Tuesday's flat photo: low engagement, 0 inquiries; Thursday's giveaway: 1,200 likes, 0 inquiries) and SUCCESSES (Monday's answer: WHY it answered a real question, TO WHOM self-care regulars; Friday's ad: WHY it looked like a gift worth giving, TO WHOM gift planners). Average: counting likes. Good: engagement and conversion, by who | U24, U54, U05, U76 | - | - |
| 10-4 | 10 | 0.613-0.843 | 45 | 46:15 | "Double down": the success cards clone into next week; failures are marked stop or fix. B2B: Tumelo counts quote requests from founders, not followers | U24, U37 | - | - |
| 10-5 | 10 | 0.843-0.920 | 15 | 47:00 | Authored silence: near-black; only Tuesday's flat photo stays lit, "Tuesday's post. Let's fix it." | U81 | - | - |
| 11-1 | 11 | 0.000-0.119 | 40 | 47:15 | The letters "AI" resolve into ATTRACT and INTERACT beside a ghosted E and C. One line each: "Engage gets them responding. Attract is why they stop at all: it looks worth it." "Convert asks for the next step. Interact lets them get to know you first." | U62 | - | - |
| 11-2 | 11 | 0.119-0.178 | 20 | 47:55 | Tuesday's flat photo (M40) on white under harsh flash, labelled "Average"; layer 1, LIGHT: the warm plaster plate, a key light from the upper right, a clean cutout | U64, U82, U76 | - | - |
| 11-3 | 11 | 0.178-0.231 | 18 | 48:15 | Layer 2, DEPTH: the plinth rises, stone blocks blur behind, the planes separate as the plate pushes in | U82 | - | - |
| 11-4 | 11 | 0.231-0.297 | 22 | 48:33 | Layer 3, BREAK-OUT: a phone on the plinth; the bottle, jar, tin and gift box break out of the screen and float (R5); the giant word ATTRACT passes behind them | U82, U84, U02, U80, U01 | - | - |
| 11-5 | 11 | 0.297-0.341 | 15 | 48:55 | Layer 4, OFFER: a glass card "Gift set. Wrapped. Delivered Friday." | U64 | - | - |
| 11-6 | 11 | 0.341-0.430 | 30 | 49:10 | Layer 5, CTA inside the world: "Order on WhatsApp"; the label flips to "Good"; the switchboard appears and the room calls a layer to switch off | U05, U76, U64 | - | - |
| 11-7 | 11 | 0.430-0.594 | 55 | 49:40 | Why beauty wins, the owner's argument: neat retail packing (Good) vs a messy shelf (Average); a merchandised display vs a pile; beauty, makeup and clothing presented well vs carelessly; the neutral image (a lit perfume counter, G12); the owner's line on screen "Whatever you're creating, it needs to be attractive." | U63, U64, U76 | - | - |
| 11-8 | 11 | 0.594-0.825 | 78 | 50:35 | Gallery: 6 real ads in attributed embed cards that load on click (AD-A1, AD-A2 beauty or makeup; AD-A3, AD-A4 clothing or fashion; AD-A5 retail packing or merchandising; AD-A6 B2B), each with the attraction mechanism it shows and what people do with it (public signals on the capture date, or "not public") | U66, U78, U63 | - | AD-A1, AD-A2, AD-A3, AD-A4, AD-A5, AD-A6 |
| 11-9 | 11 | 0.825-0.884 | 20 | 51:53 | Our own Good vs Average ad pair (M42 vertical ad vs the M40 snapshot), and the B2B pair: Tumelo's carton, "Your packaging is your shelf ad." | U76, U37, U82 | - | - |
| 11-10 | 11 | 0.884-0.920 | 12 | 52:13 | The R5 reference card (the owner's pin, attributed: "the look we copied, ideas not assets"); the camera pulls back and reveals the stage inside a shop window at dusk (M44) | U68, U82 | - | R5 |
| 12-1 | 12 | 0.000-0.071 | 25 | 52:25 | The shop window at dusk (M44, M45 push-in); "First attract, then interact." "Interaction lets them get to know you." (the owner's own analogy stays in the notes, G12) | U65, U62 | - | - |
| 12-2 | 12 | 0.071-0.170 | 35 | 52:50 | Tap the bottle: a detail arc bursts out (ingredients, size, price, proof, "Ask us on WhatsApp"); tap the jar for its own arc; product, detail, proof, ask; every tap pays off within 100 ms (R2 click-to-burst, attributed reference card) | U65, U05, U79, U68 | - | R2 |
| 12-3 | 12 | 0.170-0.226 | 20 | 53:25 | What people do with ads: the demo ad carries comment, save, share, tap a product tag, try on, message; each action lights up with its payoff | U66, U65 | - | - |
| 12-4 | 12 | 0.226-0.311 | 30 | 53:45 | Average: a "Contact us" button that leads nowhere visible. Good: a gift-set builder that ends in a WhatsApp chat with the order prefilled | U76, U79 | - | - |
| 12-5 | 12 | 0.311-0.368 | 20 | 54:15 | Website 1, oryzo.ai, in-scene in a live frame (or a presenter live window if it refuses framing), attributed: what you do there and how it pays off | U66, U68, U84 | - | W1 |
| 12-6 | 12 | 0.368-0.425 | 20 | 54:35 | Website 2, House Down Studio, in-scene the same way: its work-to-contact path | U66 | - | W2 |
| 12-7 | 12 | 0.425-0.481 | 20 | 54:55 | Website 3 (DD-12 default; chosen by G04-T03), in-scene the same way | U66 | - | W3 |
| 12-8 | 12 | 0.481-0.538 | 20 | 55:15 | Two provider statements on interaction and appeal, each quoted in under 15 words with its link (fact-checked) | U67 | - | PS-1, PS-2 |
| 12-9 | 12 | 0.538-0.566 | 10 | 55:35 | Teach AI: "AI doesn't know what good looks like, or how good interactions work. Show it success." The same-prompt cards from 06 return for one beat (G04-T08 reuse) | U69 | - | - |
| 12-10 | 12 | 0.566-0.609 | 15 | 55:45 | One prompt vs with the system: a before/after slider of the real G04-T05(a) outputs (one-line prompt vs the claude-video-studio brief) | U69, U07 | - | - |
| 12-11 | 12 | 0.609-0.694 | 30 | 56:00 | Judge: a design-loop step-through, round verdicts from 3 critics with scores, the fix, then 3 of 3 agree (strings match the raw reports) | U69, U08 | - | - |
| 12-12 | 12 | 0.694-0.750 | 20 | 56:30 | Recreate the look: the Claude Design System artifact for Amberkloof recreates the look on a new asset | U69, U11 | - | - |
| 12-13 | 12 | 0.750-0.821 | 25 | 56:50 | Recreate an interaction: AI is given a successful interaction reference (the R2 click-to-burst) and recreates it for Amberkloof (real G04-T05(d) run) | U69 | - | - |
| 12-14 | 12 | 0.821-0.849 | 10 | 57:15 | Our recreation of the generic AI look shatters (T9) into the taught result; "Show AI what success looks like." | U69, U76 | - | - |
| 12-15 | 12 | 0.849-0.892 | 15 | 57:25 | B2B swap: Tumelo's "build your box" configurator (size, finish, then an instant quote) | U37 | - | - |
| 12-16 | 12 | 0.892-0.920 | 10 | 57:40 | "Ask us" opens a chat that asks "May we use your details?" (exit into 13) | U25 | - | - |
| 13-1 | 13 | 0.000-0.077 | 15 | 57:50 | AI's product description for the bottle on a white page; "Before you post: check, be honest, protect." | U25 | - | - |
| 13-2 | 13 | 0.077-0.332 | 50 | 58:05 | Exercise 1, check accuracy: click each claim in the draft ("clinically proven", "heals eczema", "#1 in South Africa"); the real fact-checker-loxly verdict and source appear (G04-T04 raw report) and the red pen strikes | U25, U05 | - | - |
| 13-3 | 13 | 0.332-0.588 | 50 | 58:55 | Exercise 2, protect their information: sort what you would paste into a public AI tool (a customer list with names and numbers; anonymised sales totals; a product description; a customer's WhatsApp chat; a race field); each item gets feedback with its POPIA reason (anonymise or aggregate first; race only if the customer stated it) | U25, U101, U05 | - | - |
| 13-4 | 13 | 0.588-0.767 | 35 | 59:45 | Exercise 3, be honest: a fake 5-star review vs a real review; an invented claim vs an honest line with an AI disclosure | U25, U76 | - | - |
| 13-5 | 13 | 0.767-0.869 | 20 | 60:20 | Three words settle: Check. Be honest. Protect. B2B line: don't scrape personal emails off LinkedIn for cold mail; direct marketing needs consent under POPIA | U25, U37 | - | - |
| 13-6 | 13 | 0.869-0.920 | 10 | 60:40 | Consent recap: "The volunteer agreed in scene 04: public pages, socials and business-level questionnaire answers only, no customer contact details, deleted after 30 days." Their runs are ready; the progress line draws the pedestal of 14 | U73 | - | - |
| 14-1 | 14 | 0.000-0.049 | 15 | 60:50 | A pedestal rises: "Now for a real business in the room." The volunteer's business name and the run's start time (scene 04) show on the source line | U55, U61 | - | - |
| 14-2 | 14 | 0.049-0.099 | 15 | 61:05 | Tool A panel 1, What you do (Firecrawl scan of the volunteer's site) | U56 | LS-11 | - |
| 14-3 | 14 | 0.099-0.148 | 15 | 61:20 | Panel 2, Socials (Apify social sampling) | U57 | LS-11 | - |
| 14-4 | 14 | 0.148-0.214 | 20 | 61:35 | Panel 3, Competitors (competitive-analysis skill built into the tool), with platform names and what we suggest they do on social media | U58 | LS-11 | - |
| 14-5 | 14 | 0.214-0.263 | 15 | 61:55 | Panel 4, AI crawler reach: is AI reaching the site? | U59 | LS-11 | - |
| 14-6 | 14 | 0.263-0.312 | 15 | 62:10 | Panel 5, AEO/GEO citations: are they cited or mentioned by AI for what they want to rank for? | U60 | LS-11 | - |
| 14-7 | 14 | 0.312-0.444 | 40 | 62:25 | Strengths, Gaps and Next steps tabs (doing well, not doing well, what to do next) | U61, U26, U05 | LS-11 | - |
| 14-8 | 14 | 0.444-0.493 | 15 | 63:05 | Tool B: the volunteer's scene 04 questionnaire answers replay as the questionnaire (6 questions) | U06, U29 | LS-12 | - |
| 14-9 | 14 | 0.493-0.591 | 30 | 63:20 | The persona card returns in the same format as scene 03, filled with the volunteer's answers (firmographic fields if they are B2B) | U06, U09, U37 | LS-12 | - |
| 14-10 | 14 | 0.591-0.690 | 30 | 63:50 | The brand kit on the Claude Design System from their current content: colours, type, voice | U06, U11, U21 | LS-12 | - |
| 14-11 | 14 | 0.690-0.772 | 25 | 64:20 | One on-brand asset made from the kit: a post for the volunteer's best platform from 04, with the live source line | U06, U11 | LS-12 | - |
| 14-12 | 14 | 0.772-0.887 | 35 | 64:45 | Two QR codes, one per tool (Tool A, Tool B), with typed URLs: "Scan now and run your own business." | U55, U06 | - | QR-A, QR-B |
| 14-13 | 14 | 0.887-0.920 | 10 | 65:20 | Next steps collapse into one card, "Where to learn next", which drops into the gift box of 15 | U81 | - | - |
| 15-1 | 15 | 0.000-0.035 | 10 | 65:30 | The kraft gift box (made by Tumelo) opens; headline "Keep learning." | U15 | - | - |
| 15-2 | 15 | 0.035-0.191 | 45 | 65:40 | The 8 Anthropic marketing skills rise one by one, each with a one-line use: brand-review, campaign-plan, competitive-brief, content-creation, draft-content, email-sequence, performance-report, seo-audit; the source link and the Apache-2.0 line below | U15 | - | - |
| 15-3 | 15 | 0.191-0.295 | 30 | 66:25 | With vs without a skill: the same request run with campaign-plan and without it (real G07-T07 outputs), Good vs Average excerpts | U15, U76 | - | - |
| 15-4 | 15 | 0.295-0.365 | 20 | 66:55 | Where to find conversion-tactic skills: cro (pages and forms), popups and signup at github.com/coreyhaines31/marketingskills/tree/main/skills (MIT; older installs call them page-cro, form-cro, popup-cro and signup-flow-cro); email-sequence in this download; whatsapp-sequences listed only once its source is recorded | U48 | - | - |
| 15-5 | 15 | 0.365-0.573 | 60 | 67:15 | Where to learn, by stage: click Engage, Convert, Optimize, Attract and Interact, AI skills or Support and its verified sites come forward with one line each (12 links from g07-learn-links.md: Meta Blueprint, WhatsApp Business app, HubSpot Academy, Google Skillshop, Search Console Help, Analytics Academy, Google Business Profile, Grow with Google Africa, Claude Academy, Claude Help Center skills, Information Regulator POPIA guidance, SEDFA) | U15, U05 | - | L-12 |
| 15-6 | 15 | 0.573-0.833 | 75 | 68:15 | Your next steps = your 7-day test: pick one customer (persona fields), one platform (the 7), one action (create, convert or follow up) and one measure; the plan card builds (tonight, this week, 30-60-90); Copy works with 0 network requests. Everyone writes theirs: a 40 s timed write inside this beat (35 s of talk) | U26, U05 | - | - |
| 15-7 | 15 | 0.833-0.920 | 25 | 69:30 | The bottle settles into the box, the lid closes, the QR to /skills/ and the typed URL appear with "Be found. Be chosen. Keep learning."; final hold | U15, U87, U77 | - | QR-S |

## 4. Live slots: start, reveal and head start (VS-01, VS-07)

| Slot | Beats | Skill / tool (each invoked separately, A1.5) | Target | Starts | Reveal (first beat) | Head start at reveal | Measured wall time | Status |
|---|---|---|---|---|---|---:|---|---|
| LS-1 | 05-3, 05-4, 05-5 | competitor-analysis (`competitor-scan`) | volunteer's consented business | 04-2 Submit (12:55) | 05-3 at 17:35, 45 s after scene arrival | 280 s | 51.7 s (older tool sets up to 71.7 s) | path PROVEN; live needs the volunteer (HELD: proof business) |
| LS-2 | 05-6 | Apify Google Maps scraper + Apify enrichment (`b2b-find`) | businesses that could buy from the volunteer | 04-2 Submit (12:55) | 05-6 at 20:10, 200 s after scene arrival | 435 s | not measured | BLOCKED: APIFY_API_TOKEN (OG-KEYS); no cached run exists |
| LS-3 | 06-2 | social (`content`) | volunteer's business | 04-2 Submit (12:55) | 06-2 at 21:50, 15 s after scene arrival | 535 s | 21.9 s | path PROVEN |
| LS-4 | 06-13 | last30days | volunteer's niche | 04-2 Submit (12:55) | 06-13 at 26:55, 320 s after scene arrival | 840 s | not measured | BLOCKED: G02-T02K review + SCRAPECREATORS_API_KEY; no cached run exists |
| LS-5 | 07-4 | competitor-keyword-decoder (`keywords`) | volunteer's niche | 04-2 Submit (12:55) | 07-4 at 30:05, 75 s after scene arrival | 1030 s | 43.2 s | path PROVEN |
| LS-6 | 07-5 | Firecrawl CLI scan + seo-audit | volunteer's site | 04-2 Submit (12:55) | 07-5 at 30:30, 100 s after scene arrival | 1055 s | 40.1 s | path PROVEN |
| LS-7 | 07-6 | Firecrawl CLI scan + backlink-analyzer | volunteer's site | 04-2 Submit (12:55) | 07-6 at 30:55, 125 s after scene arrival | 1080 s | 34.7 s | path PROVEN |
| LS-8 | 07-7 | Firecrawl CLI scan + geo-citability | volunteer's site | 04-2 Submit (12:55) | 07-7 at 31:20, 150 s after scene arrival | 1105 s | 24.8 s | path PROVEN |
| LS-9 | 07-9 | seo-plan + blog-calendar (two runs) | volunteer's site and intake answers | 04-2 Submit (12:55) | 07-9 at 32:15, 205 s after scene arrival | 1160 s | 22.2 s + 27.6 s | path PROVEN |
| LS-10 | 08-3 | AI helper via the runner (`claude -p`) | fictional demo question only (A2.7) | 04-2 Submit (12:55) | 08-3 at 35:00, 45 s after scene arrival | 1325 s | about 22 s (same start-up as `content`) | stage: live under either A1.4 reading (prefilled fictional question started with the other runs; Q-HELPER); public deck: scripted demo |
| LS-11 | 14-2, 14-3, 14-4, 14-5, 14-6, 14-7 | Tool A (G05 backend: Firecrawl, Apify, competitive-analysis, crawler + AEO checks) | volunteer's site and socials | 04-2 Submit (12:55) | 14-2 at 61:05, 15 s after scene arrival | 2890 s | not measured | BLOCKED: G05 deploy + OG-KEYS |
| LS-12 | 14-8, 14-9, 14-10, 14-11 | Tool B (Claude page, stage live-run mode G06-T16) | volunteer's questionnaire answers + site | 04-2 Submit (12:55) | 14-8 at 63:05, 135 s after scene arrival | 3010 s | not measured | HELD: OG-CLAUDE-PAGE |

- Consent is accepted at 04-1 (11:10-11:45), before the earliest run start at 12:55 (A1.5). No run exists without the consent flag (runner D8).
- Every slot, the AI helper included, has at least 280 s of head start at its reveal (LS-1), so it is live under either reading of A1.4: the binding "20 +/- 2 s from scene reveal", which the plan follows until the owner answers Q-REVEAL, or the runner's per-slot `reveal()` (D15).
- **AI helper (LS-10), changed in v2.1 (NV-m3):** its prefilled fictional question now starts at 04-2 Submit with the other runs (1325 s of head start). In v2 it started at scene 08 arrival, 45 s before its reveal, and its ~22 s start-up sat on the 20 +/- 2 s line under the binding reading. Its input is prefilled fictional demo data, never typed live. If the owner confirms the per-slot reading, Q-HELPER asks whether it should start at scene 08 arrival again.
- **Not settled by this file:** a longer timer. A1.4 allows no extension without an owner quote, and no extension is needed under the plan above.
- **Change from G02-Q2:** runs start at 04-2, after scene 03, not at the Engage chapter opener, because consent must come first and scene 03 is being built now (G01). Decision D-21, PROVISIONAL.

## 5. Real ads, websites, provider statements and QR codes (VS-05, VS-12)

Every real ad sits in an attributed card with the official embed and its public interaction signals on the capture date (views, likes, comments, or "not public"). Link-only ads never count (A2.7). The owner's pins and the R1 reel are design references and are **not** counted as ads.

| Slot | Beat | Counts toward | Category | Candidate | Status |
|---|---|---|---|---|---|
| AD-E1 | 06-8 | G02 >=4 (Engage) | beauty / body care | E2 Oh So Heavenly body gel oil with marula, YouTube, 4 Aug 2026 | SOURCED, embed browser-tested |
| AD-E2 | 06-8 | G02 >=4 (Engage) | beauty / body care | E1 Oh So Heavenly glow spot, YouTube, 5 Oct 2026 | SOURCED, embed browser-tested |
| AD-E3 | 06-8 | G02 >=4 (Engage) | beauty / body care | E3 Feel Silki body oil gel, YouTube, 13 Apr 2025 | SOURCED, embed browser-tested |
| AD-E4 | 06-8 | G02 >=4 (Engage) | B2B print | E6 Dash Labels & Digital, YouTube, 12 Feb 2025 | SOURCED, embed browser-tested |
| AD-C1 | 08-7 | G03 >=3 (CTA) | click-to-WhatsApp or Send message | to source (G03-T05); link-only Brandbase Ad Library row does not count | NOT SOURCED (HELD if short) |
| AD-C2 | 08-7 | G03 >=3 (CTA) | lead form or sign-up | to source (G03-T05); link-only FeelSilki lead-magnet row does not count | NOT SOURCED (HELD if short) |
| AD-C3 | 08-7 | G03 >=3 (CTA), B2B | B2B quote or contact | to source (G03-T05); link-only Mabira Pack row does not count | NOT SOURCED (HELD if short) |
| AD-A1 | 11-8 | G04 beauty/makeup >=2 | beauty or makeup | to source (G04-T03); E4/E5 are body-care reserves | NOT SOURCED (HELD if short) |
| AD-A2 | 11-8 | G04 beauty/makeup >=2 | beauty or makeup | to source (G04-T03) | NOT SOURCED (HELD if short) |
| AD-A3 | 11-8 | G04 clothing/fashion >=2 | clothing or fashion | to source (G04-T03) | NOT SOURCED (HELD if short) |
| AD-A4 | 11-8 | G04 clothing/fashion >=2 | clothing or fashion | to source (G04-T03) | NOT SOURCED (HELD if short) |
| AD-A5 | 11-8 | G04 retail/merch >=1 | retail packing or merchandising | to source (G04-T03) | NOT SOURCED (HELD if short) |
| AD-A6 | 11-8 | G04 B2B >=1 | B2B | E7 Brandbase DTF printing, YouTube, 22 Oct 2025 | SOURCED, embed browser-tested |
| W1 | 12-5 | G04 websites >=3 | website | oryzo.ai (S1) | NAMED; framing not yet checked |
| W2 | 12-6 | G04 websites >=3 | website | housedownstudios.co.za (in the current deck) | NAMED; framing not yet checked |
| W3 | 12-7 | G04 websites >=3 | website | to choose (G04-T03) | NOT SOURCED |
| PS-1 | 12-8 | G04 provider statements >=2 | provider statement | to source (G04-T03) | NOT SOURCED |
| PS-2 | 12-8 | G04 provider statements >=2 | provider statement | to source (G04-T03) | NOT SOURCED |
| L-12 | 15-5 | G07 learn sites >=8 | 12 learn links | experience/research/g07-learn-links.md (12 links, 200-checked) | SOURCED |
| QR-A | 14-12 | A1.10 one QR per tool | Tool A QR | Tool A public URL (G05) | BLOCKED: G05 release |
| QR-B | 14-12 | A1.10 one QR per tool | Tool B QR | Tool B public URL (G06) | HELD: OG-CLAUDE-PAGE |
| QR-S | 15-7 | A1.10 one QR to /skills/ | skills QR | /skills/ download page (G07) | built (G07-T06), unpublished |
| R1 | 08-5 | reference, NOT an ad | design reel | R1 Instagram reel @iananaseu | owner reference; not counted |
| R2 | 12-2 | reference, NOT an ad | pin | R2 Pinterest pin | owner reference; not counted |
| R5 | 11-10 | reference, NOT an ad | pin | R5 Pinterest pin | owner reference; not counted |

| Floor | Needed | Slots planned | Sourced or named today | Result |
|---|---:|---:|---:|---|
| G02-T03/T11 real ads embedded in Engage | 4 | 4 | 4 | slots meet the floor |
| G03-T05 real CTA ads (>=1 B2B) | 3 | 3 | 0 | slots meet the floor; 3 still to source (HELD if short, A1.6) |
| G04-T03 beauty or makeup ads | 2 | 2 | 0 | slots meet the floor; 2 still to source (HELD if short, A1.6) |
| G04-T03 clothing or fashion ads | 2 | 2 | 0 | slots meet the floor; 2 still to source (HELD if short, A1.6) |
| G04-T03 retail packing or merchandising ads | 1 | 1 | 0 | slots meet the floor; 1 still to source (HELD if short, A1.6) |
| G04-T03 B2B ads | 1 | 1 | 1 | slots meet the floor |
| G04-T03 websites in-scene | 3 | 3 | 2 | slots meet the floor; 1 still to source (HELD if short, A1.6) |
| G04-T03 provider statements | 2 | 2 | 0 | slots meet the floor; 2 still to source (HELD if short, A1.6) |
| G07 learn websites | 8 | 12 | 12 | slots meet the floor |
| A1.10 QR codes (Tool A, Tool B, /skills/) | 3 | 3 | 0 | slots meet the floor; the codes wait on the Tool A, Tool B and /skills/ public URLs (G05, G06, G07 release) |

## 6. Every unit U01-U106 (per-unit check, VS-16)

A unit passes only with at least one beat that has a p-range, seconds and on-screen substance. Process units are not deck content; each names its receipt. A unit with only an ID would fail the script.

| Unit | Beats (scene, p-range, seconds) | Total s | Substance shown | Status |
|---|---|---:|---|---|
| U01 | 01-1 (01, 0.000-0.080, 10 s); 06-2 (06, 0.032-0.159, 60 s); 11-4 (11, 0.231-0.297, 22 s) | 92 | Interactive, visually rich, images and videos: a control and a moving visual in every scene | PRESENT |
| U02 | 01-3 (01, 0.300-0.550, 33 s); 06-2 (06, 0.032-0.159, 60 s); 11-4 (11, 0.231-0.297, 22 s) | 115 | ElevenLabs images and videos: stills and clips in 01, 06, 11 (BLOCKED: OG-EL-AUTH, OG-SPEND) | BLOCKED (OG-EL-AUTH, OG-SPEND) |
| U03 | 01-3 (01, 0.300-0.550, 33 s); 03-2 (03, 0.120-0.240, 43 s) | 76 | A teaching moment aligned with the audience: one point per scene on the hero brand and the volunteer | PRESENT |
| U04 | 06-3 (06, 0.159-0.201, 20 s); 06-4 (06, 0.201-0.222, 10 s); 06-5 (06, 0.222-0.264, 20 s); 06-6 (06, 0.264-0.317, 25 s) | 75 | Claude Video Studio and GSAP skills: same-prompt cards, Graphics/With media, five habits, short clip | PRESENT |
| U05 | 01-4 (01, 0.550-0.750, 26 s); 02-2 (02, 0.120-0.400, 55 s); 03-4 (03, 0.450-0.580, 87 s); 04-2 (04, 0.095-0.284, 70 s); 04-11 (04, 0.866-0.920, 20 s); 07-9 (07, 0.580-0.793, 75 s); 08-4 (08, 0.372-0.478, 30 s); 09-6 (09, 0.216-0.298, 30 s); 09-8 (09, 0.338-0.474, 50 s); 10-3 (10, 0.307-0.613, 60 s); 11-6 (11, 0.341-0.430, 30 s); 12-2 (12, 0.071-0.170, 35 s); 13-2 (13, 0.077-0.332, 50 s); 13-3 (13, 0.332-0.588, 50 s); 14-7 (14, 0.312-0.444, 40 s); 15-5 (15, 0.365-0.573, 60 s); 15-6 (15, 0.573-0.833, 75 s) | 843 | Interactive: in-scene controls (word clicks, wheel, switchboard, taps, exercises, plan card) | PRESENT |
| U06 | 04-2 (04, 0.095-0.284, 70 s); 06-7 (06, 0.317-0.391, 35 s); 14-8 (14, 0.444-0.493, 15 s); 14-9 (14, 0.493-0.591, 30 s); 14-10 (14, 0.591-0.690, 30 s); 14-11 (14, 0.690-0.772, 25 s); 14-12 (14, 0.772-0.887, 35 s) | 240 | Tool B: questionnaire, persona, brand kit, one asset, own QR | PRESENT as beat; Tool B HELD (OG-CLAUDE-PAGE) |
| U07 | 06-3 (06, 0.159-0.201, 20 s); 06-4 (06, 0.201-0.222, 10 s); 06-5 (06, 0.222-0.264, 20 s); 06-6 (06, 0.264-0.317, 25 s); 12-10 (12, 0.566-0.609, 15 s) | 90 | Claude and Claude Code named with the one-step how-to, the chef line | PRESENT |
| U08 | 12-11 (12, 0.609-0.694, 30 s) | 30 | Design loop shown judging (round verdicts to 3/3) | PRESENT |
| U09 | 03-6 (03, 0.750-0.920, 61 s); 04-3 (04, 0.284-0.325, 15 s); 04-4 (04, 0.325-0.446, 45 s); 14-9 (14, 0.493-0.591, 30 s) | 151 | Who and where: persona from data, where they live online, the volunteer's persona | PRESENT |
| U10 | 04-5 (04, 0.446-0.487, 15 s); 04-6 (04, 0.487-0.568, 30 s); 04-7 (04, 0.568-0.649, 30 s); 04-8 (04, 0.649-0.731, 30 s); 04-9 (04, 0.731-0.798, 25 s); 04-10 (04, 0.798-0.866, 25 s) | 155 | Platforms: 7 tiles, 3 come alive with why, all clickable, wordmarks until OG-BRAND | PRESENT |
| U11 | 06-2 (06, 0.032-0.159, 60 s); 06-7 (06, 0.317-0.391, 35 s); 12-12 (12, 0.694-0.750, 20 s); 14-10 (14, 0.591-0.690, 30 s); 14-11 (14, 0.690-0.772, 25 s) | 170 | Content fast and consistent: five outputs, Design System guideline to asset, brand kit | PRESENT |
| U12 | none (process unit) | 0 | Process: blind adversarial review per outcome (G07-T24 O1-O6 critics; this spine's CR-VF-SPINE); receipts in critic-ledger.md | PROCESS |
| U13 | 06-9 (06, 0.486-0.539, 25 s); 06-10 (06, 0.539-0.592, 25 s); 06-11 (06, 0.592-0.645, 25 s); 06-12 (06, 0.645-0.677, 15 s) | 90 | slopmonster named, 3 real pairs with scores and marked differences, plus Tumelo | PRESENT |
| U14 | 09-2 (09, 0.041-0.081, 15 s); 09-3 (09, 0.081-0.122, 15 s); 09-4 (09, 0.122-0.162, 15 s); 09-5 (09, 0.162-0.216, 20 s); 09-7 (09, 0.298-0.338, 15 s); 09-8 (09, 0.338-0.474, 50 s) | 130 | Where AI comes in (chatbot, WhatsApp, DMs, honest Slack), lifecycle line, journeys | PRESENT |
| U15 | 15-1 (15, 0.000-0.035, 10 s); 15-2 (15, 0.035-0.191, 45 s); 15-3 (15, 0.191-0.295, 30 s); 15-5 (15, 0.365-0.573, 60 s); 15-7 (15, 0.833-0.920, 25 s) | 170 | 8 skills, with/without output, 12 verified sites by stage, QR to /skills/ | PRESENT |
| U16 | none (process unit) | 0 | Process: DONE-0 PARTIAL, watched as frames (G11); experience/research/video-claude-video-2-lesson.md | PROCESS |
| U17 | none (process unit) | 0 | Process: the goal bundle .claude/goals/2026-10-27-gtp-cinematic-eco/ | PROCESS |
| U18 | 03-3 (03, 0.240-0.450, 75 s); 03-5 (03, 0.580-0.750, 61 s); 04-3 (04, 0.284-0.325, 15 s); 04-4 (04, 0.325-0.446, 45 s) | 196 | Know the customer and where they spend time: data table, persona, where online | PRESENT |
| U19 | 04-6 (04, 0.487-0.568, 30 s); 04-7 (04, 0.568-0.649, 30 s); 04-8 (04, 0.649-0.731, 30 s); 04-10 (04, 0.798-0.866, 25 s) | 115 | Right platforms, not everywhere: 2-3 with reasons, verdict | PRESENT |
| U20 | 06-1 (06, 0.000-0.032, 15 s); 06-2 (06, 0.032-0.159, 60 s); 06-5 (06, 0.222-0.264, 20 s); 06-6 (06, 0.264-0.317, 25 s); 06-8 (06, 0.391-0.486, 45 s) | 165 | Post ideas, captions, descriptions, visuals, short videos: live five outputs, devices, ads | PRESENT |
| U21 | 06-4 (06, 0.201-0.222, 10 s); 06-7 (06, 0.317-0.391, 35 s); 06-9 (06, 0.486-0.539, 25 s); 14-10 (14, 0.591-0.690, 30 s) | 100 | Own voice and AI learning it: guideline voice rules, slopmonster, brand kit voice | PRESENT |
| U22 | 06-14 (06, 0.835-0.899, 30 s) | 30 | Planning and consistency: habit week with the content plan | PRESENT |
| U23 | 08-6 (08, 0.548-0.602, 15 s); 08-7 (08, 0.602-0.761, 45 s); 09-1 (09, 0.000-0.041, 15 s); 09-6 (09, 0.216-0.298, 30 s); 09-10 (09, 0.595-0.649, 20 s) | 125 | CTAs, quick replies, reviews, follow-up: CTA ads, response clock, review request, track | PRESENT |
| U24 | 10-1 (10, 0.000-0.102, 20 s); 10-2 (10, 0.102-0.307, 40 s); 10-3 (10, 0.307-0.613, 60 s); 10-4 (10, 0.613-0.843, 45 s) | 165 | What works, double down: sort and clone into next week | PRESENT |
| U25 | 04-1 (04, 0.000-0.095, 35 s); 12-16 (12, 0.892-0.920, 10 s); 13-1 (13, 0.000-0.077, 15 s); 13-2 (13, 0.077-0.332, 50 s); 13-3 (13, 0.332-0.588, 50 s); 13-4 (13, 0.588-0.767, 35 s); 13-5 (13, 0.767-0.869, 20 s) | 215 | Responsible AI: three exercises, takeaway, consent before runs | PRESENT |
| U26 | 14-7 (14, 0.312-0.444, 40 s); 15-6 (15, 0.573-0.833, 75 s) | 115 | Next steps: Tool A tab, 7-day plan card | PRESENT |
| U27 | 02-1 (02, 0.000-0.120, 23 s); 02-3 (02, 0.400-0.700, 59 s); 03-1 (03, 0.000-0.120, 43 s) | 125 | ECO ecosystem: the three words orbit and centre | PRESENT |
| U28 | 03-5 (03, 0.580-0.750, 61 s); 04-2 (04, 0.095-0.284, 70 s); 05-6 (05, 0.646-0.759, 35 s) | 166 | Who's our ICP and a system with AI: groups, questionnaire starting the AI runs | PRESENT |
| U29 | 04-2 (04, 0.095-0.284, 70 s); 14-8 (14, 0.444-0.493, 15 s) | 85 | The questionnaire: answered on stage, returned in Tool B | PRESENT |
| U30 | 03-6 (03, 0.750-0.920, 61 s); 05-6 (05, 0.646-0.759, 35 s) | 96 | B2B Google scraper + Apify: two labelled steps (BLOCKED: APIFY key) | PRESENT as beat; run BLOCKED (APIFY key) |
| U31 | 03-2 (03, 0.120-0.240, 43 s); 03-3 (03, 0.240-0.450, 75 s); 03-5 (03, 0.580-0.750, 61 s) | 179 | Analyse your data, nobody just knows: stamp, table, groups (% split: F-04) | PRESENT as beat; the % split is WEAK until G01 follow-up F-04 |
| U32 | 03-3 (03, 0.240-0.450, 75 s); 03-5 (03, 0.580-0.750, 61 s); 03-6 (03, 0.750-0.920, 61 s) | 197 | Sex, age group, area: table columns, persona fields | PRESENT |
| U33 | 04-4 (04, 0.325-0.446, 45 s) | 45 | AI research where customers live: infographic with sources | PRESENT |
| U34 | 05-1 (05, 0.000-0.048, 15 s); 05-2 (05, 0.048-0.145, 30 s) | 45 | Education vs promotions: toggle with examples and audience toggle | PRESENT |
| U35 | 05-3 (05, 0.145-0.387, 75 s); 05-4 (05, 0.387-0.549, 50 s) | 125 | Competitor recipe: live scan cards, exploded recipe, works vs doesn't | PRESENT |
| U36 | 05-5 (05, 0.549-0.646, 30 s); 05-7 (05, 0.759-0.872, 35 s) | 65 | Gaps: gap scan, the bottle fills the slot | PRESENT |
| U37 | 03-6 (03, 0.750-0.920, 61 s); 04-9 (04, 0.731-0.798, 25 s); 05-6 (05, 0.646-0.759, 35 s); 05-7 (05, 0.759-0.872, 35 s); 06-12 (06, 0.645-0.677, 15 s); 07-10 (07, 0.793-0.878, 30 s); 08-9 (08, 0.832-0.885, 15 s); 09-9 (09, 0.474-0.595, 45 s); 10-4 (10, 0.613-0.843, 45 s); 11-9 (11, 0.825-0.884, 20 s); 12-15 (12, 0.849-0.892, 15 s); 13-5 (13, 0.767-0.869, 20 s); 14-9 (14, 0.493-0.591, 30 s) | 391 | B2B or B2C: Tumelo swap in 03-14, "it doesn't matter" | PRESENT |
| U38 | 06-14 (06, 0.835-0.899, 30 s) | 30 | Consistency from trends and competitors: habit week, "Copy what works. Then fill the gap." | PRESENT |
| U39 | 07-1 (07, 0.000-0.042, 15 s); 07-3 (07, 0.127-0.212, 30 s) | 45 | Website and Google, SEO/AEO/GEO deeper: main place, one-word beats | PRESENT |
| U40 | 07-2 (07, 0.042-0.127, 30 s) | 30 | Google and the AI engines; AI can't go into social: names, owner line, glass wall | PRESENT |
| U41 | 05-3 (05, 0.145-0.387, 75 s); 05-7 (05, 0.759-0.872, 35 s); 07-8 (07, 0.495-0.580, 30 s) | 140 | Authority and social "copy that": answer page vs homepage, copy the format | PRESENT |
| U42 | 05-2 (05, 0.048-0.145, 30 s); 06-13 (06, 0.677-0.835, 75 s); 06-14 (06, 0.835-0.899, 30 s) | 135 | Interest: opinion or education piece: audience mix, brief to post idea, week | PRESENT |
| U43 | 06-13 (06, 0.677-0.835, 75 s); 06-14 (06, 0.835-0.899, 30 s) | 105 | Last 30 Days: daily brief with dated sources (BLOCKED: G02-T02K + key), daily step | PRESENT as beat; run BLOCKED (G02-T02K + key) |
| U44 | 08-1 (08, 0.000-0.053, 15 s); 08-3 (08, 0.159-0.372, 60 s); 08-7 (08, 0.602-0.761, 45 s); 09-4 (09, 0.122-0.162, 15 s) | 135 | Capture as soon as possible, online or social: owner line, helper, DM capture, CTA ads | PRESENT |
| U45 | 08-2 (08, 0.053-0.159, 30 s) | 30 | Where people land: landing-page ranking pane | PRESENT |
| U46 | 08-3 (08, 0.159-0.372, 60 s) | 60 | AI helper pops up, then name, surname, email, number: live helper, demo data | PRESENT |
| U47 | 08-4 (08, 0.372-0.478, 30 s) | 30 | Dwell-time pop-up: visible timer on 2 capture points | PRESENT |
| U48 | 08-8 (08, 0.761-0.832, 20 s); 09-14 (09, 0.812-0.893, 30 s); 15-4 (15, 0.295-0.365, 20 s) | 70 | Where to find conversion skills: named with true sources in 08, 09, 15 | PRESENT |
| U49 | 09-8 (09, 0.338-0.474, 50 s) | 50 | Welcome email, email + WhatsApp journey: day timeline with opt-out | PRESENT |
| U50 | 09-9 (09, 0.474-0.595, 45 s) | 45 | Pipeline boxes: quotation, order, invoice, follow-up | PRESENT |
| U51 | 09-10 (09, 0.595-0.649, 20 s) | 20 | Reviews on social and Google: review request | PRESENT |
| U52 | 09-11 (09, 0.649-0.704, 20 s); 09-12 (09, 0.704-0.758, 20 s); 09-13 (09, 0.758-0.812, 20 s) | 60 | Abandoned cart, onboarding, keeping track: funnel tabs, CRM screen | PRESENT |
| U53 | 09-9 (09, 0.474-0.595, 45 s); 09-13 (09, 0.758-0.812, 20 s); 09-14 (09, 0.812-0.893, 30 s) | 95 | AI builds funnels, skills, CRMs: CRM built with AI, skills panel | PRESENT |
| U54 | 02-4 (02, 0.700-0.920, 43 s); 10-1 (10, 0.000-0.102, 20 s); 10-2 (10, 0.102-0.307, 40 s); 10-3 (10, 0.307-0.613, 60 s) | 163 | Impressions, comments, double down: results lens, sort, clone | PRESENT |
| U55 | 14-1 (14, 0.000-0.049, 15 s); 14-12 (14, 0.772-0.887, 35 s) | 50 | Public tool URL: Tool A on stage and its QR | PRESENT as beat; Tool A BLOCKED (G05 + OG-KEYS) |
| U56 | 14-2 (14, 0.049-0.099, 15 s) | 15 | Scan the company: What you do panel | PRESENT as beat; Tool A BLOCKED (G05 + OG-KEYS) |
| U57 | 14-3 (14, 0.099-0.148, 15 s) | 15 | Scan social media: Socials panel | PRESENT as beat; Tool A BLOCKED (G05 + OG-KEYS) |
| U58 | 14-4 (14, 0.148-0.214, 20 s) | 20 | Competitive analysis built in: Competitors panel | PRESENT as beat; Tool A BLOCKED (G05 + OG-KEYS) |
| U59 | 07-5 (07, 0.283-0.354, 25 s); 14-5 (14, 0.214-0.263, 15 s) | 40 | Is AI reaching the site: AI crawler reach panel, SEO check | PRESENT as beat; Tool A BLOCKED (G05 + OG-KEYS) |
| U60 | 07-7 (07, 0.425-0.495, 25 s); 14-6 (14, 0.263-0.312, 15 s) | 40 | AEO/GEO cited or mentioned: citations panel, citability check | PRESENT as beat; Tool A BLOCKED (G05 + OG-KEYS) |
| U61 | 14-1 (14, 0.000-0.049, 15 s); 14-7 (14, 0.312-0.444, 40 s) | 55 | Doing well, not well, next steps: tabs | PRESENT as beat; Tool A BLOCKED (G05 + OG-KEYS) |
| U62 | 11-1 (11, 0.000-0.119, 40 s); 12-1 (12, 0.000-0.071, 25 s) | 65 | AI = Attract + Interact, different from E and C: teaching opener | PRESENT |
| U63 | 11-7 (11, 0.430-0.594, 55 s); 11-8 (11, 0.594-0.825, 78 s) | 133 | Beauty, retail packing, merchandising, beauty/makeup/clothing: argument with pairs, gallery | PRESENT |
| U64 | 11-2 (11, 0.119-0.178, 20 s); 11-5 (11, 0.297-0.341, 15 s); 11-6 (11, 0.341-0.430, 30 s); 11-7 (11, 0.430-0.594, 55 s) | 120 | It needs to be attractive: owner line, switchboard | PRESENT |
| U65 | 12-1 (12, 0.000-0.071, 25 s); 12-2 (12, 0.071-0.170, 35 s); 12-3 (12, 0.170-0.226, 20 s) | 80 | First attract, then interact: window line, tap to know more | PRESENT |
| U66 | 06-8 (06, 0.391-0.486, 45 s); 11-8 (11, 0.594-0.825, 78 s); 12-3 (12, 0.170-0.226, 20 s); 12-5 (12, 0.311-0.368, 20 s); 12-6 (12, 0.368-0.425, 20 s); 12-7 (12, 0.425-0.481, 20 s) | 203 | Websites and ads that look good, what people do: gallery signals, ad actions, 3 sites | PRESENT as beat; slots to source (G04-T03) |
| U67 | 12-8 (12, 0.481-0.538, 20 s) | 20 | Providers on interaction and appeal: 2 quotes | PRESENT as beat; slots to source (G04-T03) |
| U68 | 08-5 (08, 0.478-0.548, 20 s); 11-10 (11, 0.884-0.920, 12 s); 12-2 (12, 0.071-0.170, 35 s); 12-5 (12, 0.311-0.368, 20 s) | 87 | His references: R1, R5, R2, oryzo shown attributed | PRESENT |
| U69 | 12-9 (12, 0.538-0.566, 10 s); 12-10 (12, 0.566-0.609, 15 s); 12-11 (12, 0.609-0.694, 30 s); 12-12 (12, 0.694-0.750, 20 s); 12-13 (12, 0.750-0.821, 25 s); 12-14 (12, 0.821-0.849, 10 s) | 110 | Teach AI, judge and recreate: same prompt, system, judge, recreate look and interaction | PRESENT |
| U70 | 07-9 (07, 0.580-0.793, 75 s) | 75 | 30/60/90 plan for blogs and landing pages: live depth track | PRESENT |
| U71 | 07-4 (07, 0.212-0.283, 25 s) | 25 | Keyword tools: live keyword targets | PRESENT |
| U72 | 07-5 (07, 0.283-0.354, 25 s); 07-6 (07, 0.354-0.425, 25 s); 07-7 (07, 0.425-0.495, 25 s); 07-9 (07, 0.580-0.793, 75 s) | 150 | SEO, backlinks, citations, references: live checks | PRESENT |
| U73 | 04-1 (04, 0.000-0.095, 35 s); 04-2 (04, 0.095-0.284, 70 s); 05-3 (05, 0.145-0.387, 75 s); 05-6 (05, 0.646-0.759, 35 s); 06-2 (06, 0.032-0.159, 60 s); 06-13 (06, 0.677-0.835, 75 s); 07-4 (07, 0.212-0.283, 25 s); 07-5 (07, 0.283-0.354, 25 s); 07-9 (07, 0.580-0.793, 75 s); 08-3 (08, 0.159-0.372, 60 s); 13-6 (13, 0.869-0.920, 10 s) | 545 | No more links: every tool has a live slot in its scene; a tagged cached fallback exists only for runs already recorded, not for LS-2 or LS-4 (no live or cached run yet) | PRESENT as beat; LS-2 and LS-4 BLOCKED (no run yet), LS-11 BLOCKED, LS-12 HELD |
| U74 | none (process unit) | 0 | Process: DONE-0, experience/grill-decisions-2026-10-27.md | PROCESS |
| U75 | none (process unit) | 0 | Process: DONE-0, owner-brief reference table; the references also show on screen as attributed cards (08-5, 11-10, 12-2) | PROCESS |
| U76 | 02-4 (02, 0.700-0.920, 43 s); 03-6 (03, 0.750-0.920, 61 s); 04-10 (04, 0.798-0.866, 25 s); 05-4 (05, 0.387-0.549, 50 s); 05-7 (05, 0.759-0.872, 35 s); 06-5 (06, 0.222-0.264, 20 s); 06-8 (06, 0.391-0.486, 45 s); 07-8 (07, 0.495-0.580, 30 s); 08-5 (08, 0.478-0.548, 20 s); 08-6 (08, 0.548-0.602, 15 s); 09-6 (09, 0.216-0.298, 30 s); 10-3 (10, 0.307-0.613, 60 s); 11-2 (11, 0.119-0.178, 20 s); 11-6 (11, 0.341-0.430, 30 s); 11-7 (11, 0.430-0.594, 55 s); 11-9 (11, 0.825-0.884, 20 s); 12-4 (12, 0.226-0.311, 30 s); 12-14 (12, 0.821-0.849, 10 s); 13-4 (13, 0.588-0.767, 35 s); 15-3 (15, 0.191-0.295, 30 s) | 664 | Good vs Average: labelled pairs across the deck | PRESENT |
| U77 | 01-1 (01, 0.000-0.080, 10 s); 15-7 (15, 0.833-0.920, 25 s) | 35 | Cinematic journey: one protagonist, peak, close | PRESENT |
| U78 | 06-8 (06, 0.391-0.486, 45 s); 08-7 (08, 0.602-0.761, 45 s); 11-8 (11, 0.594-0.825, 78 s) | 168 | Actual ad examples: 4 sourced in 06, 3 CTA slots in 08, 6 gallery slots in 11 (AD-A6 sourced) | PRESENT as beat; 5 of 13 ad slots sourced (AD-E1..E4, AD-A6), 8 HELD if short |
| U79 | 03-4 (03, 0.450-0.580, 87 s); 03-6 (03, 0.750-0.920, 61 s); 06-9 (06, 0.486-0.539, 25 s); 08-3 (08, 0.159-0.372, 60 s); 12-2 (12, 0.071-0.170, 35 s); 12-4 (12, 0.226-0.311, 30 s) | 298 | Finding the ICP, the voice, engaging, interacting brought to life | PRESENT |
| U80 | 01-3 (01, 0.300-0.550, 33 s); 06-2 (06, 0.032-0.159, 60 s); 11-4 (11, 0.231-0.297, 22 s) | 115 | Free to generate images and videos (BLOCKED: OG-EL-AUTH, OG-SPEND) | BLOCKED (OG-EL-AUTH, OG-SPEND) |
| U81 | 01-2 (01, 0.080-0.300, 29 s); 04-11 (04, 0.866-0.920, 20 s); 05-8 (05, 0.872-0.920, 15 s); 06-15 (06, 0.899-0.920, 10 s); 07-11 (07, 0.878-0.920, 15 s); 08-10 (08, 0.885-0.920, 10 s); 09-15 (09, 0.893-0.920, 10 s); 10-5 (10, 0.843-0.920, 15 s); 14-13 (14, 0.887-0.920, 10 s) | 134 | Every page keeps moving and evolves into the next: auto-scroll, exits become entries | PRESENT |
| U82 | 01-3 (01, 0.300-0.550, 33 s); 08-6 (08, 0.548-0.602, 15 s); 11-2 (11, 0.119-0.178, 20 s); 11-3 (11, 0.178-0.231, 18 s); 11-4 (11, 0.231-0.297, 22 s); 11-9 (11, 0.825-0.884, 20 s); 11-10 (11, 0.884-0.920, 12 s) | 140 | R5 floating products: stage, break-out, our ad | PRESENT |
| U83 | none (process unit) | 0 | Process: skill-orchestration.md (design-loop and scroll-craft division of labour) | PROCESS |
| U84 | 01-1 (01, 0.000-0.080, 10 s); 11-4 (11, 0.231-0.297, 22 s); 12-5 (12, 0.311-0.368, 20 s) | 52 | oryzo as the bar: persistent stage, peak, oryzo shown live | PRESENT |
| U85 | none (process unit) | 0 | Process: OG-SPEND storyboard, spine section 5 | PROCESS |
| U86 | 01-1 (01, 0.000-0.080, 10 s) | 10 | "Sales, Marketing and AI" bigger | PRESENT |
| U87 | 01-2 (01, 0.080-0.300, 29 s); 15-7 (15, 0.833-0.920, 25 s) | 54 | "Be found. Be chosen. Keep learning." kept | PRESENT |
| U88 | 01-4 (01, 0.550-0.750, 26 s) | 26 | The opener card on screen; three opener options in the speaker notes (OG-OPENER) | PRESENT |
| U89 | 01-1 (01, 0.000-0.080, 10 s); 01-5 (01, 0.750-0.920, 22 s) | 32 | Every page auto-scrolls at a pace | PRESENT |
| U90 | 01-5 (01, 0.750-0.920, 22 s) | 22 | Page one scrolls until just before scene 02 | PRESENT |
| U91 | 02-1 (02, 0.000-0.120, 23 s); 02-2 (02, 0.120-0.400, 55 s) | 78 | All three first, Engage to the centre | PRESENT |
| U92 | 02-2 (02, 0.120-0.400, 55 s) | 55 | Catalysts that drive engagement | PRESENT |
| U93 | 02-3 (02, 0.400-0.700, 59 s) | 59 | Convert: clear next step, details, offer value | PRESENT |
| U94 | 02-4 (02, 0.700-0.920, 43 s) | 43 | Optimize: failures and successes, why and to whom | PRESENT |
| U95 | 02-2 (02, 0.120-0.400, 55 s); 02-3 (02, 0.400-0.700, 59 s) | 114 | Click Engage, Convert, Optimize | PRESENT |
| U96 | 02-4 (02, 0.700-0.920, 43 s) | 43 | Next starts the animation | PRESENT |
| U97 | 03-1 (03, 0.000-0.120, 43 s) | 43 | ENGAGE, WHO, ? animated | PRESENT |
| U98 | 03-2 (03, 0.120-0.240, 43 s) | 43 | You probably don't know; not a feeling | PRESENT |
| U99 | 03-3 (03, 0.240-0.450, 75 s) | 75 | The keep-sentence, animated | PRESENT |
| U100 | 03-6 (03, 0.750-0.920, 61 s) | 61 | No "job" sentence; any industry | PRESENT (the any-industry strip in 03-6 is plain text; only 03-6's cached B2B list is BLOCKED, cut K01) |
| U101 | 03-4 (03, 0.450-0.580, 87 s); 03-6 (03, 0.750-0.920, 61 s); 13-3 (13, 0.332-0.588, 50 s) | 198 | Age group, sex, race only if stated, circumstances, persona research | PRESENT |
| U102 | 03-4 (03, 0.450-0.580, 87 s) | 87 | A process that captures the data | PRESENT |
| U103 | none (process unit) | 0 | Process: per-slide contract, spine section 4 = experience/g01-slide-spec.md | PROCESS |
| U104 | none (process unit) | 0 | Process: methodology-receipts.md (Sequential Thinking) | PROCESS |
| U105 | none (process unit) | 0 | Process: methodology-receipts.md (OBT documents read) | PROCESS |
| U106 | none (process unit) | 0 | Process: methodology-receipts.md (ST + OBT together) | PROCESS |

## 7. Shortfalls, listed as HELD (nothing is silently cut, A1.6)

1. **Time:** the beats need 69:55, not 60:00. Owner choice in section 8.
2. **B2B find (U30, LS-2):** BLOCKED on APIFY_API_TOKEN. No live run and no cached run exist, so 05-6 (and 03-6's cached list) can show only the two labelled steps with "needs the Apify key" (PARTIAL).
3. **Last 30 Days (U43, LS-4):** BLOCKED on the G02-T02K tool review and SCRAPECREATORS_API_KEY. No live or cached run exists (PARTIAL).
4. **Ads:** 5 of the 13 real-ad slots are sourced and browser-tested (AD-E1..E4 and AD-A6). AD-C1..C3 (G03-T05) and AD-A1..A5 (G04-T03) are not sourced yet. Any slot still empty at build time is HELD for the owner, never filled with a link or a pin.
5. **Websites and provider quotes:** W3, PS-1 and PS-2 are not chosen; W1 and W2 framing is not checked. A site that refuses framing opens in a presenter live window, never as a bare link.
6. **Logos (VS-m1):** until OG-BRAND closes, the wheel shows text wordmarks labelled "logo pending brand-terms acceptance" (A2.9). Instagram's rule against sitting beside other networks conflicts with G5's 7-logo wheel and is HELD.
7. **Media:** every generated still or clip waits for OG-EL-AUTH and OG-SPEND (G10). Until then the beats use code-made stand-ins labelled as such.
8. **Tools:** Tool A is BLOCKED on the G05 release and OG-KEYS; Tool B is HELD on OG-CLAUDE-PAGE. Their QR codes wait for the public URLs.
9. **whatsapp-sequences:** its upstream source was not found (checked 2026-10-27 against coreyhaines31/marketingskills). It is named as installed on the presenter's Claude Code, never as downloadable, until G03-T01 records the source.
10. **Scene 03 (G01 follow-ups F-01..F-07):** the spec deviations VS-m5 and VS-m7, the write-down's place inside 03-4 (now timed, 87 s), the DD-03 part of 03-6 and the stale "Talk minutes" line are listed for the G01 builder, not rebuilt here.

## 8. Owner cut list for 04:00 (ranked; the owner chooses)

**Option 0 (keep everything):** run the full 69:55 and ask the organiser for a 75-minute slot (a 70-minute slot leaves 5 s of margin). Nothing is lost.

Otherwise take cuts from the top down. Tier 1 trims time only: nothing the owner asked for leaves the deck (it may move to another beat). Tier 2 thins an owner beat but keeps every goal floor. Tier 3 needs your OK on a goal reading. Tier 4 drops below a goal floor and stays HELD as a shortfall.

| Rank | Cut | Beats | Saves | What is lost | Tier | Total after this cut |
|---:|---|---|---:|---|---:|---|
| 1 | K01 | 03-6 | 25 s | DD-03's cached two-step B2B list leaves scene 03; the Tumelo persona toggle stays. The B2B find plays live in 05-6 (and no b2b-find run, live or cached, exists yet). G01 follow-up F-05 | 1 | 69:30 |
| 2 | K02 | 15-4 | 10 s | 15-4 keeps the three current names and the one repo path (cro, popups, signup at github.com/coreyhaines31/marketingskills/tree/main/skills); the older names, email-sequence and whatsapp-sequences stay in 09-14 only (20 s to 10 s). v2.1: the /skills/ page does not list them (G07-T08 has no such part), so no link there is claimed | 1 | 69:20 |
| 3 | K03 | 05-1, 06-1, 07-1 | 15 s | 5 s less settling time at three scene arrivals (15 s to 10 s each) | 1 | 69:05 |
| 4 | K04 | 07-10 | 15 s | Tumelo's authority example gets one line (30 s to 15 s) | 1 | 68:50 |
| 5 | K05 | 10-2, 10-4 | 20 s | Slower narration of the results lens and the double down is lost (40 to 30 s, 45 to 35 s) | 1 | 68:30 |
| 6 | K06 | 12-5, 12-6, 12-7 | 15 s | Less dwell per website (20 s to 15 s each); frames must be preloaded at scene 12 arrival | 1 | 68:15 |
| 7 | K07 | 09-2, 09-3, 09-4 | 15 s | Chatbot, WhatsApp and DMs get 10 s each; Slack keeps its 20 s honest answer | 1 | 68:00 |
| 8 | K08 | 06-8 | 15 s | No ad plays by default (signals shown; ads play only on click), 45 s to 30 s. This thins the owner's ad priority (U78; A1.6 counts click-only content as weak), so it is Tier 2 (v2.1, NV-m7) | 2 | 67:45 |
| 9 | K09 | 04-4 | 15 s | Only the Gift Planner's 'where online' result is narrated; the Tumelo result appears unnarrated (Tier 2 in v2.1, NV-m7) | 2 | 67:30 |
| 10 | K10 | 05-3 | 15 s | Two of the three competitors are narrated (75 s to 60 s); the third card shows unnarrated (Tier 2 in v2.1, NV-m7) | 2 | 67:15 |
| 11 | K11 | 09-8 | 10 s | The email + WhatsApp day timeline plays faster (50 s to 40 s) | 2 | 67:05 |
| 12 | K12 | 12-2 | 10 s | One product arc is tapped instead of two (35 s to 25 s) | 2 | 66:55 |
| 13 | K13 | 11-7 | 10 s | One of the three beauty Good vs Average pairs gets a glance only (55 s to 45 s) | 2 | 66:45 |
| 14 | K14 | 09-11, 09-12 | 10 s | Each funnel tab gets 15 s (still at the A1.6 floor) | 2 | 66:35 |
| 15 | K15 | 06-9, 06-10, 06-11 | 15 s | Each slopmonster pair gets 20 s; the 3 marked differences are read faster | 2 | 66:20 |
| 16 | K16 | 11-2..11-6 | 15 s | The peak switchboard runs 90 s instead of 105 s | 2 | 66:05 |
| 17 | K17 | 12-11 | 10 s | The design-loop step-through gets 20 s instead of 30 s; the round verdicts, the fix and 3 of 3 still show. v2.1: the generic-AI shatter is no longer in this row (K30, Tier 4) | 2 | 65:55 |
| 18 | K18 | 14-12 | 15 s | Less time for the room to scan the two tool QR codes (35 s to 20 s) | 2 | 65:40 |
| 19 | K19 | 15-5 | 20 s | 8 learn links narrated (the G07 floor) instead of 12; the other 4 are on /skills/ only | 2 | 65:20 |
| 20 | K20 | 06-13 | 25 s | Last 30 Days gets 50 s: talk and complaint themes with sources; the post-idea step moves into 06-14's line | 2 | 64:55 |
| 21 | K21 | 04-6, 04-7, 04-8 | 30 s | The wheel lands on Instagram and WhatsApp only; Google Business Profile comes alive on click and is named in the verdict | 2 | 64:25 |
| 22 | K22 | 14-2..14-6 | 25 s | Tool A: competitors and AI reach narrated; the other three panels get one line each | 2 | 64:00 |
| 23 | K23 | 14-10, 14-11 | 25 s | Tool B brand kit and asset shown for 30 s together instead of 55 s | 2 | 63:35 |
| 24 | K32 | 15-6 | 15 s | New in v2.1: the 7-day test goes back to 60 s; the room still writes for 40 s, but the four picks and the plan card get 20 s of talk instead of 35 s | 2 | 63:20 |
| 25 | K33 | 13-2, 13-3 | 20 s | New in v2.1: each of the first two Responsible AI exercises gets 40 s instead of 50 s; every claim and item stays clickable with its feedback, but fewer are worked aloud (2 of 3 claims, 3 of 5 items) | 2 | 63:00 |
| 26 | K34 | 09-9 | 10 s | New in v2.1: the pipeline deal moves through quotation, order, invoice and follow-up faster (45 s to 35 s); all four boxes stay | 2 | 62:50 |
| 27 | K24 | 04-2 | 45 s | OWNER OK NEEDED: the volunteer answers the questionnaire at the door before the session; 04-2 shows the answers arriving and the runs starting (70 s to 25 s). The room no longer watches the questionnaire being answered | 3 | 62:05 |
| 28 | K25 | 11-8 | 40 s | OWNER OK NEEDED (reading of G04-T03): the gallery shows 3 new ads (2 clothing or fashion, 1 retail) and counts 06-8's AD-E1/AD-E2 (beauty) and AD-E4 (B2B) through a 5 s callback | 3 | 61:25 |
| 29 | K26 | 13-4 | 25 s | OWNER OK NEEDED (G04-T09 lists three interactions): exercise 3 merges into exercise 1; the fake review and the invented claim become clickable claims | 3 | 61:00 |
| 30 | K28 | 06-6 | 10 s | GOAL SHORTFALL, HELD: the short code-rendered clip is dropped (G02-T11) | 4 | 60:50 |
| 31 | K30 | 12-14 | 10 s | GOAL SHORTFALL, HELD: our own recreation of the generic AI look, shattered with T9, is dropped; G04-T08 lists it as an output (split from K17 in v2.1, NV-03) | 4 | 60:40 |
| 32 | K29 | 08-7 | 15 s | GOAL SHORTFALL, HELD: 2 CTA ads instead of 3 (G03-T05) | 4 | 60:25 |
| 33 | K27 | 15-3 | 30 s | GOAL SHORTFALL, HELD: the with/without skill output is dropped (G07-T11(3)) | 4 | 59:55 |
| 34 | K31 | 03-4 | 40 s | GOAL SHORTFALL, HELD: the 40 s write-down ("your last 10 customers") is dropped and 03-4 goes back to 47 s. Lost: the room's own list of its last 10 customers, a goal-01 journey row and a G01-T09 proof item. Scene 03 is G01's, so this would be a G01 change (F-05) | 4 | 59:15 |

- **Recommended order:** top to bottom. Tiers 1-3 together save 535 s and end at 61:00, the outer edge of the rehearsal window (60:00 +/- 60 s) with no margin, with no goal floor lost but with three owner-OK readings (K24, K25, K26).
- Without K32, K33 and K34 (the three Tier 2 rows added in v2.1, 45 s), the first three tiers stop at 61:45, outside the window.
- The total first falls inside 61:00 at rank 29 (K26), at 61:00.
- It first reaches 60:00 or less at rank 33 (K27), at 59:55, which takes Tier 4 goal shortfalls.
- **v2.1 goal re-check of every Tier 1-2 row (NV-03):** K17's shatter moved to Tier 4 as K30 (a listed G04-T08 output); K08, K09 and K10 moved to Tier 2 (NV-m7); K02 no longer claims links on /skills/. The other rows keep their goal floors against goal-01..07: K01 (the two-step B2B find stays live in 05-6), K07 (all four channel places stay, G03-T08), K12 (one tap arc still runs product, detail, proof, ask, G04-T08), K14 (15 s, the A1.6 floor), K19 (8 links, the G07 floor), K21 (all 7 tiles named, G02), K22 (every Tool A panel still shows, G07-T09), K33 (all three exercises keep visible feedback, G04-T09), K34 (all four pipeline boxes, G03-T09).
- Each accepted cut changes the beat's seconds in `story-spine.md`, the p-ranges of its scene, and `sceneSeconds`. The script then re-checks the sums.

## 9. Owner questions that are not cuts

1. **Q-REVEAL:** A1.4 (binding) says "20 +/- 2 s from scene reveal"; the runner times from each slot's `reveal()` (D15). Until you answer, the plan follows A1.4's wording, and every slot is live under it because every run starts at 04-2. Keep A1.4's wording, or allow the per-slot reading?
2. **Q-HELPER:** the helper's question and details are prefilled fictional demo data, never typed live (v2.1 settles R6 against 08-3), and its run now starts at 04-2 with the others. If you allow the per-slot reading, should it start at scene 08 arrival instead, so its run visibly starts in the Convert chapter?
3. **Q-VOLUNTEER:** the plan needs a pre-agreed volunteer at scene 04 (proof business is HELD, A1.2). Who, and are they recruited before the session?
4. **Q-INSTAGRAM:** Instagram's brand rules forbid its logo beside other networks; G5 wants a 7-logo wheel. Show Instagram on its own landing only, or use text for all 7?
5. **Q-QUESTIONNAIRE:** the volunteer questionnaire now opens scene 04 (Paste A puts the questionnaire before "where they live"). Keep it there?
6. **Q-DATA (for OG-DATA, NV-m2):** the 04-1 consent card now names the questionnaire answers and the processors (Anthropic for Claude, Firecrawl, Apify; Tool A's notice adds Supabase and Resend). The questionnaire stays business-level, aggregate and optional, and no personal contact details are typed. Approve or reword the card (PROVISIONAL builder wording).

## 10. Script check

`python scripts/check-spine-v2.py` (receipt appended below by the builder after each run).
**Receipt, 2026-10-27 night (builder run, not a critic verdict):** `python scripts/check-spine-v2.py` (sha256 prefix `dbdc147d692a9429`) printed "92/92 checks pass. Total 4140 s = 69:00.". It checks: 15 scenes; each scene's beat count and seconds sum; p-ranges contiguous from 0.00 to 0.92; p-widths proportional to seconds in scenes 04-15; `sceneSeconds` and `sceneMinutes` against the scene totals; every beat has at least 10 s, substance and units; every DD default beat is at least 15 s; all 106 unit rows, with every deck unit tied to beats whose p-range and seconds match section 3 (an ID-only unit fails); the scene cards in `story-spine.md` carry the same beat IDs, p-ranges and seconds; the owner's words and the named critic findings; consent before every run; the slot floors; and the cut-list running totals.

Proof that the check can fail (each file restored byte-identical afterwards):
1. Beat 06-10 changed from 25 s to 26 s in this file: FAIL on the scene 06 sum, the U13 beat match and the card match.
2. U14's beat list replaced by its ID only: FAIL "U14 ID only, no beat".
3. The 05-7 card line changed to "Don't copy them. Fill the gap.": FAIL on the owner-words check.

**Receipt, spine fix round 3 (v2.1), 2026-10-28 (builder run, not a critic verdict):** `python scripts/check-spine-v2.py` (sha256 prefix `131f628a64836f06`) printed "111/111 checks pass. Total 4195 s = 69:55." and exited 0. Round 3 added 19 checks and weakened none: beat clocks; section 2 minutes, live seconds and start clocks; the headline total and live seconds; planned waits inside their beat (NV-01, NV-m10); unit labels (NV-m5); card text equal to beat text (NV-m8); card talk-time lines; the scene 03 timing annotation; the spine 3.1 table; every `sceneSeconds` array in the spine; skill names and paths on screen (NV-02); live-slot starts, reveals and head starts (NV-m3); the 04-2 run tray (NV-m6); not-runnable live seconds (NV-m4); floor-table sourcing counts; U78 and section 7 ad counts; cut-list ranks, tiers and labels (NV-03); cut beats; and every cut-list claim in both files. It also strengthened three existing checks: the "don't copy" scan is now case-insensitive and covers the beat table (NV-m8), the 05-7/06-14 line must carry its PROVISIONAL label (NV-m1), and each unit's total seconds must equal its listed beats.

Proof that the new checks can fail (each run exit 1; both files restored byte-identical afterwards, sha256 prefixes `fcfbee0e5f5413ec` timing and `78f7b10e8db23aff` spine, then 111/111 again):
1. Lowercase "don't copy them, fill the gap" added to the timing 05-7 beat only: FAIL on the "don't copy" scan and the card-text match.
2. The 03-4 write-down moved back into "the engine's hold slack": FAIL on the planned-waits check.
3. The section 8 claim "end at 61:00" changed to 60:40: FAIL on the cut-list claims check.
4. 08-8 says popup-cro instead of popups (both files): FAIL on the NV-02 skill-path check.
5. U78 says 4 of 13 sourced: FAIL on the ad-count check.
6. Last 30 Days removed from the 04-2 run tray (both files): FAIL on the run-tray check.
7. Beat 07-4's clock set back to its v2 value: FAIL on the clocks check.
8. K30 relabelled Tier 2: FAIL on the tier-label check and the cut-list claims check.
