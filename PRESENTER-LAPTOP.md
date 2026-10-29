# Presenter laptop: set it up in about 30 minutes

**Next action: on THIS PC, do step 1 below.**

Why the USB stick: signing in to Claude on the laptop does not bring over your skills,
your `.env.local` keys or `FIRECRAWL_API_KEY`. Those live only on this PC, so they travel on USB.

## On this PC (about 6 minutes)

1. **Build the kit (1 min).** Open PowerShell in the project folder and run:

   ```
   powershell -NoProfile -ExecutionPolicy Bypass -File scripts\build-presenter-kit.ps1
   ```

   It makes `D:\GTP-presenter-kit` (about 330 MB): the deck, the live runner, the 16 skills the
   stage uses, and your keys. It prints key NAMES only. Different drive? Add `-Out E:\GTP-presenter-kit`.

2. **Copy `D:\GTP-presenter-kit` to the USB stick (5 min).**
   The `presenter-kit\secrets` folder holds live keys. USB only. Never git, never email.

## On the laptop (about 25 minutes, mostly waiting)

3. **Install the Claude desktop app (5 min).** Get it from claude.ai/download and sign in
   with the same Claude subscription as this PC.

4. **Copy the kit folder from the USB stick to `C:\GTP` (3 min).**
   The folder `C:\GTP` should contain `index.html`, `SETUP-LAPTOP.cmd` and `presenter-kit`.

5. **Run the setup (10 to 15 min).** Pick ONE way:

   - **Way A, double-click:** open `C:\GTP` and double-click `SETUP-LAPTOP.cmd`.
     (Or right-click `scripts\setup-presenter-laptop.ps1` and pick "Run with PowerShell".
     That window closes at the end, so the .cmd is easier to read.)
   - **Way B, ask Claude:** in the Claude desktop app open the **Code** tab, choose the folder
     `C:\GTP`, and paste this prompt:

     ```
     Set up this presenter laptop. In this folder run
     powershell -NoProfile -ExecutionPolicy Bypass -File scripts\setup-presenter-laptop.ps1 -DryRun
     and show me the result. Then run the same command without -DryRun.
     Never show me any key values, only key names.
     If a line says [fix], fix it and run the script again.
     If it says Claude Code is not signed in, tell me exactly what to type to sign in, then run it again.
     Finish by telling me the deck address and which stage-* kinds are ready or blocked.
     ```

   Use the **Code** tab. The Chat tab cannot start the deck or the runner.

6. **If it says "Claude Code is not signed in" (2 min):** open PowerShell, type `claude`,
   press Enter, pick your Claude subscription, sign in in the browser, close that window,
   then run step 5 again.

## What success looks like

- The last line says **All set**.
- Two new windows stay open: **GTP deck 8765** and **GTP live runner 8790**. Leave them open.
- The list under "runner health" shows `ready` for all nine `stage-*` lines.
- The browser opens `http://127.0.0.1:8765/` and the deck shows.
- `[warn]` lines are optional extras. `[fix]` lines need doing.

Something blocked? The line says what is missing (for example `FIRECRAWL_API_KEY`).
Re-run the build on this PC, copy the kit again, run step 5 again.

## Day of the talk (5 minutes)

1. Start the deck and runner: double-click `C:\GTP\SETUP-LAPTOP.cmd` (it reuses anything already running).
2. In the browser press **Ctrl+F5** once.
3. Go to scene 14, press **Open the live stage**, then press **Clear the list** (removes the test sites).
4. Check internet: voice cues and every live run need it.
5. Optional: run `codex login` once if slopmonster's cleanse step says Codex is not signed in.

## After the talk (1 minute)

1. Delete the `presenter-kit\secrets` folder from the USB stick.
