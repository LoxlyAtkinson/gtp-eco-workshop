<#
.SYNOPSIS
  Sets up the presenter LAPTOP from the GTP presenter kit (built on the main PC by
  scripts\build-presenter-kit.ps1), then starts the deck and the live runner.

.DESCRIPTION
  Run it from the kit folder (for example C:\GTP). Steps:
    1. Tools: Node 22, Python 3, Git (Git Bash), ffmpeg (optional) via winget; Claude Code CLI,
       Higgsfield CLI, Firecrawl CLI and Codex CLI via npm into %USERPROFILE%\.npm-global
       (the folder the live runner looks in).
    2. Skills: presenter-kit\skills\* -> %USERPROFILE%\.claude\skills. A skill that is newer on
       the laptop is kept unless -Force.
    3. Keys: presenter-kit\secrets\.env.local -> project .env.local; each line of
       presenter-kit\secrets\user-env.txt becomes a Windows USER environment variable.
       Only key NAMES are printed, never values.
    4. Claude sign-in check (claude auth status).
    5. Ports 8765 / 8790: starts the deck and the runner in their own windows when free, reuses
       them when already running, then prints the runner health (ready / blocked per stage kind).
    6. Opens the deck in the browser.

  -DryRun changes nothing: it checks and reports, and reads /health only if a runner is
  already running. It installs, copies, sets and starts nothing.

.EXAMPLE
  powershell -NoProfile -ExecutionPolicy Bypass -File scripts\setup-presenter-laptop.ps1 -DryRun
.EXAMPLE
  powershell -NoProfile -ExecutionPolicy Bypass -File scripts\setup-presenter-laptop.ps1
#>
param(
  [switch]$DryRun,
  [switch]$Force,
  [switch]$SkipInstall,
  [switch]$NoStart,
  [int]$DeckPort = 8765,
  [int]$RunnerPort = 8790,
  # A claude-setup clone's claude-home\skills folder. Only the GTP skills below are copied from it.
  [string]$SkillsFrom = '',
  # Ask for each missing GTP key in a hidden prompt and write it into .env.local (or the user env).
  [switch]$AskKeys
)
# The skills the deck and live runner load (live-runner\lib\*.mjs), plus the take-home stage skills.
$GtpSkills = @('ad-creative', 'ads', 'backlink-analyzer', 'blog-calendar', 'competitor-analysis', 'competitor-keyword-decoder',
  'geo-citability', 'higgsfield-generate', 'image', 'last30days', 'marketing-plan', 'seo-audit', 'seo-plan', 'slopmonster', 'social', 'video')
$ErrorActionPreference = 'Continue'
$Root = Split-Path -Parent $PSScriptRoot
$Kit = Join-Path $Root 'presenter-kit'
$SkillsDst = Join-Path $env:USERPROFILE '.claude\skills'
$NpmPrefix = Join-Path $env:USERPROFILE '.npm-global'
$ClaudeExe = Join-Path $NpmPrefix 'node_modules\@anthropic-ai\claude-code\bin\claude.exe'
$GitBash = 'C:\Program Files\Git\bin\bash.exe'
$ExpectedEnv = @('DATAFORSEO_LOGIN', 'DATAFORSEO_PASSWORD', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY',
  'SUPABASE_ANON_KEY', 'SUPABASE_ACCESS_TOKEN', 'APIFY_API_TOKEN', 'FAL_KEY', 'SCRAPECREATORS_API_KEY')
$Problems = New-Object System.Collections.Generic.List[string]
$Notes = New-Object System.Collections.Generic.List[string]

