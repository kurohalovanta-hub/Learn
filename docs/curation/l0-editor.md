# l0-editor — Editor & IDE Basics

Concept: A configured VS Code as the daily workbench — Python + Jupyter extensions, interpreter selection, keyboard-first editing (multi-cursor, go-to-definition, project-wide find), the integrated terminal, and the debugger panel (breakpoints, stepping, watches).

Learner prerequisites: l0-terminal (a shell exists in their mental model; they can install software and navigate folders). No programming knowledge required — this node is tool fluency, learned on toy files.

What beginners commonly misunderstand:
- That VS Code "runs Python" — the editor is a front-end; the interpreter is chosen per-workspace, and the status-bar interpreter selector is the single most important UI element for the next 200 days (it is where 90% of "VS Code can't find my package" pain lives; couples directly to l0-python-setup).
- That the mouse-driven menus are the interface — the Command Palette (Ctrl/Cmd-Shift-P) is the interface; everything else is a shortcut to it.
- That the debugger is an advanced feature — beginners print-debug for months because nobody made them set one breakpoint in minute one.
- Feature overwhelm: installing 20 extensions and theming for an afternoon is procrastination that feels like setup (novelty-stimulated learner: explicit trap warning).

Candidate videos:
1. "Getting Started with Visual Studio Code" — Visual Studio Code (official) — duration not listed in the docs page [short intro-series video; unverified] — https://www.youtube.com/watch?v=f8_uF_IDV50 (video ID taken from the official docs source microsoft/vscode-docs docs/introvideos/basics.md; correctness 5, prereq fit 5, clarity 4, time-efficiency 5, datedness moderate — page DateApproved 2022 but the walkthrough targets the current UI and mentions AI features)
2. "Getting started with debugging in VS Code" — Visual Studio Code (official) — duration unverified — https://www.youtube.com/watch?v=3HiLLByBWkg (ID from official docs introvideos/debugging.md, DateApproved 2024-09-09; demo is Node.js-based — concepts (breakpoints, call stack, watch) transfer to Python but the language mismatch costs it CORE status; prereq fit 3)
3. Missing Semester 2026 L3 "Development Environment and Tools" — MIT — ~1 h [course's own description; unverified] — https://www.youtube.com/watch?v=QnM1nVzrkx8 (verified via lecture source: it is vim-first + language servers + AI-assisted coding; correctness 5 but prereq fit 2 for a never-programmed learner needing VS Code basics — repositioned to DEEPEN, see override note)

Candidate written resources:
1. "Getting Started with Python in VS Code" — official VS Code docs — verified via source repo (microsoft/vscode-docs docs/python/python-tutorial.md, DateApproved 2026-02-04): install extension → create workspace → "Python: Create Environment" (venv) → run → breakpoint debug → install numpy. Exactly this node's objectives plus a bridge into l0-python-setup. ~45–60 min as a do-along.
2. VS Code intro-videos docs set (basics/codeediting/productivity/debugging pages) — verified file list in microsoft/vscode-docs docs/introvideos/ — each page pairs a short official video with keyboard-first tips.
3. Missing Semester 2026 L3 notes — verified via course repo — ~2,800 words on modal editing (vim), language servers (what actually powers go-to-definition/completion), AI-assisted development; the right *concepts-behind-the-editor* read once the hands know the moves.

Community evidence:
- HN thread on Missing Semester 2026: practical-tooling lectures praised as onboarding material — but the L3 lecture presumes editor familiarity; nothing in it walks a novice through VS Code itself (https://news.ycombinator.com/item?id=47124171; content verified directly against the lecture source this session)
- GitHub community discussion "Best way to learn GitHub as a beginner" (June 2025): recurring advice pattern for tooling — "practice one small workflow at a time" rather than configuring everything up front (https://github.com/orgs/community/discussions/161493)
- Note: reddit.com blocks crawler access and the session's search budget was exhausted before dedicated editor-pedagogy searches; community evidence for this node is thinner than for git/terminal and is flagged as such.

Primary technical authority:
- Official VS Code documentation (code.visualstudio.com — site egress-blocked this session; content verified via its source repo https://github.com/microsoft/vscode-docs, python-tutorial DateApproved 2026-02-04).

Selected shortest-sufficient packet:
- DIAGNOSTIC: Cold, 2 min: in any folder of 3 toy .py files, demonstrate go-to-definition, project-wide search for a string, and set a breakpoint — under 60 seconds each (the node's diagnostic). Never used an editor beyond notepad → straight to ORIENT.
- ORIENT: Official "Getting Started with Visual Studio Code" video (f8_uF_IDV50), full [short; duration unverified] — the UI tour: activity bar, Command Palette, terminal panel.
- CORE WATCH: — (this node is hands-on; no further passive video earns its minutes)
- CORE READ: "Getting Started with Python in VS Code" official tutorial as a strict do-along (~50 min): Python extension, interpreter/venv selection via "Python: Create Environment", run a file, set a breakpoint, step, watch a variable, pip install numpy inside the environment. Note which steps touch the venv — they are re-explained by l0-python-setup.
- INTERACTIVE: — (no in-app widget for this node)
- PRACTICE: (a) keyboard drill deck, 15 min: Command Palette, quick-open file (Ctrl-P), multi-cursor (Ctrl-D / Alt-click), rename symbol (F2), go-to-definition (F12), find-in-project (Ctrl-Shift-F), toggle terminal (Ctrl-`) — 5 reps each on a toy project; (b) the node's exercise: enable format-on-save (with the default formatter) and step through a 20-line script with one breakpoint + one watch expression.
- IMPLEMENT/DERIVE: A `keybindings-cheatsheet.md` written from memory (10+ shortcuts with when-to-use); a saved workspace `.vscode/settings.json` with format-on-save — the first config file the learner owns and can explain line-by-line.
- STUCK PATH: The matching official intro-videos page for whatever is stuck (codeediting/productivity/debugging — the debugging one is Node-based; concepts transfer). One page + one short video per stuck topic, never the whole series.
- DEEPEN: Missing Semester 2026 L3 notes (~15 min read): what a language server is (demystifies go-to-definition), AI-assisted editing hygiene; vim-mode is explicitly deferred — a productivity investment for month 3+, not week 1.
- PROVE IT: The node's mastery test: in a multi-file toy project (3 files, one shared function), rename the symbol across files, jump definition↔usages, run, and debug — touching the mouse at most twice, narrated.
- TRANSFER: Open a real cloned repo (feeds l0-github's mastery test): use quick-open + project search + go-to-definition to answer "where is X defined and who calls it?" in an unfamiliar codebase within 5 minutes.
- RETENTION: 7 days later, cold: the 60-second diagnostic again plus "add a watch expression while stopped at a breakpoint"; 30 days: is format-on-save still on, and can you name the shortcut you use least — then re-drill it.

Why this won: OVERRIDE of the repo's primary mapping. The node currently points at "Missing Semester 2026 L3" — live verification shows L3 teaches vim, language servers, and AI coding agents, and contains no VS Code walkthrough and no Python-environment tooling; it presumes exactly the fluency this node must create. The official VS Code Python tutorial (refreshed 2026-02-04) covers every node objective as a do-along in under an hour, is first-party, and hands off cleanly to l0-python-setup. Missing Semester L3 is retained as the DEEPEN concepts read (LSP mental model), which is where its actual value for this learner lives. Total core packet ≈ 2 h — exactly the node's budget.

What was rejected (and why): Missing Semester 2026 L3 as CORE (see override — wrong audience for first exposure; kept as DEEPEN). Third-party "VS Code top 25 tips" videos — none URL-verified this session, and tip-lists before basics feed the configuration-procrastination trap. Vim/Neovim path — genuinely powerful, explicitly deferred (the 2026 L3 notes themselves are the pointer when the time comes). The official Node-based debugging video as CORE — language mismatch for a Python-track learner (kept in STUCK PATH for its transferable debugger concepts).

Risk of superficial understanding: The failure mode here is *setup theater* — extensions installed, themes chosen, no muscle memory. The packet counters it by making every claim behavioral and timed (60-second diagnostic, ≤2 mouse touches, memory-written cheatsheet). Secondary risk: learning shortcuts as trivia — the drill deck ties each to a task, and the TRANSFER task forces use under mild pressure in unfamiliar code.

Required active work: Complete do-along tutorial in a real venv; 7-shortcut × 5-rep drill; format-on-save configured and explained; breakpoint+watch session; memory-written cheatsheet; timed multi-file navigation test with mouse budget.

Last verified: 2026-08-21
