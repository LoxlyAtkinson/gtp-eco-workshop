**Next action (about 20 minutes):** generate one hero test composite for the Amina's Kitchen ad scene from the R5 prompt template in section 3.3, then check it against the QC checklist in section 3.7 before you generate any more assets.

# R4 and R5 reference teardown: floating 3D products and cinematic glass UI

- Date: 2026-10-27. Internal research only, not published.
- Third-party material was studied, not copied. Frames, contact sheets and the R4 caption file are saved for internal reference only, in `experience/research/r4-r5/`. Do not move them into `assets/`, `tool/`, `motion-examples/` or the root.
- Short links checked: `pin.it/9JJqfW1Yx` resolves to pin 1149473504922462570 (R4), and `pin.it/2vF0x5b22` resolves to pin 924574998525500245 (R5).

## 1. Evidence I looked at

| Item | R4 | R5 |
|---|---|---|
| Pin title | "Professional Website Design That Generates Leads and Grows Your Business" | "3D Fashion E-Commerce Mobile App UI Animation" |
| Uploader / stated source | mrwebsolutionsofficial (a web agency ad) | emaniqbal540. The pin text says it was "animated using Google Flow", so it is an AI-generated video (Veo). |
| Media fetched | `c8adfefa…_720w.mp4`: 720x1280, 30 fps, 52.47 s, voice-over and music (mean -20.4 dB), plus a captions VTT | `87ee64c6…_720w.mp4`: 720x1280, 24 fps, 8.00 s (192 frames), music bed (mean -19.5 dB). The 720w file is the highest HLS rendition. |
| Headless load | Playwright Chromium (own instance, closed afterwards). The page title matched, and the network log showed the same video hash. Screenshot: `r4-r5/r4_pinpage_headless.png` | Same method. Screenshot: `r4-r5/r5_pinpage_headless.png`. A login modal covered the page and was not touched. The "related pins" rail showed more of the same genre (a phone on a plinth with exploded floating products). |
| Frames reviewed | `r4_sheet.png` (one frame every 2 s), `r4_keys.png` (2.5, 8.6, 13.5, 16.5, 23.0, 25.0, 29.5, 31.0 s), `r4_trans_4-8.png`, `r4_trans_15-18.png`, `r4_poster_frame.png` | `r5_sheet.png` (32 frames, one every 0.25 s), `r5_open_0-1.6.png` (8 fps), `r5_rightcrop_1.5-5.5.png` (3 fps crop of the product zone), `r5_mid3.png` (2.0, 3.0, 4.5 s), `r5_end3.png` (5.25, 6.0, 7.75 s), `r5_poster_frame.jpg` |
| Machine metadata | `r4-r5/headless_load.json`, `r4-r5/r4.vtt` | `r4-r5/headless_load.json` |

## 2. R5 forensic breakdown (the visual spec for product illustrations)

### 2.1 What it is
- A vertical 9:16 product film, 8 s long.
- A black smartphone stands upright on a stone plinth in a warm beige room.
- A fashion shop interface on the screen "breaks out" into real 3D products (trench coat, sneakers, caps) and frosted-glass info cards. These float in front of and around the phone, partly outside its outline.
- It ends on a large frosted "BUY NOW" bar.

### 2.2 Camera
1. **Height:** level with the lower third of the phone, just above the plinth top. A thin sliver of the plinth top surface shows, so the camera sits about 5 to 10 degrees above that plane. Tilt is about 0 degrees, and phone verticals stay nearly parallel.
2. **Lens:** feels like 50 to 70 mm full-frame equivalent. Perspective is mild, with no wide-angle bulge.
3. **Angle:** at 0 to 0.5 s the phone is seen three-quarter, turned about 18 to 22 degrees so its left side edge shows. Between 0.5 and 1.0 s it turns to about 3 to 5 degrees, almost frontal, through a slow orbit or truck left. It stays near-frontal to the end.
4. **Push-in:** very slow, about 3 to 5% scale over 8 s. Phone height in frame is roughly 62% at 0 s and roughly 60% at 7.75 s, while the background reframes slightly. Stepped stone blocks become visible behind from about 2 s.
5. **Depth of field:** shallow, about f/2.8 look. The phone, its products and the plinth front edge are sharp. The back wall and the stepped blocks fall off into soft bokeh. All floating products share the phone's focal plane, so none of them are blurred.

