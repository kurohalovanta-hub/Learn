import type { LearningPacket } from "@/lib/packet-types";

// Selected from docs/curation/l1-matplotlib.md (live-verified 2026-08-21).
// No video slots: no candidate could be URL-verified this session — docs-first packet.

export const packet: LearningPacket = {
  nodeId: "l1-matplotlib",
  whyNow:
    "You cannot debug what you cannot see. Loss curves, trajectories, filter estimates, attention maps — for the next 200 days every claim you make will be a figure. This node installs the object model (a Figure holds Axes, Axes hold Artists) so multi-panel, publication-quality plots are constructed instead of incanted, plus the notebook discipline that makes them reproducible.",
  diagnostic: {
    prompt:
      "Cold, in a fresh notebook: plot y=sin(x) with title, axis labels and legend, and save it to PNG. Then answer: why prefer fig, ax = plt.subplots() over plt.plot globals? Show log-scale on y.",
    minutes: 8,
  },
  coreRead: [
    {
      title: "Quick start — Parts of a Figure (orientation)",
      url: "https://matplotlib.org/stable/users/explain/quick_start.html",
      resourceId: "matplotlib-docs",
      sections: "'Parts of a Figure' only: study the anatomy diagram until Figure / Axes / Axis / Artist are four distinct words",
      minutes: 4,
      whySelected: "The anatomy diagram exists precisely because Axes-vs-axis confusion is universal. Orient here before anything else.",
    },
    {
      title: "Matplotlib Quick start guide (3.11.1)",
      url: "https://matplotlib.org/stable/users/explain/quick_start.html",
      resourceId: "matplotlib-docs",
      sections: "End to end, typing every snippet OO-style: simple example · coding styles (OO explicitly suggested) · styling · labelling · axis scales incl. log · color-mapped data · multiple figures and axes incl. subplot_mosaic",
      minutes: 45,
      whySelected: "Covers every node objective except savefig (patched in practice) and teaches the explicit-Axes style natively.",
    },
    {
      title: "Matplotlib Application Interfaces (APIs)",
      url: "https://github.com/matplotlib/matplotlib/blob/main/galleries/users_explain/figure/api_interfaces.rst",
      resourceId: "matplotlib-docs",
      sections: "Full page: explicit-Axes vs implicit-pyplot, why explicit wins as complexity grows, the pylab warning (rendered in the docs under Users → Figures; source URL is the one verified this session)",
      minutes: 10,
      whySelected: "The authority's own resolution of the two-interfaces trap — the exact confusion this node's diagnostic targets.",
    },
    {
      title: "Pyplot tutorial",
      url: "https://matplotlib.org/stable/tutorials/pyplot.html",
      resourceId: "matplotlib-docs",
      sections: "Fast read-only pass, AFTER the OO style is habitual — purely to gain reading fluency in the plt.* style that fills Stack Overflow and older papers' code",
      minutes: 10,
    },
  ],
  recall: [
    { q: "Figure vs Axes vs Axis — one sentence each.", a: "Figure: the whole canvas that owns everything. Axes: one plotting region (a subplot) with its own coordinate system. Axis: the x- or y-scale object of an Axes (ticks, limits)." },
    { q: "The two matplotlib interfaces — and which do you write?", a: "Implicit pyplot state machine (plt.plot hits the 'current' axes) vs explicit object-oriented (ax.plot on an Axes you hold). You write explicit fig, ax = plt.subplots(); you only read plt.* in others' code." },
    { q: "Log-scale the y axis of an Axes ax?", a: "ax.set_yscale('log')." },
    { q: "Save a figure at publication quality?", a: "fig.savefig('name.png', dpi=200) — a method on the Figure object, never a screenshot." },
    { q: "What does restart-and-run-all prove that running cells one at a time doesn't?", a: "That results depend only on top-to-bottom code, not on hidden stale kernel state — the figure is reproducible." },
  ],
  practice: [
    {
      prompt:
        "Node exercise: one figure, 4 subplots — function family, histogram, scatter with a colormap, imshow of an image array from l1-numpy. Add fig.savefig('fig.png', dpi=200) and open the file to inspect it (this patches the quick start's savefig gap). OO-style from a blank cell.",
      minutes: 35,
    },
    {
      prompt: "Node exercise: recreate a published loss-curve figure from its picture alone — axes, legend, log-y, styling.",
      minutes: 30,
    },
    {
      prompt: "After each figure: Kernel → Restart & Run All. The notebook must reproduce top-to-bottom or the figure doesn't count.",
      minutes: 5,
    },
  ],
  implement: {
    spec: "plot_runs(ax, x, runs): takes an Axes and an (n_seeds, T) array; draws the mean line plus a ±1 std band (ax.fill_between with alpha) with a label. Write it in a module, not a cell; import it into the notebook and use it on synthetic runs. This is your standard experiment plot, written once and imported forever — and your first own plotting module (feeds l1-testing-modules).",
    checks: [
      "Parameterized over ax — no plt.* global state inside the function",
      "Band is mean ±1 std across the seed axis (state which axis and why)",
      "Imported from the module and reused at least twice; notebook passes restart-and-run-all",
    ],
    minutes: 40,
  },
  stuck: {
    alternateRead: {
      title: "Scientific Python Lectures — Matplotlib chapter",
      url: "https://lectures.scientific-python.org/",
      resourceId: "scipy-lectures",
      sections: "Matplotlib chapter — same material, slower ramp, more worked examples",
      minutes: 30,
    },
    note: "Switch tracks rather than re-reading the quick start a third time; come back for the Application Interfaces page — that one is not optional.",
  },
  deepen: [
    {
      title: "Scientific Visualization: Python + Matplotlib — Nicolas P. Rougier (open-access PDF)",
      url: "https://github.com/rougier/scientific-visualization-book",
      sections: "Parts 1–2 (fundamentals → figure design) — open the day a figure is headed for a writeup, not before",
      minutes: 90,
    },
  ],
  prove: {
    task: "Node mastery test: given a CSV of noisy multi-seed experiment runs, produce the labeled mean±std band plot across seeds — first try, no reference. The exact figure you will make 50 times this year.",
    criteria: [
      "Built OO-style from a blank cell (fig, ax = plt.subplots()), no reference open",
      "Mean line + ±1 std band via fill_between with alpha, proper axis labels and legend",
      "Saved with fig.savefig at explicit dpi and the file inspected",
      "Notebook passes restart-and-run-all",
    ],
    minutes: 25,
  },
  transfer: {
    task: "The day P1's projectile simulator produces data, plot its outputs: trajectory in x–y, energy vs time on twin plots, and a range-vs-angle sweep — real simulation data instead of synthetic arrays.",
    criteria: [
      "Every panel drawn through an explicit Axes you hold",
      "The figures read without you narrating them: titles, units, legends present",
    ],
    minutes: 25,
  },
  retention:
    "Day +7, from memory in under 10 minutes: a 2×2 subplot figure with one log-y panel and a shared legend, saved at dpi=200 — then restart-and-run-all to prove it reproduces.",
  researchRecord: "docs/curation/l1-matplotlib.md",
  minutes: 235,
};
