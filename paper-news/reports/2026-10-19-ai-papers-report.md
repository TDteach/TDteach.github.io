# 2026-10-19

## Accuracy Alone Cannot Certify Whether a Theory-of-Mind Module Helps a Team

*[Smart Alone, Blind Together: Why Accuracy Fails to CertifyTheory of Mind in Multi-Agent Teams](https://arxiv.org/abs/2610.19051v1)*

The paper challenges a familiar certification shortcut: coordinators that act on inferences about teammates are usually judged by inference accuracy. The authors argue that accuracy is not a deployment certificate: the required bar depends on what a wrong action costs, while interacting wrong beliefs can make the same accuracy beneficial in one task and harmful in another. The concrete limitation is that a module-level score omits the deployment’s loss structure and error dependence.

The proposed change is to certify the deployment rather than the belief module in isolation. The Blind-Spot Gate prices individual error costs, pairwise interactions, and measured dependence without deploying the module. Its underlying logic is conditional: with matched per-belief error rates and positively associated errors, shared mistakes help when their damage overlaps but hurt when damage compounds. The gate is a second-order estimate of this deployment benefit, rather than a replacement accuracy metric.

The experiments show why a fixed accuracy threshold is unstable. Break-even accuracy increased as the cost of wrong action increased in task assignment, Level-Based Foraging, and Hanabi. In task assignment, an accuracy threshold rejected classifiers that often improved on doing nothing because their errors rarely reached the deployment’s costly channel. In Hanabi, shared misreadings can remove the redundancy that lets another observer rescue a teammate’s critical cards; with two or more lives, the reported loss from sharing errors appeared in all tested cells. Across language models, lower individual error did not produce the joint-failure reduction predicted by independence: for teammates about whom models had evidence, error fell from 32% to 11%, while the probability that all three observers misread one fell only from 16% to 9%.

Certification results are promising but conditional. The 57-cell language-model comparison is exploratory; in its 20 reported splits, adding dependence to costs and pairwise interactions eliminated significant false approvals, with more deferrals than accuracy. In the preregistered held-out classifier test, the gate recovered beneficial deployments rejected by accuracy and had reported regret 0.004 against accuracy’s 0.479. A separate Bayesian-module test exposed the boundary: accuracy had significant false approvals in 17 of 20 splits, while the gate had one, so the predicted zero false approvals was not met.

The gate is not a general safety guarantee. It omits interactions among three or more wrong beliefs, assumes error costs are unrelated to the episode state that sets their consequences, and depends on injection tables matching the module’s error distribution. The evidence also comes from controlled benchmarks with known hidden variables, while the language-model tests use one prompt family. For a new deployment, the transferable operation is to identify costly error channels, replay or inject them, estimate pairwise consequences, and measure shared failures instead of assuming independent observers.

Read this paper to replace an accuracy threshold with a deployment analysis that measures costly error channels, pairwise damage, and shared failures before using a belief module.

[abstract; §4, Theorem 1 (Correlated errors); §6.1, Cost sets the threshold; Figure 2 caption; §6.2, Task assignment: costly errors are rare; §6.2, Hanabi: damage compounds; §6.3, Far less redundancy than independence predicts; §6.5, As safe as an A/B test, without deploying the module; Table 3; §6.5, Out of sample; Appendix B, Trained classifiers; Table 4; Appendix B, Bayesian module; Table 5; §6.5, Scope; §4, Assumptions; Appendix A, Remarks; §7, Limitations and future work; §1, Table 1](https://arxiv.org/abs/2610.19051v1)

## A user-centric audit separates benchmark source users from target users

*[Whose Data, Whose Benchmark? A User-Centric Framework for Auditing Evaluation Resources](https://arxiv.org/abs/2610.19268v1)*

Benchmark scores can obscure whose conventions, contexts, and judgments define successful performance. The paper’s central method change is to distinguish source users, whose content and judgments contribute to an evaluation resource, from target users, whose needs and contexts its results are intended to inform. It operationalizes seven dimensions across benchmark content, metadata, documentation, and scoring procedures.

The study applies this framework to 11 text benchmarks and five image–text resources. In the text benchmarks, pattern-based detection identifies spelling, date, time, and measurement signals, while reporting item coverage separately from American-centered shares among matched signals. In the image–text resources, country references in captions and textual metadata are resolved and compared with socioeconomic indicators. A two-annotator audit scores public documentation for source and target context, using a six-criterion rubric.

Among matched convention signals, American-centered forms were the majority in each of the 11 audited text benchmarks, with reported shares from 62.4% to 94.4%; signal prevalence differed substantially by benchmark. Across the five resources, resolved textual country visibility was positively associated with national GDP share; this describes the analyzed caption and metadata references, not the geographic origins of images or contributors. In the small DROP paired case study, the official exact-match scorer substantially reduced credit for selected meaning-preserving answer variants: for 12 eligible answer pairs from 11 questions, exact match fell from 100.0% to 33.3%. In the documentation audit, every resource operationalized source context, while none made target-user or evaluation context operationally inspectable, despite all mentioning that context.

Three limits determine how far to carry these results. The convention audit examines explicit spelling, date, time, and measurement signals and groups multiple alternatives into one comparison category; it does not represent a single alternative English variety or capture every locale convention. Geographic visibility is based on resolved textual references in captions and metadata, not image geolocation, contributor location, or content origin; the reported economic relationships are associations, not causal explanations. Documentation scores measure what was explicit and inspectable in the public materials reviewed under the authors’ rubric; they do not establish that undocumented practices were absent in resource construction or use. The study covers selected resources and dimensions, so the same patterns are not established for all benchmarks, languages, or user contexts.

For a new benchmark, a concrete research operation follows: separate prevalence from matched-signal shares, pass meaning-preserving variants through the actual scorer, and make target-user assumptions operationally inspectable before interpreting score differences.

Read it to learn a repeatable audit sequence: separate source from target users, measure convention coverage, and probe the scorer with equivalent answers.

[abstract; §3, Source users and target users; Table 1; §4.1; Table 2; Figure 1; §4.2, DROP; Appendix A.6–A.7, Table 9; §5.1; Appendix B.5, Table 12; §6.1; Table 5; Appendix C, Tables 15–17; Appendix A.2–A.3; Limitations, Empirical scope and extensibility; Limitations, Geographic visibility and socioeconomic structure; §5.1; Appendix B.1–B.6; Limitations, Public documentation and auditability; §6](https://arxiv.org/abs/2610.19268v1)

## Target-token composition can reverse a pooled depth-ablation interaction

*[Target-Token Asymmetry Can Masquerade As Depth Specialization](https://arxiv.org/abs/2610.19344v1)*

Cross-corpus layer-ablation studies average damage over the next-token targets each corpus supplies. That creates a measurement risk when corpora ask for different target-token mixtures: the paper uses math solutions, with more whitespace and numbers, versus encyclopedia prose as its example. Its method change is explicit: split the early–late damage interaction by target-token type, then recompute it under a target mixture shared by both corpora.

In the audit, the authors compare early- and late-band intervention damage between GSM8K and Wikitext, classify targets as whitespace, number, punctuation, function word, or content word, and report pooled, conditional, whitespace-excluded, and mixture-matched summaries. Thus, the estimand becomes not only whether an aggregate interaction replicates, but whether its sign survives composition control.

In the canonical GSM8K–Wikitext H=3 mean-blend, top-1 setting, the pooled interaction is positive in all three primary models, but the whitespace conditional cell is more than an order of magnitude larger than it and each of the four non-whitespace point estimates is non-positive. Removing whitespace reverses the canonical pooled estimate in all three primary models; matching Wikitext’s full target mixture reverses it in two of the three, not all three. Position matching and conditioning on position do not remove the positive whitespace interaction. A continuous target-margin readout gives the same qualitative diagnosis: positive whitespace interactions appear at both audited horizons, while content-target results do not show that pattern.

A separate H=1 mild-resample content-word interaction tracks a difference in the models’ control-pass correctness rates; equalizing the correct/wrong target mixture removes a clearly positive reweighted estimate in this series. Input-only strata retain a smaller positive effect in four of five instances, so this control-accuracy split does not establish that every composition-related effect vanishes.

The practical research operation is to publish target-type shares, pooled and conditional interactions, and at least one common-mixture estimate before interpreting a cross-corpus depth effect as specialization. The tokenizer-only screen can prioritize this audit: its three scored held-out high/low labels placed all nine model-pair rows in their predicted point-estimate regions, although one row missed the interval criterion. That evaluation is exploratory because the output-region thresholds were selected with calibration rows in view. The submission also lacks analysis scripts, machine-readable result files, and figure-generation scripts for independent computational reproduction. The reversal is therefore evidence about the audited setup, not proof that depth specialization is absent.

Read this for a concrete interpretability safeguard: it shows how to turn a replicated cross-corpus layer effect into a target-mixture audit, while preserving the exact conditions under which the pooled sign reverses.

[abstract; Section 3, opening paragraph; Table 1; Section 3, Replication and position; Appendix E, Tables 11–13; Appendix G.2.2, Continuous target-margin audit; Table 18; Section 5, The one-token-ahead content-word cell; Appendix K.4, Table 46; Section 4, Held-out pairs; Table 26; Section 4, paragraph preceding Table 2; Section 7, Reproducibility statement; Section 7, Limitations](https://arxiv.org/abs/2610.19344v1)

## Looped transformers can compute an answer before their hidden state is reusable

*[Learning to Compute Is Not Learning to Retain or Reuse in Looped Transformers](https://arxiv.org/abs/2610.19768v1)*

Looped transformers repeatedly apply one block, so they can be run for more loops than they were trained with. When a correct answer becomes wrong later, the cause may be failed computation, loss of retention, or a state that later computation cannot reuse. In the reported length-32 evaluation, models trained to answer at loop 32 were fully correct there but retained only 22% of those answers at loop 64.

The authors use in-context Mealy-machine execution, where a simulator supplies intermediate targets and exact counterfactuals for hidden-state interventions. The evaluation reads positions across loops and tests the corresponding hidden states directly: position *k* is computed at loop *k*, and replacing its loop-*k* vector with the vector from another input can redirect later positions to that input’s exact continuation.

The training comparison changes what is supervised. Supervising one uniformly sampled position per example, instead of always the last, kept 99.8% of endpoint answers at loop 64 in the three-model, 32-loop comparison. Randomizing the training exit also improved loop-64 endpoint accuracy over a fixed exit at a matched expected budget, while gradient truncation did not. These results identify retention as partly objective-dependent, but they do not show that one training choice is generally optimal.

The decisive separation comes from state interventions. In ten final-only models, swapping the loop-8 hidden vector at position 8 redirected all 237 eligible tested pairs to the source input’s exact symbolic suffix. That is evidence of causal sufficiency for this specified machine context and intervention, not evidence that the vector contains a unique symbolic code. Reuse is different: in models that retained nearly all answers, holding each position fixed from loop *k* caused endpoint accuracy to fall to 4–6%, whereas holding it from loop *k*+4 was harmless. In a sampled-prefix follow-up, freezing two loops after the measured frontier restored 99.80% mean endpoint accuracy, while immediate frontier freezing achieved only 4.10%.

The practical operation to borrow is therefore simple: pair loop-by-loop readouts with exact counterfactual swaps and freezes before interpreting an overthinking curve. The tests distinguish behavioral properties, but they do not identify a microscopic cause or provide a general repair. Freezing may also hold timing or order information because the model has no positional or loop embeddings. Training comparisons use small model-seed cohorts, and the external maze check uses one checkpoint, no training seeds, and 32 mazes per size.

Read this to learn how to turn an ambiguous overthinking curve into separate tests for computation, answer retention, and hidden-state reuse.

[abstract; §4, subsection “One swapped state drives the rest of the execution”; Figure 3 caption; Appendix A.4](https://arxiv.org/abs/2610.19768v1)

## Concat IDM raises Push-T latent-planning success under seen visual diversity

*[Learning Intrinsic Dynamics in Latent World Models](https://arxiv.org/abs/2610.21612v1)*

The paper isolates a specific representation failure rather than claiming that every latent predictor fails. Under Proposition 3.1’s conditions—fixed encoder, physical state and appearance, and two distinct actions whose distinguishable outcomes are mapped to the same successor latent—a forward predictor can be exact for that transition pair while inverse-action squared error has a positive lower bound.

Concat IDM changes training by predicting the executed action from concatenated consecutive latent states and updating the shared encoder with action labels already present in offline trajectories; the test-time planner is unchanged. The inverse head therefore acts as a training constraint on what the encoder retains, not as an additional planning cost.

Evidence for that path comes from an intervention, not only a score comparison. On Push-T with 24 appearances, blocking encoder updates from the inverse loss reduces success from matched 75.5 ± 2.8% to 21.1 ± 17.2%; shuffling action targets reduces it to 9.4 ± 3.7%. These controls support correctly paired action supervision acting through the encoder, although they do not directly measure the theorem’s proposed merging in trained models.

In listed multiple-appearance settings, reported mean success rises from 9.1% to 77.2% on Push-T, 53.2% to 97.3% on TwoRoom, and 60.7% to 75.4% on Cube; Reacher is saturated with no gain. The primary comparisons use three independent training runs per condition. In paired Push-T comparisons using the same physical trajectory pool, the Concat-minus-Plain gain is reported to grow by 52.9 ± 7.1 percentage points from one to 24 appearances, positive in all three blocks.

Read this as a targeted inductive-bias result, not complete dynamics recovery. Main planning evidence uses seen appearances and matching current/goal renderings; on a disjoint palette, success is 4.2% for Plain JEPA and 13.4% for Concat IDM, leaving substantial room for transfer. A useful replication is to pair appearance-diversity conditions, keep the planner fixed, and include stop-gradient and shuffled-label controls before interpreting probes as mechanism evidence.

Read it to see how an offline action-prediction loss can be tested as an encoder-level intervention under controlled visual diversity, rather than treated as merely another planning-time score.

[abstract; §3.2, Proposition 3.1; §4.2, Action supervision through the encoder; Figure 3; §4.2, Planning gains across tasks; Table 1; §4.3, A larger gain at higher visual diversity; §4.5, Scope and limitations; §4.1, Protocol](https://arxiv.org/abs/2610.21612v1)
