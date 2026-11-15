# 2026-11-16

## IntentTwin separates conditional ranking from target-free proposal in offline web evaluation

*[IntentTwin: Deconfounding Candidate Support and the Oracle-to-Deployment Gap in Offline Web Behavior Prediction](https://arxiv.org/abs/2611.12918v1)*

Offline web-action evaluation can let candidate support reveal the answer before behavioral competence is tested. IntentTwin audits this failure mode on a filtered, session-disjoint OPeRA test: under the original target-anchored 16-candidate construction, every target-OOV row contains one OOV gold action and 15 in-support negatives. SIR and a support-only rule are both 1.0000 on those rows, which the paper diagnoses as a candidate-construction shortcut rather than successful behavioral modeling.

The method change is to make support composition an explicit experimental variable. The paper defines support-identifiability rate (SIR), uses the training action vocabulary to distinguish IV and OOV actions, and constructs support-balanced candidate sets. In the primary q=4 condition, four candidates are out of support, removing unique support-status identification on OOV rows. Separately, it evaluates a target-free dual-path proposer that combines support retrieval with open-vocabulary DOM/LM proposals, gates a fixed proposal budget, and reranks the merged set. Proposal recall, covered conditional accuracy, and end-to-end accuracy are reported with separate denominators.

The decisive OPeRA comparison is conditional versus target-free. With support balancing, SIR falls to 0.0000 while the conditional reranker reaches 0.5668 OOV Exact@1, 0.7214 overall, and 0.7988 IV. The target-free dual path reaches Proposal Recall@16 of 0.6915 and end-to-end Exact@1 of 0.5212, including 0.4562 on OOV; against oracle conditional Exact@1 of 0.7450, this is a same-split gap of 0.2238. On Mind2Web’s official cross-domain split, the audit reports SIR 0.2924 and an oracle-to-end-to-end gap of 0.2295; these remain offline candidate-coverage and ranking measurements.

For an evaluation study, the reusable operation is to publish both conditional ranking and target-free proposal results, then vary the support composition before interpreting accuracy as behavioral competence. Exact-key OOV should remain a lexical support measure, not a direct semantic-novelty label: in a 200-row audit, 0.7150 were judged semantically novel, 0.2450 locator/string variation, and 0.0400 ambiguous. That audit is a sample rather than a full-test-set estimate. Finally, the primary OPeRA results do not establish unseen-user transfer because users recur across splits.

Read this to learn how to test whether an offline agent’s candidate set leaks the answer, and how to report proposal coverage separately from conditional ranking accuracy.

[abstract; Section 4.2, S4.SS2.p1; Table 1, S4.T1; Section 4.2, Table 1, S4.T1.2.7; Section 4.4, Table 3, S4.T3.2.1.7; proposal contract in Appendix A.2, A1.SS2; Section 4.6, Table 5, S4.T5.2.1.4; Section 4.7, Table 6, S4.T6.2.2; Section 4.7, S4.SS7.p1; Section 4.7, S4.SS7.p2; Section 3.3, S3.SS3.p1; Section 4.11, S4.SS11.p1](https://arxiv.org/abs/2611.12918v1)

## Online equation checks raise accuracy on ASyMOB with a 6–7% token increase

*[Catch It Where It Happens: Real Time Error Correction During LLM Reasoning](https://arxiv.org/abs/2611.13107v1)*

Existing safeguards described by the authors either check only the final answer and restart from scratch, or rely on a verifier LLM that competes for GPU capacity and slows response time. The paper changes the intervention point: the method checks equations during free-form generation, asynchronously from the model, and intervenes only when a check fails.

Completed equations are extracted from the token stream, and chained equalities are split into pairwise claims. A computer algebra system compares both sides numerically, including sampled substitutions for expressions with free symbols. The check runs on CPU while generation runs on GPU. A failed check causes rollback to the offending step and corrective feedback before generation resumes. Only a failed numerical check triggers intervention; holds, not evaluable, and timeout leave generation uninterrupted.

The reported evaluation used 2,700 easy-to-intermediate ASyMOB problems, three open-weight models, and five repeats per problem under plain and checked generation. Checked generation increased mean accuracy for every model: from 62.4% to 68.0%, 23.4% to 24.8%, and 45.2% to 48.2%. The reported gains of 1.4–5.6 percentage points came with a 6–7% increase in mean tokens per answer. The authors interpret the gains as concentrated where baseline performance is inconsistent, rather than where the model consistently fails or succeeds.

That interpretation needs care: the flagged-group comparison is not a matched-trace causal comparison because group membership can differ between checked and plain generation. The paper reports approximately 22–25 ms of CPU time per check, but does not establish the overall serving-latency cost.

A passed check means numerical agreement under the performed checks, not a formal proof. Local identity checking therefore does not establish that a step follows from the problem’s assumptions or that the overall solution strategy is valid. The evaluation covers one benchmark and three models from two families, so the method’s generality beyond explicit mathematical manipulation remains unshown. For a new domain, the useful research operation is to identify a local invariant, measure how often it is extractable and how often failures lead to successful repair, then report token overhead separately from controlled wall-clock latency. The central question is whether the invariant catches errors early without being mistaken for validation of premises or strategy.

Read it for a concrete test-time design pattern: extract locally checkable claims during generation, repair only detected failures, and evaluate checker coverage and serving cost separately from final accuracy.

[abstract; §3, paragraph 1; §3.2, paragraph 2; §4, paragraph 1; Table 1; §4, paragraphs 4–5; Figure 4; §4, paragraph 3; §5, paragraph 2; Table 1; §3, paragraph 2; §5, paragraph 8](https://arxiv.org/abs/2611.13107v1)

## Action-gradient audits and feedback-law anchors form a model-based flow-control workflow

*[Audited Gradients, Anchored Policies: Model-Based Reinforcement Learning for Efficient Flow Control](https://arxiv.org/abs/2611.13203v1)*

Forward prediction is not the same as a usable control derivative. The paper starts from a concrete failure mode: policy optimization uses the objective’s derivative with respect to action, but a surrogate can track the flow trajectory while misestimating that derivative. One surrogate predicts the objective at correlation 0.9996, yet its action gradient correlation is only 0.459, so forward accuracy does not identify a usable surrogate.

The proposed workflow audits the quantity that policy optimization will exploit. Before each audit, the sampled states, reference actions, rollout horizon, perturbation sizes, and acceptance thresholds are fixed. On held-out states, the surrogate’s automatic-differentiation action gradient is compared with a central finite-difference estimate from the high-fidelity solver. The default criteria use pooled correlation, sign agreement, and median per-actuator correlation; all applicable criteria must pass. A passing surrogate supplies the gradient field. After failure, the procedure uses measured gradients unless a replacement surrogate passes a new audit. A low-dimensional feedback law is fitted to the trusted field, used to initialize a neural policy, and retained as a quadratic anchor during policy optimization.

The experiments show why the audit and anchor are separate safeguards. For a rotating cylinder, a surrogate gradient agreed with paired solver measurements at correlation 0.996, yet pathwise optimization without the anchor and from an initialization unrelated to the fitted law worsened the objective by 0.52% on average. The law-initialized, anchored policy instead achieved a 3.33% reduction; this comparison does not isolate initialization from the anchor. In forced turbulence, the surrogate failed all three audit criteria, but the measured-gradient branch achieved 82.01% enstrophy reduction versus 30.63% for PPO across the reported seed means, while using the surrogate only for a tightly constrained residual.

Across four test cases, the complete audited route used fewer counted high-fidelity solver interactions than one model-free run, with reported ratios from 3 to 156. Those ratios are conditional: the forced-turbulence count excludes the high-fidelity transitions used to fit its surrogate, and other cases have their own accounting scopes.

The transferable research operation is to audit derivatives on held-out states and around actions the optimizer is likely to apply, then re-audit after the policy distribution moves. Treat a pass as local, not as a controller guarantee: the study reports that a surrogate passing at one fixed action failed around deployed actions, and its thresholds have no theoretical link to trained-controller performance. A useful follow-up question is how to adapt audit coverage while recording the full cost of surrogate data collection.

Read this as a concrete reliability case study for differentiable simulators: it turns the distinction between accurate predictions and useful optimization gradients into a held-out test, a fallback, and a policy-level safeguard, while documenting where those safeguards remain local or incompletely costed.

[abstract; Section 3.1, paragraphs 1–3; Section 3.3, paragraphs 5–8; Section 4.1, paragraph 5; Appendix F, Section F.1; Section 4.3, paragraphs 3–6; Appendix H, paragraphs 1–2; Section 4.5, paragraphs 1–4; Appendix K, Table 10; Section 3.1, paragraph 3; Section 3.2, paragraph 3; Appendix I, Table 7; Section 4.5, paragraph 3](https://arxiv.org/abs/2611.13203v1)

## CLADE finds that category-level evidence can reduce abstention while increasing wrong answers in RAG

*[CLADE: Category-Level Answering from Deficient Evidence in Retrieval-Augmented Language Models](https://arxiv.org/abs/2611.14355v1)*

CLADE identifies a third evidence state in retrieval-augmented answering. It calls accurate, relevant text that names a broader category but not the requested entity “resolvable insufficiency”: the category maps to a short candidate list, but text alone cannot settle the exact answer. When models read these coarse passages, they exhibit Clade—answering instead of abstaining or searching further. This is a narrower failure mode than generic context insufficiency.

SURE-RAG’s core design aggregates local claim–passage relation distributions into an answer-level sufficiency judgment, rather than relying on max/mean passage pooling. CLADE instead asks what happens when evidence is relevant but only category-level, and whether an ontology can support a hand-off. The distinction prevents treating this paper as a general solution to selective answering.

On biomedical PrimeKG questions, the authors compare family-only pages with silent pages using multiple-choice questions with a designated decline option. A same-question counterfactual retains the parent-category name or deletes the evidence sentence, holding the question, options, and model fixed. They also test confidence filtering, model scaling, and an abstention instruction, then repeat the family-only comparison in GloBI ecological questions.

In pooled PrimeKG results, family-only pages reduced abstention by 13.8 percentage points relative to silent pages, while the freed answers included a significant increase in wrong answers. In the counterfactual edit, retaining the parent name rather than deleting the sentence lowered abstention by 17.4 points and increased wrong answers by 5.1 points. GloBI showed the same direction: family-level evidence reduced abstention and primarily increased wrong answers. The tested safeguards did not cleanly separate unsupported family-level guesses from supported answers.

The ontology experiment separates coverage from recovery. When the correct family is supplied, expanding its MONDO descendants produces a candidate list containing the sampled answer in 98.5% of cases—an oracle-conditioned result. With page-derived families, prompted selection improved candidate-list coverage over simple rules, but the paper reports a 50% ceiling because the correct family was absent from usable options for half the facts. Even after the family was known, a disease-popularity prior outperformed the tested model and relation-specific evidence choosers, leaving final selection unresolved.

For a RAG designer, the transferable operation is to log three gates separately: detecting category-level insufficiency, identifying the relevant family, and selecting the exact candidate. Route the first gate to an ontology or request more evidence, but do not score ontology-list coverage as end-to-end answer recovery.

The principal abstention results use constructed multiple-choice questions with a designated decline option; a 120-question free-text check is directionally consistent but does not remove this format limitation. Ontology recovery is evaluated only for PrimeKG, and the scaling comparison is limited to Qwen2.5 sizes up to 14B plus other 7–8B open models. Page-based ontology extraction is vulnerable to wording and matching failures.

Read this for a concrete RAG design boundary: the same parent-category evidence that makes a model answer less cautiously can be used to trigger an ontology hand-off, but family identification and exact candidate selection must be evaluated as separate reliability stages.

[abstract](https://arxiv.org/abs/2611.14355v1) · [§I, paragraph 3; §IV-A–B; Table I](https://arxiv.org/abs/2605.03534v2)

## Agent Evaluators Disagree at the Write Boundary

*[When Evaluators of AI Agents Disagree: An Empirical Study of Native Scoring, LLM Judges, and Commit-Boundary Checks on tau2-bench](https://arxiv.org/abs/2611.14581v1)*

The paper starts from a concrete evaluation assumption: benchmarks compare a final state with a gold answer, while deployed services may have no gold state and instead ask an LLM to read the transcript; practice treats the two routes as interchangeable. It tests that assumption by separating task correctness, policy compliance, and whether a database write should have occurred.

On tau2-bench’s airline and retail domains, the authors ran 2,160 episodes and recorded every database write. Each episode received four scores: native gold-state scoring; a transcript-based LLM judge; that judge with the policy document; and a minimal boundary evaluator checking whether an expected write occurred. Two annotators independently labeled a stratified sample of 120 episodes on task correctness, policy compliance, and commitment correctness. This changes the measurement question from “did the agent finish?” to “which property does this evaluator measure?”

The judge was highly repeatable—98.2% self-agreement—but matched native scoring on only 56.2% of episodes, so repeatability did not imply agreement with the outcome-based oracle. In the 11 human-confirmed premature-commitment episodes, the main gpt-4.1-mini judge configurations passed 10 or 11; supplying the policy or removing input truncation did not reliably fix the misses. A stronger tested judge still passed 6, whereas the boundary evaluator caught all 11. On the human labels, no judge significantly exceeded that minimal check on the reported task- and commitment-correctness comparisons; this is not evidence that they are equivalent.

The safeguard experiment also needs a qualified reading. With gates disabled, premature commitments occurred in 60 of 540 episodes (11.1%), but the tested cumulative gate configuration did not significantly reduce them after Holm correction. Trace inspection identified evidence loss in the verifier digest as a cause of false rejection in two analyzed retail episodes: relevant order-status or authentication evidence was truncated. The authors did not quantify how much this defect contributed to aggregate gate results.

Research operation: for a new tool-using benchmark, log every write, annotate whether a write is expected, and obtain a small, independently labeled sample for task, policy, and commit correctness. Compare each evaluator to the property it claims to measure, then inspect traces specifically where the scores disagree. Treat the boundary check as a targeted instrument, not a universal replacement: it needs a per-task expected-write annotation and checks write direction rather than write-content correctness. Policy compliance remains unresolved here: no automatic evaluator exceeded the always-compliant baseline on the human-labeled axis, while human agreement on that axis was comparatively difficult. Finally, transfer is open: the study covers two customer-service domains, one repository commit, and two models from the same family and generation; its human reference also has limited organizational independence.

Read this paper to learn how to split agent evaluation into task, policy, and write-decision labels before trusting a single judge score.

[abstract; Section 4.4, Episode generation; Section 4.6, Human reference labels; Section 5.1, Table 4; Section 5.2, paragraph on premature commitments; Section 5.3, Table 6; Section 5.3; Appendix 10.3, paired differences; Section 6.1; Section 6.2, Table 7; Section 6.3, Trace anatomy; Appendix 10.4; Section 3.3, The boundary evaluator; Section 5.2, Table 5 and paragraph on policy compliance; Section 8.3, External validity; Section 8.1, Construct validity](https://arxiv.org/abs/2611.14581v1)
