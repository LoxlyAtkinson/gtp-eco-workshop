# Current deck map (D1, 2026-10-27)

**Next action:** read section 0 first (5 min). It shows which version the owner was looking at. The live site and the local working tree are different decks.

Internal research. Not published. Screenshots and the browser log are in `experience/research/D1-current-deck/`.

## 0. Two versions exist. Know which one you are fixing.

| | Live site (what the owner reviewed) | Local working tree (not yet published) |
|---|---|---|
| Source | `HEAD` = commit `17170a4` | The same files, with uncommitted edits (`git diff --stat`: index.html +/-344 lines, scroll-presentation.js +/-708, scroll-experience.css +254) |
| Served at | `loxlyatkinson.github.io/gtp-eco-workshop/`. Checked today: live `index.html` and `scroll-presentation.js?v=1` are byte-identical to `git show HEAD:` (`cmp`) | Only on localhost |
| Top-left label | `GTP FIELD GUIDE` | `SALES, MARKETING AND AI` |
| Slide 3 title | "Your ideal customer is a hypothesis." | "Who actually buys, asks and returns?" |
| Auto-scroll | None. The page stays still on open and after Next | Yes, on every scene |
| Review status | Earlier accepted release | Builder evidence only. Latest blind scores: brief 88, craft 88, system 82, all FAIL (`experience/progress.md:3`) |

The owner's Paste B (owner brief lines 27) describes the **live** deck word for word: "GPT Field Guide", "Your ideal customer is a hypothesis", "Ask what job they need done", and Next leaving the page static. A first pass of fixes for slides 1–3 and auto-scroll already exists **locally**. It is uncommitted, unpublished and unaccepted.

## 1. Every scene in order

There are **15 numbered scenes**, which matches the owner's "one to fifteen" (`index.html:28–168`, `<section class="scene" data-scene="01..15">`). JavaScript also inserts **14 unnumbered connectors** between scenes:
- 3 "bridges" (`scroll-presentation.js:36–41`, after scenes 02, 05 and 10).
- 11 "handoffs" (`scroll-presentation.js:45–78`, after 01, 03, 04, 06, 07, 08, 09, 11, 12, 13 and 14).

The connectors have no speaker notes and are not counted in "NN / 15". Measured at 1366×768, the total document height is 36,588 px on both live and local. Each scene is 1,382 px tall (180svh, `scroll-experience.css:4`). Scene 05 is 1,843 px.

How the motion works:
- Every scene sets `--p` (its scroll progress from 0 to 1) in `update()` (`scroll-presentation.js:126–212`).
- CSS reads `--p` for transforms. JavaScript adds state classes when `--p` crosses a threshold.
- The main deck uses **no GSAP**: the `gsap` grep returns 0 hits in `index.html` and `scroll-presentation.js`. GSAP appears only in `motion-examples/`.
- "3D" means pre-rendered images (`assets/eco-compass.png`, `assets/amina-lunch-3d.webp`) moved with CSS perspective. There is no WebGL.
- The only video is in scene 13.

The table below describes the working tree. Where the live deck differs, the row says so.

