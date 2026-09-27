# 2026-09-27

## OPD Prompt Breadth Has Opposite Effects Under Frozen and Refreshed Rollouts

*[Prompt Breadth and Rollout Refresh Interact in On-Policy Distillation](https://arxiv.org/abs/2609.25048v1)*

This paper treats prompt-bank size and rollout refresh as joint controls in on-policy distillation (OPD). Earlier one-shot OPD work reported that a single query’s rollouts reached 71.5% of a full-data reference state space by step 300, while 16 semantically distinct queries reached about 98.9% coverage and matched full-data OPD performance. That earlier evidence concerned query diversity and state coverage; this paper targets rollout refresh as a second control.

To test the interaction, the experiment uses a 3×3 mathematical-reasoning design that fixes 14,080 trajectories and 110 optimizer updates while varying the prompt bank and the number of response-generating policy snapshots. Matched 48-prompt experiments compare periodic and frozen response generation using macro3 average accuracy, pass@32, and parseable fraction.

The central result reverses the usual interpretation of “more prompts.” With responses frozen at the initial policy, increasing breadth lowers average accuracy from 21.16% to 19.05%; under per-update refresh, it raises accuracy from 23.61% to 25.57%. The interaction is 4.07 percentage points, with a 95% question-paired interval of [2.00, 6.28]. Yet breadth is not always necessary when responses refresh: with ten snapshots, eight prompts reach 24.09% average accuracy, close to 24.51% for 14,080 distinct prompts.

Refresh also changes what the model can produce at inference. In matched 48-prompt experiments, periodic response generation substantially increases sampled coverage and parseability relative to frozen responses: pass@32 rises by 12.69 points and parseability by 40.15 points with the Qwen3 teacher. At short output budgets, periodic models have higher accuracy and answer completion, but frozen-response models overtake in average accuracy at a 32K output limit while using 1.7–1.8× as many response tokens.

For a follow-up, run a small breadth-by-refresh matrix before scaling OPD: hold trajectories and optimizer updates fixed, inspect accuracy, pass@32, parseability, and response tokens together, then repeat cells across seeds and add a token-matched comparison. The result should be treated as a tested interaction rather than a general rule. Results are measured on a single student model and a mathematics benchmark suite; each main grid cell is a single training run, and response lengths—and therefore token-level compute—differ across cells despite matched trajectories and optimizer updates.

To learn how to design a small OPD pilot that separates prompt diversity from rollout freshness before committing to a larger training run.

[abstract; S5.SS1.p2; Table 2 (S5.T2); S7.SS0.SSS0.Px1.p1; Sx1.p1; S7.SS0.SSS0.Px2.p1](https://arxiv.org/abs/2609.25048v1) · [§4.1 State Coverage of One-Shot OPD (S4.SS1.SSS0.Px2.p1); §4.2 Diversity Expands State Coverage (S4.SS2.SSS0.Px2.p1)](https://arxiv.org/abs/2609.04172v1)

## ToolCompass Guides Unseen-Tool Trialing by Shaping Function-Level Representations

*[Toolcompass: Guiding Tool Trialing, Not Suppressing It](https://arxiv.org/abs/2609.25678v1)*

Tool-using LLM agents face a trialing problem: excessive trials waste the interaction budget, while selective trials enable exploration of unfamiliar tools. Existing outcome-based post-training leaves wasteful trials unguided, whereas turn-level supervision may suppress necessary exploration.

ToolCompass models each function class on the unit hypersphere as a von Mises–Fisher (vMF) directional distribution so calls that implement the same function (even across different domains) are driven toward a shared prototype direction. This structure transfers experience from seen tools to functionally similar unseen tools, directing exploration away from unrelated alternatives. ToolCompass needs only function-class labels for seen tools during post-training; it does not require per-turn ground-truth call traces, access to unseen tools, or auxiliary frozen turn-level scorers. The framework incurs no inference overhead.

Across host post-training objectives (GRPO/RFT/DMPO) and two model scales, augmenting with ToolCompass yields consistent gains in ID, OOD, and total performance; reported gains include +9.18/+10.79 percentage points on total scores for AppWorld/FTRL with GRPO on Qwen3.5-4B.

The call analysis gives the mechanism a behavioral check. ToolCompass reduces unproductive tool calls while preserving or increasing useful trialing: it makes fewer total calls than vanilla GRPO, retains more useful trials, and substantially cuts unproductive trials in the evaluated AppWorld OOD tasks. Specifically, it averages 26.51 total calls versus 31.55 for vanilla GRPO, 12.61 useful trials versus 10.47, and 4.07 unproductive trials versus 12.75. Thus, in this setting, the reduction is not just fewer calls: useful trialing is retained while unproductive trialing falls.

The practical boundary is explicit: function-class labels for seen tools are required, even though traces and unseen-tool access are not. The reported benchmarks here are AppWorld and FTRL. Treat transfer beyond those settings as a follow-up test rather than as a result established by this paper.

A useful research operation is to train one host objective with and without the representation loss, keep the seen/unseen split fixed, and log total, useful, and unproductive calls separately. Then perturb the function labels and prototype-update setting. The question to carry forward is specific: does OOD improvement survive imperfect function geometry, or does it depend on clean labels and stable prototype updates? That experiment tests the proposed transfer mechanism directly instead of using total success alone.

Read it to study a training-only representation loss that changes useful-versus-unproductive trial counts, then reuse its logging setup to test whether your own function labels transfer to unseen tools.

[abstract; Section 3.2 (S3.SS2.p1.1); Introduction (S1.p6); Section 4.2 (S4.SS2.p1.1); Section 4.3 (S4.SS3.p8.1)](https://arxiv.org/abs/2609.25678v1)

## Terminal Shrinkage Averaging reveals a schedule–estimator interaction in LLM pretraining

*[Terminal Shrinkage Averaging Reveals a Schedule-Estimator Interaction in LLM Pretraining](https://arxiv.org/abs/2609.25482v1)*

LLM pretraining conventionally returns the raw final iterate. This couples two design choices: the learning-rate schedule that generates the parameter trajectory and the estimator that constructs the deployed model (e.g. the raw final iterate or a checkpoint average). That is the concrete limitation TSA targets: if the deployed model is averaged, evaluating only the raw final iterate entangles schedule quality with estimator choice.

TSA interpolates between the raw final iterate and the average of recent checkpoints to balance recent progress against terminal variation. Under a local quadratic approximation the expected excess risk of TSA is an explicit convex quadratic in α with solution α* = Π_&#91;0,1&#93;((⟨m,A⟩_H − C)/(‖A‖_H^2 + V_q)) when the denominator is positive. For a fixed saved trajectory, this makes estimator selection a small post-hoc sweep rather than a new training run, while retaining a bias–variance lens for interpreting the result.

The decisive controlled result is conditional rather than universal. The depth-12 NanoChat confirmation used a 5% terminal learning-rate floor, five paired trajectories, and TSA with K=8 checkpoints spaced 32 steps apart. On depth-12 NanoChat at the 5% terminal floor, partial shrinkage (e.g. α≈0.40–0.55) reliably improves validation BPB over the raw final iterate, while full uniform averaging (LAWA, α=1) can worsen BPB. The selected recipe also transferred directionally: in depth-22 NanoChat matched-endpoint runs (three seeds), adding a 15% terminal floor plus TSA (α=0.70, K=8) produced a small but consistent BPB improvement relative to the calibrated baseline; CORE qualification was obtained in one of three seeds, so the speedrun result is preliminary.

A useful replication operation is to hold the training trajectory and held-out evaluation batches fixed, save the last eight checkpoints, and compare α=0, an interior value, and α=1 across several terminal learning-rate floors. The question to record is not simply which floor wins, but whether the winning floor changes with the returned estimator.

This is not a general schedule law. The theory relies on a local quadratic surrogate intended to explain late-training behavior only; it does not claim a global characterization of neural-network optimization. Empirical results are limited to NanoChat (depth-12 controlled experiments and depth-22 preliminary transfer); external generalization is not established. Averaging also has memory/storage costs; the paper notes heterogeneity and offers mitigations but does not eliminate resource concerns.

Run a small post-hoc sweep over recent-checkpoint shrinkage while varying the terminal learning-rate floor, so schedule tuning is evaluated on the estimator you would actually deploy.

[abstract; S3.SS1 (Theorem 1) (equations 11–13); S4.SS1.p2; S4.SS5.p2; S5.SS0.SSS0.Px1.p1.1](https://arxiv.org/abs/2609.25482v1)

## LEMA turns exact binary matches into dictionary-backed transformer memory

*[Latest Exact Match Attention](https://arxiv.org/abs/2609.25802v1)*

LEMA changes the retrieval primitive: each head binarizes queries and keys coordinatewise, then returns the value attached to the latest prior key that matches exactly. At inference, a head's key-value state can be stored as a main-memory dictionary: each token needs one lookup and one insert, while an existing key overwrites its old value. Training uses a straight-through estimator for binarization and a soft attention surrogate annealed toward LEMA because the hard operations are non-differentiable.

The architectural trade is visible in the associative-recall setup: LEMA uses a growing state, whereas gated DeltaNet (GDN) is evaluated with a fixed-size state. On the theory side, Theorem 1 constructs a LEMA transformer with chain-of-thought that simulates a word-RAM with an O(w) time blowup per RAM step and O(s_M(x)+w) distinct keys. Conversely, Theorem 2 gives a word-RAM that can autoregressively generate any LEMA transformer with O(N) work per processed token, with space growing according to the number of distinct keys and head dimension.

Empirically, on a controlled synthetic associative-recall task, LEMA trained with the surrogate and hardening procedure stores and recalls many more associations than fixed-state GDN. Scaling experiments up to 834 million parameters report cross-entropy comparable to softmax transformers of roughly half the parameter count. The paper also reports that LEMA remains behind softmax transformers on repeated rare phrases and needle retrieval, while recalling across longer distances than comparable GDN models.

The inference result has a systems condition: a main-memory open-addressing hash-table implementation provides near-constant per-token generation time, comparable to GDN, until the table approaches capacity. The training boundary is separate and important: the proposed surrogate still requires quadratic compute in sequence length, so the paper does not provide a subquadratic training algorithm.

A useful replication question is whether the retrieval benefit survives when parameter count, context distribution, and table occupancy are controlled together: sweep context distance and hash-table load, compare LEMA with fixed-state GDN and softmax at matched loss, and report recall alongside training and generation cost.

I read this to test whether replacing similarity lookup with exact binary matching can support a growing main-memory state and context-length-independent per-token inference without giving up recall on controlled and language-model tasks.

[abstract; S1.p3; Thmtheorem1 / S3.Ex2; Thmtheorem2 / S3.Ex5; Abstract / S1.p6 / S4.SS2; Abstract / S1.p6 / S4.SS3.p1; S1.p7 / S5.SS1.SSS0.Px2; S6.p2](https://arxiv.org/abs/2609.25802v1)

## CPZ Propagation Lifts Single-Input Attention Findings to Bounded-Neighbourhood Certificates

*[Certified Mechanistic Interpretability: Lifting Single-Input Findings to Bounded Neighbourhoods](https://arxiv.org/abs/2609.26112v1)*

Mechanistic interpretability reverse-engineers transformer circuits one input at a time, leaving observed mechanisms without guarantees over bounded input neighbourhoods. This paper addresses that gap by lifting observations to certified statements over bounded perturbation sets. Its target is internal attention: the certified queries are top-k stability, evidence mass, and attention entropy.

The method represents bounded embedding-space perturbation sets with constrained polynomial zonotopes (CPZs), propagates them through transformer blocks, and formulates the three attention queries as tractable programs over the attention-weight simplex. Its central algebraic move is retaining exact $Q^&#123;\top&#125;K$ bilinear structure under CPZ algebra, so shared polynomial dependencies are not discarded by interval-style treatment. That exactness is conditional: the supplied result specifies affine and bilinear exactness when no LayerNorm precedes $Q^&#123;\top&#125;K$. At relevant constraint points, CPZ propagation preserves the softmax simplex and the LayerNorm zero-mean identity exactly after mergeID alignment. For depth, a recursive Jacobian-zonotope construction linearises the block stack at the input and avoids per-layer generator growth.

The decisive evidence is a sound, though not always tight, closed-form upper bound for degree-2 CPZ polynomials. In the stated post-LN Layer-0 setting, that bound underlies an optimisation-free top-1 certificate. This gives the reader a concrete research operation: when an attention-head explanation is observed on one prompt, define a bounded embedding-space neighbourhood, express the claim as a certified attention query, and report whether the resulting bound preserves the claim throughout that set rather than relying on the original example alone.

The boundary is important. The supplied limitation states that discrete-token substitutions and counterfactual analyses are out of scope; the method addresses continuous embedding-space perturbations only. A positive certificate should therefore be read as robustness within the specified continuous neighbourhood, not as a token-level guarantee. The quadratic bound may also be loose, so “certified” establishes soundness of the stated bound, not necessarily a tight description of the full reachable attention behaviour.

I read this paper to learn how to turn an attention-head claim observed on one prompt into a worst-case test over a specified embedding-space neighbourhood.

[abstract; \[S1.F1\] Figure 1 caption; \[abstract1.1\]; \[Thmlemma1.p1.1\]; \[S6.SS0.SSS0.Px5.p1\]](https://arxiv.org/abs/2609.26112v1)
