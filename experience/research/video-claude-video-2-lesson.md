NEXT ACTION (owner, 2 min): decide AskUserQuestion Q1 in section 8 (let me download the video with your browser login so I can finish the "listen" half), then say go.

# V1: "Claude Video 2.0 Just Changed Everything (FREE Skill)" - lesson notes

Internal study file. Not published. Third-party material is described, never copied. Written 2026-10-27.

- Video: https://www.youtube.com/watch?v=KphrV76DJoI , Jack Roberts, published 2026-10-24, 13:00 long, 68,497 views when fetched.
- Closure status: PARTIAL. Watching is done (whole video, at two resolutions). Listening is NOT done the way you asked (see section 1).

## 1. What I could and could not do (read this first, 1 min)

| Step you asked for | Result | Why |
|---|---|---|
| 1. yt-dlp download of video+audio | BLOCKED | YouTube returned HTTP 403 on every media format (checked the format list: 1080p, 720p, 360p, audio-only all 403). The auto-mode safety classifier then refused me cycling through other YouTube player clients (judged bot-check circumvention) and I stopped there. No further workaround attempted. |
| 2. Local whisper transcription | NOT DONE | No audio file exists. I did not record the browser's audio output, because that is stream-ripping around the same block. |
| 3. Watch frames with ffmpeg + Read | DONE, by a different route | (a) Played the video as a normal viewer in my own headless Chromium (muted, 2x) and grabbed full-HD frames every ~2 s for 0:00 to 3:00. Playback then errored ("Something went wrong") at about 60 s of video on each of three tries, which looks like YouTube's own anti-automation cut-off, so I stopped rather than keep re-loading. (b) Downloaded YouTube's public scrubber thumbnails (the hover preview, 320x180, one frame about every 4.9 s) for the WHOLE video and read all 18 annotated sheets. So I saw every part of the video, but only 0:00 to 3:00 at readable text size. |
| 4. Gemini native video pass | BLOCKED | The Gemini key in ~/.claude/.env is rejected by Google (400 API_KEY_INVALID on the first call). The classifier then refused me inspecting the key file further. No Gemini cross-check exists. Disagreement list is therefore empty by necessity, not because we agree. |
| 5. Compare with local skill | DONE, hard evidence | Local skill is byte-identical to upstream (section 3). |
| Extra, labelled supplementary | DONE | Read YouTube's own transcript panel (auto-captions, 877 lines). This is "reading", not "listening". I used it only to fix wording and timing. Auto-caption mishears: "Clawude/Clord" = Claude, "Hixfield/Higsfield" = Higgsfield, "save" = Savee, "Glider/Glaido" = Glaido (his dictation sponsor), "Grockbot/Grot" = the Grok Bot shown on screen. |

Gaps this leaves (be honest in any claim built on this file):
1. Tone, emphasis, jokes, anything said but not captioned correctly: not heard.
2. Screen text at 3:00 to 13:00 is only legible where it was large (headlines, chip labels). Small UI text (the typed prompts inside Claude at 3:32 to 3:37, 8:38 to 9:08, the storyboard card at 9:27) is not readable. Section 4 says which prompts are confirmed and which are not.
3. Timestamps after 3:00 from the scrubber sheets are good to about +/-5 s. Chapter times come from the creator's own description and are exact.

## 2. (a) Lesson notes in teaching order

Format per block: time | what he says | what is on screen | why it works.

**0:00 to 1:06, Cold open "Claude Motion 2.0"** (hi-res frames seen)
- Says: everything on screen was built with Claude Motion 2.0; "hundreds of designer grade animations with zero editing"; describe it in plain English, get designs back; Claude can even edit your videos; "99% of people end up with AI slop because they don't use the correct system"; promise = build beautiful motion videos, mix in your own images and video "so it looks like an expensive design studio made them", turn it into a system for content "on autopilot even if you're a complete beginner"; three things to learn.
- Shows: fast montage (0:04 to 0:27) of a pro-editor mockup with a Claude side panel (Cut silences, Add b-roll, Captions, Colour grade, Lower third, Export), a paper-cut landscape, an isometric city with a follower counter, a weather widget typed from the prompt "A weather widget for every sky". 0:22: serif-italic caption "because they don't use the correct system" with the last words highlighted in gold. 0:27: three numbered cards (1 beautiful, 2 "Mix in your footage", 3). 0:36: proof stickers "1.2M views" and "4.8M views" with Instagram, TikTok, YouTube Shorts icons. 0:43: sponsor logo (Glaido, voice dictation). 0:52: switches to a browser tab at 127.0.0.1:4830 with his own interactive deck: "Everything you're watching was made by Claude. Hundreds of animations. Zero editing." then "Three steps to a studio look" (three big cards: Part 1, Part 2, Part 3, each "CLICK" to reveal).
- Why it works: proves the claim before explaining anything; names the enemy (slop) in the first 20 s; gives three steps so the viewer can track progress. Note the whole lesson is delivered as a Claude-built interactive deck, which is the same thing you want for GTP.

