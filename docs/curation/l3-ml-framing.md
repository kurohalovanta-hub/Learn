# l3-ml-framing — The Learning Problem

Concept: Supervised learning as function fitting (features X, labels y, hypothesis h); loss as "how wrong" and empirical risk; what train/validation/test splits are each FOR; how pipelines lie (leakage, tuning on test, train-score worship).
Learner prerequisites: l1-numpy (array slicing/boolean masks), l2-functions-graphs. No calculus, no probability beyond intuition — safe at grade-10 math.
What beginners commonly misunderstand:
- Validation vs test blur: they tune hyperparameters against the test set, then report it as an unbiased estimate — the single most common self-deception in beginner projects.
- High train accuracy = learning. (The node's 99%-train-worthless question exists because this belief survives first contact with definitions and only dies in code.)
- Leakage is thought of as "copying labels" only; the subtle forms — normalizing with full-dataset statistics before splitting, duplicate/near-duplicate rows across splits, temporal leakage — go unnoticed.
- Loss (what you optimize) conflated with metric (what you care about).

Candidate videos:
1. A Gentle Introduction to Machine Learning — StatQuest (Josh Starmer) — ~12 min [approx] — https://www.youtube.com/watch?v=Gv9_4yMHFhI (correctness 5, prereq fit 5, clarity 5, rigor 2, time 5 — pure orientation: the "ML = make predictions, judge on testing data" frame in one sitting; zero math)
2. Machine Learning Fundamentals: Cross Validation — StatQuest — ~6 min [approx] — https://youtu.be/fSytzGwwBVw (clarity 5, intuition 5, rigor 2, time 5 — the why of held-out data in the smallest possible package; fold mechanics transfer directly to the split exercise)
3. Machine Learning Fundamentals: Bias and Variance — StatQuest — ~7 min [approx] — https://www.youtube.com/watch?v=EuBBz3bI-aA (clarity 5, intuition 5 — kept as stuck-path here; full study belongs to l3-generalization)
(YouTube, statquest.org and Class Central were egress-blocked this session; titles/URLs above appeared verbatim in live search results, durations marked [approx] where no aggregator stated them.)

Candidate written resources:
1. MLU-Explain, "Train, Test, and Validation Sets" — https://mlu-explain.github.io/train-test-validation/ — URL verified via the aws-samples/aws-mlu-explain README (fetched this session; repo archived 2026-03-06, content finished/stable). Interactive scrolly essay with a live model — the exact "what is each split FOR" lesson, ~15 min. (prereq fit 5, clarity 5, intuition 5, rigor 3, production 5)
2. CS229 main notes (Ng & Ma), opening of Part I — supervised-learning framing: hypothesis, cost function, the notation the next four nodes reuse — https://cs229.stanford.edu/main_notes.pdf [repo-verified 2026-08-21 research report: 2026-08-18 revision; site unreachable from this sandbox] (correctness 5, rigor 5, prereq fit 3 — readable if taken slowly with the StatQuest frame already in place)
3. MLU-Explain, "The Bias Variance Tradeoff" — https://mlu-explain.github.io/bias-variance/ (verified same way) — preview only here; studied at l3-generalization.

Community evidence:
- HuggingFace forums: learners pointed to StatQuest's series as the entry explanation for NN/ML fundamentals (https://discuss.huggingface.co/t/neural-networks-video/20249)
- Practitioner blog praising StatQuest's pacing/visuals as the beginner on-ramp: https://paulvanderlaken.com/2019/04/01/statquest-statistical-concepts-clearly-explained/
- Class Central catalogs 30+ StatQuest videos as standalone "courses" — heavy learner traffic signal (https://www.classcentral.com/index.php/institution/statquest)
- Amazon Science announcement of MLU-Explain highlights the data-splitting essay's cats/dogs animation as its accessibility flagship (https://www.amazon.science/latest-news/amazon-machine-learning-university-new-courses-mlu-explains); also featured by Adafruit (https://blog.adafruit.com/2022/08/23/mlu-explain/)

Primary technical authority:
- CS229 Machine Learning official lecture notes, Ng & Ma, Stanford — 2026-08-18 revision (repo resource `cs229-notes`), Part I framing sections.

Selected shortest-sufficient packet:
- DIAGNOSTIC: Cold, on paper: draw the supervised setup (X, y, h, loss); state what validation is FOR vs test; name one concrete way a pipeline lies. 5 min.
- ORIENT: StatQuest "A Gentle Introduction to Machine Learning" at 1.25–1.5× (~9–12 min).
- CORE WATCH: StatQuest "Machine Learning Fundamentals: Cross Validation" (~6 min).
- CORE READ: MLU-Explain "Train, Test, and Validation Sets" (~15 min, work the interactions) → CS229 notes Part I opening framing pages (~20 min, pencil out every symbol).
- INTERACTIVE: — (first widget contact comes at l3-linear-regression with `gradient-descent`).
- PRACTICE: Node exercises: (1) three-way split of a synthetic dataset, then deliberately normalize with full-data stats before splitting and measure the inflated val score vs the honest train-stats-only pipeline; (2) eyeball-fit a line to 10 points, define and compute its MSE by hand in NumPy.
- IMPLEMENT/DERIVE: "The leakage lie, quantified" — one notebook: same model, two pipelines (leaky vs clean), report the gap as a number; one paragraph naming which split answered which question.
- STUCK PATH: StatQuest "Bias and Variance" (~7 min) — re-grounds why train success is not learning.
- DEEPEN: ISLP ch 2 (statlearning.com free PDF) [repo-verified 2026-08-21] — only if the statistical-learning framing wants more formality.
- PROVE IT: The node masteryTest, spoken aloud to a rubber duck and recorded: why 99% train can be worthless + the three distinct lies (leakage, tuning-on-test, distribution shift/duplicates).
- TRANSFER: Design the data split for a grasp-success predictor trained on video frames from 3 recording sessions. Correct answer splits by session/episode, never by frame; explain the temporal near-duplicate leak if you split by frame.
- RETENTION: +7 days, cold: re-answer the node diagnostic ("what is validation FOR, and why does tuning on test invalidate it?") plus re-state the three lies without notes.

Why this won: The node's danger is recognition-masquerading-as-mastery — definitions here feel trivial. So the packet spends its minutes where the belief actually changes: an interactive essay whose model you can break (MLU), ~18 min of StatQuest orientation, and a mandatory self-inflicted leakage experiment. CS229 stays primary authority (repo decision respected) but is trimmed to the framing pages; its real weight lands in the next three nodes.
What was rejected (and why): Andrew Ng Coursera ML Specialization C1 (repo backup — ~15 h, calendar-scale for a 4 h node; keep as repo-level backup only). StatQuest "Linear Regression, Clearly Explained" here (fits the next node, and its R²/p-value focus is statistics-course flavored). Google ML Crash Course framing module — could not be live-verified this session (search budget exhausted; egress blocked), and MLU-Explain covers the same ground interactively.
Risk of superficial understanding: High — everything here "reads obvious." The learner can quote split definitions yet still normalize before splitting on day 30. Countermeasure is baked in: the PRACTICE forces them to produce the lie themselves and measure it; PROVE IT is verbal and unseen; TRANSFER moves it to episode-structured robot data where the failure mode is non-obvious.
Required active work: The two-pipeline leakage notebook, the hand-MSE computation, the recorded rubber-duck explanation, and the session-split design answer. Watching alone counts for nothing here.
Last verified: 2026-08-21
