# 2026-11-01

## Identical Tutoring Dialogues Receive Remediation Scores 39.2 Percentage Points Apart

*[MisconceptDialogue: Evaluation Criteria Shape Measured Success in LLM Math Tutoring](https://arxiv.org/abs/2610.31679v1)*

MisconceptDialogue targets a measurement problem: the same tutoring dialogue can receive materially different remediation scores when the success criterion changes. The paper’s central method is paired evaluation: it holds 2,250 dialogue outputs fixed and scores them with strict exact-match, numeric extraction, and a GPT-5-mini judge across five tutors, five strategies, and three misconception types. This separates a change in the evaluator from a change in tutor behavior.

Strict exact-match produced a 42.1% Remediation Success Rate, numeric extraction produced 45.8%, and the human-calibrated LLM judge produced 81.3%. The strict-versus-judge gap was 39.2 percentage points, with a paired McNemar test of p&lt;10^-50 and a 95% bootstrap interval of 36.6–41.8 points. The paper presents exact-match as a benchmark-practice lower-bound stress test, not as a normative tutoring metric.

The authors also test whether this gap is a single-judge artifact. On two quality-stratified annotated subsets—100 clean and 100 borderline dialogues—four LLM judges showed substantial agreement with human consensus: Cohen’s κ ranged from 0.786 to 0.905 on clean cases and from 0.740 to 0.872 on borderline cases. Human annotators themselves had moderate agreement, and these subsets were not representative of all dialogues.

The capability experiments provide a more qualified result. In a same-type wrong-diagnosis control, GPT-5-mini’s measured RSR was 80.8% with the wrong label versus 76.6% with the gold diagnosis (p=0.078), providing little evidence of an improvement from correct fine-grained diagnosis under the tested format. A six-condition pipeline ablation likewise found no significant remediation advantage from supplied pipeline information (p=0.263), but its equivalence tests and power analysis leave smaller effects possible.

The transferable research operation is to freeze generated interactions before comparing evaluators, then calibrate automated judges against human annotations rather than treating one metric as ground truth. The boundaries are important: simulated students do not establish real-student learning; the diagnosis result is limited to the tested diagnosis-presentation format; and the 55 educator-validated middle-school algebra misconceptions cover only a limited slice of mathematics curricula.

Read the paired scoring comparison first: it shows whether a claimed tutoring improvement survives a change in evaluator, then use the diagnosis ablation to interpret the capability null.

[abstract; §4.4, Results, Table 3; paired-test rationale in Appendix J; §4.6, Results, Table 5; sampling and rubric in Appendix H; Appendix P, Table 13 and accompanying results; §4.5; §4.5, Results, Table 4; equivalence details in Appendix K; Ethical Considerations; Limitations, diagnosis-presentation format; Limitations, domain and taxonomy](https://arxiv.org/abs/2610.31679v1)

## Latent-Coherence Audits Test Probability Composition Through Contextual Latents

*[Latent Coherence: Do Frontier Language Models' Probability Judgments Obey the Law of Total Probability?](https://arxiv.org/abs/2610.31833v1)*

Earlier supplied consistency work tested relations among related inputs—negation, paraphrase, monotonicity, and Bayes’ rule—in forecasting checks; this paper targets a different composition question: whether probabilities agree after marginalizing over a latent explanation inferred from context.

**Method.** For each item, the authors make separate single-turn calls for `P(X)`, `P(z)`, and `P(X|z)`, then compare the direct probability with `Σ_z P(z)P(X|z)`. A causal family applies the same idea to `P(y|do(x))` and the back-door adjustment. Every query has an exact ground-truth probability. For a selected subset, the same item is asked in three wordings, allowing the authors to separate persistent incoherence from rewording noise.

Across seven models, GPT-6.1 Sol and Claude Opus 5.5 had the lowest observed mean absolute residuals: 0.08 and 0.12 log-odds, respectively. The repeated-wording analysis, based on 83 latent-identity instances from 57 items, detects persistent incoherence for Haiku, Gemini, DeepSeek, and, at a smaller magnitude, GPT; the authors report that this component is mostly item-to-item spread rather than a common directional offset. Within every evaluated model, larger residuals are associated with larger direct-answer errors, with Spearman correlations from 0.40 to 0.62. The paper therefore treats the residual as a possible error flag without ground truth, while noting that part of this association is mechanically induced and is not independent validation of accuracy.

The study finds no evidence that eliciting more reasoning tokens across three rewordings of the same item improves or worsens coherence. The ordinary back-door adjustment check was nearly always passed in the small causal subset, whereas the more substantial failures concerned marginalization over an inferred latent. Using a model’s latent decomposition also did not reliably improve accuracy over its direct answer; whether it helped depended on the model and item.

**Research operation.** For a system that composes model probabilities, elicit the direct and factorized judgments separately, compute the residual, repeat selected items under controlled rewordings, and assess whether residual-based triage transfers to new items without labels. This tests both whether the diagnostic survives wording changes and whether latent decomposition is worth using operationally.

The evidence is limited: the results are a snapshot of seven API models, and the persistent-versus-noise decomposition relies on a small repeated-item subset with wide intervals. The evaluation also uses one conditioning formulation. On qualitative items, error against truth partly reflects how models translate verbal terms into numbers, while the HoVer-derived items depend on LLM-generated and LLM-audited decompositions. The residual is therefore a benchmarked association and audit signal, not a general accuracy guarantee.

Read it to borrow a repeat-wording residual audit for systems that compose probabilities, while keeping the diagnostic’s mechanical coupling and small-sample limits explicit.

[abstract](https://arxiv.org/abs/2610.31833v1) · [Section 6, Table 3 and Results, paragraph 1](https://arxiv.org/abs/2306.09983v3)

## NTBench reports higher attack success for task-related error and harm targets than for tested fixed targets

*[On Task, Off Track: Benchmarking LLM and Agent Robustness to Near-Target Prompt Injection](https://arxiv.org/abs/2610.32531v1)*

Fixed-target prompt-injection tests can miss a system that rejects an obviously off-task request but accepts an injected change that preserves most of a legitimate answer while making it incorrect or harmful. NTBench calls these near-target prompt injections and asks whether reference-guided target families reveal failures that the tested fixed-target attacks do not.

A useful distinction from LocalAlign is purpose: LocalAlign uses generated near-target adversarial examples as preference-training negatives, whereas NTBench uses reference-guided incorrect and harmful outcomes as benchmark cases. For each task, NTBench obtains a legitimate reference outcome, then uses an LLM to generate target–instruction pairs in separate tracks for incorrect and harmful outcomes. It combines LLM-based checks with human validation of the intended deviation; target validity is evaluated separately from attack success, and deviations already observed without injection are excluded.

Under ASR@3, a matched budget of three attack executions per sample, every evaluated model had higher overall ASR on both near-target tracks than on the fixed-target baseline in the pooled language-task evaluation. The reported increases were 9.3–35.8 percentage points for incorrect targets and 1.7–17.3 points for harmful targets. For Meta-SecAlign-70B, pooled ASR@3 rose from 3.2% on fixed-target attacks to 36.7% for incorrect targets and 18.4% for harmful targets.

On AgentDojo and AgentDyn, both near-target tracks likewise exceeded the fixed-target baseline for every evaluated model under the study’s respective success checks.

An immediately reusable experiment is to generate target families from legitimate references, audit whether each target really violates task criteria, and compare induced deviations with attack-free runs under a fixed attack budget. This changes evaluation from “did one malicious objective work?” to “which task violations can an injection induce?”

“Near” remains a construction prompt, not an enforced numerical radius, so the benchmark does not establish how results vary with a formal proximity scale or how well generated targets cover a neighborhood. Human majority-vote audits found most sampled retained targets valid, but not all: 91.3% of audited language-task incorrect targets and 98.0% of agentic incorrect targets were judged valid.

For tool-call targets, matching the invoked tool and key arguments does not establish downstream effects, and the agentic near-target and fixed-target rates use different success criteria. The evaluation covers seven models, ten language datasets, AgentDojo and AgentDyn, and uses no added runtime defense. Treat the result as evidence about these tested configurations rather than as a universal robustness claim.

Read it to learn how changing the attacker’s target outcome—not just the injected wording—can expose failures under a matched three-attempt budget.

[abstract; Section IV-B, S4.SS2.p1-p4; Section IV-C, S4.SS3.p1-p7; Section V-A, S5.SS1.p4-p5; Section V-B, S5.SS2.p2; Table II, S5.T2; Section V-B, S5.SS2.p2; Table II, S5.T2, Overall row; Section V-B, S5.SS2.p4; Table III, S5.T3; Section IV-B, S4.SS2.p3; Section VII, S7.p1; Section IV-C, S4.SS3.p6; Section VII, S7.p2; Section V-C, S5.SS3.p1-p2; Table IV, S5.T4; Section V-A, S5.SS1.p1-p2, p6](https://arxiv.org/abs/2610.32531v1) · [abstract](https://arxiv.org/abs/2605.01462v2)

## StateWise trains 7–8B language models to track and obey evolving constraints without an inference-time ledger

*[StateWise: Teaching Language Models to Track and Obey Evolving Constraints in Multi-Turn Dialogue](https://arxiv.org/abs/2610.33766v1)*

### What changed

Multi-turn constraint handling has two separable failure modes: active rules can stop being honored, while revoked rules can still be enacted. ReBIND had already made revoked-rule relapse executable with clause-level checkers and studied ledger-based restoration. StateWise changes the intervention: it trains a single 7–8B model to maintain a revisable constraint state and respond from it, without an inference-time ledger in the tested setup.

StateWise represents the dialogue with active constraints and tombstones for revoked rules, compiles ground-truth states, and trains two skills—dialogue-to-state summarization and state-conditioned response generation. It then self-trains on its own trajectories, retaining turns that pass an exact round-trip check against the compiled state. A preference stage forms checker-labeled pairs: reject a response that enacts a revoked rule and choose one that passes the round-trip check.

### Evidence

An inference-only diagnostic did not repair the problem: on the paper’s 240-conversation Llama-3.1-8B evaluation, asking the untrained model to write its own state reduced persistence and conversation success while increasing relapse. The key result is that tracking and obedience diverge: on Llama-3.1-8B, every supervised variant roughly doubled relapse despite almost perfect state tracking. In the primary held-out evaluation—Llama seed 1, six unseen constraint families, and 59 DPO steps—relapse fell from 0.246 under supervised self-training to 0.094, while conversation success rose from 0.290 for the backbone to 0.370 for StateWise.

The Stage III improvement over supervised self-training recurred on the second Llama seed, Qwen2.5-7B-Instruct, and the paraphrase evaluation, but the stricter success-and-relapse improvement over the backbone did not pass in every replication. Against an oracle active-only compiled-ledger baseline, StateWise had lower relapse in the reported comparisons without inference-time scaffolding; success comparisons were setting-dependent.

### Boundaries and a research operation

The tested constraint families are formatting-level and programmatically checkable, and scripted trajectories use author-written paraphrases as the phrasing-shift test; semantic constraints and naturally occurring conversations remain untested. The relapse metric excludes high-chance families, so it understates relapse on constraints that are easy to satisfy accidentally. At full interpolation, StateWise scored 6.5 points below the backbone on IFEval prompt-strict accuracy and lower on the reported English Multi-IF evaluation at every turn; interpolation reduced this breadth cost while giving back the relapse gain.

A useful experiment to carry forward is to keep state exact-match, active-constraint compliance, and revoked-rule enactment as separate metrics, then generate preference pairs specifically for the failure mode being targeted. Test that recipe on held-out phrasings and a breadth benchmark before treating state tracking as obedience.

Read it to inspect the separation between exact state tracking and behavioral obedience, then judge a checker-driven preference remedy against its measured breadth cost.

[abstract](https://arxiv.org/abs/2610.33766v1) · [abstract](https://arxiv.org/abs/2608.12599v1)

## Agent Memory’s Net Value Is a Per-Query Balance Against Raw-History RAG

*[Memory Tax: Dissecting the Net Value of Agent Memory](https://arxiv.org/abs/2610.34073v1)*

The paper targets a concrete evaluation limitation: standalone performance does not reveal whether memory rescues more queries than it harms. Across the main conversational-memory evaluation, many tested memory systems score below naive RAG, but the outcome varies by system, benchmark, and backbone.

Its operational change is to make direct retrieval from raw history the reference point rather than treating a memory system’s aggregate score as sufficient. The paper frames memory’s net value as the balance between queries memory solves that RAG misses and queries RAG solves that memory misses. Because this accounting is defined relative to the paper’s naive RAG reference, benefit and tax are reference-dependent measures, not reference-free properties of memory.

The authors then diagnose where tax can enter. In a sampled faithfulness analysis, human annotations trace 500 raw turns to corresponding memory units and identify no loss, partial loss, major loss, or no corresponding unit. The authors’ sampled human annotations identify information loss or missing memory units in several tested systems, providing evidence for a construction-side source of memory tax. A retrieval replay asks whether preserved evidence can actually be reached: the authors report that memory retrieval often needs more rounds than raw-history RAG to recover it, indicating an accessibility-related tax. Finally, the cross-backbone experiment suggests that some memory mechanisms add performance fragility beyond the variation observed for naive RAG.

For a new memory system, the transferable operation is a query-by-query 2×2 audit against a fixed raw-history RAG baseline. Report memory-only wins and RAG-only wins before relying on an aggregate score; sample RAG-only wins and classify them as construction loss, retrieval inaccessibility, or backbone sensitivity. The resulting research question is specific: what transformation creates enough memory benefit to justify the evidence it makes harder to preserve or access?

The boundary matters. The main evaluations do not establish how the findings transfer to continuously operating, multilingual agents, because the benchmarks are primarily static, offline, and English-language. The authors describe baseline selection as representative rather than exhaustive. Some evaluations use stratified subsets, including a 100-corpus subset for GPT-5.6 Luna LongMemEval-s, and the paper does not evaluate models stronger than GPT-5.6 Luna (low).

Read it to learn a concrete per-query audit that separates evidence lost during memory construction from retrieval inaccessibility and backbone sensitivity.

[abstract; Section 4.1, paragraph 2; Section 4.2, paragraph 2; Section 4.3, paragraph 2; Section 4.4, paragraph 2; Limitations](https://arxiv.org/abs/2610.34073v1)

Prepared retrospectively from the 2026-11-01 candidate papers; verified on 2026-11-03.
