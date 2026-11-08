# 2026-11-09

## Elliptic++ Random-Forest F1 Falls from 0.846 to 0.291 Under Leakage-Resistant Evaluation

*[Revisiting Elliptic++ for Bitcoin Forensics: Feature Reconstruction and Leakage-Resistant Evaluation](https://arxiv.org/abs/2611.04000v1)*

Elliptic++ has two concrete audit problems: its positional data split does not respect temporal order, and the exact definitions of its 55 address-level features were undocumented. The useful reading lens is therefore benchmark validity: a reported classifier score is only interpretable when the assignment of addresses and the information window for every feature match prediction time.

The authors reconstruct the 55 feature definitions by linking Elliptic transactions to public ledger data and provide executable code for leakage-resistant features. The pipeline assigns addresses to train or test by first appearance and computes features using only information available at prediction time. For the reported temporal comparison, training uses addresses first seen in steps 1–34 and testing uses those first seen in steps 35–49. This is the key method change: it audits split chronology and feature-history truncation as separate experimental factors rather than treating temporal ordering as a property of the split alone.

Table 4 makes the diagnosis more useful than the headline collapse by separating those factors. Changing the split alone sharply reduces RF illicit-class F1 from 0.846 to 0.257. Under the leakage-resistant pipeline, which changes both split and feature computation, RF illicit-class F1 is 0.291 versus 0.846 under the original evaluation, while temporal LR reaches 0.285. Replacing released features with truncated features changes 1.45% of training-address records and 0.52% of illicit ones; in this experiment, RF rises from 0.257 to 0.291. In this experiment, the split change produces the larger observed drop, while feature truncation has a modest measured effect.

The boundary matters. The reported temporal comparison uses one Elliptic++ cutoff, so it does not establish robustness across other cutoffs or datasets. LR and RF use default hyperparameters and a fixed 0.5 threshold; the result does not establish how tuned classifiers would rank. All 55 features also remain in the evaluation despite many being reported as highly correlated or exactly collinear, another reason not to treat the RF–LR ordering as final.

**Research operation:** for a new temporal benchmark, reproduce a two-factor audit. Vary the split chronology and the feature-information window independently, report the resulting conditions, and ask whether a score survives both changes. This paper’s transferable question is: could every input value have been computed at the timestamp when the prediction would actually have been made?

It provides a concrete three-condition comparison that separates the effect of chronological splitting from the effect of truncating address feature histories.

[abstract; Section 4.3; Section 5; Table 4](https://arxiv.org/abs/2611.04000v1)

## An Intervention-Blind Test Finds No Registry-Model Gain from Treatment Fields

*[Does Your Trial Simulator Know What the Drug Does? An Intervention-Blind Test of Interventional Validity on 7,207 Registered Trials](https://arxiv.org/abs/2611.05907v1)*

The supplied review separates plausible generated futures from valid treatment effects and recommends testing what-if rollouts for interventional validity. This paper narrows that broad agenda to a measurable question: how much held-out error does an intervention description remove beyond the information already present in the trial protocol?

From completed phase 2, 2/3, or 3 ClinicalTrials.gov studies with posted results, the authors construct 9,996 audited within-trial contrasts from 7,207 trials; the primary temporal test contains 878 binary contrasts from 655 trials. Each full predictor is compared with an otherwise matched blind reference: the same model, training trials, and procedure, but with intervention-identifying fields withheld. Endpoint, condition, eligibility, design, population, and comparator type remain available. Interventional skill is defined as 1 − MSE(full)/MSE(blind), so it measures incremental predictive value rather than performance against a completely drug-free input.

The decisive registry result is negative. On the primary binary temporal test, the registry-trained model has interventional skill of −0.12 [−0.20, −0.05] over five seeds: adding intervention fields lowers rather than improves held-out performance relative to its blind version. The authors interpret this as no detectable interventional skill, not as proof that the registry contains no intervention-relevant information. A frontier language model reading only the registered protocol has positive interventional skill of 0.20 [0.08, 0.31]. In a perturbation test, Sonnet 5 reverses the sign of its prediction in 86% of 742 contrasts when the trial arms are exchanged.

The blind condition is an important boundary. Haiku 4.5 recovers the withheld treatment’s drug class from the blind prompt in 45% of test contrasts, so the reported skill is a conservative lower bound on the contribution of explicitly supplied intervention information. Positive skill is also necessary rather than sufficient for interventional validity: the model could exploit an intervention correlate, and the benchmark does not test individual-level counterfactuals. Generalization is further limited by result-posting selection in ClinicalTrials.gov; pair construction is rule-based, with 96 valid pairings in an audit of 100 sampled contrasts. Calibrated error control also does not reliably transfer under temporal shift.

A portable research operation follows: compare every claimed intervention predictor with an otherwise matched intervention-blind reference, then exchange treatment and comparator labels and report how predictions change. Interpret any gain as incremental predictive value over retained context, and separately test whether it survives temporal shift and supports the intended counterfactual claim.

Read this for a concrete falsification control: it shows how to test whether a trial-effect predictor gains information from treatment fields rather than relying on endpoint, population, or comparator cues.

[abstract; Section 1, This paper; Section 4, Skill and The blind reference](https://arxiv.org/abs/2611.05907v1) · [§3, S3.p7.1](https://arxiv.org/abs/2511.16333v1)

## Reliable metadata can control answer choice even when supervised labels are correct

*[Correct Labels Are Not Enough: Reliable Metadata Can Silently Control Model Behavior](https://arxiv.org/abs/2611.04395v1)*

An evaluation that removes metadata can therefore miss dependence on it. The paper’s concrete change is a paired counterfactual audit: keep the question, answer choices, and gold answer fixed while removing the visible annotation or moving it onto a wrong choice.

The main experiment fine-tunes 7–9B open-weight models from three families on multiple-choice questions. During training, an annotation such as `(Reward: 5)` always marks the correct option, while every supervised target remains correct. At test time, the annotation is moved to a uniformly sampled wrong option. The audit compares what happens when the cue is absent with what happens when it is misleading, rather than treating cue-free accuracy as sufficient evidence of independence.

The result is pronounced in the reported CSQA setting: the tested adapters select the misleadingly cued option on 97.0–100.0% of items. Yet the same adapters retain 72–78% accuracy on average when the cue is removed. This combination is the paper’s decisive evaluation lesson: a model can answer many questions correctly without the field and still let that field capture its choice when present. Across the reported GSM8K, ARC-Challenge, and CSQA reliability experiments, cue-following rises as training-time annotation reliability increases, although the tasks and training recipes differ. Neutral and nonsense annotation words also produce near-ceiling following in the main setup, so reward-like semantics are not required for dependence to form there.

A reusable research operation follows directly: for every answer-predictive metadata field, construct matched evaluations that remove it, leave it aligned, and relocate it to a wrong option while holding the task and gold answer fixed. Report both ordinary accuracy and misleading-cue following. This tests reliance directly instead of inferring it from label correctness.

The evidence is behavioral: it does not identify how the cue is represented or whether the model has an internalized objective. The main study uses 7–9B models, at most 8,000 training items, and discrete answer selection. The Qwen3 DPO result is narrower still: it shows sensitivity in option-letter scores at β=0.05 and 0.1, not dependence in completed answers; the β=0.5 readout is uninformative.

Read it to learn a concrete metadata-removal and metadata-misplacement audit, and to see why cue-free accuracy alone can hide reliance on a visible field.

[abstract; §4, Table 1 and paragraph following Table 1; §6; Table 2; Appendix A, Reliability sweeps; §12; §11, Behavioral evidence; §11, Scope; §7, Table 3; Appendix K, Readout and Seed detail](https://arxiv.org/abs/2611.04395v1)

## GNN Edge-Deletion Fidelity Changes with Intervention Semantics

*[What Does It Mean to Remove an Edge? Intervention-Aware Fidelity for Graph Neural Network Explanations](https://arxiv.org/abs/2611.04751v1)*

Deletion fidelity is often measured by removing top-ranked edges and recording the resulting output change, but a message-passing GNN does not make “remove an edge” a unique intervention. Structural deletion removes the edge and recomputes graph-dependent quantities such as degree normalization or attention; message-channel suppression retains that structural context while blocking the message carried by the edge. Intervention semantics therefore become part of the estimand rather than a minor implementation detail.

An adjacent prior, GInX-Eval, already ranks edges, removes top-ranked fractions, fine-tunes the pretrained GNN on modified training graphs, and evaluates accuracy on modified test graphs. It separates the informativeness of a selected set from the ordering of edges through GInX and EdgeRank. Relative to that retraining-based procedure, this paper changes the question: it measures fixed-model output sensitivity and explicitly crosses the intervention used to construct a ranking with the intervention used to evaluate it.

The authors derive sufficient conditions for structural deletion and message suppression to agree: the message-passing aggregation must absorb zero messages, and coefficients on surviving messages must not depend on the edge set. They construct two edge Integrated Gradients rankings by placing continuous gates before graph-dependent normalization or attention for structural construction, and after that context for message-channel construction. Each ranking is evaluated under both interventions, with deletion fidelity measured as the trapezoidal area of output change over removal fractions from 0 to 0.5.

The controls support the theory: across nine GIN control cells, the largest target-logit evaluator gap was 9.28×10⁻⁶. Under the intact model’s predicted-class target logit, the construction-by-evaluation interaction was positive in 10 of 11 reportable GCN and GATv2 cells; in nine cells, each ranking had the larger deletion area under its matching evaluator. The result is conditional: the interaction count changed for margin and probability, so target-logit findings do not automatically transfer to another output functional.

A practical operation follows. Before comparing explainers, write down the intervention, output functional, target, and perturbation unit, then run the ranking-by-evaluator 2×2 crossing when the scientific question does not uniquely select one counterfactual. Neither intervention is established as universally preferable, and a large deletion area measures sensitivity to the specified perturbation—not recovery of an annotated rationale or a causal effect. The main analysis also ranks directed arcs separately, so removing one direction can leave the reverse message channel intact; bond-level results answer a different perturbation question.

Read it to learn a concrete 2×2 evaluation design for detecting when an explainer’s ranking and the evaluator’s deletion semantics are measuring different counterfactuals.

[abstract; §5, Equation 4 and accompanying text; §7, Equivalence controls and sensitivity to the reported quantity; Abstract; §7, Table 2 (Appendix C); §7, Controlled construction-by-evaluation crossing; Table 2 (Appendix C); §7, Equivalence controls and sensitivity to the reported quantity; Table 3 (Appendix C); §8, Meaning of the counterfactuals; §8, Attribution and perturbation unit](https://arxiv.org/abs/2611.04751v1) · [Section 3.3, GInX-Eval; Section 3.3.1, GInX Score; Section 3.3.2, EdgeRank Score](https://arxiv.org/abs/2309.16223v2)

## Germline Execution Limits Disclosure by Signed MCP Tools

*[Signed, Sealed, Leaked: Trust Beyond Signature for MCP Toolchains](https://arxiv.org/abs/2611.06585v1)*

A signed MCP server can be authentic and still leak confidential information: the paper describes a legitimately signed tool that performs its advertised function while embedding sensitive data in requests to a policy-allowed destination. The concrete limitation is destination-based confinement: in the tested MCPGuard configurations, destination controls blocked the direct unlisted-host attack but did not prevent the tested cross-call pool or within-call smuggle disclosures through the authorised OCR destination.

Germline execution changes the enforcement point: each tool invocation runs in an ephemeral copy forked from a data-free germline, and each copy receives only information authorised for its destination. The mechanism therefore limits disclosure by limiting the data available to the executing copy, rather than by deciding whether the signed implementation is benign. Under explicit assumptions on copy confinement and a data-free germline, the paper proves sink noninterference for every signed release; for releases deterministic within its replay model, a verified witness can establish a flow violation. The witness is evidence of a flow violation, not a prerequisite for the prevention result.

The decisive empirical result is scoped to the authors’ controlled test world and canary oracle: in the scripted evaluation, Germline detected no canary disclosures across 153 attack runs, while the tested baselines and Germline-NoSplit ablation had nonzero detected disclosure rates. The generated-variant result is similarly bounded: Germline detected no canary disclosures for 91 validated author-generated attack variants, including 20 targeting policy-allowed hosts. These results do not establish deployment-wide protection or an independent benchmark result. Single-copy calls took 10–49 ms and were reported as 2–28 times faster than the fresh-process-per-call baseline; the speed-up does not apply generally to multi-copy calls.

For research practice, reproduce the threat as two separate tests: cross-call state reuse and within-call mixing through an allowed destination. Then measure disclosure, task completion, witness production, and latency under the same policy and oracle. The scope matters. The formal prevention result excludes covert timing and microarchitectural channels; sequential copies reduce a measured timing channel, but do not establish its elimination. Remote tools cannot be forked or twinned; they receive only worst-case reply labels and no witnesses. Finally, the guarantee concerns information disclosure, not whether an allowed action is safe or intended; action control must be supplied by another layer. The prototype is implemented for Python MCP servers, so compatibility with other runtimes remains an evaluated research question.

Read it to learn how destination-specific data views and disposable execution copies can be tested against signed-tool leakage, while keeping the conditional guarantee, oracle-scoped results, and disclosure-only boundary explicit.

[abstract; Section VII-B; Appendix B, Table X; Section VII-C; Figure 3; Appendix B, Table XI; Section VII-C; Appendix B, Section B-B; Section VII-F; Table VII; Section IX-B; Section III-B; Section IX-B; Section VI; Section IX-A](https://arxiv.org/abs/2611.06585v1)
