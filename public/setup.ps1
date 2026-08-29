# ============================================================================
#  HALO RDP SETUP - one-shot installer for a clean Windows box
#  Turns this machine into the always-on brain of PROJECT : VANTA HALO.
#
#  What it does, in order (each step skips itself if already done):
#    1. Install Node.js LTS and Git (winget, or direct download fallback)
#    2. Install the CLIs: GitHub (gh), Vercel, Claude Code, ChatGPT Codex
#    3. Walk you through the four sign-ins (GitHub, Vercel, Claude, Codex)
#    4. Clone the whole project to C:\halo\Learn (with HANDOVER docs) + deps
#    5. Set up the HALO bridge to run forever (auto-starts at logon)
#
#  Run via INSTALL.bat (double-click) - or:
#    powershell -ExecutionPolicy Bypass -File .\setup-halo-rdp.ps1
# ============================================================================

$ErrorActionPreference = "Continue"   # PS 5.1 turns npm/vercel stderr noise fatal under Stop
$SetupVersion = "v4 (2026-08-29)"
$Root    = "C:\halo"
$RepoUrl = "https://github.com/kurohalovanta-hub/Learn.git"
$Branch  = "claude/embodied-intelligence-research-s48jrg"
$SiteUrl = "https://www.milanhalo.me"

function Say($m)  { Write-Host "`n==> $m" -ForegroundColor Cyan }
function Ok($m)   { Write-Host "    OK  $m" -ForegroundColor Green }
function Warn($m) { Write-Host "    !!  $m" -ForegroundColor Yellow }
function Have($c) { [bool](Get-Command $c -ErrorAction SilentlyContinue) }
function Quiet($c)  { cmd /c "$c 2>nul" }
function Refresh-Path {
  $env:Path = [Environment]::GetEnvironmentVariable("Path","Machine") + ";" +
              [Environment]::GetEnvironmentVariable("Path","User")
}

Write-Host ""
Write-Host "  H A L O  //  V A N T A   -   RDP brain setup" -ForegroundColor Cyan
Write-Host "  ---------------------------------------------"
New-Item -ItemType Directory -Force $Root, "$Root\bridge" | Out-Null

