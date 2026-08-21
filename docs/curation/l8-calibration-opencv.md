# l8-calibration-opencv — Calibration & OpenCV Fundamentals

Concept: Recovering a real camera's K + distortion coefficients from checkerboard/ChArUco
images (findChessboardCorners → calibrateCamera → undistort), judging the result by
reprojection error AND view coverage, then using the calibrated camera for pose:
ArUco detection and solvePnP (2D–3D correspondences → 6-DoF pose). The 20% of OpenCV that
does 90% of robotics perception plumbing — learned as tooling on top of the l8-camera-models
math, never instead of it.

Learner prerequisites: l8-camera-models (owns K, [R|t], projection, distortion concept);
l1-numpy (gold). A webcam OR MuJoCo-rendered checkerboard sequence (both paths supported;
no hardware prerequisite). Install verified live: opencv-python 5.0.0.93 on PyPI
(uploaded 2026-07-02) [verified this session via pypi.org JSON API; opencv-contrib not
needed — ArUco lives in the main objdetect module now, verified from the source tree].

What beginners commonly misunderstand:
- Reprojection error: it is the mean pixel distance between detected corners and corners
  re-projected through the fitted model — a RESIDUAL on the calibration data, not proof of
  a good camera model. Low error with poor view coverage (no corners near image edges, no
  board tilt diversity) yields garbage distortion coefficients that extrapolate badly.
- Units enter through the board: the checker square size you pass in object points sets
  the scale of tvecs; forget it and all poses are in "squares", not meters.
- Which K to use afterwards: raw `mtx` vs `getOptimalNewCameraMatrix` output (alpha 0 vs 1
  crop trade), and mixing them up when later unprojecting.
- solvePnP needs ≥4 correspondences: 3 points leave the P3P ambiguity (up to 4 solutions);
  4+ non-collinear (planar boards fine) disambiguate — the node's diagnostic.
- rvec is a Rodrigues axis-angle vector, NOT Euler angles (so3-explorer intuition applies
  directly); tvec is board-in-camera, and inverting to camera-in-board trips the same
  extrinsics-direction confusion as l8-camera-models.
- Distortion coefficient order (k1, k2, p1, p2[, k3]) and that they live in normalized
  coordinates; also that detection failures are usually lighting/print-flatness/asymmetric
  -pattern issues, not code.

Candidate videos:
1. First Principles of Computer Vision — "Camera Calibration" module procedure lectures
   (how correspondences → projection-matrix least squares → K,R,t extraction), ~20–30 min
   [approx; site/channel verified research-phase ✅ 2026-08-21; playlist mapping
   unverified this session — fpcv.cs.columbia.edu and youtube.com egress-blocked]
   (score notes: gives the WHY under cv.calibrateCamera — the theory bridge from
   l8-camera-models; intuition 5, rigor 4)
2. — none further verifiable this session (YouTube egress-blocked + WebSearch budget
   exhausted). This node is tool-practical; written tutorials + doing carry it fine.

