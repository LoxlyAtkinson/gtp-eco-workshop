**Next action:** score our deck against the 15-point checklist in section 6, at 1440x900 and at 390x844 (about 45 minutes).

# oryzo.ai teardown (task S1)

- **Captured:** 2026-10-27, headless Chrome 1440x900 (real GPU, D3D11) and 390x844 (mobile emulation, SwiftShader).
- **Status of the source:** study only. The screenshots in `experience/research/s1-oryzo/` are third-party material and must never be copied into `assets/`, `tool/`, `motion-examples/` or the site root.
- **Who built it:** Lusion (the console prints "Built by Lusion"). The site is a fictional, satirical product page for an "AI-powered" cork coaster, and it works as a showreel for the studio.
- **Size of the page:** 56,691 px tall on desktop, which is 63 viewports. On mobile it is 51,317 px, or 61 viewports.

---

## 1. How it is built

| Layer | What it uses | Evidence |
|---|---|---|
| Page shell | Astro static build: one `hoisted.js` bundle of 1.1 MB and one CSS file of 69 KB | `desktop/recon.json` scripts list |
| Scroll | Lusion's own `ScrollManager`/`ScrollPane` instead of Lenis or GSAP ScrollTrigger. The wheel is normalised, scrolling eases exponentially (`wheelEaseCoeff=12`) with friction and a snap list, touch input is drag-based, ArrowUp/Down moves ±100 px, PageUp/Down moves one viewport, and the scroll-indicator bar on the right can be dragged | Strings in the bundle: `class ScrollManager`, `wheelEaseCoeff`, `addToSnapList`, `keydown` |
| Scene staging | **One full-screen WebGL `<canvas id="canvas">` with `position:fixed`.** Every section's `.section__inner` is `position:fixed` too, and `body` has its height set explicitly, so the document scroll only produces progress. Content does not actually scroll past, except in sustainability and social-content, which are sticky | `fixedEls` in `mobile/recon.json` |
| Section progress | Each section has `showRatio` (0 to 1 while it enters) and `hideRatio` (0 to 1 while it leaves), and its visibility is `t = showRatio * (1 - hideRatio)`. Every property is mapped through `math.fit(ratio, inStart, inEnd, outStart, outEnd, ease)`, for example brightness `fit(showRatio,.5,1,.3,1,cubicOut)`, zoom `fit(showRatio,0,1,.5,1,cubicOut)`, and a pop that uses `ease.backOut` | Bundle: `ThermodynamicOverlay`, `TableGripMicro` |
| 3D | three.js r178 "modified by Lusion" (`window.__THREE__`). Meshes are custom binary `.buf` files, and camera, coaster-flip and hand moves are baked animation tracks (`CAMERA_ANIM.buf`, `COASTER_FLIP_ANIM.buf`, `hand_animation.buf`) | `desktop/network.json` |
| Photoreal props | Gaussian splats (`props.sog` 3.1 MB, `table_reflection.sog`) sorted by a wasm worker | `SplatsWorker`, `splat_sorter_bg.wasm` |
| Light | Environment maps per scene (`env_hero`, `env_hand`, `env_table`), a BRDF LUT, baked spherical-harmonics textures, **gobo textures** (projected window and leaf shadows, 214 references in the bundle), SMAA, bloom, vignette and noise | network and bundle counts |
| Type | Typekit fonts `halyard-display-variable` and `halyard-text-variable`, Google `Literata` (serif, used for the magazine cover) and `DM Mono` (data). GSAP **SplitText** is bundled for line and character reveals. MSDF text (`Inter.webp/json`) renders inside WebGL | `fonts` in recon; bundle `SplitText.register(window.gsap)` |
| 2D animation | Rive (`oryzo.riv` with `@rive-app/canvas@2.37.0`) for the sustainability illustrations | canvas ids `sustainability-rive-canvas-*` |
| Video | A Vimeo brand film behind the hero "PLAY" card, plus two muted looping MP4s in the wearable gallery (`yoga.mp4` 3.9 MB, `bite.mp4` 2.6 MB). The MP4s have `autoplay=false`, so JavaScript plays them only while they are in view | `videos` in recon |
| Mobile | Separate `_MOBILE` textures and meshes, the `is-mobile` class, a re-composed layout and `DeviceOrientationControls` for tilt | network list in `mobile/network.json` |
| Weight | 216 requests and about 29 MB declared on desktop: 12.9 MB MP4, 6.6 MB WebP, 3.6 MB meshes and 3.6 MB splats | `desktop/network.json` |
| Reduced motion | **None.** `prefers-reduced-motion` appears 0 times in the CSS and 0 times in the JS. With `reducedMotion:'reduce'` emulated, the page behaves the same as without it | `probe/reduced-hero.png`, `probe/reduced-y900.png` |

