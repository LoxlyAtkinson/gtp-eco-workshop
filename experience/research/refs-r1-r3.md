# R1 to R3 teardown: what "good" and "average" look like

**Next action:** build the scene 04 platform wheel (technique T5 + T6 below, about 3 hours). It meets the owner's direct ask that the chosen platform "comes alive", and the other techniques reuse its arc and dial code.

Internal research only. `experience/` is not published. Every frame and screenshot named here sits in `experience/research/refs-r1-r3/` and is there for study only. Never copy third-party frames, logos or footage into `assets/`, `tool/`, `motion-examples/` or the root. Re-create each technique with original assets.

How it was examined (2026-10-27): each page was loaded in a headless Chromium 1248 (playwright-core 1.56.1), desktop UA at 1366x900 and iPhone UA at 390x844. Media came out of the page HTML and network (Pinterest) or yt-dlp (Instagram). ffmpeg pulled frames at 2 fps for the whole clip, then 5 to 10 fps around each transition. Every frame described below was viewed. Audio was **not heard**: anything said about sound comes only from an RMS loudness envelope and is marked INFERRED.

---

## 1. Summary for the deck

| Ref | What it is | Good looks like | Average looks like | Best home in the journey |
|---|---|---|---|---|
| R1 | 11 s product reel: the products of a furniture shop float out of a phone screen in a warm studio, then a hard cut to a flat white coupon card | 8 seconds of one unbroken slow camera move. Real products leave the screen and hang in 3D space, with depth of field, in a palette that matches the product (wood, cream, window light) | The last 3 seconds. A hard cut to a motionless white card in default type ("WEBSEITE / GUTSCHEINCODE / WELCOME5"). The call to action is dumped after the magic ends, and the AI-garbled UI labels went out unchecked | **Attract** (scene 11) as the main Good vs Average exhibit. **Convert** (scene 08) as the "CTA inside the world vs CTA bolted on" lesson. **Engage/ICP** (scene 03) for the screen-to-world data cards |
| R2 | 10 s loop: a real hand on a real mouse. Each click bursts an arc of 3D app icons out of the mouse, then spins the arc like a dial into the next set | One physical action gives one visual payoff, every time: cause, effect, settle, repeat. Real footage with a CG composite. It needs no words | No message, no brand, no CTA. It is a mood loop. It is also built on other companies' trademarks (Adobe and others) and reposted without clear authorship | **Engage/where** (scene 04): click to spin the platform wheel and the chosen platform comes alive. **Interact** (scene 12): the "every click must pay off" principle. **AI content** (scene 06): a tools wheel |
| R3 | 20 s agency ad: electric line, glass browser, shatter, data tunnel, floating glass panels, an orbit around a core, a hologram pedestal, a logo lock-up | The story is told **through the transitions**. "We DON'T JUST BUILD WEBSITES" shatters to reveal "WE BUILD DIGITAL BUSINESSES". Every cut is motivated by the copy. One word per beat. The camera never stops | It is the default AI "tech blue hyperspace" look. It lists capabilities (Websites, Apps, Marketing, Software) instead of a customer benefit. It ends with no URL or contact, the energy never drops, and the UI text is garbled | **Section transitions everywhere** (shatter, punch-through, orbit-to-core). **ECO loop** (scene 02). **AI-content Good vs Average** (scene 06, as a shatter). **Show AI the standard** (scene 13: the cautionary "what generic AI gives you" exhibit). **Tool reveal** (scene 14, on the hologram pedestal) |

The one-line teaching point across all three: **good = one continuous, motivated motion where the message rides the movement; average = the motion stops and the message gets pasted on.**

---

## 2. R1: Instagram reel `DXY10quRTFX`

