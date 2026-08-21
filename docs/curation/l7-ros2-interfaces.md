# l7-ros2-interfaces — rclpy: Writing Nodes

Concept: Authoring the components of a ROS 2 system in Python: publisher/subscriber nodes
with timers, service servers + clients, an action client, parameters with callbacks, and
custom .msg/.srv interfaces — plus the execution model (callbacks run in an executor; a
blocked callback stalls the node) and QoS compatibility as a first-class failure mode.

Learner prerequisites: l7-ros2-core (workspace + CLI fluency, turtlesim mental model).
Python classes/decorators comfort from L1; the L6 Kalman filter implementation (the fusion
toy re-uses it directly).

What beginners commonly misunderstand:
- Where callbacks run: rclpy.spin() hands the node to a single-threaded executor; timer,
  subscription and service callbacks all share it — `time.sleep()` inside a callback
  freezes everything (this is the node's diagnostic, because it is THE beginner bug).
- Timers vs sleep loops: a `while True: publish; sleep` script fights the executor and
  breaks introspection/shutdown; `create_timer` is the idiom.
- Custom interfaces: .msg/.srv definitions must live in an ament_cmake package with
  rosidl generation even when consumed from Python — the classic "why can't my Python
  package hold my .msg file" trap (the official tutorial sequence exists to defuse it).
- Build/run state: editing code but forgetting `colcon build` (or not using
  `--symlink-install`), then debugging the OLD executable; setup.py entry_points typos.
- QoS: publisher and subscriber on the same topic silently never matching (e.g.
  RELIABLE vs BEST_EFFORT, TRANSIENT_LOCAL vs VOLATILE) — no error, no data.
- Over-writing: rebuilding functionality that existing nodes/packages already provide
  instead of composing ("ROS is tooling, not identity").

Candidate videos:
1. Robotics Back-End (Edouard Renard) — rclpy write-your-nodes series — [unverified this
   session: youtube.com + roboticsbackend.com egress-blocked] (score notes: clarity 4,
   task-sized segments map 1:1 onto the official lesson list; community success signal 4;
   cannot be duration/URL-verified today, so stuck-path only)
2. Articulated Robotics — node-writing episodes of the getting-started thread —
   [unverified this session; creator verified via clone of
   https://github.com/joshnewans/articubot_one] (score notes: production 5, but the series
   center of mass is the mobile-robot build (l7-launch-tf-urdf onward), not rclpy drill)
3. — (no third candidate could be verified; official lessons carry the packet)

Candidate written resources:
1. Official Jazzy tutorials, Beginner: Client libraries (times verified this session from
   the jazzy branch of ros2/ros2_documentation): Creating-A-Workspace (20 min) ·
   Creating-Your-First-ROS2-Package (15) · Writing-A-Simple-Py-Publisher-And-Subscriber
   (20) · Writing-A-Simple-Py-Service-And-Client (20) · Custom-ROS2-Interfaces (20) ·
   Using-Parameters-In-A-Class-Python (20) = **115 official minutes** (+
   Single-Package-Define-And-Use-Interface exists for the compact variant). Index:
   https://docs.ros.org/en/jazzy/Tutorials/Beginner-Client-Libraries.html [URL derived
   from the source repo fetched this session; docs.ros.org egress-blocked today]
2. demo_nodes_py — official worked examples, jazzy branch, verified this session by clone:
   topics/talker.py (54 lines), listener.py, talker_qos.py/listener_qos.py (QoS demo
   pair), services/add_two_ints_server.py — https://github.com/ros2/demos
3. ros2/teleop_twist_keyboard (verified this session; 234-line real node with
   `stamped`/`frame_id`/`speed`/`turn` parameters) — the transfer target.
4. Concepts/Basic: About-Interfaces, About-Parameters, Interfaces-Topics-Services-Actions
   (file list verified this session) — https://docs.ros.org/en/jazzy/Concepts/Basic.html
   [derived].

Community evidence:
- In-repo research phase (same-day, live-verified): official client-library track named
  the spine at ~10 h of the 55 h syllabus; docs "dry but exact" hence the §14 loop of
  tutorial → tiny task → inspect real code → modify (docs/research/reports/ros-simulators.md
  §2 + syllabus (b) row 2).