---

## 2. Scene-by-scene journey map (desktop, measured section ranges)

"Screens" means viewport-heights of scroll. The screenshot names refer to `desktop/scroll-NN-yPIXELS.png` and `mobile/scroll-NN-...png`.

| # | Scene (section id, screens) | Enter | Hold and evolve | Exit and handoff |
|---|---|---|---|---|
| 0 | **Preloader** | A flat green field the same colour as the hero's cutting mat. An orange vector drawing of the coaster (circles, Bézier handles, guide lines, like Illustrator) grows from the centre | Progress is a **pie-sector fill sweeping round the ring** | The drawing dissolves into the photoreal render **at exactly the same position and size**. The loader is the product's sketch, and the hero is the finished product (`sheet-mobile-load.png`) |
| 1 | **Hero** (`hero`, 1) | A top-down photoreal desk: green cutting mat, pencil, craft knife, paperclip, and the coaster in the centre | Giant "ORYZO" wordmark, eyebrow "MADE FOR MUGS. BUILT FOR TABLES.", body copy beside the object, a frosted card "DESIGNED BY LUSION", a video card with a PLAY button, a vertical tab "ORYZO-1 MODEL" and a "SCROLL TO CONTINUE" cue | About 3 wheel ticks (about 360 px) make **the whole set drop away to warm black while the coaster stays locked in place.** The credit text scrambles out character by character (`seq-desktop-0.png` f00 to f04) |
| 2 | **"Isn't just a coaster" into "Powered by AI\*"** (`ai`, 8) | The heading on the left and the paragraph on the right flank the object | The coaster turns edge-on in 3D (`scroll-02`), the copy dims, then **a hand rises from below holding the coaster. It has six fingers.** "Powered by AI\*" appears at 123 px with an orange "ORYZO-1" tag, and the footnote says "\*Adobe Illustrator". A **rainbow edge glow** like Apple Intelligence surrounds the viewport, and its hue drifts. "TRY TO HOVER HAND" invites interaction (`probe/hand-*.png`) | The glow and heading fade and the hand sinks. The coaster continues alone into the next scene |
| 3 | **"So portable, it's wearable"** (`wearable`, 13.25, the longest) | The coaster appears inside a **dashed spec frame with crosshair ticks**, wrapped in an ORYZO-branded condom wrapper | **Giant type ("it's wearable") travels sideways *behind* the framed product** (`seq-desktop-15.png`) while the wrapper tears open frame by frame. The frame becomes a portrait photo card, then **a horizontal gallery driven by vertical scroll**: the centred card is large and lit, the neighbours are small and dim. It mixes photos with muted MP4 loops (yoga with a "WARNING" bar, bite, bikini, eye patch, hat, pocket) | The last card is a fake **"RISE" magazine cover**. The camera pushes into its cover photo, **and that photo becomes the next full-bleed 3D scene** |
| 4 | **Features** (`features`, 10.5) | A photoreal desk scene (pegboard, keyboard, gamepad, takeaway cup on the coaster) grows from an inset frame to full bleed | A **frosted-glass side panel slides in** (icon, eyebrow, body copy) with a headline at the bottom left, "ELEVATE YOUR COFFEE EXPERIENCE", and a mock formula "Δh ≈ t". **The same scene then switches lens to a thermal camera** (a gradient-map shader goes purple, orange, yellow), and a temperature scale reads "CREATIVE T=10 / BALANCED T=1 / DETERMINISTIC T=0.1", a joke about LLM temperature, under "THERMODYNAMIC STABILITY". Then the scene goes dark into an **orange blueprint sketch**: "NOW 37.9% MORE CIRCULAR" | The blueprint circles become the **O's of a giant outlined "ORYZO" with construction handles** (`scroll-20`), which shrinks to a small centred wordmark (`scroll-21`). This calls back to the preloader |
| 5 | **Smart flip encryption** (`encryption`, 4) | Back to the photoreal desk, now in perspective | "SMART FLIP ENCRYPTION" with a "DECODE MESSAGE" pill. **The coaster flips** on a baked animation and shows its engraved underside, and its shadow moves with it (`seq-desktop-55.png`) | The camera dives into an extreme macro of the cork (`scroll-24`) |
| 6 | **Grip** (`grip`, 4) | A greyscale macro: cork on a tiled floor | "GRIP-LOCKED ANTISLIP TECHNOLOGY" with a card reading "FRICTION COEFFICIENT (EST): 0.80" over a microscope texture, a drag-hand affordance, and a water-bear (tardigrade) Easter egg | The camera travels into 3D bark. **A glowing horizontal crack opens** (`scroll-26/27`) |
| 7 | **Sustainability** (`sustainability`, 5.66) | Through the crack into dark brown with the giant word "sustainability" at 216 px | **The section inverts from dark to cream**, with dappled leaf shadows from a gobo (`scroll-29`). Stat cards follow: age of first harvest, a harvesting interval drawn as a Rive tree-ring animation, and power draw | Cream fades back to dark |
| 8 | **Testimonies** (`testimonies`, 2.5) | "People all around the world love Oryzo" | **The persistent coaster returns to the centre and tilts from top-down to three-quarter view** as the review rows scroll. The row in focus is bright and the others are dimmed to about 35%. Quotes have orange keyword highlights and thumbnails, for example an astronaut (`seq-desktop-75.png`) | The rows scroll off |
| 9 | **Social content** (`social-content`, 8.5) | Horizontal filmstrip | Full-height posters with giant overlay words: "Runs on the edge, refuses the cloud", "Always On", "Runs on RTX 3090", "Drop-Tested", "Legacy Support". **Objects occlude the type**: a mug stands in front of "RTX 3090" | The filmstrip ends |
| 10 | **Product** (`product`, 3.2) | "CHOOSE YOUR OWN ORYZO": a giant wordmark **behind** the coaster | Pill tabs ORYZO / PRO / PRO MAX (the selected pill glows orange), the 3D product in the centre with bullets, a three-column comparison and "STACK: 1/2/3" | Into the model card |
| 11 | **Open-weight** (`open-weight`, 1.2) | A parody of an AI model card: "ORYZO-1", buttons for Paper and Model (.OBJ), an abstract and a BibTeX block in DM Mono | n/a | The payoff |
| 12 | **Footer** (1.1) | "WE CAUGHT YOUR ATTENTION WITH A NON-EXISTENT PRODUCT. IF WE CAN SELL A COASTER, IMAGINE WHAT WE CAN DO FOR YOUR BRAND." | 3D coffee beans, a big "L" mark, links with a letter-roll hover, copy-URL and newsletter | End |

