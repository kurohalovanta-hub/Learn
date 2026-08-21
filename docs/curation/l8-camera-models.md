# l8-camera-models — Image Formation & Camera Geometry

Concept: How a 3D world point becomes a pixel: pinhole projection, the intrinsic matrix K
(fx, fy in pixels; principal point cx, cy), extrinsics [R|t] (world→camera), the full chain
s·[u v 1]ᵀ = K [R|t] [X Y Z 1]ᵀ, why homogeneous coordinates make projection linear, what
projection irreversibly destroys (depth — a pixel is a ray), and lens distortion at working
level. Geometry-first, deliberately BEFORE any detector/segmenter (no YOLO/SAM until camera
fundamentals are owned — per curriculum audit).

Learner prerequisites: l5-frames-rotations (gold) — R, t, frame composition;
l2-linear-maps — matrices as maps, and the homogeneous-coordinates idea. NumPy fluency
(l1-numpy) for the implementation.

What beginners commonly misunderstand:
- fx "focal length in pixels": conflating lens focal length in mm with fx = f/pixel-pitch;
  why fx ≠ fy is even possible (non-square pixels/binning), and fx as "zoom" (the node's
  halve-fx exercise exists for exactly this).
- Why homogeneous coordinates: not a trick — they make an affine+projective operation one
  matrix multiply, and the final divide-by-s IS the perspective; forgetting the divide is
  the #1 first-implementation bug.
- Extrinsics direction: [R|t] maps world→camera (camera center C = −Rᵀt), and confusing it
  with camera-pose-in-world silently mirrors/flips everything.
- Principal point ≠ exact image center; y-axis pointing down in pixel coordinates.
- Believing one image contains depth ("can't we just invert?") — projection destroys it;
  this is the conceptual gate to l8-depth-pointclouds.
- Distortion is applied in normalized camera coordinates, not raw pixels; "undistort then
  use K" vs "distortion inside the projection loop" confusion.
- Vertical field of view → K: MuJoCo cameras are specified by `fovy` in degrees (default
  45, vertical) — fy = (H/2)/tan(fovy/2), fx = fy for square pixels, cx = W/2, cy = H/2
  [fovy semantics verified this session from the MuJoCo repo docs: XMLreference.rst
  body/camera fovy + modeling.rst "vertical field of view, in degrees"].

Candidate videos:
1. First Principles of Computer Vision (Shree Nayar, Columbia) — "Image Formation" module
  (pinhole + perspective projection + lens image formation lectures) and "Camera
  Calibration" module's linear-camera-model lectures (intrinsic/extrinsic derivation) —
  individual lectures ~5–20 min [approx]; https://fpcv.cs.columbia.edu/ + the FPCV YouTube
  channel [site + channel existence verified research-phase ✅ 2026-08-21
  (docs/research/reports/robotics-theory.md §6: "clearest short treatment in existence,
  ~6 h at 1.5× for all selected modules"); fpcv.cs.columbia.edu and youtube.com
  egress-blocked this session, so per-playlist mapping and durations could NOT be
  re-verified live — marked [unverified this session]] (score notes: correctness 5,
  beginner fit 5 — grade-10-math friendly, derives everything; conceptual intuition 5;
  rigor 4; time efficiency 4 in selected-module form; production 4; datedness risk 1 —
  geometry doesn't age)
2. Cyrill Stachniss — "Camera Parameters (Extrinsics & Intrinsics)" Photogrammetry lecture,
  ~45–60 min [approx, unverified this session; ipb.uni-bonn.de egress-blocked; teaching
  page verified research-phase ✅ as the stachniss-slam resource] (score notes: rigor 5,
  notation heavier — Euclidean-to-sensor pipeline with calibration-matrix factorization;
  better as DEEPEN/alternate than first exposure for this learner)
3. — (no further candidate could be verified this session; YouTube search impossible —
  egress-blocked + WebSearch budget exhausted)

Candidate written resources:
1. Szeliski, *Computer Vision: Algorithms and Applications* 2e — §2.1 Geometric image
  formation (perspective projection, K anatomy, [R|t]) — free PDF at
  https://szeliski.org/Book [site verified research-phase ✅ 2026-08-21; egress-blocked
  this session; section number from prior knowledge, mark §2.1 [unverified this session]]
  (score notes: authority 5, beginner fit 3 — dense but honest; the accessible authority)
2. Kyle Simek — "Dissecting the Camera Matrix" 3-part blog (decomposing K, R, t with
  interactive intuition) — ksimek.github.io [unverified this session — none found in a
  verifiable form; fallback: FPCV + Szeliski cover the same ground]
3. Tedrake, *Robotic Manipulation* Ch 4 (cameras/depth in the manipulation context) —
  https://manipulation.csail.mit.edu/ [existing repo resource tedrake-manipulation,
  research-phase ✅; primary home is l8-pose-estimation — here only a forward pointer]
4. In-app lesson path: this node's own derivation sequence per LEARNING-SYSTEM.md (the
  lesson, when authored, is the true CORE READ — this packet is its resource skeleton).

Community evidence:
- none found this session for learner-forum signals (Reddit/SE egress-blocked, WebSearch
  budget exhausted) — fallback: research-phase judgment recorded in
  docs/research/reports/robotics-theory.md §6 ("clearest short treatment in existence"),
  gathered live 2026-08-21 with site/channel checks [S].
