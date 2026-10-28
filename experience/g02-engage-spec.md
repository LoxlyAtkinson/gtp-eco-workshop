# G02 Engage spec (G02-T01): every owner sentence, its unit and its scene

**Next action for the owner (2 min):** answer Q-FIT in section 4. Scene 06 needs 25 s more than the spine gives it. Nothing has been cut.

- Status: REVIEW. The spec is complete. The fit check fails by 25 s in scene 06, so Q-FIT is HELD for the owner (A1.6). D-SPEC-01 to D-SPEC-05 are builder decisions and stay PROVISIONAL until you accept them (A1.2).
- Source: `experience/owner-brief-2026-10-27.md`, verbatim. Sentences are quoted exactly, typos kept.
- Method: each sentence was parsed with the Sequential Thinking MCP (`mcp__sequential-thinking__sequentialthinking`), thoughts 1-10, 2026-10-27 about 21:35 SAST. The receipt is in section 6.
- Authority (A1.1): owner brief > grill answers > goal-02 + A1 > story-spine > builder.
- Scenes (story-spine §3): 03 Who (built by G01; G02 uses it), 04 Where, 05 What, 06 Make it yours, 07 Be found.

How to read a line: `[ ]` is the checklist box (ticked only against a browser capture in T17). **Must be SEEN** is the user-visible proof. **Tool** is a tool the owner named (working rule 1: never swap it).

---

## 1. Turn 1 outcomes (U09, U10, U11, U13)

| ID | Unit | Owner sentence (verbatim) | Must be SEEN | Tool | Scene |
|---|---|---|---|---|---|
| [ ] S-T1-01 | U09 | "Ultimately, we would like all of the participants that is seeing and listening and hearing me to have a clear understanding of who their customers are and where to reach them." | Who: the persona built from records. Where: the AI research infographic and the platform verdict | - | 03 + 04 |
| [ ] S-T1-02 | U09 (U12 process) | "So the presentation must answer that question and you need to run a blind adversarial agent in order to know exactly if we are achieving that goal, yes or no." | Critic O1 answers YES or NO from frozen captures only | Blind adversarial agent (fresh, never the builder) | 03 + 04 (T18) |
| [ ] S-T1-03 | U10 | "Number two, clarity on which platforms are worth focusing on for their business if we are saying Instagram, TikTok, LinkedIn, online, meaning Google etc." | A verdict naming the 2-3 platforms that fit, with Instagram, TikTok, LinkedIn and Google all named | - | 04 |
| [ ] S-T1-04 | U10 | "Why are we saying it, and is it represented, meaning do we have Facebook's logo, Instagram's logo, LinkedIn's logo, etc." | A why-it-fits reason per platform. Official logos for all 7 (G5), crisp and unmodified | Official brand-resource logos (T03) | 04 |
| [ ] S-T1-05 | U10 | "Is that in there?" | The logos are in the deck (capture of all 7, file grep) | - | 04 |
| [ ] S-T1-06 | U10 | "Is it alive?" | The logos move (burst arc T5, dial spin T6). Not a static row | GSAP skills | 04 |
| [ ] S-T1-07 | U10 | "Is whatever platform that we choose coming alive when we choose it?" | A click on ANY of the 7 tiles opens that platform's alive native view plus its why-it-fits card. "Whatever" means all 7, not only the default path | GSAP skills | 04 |
| [ ] S-T1-08 | U11 | "And then number three, I want practical ways to use AI to create marketing content quickly and consistently so, again, using your design system to scan through the company's current content to get a guideline in order to create marketing material quickly and consistently." | Current content goes in, a guideline comes out, then an on-brand asset, from a real run | Claude Design System type (T1-b) via the Artifact tool (T04c) | 06 |
| [ ] S-T1-09 | U11 | "That is number three." | Marker only. No screen content | - | - |
| [ ] S-T1-10 | U12 (process) | "Again, I need an adversarial review for each and every one of these points that I'm mentioning." | One blind critic per outcome: O1-O4, plus the slopmonster critic | Fresh agents | 03-07 (T18) |
| [ ] S-T1-11 | U13 | "I want as number four, confidence." | Critic O4 answers YES | - | 06 |
| [ ] S-T1-12 | U13 | "That the content can still sound original, sound like the person." | The "with" text matches the Amberkloof voice card (spine §1) | - | 06 |
| [ ] S-T1-13 | U13 | "For that, we've got a skill called the slop monster, which I want you to use in this presentation as well as mention the skill and give us some examples of having done something with the skill versus something without the skill, what the differences are." | Four musts: (a) used for real (T04d raw files); (b) the name "slopmonster" on screen; (c) several examples, 3 Amberkloof pairs plus the Tumelo pair, without vs with; (d) the differences marked on the text, with before and after scores | `slopmonster` (`deslop.py`, cleanse) | 06 |

