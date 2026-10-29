---
type: problem-resolution
title: Video stand-in stayed visible because loadeddata fired before the listener was attached
severity: LOW
discovered: 2026-10-28
session: 1
tags: [video, events, race-condition, stand-in]
---

# Problem
The scene 11 "Good" video showed as missing in the stage test although the file loaded.

# Root cause
`loadeddata` had already fired before the chapter script attached its listener, so the "loaded" handler never ran.

# Fix
Check state first: `if (vid.readyState < 2) fig.classList.add('is-missing');` and for images `if (!img.getAttribute('src') || (img.complete && !img.naturalWidth))`. Lazy images were wrongly hidden before this fix.

# How to diagnose next time (5 min path)
1. In the browser, read `vid.readyState` on the stuck element.
2. If it is >= 2 the event already fired: switch to a state check.

# Prevention
Never rely only on load events for media that may be cached; read readyState / complete first.

# Related
- chapters/ch-0407.js