**1:06 to 1:51, Level 1 "Make beautiful motion graphics"**
- Says: everything here was drawn by Claude: paper world, a city that grows, Swiss kinetic typing, a weather widget; uses = pitch decks, explaining a product on a website, apps, top of a website; "you don't need to be on a Teams plan" (so Claude Pro is enough).
- Shows: deck slide "Every frame, drawn by Claude" = six tiles playing as real videos (Paper world, Swiss kinetic type, How Claude makes a video, A city that grows, One ink line, One widget every sky). A tile opens to a full video player (1:19, file named clip-type, 0:14 long). Weather widget cycles Sunny 18, Rain 11, Sunrise 12 etc.
- Why it works: a wall of moving proof; every tile is a real video, not a screenshot.

**1:51 to 3:03, "Why one prompt isn't enough"** (hi-res frames seen)
- Says: most people think you just prompt; but the same prompt gives everybody the same output. Shows one-shot vs skill pairs (flat vs depth of field and interactivity; words "pairing off" in burnt orange vs a more artistic version; buildings slowly appearing vs a whole environment). Analogy: a bad chef surrounded by world-class ingredients has no recipe or skill. "Only five things we have to do in step one."
- Shows: slide "Is one good prompt enough?" with a chat bar typing "Make me a launch video" then the headline "Same prompt. Same video as everyone." Three identical purple-gradient "LAUNCH" cards labelled Theirs / Yours / Everyone's, flagged with chips "! Big text", "! A gradient", "! A fade", "! Same as everyone", then a white chip "check The right skill" (frame w_01198). Next slide "One prompt vs the skill": same topic twice, tagged "One prompt" vs "With the skill": paper landscape (flat, sun and trees vs layered paper with river, boat, birds), kinetic type ("FASTER THAN SOUND" white-on-black vs "Type / moves like music" cream Swiss grid with a red dot), city (flat skyline silhouette at dusk vs isometric city "May 6,820 followers"). Then the pixel-art chef slide (2:52 to 3:03): "A: With the system" vs "B: Without a system", chef with ingredient chips Motion, Type, Code; A plates a "Designer-grade" isometric city with a tick, B plates "One prompt" (dark skyline). Then five icon buttons: Pick a style, Use real references, Write the brief in numbers, Decide if it loops, Check the frames.
- Why it works: he shows the average result first (identical cards), makes you feel "that's what I'd get", then shows the good one. That is exactly your "Good vs Average" device.

**3:03 to 3:40, Free skill + step 1 "pick a style"**
- Says: step one is pick a style you like; he has style prompts in a free Skool community; "copy the URL from the top, come straight over to Claude and say: Hey there, I would like you to follow this skill, please", dictated with Glaido; Claude then builds it.
- Shows: slide "Five things made the difference" (card 1 "Pick the style before you prompt"); the dark style gallery page "Claude Video 2.0" with tiles that have "Graphics | With media" pills and a "Use this style" button (3:12 to 3:22; tiles seen: One widget every sky, Where viewers leave chart "38%"); the GitHub repo page "Claude Video 2.0" (3:27); a white Claude chat window with the URL pasted in the input (3:32 to 3:37, too small to read).
- Why it works: picking a look BEFORE prompting is the first fix for the default AI look (local hacks.md hack 1 says the same).

**3:40 to 4:10, Step 2 "use real references"**
- Says: find a design you love; on Savee search e.g. "toggle", copy the video address or download it; Pinterest and X also work.
- Shows: cork-board slide "Use real references" (polaroids pinned; mouse-over tilts them); Savee dark grid of toggle-switch UI designs (3:52 to 4:01); one toggle video with a right-click menu (the "copy video address" step, 4:01); Pinterest grid (4:06).
- Why it works: a real frame beats the word "modern". (Local references/hacks.md hack 2, which also lists godly.website and mobbin.)