- The official docs themselves ship a QoS-mismatch demo pair (talker_qos/listener_qos in
  demo_nodes_py, verified by clone) — the maintainers considering this worth a dedicated
  demo is direct evidence the silent-non-connection failure is a canonical beginner wall
  (https://github.com/ros2/demos).
- Direct Reddit/Stack Exchange re-verification: none found this session — WebSearch budget
  exhausted + domains egress-blocked; fallback: research-phase evidence above.

Primary technical authority:
- ROS 2 Jazzy official documentation (docs.ros.org/en/jazzy) — client-library tutorials and
  Concepts pages, read this session from https://github.com/ros2/ros2_documentation jazzy
  branch; rclpy API reference under the same docs root.

Selected shortest-sufficient packet:
- DIAGNOSTIC: Cold (15 min): print demo_nodes_py talker.py (54 lines, unseen) and annotate
  every line's role; then answer: "Where does a subscriber callback run? Why do timers beat
  sleep loops?" Keep answers for after-comparison.
- ORIENT: Concepts/Basic About-Interfaces + About-Parameters (~8 min read).
- CORE WATCH: — (nothing verified earns the slot; stuck-path videos below).
- CORE READ: The six official lessons in order, typed not pasted (115 official min ≈
  3–4 h real): workspace → first package → Python pub/sub → Python service/client →
  custom .msg/.srv interfaces → parameters-in-a-class. Plus read-port of the C++ pub/sub
  lesson (read, build, run — no authoring), per the node's objective.
- INTERACTIVE: kalman-1d — 10-min refresher of predict/update immediately before the
  fusion-node implement (the fusion node IS the L6 KF re-hosted).
- PRACTICE: (a) the node's QoS exercise: take the pub/sub pair just written, set publisher
  durability TRANSIENT_LOCAL vs subscriber VOLATILE (and reliability BEST_EFFORT vs
  RELIABLE), observe the silent non-connection, then diagnose with
  `ros2 topic info -v` until the incompatibility is visible and explainable (~25 min;
  talker_qos/listener_qos from demos as reference solution); (b) action client: call
  turtlesim's RotateAbsolute from rclpy, print feedback (~15 min).
- IMPLEMENT/DERIVE: The node's sensor-fusion toy (kept exactly as specced, ~2–2.5 h):
  fake_gps node (noisy 1 Hz position) + fake_imu node (biased 50 Hz velocity) → fusion
  node running YOUR L6 Kalman filter → publishes /pose_estimate; plus a std_srvs Reset
  service that reinitializes the filter; a custom .msg for the estimate+covariance. Clean
  package, `ros2 launch`-able, fully introspectable.
- STUCK PATH: read the corresponding demo_nodes_py file side-by-side with your broken
  version (verified, minimal, canonical); if narration is needed, Robotics Back-End rclpy
  video for that one lesson [unverified this session].
- DEEPEN: Concepts/Intermediate About-Executors + rclpy API docs — only if callback
  concurrency actually bites (multi-threaded executors are explicitly out of scope).
- PROVE IT: The node's mastery test: rebuild the three-node KF-fusion pipeline from an
  empty workspace in ONE session (no peeking at the original), launch-able and
  introspectable; tutor verifies /pose_estimate topic type, rates, and reset behavior.
- TRANSFER: Modify the REAL package: fork teleop_twist_keyboard, add a `turbo` parameter
  (multiplies both speed and turn while held) or switch it to publish TwistStamped via its
  `stamped` parameter path and remap it to drive turtlesim — proving the skills read onto
  code you didn't write (verified file: teleop_twist_keyboard.py params at lines 143–146).
- RETENTION: Day +7, cold, ≤30 min: from an empty package, write a publisher + subscriber
  pair with a custom .srv reset — no notes, no old code open; then explain the QoS
  silent-failure story in 3 sentences.

Total packet: ≈ 6–7 h against the node's 6 h nominal (fusion toy is the dominant cost and
is also the node's defined implementation — no added scope).

Why this won: The official lesson sequence is the only source that walks the exact
interface-package trap (.msg in ament_cmake) on the exact distro, with per-lesson times
verified from source today; demo_nodes_py gives canonical minimal solutions for every
lesson (verified by clone); and the fusion toy converts all of it into one owned artifact
that pays forward (L6 KF → L7 pipeline → the L8 perception nodes publish into it later).
No video could be live-verified this session, and none is needed — this node is hands-on
by nature.

What was rejected (and why): Writing C++ nodes (read-port only — per handover §17 and the
research C++-literacy budget); The Construct (subscription; sandbox obscures build/source
state exactly where this node's bugs live); multi-threaded executors/lifecycle/composition
as content (explicitly research-flagged out of the 55 h scope); YouTube-course-as-core
(unverifiable today; watching-not-doing risk).

Risk of superficial understanding: The tutorials "work" by transcription while the learner
can't create a package cold — mitigated by PROVE IT (empty-workspace rebuild, one session)
and RETENTION (cold rebuild in 30 min). Second risk: fusion node treated as plumbing with
the KF pasted in — mitigated by the kalman-1d refresher + requirement to state, in the
README, what the filter's state/covariance mean on the live topic.

Required active work: All six lessons typed; QoS breakage performed and diagnosed, not
read about; the three-node pipeline built, launched, bagged once; teleop fork modified;
both cold rebuilds (PROVE IT, RETENTION) done under time.

Last verified: 2026-08-21
