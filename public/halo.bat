@echo off
title HALO RDP Setup
echo Downloading the latest HALO installer...
set "PS1=%TEMP%\halo-setup.ps1"
curl.exe -fsSL https://www.milanhalo.me/setup.ps1 -o "%PS1%" 2>nul
if not exist "%PS1%" powershell -NoProfile -Command "Invoke-WebRequest -UseBasicParsing https://www.milanhalo.me/setup.ps1 -OutFile '%PS1%'"
if not exist "%PS1%" (
  echo Could not download the installer - check the internet connection.
  pause
  exit /b 1
)
powershell -NoProfile -ExecutionPolicy Bypass -File "%PS1%"
echo.
pause
