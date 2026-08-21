# l11-lerobot — LeRobot: The Workbench

Concept: LeRobot as infrastructure — LeRobotDataset v3 (parquet + MP4 shards + `meta/` with
`info.json`/`stats.json`), `delta_timestamps` temporal windows, `StreamingLeRobotDataset`,
and the CLI family (`lerobot-train`/`lerobot-eval`/`lerobot-record`/`lerobot-rollout`) that
every later node (ACT, DP, SmolVLA, π0) runs through. Not a "concept" node: a tooling-fluency
node whose mastery is executing and *inspecting*, not watching.

Learner prerequisites: l11-bc-dagger (knows what a policy/demo/rollout is), Python + venv
fluency from L1, PyTorch Dataset/DataLoader from l4-training-loop. Grade-10 math suffices —
this node is engineering literacy.

What beginners commonly misunderstand:
- That `pip install lerobot` is the whole setup — in practice version pinning is the #1 pain:
  torch/torchcodec ABI mismatches break video decoding on fresh installs (issues #4393,
  #4458/#4459), and old official checkpoints break under new lerobot versions (#3802, #4047).
  Lesson to internalize: pin the version, record it, prefer training your own checkpoint.
- That a dataset row = one timestep. With `delta_timestamps` an index returns *stacked
  windows* (e.g. obs at [-0.1, 0.0]s, actions spanning [-0.1 … 1.4]s in the official DP
  example) — the chunking machinery of L11/L12 lives here, invisibly.
- That normalization is a training detail. Stats live in `meta/stats.json`
  (`dataset.meta.stats`); a policy evaluated with wrong/missing stats fails silently — the
  node diagnostic exists because this really bites.
- Confusing episode boundaries with file boundaries: v3 concatenates episodes into large
  shards; episode views are reconstructed from metadata.

Candidate videos:
1. none found this session — the session's web-search budget was exhausted before video
   discovery for this node, and YouTube/HF egress is blocked from this environment. Fallback:
   this node genuinely does not need video — its official materials are executable
   (quickstart notebook, train_policy.py) and docs-first is faster per minute for tooling.

Candidate written resources:
1. LeRobot docs — Get started (`index`, `installation`, `cheat-sheet` slugs verified in
   docs/source/_toctree.yml) — https://huggingface.co/docs/lerobot/index — (correctness 5,
   beginner fit 4, time-efficiency 5; the cheat-sheet page is a one-screen map of every CLI)
