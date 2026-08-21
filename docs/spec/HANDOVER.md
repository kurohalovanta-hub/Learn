# HANDOVER --- ZERO → EMBODIED INTELLIGENCE RESEARCHER IN 7 MONTHS

## 0. YOUR ROLE, CLAUDE

You are not being asked to make me a generic "AI roadmap", a list of
courses, or a university-style curriculum.

You are my **research director, curriculum architect, technical mentor,
progress evaluator, and web-app content architect** for an extremely
compressed 210-day attempt to go from near-zero technical foundations to
the maximum realistically achievable level of independent **Embodied
Intelligence / Robot Learning / Physical AI research capability**.

You must first conduct deep, current research and then build a beautiful
interactive web application that becomes my daily operating system for
this journey.

The website must answer, every single day:

1.  What exactly do I learn today?
2.  Why am I learning it?
3.  What prerequisite does it depend on?
4.  What is the best resource for it?
5.  Exactly which chapters/lectures/pages/sections do I consume?
6.  What do I implement myself?
7.  What mathematics must I derive?
8.  What exercise proves I understand it?
9.  What project does this unlock?
10. What paper does this eventually help me understand?
11. What can I safely skip?
12. What happens if I fail the mastery test?
13. What is my current level?
14. What is the next level?
15. How close am I to independent research capability?

Do not optimize for credentials, certificates, interview preparation,
LeetCode, generic full-stack development, DevOps, or course completion.

Optimize for **research capability per hour**.

------------------------------------------------------------------------

# 1. THE PERSON YOU ARE DESIGNING THIS FOR

## Current starting point

Assume the learner begins at approximately:

-   Programming: effectively zero.
-   Python: zero.
-   C/C++: zero.
-   Formal CS knowledge: near zero.
-   Machine learning: zero.
-   Deep learning: zero.
-   Robotics: zero.
-   ROS: zero.
-   Electronics/embedded systems: near zero.
-   Mathematics: approximately Grade 10 level.
-   Linux/programming workflows: do not assume competence.
-   Computer familiarity: very high as an end user / technical
    enthusiast.
-   Learning speed: potentially high when motivated.
-   Strong interest in mathematics.
-   Comfortable using AI tools and computers.
-   Willing to work aggressively and learn by building.
-   Hardware is NOT a prerequisite for the first stages. Simulation
    should be exploited heavily.
-   A powerful computer/GPU may be used for training and inference; do
    not assume a Raspberry Pi or Jetson is necessary for learning.

Never silently assume university-level calculus, linear algebra,
algorithms, Python, Git, Linux, PyTorch, or robotics knowledge.

## Desired identity

The target is NOT:

-   Arduino hobbyist
-   ROS technician
-   generic robotics engineer
-   generic ML engineer
-   prompt engineer
-   LLM wrapper developer
-   generic software engineer

The aspirational target is:

> **Embodied Intelligence / Robot Learning Researcher**
>
> capable of understanding the intelligence layer connecting perception,
> language, world models, learned policies, physical actions, and
> feedback from the real world.

Longer-term, this expertise should be capable of supporting work at the
frontier of Physical AI and potentially the creation of a major
technology company.

Do not turn the startup ambition into motivational filler. Technical
depth comes first.

------------------------------------------------------------------------

# 2. THE 210-DAY NORTH STAR

At the end of seven months, maximize the probability that I can take a
recent embodied-intelligence / robot-learning paper and independently:

1.  Read it.
2.  Understand most of the mathematical notation.
3.  Identify prerequisite gaps.
4.  Understand the model architecture.
5.  Understand the robotics assumptions.
6.  Inspect the repository.
7.  Set up the environment.
8.  Run the code.
9.  Debug common failures.
10. Reproduce at least one result or benchmark.
11. Modify an important component.
12. Form a hypothesis about the modification.
13. Design a controlled experiment.
14. Establish baselines.
15. Evaluate quantitatively.
16. Perform ablations.
17. Analyze failure modes.
18. Interpret the results.
19. Explain why the result likely occurred.
20. Propose a credible next experiment.
21. Write a research-quality technical report.
22. Produce a reproducible repository.
23. Begin testing an original research idea.

The learner should understand the full conceptual loop:

``` text
LANGUAGE / TASK
      ↓
PERCEPTION
      ↓
REPRESENTATION / WORLD MODEL
      ↓
REASONING / PLANNING / POLICY
      ↓
ACTION
      ↓
PHYSICAL OR SIMULATED WORLD
      ↓
NEW OBSERVATION
      ↓
LEARNING / ADAPTATION
      ↺
```

And the modern learned-policy abstraction:

``` text
vision + language + proprioception / robot state
                    ↓
          learned policy / VLA
                    ↓
              action sequence
                    ↓
                 robot
                    ↓
               environment
```

------------------------------------------------------------------------

# 3. IMPORTANT REALISM CONSTRAINT

Do NOT promise that seven months creates a "perfect" or world-class
researcher.

The learner wants an extreme target. Preserve the ambition while
measuring actual competence.

The correct optimization target is:

> **maximum credible independent research capability achievable in 210
> days from this starting point.**

If a foundational concept is required, teach it.

If something is traditional curriculum baggage that does not materially
contribute to the target, skip it.