| # | id / stage | Heading (h1/h2) | Key body copy | Media | Motion (scroll-linked unless stated) | Speaker note (start) |
|---|---|---|---|---|---|---|
| 1 | 01 / start `index.html:28` | Be found. Be chosen. Keep learning. | Kicker "Sales, Marketing and AI". Lede "Follow one customer question from first click to sale…". Prompt "Where are you spending time on marketing that is not paying you back?" | Fixed `cinema-world` compass `eco-compass.png` (`index.html:16`). Hero-art tags "ONE CUSTOMER" / "ONE NEXT ACTION" and E/C/O chips | Compass scales with `--active-p` (`scroll-experience.css:105`). Tags drift (`:16–17`). E/C/O chips fade in once p>.17 (`:522–524`). Scroll cue fades (`:525`) | `index.html:35`: "2 minutes · Audience opener: 'Quick show of hands…'" |
| 2 | 02 / map `:38` | Growth is a loop. Make each turn useful. | Three ECO buttons plus a detail panel (see section 3) | Compass background | Scroll beats Engage (p>.11), Convert (>.4), Optimize (>.7) (`js:206–210`). Carousel positions (`css:829–845`). A click holds the choice (`js:304`) | `:44`: "3 minutes · Brief overview, then audience choice…" |
| 3 | 03 / engage `:47` | Who actually buys, asks and returns? | See section 3 | Order-chip "receipts" and evidence card (CSS only) | `is-icp-question` (.12), `-sorting` (.27), `-revealed` (.61), `is-persona-final` (.75) (`js:170–176`). Card rotates in 3D (`css:21`) | `:52`: "5 minutes · Worked example plus a 40-second exercise…" |
| 4 | 04 / engage `:55` | Choose the channel that fits the buying moment. | Four **text-only** channel cards: Instagram / TikTok, Facebook, Google / Maps, WhatsApp (`:59`). Amina's channel decision path (`:60`) | Compass (`css:409`) | `--channel-decision` eases over .52–.82. Decision appears at p>.68 (`js:136–140`). A card click shows its reason (`js:305–306`) | `:62`: "5 minutes · Participant channel vote…" |
| 5 | 05 / engage `:65` | One question. Three ways to be seen. | Three illustrative specimens: feed post, 8-second vertical storyboard, organic search result. Hook/proof/action anatomy | `<img amina-lunch-3d.webp>` in a phone frame (`:70`), transit images (`js:109`). Link to `./motion-examples/` (`:69–70`) | Product emerges at p>.14. Scrubs feed → vertical (.33) → search (.66) with "make it move / findable" transit beats (`js:148–162`). Tabs override the scrub (`js:307`) | `:71`: "5 minutes · Practical ad comparison…" |
| 6 | 06 / engage `:74` | AI drafts faster. You make it yours. | Brief, generic draft, human edit. "Apply the brand brief" button. Finished caption. Mon–Fri week | None (cards) | `--voice-focus` (.16–.45), `--voice-week` (.61–.79), `is-late-beat` (>.7) (`js:141–147`). Button toggles the rewrite (`js:318–319`) | `:80`: "5 minutes · Live AI demonstration…" |
| 7 | 07 / engage `:83` | Your website needs a 90-day rhythm. | 30/60/90 roadmap buttons (`:87`). Four checks: Index / Local / Sources / Links (`:88`). SEO/AEO/GEO fine print (`:89`) | Answer-page mock plus `amina-lunch-3d.webp` meal (`css:430/466`) | `--website-zoom` (.25–.67). Transition (.35–.76) then final (>.76) (`js:163–169`) | `:90`: "6 minutes · Website planning demonstration…" |
| 8 | 08 / convert `:93` | Attention needs a next action. | Conversion theatre: browser, food, "Lunch for 20?", "ASK FOR A QUOTE", inquiry bubble. Find → Land → Act → Reply | `amina-lunch-3d.webp` (CSS background) | CSS-only `--p` transforms of the theatre (`css:~325–350`) | `:107`: "5 minutes · Follow the completed fictional ad…" |
| 9 | 09 / convert `:110` | A sale is often won after the first reply. | Five-step follow list. Fictional WhatsApp inquiry with Helpful / Vague reply buttons | `amina-lunch-3d.webp` | Reply appears at p>.52 (`js:199`). Button swaps the reply text (`js:330`) | `:116`: "4 minutes · Read the fictional WhatsApp inquiry aloud…" |
| 10 | 10 / optimize `:119` | Count what helps you make the next decision. | Four metric buttons, illustrative weekly bars, decision card | Compass (`css:395`) | `is-metric-decision` (>.62) (`js:200`) | `:126`: "4 minutes · Ask: 'Would you repeat a post with many likes…'" |
| 11 | 11 / attract `:129` | Before they read, they feel the page. | Amina before / after ad. Reference links to Oryzo and House Down (`:132`) | `amina-lunch-3d.webp` | Compare (>.3), after (>.7) (`js:201–204`) | `:133`: "3 minutes · Show Amina's before and after ads…" |
| 12 | 12 / attract `:136` | The next click should make sense. | Mock site with menu / quote paths and a local quote form (sends no data) | `amina-lunch-3d.webp` | `is-interaction-outcome` (>.58) (`js:205`). Form handler (`js:331–348`) | `:141`: "3 minutes · Let a volunteer choose…" |
| 13 | 13 / attract `:144` | Show AI the standard. Keep your own identity. | Collect / Explain / Adapt. A rejected AI draft (salmon). Approved post. `<details>` AI brief. Refero link (`:150`) | `<video assets/amina-ad-motion.mp4>` (`:148`) | `--taste-compare` (.37–.5), `--taste-final` (.74–.86). Video plays only while visible (`js:177–187`) | `:151`: "3 minutes · Pause on the original AI-generated draft…" |
| 14 | 14 / tool `:154` | Put your business through the ECO lens. | Link "Preview the business scan ↗" (`:156`). Four-part report preview and illustrative 30/60/90 plan | None | `--report-finding`, `--report-plan` (`js:188–193`) | `:157`: "4 minutes · Show the four-part illustrative report preview…" |
| 15 | 15 / close `:160` | One customer. One channel. One action. One measure. | Amina's test. Tool link (`:165`). QR and public URL (`:166`) | `presentation-qr.svg` | Lines reveal at .24 / .49 / .74 (`js:194–198`) | `:167`: "3 minutes · Give everyone 40 seconds to write…" |