function Say([string]$m) { Write-Host $m }
function Ok([string]$m) { Write-Host "  [ok]   $m" -ForegroundColor Green }
function Warn([string]$m) { Write-Host "  [warn] $m" -ForegroundColor Yellow }
function Bad([string]$m) { Write-Host "  [fix]  $m" -ForegroundColor Red; $Problems.Add($m) }
function Would([string]$m) { Write-Host "  [dry-run] would $m" -ForegroundColor Cyan }
function Refresh-Path {
  $env:Path = [Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' + [Environment]::GetEnvironmentVariable('Path', 'User')
}
function Has-Cmd([string]$n) { [bool](Get-Command $n -ErrorAction SilentlyContinue) }
function Winget-Install([string[]]$Ids, [string]$Label) {
  if ($DryRun) { Would "install $Label (winget $($Ids[0]))"; return $false }
  if ($SkipInstall) { Warn "$Label missing (-SkipInstall)"; return $false }
  if (-not (Has-Cmd 'winget')) { Bad "$Label missing and winget is not available: install it by hand"; return $false }
  foreach ($id in $Ids) {
    Say "  installing $Label ($id) ..."
    & winget install --id $id -e --silent --accept-package-agreements --accept-source-agreements | Out-Null
    if ($LASTEXITCODE -eq 0) { Refresh-Path; return $true }
  }
  Refresh-Path
  return $false
}
function Npm-Install([string]$Pkg) {
  if ($DryRun) { Would "npm install -g --prefix $NpmPrefix $Pkg"; return }
  if ($SkipInstall) { Warn "$Pkg not installed (-SkipInstall)"; return }
  if (-not (Has-Cmd 'npm')) { Bad "npm missing, cannot install $Pkg"; return }
  Say "  installing $Pkg ..."
  & npm install -g --prefix $NpmPrefix $Pkg 2>&1 | Out-Null
}
function Get-Listening([int]$Port) {
  [bool](netstat -ano | Select-String -Pattern ("^\s*TCP\s+\S+:{0}\s+\S+\s+LISTENING" -f $Port))
}
function Get-Health {
  try { Invoke-RestMethod -Uri "http://127.0.0.1:$RunnerPort/health" -TimeoutSec 5 } catch { $null }
}
function Get-EnvNames([string]$File) {
  if (-not (Test-Path -LiteralPath $File)) { return @() }
  @(Get-Content -LiteralPath $File | Where-Object { $_ -match '^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*\S' } | ForEach-Object { $Matches[1] } | Sort-Object -Unique)
}
function Newest([string]$Dir) {
  # Ignore caches the kit never carries (__pycache__, .pyc, .git), or they look "newer".
  $f = Get-ChildItem -LiteralPath $Dir -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -notmatch '\\(__pycache__|\.git|node_modules)\\' -and $_.Extension -ne '.pyc' } | Sort-Object LastWriteTimeUtc -Descending | Select-Object -First 1
  if ($f) { $f.LastWriteTimeUtc } else { [datetime]::MinValue }
}

Say ("GTP presenter laptop setup{0}" -f $(if ($DryRun) { '  (DRY RUN: nothing is changed)' } else { '' }))
Say "  project/kit folder: $Root"
if (-not (Test-Path (Join-Path $Root 'live-runner\server.mjs'))) { Say 'ERROR: run this from the kit folder (live-runner\server.mjs not found).'; exit 2 }
if (-not (Test-Path $Kit)) { Warn "no presenter-kit folder at $Kit (skills and keys steps will be skipped)" }
Refresh-Path

# ---------- 1. Tools ----------
Say ''
Say '1/6 Tools'
$nodeV = if (Has-Cmd 'node') { (& node --version) 2>$null } else { $null }
$nodeMajor = if ($nodeV -match '^v(\d+)') { [int]$Matches[1] } else { 0 }
if ($nodeMajor -ge 22) { Ok "Node $nodeV" }
else {
  if ($nodeV) { Warn "Node $nodeV is older than 22" }
  if (Winget-Install @('OpenJS.NodeJS.22', 'OpenJS.NodeJS.LTS') 'Node 22') { Ok "Node $((& node --version) 2>$null)" }
  elseif (-not $DryRun) { Bad 'Node 22 not installed: get it from nodejs.org, then run this again' }
}
$pyV = if (Has-Cmd 'python') { ((& python --version) 2>&1 | Out-String).Trim() } else { '' }
if ($pyV -match '^Python 3\.') { Ok $pyV }
elseif (Winget-Install @('Python.Python.3.12') 'Python 3') { Ok (((& python --version) 2>&1 | Out-String).Trim()) }
elseif (-not $DryRun) { Bad 'Python 3 not installed (deck server + slopmonster lint need it)' }
if ((Has-Cmd 'git') -and (Test-Path $GitBash)) { Ok "Git ($(((& git --version) 2>$null)))" }
elseif (Winget-Install @('Git.Git') 'Git') { Ok 'Git installed' }
elseif (-not $DryRun) { Bad "Git not installed (slopmonster cleanse needs $GitBash)" }
if (Has-Cmd 'ffmpeg') { Ok 'ffmpeg (optional)' }
elseif (-not (Winget-Install @('Gyan.FFmpeg') 'ffmpeg (optional)')) { if (-not $DryRun) { Warn 'ffmpeg not installed (optional)' } }