Depth on critical concepts beats superficial coverage of everything.

------------------------------------------------------------------------

# 4. FIRST TASK: RESEARCH BEFORE BUILDING THE CURRICULUM

Before generating the final roadmap, conduct comprehensive up-to-date
research as of the current date.

Prioritize sources in this order:

1.  Original research papers.
2.  Official project repositories.
3.  Official documentation.
4.  University course materials.
5.  Author/research-lab materials.
6.  High-quality textbooks.
7.  High-quality technical lectures.
8.  Secondary tutorials only when genuinely superior for beginners.

Do not construct the program primarily from SEO blogs or random YouTube
playlists.

For EVERY recommended resource record:

-   title
-   author/institution
-   URL
-   type
-   difficulty
-   prerequisite knowledge
-   exact relevant chapters/lectures/sections
-   estimated hours
-   why this resource beats alternatives
-   whether it is required / recommended / reference-only
-   what can be skipped
-   what competency it unlocks
-   last verified date

Check that links still work.

Where the field changes quickly, favor current primary sources and
repositories.

------------------------------------------------------------------------

# 5. RESEARCH THE 2026 EMBODIED-INTELLIGENCE FRONTIER

Do not freeze the curriculum around historical systems.

Research the CURRENT landscape and determine which systems are
pedagogically and scientifically important.

At minimum investigate the current successors/state of:

-   RT-1 / RT-2
-   Open X-Embodiment / RT-X
-   OpenVLA and successors
-   π0 / π0.5 / current Physical Intelligence work
-   SmolVLA / LeRobot ecosystem
-   NVIDIA GR00T and current successors
-   Diffusion Policy and newer action-generation approaches
-   ACT / action chunking
-   world models for robotics
-   learning from human video
-   cross-embodiment learning
-   generalist robot policies
-   imitation learning
-   offline robot learning
-   reinforcement learning for robotics
-   sim-to-real
-   real-to-sim / digital twins where relevant
-   dexterous manipulation
-   long-horizon task execution
-   failure detection and recovery
-   continual robot learning
-   few-shot robot learning
-   multimodal representations
-   tactile / force-aware learning
-   robot data scaling
-   synthetic robot data
-   action representations / tokenization
-   policy evaluation and benchmarking

Determine what is foundational versus hype.

The web app should include a **Frontier Tracker** so the curriculum can
evolve as research changes.

------------------------------------------------------------------------

# 6. THE CURRICULUM MUST BE A DEPENDENCY GRAPH, NOT A PLAYLIST

Model knowledge as a directed dependency graph.

Example:

``` text
Algebra
  ↓
Functions
  ↓
Calculus ─────────────┐
                      ↓
Vectors → Linear Algebra → Optimization
       ↓              ↓
       └────→ Robotics Geometry
                      ↓
              Kinematics / Dynamics
                      ↓
                  Control

Python → NumPy → PyTorch → Neural Nets → Transformers
                              ↓             ↓
                           Vision      Multimodality
                              └──────┬──────┘
                                     ↓
                               Robot Learning
                                     ↓
                              VLA / World Models
                                     ↓
                                  Research
```

Every node must contain:

-   prerequisite nodes
-   learning objective
-   intuition
-   formal concepts
-   equations that must be understood
-   best resource
-   exact sections
-   implementation exercise
-   derivation exercise where appropriate
-   mastery test
-   project connection
-   paper connection
-   estimated hours
-   status
-   confidence score
-   spaced-review dates

Allow nodes to unlock early when prerequisites are demonstrated rather
than forcing calendar waiting.

------------------------------------------------------------------------

# 7. LEVEL SYSTEM

Turn the journey into explicit levels.

Suggested macro-levels:

## LEVEL 0 --- Computational Survival

Goal: become capable of operating a research environment.

Topics: - terminal - filesystem - shell basics - editors/IDE - package
installation - environments - Git - GitHub - SSH - debugging mentality -
reading stack traces - basic computer architecture intuition

Exit condition: Can clone, install, run, modify, debug, commit and
document a small project.

------------------------------------------------------------------------

## LEVEL 1 --- Programming From Zero

Primary language: Python.

Required: - variables/types - Boolean logic - conditionals - loops -
functions - data structures - modules - files - exceptions - classes
only to the depth required - typing basics - debugging - testing
basics - NumPy - Matplotlib - Jupyter

Do NOT overinvest in generic software engineering.

Exit projects: - numerical simulation - data analysis script - linear
regression from scratch - small reusable Python package

Mastery: Learner can write non-trivial programs without AI generating
the whole solution.

------------------------------------------------------------------------

## LEVEL 2 --- Mathematical Bootloader

Rapidly repair prerequisite mathematics.

Required foundation: - arithmetic fluency - algebra - functions -
graphs - exponents - logarithms - trigonometry - coordinate geometry

Then: - vectors - matrices - linear systems - dot products - matrix
multiplication - norms - projections - basis - linear transformations -
eigenvalues/eigenvectors - SVD intuition - derivatives - chain rule -
partial derivatives - gradients - Jacobians - Hessians - integration
intuition where required - probability - conditional probability -
Bayes - expectation - variance - covariance - Gaussian distributions -
basic statistics - optimization - gradient descent - constrained
optimization / Lagrange multipliers when useful

