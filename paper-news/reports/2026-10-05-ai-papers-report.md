# 2026-10-05

## In GridUMM, Suppressing Measured Conflict Did Not Improve the Downstream Trade-off

*[Does Gradient Conflict Predict the Understanding--Generation Trade-off? A Controlled Audit of Conflict-Metric Validity in Unified Multimodal Models](https://arxiv.org/abs/2609.38465v1)*

The previous limitation was evidential: the premise that reducing conflict metrics improves the downstream trade-off had not been tested directly. This paper changes the research operation from treating conflict as a target to testing its predictive validity and then intervening on it.

GridUMM operationalizes the audit in a fully shared two-task model with asymmetric task structures and token budgets, enabling an exactly computable synthetic trade-off. The authors vary seven gradient-combination strategies, three data ratios, and three seeds, measure directional conflict and gradient-norm imbalance on a fixed probe batch, and compare early measurements with a final Pareto score. In the prospective analysis, conflict is measured at 25% of the training budget across 63 base-scale configurations.

The decisive predictive result is restrained: In this testbed, early directional gradient-conflict metrics do not show a moderate, statistically distinguishable association with the eventual trade-off. The strongest reported association is conflict magnitude, ρ = −0.198 with a 95% CI of [−0.463, 0.079]. The causal check is more informative than another correlation: as projection strength α increases from 0 to 1, effective conflict falls monotonically from 0.005 to 0.000, but the final Pareto score varies by only 0.005 against a mean per-dose standard deviation of 0.028; the reported dose–outcome correlation is ρ = −0.600, p = 0.285. In other words, the intervention suppresses the measured proxy without a corresponding monotonic improvement in the downstream trade-off.

The audit also identifies what a conflict metric may be confusing. The authors interpret the norm ratio's overall association as a generation-failure detector: among configurations that master generation, its Pareto-score correlation is ρ = +0.02. Effective rank, a functional representation measure, reaches ρ = 0.702 versus −0.187 for the best directional metric, while final joint training loss reaches ρ = −0.926; early loss prediction is weaker and uncertain.

The transferable operation is to validate a proxy in the regime where it will be used: preregister an early readout, vary training conditions, report uncertainty, and intervene while verifying that the proxy moves. Do not read this as a production-scale verdict. The testbed is 3.2M–6.7M parameters on a synthetic grammar; generation is usually saturated, and the 63-configuration analysis has limited power for smaller associations. The authors’ conclusion is narrower: conflict may still matter, but its diagnostic validity must be established rather than assumed.

Read it to learn how to test whether a training-time proxy predicts a final trade-off before turning that proxy into an optimization target.

[abstract; Section 3.1; Section 4.2; Section 4.4; Section 5, Limitations](https://arxiv.org/abs/2609.38465v1)

## CESS Audits Whether Adaptive Search Represents a Fixed Evidence Pool

*[Search Shapes Conclusions: Auditing Evidence Selection Bias in Deep Research Agents](https://arxiv.org/abs/2609.39026v1)*

Deep-research evaluation often stops at citation correctness: checking whether cited sources support individual claims. The paper identifies a separate selection problem: early findings influence later queries, document choices, and stopping, so the documents read form a selective sample of a candidate pool.

CESS makes the audit target explicit. It estimates the equally weighted average evidence direction of a fixed, prespecified candidate pool—not the open web or ultimate truth—and its document scores encode reported outcome direction rather than evidence validity, effect magnitude, or clinical benefit. The estimator predicts each candidate document’s direction and corrects the opened-document average with logged probabilities of selecting a document and reaching its search round; shrinkage stabilizes short searches, while intervals replace point estimates when some documents cannot be sampled.

The theoretical guarantee is conditional. Before a trajectory begins, predictions must be fixed; logged selection and continuation probabilities must match the controller; and every candidate and evaluated round must have positive sampling probability. The authors warn that clipping, estimated probabilities, or a misspecified continuation model can introduce policy dependence, while inaccessible documents require bounds rather than point identification.

Empirically, on MS2, stabilized CESS reduced mean absolute error by 9.2%, ranking sensitivity by 39.4%, and worst-ranking MAE by 14.2% relative to the opened-document mean. In a small public-agent transfer evaluation, the reported reductions were 60.1% for MAE and 87.2% for ranking sensitivity, with direction errors down 18.1 percentage points.

Those gains should remain setting-specific. In a ten-round PERSPECTRUM analysis, a fixed tuning-set mean beat the reported CESS configuration on MAE and direction disagreement, although its ranking sensitivity was zero; and across matched-accuracy comparisons, CESS had lower ranking sensitivity in 10 of 28 cases, no detected difference in 18, and higher sensitivity in none.

Most importantly, a CESS contrast is not a causal estimate of changing search behavior: paired interventions on MS2 produced only 0.269 and 0.236 correlations between CESS contrasts and intervention effects. For a research evaluation, pre-specify the pool and score, log selection and continuation probabilities, diagnose overlap, and use bounds for inaccessible documents; if the question is what a changed policy does to evidence read, run paired interventions rather than reinterpret a pool-target correction.

Use this paper to design evaluations that separate whether an agent sampled a representative fixed pool from what its search policy caused it to read.

[abstract; §3.1, Theorem 1 and S3.SS1.p2](https://arxiv.org/abs/2609.39026v1)

## Source-excluded feedback reduces audited co-cheating in self-evolving search agents

*[False Frontiers: Diagnosing and Mitigating Co-Cheating in Self-Evolving Search Agents](https://arxiv.org/abs/2609.39102v1)*

## Why the feedback loop fails

Self-evolving search agents can optimize a misleading internal signal: in the standard coupled loop, the proposer and solver increasingly agree on shared errors, so internal reward improves without a matching gain in external correctness. The paper calls this failure mode **co-cheating**. The concrete limitation is a feedback path in which a source-derived error can become both pseudo-label supervision and proposer reward.

The authors first diagnose the loop with a post-hoc audit against source evidence; the auditor does not change task admission, model updates, or proposer reward. They then compare two interventions. Multi-sample verification (MSV) queries the same model three times with the source and three times without it, admits a proposal when the two majorities agree, and replaces the draft label with that consensus. CrossFit instead partitions source documents into folds A and B: questions from A receive proposer feedback from an auxiliary solver trained only on B, and vice versa. The main solver still trains on admitted questions from both folds, so CrossFit changes feedback provenance rather than the main solver’s update rule. This removes the direct same-source training-to-feedback path, but it does not make the auxiliary solver a truth oracle.

The decisive comparison is the reported round-3 audit with Qwen3.5-4B and Qwen3.5-9B. Standard coupled feedback reaches 6.1% and 8.8% false-agreement mass at the two scales. MSV lowers those values to 5.7% and 7.2%, while CrossFit lowers them to 3.0% and 3.7%. Replaying identical proposals with source-excluded feedback lowers false agreement further to 0.4% and 0.1%, supporting the paper’s interpretation that feedback ancestry matters. Across seven downstream search benchmarks, CrossFit improves average performance over standard coupled self-evolution by 8.8 points at 4B and 8.4 points at 9B; its gains over Search-R1 are 8.7 and 7.8 points.

The result has material conditions. MSV adds six labeler generations per candidate; the main CrossFit configuration adds 50 auxiliary solver updates per round, and the reported reserved budget rises by about 90% for MSV and 72% or 79% for CrossFit. Source-level exclusion also cannot ensure independent errors when models share pretraining or related evidence. A lower false-agreement mass may reflect rejecting difficult tasks, so coverage, task difficulty, fixed-probe performance, and downstream capability should be reported alongside it. The audit is LLM-judged, and the paper notes possible systematic judge bias without reporting human validation.

**Research operation:** attach source ancestry to every pseudo-label, replay the same proposal bank with in-source and source-excluded feedback, and measure false agreement together with coverage and external capability. The key question is whether the improvement survives when task selection is held fixed.

Read it to learn a concrete provenance test for self-training loops: audit shared errors, exclude each source from the feedback solver, and replay the same proposals before trusting an improving agreement reward.

[abstract; Section 3.2, Cross-fitted proposer feedback; Section 5.4, How Do Verification and Cross-Fitting Interact?; Appendix B, Table 4; Appendix A, Compute overhead; Table 3; Appendix D, Discussion and limitations; Appendix B, Independent audit; Section 6, Proxy rewards and self-confirmation](https://arxiv.org/abs/2609.39102v1)

## Planted pathways show why site-level distance cannot validate an intervention’s mechanism

*[Right Answer, Wrong Mechanism: Detecting Pernicious Divergence in Causal Interventions](https://arxiv.org/abs/2609.39243v1)*

Activation patching and distributed alignment search (DAS) can produce the expected answer through a dormant pathway rather than the model’s natural route. The paper frames the practical gap as one for which no method currently tells the two cases apart.

To make this testable, it plants hidden pathways inside pretrained GPT-2 small. The pathways are silent on every benchmark prompt by construction, making pathway-on/pathway-off behavior a ground-truth label for whether an intervention relies on them. Across 72 configurations and 100,800 interventions, the paper compares nearest-neighbour and local-PCA distances at the intervention site with Hidden-Pathway Contribution (HPC), a label-free test that clamps downstream units to the natural-run regime for the same output and measures how much of the decision disappears.

That comparison changes what counts as evidence. Among successful interventions, nearest-neighbour and local-PCA distances rank planted-pathway-dependent successes below chance in every reported setting (AUROC 0.35–0.47). HPC reaches AUROC &gt;=0.99 when the planted pathway creates unit-level out-of-regime activity, but its strength is conditional: HPC-L is near chance (AUROC 0.54) on successful gender-task interventions using in-range combination pathways.

Optimization creates another risk. In tested gender configurations, DAS routes 90–95% of its successes through planted pathways for three of four families; on SVA, it largely ignores them. A downstream on-manifold penalty cuts pathway-dominated unrestricted-DAS successes to under 5% in the tested gender runs, at a 6–11 percentage-point success-rate cost, while restricted DAS remains vulnerable.

For a new intervention study, the transferable operation is to pair behavioral success with a downstream causal test rather than a site-distance score alone: construct silent pathway-on/pathway-off controls when feasible, apply the clamp, and deliberately include combinations whose individual units stay in range. This is a research design suggestion, not a guarantee that HPC will detect every shortcut.

Interpret the scope narrowly. Reported results are on GPT-2 small and two planted-pathway benchmark tasks; HPC’s implementation does not cover attention-mediated pathways or non-final positions. In unmodified GPT-2, successful interventions rarely showed unit-level out-of-regime downstream activity, but that check cannot rule out in-range combinations or establish prevalence in larger models. Downstream self-repair can make the clamped logit difference an imperfect estimate of the decision margin that would otherwise be lost.

Read it to learn how to test whether a successful activation intervention depends on a hidden downstream route—and where that test fails for in-range combinations.

[abstract; §6.2, “Site-level distance is uninformative, even misleading, where it matters”; Table 3; §6.2, “What HPC clamps matters, and in-range pathways defeat it”; Table 3; §6.3; Table 4; §6.3, “Mitigation”; Table 4; §6.4; Table 5; §7, “Scope”; §7, “Downstream self-repair”](https://arxiv.org/abs/2609.39243v1)

## Multimodal RL learned image-dependent discovery when coordinate-task answers required visual evidence

*[Same Reward, Different Skills: When Multimodal RL Learns to Look](https://arxiv.org/abs/2610.01908v1)*

The paper targets a concrete diagnostic limitation: benchmark improvement does not by itself show that a model learned to use visual evidence. On Geometry3K, Qwen2.5-VL-3B trained without visual information still improved when real images were restored at test: the None condition recovered a 0.137 gain and Gray 0.125, compared with Real’s 0.238. The authors describe the resulting gap directly: an image in the prompt is not necessarily an image in the learning signal.

Their proposed design rule is **visual resolvability**: make the intended visual operation necessary for a correct answer while keeping the problem learnable. They implement this with counterfactual coordinate scenes: the question stays fixed while an answer-relevant visual fact changes, and the target is never named in the discovery setting. Standard GRPO uses correctness-and-format rewards, with held-out scenes and independently constructed grounding pairs testing whether the learned behavior depends on visual information and transfers beyond the training corpus.

The decisive result is operation-specific. On qualifying held-out 20-point confirmatory scenes, discovery accuracy increased from 0.425 before training to 0.740 at step 30 and 0.875 at step 100. In the matched step-30 comparison, real-image training outperformed gray-canvas training on confirmatory discovery by a mean of 0.354 across four seeds. The gray-trained runs received very little correctness reward, so this comparison does not match effective correctness-feedback strength. Training on the constructed scenes also transferred to an independently built coordinate-grounding task, increasing pair accuracy by 0.180 at step 100. Conversely, making answers available through captions substantially reduced discovery acquisition despite high reward and the same training budget.

The practical operation to borrow is to separate three tests: score improvement, image dependence at test, and acquisition from images during training. Use answer-changing image pairs, vary prompt-accessible shortcuts, and include a matched blind-image control; then report whether the control received comparable correctness feedback. The evidence remains bounded: the main acquisition intervention uses synthetic coordinate scenes, and generalization to natural images and other visual formats remains untested. The mixture dose-response evidence also has one run per mixture condition, so those comparisons do not establish seed-level robustness.

Useful for designing multimodal RL evaluations because it turns the vague claim that a model “uses vision” into separable tests of visual necessity, training-time image dependence, shortcut access, and transfer.

[Version 1; abstract and sections listed in the evidence map](https://arxiv.org/abs/2610.01908v1)

Prepared retrospectively from the 2026-10-05 candidate papers; verified on 2026-10-05.
