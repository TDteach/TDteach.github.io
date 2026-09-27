# 2026-09-26

## ReliabilityRoute Routes Forecasting Mechanisms with Reliability Features

*[When Should Forecasting Agents Reason? Behavioral Stress Tests for Reliability Routing](https://arxiv.org/abs/2609.28475v1)*

Forecasting agents increasingly combine language-model reasoning, retrieval, market priors, and historical analogs, but the paper treats the choice among them as an observable behavior rather than a hidden implementation detail. On ForecastBench-style binary tasks, it reports that structured analogs dominate for some data-generating processes, while market/crowd-style and conservative baselines are better for others.

The method change is ReliabilityRoute: a rule-based router that uses historical coverage, market-prior availability and sharpness, source-prior sharpness, evidence strength, evidence disagreement, and horizon to decide which mechanism controls a forecast. One fixed rule is fitted on a 2024 calibration vintage; a self-adjusting version refits thresholds walk-forward from previously resolved vintages. The rule uses reliability features rather than hard-coded source-name decisions, making its routing trace inspectable.

On the 2025-10-26 evaluation vintage, the fixed rule achieved Brier 0.1846 versus 0.1876 for HistoricalAnalog, without retuning. The paper’s limitation is important: the paired bootstrap interval against the strongest single baseline slightly overlaps zero, so this single-vintage gain is not statistically decisive in the supplied evidence. Across 16 later LLM-written vintages, the self-adjusting router reached mean Brier 0.1839 versus 0.1867 for the fixed rule and won 7 of 16 vintages.

The negative results clarify what not to assume. A per-source fitted router scored 0.1949 on the 2025 evaluation, which the paper interprets as overfitting to calibration-vintage source artifacts. Platt-style global calibration increased Brier from 0.1846 to 0.1882, while source-conditional calibration increased it to 0.2004. Comparisons involving the reproduced multi-agent baseline also are not a faithful reproduction of the external AIA Forecaster system.

For a follow-up experiment, log every reliability feature, threshold decision, and route before resolution; refit only with previously resolved vintages; and report Brier together with calibration error. The paper specifically identifies nested development splits and external forecasting datasets as needed tests of whether its human-designed rule family generalizes. The transferable question is therefore not simply whether reasoning helps, but which observable reliability signals justify giving reasoning control on a new vintage.

Read it to learn how to turn the choice between reasoning and simpler forecasting sources into an auditable, walk-forward routing experiment while testing overfitting and calibration-transfer failures.

[abstract; §4.3 Multi-Vintage Stress Test (S4.SS3.p1) and Table 4 (S4.T4); §4.2 Behavioral Route Diagnostics (S4.SS2.p1.1) and Table 3 (S4.T3); §1 (S1.p4) and Table 2 (S4.T2); §6 Limitations (S6.p1.1); §4.5 Ablations and Negative Results (S4.SS5.p1.1) and Table 2 (S4.T2); §4.5 Ablations and Negative Results (S4.SS5.p2.1) and Table 6 (S4.T6)](https://arxiv.org/abs/2609.28475v1)

## CC-SMCS turns coverage-constrained conformal model selection into time-uniform confidence-set inference

*[Sequential Confidence Sets for Coverage-Constrained Conformal Model Selection](https://arxiv.org/abs/2609.28522v1)*

Coverage-constrained conformal model selection has a different inferential target from ordinary argmin inference: a pipeline must satisfy monitored miscoverage constraints before its cost can be compared. The supplied prior argmin paper uses a cross-validated soft-min competitor to infer the minimum-mean coordinate in batch data. Its reported validity is asymptotic and marginal for each true argmin index, under IID bounded observations and the stability condition λ_n=o(√n).

CC-SMCS changes the target to the constrained argmin over adaptive conformal pipelines. It builds simultaneous martingale confidence sequences for prefix-average conditional miscoverage for every method–constraint pair, then treats their product as a rectangular confidence region. It reports three distinct outputs: certified feasible, possibly feasible, and possibly constrained-optimal pipelines.

The projection has a direct operational rule: retain a method if its lower confidence bounds do not rule out feasibility for any constraint and its observed cost is no larger than the smallest observed cost among certified-feasible methods. Under Assumption 5.1’s fixed numbers of methods and constraints, preallocated error weights, predictable exposures and costs, and the stated martingale construction, Theorem 5.2 gives a finite-sample, time-uniform guarantee: simultaneously over all times, certified-feasible methods are truly feasible, the true feasible set is contained in the possibly-feasible set, and every constrained-optimal method is in the projected model confidence set. The guarantee is stated to require neither stationarity nor mixing and to remain valid under data-dependent stopping. With persistent exposure, the confidence radii shrink at the reported order O(√((log t + log(MR/δ))/t)).

The qualification is important: the projected set is an outer confidence set for the constrained optimizer, not a post-selection coverage contract; it may contain methods that are not truly feasible. At the coverage boundary p=τ, the paper’s two-candidate Bernoulli example shows that uniform oracle-coverage requirements can limit the probability of ever reporting a singleton that excludes the other candidate to at most δ, even when a cheaper candidate exists.

For a new sequential evaluation, predeclare constraints and costs, allocate error across method–constraint pairs, run the confidence sequences, and decide whether deployment needs certified feasibility or only uncertainty about the optimizer. The transferable research question is how much evidence is needed to distinguish those decision requirements when coverage is close to its threshold.

Read this to learn how to replace premature winner declarations with time-uniform confidence sets when conformal model choice must satisfy coverage constraints, and to see why safe singleton identification can fail at the coverage boundary.

[abstract; Theorem 5.2 (S5.Thmtheorem2; S5.E17); Proposition 4.1 (S4.Thmtheorem1; S4.E16); Section 5.2 (S5.SS2; S5.E18) and Appendix B.4 (A2.SS4, Proposition B.5); Proposition 5.3 (S5.SS3; S5.Ex7); S1.p4](https://arxiv.org/abs/2609.28522v1) · [§2 Algorithm 1 (Equation (5)); §3 Theorem 3.1 (Equation (7)); §3 Corollary 3.5 (Equation (7) / Corollary statement)](https://arxiv.org/abs/2408.02060v4)

## RECLAIM Measures Agent Reproduction Across Run, Retrain, and Reimplement Tiers

*[RECLAIM: Can Agents Reproduce the Claims of Machine Learning Papers?](https://arxiv.org/abs/2609.28850v1)*

**Prior benchmark boundary.** CORE-Bench deliberately sampled only CodeOcean capsules that were reproducible. RECLAIM changes that boundary by making author artifact availability an explicit task variable: it is a benchmark of 100 NeurIPS 2025 papers that can be rebuilt yearly from new conferences.

For each paper, RECLAIM fixes in advance the result to reproduce, what counts as a successful reproduction, and a GPU-hour budget. What the authors released decides the difficulty tier. Run-tier releases include code, data, and weights; Retrain-tier releases lack weights, so the agent trains the model; Reimplement-tier releases lack code, so the agent writes it. An agent must reproduce that result using the paper and whatever its authors released.

A separate language model grades runs from logs and outputs rather than agents' reports. The automated LLM auditor, Claude Sonnet 5, agrees with human graders on the reproduced/unreproduced verdict with F1=0.82. This makes execution provenance part of the benchmark output rather than relying only on an agent's success narrative.

Across four agents run once per paper, the best agent in each tier reproduces only 41% of Run-tier papers, 27% at Retrain, and 15% at Reimplement. Failed attempts use on average 29% of their allocated GPU-hours. The most common agent error is writing the method without checking any part against the paper's numbers, in 63 of 400 runs. The actionable lesson is to require an early numerical check before spending the remaining budget on implementation or debugging.

**Boundary.** RECLAIM has no human reproduction on its cluster, so for the 76 runs that executed a faithful pipeline and landed outside tolerance it cannot separate agent error from seed and hardware variance. The paper also reports a contamination risk: every agent postdates the papers and may have trained on their code, and a memorized fix would count as reproduced under the grading, inflating the released-code tiers.

**Research operation.** For a small study, select papers across the three tiers, precommit one match target and success criterion per paper, set a GPU-hour grant, preserve logs and outputs, and add a human rerun for failed-but-faithful pipelines. That last comparison tests whether a miss reflects the agent or ordinary experimental variance before attributing it to an agent-improvement intervention.

Read it to borrow a paper-level reproduction protocol that separates artifact availability from agent performance and preserves execution evidence for auditing.

[abstract](https://arxiv.org/abs/2609.28850v1) · [Section 2.1 (S2.SS1.p3)](https://arxiv.org/abs/2409.11363v2)

## Causal Interventions Identify Grounding as the Main Downstream Error Source in Video Agents

*[Beneath the Scores: Rethinking Hallucination Evaluation for Video Understanding Models](https://arxiv.org/abs/2609.28991v1)*

Video agents are increasingly built as multi-stage systems that separate temporal grounding, visual observation, and reasoning. The paper argues that scores from separate stage benchmarks are inconsistent diagnostic signals: a strong stage score does not necessarily indicate lower downstream hallucination or answer error.

Its method replaces cross-benchmark correlation with controlled stage intervention. On 2,522 CG-Bench questions spanning 227 long videos, the study overwrote grounding with oracle or length-matched random windows across three video-agent architectures, then measured the change in the fixed downstream task. With grounding pinned to the oracle window, it also tested visual-observation failures by omitting sampled frames or replacing them with frames sampled at least 60 seconds away from the evidence region.

The decisive result is that giving the true temporal evidence window instead of a random same-length window improves downstream accuracy by about 17–18 percentage points across the three architectures. This effect is roughly four times larger than the effect of substantial frame corruption within the correct window. The deployed grounders recover only about one quarter of the available oracle-to-random accuracy gap, leaving roughly 12–13 points of measured headroom.

The intervention design also changes what “good grounding” should mean. Expanding a correct evidence window by up to roughly eight times does not materially reduce accuracy, suggesting that including the right region matters more than tight temporal overlap. Conversely, plausible off-target frames damage accuracy more than comparable omission. For evaluation design, this favors testing whether evidence is on-target and whether the system resists misleading evidence, not relying on overlap or completeness alone.

The paper’s evidence-level diagnosis finds that 42–65% of answers marked correct by final-answer accuracy lack sufficient visual evidence, while some hallucination metrics lose discriminative power under distribution shift. Its benchmark audit likewise finds no detectable association between standard benchmark scores and causal sensitivity to grounding interventions.

A transferable experiment is to keep the downstream question fixed, overwrite one internal stage at a time, and report paired changes against a controlled baseline. This turns “which module failed?” into a testable causal question. Interpret the result narrowly: the main causal analysis measures downstream answer accuracy rather than unsupported-content hallucination, system-level correlations have wide uncertainty, and only one checkpoint per agent family was evaluated.

Use the paper's stage-overwrite protocol to test whether a weakness in your own video agent is causally attributable to grounding, observation, or another stage.

[abstract; S3.SS2.p1; S3.T3](https://arxiv.org/abs/2609.28991v1)

## Alternative tokenizations can bypass localized knowledge edits in open-weight LLMs

*[The Tokens Remember: When Tokenization Bypasses Knowledge Editing and Unlearning](https://arxiv.org/abs/2609.29045v1)*

Model editing and machine unlearning aim to modify or remove targeted knowledge without retraining from scratch. The paper identifies two security-evaluation gaps: prior checks often need the original pre-edit model or auxiliary classifiers, and they usually test only the canonical tokenization of an input. That second choice matters because the same string can have alternative valid tokenizations that induce different computational trajectories and may bypass a localized modification.

Toketive makes those alternatives the probe rather than treating tokenization as benign preprocessing. It is a reference-free attack that operates on the released model, without the pre-edit model, training data, shadow models, or auxiliary classifiers. It uses alternative tokenizations to detect modified facts and reconstruct the corresponding pre-edit response. A key routing signal is representational entanglement: cosine similarity between subject-final hidden states at an intermediate layer; the paper reports that it predicts retrieval of the canonical factual object better than edit distance across the tested datasets and models.

Empirically, across five LLMs, six datasets, and six editing/unlearning techniques, 38.6% of alternative tokenizations bypassed the modification and recovered the pre-edit response. Detection reached F1 84.2%, a 26.2% relative gain over the strongest baseline. Reconstruction reached 74.5% top-5 accuracy, 21.7% above the best baseline; this metric counts whether the ground-truth pre-edit object appears among the five most frequent bypass candidates under the reported plurality-voting setup.

The result is bounded by the attack’s search procedure: the sampler does not exhaustively enumerate tokenization space, so success depends on its attempt budget and hyperparameters. The detection threshold was calibrated on one held-out Llama3-plus-MEMIT configuration, making calibration a relevant replication variable. An adaptive-defense experiment reduced bypass rate from 0.32 to 0.04 after four repeated MEMIT iterations, but the paper reports dramatically larger collateral ripple effects.

A practical research operation is to take one edited fact, generate exact-string alternative segmentations, and log both the response and an intermediate hidden-state similarity score. Compare bypass rate under a fixed budget before treating the edit as a security boundary; then repeat with a larger budget and report how threshold calibration changes the result.

Read it to turn tokenization variation into a concrete 30-minute audit of whether an edited fact remains suppressed, while keeping the attack’s open-weight and sampling-budget assumptions explicit.

[Abstract (abstract1.1); abstract; V-B (S5.SS2.p6) and Fig. 4 caption (S5.F4); Abstract (abstract1.2) and V-D (S5.SS4.p8, Table V); IV-B3 (S4.SS2.SSS3.p7) and Appendix C (Sx6); Appendix E (Sx8.SS0.SSS0.Px1, Px2); Appendix A (Sx4.p5) and Table VIII (Sx4.T8)](https://arxiv.org/abs/2609.29045v1)

Prepared retrospectively from the 2026-09-26 candidate papers; verified on 2026-09-27.
