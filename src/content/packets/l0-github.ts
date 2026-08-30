import type { LearningPacket } from "@/lib/packet-types";
import { ytEmbed } from "@/lib/packet-types";

// Selected from docs/curation/l0-github.md (live-verified 2026-08-21).
// Note: the old GitHub "Hello World" tutorial is gone from the docs tree, 
// this packet cites its replacement, the Start-your-journey series.

export const packet: LearningPacket = {
  nodeId: "l0-github",
  whyNow:
    "Your code, your backups, and the robotics repos you will clone all live on GitHub, and the SSH keys you make here also get you into the remote GPU boxes later. On top of l0-git the idea is small: a remote is one more copy of the same commit history, and fetch, pull, and push are rules about which pointers move. Git is not GitHub. In this packet you make every scary message (behind, ahead, rejected push) happen once, on purpose, in a two-clones drill, so none of them throws you in real work.",
  diagnostic: {
    prompt:
      "Cold, 5 minutes. What does git pull actually do? When does a push get rejected, and what do you do about it? Which file in ~/.ssh is the secret one, and what does ssh -T git@github.com prove? Sketch where origin/main sits in your l0-git drawing after a teammate pushes.",
    minutes: 5,
  },
  coreRead: [
    {
      title: "What is GitHub?, GitHub Docs, Start your journey",
      url: "https://docs.github.com/en/get-started/start-your-journey/what-is-github",
      sections: "The 5-minute orient read, before any command: Git vs GitHub, and repos as peers of one distributed graph, not 'the real copy' with local mirrors.",
      minutes: 5,
      whySelected: "The official page names the exact Git-versus-GitHub mix-up the Missing Semester notes warn about. It replaced the old Hello World tutorial.",
    },
    {
      title: "Pro Git 2e, Working with Remotes",
      url: "https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes",
      sections: "remote -v, remote add, FETCH vs PULL, push, remote show, 1,400 words.",
      minutes: 12,
      whySelected: "The careful read on fetch versus pull. A 2024 study of 80 readers found even experienced people miss this exact distinction.",
    },
    {
      title: "Missing Semester 2026 L2 notes, Remote Machines (SSH) section only",
      resourceId: "missing-semester",
      sections: "The conceptual SSH read: public-key authentication model, what the agent does, the mental model that generalizes past GitHub to every GPU box you will ever rent.",
      minutes: 15,
    },
    {
      title: "Generating a new SSH key and adding it to the ssh-agent, GitHub Docs",
      url: "https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent",
      sections: "Strict do-along, per your platform: ed25519 keygen with passphrase, agent setup (macOS keychain flag / Windows PowerShell path / Linux). This read PRODUCES your actual working key.",
      minutes: 15,
      whySelected: "Official and up to date. You finish with a working key, not just the idea of one.",
    },
  ],
  recall: [
    { q: "git pull is which two operations?", a: "fetch (download remote commits and move origin/main) + merge (fold origin/main into your branch). Nothing about pull is 'just download the latest'." },
    { q: "Why does a push come back rejected ('non-fast-forward')?", a: "origin has commits you don't have, and your push would discard them. It is a normal state, not an error: fetch/pull, reconcile, push again." },
    { q: "id_ed25519 vs id_ed25519.pub, which one leaves your machine?", a: "Only the .pub half goes to GitHub (or any server's authorized_keys). The private key never leaves; the agent holds it unlocked so you don't retype the passphrase." },
    { q: "What is origin/main?", a: "Your local remote-tracking pointer to where origin's main was at last fetch. 'Ahead of origin/main by 1' compares your main against that pointer, not against GitHub live." },
    { q: "What is a pull request, structurally?", a: "A branch comparison (base ← compare) plus discussion, not a bundle of files. Pushing more commits to the branch updates the open PR." },
  ],
  practice: [
    {
      prompt:
        "Finish the SSH chain from the do-along. Add your ed25519 public key to GitHub, run ssh -T git@github.com and say what it proves (it proves who you are, not that you can touch any given repo), then clone one of your own repos over SSH.",
      minutes: 10,
    },
    {
      prompt: "GitHub Skills: Introduction to GitHub. A bot-graded loop where you branch, commit, open a PR, then merge, and get feedback at each step.",
      source: "https://github.com/skills/introduction-to-github",
      minutes: 35,
    },
    {
      prompt:
        "On your own account, publish a local repo (git remote add origin, git push -u origin main), then open a PR from a branch against your own main and merge it.",
      minutes: 15,
    },
    {
      prompt:
        "Two-clones drill, which produces every message the diagnostic asks about. Clone the same repo twice into two folders. Commit in A and push. In B run git fetch, read git status ('behind'), then git pull. Now commit in both and push from both. Read the rejected push, fix it, push again.",
      minutes: 15,
    },
  ],
  derive: {
    spec:
      "Add origin/main and a second clone to your l0-git hand-drawn diagram. One page, both clones plus GitHub, marked up with exactly which pointers fetch, merge, pull, and push move. This diagram is the node.",
    checks: [
      "fetch drawn moving ONLY origin/main, never your main, never the working tree",
      "pull drawn as fetch-then-merge: two arrows, not one",
      "The rejected-push state from the drill is drawable, and you can point at why the push bounced",
    ],
    minutes: 10,
  },
  stuck: {
    alternate: {
      title: "Missing Semester 2026 L2, Command-line Environment (SSH segment)",
      creator: "MIT (Missing Semester)",
      url: "https://www.youtube.com/watch?v=ccBGsPedE9Q",
      embedUrl: ytEmbed("https://www.youtube.com/watch?v=ccBGsPedE9Q"),
      minutes: 25,
      whySelected: "The video to watch if reading about SSH is not clicking. It shows keygen, authorized_keys, the agent, and config live. More than GitHub needs, and exactly what the later GPU boxes need.",
      unverified: true,
    },
    alternateRead: {
      title: "Learn Git Branching, Remote intro sequence",
      url: "https://learngitbranching.js.org/",
      resourceId: "learn-git-branching",
      sections: "The Remote world (~30 min): origin/main as a visible pointer you watch move under clone, fetch, pull and push.",
      minutes: 30,
    },
    note: "Stuck on 'ahead of origin/main by 1'? Read Julia Evans' confusing-git-terminology entry (jvns.ca). For fetch, pull, and push, the L5 remotes video segment is the second channel to try.",
  },
  deepen: [
    {
      title: "Missing Semester 2026 L2, remaining SSH material",
      resourceId: "missing-semester",
      sections: "Config file, scp/rsync, port forwarding, schedule for the week the first remote GPU box appears (L4/L7), not now.",
      minutes: 20,
    },
    {
      title: "Reviewing your proposed changes, GitHub Docs",
      url: "https://docs.github.com/en/get-started/start-your-journey/reviewing-your-proposed-changes",
      sections: "PR-review mechanics, read when you start reviewing others' diffs, not before.",
      minutes: 10,
    },
  ],
  prove: {
    task:
      "The mastery run, and keep a narrated log. Clone an unfamiliar medium-sized repo (LeRobot or similar) over SSH. In 20 minutes find your way around (entry points, structure, how to run it) and write it down. Then push one small, documented change to your fork.",
    criteria: [
      "Orientation notes done inside 20 minutes: entry point, layout, how to run it",
      "Change pushed to YOUR fork over SSH and visible on GitHub (paste the URL)",
      "Commit message states what and why in one clean line",
      "The log shows the clone → branch → commit → push chain with no dead ends",
    ],
    minutes: 30,
  },
  transfer: {
    task:
      "Same SSH idea, on a host that is not GitHub. ssh into any second machine or VM (or replay OverTheWire Bandit's login, now that you know what -p 2220 and the password prompt were doing) and explain how key auth would replace that password. Open a docs-typo PR against a real public repo only when you actually find one. Do not make up a PR.",
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