**Pacing:** holds are long and transitions are short. The 13 + 10.5 + 8 + 8.5 screens of the four biggest chapters take up 63% of the scroll. The hero dropping away to black completes within about 360 px of wheel input. The smoothing keeps the scene settling for about 0.6 to 0.9 s after input stops (`seq-desktop-75.png`: f06 to f09 still change).

---

## 3. Signature moves, ranked by impact

1. **One protagonist object for the whole journey.** One fixed canvas holds one coaster that moves through desk, void, six-fingered hand, wrapper, cup, flip, macro, testimonials and product picker. Its context changes and the object stays. That continuity is the main reason the page feels like one shot instead of a stack of slides.
2. **Scroll scrubs a camera inside a lit world.** Scenes are baked camera clips through photoreal sets with real light: gobos, depth of field, reflections. Scrolling moves through space instead of past rectangles.
3. **Every scene ends on a payoff.** Each beat lands one joke, and a visual transformation delivers it: six fingers, the AI glow, the wrapper, temperature as an LLM pun, "37.9% more circular", RTX 3090, the BibTeX card. The next reveal is the reward for scrolling.
4. **Exits are entries (a shared element at every seam).** Loader sketch into render, magazine photo into scene, blueprint circles into wordmark, macro into bark crack into sustainability. You never see a blank gap between sections.
5. **Giant type interacts with objects in depth.** Words pass behind the product frame, a mug stands in front of "RTX 3090", and the wordmark sits behind the product. Type becomes part of the set instead of a caption above it.
6. **The same set seen through a new lens.** The features desk is shown normally, then in thermal, then as a blueprint. This explains three ideas with one environment and costs far less than three new scenes.
7. **Diegetic spec-sheet interface.** Dashed frames, crosshair ticks, model numbers ("ORYZO-1"), mock formulas, coefficient readouts, all-caps eyebrows and mono data. The interface looks like part of the product universe.
8. **A light rhythm marks the chapters.** Warm black is the base, with cream inversion (sustainability), thermal neon (features) and a greyscale macro (grip) as accents. You can tell where you are by colour alone.
9. **Explicit invitations to interact.** "Try to hover hand", "Decode message", a drag affordance, a draggable scroll bar, product pills and letter-roll links.
10. **A preloader that previews the story.** The construction drawing is registered exactly onto the hero render, so the loading wait is already part of the show.

