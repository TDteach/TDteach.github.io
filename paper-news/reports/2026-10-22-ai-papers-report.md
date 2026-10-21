# 2026-10-22

## Bounded Lean tactic repair raises solve rates but adds runtime cost

*[Fix, Not Just Resample: Bounded Compiler-Guided Repair in Lean 4](https://arxiv.org/abs/2610.26942v1)*

## The change

APRIL’s supplied evaluation was single-shot, without search or iteration, so it did not test repair as part of theorem-level sampling. This paper instead places a pretrained repair model inside Lean proof search. At each step, the system samples `K` candidate tactics; when Lean rejects one, it feeds the compiler error to the repair model to fix the rejected tactic in place, with at most `R` repair attempts. `R=0` recovers the sampling-only baseline. The important design choice is therefore an explicit allocation decision: spend computation on a fresh tactic or on a diagnostic-conditioned correction.

## What the measurements show

On a 1,990-theorem LeanDojo subset, same-`K` comparisons report a 2.3–4.1 percentage-point Pass@1 increase and 45–82 net additional solved theorems across `K ∈ &#123;1, 3, 5, 8&#125;`. The first repair attempt accounts for most, but not all, of the net gains observed by three attempts: it captures 84–96% of the total gain in the reported sweep. The failure analysis narrows the mechanism further. Repair success is higher for some local tactic failures than for type mismatches, consistent with the reported conclusion that the gains come chiefly from shallow tactic-execution failures rather than structural errors.

The result is not confined to that benchmark configuration. On Lean Workbook, the reported validation solve rate rises from 21.4% to 42.9%, and the held-out test rate from 19.1% to 31.5%, at `R=2`; neither split shows a baseline regression in that comparison. But repair is expensive: at `K=8`, mean time increases from 200.5 seconds to 485.7 seconds per theorem at `R=3`, and the paper notes that added latency can trigger regressions under a 600-second timeout. The authors also report that one repair generally improves coverage at matched per-theorem runtime, while noting a tight-budget exception and measurement noise; the underlying Figure 4 curve was not independently reviewed here.

## Research operation to reuse

Treat repair as a conditional compute policy, not a universally beneficial extra stage. For a new prover, run a `K × R` grid, report same-candidate-budget and matched-wall-clock results separately, stratify recovered attempts by compiler failure category, and record timeout-induced regressions. The paper reports each number from a single deterministic run, so this protocol should add repeated seeds or runs before making claims about variance or robustness. The transferable question is: at each budget, which rejected tactics are sufficiently local that compiler feedback can recover them more cheaply than another sample?

Read it for a concrete design pattern—turning verifier diagnostics into a bounded search action—and for an evaluation template that separates same-budget gains, matched-runtime coverage, repair depth, failure category, and timeout cost.

[abstract](https://arxiv.org/abs/2610.26942v1) · [§5.1 Main Results](https://arxiv.org/abs/2602.02990v2)

## Selection Bias Can Inflate Differential-Privacy Audit Bounds

*[Reliable Estimation of Differential Privacy under Selection Bias](https://arxiv.org/abs/2610.27021v1)*

Privacy audits typically use membership inference attacks (MIAs) to estimate a lower bound on a mechanism’s privacy leakage at a chosen confidence level, then compare that bound with the mechanism’s theoretical differential-privacy (DP) upper bound. The paper’s central warning is conditional but consequential: if an audit chooses an MIA threshold—or, in a one-run audit, the number of guesses—after inspecting the same observations used to estimate error rates, a fixed-threshold confidence procedure does not retain its nominal coverage. That is selection bias in the certification step, not a change to the attack itself.

Methodologically, the paper treats a fixed-threshold MIA as a hypothesis test, estimates its false-positive and false-negative rates, and inverts the DP trade-off to obtain a lower confidence bound. It then adapts existing remedies: holdout selection, Bonferroni-adjusted bounds over a prespecified finite threshold grid, DKW simultaneous bounds over thresholds for multi-run audits, and K-fold selection. For one-run audits, where the canary-score observations are dependent, DKW is not available; fixed guesses, corrected finite-grid bounds, holdout, and K-fold remain options. The correction sits on top of the existing MIA-to-bound pipeline, so the operational question is which selection procedure matches the audit protocol.

The coverage experiment supplies the decisive diagnostic. In a Gaussian simulation with a known parameter, 10,000 independent audits per setting, and nominal 95% confidence, uncorrected threshold maximization miscovered 19.36% of cases at μ0 = 2 and n = 10,000, versus less than 5% for the tested valid methods. In selected real-model audit reanalyses, correction lowered reported bounds by 5% to 93%, depending on the audit and valid method; the authors caution that this difference reflects both selection bias and the conservativeness of valid methods.

For a researcher, the transferable operation is simple: treat “choose the best threshold or guess count” as part of inference, not as harmless tuning, and specify the correction before interpreting the resulting bound as evidence against a DP guarantee. An inflated bound can falsely flag a compliant mechanism, while a valid selection procedure removes those false alarms under the stated confidence interpretation. The boundaries matter: the real-model reanalysis compares bound values but does not establish empirical coverage, the evaluated valid procedures are conservative, and no correction dominates across settings. K-fold is presented as a reasonable default rather than a universally optimal method; moreover, DKW can become too loose in extreme false-positive-rate regions.

Read this before treating an MIA audit’s best threshold or guess count as a confidence-certified DP violation: the paper shows the coverage failure in a known-mechanism experiment and gives protocol-specific corrections.

[abstract; Sections 4.1–4.4 and 5.3, PDF pp. 9–14](https://arxiv.org/abs/2610.27021v1)

## Hidden-question tests expose a gap between current-query scores and later-question support

*[Evaluating Context Compaction on the Questions That Come Later](https://arxiv.org/abs/2610.27301v1)*

## The evaluation change

The concrete limitation targeted here is that scores on the question a compaction was made for do not reliably show how it serves later ones. The authors therefore change the evaluation target from the known question alone to questions hidden at compaction time.

## Protocol

Using four corpora that annotate evidence for several questions per text and recorded agent trajectories, the authors compare compaction policies with random deletion at matched budgets where specified. At deletion time, the current question is visible while later questions remain hidden. The evaluation combines answer accuracy with evidence-retention and support checks. In the trajectory test, later questions request identifiers needed by subsequent tool calls.

## Findings

On MultiRC, selecting sentences for the current question improves performance on that question relative to random deletion, but shows no detected average benefit on later questions at the matched 25% token budget. The average null result masks opposing outcomes: typed selection helps questions sharing evidence with the known question and harms disjoint questions; this split is post hoc.

Changing the deletion unit changes the result. On later MultiRC questions, LLMLingua-2 beats random sentence deletion by 12.5 points at the same token count, but the gap shrinks to 7.3 points when content-word retention is equal; the latter analysis is exploratory and does not establish causality. On FEVER, typed selection’s higher claim-label accuracy is not accompanied by a detected improvement in the annotation-derived support score, illustrating that label recovery can overstate what the kept text supports.

The ranking is conditional. Typed selection beats LLMLingua-2 on Evidence Inference hidden claims in a nominal 25%-budget comparison, but the retained token counts differ. For the tested retail trajectories, typed selection substantially outperforms random deletion on later identifier questions, while LLMLingua-2 shows no detected gain.

## Research operation

For a new compaction evaluation, hide future questions at write time, compare against token-matched random deletion, and score both answer recovery and whether the retained text contains the annotated support. Stratifying hidden queries by evidence overlap can reveal whether an aggregate score conceals different failure modes.

## Boundary

These results establish benchmark and recorded-trajectory behavior, not performance in live agents or deployed settings. The content-word mechanism is partial and exploratory, and evidence-retention and support-based evaluations are limited by incomplete annotations. The reported selector rankings should therefore be read as conditional on the tested datasets, policies, budgets, and task types.

Read it to borrow a concrete hidden-question evaluation protocol: matched random deletion, evidence-overlap analysis, and separate scoring of answer recovery versus textual support.

[abstract; Section 3, paragraph beginning “Averaged over hidden questions, selection stays near random deletion”; Appendix G, Table 12; Section 4, subsection “Content-word retention accounts for part of the lead”; Appendix I, Table 15; Section 3, subsection “Label recovery and support scoring disagree”; Appendix J, Table 16; Section 5, subsection “Agent trajectories”; Appendix N, Table 21; Section 5, subsection “Evidence Inference”; Appendix G, Table 10; Section 8, Limitations](https://arxiv.org/abs/2610.27301v1)

## False-alarm-free per-action monitors miss relational purpose violations

*[Local Allow, Global Deny: Why Per-Action Authorization Does Not Compose in LLM Agents](https://arxiv.org/abs/2610.27620v1)*

A sequence can be locally authorized at each action while its execution violates a policy spanning intent, purpose, provenance, consent, or delegation. The paper calls this a compositional authorization failure (CAF). The concrete composition gap is that some purpose violations are relational: their evidence appears only when executions are compared, not when one trace is inspected more carefully.

The supplied prior designs make different local moves. Fides propagates labels through model queries and checks a tool call against policy before execution. RTBAS screens relevant history regions, redacts more restrictive regions, and checks proposed tool calls against policy. SafeFlow combines runtime flow control with logged transactions. The current paper changes the unit of analysis from one action trace to a policy over executions, without claiming that these earlier mechanisms address every possible global policy.

Formally, the paper characterizes CAFs by expressiveness—single-trace safety versus relational *k*-safety—and by observability, using a ladder of monitor profiles. For relational purpose violations, it proves that a per-trace monitor that never raises a false alarm detects none of them. Such a monitor must compare executions or accept false alarms. To make this boundary testable, AL-Synth uses SAT/SMT bounded model checking and self-composition to synthesize minimal, locally authorized witnesses, then compares solver results with an exhaustive oracle on small models and bounded horizons.

The decisive demonstration is the judge study. Across nine LLM judges, eight blocked the synthesized relational witness in 0/30 per-action repetitions; when shown both executions, eight flagged it in 30/30, while Llama-4-Maverick flagged it in 17/30. This measures judge behavior under the reported setup, not vulnerability rates for autonomous agents. A separate calendar experiment shows the complementary case: on the tested Qwen3-30B task, a composition-aware consent guard eliminated cumulative-consent failures, whereas an intent-only guard did not measurably reduce them.

The theorem is stronger than the empirical generalization: the demonstrations use clean symbolic models and synthetic tasks, AL-Synth validation is bounded, and the six-mechanism defense matrix is inferred from published designs rather than obtained by running those systems. A useful evaluation operation follows directly: classify each policy conjunct as trace-level or relational, generate both single-run and paired-run tests, and avoid treating a zero per-action block rate as evidence that a relational policy is certified.

Read it to learn when a policy test must compare executions rather than add more features to a per-call guard.

[abstract; Appendix A, proof of Theorem 3; §VI, AL-Synth; §VII, Differential testing; §VIII-D; Table V; §VIII-E; Table VI; §VIII-A; §IX, Limitations](https://arxiv.org/abs/2610.27620v1) · [Section 4.2, paragraph introducing Algorithm 5](https://arxiv.org/abs/2505.23643v2) · [§7, approach overview](https://arxiv.org/abs/2502.08966v2) · [abstract](https://arxiv.org/abs/2506.07564v3)

## RITE Separates Silent-Error Recovery into Recognition, Verification, and Evidence Use

*[RITE: Evaluating End-to-End Resilience to Silent Tool Errors in E-Commerce Agentic Systems](https://arxiv.org/abs/2610.27777v1)*

Compared with AgentCheck’s documented reproduce–intervene–mitigate workflow, RITE adds a matched correct-value, silent-error, and explicit-failure checkpoint plus an end-task/process decomposition; the supplied comparison does not establish that AgentCheck lacks other controls.

RITE constructs 167 slot–locus units from nine e-commerce workflows and production-log-derived inputs, yielding 501 matched instances. Each unit keeps the query, required result, checkpoint history, and continuation world constant across the three conditions. At the affected checkpoint, the silent condition inserts a plausible, schema-valid but task-wrong value; recorded tool behavior is frozen for replay, and the agent continues freely.

The decisive result is an end-to-end gap rather than merely a detection gap. With temperature 0, a 25-step budget, and environment-side tool anomalies excluded, the ten models’ correct-condition RSR ranged from 0.716–0.827, versus 0.277–0.403 under silent errors; implicit-condition retention was 0.345–0.526. Process measures locate successive failure points: the latest producer observation matched the gold value in 0.3% of Unnoticed rollouts and 23.3% of Noticed rollouts, yet 57.8% of Noticed rollouts still retained the polluted value. Among 147 rollouts that refetched the producer, 87 recovered the gold value and 60 matched neither the gold nor polluted value; even among noticed refetches, RSR was 0.655.

A transferable research operation is to instrument recovery as three linked gates—recognition, source verification, and final use of corrected evidence—and evaluate each against final task success under the same checkpoint. This asks a sharper engineering question than “did the agent retry?”: did corrected evidence actually propagate into the answer?

The boundary is important. Each silent-error instance contains one corrupted value, and re-querying its producer returns the unpolluted response; RITE therefore does not establish resilience to persistent or correlated faults. Temporal staleness is defined but not instantiated. The evidence comes from nine internal industrial e-commerce workflows, so transfer to other domains and tool ecosystems is unestablished. Finally, RSR uses an LLM judge: human validation found 76/100 majority agreement and Cohen’s kappa 0.318 for Result, so absolute success rates warrant caution.

Use RITE to design a matched checkpoint ablation that separates anomaly recognition, producer verification, and successful use of corrected evidence instead of collapsing them into one final task score.

[Section 1, paragraph 5; Sections 4.2–4.3; Section 5.1, F1; Table 1; Appendix C, rollout counts and judge protocol; Section 5.1, F2; Table 2; Appendix C, Process measures; Section 5.1, F3; Appendix G, Limitations; Appendix D, Table 8 and agreement discussion](https://arxiv.org/abs/2610.27777v1) · [§4.1, The Controlled Comparison (S4.SS1.p1; algorithm lines alg1.l2–alg1.l12)](https://arxiv.org/abs/2607.11098v3)
