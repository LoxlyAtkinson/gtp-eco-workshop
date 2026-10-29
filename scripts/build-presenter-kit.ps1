<#
.SYNOPSIS
  Builds the presenter-laptop kit on THIS PC: a copy of the GTP project plus every skill
  the live runner loads plus the owner's keys, ready to copy to a USB stick.

.DESCRIPTION
  Output folder (default D:\GTP-presenter-kit, or -Out):
    <Out>\                         copy of the project (no .git, node_modules, .playwright-mcp,
                                   live-runner\.stage, experience\evidence, build\, graft\,
                                   .claude\worktrees, .env* files, *.log)
    <Out>\presenter-kit\skills\    each skill the runner loads, from %USERPROFILE%\.claude\skills
                                   (links followed, __pycache__ and .git skipped)
    <Out>\presenter-kit\secrets\   .env.local + user-env.txt (FIRECRAWL_API_KEY from the Windows
                                   USER environment) + README-SECRETS.txt
    <Out>\presenter-kit\kit-manifest.txt   what was copied (names only, no values)
    <Out>\SETUP-LAPTOP.cmd         double-click launcher for scripts\setup-presenter-laptop.ps1

  Secret VALUES are never printed. Only key NAMES are listed.

.EXAMPLE
  powershell -NoProfile -ExecutionPolicy Bypass -File scripts\build-presenter-kit.ps1
.EXAMPLE
  powershell -NoProfile -ExecutionPolicy Bypass -File scripts\build-presenter-kit.ps1 -Out E:\GTP-presenter-kit
#>
param(
  [string]$Out = 'D:\GTP-presenter-kit',
  [switch]$NoSecrets
)
$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $PSScriptRoot
$SkillsSrc = Join-Path $env:USERPROFILE '.claude\skills'

# Skills the runner and deck use besides the ones found in code: the ad-ideas fallbacks
# (stage.mjs IDEAS_SKILL), the Smart pack, and the image/video/last30days skills the talk shows.
$ExtraSkills = @('ads', 'social', 'image', 'video', 'last30days', 'higgsfield-generate', 'slopmonster')
# USER environment variables the runner needs that are not in .env.local.
$UserEnvNames = @('FIRECRAWL_API_KEY')

function Say([string]$m) { Write-Host $m }
function Invoke-Robocopy([string]$From, [string]$To, [string[]]$Extra) {
  $rc = @($From, $To, '/E', '/R:1', '/W:1', '/NFL', '/NDL', '/NJH', '/NJS', '/NP') + $Extra
  & robocopy @rc | Out-Null
  if ($LASTEXITCODE -ge 8) { throw "robocopy failed ($LASTEXITCODE): $From -> $To" }
}