---

## 4. Motion grammar (enter, hold, evolve, exit, handoff)

| Phase | Rule observed | Numbers |
|---|---|---|
| **Enter** | Something that is already on screen (usually the protagonist) stays put while the environment changes around it. New copy comes in as split lines or characters (SplitText) that fade and rise, or scrambles in | Copy reveals take about 300 to 500 ms after the smoothing settles |
| **Hold** | Pinned, but never frozen. Something always keeps changing: slow object rotation, light drift, hue drift on the glow, a video loop, or a gallery sliding | Holds last 2 to 13 viewports |
| **Evolve** | Inside a hold, a scrubbed state change: a camera clip, a lens or shader switch, the wrapper tearing, a gallery index, a row of focus | Driven by `fit(ratio, a, b, from, to, ease)` sub-ranges, with `cubicOut` most common and `backOut` for pops |
| **Exit** | Copy dims to about 30% before the scene leaves (it stays visible but quiet). The background drops to black or scales away | `t = showRatio * (1 - hideRatio)` crossfades two scenes at once. There is no dead frame |
| **Handoff** | A shared element or a zoom-through: the next scene is already composited, and the outgoing scene's focal element grows into it | Transitions take at most about 0.5 to 1 viewport of scroll |
| **Feel** | Exponential smoothing on the wheel (coefficient 12, which is about lerp 0.18 per frame at 60 fps), friction, and a snap list | Settles in about 0.6 to 0.9 s |

---

## 5. 3D and product-visual approach, and what we can reuse

