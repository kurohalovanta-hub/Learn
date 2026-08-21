# l0-terminal — Terminal & Shell

Concept: The shell as the driver's seat for everything else in the program — filesystem navigation and manipulation (cd/ls/mv/cp/rm/find/grep), composing commands with pipes and redirection, PATH and environment variables, exit codes, and reading `man`/`--help` without panic.

Learner prerequisites: None (root node). The learner has NEVER opened a terminal. High general computer familiarity, so the barrier is unfamiliarity, not aptitude. Platform note: on a Windows PC, install WSL2 + Ubuntu first so every command in the packet behaves like the Linux the whole curriculum assumes; on macOS the built-in terminal is fine.

What beginners commonly misunderstand:
- That the terminal is "the hard way" / a hacker aesthetic — it is the fast way once ~10 commands are reflexes; community evidence repeatedly finds the barrier is unfamiliarity plus fear of breaking something, not difficulty.
- That commands are magic incantations to memorize, rather than programs with arguments whose composition (pipes, redirection) is the actual skill.
- That an error or a `man` page is a wall of noise — beginners don't yet know that `--help`, exit codes, and the *last line* of output are structured information.
- Where they "are": no mental model of the working directory, so relative vs absolute paths and `cd ..` feel random.
- rm has no trash can; tab-completion and history (↑, Ctrl-R) exist — beginners type everything by hand and conclude the terminal is slow.