# npm CLIs into %USERPROFILE%\.npm-global (kinds.mjs and stage.mjs look there).
$npmPkgs = @(
  @{ Pkg = '@anthropic-ai/claude-code'; Test = $ClaudeExe; Need = $true; Why = 'every Claude run on stage' },
  @{ Pkg = '@higgsfield/cli'; Test = (Join-Path $NpmPrefix 'node_modules\@higgsfield\cli\bin\higgsfield.js'); Need = $false; Why = 'video fallback price check' },
  @{ Pkg = 'firecrawl-cli'; Test = (Join-Path $NpmPrefix 'node_modules\firecrawl-cli\dist\index.js'); Need = $false; Why = 'older scene kinds' },
  @{ Pkg = '@openai/codex'; Test = (Join-Path $NpmPrefix 'node_modules\@openai\codex'); Need = $false; Why = 'slopmonster rival-model cleanse' }
)
foreach ($p in $npmPkgs) {
  if (Test-Path $p.Test) { Ok "$($p.Pkg) ($($p.Why))"; continue }
  Npm-Install $p.Pkg
  if (Test-Path $p.Test) { Ok "$($p.Pkg) installed" }
  elseif (-not $DryRun) { if ($p.Need) { Bad "$($p.Pkg) missing ($($p.Why))" } else { Warn "$($p.Pkg) missing (optional: $($p.Why))" } }
}
$userPath = [Environment]::GetEnvironmentVariable('Path', 'User')
if (($userPath -split ';') -contains $NpmPrefix) { Ok "$NpmPrefix is on your PATH" }
elseif ($DryRun) { Would "add $NpmPrefix to your user PATH" }
else { [Environment]::SetEnvironmentVariable('Path', ($userPath.TrimEnd(';') + ';' + $NpmPrefix), 'User'); Refresh-Path; Ok "added $NpmPrefix to your user PATH" }

# ---------- 2. Skills ----------
Say ''
Say "2/6 Skills -> $SkillsDst"
$kitSkills = if ($SkillsFrom) { $SkillsFrom } else { Join-Path $Kit 'skills' }
if (Test-Path $kitSkills) {
  if (-not $DryRun) { New-Item -ItemType Directory -Force -Path $SkillsDst | Out-Null }
  $copied = @(); $kept = @(); $same = @()
  $srcDirs = @(Get-ChildItem -LiteralPath $kitSkills -Directory | Where-Object { -not $SkillsFrom -or $GtpSkills -contains $_.Name })
  if ($SkillsFrom) {
    $absentSkills = @($GtpSkills | Where-Object { $srcDirs.Name -notcontains $_ })
    if ($absentSkills.Count) { Bad ("not in {0}: {1}" -f $kitSkills, ($absentSkills -join ', ')) }
  }
  foreach ($d in $srcDirs) {
    $dst = Join-Path $SkillsDst $d.Name
    if (Test-Path -LiteralPath $dst) {
      $item = Get-Item -LiteralPath $dst -Force
      $isLink = [bool]($item.Attributes -band [IO.FileAttributes]::ReparsePoint)
      $dstNew = Newest $dst; $srcNew = Newest $d.FullName
      if (-not $Force -and ($isLink -or $dstNew -gt $srcNew)) { $kept += $d.Name; continue }
      if (-not $Force -and $dstNew -eq $srcNew) { $same += $d.Name; continue }
    }
    if ($DryRun) { $copied += $d.Name; continue }
    & robocopy $d.FullName $dst /E /R:1 /W:1 /NFL /NDL /NJH /NJS /NP | Out-Null
    if ($LASTEXITCODE -ge 8) { Bad "copy failed for skill $($d.Name)" } else { $copied += $d.Name }
  }
  $verb = if ($DryRun) { 'would copy' } else { 'copied' }
  Ok ("{0} {1}: {2}" -f $verb, $copied.Count, ($(if ($copied.Count) { $copied -join ', ' } else { 'none' })))
  if ($same.Count) { Ok ("already up to date: {0}" -f ($same -join ', ')) }
  if ($kept.Count) { Warn ("kept the laptop's newer or linked copy (use -Force to replace): {0}" -f ($kept -join ', ')) }
} else { Warn 'no presenter-kit\skills folder: skipped' }

