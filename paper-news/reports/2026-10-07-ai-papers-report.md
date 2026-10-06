# 2026-10-07

## Control OSWorld Reports Lower Low-FPR Recall for Pre-execution GUI Monitoring

*[Control OSWorld: An AI Control Environment for GUI Computer Use Agents](https://arxiv.org/abs/2610.03818v1)*

In the supplied prior computer-use monitoring record, the monitor saw the complete trajectory only after task completion, so its results did not establish performance for online intervention before harmful actions became irreversible. Control OSWorld changes the measurement point rather than merely adding another offline detector.

The benchmark pairs 318 retained OSWorld main tasks with 81 reusable harmful side-task templates and checks side-task completion after every executed GUI action. This per-action scorer makes it possible to evaluate whether a monitor flags an attack before the side task is completed. The paper compares retrospective full-trajectory scoring with sequential scoring before the next GUI action, while varying access to actions, visible agent text, and screenshots.

The retrospective result is strong but conditional: with a Haiku 4.5 monitor scoring Sonnet 4.6 attacks under the ControlArena prompt and with actions, text, and screenshots, recall was about 98% at 3% false-positive rate. In the reported per-step comparison, using the GEPA prompt and the same three input types, recall was 49% at 1% false-positive rate and 71% at 3%. These figures are not a clean timing-only comparison because the cited full-trajectory and per-step results use different attack-prompt conditions, ControlArena and GEPA respectively.

The input ablation gives a second design lesson: visible agent text was the most useful tested input; removing it reduced low-FPR separability, while adding screenshots to actions plus text produced little additional uplift in the reported comparisons. The monitor metrics count only trajectories in which the side task was completed, so they measure detection conditional on successful attacks rather than detection across all malicious attempts.

For a new evaluation, hold the attacker, prompt, task pairing, and monitor inputs fixed while changing only when scoring occurs; report both retrospective detection and pre-action interception at the same false-positive thresholds. Treat the approximately 98% result as benchmark-specific: the authors describe the side tasks as only moderately harmful, note that OSWorld tasks are narrow and precisely specified, and warn that stronger or separately elicited attacks could lower detection. The transferable question is whether a monitor retains useful recall at the moment an action must be blocked, not merely after the run has ended.

Read this to learn how to turn an offline GUI-agent monitoring benchmark into an interception test, and how to avoid attributing a timing effect to monitoring when the attack prompts also differ.

[abstract; Section 2.2, OSWorld and ControlArena Integration; Section 4.2, Table 3; Appendix D.1, Table 9, Sonnet 4.6 CA prompt, A+T+S; Section 4.3, Table 4; Appendix D.2, Table 10; Section 4.2, Table 3; Appendix D.1, Table 9; Section 3.3, Metrics, Positives and negatives; Section 6, Discussion and Future Work, Side task severity; Section 6, Discussion and Future Work, Scoped main tasks favor the monitor; Section 6, Discussion and Future Work, Attack elicitation provides a lower bound on the risk of subversion](https://arxiv.org/abs/2610.03818v1) · [Section 2, “Offline and Online MRT”](https://arxiv.org/abs/2508.19461v1)

## Hop-by-hop witnesses expose tool-call changes hidden by call-and-result evaluation

*[Do Tool Calls Execute as Intended? Measuring and Repairing Intent-Execution Correspondence in LLM Agents](https://arxiv.org/abs/2610.04375v1)*

### The missing observation

Tool-call evaluation can miss a transformation between the emitted call and what a receiver parses. The paper defines intent-execution correspondence (IEC) as the property that the executed action matches the action the emitted call denotes under the tool contract. Its concrete target is a blind spot in call-and-result evaluation: an intermediate hop may change a call without the benchmark observing what that hop received, making a path-induced failure look like an LLM failure.

The comparison point is QuoteBench: its fixed-reply replays already showed transport damage, and its temporary-script transport preserved raw-path outcomes for the tested pairs. IEC changes the diagnostic unit to the first path hop whose receiver-side parser sees a different action, then couples that diagnosis to a targeted repair or refusal.

### What IEC measures

The protocol places a witness at each hop, observes the received action without executing the recorded call, compares it with the emitted action under the receiver’s parser, and names the first divergence. IntAct delivers the call in a form that the named hop cannot alter, or refuses the call. For a new agent evaluation, this suggests logging sent and received actions at every boundary before assigning blame to generation.

In Windows production-session replay, 12.0% of 7,491 exposed Claude Code Bash calls changed; this is not a rate over all 47,828 shell calls. Among 663 changed-backslash calls that ran before IntAct, 535 ran the wrong action without a reported error, or 80.7%. On IEC-Bench, the path raised tokens per passed task 2.4 times in aggregate, up to 12.3 times for one tested launch. In controlled Windows fault injection, IEC identified the changed hop in all 30 cases where the target received a changed action and flagged none of the other 138 injections. With recorded actions held fixed, IntAct recovered 137 of 173 changed-call lost pairs, or 79.2%.

### Boundary conditions

The production corpus is bounded: 47,828 shell calls came from 261 sessions by six developers at one company, using Git Bash and Windows PowerShell 5.1. The main replay uses the shortest wrapper generated by the harness, which the paper notes can make changed-call rates a lower bound. IntAct also misses path-associated losses when no hop changed the action, the agent abandons after misleading feedback, or the call lies outside the rendering domain. Treat the reported rates as measurements of these paths, then test the same witness-and-repair protocol across other harnesses and terminal-typing interfaces.

Read it to add receive-side, hop-level checks to an agent evaluation instead of treating the emitted tool call as the executed action.

[abstract](https://arxiv.org/abs/2610.04375v1) · [Appendix E.1.1, paragraph 1](https://arxiv.org/abs/2608.13547v1)

## BFCL’s Official Multi-Turn Score Skips the Should-Ask Decision

*[Asking Earns Nothing: Scoring the Decision to Act in BFCL Multi-Turn](https://arxiv.org/abs/2610.04429v1)*

On BFCL V4 multi-turn `miss_func` and `miss_param` items, the reference trajectory is empty on the under-specified turn, and the scorer skips that turn. The official scorer therefore does not directly distinguish asking from acting on the designated should-ask turn. Guessing can still affect later state and later-turn scoring.

The authors exploit the benchmark’s own control: a should-ask item is a base item with one piece of information removed from one turn, so the same request appears twice at the same turn index, once complete and once incomplete. After matching and manual certification, they retain 223 pairs whose base reference action changes the environment. A source-based classification of calls marks whether a recorded call is world-changing, and the judge-free metric scores balanced accuracy over the complete and incomplete twins. Always acting and always holding back each score 50. This is not task completion: it measures an anchor-turn decision, not whether the model finishes the task or asks a useful, well-formed question.

The paired idea is not new in the supplied comparison: AgentAbstain also makes every benchmark instance a pair, with an always-act or always-refuse ceiling of 50% paired accuracy. A separate BFCL/τ² diagnostic classifies emissions by action class and counts whether the gold class appears at any turn. The narrower contribution here is an audit of BFCL’s existing scorer and matched perturbations.

Across the 223 certified pairs and seven-model pool, using one rollout per item, gpt-5.4 attempts the call on 83.4% of complete turns and holds back on 78.0% of incomplete turns, for 80.7% decision accuracy—the highest reported in that pool. On the same items, however, the official score ranks gpt-5.4 sixth of seven.

The intervention is diagnostic rather than a validated fix. A pro-action prompt shifts gpt-5.4 toward acting on both sides of the pair, with no detectable paired-decision improvement, while its official scores increase; the reported decision change is +1.1 points [−2.5, +4.8]. A pro-caution prompt improves the paired decision measure for gemma-4-31B-it, while generally failing to improve its official score.

For a researcher, the operation is reusable: inspect the scorer’s treatment of the decision-bearing turn, derive matched complete/missing-information variants, and compare the direct metric with the leaderboard metric before optimizing either. Keep the conclusion narrow. The seven-model comparison uses different interaction channels and system-prompt conditions, and the 31 manually identified bad keys are a verified subset, not a full review of all 800 items.

Read this as a compact benchmark-audit tutorial: it shows how to expose an unscored decision, reuse matched perturbations, and test whether leaderboard gains track the behavior the benchmark claims to value.

[abstract; Section 3, paragraph 3](https://arxiv.org/abs/2610.04429v1) · [Section 2.2, Task Model and Paired Design](https://arxiv.org/abs/2607.10059v1) · [§3.1 Decision setup and diagnostic action space; §3.2 Diagnostic metrics](https://arxiv.org/abs/2609.00949v1)

## PAA Moves Staged Prompt-Injection Defense to the Pending Action Boundary

*[Blocking at the Boundary: Auditing Long-Horizon Agents against Staged Prompt Injection](https://arxiv.org/abs/2610.05163v1)*

Blocking at the Boundary reframes staged prompt injection as a decision at the last safe intervention point. The concrete limitation is timing: input screening and completed-run evaluation do not locate the intervention point. The supplied ARGUS description already audits state-changing actions by tracing proposed arguments to context spans and checking benign support plus task invariants. PAA’s change is more specific: before a pending message or tool call takes effect, it decomposes the action into operative elements, traces both values and decisions to sources, and blocks only when a verified, unwarranted, material effect is linked to unqualified steering or visible conflict.

To measure that decision, the authors pair benign and attacked executions from native Claude Code and Codex runtimes. The resulting benchmark contains 3,112 pre-action audit units from 479 benign–injected trajectory pairs, with injection-causal action-level labels. The reviewed attacks cover eight workflow scenarios, seven goals, and six injection surfaces across the two native agent systems, but the selected set is evidence of feasibility and breadth rather than prevalence. This pairing turns an eventual attack outcome into a sequence of concrete intervention opportunities.

The strongest reported result is conditional. On the Claude Code corpus with Claude Sonnet 5, PAA achieved 86.1% Block recall and 6.0% false-block rate under full-benchmark fail-open scoring. On shared tool-call units with Claude Sonnet 5, PAA outperformed both VIGIL and ARGUS on recall and false-block rate in both corpora. The ablations indicate that attacker-reachable provenance alone is insufficient: materiality limits false blocks, while conflict evidence contributes to recall. The PAA–baseline advantage is therefore backend-conditional and does not establish metric-wise dominance in every configuration.

A useful research operation is to log every pending consequential action, its operative elements, cited source spans, materiality judgment, and final Pass/Block label, then evaluate recall and false blocks per scenario rather than only aggregate attack success. The next question is whether the same rule survives attacks designed to target PAA’s attribution stages and whether a blocked action can be recovered safely. Those questions remain open: offline replay estimates intervention opportunities, not online prevention, recovery after blocking, or subsequent task completion. PAA’s pooled scores also conceal a code-review scenario with substantially lower recall, and the evaluation does not measure attacks targeting the auditor’s own model stages.

Read it to learn how to convert a long-horizon injection trace into paired, pre-action audit units and test whether provenance, materiality, and conflict evidence improve the block/false-block tradeoff.

[abstract; §5, paragraphs 2–14; Appendix B, §§B.1–B.4; §6.2, Table 2; §6.2, Table 3 and paragraph 3; Appendix C, Table 13; §7, paragraph 4](https://arxiv.org/abs/2610.05163v1) · [§4.1 Overview of ARGUS](https://arxiv.org/abs/2605.03378v2)

## Pooled Agent-Failure AUROC Can Measure Task Difficulty Rather Than Run-Level Failure

*[Disentangling Task Difficulty from Run-Level Failure in Agent Failure Prediction](https://arxiv.org/abs/2610.05572v1)*

Recent agent-failure predictors are typically trained by pooling runs from many tasks. That creates a concrete evaluation problem: a high pooled AUROC may reflect that some model–task units are harder than others, while runtime intervention requires identifying whether the current run—not merely the task—is headed for failure. This paper targets that mismatch by separating task-level difficulty, useful for allocating computation, from run-level signal, needed for an abort decision.

The method changes the evaluation estimand: a unit is a fixed model–task pair, and the authors partition the positive–negative pairs behind pooled AUROC into cross-unit and same-unit comparisons, computing within-unit AUROC only for units containing both successes and failures. They compare a run-blind difficulty oracle with trajectory predictors, released monitors, and hidden-state probes, then replay recorded costs and outcomes under fixed token budgets.

The decisive diagnostic is the pair composition: in the evaluated repeated-attempt corpora, more than 99.93% of pooled comparisons were cross-unit. A difficulty oracle that never observes the current run reached pooled AUROC 0.9454 but exactly 0.5000 within task. On C2, trajectory predictors remained near chance across prefixes from two through twenty turns: within-task AUROC ranged from 0.4935 to 0.5014, with intervals covering 0.50. Hidden-state probes could strongly decode trajectory length and repository identity, yet their mean within-task outcome AUROC was only 0.509 on C4-Q and 0.513 on C4-L. Run-level information was not absent at every depth: in a fixed C1 cohort, within-task AUROC rose from 0.509 at one turn to 0.598 at ten, still below the estimated early-abort requirements.

The budget experiment connects the metric to a decision. Under fixed token budgets, task-level allocation outperformed abort-only strategies. Adding the evaluated monitor to allocation did not improve throughput under the studied C4-L replay conditions. In a C4-L replay sweep, early stopping improved over allocation alone only at within-task AUROC of about 0.84 for a 10-million-token budget and 0.93 for 5 million—far above the 0.50–0.55 range reported for early monitors.

The operational lesson is to report pooled and within-unit discrimination together, then test the score in the policy it is meant to control: allocation for task difficulty, aborting for run-specific evidence. The boundary matters. Within-unit estimates cover only mixed-outcome model–task pairs; near-chance results do not prove that no smaller run-level signal exists. The allocation findings apply most directly to repeated-attempt settings, and the abort thresholds and policy outcomes come from recorded-run replay and studied budgets, not live intervention.

Read it to learn a concrete audit for agent monitors: separate pooled from within-unit AUROC, then test whether the signal changes the intended allocation or abort policy under the actual token budget.

[abstract; §5.1; §5.2; §6; §7; §8](https://arxiv.org/abs/2610.05572v1)
