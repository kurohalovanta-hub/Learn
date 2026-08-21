# l6-bayes-filter — The Bayes Filter

Concept: Belief as a probability distribution over state; the recursive predict (total probability through the motion model — spreads belief) / update (pointwise Bayes product with the measurement likelihood — sharpens belief) cycle; motion and measurement models as the two things you must specify. Implemented discretely on a 1D corridor robot.
Learner prerequisites: l2-random-variables at Gold (Bayes' rule, conditioning, normalization must be fluent). No Gaussians needed yet — that is l6-kalman's job.
What beginners commonly misunderstand: (1) Which step does what: learners routinely think measurement adds uncertainty and motion reduces it — it is exactly the reverse (predict convolves/spreads, update multiplies/sharpens). (2) Where Bayes' rule actually enters (only in the update; predict is total probability). (3) Forgetting normalization η and wondering why the belief stops being a distribution. (4) Believing the filter tracks a state, when it tracks a DISTRIBUTION over states — multimodality in the corridor (identical doors) is the moment this lands or doesn't. (5) Assuming a confident belief is a correct belief — a wrong sensor model produces confident wrongness.

Candidate videos:
1. — none selected. No short standalone Bayes-filter video could be live-verified this session (the session's shared search budget was exhausted before this cluster's estimation sweeps; Stachniss's site and YouTube are egress-blocked from this environment). This is acceptable rather than a gap: the curriculum decision (docs/research/reports/robotics-theory.md §5) makes this node implementation-first through Labbe's executable notebooks, and Labbe Ch 1 is itself the narrative on-ramp a video would provide.
Fallback for a video-shaped need: Cyrill Stachniss estimation lectures via the repo's verified resource record (https://www.ipb.uni-bonn.de/teaching/ — repo lastVerified 2026-08-21; not re-fetched this session).

Candidate written resources:
1. Kalman and Bayesian Filters in Python, Ch 1 (01-g-h-filter.ipynb) — Roger Labbe — https://github.com/rlabbe/Kalman-and-Bayesian-Filters-in-Python/blob/master/01-g-h-filter.ipynb [filename verified from repo listing this session] (the g-h filter: prediction-vs-measurement blending with scalars before any probability formalism — the gentlest possible on-ramp to "trust two sources partially". Prereq fit 5, intuition 5.)
2. Same book, Ch 2 (02-Discrete-Bayes.ipynb) — https://github.com/rlabbe/Kalman-and-Bayesian-Filters-in-Python/blob/master/02-Discrete-Bayes.ipynb [filename verified] (THE core: discrete Bayes filter built cell-by-cell on a 1D hallway — directly the node's corridor implementation. Executable: README urges "use it as intended" — run and modify, not read.)
3. Readable non-GitHub rendering: nbviewer table of contents — http://nbviewer.ipython.org/github/rlabbe/Kalman-and-Bayesian-Filters-in-Python/blob/master/table_of_contents.ipynb [link extracted from the repo README this session]; interactive without install: https://beta.mybinder.org/v2/gh/rlabbe/Kalman-and-Bayesian-Filters-in-Python/master [same].
4. Thrun, Burgard, Fox — *Probabilistic Robotics* (2005), Bayes-filter derivation chapter — canonical mathematical treatment (repo reference resource; print/PDF, no URL claimed).

Community evidence:
- 19.2k GitHub stars on Labbe's book (read directly off the repo this session) — among the most-endorsed self-study estimation resources in existence (https://github.com/rlabbe/Kalman-and-Bayesian-Filters-in-Python)
- Labbe's own README states the target audience and method — "the hobbyist, the curious, and the working engineer", interactive, exercises WITH answers included — matching this learner's profile exactly (same URL)
- Repo research phase (docs/research/reports/robotics-theory.md §5) independently confirmed it as PRIMARY with "write every filter from scratch; FilterPy only as test oracle"

Primary technical authority:
- Thrun et al., *Probabilistic Robotics* for the derivation of record; Labbe Ch 2 for the executable form. The learner's own on-paper derivation from Bayes + total probability is the node's real authority test.

Selected shortest-sufficient packet:
- DIAGNOSTIC: Cold, on paper: corridor with doors at cells 3, 7, 12; uniform prior; sensor says "door". Sketch the belief. The robot then moves right one cell with 20% slip — does the belief sharpen or spread, and why? Which of the two steps used Bayes' rule? 8 min.
- ORIENT: — (Labbe Ch 1 is the on-ramp; no video found/needed).
- CORE WATCH: — (implementation-first node by curriculum decision; see candidate-videos note).
- CORE READ: Labbe Ch 1 (01-g-h-filter.ipynb) then Ch 2 (02-Discrete-Bayes.ipynb), RUN AND MODIFIED, not read — change slip probabilities, door layouts, sensor error rates and predict each plot before executing (~90–120 min active).
- INTERACTIVE: gaussian-explorer (in-app) as the belief-object warm-up — μ/σ as "best guess + honest ignorance"; note explicitly that THIS node's belief is a histogram, not a Gaussian — the Gaussian version is next node.
- PRACTICE: In-notebook Ch 2 exercises (answers included — commit before revealing); node exercises: kidnap the robot mid-run and narrate the recovery; corrupt the sensor model and narrate the confident wrongness.
- IMPLEMENT/DERIVE: The node's own 20-cell corridor robot with door sensors, written from a blank file (not Labbe's cells): predict = convolution with the motion kernel, update = elementwise likelihood product + normalize; animate belief sharpening, multimodal ambiguity at identical doors, and the kidnapping.
- STUCK PATH: Stachniss estimation lectures (fallback: repo's verified resource record, https://www.ipb.uni-bonn.de/teaching/ — could not be re-verified this session); plus re-running Labbe Ch 2 with every parameter pushed to an extreme.
- DEEPEN: Thrun, *Probabilistic Robotics*, Bayes-filter chapter — the formal derivation with the Markov assumptions made explicit (only if the on-paper derivation below feels shaky).
- PROVE IT: Node mastery test — derive predict/update from Bayes' rule + total probability on paper, unaided; corridor filter localizes from uniform prior within 10 steps (Gold gate).
- TRANSFER: Same loop, new skin: build the identical predict/update cycle for a 12-state clock-position estimation from noisy "roughly N o'clock" readings with wrap-around motion — no doors, no corridor; the point is recognizing the loop survives the representation change.
- RETENTION: +7 days: write both equations cold and label which one is a convolution, which is a pointwise product, and where η comes from.

Why this won: Labbe Ch 1–2 is the repo's verified primary and nothing found (or plausibly findable) beats an executable notebook whose running example IS the node's implementation. This session added precision rather than replacement: exact notebook filenames and URLs, the nbviewer/binder access paths, the README's own pedagogy statement, and a candidate-video slot honestly closed out (none verifiable; none needed for an implementation-first node with a 4 h budget).
What was rejected (and why): Any lecture-first path (Stachniss demoted to stuck-path — a 45–90 min lecture would consume half the node's 4 h for material the notebook teaches actively in less). Probabilistic Robotics as CORE READ (derivation-first order is wrong for this learner; it stays as DEEPEN/authority). Kalman-filter explainer videos as orientation (they skip the discrete belief machinery — the whole point of this node — and would tempt the learner to jump ahead).
Risk of superficial understanding: Running Labbe's cells and mistaking execution for construction — mitigated by requiring the blank-file corridor build and the on-paper derivation. Highest-value confusion to force early: the predict-spreads/update-sharpens direction question in the diagnostic, because it silently inverts in many learners' heads.
Required active work: Modified-parameter runs of Ch 1–2; blank-file 20-cell corridor filter with animation; kidnapping + broken-sensor narrations; on-paper predict/update derivation; clock-position transfer build.
Last verified: 2026-08-21
