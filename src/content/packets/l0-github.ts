import type { LearningPacket } from "@/lib/packet-types";
import { ytEmbed } from "@/lib/packet-types";

// Selected from docs/curation/l0-github.md (live-verified 2026-08-21).
// Note: the old GitHub "Hello World" tutorial is gone from the docs tree —
// this packet cites its replacement, the Start-your-journey series.

export const packet: LearningPacket = {
  nodeId: "l0-github",
  whyNow:
    "Your portfolio, your backups, and every robotics repo you will clone live on GitHub — and the SSH keys you cut here also unlock the remote GPU boxes later. The concept is one sentence on top of l0-git: a remote is one more peer of the same commit graph, and fetch, pull and push are just rules about which pointers move. Git is not GitHub. This packet manufactures every scary message — behind, ahead, rejected push — once, in a controlled two-clones drill, so none of them is ever scary in the wild.",
  diagnostic: {
    prompt:
      "Cold, 5 min: What does git pull actually do? When is a push rejected, and what do you do then? Which file in ~/.ssh is the secret, and what does ssh -T git@github.com prove? Sketch where origin/main sits in your l0-git graph drawing after a teammate pushes.",
    minutes: 5,
  },
  coreRead: [
    {
      title: "What is GitHub? — GitHub Docs, Start your journey",
      url: "https://docs.github.com/en/get-started/start-your-journey/what-is-github",
      sections: "The 5-minute orient read, before any command: Git vs GitHub, and repos as peers of one distributed graph — not 'the real copy' with local mirrors.",
      minutes: 5,
      whySelected: "First-party framing of exactly the conflation the Missing Semester notes warn about; the current replacement for the retired Hello World tutorial.",
    },
    {
      title: "Pro Git 2e — Working with Remotes",
      url: "https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes",
      sections: "remote -v, remote add, FETCH vs PULL, push, remote show — 1,400 words.",
      minutes: 12,
      whySelected: "The precision read for the fetch-vs-pull model — the exact distinction a 2024 study of 80 readers showed even practitioners lack.",
    },
    {
      title: "Missing Semester 2026 L2 notes — Remote Machines (SSH) section only",
      resourceId: "missing-semester",
      sections: "The conceptual SSH read: public-key authentication model, what the agent does — the mental model that generalizes past GitHub to every GPU box you will ever rent.",
      minutes: 15,
    },
    {
      title: "Generating a new SSH key and adding it to the ssh-agent — GitHub Docs",
      url: "https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent",
      sections: "Strict do-along, per your platform: ed25519 keygen with passphrase, agent setup (macOS keychain flag / Windows PowerShell path / Linux). This read PRODUCES your actual working key.",
      minutes: 15,
      whySelected: "First-party and current; ends with a working key instead of an idea of one.",
    },
  ],
  recall: [
    { q: "git pull is which two operations?", a: "fetch (download remote commits and move origin/main) + merge (fold origin/main into your branch). Nothing about pull is 'just download the latest'." },
    { q: "Why does a push come back rejected ('non-fast-forward')?", a: "origin has commits you don't have, and your push would discard them. It is a normal state, not an error: fetch/pull, reconcile, push again." },
    { q: "id_ed25519 vs id_ed25519.pub — which one leaves your machine?", a: "Only the .pub half goes to GitHub (or any server's authorized_keys). The private key never leaves; the agent holds it unlocked so you don't retype the passphrase." },
    { q: "What is origin/main?", a: "Your local remote-tracking pointer to where origin's main was at last fetch. 'Ahead of origin/main by 1' compares your main against that pointer — not against GitHub live." },
    { q: "What is a pull request, structurally?", a: "A branch comparison (base ← compare) plus discussion — not a bundle of files. Pushing more commits to the branch updates the open PR." },
  ],
  practice: [
    {
      prompt:
        "Finish the SSH chain the do-along started: add your ed25519 public key to GitHub, run ssh -T git@github.com and say what it proves (authentication, not authorization on any repo), then clone one of your own repos over SSH.",
      minutes: 10,
    },
    {
      prompt: "GitHub Skills: Introduction to GitHub — the bot-graded loop: branch → commit → open a PR → merge, with automated feedback at each step.",
      source: "https://github.com/skills/introduction-to-github",
      minutes: 35,
    },
    {
      prompt:
        "The node's exercise, on your own account: publish a local repo (git remote add origin, git push -u origin main), then open a PR from a branch against your own main and merge it.",
      minutes: 15,
    },
    {
      prompt:
        "Two-clones drill — this manufactures every message the diagnostic asks about: clone the same repo twice into different folders. Commit in A and push; in B run git fetch, read git status ('behind'), then git pull. Now commit in both and push from both: read the rejected push, resolve it, push again.",
      minutes: 15,
    },
  ],
  derive: {
    spec:
      "Extend your l0-git hand-drawn object model with origin/main and a second clone: one page, both clones plus GitHub, annotated with exactly which pointers fetch, merge, pull and push move. This diagram IS the node.",
    checks: [
      "fetch drawn moving ONLY origin/main — never your main, never the working tree",
      "pull drawn as fetch-then-merge: two arrows, not one",
      "The rejected-push state from the drill is drawable, and you can point at why the push bounced",
    ],
    minutes: 10,
  },
  stuck: {
    alternate: {
      title: "Missing Semester 2026 L2 — Command-line Environment (SSH segment)",
      creator: "MIT (Missing Semester)",
      url: "https://www.youtube.com/watch?v=ccBGsPedE9Q",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=ccBGsPedE9Q"),
      minutes: 25,
      whySelected: "The watch channel if SSH-by-reading is not landing: keygen, authorized_keys, agent and config demonstrated live — more than GitHub needs, exactly what later GPU boxes need.",
      unverified: true,
    },
    alternateRead: {
      title: "Learn Git Branching — Remote intro sequence",
      url: "https://learngitbranching.js.org/",
      resourceId: "learn-git-branching",
      sections: "The Remote world (~30 min): origin/main as a visible pointer you watch move under clone, fetch, pull and push.",
      minutes: 30,
    },
    note: "For 'ahead of origin/main by 1' confusion specifically: Julia Evans' confusing-git-terminology entry (jvns.ca). The L5 remotes video segment is the equivalent second channel for fetch/pull/push.",
  },
  deepen: [
    {
      title: "Missing Semester 2026 L2 — remaining SSH material",
      resourceId: "missing-semester",
      sections: "Config file, scp/rsync, port forwarding — schedule for the week the first remote GPU box appears (L4/L7), not now.",
      minutes: 20,
    },
    {
      title: "Reviewing your proposed changes — GitHub Docs",
      url: "https://docs.github.com/en/get-started/start-your-journey/reviewing-your-proposed-changes",
      sections: "PR-review mechanics — read when you start reviewing others' diffs, not before.",
      minutes: 10,
    },
  ],
  prove: {
    task:
      "The mastery run, narrated log required: clone an unfamiliar medium-sized repo (LeRobot or similar) over SSH, orient in 20 minutes — entry points, structure, how to run it, written down — then push one small documented change to your fork.",
    criteria: [
      "Orientation notes produced inside 20 minutes: entry point, layout, how to run",
      "Change pushed to YOUR fork over SSH and visible on GitHub — paste the URL",
      "Commit message states what and why in one clean line",
      "The log shows the clone → branch → commit → push chain with no dead-end flailing",
    ],
    minutes: 30,
  },
  transfer: {
    task:
      "Same SSH model, non-GitHub host: ssh into any second machine or VM (or replay OverTheWire Bandit's login, now understanding what -p 2220 and the password prompt were) and explain how key auth would replace the password. Open a docs-typo PR against a real public repo ONLY when you genuinely find one — no manufactured PRs.",
    criteria: [
      "Key-auth explanation places each piece correctly: what the server stores (public key) vs what you hold (private key + agent)",
      "Any PR opened was a genuine find",
    ],
    minutes: 10,
  },
  retention:
    "7 days, cold: the pull/push-rejection diagnostic again, plus fetch vs pull in one line each. 30 days: when the next machine or VM appears, rebuild or re-verify key + agent setup from memory.",
  researchRecord: "docs/curation/l0-github.md",
  minutes: 177,
};
