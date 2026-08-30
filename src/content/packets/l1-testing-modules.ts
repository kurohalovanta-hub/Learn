import type { LearningPacket } from "@/lib/packet-types";

// Selected from docs/curation/l1-testing-modules.md (live-verified 2026-08-21).
// pytest/CPython/mypy/PyPA readings link the URLs verified this session (GitHub doc
// sources where rendered pages were egress-blocked at curation).

export const packet: LearningPacket = {
  nodeId: "l1-testing-modules",
  whyNow:
    "From here on, 'it runs' stops counting as proof. What counts is a test that checks your code against an answer you got some other way. This node turns your scripts into real software: modules, a small installable package, pytest to catch mistakes, and type hints that double as documentation. You will lean on this same habit later to check kinematics and PPO against known-good curves, so build it now while the code is small.",
  diagnostic: {
    prompt:
      "No looking anything up: why does running python file.py behave differently from import file? (What is __name__?) Then write a parametrized pytest for abs() from memory.",
    minutes: 7,
  },
  coreWatch: [
    {
      title: "CS50P Week 5, Unit Tests",
      creator: "David Malan, Harvard CS50",
      url: "https://cs50.harvard.edu/python/",
      minutes: 60,
      whySelected:
        "The research phase's pick for the best beginner testing intro anywhere; do it no matter what. Watch at 1.25–1.5×, and pause to re-implement each demo before Malan does. Skip anything you already covered in the pytest Get started warm-up. Duration unverified this session.",
      leaveWith: [
        "a test is just a plain function with a plain assert, no framework ceremony",
        "how to lay out test files and folders so pytest finds them",
        "how to read failing output and pin down the bug",
      ],
      unverified: true,
    },
  ],
  coreRead: [
    {
      title: "pytest, Get started (do it, don't read it)",
      url: "https://docs.pytest.org/en/stable/getting-started.html",
      sections: "Install · Create your first test: actually run pytest on the failing func(3) == 5 example and READ the assertion introspection · pytest.raises · pytest.approx for floats · tmp_path",
      minutes: 10,
      whySelected: "Learn by doing, hands on, before the lecture, so Week 5 reinforces what you already met instead of introducing it cold. approx matters right away for numerical code.",
    },
    {
      title: "Python Tutorial ch. 6, Modules",
      url: "https://github.com/python/cpython/blob/main/Doc/tutorial/modules.rst",
      sections: "6.0–6.1 (import forms; 'Executing modules as scripts', __name__) + Packages. Skip compiled files, __all__, multi-directory.",
      minutes: 12,
    },
    {
      title: "pytest, How to parametrize",
      url: "https://github.com/pytest-dev/pytest/blob/main/doc/en/how-to/parametrize.rst",
      sections: "The basic @pytest.mark.parametrize('test_input,expected', [...]) section only",
      minutes: 4,
      whySelected: "Exactly the node's diagnostic skill, in four minutes.",
    },
    {
      title: "mypy, Type hints cheat sheet",
      url: "https://github.com/python/mypy/blob/master/docs/source/cheat_sheet_py3.rst",
      sections: "Variables · Useful built-in types (modern list[int], int | None) · Functions. Classes section waits for l1-classes.",
      minutes: 7,
      whySelected: "The right first typing document: shaped like a reference, with zero theory.",
    },
    {
      title: "PyPA, Packaging Python Projects (the build guide for the implement step)",
      url: "https://github.com/pypa/packaging.python.org/blob/main/source/tutorials/packaging-projects.rst",
      sections: "pyproject.toml + src/ layout, through 'Generating distribution archives'; then pip install -e . locally. SKIP the TestPyPI upload and twine sections, no publishing at L1.",
      minutes: 15,
      whySelected: "Read while building the package, not before.",
    },
  ],
  recall: [
    { q: "Why does if __name__ == '__main__': guard script code?", a: "__name__ is '__main__' only when the file is executed directly; on import it is the module's name, so the guard keeps demo/script code from running at import time." },
    { q: "What is a pytest test, minimally?", a: "A plain function named test_* in a file pytest discovers, containing plain assert statements; pytest rewrites the asserts to show the compared values on failure." },
    { q: "How do you compare floats in a test?", a: "assert result == pytest.approx(expected), never bare == on floats." },
    { q: "What does @pytest.mark.parametrize do?", a: "Runs the test function once per (input, expected) tuple in its list, each reported as a separate test." },
    { q: "Do type hints change runtime behavior? Then what are they for?", a: "No, Python ignores them at runtime. They are documentation plus a free bug-finder when mypy checks them statically." },
    { q: "Why src layout + pip install -e . instead of tests importing files directly?", a: "Tests then import the installed package exactly as users would, no sys.path hacks, and -e keeps edits live without reinstalling." },
  ],
  practice: [
    {
      prompt:
        "Node exercise, tests first. Write the test file for a stats module (mean, median, variance) before you write any code. Cover the empty list, a single element, floats via pytest.approx, and a case where you already know the variance. Then write the code until every test passes.",
      minutes: 40,
    },
    {
      prompt: "Three Exercism exercises. Watch how the tests they give you spell out the behavior before you write a single line.",
      source: "https://exercism.org/tracks/python",
      minutes: 40,
    },
    {
      prompt: "Node exercise: add type hints to three earlier L1 exercises, run mypy, and find at least one real bug that the hints surface.",
      minutes: 25,
    },
  ],
  implement: {
    spec: "Package the stats module by following the PyPA tutorial: a src/ layout with pyproject.toml (stop before TestPyPI and twine), pip install -e . locally, tests that import the installed package, and pytest -k variance to run just the tests you name. This package is what you will be judged on for this node.",
    checks: [
      "In a fresh venv: pip install -e . succeeds and pytest passes from the repo root",
      "No sys.path manipulation anywhere in the project",
      "pytest -k selects exactly the intended subset",
    ],
    minutes: 40,
  },
  stuck: {
    note: "Lost in pytest? Redo Get started slowly; it is the smallest complete loop there is. Import errors in tests? Re-read Tutorial 6.1 and check that pip install -e . actually ran. Stuck on parametrize? Copy the how-to's basic example word for word, then change one thing at a time.",
  },
  deepen: [
    {
      title: "pytest how-to: fixtures",
      sections: "Linked from Get started under 'Continue reading', the day a test needs shared setup",
      minutes: 20,
    },
    {
      title: "CS50P Week 5 problem set",
      url: "https://cs50.harvard.edu/python/",
      sections: "The remaining Week 5 problems, consolidation through volume",
      minutes: 60,
    },
    {
      title: "mypy cheat sheet, Classes section",
      url: "https://github.com/python/mypy/blob/master/docs/source/cheat_sheet_py3.rst",
      sections: "Classes, read the day l1-classes lands",
      minutes: 10,
    },
  ],
  prove: {
    task: "Node mastery test: the packaged stats module (pyproject plus src layout, installable with pip install -e ., 10 or more tests with edge cases and a parametrized suite), handed in for a review of test quality. What matters is your oracles and edge cases, not whether the tests just echo the code.",
    criteria: [
      "Installs with pip install -e . and the tests import the installed package, with no path hacks",
      "10 or more tests covering empty input, a single element, and float comparisons via pytest.approx",
      "At least one parametrized suite, and pytest -k runs a named subset",
      "For every assert, you can say where the expected value comes from without looking at the code being tested",
    ],
    minutes: 30,
  },
  transfer: {
    task: "Write pytest oracle tests for numerical code from the other nodes: np.allclose(vectorized(x), loop_version(x)) for the l1-vectorization-craft kernels, and a physics-helper test for P1 (energy of a dropped ball at h=0). This is how a test turns 'it runs' into 'it is right'.",
    criteria: [
      "Each expected value comes from an independent oracle, loop version, hand computation, or conservation law",
      "A deliberately injected bug makes a test fail with readable output that localizes it",
    ],
    minutes: 25,
  },
  retention:
    "Day +7: from an empty directory, recreate a minimal package, pyproject + src layout + one module + a parametrized test file, pip install -e ., then run a named subset with -k. No references, under 20 minutes.",
  researchRecord: "docs/curation/l1-testing-modules.md",
  minutes: 315,
};
