# 2026-09-20

## Transported Conformal Calibration transfers labeled calibration into a paired target space

*[Conformal Calibration Transfer](https://arxiv.org/abs/2609.10737v1)*

Conformal prediction normally obtains coverage guarantees under exchangeability between calibration and deployment data. “Conformal Calibration Transfer” studies the concrete case where that condition fails: labeled calibration is available only in a source space, while prediction sets are needed in a different target space linked to the source by unlabeled paired observations.

TCC makes that move explicit. It transports labeled source calibration into the target space using paired data, then corrects residual post-transport mismatch using only unlabeled target inputs. TCC-KS uses a label-free uncertainty surrogate to detect mismatch and adjust calibration conservatively; weighted-TCC reweights transported calibration toward the target domain for improved efficiency when weights are stable. The paper provides finite-sample target-domain coverage guarantees that adapt to an observable measure of mismatch.

That architecture also states its boundary. The paper’s impossibility result says that, absent structural assumptions coupling observables to the unobserved true-label score distribution, any label-free, distribution-free procedure promising target marginal coverage can be near-vacuous in the worst case. TCC requires unlabeled paired observations linking source and target inputs; without such pairing, the framework does not apply.

The empirical evidence is targeted rather than universal. Across CIFAR-100-C, Tiny-ImageNet-C, and SEN12MS (SAR-&gt;RGB), the authors report reliable target-domain coverage transfer without labeled target calibration data, with label-free diagnostics that predict when correction is needed. The evaluation uses held-out labeled target sets only for evaluation. In the paper’s 328-configuration audit, delta+ correlates 0.772 with set-size inflation and 0.734 with safety margin, supporting it as a deployment signal.

The transferable research operation is to separate transport learning, calibration, and mismatch estimation, then ask whether the chosen unlabeled surrogate tracks the failure mode that matters for coverage. Use the conservative KS route when that signal is credible; treat weighting as an efficiency option only when its stability is demonstrated. This is a recommendation, not a guarantee: shifts invisible to the surrogate are intrinsically difficult to detect without target labels, the guarantees are marginal rather than conditional, and explicit sample splitting can reduce effective sample size when unlabeled budgets are small. A useful replication question is whether the same diagnostic remains predictive under a new paired sensor change, rather than assuming that transport quality alone implies calibration validity.

Read this paper to learn how paired unlabeled observations can support conformal calibration transfer, when surrogate-based correction is safer than weighting, and which assumptions and diagnostics determine whether the guarantee is informative.

[Abstract; Abstract and §4 (Evaluation); §1 (and §3.5 Theorem 3.1 / Appendix A.1); §4.3 (Assumption Validation and Stress Regimes); §5 (Scope and Limitations)](https://arxiv.org/abs/2609.10737v1)

## Synthetic-data tuning improves in-distribution skill retrieval but can cause catastrophic forgetting on real and OOD tasks

*[When Synthetic Data Hurts: On Catastrophic Forgetting in Skill Retrieval for LLM Agents](https://arxiv.org/abs/2609.10750v1)*

Earlier synthetic-retrieval work already reported gains from generated supervision: InPars found that filtering generated pairs by language-model generation likelihood improved reranker effectiveness, while Promptagator found that round-trip filtering improved dense retrieval by 2.5 nDCG points on average. This paper asks the adjacent deployment question: do those gains preserve retrieval capability outside the synthetic training distribution?

On a production skill router over 34,396 skills, the authors compare limited real supervision with synthetic supervision and evaluate retrieval on real, out-of-distribution (OOD), and synthetic in-distribution tasks. The failure is substantial under aggressive adaptation: OOD recall falls from 0.850 to 0.650 in the reported configuration.

The method change is to add preservation controls rather than judge synthetic fine-tuning only by its target-distribution score. Embedding-anchor regularization penalizes deviation between tuned positive-skill embeddings and a frozen encoder. For reranking, listwise Learning without Forgetting (LwF) regularizes the student toward the frozen teacher's score distribution. The study also evaluates Elastic Weight Consolidation (EWC) and L2-initialization, alongside conservative and aggressive LoRA recipes.

The reported result is conditional but useful: the evaluated preservation approaches retain OOD skill-retrieval performance while improving synthetic in-distribution retrieval by 13.98% for the 0.6B Qwen retriever and reranker. The evidence therefore supports a training recipe to test, not a guarantee that the same hyperparameters will transfer to other models or catalogues.

The boundary conditions matter. Val-set 1 has 21 examples and Val-set 3 has 10, so single-task variation can shift Recall@10 by approximately 5%. In Track B, only 140 of 26,947 retrieval-eligible skills—0.52%—appear as positives in the locked training set. Both synthetic pipelines also rely on commercial, closed-weight LLMs for generation and quality assessment.

A transferable experiment is to retain a frozen pre-adaptation checkpoint and a locked real/OOD holdout, then compare synthetic-only, conservative-LoRA, and separate regularizer arms. Report target-distribution gains beside real/OOD deltas, and sweep LoRA rank and regularization strength while inspecting per-task changes. The key research question is whether preservation still works when positive coverage, synthetic-data quality, or catalogue scale changes; this is an editorial experiment design, not a result established by the paper.

Read this paper to learn how to test whether synthetic supervision improves a retrieval target while silently damaging real and OOD behavior, and to extract a concrete LoRA-plus-preservation experiment for scarce multi-positive skill-routing data.

[abstract; S1.p3; S4.SS1.SSS0.Px2.p1.1; A4.T10; S2.SS5.SSS2.Px1.p1.1; S2.Ex1; S2.SS5.SSS3.p3-p4; S4.SS2.p1.1; Table 4](https://arxiv.org/abs/2609.10750v1) · [S3.p3.2; S6.SS3.p1](https://arxiv.org/abs/2202.05144v1) · [S3.SS2.p2; S4.SS3.p2; Figure 2 caption (S4.F2);](https://arxiv.org/abs/2209.11755v1)

## Paired-binomial audits admit continual policy updates that range-based gates reject in a synthetic diagnostic

*[When Validation Stops Learning: Auditing Update Admission for Continual Embodied Agents](https://arxiv.org/abs/2609.10873v1)*

Ma and Wu frame update admission as a joint requirement: control error while retaining useful learning opportunities at a stated interaction budget. The paper’s concrete feasibility failure is a simultaneous Hoeffding, or range-based, gate that can require too many fresh paired evaluations even when observed old-task outcomes show no change.

The numerical contrast is sharp under the paper’s example conditions: with three protected comparisons, first-attempt allocation, and error and retention margins of 0.05, the range-based construction requires 4,229 pairs per comparison; equal allocation therefore requires 25,374 episodes, exceeding a 20,000-episode cap. The proposed alternative counts positive and negative outcome disagreements within paired evaluations and applies one-sided Clopper–Pearson bounds. When both disagreement counts are zero, the retention condition requires 117 pairs in the same example rather than 4,229.

The operational change is to make the audit explicitly paired and fresh after the candidate update is committed. The stated guarantee assumes that committed pairs are i.i.d. within each task, with policies and scoring frozen. Under that contract, the sequential-pushing diagnostic found that the paired gate admitted 81 of 256 attempted updates at a 2,000-episode cap—31.6%—and 229 of 256 at 20,000 episodes, while Hoeffding admitted none. No contract violations were observed in that diagnostic, but zero observed violations are not asserted to establish a zero error rate.

The result is not equivalent to solving the learning-opportunity problem. In closed-loop runs at 2,000 episodes per stage, paired checks missed 60.4% of available opportunities, and replay obtained higher final success. That makes missed-opportunity rate a necessary companion to harmful-admission checks: an audit can be conservative enough to protect the reference policy yet still block the learning process it is meant to govern.

For implementation, reproduce the comparison with the same candidate streams and interaction cap, log fresh-pair usage and admissions per round, and report both observed violations and missed opportunities. Treat the outcome as a protocol design to test, not robot validation: the paper states that all demonstrations, dynamics observations, policy updates, and evaluations are synthetic, and physical-robot and VLA validation remain open. The rule supports binary scores only; physical state carry-over, correlated reset pairs, optional stopping, or changing a policy or scoring function during a batch invalidate its stated assumptions.

To learn how paired disagreement tests can reduce continual-update audit cost while exposing the missed learning opportunities that safety-oriented admission gates may create.

[abstract; S2.SS0.SSS0.Px1.p1.1; S2.SS0.SSS0.Px2.p1.2; S2.SS0.SSS0.Px3.p1.1; S3.SS0.SSS0.Px3.p1.1; S3.SS0.SSS0.Px3.p2.1; A4.SS0.SSS0.Px1.p1.2; A2.p1.1; A1.SS0.SSS0.Px4.p1.1](https://arxiv.org/abs/2609.10873v1)

## Self-Consensus Fails the Studied Safe-and-Saving Early-Exit Gates

*[Stable Answers, Unfinished Reasoning: Why Self-Consensus Is Not a Safe Early-Exit Signal](https://arxiv.org/abs/2609.09989v1)*

Repeatedly probing a single partial trajectory for its current answer looks like a cheap stopping test: stop when recent probes agree. The concrete limitation is semantic: agreement under a fixed probing procedure establishes that the current answer persists under that procedure, not that the reasoning has terminated. The authors call this the **consensus–termination gap**.

The paper’s methodological change is to replace confidence in that proxy with a preregistered audit. It replays 3,520 windowed-consensus rules on frozen trajectories from two models and three benchmarks, with probe output charged in the token accounting and three acceptance gates fixed in advance. A boundary-confidence control, DEER, is swept through the same pipeline; unlike the consensus rules, it clears all three gates.

The decisive evidence is about when agreement occurs. Paired re-probing with two differently worded answer queries returned different answers 54% of the time in the first tenth of a trajectory, but only 16% of the time in the final third. In a hand-labelled set of 134 stopped-but-wrong cases, 56.7% were answers on which the model had not converged, 18.7% were probe-format artifacts, and only 24.6% were genuinely settled wrong values. At a rule still saving 32% of tokens, one stop in nine fired on an answer that the trajectory later abandoned. Widening the agreement window did not remove the problem: the non-terminal share levelled off near 7%, while token saving fell to 8%.

The result is a scoped empirical negative finding, not an impossibility proof. The central search uses one boxed-answer probe suffix and one 3,520-rule consensus schema; other probe wordings and signals were not searched. The benchmarks are competition mathematics with checkable final answers, so transfer to open-ended reasoning, code, or agentic tasks remains out of scope. The taxonomy is also exploratory, drawn from one environment and a short-window regime.

For new inference-time controls, separate “the answer is currently stable under this probe” from “the reasoning is complete.” A useful next experiment is to vary probe wording and dependence directly, then test whether an apparent stop precedes a correction on held-out trajectories. Report safety and token cost together, charge the probe itself, and compare the proposed signal with a structurally different control rather than only tuning stricter agreement.

Read this to learn how to distinguish a probe-stable intermediate answer from evidence that a reasoning trajectory has actually finished.

[Abstract; S5.SS2.p1](https://arxiv.org/abs/2609.09989v1) · [Abstract / S4.SS2.p1](https://arxiv.org/abs/2504.15895v3)

## Conditional Shapley Inference Uses U-Statistic Debiasing, with Collinearity and Scaling Boundaries

*[Semiparametric Inference for Conditional Shapley Feature Importance](https://arxiv.org/abs/2609.10313v1)*

The paper addresses two limitations it identifies in common Shapley workflows: most estimators return point quantities without uncertainty, and sampling out-of-coalition features from their marginal rather than conditional distribution can misattribute importance when features are dependent. Its target is a global, loss-based conditional Shapley/SAGE importance, where omitted features are integrated under their true conditional law.

The core estimator is a one-step, K-fold cross-fitted mean of local Shapley contributions. For squared loss, it splits conditional draws into two independent Monte Carlo sub-batches and uses a U-statistic-style correction. This removes the variance-over-sample-size bias in the naive plug-in loss estimate. Conditional sampling uses a working copula, with a Gaussian copula as the default and vine copulas as an option. Under double-robust rate conditions, the paper states that the estimator is root-n consistent and asymptotically normal, supporting Wald intervals.

The paper also makes model error explicit. A Pinsker-type bound controls the difference between the true target and the pseudo-true target in the working copula class by a constant times the square root of the copula KL divergence, under boundedness and total-variation regularity assumptions. Thus, with a parametrically misspecified copula and nonzero KL deficit, intervals are centered on the pseudo-true parameter rather than automatically on the desired target.

The main simulation evidence is conditional on a low-dimensional Gaussian design. With p=5, n=500, a linear predictor, and the deployable Gaussian-copula estimator using K=3, M=30, and B=20, empirical 95% Wald coverage ranged from 0.91 to 0.96 across features. The reported Type-I error was about 0.05, and rejection was about 0.988 at the local alternative δ=0.25. The applications to UCI Concrete and California Housing report all eight features surviving Bonferroni correction at α=0.05.

The sharpest boundary is dependence: under feature correlation ρ=0.9, the conditional Wald interval undercovers, and this undercoverage does not improve with sample size in the reported experiments. The paper attributes this regime to near-singular conditioning and underestimated plug-in influence-function variability. Computation is another constraint: the authors describe naive costs as roughly O(p²) for pair-copula nuisance fitting and O(p³) per evaluation, making p≳100 expensive.

A transferable research operation is to test whether conditional-sampling randomness enters a nonlinear loss, then compare a naive plug-in with an independent-sub-batch U-statistic while cross-fitting the sampler. Stress-testing coverage as feature dependence increases—and reporting the copula class and its misspecification risk—turns an attribution estimate into a more inspectable inference procedure.

Read it to learn a reusable way to debias Monte Carlo losses and cross-fit conditional samplers, while checking whether copula misspecification, collinearity, or dimension invalidates the resulting uncertainty estimates.

[abstract; §3.1 (S3.SS1.p2) and §3.2 (S3.SS2.p1) (equations (8),(9),(10)); Theorem 3 (§4.2, S4.Ex4); §5 Sim A–B (S5.p2–S5.p3) and Tables 1–2 (S5.T1,S5.T2); §5 Sim C and Appendix S5 (S5.p4, A5.p1–p2, Table S3); §6 Applications (S6.p1–p3) and Table 6 (S6.T6); §4.2 (S4.SS2) and Sim D (S5.p5); §7 (S7.p2: Dimensionality and computational cost)](https://arxiv.org/abs/2609.10313v1)
