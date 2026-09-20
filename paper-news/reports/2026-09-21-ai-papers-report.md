# 2026-09-21

## Transition Games locate grokking as distributed Fourier recoding, not a module switch

*[Where Grokking Happens: Distributed Utility and Fourier Recoding Without a Module Switch](https://arxiv.org/abs/2609.17571v1)*

Power et al. documented grokking as validation accuracy rising from chance toward perfect generalization long after training accuracy was near-perfect. This paper turns the timing question into a localization question: where is the memory-to-generalization change functionally expressed?

A prior structural account gives a useful boundary: under a Decoupled Max-Margin Assumption, its theorem studies a minimal single-layer, single-head Transformer with a fixed query and requires both an attention structural condition and an MLP norm condition for zero test error. Its stated scope is therefore narrower than the two-block activation-level setting examined here.

Here, the paper makes the transition itself the estimand. Transition Games pair, per seed, the last memory-dominant checkpoint with the first persistent-generalizing checkpoint, replace inactive activations with training-set means (primary), zeros, or marginal-preserving donors, and exhaustively compute exact Shapley/Owen allocations of clipped predictive compression. Matched non-generalizing controls turn the within-run change into a controlled gain rather than a snapshot comparison.

The primary result is distributed utility with a block-0 attention bias: in the mean-replacement controlled gain, attention exceeded the neighboring MLP by 0.1874 bits per example (95% CI [0.1322, 0.2425]; 12/12; exact p=.000488). The sharper “MLP memorizes, attention generalizes” handoff reverses at the strict memory anchor: MLP-minus-attention training utility is −0.3314 bits/example, with 0/12 pairs in the predicted direction. These are results for the declared paired protocol and small-model task family, not a general architectural law.

The proposed mechanism is more specific than a module switch. Five selected non-DC degree-two embedding frequencies contributed 0.5214 against a 0.1406 residual—78.8% of the aggregate contrast; zero replacement gave 91.5%. In a disjoint exact 16-coalition restoration game, block-1 MLP received 2.6440 bits and exceeded the other tested paths combined by 2.5167 bits, in 12/12 pairs. Thus, within this intervention, the evidence points to task-aligned spectral recoding whose selected block-0 effect is mainly expressed through the next MLP.

Reusable operation: pair transition checkpoints, retain matched controls, decompose utility into task-relevant modes, then restore candidate downstream paths. Interpret the output as an allocation in a declared game, not unique parameter storage: activation replacement and Fourier projection create hybrid counterfactuals, donor interventions preserve marginals rather than joint dependence, and probes are associational. Replication should test untied readouts, denser checkpoints, another operation, a controlled third prime, larger grids, and natural-language models; the paper reports prime- and utility-sensitive findings and leaves these extensions open.

To learn a concrete checkpoint-pairing and intervention protocol for testing whether a grokking transition reflects component replacement, spectral recoding, or downstream path mediation.

[abstract](https://arxiv.org/abs/2609.17571v1) · [§4.2 Theorem 4.3 (Conditional Decoupling Theorem)](https://arxiv.org/abs/2605.15787v1) · [S1.I1.i2; S3.SS1.p1; S1.F1 caption (S1.F1.3)](https://arxiv.org/abs/2201.02177v1)

## Evidence masking clears a preregistered compositional-generalization test in four-call societies

*[What You Can't See Is Still What You Learn: A Preregistered Sixty-Society Confirmation That Evidence Masking Drives Compositional Generalization](https://arxiv.org/abs/2609.17637v1)*

### Question and prior limitation

The paper asks whether preventing a module from reading foreign evidence spans improves held-out compositional generalization in a communicating society. The confirmation used 60 four-cell systems sharing a frozen language-model backbone and learned continuous packets. Five conditions varied evidence masking, ownership markers, and neutral filler across six initialization clusters and two data orders on one fresh task world.

An earlier paired study found a large masked-versus-global advantage, but its preregistered conjunction formally failed because the restricted arm's median depth-three accuracy was 0.6988 rather than the 0.70 floor. That intervention also coupled foreign-evidence blocking with role/ownership information and active-context-load reduction, leaving attribution unresolved.

### Decisive result

With markers available in both regimes, masking (R+) improved accuracy over the marked global regime (G+) by median paired differences of 0.846 at depth two and 0.859 at depth three; all twelve pairs cleared the required margins, and the full preregistered behavioral criterion passed. Within masked systems, ownership markers were practically redundant: R+ versus R− had a median signed difference of exactly 0.000 at both depths, with all twelve trajectory pairs within the preregistered tolerance.

However, no G+ trajectory passed the mandatory marker-following check, so usable role information from the provided markers was not demonstrated in the globally visible regime. The authors caution that this does not rule out role-information accounts because the marker manipulation was thin and positionally redundant during training.

### Mechanistic boundary

Packet interventions in all eighteen audited masked trajectories showed same-value preservation and counterfactual following of 1.000 on eligible cases, meaning substitutions produced the expected intermediate-value changes in masked recipients in the audited sample. These audits were success-conditioned and limited in coverage; they do not establish mediation of the masking advantage.

A concrete follow-up is to repeat the paired R+/G+ comparison with a shuffled-slot marker design, preserving the task and training budget, and ask whether the masking advantage survives when position no longer supplies the role cue. The paper explicitly says that a shuffled-slot design is required before any claim about role information proper.

Keep the conclusion bounded: the relay topology, normalized packet anchor, and singleton/forwarding curriculum scaffold the task; this is not a test of composition emerging without that scaffolding. The paper also reports that primary outcomes became available before cohort training was complete, so outcomes were inspected before the correction and verdict.

Read this to copy a paired masked-versus-global comparison and a marker control before treating packet interventions as evidence for a mechanism.

[abstract1.1](https://arxiv.org/abs/2609.17637v1) · [S5.SS1.p1; S7.SS0.SSS0.Px1.p1](https://arxiv.org/abs/2608.20054v3)

## EDCT Turns a VLM’s Own Explanation into a Verified Counterfactual Test

*[EDCT-Bench: Uncovering Faithfulness Gaps in VLMs via Explanation-Driven Counterfactual Testing](https://arxiv.org/abs/2609.17953v1)*

VLMs can produce natural-language explanations (NLEs) that sound plausible yet remain inconsistent with the visual evidence they cite. EDCT is designed to test that failure behaviorally: it edits the cited evidence and asks whether both the answer and explanation stay consistent with the edited image. CF-VLM frames counterfactuals as a fine-tuning objective with three losses, whereas EDCT frames them as a behavioral test. The concrete change is to treat a model’s stated evidence as a testable commitment rather than only as text to be judged for plausibility.

The pipeline first obtains an answer and explanation for an image-question pair. An LLM extracts visual concepts cited in the explanation, and the system generates minimally localized edits for those concepts with image editors such as FLUX.2 and Gemini Image. It then verifies edit locality and semantic validity with detector-segmentation checks, ORB-plus-optical-flow alignment, and pixel or structural-difference gates. The model is queried again on the edited image, and an LLM judge scores Answer Consistency and Explanation Faithfulness, producing a Counterfactual Consistency Score (CCS). Experiments use at most two cited concepts per sample.

EDCT-Bench spans knowledge-intensive OK-VQA, safety-critical DriveLM, and 3D spatial reasoning in 3DSRBench. Across evaluated VLMs, Gemini 2.5 Flash is the best reported model but reaches only about 0.600 binary CCS and 0.603 graded CCS; the other models fall between 0.435 and 0.566 binary CCS. On a human-validation subset, EDCT matched the shared label of annotators in 83 of 88 cases, or 94.3%. A small training pilot also gives a usable data-selection hypothesis: on 48 DriveLM axle-count samples, Qwen3-VL-8B scored 69.0% on originals versus 34.5% on counterfactuals, with initial loss 0.1792 versus 0.7124.

Interpret these results as behavioral evidence, not a readout of internal reasoning. The authors state that EDCT does not recover internal causal mechanisms, and a pass does not prove that an explanation reflects such a mechanism. Difficulty is also not uniform across models because interventions come from model-specific explanations; automated scores depend on the editor, verifier, and judge configuration. The 48-sample training result remains preliminary and does not establish improved held-out faithfulness. A reusable experiment is therefore to generate explanation-targeted edits, audit every verification gate, report component configurations, and evaluate post-finetuning CCS on held-out interventions before claiming a training benefit.

Read it to learn how to turn a VLM’s own rationale into a falsifiable intervention while keeping automated scores and preliminary training signals properly qualified.

[S1.I1.i1.p1.1; S1.I1.i2.p1.1; S4.SS3.p2; S4.SS4.p2; Table 4; S4.SS6.p2; S3.p2; S5.p2; S3.SS3.p3; S3.T1.3; S3.T2.3; S4.SS6.p1.1; S5.p2.1](https://arxiv.org/abs/2609.17953v1) · [S3.p1](https://arxiv.org/abs/2506.17267v1)

## Contiguous Edit-Local Windows Repair Adjacent Stale KV Caches

*[Contiguity, Not Importance: Budgeted Repair of Stale KV Caches After Document Edits](https://arxiv.org/abs/2609.17983v1)*

## The limitation and change

Under causal self-attention, a local document edit can affect downstream KV states; refreshing only the edited span can leave downstream dependencies stale, whereas full re-prefill reliably restores consistency at higher cost. Prior work made the failure concrete: overwriting a changed field’s own key/value vectors while reusing the rest leaves the model acting on the old value.

This paper formulates in-place repair as budgeted recomputation and compares training-free position-selection policies. Each evaluated repair recomputes the edited span and then chooses downstream positions; EditLocal chooses the K positions immediately after the edit. The primary comparison uses K=32, matched direct and derived factual edits, and Llama-3.1-8B-Instruct, Qwen3-8B, and Mistral-7B. Direct cases are repaired by all policies; derived cases expose the difference.

At that primary budget, when answer-bearing dependent text remains adjacent to the edit, EditLocal recovers at least 0.94 of the post-edit answer margin, substantially outperforming attention-based, KV-deviation, and structural selectors, and flips most held-out derived items. The paper also reports repair 13–21 times faster than full re-prefill. The authors’ mechanistic interpretation is about execution order: a contiguous window rebuilds the forward dependency chain, while scattered recomputed positions read stale surrounding states. This is why a position set that looks causally informative under clean-state transplantation need not be a good sparse-recomputation plan.

The boundary is sharp. Moving answer-bearing text downstream to d≥250 tokens collapses EditLocal MR to roughly 0.01–0.09 at K=32; stale-query attention sometimes helps, notably on Llama. A practical replication is therefore to sweep dependency distance while holding the recompute budget fixed, and to compare transplant diagnostics with actual recomputation rather than treating the former as an operator. The transplant panel itself used 15 development items and omitted Mistral, so the mechanism is supported but not fully validated by that diagnostic.

The recommendation is conditional, not universal: start with EditLocal when dependent text stays adjacent. The study covers single contiguous, length-preserving edits; it uses dense models near 8B and single-GPU, batch-1 timing, and does not test multi-edit or length-changing updates, larger or sparse models, or production serving.

Use this paper to choose a first repair baseline and design a distance-controlled test before implementing more complex KV-cache selection or editing methods.

[Abstract; Sx5.SSx1.p1; Sx5.T2; Sx1.p4; Sx5.SSx3.p1-p3; Sx5.T3; Sx5.SSx4.p3; Sx6.SSx6.SSS0.Px2; Sx3.SS0.SSS0.Px6](https://arxiv.org/abs/2609.17983v1) · [abstract1.1; S4.SS0.SSS0.Px2.p1; S4.SS0.SSS0.Px3.p1](https://arxiv.org/abs/2606.17107v1)

## Successful-Only Rescoring Reweights Failed Teacher Trajectories in Offline Distillation

*[Trajectory Learnability for Offline On-Policy Distillation with Imperfect Teachers](https://arxiv.org/abs/2609.18321v1)*

Offline on-policy distillation reuses stored student trajectories and teacher supervision, but that reuse also makes imperfect supervision persistent. A teacher-failed problem is therefore a coarse signal: not every token on its student trajectory is necessarily unhelpful. Repeated continuation-based recoverability estimates could provide a richer signal, but they largely remove the efficiency advantage of offline reuse.

Learnability-Weighted Distillation (LWD) trains an auxiliary reference model, π₊, only on teacher-successful problems, then rescoring stored tokens from teacher-failed problems under π₊ and the original rollout policy, ρ. For each observed token, the learnability signal is the signed log-likelihood change, log π₊(aᵢ,ₜ|sᵢ,ₜ) − log ρ(aᵢ,ₜ|sᵢ,ₜ). A positive change means that successful-only learning more strongly promotes the observed student behavior. The paper clips this signal to [-4, 4] and smooths it with a 33-token moving average before summarizing trajectories.

LWD then assigns failed trajectories to low, middle, or high learnability tiers using trajectory-level summaries and applies bounded positive weights to the original offline OPD loss. Teacher-successful records keep weight 1, while failed records receive reduced but nonzero weights; the token-level teacher targets inside each trajectory are preserved. This is a selective-retention operation, not a replacement for the teacher target.

The decisive ablation favors graded retention: reduced weighting of teacher-failed supervision outperforms both full retention and outright removal, with learnability-based, trajectory-specific weighting performing best overall. In the reported Qwen3-8B-to-Qwen3-4B setting, LWD improves the protocol-matched offline Lightning-OPD baseline on all five benchmarks: +2.7 points on AIME24, +2.0 on AIME25, +1.6 on HMMT25, +1.9 on LiveCodeBench v5, and +1.7 on LiveCodeBench v6. AIME24 rises from 66.4 to 69.1 avg@32. Under the paper’s accounting, LWD uses 2 GPUs and 21.90 GPU hours, versus 3 GPUs and 36.28–47.69 GPU hours for the representative online selective OPD methods.

The boundary is important: the learnability signal is not a correctness label and does not estimate the utility of the teacher target at a state; it measures how observed behavior responds to successful-only learning. For code, the available teacher-success labels approximate format validity through normal termination and strict extraction of a complete Python program, rather than functional correctness. A practical reproduction should therefore log the token-level changes before aggregation, then test whether tiered weights remain useful when varying the successful-only update budget, smoothing window, and tier thresholds. The central research question is whether this responsiveness signal adds information beyond simple reward-aligned filtering.

Read this to evaluate whether one auxiliary successful-only distillation pass can rescue partially useful failed rollouts without giving up offline training efficiency.

[abstract; S4.SS3.p1 / Eq. (12); S4.SS4.p3–p5 / Eq. (22); Appendix A.1; S1.p6; S5.T1; S5.SS1.p1; Abstract; S5.SS1.p3; S5.T2; S5.T3; S5.SS2.p1; S4.SS3.p2.1; A1.SS3.p1.1](https://arxiv.org/abs/2609.18321v1)
