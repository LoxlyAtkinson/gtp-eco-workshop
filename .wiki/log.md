# GTP Interactive ECO Workshop — session log

## [2026-10-28] session | Session 1 (logged) -- Public deploy, live audience stage, skills pack, real images

**Duration:** ~10h (overnight 2026-10-28, ~01:00 to ~11:15)
**NLM Note:** see .claude/project-config.json → notebookLm.sessions

### Accomplished
- Public deck live on GitHub Pages: commit 7274921 on main (website files only), `gh workflow run pages.yml --ref main`, smoke test routes 200, `assets/ref` 404 as intended.
- Commit 9a24857 on codex/cinematic-candidate: owner copy feedback (scenes 03-09), reference clips strip (scene 11, local only), stage-test fixes (deckHold, is-missing logic, hashchange handler, s11 drift, video readyState race, scene 07 overlap).
- Live audience stage built (uncommitted): live-runner/lib/stage.mjs + 6 stage kinds (scan, ideas, competitors, keywords, ad-plain, ad-video), chapters/stage.js/css, join/, vendor/qrcode. Tester PASS 25/25 against the real runner; closure PARTIAL (9 low defects in tasks/wvwnxweh7.output).
- Supabase "SAIS Website" (ref efkgdafxzbsdhjbspavs, owner-approved): tables stage_submissions (anon insert only) and skills_requests (RLS on, pack column) created.
- Skills pack flow (uncommitted): skills/get/, skills/guide/, supabase/functions/skills-request/, scripts/upload-skills-pack.mjs.
- Survivor closing: experience/survivor-closing.md + chapters/closing.js/css.
- 21 labelled real images generated with Codex: assets/gen/*-v2.webp (not wired yet), MANIFEST.md updated.
- Owner feedback items 17-28 recorded in experience/owner-feedback-0400.md.
- Jay email drafted in chat (owner sends it).

### Pending
- Runner must load .env.local (DataForSEO, Apify, Supabase) — currently reports "not set".
- Join popup on public deck posting to stage_submissions; prove a real submit shows in "Show websites".
- Wire the 21 -v2 images, remove Slack from scene 09, local Instagram reel, fix 9 tester defects.
- Product video via fal.ai (connector only loads in a new session); Higgsfield balance 0.
- Smart skills pack (separate bucket, licences), voice presenter assistant (deck mic + cue map + Jev Ultrafast).
- Commit by name, deploy website files to main, Pages workflow, smoke test.
- Handed to session local_50691847 ("GTP deck: fal video, new images, voice assistant"), running.

### Decisions
- Supabase = SAIS Website (owner); the smart-ai-website ref cqxpunaoeiqhijygeteo is not visible to the token.
- No tunnels: audience intake goes via Supabase, plus a local "Add a website" fallback.
- Skills: main pack = 8 official Anthropic marketing skills; special link = slopmonster, last30days, competitor-analysis renamed "Smart…" in a separate bucket, original licences kept.
- Presenter assistant = "Mic in the deck + Jev drives".
- Pages deploys only from main (environment rule); deploy = website-files-only commit on main.

### Key Files Modified
- scroll-presentation.js — hashchange fix, window.deckHold
- chapters/ch-0407|0810|1115.js/css — hold via deckHold, stand-in logic, scene 07 layout, s11 drift
- index.html — copy feedback, cache bumps, ref clips, stage/skills/closing wiring
- live-runner/server.mjs, lib/kinds.mjs, lib/stage.mjs — stage kinds, spend ceiling 90
- experience/handoff-1030.md — full resume state

### Environment State
- Services: deck 127.0.0.1:8765 (PID 77256); local Supabase 54321 (PIDs 75300, 13604). Runner 8790 not listening at save.
- Git: branch codex/cinematic-candidate, 59 uncommitted/untracked entries.
- Build: static site, no build step.

### Next Session
1. Check the linked session local_50691847 result (fal video, images, voice assistant) before redoing anything.
2. Runner loads .env.local, then prove keywords + Apify competitors live.
3. Join popup → Supabase → "Show websites", browser-proved.

### Lint
- wiki-lint.py: score 100/100, 0 stale pages, 0 empty sections.
- Learnings: Learnings/process-improvements/001-pages-deploy-main-only.md, Learnings/problem-resolutions/002-video-loadeddata-race.md

## [2026-10-28] session | Session 2 -- Integration: fal video, runner keys, join popup, v2 media, Smart pack, voice presenter

**Duration:** ~2.5h (11:13 to ~13:45)
**NLM Note:** see .claude/project-config.json session 2

### Accomplished
- fal.ai product video `assets/gen/vid-amber-float-v2.mp4` (MiniMax H3 Max, owner pick over Kling 3.0 Pro; label legible in all checked frames) in B2-M29 + B3-M31; new labelled scene 01 hero loop `vid-hero-loop-v2.mp4`; real bottle cutout `bottle-cutout-v2.webp` (BiRefNet) now drawn by the `#g1-bottle` symbol (30 uses). fal spend ~US$1.17.
- Live runner loads `.env.local` (`live-runner/lib/load-env.mjs`); all 6 stage kinds READY; stage-keywords (DataForSEO) and stage-competitors (Apify) browser-proved in the live stage on woolworths.co.za.
- Join popup on the deck (`?join=1`, `chapters/join-popup.js`, shared `join/join.js`), anon config via `scripts/write-join-config.mjs`; real submit edenfm.co.za/Test appeared in Show websites (Supabase source).
- 18/21 v2 images wired; gift box + scene 11 pair real photos; Slack removed from scene 09 (+ script, now 60:20); R1 reel plays local clip, no Instagram link/iframe/request; stage defects D1-D9 + rail clip + broken scan logo fixed; caption for the new "Ours" clip rewritten (deslop 5/5).
- Smart skills pack: SmartSlopMonster + SmartLast30Days (MIT, licences + NOTICE kept), private bucket `smart-skills`, signed link to 2026-11-27 in build/smart-skills/link.txt; competitor-analysis excluded (no licence).
- Voice presenter assistant delegated to a background agent (chapters/voice-cues.*, scripts/build-voice-cues.mjs, scripts/start-presenter.ps1); report pending at save time.

### Pending
- Voice agent report + integration review; rebuild cue map after the 08-6 line change.
- Rerun `node scripts/regress-merge.mjs . http://127.0.0.1:8765/` (scene 12 goto timed out under 3-browser load).
- Commit by name on codex/cinematic-candidate; copy website files into the prepared worktree of origin/main (scratchpad/main-wt), push, `gh workflow run pages.yml --ref main`, RULE 13 smoke. Owner APPROVED publishing.
- F2 (scene 06 B2-M29 slot) only DOM-verified; phone viewport not checked for new media.

### Decisions
- Owner: fal H3 Max over Kling (label legibility); new fal hero loop (~US$0.13); real bottle cutout everywhere (~US$0.001); publish approved.
- competitor-analysis left out of the Smart pack (no licence or author anywhere locally).
- Public build: the scene 08 reel falls back to our own float clip (no Instagram).

### Key Files Modified
- index.html -- v2 media, symbols, Slack removal, reel, join popup tags, caption
- chapters/stage.js, chapters/stage.css -- D1-D9, rail, scan logo, ?join=1 QR
- chapters/ch-0810.js/.css -- Slack removal, 3-place orbit, local reel player
- chapters/ref-clips.js -- no Instagram links
- chapters/ch-1115.css -- real gift box base/lid
- chapters/join-popup.js/.css, join/join.js, join/join.css, join/join-page.css, join/config.js
- live-runner/lib/load-env.mjs, live-runner/server.mjs, live-runner/lib/stage.mjs (JOIN_URL), live-runner/test/stage.test.mjs
- scripts/write-join-config.mjs, scripts/build-smart-skills.mjs, scripts/upload-smart-skills.mjs, scripts/smart-skills/last30days-LICENSE
- assets/gen/*-v2 media, assets/gen/MANIFEST.md, experience/progress.md, experience/presentation-script.md, .github/workflows/pages.yml, .gitignore

### Environment State
- Services: deck python http.server 127.0.0.1:8765 (PID 45728), live runner 127.0.0.1:8790 (PID 46244), both started this session.
- Git: codex/cinematic-candidate, 83 uncommitted paths; worktree of origin/main at scratchpad/main-wt (7274921).
- Build: no build step (static); runner tests 6/6.

### Next Session
1. Read the voice agent report; integrate and verify.
2. Regression rerun, commit by name, publish to main, run pages.yml, smoke-test.
3. Fresh independent judge on the evidence (G07 critics).

### Lint
- wiki-lint.py: score 100/100, 0 orphans, 0 broken links, 0 stale pages, 0 empty sections.
- Learnings: Learnings/problem-resolutions/003-connector-on-other-account.md, Learnings/problem-resolutions/004-stale-index-html-cache.md, Learnings/process-improvements/005-reach-a-beat-by-wheel.md

### Addendum (~14:00): released
- Branch commit 72727a2; main 7274921 -> 0d97926 (website files only); pages.yml run 40683672840 success.
- Regression 3: desktop + phone holds 15/15, Next 14/14, 4xx 0 (60 s wait for scene 12 oryzo.ai frame).
- RULE 13 smoke: 20/20 routes 200, bytes = local; assets/ref and experience 404. Public check: ?join=1 popup live, labelled hero, no voice pill, reel fallback plays our clip, 0 instagram.com requests.
- Still open: real spoken voice run (owner mic), visible-window launcher, G07 fresh critics.