Later introduce: - numerical optimization - Lie groups SO(3), SE(3) -
Lie algebra intuition - differential equations as needed - stochastic
processes as needed - information theory as needed

Critical rule: Teach math **just in time and through implementation**.

Every major mathematical topic must have: 1. visual intuition 2.
derivation 3. numerical exercise 4. Python implementation 5. robotics/ML
application

------------------------------------------------------------------------

## LEVEL 3 --- Machine Learning From First Principles

Required: - supervised learning - unsupervised learning intuition -
train/validation/test - regression - classification - losses - maximum
likelihood intuition - gradient descent - SGD - momentum - Adam -
regularization - bias/variance - overfitting - generalization -
metrics - data leakage - experimental design basics

Required implementation: - linear regression from scratch - logistic
regression from scratch - small MLP from NumPy - backpropagation
understanding

Exit condition: Can derive and implement a basic learning system rather
than only call libraries.

------------------------------------------------------------------------

## LEVEL 4 --- Deep Learning + PyTorch

Required: - tensors - autograd - computational graphs - modules -
optimizers - dataloaders - GPU training - initialization -
normalization - activations - MLPs - CNNs - embeddings - attention -
self-attention - multi-head attention - positional representations -
Transformers - vision transformers - representation learning -
contrastive learning - CLIP-style multimodality

Required builds: - image classifier - neural network training loop
without high-level trainer - attention implementation - tiny
Transformer - tiny language model or sequence model - ViT/vision
experiment

Mastery: Can explain and trace tensor dimensions through a Transformer
and explain backpropagation at a meaningful level.

------------------------------------------------------------------------

## LEVEL 5 --- Robotics Mathematics

Required: - coordinate frames - 2D/3D transformations - rotation
matrices - Euler-angle limitations - quaternions - homogeneous
transformations - SO(3) - SE(3) - forward kinematics -
Denavit-Hartenberg only to useful depth; compare with modern
formulations - inverse kinematics - Jacobians - velocity kinematics -
singularities - rigid-body dynamics - trajectories

Required implementation: Build a small kinematics library rather than
relying entirely on robotics frameworks.

Exit project: Simulated multi-DOF arm with forward/inverse kinematics
and trajectory visualization.

------------------------------------------------------------------------

## LEVEL 6 --- Dynamics, Control, Estimation

Required: - feedback - stability intuition - PID - state-space models -
controllability/observability intuition - LQR - trajectory tracking -
system identification - MPC fundamentals - sensor noise - Bayesian
filtering - Kalman filter - EKF - particle-filter intuition - sensor
fusion

Projects: - inverted pendulum - trajectory controller - noisy
localization problem - Kalman-filter implementation - compare
controllers quantitatively

Do not allow frameworks to hide the mathematics.

------------------------------------------------------------------------

## LEVEL 7 --- Robotics Software + Simulation

ROS is infrastructure, not the identity.

Research the best currently supported ROS 2 distribution and simulation
stack.

Required: - ROS 2 architecture - nodes - topics - messages - services -
actions - parameters - launch - packages - TF2 - URDF/Xacro - RViz -
simulation - ROS bags/data recording - debugging - logging - basic ROS 2
C++ literacy

Simulation stack should evaluate: - Gazebo - MuJoCo - NVIDIA Isaac Sim /
Isaac Lab - other relevant 2026 platforms

Do not force all simulators if redundant. Explain their roles.

Exit: Can create/modify a simulated robot and connect
perception/control/planning components.

------------------------------------------------------------------------

## LEVEL 8 --- Perception

Required: - image formation - camera intrinsics/extrinsics -
projection - calibration - OpenCV fundamentals - feature intuition - CNN
vision - object detection - segmentation - depth - stereo - RGB-D -
point clouds - 3D geometry - pose estimation - visual odometry - SLAM
fundamentals - learned visual representations - ViT - multimodal
vision-language representations

Exit: Robot/simulator can identify and localize task-relevant objects in
3D.

------------------------------------------------------------------------

## LEVEL 9 --- Planning + Autonomous Systems

Required: - graph search - A* - sampling-based planning - RRT / RRT* -
collision checking - trajectory optimization intuition - localization -
mapping - SLAM - navigation - manipulation planning - MoveIt 2 - Nav2
where still appropriate - task planning vs motion planning

Exit: Simulated mobile manipulator can navigate, locate an object, plan
a grasp/motion, manipulate it, and recover from simple failures.

------------------------------------------------------------------------

## LEVEL 10 --- Reinforcement Learning

Required: - Markov decision processes - states/actions/rewards - Bellman
equations - value functions - Q functions - dynamic programming
intuition - Q-learning - policy gradients - actor-critic - PPO - SAC -
exploration - credit assignment - reward design - model-based vs
model-free - offline RL - evaluation pitfalls

Use robotics examples.

Required: Implement at least one simple algorithm sufficiently from
first principles before relying on frameworks.

------------------------------------------------------------------------

## LEVEL 11 --- Imitation Learning + Learning From Demonstrations

Required: - behavior cloning - covariate shift - DAgger - trajectory
datasets - action representations - action chunking - ACT -
diffusion-based policies - offline demonstrations - teleoperation/data
collection concepts - dataset quality - policy evaluation