### 2.3 Lighting
1. **Key light:** warm, soft, from the upper right and slightly behind (about 45 degrees elevation). Four things show this: the wall is brightest top right, rim highlights sit on the right edges of the coat, caps and sneakers, a lens flare blooms in the top right at about 5.25 s, and a diagonal light shaft sweeps from upper right to lower left across the coat and screen at about 2.0 to 4.0 s.
2. **Fill:** soft warm bounce from the beige walls. Contrast is low and shadows are open, never black.
3. **Emissive moment:** at 1.0 to 3.25 s the phone bezel gains a copper-amber rim glow (a "power on" or backlight bloom), then cools back to dark bronze titanium by about 3.5 s.
4. **Flare:** a sun-star with a horizontal anamorphic streak, top right, from about 5.25 s to the end, with faint twinkle. Haze lifts the background at the same time.
5. **Colour temperature:** warm, about 3800 to 4500 K, with gentle highlight bloom and a slight atmospheric haze.

### 2.4 Materials and palette
- **Phone:** gloss black glass, a thin bronze or dark titanium frame, and a dark espresso UI.
- **Glass cards:** smoked frosted glass (roughly 30 to 40% opacity, heavy blur behind), a thin light edge highlight, rounded corners of about 12 px at 720 px width, light warm-white text, and caramel prices.
- **Products:** photoreal and matte. Cotton-twill coat in beige, canvas cap in sand, leather sneakers in white with beige suede panels. The fabric micro-texture is visible, and there is no plastic or toy look.
- **Plinth:** rough travertine or limestone block with visible pores.
- **Wall:** limewash plaster with a vignette.
- **Sampled colours (approximate, from frames):**
  - Wall highlight `#BEAB97`
  - Wall in shadow `#6F5C49`
  - Plinth front `#A79887`
  - Cap sand `#9F836B`
  - Glass card over the warm wall `#846F5E`
  - Caramel "Add to bag" button `#AA7B55`
- **Estimated colours:** screen espresso about `#1E1A17`, bezel glow peak about `#E39A5A`.

### 2.5 Shadows
- The phone casts a soft contact shadow on the plinth (short and diffuse, from the high key light).
- Floating products cast **no** shadow on the phone or the plinth. This is what sells "weightless". Depth comes instead from overlap with the bezel edge, rim light, and the fact that they sit forward of the glass.
- Glass cards cast none either. They read as being in front only because they overlap the bezel and blur what is behind them.

### 2.6 Layering, front to back
1. CTA glass bar (from about 5 s). It is about 150% of the phone width and about 74% of the frame width, and overlaps the lower half of the phone.
2. Satellite products, outside the phone outline:
   - The cap at the top sits about 40% above the top bezel.
   - The right-hand sneaker sits about 50% outside the right bezel.
   - A second cap and a second sneaker are added from about 4 s.
3. Floating glass cards:
   - "New Arrival" on the left overhangs the bezel by about 25 to 35% of its own width.
   - A spec and price card on the right overhangs the right bezel.
   - A left category sidebar shows only at 0 to 0.75 s.
4. Hero product breaking out of the hero card: the coat extends beyond the card bounds, and the sneaker overlaps the card's lower left edge.
5. Flat on-screen UI: search bar, title and price, colour dots, a "You may also like" row of 4 flat thumbnails, a trust row, and "Add to bag" plus "Buy now" buttons.
6. Phone body.
7. Plinth.
8. Stepped stone blocks in the mid-ground (soft).
9. Plaster wall.