## 2. Paste A topic list (U18-U22)

| ID | Unit | Owner sentence (verbatim) | Must be SEEN | Tool | Scene |
|---|---|---|---|---|---|
| [ ] S-PA-01 | U18 | "The areas that they would like to explore is knowing your customer, who you are selling to, what they care about, and where they spend their time online." | Who (03), what they care about (05 education/promotions, 06 interest themes), where (04) | - | 03, 04, 05, 06 |
| [ ] S-PA-02 | U19 | "Also choosing the right platforms, understanding where to focus." | The platform verdict card | - | 04 |
| [ ] S-PA-03 | U19 | "For example, WhatsApp, Facebook, Instagram, TikTok, Google Business, rather than trying to be everywhere." | All 5 named platforms are in the 7-logo wheel. "Rather than trying to be everywhere" is on screen, with Average = every logo with the same post copied | Official logos | 04 |
| [ ] S-PA-04 | U20, U21, U22 (+U23 out of scope) | "And then also using AI to create actual content and how to use it to create post ideas, captions, product descriptions, simple visuals, or short videos, and then how to keep your own voice in terms of branding and making AI learn that, and then also planning and consistency, using AI to put things together, also do a content plan so that marketing becomes a habit, and then turning attention into sales as well." | U20: all 5 content types shown (post ideas, captions, product descriptions, simple visuals, short videos). U21: the voice kept, and AI shown learning it from the guideline and voice card. U22: a content plan shown as a habit calendar (T04b). "Turning attention into sales" is Convert (U23, scenes 08-09, G03) | `content-strategy` (U22), `claude-video-studio` devices (U20), slopmonster + Design System (U21) | 06 (08-09 for U23) |

## 3. Paste A Engage block (U28-U43)

