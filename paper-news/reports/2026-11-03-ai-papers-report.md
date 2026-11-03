# 2026-11-03

## Aligned RAG Evaluation separates prevented poisoning outcomes from defense-introduced positives

*[Prevented is Not Protected: What Attack Success Rate Hides about RAG](https://arxiv.org/abs/2610.40742v1)*

Attack success rate (ASR) can hide defense-induced failures and the mechanisms behind an apparent prevention. Aligned RAG Evaluation addresses that measurement problem with a matched-query protocol: instead of summarizing only the defended poisoned condition, it records clean and poisoned retrieval crossed with defense off and on for the same query, target, answering model, and decoding policy.

Each answer can be labeled by target-string matching or an LLM judge. The protocol counts prevention, introduction, net poisoned-target reduction N, clean-target change H, and factorial contrast Γ, while retaining the absolute poisoned-target rate. Thus Γ must be read alongside N, H, and the absolute rate: in HotpotQA’s one-poison TrustRAG case, Γ=12 came entirely from 12 more clean-context target positives, with no reduction in poisoned positives.

In 100-query HotpotQA PoisonedRAG cells, one poison saw TrustRAG prevent 20 positives and introduce 20, leaving 60/100 positives; five poisons saw 65 prevented and one introduced, reducing positives from 96 to 32. These counts change the interpretation of the two reported poison budgets.

Scoring also matters. On the same saved outputs, HotpotQA with one poison had 60 string positives for both undefended and TrustRAG runs, but the LLM judge labeled 35 and 11 as target endorsements; on NQ, string positives favored KeywordAgg over TrustRAG (42 versus 46), whereas judged endorsements were 20 versus 7. Judged positives include separate uncertain labels, so rankings should not be read from string matching alone.

To test mechanism, the study removes poisoned passages and reruns generation, including poison-only and one-poison-at-a-time controls. On NQ with five injected passages, 92 cases were target-string positive and at least one individual injected passage was sufficient in 91. A split-knowledge probe found only 7 strict composition cases among 27 target-positive responses, so composition dependence was a minority in that experiment.

Boundary matters: the main PoisonedRAG comparisons use 100-query cells, with queries sharing injected passages in groups of ten; defenses are adapted implementations, not exact reproductions of the originals. TrustRAG’s clean utility remains unresolved: the judge marked 147/200 HotpotQA and 139/200 NQ held-out answers uncertain for correctness. For a new study, save the four per-query outputs before aggregation, report prevention, introduction, N, H, Γ, and absolute poisoned rate, then apply passage-removal and split-evidence controls.

Read this to redesign a RAG-poisoning evaluation so that a lower ASR is checked for introduced positives, label-dependent rankings, and dependence on injected evidence rather than treated as protection by itself.

[abstract; §2.1, Four Matched Conditions; §4.1, RQ1: Defense Effectiveness; Table 2; §4.2, Evaluation Reliability; Appendix F, Table 10; §4.4, Evidence Dependence; Table 4; §4.4, Split-Knowledge and Evidence Composition; Table 6; Limitations; §4.2, “Reduced Endorsement Does Not Imply Preserved Utility”; Appendix C, Table 7](https://arxiv.org/abs/2610.40742v1)

## Stronger retrieval makes no-gold labels less reliable for conversational RAG abstention

*[Better Retrievers, Worse Labels: How Incomplete Relevance Judgments Distort Abstention Evaluation in Conversational RAG](https://arxiv.org/abs/2610.40966v1)*

The paper starts from a measurement shortcut in conversational RAG abstention evaluation: call a retrieved context insufficient when it contains no document judged gold. The question is whether this proxy tracks the evidence actually available to the reader, rather than whether the benchmark recorded the same document as gold.

On RECOR, the authors re-ran the official baselines exactly and tested four retrievers whose nDCG@10 ranged from .18 to .59, alongside three Qwen3 readers. They compared the no-gold label with judgments of whether each retrieved context was sufficient by its content. Two open LLM judges and a panel of four small open models labeled contexts, while a model from another family audited 250 contexts blind with adjudication.

The decisive result is that the proxy deteriorated along the tested retrieval ladder. The share of contexts with no judged gold document that were nevertheless judged sufficient rose from 28% to 72%; correspondingly, no-gold precision as a detector of insufficiency fell from .68 to .10. Under the separate audit, precision ranged from .70 to .21. This pattern is not merely a label statistic: in the RECOR reader check, which did not include Hybrid, Qwen3-4B answered correctly from 62–67% of false-miss contexts, versus 23–30% of no-gold contexts judged insufficient and 1% of contexts with no documents. Most false misses drew their answer from a hard negative for the same question, another turn’s gold passage, or a neighboring chunk of the gold page.

The evaluation choice also changes downstream conclusions. On RECOR, qrels-derived labels understated Qwen3-4B’s answerability AUROC by as much as .19 relative to content labels. Replacing qrels-derived labels changed the sign or significance of 75 of 258 enumerated abstention comparisons, but the authors describe this count as descriptive rather than multiple-comparison-adjusted inference. The reusable research operation is therefore to label the context actually shown to the reader, audit false misses with an independent check, and rerun abstention comparisons under the alternative labels.

The boundary matters: most RECOR sufficiency labels lack direct human verification; the human evidence comes from MTRAG. All content labellers saw the reference answer, so shared leniency could inflate sufficiency labels. Reader-based checks used three Qwen3 models and 211 RECOR development dialogues. Treat the rates as evidence about these datasets, systems, and protocol—not as universal calibration results.

Read this to learn a concrete audit for RAG benchmarks: test whether a missing-gold label still matches the evidence in the context before using it to rank readers or abstention policies.

[abstract; §4.1, RQ1; §4.2, “A reader answers from false-miss contexts”; Table 2; §4.3; §5, Limitations](https://arxiv.org/abs/2610.40966v1)

## ReplayRCA Scores Agent Diagnoses by Counterfactual Repair and Separates Live Oversight from Autopsy

*[ReplayRCA: Measuring Post-hoc Diagnosis and Live Oversight of Agent Failures by Counterfactual Replay](https://arxiv.org/abs/2610.41025v1)*

The authors frame annotation agreement as an insufficient target for failure diagnosis: a selected cause should be tested by whether replacing its action improves the execution. ReplayRCA therefore asks whether a model can find a decisive mistake and fix it with one action.

At a selected step, the benchmark restores the environment to the preceding state, substitutes the proposed tool action, and lets the original worker continue. Its causal-repair score is the continuation success rate after that replacement minus the success rate from replaying the worker’s original action at the same step. The paired placebo is designed to discount recovery attributable to the worker’s continuation chance, restart mechanism, and sampling variance rather than to the diagnosis; it does not establish that every non-diagnostic influence has been removed.

Tasks come from OpsWorld, a deterministic, procedurally generated back-office environment with an executable checker and six difficulty levels, including a multimodal level. In the post-hoc track, the diagnoser sees the full failed trajectory and is told that the run failed. In the live-oversight track, a supervisor watches the run unfold, may intervene once before an irreversible action, and is not told whether the run will fail.

On 62 calibrated systematic failures, using five continuations per score term, Grok 4.7 had the highest observed autopsy causal-repair score at +51.3 points. However, the experiment did not establish a statistically reliable ordering among the 13 autopsy models after multiple-comparison correction. Forcing GPT-6.1 Sol to select the final step reduced its score by 17.1 points relative to free step choice, so the last-step shortcut did not transfer to this replay-scored setting. On 87 live-oversight runs, Gemini 3.8 Flash and the small open-weight DeepSeek V4.1 Flash shared the lead, with no established difference between them. For GPT-6.1 Sol on shared failing runs, the post-hoc repair score exceeded the live-oversight effect by 14.5 points; the authors caution that whether this gap generalizes is unknown.

For a new evaluation, copy the operational pattern: restore a pre-action state, compare a proposed replacement with a same-step original-action placebo, and use a verified environment outcome to score effective repair. Keep post-hoc diagnosis and live intervention as separate measurements rather than treating one as evidence for the other. Interpret the results narrowly: the study uses one simulated environment, failures from two task families, and a pool in which 41 of 62 items come from one worker. The single-action protocol also cannot directly measure failures requiring multiple corrective actions, and the score measures effective repair rather than uniquely identifying the historical root cause.

Read it to see how a same-step placebo turns a proposed agent diagnosis into an outcome-tested repair score, and why post-hoc diagnostic performance should not automatically be treated as evidence of live oversight ability.

[abstract; §3.2, Intervention and causal repair; §5.1 and Table 1; §5.3 and Table 3; §5.4 and Table 5; §7 Limitations](https://arxiv.org/abs/2610.41025v1)

## Simple Features Outrank 20 of 24 Open-Weight Monitors on an APPS Backdoor Benchmark

*[Simple Features Beat Most AI Control Monitors](https://arxiv.org/abs/2610.41713v1)*

AI-control monitor scores are meant to reflect whether a capable model can spot sabotage in code. This paper tests whether the APPS backdoor benchmark also lets labels be predicted from dataset cues that require neither executing code nor identifying malicious behavior. A high benchmark score alone therefore cannot distinguish sabotage detection from shortcut discrimination on this dataset.

On the standard split, the authors compare 24 open-weight monitors with two non-execution baselines: a bag-of-words logistic regression over comment-removed code and a logistic regression over problem metadata, alongside shuffled-label controls. The code-only baseline reaches AUROC 0.806, exceeding 20 of the 24 evaluated monitors. Problem metadata alone reaches 0.766 under cross-validation within the standard test split, but the score reverses to 0.298 when training occurs outside that split; restricting the latter training to problems with at least four tests gives 0.629. The metadata result is therefore a split-specific label leak, not a generally reliable problem-level rule.

The authors then test whether authorship contributes to the code signal. On 99 problems with working Sonnet 5 backdoors, mixed-author pairings are easier to distinguish: the bag-of-words baseline scores 0.953 for human solutions versus Sonnet 5 backdoors and 0.905 for Sonnet 5 solutions versus older-model backdoors, compared with 0.789 on the original pairs and 0.749 on rebuilt pairs. The authors interpret this contrast as evidence that solution authorship contributes to separability, although same-author pairs remain distinguishable.

A separate audit checks whether labelled attacks are genuine: validators test trigger legality and whether the backdoor output differs from a majority answer among passing human solutions. In the standard test split, the paper reports 17 of 172 labelled backdoors with only an illegal trigger and seven that print a wrong answer on a public test missed by the dataset’s pass flag. Before these checks, a zero-shot Sonnet 5 monitor catches 77% of older-model backdoors but 37% of Sonnet 5’s on the 99 working-backdoor rows; the precise post-check comparison is unresolved because the main text and Table A9 disagree.

The authors explicitly do not claim that published monitors rely on these shortcuts; their own class-swap monitor study covers only two zero-shot monitors. The validity counts are also qualified by bounded legal-input searches and validator authorship. For a new monitor benchmark, the practical operation is to report non-execution floors with shuffled-label controls, swap solution authors where possible, and compute catch rates only after validating attacks.

Read it to learn a concrete benchmark-audit sequence: compare non-execution baselines, test authorship dependence, and verify attack validity before treating monitor scores as sabotage-detection evidence.

[abstract; §3; §3.1; Appendix B.1, Table A2; §4.1; Appendix C.4, Table A5; §5; Appendix D.3, Table A8; §5; Appendix D.4, Table A9; §6 Limitations; §6 Limitations; Appendix D.3; §7](https://arxiv.org/abs/2610.41713v1)

## A Same-Seed OLMo 2 Counterfactual Separates Exposure Effects from Individual Membership Evidence

*[From Training Exposure to Membership Evidence: A Controlled Study of OLMo 2](https://arxiv.org/abs/2610.41732v1)*

Most membership-inference evaluations collect members and non-members after training, so an apparent attack signal may reflect distribution shift, while a failed attack does not show that exposure had no effect. This study changes the setup by creating training ground truth inside an OLMo 2 experiment.

The authors re-ran OLMo 2 1B’s official 50-billion-token mid-training stage. The treated run followed the official data order but replaced selected training chunks with documents; the released AI2 run from the same seed served as the counterfactual, with the training sequence matching outside the planned substitutions. Across 7,814 domain- and difficulty-matched document pairs, a coin flip selected which document was inserted and which was held out. This lets the study compare an exposed document with a close, same-domain control rather than relying only on naturally occurring members and non-members.

The main result is a useful separation between effect and attribution. Among 4,832 verified-unseen, single-exposure pairs, the injected document had a mean within-pair likelihood advantage of 0.0221 nats per token, but the effect varied substantially across documents. With the exact counterfactual reference, the ratio score reached 0.767 AUC; nevertheless, one pooled threshold across domains caught only 3.8% of members at 1% false-positive rate. Collection-level evidence was stronger: under the stated same-domain and close-reference conditions, 13 matched pairs gave a paired test 80% power at the 5% level to detect training on a collection.

Reference choice also matters. A reference trained with another seed recovered 92% of the exact counterfactual’s AUC advantage over chance in this experiment, but that comparison assumes access to the same data mixture. Domain-dependent spillover provides another warning: documents the treated model never saw could also move in likelihood, so domain-matched controls are important for interpreting membership scores. After the evaluated post-training recipe, 89% of the average within-pair effect remained, although the authors treat this comparison as exploratory.

The transferable operation is to report three estimands separately: the average exposure-associated likelihood change, individual-document decisions at a specified low false-positive rate, and collection-level detection power. Researchers reproducing the design should also state that it estimates the joint intervention, not the isolated effect of inserting one document. The study covers one 1B-parameter model and one mid-training stage; insertion at training-window boundaries may favor detectability, and the non-membership audit does not exclude shorter or heavily paraphrased prior exposure.

Read this paper to learn how randomized matched pairs and a same-seed counterfactual distinguish a real average exposure effect from weak individual-document attribution and stronger collection-level evidence.

[abstract; Section III-A, The twin; Section V-A, The effect exists and is unambiguous in aggregate; Appendix B, Table III, Exact counterfactual / Ratio row; Section V-C, The published checkpoint is a weak reference while a retrained reference recovers most of the counterfactual’s advantage; Section V-F, Do documents the model never saw also move?; Section V-G, Does post-training erase it?; Appendix B, Table II; Section VI, Limitations; Section VI, Limitations; Section IV, Estimand and estimator; Section VI, Limitations; Section III-B, Injection mechanics; Section III-E, Verifying non-membership; Section VI, Limitations; Section I-A, C4](https://arxiv.org/abs/2610.41732v1)