On the live deck, scenes 04–15 have the same headings (verified in `deckmap-log.json`). The only heading that differs is scene 03.

## 2. Slide 1: the top-left label

- **Live:** `index.html:19` (HEAD) reads `<span>GTP <b>FIELD GUIDE</b></span>`. The owner remembered it as "GPT Field Guide"; it actually says **GTP**. Rendered at 1366×768:
  - "GTP" is **11.52 px** and "FIELD GUIDE" is **8.96 px** (`styles.css:3`: `.wordmark` .72rem, `.wordmark b` .56rem).
  - Next to it, the site-bar label "SALES × MARKETING × AI" is **10.4 px**.
  - The hero kicker reads "A field guide for small-business owners" at **11.2 px**.
- **Local:** `index.html:19` reads `<span>SALES, MARKETING <b>AND AI</b></span>`.
  - Rendered at **14.4 px** ("AND AI" is 12.8 px) by the override in `scroll-experience.css:470` (`.9rem` / `.8rem`, at ≥621 px wide).
  - The hero kicker `.opening-subject` "Sales, Marketing and AI" is **30.7 px** (`scroll-experience.css:520`).
  - The site-bar label changed to "GTP · ECO WORKSHOP" (`index.html:20`).
- **On phones (≤620 px), the header label is hidden in both versions.** `scroll-experience.css:183` sets `.wordmark>span:last-child{display:none}`; it measured `display:none` at 390×844. Only the "G·" mark shows.
- **Still unchanged:** `tool/index.html:16` and `:43` still say "GTP FIELD GUIDE".

Screenshots: `D1-current-deck/live-1366-s01-open.png`, `local-1366-s01-after3s.png`, `local-390-s01-open.png`.

## 3. Slides 2 and 3: markup, copy and motion