### 2.7 Product count and scale (as a share of the 720 px frame width)
- **Start:** 3 floating 3D products (coat, sneaker, cap) and 3 glass panels.
- **Peak (from about 4.5 s):** 5 floating 3D products (1 coat, 2 sneakers, 2 caps), 1 or 2 glass cards, and the CTA bar.
- **Sizes:**
  - Phone: about 44% of frame width, about 62% of frame height.
  - Hero coat: about 25% of frame height, about 40% of phone height.
  - Sneaker: about 18 to 20% of frame width.
  - Cap: about 15 to 17% of frame width.
  - Glass cards: about 13 to 25% of frame width.

### 2.8 Motion and timing (8.0 s, 24 fps)
| Time | Beat |
|---|---|
| 0.00–0.50 s | Establishing three-quarter view. Everything near-still. |
| 0.50–1.00 s | The left sidebar retracts or dissolves into the phone while the phone turns to face the camera. |
| 1.00–1.75 s | The screen dims, the bezel heats to a copper glow, and a second cap appears on the right. |
| 2.00–3.75 s | Hero beat. The coat turns about its vertical axis from front through three-quarter to profile, about 90 degrees in about 2.5 s (roughly 30 to 40 degrees per second, near-linear). A diagonal light shaft sweeps across it. Glass cards drift sideways by about 2 to 4% of frame width. |
| 4.00–5.00 s | The coat continues round to its back. Cards ghost and morph (an AI cross-dissolve). A second sneaker appears on the right. The cap migrates to the top right. The bezel cools. |
| 5.00–5.75 s | The flare blooms top right, the background brightens, and the frosted "BUY NOW" bar rises in front. |
| 6.00–8.00 s | Resolve and hold. The coat turns back toward the front, sneakers flank both sides at mid-height, two caps sit at the top, the "New Arrival" card is on the left, the flare twinkles, and the slow push-in continues. |

- **Float:** products barely bob. Vertical drift is at most about 1 to 2% of frame height across the whole clip. The life comes from **slow rotation about the vertical axis, light sweeps, emissive glow and new elements arriving**, not from bouncing.
- **Easing:** generally slow and near-linear (a typical AI-video look). There are no snappy eases anywhere.
- **Loop:** the last frame does not match the first. Pinterest loops it with a hard cut, so it is **not a seamless loop**.
- **Defects to avoid copying:** AI-text garbling ("Spring Collecction", duplicated "Beige Trench Coat" titles, unreadable microcopy), objects popping in and out (the cap duplicating, the coat morphing between cards), and a duplicated "BUY NOW" label. **Lesson: generate the products and the set, but build all text and UI cards in HTML and CSS.**

## 3. Image-generation spec: original floating 3D products in the R5 style

### 3.1 Production approach (layers, not one flat image)
1. **Background plate:**
   - A warm plaster wall and a travertine plinth, with no device and no products.
   - Sizes: 16:9 at 2560x1440 for desktop, plus 9:16 at 1080x1920 for phone viewing.
2. **Device:**
   - A generic dark smartphone with a bronze frame and a blank dark screen, front-on with a 3 to 5 degree turn.
   - Transparent PNG or WebP at about 1200x2400 (1:2). Use a blank screen, because the deck renders the UI in HTML.
3. **Products:**
   - Each product is generated separately on a flat neutral background, with the background then removed.
   - 1:1 at 1536x1536, then exported at 1024 and 512 with alpha.
4. **Hero turntable (optional, for scroll-linked rotation):**
   - The hero product as a 24 to 36 frame sequence covering 0 to 180 degrees about the vertical axis.
   - Source it from either an image-to-video "slow turntable" generation with frames extracted, or an image-to-3D GLB mesh rendered at fixed angles.
