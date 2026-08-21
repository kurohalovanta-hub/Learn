# l7-ros2-core — ROS 2 Core: Nodes, Topics, Services

Concept: The ROS 2 computation-graph model — nodes as processes, topics (pub/sub streams),
services (request/reply), actions (long-running + feedback), parameters — plus the workspace
mechanics (colcon, sourcing, underlay/overlay) and CLI introspection fluency on a correctly
chosen distro. "ROS is tooling, not identity": middleware around ordinary Python, not a
language to become.

Learner prerequisites: l0-workflow-capstone (gold) — Linux shell, git, editor comfort;
l1-testing-modules — Python packages/imports. Ubuntu 24.04 machine (native or VM). No prior
robotics assumed.

What beginners commonly misunderstand:
- Treating ROS as a monolithic framework to "learn all of" instead of plumbing + a CLI
  toolbelt around small programs (identity trap; drives the 40–60 h scope cap).
- Sourcing: what `source /opt/ros/jazzy/setup.bash` and `source install/setup.bash` actually
  do (environment prepend, underlay→overlay), why every new shell needs it, why "command
  not found: ros2" or "package not found" is almost always a sourcing/build-state issue.
- Topic vs service vs action selection (streaming vs request/reply vs preemptible
  long-running with feedback) — the node's own diagnostic question, because misuse is the
  classic first-project design error.
- Assuming a publisher and subscriber on the same topic name must connect — type and QoS
  mismatches fail silently (seeded here, tested hard in l7-ros2-interfaces).
- Distro drift: following a Humble/Foxy-era tutorial verbatim on Jazzy, or installing
  whatever distro a random video names (see distro verdict below).

## Distro verdict (2026-08-21, §14 question: is Jazzy still right? — YES)

Primary-source data, fetched this session from ros2/ros2_documentation (the repo that
builds docs.ros.org; rolling commit a74c8f1, 2026-08-21; jazzy branch 0ce9570):
- Lyrical Luth (12th release, LTS): released May 22, 2026 → EOL May 2031. Tier 1 platforms
  = Ubuntu 26.04 (Resolute) amd64/arm64 + Windows 11. **Ubuntu 24.04 (Noble) is Tier 3 =
  source-build only** (lyrical/supported-platforms.rst). C++20, Python 3.12–3.14.
- Kilted Kaiju (non-LTS): released May 23, 2025 → **EOL December 2026 — four months away.
  Do not install in Aug 2026 under any reasoning.**
- Jazzy Jalisco (LTS): released May 23, 2024 → **EOL May 2029**. Tier 1 = Ubuntu 24.04
  amd64/arm64 (Release-Jazzy-Jalisco.rst).
Decision logic: Lyrical is the future but binary-installs only on Ubuntu 26.04, and the
CUDA/Isaac Sim ecosystem supports Ubuntu 22.04/24.04 only (research-phase ✅ 2026-08-21,
Isaac Sim README; not re-fetched this session) — a 26.04 machine cuts the learner off from
the GPU/sim stack this curriculum needs at L9+. Jazzy: Tier-1 on 24.04, mature third-party
ecosystem (Nav2/MoveIt/ros_gz/gz_ros2_control all released for it — research-phase ✅
rosdistro), 33 months of runway. **Install Jazzy on Ubuntu 24.04; skills transfer to
Lyrical near-verbatim; revisit distro choice ~mid-2027.** The repo's existing choice is
re-confirmed, now with live EOL dates.