Use current LeRobot or best successor where appropriate.

Required experiment: Train multiple approaches on the same manipulation
task and compare success, data efficiency, robustness and failure modes.

------------------------------------------------------------------------

## LEVEL 12 --- Embodied Foundation Models / VLA

This is a CORE specialization.

Required conceptual questions: - How are observations represented? - How
is language grounded? - How is robot state represented? - How are
actions represented? - Continuous vs discretized actions? - Why action
chunking? - How is pretraining used? - How is robot data mixed? - How
does cross-embodiment training work? - What transfers from
internet-scale vision/language? - What does not transfer? - How are
policies fine-tuned? - What are latency/control-frequency constraints? -
How is generalization measured? - What are the dominant failure modes?

Study current representative VLA/generalist robot systems.

Do not simply summarize papers. Require architecture reconstruction and
implementation/reproduction.

------------------------------------------------------------------------

## LEVEL 13 --- World Models + Physical Reasoning

Required: - predictive representations - latent dynamics - model-based
control - video prediction - action-conditioned prediction - planning
with learned models - uncertainty - physical common sense -
counterfactual prediction - current world-model research for embodied
agents

Research question: Can an agent predict consequences before physically
executing actions?

------------------------------------------------------------------------

## LEVEL 14 --- Sim-to-Real + Real Robot Systems

Required: - reality gap - domain randomization - calibration - latency -
actuator dynamics - friction - backlash - sensor noise - system
identification - robustness - real-world fine-tuning - safety
constraints - data collection - failure recovery - sim-to-real
evaluation

Only introduce hardware when it creates learning that simulation cannot.

Possible real hardware: - inexpensive arm - 3D-printed mechanisms -
Feetech/STS3215-class actuators - cameras - microcontrollers - SBC only
if needed

Do not make expensive hardware mandatory.

------------------------------------------------------------------------

## LEVEL 15 --- Research Apprenticeship

This level begins BEFORE all prior material is "complete."

Teach: - how to read papers - literature search - citation graph
exploration - paper triage - reading equations - reading repositories -
reproducing environments - benchmark literacy - baselines - controlled
experiments - ablations - statistical reasoning - reproducibility -
failure analysis - research logs - writing - figures/tables - presenting
negative results - avoiding cherry-picking - identifying assumptions -
hypothesis formation

Paper workflow:

``` text
TRIAGE
↓
READ
↓
MAP PREREQUISITES
↓
DERIVE
↓
RUN
↓
REPRODUCE
↓
MODIFY
↓
HYPOTHESIZE
↓
EXPERIMENT
↓
ABLATE
↓
ANALYZE
↓
WRITE
```

------------------------------------------------------------------------

## LEVEL 16 --- Original Embodied Intelligence Research

By the final month, select ONE narrow problem.

Candidate families: - few-shot skill learning - continual robot
learning - cross-embodiment transfer - failure detection/recovery -
world models - human-video-to-robot learning - data-efficient
manipulation - long-horizon policies - uncertainty-aware policies -
sim-to-real - tactile/force-informed learning - synthetic-data scaling -
robot-data quality - action representation - generalization to unseen
environments/objects - self-improvement from deployment experience

The web app should help score research directions by: - novelty -
importance - tractability in available compute - dataset availability -
simulation feasibility - hardware dependence - benchmark quality - time
to first experiment - likelihood of measurable result - startup
relevance (secondary) - learning value

Final target: One original hypothesis tested rigorously.

------------------------------------------------------------------------

# 8. 7-MONTH MACRO SCHEDULE

Do NOT treat these as rigid silos. Parallelize intelligently.

## Month 1 --- Computational + Mathematical Boot

Primary: - Python - NumPy - Linux - Git - algebra repair - functions -
vectors - linear algebra - calculus beginnings - probability beginnings

Secondary: - tiny ML implementations

Deliverables: - GitHub workflow - numerical programs - linear regression
from scratch - tiny NumPy neural network

------------------------------------------------------------------------

## Month 2 --- ML + Deep Learning

Primary: - ML foundations - PyTorch - backprop - CNN - attention -
Transformers - ViT - optimization/statistics continuation

Deliverables: - classifier - custom training loop - attention from
scratch - tiny Transformer - experimental report

Begin reading simplified/seminal papers.

------------------------------------------------------------------------

## Month 3 --- Robotics Core

Primary: - 3D geometry - SO(3)/SE(3) - kinematics - Jacobians -
dynamics - controls - estimation - ROS 2 - simulation - C++ reading
literacy

Deliverables: - kinematics library - simulated arm - PID/LQR
experiment - Kalman filter - ROS-integrated simulation

------------------------------------------------------------------------

## Month 4 --- Perception + Planning + Autonomous Manipulation

Primary: - camera geometry - vision - depth/3D - object
representations - SLAM - motion planning - navigation - manipulation
planning - multimodal vision-language representations

Deliverable: A simulated mobile manipulator that can perceive, navigate
and manipulate.

------------------------------------------------------------------------

## Month 5 --- Robot Learning

Primary: - RL - imitation learning - behavior cloning - DAgger - ACT -
diffusion policies - offline datasets - Isaac Lab/MuJoCo -
LeRobot/current equivalent

Deliverable: Controlled comparison of multiple policies on the same
task.

