# l0-python-setup — Python Environments & Packaging

Concept: Isolated Python environments as the survival skill behind every later install (PyTorch, MuJoCo, LeRobot): create/activate venvs, install/pin/uninstall with pip (and uv as the fast modern front-end), requirements.txt, and the mental model — which interpreter is running, where site-packages lives — that turns `ModuleNotFoundError` from a wall into a 2-minute diagnosis.

Learner prerequisites: l0-terminal (PATH, environment variables, `which`, running commands). Python-the-language is NOT required — this node is about the machinery around the interpreter and is deliberately learned before serious Python (L1) so the first `pip install numpy` already lands in a venv.

What beginners commonly misunderstand:
- What activation actually does: it mostly just edits PATH so `python`/`pip` resolve to the venv's copies — beginners treat it as magic mode-switching and then can't explain why a script "sees" different packages in different shells.
- `python` vs `python3` vs the venv's python, and that pip belongs to ONE interpreter — installing into the wrong one is the canonical source of `ModuleNotFoundError` despite "I installed it!".
- That a venv is a full Python copy (it is lightweight: its own site-packages + pointers to a base interpreter — verified phrasing from the venv docs: independent site-packages, sys.prefix repointed).
- That environments are optional tidiness — in robotics/ML they are load-bearing: version conflicts between simulator/CUDA/torch stacks are why the node's `why` field calls env failures half of all beginner failures.
- Tool-zoo paralysis (venv vs virtualenv vs conda vs poetry vs uv): 2026 reality is venv+pip concepts with uv as the fast implementation of the same concepts — not a different mental model.

