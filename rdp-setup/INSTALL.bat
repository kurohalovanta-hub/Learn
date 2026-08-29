@echo off
title HALO RDP Setup
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0setup-halo-rdp.ps1"
echo.
pause