- **Real-time 3D only where the object must turn.** The protagonist and hand are real meshes with baked lighting (spherical harmonics plus env maps). Props come from Gaussian splats. Backgrounds are high-resolution textures. **Takeaway: the product looks expensive because of its lighting, not its polygon count.**
- **The product is always lit like a photograph:** a warm key light, soft contact shadows, gobo patterns of window and leaf shadow, shallow depth of field on the set, bloom and grain.
- **A material vocabulary that stays consistent:** cork, paper, cutting mat, wood, ceramic. Warm and tactile throughout.
- **Floating hero over a void.** When the set drops away, the product floats on warm black with a radial warm glow from the bottom left (`scroll-01`, `scroll-21`). Reference R5 in the owner brief asks for exactly this look ("floating products").
- **Our static-site equivalent (no WebGL needed):** a pre-rendered hero object (Higgsfield 3D, `generate_3d`, or an AI render with transparency), exported as (a) a 36 to 72 frame turntable image sequence for the rotation and (b) separate transparent PNG planes for the background, mid-ground and object, so they can have depth parallax. Video scrubbing should be used only for camera moves.

---

## 6. "Good looks like": checklist to judge our deck

Score each item pass or fail at 1440x900 and 390x844, using a scroll walk in 10% steps plus a burst at every scene boundary.

1. **Persistent protagonist:** each chapter (ECO, AI) has one hero visual that is on screen in at least 60% of its 10%-step frames and transforms (moves, scales, re-lights, changes context) instead of being swapped.
2. **Never static:** in every pinned scene, scrolling 10% of a viewport changes at least one visible property. The pixel difference between frame y and y+0.1vh must be non-zero in every scene.
3. **No dead seams:** at every section boundary, the frames at ±0.25vh contain elements from both scenes, and no frame shows more than 50% empty background.
4. **Shared-element handoffs:** at least 70% of scene boundaries use a shared element, a zoom-through or a continuous camera move instead of a hard cut.
5. **Hold-to-transition ratio:** each scene holds for at least twice as long as its transition, and every transition completes within 1 viewport of scroll.
6. **One payoff per scene:** each scene's last frame shows something its first frame did not (a number, a reveal, a transformation, a punchline). Write the payoff down for every scene, and treat a blank as a fail.
7. **Type drama:** each chapter has at least one display word of 120 px or more at 1440 wide, with a display-to-body size ratio of at least 6:1. The whole scale comes from one fluid unit (Oryzo uses `--screen-unit`).
8. **Type in depth:** in at least 3 scenes, display type sits behind an object that partly hides it.
9. **Disciplined palette:** a warm near-black, a warm cream, one accent, and per-scene light colour only. Body text contrast must be at least 4.5:1.
10. **Diegetic chrome:** eyebrows, frames, labels and data readouts use one consistent system (caps eyebrow, mono for numbers) in every scene.
11. **Invitation to interact:** each chapter offers at least one explicit "try this" (hover, tap, drag, reveal) that responds visibly within 100 ms.
12. **Chapter colour rhythm:** the contact sheet shows a visible light, dark or colour-temperature shift at each chapter boundary (Engage, Convert, Optimize, Attract, Interact).
13. **Media mix:** no more than 2 consecutive scenes use the same media type (render, photo, video, diagram).
14. **Fast and smooth:** the first real scene is visible in 3 s or less on the presenter laptop, there is no long task over 50 ms while scrubbing (performance trace), and the full scroll stays near 60 fps.
15. **Reduced motion and phone layout:** with `prefers-reduced-motion: reduce`, every scene shows its complete end state with simple crossfades. At 390 wide the layout is re-composed (object centred, copy panel at the bottom, text 14 px or larger) rather than a scaled-down desktop. **Oryzo fails the reduced-motion half of this item, so it is where we can beat it.**

---

## 7. Re-creating each move with GSAP ScrollTrigger in a static site

Each move must be built from original assets. The time estimates are for one scene with the assets already in hand.

