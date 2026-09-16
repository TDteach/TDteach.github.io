# 2026-09-15

## ATR Rechecks Only Decision Conditions Affected by State Changes

*[From Version Conflicts to Decision Conflicts: Selective Revalidation for Long-Running AI Agents](https://arxiv.org/abs/2609.08015v1)*

Long-running agents may read state, reason, wait for tools or approval, and act after the state that justified the action has changed. The paper identifies a precise limitation of ordinary version checking: detecting a changed resource version does not by itself determine whether the pending action’s justification is now invalid. The authors call the former a *version conflict* and reserve *decision conflict* for a change that falsifies, or makes unverifiable, a premise required by a pending intent.

ATR records explicit, executable premises behind a pending action. When related state changes—or immediately before execution—it follows recorded dependencies and rechecks only the affected conditions. Declared outcomes allow the runtime to retain an action, refresh non-decisive metadata, require replanning, or block execution. The protocol also binds checked state to a target-side transaction or compare-and-set operation, rather than treating pre-effect validation as sufficient on its own. In a deliberately scheduled cross-resource history, target-only CAS committed 100/100 effects after the policy limit became false; adding the checked policy token rejected 100/100.

The controlled evaluation matched every developer-specified outcome, with no false allows or blocks, across 210,000 executions covering 15 mutation cases. Selectivity was also measurable in ten durable SQLite checkpoint/resume cells: ATR evaluated 0.6 conditions per change, versus 6.0 for FullScan. At 4,093 recorded reads, the abstract reports 9.3 microseconds for ATR versus 2595.9 microseconds for FullScan. These figures describe a Python prototype with developer-authored premises and deterministic workloads, so they support controlled feasibility rather than a production latency estimate.

The main engineering question is not merely whether a state version changed, but whether the runtime captured every dependency needed to judge the pending decision. This condition is consequential: randomly omitting the sole critical dependency edge produced false-allow rates of 0.95%, 5.05%, and 9.97% at 1%, 5%, and 10% omission. The paper also does not claim distributed cross-system atomicity or exactly-once external effects; its gate applies only to evidence explicitly bound into the target.

A useful research operation is to implement one pending-action type with explicit premises, then fault-inject missing dependency edges and policy changes. Measure both unnecessary replans and false allows, and ask whether the eventual target can atomically enforce the checked evidence token. That experiment tests the dependency-capture and target-enforcement assumptions on which selective revalidation depends.

Study a concrete protocol for replacing blanket retries with premise-level revalidation, then reuse its dependency-omission fault-injection test in an agent runtime.

[Abstract; §2.2; §3.1–§3.2; §5](https://arxiv.org/abs/2609.08015v1)

## CausalVerify scores executed causal workflows against a fixed realised-data estimate

*[CausalVerify: An Execution-Grounded Benchmark for LLM Causal Inference Workflows](https://arxiv.org/abs/2609.07944v1)*

CausalVerify isolates a specific failure point in LLM-assisted causal analysis: after the research question, data description, and institutional context are specified, can an executed workflow return a benchmark-fixed treatment-effect estimate? (CausalVerify, S1.p3.1; S4.SS0.SSS0.Px1.p1.2)

It separates interpretation from verification with two tracks. Experiment A uses 259 reconstructed published-economics papers and four-LLM consensus labels to score method-family and direction agreement; Experiment B uses 100 fixed-seed synthetic scenarios across difference-in-differences, event study, instrumental-variable, and regression-discontinuity designs. (CausalVerify, S1.p3.1) Each model produces single-shot R code that is executed, and L2b+ marks the extracted scalar coefficient correct when its relative error against the canonical realised-data estimate is at most the default tolerance of 50%. (CausalVerify, S4.SS0.SSS0.Px1.p1.2)

The decisive result is that code execution is not equivalent to numeric correctness. At the default 50% tolerance, the seven evaluated LLMs span L2b+ pass rates of 10% to 88%. (CausalVerify, Abstract) Of the 426 workflows that execute, 66 (15.5%) return a wrong estimate. (CausalVerify, S5.SS0.SSS0.Px2.p1) Execution-based ranking agrees with L2b+ much more closely than text-direction scoring: Kendall’s τ is 0.81 and Spearman’s ρ is 0.93 for L2b, while L4’s Kendall’s τ ranges from −0.20 to 0.10. (CausalVerify, Abstract) Under the tested retrospective confidence prompt, self-reported confidence does not reliably separate correct from incorrect workflows. (CausalVerify, S5.SS0.SSS0.Px5.p1)

CausalReasoningBenchmark scores structured identification separately from numerical estimation. (CausalReasoningBenchmark, Abstract / [abstract1.1] and Section 3 (S3.p1–S3.p3)) CausalVerify instead fixes synthetic realised-data targets for execution checks. (CausalVerify, S1.p3.1) The complementary design makes a useful research operation explicit: freeze the realised dataset and canonical estimator before evaluation, execute each generated analysis, extract the reported scalar, and score agreement rather than code execution alone. (CausalVerify, S4.SS0.SSS0.Px1.p1.2)

Do not interpret these pass rates as general causal-inference ability. Experiment B is synthetic and structured, measuring textbook workflows on known CSV data rather than an entire empirical research project. (CausalVerify, S7.p2) Its R backend is fixed, so the magnitudes are backend-specific. (CausalVerify, S7.p3) The real-paper track also uses four-LLM consensus labels; a completed 30-paper ambiguity audit agreed with consensus on 60.0% of method labels and 47.6% of direction labels, with Cohen’s κ=0.294 for direction. (CausalVerify, S7.p1)

Read it to learn how to construct an execution-grounded check for generated causal code while assessing the realism and backend trade-offs.

[Abstract; S1.p3.1; S4.SS0.SSS0.Px1.p1.2; S5.SS0.SSS0.Px2.p1; S5.SS0.SSS0.Px5.p1; S7.p1; S7.p2; S7.p3](https://arxiv.org/abs/2609.07944v1) · [Abstract / \[abstract1.1\] and Section 3 (S3.p1–S3.p3)](https://arxiv.org/abs/2602.20571v2)

## TaskGuard Uses Restoration Residuals and Detector Sensitivity to Choose Restore or Preserve

*[TaskGuard: Task-Conditioned Restoration Utility for Risk-Aware Object Detection](https://arxiv.org/abs/2609.08011v1)*

Restore-first detection pipelines have a concrete failure mode: an image can look better after restoration without improving downstream detection. TaskGuard turns that mismatch into a Restore-or-Preserve decision for each candidate, rather than assuming restoration should always be accepted.

The setup keeps both the restorer and detector frozen. Given a degraded image `I_d` and candidate `I_c`, the controller forms the realized residual `R = I_c - I_d`. It then couples that actual image-change direction to detector sensitivity: pseudo-labels are obtained from detections on `I_c`, the detector loss gradient is evaluated at `I_d`, and regional scores are computed from the gradient–residual interaction. Detector-response and residual statistics are added to the task-gradient features. This is the key method change: utility is estimated from what the intervention changed and how the detector responds, not from appearance alone.

TaskGuard fits a Ridge utility predictor on Gaussian degradation. It uses 50 fold-specific regressors, averages their predictions, and freezes a single threshold selected from Gaussian TRAIN out-of-fold predictions under a 98% benefit-retention rule; validation and test data are not used to retune it. That protocol makes the transfer question explicit: can a controller learned on one degradation family decide when to accept candidates from others?

On unseen motion blur, rain, and defocus, the paper reports 54.2% fewer loss-negative interventions (family macro) and 37.0% fewer practical per-image detection deteriorations (pooled), while retaining 98.8% of Always-Restore COCO AP. A post-freeze feature ablation supports the directional component: task-gradient features achieve family-macro Spearman ρ_s = 0.631, versus 0.480 for detector-response features and 0.240 for residual-only features. On natural-rain DAWN, TaskGuard reduces loss-negative interventions by 97.9% while retaining 77.8% of the AP improvement obtained by deraining.

The evidence has clear boundaries. Both the privileged first-order approximation and the deployable pseudo-gradient are imperfect and provide only attenuated directional information. TaskGuard must generate the candidate restoration before judging it, so it does not avoid restoration cost; computing gradients also adds runtime overhead. The experiments show transfer from Gaussian training to motion blur, synthetic rain, defocus, and natural-rain DAWN, but do not establish arbitrary transfer across restorers, detectors, datasets, or tasks. Detector loss is a differentiable per-image training utility, not an equivalent of AP or per-image F1. A concrete research operation to borrow is therefore: log the realized intervention, pair it with downstream sensitivity, freeze the decision rule before held-out degradation tests, and report both loss-level and task-metric outcomes. That last sentence is an editorial suggestion, not a measured result.

Learn how to turn a candidate restoration into a task-conditioned Restore-or-Preserve decision using a residual–detector-sensitivity signal, while keeping the threshold frozen before testing unseen degradations and tracking where the evidence stops.

[Abstract; Section 3 (Eq. (4)–(6)); Appendix C (as1_A3); Appendix D Table 2 (as1_A4.T2); Section 6](https://arxiv.org/abs/2609.08011v1)

## Online surrogate repair separates search length from high-fidelity query budget

*[Online Surrogate Repair: Decoupling High-Fidelity Feedback from Search Length in Closed-Loop Discovery](https://arxiv.org/abs/2609.07655v1)*

Closed-loop discovery has a concrete budget mismatch: candidate designs can be generated at low marginal computational cost, while reliable feedback may require wet-lab synthesis, characterization, or high-fidelity computation. The specific previous limitation is that replacing new experiments with a fixed surrogate leaves persistent model errors that optimization can amplify.

Online surrogate repair (OSR) inserts a third feedback regime between fixed-surrogate operation and high-fidelity feedback after every episode. During a longer agent search driven primarily by inexpensive surrogate feedback, an acquisition rule chooses designs from the agent’s accumulated proposals for high-fidelity evaluation; the resulting labels update the surrogate for later episodes. This separates the frequency of expensive feedback from the duration of search.

The decisive design choice is where to repair the surrogate. In static experiments using 40 synthetic tabular worlds, two context sizes, and TabPFN-3 or TabICLv2, Q90-UCB and expected improvement (EI) produced mean maximum-regret reductions of 0.424 and 0.409 with 32 oracle queries, versus 0.063 and 0.052 for Global-UQ and Random. The authors interpret this gap as evidence that improving global predictive accuracy, measured by NRMSE, does not necessarily remove false maxima that an optimizer exploits.

In the online synthetic loop, Online EI closed 76% of the gap between no repair and full oracle feedback while using only 16% as many oracle queries: 32 scheduled queries across 200 episodes rather than feedback after every episode. In the reported noise-free TabPFN-3 result, mean normalized regret was 0.0552, with a 95% confidence interval of 0.0298–0.0843 and median 0.0393.

The paper reports the same query-budget pattern on MADE: with 300 episodes and Online EI using 32 oracle queries, full-feedback controls required 6.36–7.23 times more oracle queries to match discovery counts under two LLM orchestrators and 10.27 times more under the Chemeleon+MLIP workflow. These are reported oracle-query comparisons, not evidence of end-to-end wall-clock acceleration.

The transferable research operation is to define repair success using the optimizer’s actual regret or discovery objective, then compare EI and Q90-UCB against global-coverage and random selection at a fixed oracle budget. A useful follow-up is to vary both query count and schedule, rather than assuming evenly spaced repairs are optimal.

The authors state that OSR requires a tabular representation and a tabular foundation model able to incorporate new labels in context. They also have not tested it with test-time training, reinforcement-learning agents, other surrogate classes, or more advanced optimization-aware scheduling; the reported gains therefore remain conditional on the studied tabular surrogate, synthetic-world, and MADE settings.

To learn how sparse, optimizer-targeted high-fidelity evaluations can repair a surrogate during a long closed-loop search without querying the oracle after every episode.

[Abstract; Section 4.1 (Static surrogate repair) / Table 1; paragraph S4.SS1.p2; Table 2 (Synthetic world results), row for Online EI (Q=32), TabPFN-3; Abstract and Section 4.3 (MADE benchmark), Table 3 and paragraph S4.SS3.p3; Section 5 (Discussion), paragraphs S5.p3–S5.p4](https://arxiv.org/abs/2609.07655v1)

## Stable Streaming Does Not Establish Long-Term Recall

*[Separating Stream Stability from Long-Term Recall in Language Models](https://arxiv.org/abs/2609.07282v1)*

The paper identifies a limitation in treating streaming, long-context, and memory methods as interchangeable: a model can keep generating well while losing causal access to earlier content. It defines three separate horizons: the **stability horizon**, over which predictive behavior remains well behaved; the **access horizon**, over which past content can still causally affect output; and the **utility horizon**, over which a task retains acceptable performance. A constructive argument shows that stability can be infinite even when access and utility remain bounded.

The authors turn this distinction into **ThreeH**, an evaluation contract requiring stability, causal-retention, and delayed-task-utility tracks under one declared state and compute budget. The retention track uses lagged interventions and counterfactual pairs, while the utility track hides the eventual query when evidence is written. This design tests whether a system can use a remote fact, rather than merely continue producing locally plausible tokens.

The experiments use an active cache of 2,048 tokens and compare plain window attention, StreamingLLM with attention sinks, window recomputation, recurrent memory, and sink-plus-retrieval systems. On a 128K-token stream, StreamingLLM’s normalized perplexity is 1.04× its 2K reference, close to 1.02× for window recomputation, while retaining constant KV memory and low per-token latency. That result supports attention sinks as a stability mechanism, not as semantic memory.

The retention test makes the boundary explicit. At a lag of 2W, both Window and StreamingLLM fall to approximately 26% accuracy on a four-way binding task, near chance, when the target is not placed in the fixed sink positions. Recurrent memory reaches 70% at 2W and 46% at 8W; sink-plus-retrieval reaches 89% and 78%. Utility remains a separate measurement: StreamingLLM’s delayed-decision accuracy falls from 93% at 0.5W to 36% at 2W, near the 33.3% chance rate.

For a new streaming or agent system, the transferable operation is to declare the resource budget first, then report all three tracks rather than treating stable perplexity as evidence of memory. Exact horizons remain dependent on the stream, task family, score threshold, and reference system; external-memory accounting and perplexity also have method-dependent confounds. ThreeH further does not assess privacy, calibration, factuality, or robustness to malicious memory content.

Read it to learn a concrete budget-matched test for whether a streaming model merely remains fluent or can still use a remote fact in a downstream decision.

[Thmproposition1.p1; S4.SS2.p1; S4.T1; S4.SS3.p1; S4.SS4.p1; S5.p1; S5.T4; Sx1.p1](https://arxiv.org/pdf/2609.07282v1)

Prepared retrospectively from the 2026-09-15 candidate papers; verified on 2026-09-16.
