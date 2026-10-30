@echo off
rem Started at Windows logon by the "GTP report worker" scheduled task (via start-hidden.vbs).
rem Restarts the worker 15 seconds after it stops, so a crash never stops the reports.
cd /d "%~dp0.."
:loop
node report-worker\worker.mjs >> "%LOCALAPPDATA%\gtp-report-worker.log" 2>&1
timeout /t 15 /nobreak >nul
goto loop
