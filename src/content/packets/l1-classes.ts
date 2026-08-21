import type { LearningPacket } from "@/lib/packet-types";

// Selected from docs/curation/l1-classes.md (live-verified 2026-08-21).
// Exactly-enough OOP: reading/writing framework-style classes, with the two
// research-backed stalls (self, shared class attributes) given dedicated
// experiments and motivation handled up front via the Env skeleton.

export const packet: LearningPacket = {
  nodeId: "l1-classes",
  whyNow:
    "Every PyTorch nn.Module, every gym Env, every robotics framework class you will ever read is the same thing: state plus the functions that legitimately mutate it. This node buys reading-and-writing fluency in exactly that shape — self desugared, __init__, the super().__init__() contract — and nothing more. No hierarchy worship: a function is still the default unit; a class has to earn its place.",
  diagnostic: {
    prompt:
      "Cold: (1) What is self? (2) In a subclass of an nn.Module-style base, what does super().__init__() do — and why must it run before you use inherited state? (3) A class body contains items = []; two different instances each call inst.items.append(...) — predict what both instances now see, and why.",
    minutes: 10,
  },
  coreRead: [
    {
      title: "Think Python 3e — the OOP block, first half (ch 14–15)",
      url: "https://allendowney.github.io/ThinkPython/",
      resourceId: "think-python",
      sections: "Ch 14 (title approx in 3e) + ch 15 'Classes and Methods' — class, __init__, self, methods, __repr__",
      minutes: 45,
      whySelected: "The scheduled return to the OOP block. Read → immediately build Vector2D.",
    },
    {
      title: "Think Python 3e — ch 16–17",
      url: "https://allendowney.github.io/ThinkPython/",
      resourceId: "think-python",
      sections: "Ch 16 'Classes and Objects' + ch 17 inheritance — SINGLE inheritance and super() only",
      minutes: 35,
      whySelected: "Read → run the shared-class-attribute experiment, then the super().__init__() subclass.",
    },
    {
      title: "Python Programming FAQ — the class entries",
      url: "https://docs.python.org/3.10/faq/programming.html",
      sections: "'What is self?' and the class-attribute vs instance-attribute entries",
      minutes: 10,
      whySelected: "First-party and exact on precisely the two stalls this node guards against.",
    },
  ],
  recall: [
    { q: "What is self?", a: "Not a keyword — the first parameter of a method, bound to the instance: obj.m(x) is exactly Cls.m(obj, x)." },
    { q: "items = [] in the class body; one instance appends via inst.items — what do the others see?", a: "The same list: a mutable class attribute is shared by all instances — the default-argument trap in a costume. self.items = [] in __init__ gives each instance its own." },
    { q: "Why must a subclass call super().__init__() before using inherited state?", a: "The parent's __init__ is what creates that state; skip it and the attributes simply do not exist — exactly the nn.Module contract." },
    { q: "Is __init__ the constructor?", a: "It is the initializer: the object already exists when it runs; __init__ fills in attributes and returns None." },
    { q: "What does @dataclass write for you?", a: "__init__, __repr__ and __eq__, generated from the field declarations — state-record classes without boilerplate." },
  ],
  practice: [
    {
      prompt:
        "ORIENT — do this before any reading: skim a gym-style Env skeleton (reset(), step(action), internal state) and write ONE sentence on what the class is FOR: state plus its legitimate mutations. This answers 'when would I even use a class?' before syntax starts.",
      minutes: 10,
    },
    {
      prompt: "After ch 14–15: Vector2D with __init__, + (__add__), scalar * (__mul__), norm(), and a __repr__ that prints like Vector2D(1.0, 2.0). Verify each operation in the REPL.",
      minutes: 20,
    },
    {
      prompt:
        "The shared-class-attribute experiment: a mutable class attribute (items = [] in the class body) vs an instance attribute created in __init__ — append through one instance, print through another, and prove what happened with __dict__ and id().",
      minutes: 10,
    },
    {
      prompt:
        "Subclass a tiny Base whose __init__ establishes state the child needs: show the child break without super().__init__() and work with it — the nn.Module contract in miniature.",
      minutes: 10,
    },
    {
      prompt: "Exercism 'Ellen's Alien Game' — the track's classes exercise; it drills class vs instance attributes explicitly.",
      source: "https://exercism.org/tracks/python/exercises/ellens-alien-game",
      minutes: 25,
    },
    {
      prompt: "Rewrite Vector2D as a @dataclass (+ __eq__ for free) and note in a comment what you no longer had to write.",
      minutes: 10,
    },
    {
      prompt: "Read a small gym-style Env class and diagram its lifecycle reset → step → … → done, labeling which attributes carry state between calls.",
      minutes: 10,
    },
  ],
  implement: {
    spec: "Desugar a method call by hand, in the REPL: show that v.norm() and Vector2D.norm(v) return the identical value; then print v.__dict__ before and after setting a new attribute and explain each key.",
    checks: [
      "Both call forms agree, and you can say what was passed as self",
      "__dict__ shows exactly the instance attributes — and the new key appears on assignment",
    ],
    minutes: 15,
  },
  stuck: {
    alternate: {
      title: "CS50P Week 8 — Object-Oriented Programming (notes, then lecture segments)",
      creator: "David Malan (Harvard)",
      url: "https://cs50.harvard.edu/python/weeks/",
      minutes: 30,
      whySelected: "Motivation-first build-up from a plain dict to a class — the verified video path if reading alone doesn't click. Topic markers at 1.5–2×, failing topic only.",
      unverified: true,
    },
    note: "If a second voice is needed: Corey Schafer's 'Python OOP Tutorial' parts 1–2, located by title (URLs unverified this session). Part 2 covers the shared-class-attribute trap head-on.",
  },
  deepen: [
    {
      title: "The Python Tutorial §9 'Classes' + dataclasses module docs",
      sections: "§9 for attribute-lookup semantics; dataclasses for fields/defaults — navigate from the docs.python.org root. Dunders at reading fluency only (__repr__/__eq__/__len__). Honor the skip-list: no multiple inheritance, metaclasses, or descriptors until a library forces it.",
      minutes: 25,
      whySelected: "The actual semantics, when you want them — not before.",
    },
  ],
  prove: {
    task: "Node mastery test: design a Particle class for a toy simulator — state (position, velocity, mass), step(dt) advancing state in place, energy() computed from state — plus ONE subclass that changes behavior (e.g. drag in step) and calls super().__init__(). Justify every method's placement in one line each. Run 10 steps and paste the printed position/velocity/energy trace.",
    criteria: [
      "step(dt) mutates state and energy() derives from it — and you can say why each is a method rather than a free function",
      "The subclass overrides without copying parent code and calls super().__init__()",
      "Every method placement justified in one line",
      "The pasted 10-step trace is physically plausible for your dynamics",
    ],
    minutes: 40,
  },
  transfer: {
    task: "Read an unfamiliar nn.Module-style skeleton (an __init__ defining sub-modules, a forward composing them) and annotate it: what self refers to at each line, what super().__init__() established, and which attributes are instance vs class. This is the exact reading skill L3+ assumes.",
    criteria: [
      "Every attribute correctly classified as instance or class",
      "The super().__init__() line's purpose stated in one sentence",
    ],
    minutes: 10,
  },
  retention:
    "At +1 week: rewrite Vector2D as a dataclass, cold, in under 10 minutes; then explain in two sentences why the shared-class-attribute trap and the mutable-default-argument trap are the same phenomenon (one object, many names).",
  researchRecord: "docs/curation/l1-classes.md",
  minutes: 260,
};