1. **Protagonist on a fixed stage (about 2 h).** Put a `position:fixed` `.stage` layer outside the sections that holds the hero element (an image sequence on a `<canvas>`, or layered PNGs). Drive it with one master timeline that has a label per scene, `ScrollTrigger.create({trigger:'#deck', start:'top top', end:'bottom bottom', scrub:0.6, animation:master})`. Use **Flip** (`Flip.fit(hero, slotEl, {scale:true})` inside the timeline) when it has to land in a card or frame.
2. **Camera moves (about 3 h per scene).** Scrub an image sequence: `gsap.to(seq,{frame:N-1, snap:'frame', ease:'none', scrollTrigger:{trigger:scene, pin:true, end:'+=300%', scrub:0.5}, onUpdate:draw})`. If you use video instead, encode with every frame as a keyframe (`-g 1`) and set `video.currentTime` from progress.
3. **The showRatio/hideRatio model (about 1 h, then reused).** Give every scene `ScrollTrigger`s for enter (`start:'top bottom', end:'top top'`) and leave (`start:'bottom bottom', end:'bottom top'`), and set `t = show * (1 - hide)`. Map with a helper: `fit=(v,a,b,c,d,e=gsap.parseEase('power2.out'))=>c+(d-c)*e(gsap.utils.clamp(0,1,(v-a)/(b-a)))`.
4. **Payoff beats and snapping (about 30 min).** Add `master.addLabel('payoff-eco-1')` and `scrollTrigger.snap:{snapTo:'labelsDirectional', duration:{min:.3,max:.8}, ease:'power2.inOut'}` so a presenter's scroll lands on each beat.
5. **Type behind the object (about 1 h).** Stack three layers: background, giant type, transparent cut-out of the object. Scrub the type with `xPercent:-60` while the object holds. For the "frame occludes the type" variant, put the framed card on the top layer.
6. **Zoom-through handoff (about 1.5 h).** Scale the outgoing focal element (`scale:6, transformOrigin:` focal point) while the incoming scene, which uses the same image, goes from `clip-path:inset(30% 35%)` to `inset(0%)` over the last 0.5vh. Or scrub a Flip from a card rect to full-bleed.
7. **Lens switch on the same set (about 1 h).** Make a second graded version of the scene (thermal or blueprint) as an image, or use an SVG `feColorMatrix`/gradient map, and reveal it with scrubbed `clip-path:inset(0 100% 0 0)` going to `inset(0)`.
8. **Blueprint construction (about 1 h).** Draw SVG strokes with **DrawSVG** (free from GSAP 3.13), with the handle dots stagger-scaling in through `ease:'back.out(2)'`. Reuse the same circle as the preloader and as a section transition.
9. **Frosted panels (about 30 min).** Use `backdrop-filter: blur(24px) saturate(1.2)` on a translucent warm fill, scrubbed `xPercent:-100` to `0`, with SplitText lines staggered at 0.06.
10. **Dark-to-light inversion (about 30 min).** Scrub CSS custom properties `--bg` and `--fg` on `:root` from a ScrollTrigger (`gsap.to(':root',{'--bg':'#f6e8d6', scrollTrigger:{scrub:true}})`), with a leaf-shadow gobo PNG at `mix-blend-mode:multiply`.
11. **Horizontal gallery with a focus card (about 2 h).** Pin the section and tween the track `x: -(track.scrollWidth - innerWidth)`. Per-card ScrollTriggers with `containerAnimation` scale the centred card to 1 and set opacity 1, and the rest go to 0.8 and 0.4. Play videos with `onToggle` and pause them otherwise.
12. **Spotlight list (about 45 min).** Give each row `ScrollTrigger({start:'center 60%', end:'center 40%', toggleClass:'is-focus'})` and set unfocused rows to opacity 0.35.
13. **Edge glow (about 45 min).** Use a fixed overlay with an `inset` box-shadow from a conic gradient (mask) and animate `--hue` with `gsap.to({}, {repeat:-1})`. On `pointermove`, nudge the hue so the glow answers the visitor.
14. **Letter-roll links (about 30 min).** Split the chars with SplitText, add a stacked duplicate in an `overflow:clip` wrapper, and on hover animate `yPercent:-100, stagger:0.015, duration:0.35, ease:'power3.out'`.
15. **Smooth scroll feel (about 15 min).** Use **ScrollSmoother** (free from GSAP 3.13, `smooth:1`) or Lenis with `lerp:0.15–0.18`, which matches Oryzo's coefficient-12 smoothing, and keep arrow and PageDown keys working.
16. **Reduced motion (about 1 h, mandatory).** Use `gsap.matchMedia()` with `'(prefers-reduced-motion: reduce)'`. Do not create scrub timelines. Set every scene to its end state, keep 200 ms opacity crossfades between scenes, show the first frame of each image sequence, and pause the videos (with a play button).

