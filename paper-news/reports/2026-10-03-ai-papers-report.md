# 2026-10-03

## Causal Interfaces Help Modular LLM Agents Only When They Are Identifiable and Actionable

*[When Do Causal World Models Help Modular LLM Agents](https://arxiv.org/abs/2610.00012v1)*

A trace may show that payment precedes shipment without identifying whether payment authorizes shipment, inventory mediates the effect, or a hidden trigger explains both. FedCausalCompose changes the target: it uses local actions as intervention-response evidence for cross-module interfaces and composes those interfaces into a causal world model.

Under the paper’s back-door and distribution-shift conditions, the observational Bayes predictor has positive interventional excess risk, so more observational data alone does not remove that gap. The probability of missing a true interface edge decreases exponentially with the minimum number of matched intervention-response opportunities, under the paper’s coverage assumptions. With sufficiently low mechanism and composition errors and enough interface coverage, the oracle FedCausalCompose error is strictly below the paper’s non-causal lower bound. The strict-dominance result is an oracle-side guarantee, conditional on adequate interface coverage and controlled local mechanism and composition errors; it is not a guarantee that the tested agent pipeline learns these quantities reliably.

The agent diagnostics test whether recovered structure is usable at action time. In the APIBank Stateful cell, reported task-success values rise from 3.61 to 4.64 to 5.67 for sequence-baseline, discovered-edge, and oracle-edge prompting, although the accompanying ROUGE-L values do not follow the same monotonic pattern. In the τ-bench retail anchor diagnostic, adding the anchor changes success from 70/45/45 to 60/60/75 for sequence, discovered-causal, and oracle-causal prompts, respectively. In the ALFWorld diagnostic, increasing the fraction of correct edges does not produce a reliable improvement in success, supporting the authors’ caution that raw edge lists may not guide narrative-environment control.

These agent results require caution: most LLM-agent cells are single-seed point estimates, and split-level Wilson half-widths are roughly ±7% to ±21%. The experiments use a centralized trace harness, so they do not test privacy-preserving decentralized execution. The prototype’s modularization and oracle edges are author-designed. For a new modular agent, independently vary matched intervention-response coverage and an attention anchor that makes an interface decision-relevant, then report intervention prediction and task success separately. That operation tests whether a causal interface is identifiable, usable, or both.

Read it to learn how to separate causal-interface recovery from whether an agent actually uses the recovered structure when choosing actions.

[Abstract; §§3–7; Appendices A.2 and A.4–A.6; §5, Table 1; §7 Limitations](https://arxiv.org/abs/2610.00012v1)

## Mid-Layer Ground-Truth Signals Usually Fail the Patching Test in Three Vision-Language Models

*[Encoded but Disconnected: Decomposing Vision-Language Model Failures under a Patching Null](https://arxiv.org/abs/2610.00024v1)*

An interpretable signal is not automatically a control point. Earlier tuned-lens work learns one affine translator per layer so an intermediate state can imitate the model’s later prediction distribution. This paper changes the question for VLM errors: when a mid-layer readout names the ground-truth answer, does changing that state change the final prediction? Its test pairs mid-layer decoding with residual-stream and per-head patching rather than treating decodability as causal evidence.

On POPE, the benchmark common to all three models, the evaluation scans mid-layer answer signals and patches receiver residual states with correct donor states across selected layers, positions, and heads, restricting comparisons to different-label pairs. The authors also assign errors to three operational modes—Perception Failure, Encoded-but-Disconnected, and Prior-Override—and report that these categories are learnable above 60% on each architecture.

The central result is a clean negative at the layer level: mid layers encode the ground-truth answer in 68–91% of errors, yet residual-stream patching produces 0% non-trivial prediction flips on LLaVA-1.5-7B, Qwen2.5-VL-7B, and InternVL3-8B under the reported protocol. The per-head sweep is also null at every tested Qwen tuple across 12,600 patched forwards; LLaVA’s one 1/32 tuple is treated as noise. InternVL3 supplies the exception: layer-20 head-2 shows a localized effect, described as a non-vocabulary, self-attending head with p&lt;1e-4. However, its norm-matched-random comparison is borderline at p=0.056, so the paper does not establish that head’s specific computational role.

The category analysis is useful as a hypothesis-generation device, not as a finished mitigation system. Under oracle labels, Re-Promote on LLaVA flips 85.9% of Encoded-but-Disconnected errors and 85.7% of Perception-Failure errors, while prompt-debias flips 19.6% of Prior-Override errors on Qwen and 21.3% on InternVL3. The paper reports no net-accuracy gain from routing with predicted categories.

For a new interpretability study, copy the protocol’s logic: use a probe to generate a hypothesis, patch matched cross-instance states, add noise and norm-matched controls, and state exactly which intervention family the result covers. The causal conclusion here is bounded to standard residual-stream and per-head patching; it does not rule out effects detectable by finer-grained attribution or path patching. Likewise, oracle-conditioned intervention responses should not be presented as deployable end-to-end improvements.

Read it to learn how to turn a high-accuracy intermediate probe into a causal test, and how to interpret intervention results conditioned on oracle error labels.

[abstract; Experiments, The causal null: mid-layer encoding is not causally active; Appendix C, Per-Head Patching: Full Sweep Details; Experiments, L20 head 2 on InternVL3; Appendix C, Table 5; Per-Category Intervention, Table 2 and Scope of the evaluation; Discussion, What we do not claim](https://arxiv.org/abs/2610.00024v1) · [Section 1, paragraph 4; Section 3, Equations 8–9](https://arxiv.org/abs/2303.08112v6)

## Bayesian Fine-Tuning Installs Usable Beliefs, but Recommendation Read-Out Remains Imperfect

*[Bayesian Fine-tuning Yields Language Models that are as Bayesian as their Beliefs Allow](https://arxiv.org/abs/2610.00679v1)*

Answer accuracy alone does not reveal whether a language model has Bayesian beliefs, uses them in computation, or converts them into a Bayesian choice. This paper asks whether fine-tuning on Bayesian recommendations changes those internal stages, rather than only the final answer. Its concrete baseline limitation is that standard supervised fine-tuning (SFT) on true answers falls short of the near-Bayesian behavior obtained by training on a Bayesian model’s outputs.

The method changes the training signal: BayesLM is fine-tuned on BayesAssist’s recommendations, whereas OracleLM is fine-tuned on true user choices. The evaluation is layered across behavior, decodable beliefs, causal sensitivity to belief-like information, and belief-to-policy read-out. A useful research operation follows from this design: measure output agreement, decode candidate beliefs, intervene on them, and then test whether those beliefs support the model’s own decisions rather than relying on one behavioral score.

On Gemma-2 9B’s original held-out flight-recommendation set, BayesLM reached Bayes accuracy of 0.84 versus 0.69 for OracleLM; this metric measures agreement with BayesAssist, not the user’s true preference. Linear probes recovered prior, likelihood-update, and posterior-related quantities from middle layers of both fine-tuned models, with stronger reported belief decoding for BayesLM than OracleLM. Under the selected prior-prototype patching setup, BayesLM reached balanced accuracy of 0.77 across layers 18–25, compared with 0.52 for OracleLM, indicating that its recommendations more often changed in the direction expected after the injected belief change. Cross-model patching transferred part of this advantage: BayesLM’s belief prototype raised OracleLM’s balanced accuracy from 0.52 to 0.61, while the reciprocal patch lowered BayesLM from 0.77 to 0.61. An external expected-utility read-out of probed beliefs produced only a small gain over BayesLM (+0.02) but a larger gain over OracleLM (+0.09).

Together, these measurements support a narrower conclusion than “the model is Bayesian”: Bayesian supervision is associated with stronger decodable belief structure and greater recommendation sensitivity under the selected intervention, while OracleLM does not fully express its encoded Bayes-relevant information in its native recommendations.

The boundaries matter. Linear probes establish decodability, not the full information content of the model. The causal interventions replace only the prior at fixed layers and tokens, so they do not establish the model’s internal expected-utility computation or complete policy formation. The main evidence also comes from one structured recommendation task with assumptions including independent reward features; transfer to less structured or analytically intractable tasks is unknown. For new uncertainty-reasoning studies, the paper’s most reusable lesson is to separate belief formation from belief use and policy read-out, then report where the failure occurs.

Read this paper to learn how to distinguish incorrect internal beliefs from failures to use otherwise decodable beliefs when evaluating uncertainty reasoning, while keeping its single-task and intervention-specific evidence in view.

[abstract](https://arxiv.org/pdf/2610.00679v1)

## Biological reasoning accuracy does not establish use of supplied representations

*[When Do Biological Reasoning Models Use Their Biological Inputs?](https://arxiv.org/abs/2610.00898v1)*

## The evaluation gap

The paper examines a specific interpretation problem: benchmark accuracy is taken as evidence that a biological reasoning model reasoned over its supplied foundation-model representation or biological text. Accuracy alone, however, does not show that changing a particular input would change the prediction. The study evaluates six models across DNA, protein, and single-cell tasks.

## What changes in the test

For each selected input, the authors perturb task-relevant content while keeping the query and other inputs fixed, then measure prediction changes and task performance. They also construct evidence conflicts by pairing a foundation-model representation from one genome, protein, or cell with text from another, and record which source the output follows. When performance is insensitive to an input, linear probes test whether the target is nevertheless decodable from the representation received by the language model. This separates information that is available in a representation from demonstrated use of that information by the model.

## Results

In the BioReason RL disease-prediction evaluation, shuffling and re-encoding both DNA windows left accuracy at 0.847 versus 0.847 across 1,449 KEGG-derived queries, although 101 individual answers changed. In the corresponding evidence conflicts, BioReason predictions agreed with the gene/pathway text source in 97.9% of cases rather than following the mismatched Evo2 representation. For BioReason-Pro, shuffling the protein sequence changed IA-weighted Fmax only from 0.855 to 0.856 when GO-GPT and InterPro inputs remained intact; its conflict outputs agreed with the GO-GPT source in 99.7% of cases.

These sequence results do not describe every biological input. For Cell2Sentence-Scale 27B, mean cell-type accuracy fell from 0.446 to 0.351 after gene-order shuffling across five atlases and 4,846 cells, with additional evidence that differentially expressed genes contributed to performance. Probes could predict task targets from Evo2 and ESM3 representations, but probe success does not establish that the reasoning model can access or exploit those signals. Across SFT and RL checkpoints of BioReason-Pro and 42 BioReason checkpoints, higher accuracy likewise did not imply greater contribution from biological inputs.

## Transferable operation

For a new multimodal model, borrow the three-part audit: matched input perturbations, evidence conflicts using unmodified inputs, and probes of representation decodability. Report aggregate metric changes separately from changed-answer rates, and treat probe accuracy as evidence of availability rather than use. Interpret shuffled-input results cautiously because shuffling can move representations outside the distribution of natural sequences. The findings are limited to the six evaluated models, tasks, inputs, and datasets; comparisons linking predictive training text to weak biological-input contribution are not controlled causal comparisons because architecture, task, training data, and scale also differ.

Read it for a reusable audit of multimodal reasoning: the paper combines matched perturbations, unmodified evidence conflicts, and representation probes while showing why decodability should not be confused with model use.

[abstract; Section 4.1, Biological perturbations; Table S2; Section 4.1, Evidence conflicts; Figure 3a; Section 4.1, Biological perturbations; Table S3; Section 4.1, Evidence conflicts; Figure 3b; Section 4.1, Biological perturbations; Figure 2e and Figure 5; Section 5, Limitations and future work; Appendix B.5, Discussion of training-time availability of predictive text](https://arxiv.org/abs/2610.00898v1)

## ICR Audits Multi-Agent Communication Through Correction and Preservation

*[Beyond Final Accuracy: Auditing Communication in LLM Multi-Agent Systems](https://arxiv.org/abs/2610.01042v1)*

Final accuracy is too coarse for evaluating multi-agent communication: it merges corrected errors with corrupted answers and cannot separate communication effects from a favorable architecture or additional reasoning. The authors introduce Independent–Communicate–Revise (ICR) to make those revision effects explicit.

In ICR, agents first generate independent reasoning records. The protocol freezes and reuses those records across communication conditions, evaluating directed, single-hop sender–receiver events without propagating revisions between events. It tests answer-only and full-text messages, latent communication, and a no-message revision control intended to quantify gains beyond additional reasoning. Correctness labels are used only for offline selection, stratification, and scoring, not to construct messages or drive revision.

The key metrics condition on both agents’ initial correctness. Correction rate (CR) measures whether a correct sender helps an initially wrong receiver; preservation rate (PR) measures whether an initially right receiver retains its answer when the sender is wrong. Selectivity summarizes these behaviors, but the paper cautions that it does not replace reporting CR and PR separately.

The payoff is visible when aggregate accuracy looks stable. On GSM8K, similar estimated aggregate accuracy coexists with a large preservation spread: Qwen3-4B conditions range from 46.74% to 73.91% PR, a 27.17-point gap, while estimated full-set accuracy spans only 94.68%–94.79%. Those full-set accuracy values rely on assumptions about unobserved revision outcomes, so the example is not a wholly measured accuracy comparison. Across MedQA, ARC-C, GSM8K, and GPQA-D, Full Text shifts revision toward more correction and less preservation than Answer Only; the reported interval for increased correction includes zero on GSM8K, whereas the preservation decreases exclude zero on all four benchmarks.

Receiver policy matters too. On MedQA and GPQA-D, Structured Verification produces lower CR and higher PR than Critical Evaluation for all three tested communication conditions, but its effect on selectivity is not uniform. The result supports treating channel behavior as jointly produced by message content, delivery interface, and receiver policy—not as an intrinsic channel property.

A transferable research operation is to freeze initial trajectories, add a no-message revision control, and report correction and preservation conditional on both agents’ starting states before claiming that communication improves a system. Keep the latent-channel comparison scoped: these results evaluate adapted message–interface combinations in ICR’s single-hop protocol, not the complete native systems from which mechanisms may be adapted. The reported bootstrap intervals also do not capture variation across unobserved generation seeds.

Read this to replace a single accuracy delta with a controlled test of whether agent communication repairs answers, preserves them, or merely adds another round of reasoning.

[abstract; §3.1, paragraph 2 and paragraph 3; §1, paragraph 3; §3.2, paragraph 4; §4.2, paragraph 2; Table 1; Table 1 caption; Appendix G, Interpretation; §4.3, paragraph 2; Table 3; Appendix I.3, Table 19; §4.4, paragraph 3; Table 4; §3.3, paragraph 2; Appendix B, Comparison scope; §3.3, paragraph 5; Appendix C.1, paragraph 3](https://arxiv.org/abs/2610.01042v1)