Candidate videos:
1. Missing Semester 2026 L1 "Course Overview + Introduction to the Shell" — MIT (Anish/Jon/Jose) — ~1 h [per the course's own "nine 1-hour lectures" description; exact duration unverified] — https://www.youtube.com/watch?v=MSgoeuMqUmU (video ID taken from the lecture page source; correctness 5, prereq fit 4 — brisk but assumes nothing, clarity 5, intuition 5 (motivates *why* shell), rigor 4, time-efficiency 4, exercise fit 5 — the notes carry 19 real exercises, future relevance 5, datedness risk low — 2026 edition)
2. Missing Semester 2020 "Shell Tools and Scripting" — MIT — ~50 min [typical MIT lecture length; unverified] — https://www.youtube.com/watch?v=kgII-YWo3Zw (video ID from the 2020 lecture page source; correctness 5, prereq fit 3 — assumes L1, deeper find/grep/history material the 2026 L1 compresses; exercise fit 5)
3. "Command Line Basics for Beginners – Full Course" — creator unverified — duration unverified (listed June 2026) — https://www.youtube.com/watch?v=mABpAI-pCw0 (surfaced in search for absolute-beginner tutorials; unvetted content — kept as candidate only)
4. "Linux Terminal Crash Course – For Absolute Beginners" — creator unverified — duration unverified (Dec 2025) — https://www.youtube.com/watch?v=hREnP0HslK8 (same: discovery-signal candidate, not vetted)
5. "Linux Terminal for Beginners – The Complete Starter Guide" — tutorialsEU (per Class Central listing https://www.classcentral.com/course/youtube-linux-terminal-for-beginners-the-complete-starter-guide-248273) — duration unverified — https://www.youtube.com/watch?v=i0DX8U5ttqQ (explicitly aimed at people who avoided the terminal because it looks intimidating; production quality unvetted)

Candidate written resources:
1. Missing Semester 2026 L1 notes — https://missing.csail.mit.edu/2026 (site egress-blocked this session; content verified via the source repo: https://github.com/missing-semester/missing-semester/blob/master/_2026/course-shell.md) — ~4,200 words: what a shell is → navigation/paths → PATH & `which` → cat/sort/uniq/head/tail/grep/sed/find/awk → pipes/redirects → scripts. 19 exercises. The single best-fit read.
2. Missing Semester 2020 L2 "Shell Tools and Scripting" notes — verified via repo (_2020/shell-tools.md) — ~3,400 words: scripting variables/control flow, man/tldr, find, grep/ripgrep, history/Ctrl-R. 5 exercises (marco/polo, flaky-script loop, zip of HTMLs, recency listing).
3. The Art of Command Line — Joshua Levy et al. — https://github.com/jlevy/the-art-of-command-line (verified; 162k stars) — breadth-first one-page reference from basics to obscure; too dense as a first read, ideal as the post-packet cheat sheet.
4. Missing Semester 2026 L2 "Command-line Environment" notes (verified via repo) — streams, env vars, return codes, signals/job control — the natural *second* packet; overlaps l0-github's SSH material.

Community evidence:
- dev.to "10 Terminal Commandments for coding newbies": the terminal itself isn't what frightens people but the unfamiliarity; ~10 commands suffice to start; `history` and cheat sheets lower the load (https://dev.to/stackoverturf/10-terminal-commandments-for-coding-newbies-3doe)
- dev.to (techrud) beginner retrospective: a single ~30-min crash-course video (Traversy-style) took them "from zero to comfortable" with terminal+git — short watch + immediate practice beats long courses for first exposure (https://dev.to/techrud/git-github-and-the-command-line-are-not-that-hard-beginners-learning-resource-3bb2)
- HN thread on the Missing Semester 2026 revision: strongly positive; adopted as onboarding material at companies; practical-tools framing praised (https://news.ycombinator.com/item?id=47124171); same sentiment on Lobsters (https://lobste.rs/s/q4ykw7/missing_semester_your_cs_education_2026)
- OverTheWire Bandit is the consensus "learn the command line by playing" recommendation for absolute beginners (34 SSH-gated levels of cat/find/grep puzzles) (https://hackerdna.com/blog/overthewire-wargames-guide, https://www.freecodecamp.org/news/improve-you-cybersecurity-command-line-skills-bandit-overthewire-game-walkthrough/, https://overthewire.org/wargames/bandit/)
- Note: reddit.com blocks crawler access, so r/learnprogramming threads could not be cited directly this session; the above are the accessible equivalents.

Primary technical authority:
- Missing Semester 2026 lecture notes (MIT CSAIL) — the repo's verified primary; content re-verified this session via the course source repo (https://github.com/missing-semester/missing-semester).
- `man bash` and each tool's `--help`/man page — learning to consult these IS one of the node objectives.

Selected shortest-sufficient packet:
- DIAGNOSTIC: Cold, 5 min, no AI: open a terminal; predict then verify `pwd`, `ls -l`, `cd ..`; explain what `cat data.txt | grep error | wc -l` prints for a 6-line sample file shown on paper; write "find all *.log modified in the last day". Fluent → jump straight to PROVE IT.
- ORIENT: First segment of Missing Semester 2026 L1 video (motivation → "what is the shell" → navigation), ~0:00–20:00 [approx — watch until the tools tour begins], at 1.25–1.5×. Watching someone *drive* a terminal is the fastest cure for never-opened-one paralysis.
- CORE WATCH: — (the ORIENT segment is the only passive video; the rest of the hour is better spent typing)
- CORE READ: Missing Semester 2026 L1 notes, full (~25 min) — typing EVERY command into your own shell as you read; skim the awk/sed/jq passages (they return in L1's later exercises and in data-wrangling later). Then, as a second sitting: 2020 L2 notes, sections "finding how to use commands" + "finding files (find)" + "finding code (grep)" + "finding shell commands (history)" (~15 min).
- INTERACTIVE: — (no in-app widget for this node)
- PRACTICE: 2026 L1 exercises #1–#14 (shell check, ls -l semantics, globs, quoting, redirection, &&/||, cd builtin, test -f script, chmod +x, set -x, date-stamped backups, flaky-script args, top file extensions, xargs line count) — skip the jq/awk ones first pass; 2020 L2 exercises #1 (ls flags) and #2 (marco/polo); then the node's own three: find+grep for "import numpy", LOC one-liner excluding blank lines, break-and-fix PATH.
- IMPLEMENT/DERIVE: A personal `cheatsheet.md` written from memory at the end (commands + one-line "when I reach for it"), then checked against The Art of Command Line — the delta is the review list.
- STUCK PATH: OverTheWire Bandit levels 0–8 (https://overthewire.org/wargames/bandit/) — puzzle format forces recall of cat/ls/find/grep with no way to fake it; freeCodeCamp's walkthrough exists if truly stuck. Alternatively the tutorialsEU absolute-beginner video above for a gentler second telling.
- DEEPEN: The Art of Command Line "Basics" + "Everyday use" sections; 2026 L2 notes (streams/signals/job control) — scheduled anyway before l0-github's SSH work.
- PROVE IT: The node's mastery test — a messy directory of 100 mixed files (generate it with a provided script): organize into subdirectories by type, find the 3 files containing a given string, batch-rename by pattern, archive — shell only, no file manager, no AI, target ≤ 25 min.
- TRANSFER: Bandit levels 9–12 (unfamiliar puzzle context, adds sort/uniq/strings under pressure); plus one real-life task: untangle your own Downloads folder from the shell.
- RETENTION: 7 days later, cold: re-write the error-counting pipeline, the "modified in last day" find, and explain PATH in two sentences; 30 days later: the LOC one-liner from memory.

Why this won: The repo's existing pick (Missing Semester 2026 L1 + 2020 L2) survives live re-verification and remains the only authority-grade text that motivates the shell for people who think well; the packet fixes its one mismatch — MIT pacing for a learner who has never opened a terminal — by fronting a 20-min watch-someone-drive segment, converting the notes into a type-along, trimming awk/sed/jq to a later pass, and adding a game-format stuck path (Bandit) with genuine community consensus behind it. Total core packet ≈ 3.5 h focused (5 h node budget covers retention + slop), versus 2× that for any crash-course-video-plus-course combination.

What was rejected (and why): Whole-course Missing Semester (violates cluster rule; L6–L9 and half of L2 are not survival material). The 5-h freeCodeCamp-style "50 commands" long courses — passive hours with worse retention per minute than 19 typed exercises. Generic 2025/2026 YouTube crash courses (mABpAI-pCw0, hREnP0HslK8, uwAqEzhyjtw, 5XgBd6rjuDQ) — none could be duration/quality-verified this session and none add anything over the MIT notes + Bandit combination. Mac-specific tutorial (eN8vlFEFKH8) — platform mismatch risk. The Linux Command Line (Shotts) book — excellent but 500+ pages: wrong granularity for a 5-h node (also URL not verifiable this session).

Risk of superficial understanding: High if the learner watches instead of types — recognition of `find` syntax is not production of it (this learner's known failure mode). Mitigations built in: every video minute is capped and paired with typed exercises, the cheatsheet is written from memory, Bandit and PROVE IT are unfakeable, and the diagnostic/retention checks are production-format (write the command cold), never multiple-choice.

Required active work: Type every command in both lecture notes; 16+ exercises; break-and-fix PATH; memory-written cheatsheet; Bandit 0–8 (stuck path) or 9–12 (transfer); timed 100-file cleanup without AI.

Last verified: 2026-08-21