**4:10 to 5:11, Steps 3 to 5 and the five questions**
- Says: 3) the skill makes you write "the brief in numbers" (what to land, what to communicate in the shot); 4) decide loop or not: a loop means last and first frame are identical so it can run as a background, "just like the animations inside the presentation"; 5) it checks the frames, not the code. He spent days troubleshooting; the knowledge is baked into the skill. On download the skill asks five questions: what is it for and how long, what should it say, does it loop, your brand, and the fifth (real media) is the next section.
- Shows: slide cards "Write the brief in numbers" (a spec sheet), "Make it loop" (a ring of panels), "Check frames, not code" (three frames strip). 4:36 to 4:51: back in the gallery, scrolling studio pieces. 4:56: slide "Then it asks you five questions" (cards: What is it for and how long? What should it say? Does it loop? ...).
- Why it works: the five habits map one-to-one to the skill's own SKILL.md Stage C.

**5:11 to 8:09, Level 2 "Add your own photos and videos" (Make it real)**
- Says: the biggest problem is graphics alone look generic; big brands mix HTML graphics with real photos and footage. Adding one photo of himself turns a generic graphic into something "bespoke and massively high quality". The internet is flooded with generic AI video, so you need a unique edge; "if you're a chef you need real ingredients". You can toggle graphic vs media at any point. "Only three things": connect Higgsfield, approve the storyboard, let it build.
- Shows: slide "Pick the style before you prompt." then "Now make it real" (two cards: Make it beautiful vs Make it real, the second with his face); "The best launch films mix motion with real footage" (three reference launch films, one with a rotating 3D cube); a chart slide with Intelligence vs Speed axes (5:40); then "Same graphics. Now with your photos and video." with three A/B tiles each having a Graphics | With media pill: a running man clip, "Where viewers leave" retention curve (with his face inset), "Ten thousand points" particle sphere (with a portrait). 6:39 "Does AI video always look like slop?" then "It looks generic when it has no real assets." then "Great cooking needs real ingredients." (rain widget; a 2x3 photo grid beside it). 7:14 to 7:58: the real gallery page with the pills; hummingbird line drawing becomes a real hummingbird; blue 3D sphere; a pixel-art platformer "30,000 years in 13 seconds"; "Edited in a pro editor" tile.
- Why it works: the toggle IS the argument. The viewer flips it and sees the lift themselves.

**8:09 to 9:20, "Connect image and video" (Higgsfield)**
- Says: Higgsfield is how he got the running-man clip; it was a photo from his YouTube channel; he gave the skill nothing else, it grabbed the photo and made a video (blue jeans, green jumper, even the train). Steps (spoken and shown): create a Higgsfield account via his link; in Claude click the plus arrow, choose Connectors, Manage connectors, use the search and type Higgsfield, press Connect, a browser tab opens, press Continue, it reopens Claude; from then on Claude can generate any image or video, and the Higgsfield site also gives you the newest models for video and image.
- Shows: his deck step "1 Add your Higgsfield key" (a masked API-key field; 8:08 to 8:23); his YouTube channel page (8:13); higgsfield.ai landing page ("AI IMAGE GENERATOR BUILT FOR PROFESSIONALS") and a Kling 3.0 promo (8:28 to 9:03); Claude Connectors UI (8:38 to 8:58). IMPORTANT MISMATCH: the spoken/live route is the Claude Connector (no key); his own slide and the skill's code use an API key in a .env file. They are two different routes. See section 3.
- Why it works: one-time setup shown click by click.

**9:20 to 9:47, "Approve the storyboard"**
- Says: the skill says "this is the storyboard I'm thinking": some code, you running, then a clip generated from Higgsfield, blending code and image; then it builds and integrates it. "Step three is where the magic happens."
- Shows: deck slide "2 Say yes to the storyboard" with a five-shot strip (time labels under each thumbnail, a "Cost check" chip and a green "Yes" button), then "3 It builds it" showing the retention chart "42% gone" with a "Done" badge (9:27 to 9:37). Small text not readable.
- Why it works: a cost-and-plan gate before any spend. This matches SKILL.md exactly (storyboard table with credit estimate, wait for a clear yes).

