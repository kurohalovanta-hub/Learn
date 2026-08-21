# l0-github — GitHub, Remotes & SSH

Concept: Extending the local commit graph across machines: remotes (origin, clone/fetch/pull/push), SSH keypairs + agent (which also unlock remote GPU boxes later), and the GitHub collaboration layer — fork → branch → pull request → merge — plus reading an unfamiliar repo (README, structure, issues).

Learner prerequisites: l0-git (local graph model, branches, merges — non-negotiable: remotes only make sense as "someone else's copy of the same graph"), l0-terminal. The SSH material assumes the environment-variable/PATH comfort from l0-terminal.

What beginners commonly misunderstand:
- Git ≠ GitHub: the Missing Semester L5 notes call this out explicitly; beginners conflate the tool with the hosting service and think repos "live" on GitHub with local copies as mirrors, rather than peers of a distributed graph.
- What `git pull` is: fetch + merge, not "download the latest" — one of the four commands whose man pages were rewritten in 2024 after an 80-test-reader confusion study; push rejection ("non-fast-forward") is its mirror image and reads as an error rather than a normal state.
- origin/main vs main: "ahead of 'origin/main' by 1 commit" made Julia Evans' confusing-terminology list — remote-tracking branches are invisible until drawn.
- SSH keys: which half is secret, what the agent does, and that authentication (`ssh -T git@github.com`) is separate from authorization on a repo; beginners paste private keys into GitHub or regenerate keys per-machine-per-panic.
- The PR unit: that a pull request is a branch comparison (base ← compare), not a bundle of files — so force-pushing or committing to the branch updates the open PR, which surprises everyone once.