5. **Glass cards, prices, CTA and all wording:** HTML and CSS only (never generated).
6. **Optional one-shot composite** (for posters, a speaker-notes thumbnail, or as the first frame of an image-to-video ambient clip):
   - Uses the full-scene prompt in section 3.3.
   - Ask it for no readable text.

### 3.2 Locked look parameters
| Parameter | Value |
|---|---|
| Camera | 60 to 70 mm, at plinth height or the lower third of the device, 0 degree tilt. Turn: devices 3 to 20 degrees, products about 25 to 35 degrees three-quarter. |
| Depth of field | Composite: shallow (f/2.8 look) with the background soft. Isolated product cutouts: deep (f/8) so the edges are crisp. |
| Key light | Large warm softbox upper right at about 45 degrees elevation, slightly behind the subject. Rim light on right edges. About 4000 K. |
| Fill | Soft warm bounce from the left at about 1/3 the key level. No black shadows. |
| Shadows | Composite: a soft contact shadow under the device on the plinth only. Floating products: **no cast shadow**. |
| Materials | Matte, real-world textures (fabric weave, ceramic glaze, kraft paper, brushed metal) with subtle specular highlights. Never glossy plastic. |
| Palette | Sand `#BEAB97`, stone `#A79887`, taupe `#9F836B`, caramel `#AA7B55`, espresso `#1E1A17`. Glass is smoked warm grey. The deck's cream `#F3EAD8`, caramel `#DCA373` and green `#153C2F` bridge in cleanly. |
| Background | Warm limewash plaster with a top-right highlight and a corner vignette, plus soft stepped stone blocks in the mid-ground. |
| Atmosphere | Faint haze. The flare lives in a separate CSS or WebP layer so it can animate. |

### 3.3 Prompt templates (fill the brackets; keep everything else)

**A. Isolated floating product (for transparent cutouts)**
```
Photoreal studio product render of [PRODUCT], [MATERIAL + COLOUR DETAILS],
floating weightlessly, three-quarter view turned 30 degrees to camera-left,
camera at the product's mid-height, 70mm lens, f/8, everything in sharp focus.
Large warm softbox key light from upper right at 45 degrees, soft rim light on the
right edges, gentle warm bounce fill from the left, 4000K. Matte real-world textures
with fine micro-detail, subtle specular highlights. Premium editorial catalogue look,
muted sand, taupe and caramel palette. Isolated on a flat seamless warm light-grey
background (#D9D2C8), no shadow, no floor, no props.
Product centred, filling 70% of a 1:1 square frame.
Negative: text, letters, logos, watermark, hands, people, duplicates, cartoon,
toy-like plastic, harsh shadows, cast shadow, reflections of a studio, neon, blue cast.
```

**B. Background plate (no device)**
```
Empty cinematic product stage: a rough travertine stone plinth in the lower fifth of
the frame, in a warm beige limewash plaster room, soft blurred stepped stone blocks
behind, soft warm sunlight from the upper right, faint haze, shallow depth of field,
60mm lens at plinth height, muted sand and taupe palette, [16:9 | 9:16].
Negative: text, objects on the plinth, people, logos.
```

**C. Full-scene composite (keyframe for posters or image-to-video)**
```
Cinematic product advertisement still, [16:9 | 9:16]. A modern dark smartphone with a
thin bronze frame stands upright on a rough travertine plinth in a warm beige plaster
room. The phone screen shows a dark espresso-brown [APP TYPE, e.g. food-ordering] interface.
A photoreal 3D [HERO PRODUCT] bursts out of the screen toward the camera; [PRODUCT 2],
[PRODUCT 3] and [PRODUCT 4] float weightlessly around the phone, partly outside its
outline, with no shadows. Two frosted smoked-glass interface cards float in front of
the phone at different depths, overlapping its edges. Soft warm sunlight from the upper
right, subtle lens flare in the top right corner, faint haze, shallow depth of field
with soft stone blocks behind, 60mm lens at plinth height, phone turned 15 degrees.
Muted sand, taupe and caramel palette, premium editorial look. No readable text.
```