### Slide 2: live (HEAD `index.html:38–45`)
```html
<div class="scene__eyebrow">… THE OPERATING SYSTEM</div>
<h2 id="s02-title">Growth is a loop.<br><em>Make each turn useful.</em></h2>
<div class="eco-loop" aria-label="Engage leads to Convert, which leads to Optimize">
 <button class="eco-step" data-eco="engage"><span>01 / E</span><h3>Engage</h3><p>Know who, where and what matters.</p></button><b>→</b>
 <button class="eco-step" data-eco="convert"><span>02 / C</span><h3>Convert</h3><p>Give attention a clear next step.</p></button><b>→</b>
 <button class="eco-step" data-eco="optimize"><span>03 / O</span><h3>Optimize</h3><p>Measure outcomes and adjust.</p></button></div>
<div class="scene__takeaway" id="ecoFeedback" role="status">Choose a stage to see how the loop moves.</div>
<aside class="speaker-note">Introduce ECO as a repeating decision system, not three isolated campaigns. Return to the same fictional catering business throughout.</aside>
```
Live motion:
- The three cards sit in one static row with arrows. They shift only 18–36 px with `--p` (HEAD `scroll-experience.css:16–18`).
- Inactive cards are dimmed (`opacity:.58`, HEAD css:494).
- Scroll beats change only the one-line feedback (HEAD `js:177–182`, `ecoMessages` at `js:80`).
- Nothing moves to the centre or grows. Screenshot: `live-1366-beat-02-25.png`.

### Slide 2: local (`index.html:38–45`)
Copy:
- Card one-liners:
  - Engage: "Answer a question people already ask."
  - Convert: "Show where to ask, book or buy."
  - Optimize: "Count the inquiries that became sales."
- Detail panels (`index.html:42`):
  - **All:** "ONE CUSTOMER · ONE CONTINUOUS LOOP / Notice → next step → learn. / Follow Amina's Kitchen through a question, an inquiry and a sale…"
  - **Engage:** "ENGAGE · THE CATALYST / What makes someone stop and respond? / A real question, useful answer, clear offer or striking example invites a comment, click, save or message. Amina shows a meeting lunch and answers 'How much for 20?'"
  - **Convert:** "CONVERT · THE NEXT STEP / Attention needs somewhere to go. / Offer a quote, helpful guide or newsletter. Ask for only the details needed to help, such as a name and contact route, then respond while the interest is fresh."
  - **Optimize:** "OPTIMIZE · THE LEARNING / What worked, what failed, and for whom? / Separate posts that earned reactions from those that led to qualified inquiries and sales. Ask why the successful ones worked, who responded, and what to change next."
- Feedback lines: `js:88`.

Motion:
- **Scroll:** the beat switches at p>.11 / .4 / .7 (`js:206–210`) unless the presenter has clicked.
- **Selected card:** `syncEco()` marks it `active` (`js:90–103`). It moves to the centre: 46% wide, h3 grows to `clamp(3.1rem,5vw,5.4rem)`.
- **Other two cards:** the next stage moves left and the previous one moves right, both 23% wide (`css:829–845`). Transition is .65 s cubic-bezier.
- **Detail panel:** fades up over .55 s (`css:480–481`).
- **Click:** sets `ecoManualChoice=true` and `autoHoldUntil=Infinity`, so auto-scroll stops until Next (`js:304`). Measured: no movement over 2 s after clicking Engage.
- **Phone:** the active card is stacked full-width above the other two (`css:840–844`).

Screenshot: `local-1366-s02-engage-clicked.png` shows Engage centred, Convert left, Optimize right.

### Slide 3: live (HEAD `index.html:47–53`)
- Eyebrow: `ENGAGE · WHO`, static small caps. Screenshot `live-1366-beat-03-20.png`.
- `<h2>Your ideal customer<br>is a <em>hypothesis.</em></h2>`
- Lede: "Start with the people who actually buy, inquire and come back. **Ask what job they need done before guessing demographics.**"
- Prompt: "Who were your last 10 paying customers?"
- Evidence card: assumption "Busy parents need dinner." Ten chips (OFFICE · 20 … FAMILY · 8). Pattern "6 OFFICE MEETINGS / 4 FAMILY TRAYS". Reveal button. The provisional ICP says "Likely job: feed a meeting reliably…".
- Note: "Use sales, inquiry, repeat purchase and location data if available… Demographics can help, but needs and buying context matter more."

Live motion:
- The card rotates in with `--p` (`css:19`).
- Chips sort at p>.27 and the reveal opens at p>.61 (HEAD `js:143–146`).
- The title and eyebrow are not animated.

