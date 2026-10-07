# 2026-10-08

## Semantic-Entropy Routing Requires Difficulty Controls, Headroom Checks, and Live-Cost Accounting

*[Evaluating Escalation Signals for LLM Routing: Targets, Controls, and Five Ways to Fool Yourself](https://arxiv.org/abs/2610.07354v1)*

Escalation routing should be judged by whether a larger model repairs a small model’s error—not merely by whether the small model appears uncertain. This paper tests semantic entropy: disagreement in meaning among sampled answers from the small model, measured before the larger model is called. It also adds a cheap, question-only difficulty estimate, making it possible to ask whether entropy contributes information beyond how hard the question looks.

The method change is evaluative rather than a new entropy estimator: compare semantic entropy with question-only difficulty, define the escalation target explicitly, check oracle headroom, and charge the cost of generating the signal. The strongest positive result is conditional. On a 250-item GSM8K run with Gemma-3 1B/12B and k=10 samples, semantic entropy reached AUROC 0.871 for identifying small-model errors, but only 0.734 for predicting whether escalation would help. Error detection and escalation value are therefore distinct evaluation targets. The apparent routing gain also does not automatically imply cheaper serving: at k=10, an escalation rate of 0.56, and an assumed cost ratio of 12, the configuration was estimated to cost 39% more per query than always using the large model. That conclusion depends on the cost proxy and operating point.

The negative controls explain why. On synthetic arithmetic, a regex-derived difficulty score matched entropy’s discrimination, so the apparently strong result did not establish value beyond question difficulty. The same benchmark had only 0.021 oracle-accuracy headroom over always-large—0.677 versus 0.656—limiting what any router could win. PopQA exposed a different precondition: after correcting grading, both models remained wrong on most items and no pre-flight item showed the small-wrong/large-correct outcome required for escalation.

For a cheaper cached alternative, retrieval of past outcomes fell from AUROC 0.908 on synthetic arithmetic to 0.518 on GSM8K; an embedding–difficulty diagnostic run before the GSM8K test anticipated the collapse. Those retrieval estimates have no bootstrap confidence intervals, and behavior outside knowledge-base coverage was not tested. A practical research operation follows: define the escalation label before measuring, report a question-only control and oracle headroom, and include signal-generation cost alongside routing AUROC. The boundary is important: the positive live result rests on one dataset and one model pair; sampling temperature stayed at 0.7 and the NLI entailment threshold at 0.5. The paper therefore offers a reusable evaluation protocol, not evidence that semantic entropy generalizes across routing deployments.

Read this for a pre-run protocol that can distinguish an uncertainty signal from a difficulty proxy before routing costs and benchmark headroom distort the result.

[abstract](https://arxiv.org/abs/2610.07354v1)

## Natural-Range Tests Separate LLM Feature Steering from Feature Use

*[Does the Model Use the Feature? Separating Steering from Mechanism in LLMs](https://arxiv.org/abs/2610.07270v1)*

### The limitation

A feature can track a concept, and manipulating it can change a related behavior, without establishing that the model uses the feature in its own computation. Arbitrary-strength steering is particularly difficult to interpret when it pushes a feature outside its natural range, where the effect need not reflect the model’s computation.

### The contract

The paper proposes an empirical contract that evaluates features at values observed on natural inputs. For matched inputs, installation copies the naturally observed feature value from an input showing a behavior into one that does not; removal performs the reverse. A third test edits an upstream state, then restores the feature downstream while leaving the upstream edit active. Installation measures how much the feature suffices for the behavior, whereas removal and downstream rescue measure how much the model uses it. These are separate, intervention-conditional strengths rather than one general mechanistic score.

### What the audit found

The audit reproduces strong association and steering for two published Gemma entity latents: they separate known from unknown entities, and steering the unknown-entity latent raises abstention from 33.0% to 79.0% on the reported test. But for that latent, a natural-range target changed abstention by only 1.5 percentage points, with an interval spanning -1.2 to 4.2, while a beyond-range target changed it by 12.0 points. On matched known–unknown prompts, installing either published latent transferred only a small fraction of the natural abstention contrast, and all four paired-effect intervals included zero.

The other representations show why the tests must remain separate. Dense known–unknown directions had opposite installation/removal patterns: Llama 3.1 8B showed installation/removal/rescue strengths of 0.89/0.07/0.26, while Gemma 2 2B-IT showed 0.27/0.61/0.09. By contrast, the released subject–verb agreement feature set reached about 0.95 for both installation and removal and 0.88 for rescue under its decoder update. Results also depended on how values were written into the residual stream: the decoder update produced higher installation and rescue strengths despite less exact feature-value matching.

### Boundary and research use

These results do not identify a feature independently of the tested representation, sites, edited tokens, update rule, and behavioral measure. Even natural donor values can form residual states that no input naturally realizes. Single-site, single-token edits can also miss computation distributed across tokens and layers. Rescue was not run for the published entity latents, so their use strengths are lower bounds under the paper’s definition.

A practical research operation follows: after a steering result, construct matched natural-value installation and removal tests, add downstream rescue when an upstream edit is available, and report the intervention details beside each strength. The question is not merely whether the feature can move behavior, but which tested intervention shows sufficiency or dependence—and how far that conclusion extends.

Read it to learn a concrete audit for distinguishing a feature that can steer behavior from one that the tested model computation measurably uses.

[abstract; §4; §5.1; §5.2; §5.3; §5.4; §6](https://arxiv.org/abs/2610.07270v1)

## pass@k Does Not Establish Output-Diversity Retention After Post-Training

*[What pass@k Cannot Measure: Evaluating Diversity and Capability Retention after Post-Training](https://arxiv.org/abs/2610.07405v1)*

At the population level, pass@k depends on a problem’s per-sample probability of correctness, so it cannot distinguish models with equal correctness probability but different distributions over correct answers, incorrect answers, or reasoning paths. This is a structural limitation, not an experiment-specific failure.

**Method.** The study compares GRPO with rejection-sampling fine-tuning (RFT) on Qwen2.5-1.5B-Instruct trained on grade-school math; RFT trains on the model’s own shortest verifier-passed rollout. It measures token-level entropy, answer-level entropy, and unique answers per prompt, then adds correct-only, length-matched, and incorrect-only checks.

**Findings.** On the tested setup, GRPO decreases all three reported diversity measures in every seed, while both RFT arms increase all three in every seed. On GSM8K, pass@1 separates the arms, while pass@8 and pass@32 do not show a consistent detected difference. Among verifier-correct completions, GRPO’s lexical diversity is lower than RFT’s, and the reported difference remains after matching completion length. Thus, a larger pass@1 value can coincide with less diversity among correct outputs.

The starting-checkpoint comparison changes the interpretation of the arm ranking. On a hard MATH-500 subset, RFT reduces measured coverage relative to the starting checkpoint at low k, while GRPO shows no statistically detected difference from baseline. Therefore, GRPO’s advantage over RFT there is not evidence of a gain over the starting model; it can instead reflect a smaller loss.

**Boundary and research use.** The evidence is bounded to one 1.5B starting checkpoint; whether the effect holds at larger models is untested. Correct-only diversity, length-matched diversity, incorrect-only diversity, and the paired arm-difference analyses use only two seeds, not three. The comparison also does not isolate which algorithmic difference causes the diversity results.

For a new post-training study, report pass@k against the unchanged starting checkpoint and treat diversity as a separate measurement target. A practical minimum is to inspect output diversity overall, among correct outputs, and among incorrect outputs, with length controls where lexical metrics are used. This turns “which arm wins?” into two explicit questions: did correctness probability change, and what happened to the distribution of solutions?

Read it to redesign post-training evaluations: the paper gives a concrete test for separating a pass@1 advantage from diversity retention and from improvement over the starting checkpoint.

[abstract; §1 Introduction, paragraph 2; §3, “Diversity moves in opposite, seed-robust directions”; Table 1; §3, “pass@1 separates the arms cleanly; pass@8/32 do not”; Table 2; §3, “The gap survives restricting to correct solutions only”; length control in the following subsection; §3, “No trained arm significantly improves over the starting checkpoint on hard problems”; Figure 2; §5 Limitations; §5 Limitations; Appendix, Seeds and run structure](https://arxiv.org/abs/2610.07405v1)

## Hallucination Benchmark Labels Depend on Whether Judges Assess Reference Faithfulness or Factual Correctness

*[The Labeling Problem in Hallucination Detection Benchmarks: An Empirical Evaluation](https://arxiv.org/abs/2610.08026v1)*

Short-reference open-domain QA benchmarks can conflate two targets: reference faithfulness—whether an answer is fully supported by the reference—and factual correctness—whether it avoids contradictions and factually false specific claims. Automated labelers may apply the first criterion even when the intended target is the second.

To audit this mismatch, the authors used 900 human-labeled question-answer pairs spanning three commonly used QA datasets and three generator models. They evaluated lexical similarity metrics, a reference-entailment NLI baseline, and seven LLM judges under controlled prompt variants. The key comparison kept the generated answers fixed while GPT-5-mini switched between a faithfulness-style prompt and a factual-correctness prompt before its labels were compared with primary human labels.

For GPT-5-mini, changing from the faithfulness-style prompt to the factual-correctness prompt significantly improved paired agreement with human labels for each of the three generator sets; the gains were largest on Mistral-7B outputs. This comparison is specific to the tested prompts, judge version, and answer set. The factorial ablation supports criterion alignment, rather than prompt elaboration alone, as the main source of the agreement gain for GPT-5-mini. The effect is demonstrated on this benchmark and does not establish that prompt structure never matters.

An additional intervention removed elaborative material from 138 answers that both human annotators had labeled non-hallucinated: removing elaboration reduced p1 false positives from 52.9% to 23.2%, supporting elaboration as one contributor to faithfulness-prompt errors, but not all such errors. Separately, under the strict setting, the tested T5-11B entailment baseline produced overwhelmingly false-positive errors against the factual-correctness labels; this is evidence about that model and threshold, not NLI systems generally.

The research operation to borrow is a paired label audit: define the target in terms of contradiction versus reference absence, hold answers and judge version fixed, then test criterion and prompt structure separately. Ask whether a label change reflects a different construct or merely a formatting intervention.

Boundaries matter. The study was limited to English open-domain QA with short references and three relatively small open-weight generators; generalization to other languages, longer responses, domains, task families, and generators remains untested. The independent annotator overlap showed κ=0.808 and 90.3% raw agreement, but the reported agreement estimates annotator reliability, not error-free ground truth. The reported comparisons are conditional on the specific answers, judge versions, prompts, and inference configurations evaluated here.

Read it to learn a concrete paired-prompt audit for separating reference coverage from factual correctness before choosing an automatic benchmark labeler.

[abstract; Section 4.1; Table 1; Appendix D.2, Table 6; Appendix D.3; Tables 8–9; Appendix E, Paired elaboration-removal intervention; Section 4.2; Table 2; Appendix C.3; Section 5.4; Appendix A, Inter-Annotator Agreement; Table 3](https://arxiv.org/abs/2610.08026v1)

## A Probe Score Requires a Declared Floor and Ceiling

*[How High Is 0.6? Floors, Ceilings, and Headroom in Interpretability Probing](https://arxiv.org/abs/2610.08544v1)*

An $R^2$ value of 0.6 has no fixed interpretation: it may reflect predictability already present in the input, and the same score can mean different things on different data. The limitation addressed here is therefore concrete: a raw score does not identify what the representation adds.

The method change is to declare the target $T$, a restricted information set $O$, and the full input $I$ before interpreting the probe. The paper defines the floor as the best population predictability available from $O$, the ceiling as the best predictability available from $I$, and headroom as their difference. When headroom is positive, the normalized score reports the fraction of that gap recovered by the representation: $U_H=(R^2_H-\rho^2_O)/(\rho^2_I-\rho^2_O)$. In practice, the reference points are estimated with a fixed bank of linear and nonlinear decoders trained on features from $O$ and $I$ using separate data splits.

The formal analysis separates two reasons for low headroom: the target may be weakly sensitive to a latent variable, or the available input may fail to identify that variable. Thus, low headroom need not mean that the representation failed to recover information the task could use.

The decisive controlled test uses transformers trained for random-effects meta-analysis. Under an ID-to-OOD shift, final-position prediction MSE for the xl model rose 12×, while recovered headroom for log $S_1$ changed from 0.78 to 0.82 and for $\tau^2$ from 0.84 to 0.85; the lower ceilings and similar recovered shares support the authors’ interpretation that the shifted data lost information rather than the representation losing relative effectiveness. This interpretation is evidence from the controlled task, not a guarantee for every distribution shift. In two fully specified generative testbeds, estimated floors, ceilings, and headroom also lay close to exact values.

The framework changes how applications should be read. Across four real single-cell datasets, scGPT recovered 0.28–0.57 of dataset-specific headroom beyond sequencing depth, indicating partial encoding of biological overdispersion. In role-played conversations about user attributes, pooled n-gram floors of 0.92–0.98 placed each published reading-probe score within the floor’s 95% interval, so surface wording explained most of those scores.

The boundary is essential: changing $O$, $I$, or $T$ changes the scientific question, and a normalized probe score remains correlational evidence of decodability rather than proof of causal use. The exact-reference controlled evidence also comes from deliberately simple tasks and small transformers. For a new probe, report the raw score together with the declared floor, ceiling, headroom, endpoint-estimation method, and the contrast-specific question being tested.

Use this paper to turn a familiar probing result into a sharper experiment: specify what the input already reveals, estimate what the full input can reveal, and report what fraction of the remaining gap the representation recovers.

[abstract; Section 5, Conclusion; Section 4.1, Floor, ceiling and headroom; Appendix F, Corollary F.2; Section 4.2.1, Meta-analysis; Appendix A.1; Appendix M, Table 12; Appendix H, Validation against exact values; Table 3; Section 4.2.2, Genomics and single-cell data; Appendix M, Table 13; Appendix K.5, User attributes in conversations; Table 9; Section 5, Limitations; Section 2, Distribution shift and causal relevance](https://arxiv.org/abs/2610.08544v1)
