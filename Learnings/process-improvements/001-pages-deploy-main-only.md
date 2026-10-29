---
type: process-improvement
title: GitHub Pages deploy is refused from any branch except main
severity: MEDIUM
discovered: 2026-10-28
session: 1
tags: [github-pages, deploy, environment-protection]
---

# Problem
A Pages deploy from a `pages-live` branch failed: the github-pages environment only allows deployments from `main`.

# Root cause
Environment protection rule on `github-pages` (deploy branch policy = main). The workflow `.github/workflows/pages.yml` is workflow_dispatch only.

# Fix
Make a website-files-only commit on main (exclude experience/, scripts/, scrollcraft/, AGENTS.md, presentation-inspiration.md), then `gh workflow run pages.yml --ref main`, then smoke test 3+ routes with curl.

# How to diagnose next time (2 min path)
1. Failed deploy job says the branch is not allowed → check repo Settings → Environments → github-pages.
2. Do not create deploy branches; go straight to main.

# Prevention
Always deploy from main with a files-by-name commit (RULE 6). Never ship experience/ or raw evidence (AGENTS.md).

# Related
- Commit 7274921 (main), experience/handoff-1030.md
