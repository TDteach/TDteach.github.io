# 2026-11-08

## Caper Approves Coding-Agent Shell Commands from Observed Effects Before Commit

*["Shall We Approve?" Consequence-Aware Approval for Autonomous Coding Agents](https://arxiv.org/abs/2610.40753v1)*

**Problem.** The paper describes existing approvers—from rule-based checkers to guardrail models and deployed permission classifiers—as basing decisions on request and command text. It identifies a concrete blind spot: behavior also depends on invoked code and workspace state, while systems that observe file changes can leave assessment to an agent or human after execution.

**Method.** Caper changes approval from predicting consequences from text to judging a recorded execution. It pre-executes each command in a snapshotted sandbox, gives an independent approver a bounded report of observed effects, commits allowed commands, and rolls back blocked ones with a reason the agent can act on. More concretely, the command runs once under tracing with output withheld; the approver compares the report with the user’s task, and a block restores the snapshot rather than exposing the mutated state to the agent. The design makes rollback transactional for local container state, not external effects: the experimental sandbox disables networking, and the paper says deployment needs isolation such as a recording proxy.

**Evidence.** On 682 shell-only SABER tasks, the paper reports 6.7% harmful outcomes for Caper versus at least 14.8% for the six comparison systems. This comparison uses a revised SABER oracle: the authors report 9.0% under the released oracle and 6.7% after auditing and correcting false positives. On controlled YoloFS-Ext, Caper reports 7.8% harmful outcomes on dangerous tasks, 60.8% safe completion on those tasks, and a 1.0% false-block rate on their safe twins; these are different denominators. The most informative mechanism test holds the approver fixed: observed effects reduced false blocking compared with predicted effects, even where predicted effects reduced harm. A useful replication is therefore to swap only the evidence source and report harm and false blocking separately.

**Boundary.** The gate covers shell commands, not all tools, and one observed execution may not represent behavior that changes with time, randomness, or environment. The benchmarks also omit adaptive attackers and attacks that defer or split harmful behavior. Finally, results are single-run task outcomes and the acceptability judgment uses an LLM, so the reported rates do not establish protection across agents, workspaces, or deployments.

Read this for the evidence-versus-prediction ablation: it turns command approval into a test of whether an observed sandbox run reduces false blocks without hiding rollback and external-effect limits.

[abstract; §4.1; §5.1–§5.3; Limitations](https://arxiv.org/abs/2610.40753v1)

## BlindToChange Measures Whether Search Agents Look for Unstated Recent Changes

*[BlindToChange: AI Agents Can Find Changes When Asked But Do They Look When Needed?](https://arxiv.org/abs/2610.41435v1)*

Search benchmarks can show whether an agent finds a recent update after the user asks about it, but they can miss whether the agent recognizes that an unstated assumption needs checking. BlindToChange addresses this gap with paired probes: a direct question explicitly asks about a recent event, while an indirect recommendation request omits the event even though the answer changes because of it.

The benchmark draws changing events automatically from Wikidata and instantiates the evaluation with recommendations affected by deaths or ended official tenures. For each model, the authors sample three responses with search disabled for each candidate indirect probe and retain the probe only when all three responses recommend the update-disqualified entity. This model-specific filter reduces chance omissions, but it also means that the headline gaps should be read as direct-versus-indirect contrasts within a model setting, not as a clean cross-model ranking.

The central result is a large separation between retrieving an update when prompted and discovering that it matters. On demise probes, native-harness performance showed median direct-to-indirect accuracy gaps of 40.5 percentage points at low effort and 27.5 points at high effort. In the shared-harness analysis, trajectories with no search or only unrelated searches accounted for at least three quarters of demise-probe failures in 13 of 15 configurations. On demises, moving from low to high effort reduced these failures by 28.9 points on average, nearly matching the 28.1-point average gain in indirect accuracy.

The transferable evaluation operation is therefore to log the search decision, not only the retrieved evidence: pair a named-update question with an indirect task whose answer depends on that update, then classify failures by whether relevant search occurred. Report direct and indirect performance separately, because a strong direct score can coexist with failure to initiate the needed check.

Scope is important. The evaluated dataset covers 2,078 demises and 751 tenures dated between February and June 2026, so these results do not establish performance on other changing facts or recommendation settings. The paper also notes that the benchmark does not cover more distant downstream effects where the relevant update may not be inferable from the answer’s own assumptions.

Read it to learn how paired direct/indirect probes and search-trajectory analysis separate the ability to retrieve a named update from the decision to look for an unstated one.

[abstract](https://arxiv.org/abs/2610.41435v1)

## On-policy distillation can improve original-document accuracy while weakening response to changed evidence

*[Better Answers, Weaker Evidence Control: Evidence Bypass in On-Policy Distillation](https://arxiv.org/abs/2611.01967v1)*

Evidence bypass is the paper’s name for retaining an originally correct answer after the document changes to support a different one. In the main QASPER–4B setting, standard on-policy distillation (OPD) raises original-document accuracy from 49.0% to 52.4%, but lowers counterfactual accuracy from 44.5% to 39.2% and raises conditional bypass from 20.1% to 35.8%. The paired interaction is −8.7 percentage points, indicating that the training-induced correctness change differs between original and answer-changing documents.

The evaluation makes that separation measurable rather than inferring it from explanations. It uses matched document interventions that change the supported answer while preserving the question and unrelated context. The evaluation also includes answer-preserving paraphrases, irrelevant insertions, and evidence deletion. Answer-preserving controls retain much of OPD’s original-document gain, while answer-changing evidence, evidence deletion, and claim-support assessments show deteriorating evidence-sensitive behavior. Bypass comparisons are conditional on each model’s own original-document correct answers, so they are not comparisons over an identical subset of examples.

A useful diagnostic is the student’s pre-distillation closed-book preference: across QASPER and PeerQA, OPD-induced bypass rises from about 5 percentage points in the weakest-prior quartile to 20 points in the strongest. Among the tested single-axis interventions, giving the teacher the annotated answer-critical span produces the strongest joint evidence-response and claim-support results, but this is an oracle-information condition because the student does not receive that span.

The proposed repair, Evidence-Paired OPD (EP-OPD), trains on both members of a validated pair and adds a margin on length-normalized answer scores, requiring each document to favor its own supported canonical answer over the paired alternative. On QASPER–4B, EP-OPD raises counterfactual accuracy to 42.7%, recovering 66% of standard OPD’s counterfactual-accuracy loss, while retaining most of its original-document accuracy gain. Across QASPER and PeerQA with Qwen3-1.7B and Qwen3-4B, it recovers 54–66% of OPD’s counterfactual-accuracy loss while retaining 80–85% of its original-accuracy gain.

For a researcher, the transferable operation is to construct matched inputs whose evidence supports different answers, then score both answer accuracy and evidence responsiveness. The boundary is important: these diagnostics measure behavioral evidence responsiveness rather than directly verifying internal reasoning. The main accuracy evaluation covers answerable scientific-document questions with a limited set of canonical answer types, and evidence responsiveness should not be equated with factuality or robustness to false or adversarial documents.

Read it for a reusable matched-document evaluation and a concrete paired-margin training intervention, with measured trade-offs across two scientific-QA datasets and two student sizes.

[abstract; Section 6.2, PDF p. 7; Table 3, PDF p. 8](https://arxiv.org/abs/2611.01967v1)

## Explicit state outlasts full-log reading only beyond a reader-dependent horizon

*[Agent Memory as Rate-Limited Filtering: Explicit State Outlasts Long Context Beyond a Reader-Dependent Horizon](https://arxiv.org/abs/2611.02361v1)*

The paper asks when an agent should stop treating an access log as its memory. Its executable benchmark uses grants, withdrawals, reinstatements, expiries, groups, and change windows under a known policy; test pairs differ only in event order or in one field of the deciding events. The proposed design treats memory as recursive filtering: an LLM parses each event into a typed update, an explicit transition rule applies the update, and the reader receives the resulting state rather than the full log.

The long-context baseline degrades with history length on the first synthetic access-control domain. At 256 events, the two tested Qwen readers are at chance AUC, while phi-4 retains AUC 0.68. State reading is much stronger for the reasoning-trained 32B models, reaching 96% and 98% in the paper’s reported comparison. The apparent crossover is not a universal context limit: for gpt-oss-120b, the registered advantage of parsed state over full-log reading is absent at 256 events but meets the registered margin at 1,024 events in the registered seed; a second seed produces a smaller, sub-margin lead.

The implementation result is more diagnostic than the headline comparison. At 256 events, the parser-plus-explicit-rule filter reaches balanced accuracy of 0.80 with Qwen2.5-14B and 0.84 with phi-4, within 0.03 of the oracle state. In the corresponding ablation, parsing contributes about 0.03 error, state decoding 0.14–0.17, and model-applied transitions another 0.21–0.26. A query-time oracle dependency retriever can match the filter at this length when it has both the archive and the query; the filter’s operational difference is selecting dependencies online, before the query is known.

The transferable research operation is to score these stages separately: event interpretation, deterministic state transition, state rendering, and decision reading. That decomposition can reveal whether a proposed memory method needs a better parser, a safer transition mechanism, or a more legible state interface. The boundary matters: both evaluated domains are synthetic and their rules are stated in the prompt, the strongest filter results depend on a transition rule written by people, and state reading itself is not uniformly reliable. A frozen second-domain replication reproduced the horizon only under a rendering that explicitly resolved expiry, so the result should guide controlled memory experiments rather than be treated as a general law of long-context models.

Read it to learn a concrete evaluation decomposition: separately measure event parsing, explicit state updates, state readability, and query-time dependency selection instead of treating memory quality as one end-to-end score.

[abstract; Section 4.1, Horizon decay of long-context reading; Section 4.6, Table 10; Operational horizon; Section 4.5, A filter that can be built; Table 7; Section 4.5, Table 8 and accompanying discussion; Section 4.5, Published memory designs and a query-time retriever; Section 4.8, A frozen replication with fresh wording; Section 6, Domain of validity; Section 6, Domain of validity; Section 4.5, Can the model write the rule?; Section 4.2, Reading the state instead of the log; Section 4.8, A second, independently specified domain](https://arxiv.org/abs/2611.02361v1)

## BlackSwan reframes agent write verification as pre-execution refutation

*[Action Verification through Conjecture and Refutation for Language Model Agents](https://arxiv.org/abs/2611.02950v1)*

The paper starts from a specific blind spot in confirmation-oriented verification: a wrong action can pass checks that ask whether it is right. In the supplied comparison, ACCORD already reports action-conditioned grounding for proposed writes, so BlackSwan’s claimed increment is a change in verification objective rather than the invention of pre-execution grounding.

For each proposed state-mutating action, BlackSwan first predicts the action’s intended, task-relevant effect. It then formulates specific, empirically testable suspicions about how that effect could be wrong before collecting new evidence. Existing observations or additional non-mutating actions test those suspicions. A confirmed suspicion blocks the write and prompts a replacement; if none is confirmed, the original write proceeds, even when some suspicions remain unresolved.

The strongest mechanism evidence is the AppWorld test-challenge ablation with thinking disabled. Refutation improved task-goal completion by 5.6 points when suspicions were explicit but by only 0.1 points when they were implicit. Fixing suspicions in advance improved task-goal completion by 8.9 points under refutation, compared with 3.4 points under confirmation. This supports treating “what could falsify this action?” as an explicit pre-test object, rather than leaving the verifier’s concerns implicit.

The headline result is conditional but substantial: with Qwen3.5-27B FP8, one in-context example, and thinking enabled, BlackSwan exceeded the strongest AppWorld challenge-split baseline by 14.9 task-goal-completion points and 19.2 scenario-goal-completion points. With thinking disabled under the corresponding setup, the margins were 25.2 and 20.2 points. A practical research operation is therefore to log an action-local expected effect, preregister falsifiers, and label each as confirmed, dismissed, or deferred before permitting the write.

Coverage and cost constrain the takeaway. Write-level verification cannot directly catch a required action that the agent never proposes; omission was the most frequent error reported in the paper’s failure analysis. In the reported AppWorld cost analysis, the listed backbones completed 1.39–2.25 times as many tasks at 1.5–9.4 times the cost. Genuine ambiguity can also recur across successive proposals and increase verification cost. Finally, the reported BlackSwan and ACCORD results use different backbones and evaluation conditions, so they do not establish a matched performance ranking.

Read it to compare confirmation and refutation as distinct verification objectives, then reuse its explicit-suspicion ablation when designing a tool-using agent loop.

[abstract; Section 3.1, Expect: Making the Action’s Intent Explicit; Section 3.3, Acting on the verdict; Section 4.1, Overall performance; Figure 3 data table; Section 5, Ablation; Table 2; Section 5, Failures reduced by verification; Section 5, Computational cost; Section 6, Limitations and future work](https://arxiv.org/abs/2611.02950v1) · [abstract; §4.2, Consistent gains across models and difficulty levels; Table 1](https://arxiv.org/abs/2606.16432v1)