# ---------- 3. Keys (names only) ----------
Say ''
Say '3/6 Keys (names only, never values)'
$kitEnv = Join-Path $Kit 'secrets\.env.local'
$projEnv = Join-Path $Root '.env.local'
if (Test-Path -LiteralPath $kitEnv) {
  $differs = (Test-Path -LiteralPath $projEnv) -and ((Get-FileHash -LiteralPath $kitEnv).Hash -ne (Get-FileHash -LiteralPath $projEnv).Hash)
  if (-not (Test-Path -LiteralPath $projEnv)) {
    if ($DryRun) { Would 'copy presenter-kit\secrets\.env.local to the project folder' } else { Copy-Item -LiteralPath $kitEnv -Destination $projEnv; Ok 'copied .env.local into the project folder' }
  } elseif ($differs -and $Force) {
    if ($DryRun) { Would 'replace the project .env.local with the kit copy (-Force)' } else { Copy-Item -LiteralPath $kitEnv -Destination $projEnv -Force; Ok 'replaced .env.local with the kit copy (-Force)' }
  } elseif ($differs) { Warn 'project .env.local differs from the kit copy: kept the project one (use -Force to replace)' }
  else { Ok '.env.local already in place' }
} elseif (-not (Test-Path -LiteralPath $projEnv)) {
  if ($AskKeys) { Warn 'no .env.local yet: asking for each key next' } else { Bad 'no .env.local in the kit or the project: the runner has no keys (run again with -AskKeys)' }
}
$envNames = if (Test-Path -LiteralPath $projEnv) { Get-EnvNames $projEnv } else { Get-EnvNames $kitEnv }
function Read-Secret([string]$Name) {
  $s = Read-Host "  paste $Name (hidden, Enter to skip)" -AsSecureString
  [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($s)).Trim()
}
if ($AskKeys) {
  foreach ($n in @($ExpectedEnv | Where-Object { $envNames -notcontains $_ })) {
    if ($DryRun) { Would "ask for $n and add it to .env.local"; continue }
    $v = Read-Secret $n
    if ($v) { Add-Content -LiteralPath $projEnv -Value "$n=$v" -Encoding utf8; Ok "$n added to .env.local" } else { Warn "$n skipped" }
  }
  if (-not [Environment]::GetEnvironmentVariable('FIRECRAWL_API_KEY', 'User')) {
    if ($DryRun) { Would 'ask for FIRECRAWL_API_KEY and set it as a USER env var' }
    else { $v = Read-Secret 'FIRECRAWL_API_KEY'; if ($v) { [Environment]::SetEnvironmentVariable('FIRECRAWL_API_KEY', $v, 'User'); $env:FIRECRAWL_API_KEY = $v; Ok 'FIRECRAWL_API_KEY set' } }
  }
  $v = $null
  $envNames = Get-EnvNames $projEnv
}
$present = @($ExpectedEnv | Where-Object { $envNames -contains $_ })
$absent = @($ExpectedEnv | Where-Object { $envNames -notcontains $_ })
Ok (".env.local present: {0}" -f ($(if ($present.Count) { $present -join ', ' } else { 'none' })))
if ($absent.Count) { Warn (".env.local missing: {0}" -f ($absent -join ', ')) }

$userEnvFile = Join-Path $Kit 'secrets\user-env.txt'
$userNames = @()
if (Test-Path -LiteralPath $userEnvFile) {
  foreach ($line in Get-Content -LiteralPath $userEnvFile) {
    if ($line -notmatch '^\s*([A-Za-z_][A-Za-z0-9_]*)=(.+)$') { continue }
    $n = $Matches[1]; $userNames += $n
    if ($DryRun) { Would "set USER env var $n"; continue }
    [Environment]::SetEnvironmentVariable($n, $Matches[2].Trim(), 'User')
    Set-Item -Path "Env:$n" -Value $Matches[2].Trim()
    Ok "set USER env var $n"
  }
}
$Matches = $null
foreach ($n in @('FIRECRAWL_API_KEY')) {
  $has = [bool]([Environment]::GetEnvironmentVariable($n, 'User')) -or ($userNames -contains $n)
  if ($has) { Ok "$n available" } else { Bad "$n missing (design scan cannot run)" }
}

# ---------- 4. Claude sign-in ----------
Say ''
Say '4/6 Claude sign-in'
# The runner spawns claude without a shell, so only a real claude.exe will do (not claude.ps1/.cmd).
$claudeOnPath = Get-Command claude -CommandType Application -ErrorAction SilentlyContinue | Where-Object { $_.Source -like '*.exe' } | Select-Object -First 1
$claudeCmd = if (Test-Path $ClaudeExe) { $ClaudeExe } elseif ($claudeOnPath) { $claudeOnPath.Source } else { $null }
if (-not $claudeCmd) { if ($DryRun) { Warn 'Claude Code CLI not installed yet (step 1 would install it)' } else { Bad 'Claude Code CLI not found' } }
else {
  $auth = $null
  try { $auth = ((& $claudeCmd auth status) 2>$null | Out-String) | ConvertFrom-Json } catch { $auth = $null }
  if ($auth -and $auth.loggedIn) { Ok "signed in ($($auth.authMethod))" }
  else { Bad "Claude Code is not signed in: open PowerShell, type  claude  , press Enter, choose your Claude subscription and sign in, then run this again" }
}
if (-not (Test-Path $ClaudeExe) -and $claudeCmd) {
  $env:LIVE_RUNNER_CLAUDE_EXE = $claudeCmd
  $Notes.Add("runner will use $claudeCmd (LIVE_RUNNER_CLAUDE_EXE)")
}
$codexCmd = Get-Command codex -ErrorAction SilentlyContinue
if ($codexCmd) {
  $cs = ((& $codexCmd.Source login status) 2>&1 | Out-String)
  if ($cs -match 'Logged in') { Ok 'Codex signed in (slopmonster cleanse)' } else { Warn 'Codex not signed in (optional): run  codex login  once' }
}
$Notes.Add('Video fallback only: Higgsfield needs a one-time sign-in inside Claude Code (/mcp). Veo via FAL_KEY is the main path.')