Research habits become daily.

------------------------------------------------------------------------

## Month 6 --- VLA + World Models + Paper Reproduction

Primary: - embodied foundation models - VLA architectures - world
models - robot data - cross-embodiment - generalization - scaling -
failure modes

Required: Reproduce multiple meaningful research results or components.

At least one paper/week should enter the research pipeline, with scope
adjusted by difficulty.

Deliverable: A reproduction report with code, metrics, deviations from
the paper and failure analysis.

------------------------------------------------------------------------

## Month 7 --- Original Research Sprint

Coursework becomes secondary.

Process: 1. literature map 2. choose narrow question 3. define
hypothesis 4. define benchmark 5. reproduce baseline 6. implement change
7. run controlled experiments 8. ablate 9. analyze 10. repeat 11. write
12. release

Final artifacts: - reproducible repository - experiment configs -
results - plots/tables - research diary - technical report/preprint -
demo video if applicable - future-work plan

------------------------------------------------------------------------

# 9. DAILY OPERATING SYSTEM

Assume an aggressive default of approximately 5--7 focused hours/day,
six days/week.

Do not simply assign six hours of videos.

A default day should balance:

### A. Mathematical/theoretical work --- \~90--120 min

Learn, derive, solve.

### B. Implementation --- \~90 min

Code the idea.

### C. Core specialization --- \~90 min

Current robotics/ML topic.

### D. Project/experiment --- \~60--90 min

Integrate knowledge.

### E. Retrieval/review --- \~20--30 min

Spaced recall, no notes initially.

Later months progressively replace coursework with: - papers -
reproductions - experiments - research writing

Every day should have: - must-do - stretch - optional - mastery check -
estimated time - prerequisites - deliverable

------------------------------------------------------------------------

# 10. MASTERY GATES --- NO FAKE PROGRESS

Progress is competency-based, not calendar-based.

Each node must have a mastery test.

Use tiers:

### Bronze --- Recognition

Can explain terminology and intuition.

### Silver --- Application

Can solve standard problems and use the concept.

### Gold --- Construction

Can implement/derive it without copying.

### Platinum --- Transfer

Can apply it to a new problem.

### Research --- Critique

Can identify assumptions, weaknesses and experimental consequences.

Important topics cannot be marked complete below Gold.

Core research topics should eventually reach Platinum/Research.

If a learner fails: - diagnose exact prerequisite weakness - create a
short remediation branch - retest - do not reset the entire curriculum

------------------------------------------------------------------------

# 11. AI TUTORING RULES

AI must accelerate learning without replacing cognition.

The site should provide prompt templates such as:

> "Do not solve this. Ask me one question at a time until you identify
> the exact prerequisite I am missing."

> "Make me derive this equation. Give only the next hint after I attempt
> the current step."

> "Quiz me on this paper as if I am defending it to the authors."

> "Give me a minimal implementation task that proves I understand this
> concept."

> "Review my code for conceptual errors, but do not rewrite it unless I
> request the solution."

> "Give me a new problem requiring transfer rather than memorization."

Track whether tasks were: - independent - hint-assisted - heavily
AI-assisted - copied

Mastery scores should penalize dependence on generated solutions.

------------------------------------------------------------------------

# 12. PROJECT LADDER

The web must maintain a cumulative project ladder.

Projects should reuse earlier work.

Possible progression:

1.  Numerical physics toy.
2.  Linear regression from scratch.
3.  NumPy neural network.
4.  PyTorch classifier.
5.  Tiny Transformer.
6.  2D robot kinematics visualizer.
7.  Multi-link arm kinematics.
8.  PID-controlled simulated system.
9.  Inverted pendulum.
10. Kalman-filter localization.
11. ROS simulated robot.
12. Simulated arm with planning.
13. Vision-based object localization.
14. SLAM/navigation robot.
15. Mobile manipulator.
16. RL manipulation task.
17. Behavior-cloning task.
18. ACT/diffusion-policy experiment.
19. VLA evaluation/reproduction.
20. World-model experiment.
21. Research reproduction.
22. Original research experiment.

For each: - purpose - prerequisites - minimum implementation - stretch
implementation - metrics - common failure modes - research connection -
portfolio artifact

------------------------------------------------------------------------

# 13. PAPER LADDER

Build a curated paper ladder from beginner-accessible to frontier.

Do not throw 200 papers at the learner.

Each paper card needs: - title - year - authors - official paper link -
official code - difficulty - why it matters - prerequisites - concepts
introduced - equations to understand - figures to reconstruct -
reproduction feasibility - compute needs - expected reading time -
questions to answer - follow-up papers

Categories: - neural networks / optimization - CNN / representation
learning - attention / Transformers - multimodality - RL - imitation
learning - robotics geometry/control - manipulation - diffusion
policies - generalist robot policies - VLA - world models -
sim-to-real - current frontier

Include seminal papers where historically useful, but optimize for
understanding the present frontier.

------------------------------------------------------------------------

# 14. RESOURCE SELECTION RULE

For every topic, choose:

### PRIMARY

The single best resource to actually learn from.

### BACKUP

A second resource with a different explanation style.

### REFERENCE

Authoritative documentation/textbook for later lookup.

Avoid giving five equivalent courses.

The learner has 210 days.

