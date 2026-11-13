# 2026-11-13

## Controlled continuations show that history edits can help or hurt according to the executable world

*[Cleaning an Agent's History Hurts When the World Still Holds the Error](https://arxiv.org/abs/2611.14654v1)*

Tool-using agents can accumulate mistakes in their histories while the effects remain in the world. The paper targets a concrete evaluation limitation: prior work cleans history at a fixed world, where showing a corrected step and saying it is done move together. It asks whether the same correct content helps or hurts depending on how the history states it and what the world holds.

The authors freeze an agent mid-task with its exact world state, edit the history or the world, and let a receiver model continue. On AgentCE-Bench, after a wrong value is committed to persistent state, they hold the world fixed and add the correct value either as a truthful note beside the preserved error or as the agent’s own completed action, with unedited and matched-neutral-note controls. On AppWorld, they cross whether a receipt reports success or failure with whether the database effect is absent or present, creating true and false record–world pairings.

On AgentCE-Bench, the truthful note raises recovery—the share of remaining targets the receiver gets right—from 51% under a matched neutral note to 66%; the completed action lowers it below the unedited history, from 50% to 44%. On AppWorld, a success receipt lowers whole-task success from 45% to 28% when the effect is absent, but raises it from 38% to 49% once the effect is present. The two receipt effects differed by 27 points pooled over two receivers; the interaction was positive in six of eight receivers at 97.5% and seven at 95%.

The authors argue that simply exposing the correct value cannot explain these opposite AgentCE outcomes; the mechanism remains open. The contrasts do not isolate truth or channel: the note and completed action also differ in apparent author, position, visibility of the original error, and whether work is said to remain. AppWorld receipts differ in content as well as truth, so wording could contribute to the interaction. Generalization across models is limited because the primary AgentCE result uses two closed-API receivers and the expanded receiver counts use unadjusted intervals over a fixed set. The 24-step AgentCE budget is exhausted at different rates across arms, although the reported gap is already present at six steps. Two preregistered analyses did not run as originally specified.

For a researcher building memory, compaction, or handoff evaluations, the transferable operation is to freeze and restore a record–world pair, intervene on the record and world independently, score downstream task outcomes, and repeat the contrast across world conditions. This tests whether an apparent cleanup remains useful when executable state disagrees, rather than treating a clean transcript as sufficient evidence of success.

Worth a focused read because it provides a controlled template for testing agent memory, compaction, and handoff under record–world disagreement: intervene on the transcript and executable state separately, then score downstream task outcomes rather than judging the transcript alone.

[abstract; §5.1, Figure 2; Appendix B.2; §5.4, Figure 3; Appendix C.2, Table T9; §5.5, Figure 4; Appendix D.1, Table T12; §5.2; §6, Limitations; §6, Limitations; Appendix H.2; §6, Limitations; Appendix H.1](https://arxiv.org/abs/2611.14654v1)

## MemCredit Trains a Budgeted Memory Selector on Counterfactual Action Credits

*[MemCredit: From Relevance to Utility for Decision-Time Memory in Long-Horizon Web Agents](https://arxiv.org/abs/2611.15600v1)*

MemCredit starts from a concrete limitation in long-horizon agent memory: existing methods primarily optimize storage, retrieval, or compression, while a memory can be semantically relevant without improving the next action. The paper therefore treats selection as a decision-utility problem rather than a relevance-ranking problem.

Offline, the framework estimates each memory’s state-, reference-context-, and policy-conditional marginal contribution through controlled counterfactual interventions, then distills those credits into a lightweight utility estimator. At inference, relevance generates a high-recall candidate pool; predicted utility arbitrates within a fixed token budget, leaving the underlying policy unchanged and requiring no additional environment interaction. The online selector is greedy and recomputes conditional scores after each insertion, so it is an approximation rather than a guarantee of globally optimal subset selection.

On the reported ALFWorld evaluation—134 unseen tasks, a Qwen3.6-27B-FP8 policy, and a 500-token historical-memory budget—MemCredit reaches 86.57% SR@50 versus 65.67% for BM25. At 750 tokens, it reaches 90.30% versus BM25’s 81.34%, so the reported advantage is smaller at the larger budget. The counterfactual audit also finds sparse measured utility: 86.9% of 1,041 valid interventions from 45 ALFWorld tasks have zero measured utility. The full estimator improves over the reported relevance-only, failure-only, and content-only feature sets, but its prediction remains moderate, with reported ρ=0.220, AUPRC=0.270, and AUROC=0.744. In an ablation, directly interpolating relevance into final arbitration produced 78.36% SR@50, 5.97 points below utility-only ranking.

The transferable research operation is to collect matched replays that differ only in one candidate memory, condition labels on the already-selected context, and evaluate whether a learned selector improves fixed-budget downstream decisions—not merely retrieval metrics. Interpret the benchmark differences cautiously: each reported ALFWorld intervention pair is run once, and the authors report up to ±3 percentage points of aggregate success-rate variation across repeated executions. The greedy procedure may miss complementary memories whose value appears only jointly, and WebShop uses a 10K-product subset whose scores are not directly comparable with full-catalog results.

Read it to learn how to turn memory ranking into a paired-replay labeling pipeline, while seeing why sparse utility, imperfect prediction, and run variability require stronger diagnostics than relevance scores alone.

[abstract; §4.2, ALFWorld; Table 1; §4.3, decision utility is sparse but consequential; Appendix A.1, utility label generation; §4.4; Table 4; Appendix A.4; §4.5, relevance is more useful for recall than arbitration; Table 5; Appendix A.5; §3.4, conditional budgeted selection; Appendix A.1, pipeline validation; Appendix A.1, WebShop catalog audit](https://arxiv.org/abs/2611.15600v1)

## Accuracy gains alone therefore do not establish transfer of reasoning from privileged solutions

*[Privileged Information Does Not Guarantee Privileged Guidance: Auditing On-Policy Self-Distillation for Reasoning Models](https://arxiv.org/abs/2611.16064v1)*

OPSD trains a student on next-token targets from a teacher, a frozen copy of the student that additionally receives privileged information, such as a worked solution, hidden from the student. Reference-free cross-mode self-distillation improved Qwen3-1.7B over its frozen base in-domain and on the external benchmarks, so improvement over the base alone does not show that privileged information added value.

The paper responds with a four-stage audit: Source asks whether the teacher can use the solution; Encoding asks whether its token targets are useful; Transmission asks whether the student learns from them; and Expression asks whether it applies the behavior without the solution. To isolate the solution's contribution, it varies its availability separately from teacher and student thinking modes. The Source audit separates solving from error recognition: the worked solution gives the frozen teacher strong problem-specific solving ability on audited hard problems, but the solution can enable solving and recovery without reliably enabling the teacher to identify where a student's reasoning went wrong. At Encoding, a measurable change in teacher targets is not evidence by itself that the changed signal preferentially supports correct reasoning.

In matched Qwen3 evaluations, a problem-only teacher exceeded the privileged-solution teacher under Thinking-OFF evaluation by 1.36, 15.21, and 8.60 percentage points at 1.7B, 4B, and 8B; the 1.7B interval includes zero. The most consequential benchmark gains track the teacher's thinking mode more clearly than access to a worked solution, which the authors call reasoning arbitrage. In the audited short-run acquisition test, repeated OPSD did not make previously unsuccessful Thinking-OFF questions reliably solvable, even though they were often reachable under Thinking ON. Learning to predict verified corrections, as measured by target NLL, did not reliably translate into using them during generation without privileged support.

The result is not a blanket dismissal of solutions. Purified OPSD is evidence that solution-conditioned supervision can improve held-out accuracy when its target construction is altered; the audit does not imply that privileged information is never useful. The main training comparisons use only three seeds, so their intervals are descriptive and provide limited evidence about run-to-run uncertainty. The strict acquisition test is narrow and has few updates, and the proposed reasoning-arbitrage mechanism remains unresolved; the paper describes its experiments as falsification tests, not a joint method leaderboard.

For a new privileged-context experiment, I would keep teacher mode, student rollout mode, question sets, schedule, and seeds fixed; compare privileged and problem-only teachers; evaluate in the deployment mode; then measure target correctness, acquisition on Base-unsolved questions, and unaided expression separately. That design tests whether the hidden context caused the gain rather than merely accompanied it.

Read this for a reusable causal-audit design: it turns an apparent teacher advantage into separately testable links, with matched problem-only and thinking-mode controls.

[abstract; Section 6.2, paragraph 2; Appendix C, Table C3; Section 1, paragraph 2](https://arxiv.org/abs/2611.16064v1) · [§3.1; Table 1, Reference-free row](https://arxiv.org/abs/2609.20612v2) · [Section 3.2, Teacher and student policies; On-policy sampling from the student; Section 4.1](https://arxiv.org/abs/2601.18734v3)

## PREWARN Separates Detection from Pre-Onset Warning at a Fixed Error Budget

*[Detection Is Not Early Warning: Evaluating Token-Level Alarms on Language Model Failures](https://arxiv.org/abs/2611.16803v1)*

Response-level AUROC can reward a monitor for separating finished failures from healthy responses while ignoring when its alarm fires. In this case study, a rule that reads only response length scores almost perfectly, so a strong completed-response score is not evidence of usable warning.

PREWARN changes the evaluation target: it calibrates each monitor’s threshold on validation data to a chosen application error budget, then evaluates response classification, post-onset detection, and pre-onset warning relative to an annotated onset. The protocol therefore makes the deployment question explicit: how many healthy-response false alarms are acceptable, and how often does the first alarm arrive before the failure?

The case study applies this protocol to repetitive degeneration in three open language models, using linear activation probes and six untrained baselines. The in-domain evaluation used a 5% false-alarm budget on healthy responses and human-verified labels; the models were 8B/7B instruction-tuned systems sampled at temperature 0.7 and top-p 0.9.

Under those conditions, frozen and adapted probes gave pre-onset alarms on most detected loops for Apertus and Llama, with median first-alarm leads of 137–232 tokens, but behaved mainly as detectors for Mistral despite a 0.99 detection rate. Rank-16 LoRA adaptation increased the share of the 256-token warning window flagged across all three models, yet much of the additional coverage came from alarms long before onset rather than a large increase in the fraction whose first alarm was pre-onset. The six untrained baselines did not provide substantially more pre-onset first alarms than random, even when some covered appreciable parts of the warning window.

The transferable research operation is to report alarm timing under a predeclared error budget, rather than select a monitor from AUROC alone; compare first-alarm lead, detection, and warning-window coverage separately.

Treat the boundary as measurement-sensitive. Lead times depend on onset convention: here onset is the first token of the first loop, before repetition is visible, and a later onset would make alarms appear earlier. For Apertus and Llama, onsets usually follow the end of healthy responses, so response position or length may partly explain alarms; the authors do not establish that all pre-onset signals are degeneration-specific. Labels and onset corrections were human-reviewed, but each response had one reviewer, so inter-reviewer agreement is unknown; on held-out sources, frozen-probe early-warning rates for Llama and Mistral fell to 0.20 and 0.12, while the held-out set contained only 24 degenerate Apertus examples. For this paper, a probe’s high detection rate therefore does not by itself establish pre-onset warning.

Read this if you are building a streaming guard: it turns a token score into an explicit alarm policy and tests whether the alarm arrives before the labeled failure point.

[abstract; §1 Introduction, S1.p4.1; §4.3 Q2, S4.SS3.SSS0.Px1.p1.1 and S4.SS3.SSS0.Px2.p1.1; Table 1; §4.4 Q3, S4.SS4.SSS0.Px1.p1.1; Table 1; §4.5 Q4, S4.SS5.SSS0.Px3.p1.1; Table 1; §6 Limitations, S6.p1; §A.2 Data and labels, A1.SS2.SSS0.Px4.p2; §4.3 Q2, S4.SS3.SSS0.Px3.p1.1](https://arxiv.org/abs/2611.16803v1)

## Anytime-valid upper bounds let developers stop testing when unseen-failure risk is small

*[Controlling the Probability of Unknown Unknowns in Pre-Deployment Testing of AI Systems](https://arxiv.org/abs/2611.15835v1)*

The paper narrows the deployment question to a measurable target: the probability that the next output contains a failure mode not yet observed. It treats this as a sequential missing-mass problem, not as a claim about overall system safety. Developers can often fix known failures; the unresolved choice is whether more testing is worth its cost or whether unseen failures remain.

The method change is an anytime-valid upper confidence sequence for this probability. The paper compares it with a multiple-testing-corrected Good–Turing baseline and with a fixed-horizon Good–Turing upper confidence bound that is not anytime valid. At each round, Algorithm 1 mixes betting processes that start at different observation times and mixes over bet sizes. These restart processes provide different warm-up periods, while slowly decreasing weights limit the cost of starting later. The resulting bound can be inspected repeatedly, and testing can stop when it falls below a chosen threshold without invalidating the guarantee.

The theory gives a qualified stopping-time result: after the true missing mass falls a fixed distance below the target threshold, the proposed procedure has a high-probability logarithmic stopping delay relative to that crossing time. It does not promise a uniformly small delay when the missing mass is only marginally below the threshold; the paper proves that a valid procedure cannot generally have uniformly finite expected delay in that regime.

In the stated SWE-Chat simulation, the proposed bound’s observed simultaneous coverage exceeded its nominal 95% level through 3,000 draws. The experiment used 1,000 trials, a 4,961-session empirical population, and a fixed 538-category failure taxonomy. The paper reports tighter upper bounds than the multiple-testing-corrected Good–Turing baseline and even than the non-anytime fixed-horizon comparison.

Two extensions address evaluation realism: inverse-propensity weighting handles a different target task distribution when the target-to-sampling likelihood ratio is known and bounded, while label-error extensions require explicit auditing and novelty conditions. The boundary matters: the paper explicitly says its framework is insensitive to failure cost, and its convergence argument relies on a countable output space. Its SWE-Chat setup also uses public traces, LLM judgments, and a fixed taxonomy, which the authors note differs from private developer-run testing. For a research workflow, define the failure taxonomy, target distribution, novelty rule, and audit policy before trusting a stopping decision; then ask whether unseen-failure probability is the right quantity for rare, high-impact failures.

Read it to see how restart-and-betting mixtures make repeated checking statistically valid, and to identify which failure, distribution-shift, and labeling assumptions must hold before using the stopping rule.

[abstract; §3.1, discussion following Algorithm 1; §3, Theorem 3.3 introduction; see also Theorem 3.3; §3.1, Theorem 3.4, part 1; §3.2; §3.3; Appendix A, Lemma A.2 and Corollary A.8; §4, Figure 1 caption; Appendix C.1.1; §4, setup discussion; §5, first limitation; §3, discussion following Proposition 3.1](https://arxiv.org/abs/2611.15835v1)