**D. Image-to-video ambient clip (only when a video version is wanted)**
```
Locked-off camera with a very slow push-in. The floating products rotate slowly about
their vertical axes, a soft diagonal light shaft sweeps across the phone from the upper
right, the phone frame glows warm amber then cools, and a lens flare gently blooms in the
top right. No new objects appear, no text changes, smooth and calm, 8 seconds.
```
Keep "no new objects appear, no text changes". R5's morph and duplication defects come from leaving the model free.

### 3.4 Subject sets for this deck
| Deck scene | Hero (breaks out of the screen) | Satellites (2 to 4) | HTML cards (real text) |
|---|---|---|---|
| Convert: Amina's Kitchen ad (fictional example already in the deck) | Catered lunch tray (chicken, rice, roast vegetables) in a kraft tray | 2 sauce pots, a lidded lunch box half open, a bottled juice, a wooden cutlery bundle with a linen napkin | "Lunch for 20?", "20 mains to start", a quote CTA bar |
| Engage: finding your voice | A ceramic coffee cup with steam (the brand moment) | Notebook, pen, sticky notes | Two voice samples side by side ("average" and "on-voice") |
| AI Attract: search | A magnifier lens (brushed brass and glass) | A map pin, a star rating token, a small storefront model | Search query bar and business result card (the existing "illustrative" labels stay) |
| AI Interact: chat or response | A glass chat bubble | A calendar card, a quote document, a phone bell icon in matte ceramic | Real message thread in HTML |

Use the existing `assets/amina-lunch-3d.png` as the hero source only after re-cutting it. **It currently has a jagged yellow fringe or halo along the tray rims** (visible on any dark background), so it fails the edge test in section 3.7.

### 3.5 Cutout and transparency rules
1. Generate products on the flat light-grey `#D9D2C8` background. Do not generate on white (it causes blown edges) or on green (it causes spill).
2. Remove the background with a background-removal tool.
3. Choke the matte by 1 px and defringe or decontaminate the colour. The edges must not carry the background colour.
4. Export lossless WebP with alpha. Keep a PNG master. Make a 1024 px deck size and a 512 px mobile size.
5. Put shadows on their own layer. The device contact shadow is a separate soft ellipse, which can be done in CSS with a `radial-gradient`. Products get none.
6. Name files by role, for example `prod-amina-tray-hero@1024.webp` and `prod-amina-sauce-a@512.webp`.

### 3.6 Aspect ratios
- Plate: 16:9 at 2560x1440, plus 9:16 at 1080x1920.
- Device: 1:2.
- Products: 1:1.
- Turntable frames: 1:1 at 800 px, 24 to 36 frames.
- Composite or poster: 16:9 for the deck stage, 9:16 for the vertical ad mock.
- Keep the R5 proportions when compositing:
  - Device height is about 60% of the stage height.
  - Hero is about 40% of device height.
  - Satellites are each about 15 to 20% of stage width, with 40 to 50% of each one outside the device outline.

### 3.7 QC checklist (check every asset against all 8 before it goes in)
1. There is no text or logo inside the image.
2. The edges are clean on both `#10231E` (dark) and `#F3EAD8` (cream), with no halo and no fringe.
3. Light comes from the upper right, matching the plate.
4. Shadow rules are followed: none under floating products, and a soft one under the device only.
5. Materials look real, not plastic.
6. The palette sits within sand, taupe and caramel.
7. The product is recognisable at 512 px.
8. Any product family is consistent: same lens, same angle range, same light.

## 4. Motion spec for the deck

The deck already drives scenes with a `--p` (0 to 1) scroll-progress custom property from `scroll-presentation.js`. GSAP 3.x is in `node_modules/gsap` and in `motion-examples/vendor`, but it is not loaded by `index.html` today. The spec below works either way.