$Out = [IO.Path]::GetFullPath($Out)
$rootFull = [IO.Path]::GetFullPath($Root).TrimEnd('\') + '\'
if (($Out.TrimEnd('\') + '\').StartsWith($rootFull, [StringComparison]::OrdinalIgnoreCase)) {
  throw "-Out must be outside the project folder ($Root)"
}
Say "GTP presenter kit"
Say "  from: $Root"
Say "  to:   $Out"
New-Item -ItemType Directory -Force -Path $Out | Out-Null

# 1. Project copy.
Say ''
Say '1/3 Copying the project (skips .git, node_modules, evidence, build, graft, .stage) ...'
$xd = @('.git', 'node_modules', '.playwright-mcp', '__pycache__',
  (Join-Path $Root 'live-runner\.stage'), (Join-Path $Root 'experience\evidence'),
  (Join-Path $Root 'build'), (Join-Path $Root 'graft'), (Join-Path $Root '.claude\worktrees'),
  (Join-Path $Root 'presenter-kit'))
$xf = @('.env', '.env.*', '.dev.vars', '*.log')
Invoke-Robocopy $Root $Out (@('/XD') + $xd + @('/XF') + $xf)
$projFiles = (Get-ChildItem -Path $Out -Recurse -File -ErrorAction SilentlyContinue | Where-Object { $_.FullName -notlike (Join-Path $Out 'presenter-kit*') })
$projMb = [math]::Round((($projFiles | Measure-Object Length -Sum).Sum) / 1MB, 1)
Say ("    project: {0} files, {1} MB" -f $projFiles.Count, $projMb)

# 2. Skills.
Say ''
Say '2/3 Finding the skills the runner loads (live-runner\lib\*.mjs) ...'
$found = New-Object System.Collections.Generic.List[string]
foreach ($f in Get-ChildItem (Join-Path $Root 'live-runner\lib') -Filter '*.mjs') {
  $src = Get-Content -Raw -Path $f.FullName
  foreach ($m in [regex]::Matches($src, "claudeKind\(\s*'([a-z0-9][a-z0-9-]*)'")) { $found.Add($m.Groups[1].Value) }
  foreach ($m in [regex]::Matches($src, "skill:\s*'([a-z0-9][a-z0-9-]*)'")) { $found.Add($m.Groups[1].Value) }
  foreach ($m in [regex]::Matches($src, "IDEAS_SKILL\s*=\s*\[([^\]]*)\]")) {
    foreach ($n in [regex]::Matches($m.Groups[1].Value, "'([a-z0-9-]+)'")) { $found.Add($n.Groups[1].Value) }
  }
}
$wanted = @($found + $ExtraSkills | Where-Object { $_ -and $_ -ne 'none' } | Sort-Object -Unique)
$skillsOut = Join-Path $Out 'presenter-kit\skills'
New-Item -ItemType Directory -Force -Path $skillsOut | Out-Null
$copied = @(); $missing = @()
foreach ($s in $wanted) {
  $from = Join-Path $SkillsSrc $s
  if (-not (Test-Path (Join-Path $from 'SKILL.md'))) { $missing += $s; continue }
  # robocopy follows directory links (higgsfield-generate is a link on this PC).
  Invoke-Robocopy $from (Join-Path $skillsOut $s) @('/XD', '__pycache__', '.git', 'node_modules', '/XF', '*.pyc')
  $copied += $s
}
Say ("    copied {0}: {1}" -f $copied.Count, ($copied -join ', '))
if ($missing.Count) { Say ("    not on this PC (skipped, the runner falls back or does not need them): {0}" -f ($missing -join ', ')) }

# 3. Secrets.
Say ''
$secretsOut = Join-Path $Out 'presenter-kit\secrets'
$envNames = @(); $userFound = @(); $userMissing = @()
if ($NoSecrets) {
  Say '3/3 Secrets skipped (-NoSecrets). Bring .env.local and FIRECRAWL_API_KEY another way.'
} else {
  Say '3/3 Copying keys (names only shown) ...'
  New-Item -ItemType Directory -Force -Path $secretsOut | Out-Null
  $envFile = Join-Path $Root '.env.local'
  if (Test-Path $envFile) {
    Copy-Item -LiteralPath $envFile -Destination (Join-Path $secretsOut '.env.local') -Force
    $envNames = @(Get-Content $envFile | Where-Object { $_ -match '^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*\S' } | ForEach-Object { $Matches[1] } | Sort-Object -Unique)
    Say ("    .env.local names: {0}" -f ($envNames -join ', '))
  } else {
    Say '    WARNING: no .env.local in the project folder; the kit has no runner keys.'
  }
  $lines = @('# USER environment variables for the GTP live runner. KEY=VALUE, one per line.', '# USB only. Never git, never email, never paste into chat.')
  foreach ($n in $UserEnvNames) {
    $v = [Environment]::GetEnvironmentVariable($n, 'User')
    if ($v) { $lines += "$n=$v"; $userFound += $n } else { $userMissing += $n }
  }
  Set-Content -Path (Join-Path $secretsOut 'user-env.txt') -Value $lines -Encoding ASCII
  Remove-Variable v -ErrorAction SilentlyContinue
  Say ("    user env found: {0}" -f ($(if ($userFound.Count) { $userFound -join ', ' } else { 'none' })))
  if ($userMissing.Count) { Say ("    user env MISSING: {0}" -f ($userMissing -join ', ')) }
  @(
    'WARNING: THIS FOLDER HOLDS LIVE API KEYS.',
    '',
    'USB only. Never git. Never email. Never upload. Never paste into a chat.',
    '',
    '.env.local    -> the setup script copies it to the project folder (the runner reads it).',
    'user-env.txt  -> the setup script sets each line as a Windows USER environment variable.',
    '',
    'After the laptop is set up and the talk is done, delete this secrets folder from the USB stick.',
    'If the stick is lost: rotate every key named in kit-manifest.txt.'
  ) | Set-Content -Path (Join-Path $secretsOut 'README-SECRETS.txt') -Encoding ASCII
}

# Manifest (names only) and a double-click launcher.
@(
  "GTP presenter kit built $(Get-Date -Format 'yyyy-MM-dd HH:mm') on $env:COMPUTERNAME",
  "project files: $($projFiles.Count) ($projMb MB)",
  "skills: $($copied -join ', ')",
  "skills not found on the build PC: $($missing -join ', ')",
  ".env.local key names: $($envNames -join ', ')",
  "user env names: $($userFound -join ', ')",
  "user env missing: $($userMissing -join ', ')"
) | Set-Content -Path (Join-Path $Out 'presenter-kit\kit-manifest.txt') -Encoding ASCII
@(
  '@echo off',
  'cd /d "%~dp0"',
  'powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\setup-presenter-laptop.ps1" %*',
  'pause'
) | Set-Content -Path (Join-Path $Out 'SETUP-LAPTOP.cmd') -Encoding ASCII

$kitMb = [math]::Round(((Get-ChildItem -Path $Out -Recurse -File | Measure-Object Length -Sum).Sum) / 1MB, 1)
Say ''
Say "Done. Kit: $Out ($kitMb MB)"
Say 'Next: copy that whole folder to the USB stick, then follow PRESENTER-LAPTOP.md on the laptop.'