2. "Using LeRobotDataset" (docs slug `lerobot-dataset-v3`; source verified:
   https://github.com/huggingface/lerobot/blob/main/docs/source/lerobot-dataset-v3.mdx) —
   v3 structure, loading code, `delta_timestamps`, streaming, `meta/stats.json` — the exact
   content of this node's objectives (clarity 5, rigor 4)
3. Official minimal training example — verified: trains **Diffusion Policy on PushT, 5,000
   steps**, with delta_timestamps config and full training loop in ~1 file —
   https://github.com/huggingface/lerobot/blob/main/examples/training/train_policy.py
   (plus examples/tutorial/{act,diffusion,smolvla,pi0,rl,async-inf}/ scripts and
   examples/notebooks/quickstart.ipynb, all verified present)
4. "Imitation Learning for Robots" tutorial (slug `il_robots`, source verified) — the
   record→visualize→replay→train→evaluate loop; documents rollout strategies **base /
   sentry / highlight / dagger (+ episodic)** — note: node/l11-data-quality prose says
   "base/sentry/dagger"; docs now also list *highlight* (ring-buffer manual saves) — minor
   drift worth folding into content text.
5. Robot Learning: A Tutorial (LeRobot team) —
   https://huggingface.co/spaces/lerobot/robot-learning-tutorial (repo-existing resource,
   URL re-surfaced in this session's search results) — conceptual backup, not the doing-path.

Community evidence:
- lerobot GitHub issues: torch>=2.7 allowed but bundled torchcodec 0.11 needs torch 2.9
  symbols → ABI crash on install (#4393; fix PRs #4458/#4459): the classic day-one failure
  (https://github.com/huggingface/lerobot/issues?q=torchcodec+OR+ffmpeg+install)
- lerobot #3802: `lerobot/diffusion_pusht` official checkpoint fails to load on lerobot
  0.4.4 (SpatialSoftmax pos_grid shape mismatch); #4047: multiple official checkpoints use
  the old processor pipeline and break `lerobot-eval` → don't debug someone else's stale
  checkpoint on day one; train your own
  (https://github.com/huggingface/lerobot/issues?q=pusht+diffusion+train)
- gym-pusht README (verified): PushT originated from the Diffusion Policy research; success
  = 95% goal-zone coverage; obs modes state / environment_state_agent_pos / pixels (96×96)
  (https://github.com/huggingface/gym-pusht)

Primary technical authority:
- LeRobot repo + docs, v0.6-era, 26.8k★, actively maintained (1,715 commits on main at
  fetch) — https://github.com/huggingface/lerobot ; docs at
  https://huggingface.co/docs/lerobot/index

Selected shortest-sufficient packet:
- DIAGNOSTIC: cold, before touching docs: "What does `delta_timestamps` do? Where do
  normalization stats live and why do they matter at eval?" — write best guesses, 5 min.
- ORIENT: LeRobot README + docs `index` + `cheat-sheet` skim — what exists, where things
  live, 10 min.
- CORE WATCH: — (no video needed; see candidates note)
- CORE READ: `installation` + `lerobot-dataset-v3` docs pages read **with a Python REPL
  open**, loading `lerobot/pusht` and poking every claim (episodes, `dataset.meta.stats`,
  a `delta_timestamps` query) as you read — 40 min.
- INTERACTIVE: — (no in-app widget fits a tooling node; the REPL is the interactive)
- PRACTICE: from the loaded pusht dataset: plot episode lengths, action distributions, and
  render 3 camera frames — the start of the inspection notebook (30 min).
- IMPLEMENT/DERIVE: (1) run examples/training/train_policy.py end-to-end (DP on PushT, 5k
  steps) and then `lerobot-eval` it; (2) finish the dataset-inspection notebook; (3) stream
  one DROID slice via `StreamingLeRobotDataset` and diff its schema vs pusht (≈3–4 h incl.
  training wall-clock).
- STUCK PATH: examples/notebooks/quickstart.ipynb (verified present) run top-to-bottom; if
  install breaks on video decoding, search lerobot issues for "torchcodec" first (#4393 —
  known, pinned-version fix).
- DEEPEN: `il_robots` tutorial end-to-end (rollout strategies incl. dagger mode — bridges
  back to l11-bc-dagger) + Robot Learning: A Tutorial chapters, only if the ecosystem view
  feels shaky.
- PROVE IT: node masteryTest as written — from a clean venv: install, short DP-on-PushT
  train, `lerobot-eval`, then explain every field of the dataset schema from your notebook
  without opening docs.
- TRANSFER: load `lerobot/aloha_sim_transfer_cube_human` (the l11-act dataset — name
  verified in issue #2605) and predict, before looking, how its schema differs from pusht
  (cameras, action dim 14, fps); verify.
- RETENTION: 10 days later (during l11-act): re-answer the diagnostic pair from memory and
  explain why v3 keeps episodes in shared shards.

Why this won: for a workbench node, executable official material beats any video —
`train_policy.py` is literally the node objective as 1 file, verified current today, and the
dataset docs page contains every diagnostic answer. Total packet ≈ 85 min reading/inspection
+ ~3–4 h doing ≈ node's 5 h.

What was rejected (and why): video tutorials (none verifiable this session; also
SO-100/hardware-centric content dominates that genre while this learner's path is sim-first);
getting_started_real_world_robot docs page (hardware assembly — out of scope until a real
arm exists); LeLab GUI (hides exactly the CLI/schema literacy this node exists to build).

Risk of superficial understanding: HIGH in a specific way — the scripts *work* when
copy-pasted, so recognition masquerades as mastery. The dataset-inspection notebook and the
clean-env mastery test are the antidote: schema fields explained from YOUR plots, not from
docs.

Required active work: the inspection notebook (own code), the end-to-end train+eval run, the
DROID schema diff, and the clean-environment reinstall proof.

Last verified: 2026-08-21