### 4.1 Layer depths (parallax factor = movement relative to the device anchor)
| Layer | Content | Parallax | Notes |
|---|---|---|---|
| L0 | Plaster wall plate | 0.15 | Slow drift up, plus scale 1.00→1.04 across the scene (the push-in) |
| L1 | Blurred stone blocks | 0.30 | `filter: blur(6px)` baked into the image, not done live |
| L2 | Plinth, device and contact shadow | 0 (anchor) | Turn the device with `rotateY(-18deg → -4deg)` under a `perspective(1400px)` parent |
| L3 | On-screen HTML UI | Moves with L2 | Dims at the "power on" beat |
| L4 | Hero product breaking out | 0.8 | Scale 0.92→1.05, plus a turntable sequence or ±12° rotateY |
| L5 | Glass cards (HTML) | 1.0 | `backdrop-filter: blur(14px) saturate(1.15)`, background `rgba(52,43,36,.38)`, border `1px solid rgba(255,240,222,.18)`, radius 14 px, x drift ±24 px |
| L6 | Satellite products | 1.2 | Idle float as in section 4.3 |
| L7 | CTA glass bar | 1.3 | Enters late (at a progress of about 0.70) |
| L8 | Light: diagonal sweep and flare | none | `mix-blend-mode: screen`. The sweep is a rotated linear-gradient strip. |

### 4.2 Scroll beat map (scene progress `p` 0→1; this mirrors R5's 8 s, so the scene keeps evolving while the presenter talks)
| p | Beat | Properties |
|---|---|---|
| 0.00–0.12 | Establish the three-quarter view | Device `rotateY(-18deg)`. A left glass sidebar is visible. |
| 0.12–0.25 | Turn to face, sidebar retracts | Device `rotateY → -4deg`. Sidebar `x → 0, scale .9, opacity 0`. |
| 0.25–0.40 | "Power on" | Bezel `box-shadow: 0 0 48px rgba(227,154,90,.55)` ramps up and back down. Screen UI dims to 0.6 and recovers. Satellites emerge from the screen centre (from `scale .6, opacity 0`, positioned behind the bezel) out to their resting spots outside the outline. |
| 0.35–0.60 | Hero turntable and light sweep | Turntable frame index `0 → N` (front to profile to back), or `rotateY(0 → 160deg)` with front and back images swapped at 90°. The sweep strip travels upper right to lower left (`xPercent 120 → -120`). |
| 0.60–0.72 | Multiplication | A second satellite pair (a mirrored or alternate product) enters from the opposite side. |
| 0.70–0.85 | Offer resolves | The CTA bar goes `y 40 → 0, filter: blur(12px) → 0, opacity 0 → 1`. The flare blooms (scale 0.6→1, opacity 0→0.9). |
| 0.85–1.00 | Hold and hand-off | Push-in finishes. In the last 8% the products drift up and out (`y -60, opacity → 0`) and the device sinks back (`z -200`), which carries the eye into the next scene's bridge. |