---

## 8. Why it feels like an experience rather than a document

- The viewport is a stage and scroll is time. The content holds still while the world changes around it.
- One character (the object) is followed through every chapter, which gives the page a story spine.
- Each scroll pays off with a reveal and a joke, so curiosity pulls you forward.
- The interface belongs to the fiction: spec frames, formulas and model cards.
- Long, living holds and quick, seamless transitions, with no dead frames.
- Physical light and materials make every frame look photographed.
- Invitations to touch it: hover, decode, drag.
- It commits to one premise from the loader to the footer, and ends with a self-aware call to action that reframes everything you just saw.

**Where we can beat it:** it has no reduced-motion support, the page weighs about 29 MB, much of its copy lives in WebGL or is hidden from `innerText` (weak for accessibility), and it is 63 viewports long, which is too long for a live workshop without chapter jumps. Our deck needs chapter navigation and snap beats for the presenter.

---

## 9. Evidence index (internal, not for publishing)

- **Root:** `experience/research/s1-oryzo/`
- **Desktop scroll walk:** 41 states, `desktop/scroll-00-y0.png` to `scroll-40-y54591.png` (2.5% steps). Contact sheets `sheet-desktop-a.png` to `sheet-desktop-d.png`.
- **Mobile scroll walk:** 41 states, `mobile/scroll-00-y0.png` to `scroll-40-y50473.png`. Contact sheets `sheet-mobile-a.png`, `sheet-mobile-b.png`, `sheet-mobile-c.png`.
- **Preloader:** `sheet-mobile-load.png` (frames at 0.6, 5.8, 8.8, 12.4, 16.1, 18.4 and 24.7 s under software GL) and `sheet-desktop-load.png`.
- **Motion bursts:** 10 frames each from 0, 15, 35, 55 and 75% of the page. The interval is a 150 ms sleep plus the time to take the screenshot. Files: `seq-desktop-0.png`, `-15`, `-35`, `-55`, `-75`.
- **Interaction probes:** hand hover `sheet-hand.png`, reduced motion `sheet-reduced.png`, plus `probe/encrypt-00.png`, `probe/nav-hover-*.png`, `probe/footer-*.png` and `probe/footer-link.html.txt` (the letter-roll DOM).
- **Data:** `desktop/recon.json` and `mobile/recon.json` (libraries, canvases, fixed elements, fonts, `:root` tokens, type samples, sections), `*/network.json`, `*/states.json` and `*/console.txt`.

**Colour tokens** (from `:root`):

| Token | Value |
|---|---|
| cream | `#ffedd7` |
| near-black | `#100904` |
| grey-brown | `#6c5f51` |
| green | `#445231` |
| light green | `#5d6c49` |
| lightest green | `#f6e0c6` |
| orange accent | `#dc5000` |
| brown | `#382416` |

**Type scale:** `--screen-unit = min(innerWidth/1800, vh*1.25/1024)`.

| Role | Size in units |
|---|---|
| h1 | 164 |
| h2 | 68 |
| h3 | 45 |
| h4 | 32 |
| body1 | 38 |
| body2 | 24 |
| body3 | 18 |

The layout is a 16-column grid with a side padding of 3.125vw.

**Next action:** run the section 6 checklist on our current deck at 1440 and 390 and log each pass or fail with a screenshot path in `experience/progress.md` (about 45 minutes).
