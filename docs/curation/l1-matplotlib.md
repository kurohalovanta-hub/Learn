# l1-matplotlib — Matplotlib & the Jupyter Workflow

Concept: The Figure/Axes/Artist object model and the explicit `fig, ax = plt.subplots()` API — line/scatter/hist/imshow, labels/legends/log scales, subplots, and saving figures — plus the notebook discipline (restart-and-run-all) that makes plots trustworthy. This is the instrument panel for every experiment in the next 200 days.

Learner prerequisites: l1-numpy (arrays are what get plotted; imshow assumes the (H,W)/(H,W,3) array model just learned). Jupyter basics from L0 setup.

What beginners commonly misunderstand:
- The two-interfaces trap: tutorials mix `plt.plot(...)` state-machine calls with `ax.plot(...)` object calls; beginners copy both styles into one script and can't predict which figure/axes a command hits. Matplotlib's own docs now devote a page to untangling this and call `pylab` star-imports "highly discouraged".
- Thinking `plt.show()`/inline display is the figure — not knowing a Figure object exists, so multi-panel layouts and saving feel like magic incantations.
- Axes (the plotting region) vs axis (x/y axis) confusion — the anatomy diagram exists precisely because of it.
- Notebook state lies: out-of-order cell execution produces plots that can't be reproduced — hence restart-and-run-all as the truth test.
- Stopping at screenshots instead of `fig.savefig(..., dpi=...)` — publication habits start now.

Candidate videos:
1. none found this session — the session's web-search budget was exhausted before a matplotlib video pool could be searched; fallback: docs-first packet below (consistent with the repo's existing docs-primary selection). Known candidates for a future pass (no URLs cited, none verified): Corey Schafer's Matplotlib series, scientific-plotting walkthroughs.

Candidate written resources:
1. Quick start guide — Matplotlib 3.11.1 — https://matplotlib.org/stable/users/explain/quick_start.html (structure re-verified this session via GitHub source galleries/users_explain/quick_start.py: A simple example; Parts of a Figure with the anatomy diagram; Coding styles — OO explicitly suggested; Styling; Labelling; Axis scales incl. log; Color mapped data; Multiple Figures and Axes incl. subplot_mosaic. ~15–20 min. Gap: does NOT cover savefig — patched in PRACTICE.)
2. Matplotlib Application Interfaces (APIs) — verified via GitHub source https://github.com/matplotlib/matplotlib/blob/main/galleries/users_explain/figure/api_interfaces.rst (rendered under matplotlib.org/stable/users/explain/figure/ [rendered URL unverified this session — site egress-blocked]): explicit-Axes vs implicit-pyplot, why explicit wins as complexity grows, pylab warning. 8–12 min. The authoritative answer to this node's diagnostic question.
3. Pyplot tutorial — https://matplotlib.org/stable/tutorials/pyplot.html (3.11.1, verified in search results; read AFTER the OO style is habitual, purely to gain reading fluency in the `plt.*` style that fills Stack Overflow and older papers' code; ~15 min)
4. Scientific Python Lectures, Matplotlib chapter — https://lectures.scientific-python.org/ (existing repo backup; rendered site verified via project GitHub, 3.2k stars; gentler paced alternative track)
5. Scientific Visualization: Python + Matplotlib — Nicolas P. Rougier, 2021, open-access PDF — https://github.com/rougier/scientific-visualization-book (verified: 11.4k stars; part 1 fundamentals → part 2 figure design; publication-quality figure craft — deepen, not core)

Community evidence:
- Matplotlib's own docs adding a dedicated "Application Interfaces" explanation page and branding pylab imports "highly discouraged"/"bad practice" is the project acknowledging its number-one beginner confusion (source fetched: https://github.com/matplotlib/matplotlib/blob/main/galleries/users_explain/figure/api_interfaces.rst)
- Rougier's matplotlib book at 11.4k GitHub stars — strong practitioner endorsement that figure QUALITY is a learnable craft with this exact toolchain (https://github.com/rougier/scientific-visualization-book)
- (thin this session — video-pool and forum searches were cut off by the search budget; flagged for a future curation pass)

