---
type: process-improvement
title: To screenshot one beat of the scroll deck, pause and wheel-step; hash jumps and JS polling are unreliable
severity: LOW
discovered: 2026-10-28
session: 2
tags: [browser-proof, gsap, scroll-deck, screenshots]
---

# Problem
Proving a single beat (scene 08 reel, scene 11 pair) took many attempts: `#08-05` landed on a different sub-beat, the deck auto-scrolled past the beat before a screenshot, and `javascript_tool` loops that polled opacity while GSAP animated hit the 45 s tool timeout.

# Root cause
URL hashes are scroll sub-steps (08-29, 08-51…), not script beat ids; elements reveal by scroll progress (`data-in`/`data-out`), so a paused deck at the scene start never shows them. The auto-scroll state persists across reloads.

# Fix
1. Navigate to the scene hash, press Space to pause (deck shows "Paused").
2. Wheel-scroll 5-10 ticks at a time, screenshot at 0.5 scale, step back 2 ticks if overshot.
3. Use DOM checks (src, has-media, naturalWidth) only as supporting proof.

# How to diagnose next time
If a `javascript_tool` poll times out, stop polling; switch to pause + wheel steps.

# Prevention
Keep polls under 30 s and never poll while the deck animates; also front the deck tab (a file:// tab opened by the file watcher throttles background timers).

# Related
- experience/evidence/final-1330/checklist.md
