# 2026-10-14

## Agentic Data-Science Pipelines Can Rank Better on Test Scores While Failing Methodological Checks

*[The Silent Failures in Agentic Data Science](https://arxiv.org/abs/2610.14115v1)*

Existing evaluations of agentic data science emphasize downstream predictive performance and code correctness. The paper argues that this can mask data leakage, inappropriate validation, and other methodological failures. Its method change is to assess agents beyond accuracy through separate validity-oriented tests and expert comparison, rather than treating a high score as sufficient evidence of a sound pipeline.

The evaluation has three parts: a large-scale analysis of agent-generated pipelines across 220 tasks; a reusable suite of curated tasks testing six specific failures in controlled conditions; and a qualitative comparison of generated pipelines with expert solutions on Kaggle competitions. The large-scale study covers nine agent–model configurations. This design separates whether a pipeline executes and scores well from whether it follows the methodological constraints of the task.

The decisive result is not a single leaderboard number. Every tested configuration had at least one predefined methodological failure occurring in 43% or more of applicable pipelines. In the adjusted analysis, leakage modes were associated with better test-set ranks, while most non-leakage failures were associated with worse ranks. Because the runtime setup exposed the held-out test set to agents, this association should not be read as leakage improving genuine out-of-sample generalization; it demonstrates why score-only evaluation can reward invalid practice.

The controlled suite makes the gap more concrete: on two deliberately constructed tests—distinguishing correlation from causation and avoiding feature-selection leakage—every analyzed configuration failed in every run. Explicit hints reduced failures for ReAct and AIDE but did not eliminate them, while MLEvolve did not continue improving under the strongest hints. Across the five selected Kaggle challenges, first-place human solutions outperformed the agents, with task-dependent gaps.

A transferable research operation is to report predictive score and methodological-failure status together, then inject known pitfalls, vary guidance, repeat runs, and compare against expert solutions. The boundaries matter. The taxonomy is predefined and explicitly incomplete, so its rates are not comprehensive estimates of pipeline validity. The 220-task setup also gives agents access to the test set, and the controlled analysis excludes most runs for two Qwen models. Finally, the Kaggle comparison is small and selected; AutoGluon appears on only two challenges, both described as simpler Playground tasks. Read this paper as an evaluation template for locating silent failures, not as evidence that its measured rates exhaust agentic data-science risk.

Read it to learn a concrete benchmark operation for detecting when an agent's attractive predictive score depends on leakage or other methodological failures.

[abstract; Section 4.1, Datasets and Data science agents; Section 4.2, paragraph 2; Table 3; Section 4.2, paragraph 5; Appendix A.6; Section 4.3, paragraph 2; Section 4.3, paragraph 4; Figure 4; Section 4.4, paragraph 1; Table 4; Section 3.1, paragraph 4; Section 4.1, Datasets; Section 4.3, paragraph 1; Table 4 caption](https://arxiv.org/abs/2610.14115v1)

## Blind-judge feedback degraded IFEval revisions in the tested repair loop

*[The Anatomy of a Blind Spot: What an LLM Judge Must Be Shown, and How Much](https://arxiv.org/abs/2610.15938v1)*

This paper isolates evidence access as an evaluation variable. Across seven public benchmarks, the authors varied only what an LLM judge was shown. On LLM-AggreFact, using 1,100 human-labelled claims and three judges, blind balanced accuracy was 0.565–0.587, versus 0.775–0.795 when the source document was supplied. This is evidence from a source-grounded factuality setting, rather than a general ranking of judges.

The most consequential test concerns revision. In one IFEval revision round covering 1,080 responses and 1,664 constraints, a blind Gemini 2.5 Flash judge saw only the response while the responder retained the instruction. Acting on its feedback changed the constraint pass rate by −0.145 and ended 17 points below a no-report revision control. On a 300-response subset with fresh blind judging after each revision, pass rate fell from 0.851 initially to 0.731, 0.706, and 0.683 after three rounds. The result is scoped to this repair setup: it does not establish that every feedback loop deteriorates.

More context was not uniformly beneficial. In FRANK news summarisation, adding a correct reference summary beside the source reduced balanced accuracy from 0.769 to 0.618 and raised the false-positive rate from 31% to 70%; the paper reports that references helped on single-answer HaluEval QA. Context selection and presentation are therefore experimental variables, not merely prompt-length choices.

A useful research operation follows: build a paired ablation in which the judge receives the response alone, the response plus the requirements or source, and deliberately mismatched additions such as a reference. Then return reports to a responder, score revisions with a checker independent of the feedback judge, and retain a no-report revision control. This separates a judge that identifies an error from a feedback channel that actually improves the system.

Important limits remain close to the findings. The main closed-loop experiments used Gemini 2.5 Flash as the feedback judge, while the second-family replication was exploratory. Some RAGTruth span-recall comparisons are matcher-sensitive: two automatic matching routes had opposite signs, and no scoring decision was audited by a human. The authors also report that only 32 of 81 run commitment clauses met their stated bars; their commitments were private and lacked a third-party timestamp.

Read this for a concrete repair-loop experiment in which feedback from a judge missing the task requirements reduced performance below both the initial output and a no-report revision baseline.

[abstract; §4 Is the channel or the judge the binding constraint?, PDF page 16; §5 Which context helps, and which harms?, PDF page 21; §8.1 One repair round, PDF page 29; §8.2 What governs the harm, PDF page 29; §11 Limitations, PDF pages 38–39](https://arxiv.org/abs/2610.15938v1)

## Executable Prefix Values Test Whether Failure Labels Matter for Restart Control

*[Executable Prefix Values for Locating Agent Failures](https://arxiv.org/abs/2610.17633v1)*

Retrospective “first mistake” labels are not necessarily the locations a controller should act on. *Executable Prefix Values for Locating Agent Failures* makes that question operational: it restarts an agent from reconstructed intermediate states, estimates V(h_t), the probability of success from each step, and identifies a certified point of no return (PNR).

The study design is deliberately executable. On 150 SWE-bench Verified tasks, using two frozen open-weight agents, the authors build curves for 47 and 60 failed trajectories and probe every step labeled by four frontier judges under the Traverse rubric.

Judge labels are unstable across lineages: judges agree on the exact step in only 21/57 cases, while the newest judges flag mistakes in 8/10 and 10/10 successful runs. For 66% of labels, success probability does not drop at the labeled step; only 7/188 answers name the decisive step. That mismatch matters because the paper evaluates a controller-relevant quantity—change in future success—not just the plausibility of a diagnosis.

Replication strengthens the question but not its generality: in a second policy within the same model family and benchmark setup, 136/217 labels had zero or negative drop and only 14/240 judge answers landed on the decisive step; 58% of continuations exhausted remaining budget and a budget-control check failed.

Using the measured restart point raised expected success from 0.44 to 0.57 offline; real restarts supported an advantage over continuing, while judge-label restarts produced −0.08 to −0.03 offline gains. That offline calculation assumes value-based policies never restart runs that would have succeeded, and the online results found the offline restart-value prediction optimistic.

Read the paper as a measurement recipe, not a causal-localization guarantee. Evidence is limited to two Qwen policies, one scaffold, and a SWE-bench Verified subset; prefix value depends on the policy and remaining budget. Exact-step localization is also unstable: even the full schedule pins the decisive step exactly in only 28% of replications. A useful research operation is therefore to save replayable states, test continuation probability at candidate labels, and compare restart decisions with continuing under the same budget. Report the curve and its uncertainty before collapsing it to a single “first mistake.”

Read this to learn how to turn a failure-attribution claim into a restart-control test: compare a labeled prefix with measured continuation value under a fixed policy and remaining budget.

[abstract](https://arxiv.org/abs/2610.17633v1)

## Sauron Grounds Rubric Verdicts in Source-Checked Evidence

*[Evidence-First Agentic Verification](https://arxiv.org/abs/2610.17724v1)*

## The concrete change

In long-horizon, semi-verifiable agentic tasks, evidence can be spread across the environment state and execution trace, so a judge may overlook it or accept unsupported claims, including an agent’s own report of success.

Sauron uses a separate evidence-verification stage: the investigator proposes claims with source locators, and the verifier retrieves cited source material and checks whether it supports each claim before the claim can support a verdict. The verifier routes suitable structured claims to mechanical checks and interpretive claims to an isolated model-based faithfulness check. Joint investigation lets Sauron reuse retrieved evidence across related criteria while retaining independent verdicts for each criterion. Each verdict carries an auditable receipt of its supporting evidence.

## What the evaluations show

On PA100—100 personal-assistant episodes and 2,586 human-labeled criteria—Sauron reports the highest F1 of the compared verifiers across all eight tested backbones and costs less than Gandalf. On PA100, Sauron’s F1 advantage over Gandalf is larger on process criteria than on outcome criteria; with GPT-5.6 Sol, the process-criteria gain is 0.07 F1.

On the paired PAFault suite—637 paired fault-control cases across 13 authored fault families, evaluated with GPT-5.6 Sol—Sauron detected 97% of injected failures and flagged 2% of clean controls. On TRAIL, with no access to the original environment state, Sauron reports higher scores than Gandalf and JudgeTRAIL on all three error-detection and localization metrics, on both dataset splits and with both tested backbones. In the reported ablation, removing the faithfulness checker lowered F1 by 0.03, which the authors interpret as evidence that validating interpretive claims contributes to accuracy.

## Boundaries and a research operation

The paper motivates verifier design partly through reinforcement-learning reward errors, but these reported experiments evaluate verifier accuracy, fault detection, and trace diagnosis; they do not establish improved reinforcement-learning outcomes. Independent source retrieval does not guarantee correct interpretation; the model-based checker can still admit unsupported claims or reject supported ones. The fault suite tests authored, controlled scenarios, not adversarial behavior discovered through optimization against this verifier; robustness to an optimizing agent remains unestablished. Evidence grounding does not resolve rubric interpretation: 48 of 65 disagreements with human judgments were classified as strict readings, and two more involved budget exhaustion. The cost advantage is benchmark-dependent. On TRAIL, where broad trace coverage is often needed, Sauron costs two to three times as much as the baselines using the same model; the paper also reports a cheaper Terra-backed Sauron variant outperforming Sol-backed baselines.

For a new evaluator, the transferable operation is to separate retrieval from claim validation, reuse evidence only across related criteria, and retain receipts that expose the source behind each verdict. Treat robustness to reward hacking and rubric ambiguity as separate experiments rather than assuming that better benchmark F1 resolves them.

Read it for a concrete verifier workflow that separates evidence retrieval from source validation, then compare its human-labeled, fault-injection, ablation, and trace-diagnosis results without confusing verifier accuracy with demonstrated reward-model robustness.

[abstract; Section 1, p4; Section 3.4; Section 3.5; Section 5.1; Appendix E.1, Table 12; Section 5.2; Table 1; Section 5.3; Table 2; Appendix D.2; Section 5.4; Table 3; Appendix D.3; Section 6.1; Table 4; Appendix F; Appendix A, p2; Appendix A, p4; Appendix D.2, Taxonomy grounding; Section 6.2; Appendix G, Table 16; Section 5.4](https://arxiv.org/abs/2610.17724v1)

## Agent-risk Defines Agent-Change Approval Around Replay, Reruns, and Bounds

*[agent-risk: Risk Assessment for Changes to AI Agents](https://arxiv.org/abs/2610.16280v1)*

The paper frames approval of a proposed agent change as an evidence-design problem: determine what the existing log settles and what requires additional evidence. Under its replay interface, invariance (nothing else changes), no anticipation by the agent, and a deployer-declared stop valuation, it replays the proposed rule on logged inputs until the first deviation. Agreement episodes are read from the log; stopped episodes use the declared valuation; continuing episodes require logged support, saved-state reruns, or explicit bounds. Thus, only the continuing part is outside ordinary replay, and it may remain bounded rather than identified when evidence is insufficient.

The decisive demonstration is deliberately narrow. In a bash sandbox, a 7,200-episode log alone decided neither of two retry gates, because the log contained no examples of the agent acting after refusals. Rerunning only each gate's blocked episodes from saved states reached both live decisions at half the agent calls of a live test sized post hoc for them, given the log. In the registered comparison, the targeted estimates of both gates' harm were within 0.015 of paired live runs, while log-only bounds did not decide either gate.

Partial logging changes the decision boundary too. In the reported stopping-gate experiment, omitting per-step harm timing changed the certified ceiling from 0.064 to 0.159; the coarse record could not establish whether harm preceded the stop. This is a logging-design result, not evidence that every risk assessment needs the same field list.

Researchers can reuse the workflow: before deployment, specify the stop valuation, record the fields needed for per-step harm timing, save states at relevant deviations, and reserve targeted reruns for continuing cases. The recommendation is conditional, not universal: replay assumes invariance and no anticipation; the stop valuation is not empirically validated in the experiments; and supported continuation is untested. The empirical demonstrations use honest agents from one open-weight model family in a bash sandbox and an airline booking environment, so they do not establish performance for other model families, real deployments, or oversight-evading agents. Restoration checks covered only the file tree compared by the harness, leaving fidelity of other state components unresolved.

It gives researchers a concrete way to turn agent-change evaluation into an evidence plan: separate replayable episodes from unresolved continuations, then decide whether better logs, saved-state reruns, or bounds are the appropriate next operation.

[abstract; Section 3, display (2) and accompanying text; Section 4.1, Retry Gates: Estimating Harm; detailed results in Appendix D.3, E7 primary results; Section 4.2, Partial Records; supporting details in Appendix D.4 and Table D.3; Limitations](https://arxiv.org/abs/2610.16280v1)