| ID | Unit | Owner sentence (verbatim) | Must be SEEN | Tool | Scene |
|---|---|---|---|---|---|
| [ ] E-01 | U28 | "All right, so engaging and beginning with engagement, we need to know exactly who's our ICP, who's our ideal customers, and where do we go and find them." | Who, then where, in order | - | 03, 04 |
| [ ] E-02 | U28 | "And then we need a system where we're using AI in order to go do that." | AI is a named step in who (03 AI summary) and where (04 "Ask AI" with the real customer-research output) | `customer-research` (T04a) | 03, 04 |
| [ ] E-03 | U29 | "So how I would do it is I would have a, call it a questionnaire, with a bunch of questions about my business, about my ideal customer, about who they are, creating a persona for them, and what tools I would use." | Questionnaire answers feed the persona (03) and the research prompt (04). The full questionnaire is Tool B (G06) | - | 03, 04 |
| [ ] E-04 | U30 | "I would use things like Google Scraper in order to go and check out these, if they are businesses." | A step labelled "Google scrape" (A1.10) | Google Scraper (resolved in T02: Q-GOOGLE-SCRAPER) | 05 (D-SPEC-02) |
| [ ] E-05 | U30 | "But if they're businesses, if it's a B2B, I would use Google Scraper." | The B2B path starts with the Google scrape step | Google Scraper | 05 |
| [ ] E-06 | U30 | "I would also use Appify in order to go scrape those customers and find them." | A second step labelled "Apify enrichment" returns real businesses (name, area, link) | Apify | 05 |
| [ ] E-07 | U31 | "If it is consumers, I would need to know, number one, what their persona is." | B2C persona card | - | 03 |
| [ ] E-08 | U31 | "So what is my... are they male?" | Sex field | - | 03 |
| [ ] E-09 | U31 | "Are they female?" | Sex field | - | 03 |
| [ ] E-10 | U31 | "Are they both?" | Sex field allows both | - | 03 |
| [ ] E-11 | U31 | "What's the size in terms of percentage for both?" | The sex split as a **percentage** on screen (D-SPEC-03: the spine's "mostly men" text is not enough; flagged to G01) | - | 03 |
| [ ] E-12 | U31 | "And how I would do that is I would analyze my current data." | The data table built from orders | - | 03 |
| [ ] E-13 | U31 | "So knowing your customer is normally innate an analysis of your current data and then deriving decisions from there." | Data, then groups, then decision | - | 03 |
| [ ] E-14 | U31 | "Because nobody just knows who their ideal customer is, although we think we do." | Assumption card stamped "A feeling", then cracked by the data | - | 03 |
| [ ] E-15 | U28 | "So I would go first in terms of engagement, I would go and find out exactly who." | Who comes first in Engage | - | 03 |
| [ ] E-16 | U32 | "Sorry, I would go and look at our data to see exactly who our customers are and then break that down, if it's a consumer, into male and female, age group, and as far as possible, area as well." | Persona fields: sex, age group, area | - | 03 |
| [ ] E-17 | U33 | "Then I would ask AI to research where these customers of mine live." | An "Ask AI" prompt card, then the real research answer as an animated infographic with sources and fact-check verdicts | `customer-research` + `fact-checker-loxly` (T04a) | 04 |
| [ ] E-18 | U33 | "Do they live online?" | Infographic row: share online | `customer-research` | 04 |
| [ ] E-19 | U33 | "Do they Google a lot?" | Infographic row: Google search use | `customer-research` | 04 |
| [ ] E-20 | U33 | "Do they live on Facebook, Instagram, TikTok?" | Infographic rows: Facebook, Instagram, TikTok (plus LinkedIn for the Tumelo buyer) | `customer-research` | 04 |
| [ ] E-21 | U33 | "Where do they live?" | The infographic's answer line for each persona | `customer-research` | 04 |
| [ ] E-22 | U34 | "And what am I providing to them in terms of content?" | Headline question | - | 05 |
| [ ] E-23 | U34 | "Am I providing education?" | Education side of the toggle, with an Amberkloof example | - | 05 |
| [ ] E-24 | U34 | "Am I providing promotions?" | Promotions side of the toggle, with an Amberkloof example | - | 05 |
| [ ] E-25 | U34 | "And what am I providing?" | The mix chip (education, promotions, both) | - | 05 |
| [ ] E-26 | U35 | "Normally I do suggest running, doing competitive analysis as well." | A competitor scan run in the scene | `competitor-analysis` (LIVE, G8b) | 05 |
| [ ] E-27 | U34, U35 | "So that comes into what am I providing." | A link line: the scan informs what you provide | - | 05 |
| [ ] E-28 | U28 | "So the first question would be who am I providing it to?" | Recap chip "Who → What" in the 05 header | - | 03 (recap 05) |
| [ ] E-29 | U28 | "So who am I engaging with?" | As E-28 | - | 03 |
| [ ] E-30 | U31 | "And to get that answer we do some data analytics, dive into your own data and let AI help you to do that." | AI summarising de-identified order data | - | 03 |
| [ ] E-31 | U34 | "And number two is what are they engaging with?" | 05 headline "What are they engaging with?" | - | 05 |
| [ ] E-32 | U34 | "So what are we providing them so that they can engage with us?" | Education/promotions toggle | - | 05 |
| [ ] E-33 | U35 | "And for that, again, we'll do, I would suggest doing competitive analysis on your competitors to see what they are doing, what is actually working, and then what they are doing where." | Scan output: what each competitor does, what works, on which platform | `competitor-analysis` | 05 |
| [ ] E-34 | U35 | "So I would use AI to go and find that." | The skill name and a running state on screen | `competitor-analysis` | 05 |
| [ ] E-35 | U35 | "Number one, are they on Facebook, TikTok, Instagram?" | Platform presence per competitor | `competitor-analysis` | 05 |
| [ ] E-36 | U35 | "What are they doing there?" | Activity per platform | `competitor-analysis` | 05 |
| [ ] E-37 | U35 | "What are the messages?" | Message field per competitor | `competitor-analysis` | 05 |
| [ ] E-38 | U35 | "What works and what doesn't work?" | Works and doesn't-work lists | `competitor-analysis` | 05 |
| [ ] E-39 | U35 | "And what's the recipe for that?" | Exploded recipe | `competitor-analysis` | 05 |
| [ ] E-40 | U35 | "Is it the hook?" | Recipe layer: Hook | `competitor-analysis` | 05 |
| [ ] E-41 | U35 | "Is it the body?" | Recipe layer: Body | `competitor-analysis` | 05 |
| [ ] E-42 | U35 | "Is it giveaways?" | Recipe layer: Giveaways/offer | `competitor-analysis` | 05 |
| [ ] E-43 | U35 | "What really drives engagement for the competitors?" | A "driver" line per competitor | `competitor-analysis` | 05 |
| [ ] E-44 | U36 | "And then I would also go ahead and let AI scan what the gaps are, meaning what aren't they doing that consumers can be looking for." | 3 or more gaps from the same real run | `competitor-analysis` | 05 |
| [ ] E-45 | U37 | "And both of these answers can be either whether it's for a business-to-business or a business-to-consumer company." | B2B swap: Tumelo's competitors (label printers) and the B2B find, beside the B2C run | `competitor-analysis`, Google scrape + Apify | 05 (also 04 B2B wheel) |
| [ ] E-46 | U37 | "It doesn't matter." | The words "B2B or B2C: it doesn't matter" | - | 05 |
| [ ] E-47 | U38 | "Right, so then once we know what the recipe is, we need to look at consistency." | Consistency beat | - | 06 |
| [ ] E-48 | U38 | "So we need to put everything that I have just said in a process or in an automation." | A process loop: "Every morning: brief, draft, your edit, schedule" | - | 06 |
| [ ] E-49 | U38 | "So number one, once I know what customers I have or what customers are my ICP, I would need to go and create a strategy where we are posting consistently and we are deriving what we are posting out of trends and things that are happening, as well as what my competitors are doing, so that I'm not just copying what they are doing, but I'm also actively looking for other things that we can do in order to improve engagement." | A habit week fed by a trend (Last 30 Days) and a competitor gap (05). Wording follows D-SPEC-01 | `content-strategy` (T04b), `last30days` | 06 |
| [ ] E-50 | U39 | "The where?" | Scene opener | - | 07 |
| [ ] E-51 | U39 | "For any business, I'm going to say the main place in order to drive engagement to would still be your website and Google." | Website + Google shown as the main place | - | 07 |
| [ ] E-52 | U39, U40 | "So you'll need your SEO, your AEO, and your GEO up to scratch, and then I would probably go in and dive a bit deeper into what those three things are and the reason why I would suggest that as a beginning is that most people still either go and hunt on Google and/or ask their AI or large language model, whether that be ChatGPT, Copilot, Gemini, Claude, whatever, or Perplexity, where, sorry, they ask them questions and then they trust what they bring back." | SEO, AEO, GEO each defined "a bit deeper" in a visible default beat (DD-07 ≥ 15 s, A1.6). The five assistants named. "They trust what they bring back" | - | 07 |
| [ ] E-53 | U40 | "So, and what AI does is AI cannot go into social media all by itself." | Owner's words shown unchanged (G02-Q8 HELD), with the fact-check verdict recorded internally (T04a) | `fact-checker-loxly` | 07 |
| [ ] E-54 | U40 | "So majority of the time it searches the web." | Social cards bouncing off a glass wall; AI reading the web | `fact-checker-loxly` | 07 |
| [ ] E-55 | U40 | "So we need to make sure that you are showing up." | The live AEO/GEO "who gets cited" check | `geo-citability` (LIVE) | 07 |
| [ ] E-56 | U41 | "How do you make sure in terms of a website that you are showing up?" | Question beat | - | 07 |
| [ ] E-57 | U41 | "There's only two ways to do this." | A visible "two ways" device: 1 authority/website, 2 social media | - | 07 |
| [ ] E-58 | U41 | "Number one is to become an authority in what you are doing, in your niche, in your products, or in your services, and you need to align your website to prove that you are an authority on that." | Authority beat. Good = an answer page with sources and FAQ; Average = "We are the best" homepage | - | 07 |
| [ ] E-59 | U41 | "And number two, we'll go to social media." | Way 2 card, pointing back to the 05 recipe | - | 07 (recap of 05) |
| [ ] E-60 | U41 | "Again, how do you know?" | As E-59 | - | 07 |
| [ ] E-61 | U41 | "You'll see where your competitors are doing, and doing their marketing and doing their giveaways, education pieces, and what format that is, and you will go and copy that." | Recipe fields: giveaways, education pieces, format. Wording follows D-SPEC-01 | `competitor-analysis` | 05 (+07 recap) |
| [ ] E-62 | U42 | "You also need to know what is interest." | Interest beat | - | 06 |
| [ ] E-63 | U42 | "So where does interest lie in your niche?" | The live Last 30 Days run on the niche | `last30days` (LIVE) | 06 |
| [ ] E-64 | U42 | "What are people saying about your products, services, or the field that you're in, and you want to carry that over, or at least provide an opinion or an education piece on that." | A talk/complaint theme dragged into the week as an opinion or education post idea | `last30days` | 06 |
| [ ] E-65 | U43 | "How do you do that?" | Bridge | - | 06 |
| [ ] E-66 | U43 | "There is a skill that we use called the Last 30 Days skill, which scans things like social media, Reddit, YouTube, etc. in order to give us a brief on a daily basis about what people are talking about and what people are complaining about." | Skill named on screen. Sources show social, Reddit and YouTube. Two lists: talking about, complaining about. The daily brief is a daily step in the habit calendar (A1.10) | `last30days` (LIVE, engine footer in the raw log) | 06 |

## 3b. Addendum (U70-U73, U78-U79)

| ID | Unit | Owner sentence (verbatim) | Must be SEEN | Tool | Scene |
|---|---|---|---|---|---|
| [ ] A-01 | U70 | "Sorry, just to add to the website part of it, is that you have to have a plan." | A plan beat | - | 07 |
| [ ] A-02 | U70 | "You have to have at least a 30-day to a 90-day plan of exactly what you're going to be doing on your website in terms of blogs and landing pages." | A 30/60/90 depth track with blogs AND landing pages at each stage, from a real run | `seo-plan` + `blog-calendar` (LIVE) | 07 |
| [ ] A-03 | U71 | "You also need tools that'll tell you exactly what keywords you should be ranking for, what keywords you should be targeting in order to get ranked and get found within your niche." | Keyword targets with intent and source | `competitor-keyword-decoder` (LIVE, Path B) | 07 |
| [ ] A-04 | U72 | "Not just the keywords, but you need a—you can teach AI and teach it a skill in order to check your SEO, in order to check your backlinks, your citations, your references that you are mentioning on the website, etc." | SEO findings, backlink facts, citations and references, each from its own skill (A1.5), with the skill names on screen | `seo-audit`, `backlink-analyzer`, `geo-citability` (LIVE) | 07 |
| [ ] A-05 | U72 | "And then also assist you with planning at least a 30, 60 to 90 days." | As A-02 | `seo-plan` + `blog-calendar` | 07 |
| [ ] A-06 | U73 | "And we have some of these tools available that assist us when we need it most." | The tools run in their scenes | All live skills | 05, 06, 07 |
| [ ] A-07 | U73 (+U74 done) | "These are currently like links inside the Presentation which is wrong, the original Agent misunderstood the assignment, I want you to now misunderstand it so ask me questions using the grill me skill: ..." | Zero ↗ tool links in Engage (grep). Every tool runs in-scene with a tagged cached fallback (G4, G4b, A1.4) | - | 04-07 |
| [ ] A-08 | U78, U79 | "A priority is also to Show Actual Add Examples, bring the expererience of finding the ICP, Finding your Voice, Engaging and Interacting with clients to life." | U78: 4 or more real ads in attributed official-embed cards (A1.10, G6) next to our Good vs Average pairs, plus the competitor posts the scan surfaces. U79: ICP (03), voice (06) and engaging (04, 05) as experiences, not text. Interacting is G03/G04 | Official embeds (T03) | 05, 06 (+03, G03, G04) |

### Coverage both ways
- Every unit in scope has at least one line and one scene: U09, U10, U11, U13, U18, U19, U20, U21, U22, U28, U29, U30, U31, U32, U33, U34, U35, U36, U37, U38, U39, U40, U41, U42, U43, U70, U71, U72, U73, U78, U79.
- Every line maps to an in-scope unit, with two exceptions. S-T1-10 is the U12 process, kept as a process line. The last clause of S-PA-04 is U23 (Convert), pointed to scenes 08-09.
- Lines answered by scene 03 (U28-U32 and parts of U09/U18) are built by G01 (`experience/g01-slide-spec.md`). G02 adds the questionnaire feed into 04 and the B2B find in 05.

---

## 4. Fit check (spine minutes, A1.4 and A1.6 applied)

Rules used:
- Spine `sceneMinutes`: 04 = 4 min (240 s), 05 = 5 (300 s), 06 = 6 (360 s), 07 = 6 (360 s).
- A1.6: every deep-dive beat gets a visible default beat of at least 15 s. Here that means DD-03 (B2B find), DD-06 (Tumelo slopmonster pair) and DD-07 (SEO/AEO/GEO definitions). The expanded versions stay presenter-optional.
- A1.4: a live slot shows the full result or the tagged cache by 20 ± 2 s from slot reveal. Runs may start at the chapter opener, so the cap does not have to eat stage time.
- Clicks the presenter adds beyond the default path hold auto-scroll. That time is outside the budget and is marked "optional".

### Scene 04 · Where? (240 s)
| Seconds | Beat | Lines | Live run | Interaction |
|---:|---|---|---|---|
| 0-15 | Persona chip at the hub. Headline "Where do they spend their time?" | E-01, S-PA-01 | - | - |
| 15-60 | Questionnaire answers turn into the "Ask AI" prompt. The real customer-research answer animates as an infographic (online, Google, Facebook, Instagram, TikTok, LinkedIn) with sources and verdict chips, for the Gift Planner and the Tumelo buyer | E-02, E-03, E-17-E-21, S-T1-01 | none (T04a real run, shown as research) | - |
| 60-75 | The 7 official logos burst into an arc (T5) | S-T1-04, S-T1-05, S-T1-06, S-PA-03 | - | Click to burst |
| 75-165 | Dial spin (T6). Lands on Instagram, then WhatsApp, then Google Business Profile (30 s each): alive native view + why it fits | S-T1-03, S-T1-07, S-PA-02 | - | Click any tile |
| 165-190 | B2B swap: Tumelo lands on LinkedIn and Website/Google Search | E-45 | - | B2C/B2B toggle |
| 190-215 | Verdict card names all 7 with one line of why or why-not. Good vs Average: "rather than trying to be everywhere" | S-PA-03, S-T1-03 | - | - |
| 215-240 | Room vote, then handoff (the post slides onto the 05 shelf) | - | - | Room vote |
| **240** | **Fits (0 s slack).** Facebook and TikTok alive states: about 20 s each if the presenter clicks them (optional) | | | |

### Scene 05 · What? (300 s)
| Seconds | Beat | Lines | Live run | Interaction |
|---:|---|---|---|---|
| 0-15 | Shelf. "What are they engaging with?" Recap chip "Who → What" | E-22, E-28, E-31 | - | - |
| 15-45 | Education vs promotions toggle with Amberkloof examples | E-23, E-24, E-25, E-32 | - | Toggle |
| 45-135 | LIVE competitor scan. Platform presence, activity, messages | E-26, E-27, E-33-E-37 | `competitor-analysis` (20 s cap) | Run scan |
| 135-185 | Exploded recipe: Hook, Body, Giveaways, Format, Platform. Works vs doesn't. Driver | E-38-E-43, E-61 | same run | Tap a competitor |
| 185-215 | Gap scan: 3 or more gaps. The bottle slides into the gap | E-44 | same run | - |
| 215-250 | B2B find default beat (DD-03 promoted, D-SPEC-02). Step 1 "Google scrape", step 2 "Apify enrichment", for Tumelo's prospects | E-04, E-05, E-06, E-45 | Google scrape + Apify (started at chapter opener) | Run B2B find |
| 250-285 | "B2B or B2C: it doesn't matter." "Copy what works. Then fill the gap." (D-SPEC-01). Good vs Average | E-46, E-49, E-61 | - | - |
| 285-300 | Handoff (a spotlight turns the gap into a blank canvas) | - | - | - |
| **300** | **Fits (0 s slack)** | | | |

### Scene 06 · Make it yours (360 s budget)
| Seconds | Beat | Lines | Live run | Interaction |
|---:|---|---|---|---|
| 0-15 | Blank canvas. "AI drafts fast. You make it yours." | - | - | - |
| 15-75 | Five outputs: post ideas, caption, product description, simple visual, short video | S-PA-04 (U20) | Content generation (20 s cap) | Generate |
| 75-110 | Claude Design System demo: Amberkloof's current content, then the guideline (T04c artifact), then an on-brand asset. How AI learns the voice | S-T1-08, S-PA-04 (U21) | none (T04c real run) | Step through |
| 110-125 | Claude and Claude Code named, with the one-step how-to (A1.10) | S-T1-08 | - | - |
| 125-145 | claude-video-studio: same-prompt cards (3 identical, red chips) and the Graphics/With media toggle, merged into one beat | S-PA-04 (U20) | - | Click cards, flip toggle |
| 145-165 | Five habits stepper | S-PA-04 (U20) | - | Step |
| 165-195 | 4 or more real ads in attributed embed cards next to our Good vs Average pairs | A-08 (U78) | - | Click an ad |
| 195-255 | "slopmonster" named. 3 real pairs, before/after scores, differences marked, shatter | S-T1-11, S-T1-12, S-T1-13 | none (T04d real runs) | Without/With toggle |
| 255-270 | Tumelo pair default beat (DD-06 promoted) | S-T1-13, E-45 | none | - |
| 270-345 | LIVE Last 30 Days: talking about and complaining about, with dated sources | E-62-E-66 | `last30days` (started at chapter opener) | Run |
| 345-375 | Habit week: trend → Monday education/opinion post, gap → Wednesday, promotion → Friday. Daily brief shown as a daily step (A1.10). Content plan from T04b | E-47, E-48, E-49, E-64, S-PA-04 (U22) | - | Drag a trend into the week |
| 375-385 | Handoff (Friday's card becomes a search query) | - | - | - |
| **385** | **Over by 25 s. FIT FAILS → Q-FIT (HELD)** | | | |

Compressions already applied, with no owner unit cut:
- The same-prompt cards and the With-media toggle were merged (−10 s).
- The Last 30 Days slot went from 90 s to 75 s, because the run starts at the chapter opener (−15 s).
- Before these, the layout was 410 s.

### Scene 07 · Be found (360 s)
| Seconds | Beat | Lines | Live run | Interaction |
|---:|---|---|---|---|
| 0-15 | Search bar holds Friday's query. "The where?" Website + Google = the main place | E-50, E-51 | - | - |
| 15-45 | Google, plus ChatGPT, Copilot, Gemini, Claude and Perplexity named. "They trust what they bring back." Owner's line "AI cannot go into social media all by itself", unchanged | E-52, E-53, E-54 | - | - |
| 45-75 | DD-07 default beat: SEO, AEO and GEO as one-word beats with one-line definitions | E-52 | - | - |
| 75-195 | LIVE website checks (each skill invoked separately, A1.5): keywords, SEO, backlinks, citations/references, AI citation | A-03, A-04, E-55, A-06 | `competitor-keyword-decoder`, `seo-audit`, `backlink-analyzer`, `geo-citability` (started at chapter opener) | Run website check |
| 195-225 | Two ways: 1 authority (answer page Good vs homepage Average), 2 social media (back to the 05 recipe) | E-56-E-60 | - | - |
| 225-300 | 30/60/90 depth track: blogs and landing pages at 30, 60 and 90 days | A-01, A-02, A-05 | `seo-plan` + `blog-calendar` | Tap 30/60/90 |
| 300-330 | B2B swap: Tumelo, "custom product labels Johannesburg", LinkedIn articles as authority | E-45 | - | - |
| 330-360 | Handoff (punch-through into 08) | A-07 | - | - |
| **360** | **Fits (0 s slack)** | | | |

### Totals
| Scene | Budget (s) | Needed (s) | Result |
|---|---:|---:|---|
| 04 | 240 | 240 | Fits |
| 05 | 300 | 300 | Fits |
| 06 | 360 | 385 | **+25 s, Q-FIT** |
| 07 | 360 | 360 | Fits |
| 04-07 | 1260 | 1285 | +25 s |

Each scene has no slack. If a live run returns late in rehearsal, the scene overruns. T05 and the rehearsal (G07-T19) must measure this.

### Q-FIT (HELD for the owner, A1.6)
- **Question:** Scene 06 needs 6:25, not 6:00, to keep every owner unit on the default path. Which fix do you want?
- **(A, recommended)** Scene 06 runs 6:25. The 25 s comes from the rehearsal tolerance (60:00 ± 60 s, A1.6), receipted in the spine. Risk: the DD-09, DD-11 and DD-12 default beats (45 s or more) may also need that tolerance, so G03 and G04 must fit inside their own minutes.
- **(B)** Move the claude-video-studio devices (same-prompt cards, toggle, five habits; 40 s) to scene 11's DD-11 default beat, where the spine already puts the lesson. Scene 06 becomes 345 s. This changes goal-02 T11 scope.
- **(C)** Move the 4 real ads (30 s) to scene 11's ad gallery. U78 in Engage is then met only by the competitor posts in 05. Scene 06 becomes 355 s.
- Until you answer, T05 builds the 385 s layout as provisional. Nothing is cut.

---

## 5. Builder decisions (PROVISIONAL, A1.2)

| ID | Decision | Why | Veto effect |
|---|---|---|---|
| D-SPEC-01 | No on-screen "Don't copy them." The wording is "Copy what works. Then fill the gap." | The owner says "you will go and copy that" (E-61) and "not just copying" (E-49). The spine's 05/06 copy ("Don't copy them") contradicts him, and the brief outranks the spine (A1.1). Goal-02 T09 already says "Copy what works, then look for what else consumers want" | Reword 05 and 06 |
| D-SPEC-02 | The B2B find's default beat (two labelled steps) sits in 05. DD-03's expanded version stays optional in 03 | Goal-02 T09 puts the live B2B find in 05, and goal outranks spine (A1.1). A1.6 requires a default beat of at least 15 s | Move the beat to 03 and re-time 03 (G01) |
| D-SPEC-03 | Scene 03 must show the sex split as a percentage | E-11: "What's the size in terms of percentage for both?" The spine shows "mostly men" text only | G01 owns scene 03. Flagged to G01 |
| D-SPEC-04 | All Engage live runs start at the chapter opener (allowed by A1.4) | Keeps the 20 s caps off the stage clock. Without this, 05, 06 and 07 overflow further | Each live slot needs about 20 s more stage time |
| D-SPEC-05 | Q-FIT is raised, not solved. The provisional layout is 385 s for 06 | A1.6: any cut is HELD | - |

## 6. Sequential Thinking receipt

- Tool: `mcp__sequential-thinking__sequentialthinking`, 10 thoughts (session thought history 37-46), 2026-10-27 about 21:35 SAST.
- Thought 1: scope and method; Outcome 1.
- Thought 2: Outcomes 2 and 3.
- Thought 3: Outcome 4 and the topic list.
- Thought 4: who (U28-U32).
- Thought 5: where and what (U33-U37).
- Thought 6: consistency and website (U38-U40). D-SPEC-01 was found here.
- Thought 7: authority, interest and the Addendum (U41-U43, U70-U73, U78-U79).
- Thought 8: fit check for 04, 05 and 07.
- Thought 9: fit check for 06, and Q-FIT.
- Thought 10: coverage both ways, and the decisions.

**Next action:** answer Q-FIT (A, B or C), then accept or veto D-SPEC-01 to D-SPEC-05 in `decision-register.md`.
