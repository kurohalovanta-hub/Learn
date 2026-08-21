# l0-git — Git Fundamentals

Concept: Git as a graph of snapshots, not a save button: working tree → staging area → commit DAG → branches as movable pointers; fluency in add/commit/status/log/diff/branch/checkout/merge; safe undo (restore/revert/reset) and recovery (reflog). Every experiment in this program is a commit.

Learner prerequisites: l0-terminal (comfortable running commands, paths, editing files). No GitHub/remotes needed — that is l0-github; this node is entirely local.

What beginners commonly misunderstand:
- Commands-without-model: memorizing add/commit/push as incantations, then being helpless at the first conflict — 2026 course reviews state most git courses teach commands without the mental model, and beginners specifically struggle with staging, local-vs-remote, and merge conflicts.
- The staging area: why a second step exists between "I changed it" and "it's saved" — consistently the #1 named confusion (index/staged terminology made Julia Evans' confusing-terminology list; GeeksforGeeks' most-confusing list leads with it).
- Detached HEAD: "one of the weirdest messages git shows newcomers" — meaningless until branches-are-pointers is understood.
- Commits as diffs: modeling a repo as a pile of patches makes git's behavior unpredictable; the snapshot/DAG model (Pro Git: "a branch is simply a lightweight movable pointer to one of these commits") is the unlock repeatedly cited in HN teaching threads.
- Fear of loss: believing a bad command destroys work — in truth committed states are recoverable via reflog until GC (the node's own misconception field), and knowing this changes behavior from timid to experimental.

Candidate videos:
1. Missing Semester 2026 L5 "Version Control and Git" — MIT — ~1 h [course's own description; unverified] — https://www.youtube.com/watch?v=9K8lB61dl3Y (video ID from lecture source; correctness 5, prereq fit 4, intuition 5 — teaches the data model FIRST (blobs/trees/DAG) exactly matching this node's objectives; rigor 5; time-efficiency 4; exercise fit 5 — its exercises include Learn Git Branching and a deliberate merge-conflict scenario)
2. "Learn Git – Full Course for Beginners" — freeCodeCamp — long-form [multi-hour; duration unverified] — https://www.youtube.com/watch?v=zTjRZNkhiEU (clarity 4, time-efficiency 2 for this learner — completionism trap; rejected as core)
3. "Git & GitHub Crash Course 2025" — creator unverified — duration unverified — https://www.youtube.com/watch?v=vA5TTz6BXhY (discovery-signal candidate from search; typical crash-course scope skews to push-to-GitHub recipes over the graph model)
4. — (Fireship's "Git in 100 seconds", Colt Steele's 15-min git, and The Coding Train intros exist in this niche, but their URLs did not appear in this session's search results and are omitted per the URL-integrity rule)

Candidate written resources:
1. Missing Semester 2026 L5 notes — verified via course source repo (_2026/version-control.md) — ~4,800 words; data-model-first (snapshots, content-addressing, references), then staging, CLI basics, branching/merging, undo; 8 exercises. Written for people who think well; the node's existing primary — confirmed.
2. Pro Git 2e, §"Branches in a Nutshell" — verified via book source (https://github.com/progit/progit2, book/03-git-branching/sections/nutshell.asc, ~2,100 words) — commits store trees+parents; "a branch in Git is simply a lightweight movable pointer"; HEAD. The canonical 10-minute branch-model read. (Canonical home git-scm.com/book — egress-blocked this session, verified via source repo.)
3. Pro Git 2e, §"What is Git?" — verified via book source (what-is-git.asc) — snapshots-not-diffs, the three states (modified/staged/committed), checksummed integrity. The alternate telling of the L5 data model.
4. "Oh Shit, Git!?!" — Katie Sylor-Miller — verified via https://github.com/ksylor/ohshitgit (swear-free mirror dangitgit.com) — scenario-indexed recovery recipes; the emotional-safety supplement, actively discussed on HN as recently as 2025.
5. "Confusing git terminology" — Julia Evans — https://jvns.ca/blog/2023/11/01/confusing-git-terminology/ (URL from search results; site egress-blocked for direct fetch) — plain-language decoding of detached HEAD, fast-forward, index/staging/staged, "ahead of origin/main".

Community evidence:
- Scrimba's 2026 course-landscape review: "Most Git courses teach commands without teaching the mental model… beginners struggle with staging concepts, local vs. remote distinctions, and merge conflict resolution" — model-first selection criterion confirmed (https://scrimba.com/articles/best-git-and-github-courses-and-tutorials-in-2026/)
- Lobsters "What's the best git tutorial": Learn Git Branching praised because it "shows the actual graph" and you transform it directly; ~2 hours of it puts you ahead of most users (https://lobste.rs/s/wsw3ue/what_s_best_git_tutorial)
- HN on Learn Git Branching: "very good for learning how Git branching works" — recurring recommendation across years (https://news.ycombinator.com/item?id=43241136, https://news.ycombinator.com/item?id=5937994); the tool itself verified active, 33.9k stars (https://github.com/pcottle/learnGitBranching)
- HN "How to teach Git" + "Git basics" threads: consensus that repo-as-diffs intuition fails and snapshot/graph teaching works (https://news.ycombinator.com/item?id=18919599, https://news.ycombinator.com/item?id=19933011)
- Julia Evans & collaborator revised git's official man pages based on feedback from 80 test readers about what was confusing (add/checkout/push/pull) — direct 2024 evidence of where real users stumble (https://git.github.io/rev_news/2024/02/29/edition-108/)
- Detached HEAD singled out as "one of the weirdest" messages for newcomers (https://www.cloudbees.com/blog/git-detached-head); staging area tops the most-confusing lists (https://www.geeksforgeeks.org/git/most-confusing-git-concepts/)
- HN "Oh Shit, Git?" (2025): recovery-recipe culture plus modern-command advice (git switch/restore over checkout; treat reset --hard with care) (https://news.ycombinator.com/item?id=42728916)
- Note: reddit.com blocks crawler access; r/git could not be cited directly — the above sources triangulate the same confusions.

Primary technical authority:
- Missing Semester 2026 L5 notes (existing repo primary — confirmed) + Pro Git 2e (Scott Chacon & Ben Straub; free book, verified via source repo) for precision on the object model; git's own man pages once fluent.

Selected shortest-sufficient packet:
- DIAGNOSTIC: The node's diagnostic, cold on paper, ~10 min: draw the commit graph after commit ×2 → branch f → commit on f → checkout main → commit → merge f; state where HEAD points at each step. Also: "what's the difference between the working tree, the staging area, and a commit?" Clean answers → PROVE IT directly.
- ORIENT: Learn Git Branching (https://learngitbranching.js.org/), first 3–4 levels of the Main intro sequence, ~20 min — SEE commits and branches as graph nodes before any terminology lands. (Chosen over a video: it is the same visual explanation but with the learner's hands on the graph.)
- CORE WATCH: Missing Semester 2026 L5 video, data-model portion, ~0:00–30:00 [approx — through staging + basic CLI; timestamps unverified], 1.25×, https://www.youtube.com/watch?v=9K8lB61dl3Y — optional for a reader-learner; the notes carry everything.
- CORE READ: Missing Semester 2026 L5 notes through "undo" (~30 min, terminal open, every command typed in a scratch repo); then Pro Git "Branches in a Nutshell" (~10 min) immediately before the branching/merge exercises.
- INTERACTIVE: — (no in-app widget; Learn Git Branching Main sequence is the external interactive, continued under PRACTICE)
- PRACTICE: (1) Learn Git Branching: finish Main intro sequence + "ramping up" (~40 min total across sittings); (2) the node's exercises in a real repo: 5 commits → branch → deliberate merge conflict → resolve it reading the conflict markers; recover a "lost" commit with reflog after a hard reset; (3) from Missing Semester L5 exercise set: the multi-branch merge-conflict scenario; (4) after EVERY command in (2)–(3), predict `git log --all --graph --oneline` before running it — prediction is the drill.
- IMPLEMENT/DERIVE: Hand-draw the object model of your real scratch repo: commits with parent arrows, branch refs, HEAD — then verify against `git log --graph` and `cat .git/HEAD`, `ls .git/refs/heads/`. Reading .git directly is the proof the model is real, not metaphor.
- STUCK PATH: Julia Evans' "Confusing git terminology" for any term that stings (detached HEAD, fast-forward); Oh Shit Git / dangitgit.com for any "I broke it" moment — recipe first, then explain the recipe back in graph terms.
- DEEPEN: Pro Git "What is Git?" + ch 3 remaining sections (basic branching/merging); HN "Key Git Concepts Explained the Hard Way" (https://news.ycombinator.com/item?id=16586811) for the plumbing-level view — only if the object model fascinates.
- PROVE IT: The node's gold mastery test: a prepared repo with a broken merge and a deleted branch — restore both to working state, no AI, no cheat sheet, narrating each command's effect on the commit graph (~30 min). (A setup script for this scenario belongs in the lesson build.)
- TRANSFER: In Learn Git Branching, solve 3 unseen levels in minimum commands (git golf); then in the real repo: use `git bisect` conceptually — find which of 8 commits broke a script by checkout-and-test, narrating the binary search (bridges to l0-debug-mindset).
- RETENTION: 7 days: cold-draw the diagnostic graph variant with a second feature branch; 30 days (during L1 project work): recover an actually-lost commit via reflog in your live project — logged as done when it happens naturally, else staged as a drill.

Why this won: The repo's existing primary (Missing Semester 2026 L5, data-model-first) is confirmed against the live 2026 source and is exactly aligned with this node's graph-mental-model objectives; the packet's contribution is sequencing and enforcement — graph-first via 20 min of Learn Git Branching BEFORE terminology (the community's single most-endorsed clicking mechanism, and already the node's backup resource), notes as type-along, Pro Git's 2,100-word branch-pointer section at the exact moment branches begin, and prediction-before-execution as the standing drill. Community evidence (Scrimba 2026, Lobsters, HN teaching threads, Evans' 80-reader man-page study) converges on model-first + visual + recovery-safety, which is precisely this packet. Core ≈ 4 h of the 5 h budget.

What was rejected (and why): freeCodeCamp multi-hour git course (zTjRZNkhiEU) — completionism trap; this learner's known time-sink per the feasibility report. Crash-course videos (vA5TTz6BXhY) — recipe-first, model-later is backwards for a gold-gated node. Git-from-plumbing-first approaches (build-git-yourself, "explained the hard way") as core — superb but wrong altitude for week 1; parked in DEEPEN. Teaching legacy `git checkout` for everything — packet follows current guidance surfaced in the 2025 HN thread: switch/restore for the common cases, checkout understood for reading older docs.

Risk of superficial understanding: Highest-risk node in the cluster: Learn Git Branching can be "won" as a puzzle game while real-repo behavior stays mysterious, and AI autocomplete of git commands can mask model gaps (node gates at GOLD — heavy-AI-assisted work caps below it). Counters: every LGB concept is immediately re-executed in a real repo with graph prediction; the .git-directory inspection makes the model physical; PROVE IT is a repair task that cannot be pattern-matched; the mastery test explicitly bans AI and cheat sheets.

Required active work: ~15 LGB levels; scratch-repo type-along; deliberate conflict + resolution; reflog recovery; graph prediction before every mutation; hand-drawn object model verified against .git; timed broken-merge repair; bisect-style hunt.

Last verified: 2026-08-21
