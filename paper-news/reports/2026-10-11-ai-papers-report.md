# 2026-10-11

## The OS sandbox is linked to a 30.8%-to-7.7% final-stage attack reduction

*[Separation of Duties for Privileged LLM Agents: A Governed Execution Architecture with Measured Security-Utility Trade-offs](https://arxiv.org/abs/2609.38224v1)*

Privileged-agent security is tested here at the action-to-execution boundary, not only in the prompt. The paper frames the limitation as existing defences concentrating on agent inputs while the path from a candidate action to a privileged side effect is less directly studied. Related evidence already gives two nearby patterns: Progent’s guarantee prevents policy updates from silently enlarging the permitted action set, while CaMeL checks tool arguments and tracked dependencies before execution.

The tested change is to govern the handoff to execution. The architecture places planner, policy gate, executor, and auditor between agent and operating system. Actions arrive as structured intents, so adjudication does not parse shell syntax; approval is a one-shot credential bound to the exact bytes that will run. The evaluation uses a 313-case benchmark across eight variants, plus prompt-only baselines from three hosted LLMs on 150 stratified cases with five repetitions.

In the benchmark model, effective attack success falls from 98.3% under direct execution to 7.7% in the deployed configuration. The paper attributes a substantial final-stage reduction, from 30.8% to 7.7%, to the operating-system sandbox. Real-implementation re-execution found five effectful executions among 66 sandbox-evaluable payloads, a 7.6% rate. The similar aggregate rate did not mean the same cases succeeded: the authors report substantial case-level disagreement. After correcting read-only operations, reported benign false-denial is 11.1% (6/54), attributed to an allow-list versus sandbox-writable-root mismatch rather than the policy gate.

The prompt-only experiment is a warning against casual baseline comparisons: the three models permitted 78.1% of dangerous operations in parseable dangerous-case decisions, but its samples and denominators differ from the full-benchmark evaluation, so the comparison is directional. The sandbox also has a concrete boundary: a deletion on a different volume succeeded silently, because deletion confinement is volume-scoped. External validity is limited to one Windows/PowerShell environment. The full deployed result is behavioural-model evidence, not execution of every case.

For a replication, keep policy decision, executor effect, and corrected benign completion as separate outputs. Re-run destructive cases against the real implementation, preserve case IDs, and report denominators before comparing model baselines. The practical research question is which controls reduce attack success in the evaluator and which survive the actual OS boundary.

Read it to learn how to separate policy-level security results from real executor behavior when evaluating privileged agents.

[abstract; Section IV-E, paragraph 2; Section VI-B, paragraph 1; Section VII, paragraph 1; Section IV-E, paragraph 4; Section V-C, paragraphs 2-3; Section VII, paragraph 8](https://arxiv.org/abs/2609.38224v1) · [§6, Progent’s Security Guarantee, \[S6.p2\]](https://arxiv.org/abs/2504.11703v3) · [Section 5.4, Enforcing security policies](https://arxiv.org/abs/2503.18813v2)

## CORE Uses Certified Conflict Cores for Non-Chronological Language-Model Search

*[CORE: Conflict-Oriented Reasoning Elimination for Verifiable Language-Model Search](https://arxiv.org/abs/2609.39069v1)*

CORE targets a concrete failure mode in test-time reasoning: a system may restart or revise its latest step even when an earlier decision caused the error. The supplied LLM-Modulo account already uses a generate-test-critique loop in which an LLM proposes candidates, external critics evaluate them, and a controller feeds critiques into later prompts. CORE’s specific change is to represent failure as a reusable search object.

CORE defines a sound conflict core as a subset of decisions that cannot all occur in any valid complete state. When a verifier returns such a core, the controller stores its canonical decision keys, backjumps to the latest implicated decision, marks the offending candidate tried, and caches the core so later candidates containing the same conflict can be skipped. Candidate generation remains with the proposer; CORE changes how the controller responds to certified failure.

The safety claim is conditional, not a blanket guarantee. The theorem assumes sound cores, finite branching and depth, exhaustive proposal enumeration, a verifier that does not reject valid-solution prefixes, an exact final scorer, and no budget interruption. Under those assumptions, uncapped search does not prune a valid complete solution and returns one whenever one exists. Heuristic or learned cores do not inherit this guarantee unless independently certified.

The controlled evidence isolates the search rule more directly than the language-task comparison. On planted 3-coloring instances with matched deterministic proposals and an exact verifier, CORE reduced median verifier calls from 223.5 to 134.5 at 30 variables and from 267.0 to 173.5 at 36 variables. Caching added reductions beyond backjumping alone at sizes 24, 30, and 36, while the variants tied at size 18.

Across five tasks, CORE exceeded Tree of Thoughts in mean success for both tested backbones: 75.9% versus 72.5% with Qwen2.5-7B-Instruct and 84.2% versus 81.8% with Qwen3-8B. It also used fewer verifier calls and generated tokens in that evaluation. These are not latency or total-compute measurements, and the reported practical results do not establish that every deployed conflict core is sound.

The transferable research operation is to make a verifier answer more structured than “wrong”: return a checkable incompatible subset, then test chronological repair, backjumping, and caching under matched proposals. The key follow-up question is whether audited cores preserve these reductions when latency, core-generation cost, and finite budgets are measured directly.

The paper offers a concrete, reusable controller idea: turn certified failure explanations into both a non-chronological repair target and a cached constraint. Its controlled matched-proposal experiment helps isolate that mechanism, while its theorem makes clear when pruning is safe and its LLM evaluation reports both task outcomes and inference-resource usage.

[abstract](https://arxiv.org/abs/2609.39069v1) · [Section 3, paragraph 2](https://arxiv.org/abs/2402.01817v3)

## Causal Recovery Evaluation Separates Rescues from Harms in LLM Agents

*[When Harnesses Lose the Signal: Causal Evaluation of Recovery in LLM Agents](https://arxiv.org/abs/2610.00372v1)*

### The measurement change

Recovery is often judged by average task success, but that metric can hide whether an operation rescued a failing trajectory or disrupted one that would have succeeded. The paper defines recovery as a causal decision: from the same execution state, it compares a recovery continuation with a no-recovery continuation. With binary task outcomes, rescue means failure without recovery but success with it; harm means success without recovery but failure with it.

### How the router uses the measurement

The Causal Intervention Router (CIR) uses information available before recovery: it estimates observation-error and success outcomes with and without refresh, combines marginal estimates into rescue and harm scores, and applies thresholds to refresh at most once. The paper cautions that these scores are products of separately estimated marginal probabilities, not probabilities that an individual task will be rescued or harmed.

This suggests a concrete evaluation operation for a harness researcher: first collect matched branches from the same state and history, then report rescue and harm separately before optimizing a recovery policy. The intervention should be treated as a decision with both upside and downside, rather than as a generic post-failure success mechanism.

### Evidence and boundary

In a held-out evaluation of 75 prefix-feasible ALFWorld tasks with Qwen3-14B, a fixed ReAct-style harness, and greedy decoding, CIR raised overall success from 70.33% with never-refresh to 73.33%, a 3.00-percentage-point gain with a reported 95% confidence interval of [0.67, 5.67]. Under two-step stale observations, its largest reported condition-specific gain was +9.33 percentage points, with 9 rescues and 2 harms. Under clean observations, CIR left success unchanged and produced no observed rescues or harms.

A mechanism control that queried the environment but hid the returned content still shared eight rescues with full refresh, indicating that new observation content was not necessary for those particular rescues; the small paired comparison does not establish that full refresh is superior. The recovery analyses use limited, prefix-feasible ALFWorld cohorts rather than the full benchmark distribution. The reported policy evaluation also uses one model, one ALFWorld setting, and a fixed ReAct-style harness with greedy decoding, so transfer is untested in the supplied experiments.

A useful next question is whether the same paired protocol, followed by a held-out router evaluation, preserves low harm rates when the model, harness, observation corruption, or decoding regime changes. That experiment would test the reusable measurement design separately from CIR’s single-setting performance result.

Read this to borrow the paired-continuation protocol for measuring whether a recovery action rescues or harms a trajectory before building a selective recovery router.

[abstract; §3.2; §3.3; §4.2; §5.4; §5.4, Table 1; §5.3; Appendix A; §5.1, Paired runs and data partitions; §5.1, Task, agent, and perturbations](https://arxiv.org/abs/2610.00372v1)

## Checkable Execution Evidence Improves Coding-Agent Patch Review in an Upper-Bound Diagnostic

*[Groundability, Not Scale Alone: When Weak Reviewers Can Audit Strong Coding Agents](https://arxiv.org/abs/2610.01023v1)*

**Problem.** Coding agents can return plausible patches that omit required behavior, while long traces and confident summaries can conceal what was missed. This paper asks when a nominally weaker reviewer can decide whether a patch solves its issue. Its evaluation uses 411 execution-labeled traces from three agents and 101 controlled cases.

Issue-derived test generation is not the paper’s main change. Otter already generated issue-specific tests before a fix and measured fail-to-pass behavior; it also used generated tests to filter candidate patches. The current paper changes the review target: a generated test that behaviorally fails on the unpatched repository becomes evidence for a separate reviewer judging a completed agent trace.

**Method.** The paper compares structured but unchecked evidence with official execution evidence. After choosing and freezing one of two formats per reviewer, five of six reviewers are evaluated on held-out traces. For the deployable setting, its cascade rejects no-change patches and patch-caused static errors, generates tests, and retains a test only if it behaviorally fails on the unpatched repository before using its patched-repository result. This gate makes the test a checkable signal, not proof that the generated test covers all required behavior.

**Evidence.** On the 32-trace design set, GPT-4.1 catches 0.91 of defects while rejecting 0.86 of acceptable patches: structured evidence can raise catch while imposing substantial over-rejection. With official execution evidence, five of six reviewers improve both defect catch and over-rejection on 122 held-out traces relative to structured evidence; GPT-OSS-120B and GPT-4.1 classify all 122 correctly. This is an upper-bound diagnostic, because official checks are unavailable in deployment.

The frozen cascade is weaker and more realistic: on 121 scored held-out GPT-5.4 traces it reports coverage 0.89, risk 0.33, defect catch 0.76, and over-rejection 0.66; on 59 Gemini traces, the corresponding figures are 0.86, 0.26, 0.80, and 0.67. The paper’s limitation is therefore operational, not merely about reviewer scale: its strongest result depends on unavailable checks, while the deployable cascade still has substantial risk and over-rejection. The defect-detection evidence is also limited to the Python GPT-5.4 and Gemini sets, and the authors make no total-cost or general agentic-review claim.

**Research operation.** For a new evaluator, freeze the evidence policy on a design split, test it on held-out traces, and report catch, over-rejection, coverage, and risk together. A useful replication question is whether the base-failing test gate remains informative beyond these Python agents and repositories—or whether producing equally decisive checks remains the bottleneck.

Useful for researchers building coding agents or evaluators: it separates reviewer capability from evidence quality, reports an upper-bound with official checks alongside a deployable-but-error-prone cascade, and measures both missed defects and false rejections.

[abstract; §3, “Checking generated tests”; §5.2; §5.3; Table 2; §6.2; Table 3; §7, paragraph 1; §7, paragraph 2; §7, paragraph 4](https://arxiv.org/abs/2610.01023v1) · [Section 6.2 and Table 1; Section 6.7, Test Generation and SWE Agents](https://arxiv.org/abs/2502.05368v2)

## Safety in self-improving agents requires separate controls for validation, deployment, and editing

*[Safety Must Survive Self-Improvement: Why Failures Persist and How Agents Recover](https://arxiv.org/abs/2610.01073v1)*

An iterative improver can pass its initial suite yet become unsafe after an authorization contract changes; a failed program can also remain deployed when all new proposals are rejected. This paper tests those two persistence routes rather than treating “passed,” “runs,” and “seeds” the next edit as one decision.

Zhang et al. build a controlled testbed of stateful authorization tasks, use fixed LLM editors to optimize executable agent components, and record effects with independent traces. Paired interventions separately vary which revisions pass validation, which program continues running, and which program the editor revises next. This decomposition is the paper’s practical method change: it turns a vague self-improvement safety problem into separable control decisions.

The changed-authorization study found that 22 of 24 GPT checkpoints became unsafe after a previously absent dependency was revealed, although the frozen founder remained correct. At the framework level, stale archive readouts retained 22 unsafe selections through iteration 100 even when correct alternatives were present. Under matched all-rejected cases with the contract unchanged, keeping the incumbent left the failed program active, whereas founder fallback restored safety.

Recovery also depended on the edit source. Starting from the same 42 naturally failed programs, editing the initial implementation rather than the failed implementation reduced unsafe endpoints from 14 to 1 in the original-editor cohort; the advantage varied across editors. In the core trajectory study, validated rollback and full validation each ended all 288 matched blocks fully correct, with mean deployment savings of 43.5% and 43.4%, respectively, before validation expenditure was counted.

The scope is important. The main evidence uses constructed authorization workloads, fixed editors, initially correct founders, and externally specified contracts; transfer to other domains, evolving editors, jointly evolving improvement procedures, or imperfect validators is not established. Revalidation also did not eliminate coverage failures: some programs passed the expanded suite but failed independently composed cases. The savings are weighted task-service costs, not end-to-end latency, model-inference expense, or total operational cost.

For a new RSI experiment, log three state variables separately: current eligibility under the present contract, the artifact actually deployed, and the implementation chosen for the next edit. Then ask whether each safeguard preserves safety throughout recovery—not merely whether a candidate passes one test suite.

Read it to turn an iterative agent loop into three testable state transitions—current eligibility, deployed fallback, and next edit source—and compare the measured failure and recovery effects.

[abstract; §3.6; Table 13](https://arxiv.org/abs/2610.01073v1)
