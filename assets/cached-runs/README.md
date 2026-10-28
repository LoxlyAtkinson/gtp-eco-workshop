# Cached runs

Next step: G02-T07 points each Engage live slot's `cachedUrl` at the matching file here.

Status (2026-10-27): 8 of 10 kinds are recorded, from real runs through `live-runner/run-once.mjs` with the locked tool set (`--tools`). The raw logs are in `experience/evidence/g02-runs/cached/`.
- **Rebuild them with:** `node scripts/build-cached-runs.mjs`. It refuses any run that lacks the skill marker, a successful result or `--tools`.
- **Not recorded:** `last30days` is disabled until review and needs a key. `b2b-find` needs a key.
- **The 3 site kinds** (`seo-audit`, `backlink-analyzer`, `geo-citability`) scanned the owner's own published deck. Each file says so in `label` and `target`.

1. **What lives here.** The fallback the deck shows when a live run fails, can't reach the runner, or has no complete result 20 s after the scene reveal. The deck always shows it with a "cached run" tag.
2. **File names.** One file per kind: `<kind>.json`. The kinds are `competitor-scan`, `last30days`, `b2b-find`, `content`, `seo-plan`, `blog-calendar`, `keywords`, `seo-audit`, `backlink-analyzer` and `geo-citability`. They match `live-runner/lib/kinds.mjs`.
3. **Shape.**
   ```json
   {
     "kind": "seo-audit",
     "skill": "seo-audit",
     "business": "Amberkloof",
     "label": "Demo data: Amberkloof is an invented brand",
     "recorded_at": "2026-10-28T01:00:00.000Z",
     "request": { "business": "...", "url": "...", "category": "...", "area": "..." },
     "text": "<the skill's final answer, markdown>",
     "rows": [ { "name": "...", "address": "...", "website": "...", "maps_url": "...", "rating": 4.6 } ],
     "source_log": "experience/evidence/g02-runs/cached/<kind>-<stamp>.stream.jsonl"
   }
   ```
   - `text` holds the answer for Claude skill kinds.
   - `rows` is used only by `b2b-find` (Apify).
   - `source_log` points to the raw log that proves the skill ran. That log stays in `experience/` and is never published.
4. **Rules.**
   - Never write these by hand. Each file must trace to a raw log that has the skill marker ("Base directory for this skill").
   - Before shipping, scan each file for keys and personal data.
   - Always use the invented-brand label. When a run scanned a stand-in site, the label and `target` must say so (PROVISIONAL decision D18 in `experience/research/g02-live-run-paths.md`).