### Source and attribution
- URL: https://www.instagram.com/reel/DXY10quRTFX/
- Account: **@iananaseu**, display name "iAnanas - Ethisch handgefertigte Produkte" (a German handcrafted wood-furniture shop, iananas.de).
- Audio label shown on the page: "Portiz Music • Order Now".
- Posted 2026-04-21 (27 weeks ago at capture). **13 likes, 1 comment.** It is a low-reach post: the craft is good, the distribution is not.
- Caption in German: "From raw wood to refined craftsmanship..." plus hashtags and a bracketed keyword list (SEO-stuffed caption).
- The 3D/video creator is **not credited**. INFERRED as AI-generated: the in-screen UI has garbled labels ("Bar futchure", "Wall thalves", "Wall tablees"), and the furniture geometry shifts slightly between frames.
- Technical: 720x1280, 24 fps, 10.96 s, H.264 + AAC. Scene-change detector found **one cut, at 7.958 s**.

### Frame by frame
| Time | What is on screen | Motion and transition |
|---|---|---|
| 0.0 s (hook) | It opens mid-action with no fade-in. A cream-bezel smartphone floats at about 15 degrees in three-quarter view, left of centre, with a soft contact shadow on the floor. The screen shows the shop's category grid (bar furniture, side tables, wall decoration, wall shelves, a carved folding screen). The **products are already out of the screen**: a carved octagonal side table hangs left, a wavy wooden wine rack upper right, a floating shelf with turned bowls mid-right, and a floral metal wall panel cuts diagonally across the lower-right bezel. Small white "product tile" cards hang in front of and behind the phone, heavily blurred (depth of field). | The hook is the impossible object: things leave a screen. There is no text overlay. |
| 0.5 to 4.0 s | Warm beige seamless studio. Raking window light throws soft diagonal shadow bars across the back wall. More furniture drifts in from the frame edges (a dresser top left, a cabinet right, stools lower right). | One slow camera move: a **truck/orbit to the right with a slight push-in**. The phone turns toward frontal. Each object rotates on its own axis at its own slow speed, which gives true parallax. **The scene fills up over time**, so it escalates without a cut. |
| 4.0 to 7.9 s | The phone is now near-frontal and centred. The wine rack drifts up across the top of the screen and over the logo. A carved console table and two stools tumble at right. The wall panel slides out to the left edge. | Objects overlap the bezel and break the frame. The thumbnails stay on the screen while their "real" versions float in front, which reads as **screen-to-world**. |
| 7.958 s | **Hard cut** to a pure white, motionless end card: house-outline logo "iAnanas" at the top; a rounded white card with a hard offset drop shadow (neo-brutalist) holding black label chips "WEBSEITE" over `HTTP://IANANAS.DE/` and "GUTSCHEINCODE" over `WELCOME5 (5% RABATT)`; bottom line "VERSAND NOCH AM SELBEN TAG PER DHL" (same-day DHL shipping) in condensed uppercase. | No motion at all for the last 3 s. The cinematic world is gone. |