### Slide 3: local (`index.html:47–53`)
Markup:
- Eyebrow: `<div class="scene__eyebrow icp-chapter"><span>ENGAGE</span><span class="icp-chapter__question">WITH WHO?</span></div>`, a large display font (`css:484`).
- `<h2>Who actually buys,<br><em>asks and returns?</em></h2>`

Copy:
- Lede: "Start with people who buy, ask and return. Until your records confirm it, your best customer is still a guess."
- Plain text: "Pull up your last ten sales and inquiries. What did people ask for or buy? Where did they find you? Did they come back? Write down what your records still cannot tell you."
- Prompt: "What do your last ten customers have in common?"
- Evidence card: the same ten chips. The ICP becomes "Known: occasion and group size. Unknown: who requested, approved and paid…" The "job" wording is removed.
- New `persona-route` "Build the profile from evidence.":
  - 01 CAPTURE: Orders and inquiries
  - 02 GROUP: Patterns, not guesses
  - 03 CONFIRM: Office organiser? (buyer-role hypothesis)
- Print-only blank exercise (`:51`).

Motion:
- "WITH WHO?" slides and scales in at p>.12.
- Chips re-grid into office and family rows at p>.27 (`css:495–497`).
- The order evidence reveals at p>.61 on desktop only (`js:175`).
- At p>.75 the persona route rises in 3D over a faded split (`css:485–487`, `:514`).

Screenshots: `local-1366-beat-03-20.png` (question and chips), `local-1366-beat-03-90.png` (Build the profile from evidence).

**Where the local version differs from what the owner asked:**
1. The owner said "Start with the people who actually buy, inquire and come back… That's perfect. We need to keep that there". The local version rewrote it as "Start with people who buy, ask and return."
2. The owner asked for age group, race and sex in the persona. The local note and guide say race "must not be inferred" (`index.html:52`, `presenter-guide.md:46`). This needs an owner decision.
3. The owner wanted pictures or an animated infographic instead of words. The local version uses CSS chips and bars only. It has no imagery of customers or people.

## 4. Navigation

**Live (HEAD):**
- **Next/Prev** call `go(index±1)`, which does a smooth `scrollTo` to the next scene's top. Then nothing else happens (HEAD `js:227–237`, `:242–243`).
- **No auto-scroll exists.**
- Measured at 1366×768:
  - Open: scrollY 0 at 0 s and 0 at 3 s.
  - After Next: y=2489 at 1.2 s and still 2489 at 4.2 s.
  - This is exactly the owner's "jumps and sits static".

**Local (working tree):**
- **Auto-scroll:** `autoTick` runs on requestAnimationFrame (`js:355–388`).
  - Each scene gets a time budget from `sceneMinutes=[2,3,5,5,5,5,6,5,4,4,3,3,3,4,3]`, which totals 60 min (`js:357`).
  - 65% of 85% of that budget covers 92% of the scene's scroll travel. The remaining 35% carries the following handoff.
  - It stops when the next numbered scene's top is 0.88 of the viewport down (`js:366–370`).
  - Minimum pace is 10 px/s (`js:380`).
  - Measured: open moved 10 → 83 px in 3 s. After Next it moved 2459 → 2523 px in 3 s (about 21–24 px/s).
- **Auto-scroll holds when:**
  - motion is paused (Pause scroll button, `index.html:21`, `js:294`);
  - **Notes are open** (`js:363`, `show-notes`). If the presenter keeps notes open, the deck will not move;
  - the Overview dialog is open;
  - the scene-13 prompt is open;
  - the tab is hidden;
  - reduced motion is on;
  - for 15 s after any wheel, touch or scroll key (`js:272–275`);
  - indefinitely after an ECO click (`js:304`).
- **Next/Prev:** `go()` writes `#NN`, smooth-scrolls to the scene top, then resumes auto-scroll after 650 ms (`js:255–270`, `:279–280`).
  - Next jumps **past** any connector the auto-scroll has not reached yet.