### 4.3 Idle float (time-based, runs between scroll beats; keep it subtle, as R5 barely bobs)
```js
// Assumes gsap is loaded locally (vendor copy). Not wired; reference only.
const mm = gsap.matchMedia();
mm.add('(prefers-reduced-motion: no-preference)', () => {
  gsap.utils.toArray('.float-prod').forEach((el, i) => {
    gsap.to(el, {
      y: gsap.utils.random(-14, -8),        // px, ~1-2% of stage height
      rotation: gsap.utils.random(-3, 3),   // gentle z wobble
      duration: gsap.utils.random(3.6, 5.2),
      ease: 'sine.inOut', yoyo: true, repeat: -1,
      delay: i * 0.37                       // phase offsets so nothing bobs in unison
    });
  });
  const tl = gsap.timeline({
    scrollTrigger: { trigger: '.prod-stage', start: 'top top', end: '+=180%', scrub: 0.6, pin: true }
  });
  tl.fromTo('.prod-device', { rotateY: -18 }, { rotateY: -4, ease: 'none', duration: 0.25 }, 0)
    .to('.prod-device', { '--glow': 1, duration: 0.08, yoyo: true, repeat: 1 }, 0.25)
    .from('.float-prod', { scale: 0.6, opacity: 0, x: 0, y: 0, stagger: 0.03, duration: 0.15 }, 0.25)
    .to(turntable, { frame: FRAMES - 1, snap: 'frame', ease: 'none', duration: 0.25, onUpdate: drawFrame }, 0.35)
    .fromTo('.light-sweep', { xPercent: 120 }, { xPercent: -120, ease: 'none', duration: 0.25 }, 0.35)
    .from('.cta-glass', { y: 40, opacity: 0, filter: 'blur(12px)', duration: 0.15 }, 0.70)
    .from('.flare', { scale: 0.6, opacity: 0, duration: 0.15 }, 0.70)
    .to('.prod-stage__plate', { scale: 1.04, ease: 'none', duration: 1 }, 0);
});
```
- **Pure-CSS equivalent** using the existing engine: map each row of section 4.2 to `clamp(0, calc((var(--p) - start) / (end - start)), 1)` sub-progress variables. This follows the same pattern as the deck's existing `--flip-progress`. Run the idle float as a `@keyframes` loop inside `@media (prefers-reduced-motion: no-preference)`.
- **Turntable:** use a `<canvas>` drawing preloaded WebP frames, or a scrubbed all-keyframe MP4 (`ffmpeg -g 1`) for smooth reverse scrubbing. Budget 36 frames x about 40 KB ≈ 1.4 MB. Preload when the previous scene is active.
- **Pointer parallax (optional, desktop only):** offset each layer by `depth × 10 px` toward the pointer, with `gsap.quickTo` at a duration of 0.6.
- **Reduced motion:** render the composed final state (p = 0.85) as a still. No float, sweep or flare animation, and the turntable fixed at the front three-quarter frame.
- **Performance:** animate transforms and opacity only. Use at most 3 live `backdrop-filter` cards. Set `will-change` only while the scene is active. Images are WebP with alpha at the 1024 px deck size.

## 5. R4 breakdown (cinematic and 3D direction)

### 5.1 What it is
- A 52 s vertical agency ad that pairs a voice-over with kinetic typography.
- Every line of the voice-over gets one 3D glass-UI metaphor.
- Structure:
  - Problem: 0 to 13 s
  - Cost: 13 to 16 s
  - Services: 17 to 31 s
  - Benefit cascade ("more… more…"): 32 to 39 s
  - Brand and tagline triad: 40 to 47 s
  - Contact end card: 47 to 52 s
- The caption VTT gives the voice-over timing: a new line every 2 to 4 s, and a type beat of 2 to 3 words every 0.7 to 1.5 s.

### 5.2 Look
- **Setting:** dark navy-black space with curved silk light ribbons, swirling gold particles and bokeh, and reflective floors.
- **UI slabs:** frosted acrylic with thick bevelled edges and refraction, plus blue CTA pills.
- **End card:** flips to a bright white and teal brand card. The contrast flip signals "now act".

### 5.3 Typography
- Heavy condensed grotesk, all caps, white with a soft shadow.
- Type lives **inside** the 3D set:
  - A foreground word is out of focus while the background word is sharp ("AN OUTDATED WEBSITE COSTS", 13.5 s).
  - Words slide sideways with motion blur ("WE BUILD", 16.5 to 17 s).
  - The camera flies through a giant word ("WEBSITE", about 16 s).
  - A red "SEO" tag glitches in at 8.6 s.

### 5.4 Transitions
- Mostly continuous AI camera moves. Scene detection found only about 15 hard cuts, at 10.3, 25.0, 26.3, 27.8, 32.5–34.3 (a cluster), 37.4, 38.2, 39.1, 41.5, 42.8, 43.8 and 46.2 s.
- A dip to black at about 15.9 to 16.3 s.
- A whip slide into an infinite reflective grid floor with monoliths.