Explicitly state: - STUDY - SKIM - SKIP - REFERENCE ONLY

Give exact chapters/lectures rather than "take this course."

------------------------------------------------------------------------

# 15. COMPUTE STRATEGY

Research current compute requirements.

Use the learner's existing GPU/desktop where possible.

Prefer: - local simulation - local training when practical - existing
datasets - pretrained models - parameter-efficient fine-tuning - smaller
reproductions - cloud GPU only when justified

For every compute-heavy exercise state: - VRAM requirement - RAM -
storage - expected runtime - cheaper alternative - reduced-scale
reproduction option

Do not make expensive hardware a prerequisite.

------------------------------------------------------------------------

# 16. HARDWARE STRATEGY

Hardware is a later experimental instrument, not the curriculum.

Simulation first where equivalent.

The site should distinguish:

### NO HARDWARE REQUIRED

Can be learned completely/mostly in simulation.

### HARDWARE HELPFUL

Real-world effects add meaningful learning.

### HARDWARE REQUIRED

Cannot credibly learn the phenomenon otherwise.

Potential future hardware should be chosen based on experiments, not
shopping enthusiasm.

When physical work begins, focus on: - latency - calibration - sensing -
actuation - noise - friction - backlash - safety - data collection -
sim-to-real

------------------------------------------------------------------------

# 17. C++ STRATEGY

Do not force months of generic C++.

Python is the primary research language.

Teach enough C++ to: - read robotics code - understand compilation -
modify ROS components - understand memory/value/reference basics - use
classes/templates at a practical level - debug build errors - interface
with performance-critical libraries

Expand only when projects require it.

------------------------------------------------------------------------

# 18. WHAT TO DEPRIORITIZE

Unless directly required, deprioritize:

-   LeetCode grinding
-   competitive programming
-   generic web development
-   mobile app development
-   DevOps certifications
-   cloud certifications
-   generic cybersecurity
-   enterprise Java
-   exhaustive C++
-   exhaustive operating-systems theory
-   exhaustive algorithms coursework
-   Arduino as a months-long curriculum
-   electronics for its own sake
-   memorizing ROS
-   training giant LLMs from scratch
-   prompt engineering as a specialty
-   generic "AI engineer" certificates

Do not remove CS fundamentals that become necessary. Teach them just in
time.

------------------------------------------------------------------------

# 19. RESEARCH METHODOLOGY MUST BE FIRST-CLASS

The learner must understand that running a GitHub repo is not research.

Teach:

## Hypothesis

A falsifiable prediction.

## Baseline

What existing method are we comparing against?

## Independent variable

What exactly changed?

## Dependent variable

What exactly is measured?

## Controls

What must remain constant?

## Seeds / variance

How stable is the result?

## Ablation

Which component caused the gain?

## Failure analysis

Where and why does it break?

## Reproducibility

Can someone else obtain the result?

## Negative results

Valid and useful when properly designed.

## Scientific writing

Claims must match evidence.

Create templates for: - experiment plan - experiment log - paper notes -
reproduction report - ablation table - failure taxonomy - weekly
research memo

------------------------------------------------------------------------

# 20. WEBSITE REQUIREMENTS

Build a polished responsive web application, not a giant markdown page.

The design should make a huge curriculum feel SIMPLE.

## Main dashboard

Show: - Day X / 210 - current level - current streak - focused hours -
mastery percentage - unlocked skills - current project - current paper -
today's mission - blockers - next unlock - research-readiness score

## Skill Tree

Interactive graph.

Clicking a node shows: - why - prerequisites - resources - equations -
exercises - project - mastery test - paper connections

Color/status: - locked - available - learning - review due - mastered -
research-level

## Today Page

One clean sequence:

``` text
TODAY'S OBJECTIVE
WHY IT MATTERS
PREREQUISITES
LEARN
DERIVE
CODE
BUILD
TEST YOURSELF
REVIEW
SHIP
```

Avoid overwhelming the learner.

## Math Lab

For each mathematical idea: - intuition - visualization - derivation -
worked example - unsolved problem - code implementation - robotics
application - ML application - mastery quiz

## Code Lab

Track: - Python - NumPy - PyTorch - C++ - ROS - simulation - research
repositories

Include progressive challenges.

## Robotics Lab

Track: - geometry - kinematics - dynamics - control - estimation -
perception - planning - manipulation - simulation - real systems

## ML Lab

Track: - classical ML - neural nets - CNN - attention - Transformers -
vision - multimodality - RL - imitation - generative/action models

## Embodied Intelligence Lab

Track: - VLA - world models - generalist policies - cross-embodiment -
robot datasets - sim-to-real - continual learning - failure recovery -
current frontier

## Paper Room

Kanban: - queue - triaged - reading - deriving - reproducing -
reproduced - modified - research lead

## Experiment Tracker

Every experiment: - hypothesis - code commit - config - dataset - seed -
metrics - result - plots - conclusion - next experiment

## Knowledge Graph

Show how: math → ML → robotics → robot learning → papers.

## Review System

Spaced repetition for: - formulas - concepts - code patterns - paper
insights

But favor retrieval and problem solving over flashcard trivia.

## Frontier Tracker

A section for new important papers/repos/models.

For each: - what changed - whether roadmap should change -
prerequisites - importance - evidence - whether to study now/later