**9:47 to 11:10, Level 3 "Let Claude edit your videos"**
- Says: motion videos are fun but you need a system that moves the business; Claude has to become the editor. Everything on screen here was edited by Claude: the only input was a video of him; it designed graphics, text, music, sound effects and zoom-ins; people could not tell it from an editor he paid thousands for; also works on long-form (a Grok Bot video, "Level 1" onward).
- Shows: slide "Now let Claude edit it" (third card "Claude edits it"), then "Edited by Claude. No editor." with examples: a "Welcome, Alex" onboarding explainer card, a Grok Bot card, vertical short-form samples (10:02 to 10:31: a prompt box, a slash-command picker with "/motion" visible at 10:12, a code box "writes the...", a "Welcome, Alex" tile, "an MP4" - burned-in word-by-word captions in the lower half, his face below the graphic), a long-form strip "Long-form series, edited by Claude" with a "Level 7" bar-character chart (10:51 to 11:01), a Telegram-style chat ("send me a daily morning briefing at 8am" / "oh and make it a voice note").
- Why it works: it proves editing (cuts, captions, SFX, music) is also a prompt-able job, not just graphics.

**11:10 to 11:45, Promo block (skip for GTP)**: his Claude Code course ("updated a couple of days ago", beginner to building websites with these motion skills, a system for making Shorts on autopilot) and an "Agentic OS" with memory systems connected to Grok Bot. Screens: curriculum outline "Build a Real Website (Zero to Deployed)", Memory System, a radial memory chart, slide "Your own studio, on Pro".

**11:45 to 12:25, "Do you need to learn the software?"**
- Says: he once locked himself away for days learning Adobe After Effects ("A few Christmases ago...", a pixel-art jail gag "LEARNING AE DAY 1"); "Claude replaces this because you don't need to do it. Claude can actually drive it": it can drive Premiere Pro, CapCut, or do it itself; the short was "all done by prompting in English". Pilot analogy: you don't need to know how to fly the plane, you say the destination.
- Shows: "Do you need to learn the software?" (an editor timeline mockup), "You don't. Claude drives it.", "A cockpit with a thousand switches" (pixel mascot at the controls, caption "Claude flies it. You say where to go.").

**12:25 to 13:00, "Record once, turn the edit into a skill"**
- Says: his editing process: 1) record once, one take; 2) Claude edits it with the captions he wants, processes the audio, manages sound effects, lands it in his editor; 3) you get an output you can iterate on and then turn into a skill so it repeats. "We bring the graphics and the media together and you get a result that is outstanding." Next video: skills so powerful "it almost feels illegal".
- Shows: slide "How I edit it" with steps "I record once / Claude edits on the right words / It lands in my editor"; 12:35 "Every layer, off." (a clip that lets you switch layers off one by one, "Jack Roberts... was built by Claude"); 12:45 "Next: the skills" folder of "7 repos" (names legible: VoiceStudio, HyperFrames); end card with him pointing up (12:47 to 13:00 repeats the cold-open lines word for word).

## 3. Same skill or not? Local copy vs the video

Evidence (checked, not assumed):
- Upstream repo github.com/ItsssssJack/claude-video-2 has ONE commit, 2026-10-21T17:30:45Z, "Claude Video 2.0: free motion graphics skill (Motion + Media), gallery of 21 looks". 111 files.
- Local ~/.claude/skills/claude-video-studio has 111 files. Compared by git blob SHA: 111 identical, 0 differ, 0 missing either way. Same version, byte for byte. License MIT.
- Local `bash scripts/doctor.sh` on this machine: node v22.18.0 ok, ffmpeg ok, ffprobe ok, python3 ok, "ready". I did not run a render, so render time and the HyperFrames npx step are unverified.

