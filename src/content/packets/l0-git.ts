import type { LearningPacket } from "@/lib/packet-types";
import { ytEmbed } from "@/lib/packet-types";

// Selected from docs/curation/l0-git.md (live-verified 2026-08-21).

export const packet: LearningPacket = {
  nodeId: "l0-git",
  whyNow:
    "Git is not a save button. It is a graph of snapshots, and a branch is just a movable pointer into that graph. Once you hold that picture, the scary parts (conflicts, a detached HEAD, work that looks lost) turn ordinary, and you learn that nothing you committed is really gone. This node gates at Gold, so memorized commands without the model will not pass.",
  diagnostic: {
    prompt:
      "Cold, on paper, about 10 minutes. Draw the commit graph after this sequence: commit ×2, branch f, commit on f, checkout main, commit, merge f. Say where HEAD points at each step. Then give working tree vs staging area vs commit, one line each. If your answers are clean, skip ahead to the prove-it repair.",
    minutes: 10,
  },
  orient: {
    title: "Learn Git Branching, Main intro, first 3–4 levels",
    creator: "Peter Cottle",
    url: "https://learngitbranching.js.org/",
    minutes: 20,
    whySelected:
      "You get to see commits and branches as graph nodes and move them around before any terminology lands. It beats a video here because you learn the same picture with your own hands on the graph.",
  },
  coreWatch: [
    {
      title: "Missing Semester 2026 L5, Version Control and Git (data model through staging + basic CLI)",
      creator: "MIT (Missing Semester)",
      url: "https://www.youtube.com/watch?v=9K8lB61dl3Y",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=9K8lB61dl3Y", 0, 1800),
      endSeconds: 1800,
      minutes: 30,
      whySelected:
        "An optional second pass at 1.25×. The lecture teaches blobs, trees, and the commit graph before any command, which is exactly the model this node is built on. If you learn better by reading, the notes carry everything, so skip straight to them (these minutes are extra and not counted in the packet total).",
      unverified: true,
    },
  ],
  coreRead: [
    {
      title: "Missing Semester 2026 L5 notes, through 'undo'",
      resourceId: "missing-semester",
      sections:
        "Data model (snapshots, content-addressing, references) → staging area → CLI basics → branching and merging → undo. Terminal open, every command typed into a scratch repo as you read.",
      minutes: 30,
      whySelected:
        "Learning the data model first is the whole point. Most git teaching starts with commands and leaves you memorizing spells; this one does the model first, and it is the node's confirmed primary, re-checked against the live 2026 source.",
    },
    {
      title: "Pro Git 2e, Branches in a Nutshell",
      url: "https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell",
      sections:
        "The canonical 10-minute branch-model read: commits store trees + parents; 'a branch is simply a lightweight movable pointer'; what HEAD is. Read immediately before the branching exercises, not earlier.",
      minutes: 10,
    },
  ],
  recall: [
    { q: "What does a commit actually store?", a: "A snapshot, a tree of file contents, plus parent pointer(s), author and message. Not a diff; diffs are computed between snapshots on demand." },
    { q: "What is a branch, physically?", a: "A lightweight movable pointer to one commit (a tiny ref file in .git/refs/heads/). Creating one copies nothing." },
    { q: "Working tree vs staging area vs commit?", a: "Working tree = your files now; staging area (index) = the snapshot you are assembling next; commit = the immutable recorded snapshot. add moves tree → index; commit moves index → history." },
    { q: "What is detached HEAD?", a: "HEAD pointing directly at a commit instead of at a branch, new commits then advance no branch, so hang a branch on them or they will look lost." },
    { q: "You reset --hard and 'lost' a commit. Is it gone?", a: "No, committed states stay recoverable via git reflog until garbage collection. Find the hash in the reflog and point a branch (or reset) back to it." },
    { q: "The modern commands for 'move to a branch' and 'discard file changes'?", a: "git switch <branch> and git restore <file>. Legacy git checkout does both jobs, understand it for older docs, reach for switch/restore yourself." },
  ],
  practice: [
    {
      prompt:
        "Learn Git Branching: finish the Main intro sequence plus 'ramping up'. Doing it across a few sittings is fine. On every level, predict the graph before you press enter.",
      source: "https://learngitbranching.js.org/",
      minutes: 40,
    },
    {
      prompt:
        "In a real scratch repo: make 5 commits, branch, then create a merge conflict on purpose and resolve it by reading the conflict markers. After that, use reset --hard to throw away a commit and get it back with reflog.",
      minutes: 35,
    },
    {
      prompt: "Do the multi-branch merge-conflict scenario from the Missing Semester L5 exercise set.",
      source: "Missing Semester 2026 L5 exercises",
      minutes: 15,
    },
    {
      prompt:
        "A standing drill for the two items above: before every command, say out loud what git log --all --graph --oneline will show afterward, then run it and compare. The prediction is the drill. A wrong prediction is a hole in your model, so fix it on the spot.",
    },
  ],
  derive: {
    spec:
      "Hand-draw the object model of your real scratch repo: commits with parent arrows, branch refs, and HEAD. Then check it two ways, against git log --all --graph --oneline and by reading .git directly (cat .git/HEAD, ls .git/refs/heads/, cat one ref file). Opening .git yourself is what proves the model is real, not a metaphor.",
    checks: [
      "Drawing matches the log graph exactly, every commit, every ref, HEAD",
      "HEAD and each branch located as real files inside .git and read aloud",
      "From the drawing, you can predict which pointers the next commit / merge / switch will move",
    ],
    minutes: 20,
  },
  stuck: {
    alternateRead: {
      title: "Confusing git terminology, Julia Evans",
      url: "https://jvns.ca/blog/2023/11/01/confusing-git-terminology/",
      sections: "Look up exactly the term that stings: detached HEAD, fast-forward, index/staging/staged, 'ahead of origin/main'.",
      minutes: 10,
    },
    note: "For any 'I broke it' moment, use Oh Shit, Git!?! (dangitgit.com is the swear-free mirror). Apply the recipe first, then explain it back to yourself in graph terms. The explaining is where the learning happens.",
  },
  deepen: [
    {
      title: "Pro Git 2e, What is Git? + remaining basic-branching sections",
      url: "https://git-scm.com/book/en/v2",
      sections:
        "'What is Git?' (snapshots-not-diffs, the three states, checksummed integrity) as the alternate telling of the data model; then chapter 3's remaining basic branching and merging sections.",
      minutes: 35,
    },
    {
      title: "Key Git Concepts Explained the Hard Way (HN thread)",
      url: "https://news.ycombinator.com/item?id=16586811",
      sections: "The plumbing-level view, only if the object model fascinates.",
      minutes: 30,
    },
  ],
  prove: {
    task:
      "The Gold gate, about 30 minutes. You get a prepared repo with a broken merge and an accidentally deleted branch (a setup script ships with the lesson). Restore both to working state with no AI and no cheat sheet (man pages allowed), and narrate what each command does to the commit graph before you run it.",
    criteria: [
      "Merge resolved, or cleanly aborted and redone, with the final graph drawn and matching git log --graph",
      "The deleted branch's commits found with reflog and re-anchored by a new branch ref",
      "Every command narrated first as a graph move: which of HEAD, a ref, or the index shifts",
      "No AI, no cheat sheet, no pasting from history",
    ],
    minutes: 30,
  },
  transfer: {
    task:
      "Git golf: solve 3 unseen Learn Git Branching levels in as few commands as you can. Then, in a real repo, find which of 8 commits broke a script by checking out and testing, narrating the binary search as you bisect by hand (this leads into l0-debug-mindset).",
    criteria: [
      "Unseen levels solved at or near par",
      "Culprit commit found in ≤3 tests, and you can say why log2(8) tests suffice",
    ],
    minutes: 30,
  },
  retention:
    "7 days: cold-draw the diagnostic graph variant with a second feature branch added. 30 days, during L1 project work: recover an actually-lost commit via reflog in your live project, log it when it happens naturally, else stage it as a drill.",
  researchRecord: "docs/curation/l0-git.md",
  minutes: 240,
};