Primary technical authority:
- Matplotlib 3.11.1 official documentation: Quick start guide + Application Interfaces + Pyplot tutorial (https://matplotlib.org/stable/users/index.html, verified in search results; content re-verified against the matplotlib GitHub doc sources this session).

Selected shortest-sufficient packet:
- DIAGNOSTIC: cold, in a fresh notebook: plot y=sin(x) with title, axis labels, legend, and save it to PNG — then answer the node diagnostic (why `fig, ax = plt.subplots()` over `plt.plot` globals; show log-scale y). ~8 min.
- ORIENT: Quick start "Parts of a Figure" section only — study the anatomy diagram until Figure/Axes/Axis/Artist are distinct words (~4 min).
- CORE WATCH: — (no verified video candidate this session; docs-first is sufficient here)
- CORE READ: Quick start guide end-to-end, typing every snippet OO-style (~20 min read / ~45 with typing) → Application Interfaces page (~10 min) → Pyplot tutorial as a fast read-only pass for `plt.*`-reading fluency (~10 min). ≈40 min reading.
- INTERACTIVE: — (no in-app widget for plotting)
- PRACTICE: (1) node exercise — one figure, 4 subplots: function family, histogram, scatter with colormap, imshow of an image array from l1-numpy; add `fig.savefig("fig.png", dpi=200)` and inspect the file (patches the quick start's savefig gap); (2) node exercise — recreate a published loss-curve figure from its picture (axes, legend, log-y, styling); (3) restart-and-run-all after each: the notebook must reproduce top-to-bottom.
- IMPLEMENT/DERIVE: a reusable `plot_runs(ax, x, runs)` helper that takes a (n_seeds, T) array and draws mean line + ±1 std band (`ax.fill_between` with alpha) with label — your standard experiment plot, written once, imported forever (also your first own plotting module → feeds l1-testing-modules).
- STUCK PATH: Scientific Python Lectures Matplotlib chapter (https://lectures.scientific-python.org/) — same material, slower ramp, more worked examples.
- DEEPEN: Rougier, Scientific Visualization: Python + Matplotlib, parts 1–2 (open-access PDF via https://github.com/rougier/scientific-visualization-book) — only when a figure is headed for a writeup.
- PROVE IT: node masteryTest — given a CSV of noisy multi-seed experiment runs, produce the labeled mean±std band plot, first try, no reference.
- TRANSFER: plot the P1 projectile simulator's outputs (trajectory x–y, energy vs time on twin plots, range-vs-angle sweep) — real simulation data instead of synthetic arrays.
- RETENTION: day +7 — from memory in <10 min: 2×2 subplots, one log-y panel, shared legend, saved at dpi=200; then restart-and-run-all to prove it reproduces.

Why this won: The repo's docs-primary choice survives scrutiny — the 3.11.1 quick start covers every node objective except savefig in ~20 minutes and teaches the OO style natively. The one addition that matters is the Application Interfaces page: it is the authority's own resolution of the pyplot-vs-OO confusion this node's diagnostic targets, and costs 10 minutes. Everything else is deliberately practice: plotting is a motor skill, and the mean±std band helper converts the node's 4 hours into an artifact used weekly for the rest of the program.

What was rejected (and why): Video tutorials — none could be verified this session (search budget), and the docs packet is already short enough that a video would add minutes without adding the object model. Long gallery browsing — the gallery is a lookup shelf, not a curriculum. Seaborn/pandas-plotting detours — different API, deferred until data-frame work exists. Rougier's viz book as core — superb but 200+ pages of craft; wrong altitude for a 4-hour node, kept as DEEPEN.

Risk of superficial understanding: Moderate — copying plt.-style snippets from AI/Stack Overflow will produce working plots while leaving the object model unlearned, which collapses the first time a 2×2 figure with a shared colorbar is needed. Mitigation: all practice is OO-style from a blank cell; the diagnostic and retention checks are from-memory; the helper function forces parameterizing over an ax rather than global state.

Required active work: 4-subplot figure built and saved; published-figure recreation; `plot_runs` band-plot helper written and reused; every notebook passes restart-and-run-all; P1 data plotted with it.

Last verified: 2026-08-21
