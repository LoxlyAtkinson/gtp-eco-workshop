# Handoff 2026-10-28 ~10:30 (resume here after compaction)

Live: https://loxlyatkinson.github.io/gtp-eco-workshop/ (main 7274921, website files only). Stage deck commit 9a24857 on codex/cinematic-candidate (local, unpushed branch).

Running: workflow wf_6ed2ad45-f36 "gtp-live-audience-stage-v2" (backend runner kinds + Supabase adapter, deck stage overlay + join page, skills/get + guide + edge function, closing beat in scene 15, then a fresh tester). Wait for its notification; read journal if result unclear.

Done this morning:
- Supabase "SAIS Website" (efkgdafxzbsdhjbspavs): tables stage_submissions (anon insert only) + skills_requests (RLS, no anon policy). Keys in git-ignored .env.local (owner deny rule blocks reading it; runner must load it at runtime).
- .env.local holds DataForSEO login/password, Supabase URL/anon/service/access token, APIFY_API_TOKEN (owner pasted).
- 21 labelled real images in assets/gen/*-v2.webp (see MANIFEST "v2 (labelled, real)"); NOT wired in yet.
- Product video BLOCKED: Higgsfield balance 0. Quote: Seedance 2.5 6s 720p = 42 credits; Kling 3.0 Turbo 6s = 9. Settings in MANIFEST.

Next after the workflow lands (owner-feedback-0400.md items 18-28 are binding):
1. Integrate stage build; wire join form as a POPUP on the public deck (QR -> ?join=1) with Supabase anon config; runner reads .env.local.
2. Wire -v2 images into slots (B1-M03 hero, B2-M26b family, B4-M41 phone, B5-M50/51 gift box, B4-M46/47/48 scene 11 pair, B1-M09 satellites, personas, platform scenes).
3. Remove Slack from scene 09; replace the Instagram reel embed with the local clip (stage) so nothing opens off-site.
4. Smart skills pack: slopmonster, last30days, competitor-analysis renamed Smart*, separate Supabase bucket + special link; keep licences, drop any skill without a shareable licence.
5. Voice presenter assistant: deck mic (Chrome speech-to-text) + cue map from presentation-script.md; Jev Ultrafast (C:/Users/loxly/.agents/tools/jev/start-ultrafast.ps1) opens and runs the deck.
6. Fresh browser test, commit (stage files by name), deploy via a website-files-only commit on main + gh workflow run pages.yml --ref main, smoke test.
Email to Jay drafted in chat (owner sends it).

## Update ~11:00
- Stage workflow wf_6ed2ad45-f36 DONE. Fresh tester verdict: PASS, 25/25 checklist items on the real runner (Show websites only on click, back-to-front drum, scan, 3 ideas, competitors, plain ad). Closure PARTIAL: 9 low-severity defects open (full list in the workflow output tasks/wvwnxweh7.output, key "test"); keywords + video + live Supabase read not yet run.
- Runner start: check port 8790 free, then `npm run stage`. The runner reads env vars; it must also load the git-ignored .env.local (owner keys) - verify, since the backend agent reported DataForSEO/Apify "not set".
- Nothing from the workflow is committed yet. Next session: integrate (load .env.local, join popup on public deck, -v2 images, no Slack, local reel), fix the 9 defects, re-test, commit by name, deploy.
- ElevenLabs credit check: built-in browser not signed in; owner asked to sign in at elevenlabs.io/app/subscription in the Browser pane.

## Update ~11:05
- Owner is setting up FAL.AI for video generation. Key goes in .env.local as FAL_KEY= (fal standard name). Use fal image-to-video from assets/gen/float-3d-v2.webp (slow orbit, floating botanicals, label legible, 6 s, 16:9). Quote the cost first; save as assets/gen/vid-amber-float-v2.mp4 + poster; check 4 frames.

## Update ~11:10
- Owner connected FAL.AI as a claude.ai connector (claude.ai/customize/connectors, id 02cc24f9-244e-4ec3-b356-9625c7a1f70b) with OAuth. It does NOT show in the old session tools; start a NEW session so the fal tools load, then make the product video with fal (quote cost first). The mcp__elevenlabs__ server (owner account) is also connected: check its credit cost with estimate_only before using it.