# ---------- 5. Deck + runner ----------
Say ''
Say "5/6 Deck (port $DeckPort) and live runner (port $RunnerPort)"
$deckUp = Get-Listening $DeckPort
$runUp = Get-Listening $RunnerPort
$esc = $Root.Replace("'", "''")
if ($deckUp) { Ok "port $DeckPort already in use: reusing it (if the deck does not load, close that program)" }
elseif ($DryRun -or $NoStart) { Would "start the deck: python -m http.server $DeckPort --bind 127.0.0.1 (new window)" }
else {
  Start-Process powershell -ArgumentList @('-NoExit', '-Command', "`$host.UI.RawUI.WindowTitle='GTP deck $DeckPort'; Set-Location -LiteralPath '$esc'; python -m http.server $DeckPort --bind 127.0.0.1")
  Ok 'deck started in its own window (leave it open)'
}
if ($runUp) { Ok "port $RunnerPort already in use: reusing the running runner" }
elseif ($DryRun -or $NoStart) { Would "start the runner: node live-runner/server.mjs (new window)" }
else {
  Start-Process powershell -ArgumentList @('-NoExit', '-Command', "`$host.UI.RawUI.WindowTitle='GTP live runner $RunnerPort'; Set-Location -LiteralPath '$esc'; node live-runner/server.mjs")
  Ok 'runner started in its own window (leave it open)'
}
$health = Get-Health
if (-not $health -and -not $DryRun -and -not $NoStart) {
  for ($i = 0; $i -lt 20 -and -not $health; $i++) { Start-Sleep -Seconds 1; $health = Get-Health }
}
if ($health) {
  Say '  runner health (stage kinds):'
  foreach ($k in $health.kinds.PSObject.Properties) {
    if ($k.Name -notlike 'stage-*') { continue }
    $b = @($k.Value.blocked_on)
    if ($k.Value.ready) { Write-Host ("    ready    {0}" -f $k.Name) -ForegroundColor Green }
    else { Write-Host ("    BLOCKED  {0}  ({1})" -f $k.Name, ($b -join ', ')) -ForegroundColor Red; $Problems.Add("$($k.Name) blocked on $($b -join ', ')") }
  }
  $other = @($health.kinds.PSObject.Properties | Where-Object { $_.Name -notlike 'stage-*' })
  $otherReady = @($other | Where-Object { $_.Value.ready }).Count
  Say ("  other kinds: {0} of {1} ready (last30days stays blocked by design until its review)" -f $otherReady, $other.Count)
} elseif ($DryRun -or $NoStart) { Say '  runner health: not read (no runner running; a real run starts it and reads /health)' }
else { Bad "runner did not answer http://127.0.0.1:$RunnerPort/health: read the 'GTP live runner' window" }

# ---------- 6. Browser ----------
Say ''
Say '6/6 Browser'
$deckUrl = "http://127.0.0.1:$DeckPort/"
if ($DryRun -or $NoStart) { Would "open $deckUrl" } else { Start-Process $deckUrl; Ok "opened $deckUrl (press Ctrl+F5 once)" }

# ---------- Summary ----------
Say ''
foreach ($n in $Notes) { Say "  note: $n" }
if ($Problems.Count) {
  Say ("{0} thing(s) to fix:" -f $Problems.Count)
  $i = 1; foreach ($p in $Problems) { Say ("  {0}. {1}" -f $i, $p); $i++ }
  if (-not $DryRun) { exit 1 }
} else {
  Say $(if ($DryRun) { 'Dry run finished. Nothing was changed.' } else { 'All set. Deck: http://127.0.0.1:8765/  Scene 14 -> Open the live stage.' })
}