## Research Idea Inbox

Capture questions during learning.

Score them later.

------------------------------------------------------------------------

# 21. GAMIFICATION WITHOUT CHILDISHNESS

The learner wants rapid leveling.

Use serious progression language.

Possible ranks:

0.  Initiate
1.  Computational Apprentice
2.  Mathematical Operator
3.  ML Builder
4.  Deep Learning Practitioner
5.  Roboticist
6.  Autonomous Systems Builder
7.  Robot Learning Practitioner
8.  Embodied AI Practitioner
9.  Research Apprentice
10. Independent Researcher

Do not award ranks for time watched.

Ranks require evidence.

Display: - XP from mastery - boss challenges - locked research
branches - competency radar - project trophies - paper reproductions

No meaningless dopamine mechanics.

------------------------------------------------------------------------

# 22. BOSS FIGHTS

Every major level ends with a difficult synthesis challenge.

Examples:

### Programming Boss

Build a numerical simulation from a written specification.

### Math Boss

Derive and implement gradient descent + Jacobian problems.

### DL Boss

Implement/train/debug a small Transformer.

### Robotics Boss

Implement kinematics/control without relying entirely on libraries.

### Autonomy Boss

Simulated robot maps, navigates and manipulates.

### Robot Learning Boss

Train/evaluate policies and diagnose distribution shift.

### VLA Boss

Reproduce a meaningful component/result from a modern VLA system.

### Final Boss

Original hypothesis + baseline + experiment + ablation + report.

Failure should generate remediation quests.

------------------------------------------------------------------------

# 23. WEEKLY REVIEW

Every seventh day should include:

-   closed-book retrieval
-   coding challenge
-   math problems
-   explain-back
-   project checkpoint
-   paper discussion
-   dependency-gap detection
-   hours audit
-   AI-dependence audit
-   plan adjustment

Generate: - What I truly learned - What I merely recognized - What I
forgot - What blocks next week - What should be removed - What should be
accelerated

------------------------------------------------------------------------

# 24. METRICS THAT MATTER

Track:

-   focused hours
-   independent coding %
-   problems solved
-   derivations completed
-   concepts at Gold+
-   projects completed
-   experiments run
-   papers deeply understood
-   papers reproduced
-   research hypotheses generated
-   baselines reproduced
-   ablations completed
-   reproducibility score

Do NOT emphasize: - videos watched - pages read - certificates - GitHub
commit spam

------------------------------------------------------------------------

# 25. ADAPTIVE ACCELERATION

The learner believes fast learning is a major advantage.

Exploit it scientifically.

At the beginning of each node: 1. diagnostic test 2. skip mastered
prerequisites 3. teach only gaps 4. mastery test 5. unlock immediately
if passed

If the learner learns a week's content in two days, advance.

If a critical concept takes two weeks, do not fake completion.

The calendar is a target, not a substitute for understanding.

------------------------------------------------------------------------

# 26. FAILURE MODES TO ACTIVELY PREVENT

The system must detect:

### Tutorial hell

Lots of consumption, little creation.

### AI dependency

Code works but learner cannot explain it.

### Math avoidance

Skipping equations and relying on intuition.

### Framework illusion

Knowing ROS/PyTorch commands but not underlying concepts.

### Paper tourism

Reading abstracts without reproducing anything.

### Breadth addiction

Jumping to every new model.

### Hardware distraction

Buying/building instead of learning the research problem.

### Premature frontier obsession

Trying to understand VLA papers without basic backprop/geometry.

### Perfection paralysis

Spending months "preparing" before experiments.

### Benchmark gaming

Optimizing a metric without understanding behavior.

Surface warnings in the dashboard.

------------------------------------------------------------------------

# 27. RESOURCE DATABASE --- REQUIRED FIELDS

Store resources structurally.

``` text
id
title
authors
institution
year
type
url
official_source
topic
subtopic
difficulty
prerequisites[]
required_sections[]
skip_sections[]
estimated_hours
required/recommended/reference
learning_objectives[]
exercises[]
mastery_test
project_links[]
paper_links[]
compute_requirements
last_verified
notes
```

Never bury resource URLs inside prose only.

------------------------------------------------------------------------

# 28. CURRICULUM ITEM SCHEMA

Every learning item should be structured approximately as:

``` text
ID
LEVEL
TITLE
WHY
PREREQUISITES
EXPECTED TIME
LEARNING OBJECTIVES
INTUITION
FORMAL THEORY
EQUATIONS
PRIMARY RESOURCE
EXACT SECTIONS
BACKUP RESOURCE
WHAT TO SKIP
DERIVATION
IMPLEMENTATION
EXERCISES
MASTERY TEST
PROJECT CONNECTION
PAPER CONNECTION
COMMON MISCONCEPTIONS
REVIEW SCHEDULE
UNLOCKS
```

------------------------------------------------------------------------

# 29. RESEARCH PAPER CARD SCHEMA

``` text
TITLE
AUTHORS
YEAR
AREA
PAPER URL
CODE URL
PROJECT URL
WHY IT MATTERS
PREREQUISITES
DIFFICULTY
READING ORDER
KEY FIGURES
KEY EQUATIONS
CORE CLAIMS
DATASET
BENCHMARK
BASELINES
COMPUTE
REPRODUCTION PLAN
KNOWN REPRODUCTION ISSUES
QUESTIONS TO ANSWER
EXTENSION IDEAS
STATUS
```