Candidate written resources:
1. OpenCV official Python tutorial "Camera Calibration" (page id tutorial_py_calibration)
   — full pipeline: findChessboardCorners, cornerSubPix, calibrateCamera,
   getOptimalNewCameraMatrix, undistort (two methods), closing Re-projection Error
   section — source verified this session (opencv 4.x branch, updated 2026-08-21; 5.x
   branch identical structure):
   https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_calib3d/py_calibration/py_calibration.markdown
   (rendered on docs.opencv.org under that page id; docs.opencv.org egress-blocked this
   session so the rendered URL's hash path is not re-verified — the repo resource record
   `opencv` → https://docs.opencv.org/ [research-phase ✅ same-day] is the rendered home)
2. OpenCV official Python tutorial "Pose Estimation" (tutorial_py_pose) — loads your
   calibration, solvePnP/solvePnPRansac + projectPoints, draws axes and renders a cube
   that sticks to the board (literally the node's mastery-test overlay) — source verified
   this session:
   https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_calib3d/py_pose/py_pose.markdown
3. OpenCV objdetect tutorial "Detection of ArUco Markers" (tutorial_aruco_detection) —
   dictionaries, detectMarkers, drawDetectedMarkers, marker pose — source verified this
   session:
   https://github.com/opencv/opencv/blob/4.x/doc/tutorials/objdetect/aruco_detection/aruco_detection.markdown
4. Stuck-path/upgrade pair, source verified this session: "Detection of ChArUco Boards"
   (tutorial_charuco_detection) and "Calibration with ArUco and ChArUco"
   (tutorial_aruco_calibration) — more robust than plain checkerboards under occlusion:
   https://github.com/opencv/opencv/tree/4.x/doc/tutorials/objdetect

Community evidence:
- OpenCV's own "Aruco module FAQ" (tutorial_aruco_faq, source verified this session) is a
  maintained distillation of recurring user confusion — "My markers are not being detected
  correctly, what can I do?", ChArUco vs ArUco board trade-offs — direct evidence of the
  common walls this packet pre-empts
  (https://github.com/opencv/opencv/blob/4.x/doc/tutorials/objdetect/aruco_faq/aruco_faq.markdown).
- The official calibration tutorial closing with a dedicated Re-projection Error section
  is the maintainers' answer to the most-asked calibration question ("is my calibration
  good?") — the packet upgrades it with the coverage experiment because low residual ≠
  good model (same source as candidate 1).
- Learner-forum re-verification (Reddit/SE/calib.io blog): none found this session —
  domains egress-blocked + WebSearch budget exhausted; fallback: research-phase selection
  rationale in docs/research/reports/robotics-theory.md §6 (OpenCV 5.0 status ✅P/✅S,
  "do calibration + solvePnP/ArUco tutorials, ~4 h").

Primary technical authority:
- OpenCV official documentation (docs.opencv.org), whose tutorial sources were read this
  session from https://github.com/opencv/opencv (4.x updated 2026-08-21; 5.x checked —
  same calib3d/objdetect tutorial set, so guidance is stable across the 4→5 transition).
- Theory anchor (DEEPEN): Z. Zhang, "A Flexible New Technique for Camera Calibration,"
  IEEE TPAMI 22(11), 2000 — the algorithm inside calibrateCamera (cite by name; no URL
  claimed this session).

Selected shortest-sufficient packet:
- DIAGNOSTIC: Cold (5 min): "Your calibration reports 0.3 px reprojection error — what
  exactly was measured? Can it be 0.3 px and still be a bad calibration — how? Minimum
  correspondences for PnP and why?" Keep answers.
- ORIENT: FPCV calibration-procedure lecture(s), ~20 min [approx; unverified this session]
  — the why under the API; skippable if l8-camera-models is fresh and gold.
- CORE WATCH: — (no verified video required).
- CORE READ: The three official tutorials, done as labs in order (~2–2.5 h total doing,
  not reading): (1) Camera Calibration — run against your own image set (MuJoCo-rendered
  checkerboard sequence or ≥15 webcam shots with edge coverage + tilts); (2) Pose
  Estimation — axes + cube overlay from your own K; (3) ArUco detection — dictionary,
  detectMarkers, single-marker pose.
- INTERACTIVE: so3-explorer (5 min) — read your solvePnP rvec as axis-angle and predict
  the rotation before rendering it.
- PRACTICE: (a) node exercise: compare your derived MuJoCo K (fovy math from
  l8-camera-models) against the calibrated estimate; explain the residual in writing
  (~20 min); (b) coverage experiment: calibrate twice — once with center-only board
  views, once with edge+tilt coverage; compare distortion coefficients and undistorted
  edges; write the 3-sentence moral (~25 min).
- IMPLEMENT/DERIVE: The node's artifact (~90 min): full pipeline script — calibrate,
  undistort, then LIVE ArUco 6-DoF pose with drawn axes (webcam) or frame-loop over a
  rendered MuJoCo sequence; save K/dist to YAML and reload them (the ritual every
  real-robot session begins with).
- STUCK PATH: ChArUco detection + ArUco/ChArUco calibration tutorials (verified, above)
  when checkerboard detection is flaky; the Aruco FAQ for detection failures; if the
  linear-algebra of calibration itself is the block, FPCV calibration module [approx].
- DEEPEN: Zhang (2000) skim — what the homographies constrain and why ≥3 views; OpenCV
  calib3d module reference for flag meanings (CALIB_FIX_ASPECT_RATIO etc.). Only if
  needed.
- PROVE IT: The node's mastery test on FRESH data collected that day: calibrate to
  <0.5 px reprojection WITH demonstrated coverage, then track a fiducial's pose live and
  overlay a virtual object that visibly sticks to it through motion.
- TRANSFER: Calibrate a genuinely different camera — phone photos of a printed board
  (print-scale pitfall included) — and explain why its K and distortion differ from the
  webcam/MuJoCo camera; state what the JPEG pipeline may have already done to the pixels.
- RETENTION: Day +10: recalibrate from scratch, no notes, <20 min wall-clock including
  capture; then answer cold: "why can a low reprojection error still lie, and what view
  set defeats the lie?"

Total packet: ≈ 4.5–5.5 h against the node's 5 h.

Why this won: The official OpenCV tutorials are the exact, current, canonical labs for
precisely the three skills the node names — and their sources were verified TODAY in the
opencv repo (4.x updated this morning; 5.x structurally identical, so the packet survives
the 4→5 transition the ecosystem is mid-way through — opencv-python 5.0.0.93 verified on
PyPI). The tutorial trio composes into the node's own implementation and mastery test with
zero filler; theory stays anchored to l8-camera-models (FPCV + the derived-K comparison)
so the tools never float free of the math. Geometry-first is preserved: no detector or
learned model appears anywhere before this gate is passed.

What was rejected (and why): opencv-contrib-based ArUco guides (obsolete — ArUco is in
main objdetect now, verified from source; contrib install adds friction for nothing);
LearnOpenCV / calib.io articles as core (unverifiable this session; official labs
suffice — reconsider as stuck-path if reachable at study time); MATLAB/ROS
camera_calibration GUI routes (wrong toolchain for this curriculum's Python path);
Kalibr (research-grade multi-sensor overkill here); any YOLO/SAM detour (out of order by
design).

Risk of superficial understanding: The tutorials run green while understanding stays at
"I called calibrateCamera" — the classic tool-user trap. Mitigated by: the coverage
experiment (breaks the reprojection-error-worship), the derived-vs-calibrated K
comparison (ties the number back to owned math), PROVE IT on fresh same-day data with a
coverage requirement, and the diagnostic/retention questions demanding mechanism, not
API recall. A learner who cannot say what solvePnP minimally needs has pattern-matched
the lab, not learned pose estimation.

Required active work: All three tutorials executed on the learner's OWN images (not just
the sample set); both practice experiments with written conclusions; the YAML-persisted
calibrate→undistort→PnP pipeline script committed; PROVE IT and the timed RETENTION
recalibration done cold.

Last verified: 2026-08-21