### 5.5 Visual metaphors worth re-creating originally (for this deck)
1. **Exploded search** (4.0 to 8.0 s): a phone tilts, a search bar lifts off above it, and result cards fan out of the screen in depth. This fits the **AI Attract / search** scene.
2. **Glass pipes carrying lead cards** (about 29 to 31 s): makes the funnel physical. This fits **Convert → Optimize**.
3. **Holographic target rings on a city-block map** (about 25 s): "get found first". This fits local search.
4. **Glass bar chart rising with an amber edge glow** (about 26 s, and again at about 34 to 39 s): fits **Optimize** metrics.
5. **A web page panel aging into an outdated layout** (about 13 s): fits before and after.

### 5.6 Weaknesses not to inherit
- A generic navy-and-gold stock-AI look.
- Unreadable microcopy.
- A trademarked fruit logo on a panel.
- A persistent watermark logo.
- Hard-sell repetition.
- Take the **techniques** (type in depth, one metaphor per line, an exploded UI, a contrast flip at the CTA) and **not the look**. The deck keeps its own green, cream and caramel palette, with the R5 warm stage for product moments.

## 6. Good vs Average pairings

### 6.1 R5 pairing: "Show the product" (average) vs "stage the moment of wanting it" (good). Place: Convert, in the Amina's Kitchen ad scene.
1. **Average (static, left or first):**
   - A flat phone mock-up with one product photo pasted beside it.
   - A hard drop shadow and a visible cutout fringe (the current `amina-lunch-3d` look).
   - A grey background and the offer written as body text.
2. **Good (scroll-evolving, right or second):**
   - The R5 stage: the phone on a lit plinth, the hero tray breaking out of the screen, and sauce pots and a juice floating beyond the bezel.
   - A glass card with the real offer ("Lunch for 20? Start with 20 mains").
   - Scroll turns the hero, the light sweeps, and a CTA glass bar resolves.
3. **Best staging:** a single stage that **upgrades itself as you scroll**, one layer per beat, each with a small label: light → depth → product breaks out → offer card → CTA. The audience sees exactly which decisions make it "good".
4. **Teaching line:** "Average shows what you sell. Good shows the moment someone wants it."

### 6.2 R4 pairing: "Say it on a slide" (average) vs "make every sentence a moving picture" (good). Place: AI Attract (search), with an optional echo in Optimize.
1. **Average:** a text slide reading something like "Customers search 24/7, so be findable", with a stock laptop photo and bullets.
2. **Good:**
   - As the presenter scrolls, a phone tilts back and its search bar lifts off.
   - Three glass result cards fan out in depth. The fictional business card rises to the top with its "illustrative, not a live ranking" label kept.
   - Two or three-word kinetic captions sit in depth and sync to the speaker-notes beats.
   - The Optimize follow-up: glass bars rise with an amber edge as the metric is discussed.
3. **Teaching line:** "One message, one visual metaphor, moving at the speed you talk."

## 7. Risks and open points
- **Owner approval needed (credits):** generating the plate, device, product set and an optional turntable or image-to-video clip with the paid image or video tools. Rough count: 1 plate x 2 ratios, 1 device, 4 to 6 products per scene, and 1 turntable.
- R5 and R4 are AI videos with visible text and morph defects. "Look like this" should mean the set, light, materials and floating composition, **not** generated text.
- The original R5 is portrait 9:16 while the deck stage is mostly landscape. Compose the stage at 16:9 with the device centred-left and the cards on the right, and keep 9:16 for the vertical-ad mock inside the scene.

**Next action (about 20 minutes):** generate template C (section 3.3) for the Amina's Kitchen ad scene at 16:9, then run the section 3.7 QC checklist against it before commissioning the layered assets.
