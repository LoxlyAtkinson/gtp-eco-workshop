---
type: problem-resolution
title: A claude.ai connector the owner just added did not appear in the Code session
severity: MEDIUM
discovered: 2026-10-28
session: 2
tags: [connectors, fal, mcp, claude-desktop]
---

# Problem
The owner added fal.ai as a claude.ai connector (OAuth done) and started a new session, but no `mcp__02cc24f9-…` tools loaded. ToolSearch found nothing; `session_connectors_status` did not list fal.

# Root cause
The desktop app's connector list for the signed-in account did not include it yet. `mcp__mcp-registry__list_connectors` showed only Claude Docs, ElevenLabs, Jam and visualize, so the connector was not on the account the app was using at session start. After the owner restarted the app, the fal tools (`mcp__02cc24f9-244e-4ec3-b356-9625c7a1f70b__*`) loaded.

# Fix
Owner restarts the desktop app (or re-adds the connector on the same claude.ai account as the app), then starts a session.

# How to diagnose next time (2 min path)
1. `mcp__ccd_connectors__session_connectors_status`: is the connector listed at all?
2. `mcp__mcp-registry__list_connectors`: does the signed-in account have it?
3. If not listed on the account: it was added elsewhere or the app has not refreshed; ask for a restart. Do not try to read keys from `.env.local` as a workaround (blocked by the deny rule, and the classifier refuses it).

# Prevention
After the owner adds a connector, check `list_connectors` before planning work that depends on it.

# Related
- experience/handoff-1030.md (Update ~11:10)
- assets/gen/MANIFEST.md "v2 videos (fal.ai…)"
