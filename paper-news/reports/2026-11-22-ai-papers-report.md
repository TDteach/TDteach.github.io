# 2026-11-22

## Self-Disagreement trains a model to judge challenges to its own answers

*[Benchmarks Don't Talk Back: Learning Through Self-Disagreement](https://arxiv.org/abs/2611.17563v1)*

FlipFlop supplies the concrete failure mode: across the included conditions, models flipped about 46% of answers on average, and final accuracy was about 17 percentage points below initial accuracy. Its best reported Mistral-7B fine-tuning variant reduced the average drop from 9.5 to 3.8 points but did not eliminate it. SCoRe then showed that verifier-rewarded RL can improve a second attempt, reporting a +4.4-point attempt-to-attempt change on MATH500. These records motivate a narrower question: can training target judgment of a counterargument rather than only answer revision?

Self-Disagreement changes the unit of training. For each verifiable question, one policy produces a thesis, generates an answer-specific antithesis in a separate context without the reference, rules whether the antithesis stands, and answers again. The antithesis is sampled but not optimized; GRPO trains the answering turns, while exact-match verification scores answer correctness and whether the ruling agrees with the verifier’s judgment. The paper reports no reward model, preference data, human annotation, or second model at training or deployment.

On nine public benchmarks, challenge-time macro-average synthesis accuracy rose from 50.0% to 55.9% for Qwen3-8B and from 19.9% to 37.8% for Gemma-2 9B. On the 327-item disagreement probe, base Qwen3-8B and Gemma-2 9B held a correct first answer against a wrong challenger only 53.3% and 25.1% of the time, while yielding to a correct challenger 84.1% and 93.2% of the time. After training, hold rates were 88.9% and 89.5%, and yield rates were 53.3% and 55.4%; the models did not simply stop changing answers in the measured yield cases. A composition-versus-rate decomposition attributed most probe gain to decisions under challenge rather than merely better first answers, but only for the evaluated models and challengers. With the first answer and an external antithesis fixed, the advantage persisted by 6.2–14.1 points, with every training-seed interval above five.

The boundary matters. Every reward depends on exact-match verification against a reference, so transfer to tasks without checkable answers is unestablished. Main-text exchanges are single-round challenges; the appendix’s three-round experiment does not make repeated-challenge robustness the primary protocol. The authors also do not claim universality across model families or scales, and warn that a high jury score is not a certificate that reasoning is sound.

A practical replication is to report hold and yield rates separately, then rerun the fixed-challenge test while replacing exact-match with a task-appropriate verifier and extending the number of rounds. That experiment would test whether the learned decision policy transfers beyond the paper’s answer-verifiable, primarily one-round setting.

Read this to learn how to separate first-answer accuracy from the decision to hold or yield after a challenge, using a verifier-scored evaluation and a concrete RL training target.

[abstract; Section 3, paragraphs 1–3; Section 4.1, paragraph 2; Table 1](https://arxiv.org/abs/2611.17563v1) · [§5.1, Table 2 and accompanying text; §6.2, Table 4 and accompanying text](https://arxiv.org/abs/2311.08596v2) · [abstract; Section 6.1, Table 2](https://arxiv.org/abs/2409.12917v2)

## A Matched No-Critic Audit Finds Directional LLM Feedback Can Lower Finite-Budget AutoML Search

*[The Critic Can Hurt: On the Safety of Critics in LLM-Guided AutoML Search](https://arxiv.org/abs/2611.19037v1)*

The paper targets a concrete evaluation gap: critics are assessed for whether they help, but rarely for whether they can hurt. Instead of treating critique as an isolated text artifact, it audits the complete feedback-conditioned selection policy. Its four-arm audit isolates the critic’s marginal effect, while controlled fault injection tests how the loop responds to different error structures.

On the paper’s primary tabular audit, the Llama-3.1-8B feedback-conditioned selection policy fell below the no-critic random-search floor on seven of eight datasets, with a worst reported loss of 0.245 AUC. The audit used eight binary datasets, a shared frozen 96-configuration frontier, T=8, and eight matched seeds; its endpoint was final test AUC of the best validation incumbent. This is evidence for harm in the tested regime, not a claim that all critics or AutoML tasks are harmed.

Fault injection clarifies the mechanism. In the tested best-so-far search loop, random corruption remained close to the random-search floor even at a 100% corruption rate, whereas systematically adversarial corruption had a finite resilience threshold of 0.6–1.0 across the reported datasets. The intervention therefore points to error direction, not just error frequency, as the important variable under this setup.

An idealized effective-horizon model yields q(m−1)&gt;β as a necessary condition for a critic to outperform uniform search, but not a sufficient test; the paper does not identify q, m, or β for real critics. The mitigation results are exploratory, not evidence of dataset-wise safety. Across six datasets, the raw policy averages −0.00541 AUC relative to uniform, the simple non-improvement gate +0.00046, and the learned detector −0.00015. The deployable detector separated the paper’s labeled harmful transitions from other transitions with high leave-one-dataset-out AUC in the reported six-dataset evaluation. This supports detection as a promising component, not as a guarantee of safe search.

For agent researchers, the transferable operation is to benchmark the whole feedback-conditioned policy against a matched no-feedback control, inject random and directional faults separately, and test mitigation online. Boundaries matter: the audit measures the complete feedback-conditioned selection policy, including its parser and fallback, rather than the content of the critique in isolation. CritFault’s core labels are based on injected faults and one 8B critic, limiting what benchmark performance establishes about naturally occurring harmful feedback across models and settings. The paper also notes that neither learned detection nor classification AUC alone establishes floor preservation.

Read it to learn a concrete audit pattern for feedback-driven agents: compare with a matched no-feedback baseline, separate random from directional faults, and evaluate safeguards at the policy level.

[abstract](https://arxiv.org/abs/2611.19037v1)

## DistOPD Replaces Recorded-Token Scalar Supervision with Cached Candidate Distributions for Offline Search-Agent Distillation

*[Rethinking Offline On-Policy Distillation: From Scalar Advantages to Distributional Supervision](https://arxiv.org/abs/2611.18648v1)*

Offline on-policy distillation can remove live teacher scoring by generating fixed reference-policy rollouts once and caching the teacher’s token log-probabilities for optimization. Lightning OPD uses this workflow, but recorded-token scalar advantage supervision does not fully specify how probability should be allocated among alternative tokens.

The new paper reports a concrete failure in multi-turn agentic search: with a Qwen3-4B-Base student, Lightning OPD underperformed the same-teacher SFT reference on all five evaluated benchmarks. Average F1 fell by 3.3 points with MiroThinker-1.7-mini and 3.1 points with Qwen3-32B. The accompanying theorem gives a narrower explanation: under fixed-rollout and independent state-wise assumptions, scalar supervision fixes the recorded token’s probability while leaving alternative probabilities underdetermined. A logit-contracted solution is possible under additional conditions, but the analysis does not establish that this is the optimizer’s actual path or the cause of the measured degradation.

DistOPD changes the cached target rather than restoring live teacher inference. At selected positions, it retains high-probability candidate tokens supported by the reference or teacher, includes the recorded token, and aggregates omitted vocabulary mass into a residual token. It then geometrically interpolates reference and teacher probabilities over these cells and trains with forward KL. At unselected positions, it uses a recorded-token/residual two-cell target. The target is fixed before optimization, so selected candidates receive token-level corrections while allocation within the residual remains unspecified.

In the reported setup, DistOPD improved on the SFT reference across all five benchmarks for both teachers and achieved average F1 comparable to online OPD: 50.5 with MiroThinker-1.7-mini and 49.5 with Qwen3-32B, versus 49.6 and 48.4 for online OPD. Each main configuration was a single training run. For the Qwen3-32B experiment, DistOPD used 13.8 training GPU-hours, close to Lightning OPD’s 13.6 and below online OPD’s 146.0; its cache was larger, at 7.53 GiB versus 1.79 GiB.

The evidence has important boundaries. DistOPD’s reported alignment improvement is measured on selected candidate-and-residual partitions, not the full vocabulary, and changes in coarsened KL need not bound full-vocabulary KL. The experiments use one 4B student, and unavailable candidate probabilities in the top-256 scoring pass are approximated as zero.

A useful replication operation is to hold trajectories, teacher, optimizer, and budget fixed while swapping only scalar, candidate-plus-residual, and full-distribution targets. Track benchmark scores, entropy, both coarsened and full-vocabulary KL, cache size, and repeated seeds. The central research question is whether richer cached supervision itself survives that controlled comparison.

Read it to evaluate whether offline distillation for tool-using agents loses teacher preferences on fixed trajectories, using the paper’s accuracy, compute, cache, and alignment diagnostics as concrete comparison points.

[Section 2.3; Table 1; Section 2.4, Theorem 2.2; Assumption 2.1; Section 3.1, Caching procedure; Target construction; Training objective; Section 3.2; Table 1; Appendix B.2; Section 3.2; Appendix B.7; Table 11; Section 3.2; Appendix C.3-C.4; Table 13; Limitations; Appendix B.2, Optimization; Appendix C.3, KL divergence to the teacher; Appendix B.3, Cached supervision](https://arxiv.org/abs/2611.18648v1) · [§3.2, Stage 2: Offline On-Policy Distillation](https://arxiv.org/abs/2604.13010v2)

## In Four Tested Worlds, ICL Leads Standalone and GRPO Improves Every Tested ICL Policy

*[Where Should LLM Agents Adapt at Test Time? In Context, in Weights, or Both](https://arxiv.org/abs/2611.19700v1)*

### What changed

The paper frames the unresolved comparison as two adaptation channels—retaining experience in context and updating weights—that are usually studied separately, leaving unclear what each contributes and when they complement each other. Its methodological change is a prequential score-then-adapt protocol: each task is evaluated before its own outcomes enter context or update weights, so the main score tests transfer from earlier tasks in the stream. Under this protocol, the study compares ICL, GRPO, and SDPO alone and in combination using matched task streams. The main evaluation uses Qwen3.5-9B on 109 tasks from four environments, with five task orders per environment.

### What it finds

With frozen weights, the best tested ICL policy reaches 49.4% overall success, versus 28.8% for the stateless baseline. Adding GRPO raises the overall mean for every tested ICL policy; the best reported combination reaches 51.6%, while SDPO has mixed effects. These are complete adaptation procedures, not comparisons at equal compute or identical experience budgets, so the result should not be read as an isolated ranking of the GRPO and SDPO objectives.

### Behavioral clue, not mechanism

The authors report that ICL is associated with fewer repeated environment lookups and shorter attempts in several worlds, consistent with reusing information from retained trajectories. On BIRD, ICL increasingly submits without an exploratory query; the paper also reports more wrong submissions under ICL, but does not establish that skipping queries caused them. For the ICL–GRPO hybrid, querying initially declines but later recovers toward the frozen baseline, while the reported traces show preserved reductions in familiar-environment lookups alongside restored task-specific inspection and verification. These trace observations do not establish what causes the success gains.

### Research operation

For a new agent, the useful operation is to keep score-before-adapt fixed, then factorially vary context retention, update type, and equalized experience and optimizer budgets; interventions can test whether inspection and verification contribute to gains. The study’s scope remains one model, selected benchmark subsets, five task orders, and particular implementations, so broader generalization is not established. Read the result as a scoped comparison for designing such ablations, not as a general adaptation ranking.

Read it to choose the next ablation: it provides a shared score-before-adapt setup for testing context retention, weight updates, and their combination.

[abstract; Section 3.3, Scoring; Section 4.2; Table 2; Section 5.2, AppWorld behavioral analysis; Section 5.2, BIRD behavioral analysis; Section 6, BIRD querying analysis; Figures 7–9 are described in accompanying text; Appendix A.3, adaptation settings and implementation; Section 7, Scope and limitations](https://arxiv.org/abs/2611.19700v1)

## FlipTest Tests Whether Video World Models Track Physical Outcome Boundaries

*[The Flip Test: Video World Models Fail to Learn the World State](https://arxiv.org/abs/2611.19822v1)*

Physion provides a different baseline for physical prediction: its object-contact task asks whether two designated objects will meet before the scene settles. The benchmark uses short rendered clips, with the principal prediction readout exposing the first 1.5 seconds. Its particle-graph models receive simulator-derived physical state, so those results are not vision-only. This setup answers binary contact prediction and supports modality comparisons; it does not by itself answer whether a tiny image change flips a prediction at a known physical boundary.

FlipTest addresses that boundary question directly. It evaluates whether a small change to an initial frame changes the predicted future when the change crosses the outcome-controlling boundary. Its three-level design moves from visual minimal pairs, to matched same-side controls that test selectivity, to dense sweeps that test whether the model locates the boundary. The benchmark contains 1,680 initial frames from 10 simulated and 15 real-world tasks.

The result is poor boundary sensitivity under the reported evaluation. All 11 evaluated video world models fall short; the best average pair accuracy across real and simulated scenes is 18.3%, below the 25% random-guessing reference. Every model is below chance on simulated pairs. Pooled across clearly judged pairs, predictions remain identical for both frames in 72% of real pairs and 89% of simulated pairs, a failure that guarantees at least one wrong prediction when the ground-truth outcomes differ. On the tested simulated sweeps, pixel generators show little response to distance from the boundary, while direct VLM predictions vary but transition early relative to the true threshold.

The staged diagnostics are the most transferable contribution. Supplying the correct outcome raises the best model's pair accuracy from 18.3% to 73.7%, supporting the authors' diagnosis that inferring the relevant future from the frame is a major bottleneck; residual errors show that rendering remains imperfect. Explicit image measurement performs much better in this evaluation, with the reported measurement-based agent reaching 93.3% on real pairs and over 99% across the sweeps. For a new predictive model, borrow the benchmark's operation: create opposite-side pairs, matched same-side controls, and dense parameter sweeps, then separately test perception, state measurement, simulation, and rendering.

Scope matters. FlipTest studies threshold dynamics of mostly rigid objects from a single initial frame. Most real-task frames are edited or staged rather than initial frames from recorded physical outcomes. Generated-video outcomes are also judged: Gemini 3.6 Flash agreed with human labels on 79% of a manually labeled sample of 600 videos. The findings therefore motivate boundary-sensitive evaluation within this benchmark, not a general conclusion about all physical dynamics or real-world video prediction.

Read it for a concrete evaluation pattern: test both whether predictions flip at the true boundary and whether they remain stable for matched changes that should not matter, then separate state inference from rendering with measurement and outcome-conditioning interventions.

[abstract; Section 1, Introduction (S1.p4); Section 4.1, Video Models Rarely Solve Minimal Pairs (S4.SS1.p1); Section 4.1, Video Models Rarely Solve Minimal Pairs (S4.SS1.p2); Section 4.3, Video Models Do Not Locate the Boundary (S4.SS3.p1-p2); Section 5, Told the outcome, video models improve but still fail (S5.SS0.SSS0.Px2.p1); Section 5, Measuring the state recovers the boundary (S5.SS0.SSS0.Px3.p1); Appendix G, Limitations (A7.p1); Appendix A, Real-world tasks (A1.SS0.SSS0.Px2.p1); Appendix B, Agreement with human labels (A2.SS0.SSS0.Px5.p1)](https://arxiv.org/abs/2611.19822v1) · [Section 1.3, paragraph 1; Section 2.2, paragraph 2; Section 3, paragraph 2](https://arxiv.org/abs/2106.08261v3)
