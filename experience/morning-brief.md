**Next action (1 min): open http://127.0.0.1:8765/ in Chrome. The deck is already running there.**

# Morning brief · Wed 28 Oct · talk at 08:00

## 1. Start the deck (2 min)
1. Port 8765 is already serving tonight's build (python, PID 52972, commit `44b6d56`). Open http://127.0.0.1:8765/
2. Only if that page does not load, run this from the project root:
   ```bash
   netstat -ano | grep ":8765 .*LISTEN"   # empty output means the port is free
   npm run serve                          # = python -m http.server 8765 --bind 127.0.0.1
   ```
3. Keep it on 8765. The live runner only accepts calls from `127.0.0.1:8765` or `localhost:8765`.
4. Press F11 for full screen. Move with NEXT only. Do not edit the `#` part of the address: it throws an error.

## 2. Start the live runner (1 min)
1. From the project root (commands from `live-runner/README.md`):
   ```bash
   netstat -ano | grep ":8790 .*LISTEN"   # empty output means the port is free
   node live-runner/server.mjs            # prints: GTP live runner on http://127.0.0.1:8790
   ```
2. Open http://127.0.0.1:8790/health. It lists each kind as ready or blocked, and the runs left before the spend ceiling.
3. If 8790 is taken: free it. (Another port needs `LIVE_RUNNER_PORT` plus a matching `runnerUrl` in the deck.)
4. If the runner dies mid-talk, the deck shows the tagged cached run in under 1 s. Say the cached line on the cue card.

## 3. What is ready
1. All 15 scenes, 01 / 15 to 15 / 15, using NEXT only. 0 console errors on the local walk.
2. Motion on arrival in all 15 scenes.
3. Every cached run shows its "CACHED RUN" tag. Scene 15 says "Cached runs · Amberkloof demo data · recorded 27 Oct 2026".
4. Both QR codes decode to live pages (deck root and `/tool/`).
5. No "lunch" anywhere. Scenes 06 and 07 say "gift set for 20 guests".
6. Scene 12: our plain redesign next to the real oryzo.ai, live (needs Wi-Fi).
7. Runner off: the cached tag shows in 62-90 ms. Scene 08 helper shows "Scripted fallback" in 109 ms.
8. 8 live kinds run for real: competitor-scan, content, seo-plan, blog-calendar, keywords, seo-audit, backlink-analyzer, geo-citability. Each takes 22-52 s.

## 4. Stage test: FAIL on 4 items (how to handle each on stage)
Full report: `experience/evidence/stage-0800/checklist.md`
1. **Scene 11 end hold is still.** 0.094% change over 10 s (bar 0.5%). The shop-window photo sits at "End of scene · press Next". On stage: press NEXT as soon as you finish talking.
2. **Scene 08 freezes after "Run the helper live".** 0.000% motion. The click calls `hold()`, and `ch-0810.css:464` pauses every animation. On stage: press SPACE to restart motion, or NEXT to move on. The helper answer shows blurred, so say the scripted answer out loud.
3. **Code-drawn stand-ins instead of real media in scenes 04, 06, 09, 11 and 15.**
   - Scene 04 phone and the scene 06 Average/Good pair: the files exist (HTTP 200), but `ch-0407.js:81` marks a lazy image missing before it loads, and `ch-0407.css:38` hides it, so it never loads. Fix: about 10 min.
   - 9 slots point at files that were never made (HTTP 404): `B2-M29.mp4`, `B3-M32a/b/c`, `B4-M46/47/48`, `B5-M50/51`.
   - On stage: the stand-ins are clean drawings, not broken images. Talk to the idea.
4. **Fallback github.io has 1 console error:** 404 for `favicon.ico`. All 15 scenes still reach via NEXT. The audience never sees it.

Also seen, not scored:
- Scene 04 hold: the Verdict card covers part of the channel wheel.
- Scene 07 hold: the "Gift sets for 20 guests" block covers the headline and search pill.

