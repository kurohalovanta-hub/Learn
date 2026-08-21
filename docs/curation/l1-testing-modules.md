# l1-testing-modules — Modules, pytest & Typing Basics

Concept: Turning scripts into software: modules/imports/`__main__`, a small installable package (pyproject, src layout), pytest as the evidence machine (asserts, parametrize, running subsets), and type hints as executable documentation. This is the research habit — verifying kinematics against oracles and PPO against reference curves — installed at the smallest possible scale first.

Learner prerequisites: l1-functions (tests test functions; decomposition must already be comfortable). l1-data-structures for realistic test data. Runs in parallel with l1-classes.

What beginners commonly misunderstand:
- `python file.py` vs `import file`: not knowing `__name__ == "__main__"` exists, so scripts explode on import — the exact diagnostic of this node.
- Believing testing requires a framework ceremony (classes, setUp, runners) — pytest's whole pitch is that a test is a plain function with a plain `assert`; beginners who start with unittest-style ceremony often stall.
- Writing tests that mirror the implementation (assert the code does what the code does) instead of testing against independent oracles and edge cases.
- Import-path confusion when tests live in a separate folder — the reason src-layout + `pip install -e .` is taught as the default, not an advanced topic.
- Treating type hints as enforced at runtime (they aren't) or as noise (they're documentation + a free bug-finder via mypy).

Candidate videos:
1. CS50P Week 5 — Unit Tests (David Malan, Harvard) — duration [unverified this session; cs50.harvard.edu egress-blocked from this sandbox] — https://cs50.harvard.edu/python/ (existing repo primary, lastVerified 2026-08-21 by the research phase; docs/research/reports/foundations.md: "the best beginner testing intro anywhere — do it regardless". Correctness 5, beginner fit 5, teaches pytest + folders-of-tests live; long-form, so watched at speed and segmented)
2. no other video candidates could be verified this session (web-search budget exhausted before a video pool search) — fallback: CS50P Week 5 (existing primary) + pytest docs below, which is already a complete packet.

Candidate written resources:
1. pytest "Get started" — source verified this session: https://github.com/pytest-dev/pytest/blob/main/doc/en/getting-started.rst (rendered at docs.pytest.org/en/stable/getting-started.html [rendered URL unverified — egress-blocked]). Sections: Install; Create your first test (`def func(x): return x+1` / `assert func(3) == 5`); Run multiple tests; Assert exception with `pytest.raises`; Group in a class; `pytest.approx` for floats; tmp_path. 10–15 min DOING it. Minimal-first pedagogy in its purest form; `approx` matters immediately for numerical code.
2. pytest "How to parametrize" — source verified: https://github.com/pytest-dev/pytest/blob/main/doc/en/how-to/parametrize.rst — the basic `@pytest.mark.parametrize("test_input,expected", [...])` section only, 3–4 min. Exactly the node's diagnostic skill.
3. Python Tutorial ch. 6 "Modules" — source verified: https://github.com/python/cpython/blob/main/Doc/tutorial/modules.rst (rendered in docs.python.org tutorial [rendered URL unverified]). Covers import forms, "Executing modules as scripts" (`__name__`), module search path, Packages. Read 6.0–6.1 + Packages; skip compiled-files/`__all__`/multi-directory. ~12 min for the selected parts.
4. mypy "Type hints cheat sheet" — source verified: https://github.com/python/mypy/blob/master/docs/source/cheat_sheet_py3.rst — Variables, Useful built-in types (modern `list[int]`, `int | None`), Functions, Classes sections; 5–10 min; the right FIRST typing document (reference-shaped, zero theory).
5. PyPA "Packaging Python Projects" tutorial — source verified: https://github.com/pypa/packaging.python.org/blob/main/source/tutorials/packaging-projects.rst (rendered on packaging.python.org [rendered URL unverified]). pyproject.toml + src/ layout confirmed. USE: through "Generating distribution archives", then `pip install -e .` locally; SKIP: TestPyPI upload + twine sections (no publishing need at L1).