Steps he shows that the local skill does NOT do or covers differently:
1. Level 3 (Claude as editor: cut, captions, SFX, music, zooms, hand-off to Premiere/CapCut, then "turn the edit into a skill"): NOT in this skill. SKILL.md ends at "Hand over". He teases separate repos ("7 repos", VoiceStudio, HyperFrames). You already have many neighbours installed (hyperframes-*, promo-video-*, videographer-*, higgsfield-*, gsap-*, scroll-craft, general-video, video-production). I did not test whether they reproduce his Level 3 result.
2. Higgsfield connection: he SAYS and SHOWS the Claude Connector route (plus, Connectors, Manage connectors, search Higgsfield, Connect). The skill's scripts/higgsfield.py uses an API key from console.higgsfield.ai in a .env file and its docs say never paste it into chat. Different mechanisms; the connector route needs no key file. This environment already lists a `higgsfield` MCP server (tools such as generate_image, generate_video, media_upload), so the connector route may already be live here (credits and login state not checked).
3. Install method: he says paste the repo URL into Claude and ask it to follow the skill. README says copy the folder into ~/.claude/skills/, then say "make me a motion graphic". Already done locally (invocation phrases in the SKILL description: "make me a motion graphic", "/claude-video-studio").
4. His interactive 26-slide presentation (stepper, mascot, A/B toggles) is his own artifact, not part of the skill.
5. His Skool library of style prompts is separate; the 21 styles in styles/ replace the need for it.
6. Cut from his telling but in the skill: doctor.sh, the ban list (no glow, no linear easing, one accent, at most 6 words on screen), 3 stills scored 1 to 10 until all are 8+, pacing_check.py (no dead gap over 1 s, nothing under 0.3 s), loop_check.py (frame 0 equals last frame), the credit-estimate gate, the smaller share-copy rule for files over 20 MB, and the sources list in references/hacks.md.

Steps he shows that match the skill 1:1: gallery of looks (21), pick one or paste 1 to 3 references, five questions, brief in numbers, loop decision, check frames, storyboard with a yes gate before any spend, Graphics vs With-media toggle in the gallery.

## 4. (b) Exactly how he uses Claude and Claude Code

Confirmed on screen or in captions:
1. Surface: the Claude app/web chat (white UI, "+" menu, Connectors). He says a normal Claude Pro plan is enough, no Teams plan. The skill itself is built for Claude Code (SKILL.md frontmatter, scripts), which his course teaches.
2. Install = paste the skill URL (GitHub repo or his gallery page) into Claude and say: "Hey there, I would like you to follow this skill, please." (spoken, 3:20 to 3:35). README alternative: copy the folder to ~/.claude/skills/ so you get ~/.claude/skills/claude-video-studio/SKILL.md.
3. Speak, do not type: he dictates with Glaido (sponsor; any dictation tool is equivalent).
4. First prompt for the skill, per README: "make me a motion graphic". Gallery opens (python3 ~/.claude/skills/claude-video-studio/scripts/gallery.py), pick a tile, answer five questions in one reply (defaults in brackets, or "go").
5. Prompts visible in the video: "Make me a launch video" (the average one-shot example, 1:51 to 2:00); "A weather widget for every sky" (cold open prompt bar); a slash command "/motion" in the Level 3 samples (10:12); "send me a daily morning briefing at 8am" then "oh and make it a voice note" (the Telegram bot sample, 10:46). A typed prompt at 10:02 reads like "a pira..." (not fully legible).
6. Not readable, so NOT claimed: the exact text he pasted into Claude at 3:32 to 3:37 and what Claude replied; the storyboard JSON table at 9:27; the Higgsfield result screen at 9:08.
7. Files the skill creates (from SKILL.md, not shown in the video): a work folder per piece, BRIEF.md, storyboard.json, proj/ (HTML + GSAP, rendered with HyperFrames), media/, stills/peek.jpg, out/draft.mp4, out/final.mp4.
8. Claude Code commands the skill runs (from SKILL.md, not shown on screen): `bash scripts/doctor.sh`, `python3 scripts/gallery.py`, `python3 scripts/storyboard.py storyboard.json`, `python3 scripts/higgsfield.py generate ... --out media/shotN.mp4 --yes`, `bash scripts/new_project.sh <work>/proj 16x9|9x16 <seconds> <style id>`, `bash scripts/stills.sh`, `bash scripts/render.sh <proj> <out> draft|high`, `python3 scripts/pacing_check.py`, `python3 scripts/loop_check.py`.
9. Requirements (README): Node 22+, ffmpeg, HyperFrames and GSAP (no separate install steps given), free fonts, HIGGSFIELD_API_KEY=key_id:key_secret only if you use AI clips.
10. His mental models to reuse as words: "chef with world-class ingredients but no recipe"; "you don't need to know how to fly the plane, Claude is the pilot, you say the destination"; "same prompt, same video as everyone"; "real ingredients" (photos and clips).

## 5. (c) A workflow a GTP presenter can demo live (target 5 min, with a safety net)