- **Keyboard:** ArrowRight/PageDown/Space scroll 75% of the viewport and ArrowLeft/PageUp scroll back (`js:287–292`). They do not jump scenes. No key is bound to "next scene".
- **Other controls:**
  - Chapter rail S/E/C/O/A/↗ jumps to scenes 1/3/8/10/11/15 (`index.html:25`, `js:286`).
  - Overview grid of 15 titles (`js:87`, `:283–285`).
  - Beat hash `#NN-PP` is written on scroll and restored on load (`js:234–253`, `:390–392`).
  - Cinema full-screen (`js:295`).

## 5. Tools that appear as plain links

The deck does **not** contain any working SEO, keyword, backlink, 30/60/90 planner, last30days, competitor or scraping tool. Wherever a "tool" appears, it is an outbound ↗ link or static text.

| What | Where | Behaviour |
|---|---|---|
| "Preview the business scan ↗" | `index.html:23` (header, every scene) | Link to `./tool/`. The scan there is disabled |
| "Preview the business scan ↗" | `index.html:156` (scene 14) | Same link |
| Typed URL text | `index.html:157` | Plain text |
| "Preview the ECO planning tool ↗" | `index.html:165` (scene 15) | Same link |
| Public deck URL | `index.html:166` | External link and QR |
| "Open motion examples ↗" / "Motion examples ↗" | `index.html:69–70` (scene 05, local only) | Opens `./motion-examples/` in a new tab |
| "Oryzo's visual concept ↗", "House Down Studio's work-to-contact path ↗" | `index.html:132` (scene 11) | External, new tab |
| "Refero style references ↗" | `index.html:150` (scene 13) | External, new tab |
| 30/60/90 plan, Search Console, keyword phrase, backlinks, SEO/AEO/GEO | `index.html:87–89` (scene 07) | Static text and roadmap buttons. No tool runs |
| Search Console, PageSpeed Insights, Rich Results Test | `presenter-guide.md:66` | Markdown links in the guide only |
| "Last 30 Days" trend skill | `presenter-guide.md:76` | One sentence of text. **Not in the deck at all** |
| Keyword ideas / 30/60/90 plan | `api/analysis.js:48–65` | Built into the unreleased scan only |

## 6. Platform logos

**No platform logo is present, animated or otherwise.**
- `index.html` contains 0 `<svg>` elements and no logo images. `assets/` holds only `amina-ad-motion.mp4`, `amina-ad-motion-poster.jpg`, `amina-lunch-3d.png/.webp` and `eco-compass.png`.
- Channels exist only as text inside the scene-04 cards: "Instagram / TikTok", "Facebook", "Google / Maps", "WhatsApp" (`index.html:59`). Selecting a card changes `aria-pressed` and one feedback sentence (`js:305–306`). Nothing "comes alive".
- **LinkedIn appears nowhere.** The grep count is 0 in `index.html`, `scroll-presentation.js`, `presenter-guide.md` and `tool/index.html`.
- Scene 05 has text labels "INSTAGRAM / FACEBOOK · FICTIONAL SAMPLE" and "GOOGLE BUSINESS / SEARCH", with no marks.

## 7. Participant tool: `tool/`, `api/`, `supabase/`

**Front end (`tool/`):**
- `tool/index.html` has a five-step flow: intake → loading → preview → delivery → done. Intake asks for name, URL, area, offer, goal and optional Instagram/Facebook/TikTok URLs. Delivery asks for name and email, with a separate unchecked marketing box and a privacy notice naming Supabase, Firecrawl, Resend and Apify (`:37`).
- The submit button is **disabled**:
  - `tool/config.js:2` sets `window.GTP_API_BASE = ''`.
  - `tool/tool.js:12` therefore disables submit and shows "The live scan is being prepared."
  - Checked live: `submitDisabled:true`, notice shown (`D1-current-deck/live-tool-1366.png`).