------------------------------------------------------------------------

# 30. FINAL 30-DAY RESEARCH MODE

The website UI should visibly change in Month 7.

Course dashboard becomes a research dashboard.

Daily cycle:

``` text
READ / THINK
      ↓
HYPOTHESIS
      ↓
IMPLEMENT
      ↓
RUN
      ↓
MEASURE
      ↓
FAIL / LEARN
      ↓
MODIFY
      ↓
RUN AGAIN
      ↓
WRITE
```

Require an experiment log every day.

End-of-program evaluation should resemble a research defense, not a
multiple-choice exam.

------------------------------------------------------------------------

# 31. FINAL CAPSTONE ACCEPTANCE CRITERIA

The 210-day program succeeds if the learner can demonstrate most of the
following:

## Programming

-   independently writes/debugs Python research code
-   competent NumPy/PyTorch
-   can read and modify necessary C++
-   comfortable in Linux/Git environments

## Mathematics

-   reads common ML/robotics notation
-   understands linear algebra/calculus/probability/optimization
    foundations
-   understands transformations/Jacobians
-   can derive key equations instead of treating them as magic

## ML/DL

-   understands training/generalization/backprop
-   understands CNN/attention/Transformers/ViTs
-   can implement smaller versions
-   can train/evaluate models

## Robotics

-   understands geometry/kinematics/dynamics/control/estimation
-   understands perception/planning
-   can work in simulation
-   understands ROS as system infrastructure

## Robot learning

-   understands RL and imitation learning
-   can train policies
-   understands robot datasets
-   understands distribution shift and evaluation

## Embodied intelligence

-   understands current VLA/generalist-policy landscape
-   understands world-model direction
-   understands cross-embodiment and sim-to-real challenges
-   can articulate major unsolved problems

## Research

-   reads papers critically
-   reproduces results
-   designs experiments
-   uses baselines
-   performs ablations
-   analyzes failures
-   writes evidence-backed conclusions
-   has tested at least one original hypothesis

------------------------------------------------------------------------

# 32. WHAT I WANT YOU TO DELIVER

After doing the research, produce the actual web application.

It should include:

1.  Full 210-day roadmap.
2.  Dependency-based skill tree.
3.  Day-by-day tasks.
4.  Exact resources and links.
5.  Exact textbook/course sections.
6.  Exercises.
7.  Mastery gates.
8.  Projects.
9.  Paper ladder.
10. Paper reader/tracker.
11. Experiment tracker.
12. Math lab.
13. Code lab.
14. Robotics lab.
15. ML lab.
16. Embodied-intelligence lab.
17. Frontier tracker.
18. Research idea inbox.
19. Weekly evaluations.
20. Boss fights.
21. Progress analytics.
22. Search/filtering.
23. Persistent progress.
24. Responsive mobile/desktop UI.
25. Export/backup of progress if practical.

The interface should be visually exceptional but extremely clear.

Design inspiration: - research command center - skill tree - technical
notebook - mission control

Avoid: - clutter - giant walls of text - childish game visuals -
excessive animations - generic SaaS dashboard appearance

The user should open it and immediately know:

> **WHAT DO I DO NEXT?**

------------------------------------------------------------------------

# 33. DO NOT LOSE THE CORE PHILOSOPHY

This is not a seven-month content binge.

The progression is:

``` text
LEARN
  ↓
DERIVE
  ↓
IMPLEMENT
  ↓
BUILD
  ↓
MEASURE
  ↓
READ RESEARCH
  ↓
REPRODUCE
  ↓
QUESTION
  ↓
EXPERIMENT
  ↓
DISCOVER
```

Move from learning to research as early as competence permits.

The destination is not knowing every fact.

The destination is becoming someone who can encounter a new
embodied-intelligence problem and independently determine:

-   what is known
-   what mathematics is needed
-   what code is needed
-   what experiment would answer the question
-   whether the evidence supports the hypothesis
-   what should be tried next

------------------------------------------------------------------------

# 34. FINAL INSTRUCTION TO CLAUDE

Do not immediately code the website after reading this file.

First:

1.  Research the present 2026 field deeply.
2.  Build a source-backed knowledge map.
3.  Audit this handover for missing prerequisites.
4.  Add missing critical topics.
5.  Remove obsolete/redundant topics.
6.  Determine the fastest dependency-respecting learning order.
7.  Select the best resources.
8.  Define mastery tests.
9.  Define projects.
10. Define paper ladder.
11. Define research progression.
12. Validate that the workload can plausibly fit \~210 days at \~5--7
    focused hours/day.
13. Clearly flag anything that cannot.
14. THEN build the application.

Do not dumb the curriculum down because the learner starts at zero.

Instead, create the **fastest bridge from zero to the frontier that
still preserves genuine understanding**.

Do not mistake speed for superficiality.

Do not mistake completeness for reading everything.

Do not let AI do the intellectual work the learner needs to acquire.

Continuously ask:

> **What is the minimum knowledge required to unlock the next genuinely
> important capability?**

And once it is mastered:

> **Advance.**
