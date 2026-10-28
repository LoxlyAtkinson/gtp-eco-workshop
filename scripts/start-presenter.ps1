<#
.SYNOPSIS
  Opens the GTP deck with the voice presenter assistant (owner item 21) in a visible
  browser that Jev Ultrafast owns and drives, with the microphone already allowed.

.DESCRIPTION
  1. Deck server on 127.0.0.1:8765 and live runner on 127.0.0.1:8790: each is started
     only when its port is free; a port that is already listening is reused.
  2. Presenter browser: the same Chromium binary Jev Ultrafast uses (Jev's
     browser-mcp/browser-executable.mjs), started WITH a window, on its own profile
     (%LOCALAPPDATA%\gtp-presenter\browser-profile) and its own DevTools port
     (127.0.0.1:9334). Jev's start-ultrafast.ps1 is not used for this step because its
     ensure-automation-browser.ps1 always starts a headless browser on 9333, and a
     headless browser cannot be presented. -Browser chrome uses installed Google Chrome.
     --use-fake-ui-for-media-stream answers the mic prompt with "allow" (the REAL mic
     is used; it does not fake the device).
  3. Jev Ultrafast's own runtime (its venv Python and the browser-harness CDP transport
     it drives browsers with) grants the deck origin the microphone permission, opens
     http://127.0.0.1:8765/?voice=1 in the front tab and reads the voice pill's state
     back, then stops its harness daemon. The browser and the deck keep running.

  Voice cues need internet: Chrome's speech recognition is a Google web service.

.EXAMPLE
  powershell -NoProfile -ExecutionPolicy Bypass -File scripts\start-presenter.ps1
.EXAMPLE
  powershell -NoProfile -ExecutionPolicy Bypass -File scripts\start-presenter.ps1 -Verify
  Proves the whole chain without a window or the real mic (headless, fake audio
  device), prints the pill state, then closes the browser it started.
#>
param(
  [int]$DeckPort = 8765,
  [int]$RunnerPort = 8790,
  [int]$CdpPort = 9334,
  [ValidateSet('jev', 'chrome')][string]$Browser = 'jev',
  [switch]$Verify
)
$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $PSScriptRoot
$Jev = Join-Path $env:USERPROFILE '.agents\tools\jev'
$Py = Join-Path $Jev 'jev-ultrafast\.venv\Scripts\python.exe'
$Node = 'C:\Program Files\nodejs\node.exe'
$StateDir = Join-Path $env:LOCALAPPDATA 'gtp-presenter'
$BrowserProfile = Join-Path $StateDir 'browser-profile'
if ($Verify) { $BrowserProfile = Join-Path $StateDir 'verify-profile' }
$Origin = "http://127.0.0.1:$DeckPort"
$Url = "$Origin/?voice=1"

function Get-Listener([int]$Port) {
  Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
}
function Wait-Http([string]$Address, [int]$Seconds) {
  $deadline = [DateTime]::UtcNow.AddSeconds($Seconds)
  while ([DateTime]::UtcNow -lt $deadline) {
    try { $r = Invoke-WebRequest $Address -UseBasicParsing -TimeoutSec 2; if ($r.StatusCode -eq 200) { return $true } } catch { Start-Sleep -Milliseconds 250 }
  }
  return $false
}

if (-not (Test-Path -LiteralPath $Py)) { throw "Jev Ultrafast runtime not found at $Py. See $Jev\SETUP-GUIDE.md." }
if ($BrowserProfile -match '\s') { throw "Browser profile path must not contain spaces: $BrowserProfile" }
New-Item -ItemType Directory -Path $StateDir -Force | Out-Null

# ---- 1. Deck server and live runner (start only on a free port) ----
if (Get-Listener $DeckPort) { Write-Host "Deck: port $DeckPort is already listening; reusing it." }
else {
  Write-Host "Deck: port $DeckPort is free; starting python -m http.server."
  Start-Process -FilePath 'python' -ArgumentList '-m', 'http.server', "$DeckPort", '--bind', '127.0.0.1' -WorkingDirectory $Root -WindowStyle Minimized | Out-Null
}
if (-not (Wait-Http "$Origin/chapters/voice-cues.json" 15)) { throw "The deck on $Origin did not serve chapters/voice-cues.json. Run: node scripts/build-voice-cues.mjs" }

if (Get-Listener $RunnerPort) { Write-Host "Live runner: port $RunnerPort is already listening; reusing it." }
else {
  Write-Host "Live runner: port $RunnerPort is free; starting npm run stage."
  $env:LIVE_RUNNER_PORT = "$RunnerPort"
  Start-Process -FilePath 'npm.cmd' -ArgumentList 'run', 'stage' -WorkingDirectory $Root -WindowStyle Minimized | Out-Null
}