# -- 1. Node.js --------------------------------------------------------------
if (-not (Have node)) {
  Say "Installing Node.js LTS"
  $done = $false
  if (Have winget) {
    try {
      winget install -e --id OpenJS.NodeJS.LTS --silent --accept-source-agreements --accept-package-agreements
      $done = $true
    } catch { Warn "winget failed, falling back to direct download" }
  }
  if (-not $done) {
    $idx = Invoke-RestMethod "https://nodejs.org/dist/index.json"
    $lts = $idx | Where-Object { $_.lts } | Select-Object -First 1
    $msi = "https://nodejs.org/dist/$($lts.version)/node-$($lts.version)-x64.msi"
    $f = "$env:TEMP\node-lts.msi"
    Invoke-WebRequest $msi -OutFile $f
    Start-Process msiexec -ArgumentList "/i `"$f`" /qn /norestart" -Wait
  }
  Refresh-Path
}
if (-not (Have node)) { throw "Node.js did not install - open a NEW window and re-run, or install from nodejs.org manually." }
Ok "node $(node -v)"

# -- 2. Git ------------------------------------------------------------------
if (-not (Have git)) {
  Say "Installing Git"
  $done = $false
  if (Have winget) {
    try {
      winget install -e --id Git.Git --silent --accept-source-agreements --accept-package-agreements
      $done = $true
    } catch { Warn "winget failed, falling back to direct download" }
  }
  if (-not $done) {
    $rel = Invoke-RestMethod "https://api.github.com/repos/git-for-windows/git/releases/latest"
    $asset = $rel.assets | Where-Object { $_.name -match "64-bit\.exe$" } | Select-Object -First 1
    $f = "$env:TEMP\git-setup.exe"
    Invoke-WebRequest $asset.browser_download_url -OutFile $f
    Start-Process $f -ArgumentList "/VERYSILENT /NORESTART" -Wait
  }
  Refresh-Path
}
if (-not (Have git)) { throw "Git did not install - re-run in a new window, or install from git-scm.com." }
Ok "git $(git --version)"

# -- 3. GitHub CLI (optional but nice for pushes) ---------------------------
if (-not (Have gh)) {
  Say "Installing GitHub CLI"
  $done = $false
  if (Have winget) {
    try { winget install -e --id GitHub.cli --silent --accept-source-agreements --accept-package-agreements; $done = $true } catch { Warn "winget failed, falling back to direct download" }
  }
  if (-not $done) {
    $rel = Invoke-RestMethod "https://api.github.com/repos/cli/cli/releases/latest"
    $asset = $rel.assets | Where-Object { $_.name -match "windows_amd64\.msi$" } | Select-Object -First 1
    if ($asset) {
      $f = "$env:TEMP\gh-setup.msi"
      Invoke-WebRequest $asset.browser_download_url -OutFile $f -UseBasicParsing
      Start-Process msiexec -ArgumentList "/i `"$f`" /qn /norestart" -Wait
    }
  }
  Refresh-Path
  if (-not (Have gh)) { Warn "gh still missing - pushes will use Git's own login prompt" }
}
if (Have gh) { Ok "gh $((gh --version) -split "`n" | Select-Object -First 1)" }

# -- 4. Vercel + Claude Code + Codex CLIs -----------------------------------
Say "Installing Vercel, Claude Code, and Codex CLIs (npm)"
npm install -g vercel@latest | Out-Null
npm install -g @anthropic-ai/claude-code | Out-Null
try { npm install -g @openai/codex | Out-Null } catch { Warn "Codex CLI install failed - the bridge will use Claude Code only" }
Refresh-Path
Ok "vercel $(vercel --version 2>$null | Select-Object -First 1)"
if (Have claude) { Ok "claude $(claude --version)" } else { Warn "claude not on PATH yet - open a new window after setup" }
if (Have codex)  { Ok "codex $(codex --version)" }

# -- 5. Sign-ins (each opens a browser - follow the prompts) ----------------
Say "Sign-ins - four quick browser logins"
if (Have gh) {
  $ghAuth = cmd /c "gh auth status 2>&1"
  if (-not ($ghAuth -match "Logged in")) {
    Write-Host "    [1/4] GitHub - sign in as kurohalovanta-hub" -ForegroundColor White
    gh auth login --hostname github.com --git-protocol https --web
  } else { Ok "GitHub already signed in" }
} else { Warn "[1/4] GitHub skipped (no gh)" }

Write-Host "    [2/4] Vercel - sign in as your Vercel account (kurohalovanta-8910)" -ForegroundColor White
vercel whoami 2>$null | Out-Null
if ($LASTEXITCODE -ne 0) { vercel login } else { Ok "Vercel already signed in" }

if (Have codex) {
  Write-Host "    [3/4] ChatGPT Codex - sign in with your ChatGPT account" -ForegroundColor White
  $st = codex login status 2>&1
  if ($st -match "Logged in") { Ok "Codex already signed in" } else { codex login }
}

Write-Host "    [4/4] Claude Code - a Claude window opens NOW. Complete the sign-in," -ForegroundColor White
Write-Host "          then QUIT it (Ctrl+C twice) and setup continues." -ForegroundColor White
if (Have claude) { claude } else { Warn "run 'claude' yourself in a new window afterwards" }

# -- 6. The project ---------------------------------------------------------
Say "Cloning HALO to $Root\Learn"
if (-not (Test-Path "$Root\Learn\.git")) {
  git clone $RepoUrl "$Root\Learn"
} else { Ok "already cloned" }
git -C "$Root\Learn" checkout $Branch
git -C "$Root\Learn" pull origin $Branch
Say "Installing site dependencies (this is the slow one - a few minutes)"
Push-Location "$Root\Learn"
npm install
try { vercel link --yes --scope vantahalo --project learn | Out-Null; Ok "linked to Vercel project 'learn'" } catch { Warn "Vercel link skipped - run 'vercel link' in $Root\Learn later" }
Pop-Location
Ok "project ready at $Root\Learn (read HANDOVER-RDP.md there)"

# -- 7. The bridge - this machine becomes the brain -------------------------
Say "Setting up the HALO bridge"
# always fetch the freshest bridge from the site; local copy is the offline fallback
try {
  Invoke-WebRequest "$SiteUrl/bridge.mjs" -OutFile "$Root\bridge\bridge.mjs" -UseBasicParsing
} catch {
  if ($PSScriptRoot -and (Test-Path "$PSScriptRoot\bridge.mjs")) {
    Copy-Item "$PSScriptRoot\bridge.mjs" "$Root\bridge\bridge.mjs" -Force
  } else { throw "couldn't download bridge.mjs from $SiteUrl and no local copy found" }
}

$tok = [Environment]::GetEnvironmentVariable("HALO_TOKEN","User")
if (-not $tok) {
  Write-Host ""
  Write-Host "    Get your bridge key: open $SiteUrl -> sign in -> Settings ->" -ForegroundColor White
  Write-Host "    connections -> 'create bridge key' (starts with halo_)" -ForegroundColor White
  $tok = (Read-Host "    Paste the bridge key here").Trim()
}
if (-not $tok.StartsWith("halo_")) { Warn "that key doesn't look right - you can re-run this installer any time" }
[Environment]::SetEnvironmentVariable("HALO_TOKEN", $tok, "User")

Write-Host ""
Write-Host "    FULL CONTROL mode: the site's chat can make Claude edit files and run" -ForegroundColor White
Write-Host "    commands ON THIS MACHINE (no permission prompts). Powerful - and it means" -ForegroundColor White
Write-Host "    anyone who gets into your HALO account can drive this machine. Your call." -ForegroundColor White
$fc = Read-Host "    Enable FULL CONTROL brain? (y/N)"
if ($fc -match '^[Yy]') {
  [Environment]::SetEnvironmentVariable("HALO_FULL_CONTROL", "1", "User")
  Ok "FULL CONTROL enabled (unset the HALO_FULL_CONTROL user env var to go back to safe mode)"
} else {
  [Environment]::SetEnvironmentVariable("HALO_FULL_CONTROL", $null, "User")
  Ok "safe mode - tutor can only read the web"
}

# forever-runner (restarts the bridge if it ever dies)
@"
@echo off
:loop
node C:\halo\bridge\bridge.mjs >> C:\halo\bridge\bridge.log 2>&1
timeout /t 5 /nobreak >nul
goto loop
"@ | Set-Content "$Root\bridge\run-bridge.cmd" -Encoding ascii

# invisible launcher for the scheduled task
@"
CreateObject("Wscript.Shell").Run "C:\halo\bridge\run-bridge.cmd", 0, False
"@ | Set-Content "$Root\bridge\run-hidden.vbs" -Encoding ascii

schtasks /Create /F /TN "HALO Bridge" /SC ONLOGON /TR "wscript.exe C:\halo\bridge\run-hidden.vbs" | Out-Null
schtasks /Run /TN "HALO Bridge" | Out-Null
Start-Sleep 3
Ok "bridge installed as a logon task and started (log: C:\halo\bridge\bridge.log)"

# -- done -------------------------------------------------------------------
Write-Host ""
Write-Host "  ---------------------------------------------" -ForegroundColor Cyan
Write-Host "  DONE. This machine is now HALO's brain." -ForegroundColor Green
Write-Host ""
Write-Host "  Check: open $SiteUrl -> Settings -> connections"
Write-Host "         it should say 'bridge online' within ~30 seconds."
Write-Host ""
Write-Host "  Notes: keep this machine logged in (disconnect the RDP window,"
Write-Host "         don't sign out). Bridge log: C:\halo\bridge\bridge.log"
Write-Host "         Project + handover: C:\halo\Learn\HANDOVER-RDP.md"
Write-Host ""