Assumes the café/shop example the owner already uses. Unverified: real render time. Do a dry run first (15 min) and time it.

1. (0:30) Pre-warm: run `bash ~/.claude/skills/claude-video-studio/scripts/doctor.sh`; start the gallery in the background (`python3 .../scripts/gallery.py`). Keep one finished MP4 ready as the swap-in.
2. (0:45) Show "average": type the one-line prompt "Make me a launch video for [Amina's Lunch Spot]" in a plain Claude chat (no skill). Show the generic result.
3. (0:30) Show "good": open the gallery tiles (they are real videos), flip one tile to "With media", press "Use this style" on one look.
4. (0:45) Say "make me a motion graphic". Claude sends the five questions. Reply: "1: Short, 8 s, 9:16. 2: 'Fresh lunch. Open till 3.' 3: loop yes. 4: our colours. 5: my photos."
5. (1:00) Claude writes BRIEF.md and the storyboard table. Show the table. If a shot is "generate" (AI clip), the credit estimate appears; wait for a spoken "yes" (the skill's own rule).
6. (1:00) Claude shows 3 stills with scores; approve. This is the audience's "AI checks its own work" moment (ties to your responsible-AI point).
7. (0:30) Cut to the pre-rendered MP4 ("here's one I cooked earlier"), then show pacing_check and loop_check output lines.
8. Fallback if anything stalls: play the pre-rendered MP4 and narrate steps 4 to 6 from screenshots.

Optional "make it real" add-on (+2 min): use a participant's photo (with their OK) and the Higgsfield route to make a 4 to 8 s image-to-video clip; keep the storyboard "yes" gate on camera.

## 6. (d) What belongs IN the GTP presentation, and how to show it

Map to your structure: ECO (Engage, Convert, Optimize) then AI (Attract, Interact). Everything here is recreated originally; no Jack assets, no gallery videos copied.

Belongs, in priority order:
1. **AI > Attract: "Same prompt. Same video as everyone." (his best single device).** Three identical cards morph/stay identical as the chat bar types a one-line prompt; red chips pop ("Big text", "A gradient", "A fade", "Same as everyone"). Then a before/after slider "One prompt vs the system" using YOUR sample (a food business, since the earlier slides use the food industry). This is your "Good looks like vs Average looks like" segment, already proven as a format.
2. **AI > Attract: "Make it real" toggle (Graphics | With media).** One element, one pill switch, instant swap between a plain graphic and the same graphic with a real photo/clip. Teaches why real product photos beat stock-AI. Build it as a click target on the slide.
3. **The chef analogy (20 s).** Pixel or illustrated chef: ingredients (brand, photos, ICP data) plus recipe (skill) vs a bare prompt. Maps to your "keep your own voice" and slop-monster message; his own line "99% of people end up with AI slop because they don't use the correct system" is the same sentence you want.
4. **The five habits as a 5-step card row for the brand-asset tool and "Attract":** Pick one style (their brand), use real references (their best content and competitors), write the brief in numbers (size 1080x1920, 8 s, hex colours), decide if it loops (website hero, story loop), check the frames not the code (human or AI review). This is also the skeleton for the end-of-day tool that scans their brand and creates assets.
5. **Short ad videos for Attract (8 s, 9:16, looping).** Pre-render 3 to 4 in different looks for the audience's industries; autoplay muted loops inside device frames. Show a real one playing next to its storyboard.
6. **"Record once, Claude edits" for ECO > Engage (consistency).** One phone video becomes captions, cuts, SFX, a short; show as a 3-step strip (I record once / Claude edits on the right words / It lands in my editor). Mark as "what is possible" unless you verify it with your own skills first (his Level 3 is not in the skill).
7. **Design moves from his deck worth re-creating (your "keep it moving" goal):** top 3-step progress stepper that fills as you advance; a "NN / 26" page counter plus vertical dot nav; cards that say CLICK and reveal on click or right-arrow; a small roaming mascot that carries the eye across slides; highlight-word captions (serif italic, key words in a second colour); face-cam bubble (optional); one idea per slide with a short serif headline; A/B pills on media tiles. All describable and buildable from scratch with GSAP; none needs his files.

Do NOT include: the 11:10 to 11:45 course plug, the Glaido sponsor, any of his videos/clips/thumbnails, or the Skool prompts. His channel page and Higgsfield/Kling promo screens are third-party screenshots; study only.

How to show each in the deck: component name + behaviour so another agent can build it: `ab-slider` (drag handle, two videos, autoplay muted loop); `media-toggle` (pill switch swapping two layers, 200 ms cross-fade); `same-prompt` (typed text then three cards that stay identical, chips staggered 120 ms); `stepper-5` (five cards that light up in order); `ad-loop` (8 s mp4, 9:16, <2 MB, poster frame, lazy-load, pauses off-screen).

## 7. (e) What needs your accounts or paid services

1. Claude Pro or Claude Code: already yours; he says Pro is enough. No Teams plan needed.
2. Higgsfield (AI image-to-video clips): needs YOUR Higgsfield account and credits. Two routes: Claude Connector (no key) or API key in a .env (never in chat). A `higgsfield` MCP is already listed in this environment; I did not call it, so login state and credit balance are unknown. Every AI clip costs credits and the skill requires a storyboard and a clear "yes" first. Pure-graphics pieces and pieces from your own photos are free.
3. ElevenLabs (you said paid): not used by this skill. The skill turns generated sound off and says "sound belongs in the edit". Voice-over, music, SFX would come from ElevenLabs or your hyperframes-audio / promo-video-voice skills; untested here.
4. No cost: ffmpeg, Node 22+, HyperFrames, GSAP, free fonts (all present or free; doctor says ready).
5. Glaido (his dictation sponsor) and his Skool/course: not needed.
6. For me to finish the listening half: your logged-in YouTube session (cookies) or you downloading the file yourself, because anonymous download is 403. Needs your say-so.
7. For the Gemini cross-check: a working Gemini key. The one in ~/.claude/.env is rejected by Google (API_KEY_INVALID). A fresh key from Google AI Studio fixes it.

## 8. Open questions for the owner (AskUserQuestion-ready)

1. Q1 (recommended: yes): May I run yt-dlp with your browser cookies (yt-dlp --cookies-from-browser) to download the video, then run whisper and Gemini on it, to finish the listening half?
2. Q2: Replace the invalid Gemini key in ~/.claude/.env with a fresh one?
3. Q3: Should Level 3 (Claude as editor) be in the deck as "what is possible", or only after we prove it with your hyperframes/promo-video skills?

## 9. Evidence index (all internal, paths absolute)

- Full-HD frames 0:00 to 3:00, labelled contact sheets (9 frames each, 4 s apart): C:/Users/loxly/Desktop/Projects/Loxly - Personal Projects/GTP Presentation and Tools/experience/research/v1/hires-sheets-0-180s/ (sheet_00045.jpg 0:04 to 0:36, sheet_00411.jpg 0:41 to 1:12, sheet_00752.jpg 1:15 to 1:49, sheet_01113.jpg 1:51 to 2:22, sheet_01474.jpg 2:27 to 2:59).
- Whole-video scrubber sheets, 18 files, labelled with timestamps (about 5 s per tile): .../experience/research/v1/scrubber-sheets-whole-video/sb_00.jpg to sb_17.jpg (sb_04 = 2:57 to 3:41 ... sb_17 = 12:35 to end).
- Key full-size frames: .../experience/research/v1/key-frames/w_00591.jpg (0:59 "Three steps to a studio look"), w_01198.jpg (1:59 "Same prompt. Same video as everyone."), w_01766.jpg (2:56 chef "With the system / Without a system").
- Supplementary YouTube auto-captions in 15 s blocks: .../experience/research/v1/youtube-autocaptions-15s-blocks.txt (reading aid only; contains caption errors).
- Upstream comparison: gh api repos/ItsssssJack/claude-video-2 (tree + commits); local doctor.sh result "ready".
- Creator-supplied chapter list (exact): 0:00 Claude Motion 2.0; 1:06 Level 1; 1:51 Why One Prompt Isn't Enough; 3:03 The Free Skill and Five-Step System; 3:40 Find Real Design References; 4:10 Write the Brief, Build Loops and Check Frames; 5:11 Level 2; 8:09 Connect Image and Video; 9:20 Approve the Storyboard; 9:47 Level 3; 11:10 Claude Code Course and Agentic OS; 12:25 Record Once and Turn the Edit into a Skill.

Next action (you, 2 min): answer Q1 above so the next agent can download, transcribe and Gemini-check the video.
