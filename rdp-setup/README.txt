HALO RDP SETUP  (PROJECT : VANTA HALO)
======================================

This turns a clean Windows machine into HALO's always-on brain.

HOW TO USE
1. Copy this whole folder onto the RDP (e.g. the Desktop).
2. Double-click INSTALL.bat
3. Follow the four sign-ins when browsers open:
   GitHub -> Vercel -> ChatGPT (Codex) -> Claude
4. When asked, paste your bridge key
   (get it at https://www.milanhalo.me -> Settings -> connections
    -> "create bridge key")
5. Done. The site's tutor now answers through this machine's
   Claude Code / Codex logins, 24/7. Your phone works too.

WHAT GETS INSTALLED
- Node.js LTS, Git, GitHub CLI
- Vercel CLI, Claude Code, ChatGPT Codex
- The whole project at C:\halo\Learn  (read HANDOVER-RDP.md there)
- The bridge at C:\halo\bridge (auto-starts at logon, log: bridge.log)

NOTES
- A .bat is used instead of a compiled .exe on purpose: an unsigned
  .exe gets blocked by Windows Defender; this script is readable and
  does exactly what it says.
- Keep the machine LOGGED IN: close/disconnect the RDP window,
  do not "sign out".
- Safe to re-run INSTALL.bat any time - every step skips itself
  if already done.