Candidate videos:
1. Articulated Robotics — "Getting Started with ROS" series (Josh Newans) — episode
   durations [unverified this session] — https://articulatedrobotics.xyz/tutorials/
   [egress-blocked this session; site + author verified research-phase ✅ 2026-08-21, and
   companion repo verified this session by clone: https://github.com/joshnewans/articubot_one]
   (score notes: correctness 4, beginner fit 5, clarity 5, production 5, community success
   signal 5 — the de-facto community-recommended ROS 2 on-ramp; datedness risk 3: episodes
   recorded on earlier distros, commands transfer to Jazzy with minor edits)
2. The Construct — ROS 2 basics course videos — [unverified this session; subscription]
   (score notes: beginner fit 4 via browser sandbox, but the sandbox hides install/sourcing
   reality this learner must own; time efficiency 2; cost >0 — backup only if local install
   friction dominates, matching research-phase note)
3. Robotics Back-End (Edouard Renard) — ROS 2 tutorial videos — [unverified this session]
   (score notes: clarity 4, task-sized; correctness 4; unverifiable live today so not
   selectable as packet core)
No video is load-bearing in this packet: the official lessons are already stepwise labs,
and YouTube was egress-blocked this session, so no video URL/duration could be verified.

Candidate written resources:
1. Official ROS 2 Jazzy tutorials, Beginner: CLI tools — 10 lessons with official
   per-lesson times, verified this session from the jazzy branch of ros2/ros2_documentation:
   Configuring environment (5 min) · Introducing turtlesim + rqt (15) · Nodes (10) ·
   Topics (20) · Services (10) · Parameters (5) · Actions (15) · rqt_console (5) ·
   Launching multiple nodes (5) · Recording/playing bag data (15) = **105 official minutes**.
   Index: https://docs.ros.org/en/jazzy/Tutorials/Beginner-CLI-Tools.html [URL derived from
   the repo that builds docs.ros.org, fetched this session; docs.ros.org itself
   egress-blocked today]
2. Concepts → Basic pages (short, diagrammed): About-Nodes, About-Topics, About-Services,
   About-Parameters, About-Actions, Interfaces-Topics-Services-Actions — file list verified
   this session (source/Concepts/Basic/ on jazzy branch);
   https://docs.ros.org/en/jazzy/Concepts/Basic.html [derived, same provenance]
3. ros2/teleop_twist_keyboard — a real, maintained, single-file rclpy package
   (teleop_twist_keyboard.py, 234 lines; declares `stamped`, `frame_id`, `speed`, `turn`
   parameters; moveBindings/speedBindings dicts) — verified this session by clone:
   https://github.com/ros2/teleop_twist_keyboard
