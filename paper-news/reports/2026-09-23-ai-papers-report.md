# 2026-09-23

## TreeSpark turns semi-autoregressive draft-tree size into a calibrated, load-adaptive serving decision

*[TreeSpark: Calibrated, Load-Adaptive Draft Trees for Semi-Autoregressive Speculative Decoding](https://arxiv.org/abs/2609.22098v1)*

**The limitation.** Fixed-size draft trees spend verification capacity without considering how much speculation a decoding round—or the current serving load—can support. TreeSpark also identifies a scoring problem: on the evaluated DSpark transplant, marginal per-position scoring can mis-rank branches and underperform the chain even with substantially larger verification budgets.

**The method change.** Instead of ranking children independently by position, TreeSpark reads a parent-conditioned distribution from the semi-autoregressive drafter’s existing Markov head, without another backbone pass. It maps the conditional probability of a greedy child, `q₀`, to an estimated edge-acceptance probability with a two-parameter Platt map: `p̂(edge) = σ(a · logit(q₀) + b)`, using `a = 0.67` and `b = −0.46` in the reported Qwen3-4B calibration. Best-first expansion then prioritizes the product of estimated edge probabilities along each path. A runtime price `θ` stops expansion when the best remaining path survival is no longer worth its verification cost.

For sampled decoding, siblings are drawn without replacement and verified with recursive rejection sampling. Under the paper’s operational conditions—each slot is admitted before its token is observed, and draws are neither discarded nor reordered by value—the procedure is intended to preserve the target distribution rather than trade losslessness for tree diversity.

**Evidence.** In greedy evaluations on Qwen3-4B/8B/14B with block-7 drafters, parent-conditioned trees outperform marginal DDTree scoring at every matched verification budget. The calibrated stopping policy improves accepted length and verification cost relative to the nearest fixed budget at every reported operating point. In the final recompute implementation, Qwen3-4B gains 15–25% in accepted length and runs 8–14% faster than the chain across the reported temperatures.

**Research operation.** A useful replication is to calibrate edge survival only on the population that matters for tree growth—edges whose ancestors survived—then compare a fixed-budget sweep with a `θ` ladder under identical verifier costs. Measure calibration separately by temperature and model scale before interpreting adaptive gains.

The strongest boundary is serving realism: the wall-clock measurements use a Python research harness and single requests, not the continuous-batching implementation, so production goodput, tail latency, and high-concurrency behavior remain unmeasured. The released setup also uses block length 7 and immediate-parent Markov conditioning. Finally, calibration labels come from greedy matches while nonzero-temperature verification uses recursive rejection; the authors report this mismatch but do not isolate its effect experimentally.

Read this for a concrete recipe for converting a one-pass semi-autoregressive drafter into an adaptive tree: parent-conditioned scoring, survival calibration, lossless sibling sampling, and a runtime stopping price.

[abstract; S3.SS2 and S5.SS2 (ablation / Table 2, §3.2–§5.2); S3.E3 and S3.SS4 (Eq. 3, §3.4); S3.SS3 (Proposition 1) and S5.SS4 (empirical losslessness, Table 9); S3.SS5 and S5.SS3 (stopping rule and adaptive evaluation; Fig.4/Table 3, §3.5–§5.3); S1.p7 and S5.SS4 (Table 4, §5.4); S6.p1 (Discussion and Limitations); S6.p2 (Discussion and Limitations); S6.p3 (Discussion and Limitations)](https://arxiv.org/abs/2609.22098v1)

## An Offline Oracle Finds a Sequence-Conditioned Ceiling for MoE Speculation

*[The Limits of Speculation: Bounding Speculative Decoding in Mixture-of-Experts](https://arxiv.org/abs/2609.22156v1)*

### The limitation
The paper targets a concrete MoE-specific limitation: verification cost is unstable because the experts loaded depend on the input. Its design therefore treats speculative decoding as a costed decision: a candidate is valuable only when its expected progress justifies the target-side verification work it induces.

### Method change
For a known reference sequence, the authors formulate speculation-budget selection as an offline Stochastic Shortest Path problem. Their Sequence-Conditioned Offline Oracle estimates transition probabilities from draft-model surrogate probabilities on that reference, counterfactually simulates “junk tails” to measure expert-union counts for candidate continuations, converts those counts into target pass time with a calibrated regression, and solves the Bellman equation by backward induction to choose a local speculation budget and an end-to-end time bound. The counterfactual suffixes are intended to estimate erroneous-token cost without disturbing the reference trajectory.

### Decisive evidence
On the Math Reasoning subset of SpecBench, consisting of 80 questions, the reported setup used a Qwen3-Coder-30B-A3B-Instruct target, an EAGLE-3/SGLang draft, one NVIDIA A100, batch size 1, and an \(L_&#123;max&#125;\) sweep to 12. Beyond \(L_&#123;max&#125;=6\), the reported Oracle speedup plateaued at roughly 2.34× and average accepted-batch length at approximately 2.1 tokens. In Delta Space, the paper reports that rejected candidate choices align along a strict linear boundary in expected marginal cost versus expected marginal progress. The authors interpret this pattern as a local decision rule: accept another speculative step when its marginal-cost-to-marginal-progress ratio remains below a threshold.

### Research use
Treat the Oracle as a calibration instrument, not as an online policy or a universal ceiling. The authors state that its bound applies only to reproducing the fixed reference text and ignores alternative valid continuations. The quantitative result is also confined to one target/draft pairing, batch size 1, and one hardware/software regime; the cost estimates use draft-confidence surrogates and single-shot Monte Carlo junk-tail sampling, which introduces local noise. A practical follow-up is to rerun the Oracle across multiple references, batch sizes, and model pairs, then test whether a lightweight marginal-cost ratio reproduces its budget choices before adding more elaborate draft structures.

Read this to learn how to turn MoE expert-loading traces into an offline budget-selection benchmark before designing an online speculative-decoding heuristic.

[abstract; S1.I1 / S4.SS2; S5.SS1.p2; S5.SS2.p3 / S5.SS2.SSS0.Px3; S4.SS3.p3 / S7.p2; S7.I1.i1.p1.1 / A1.SS9.p4; S7.I1.i3.p1.1 / S4.SS2.SSS0.Px2.p2](https://arxiv.org/abs/2609.22156v1)

## MoE Router Training Increases Expert Coactivation for Speculative Decoding

*[Efficient Mixture-of-Experts with Speculative Decoding via Expert Coactivation](https://arxiv.org/abs/2609.22471v1)*

## The bottleneck

Speculative decoding (SD) exposes a systems cost in MoE inference: verifying more tokens can activate more distinct experts, requiring more expert weights to move from DRAM to the NPU. The paper reports that SD gives dense models a strong throughput increase but a lower increase for baseline MoEs. Larger verification windows increase distinct active experts and DRAM-to-NPU communication, while a measured MoE FFN benchmark shows runtime increasing approximately linearly with active-expert count. This frames router behavior as part of the performance problem.

## The training change

Rather than changing the SD algorithm or drafting model at inference, the paper changes router behavior through four training-time interventions: a global rather than local load-balancing loss, shared experts, a neighboring-token consistency loss, and autoregressive expert selection within each verification window. The selection procedure retains some experts from the previous token and adds only a limited number of new experts, encouraging neighboring tokens to reuse experts. The intended systems effect is stronger expert coactivation, so a verification window transfers fewer distinct experts.

The combined design produced the paper’s main result: a reported 21% throughput improvement over MoE baselines while maintaining on-par accuracy. The experiments used models with four routed experts per token and 16 total experts, evaluated across multiple datasets and tasks; the models were trained from scratch with identical hyperparameters, and throughput was measured across SD window sizes and task-specific acceptance rates.

## Boundary and research use

Global load-balancing adds inter-node communication; the authors report that it did not become a training bottleneck in their setup. The evaluated models were trained on six trillion tokens under a specific hardware and experimental configuration, so the supplied evidence does not establish that the throughput or accuracy result transfers to other scales, memory-bandwidth regimes, or deployment constraints.

A useful replication is to run one-intervention-at-a-time ablations while logging, per layer, distinct experts transferred, DRAM-to-NPU time, acceptance rate, and end-to-end throughput. Then repeat the comparison across hardware with different memory bandwidths. This tests whether coactivation itself predicts the gain, rather than treating the reported 21% as a portable constant.

Read it to learn how to measure distinct experts per SD verification window and turn that statistic into a router-training experiment before trusting an end-to-end throughput gain.

[abstract](https://arxiv.org/abs/2609.22471v1)

## LLM psychology effects split into label, knowledge, and safety pathways

*[Recognition, Simulation, and Refusal: A Contamination-Aware Study of Classic Psychological Effects in LLM Agents](https://arxiv.org/abs/2609.22090v1)*

An LLM can produce the response pattern associated with a human psychological effect without that output establishing that it possesses the bias. PsyAgentBench operationalizes that distinction with a factorial benchmark: it crosses explicit paradigm naming (named versus blind), textbook versus structurally matched counterfactual content, and a persona manipulation. Across five completed paradigms, it releases 41,904 trials and reports replication profiles rather than one scalar bias-susceptibility score. The design therefore tests whether an apparent effect survives changes in labeling, stimulus construction, and prompting.

Earlier, the “noto” check replaced a multiple-choice item’s correct option with the literal “None of the other answers,” so solving required rejecting all other options. Its authors also note that multiple-choice evaluation cannot provide a comprehensive evaluation of reasoning abilities. PsyAgentBench instead reruns classic psychology experiments under controls intended to separate paradigm recognition, stimulus overlap, and prompt-driven behavior.

The decisive evidence is heterogeneous. For gpt-oss-120B on canonical Asch items, conformity was 0% blind versus 83.3% named (n = 120 per cell). In anchoring, the same model had an index of 0.000 on grounded canonical items but a median of approximately 0.90–1.01 on invented quantities; naming did not reduce it. With no persona, framing was near zero in blind prompts and substantial when named, with the named-counterfactual cell larger than named-canonical; each domain currently uses one scenario pair. Sunk cost was effectively zero in every tested cell. In minimal-group allocation, explicit refusal was the dominant empirical phenomenon. These results support the authors’ interpretation that human-like outputs arise through different routes rather than one general susceptibility.

For a new agent-behavior claim, run the factorial controls before assigning a human-psychology label: compare named with blind prompts, canonical with counterfactual stimuli, and persona variants, while treating refusal as an outcome. Do not treat the persona result as evidence of a stable trait: the one-sentence agreeableness manipulation is framed as an instruction, its wording overlaps with the outcomes, and the planned behavioral-phrasing ablation has not yet been run. Counterfactual status is a design goal, not verified absence from training data; amplification can rule out verbatim recall without ruling out structural memorization. Finally, refusal-filtered favoritism indices are subject to selection bias, and all runs used one provider with an unpiloted temperature of 0.7.

To learn a reusable factorial test for separating memorized or prompt-gated behavior from more stable agent-level effects before interpreting a psychology benchmark result.

[abstract; Abstract; Section 4.1; Table 2 (PDF pages 1, 6-7); Abstract; Section 4.2; Table 4 (PDF pages 1, 7-8); Abstract; Section 4.3; Table 5 (PDF pages 1, 7-8); Section 4.4; Table 6 (PDF pages 8-9); Section 4.5; Table 7 (PDF pages 8-9); Abstract; Sections 4.1–4.5; Section 5.1 (PDF pages 1, 6-9, 10-11); Section 6 Limitations (PDF page 11); Section 6 Limitations; Section 4.5 (PDF pages 8-11)](https://arxiv.org/abs/2609.22090v1) · [S3.p1; Sx1.p1](https://arxiv.org/abs/2502.12896v5)

## Ten LLM judges can provide only about 3.5 independent judges when their errors correlate

*[Agreement Overstates Evidence: Error Dependence in LLM Judge Consensus](https://arxiv.org/abs/2609.22512v1)*

Consensus among LLM judges is often treated as strong evidence that a decision is correct, but that interpretation assumes that judges make errors independently. This paper targets the failure mode in which similar judges repeat the same mistake. The paper's proposed protocol uses trusted examples to estimate judge accuracy, identify shared mistakes, and choose an aggregation rule before applying it to new data.

For the main open-weight bank, the authors construct ten logical judges and estimate their error correlations on 1,133 listwise-complete RewardBench calibration pairs using shrinkage. The mean pairwise error correlation is 0.206, which gives a variance-effective ensemble size of 3.51 independent judges. Thus, the useful quantity is not the number of judge outputs but the amount of independent error information represented by them.

Dependence changes conclusions, not just uncertainty. In up to 28% of comparisons, ignoring shared errors makes one system appear significantly better while an analysis that accounts for them does not. The structure of dependence also matters: errors shared by most judges and errors concentrated in a smaller vulnerable group affect consensus differently and favor different voting methods. A single correlation summary cannot determine the right aggregation rule.

The practical protocol is to estimate accuracy and shared mistakes on a small trusted set, then choose the voting method before applying it to new data. In transfer experiments using about 100 human-labelled calibration examples per deployment across eight external factuality datasets, the tested selector chose plain majority in every case. That is a result of this transfer setup, not a universal reason to default to majority.

Boundaries are material. The global and subgroup failure regimes are controlled interventions, so they do not establish natural prevalence; position bias is the only shared vulnerability studied in depth; adaptive filters and the selector require about 100 trusted labels; and limited judge banks mean that estimates of mean pairwise correlation and n_eff should not be assumed to transfer to substantially different banks or tasks. Automatic routing is also unreliable: non-inferiority to a regime oracle fails in 22 of 24 mixed-regime comparisons, and the router is significantly worse in 19.

For a new judge evaluation, the concrete operation is to reserve trusted items, report error correlation and n_eff alongside consensus, and compare aggregation rules on those items before deployment. The research question is whether the same calibration-derived rule remains stable when the judge bank, task, or shared vulnerability changes.

Read this to learn how a small trusted calibration set can reveal when a judge panel contains far less independent evidence than its headcount suggests, and how to test aggregation choices before deployment.

[abstract; S4.SS1.p1; S1.p7; S6.SS0.SSS0.Px3.p1.1; A10.SS0.SSS0.Px2.p1](https://arxiv.org/abs/2609.22512v1)
