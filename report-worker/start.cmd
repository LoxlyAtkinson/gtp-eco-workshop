@echo off
rem Started at Windows logon by the "GTP report worker" scheduled task.
cd /d "%~dp0.."
node report-worker\worker.mjs >> "%LOCALAPPDATA%\gtp-report-worker.log" 2>&1
