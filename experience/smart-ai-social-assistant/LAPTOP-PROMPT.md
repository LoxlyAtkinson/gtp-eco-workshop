# Prompt for Claude Code on the presenter laptop

Paste everything below the line into Claude Code on the laptop.

---

Set up this Windows laptop to present the GTP ECO workshop today, including the live "Smart AI Social Assistant" demo on beat 14.5. Work in this order and stop to tell me if a step fails.

1. GitHub: run `gh auth status`. If not signed in as LoxlyAtkinson, run `gh auth login --web` and give me the one-time code to approve in the browser.
2. Clone both private repos side by side (the folder names matter, the live runner finds the app as a sibling folder):
   - `gh repo clone LoxlyAtkinson/gtp-presenter-laptop C:\GTP\gtp-presenter-laptop`
   - `gh repo clone LoxlyAtkinson/smart-ai-social-assistant C:\GTP\smart-ai-social-assistant`
   If they already exist, `git pull` both instead.
3. Docker: check `docker info`. If Docker Desktop is missing, install it with `winget install -e --id Docker.DockerDesktop`, start it, and tell me if Windows asks for a restart or WSL update.
4. Presenter setup: in `C:\GTP\gtp-presenter-laptop` run `powershell -NoProfile -ExecutionPolicy Bypass -File scripts\setup-presenter-laptop.ps1 -AskKeys`. Read `experience/smart-ai-social-assistant/giveaway.md` and `PRESENTER-LAPTOP.md` if present. Never print key values.
5. Warm up the app (the first start can take 10+ minutes, so do this well before the talk): make sure the live runner is running on port 8790 (the setup script starts it), then open `http://localhost:8790/smart-ai/open` in the presenter browser. It starts Docker and the app, creates the demo account from `C:\GTP\smart-ai-social-assistant\gtp-brand\demo-login.json` on first run, signs in and lands on `http://localhost:4007/launches`. Wait until it does.
6. Verify, with a screenshot, these checks written down BEFORE you take it, then tick each one:
   - deck `http://localhost:8765/#14`, press Next 4 times to reach 14.5: the "Open the live app" button is visible (it only shows when the runner on 8790 answers);
   - clicking it opens a new tab that ends on the "Smart AI Social Assistant" Calendar, signed in, teal "AI" logo, no login form.
7. Report: what passed, anything that failed with the exact error, and how long step 5 took.

Do not change code in either repo. If the button or sign-in fails, read `live-runner/lib/smart-ai.mjs` to diagnose and tell me before editing anything. The demo login is a local test account only; do not use it anywhere else.