4. Release/EOL reference: https://docs.ros.org/en/jazzy/Releases/Release-Kilted-Kaiju.html
   [appeared in this session's WebSearch results] + Releases.rst table [verified via repo].

Community evidence:
- In-repo research phase (same-day, live-verified): official docs judged "canonical,
  current, dry but exact — the spine", and explicitly paired with a build-along companion
  because docs alone are reference-like; The Construct kept only as friction backup
  (docs/research/reports/ros-simulators.md §2). This is the recorded community-pedagogy
  signal behind the §14 packet design (concept tutorial → tiny task → real package → modification).
- 2026 distro confusion is real enough to spawn explainers: "ROS 2 Distributions 2026:
  Lyrical Luth, Kilted, Jazzy…" (https://robocloud-dashboard.vercel.app/learn/blog/ros2-distributions-2026)
  and a Lyrical release post (https://myzhar.tech/posts/ros2-lyrical-luth-released/)
  [URLs from this session's WebSearch results; pages not fetchable — egress-blocked].
- Direct Reddit/Stack Exchange/Discourse re-verification: none found this session —
  WebSearch budget exhausted + those domains egress-blocked; fallback: the research-phase
  evidence above stands (it was gathered live today).

Primary technical authority:
- ROS 2 Jazzy official documentation — https://docs.ros.org/en/jazzy/ — built from
  https://github.com/ros2/ros2_documentation (jazzy branch fetched this session; structure,
  lesson list, and official times read from source). Release/EOL and platform-tier tables
  read from the same repo's rolling branch, updated 2026-08-21.

Selected shortest-sufficient packet:
- DIAGNOSTIC: Cold, before any reading (10 min): "A robot has a camera process and a motor
  process. Sketch how they should communicate. Define topic vs service vs action — one
  guess + one example each. What do you think `source install/setup.bash` does?" Keep the
  written answers for after-comparison.
- ORIENT: Concepts/Basic: Interfaces-Topics-Services-Actions + About-Nodes + About-Topics
  (3 short diagrammed pages, ~10 min).
- CORE WATCH: — (no verified video earns a slot; optional: one Articulated Robotics
  getting-started episode if the learner wants a narrated pass first [unverified]).
- CORE READ: Official Beginner CLI lessons 1–10 in order, done-not-read, every command
  typed (105 official min ≈ 3–3.5 h real at beginner pace including sandbox play):
  environment → turtlesim/rqt → nodes → topics → services → params → actions →
  rqt_console → launching multiple nodes → bag record/play.
- INTERACTIVE: — (no ROS widget exists; nothing forced).
- PRACTICE: (a) the node's own exercise: with turtlesim running, map EVERYTHING using
  introspection only — no docs open: `ros2 node list/info`, `topic list -t/info/echo/hz`,
  `service list -t`, `param list`, `action list` → draw the graph, annotate types + rates;
  (b) `ros2 topic pub` a geometry_msgs/msg/Twist by hand to /turtle1/cmd_vel, echo
  /turtle1/pose while it moves, confirm in rqt_graph (~45 min total).
- IMPLEMENT/DERIVE: Inspect a real package, then modify it (§14 loop, ~75 min): clone
  https://github.com/ros2/teleop_twist_keyboard (verified this session), read all 234
  lines of teleop_twist_keyboard.py aloud-annotating (bindings dicts, param declarations,
  the publish loop), run it against turtlesim; then ONE modification — add a `speed_step`
  parameter that scales the speedBindings increments (or add a new key that triggers a
  fixed spin), prove it with `ros2 param list` + `ros2 topic echo`.
- STUCK PATH: run talker/listener from demo_nodes_py (https://github.com/ros2/demos, jazzy
  branch, verified this session — talker.py is 54 lines) and redo the Topics lesson
  against them; if the mental model still won't form, one Articulated Robotics episode
  [unverified this session] as alternate narration.
- DEEPEN: Concepts/Intermediate About-Quality-of-Service page + design.ros2.org — only
  when a QoS or discovery mystery actually appears.
- PROVE IT: The node's mastery test, unseen: tutor (Claude) launches an unfamiliar mix
  (e.g., turtlesim + demo_nodes_py talker_qos + a parameterized node) — map the full
  computation graph (nodes/topics/types/rates) in 15 min, CLI only, and diagram it.
- TRANSFER: Open the turtlesim C++ source (https://github.com/ros/ros_tutorials, jazzy
  branch, verified this session) and locate where /turtle1/cmd_vel is subscribed and pose
  published — demonstrate the graph model reads identically across languages (seeds
  l7-cpp-literacy).
- RETENTION: Day +7, cold: (1) explain underlay/overlay sourcing in ≤3 sentences; (2) the
  three-command flow-check for "is this message flowing and who publishes it" (the node's
  diagnostic); (3) re-draw the turtlesim graph from memory, then verify live in 5 min.

Total packet: ≈ 5.5–6.5 h against the node's 8 h (rest = install friction reserve).

Why this won: The official Jazzy lessons are the only canonical, version-exact source, are
already structured as stepwise labs with per-lesson times (verified from source today), and
cost nothing in currency risk; their known weakness — reference-likeness — is repaired by
the packet loop (orient-concepts first, introspection-only practice, then a REAL 234-line
package inspected and modified) rather than by swapping in a longer third-party course.
teleop_twist_keyboard is the ecosystem's smallest real package: every line is honest ROS,
small enough for a beginner to fully own in one sitting.

What was rejected (and why): Kilted (EOL Dec 2026 — indefensible); Lyrical as install
target (no Ubuntu 24.04 binaries — Tier 3 source-build; CUDA/Isaac ecosystem not on 26.04);
The Construct as primary (subscription + sandbox hides sourcing/install reality; slower per
minute); any video-first path as core (YouTube egress-blocked this session — nothing could
be duration/URL-verified, and the docs labs already provide the doing); "ROS 2 in one
video" crash courses (recognition-not-mastery risk for exactly this learner).

Risk of superficial understanding: Completing all 10 lessons by copy-paste while the graph
model never forms — mitigated because PRACTICE forbids docs, PROVE IT is an unseen system,
and the modification task fails loudly if sourcing/build-state isn't actually understood.
Second risk: concluding pub/sub "always just works" — the QoS silent-failure lesson is
deliberately scheduled into l7-ros2-interfaces.

Required active work: Every CLI lesson typed and run; introspection-only mapping exercise;
hand-published Twist; teleop_twist_keyboard read line-by-line and modified, with the change
committed to the learner's monorepo plus a 5-line README note; PROVE IT under time.

Last verified: 2026-08-21
