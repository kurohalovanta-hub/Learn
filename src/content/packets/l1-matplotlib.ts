import type { LearningPacket } from "@/lib/packet-types";

// Selected from docs/curation/l1-matplotlib.md (live-verified 2026-08-21).
// No video slots: no candidate could be URL-verified this session, docs-first packet.

export const packet: LearningPacket = {
  nodeId: "l1-matplotlib",
  whyNow:
    "You can't debug what you can't see. For the next 200 days, almost every claim you make will show up as a figure. Here you learn how matplotlib is built (a Figure holds Axes, and Axes hold the things you draw) so you can build clean multi-panel plots on purpose instead of copying snippets and hoping, plus the notebook habits that let anyone rerun your work and get the same picture.",
  diagnostic: {
    prompt:
      "From a blank notebook, no help open: plot y=sin(x) with a title, axis labels, and a legend, then save it to PNG. Put the y axis on a log scale. Then say in your own words why fig, ax = plt.subplots() is better than the plt.plot globals.",
    minutes: 8,
  },
  coreRead: [
    {
      title: "Quick start, Parts of a Figure (orientation)",
      url: "https://matplotlib.org/stable/users/explain/quick_start.html",
      resourceId: "matplotlib-docs",
      sections: "'Parts of a Figure' only: study the anatomy diagram until Figure / Axes / Axis / Artist are four distinct words",
      minutes: 4,
      whySelected: "Almost everyone mixes up Axes and axis. This diagram is here to fix that, so start with it before anything else.",
    },
    {
      title: "Matplotlib Quick start guide (3.11.1)",
      url: "https://matplotlib.org/stable/users/explain/quick_start.html",
      resourceId: "matplotlib-docs",
      sections: "End to end, typing every snippet OO-style: simple example · coding styles (OO explicitly suggested) · styling · labelling · axis scales incl. log · color-mapped data · multiple figures and axes incl. subplot_mosaic",
      minutes: 45,
      whySelected: "This walks through everything you need except saving to a file (you cover that in practice), and it uses the explicit-Axes style from the start.",
    },
    {
      title: "Matplotlib Application Interfaces (APIs)",
      url: "https://github.com/matplotlib/matplotlib/blob/main/galleries/users_explain/figure/api_interfaces.rst",
      resourceId: "matplotlib-docs",
      sections: "Full page: explicit-Axes vs implicit-pyplot, why explicit wins as complexity grows, the pylab warning (rendered in the docs under Users → Figures; source URL is the one verified this session)",
      minutes: 10,
      whySelected: "The maintainers' own answer to the two-interfaces question, which is exactly what the diagnostic checks you understand.",
    },
    {
      title: "Pyplot tutorial",
      url: "https://matplotlib.org/stable/tutorials/pyplot.html",
      resourceId: "matplotlib-docs",
      sections: "Fast read-only pass, AFTER the OO style is habitual, purely to gain reading fluency in the plt.* style that fills Stack Overflow and older papers' code",
      minutes: 10,
    },
  ],
  recall: [
    { q: "Figure vs Axes vs Axis, one sentence each.", a: "Figure: the whole canvas that owns everything. Axes: one plotting region (a subplot) with its own coordinate system. Axis: the x- or y-scale object of an Axes (ticks, limits)." },
    { q: "The two matplotlib interfaces, and which do you write?", a: "Implicit pyplot state machine (plt.plot hits the 'current' axes) vs explicit object-oriented (ax.plot on an Axes you hold). You write explicit fig, ax = plt.subplots(); you only read plt.* in others' code." },
    { q: "Log-scale the y axis of an Axes ax?", a: "ax.set_yscale('log')." },
    { q: "Save a figure at publication quality?", a: "fig.savefig('name.png', dpi=200), a method on the Figure object, never a screenshot." },
    { q: "What does restart-and-run-all prove that running cells one at a time doesn't?", a: "That results depend only on top-to-bottom code, not on hidden stale kernel state, the figure is reproducible." },
  ],
  practice: [
    {
      prompt:
        "Make one figure with 4 subplots: a family of functions, a histogram, a scatter colored by a colormap, and imshow of an image array from l1-numpy. Add fig.savefig('fig.png', dpi=200), then open the saved file and look at it (the quick start skips saving, so this fills that gap). Write it OO-style from a blank cell.",
      minutes: 35,
    },
    {
      prompt: "Take a published loss-curve figure and rebuild it from the picture alone: axes, legend, log-y, and styling.",
      minutes: 30,
    },
    {
      prompt: "After each figure, run Kernel then Restart & Run All. If the notebook doesn't rebuild the figure top to bottom, the figure doesn't count.",
      minutes: 5,
    },
  ],
  implement: {
    spec: "plot_runs(ax, x, runs): takes an Axes and an (n_seeds, T) array, then draws the mean line plus a ±1 std band (ax.fill_between with alpha) with a label. Put it in a module file, not a cell; import it into the notebook and run it on synthetic runs. This is the experiment plot you'll reuse all year, written once and imported everywhere. It's also your first plotting module of your own (it feeds l1-testing-modules).",
    checks: [
      "Parameterized over ax, no plt.* global state inside the function",
      "Band is mean ±1 std across the seed axis (state which axis and why)",
      "Imported from the module and reused at least twice; notebook passes restart-and-run-all",
    ],
    minutes: 40,
  },
  stuck: {
    alternateRead: {
      title: "Scientific Python Lectures, Matplotlib chapter",
      url: "https://lectures.scientific-python.org/",
      resourceId: "scipy-lectures",
      sections: "Matplotlib chapter, same material, slower ramp, more worked examples",
      minutes: 30,
    },
    note: "Instead of reading the quick start a third time, switch to this. Still come back for the Application Interfaces page; that one you can't skip.",
  },
  deepen: [
    {
      title: "Scientific Visualization: Python + Matplotlib, Nicolas P. Rougier (open-access PDF)",
      url: "https://github.com/rougier/scientific-visualization-book",
      sections: "Parts 1–2 (fundamentals → figure design), open the day a figure is headed for a writeup, not before",
      minutes: 90,
    },
  ],
  prove: {
    task: "Given a CSV of noisy multi-seed experiment runs, make the labeled mean±std band plot across seeds on the first try, with no reference open. This is the figure you'll draw 50 times this year.",
    criteria: [
      "Built OO-style from a blank cell (fig, ax = plt.subplots()), no reference open",
      "Mean line plus a ±1 std band via fill_between with alpha, with clear axis labels and a legend",
      "Saved with fig.savefig at a set dpi, and you opened the file to check it",
      "Notebook passes restart-and-run-all",
    ],
    minutes: 25,
  },
  transfer: {
    task: "Once P1's projectile simulator produces data, plot its outputs: the trajectory in the x-y plane, energy versus time on twin plots, and a range-versus-angle sweep. This time you're using real simulation data, not synthetic arrays.",
    criteria: [
      "Every panel drawn through an explicit Axes you hold",
      "The figures read without you narrating them: titles, units, legends present",
    ],
    minutes: 25,
  },
  retention:
    "Day +7, from memory in under 10 minutes: a 2×2 subplot figure with one log-y panel and a shared legend, saved at dpi=200, then restart-and-run-all to prove it reproduces.",
  researchRecord: "docs/curation/l1-matplotlib.md",
  minutes: 235,
};
