import type { LearningPacket } from "@/lib/packet-types";

// Selected from docs/curation/l1-testing-modules.md (live-verified 2026-08-21).
// pytest/CPython/mypy/PyPA readings link the URLs verified this session (GitHub doc
// sources where rendered pages were egress-blocked at curation).

export const packet: LearningPacket = {
  nodeId: "l1-testing-modules",
  whyNow:
    "From here on, 'it runs' is not evidence — tests against independent oracles are. This node turns scripts into software: modules and __main__, a small installable package, pytest as your evidence machine, type hints as executable documentation. You will verify kinematics against oracles and PPO against reference curves with exactly this habit; install it now at the smallest scale that exists.",
  diagnostic: {
    prompt:
      "Cold: why does python file.py behave differently from import file (what is __name__)? Then write a parametrized pytest for abs() from memory.",
    minutes: 7,
  },
  coreWatch: [
    {
      title: "CS50P Week 5 — Unit Tests",
      creator: "David Malan — Harvard CS50",
      url: "https://cs50.harvard.edu/python/",
      minutes: 60,
      whySelected:
        "The research phase's verdict: the best beginner testing intro anywhere — do it regardless. Watch at 1.25–1.5×, stopping to re-implement each demo BEFORE Malan does; skip anything already done in the pytest Get started warm-up. Duration unverified this session.",
      leaveWith: [
        "a test is a plain function with a plain assert — no framework ceremony",
        "how test files and folders are organized so pytest finds them",
        "reading failing output to localize the bug",
      ],
      unverified: true,
    },
  ],
  coreRead: [
    {
      title: "pytest — Get started (do it, don't read it)",
      url: "https://docs.pytest.org/en/stable/getting-started.html",
      sections: "Install · Create your first test: actually run pytest on the failing func(3) == 5 example and READ the assertion introspection · pytest.raises · pytest.approx for floats · tmp_path",
      minutes: 10,
      whySelected: "Minimal-first pedagogy in its purest form, done hands-on BEFORE the lecture so Week 5 becomes consolidation, not introduction. approx matters immediately for numerical code.",
    },
    {
      title: "Python Tutorial ch. 6 — Modules",
      url: "https://github.com/python/cpython/blob/main/Doc/tutorial/modules.rst",
      sections: "6.0–6.1 (import forms; 'Executing modules as scripts' — __name__) + Packages. Skip compiled files, __all__, multi-directory.",
      minutes: 12,
    },
    {
      title: "pytest — How to parametrize",
      url: "https://github.com/pytest-dev/pytest/blob/main/doc/en/how-to/parametrize.rst",
      sections: "The basic @pytest.mark.parametrize('test_input,expected', [...]) section only",
      minutes: 4,
      whySelected: "Exactly the node's diagnostic skill, in four minutes.",
    },
    {
      title: "mypy — Type hints cheat sheet",
      url: "https://github.com/python/mypy/blob/master/docs/source/cheat_sheet_py3.rst",
      sections: "Variables · Useful built-in types (modern list[int], int | None) · Functions. Classes section waits for l1-classes.",
      minutes: 7,
      whySelected: "The right FIRST typing document — reference-shaped, zero theory.",
    },
    {
      title: "PyPA — Packaging Python Projects (the build guide for the implement step)",
      url: "https://github.com/pypa/packaging.python.org/blob/main/source/tutorials/packaging-projects.rst",
      sections: "pyproject.toml + src/ layout, through 'Generating distribution archives'; then pip install -e . locally. SKIP the TestPyPI upload and twine sections — no publishing at L1.",
      minutes: 15,
      whySelected: "Read while building the package, not before.",
    },
  ],
  recall: [
    { q: "Why does if __name__ == '__main__': guard script code?", a: "__name__ is '__main__' only when the file is executed directly; on import it is the module's name — so the guard keeps demo/script code from running at import time." },
    { q: "What is a pytest test, minimally?", a: "A plain function named test_* in a file pytest discovers, containing plain assert statements; pytest rewrites the asserts to show the compared values on failure." },
    { q: "How do you compare floats in a test?", a: "assert result == pytest.approx(expected) — never bare == on floats." },
    { q: "What does @pytest.mark.parametrize do?", a: "Runs the test function once per (input, expected) tuple in its list, each reported as a separate test." },
    { q: "Do type hints change runtime behavior? Then what are they for?", a: "No — Python ignores them at runtime. They are documentation plus a free bug-finder when mypy checks them statically." },
    { q: "Why src layout + pip install -e . instead of tests importing files directly?", a: "Tests then import the installed package exactly as users would — no sys.path hacks — and -e keeps edits live without reinstalling." },
  ],
  practice: [
    {
      prompt:
        "Node exercise, tests FIRST: write the test file for a stats module (mean/median/variance) before any implementation — empty list, single element, floats via pytest.approx, a known-variance oracle — then implement until green.",
      minutes: 40,
    },
    {
      prompt: "Three Exercism exercises, paying attention to how the PROVIDED tests specify behavior before you write a line.",
      source: "https://exercism.org/tracks/python",
      minutes: 40,
    },
    {
      prompt: "Node exercise: add type hints to three earlier L1 exercises, run mypy, and find at least one real bug via the hints.",
      minutes: 25,
    },
  ],
  implement: {
    spec: "Package the stats module per the PyPA tutorial: src/ layout + pyproject.toml (stop before TestPyPI/twine), pip install -e . locally, tests importing the installed package, pytest -k variance running a named subset. This artifact is the node's mastery vehicle.",
    checks: [
      "In a fresh venv: pip install -e . succeeds and pytest passes from the repo root",
      "No sys.path manipulation anywhere in the project",
      "pytest -k selects exactly the intended subset",
    ],
    minutes: 40,
  },
  stuck: {
    note: "Lost in pytest? Re-do Get started slowly — it is the minimal complete loop. Import errors in tests? Re-read Tutorial 6.1 and confirm pip install -e . actually ran. Parametrize confusion? Copy the how-to's basic example verbatim, then mutate it.",
  },
  deepen: [
    {
      title: "pytest how-to: fixtures",
      sections: "Linked from Get started under 'Continue reading' — the day a test needs shared setup",
      minutes: 20,
    },
    {
      title: "CS50P Week 5 problem set",
      url: "https://cs50.harvard.edu/python/",
      sections: "The remaining Week 5 problems — consolidation through volume",
      minutes: 60,
    },
    {
      title: "mypy cheat sheet — Classes section",
      url: "https://github.com/python/mypy/blob/master/docs/source/cheat_sheet_py3.rst",
      sections: "Classes — read the day l1-classes lands",
      minutes: 10,
    },
  ],
  prove: {
    task: "Node mastery test: the packaged stats module — pyproject + src layout, installable with pip install -e ., 10+ tests including edge cases and a parametrized suite — submitted for review of test QUALITY: oracles and edges, not implementation mirroring.",
    criteria: [
      "Installs with pip install -e . and tests import the installed package, no path hacks",
      "10+ tests covering empty input, single element, and float comparisons via pytest.approx",
      "At least one parametrized suite, and pytest -k runs a named subset",
      "For every assert you can answer: where does the expected value come from, independent of the code under test?",
    ],
    minutes: 30,
  },
  transfer: {
    task: "Write pytest oracle tests for numerical code from the other nodes: np.allclose(vectorized(x), loop_version(x)) for the l1-vectorization-craft kernels, and a physics-helper test for P1 (energy of a dropped ball at h=0). Tests as the bridge between 'runs' and 'is right'.",
    criteria: [
      "Each expected value comes from an independent oracle — loop version, hand computation, or conservation law",
      "A deliberately injected bug makes a test fail with readable output that localizes it",
    ],
    minutes: 25,
  },
  retention:
    "Day +7: from an empty directory, recreate a minimal package — pyproject + src layout + one module + a parametrized test file — pip install -e ., then run a named subset with -k. No references, under 20 minutes.",
  researchRecord: "docs/curation/l1-testing-modules.md",
  minutes: 315,
};