# ---- 2. Presenter browser (own profile, own DevTools port, mic prompt auto-allowed) ----
$startedPid = $null
$listener = Get-Listener $CdpPort
if ($listener) {
  $owner = Get-CimInstance Win32_Process -Filter ("ProcessId=" + $listener.OwningProcess)
  if (-not $owner -or -not $owner.CommandLine.Contains("--user-data-dir=$BrowserProfile")) {
    throw "Port $CdpPort belongs to another program. Refusing to attach; pass -CdpPort <free port>."
  }
  Write-Host "Presenter browser: already running on $CdpPort (pid $($owner.ProcessId)); reusing it."
} else {
  if ($Browser -eq 'chrome') { $exe = 'C:\Program Files\Google\Chrome\Application\chrome.exe' }
  else { $exe = & $Node (Join-Path $Jev 'browser-mcp\browser-executable.mjs') }
  if (-not $exe -or -not (Test-Path -LiteralPath $exe)) { throw "Browser binary not found: $exe" }
  $browserArgs = @('--remote-debugging-address=127.0.0.1', "--remote-debugging-port=$CdpPort", "--user-data-dir=$BrowserProfile",
    '--no-first-run', '--no-default-browser-check', '--use-fake-ui-for-media-stream')
  if ($Verify) { $browserArgs += @('--headless=new', '--use-fake-device-for-media-stream') } else { $browserArgs += '--start-maximized' }
  $browserArgs += 'about:blank'
  $proc = Start-Process -FilePath $exe -ArgumentList $browserArgs -PassThru
  $startedPid = $proc.Id
  if (-not (Wait-Http "http://127.0.0.1:$CdpPort/json/version" 20)) { throw "The presenter browser did not open its DevTools port $CdpPort." }
  Write-Host "Presenter browser: started $exe (pid $startedPid) on DevTools port $CdpPort."
}

# ---- 3. Jev Ultrafast runtime opens the deck in the front tab and reads the pill back ----
$opener = @'
import json, os, sys, time
from browser_harness.admin import ensure_daemon, restart_daemon
from browser_harness.helpers import cdp

url, origin = sys.argv[1], sys.argv[2]
name = os.environ['BU_NAME']
ensure_daemon(name=name)
try:
    cdp('Browser.grantPermissions', origin=origin, permissions=['audioCapture'])
    pages = [t for t in cdp('Target.getTargets')['targetInfos'] if t['type'] == 'page']
    deck = next((t for t in pages if t['url'].startswith(origin + '/')), None)
    if deck:
        target = deck['targetId']
    else:
        target = cdp('Target.createTarget', url=url)['targetId']
        for t in pages:
            if t['url'] in ('about:blank', 'chrome://newtab/'):
                cdp('Target.closeTarget', targetId=t['targetId'])
    cdp('Target.activateTarget', targetId=target)
    session = cdp('Target.attachToTarget', targetId=target, flatten=True)['sessionId']
    probe = "window.gtpVoice ? JSON.stringify(Object.assign({url: location.href}, window.gtpVoice.state)) : ''"
    # Wait for the cue map, then up to 8 s more for the mic to report listening (or its error).
    state, start = None, time.monotonic()
    while time.monotonic() - start < 30:
        try:
            # The deck's main thread is busy while it loads its media; give each read room.
            value = cdp('Runtime.evaluate', session_id=session, expression=probe, returnByValue=True, _response_timeout=15).get('result', {}).get('value')
        except Exception:
            value = None
        if value:
            state = json.loads(value)
            if state.get('loaded') and (state.get('listening') or time.monotonic() - start > 8):
                break
        time.sleep(0.4)
    cdp('Target.detachFromTarget', sessionId=session)
    keep = ('url', 'loaded', 'cues', 'status', 'lang', 'listening', 'current', 'next')
    print(json.dumps({k: state.get(k) for k in keep} if state else {'error': 'voice pill did not load'}))
finally:
    restart_daemon(name)
'@
$openerPath = Join-Path $StateDir 'open-deck.py'
Set-Content -LiteralPath $openerPath -Value $opener -Encoding ASCII
$env:BU_CDP_URL = "http://127.0.0.1:$CdpPort"
$env:BU_NAME = 'gtp-presenter'
$env:BROWSER_HARNESS_HOME = Join-Path $StateDir 'harness-state'
$result = & $Py $openerPath $Url $Origin
$code = $LASTEXITCODE
Write-Host "Voice pill: $result"

if ($Verify -and $startedPid) {
  Stop-Process -Id $startedPid -ErrorAction SilentlyContinue
  Wait-Process -Id $startedPid -Timeout 15 -ErrorAction SilentlyContinue
  Write-Host "Verify: closed the headless browser it started (pid $startedPid)."
} elseif ($code -eq 0) {
  Write-Host ''
  Write-Host 'Ready. In the deck: V shows or hides the voice pill; Start/Stop listening is on the pill.'
  Write-Host 'Speak the first words of the next line in experience/presentation-script.md to bring it in.'
}
exit $code