- It is still branded "GTP FIELD GUIDE".
- `tool/report/` and `tool/admin/` exist, minified to one line each.

**Back end, option A (Supabase Edge Function, `supabase/functions/eco-api/index.ts`, 178 lines).** This is real code, not mocked. Routes:
- `POST /v1/scans` uses Firecrawl v2 `scrape` for the homepage plus two service/menu/faq pages (`:52–65`, `:83`). It uses Firecrawl v2 `search` for two competitor candidates marked "candidate-needs-owner-confirmation" (`:67–73`).
- Optional Apify social sample (`:86`, see `api/social.js` below).
- Saves to `gtp_eco_scans`.
- `/v1/reports/request` emails a private link through Resend (`:99–123`).
- read, opt-out and delete routes (`:132–148`).
- Admin contacts behind a bearer token (`:150–157`).
- Everything is refused unless `DATA_COLLECTION_ENABLED==='true'` (`:167`) and the keys exist (`:76`, `:100`).

**Database:** `supabase/migrations/202610230001_gtp_eco.sql` creates `gtp_eco_scans`, `gtp_eco_contacts`, `gtp_eco_rate_events`, a rate-limit function and a purge function. `supabase/retention-job.sql` purges after 30 days.

**Back end, option B (Cloudflare Worker, `api/worker.js` with D1).** It mirrors the same flow. `api/wrangler.example.toml` still has `database_id = "REPLACE_WITH_D1_ID"` and `DATA_COLLECTION_ENABLED = "false"`.

**Apify (`api/social.js`).** Actors `apify~instagram-scraper`, `apify~facebook-posts-scraper` and `clockworks~tiktok-scraper`. It returns at most 3 posts, needs `APIFY_ENABLED=true`, and caps cost at `APIFY_MAX_CHARGE_USD` of $1 or less.

**Analysis logic (`api/analysis.js:27–66`).** It is rule-based only:
- Checks title, meta description, H1, contact link, JSON-LD and whether the location appears on the page.
- Adds social samples and competitor candidates.
- Produces 3 keyword ideas labelled "research hypothesis" and a fixed 30/60/90 text plan.
- **It calls no LLM or Claude.** The owner's chosen "Claude-powered web page" (owner brief line 11) is not built.
- It has no ICP scan, no brand or asset generation, no AEO/GEO citation check, no backlink data and no competitor-ad analysis.

**Tests:** `node --test api/*.test.js` gives **7/7 pass** (run today).

**Deployment:** none is verified. `experience/progress.md:3` says the protected Supabase/Resend service is "user-deferred and unverified". The Pages workflow ships `tool/` statically (`.github/workflows/pages.yml:26`).

## 8. Speaker notes

- Each scene holds one `<aside class="speaker-note">` inside its `<section>`: `index.html:35, 44, 52, 62, 71, 80, 90, 107, 116, 126, 133, 141, 151, 157, 167`. Each starts with a minute budget.
- Notes are hidden by default (`styles.css:3`, `scroll-experience.css:11`).
- **Local:**
  - The Notes button (`index.html:171`) toggles `body.show-notes`.
  - It shows a floating `#presenterNotesPanel` that JavaScript builds (`js:10–16`) and fills from the active scene's note, titled "Presenter notes · NN / 15" (`js:223–224`, `:281–282`).
  - Styled in `scroll-experience.css:506–513`. The inline note is suppressed (`:505`).
  - Measured: panel visible, inline note `display:none`.
  - **Opening Notes stops auto-scroll** (`js:363`).
- **Live:** the inline `.speaker-note` shows inside the active scene. Measured: panel absent, inline note `display:block`.
- Print hides notes in both versions (`styles.css:8`, `scroll-experience.css:14`, `:513`).
- The 14 connectors have no notes.
- The long-form run of show is a separate file, `presenter-guide.md` (60-minute table at `:24–42`), and does not appear in the deck.

Screenshots: `local-1366-notes-open.png`, `live-1366-notes-open.png`.
