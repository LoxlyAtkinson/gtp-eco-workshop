---
type: problem-resolution
title: The deck kept showing the old drawing after index.html changed (browser cache on python http.server)
severity: MEDIUM
discovered: 2026-10-28
session: 2
tags: [cache, http.server, verification, index.html]
---

# Problem
After replacing the `#g1-bottle` symbol in index.html, the Browser pane still drew the old bottle. `document.querySelector('#g1-bottle').innerHTML` showed the old paths although the file on disk and `curl` of the server both had the new `<image>`.

# Root cause
`python -m http.server` sends Last-Modified but no Cache-Control, so Chrome reuses a heuristically cached `index.html`. Assets have `?v=` cache busters; `index.html` itself does not.

# Fix
Reload with a throwaway query (`http://127.0.0.1:8765/?r=3#06-08`) or Ctrl+F5. Bump `?v=` on every changed CSS/JS link.

# How to diagnose next time (1 min path)
1. Compare `curl -s http://127.0.0.1:8765/index.html | grep <marker>` with the live DOM.
2. If they differ: cache. Reload with a new query string.

# Prevention
Before any screenshot proof after an index.html edit, load the deck with a fresh query string. Tell the owner to Ctrl+F5 on the presenter laptop after updates.

# Related
- index.html `#g1-bottle` symbol; assets/gen/bottle-cutout-v2.webp
