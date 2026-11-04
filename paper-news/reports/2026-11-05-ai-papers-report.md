# 2026-11-05

## Unsatz Requires Agents to Build Scientific Model Structure Before Fitting Coefficients

*[Unsatz: Evaluating Scientific Discovery Without a Given Ansatz](https://arxiv.org/abs/2611.03713v1)*

Unsatz addresses a limitation the authors identify in equation-discovery benchmarks: they often supply the ansatz by fixing variables, a library of candidate terms, or a law to be modified. Unsatz instead requires an LLM agent to construct the ansatz itself. Each task is a private-seed simulated system represented as an executable program in a small modeling language covering ordinary, delay, and partial differential equations, discrete maps, static and causal models, and stochastic processes, with possible hidden states, distorted sensors, and uninformative measurement channels.

Agents spend a limited budget on experiments, submit candidate programs in the same language, and receive fitted coefficients from the benchmark’s fitter. The decisive evaluation change is that the final program is scored only on hidden experiments, including conditions outside the explored range, interventions, and longer runs. Across 80 systems in 20 domains, nine language models solved between 21% and 60% of the systems.

The main diagnosis comes from a 44-world classical-baseline subset. The true-structure fitter passed 30/44 worlds, while SINDy, grammar search, and PySR together passed 3/76 applicable method–world attempts. Within this benchmark, the result indicates that discovering model structure can be a larger obstacle than estimating coefficients after the structure is supplied. That comparison is conditional: classical methods used shared random-design data, whereas agents selected experiments, and the known-structure fitter is not an upper bound. It therefore supports a bottleneck diagnosis under this protocol, not a general ranking of structure-discovery methods.

The episode analyses identify two practical failure modes. Among 18 hidden-state worlds offering assays, agents declared the true latent-state count in 69 episodes, but only 19 of 162 episodes solved the world; having the correct count did not increase solve frequency. Separately, in 235 of 510 episodes with multiple submissions, the final model predicted worse than an earlier one, while later models had lower training error in 35 of 48 baseline regressions. The benchmark thus exposes a mismatch between revising for fit and revising for hidden-condition prediction.

Transfer was conditional too: in the six studies where the first related-world investigation was solved, agents given its program solved five related worlds versus two for fresh agents, while neither condition solved a control world. Treat these percentages and the structural-bottleneck diagnosis as evidence within Unsatz’s generated-world language and experimental protocol. The operational lesson is to test proposed models where extrapolation, intervention, and longer-run behavior can falsify them, rather than selecting revisions by training error alone.

Read it for a concrete evaluation design: compare structure search with fitting a supplied structure, then score the final program on held-out interventions, extrapolation, and longer runs.

[abstract; Section 1, paragraph 4; Section 2.5, Scoring; Section 4.1, The structure is the bottleneck; Section 4.2, Stronger agents solve more worlds; Table 3; Section 4.4, Agents find the variables but not the mechanisms: Hidden states are found but not modeled; Section 4.4, The training error misleads revisions; Section 4.5, Do agents reuse a discovered mechanism?; Appendix E.9, Table 10](https://arxiv.org/abs/2611.03713v1)

## EMBERS Turns Execution Defects into Stage-Targeted Fuzz Tests for Deep Research

*[EMBERS: Empirically Motivated Robustness Testing of Deep Research Systems via Defect-Guided Fuzzing](https://arxiv.org/abs/2611.03723v1)*

RobustAlpacaEval constructs ten manually reviewed paraphrases per TinyAlpacaEval query and evaluates the original query plus those paraphrases. EMBERS changes the testing unit: it targets observed execution defects and can mutate either the initial question or an intermediate search input.

The authors first inspect 1,932 execution trajectories from three Deep Research systems and manually classify 384 sampled incorrect trajectories, defining nine recurring defect categories. Among the classified failures, 65.6% are attributed to subquestion formulation, 24.2% to search, and 10.2% to final reasoning. These are distributions within the analyzed sample, not estimates of universal defect rates.

EMBERS seeds testing with questions answered correctly in three independent runs. Its loop combines defect-guided mutation, web-search-assisted fidelity assurance, and diversity-aware seed maintenance. For an intermediate mutation, execution resumes from the preceding context; a semantic answer oracle flags a potential pass-to-fail failure when the generated input receives an incorrect answer against the original reference.

Across 16 framework–model–dataset settings under matched 24-hour budgets, EMBERS produced 8,340 oracle-identified failure-inducing inputs—3.21 times the DR-Arena count and 7.87 times the RobustAlpacaEval count—and had the highest count in 15 of 16 settings. In sampled evaluation, human reviewers reported 93.49% intent preservation, 88.80% necessary-information preservation, and 88.02% agreement with the automated correctness judgments. Fine-tuning WebSailor-32B with generated data improved Consistent@3 by 5.95 points on FRAMES and 9.13 points on FRAMES-ZH, but that result is benchmark accuracy, not evidence of robustness to input variation.

The right replication lesson is operational: log stage inputs, outputs, and recovery status; turn recurrent defects into stage-specific mutations; and score fidelity and oracle agreement before aggregating failures. The headline count remains conditional. Failure-origin labels are observational rather than causal, each generated input is executed once, and the evaluation covers two open-source ReAct frameworks, two backbone models, four datasets, and initially correct seeds. The paper also does not directly mutate the unreadable-webpage-content category or manipulated web content.

Read it for a concrete recipe for converting execution traces into robustness tests, while checking whether mutation fidelity and automated failure judgments justify the resulting failure counts.

[abstract](https://arxiv.org/abs/2611.03723v1) · [Section 3.1, Data](https://arxiv.org/abs/2406.10248v4)

## Successful rescue can conceal wrong causal diagnosis in synthetic regulatory systems

*[Treating the Symptom, Missing the Cause: Anatomy of a Scientific Reasoning Failure](https://arxiv.org/abs/2611.04473v1)*

An intervention that restores a system is not necessarily a diagnosis of its fault. This paper tests the distinction in controlled synthetic regulatory systems: agents must identify a hidden fault and rescue the resulting phenotype. In the medium-difficulty comparison, all seven evaluated LLMs rescued more often than they diagnosed; Claude Opus 4.6 rescued all 20 organisms but diagnosed 55%, while Sonnet 4.6 rescued all 20 but diagnosed 35%.

LUCA had already reported the broad limitation: rescue could exceed diagnosis, and agents sometimes ran a disambiguating experiment but failed to use it in diagnosis. Against that prior result, the current paper’s increment is a systematic decomposition of the failure. The authors enumerate candidate faults and available interventions across 60 organisms, classify identifiability, and audit experiment selection, evidence encounter, and evidence use. Most organisms were experimentally identifiable: 53 of 60 had causes distinguishable from the available evidence. Agents selected distinguishing experiments only modestly more often than random selection, 24.1% versus 19.2%. Yet on the 43 organisms with resolvable alternatives, agents ran at least one discriminating experiment in 91% of committed sessions, while diagnosis accuracy in those sessions was only 0.30.

The decisive probe holds the experimental record fixed. Probe 3 replays the same pre-diagnosis logs while either supplying candidate readouts or requiring models to derive them. Accuracy was 0.88–1.00 when readouts were supplied, but 0.51–0.74 when models had to derive those predictions. In this probe, the result points to a bottleneck in translating competing causal hypotheses into predicted outcomes, not merely locating the decisive observation.

For a researcher, the reusable evaluation operation is to hold an experimental record fixed, vary only the counterfactual scaffolding, and score diagnosis separately from repair. This tests whether an agent can perform the comparison its evidence requires rather than merely produce a successful endpoint. Treat the bidirectional-perturbation result as a hypothesis for follow-up, not a demonstrated intervention: diagnosis was 0.04 after one-direction testing of the true cause and 0.71 after testing both directions, but the association does not establish why the pattern predicts success. Finally, the benchmark uses invented abstractions, so the authors do not establish how often the same failure occurs in real biology; headline model rows are also single sampled runs. The rescue comparison uses the corrected scorer reported in Appendix A.

Read it to learn a concrete evaluation design for separating successful repair from evidence-based causal diagnosis: replay the same record while varying whether competing hypotheses’ predicted outcomes are supplied.

[abstract](https://arxiv.org/abs/2611.04473v1) · [Section 3, “Reasoning failures,” PDF p. 7](https://arxiv.org/abs/2611.03100v1)

## In a two-domain test, stronger verification does not improve held-out discovery advantage

*[Verifier strength does not buy discovery quality: a pre-registered two-domain test of LLM-based automated research, with post-hoc evidence pointing to proposer-pool composition](https://arxiv.org/abs/2611.04420v1)*

Earlier end-to-end work connected idea generation and literature search to experiment planning, code execution, paper production, and automated review. The new study narrows the question to whether stronger verification changes held-out discovery quality.

Under a pre-registered protocol, the authors compare 100 matched LLM/random pairs in each of two domains—job-shop scheduling (A) and vehicular edge offloading on Beijing T-Drive trajectories (D)—under three verifier tiers. A 429-case mutation battery checks whether scores rise across tiers, separating successful manipulation of the gate from improvement in selected discovery. The central outcome is the paired LLM-over-random holdout margin.

The pre-registered prediction that this margin would increase monotonically with verifier strength was not supported: the reported one-sided p-values were 0.1115 in A and 0.9994 in D. In D, a post-hoc contrast instead found that the strict tier reduced the LLM-over-random margin relative to the weak tier by 0.040 (p=0.0013); the corresponding A contrast was +0.10 and uncertain (p=0.2229). This contrast compares paired margins, not the promoted rules directly.

A reachability problem complicates the tier comparison. The weak and standard tiers promoted identical candidates in 100/100 A pairs and 99/100 D pairs, so the intermediate comparison was untestable in those pairs. This is a useful preregistration lesson: first verify that treatment arms can produce distinct decisions, then test the predicted ordering.

The paper’s constructive alternative is widening the proposer pool. A post-hoc union-pool analysis estimated a +1.52 holdout-value-unit gain in A (one-sided Wilcoxon, n=100, p=0.0002), but this was derived from already-evaluated promotions rather than a prospective pool-composition intervention. The result therefore motivates a follow-up, not a validated replacement for stronger verification.

The boundary is substantial: the evidence uses one small proposer model, two domains, and simulated instances derived from real trajectories; domain D also separated the tiers only weakly. For a new study, measure filtering separation and held-out value as separate outcomes, preregister reachable arm differences, and test proposer-pool composition prospectively.

Read it to learn how to separate a verifier’s filtering effect from its effect on held-out discovery, while auditing whether preregistered tier comparisons are actually reachable.

[abstract; Section 5.1, Table 2; Section 5.2, Table 3; Section 5.2, post-hoc margin-contrast analysis; Section 5.3, Table 5 and accompanying analysis; Section 7, Limitations; Section 7, Limitations; Section 5.3](https://arxiv.org/abs/2611.04420v1) · [abstract](https://arxiv.org/abs/2408.06292v3)

## Agent-evaluation infrastructure can silently change scores and leaderboard rankings

*[Silent Instrument Errors Reorder Agent Leaderboards](https://arxiv.org/abs/2611.04399v1)*

The concrete limitation was a measurement path that looked like a scaffold result. On HAL’s public Airline leaderboard, a general-purpose agent trailed a scaffold built for an airline customer-service benchmark by 13 points on tasks that touch its database; only about half of the Generalist agent’s episodes were scored, and the rest were stored as failures. The paper therefore treats the comparison as an instrument-audit question, not a clean test of whether generality reduces accuracy.

The audit uses published artifacts alone and does not rerun any agent. For HAL, it compares reported token usage with root-span usage, aligns recorded actions with raw agent tool calls to identify grader-written actions, and replays agent actions under the benchmark’s reward rule. For τ²-bench, it re-grades public trajectories under multiple evaluator releases while varying evaluator code and task data.

The decisive HAL result is that re-grading the archived episodes under the benchmark’s rule raised pooled Generalist accuracy on the affected Airline tasks from 0.30 to 0.43 and closed the reported pooled scaffold gap. The cost audit found that, in just over half of logged runs, reported tokens were exactly twice the root-span tokens; because the duplication varied by run and client path, it could affect leaderboard rows unevenly. Action-provenance alignment found grader-written gold actions in 68% of 2,334 public airline records; removing those injected actions improved reward-replay agreement from 70% to 92% for records whose gold contained at least two non-terminal actions.

τ²-bench shows that not all ranking changes have the same cause. An announced banking evaluator correction reversed 4 of 136 pairwise orderings among 17 submissions. An unflagged change to airline evaluation criteria made re-grades of old trajectories non-comparable to scores from the earlier evaluator and changed model ordering. In telecom, a mode-detection failure reconstructed the wrong environment for four files, depressing their scores by 59 to 82 points while the command still printed a number.

The evidence is bounded to two public leaderboards and does not estimate how prevalent these failures are in other evaluation pipelines. The HAL scaffold comparison is also conditional: it is an offline re-grade of archived runs, and the scaffolds still differ in step budgets and policy access. A transferable research operation is to audit the instrument before interpreting a score: publish the graded fraction, aggregate cost from root spans, label the provenance of every recorded action, and pin evaluator versions with a before-and-after re-grade diff.

Read it to learn a concrete pre-leaderboard audit for detecting whether grading, cost accounting, trajectory logs, replay, and evaluator versions are measuring the intended agent behavior.

[abstract](https://arxiv.org/abs/2611.04399v1)