## 5. Your one decision before 08:00
1. Reply **"fix 04/06 images"**: I fix the lazy-image bug in `chapters/ch-0407.js` (lines 78-83) and re-check scenes 04 and 06. About 10 min, then 5 min to check.
2. Or reply **"present as is"**: nothing changes.

## 6. Script and cue card
1. Cue card (print it, circle your opener): `experience/presentation-cue-card.md`
2. Full script, every line: `experience/presentation-script.md`

## 7. Fallback plan (if the laptop deck fails)
1. Open https://loxlyatkinson.github.io/gtp-eco-workshop/ (HTTP 200, checked this morning).
2. It is the older published build, not tonight's rebuild. Scenes 04-07 still have the old Amina content. Talk from the script there, not from the slide.
3. No live runs from github.io. Use the cue-card line: "Not switched on today. Here's what it does."
4. Last resort: printed cue card and script, no screen.

## 8. Owner gates still open (only you can do these)
1. **Brand logos (OG-BRAND), about 10 min.**
   - Accept the brand terms and download the WhatsApp, Facebook, Instagram and LinkedIn packs.
   - Choose: TikTok as a text label, or ask TikTok for permission.
   - Choose: Instagram kept in the wheel, or shown on its own (its rules forbid it next to other networks).
   - Google Business Profile needs a Partner Hub account.
   - Until then the wheel uses text wordmarks.
2. **Keys (OG-KEYS).** Checked this morning, presence only:
   - `FIRECRAWL_API_KEY`: set.
   - `APIFY_API_TOKEN`: not set, so B2B find shows "needs a key".
   - `SCRAPECREATORS_API_KEY`: not set. Last 30 Days is switched off in code anyway.
   - Not needed for 08:00. The cue card covers "needs a key".
3. **Release/deploy (OG-RELEASE).** Reply "deploy" to publish tonight's build to github.io. Wait until after the talk: the build still has the 4 FAIL items above.
4. **Skills upload test (OG-INSTALL), 2 min.** Upload `skills/downloads/seo-audit.zip` at claude.ai (Customize > Skills > + > Upload a skill). Tell me if it was accepted. The `/skills/` page stays 404 until release; the deck shows it only as text marked "available after release".

## 9. Media
Made (all in `assets/gen/`, prompts in `assets/gen/MANIFEST.md`):
1. 19 images (Codex image generation) plus 1 crop: Amberkloof hero, product family, phone stage, stage plate, Tumelo hero, 3 personas, the flat "Average" photo, the Average site hero, 7 platform scenes, and the Responsible AI and Learn-next backgrounds.
2. 6 silent 720p videos (ElevenLabs, Veo 3.1 Lite): transition reel, amber float, ad good, ad average, Tumelo, hero loop. Cost: 5,090 credits (about USD 1.85).
3. Known video flaws: the transition reel and Tumelo clip show tiny unreadable fake text. The hero loop shows a drop moving upward at about 5-6 s.

Blocked:
1. 5 isolated product shots (`prod-face-oil`, `prod-body-butter`, `prod-hand-wash`, `prod-lip-balm`, `prod-gift-set`). The Codex image limit hit at about 04:10 and resets 2 Nov. `amber-family` stands in.
2. The 9 missing slot files listed in section 4.
3. No video remakes: about 329 ElevenLabs credits are left.
4. Downloaded reference clips R1-R5: not found in the project. The R1 reel plays as a live Instagram embed, so it needs Wi-Fi.

## 10. Final check at 07:45 (5 min)
1. Deck on 8765, full screen, scene 01.
2. Runner up: http://127.0.0.1:8790/health answers.
3. Wi-Fi on (oryzo.ai, the Instagram reel and the ad embeds need it).
4. Fallback tab open on the github.io link.
5. Volunteer at the door (scene 04 consent).

Next: open http://127.0.0.1:8765/ and press NEXT once to see it move.