- **Typography:** none over the 3D section. The end card uses condensed grotesque uppercase for the shipping line and a small sans in the chips. The URL is set in uppercase with "HTTP://", which looks dated.
- **Colour:** warm neutrals (cream #F3EBE2 range, sand, tan), wood browns, small accents from the floral panel. The palette is **derived from the product material**, which is why it feels premium.
- **3D:** photoreal product renders, a physically plausible studio, soft global illumination, contact shadow, foreground and background blur.
- **How attention is held:** a continuous move with no cut for 8 s, rising object density, a slow-motion drift (nothing resolves, so the eye keeps tracking), and a moving focal point (a different product crosses the screen every second or so).
- **Audio (INFERRED):** loudness is flat at about -15 to -17 dB RMS for the full 11 s with no dips, so it is a continuous music bed with no detectable voice-over or hit on the cut.

### Why it is good, and where it turns average
- **Good:** the product is the hero and the hook at frame 0. The "shop on your phone becomes real objects" metaphor sells online buying of a physical product without a word. The camera never stops. The palette and light belong to the brand material.
- **Average:** the CTA arrives only after the spectacle, as a flat white slide. Nothing says what the shop is or why it matters during the 8 s people actually watch. The weak offer (5%) comes in a default layout. AI text artefacts went out unchecked. 13 likes shows that production craft without distribution does not lift reach.
- **This single reel is a ready-made Good vs Average exhibit:** pause at 7.9 s and say "this is good", then let it hard-cut to the white card and say "this is where most ads go average".

---

## 3. R2: Pinterest pin `1128996200364040752` ("Pin on Social")

### Source and attribution
- URL: https://za.pinterest.com/pin/1128996200364040752/ (short link pin.it/nLmUKwOs8).
- Pinned by **"R call" (@rcallsservices)** to the board **"Social"**, which is why it shows as "Pin on Social". Page title: "Creative software photography [Video]". Pin date 2026-09-15.
- Source link: Instagram reel https://www.instagram.com/reel/DblbWO6PABB/ by **RCALL SERVICES (@rcall_services)**, posted 2026-08-03, 5 likes. The caption tags **@adobecreativecloud** and "www.rcallservices.com". The original creator of the footage is **unclear**: it may be an Adobe-style asset reposted by a services company.
- Technical: 720x1280, 25 fps, 9.92 s. Scene-change detector found **no cuts**: it is one locked-off shot with a composite.

### Frame by frame
| Time | What is on screen | Motion and transition |
|---|---|---|
| 0.0 to 0.4 s | Real macro footage at a low angle, desk height: a black ergonomic mouse on a warm oak desk with a relaxed hand on it. The background is a bright white room in deep bokeh (window light, wide aperture). | Calm. Nothing happens, which makes a 0.4 s anticipation beat. |
| about 0.4 to 0.6 s | The index finger clicks. **Five 3D app icons (Ae, Ai, Id, Lr, Ps) burst out of the mouse** and fan into a semicircular arc above the hand. | **Staggered scale-up from the click point** along the arc, each icon tilted in perspective (glossy bevelled squircles with a soft shadow) so they read as physical objects. A slight overshoot settle. |
| 0.6 to 1.5 s | The arc holds. The icons bob gently. | Hold beat (you can read it). |
| about 1.5 to 2.5 s | The finger lifts and clicks again. | **The arc spins like a dial around the mouse as its pivot.** Heavy directional motion blur smears the icons into glowing colour streaks (violet, magenta, orange, cyan). It **lands on a new set** (Lr, Ps, Pr, Xd and an app-store glyph) with an elastic settle. |
| 2.5 to 9.9 s | It repeats: click, spin, settle. The sets that follow: Ai/Id/Lr/Ps/Pr, then Ae/Ai/Id/Lr plus a Figma-like icon, and finally a ChatGPT-like icon, a DaVinci Resolve-like icon, a Figma-like icon, Ae and Ai. | The rhythm is about 1.5 to 2 s per cycle. There is **no text, no logo and no end card**. It ends mid-hold, so Pinterest's autoplay loop restarts seamlessly. |

- **Typography:** only the two-letter app monograms on the icons.
- **Colour:** neutral real-world base (white room, oak, black mouse) against saturated neon icon colours. The contrast makes the CG pop.
- **3D:** the icons are lit 3D tiles with perspective tilt that match the camera angle. Shadows are faint.
- **How attention is held:** a clear cause and effect (click gives a burst), a predictable rhythm with an unpredictable payoff (which set comes next?), a loop with no ending, and short hold beats.
- **Audio (INFERRED):** loud first 0.5 s (-11 dB RMS), then -27 to -50 dB with regular dips about every 1.5 s, which is consistent with soft music plus click/whoosh hits on each spin. Not heard.

### Why it is good, and where it is average
- **Good:** a single, human, physical action drives the digital payoff. Hybrid realism (real hand, CG objects) feels tangible. The dial metaphor says "a toolbox of choices" instantly. It is a perfect loop.
- **Average:** no message, no brand, no call to action, so it entertains but converts nothing. It relies entirely on third-party trademarks and the authorship is muddy.

---

## 4. R3: Pinterest pin `1066719861762474919` ("Turn Your Ideas into Powerful Digital Solutions")

### Source and attribution
- URL: https://za.pinterest.com/pin/1066719861762474919/ (short link pin.it/3NZhbCHeH).
- Uploaded by **Eirmon Solutions (@eirmonsolution)** to its board "Eirmon Solutions". Source shown: "Uploaded by user". Pin date 2026-09-14.
- On-screen brand: "eirmon", tagline "YOUR IDEA OUR TECHNOLOGY" (a software, web, app and marketing agency).
- Description: "Your ideas have the power to become something bigger! From innovative mobile apps and powerful websites to smart software, creative design, and digital marketing..."
- INFERRED AI-generated. The UI text is garbled (a fake brand "Godtfes", invented numerals), and the glass and neon world matches common text-to-video model looks.
- Technical: 720x1280, 30 fps, 19.93 s. Hard cuts detected at **2.57 s, 10.0 s, 16.53 s and 18.03 s**. Every other change is an in-camera morph or move.
- Access note: desktop Chromium without a login was **redirected to pinterest.com/ideas/** (screenshot `r3-page-desktop.png` shows that page, not the pin). The iPhone UA loaded the pin behind a login sheet, and the video URL came from the page HTML.

### Frame by frame
| Time | What is on screen | Motion and transition |
|---|---|---|
| 0.0 to 0.2 s | Black. | Silence before the hit. |
| 0.2 to 0.8 s | A thin **electric-blue lightning line** ignites at the centre, extends across the full width, then **traces a rectangle**. | The border-trace reveals a frosted-glass browser window floating in a dark luxury showroom (ceiling light ring, wood-slat walls, glossy black floor, curved plinth with a warm orange LED edge strip). |
| 0.8 to 2.2 s | The browser shows a website hero: "We **DON'T JUST BUILD** WEBSITES" (bold condensed sans, middle words in blue) with a laptop mockup. | A slow push-in. Lightning crawls round the frame edge (energy border). |
| 2.2 to 2.6 s | **Glass-shatter transition.** The pane cracks from the centre and shards fly toward the camera. Through the hole: "WE BUILD DIGITAL BUSINESSES" in a white serif with a chrome bevel. | **The copy corrects itself through the transition**: "don't just build websites" shatters into "build digital businesses". |
| 2.6 to 5.0 s | A data tunnel: network lines, nodes, and orange and blue light streaks rushing from a vanishing point. Small HUD numerals. A **light ribbon orbits the headline** as a tilted ellipse with a lens flare. | Forward fly-through (hyperspace). The orbit ring passes in front of and behind the text. |
| 5.2 to 5.6 s | **Punch-through.** A glass website card flies forward through the centre of the headline and the letters split apart around it. | The headline scatters outward and the card becomes the hero of the next beat. |
| 5.6 to 7.0 s | Label "WEBSITES" (bold white sans). A cluster of frosted website panels at different depths, plus a search-bar chip. | Slow drift. The label types on. |
| 7.0 to 8.6 s | Label "APPS". A photoreal phone with a colourful home screen rotates in 3D among the panels. | Whip/swing into the phone. A turntable rotation. |
| 9.0 to 10.0 s | The phone and website cards **spiral into an orbit around a glowing energy core** with electric arcs and blue orbit rings. Caption "**ONE** DIGITAL PARTNER": "ONE" bright white and the rest grey, filling left to right. | Convergence equals the "one partner" metaphor. A type-on fill reveal. |
| 10.0 to 13.0 s | Cut back to the showroom. The glass browser with a website and phone **morphs into a "MARKETING" analytics dashboard** (line and bar charts, a donut) built from two layered glass sheets. | Morph inside the same object, then a push-in. |
| about 13 to 14 s | Whip with a light streak to "SOFTWARE": a glass code-editor panel with a glowing node. | Whip pan with a streak wipe. |
| 14.0 to 16.5 s | Wide constellation: about 10 glass panels (dashboards, sites, charts) around a central core with radial light rays. "DESIGN / DEVELOP / GROW" stacked, revealed word by word around the core. | Staggered word reveal. A slow dolly. |
| 16.53 to 18.0 s | **Hologram pedestal:** a glass dashboard rises from a sci-fi circular platform on a blue light beam while orange and blue light rings orbit. It then splits into two panes, with a flash at the core and a field of floating glass tiles. | Rise from the pedestal. Ring orbit. A split. |
| 18.03 to 19.9 s | **Logo lock-up:** red and blue ribbons swirl into an "e" mark. The wordmark "eirmon" fades up, then the tagline "YOUR IDEA OUR TECHNOLOGY". | Ribbon swirl that forms the mark, then a staged fade-ups. It holds to the end. **No URL, no contact, no CTA.** |

- **Typography:** a mix of a bold grotesque (labels and the browser hero) and a chrome serif (the "WE BUILD DIGITAL BUSINESSES" claim). The serif marks the brand promise and the sans marks the categories, which is a smart hierarchy.
- **Colour:** near-black navy, electric blue and cyan glow, warm orange accent streaks (complementary pop), frosted glass whites.
- **3D:** frosted glass panels with thickness and edge highlights, a photoreal phone, volumetric beams, an environment (showroom) that grounds the abstract parts.
- **How attention is held:** a new visual event every 1.5 to 2.5 s, transitions that carry meaning (shatter means "more than"; orbit means "one partner"), one-word labels you can read at a glance, and continuous camera movement.
- **Audio (INFERRED):** loudness swings from -14 to -32 dB with peaks near the transitions, so it is likely whoosh and impact SFX on a music bed. Not heard.

### Why it is good, and where it is average
- **Good:** transitions do the storytelling, and the opening claim-correction ("don't just build websites" shattering into "build businesses") is a strong hook. The beat structure is clear (one word per beat), the camera never stops, and it ends on a branded lock-up.
- **Average:** this is the generic AI-tech look (blue neon, hyperspace, holograms) that hundreds of agencies now post. It is a capability list, not a customer outcome. There is no CTA or contact at the end. Constant high energy leaves no breathing beat, and the UI text is garbled. **It shows what "make it look modern" gives you from AI without a brand standard.**

---

## 5. Reusable techniques (named, with how to re-create each one originally)

Rules for every item: build with original or generated assets only. Use GSAP 3.13+ (SplitText, DrawSVG and MotionPath are now free) with ScrollTrigger `scrub` so scrolling drives the scene. Give every technique a `prefers-reduced-motion` end state (show the settled frame, no tween). Times are rough build estimates for one scene.

| ID | Name | Seen in | Web re-creation (GSAP/CSS) | Video re-creation | Time |
|---|---|---|---|---|---|
| T1 | **Screen-to-world pop-out** | R1 | A phone frame in DOM showing real UI (the persona's shop). Each product is a transparent PNG placed exactly over its grid thumbnail. ScrollTrigger scrub: the product goes from `scale 1` to `1.5`, translates outward (x/y away from the phone centre), takes a small `rotation`, and its `drop-shadow` grows. The thumbnail drops to `opacity .35` so it reads "lifted out". Stagger 0.08. | Generate an original still (phone + persona's products) in the house style, then image-to-video: "products float out of the phone screen, slow motion, slow camera orbit right, warm studio". Check any in-screen text before use. | 3 to 4 h |
| T2 | **Orbit with fill-up** (escalate without cutting) | R1 | The scene container has `perspective: 1200px`. Over the pinned scroll range, scrub the hero `rotateY -12deg` to `0` with the camera drift `x -4vw` to `0`. Extra objects enter from the edges at staggered scroll positions, so density rises as the presenter talks. | One continuous camera move, not cuts. Ask the video model for "one continuous shot, no cuts". | 1 to 2 h |
| T3 | **Depth-of-field card dust** | R1 | 8 to 14 small cards on three depth layers (`data-depth` 0.2 / 0.6 / 1). Back layer `filter: blur(6px)` at small scale, front layer `blur(3px)` at large scale, middle sharp. Scroll parallax speed = depth. Pointer parallax via `gsap.quickTo` on x/y. | Shoot or generate at a wide aperture. Composite blurred tiles front and back. | 1 h |
| T4 | **Material-matched studio light** | R1 | A background gradient taken from the product material (sample 3 colours from the product photo). Window-light bars: `repeating-linear-gradient(115deg, ...)` under a soft `mask-image`. A contact shadow ellipse (`radial-gradient`) under the hero, scaled with its float height. | Light the set with one large window source at a raking angle. | 30 min |
| T5 | **Click-to-burst arc** | R2 | On click or the presenter's next key: N tiles start at the trigger point at `scale 0` and tween to positions on an arc (angles 200 to 340 degrees, radius about 22vmin) with `stagger 0.04`, `ease "back.out(1.7)"`, and a per-index `rotationX/rotationY` tilt so they face the "camera". Then an idle bob: `y` sine yoyo at 2 to 4 px. | Film your own hand on your own mouse or phone (phone camera, portrait mode for bokeh), then composite the tiles in Remotion, HyperFrames or After Effects on the click frame. | 1.5 h |
| T6 | **Dial spin with smear and swap** | R2 | The arc container rotates 360 degrees or more around its pivot (`transform-origin` at the trigger point), `ease "power3.in"` into `"elastic.out(1,0.6)"`. During the spin apply directional blur (SVG `feGaussianBlur stdDeviation="12 0"` on a counter-rotated layer, or 3 to 4 ghost copies at falling opacity). **Swap the tile content at peak blur** so the change is hidden, then land on the selected item. Use `gsap.utils.wrap` to cycle sets. | Motion-blur the spin in compositing and swap the sets on blurred frames. | 2 h |
| T7 | **Hybrid real-hand trigger** | R2 | Background `<video>` of an original hand-click loop. Use `requestVideoFrameCallback` to fire T5 on the exact click frame, so the DOM tiles stay in sync with the footage. | Shoot 4K at 50 fps, so the click can play at half speed. | 1 h plus shoot |
| T8 | **Electric border ignite** | R3 | SVG `<rect>` with `stroke-dasharray`/`dashoffset` draw-on (DrawSVG), starting as a centre dot, then a horizontal line, then a rectangle. Jitter the stroke with `feTurbulence` + `feDisplacementMap` (animate `baseFrequency` for a crackle). Glow: `filter: drop-shadow(0 0 8px var(--accent))`. It reveals the first glass pane. | Use an electric-stroke preset in After Effects or HyperFrames, or render it in canvas. | 1.5 h |
| T9 | **Shatter reveal (claim correction)** | R3 | Pre-cut the pane into about 18 Voronoi shards (generate `clip-path: polygon()` lists at build time). Each shard is a clone of the pane. Scrub: shards take `z` toward the camera (`scale 1` to `2.2`), get random `rotation`, `x/y` away from centre, `opacity` to 0, staggered from the centre outward. Behind them the new headline scales from `0.92` to `1` and gains focus (`blur(8px)` to `0`). | A cell-fracture simulation (Blender) or a shatter transition preset in video. | 3 h |
| T10 | **Velocity data tunnel** | R3 | Canvas lines streaking from a vanishing point. Their speed is mapped to `ScrollTrigger.getVelocity()`, so they rush only while the user scrolls. Cap the line count and pause offscreen. Keep it subtle (it is a transition, not wallpaper). | Hyperspace or particle-streak plate. | 2 h |
| T11 | **Orbit ring through the headline** | R3 | Two SVG half-ellipses (back half `z-index` below the text, front half above) tilted with CSS `rotateX(70deg)`, gradient stroke, animated `stroke-dashoffset` plus a small glow dot riding the path (MotionPath). The ring appears to pass behind and in front of the words. | Light-ribbon orbit with a lens flare. | 1.5 h |
| T12 | **Punch-through to the next section** | R3 | The next section's card starts tiny at the centre (`scale .15`, `z -800`) and scrubs forward to full size. At the same time, SplitText chars of the current headline scatter outward (x and y proportional to each char's distance from the centre, `opacity 0`, `blur 6px`). This is **the "scroll carries you into the next section" transition** the owner asked for. | A camera fly-through. | 2 h |
| T13 | **Frosted glass constellation** | R3 | Panels with `backdrop-filter: blur(14px) saturate(140%)`, a 1 px `rgba(255,255,255,.18)` border, an inner highlight gradient and a 10 to 20 degree `rotateY`. They sit on 3 depth planes under one `perspective` parent, with scroll drift and pointer tilt. Provide a solid fallback where `backdrop-filter` is unsupported. | Glass UI panels composited in 3D space. | 2 h |
| T14 | **Orbit-to-core convergence** | R3 | Proxy object per item `{r, a}`. Tween `r` to `0` and `a` by `+540deg` while writing `x = r*cos(a)`, `y = r*sin(a)*0.45` (a flattened orbit reads as 3D). The core is a `radial-gradient` + `blur` disc with a scale pulse on arrival. Use it for "many pieces become one". | Spiral-convergence shot. | 2 h |
| T15 | **One-word beat labels** | R3 | One word per scroll beat (about 1 viewport each). Big, heavy, centred. In: `y 40` to `0`, `opacity 0` to `1`. Out: `y -40`, so each word hands off to the next. | Same labels, 1.5 to 2.5 s per beat. | 30 min |
| T16 | **Emphasis fill type-on** | R3 | `background-clip: text` with a two-stop gradient (bright to dim) whose `background-position` is scrubbed left to right. The first word starts bright ("ONE ..."). It lights the line as the presenter says it. | Type-on fill. | 30 min |
| T17 | **Stacked word reveal around a core** | R3 | 3 to 4 stacked words, staggered `opacity/y` reveals, with the glowing core between the lines (T14 core reused). | Same. | 30 min |
| T18 | **Hologram pedestal reveal** | R3 | A platform made of 3 concentric `conic-gradient` rings at `rotateX(75deg)` spinning at different speeds. A beam (`linear-gradient` with `blur` and `mix-blend-mode: screen`). The panel rises `y 60` to `0` with `opacity` and settles on the beam. Use it to "present" the live tool. | Pedestal-and-beam reveal. | 2 h |
| T19 | **Ribbon lock-up** (not the eirmon mark) | R3 | Animate an original SVG ribbon path (DrawSVG plus a gradient stroke) that resolves into the GTP or workshop mark. Then the wordmark, then the line, then **a URL/QR** (the step R3 forgot). | Ribbon logo-reveal. | 1.5 h |
| A1 | **The bolted-on end card** (anti-pattern) | R1 at 7.958 s | Do not do this. Keep the CTA **inside the world**: the coupon or link tag floats out with the products (T1) and lands with a contact shadow while the camera keeps moving. | Same: put the CTA in the last 2 s of the continuous shot, not after a cut to white. | n/a |

---

## 6. Where each fits: ECO, then Attract and Interact (Good vs Average per scene)

Scene numbers match the current `index.html` `data-scene` order.

| Scene (current heading) | Pillar | Technique(s) | "Average looks like" | "Good looks like" |
|---|---|---|---|---|
| 01 "Be found. Be chosen. Keep learning." | Opening | T8 then T13 | Static title slide | A spark becomes a line that traces the frame, revealing a glass pane holding the first promise. The camera is already moving. |
| 02 "Growth is a loop." | ECO overview | T14, T11 | Three boxes with arrows | The E, C and O cards orbit a core labelled with the persona's business. Each scroll step pulls one card to the front. |
| 03 "Who actually buys, asks and returns?" | **Engage**: who | T1, T3 | A bullet list of demographics | Customer records lift out of a phone or CRM screen as cards (age, area, gender split), with blurred "data dust" behind. The persona card lands in focus. |
| 04 "Choose the channel that fits the buying moment." | **Engage**: where | **T5 + T6** (+T7) | A row of platform logos | Click: the platform arc bursts. Spin: it lands on the platform that fits the moment, which then **comes alive** (its native post or chat UI unfolds). This meets the owner's ask: "is whatever platform that we choose coming alive when we choose it". |
| 05 "One question. Three ways to be seen." | **Engage**: SEO/AEO/GEO | T15, T12 | Three columns of text | "SEO", "AEO", "GEO" as one-word beats. Each punches through to an example result card. |
| 06 "AI drafts faster. You make it yours." | **Engage**: content + voice (slop monster) | **T9**, T5 | Before and after text side by side | The generic AI caption sits on a glass pane, then **shatters** to reveal the voice-matched version (the R3 "don't just X, we Y" move used for "AI draft, then your voice"). Optional tools wheel (T5/T6) for the AI tools. |
| 07 "Your website needs a 90-day rhythm." | Engage: website plan | T13 | A table of 30/60/90 tasks | Blog and landing-page panels drift along a 30, 60, 90 depth track as you scroll. |
| 08 "Attention needs a next action." | **Convert** | T1 + **A1 contrast** | The R1 ending: magic, then a flat white CTA card | Show R1's own 7.9 s cut as the Average example. Then Good: the product floats out of the ad and lands in a WhatsApp chat or lead form, so the CTA is inside the motion. |
| 09 "A sale is often won after the first reply." | **Convert**: funnel and lifecycle | T15, T5, T18 | A funnel diagram | Stage words (CAPTURE, WELCOME, NURTURE, ASK, REVIEW) as beats. A "send" click bursts the follow-up arc (email, WhatsApp, review request). The CRM pipeline rises on the pedestal. |
| 10 "Count what helps you make the next decision." | **Optimize** | R3 morph (website to dashboard), T12 | A chart screenshot | The website pane **morphs into its analytics dashboard**. The winning post card punches forward ("double down"). |
| 11 "Before they read, they feel the page." | **Attract** | **R1 as a whole**, T1 to T4 | A flat product grid photo on white | Floating products in a material-matched studio with depth of field and slow orbit. Make it with the persona's products (the owner's "product illustrations should look like ... floating products"). |
| 12 "The next click should make sense." | **Interact** | **R2 principle**, T5, T7 | Buttons that do nothing visible, or a generic hover | Every click gives a visible, physical payoff (burst, settle, next). Let the audience trigger it. |
| 13 "Show AI the standard. Keep your own identity." | Attract and Interact: teaching AI | R3 as the cautionary exhibit, T9 | A "make it look modern" prompt, which gives generic neon-tech (R3's look) | The reference frames plus brand rules go into the AI, which outputs an on-brand version. Show both, then shatter the generic one. |
| 14 "Put your business through the ECO lens." | Tool | **T18** | A link in a footer | The audit tool rises on the pedestal and its panels unfold (scan, competitors, AI visibility). |
| 15 "One customer. One channel. One action. One measure." | Close | T17, T16, T19 | "Thank you" slide | The four "One ..." lines light up word by word around the core, then a ribbon lock-up with **the URL and QR for the skills resource** (the step R3 left out). |

---

## 7. Guardrails for re-creation
1. No third-party footage, frames, logos or the eirmon/iAnanas marks in published folders. Re-create from original or generated assets.
2. Platform logos in scene 04 must follow each platform's brand guidelines. Most forbid altering the mark, so **apply the T6 blur and smear only to neutral tiles, and show each official logo crisp and unmodified once settled.**
3. Check every AI-generated frame for garbled text before it ships. Both R1 and R3 shipped it.
4. Each technique needs a reduced-motion end state and a mobile composition. Cap canvas effects (T10) and pause them offscreen.
5. Keep R3's energy as an accent, not the house style. The GTP deck should use R1's calm, material-led light as the base and R3's transitions as the punctuation.

**Next action:** build scene 04 (T5 + T6, about 3 hours) with original platform tiles, then verify it in the browser at desktop and mobile widths.
