# l2-probability — Probability & Bayes

Concept:
Sample spaces, events, probability axioms; conditional probability; Bayes' theorem used
forwards and backwards (base-rate traps); independence; law of total probability. The
node exists because robotics is applied probability: Bayes' rule is the embryo of the
Kalman filter, Monte Carlo localization, and the learning rule itself.

Learner prerequisites:
l2-algebra only (fractions, manipulating equations). No calculus needed — this node is
deliberately discrete. Comfort with counting arguments is built inside the node (18.05
Reading 1b). NumPy basics from the CS track are needed for the simulation exercises.

What beginners commonly misunderstand:
- P(A|B) vs P(B|A) — the transposed-conditional error; the single most common
  quantitative mistake in science (already flagged in the node's misconceptions).
- Base-rate neglect: a "99% accurate" test does NOT mean P(sick|positive) = 0.99.
- Independence confused with mutual exclusivity (they are near-opposites).
- Treating Bayes' theorem as a formula to memorize instead of counting a
  representative population (draw the 1000-person table) — 3b1b's central pedagogical
  point: "rather than memorizing the formula, draw out a diagram of a representative
  sample."
- Thinking conditioning changes the world rather than restricting the sample space.

Candidate videos:
1. Bayes theorem, the geometry of changing beliefs — 3Blue1Brown — ~15 min [approx] —
   https://www.youtube.com/watch?v=HZGCoVF3YvM
   (Chapters confirmed via search: 0:00 intro example, 4:09 generalizing as a formula,
   10:13 making probability intuitive, 13:35 issues with the Steve example. Correctness
   5, prereq fit 5 — zero calculus, pure area/count reasoning; intuition 5; rigor 3;
   time efficiency 5; community success signal very high. Dec 2019; datedness risk ~0.)
2. The medical test paradox, and redesigning Bayes' rule — 3Blue1Brown — 21 min
   (confirmed) — https://www.youtube.com/watch?v=lG4VkPoG3ko
   (Directly the node's disease-test diagnostic; introduces odds/Bayes-factor form,
   which 18.05 Reading 12b also covers. Slightly longer, partially overlaps #1 —
   better as stuck-path/deepen than as second core watch.)
3. 3Blue1Brown's videos on Bayes' theorem (playlist incl. the short proof footnote) —
   3Blue1Brown — durations n/a —
   https://www.youtube.com/playlist?list=PLk4N6AFvLWe3xCHuOs0siWp0q2F43Cslh
   (Playlist verified to exist; useful as the container, not a separate selection.)
4. Why "probability of 0" does not mean "impossible" (Probabilities of probabilities,
   part 2) — 3Blue1Brown — duration [unverified] —
   https://www.youtube.com/watch?v=ZA4JkHKZM50
   (Good but continuous-probability content — belongs to l2-random-variables' deepen
   shelf, not here.)
5. StatQuest conditional probability / Bayes videos — Josh Starmer — durations
   [unverified] — index at https://statquest.org/video_index.html
   (Gentler but slower per insight than 3b1b for this specific topic; kept as
   alternate-voice stuck path via the index; individual URLs not verified this
   session.)

Candidate written resources:
1. MIT 18.05 S22 Reading 1b "Counting and Sets" —
   https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/mit18_05_s22_class01-prep-b.pdf
   (Concise, self-contained, has its own questions; exactly working-engineer depth.)
2. MIT 18.05 S22 Reading 2 "Probability: Terminology and Examples" —
   https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class02-prep_pdf/
   (Sample spaces, events, axioms in ~8 pages.)
3. MIT 18.05 S22 Reading 3 "Conditional Probability, Independence and Bayes' Theorem"
   — via the readings page
   https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/readings/
   (Title confirmed in search; direct PDF follows the mit18_05_s22_class03-prep.pdf
   pattern [exact direct URL unverified this session]. THE core read: trees, total
   probability, Bayes with base-rate examples.)
4. Combined "18.05 S22 All Probability Reading" (one PDF, offline-friendly) —
   https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/mit18_05_s22_probability.pdf
5. Seeing Theory, Chapters 1–2 (basic/compound probability; chapter titles as per repo
   research) — https://seeing-theory.brown.edu/
   (Visual warm-up; interaction is clicking, not deriving — orientation only.)
6. Blitzstein & Hwang, Introduction to Probability 2e (Stat 110) ch 1–2 —
   https://stat110.hsites.harvard.edu/
   (Deeper, slower; the best problem bank; backup per repo research.)

Community evidence:
- Hacker News on Seeing Theory (two front-page threads, 2017 and 2018): commenters say
  such visualizations "make otherwise dry STEM subjects come to life" — but it is
  orientation, not a course (https://news.ycombinator.com/item?id=13735714,
  https://news.ycombinator.com/item?id=18769099) [thread contents summarized from
  search results; pages not fetchable this session].
- Self-learner retrospective "Statistics and Probability for Free From MIT 18.05"
  (S. T. Lanier, The Startup/Medium) documents completing 18.05 from the OCW materials
  as a self-study course (https://medium.com/swlh/mit-18-05-873f15aec11d) [existence
  and title verified; body not fetchable this session].
- 18.05 is repeatedly the specific course recommended for probability+stats self-study
  in data-science guides (e.g. https://aare.substack.com/p/learn-probability-and-statistics)
  and is mirrored by MIT SOUL (https://mitsoul.org/courses/mit/course-18/18-05/).
- MIT runs an official interactive self-paced port of exactly this course (18.05r) on
  the Open Learning Library with reading questions and auto-graded problem checkers,
  free, no enrollment required to view —
  https://openlearninglibrary.mit.edu/courses/course-v1:MITx+18.05r_10+2022_Summer/about
  — strong institutional signal that the S22 materials are the intended self-study form.
- Learner-written Bayes explainers modeled on the 3b1b framing keep appearing (e.g.
  https://medium.com/@oelmofty/bayes-theorem-a-simple-and-intuitive-explanation-048992867490)
  — evidence the representative-sample framing is what transfers.

Primary technical authority:
- MIT 18.05 Introduction to Probability and Statistics, Spring 2022 (Orloff & Kamrin,
  notes by Orloff & Bloom), MIT OCW —
  https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/
  Readings 1a–3; Problem Set 1 (solutions confirmed at
  https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/mit18_05_s22_pset01_sol.pdf);
  Class 1 in-class problems
  (https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/mit18_05_s22_class01_pset.pdf);
  Practice Exam 1 long list
  (https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/mit18_05_s22_prac_exam01_all.pdf
  + _sol).

Selected shortest-sufficient packet:
- DIAGNOSTIC: Cold, no notes (10 min): (a) the node's disease-test question — 99%
  accurate test, 1/1000 prevalence, estimate then compute P(sick|positive); (b) "two
  dice sum to 7 — probability the first die shows 3?"; (c) state whether independent
  and mutually exclusive can both hold for events with positive probability. All three
  right with correct reasoning → skip ORIENT and CORE WATCH, go straight to PRACTICE.
- ORIENT: Seeing Theory Ch 1–2 (https://seeing-theory.brown.edu/), 15–20 min of play.
- CORE WATCH: 3b1b "Bayes theorem, the geometry of changing beliefs"
  (https://www.youtube.com/watch?v=HZGCoVF3YvM), full video ~15 min [approx], BEFORE
  the reading — it installs the 1000-person-table habit the reading then formalizes.
- CORE READ: 18.05 Readings 1b, 2, 3 (in that order; use the combined probability PDF
  or the readings page), ~60 min. Do the embedded questions as you read. Skip 1a.
- INTERACTIVE: — (gaussian-explorer belongs to l2-random-variables; no Bayes widget
  exists yet — a conditional-probability/1000-person-table widget would be the natural
  future addition).
- PRACTICE: 18.05 Pset 1, the counting/conditional/Bayes problems (check against
  pset01_sol) + Class 1 in-class problems; then the OLL 18.05r problem checkers for
  units 1–3 for instant feedback. ~2.5 h.
- IMPLEMENT/DERIVE: The node's two exercises: (1) simulate the disease-test paradox in
  NumPy — plot P(sick|positive) as a function of prevalence at fixed 99% accuracy;
  (2) Monte-Carlo verify three conditional-probability puzzles you first solved by
  hand (from Pset 1). ~60 min.
- STUCK PATH: 3b1b "The medical test paradox" (https://www.youtube.com/watch?v=lG4VkPoG3ko,
  21 min) — same content re-derived through odds and Bayes factors; or Stat 110 book
  ch 2 for a slower formal treatment.
- DEEPEN: 18.05 Reading 12b "Bayesian Updating: Odds"
  (https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/mit18_05_s22_class12-prep-b.pdf)
  — the odds form used in real filters; Stat 110 ch 1–2 problem sets for volume.
- PROVE IT: The node's mastery test: a two-stage Bayes problem (noisy sensor, prior
  belief, two sequential measurements) solved by hand AND by simulation, matching to
  2 decimals. Use a problem from Practice Exam 1 long list you have not seen.
- TRANSFER: Robot-flavored unseen task: a lidar beam returns "obstacle" with
  P(hit|obstacle)=0.95, P(hit|free)=0.10; prior map says P(obstacle)=0.2. Two
  consecutive hits — posterior after each. Explain why the second hit moves belief
  less far in log-odds than probability suggests.
- RETENTION: +7 days: re-do the diagnostic (a) with new numbers (accuracy 90%,
  prevalence 1/50) in under 3 minutes, and state the total-probability decomposition
  of P(positive) from memory.

Why this won:
18.05 S22 is the only free source at exactly working-engineer depth with self-contained
readings, embedded self-checks, solved psets, practice exams, AND an official
interactive port with auto-graded checkers (OLL 18.05r — new find this session). The
3b1b Bayes video is the community-consensus "it finally clicked" explanation and costs
15 minutes; putting it before the reading converts the reading from symbol-pushing
into confirmation. Total core packet ≈ 4.5–5.5 h against a 10 h node budget, leaving
room for the mastery loop.

What was rejected (and why):
- MIT RES.6-012 / 6.041 (Tsitsiklis) — rigorous and excellent
  (https://ocw.mit.edu/courses/res-6-012-introduction-to-probability-spring-2018/…
  appeared in results) but a full-semester EECS-depth treatment; wrong time budget for
  a 10 h node on this path.
- Stat 110 as primary — best problems, but leisurely pace and measure-flavored asides
  make it the slow path; retained as backup exactly as repo research concluded.
- Khan Academy probability — fragmented micro-skills; this learner is past that mode
  after l2-algebra.
- 3b1b medical-test-paradox as CORE WATCH — 21 min largely overlapping the 15 min
  pick; demoted to STUCK PATH.
- Seeing Theory as anything more than ORIENT — HN's own verdict: beautiful, but play
  is not practice.

Risk of superficial understanding:
High for exactly this learner: Bayes videos produce strong recognition ("I get the
1000-person table") that fails on the first two-stage update or the first problem
where the likelihoods are not given pre-packaged. The commit-before-reveal diagnostic
numbers and the hand-vs-simulation match in PROVE IT are the antidote — a wrong
simulation cannot be nodded along to.

Required active work:
Pset 1 problems on paper; two NumPy simulations matching hand answers to 2 decimals;
OLL checkers; the unseen practice-exam Bayes problem under closed-book conditions.
Video minutes count for nothing without these.

Last verified: 2026-08-21
