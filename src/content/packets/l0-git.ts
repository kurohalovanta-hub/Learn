import type { LearningPacket } from "@/lib/packet-types";
import { ytEmbed } from "@/lib/packet-types";

// Selected from docs/curation/l0-git.md (live-verified 2026-08-21).

export const packet: LearningPacket = {
  nodeId: "l0-git",
  whyNow:
    "Research is iteration, and git is how iteration becomes reversible — every experiment in this program is a commit. Git is not a save button: it is a graph of snapshots, with branches as lightweight movable pointers into that graph. Hold that model and conflicts, detached HEAD and 'lost' work stop being folklore — nothing committed is ever lost until garbage collection, and knowing that changes you from timid to experimental. This node gates at Gold: commands memorized without the model will not pass, and the drills are built so they cannot be faked.",
  diagnostic: {
    prompt:
      "Cold, on paper, ~10 min: draw the commit graph after — commit ×2, branch f, commit on f, checkout main, commit, merge f — and state where HEAD points at each step. Then: working tree vs staging area vs commit, one line each. Clean answers → go straight to the prove-it repair.",
    minutes: 10,
  },
  orient: {
    title: "Learn Git Branching — Main intro, first 3–4 levels",
    creator: "Peter Cottle",
    url: "https://learngitbranching.js.org/",
    minutes: 20,
    whySelected:
      "SEE commits and branches as graph nodes you manipulate before any terminology lands — chosen over a video because it is the same visual explanation with your hands on the graph.",
  },
  coreWatch: [
    {
      title: "Missing Semester 2026 L5 — Version Control and Git (data model through staging + basic CLI)",
      creator: "MIT (Missing Semester)",
      url: "https://www.youtube.com/watch?v=9K8lB61dl3Y",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=9K8lB61dl3Y", 0, 1800),
      endSeconds: 1800,
      minutes: 30,
      whySelected:
        "Optional second channel at 1.25× — the lecture teaches blobs/trees/DAG before any command, exactly this node's model. If you are a reader, the notes carry everything; skip straight to them (these minutes are extra, not counted in the packet total).",
      unverified: true,
    },
  ],
  coreRead: [
    {
      title: "Missing Semester 2026 L5 notes — through 'undo'",
      resourceId: "missing-semester",
      sections:
        "Data model (snapshots, content-addressing, references) → staging area → CLI basics → branching and merging → undo. Terminal open, every command typed into a scratch repo as you read.",
      minutes: 30,
      whySelected:
        "Data-model-FIRST is the entire game — most git teaching fails by doing commands first; this is the node's confirmed primary, re-verified against the live 2026 source.",
    },
    {
      title: "Pro Git 2e — Branches in a Nutshell",
      url: "https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell",
      sections:
        "The canonical 10-minute branch-model read: commits store trees + parents; 'a branch is simply a lightweight movable pointer'; what HEAD is. Read immediately before the branching exercises, not earlier.",
      minutes: 10,
    },
  ],
  recall: [
    { q: "What does a commit actually store?", a: "A snapshot — a tree of file contents — plus parent pointer(s), author and message. Not a diff; diffs are computed between snapshots on demand." },
    { q: "What is a branch, physically?", a: "A lightweight movable pointer to one commit (a tiny ref file in .git/refs/heads/). Creating one copies nothing." },
    { q: "Working tree vs staging area vs commit?", a: "Working tree = your files now; staging area (index) = the snapshot you are assembling next; commit = the immutable recorded snapshot. add moves tree → index; commit moves index → history." },
    { q: "What is detached HEAD?", a: "HEAD pointing directly at a commit instead of at a branch — new commits then advance no branch, so hang a branch on them or they will look lost." },
    { q: "You reset --hard and 'lost' a commit. Is it gone?", a: "No — committed states stay recoverable via git reflog until garbage collection. Find the hash in the reflog and point a branch (or reset) back to it." },
    { q: "The modern commands for 'move to a branch' and 'discard file changes'?", a: "git switch <branch> and git restore <file>. Legacy git checkout does both jobs — understand it for older docs, reach for switch/restore yourself." },
  ],
  practice: [
    {
      prompt:
        "Learn Git Branching: finish the Main intro sequence plus 'ramping up' — across sittings is fine. Every level: predict the graph before pressing enter.",
      source: "https://learngitbranching.js.org/",
      minutes: 40,
    },
    {
      prompt:
        "In a real scratch repo: 5 commits → branch → engineer a merge conflict on purpose → resolve it by reading the conflict markers. Then reset --hard away a commit and recover it with reflog.",
      minutes: 35,
    },
    {
      prompt: "The multi-branch merge-conflict scenario from the Missing Semester L5 exercise set.",
      source: "Missing Semester 2026 L5 exercises",
      minutes: 15,
    },
    {
      prompt:
        "Standing drill for the two items above: before EVERY command, say what git log --all --graph --oneline will show afterward — then run both and compare. Prediction is the drill; a wrong prediction is a model bug to fix on the spot.",
    },
  ],
  derive: {
    spec:
      "Hand-draw the object model of your real scratch repo — commits with parent arrows, branch refs, HEAD — then verify it two ways: against git log --all --graph --oneline, and by reading .git directly (cat .git/HEAD, ls .git/refs/heads/, cat one ref file). Reading .git is the proof the model is physical, not metaphor.",
    checks: [
      "Drawing matches the log graph exactly — every commit, every ref, HEAD",
      "HEAD and each branch located as real files inside .git and read aloud",
      "From the drawing, you can predict which pointers the next commit / merge / switch will move",
    ],
    minutes: 20,
  },
  stuck: {
    alternateRead: {
      title: "Confusing git terminology — Julia Evans",
      url: "https://jvns.ca/blog/2023/11/01/confusing-git-terminology/",
      sections: "Look up exactly the term that stings: detached HEAD, fast-forward, index/staging/staged, 'ahead of origin/main'.",
      minutes: 10,
    },
    note: "For any 'I broke it' moment: Oh Shit, Git!?! (dangitgit.com is the swear-free mirror) — apply the recipe first, then explain the recipe back in graph terms; the explanation is the learning.",
  },
  deepen: [
    {
      title: "Pro Git 2e — What is Git? + remaining basic-branching sections",
      url: "https://git-scm.com/book/en/v2",
      sections:
        "'What is Git?' (snapshots-not-diffs, the three states, checksummed integrity) as the alternate telling of the data model; then chapter 3's remaining basic branching and merging sections.",
      minutes: 35,
    },
    {
      title: "Key Git Concepts Explained the Hard Way (HN thread)",
      url: "https://news.ycombinator.com/item?id=16586811",
      sections: "The plumbing-level view — only if the object model fascinates.",
      minutes: 30,
    },
  ],
  prove: {
    task:
      "The Gold gate, ~30 min: a prepared repo with a broken merge and an accidentally-deleted branch (a setup script ships with the lesson). Restore both to working state — no AI, no cheat sheet (man pages allowed) — narrating each command's effect on the commit graph BEFORE you run it.",
    criteria: [
      "Merge resolved or cleanly aborted-and-redone; final graph drawn and matching git log --graph",
      "Deleted branch's commits found via reflog and re-anchored by a new branch ref",
      "Every command pre-narrated as a graph operation — what moves: HEAD, a ref, the index",
      "No AI, no cheat sheet, no pasting from history",
    ],
    minutes: 30,
  },
  transfer: {
    task:
      "Git golf: solve 3 unseen Learn Git Branching levels in minimum commands. Then in a real repo: find which of 8 commits broke a script by checkout-and-test, narrating the binary search — bisect by hand (this bridges into l0-debug-mindset).",
    criteria: [
      "Unseen levels solved at or near par",
      "Culprit commit found in ≤3 tests, and you can say why log2(8) tests suffice",
    ],
    minutes: 30,
  },
  retention:
    "7 days: cold-draw the diagnostic graph variant with a second feature branch added. 30 days, during L1 project work: recover an actually-lost commit via reflog in your live project — log it when it happens naturally, else stage it as a drill.",
  researchRecord: "docs/curation/l0-git.md",
  minutes: 240,
};
