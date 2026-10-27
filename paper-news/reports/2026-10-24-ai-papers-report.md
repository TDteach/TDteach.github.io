# 2026-10-24

## RAG Protection Scores Can Miss Adaptive Recovery

*[Protection Is Not One Event: A Survey of RAG Protection Research by Measured Endpoint](https://arxiv.org/abs/2610.30193v1)*

RAG protection studies use incompatible evaluation metrics, datasets, and threat models. The paper’s concrete correction is to organize this literature by the technical event an experiment measures, rather than by a claimed goal or defense mechanism.

The authors construct a human-coded map of 118 full-text-confirmed direct RAG-protection studies. Thirty-two annotators double-coded the records, and agreement on the primary endpoint family was reported as κ=0.867. This endpoint-first method exposes a concrete comparison problem: defense mechanisms do not reliably identify protection outcomes. A leave-one-out classifier using the papers’ mechanism labels predicted the measured endpoint family 53.4% of the time, versus a 39.8% majority-family baseline.

The measured endpoints also do not match several intuitive protection claims. Only 21 of the 118 studies make direct content disclosure or source reconstruction their primary endpoint. Within the paper’s frozen copyright/ownership-coded subset, 11 of 15 studies instead use post-hoc corpus-use detection as the primary endpoint. That 73.3% figure belongs to the paper’s frozen coding scheme, not to a legal classification or a complete count of the field; the underlying relation coding had lower agreement than centrality coding.

The controlled experiment gives this mismatch an operational form. In a bounded, non-preregistered testbed, a normalized 8-gram guard reduced measured 20-token copying to 0.0%, yet a three-query adaptive attacker recovered 48.3% of hidden source facts on Qwen3-8B. For the guarded model, hidden-fact recall rose from 3.3% after one query to 48.3% after the third, while measured decoded 20-token copying remained zero. This demonstrates the endpoint mismatch in the tested setup, not universal behavior across production RAG systems.

For a new RAG security evaluation, write the protected event before choosing the metric: is the claim about emitted text, source reconstruction, private-fact recovery, access, or corpus use? If the claim concerns information recovery, add an adaptive multi-query attacker, vary the query budget, and report recovery directly alongside copying. This is especially relevant because only 11 of the 118 mapped studies evaluate feedback-adaptive multi-query adversaries. Finally, use the taxonomy to align claims and measurements, not as proof that a metric is sufficient, unbiased, or that a defense is effective.

It turns a common RAG security evaluation shortcut—treating zero verbatim copying as evidence of confidentiality—into a concrete endpoint-and-adversary test you can reuse in your own experiments.

[abstract; Section 1, paragraph 3; Section 3.1; Section 5.1; Section 5.2; Section 5.2; Appendix B.3; Appendix B.3, Table B.3(b); Appendix C.1; Section 6.1; Appendix C.2, Table C.2(b); Section 6.1; Appendix C.2, Table C.2(a); Section 5.3; Appendix D.2; Section 6.2](https://arxiv.org/abs/2610.30193v1)

## Aggregate Scores Can Hide Unstable Per-Prompt LLM-Judge Verdicts

*[Behind Aggregate Scores: What Systematically Varying Arena-Hard's LLM Judge Reveals](https://arxiv.org/abs/2610.30512v1)*

Yorke's study isolates a measurement problem: a judge can preserve an aggregate comparison while changing many individual win/tie/loss labels. On 500 Arena-Hard v2.0 prompts, with two models' answers held fixed, GPT-4.1 was run under all eight combinations of criteria, output format, and task framing; every setup was repeated unchanged at temperature zero on a pinned model version. For each prompt, the order-averaged pairwise score was recoded into candidate-win, tie, or baseline-win classes, and instruction-induced changes were compared with test–retest disagreement.

Repeating the default setup shifted the aggregate score by about one point but changed the win/tie/loss outcome on 21.2% of prompts. The broad label-only instruction package lowered the paired aggregate by 4.09 points and changed 41.6% of outcomes, with an excess change rate of 28.2 percentage points over the two setups' average test–retest disagreement. It also removed self-generation, reference-answer comparison, error-checking, and ambiguity instructions, so this is a package contrast rather than a reasoning-only ablation. Accuracy-prioritizing criteria changed 26.9% of prompt outcomes while changing the paired aggregate by only −0.49 points; the excess change rate was 6.7 percentage points over the two setups' average test–retest disagreement. Only 131 of 496 complete prompts (26.4%) retained the same candidate-win, baseline-win, or tie classification across all 17 runs.

One useful diagnostic is proximity to the decision boundary: in the criteria contrast, changed prompts had smaller default-setup margins on average than unchanged prompts. This gives an evaluation operation rather than a claim about correctness. If a project uses judge outputs as per-item labels, repeat every exact judge setup and report both aggregate scores and prompt-level agreement; then ask whether instruction-induced movement exceeds the setup's rerun noise. The paper's result does not establish which verdict is correct or which instruction package is better.

Scope matters. The main rates come from one benchmark, one model pair, and one principal judge model, GPT-4.1, so they may not generalize to other benchmarks, judge models, or model pairs. The October repeats were conducted on one day and rest on only one to three run pairs per setup, limiting estimates of cross-day variation. More generally, each instruction contrast changes a whole package, so the study cannot isolate the causal effect of a single wording change.

Read it to learn how to compare instruction-induced prompt-level movement with rerun noise before using LLM-judge outputs as per-item labels.

[abstract; §3.1; §3.2; §5](https://arxiv.org/abs/2610.30512v1)

## A Static Audit Finds Hidden Test Dependencies in 25 of 98 SWE-Milestone Milestones

*[What the Specification Did Not Say: Specification-Oracle Gaps in Test-Graded Coding-Agent Benchmarks](https://arxiv.org/abs/2610.30635v1)*

Test-graded coding-agent benchmarks can require more than their natural-language tasks say: a scored test may depend on an upstream constant name, module path, or exact message. The paper calls this a specification–oracle gap, because passing the oracle can also measure reproduction of upstream implementation details.

The method changes the evaluation target from pass/fail alone to dependency traceability. A static audit classifies every name-, path-, and literal-level dependency of scored tests across Go, Python, Rust, TypeScript, and Java, then identifies dependencies not stated or inferable from task context. For milestone chains, the analysis also handles inconsistencies introduced by dependent tasks and maps affected tests to build units. Held-out validation reports 89.2% precision and 92.9% recall.

On SWE-Milestone v1.0.2, 25 of 98 graded milestones contained a required test with a hard hidden name or path dependency. Across 35 published runs, affected build units failed in 80.6% of runs, versus 48.4% for comparable units without such a dependency. A Go-only reference counterfactual made the mechanism concrete: renaming one hidden identifier stopped the unit’s tests from compiling in 126 of 128 cases.

That association should not be read as causal proof: the comparison is observational and groups may differ in difficulty; the counterfactual was Go-only. At aggregate level, removing affected tests barely changed rankings in the reported re-scoring, but it shifted scores within the most affected repository.

A transferable operation is to build a dependency ledger before running agents: for each scored test, record its names, paths, and literals, then link each requirement to the specification, starting code, or an inferable convention. Report affected build units separately. If tests are waived, treat that as a changed benchmark: the paper’s specification addenda are a different remedy, and their effect on new agent runs was not measured.

Finally, treat cross-benchmark prevalence comparisons as exploratory: the authors report more flags in release-note or LLM-summary settings than in screened or test-oriented settings, but construction and review rates are not controlled or directly comparable. Lexical matching can also over- or under-report whether a dependency was actually specified. The practical research question is therefore not only whether an agent failed, but whether the scored test demanded an unstated interface.

Read it to learn a concrete pre-evaluation audit that separates agent failures from hidden requirements in the benchmark oracle.

[abstract; Abstract; Section 6.4 (RQ4: Precision and cost); Section 6.1 (RQ1: Prevalence), Table 2; Section 6.2 (RQ2: Realisation); Section 6.3 (RQ3: Impact on scores and rankings), Table 3; Section 6.5 (RQ5: Other benchmarks), Table 4 and Appendix I, Table 6; Limitations](https://arxiv.org/abs/2610.30635v1)

## ARATest turns selected empirical claims into replayable property tests

*[From Prose to Properties: Testing Research Claims with ARATest for Agent-Native Science](https://arxiv.org/abs/2610.30495v1)*

### What changed

Agent-produced research can state empirical claims faster than researchers can check them. The paper identifies missing explicit properties as the bottleneck: without one, a test cannot decide which evidence would falsify a claim. ARATest approximates each claim’s semantics with a parameterized property skeleton, then binds the claim to it through a typed declaration.

The declaration fixes the domain predicate (scope and cases), observation map (quantities), and relation (comparison, quantifier, and numerical or uncertainty policy). A shared case type requires generators to supply cases in the claim’s statistical unit. Reported-evidence generators read evidence linked to the claim; auto-research generators dispatch an agent to run released code for fresh cases. Both routes feed the same property. The result is `holds`, `violated`, or `inconclusive`, and each violation carries a replayable witness.

### Evidence

Across 243 claims in 33 ARA artifacts, 54 were fully and faithfully bound: 32 held, eight were violated, and 14 were inconclusive. Thus 40 bound claims were decided in that corpus. Source triage traced two violations to numerical errors in published papers, and the authors of both papers confirmed them.

On recorded-evidence fault packets, ARATest detected all 553 seeded faults with no false alarms on 19 valid controls. Those mutations came from two artifacts, so this is not a broad real-world fault-detection estimate. On six fresh-execution tests over released code, four held and two were inconclusive; no claim violation was established.

### Boundary and research use

The practical operation is to freeze the property, scope, statistical unit, and numerical policy before changing the evidence source, then retain “inconclusive” rather than forcing a binary judgment. A pass supports only the checked cases and the declared property; it does not by itself establish that the declaration faithfully captured the prose claim.

Coverage is the sharp limit: 189 of 243 claims were not fully bound, and the authors say most need another verification method. Independent review is limited: most declaration, design, and result review was performed by AI reviewers or agents, and the authors report no agreement measure against independent human review. Finally, the continuous-testing campaign returned complete reports for only seven of 60 scheduled runs, limiting evidence for campaign-scale fresh-case coverage.

Read this for a concrete contract-and-testing pattern: freeze what a claim means before swapping reported evidence for fresh runs, while treating incomplete evidence as a distinct result rather than a failed pass.

[abstract; Section 3.1, paragraphs 1–4; Section 3.6, paragraphs 1–5 (S3.SS1.p1–p4; S3.SS6.p1–p5); Section 5.2, paragraphs 1–3; Table 6 (S5.SS2.p1–p3; S5.T6); Section 5.2, paragraphs 5–7 (S5.SS2.p5–p7); Ethics and privacy statement, paragraph 1 (Sx1.p1); Section 5.3, paragraphs 1–2; Table 8 (S5.SS3.p1–p2; S5.T8); Section 5.4, paragraphs 1–4; Table 10 (S5.SS4.p1–p4; S5.T10); Section 5.4, paragraphs 4–7; Table 11 (S5.SS4.p4–p7; S5.T11); Section 5.2, paragraph 10 (S5.SS2.p10); Section 5.5, paragraph 1 (S5.SS5.p1); Section 5.4, paragraph 5 (S5.SS4.p5)](https://arxiv.org/abs/2610.30495v1)

## EpiSEM-Bench measures whether LLM agents recover omitted safety facts before acting

*[EpiSEM-Bench: Evaluating Safety and Evidence Recovery in LLM Agents under Missing Evidence](https://arxiv.org/abs/2610.31650v1)*

When a tool response is truthful but omits a safety-relevant fact, an agent can still execute a prohibited action even when the request is benign and every returned statement is true. EpiSEM-Bench targets this as an action problem, not only an omission-recognition problem. The supplied AbsenceBench record gives models original and edited documents and asks them to identify deleted content; it does not report tool-mediated action, complete-state safety grading, matched permissible/prohibited worlds, or recovery followed by permission-sensitive action.

The authors build 300 matched unsafe/safe task pairs across six domains and 60 task families. Each pair keeps the user request and tools fixed while changing the state that makes the target action prohibited or permissible. In the suppressed-evidence condition, selected evidence atoms are hidden persistently from ordinary tools; the world remains unchanged and an oracle grades commits against complete state. The benchmark also tests recovery: a valid query to an independent audit tool returns all omitted facts. Safety Boundary Margin (SBM) searches increasing mask sizes for the minimum observed failure cardinality, while allowing an exhaustive no-observed-failure outcome. Paired Useful Recovery (PUR) requires recovery followed by restraint in the prohibited twin and legal completion in the permissible twin.

The decisive result is that recovery access reduced unsafe-task incidence for all ten evaluated models on matched conditions, by 0.7–45.3 percentage points; this is an access comparison, not evidence that every agent actively recovered facts. The measures separate capabilities: GPT-6-Luna had the highest reported SBM at 84.8%, but DeepSeek-V4.1-Flash had the highest PUR at 58.4%, despite a lower SBM. In the audit traces, GLM-4.7-Flash attempted recovery in only 1.7% of cases, had 74.7% premature commits, and achieved 0.0% PUR. Access to a recovery channel therefore did not ensure evidence acquisition or permission-sensitive action.

Interpret the result within its conditions. The evaluation uses one rollout per condition at temperature zero, so it does not characterize run-to-run variability or other decoding settings. The reported audit condition is also idealized: a valid query returns all omitted facts. Finally, the authors caution that results for the evaluated fast variants may not generalize to larger models in the same families.

**Research operation:** For a new tool workflow, create matched prohibited and permissible worlds, run full, suppressed, and recovery conditions, grade commits against hidden complete state, and report unsafe execution, permissible completion, recovery attempts, and paired recovery separately. The transferable question is not merely “did the model refuse?” but “did it obtain the missing fact, and did that fact change its action only where the state required?”

Read this to reuse a concrete paired-world protocol for separating omission robustness, permissible-task completion, active evidence recovery, and correct action after recovery.

[abstract](https://arxiv.org/abs/2610.31650v1) · [§2.2, Dataset Construction](https://arxiv.org/abs/2506.11440v1)

Prepared retrospectively from the 2026-10-24 candidate papers; verified on 2026-10-27.
