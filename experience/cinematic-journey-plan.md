# GTP ECO — cinematic scroll journey

Status: production storyboard, 2026-10-24. Active change contract: `experience/cinematic-scroll-contract.md`; progress: `experience/progress.md`. The audience is South African small-business owners; the presenter has 60 minutes. Amina's Kitchen is a clearly labelled fictional business whose evidence, creative and outcomes carry through the journey. The current github.io release is the older accepted deck. This plan describes the next release, not a live feature claim.

## Directing principle

The presentation is one continuous journey. A normal downward scroll advances the story **within a section** before it reveals the next. The same objects transform their meaning: an unknown customer becomes an order record, the order record becomes an ICP, the ICP becomes a channel decision, the channel becomes an ad, the ad becomes an inquiry, and the inquiry becomes a measured sale. The presenter can stop at any beat and talk; motion is tied to scroll progress, with only quiet environmental movement while the page is held. The next/previous controls jump to section starts; keyboard PageDown/arrow advances the next beat. The URL hash identifies a section and beat so a presenter can recover a position.

Use a sticky 3D stage beside readable, independently scrollable teaching text. The stage should contain original raster cutouts and HTML/CSS planes with genuine perspective, lighting and occlusion. Text and controls remain crisp DOM, not flattened into a video. A video may accent a beat, but the narrative must work if video fails or the network is offline. Never use a full-screen transition that hides the words the presenter is discussing.

## Visual grammar from the supplied references

