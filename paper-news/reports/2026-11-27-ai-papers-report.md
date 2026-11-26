# 2026-11-27

## Planted Proof Depth Can Overstate the Reasoning a Logic Problem Requires

*[Certify What You Plant: Shortcut-Free Proof Depth in Logical Reasoning Data](https://arxiv.org/abs/2611.33303v1)*

Procedural logic datasets often set difficulty by planting a proof of target depth, but a planted proof is only one possible proof: a shorter proof or unrelated proof may also solve the instance. The paper’s central change is to measure what every proof must do, rather than infer required reasoning from the generator’s chosen derivation.

For each problem, the authors declare an inference calculus and compute a proof profile: mandatory rule applications, shallowest proof depth, minimum proof size, number of minimal proofs, and indispensable premises. This is a structural audit, not an unconditional notion of difficulty. The paper proves a one-way robustness property: under a sound extension of the calculus over the same sufficiently large formula universe, an avoidable step stays avoidable. To generate target structure, ProofPlant uses a catalog of shortcuts proved once per rule set, constructs instances whose proofs have the requested structure, and exports certificates that an independent checker re-verifies.

The audit exposes the practical gap. In derivable FLD × 2 depth-5 examples, the planted length substantially overstates the steps common to every proof: the mean is about two mandatory applications, and about one fifth have no mandatory step. This estimate is conditional: 35% of the depth-5 sample was not derivable in the paper’s ground calculus and was not counted. The checking pipeline is concrete rather than aspirational: 540 certificates across nine logics passed independent checking, and the reported injected corruptions were detected.

The training result narrows the lesson. In a controlled monadic Qwen3-0.6B study with planted depths 5–9, matched labels, premise counts, lengths, balanced negation, and fourteen seeds, the authors found little evidence that mandatory-step count alone improves label prediction at fixed planted depth. A separate controlled comparison attributes the mixture’s advantage mainly to composition—problem types and depths, including types forward generation does not supply—rather than to swapping derivations for certified examples while holding the mixture fixed. These are experiment-specific conclusions, not a claim that depth never matters.

For a new dataset, first declare the calculus, re-derive labels, and report mandatory structure alongside nominal depth; then rerun the audit under a richer calculus as a sensitivity check. The boundary is important: omitted hypothetical reasoning and case splits leave some audited items out of reach, and a certificate covers the formal instance, not the faithfulness or naturalness of its English rendering.

Read it to learn a concrete audit-and-construction workflow for testing whether a generated reasoning dataset requires the depth it claims.

[abstract; Section 4.1, Long proofs, mostly optional steps: FLD × 2; Table 1; Section 7, Certified depth alone changes little; Appendix D, Table 12; Limitations, Structure is relative to a calculus](https://arxiv.org/abs/2611.33303v1)

## RL’s sample advantage changes with prompt structure and the evaluator

*[How Many Samples Is RL Worth? Best-of-N versus RL Post-Training for Text-to-Image Models](https://arxiv.org/abs/2611.33232v1)*

Best-of-N is not a fixed substitute for RL: the measured exchange rate changes with prompt structure, selector quality, and evaluator.

Earlier supplied work had already compared post-trained and base-model Best-of-N frontiers, but its primary frontier selected with the evaluation reward itself as an oracle; that setup did not establish performance for an imperfect selector. This paper turns that missing operational comparison into an exchange-rate experiment: how many samples from the base model are needed to match one RL sample? On 398 new GenEval-style prompts, it compares SD3.5-M Base⋆ with the public Flow-GRPO checkpoint, using human labels and two automatic judges.

Under the preregistered rule that both automatic judges must pass, practical best-of-16 selected by InternVL3.5-8B trails one RL image by 9.3 percentage points; best-of-32 reaches only 60.3% in this evaluation. An oracle picker crosses one RL image at 7.5 Base⋆ samples (95% interval 5.9–10.0), but this is an availability upper bound, not a deployable picker. The gap therefore includes both the chance that the base model produces a correct image and the selector’s chance of finding it.

Prompt stratification changes the conclusion. Without a position, a person found a correct image among about three base images about as often as one RL image (76.2% versus 75.9%); with a position, eight base images reached only 51.9% of prompts versus 92.4% for one RL image. This human search-through-images result is weaker evidence because it was a late addition and used sequential judgments for base images but one judgment for RL. People nevertheless found best-of-16 behind RL in both human checks, with smaller measured gaps than the registered detector-based result. The paper reports that detector-based judging exaggerates the human gap, while VLM judging can hide it.

Research operation: report separate curves for base-pool availability, practical selection, and human correctness, stratified by prompt structure; then hand-audit selected images when judges disagree before making a training-versus-inference compute decision.

The boundary is important: the core comparison is one base model and public checkpoints; the FLUX.1-dev check shows a similar automatic-evaluation gap but has no human labels. The prompts use GenEval templates used to train RL, which may favor RL, so this exchange rate is protocol-specific rather than a general conversion rule.

Read this to decide whether your next budget should go to RL training or inference-time sampling, using the paper’s prompt-stratified and evaluator-aware comparison rather than a single average score.

[abstract; Section 5.1, paragraph 1; Table 1; Section 5.2, The registered test; Section 5.2, The same test, judged by people; Table 2; Appendix E.1; Section 5.1, paragraph 3; Appendix J, Tables S25 and Limits; Section 5.2, The registered test; Section 6.1; Section 7, Scope; Appendix A, departure 4; Appendix E.3, FLUX.1-dev; Section 7, Scope; Appendix G, Spatial relations and layout](https://arxiv.org/abs/2611.33232v1) · [PDF page 4, Section 4.1; additional selector tests in PDF pages 22–23, Appendix D.4](https://arxiv.org/abs/2611.02366v1)

## SealedLoop gates embodied-policy updates with a sealed sequential judge

*[Keep or Roll Back? Out-of-Loop Judges for Self-Improving VLA and End-to-End Embodied Policies](https://arxiv.org/abs/2611.33794v1)*

Self-improvement loops can mistake a higher score on familiar loop data for a policy improvement that transfers elsewhere. SealedLoop changes the keep/rollback boundary rather than the improver: it evaluates the incumbent and candidate on paired conditions from a sealed pool hidden from the improver. An anytime-valid confidence sequence is updated pair by pair; the candidate is accepted when the lower bound on mean gain is above zero, rejected when the upper bound is below zero, and rolled back at the budget if the test is undecided.

The paper also makes the failure diagnosable. It decomposes disagreement between reported and sealed gain into judge error—the in-loop judge is wrong on its own data—and transfer gap—a real in-loop gain fails to carry to sealed conditions. The authors run otherwise matched loops under the in-loop judge or the sealed test while recording both, so a local score increase need not be treated as evidence of transfer.

That distinction is narrower than claiming hidden evaluation as entirely new. The supplied SEAL record already describes a hidden audit with accept/reject feedback and incumbent retention. SealedLoop’s supported methodological change is the paired sequential confidence-sequence rule, plus the judge-error/transfer-gap analysis, in embodied-policy loops.

Results show why this matters. In one LIBERO-Object generation, the manipulation classifier labeled 65 of 196 failures successful; none reached the goal region. In NAVSIM control runs, true in-loop scores let 8/15 candidates pass the local test, while none of 60 candidates gained on unseen training-city logs. On 76 driving policy pairs whose sealed outcomes were known, the sequential test accepted 11/12 gains and none of 59 losses or 5 near-zero pairs, at higher evaluation cost than a fixed bootstrap sample in the reported comparison. In a separate driving improvement loop, sealed selection ended at 0.674 PDMS versus 0.649 under the learned critic, from 0.638.

Field evidence is directional, not decisive: in six blind main-route pairs, the reinforced version drove an average 10.4 m farther, but neither version completed the curve and the confidence sequence remained undecided.

Use this as a research operation: reserve conditions the improver cannot inspect, compare candidate with incumbent pairwise, and log both in-loop and sealed gains so judge error is not conflated with transfer. Do not generalize a certified gain beyond the sealed pool: certification targets that pool’s distribution, not automatically other deployment conditions. The stated guarantee depends on independent condition sampling; the paper’s actual stratified, without-replacement manipulation sampling and correlated driving frames are handled by simulation-based error estimates. Evidence remains narrow: repeated loops are simulation-based; NAVSIM replays logs without reactive road users; and the field test covers one published improvement step on one vehicle and routes without obstacles.

Read this if you are designing an online RL, VLA fine-tuning, or critic-guided update loop and need a concrete way to distinguish a judge mistake from a gain that fails to transfer.

[abstract; Sec. 3.3; Appendix A, Secs. A.1–A.2; Sec. 3.2, Eq. (3); Sec. 5.2; Appendix C, Sec. C.3; Sec. 5.2; Appendix B, Sec. B.3; Sec. 5.4; Appendix C, Sec. C.4; Sec. 5.5; Appendix D, Sec. D.3; Table 11; Appendix G, Limitations; Appendix G, Limitations; Sec. 5.5; Appendix D, Sec. D.3; Sec. 3.3; Appendix A, Lemma A.2 and Sec. A.2; Appendix A, Sec. A.1; Appendix B, Sec. B.5](https://arxiv.org/abs/2611.33794v1) · [abstract](https://arxiv.org/abs/2607.24300v1)

## LLM Unlearning Audits Need a Validated Deletion Reference

*[Deletion You Can Check: Auditing LLM Unlearning](https://arxiv.org/abs/2611.33525v1)*

Near-chance membership-inference ROC-AUC is often treated as evidence that a fine-tuned model forgot a deleted record, but that reading is sound only when the comparison population represents how the record should behave after valid deletion. The paper tests this premise in a controlled 2×2 study pairing ArxivMIA and BookMIA with Llama-3.2-1B and Qwen2.5-1.5B.

The audit first admits a membership axis only when exact retraining places its mean forget-versus-comparison AUC in the prespecified chance band of [0.45, 0.55]. On each admitted axis, the same seed and checkpoint must pass four checks together: membership removal, deletion-targeted movement beyond non-deletion variation, utility preservation, and run validity. Routine maintenance updates serve as a useful control because they can move losses without deleting records and can even shift the exact-retraining reference.

The reference check changes the interpretation of the benchmarks. Exact retraining falls inside the chance band on ArxivMIA but reaches 0.122 on BookMIA. In a post-hoc BookMIA/Qwen diagnostic, replacing benchmark label-0 records with same-pool, never-fine-tuned records moves the reference from 0.257 to 0.523, supporting a comparison-population mismatch explanation for that tested cell. On the admitted ArxivMIA/Llama axis, no tested configuration of GA+GD, NPO-RT, or SCRUB passes the full conjunction. A GA+GD sweep makes the failure mode concrete: four of seven settings enter the membership chance region by across-seed mean, yet all four fail utility.

The boundaries matter. The BookMIA/Qwen repair does not establish that BookMIA generally fails, and the approximate-unlearning result is about tested configurations rather than the three method families in general. The ArxivMIA–BookMIA difference cannot be attributed to corpus alone because corpus, comparison population, and truncation co-vary; all scored BookMIA sequences hit the 512-token cap, unlike nearly all ArxivMIA sequences. Three runs support checkpoint-level verdicts, not statistical equivalence, while exact retraining also uses fewer optimizer steps on the smaller retain set. For a new audit, validate the deletion reference first, then require selective target movement and retained utility on the same checkpoint before interpreting a chance-level membership score as forgetting.

It shows how exact retraining can invalidate a familiar chance-level signal and gives a same-checkpoint procedure for separating selective deletion from broad utility damage.

[abstract; Section IV, paragraph 1 and Sections IV-C–IV-F (S4.p1; S4.SS3–S4.SS6); Section VI-B, paragraph 1 and Table I (S6.SS2.p1; S6.T1.2.3–S6.T1.2.5); Section VI-A, paragraphs 3–4 (S6.SS1.p3–p4); Section VI-B, paragraph 3 (S6.SS2.p3); Section VI-B, paragraph 4 (S6.SS2.p4); Section VII, paragraph 3 (S7.p3); token-cap detail: Section V-A, paragraph 2 (S5.SS1.p2); Section VII, paragraph 4 (S7.p4); reference-band qualification: Section IV-A, paragraph 3 (S4.SS1.p1.3); Section VII, paragraph 4 (S7.p4)](https://arxiv.org/abs/2611.33525v1)

## LoopTitan’s matched controls find little standalone benefit from parameter revisit

*[LoopTitan: What Does Parameter Revisit Buy a Mixture-of-Experts?](https://arxiv.org/abs/2611.34821v1)*

Looped MoEs revisit layer parameters across depth, increasing effective depth without adding parameters. LoopTitan argues that reported gains can be confounded by network shape and residual scale, so it tests revisit with matched non-revisit controls. Its central conclusion is narrow: in the tested setup, parameter revisit itself buys almost nothing.

The authors decompose the looped recipe with revisit last, then compare it with a non-revisit control. They also test revisit after adding compute, comparing it with more experts and with a deeper standard MoE at equal parameters and compute. The study compares AdamW and Muon, and analyzes residual scaling as a lower learning rate on revisited layers under AdamW; that effect disappears under Muon.

At matched budgets, the non-revisit control retains the recipe’s gain: most comes from network shape and the rest from residual scale. Beyond matched budgets, one extra visit gains more than doubling the experts. In the equal-parameter-and-compute comparison at 1.3B stored parameters and 5B tokens under Muon, the deeper control captured 90.2% of the extra-visit gain and was 1.1 mBPB worse than the visit across three seeds.

The transferable research operation is to treat revisit as a counterfactual, not a bundled recipe: match resources and computed depth, change one architectural factor at a time, and then compare added compute against both extra experts and independent layers. This makes a claimed sharing benefit separable from shape, optimizer, residual-scale, and compute effects.

The result is not a general verdict on looped MoEs. The experiments train from scratch on one dataset, DCLM-baseline, and compare test loss; downstream tasks and other data settings remain untested. Most reported results rely on one seed, with only nine models having more than one seed. The deeper equal-parameter-and-compute control is demonstrated under Muon only, so it does not establish the same comparison under AdamW. Larger-scale benefits remain open: the tested scales reach 3.0B stored parameters. Finally, the residual-scaling/optimizer equivalence assumes clipping never activates, while the reported runs clip on a small share of updates.

Read it for a concrete matched-control design that separates parameter revisit from network shape, optimizer, residual scale, and added compute.

[abstract; Section 5, paragraph 6 (S5.p6); Table B2 (A2.T2); Section 9, Limitations (S9.p4); Section 9, Limitations (S9.p5); Appendix B.4 (A2.SS4); Section 9, Limitations (S9.p4); Figure 4 caption (S5.F4); Section 9, Open questions (S9.p6); Appendix C.3, Gradient clipping (A3.SS3.p4)](https://arxiv.org/abs/2611.34821v1)