Candidate videos:
1. Missing Semester 2026 L2 "Command-line Environment" (SSH segment) — MIT — ~1 h full lecture [course description; unverified]; SSH portion only — https://www.youtube.com/watch?v=ccBGsPedE9Q (video ID from lecture source; SSH coverage verified substantial: keygen, authorized_keys, ssh-copy-id, scp/rsync, config file, port forwarding — more than GitHub needs, exactly what later GPU-box work needs; correctness 5, scope fit 4)
2. Missing Semester 2026 L5 "Version Control and Git" (remotes segment) — MIT — segment of ~1 h lecture — https://www.youtube.com/watch?v=9K8lB61dl3Y (remotes/collaboration section verified in notes: remote/push/fetch/pull/clone + "Git is not GitHub"; depth is moderate — needs Pro Git supplement for fetch-vs-pull precision)
3. "Git & GitHub Crash Course 2025" — creator unverified — duration unverified — https://www.youtube.com/watch?v=vA5TTz6BXhY (from search; typical crash-courses do clone→push well but SSH shallowly; candidate only)
4. GitHub for Beginners series — GitHub (official YouTube series, recommended by GitHub's own learning-resources page — verified via docs source; individual video URLs not surfaced this session, so no direct links listed)

Candidate written resources:
1. GitHub Docs, "Generating a new SSH key and adding it to the ssh-agent" — verified via source repo (github/docs, content/authentication/connecting-to-github-with-ssh/) — ed25519 keygen, passphrase, per-platform agent setup (macOS keychain flag, Windows PowerShell path, Linux), ~10–15 min do-along. First-party, current.
2. Pro Git 2e, §"Working with Remotes" — verified via book source (progit/progit2, book/02-git-basics/sections/remotes.asc, ~1,400 words) — remote -v, add, FETCH vs PULL distinction, push, remote show. The precision read for the node's diagnostic question.
3. GitHub Docs "Start your journey" series — verified file list via github/docs (what-is-github, creating-a-repository, connecting-to-your-code-locally, reviewing-your-proposed-changes) — the current official replacement for the old Hello World tutorial; browser-first PR flow.
4. Missing Semester 2026 L2 notes, "Remote Machines (SSH)" section — verified via course repo — the conceptual SSH read (public-key auth model, config, scp/rsync) that generalizes beyond GitHub.

Community evidence:
- GitHub community discussion "Best way to learn GitHub as a beginner" (June 2025, fetched directly): branching/commits/PRs feel overwhelming at first; top advice is "practice one small workflow at a time" and make real PRs on your own repos rather than consuming tutorials; Learn Git Branching called "the most intuitive explanation"; freeCodeCamp's 1-hour Git & GitHub video the most-named video (https://github.com/orgs/community/discussions/161493)
- GitHub's own learning-resources page (verified via docs source) points beginners at the Skills interactive courses, the GitHub for Beginners video series, and Learn Git Branching — first-party endorsement of the interactive-practice path (https://github.com/github/docs — content/get-started/start-your-journey/git-and-github-learning-resources.md)
- 2024 man-page revision study (80 test readers confused by add/checkout/push/pull) — direct evidence that push/pull semantics, this node's diagnostic, are a real stumbling block even for practitioners (https://git.github.io/rev_news/2024/02/29/edition-108/)
- Scrimba 2026 review: local-vs-remote distinction is one of the three things beginners consistently struggle with (https://scrimba.com/articles/best-git-and-github-courses-and-tutorials-in-2026/)
- Note: reddit.com blocks crawler access; GitHub's own community forum (above) served as the direct beginner-voice source this session.

Primary technical authority:
- GitHub official documentation (docs.github.com — site egress-blocked this session; verified current via its public source repo https://github.com/github/docs) for SSH + PR flow; Pro Git 2e for remote semantics; Missing Semester 2026 L2 for SSH-beyond-GitHub.

Selected shortest-sufficient packet:
- DIAGNOSTIC: Cold, 5 min: "What does `git pull` actually do? When is a push rejected, and what do you do?" + "Which SSH file is the secret, and what does `ssh -T git@github.com` prove?" + sketch where origin/main sits in your l0-git graph drawing after a teammate pushes.
- ORIENT: GitHub Docs "What is GitHub?" from the Start-your-journey series (~5 min read) — establishes Git-vs-GitHub cleanly before any command.
- CORE WATCH: — (this node is API-of-the-world material; reading + doing beats watching. The L2/L5 video segments above are optional second channels for the SSH and remotes portions respectively.)
- CORE READ: Pro Git "Working with Remotes" (~12 min, the fetch-vs-pull model) → Missing Semester L2 notes, SSH section only (~15 min) → GitHub Docs SSH key guide as a strict do-along (~15 min, produces your actual working key).
- INTERACTIVE: — (no in-app widget; the external interactive is GitHub Skills "Introduction to GitHub" under PRACTICE, plus Learn Git Branching's Remote world under STUCK PATH)
- PRACTICE: (1) SSH: generate ed25519 key, add to agent, add to GitHub, `ssh -T git@github.com` — then clone your own repo over SSH; (2) GitHub Skills "Introduction to GitHub" (https://github.com/skills/introduction-to-github — verified, bot-driven, <1 h): branch → commit → PR → merge with automated feedback; (3) the node's exercise: publish a local repo (remote add origin, push -u), then open a PR from a branch against your own main and merge it; (4) two-clones drill: clone the same repo twice into different folders, commit in A, observe B's `git fetch` then `git status` ("behind"), `git pull`; then create a rejected push on purpose (commit in both) and resolve it — this single drill produces every message the diagnostic asks about.
- IMPLEMENT/DERIVE: Extend the l0-git hand-drawn graph with origin/main and a second clone; annotate exactly which arrows fetch, merge, pull, and push move. One page; this diagram is the node.
- STUCK PATH: Learn Git Branching, Remote intro sequence (~30 min — the node's existing backup, community-endorsed as "most intuitive"); Julia Evans' confusing-terminology entry for "ahead of origin/main" (https://jvns.ca/blog/2023/11/01/confusing-git-terminology/).
- DEEPEN: Missing Semester L2's remaining SSH material (config file, scp/rsync, port forwarding) — schedule it the week the first remote GPU box appears (L4/L7), not now; GitHub Docs "reviewing-your-proposed-changes" for PR-review mechanics.
- PROVE IT: The node's mastery test: clone an unfamiliar medium-sized repo (LeRobot or similar), orient in 20 min (entry points, structure, how to run), and push a small documented change to your fork — narrated log required.
- TRANSFER: Use the same SSH mental model on a non-GitHub host: `ssh` into any second machine or VM (or OverTheWire Bandit's SSH login from l0-terminal re-read as "now you know what that -p 2220 and password prompt were") and explain how key auth would replace the password; open a docs-typo PR against a real public repo when one is genuinely found (no manufactured PRs).
- RETENTION: 7 days: cold re-answer the pull/push-rejection diagnostic + fetch vs pull one-liner; 30 days: rotate to a new machine or re-verify agent setup from memory when the dev container/VM appears in later levels.

Why this won: Keeps the repo's verified primary (Missing Semester L2 SSH + L5 remotes) but re-weights toward first-party do-alongs, because this node is 80% procedure: GitHub's own SSH guide (verified current in the docs source) produces the working key in 15 minutes, GitHub Skills gives bot-graded PR practice in under an hour (first-party, verified), and Pro Git's 1,400-word remotes section nails the fetch-vs-pull distinction the 2024 man-page study proved people lack. The two-clones drill manufactures every confusing message (behind/ahead/rejected) in a controlled setting once, so they are never scary in the wild. Core ≈ 2.5 h of the 3 h budget.

What was rejected (and why): The old "Hello World" GitHub tutorial as named in prior notes — verified GONE from the docs tree (replaced by the Start-your-journey series; packet cites the current pages). Whole Missing Semester L2 (tmux/dotfiles/job-control are separate concerns; SSH section only — cluster rule). HTTPS + credential-manager path as primary — works, but SSH is required later for GPU boxes anyway, so learn it once now (HTTPS noted as the fallback when a network blocks port 22). Crash-course videos — SSH treated shallowly; procedure is better read than watched. Manufactured open-source PRs for practice — replaced with own-repo PR + Skills course; a real-typo PR only if genuinely found.

Risk of superficial understanding: Ritual completion — keys pasted, PR button clicked, no model of what moved where. The graph-extension diagram and the two-clones drill are the antidotes (they force the remote-tracking-branch model); PROVE IT is orientation in a repo the learner has never seen, which cannot be ritualized. SSH risk: copying the wrong key or skipping the agent — the do-along explicitly ends with `ssh -T` proof and a "which file is secret and why" narration.

Required active work: Working ed25519 key + agent + `ssh -T` proof; Skills course completed; own-repo PR opened and merged; two-clones drill incl. a deliberate rejected push; annotated remote graph diagram; timed 20-min unfamiliar-repo orientation + fork push.

Last verified: 2026-08-21