Candidate videos:
1. Missing Semester 2026 L6 "Packaging and Shipping Code" — MIT — ~1 h full lecture [course's own description; unverified]; only the first segment (Dependencies & Environments) is in scope — https://www.youtube.com/watch?v=KBMiB-8P4Ns (video ID from lecture source; correctness 5, prereq fit 4, scope fit 3 as a whole / 5 for §1 — the rest is wheels/docker/k8s, out of L0 scope; datedness low, covers uv)
2. — (no other video URL could be verified this session; the classic Corey Schafer venv walkthroughs and 2024–2025 uv explainers by ArjanCodes exist in this niche but their URLs did not appear in this session's search results, so per the URL-integrity rule they are not listed as candidates)

Candidate written resources:
1. "Install packages in a virtual environment using pip and venv" — packaging.python.org (PyPA) — verified via source repo (pypa/packaging.python.org, source/guides/installing-using-pip-and-virtual-environments.rst) — ~2,500 words: `python3 -m venv .venv` → activate (per-platform) → pip install → requirements.txt → `pip freeze`. The exact canonical workflow, as a do-along.
2. Missing Semester 2026 L6 notes, §"Dependencies & Environments" only — verified via course repo (_2026/shipping-code.md) — venv isolation, pip, uv-as-faster-alternative, dependency hell; L6 exercise #1 (diff `printenv` before/after activation) is the single best activation-demystifier found anywhere.
3. `venv` module documentation — python.org — verified via source (python/cpython Doc/library/venv.rst): the one-sentence definition ("lightweight virtual environments, each with their own independent set of Python packages installed in their site directories"), per-platform activation table, sys.prefix/sys.base_prefix semantics.
4. uv README/docs — Astral — https://github.com/astral-sh/uv (verified; 88.9k stars): `uv venv`, `uv pip install`, `uv add/run/lock/sync`, manages Python versions too; 10–100× faster resolver.

Community evidence:
- Missing Semester's 2026 restructuring itself is evidence: environments/packaging were pulled out of the editor lecture into their own lecture (L6 §1) because they are a distinct, chronic pain point (verified against the 2026 lecture sources this session; course discussion: https://news.ycombinator.com/item?id=47124171)
- uv's 88.9k GitHub stars and its explicit positioning as a drop-in replacement for pip/virtualenv/poetry is the strongest 2026 adoption signal in this niche (https://github.com/astral-sh/uv)
- Note: reddit.com blocks crawler access and the session's search budget was exhausted before dedicated venv-confusion searches (r/learnpython's "pip installed it but import fails" is a perennial genre); the misunderstand-list above is instead grounded in the verified authorities' own emphases (activation = PATH edit; one pip per interpreter) and the node's existing research.

Primary technical authority:
- Python official docs: `venv` module (docs.python.org — site egress-blocked this session; verified via cpython source https://github.com/python/cpython, Doc/library/venv.rst) + PyPA packaging guide (verified via https://github.com/pypa/packaging.python.org).
- uv official docs (verified via https://github.com/astral-sh/uv) for the modern front-end.

Selected shortest-sufficient packet:
- DIAGNOSTIC: Cold, 3 min: explain the difference between `python`, `python3`, and a venv's python; state two commands that reveal which interpreter/pip is live (`which python`, `python -c "import sys; print(sys.prefix)"` or `pip --version`); predict what happens to an installed package after `deactivate`.
- ORIENT: Missing Semester 2026 L6 video, first segment (Dependencies & Environments) only, ~0:00–15:00 [approx — stop when wheels/artifacts begin], 1.25× (https://www.youtube.com/watch?v=KBMiB-8P4Ns).
- CORE WATCH: — (ORIENT segment suffices; this node is done at a prompt, not on a screen)
- CORE READ: PyPA "Install packages in a virtual environment using pip and venv" as a strict do-along (~25 min), THEN Missing Semester L6 notes §1 (~10 min) for the isolation/dependency-hell framing; keep the venv-docs activation table open as reference.
- INTERACTIVE: — (no in-app widget; closest lab moment is VS Code's "Python: Create Environment" from l0-editor — do it once from the GUI, then never again except via shell)
- PRACTICE: (1) Missing Semester L6 exercise #1: `printenv > before`, activate, `printenv > after`, `diff` them — write one sentence on what activation really changed; (2) the node's exercise: two venvs with different NumPy versions, one script, prove with `python -c "import numpy; print(numpy.__version__, numpy.__file__)"` which env serves it and why; (3) the node's break-and-repair: install a package, delete/mangle one of its files in site-packages (or pip install an impossible pin), read the full error, repair; (4) redo env creation once with `uv venv` + `uv pip install` and feel the speed difference.
- IMPLEMENT/DERIVE: A `requirements.txt` for a tiny project, then from a FRESH shell: new venv → `pip install -r requirements.txt` → script runs; plus a hand-drawn one-diagram answer to "where does `import numpy` find code?" (shell PATH → interpreter → sys.prefix → site-packages).
- STUCK PATH: VS Code "Python: Create Environment" + interpreter-picker flow (official Python tutorial, verified 2026-02-04) — the GUI shows the same objects (interpreter, .venv folder) when the shell version hasn't clicked; uv README quickstart as the alternate telling of the same workflow.
- DEEPEN: Missing Semester L6 §§2–4 (wheels, pyproject.toml, lockfiles, libraries-vs-applications pinning) — deferred until the L1 exit project "small reusable Python package"; uv project workflow (`uv init/add/lock/sync`) at the same moment.
- PROVE IT: The node's mastery test, timed ~20 min: fresh shell → create env → install a pinned dependency set from a given requirements.txt → run its test suite → explain where every package lives on disk (path to site-packages) and which interpreter ran the tests.
- TRANSFER: Clone any small real Python project (feeds l0-github / the L0 capstone): build its env from its requirements/pyproject WITHOUT instructions, diagnosing whatever breaks; bonus transfer: explain why `sudo pip install` into system Python is the historical footgun venvs exist to prevent.
- RETENTION: 7 days later, cold: create-activate-install-verify cycle in under 3 minutes; 30 days later (entering PyTorch, L4): before installing torch, state which env you're in and prove it — the habit is the retention test.

Why this won: OVERRIDE of the repo's primary section mapping. The node currently cites "Missing Semester 2026 L3 tooling segment" — live verification shows L3 (Development Environment and Tools) contains NO environment/packaging content; that material moved to 2026 L6 "Packaging and Shipping Code" §1 (venv, pip, uv, dependency hell — verified in the lecture source). The corrected packet pairs L6 §1 (framing + the printenv-diff exercise) with the PyPA guide (canonical workflow, do-along) and the venv docs (the precise mechanism), adding uv as the verified-current fast path. Everything is first-party, current, and totals ≈ 2.25 h against the 3 h budget.

What was rejected (and why): Whole Missing Semester L6 (docker/k8s/publishing is months-later material — cluster rule: segments, never whole lectures). Conda-first paths — heavier mental model, unnecessary for this stack in 2026 (uv/pip covers LeRobot/MuJoCo/PyTorch installs), though the learner should recognize the name. Poetry — superseded by uv for this use case in 2026 practice. Corey Schafer / ArjanCodes videos — likely good but URLs unverifiable this session; the niche's explanation burden is low enough that first-party docs + doing beats any video here anyway.

Risk of superficial understanding: The classic trap — being able to recite "venvs isolate dependencies" while still pip-installing into the wrong interpreter. Every check here is behavioral: diff printenv, prove-which-numpy, break-and-repair, fresh-shell timed rebuild. The two-envs exercise plus the where-does-import-find-code diagram directly targets the interpreter-resolution model, which is the part that transfers to every future CUDA/torch version conflict.

Required active work: printenv diff; dual-NumPy proof; deliberate breakage + repair; requirements.txt round-trip from fresh shell; uv re-run; resolution-path diagram; timed 20-min mastery run; real-repo env build.

Last verified: 2026-08-21