- [Oryzo](https://oryzo.ai/): one memorable object anchors the journey; camera changes, lighting and spatial layers make the next section feel like the next chapter of the same world.
- [House Down Studios](https://housedownstudios.co.za/): restrained showreel energy, cinematic contrast, clear work-to-action route, sound only as an opt-in enhancement.
- [Refero Styles](https://styles.refero.design/): a labelled taste board for hierarchy, colour and interaction rules; no lifted assets.
- [Floating glass-panel reel](https://pin.it/9JJqfW1Yx): panels travel through depth, recompose and resolve into a clear CTA. It is a timed ad reference; the GTP equivalent will make those transformations **scroll-controlled**.
- [3D product/mobile UI reel](https://pin.it/2vF0x5b22): an isolated, realistic product escapes a phone frame, floats with believable shadow, then resolves into a product card and action. Use this mechanism with original catering products, not the referenced fashion product or artwork.
- Earlier [Instagram](https://www.instagram.com/reel/DXY10quRTFX/), [Pinterest A](https://pin.it/nLmUKwOs8) and [Pinterest B](https://pin.it/3NZhbCHeH): object-to-storefront reveal, tactile floating UI, and dark layered panels. Treat these as motion studies only.

## The continuous object and beat map

| Scene / minutes | Scroll-controlled transformation | What the audience can do / see | Presenter question |
| --- | --- | --- | --- |
| 01 Opening / 0–3 | The ECO compass approaches from darkness; three orbiting paths become the E, C and O routes. | A clear promise and a scroll cue; the first scroll opens the loop. | Where is marketing effort leaking? |
| 02 ECO / 3–6 | The orbit separates into three labelled routes; selecting one pulls its route toward the camera. The E route becomes order receipts. | Click/keyboard selects Engage, Convert or Optimize; each changes the stage and explanation. | Which part of the loop is weakest? |
| 03 Find the ICP / 6–12 | Ten receipts fan out, sort into six weekday office orders and four weekend family trays; a silhouette of the primary buyer emerges from the evidence. | Reveal and inspect the ten-order sample. Show evidence → segment → buying job → provisional ICP, with a reminder to use their own data. | Who bought, who came back, and why? |
| 04 Where to meet them / 12–16 | The ICP card moves through Search, Instagram/Facebook, TikTok and WhatsApp planes. Only the channels relevant to the buying moment remain in the foreground. | Choose a channel; see its role, effort and next step. No universal platform ranking. | Where does this buyer look when lunch is needed? |
| 05 Real ad examples / 16–22 | A 3D catered-lunch cutout rises out of a phone; the scene resolves into three **fully written original specimen ads**: vertical short-video storyboard, Instagram/Facebook feed post, and Google Business/search result. Hook, proof and CTA are highlighted one at a time. | Toggle placement and view actual headline, body, visual, CTA and destination. Clearly mark Amina's Kitchen as fictional and results as unmeasured. | What would make an office manager stop, trust and act? |
| 06 Find your voice / 22–27 | Generic copy fragments break apart; the brand brief pulls useful words together and reconstructs the ad in Amina's warm, direct voice. | Compare generic AI draft, brand rules, human edit and the final ready-to-post caption; optional silent caption-by-caption reveal. | Would your customer recognise you in this caption? |
| 07 Website rhythm / 27–33 | The final ad's CTA becomes a search query and service landing page. Page cards populate a 30/60/90-day lane as the presenter scrolls. | Select day 30, 60 or 90; inspect keyword hypothesis, page/FAQ/blog action, technical/source check and measurement. | Which page answers a buying question first? |
| 08 Turn attention into action / 33–38 | A visitor signal travels from post/search to page, quote form and response. The same visual thread remains continuous across panels. | Inspect a specific CTA, a minimal quote request and what happens after submitting. No actual participant data is sent. | What is the useful next step? |
| 09 Interact and follow up / 38–43 | A mock WhatsApp conversation and CRM lane appear; an inquiry becomes a quote, order, delivery, agreed follow-up and honest review. | Choose helpful/slow response to see the effect on journey clarity; demonstrate only a local fictional exchange. | What answer would help this customer decide? |
| 10 Optimize / 43–47 | The conversation thread bends into a metric graph, separating impressions from qualified inquiries and sales. | Select one measure; see a corresponding action for next week. All numbers explicitly illustrative. | Which signal would change your plan? |
| 11 Attract / 47–51 | Two original ad compositions are assembled in depth from image, headline, proof and CTA; one resolves into a strong readable hierarchy. | Examine attractive versus confusing composition, with real specimen creative from scene 05. External inspiration links are optional. | What catches the eye, and what creates trust? |
| 12 Interact / 51–54 | The finished ad folds into a mobile website; the product floats out of the device and back into a menu or quote path. | Use both paths; observe destination and recovery. | Can the visitor act without guessing? |
| 13 Teach AI taste / 54–56 | Reference tiles become a small set of written design rules; the rules reshape the original Amina ad while retaining its identity. | Inspect a reusable prompt and human review checklist. | Which principle will you keep, rather than copy? |
| 14 Tool handoff / 56–58 | The ECO routes converge into a report preview with evidence, gaps and a 30/60/90 plan. | Preview the tool; state clearly that live scanning and delivery are not ready. | What would you investigate next? |
| 15 Close / 58–60 | The report collapses back into the compass; four commitments lock around it. | Save QR/link; write one customer, one channel, one action, one measure. | What will you do in seven days? |

## Specimen creative to produce

All specimens use the same offer and intended buyer so participants can compare platform execution, not unrelated products. Draft offer: Johannesburg meeting lunches for office managers; quote requires date, guest count and dietary needs. No invented performance figures, delivery guarantees or testimonials.

1. **Feed ad** — original 3D catered-lunch cutout against deep green, headline “A meeting lunch everyone can say yes to.” Body: “Planning for 20? Tell us the date, headcount and dietary needs. We’ll suggest a practical lunch option.” CTA: “Ask for a quote.” Destination: fictional offer page/quote path.
2. **Vertical short-video ad** — 6–8-second scroll-scrubbable sequence: empty meeting table → product trays float in from phone → 20-person question → clear quote CTA. The video is a storyboard/CSS motion sequence until a licensed original video asset is available. ElevenLabs video generation on the connected account currently requires a paid plan; its estimate endpoint rejected video creation, so this release must not depend on ElevenLabs video.
3. **Search/Business result** — “Meeting lunches in Johannesburg | Amina's Kitchen,” practical description and a visible “Request a meeting lunch quote” action. Label as illustrative placement, not a claim that a real Google result exists.
4. **Voice lesson** — a complete generic caption and a complete edited caption, with the short brand brief and specific changes annotated. The final caption must be useful enough to post after the fictional business details are replaced.

## Motion implementation and controls

- Replace the current discrete wheel-to-next-scene behaviour with native page scroll. Each scene has a measured scroll range and sticky content; scroll progress drives CSS custom properties (`--beat`, `--depth`, `--turn`) through a single `requestAnimationFrame` writer or native scroll timelines where supported. IntersectionObserver updates chapter navigation and hash. Avoid layout work in scroll handlers.
- Use a stable camera grammar: slow approach (discover), side travel (compare), zoom through a portal (convert), pull back (measure), return to compass (close). Maintain continuity of the same object between adjacent scenes; transition at shared visual coordinates. No 15 unrelated wipes.
- Build 3D product scenes from original transparent images plus DOM planes, CSS perspective, shadow and masking. Asset variants: lunch spread, phone frame, receipt/ICP cards, search card. Keep baked text out of generated images.
- Provide a visible Motion pause/resume button for live presenting. While paused, scroll still advances readable sections; optional decorative loops stop. Respect `prefers-reduced-motion`, `visibilitychange`, reduced data and video failure. Never autoplay sound. Print presents the complete content in order with the revealed evidence and ad copy.
- Keyboard: Tab reaches every interaction; PageDown/ArrowRight advances the next beat, PageUp/ArrowLeft returns; section overview jumps to the section start; direct hashes restore a stable point. Touch scroll remains native. Clicking interaction controls must not accidentally advance the story.
- Performance budget for the published static site: only essential visible assets load up front; images compressed with intrinsic dimensions; no third-party runtime; no long main-thread animation; test 1366×768 and 390×844, 60fps target where practical, no horizontal overflow or text behind footer. Media failure leaves complete text and CTA.

## Acceptance proof for this expansion

Before release, capture scene starts and the **mid-scroll transformation** for every scene at projector and phone sizes, plus the four interactive teaching moments, representative ad placements, notes/overview, direct hash, reduced motion, motion-pause, print and failure fallback. Record observed viewport and source revision; inspect images. Give a fresh independent reviewer the frozen contract and raw browser evidence. Repair findings, then publish the same revision to github.io and verify the public journey. The protected participant tool is a separate release.