- Indirect misconception evidence used instead: the OpenCV calibration tutorial (source
  verified this session) devotes its opening to exactly the fx-units and
  distortion-in-normalized-coords confusions, and the node's own diagnostic questions
  encode the homogeneous-coordinates and information-loss traps
  (https://github.com/opencv/opencv — doc/py_tutorials/py_calib3d).

Primary technical authority:
- Szeliski 2e (free PDF, szeliski.org/Book) as the working authority; Hartley & Zisserman,
  *Multiple View Geometry*, Ch 6 "Camera Models" as the formal deep reference (book —
  cite by chapter, no URL claimed). MuJoCo camera semantics: google-deepmind/mujoco docs,
  verified this session from the repo clone.

Selected shortest-sufficient packet:
- DIAGNOSTIC: Cold (10 min, pencil): "A camera at the world origin looks down +Z. Image is
  640×480, f = 500 px, principal point at center. Where does world point (0.1, 0, 1.0) m
  land in pixels? What happens to that pixel if the point moves to (0.2, 0, 2.0)?" (Second
  answer — same pixel — IS the depth-loss insight; keep answers for after.)
- ORIENT: FPCV "Image Formation" module opening lecture (pinhole camera, ~10 min [approx,
  unverified this session]); if unavailable: read the pinhole opening of Szeliski §2.1.
- CORE WATCH: FPCV selected lectures, ~60–75 min at 1.25×: pinhole + perspective
  projection + lens formation (Image Formation module) → linear camera model /
  intrinsics-extrinsics lectures (Camera Calibration module). Exact video list to be
  pinned from https://fpcv.cs.columbia.edu/ module pages at study time [module mapping
  unverified this session — site egress-blocked; module names per research-phase record].
- CORE READ: Szeliski 2e §2.1 geometric image formation, projection + camera-matrix
  subsections only (~40 min) — read WITH the derivation: reproduce s[u v 1]ᵀ = K[R|t]X on
  paper as you go.
- INTERACTIVE: matrix-transform (5-min refresher: K as a linear map on rays) +
  so3-explorer (5-min: the R inside [R|t]) — refreshers only; no camera-projection widget
  exists yet (candidate future widget for this node).
- PRACTICE: The node's exercises: (1) halve fx — predict the image change in writing, then
  verify in code; explain "focal length as zoom" in 2 sentences; (2) derive K from a
  MuJoCo camera's fovy + resolution (fy = (H/2)/tan(fovy/2); fovy verified vertical,
  degrees, default 45), then verify by projecting a known site position onto the rendered
  image (~40 min).
- IMPLEMENT/DERIVE: project.py (the node's artifact, ~90–120 min): pure-NumPy projection
  of 3D points through a K you define; render a wireframe cube from a virtual camera
  orbiting the scene (compose [R|t] per frame from your L5 code); no OpenCV anywhere.
- STUCK PATH: Stachniss "Camera Parameters" lecture [approx 45–60 min, unverified this
  session] for a second, more formal derivation; or Simek's "Dissecting the Camera
  Matrix" if reachable at study time [unverified this session].
- DEEPEN: Hartley & Zisserman Ch 6 (camera models, camera center, axis skew) — only if
  heading toward multi-view geometry later; Szeliski §2.1 lens/distortion subsection for
  the distortion-model formalism.
- PROVE IT: The node's mastery test, unseen scene: from a rendered MuJoCo image with known
  camera pose, predict the pixel location of a named scene object to <2 px using ONLY your
  own projection code — full 3D→2D chain, no library calls.
- TRANSFER: (1) The image is resized 640×480 → 320×240 and center-cropped to 280×200:
  write the new K and defend each entry. (2) A phone lists f = 26 mm equivalent and a
  4032-px-wide sensor: estimate fx in pixels and state every assumption (bridges to
  l8-calibration-opencv, where the estimate gets checked against a real calibration).
- RETENTION: Day +7, cold: write the full projection equation with K expanded, annotate
  units of every symbol, and answer "what information does projection destroy and why can
  no algorithm recover it from one pixel?" (3 sentences, no notes).

Total packet: ≈ 5–6 h against the node's 6 h.

Why this won: FPCV stays primary — it is the repo's verified selection and the
research-phase record (same-day) calls it the clearest short treatment in existence;
nothing verifiable this session challenges that, and its lecture granularity fits the
shortest-sufficient rule. The packet adds what FPCV alone lacks for this learner: a paper
derivation (Szeliski §2.1 read-with-pencil), a from-scratch NumPy artifact, and MuJoCo
fovy→K grounding (verified this session from the MuJoCo repo) that makes K operational in
the exact simulator the curriculum uses. Geometry-first ordering is enforced: no detector
tools appear anywhere in this packet.

What was rejected (and why): Hartley & Zisserman as core (rigor far beyond need at this
gate; DEEPEN only); Stachniss as core (excellent but heavier notation and longer path for
a first exposure; kept as stuck-path); LearnOpenCV/blog-first paths (unverifiable this
session and secondary to authority); any YOLO/SAM/"computer vision in 20 min" content
(explicitly out of order — camera fundamentals first); OpenCV-based implementation of
project.py (defeats the purpose — the library arrives next node, after the math is owned).

Risk of superficial understanding: Watching FPCV and nodding — recognition, not the 3D→2D
chain owned. Mitigated: the implement artifact is library-free, PROVE IT is a numeric <2px
prediction on an unseen scene, and the diagnostic/retention questions force the
depth-loss and units explanations in the learner's own words. Watch for the tell: someone
who "knows" K but cannot say what fx's units are has memorized a symbol, not a model.

Required active work: Both practice exercises with written predictions BEFORE running
code; project.py wireframe cube from scratch; fovy→K derivation verified against a real
render; PROVE IT and RETENTION performed cold.

Last verified: 2026-08-21