Community evidence:
- pytest repo: 14.4k stars, 1300+ external plugins, runs unittest suites out of the box — the de-facto standard the learner will meet in every ML/robotics repo (fetched: https://github.com/pytest-dev/pytest)
- Exercism Python track is test-driven from the first exercise — the repo's own research selected it precisely because it "habituates the pytest workflow", i.e. community-validated that reading failing tests teaches testing faster than lectures about testing (existing resource: https://exercism.org/tracks/python)
- Internal live-verified research (docs/research/reports/foundations.md, 2026-08-21): CS50P Week 5 singled out as the best beginner pytest intro anywhere — retained as the community-success anchor for this node.

Primary technical authority:
- pytest official documentation (Get started + How-to guides; source repo fetched this session) and the Python Tutorial ch. 6 for modules/`__name__`; PyPA packaging tutorial for the package build; mypy docs for typing.

Selected shortest-sufficient packet:
- DIAGNOSTIC: node diagnostic cold — explain `python file.py` vs `import file` (`__name__`), then write a parametrized pytest for `abs()` from memory. ~7 min.
- ORIENT: pytest Get started §Install + §Create your first test — actually run `pytest` on the failing `func(3) == 5` example and READ the assertion introspection output. ~10 min, hands on keyboard.
- CORE WATCH: CS50P Week 5 — Unit Tests lecture (https://cs50.harvard.edu/python/, existing primary; duration [unverified this session]) — watch at 1.25–1.5×, stopping to re-implement each demo before Malan does; segment out anything already done in ORIENT.
- CORE READ: Python Tutorial ch. 6 Modules — intro, "Executing modules as scripts", Packages (~12 min) → pytest parametrize basic section (~4 min) → mypy cheat sheet Variables/Built-ins/Functions (~7 min). ≈25 min.
- INTERACTIVE: — (Exercism's in-browser test-driven loop is the interactive medium here)
- PRACTICE: (1) node exercise — write tests FIRST for a stats module (mean/median/variance: empty list, single element, floats via `pytest.approx`, known-variance oracle), then implement to green; (2) three Exercism exercises paying attention to how the provided tests specify behavior; (3) node exercise — add type hints to three earlier L1 exercises, run mypy, find one real bug.
- IMPLEMENT/DERIVE: package the stats module: src layout + pyproject.toml per the PyPA tutorial (stop before TestPyPI), `pip install -e .`, tests importing the installed package, `pytest -k variance` to run a subset. This artifact is the node's mastery vehicle.
- STUCK PATH: re-do pytest Get started slowly (it is the minimal complete loop); import errors in tests → re-read Tutorial 6.1 + confirm `pip install -e .` ran; parametrize confusion → the how-to's basic example verbatim.
- DEEPEN: pytest how-to on fixtures (linked from Get started "Continue reading"); remaining CS50P Week 5 problem set; mypy cheat sheet Classes section when l1-classes lands.
- PROVE IT: node masteryTest — packaged stats module, 10+ tests incl. edge cases and a parametrized suite, installable with `pip -e`, reviewed for test QUALITY (oracles and edges, not implementation mirroring).
- TRANSFER: write pytest oracle tests for numerical code from the other nodes — `np.allclose(vectorized(x), loop_version(x))` for the l1-vectorization-craft kernels, and a physics-helper test for P1 (energy of a dropped ball at h=0). Tests as the bridge between "runs" and "is right".
- RETENTION: day +7 — from an empty directory, recreate a minimal package (pyproject + src + one module + parametrized test file), install -e, run a named test subset — no references, <20 min.

Why this won: The guidance ("pytest minimal-first") and the evidence agree: pytest's Get started IS the minimal loop — plain function, plain assert, rich failure output — and doing it in 10 minutes BEFORE the lecture converts CS50P Week 5 from introduction into consolidation, which suits a fast learner at risk of passive watching. CS50P stays CORE WATCH on the strength of the research phase's verdict and its unmatched beginner success signal. Modules/packaging/typing each get the shortest authoritative document that exists (Tutorial ch. 6, PyPA tutorial minus publishing, mypy cheat sheet), all source-verified this session.

What was rejected (and why): unittest-first sequencing — ceremony obscures the idea; pytest subsumes it (and runs it) anyway. Full PyPA tutorial incl. TestPyPI/twine — publishing is dead weight at L1; cut ~40% of its length. Real Python testing guides and third-party pytest videos — could not be URL-verified this session (search budget) and add little over Get started + Week 5; noted as future candidates only. Full mypy "Getting started" docs — cheat sheet delivers the working subset in a fifth of the time; mypy-lite discipline is the objective, not type theory.

Risk of superficial understanding: High in a specific way — tests that assert what the implementation already does (or AI-generated test suites) produce green checkmarks with zero evidence value. The mastery review must judge oracle choice and edge coverage, not test count. Secondary risk: packaging done once by incantation; the retention check (rebuild from empty dir) is the antidote.

Required active work: tests-written-first stats module; packaged + editable-installed artifact; 3 test-driven Exercism exercises; typing pass over old code with mypy; oracle tests written for the numpy/vectorization kernels.

Last verified: 2026-08-21
