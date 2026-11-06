# 2026-11-07

## PLatour Separates Cross-Model Benchmark Gains from Sender-Information Benefit

*[On the Opportunities and Challenges of Prefill-to-Autoregressive Cross-Model Transfer](https://arxiv.org/abs/2611.06976v1)*

Prefill-to-autoregressive cross-model transfer (PACT) couples a larger model’s prompt representations to a smaller model’s generation. The paper targets a concrete identification problem: a higher task score does not establish that the receiver benefited from useful sender information rather than from adaptation in a trainable bridge or receiver.

PLatour uses frozen sender and receiver backbones and trains zero-initialized linear bridges that add projected sender prompt representations to the receiver’s residual stream during prefill. The transfer excludes the final prompt token; after prefill, the receiver generates without the sender, and GRPO task reward updates only the bridges. PACT-Check then tests the trained system against uninformative sender signals, self-communication, and receiver-only training. Its PACT-Score is the gain over the strongest applicable tested control, not the raw gain over the standalone receiver.

On the tested Qwen3 generation tasks, PLatour improves over the standalone Qwen3-1.7B receiver with either sender size. With the 235B sender, its Chemistry/GSM8K/MATH500 scores are 69.29/89.35/78.2, versus 41.43/80.86/73.40 for the receiver alone; with the 8B sender they are 68.39/87.91/76.50. But the communication-specific evidence is task-dependent: the reported PACT-Scores are +3.34 percentage points on Chemistry, +0.23 on GSM8K, and −4.05 on MATH500.

That pattern is why the controls matter. The paper reports that bridge training can improve performance without an external sender; on Qwen3.5 mathematics and coding domain averages, PLatour also does not beat the compared full-parameter receiver-GRPO control. The reported comparison with Mostik is suggestive but not controlled because its training data are undisclosed and bridge scope is unclear. In addition, AIME-135 contains 55 identified overlaps with DAPO training or validation data, whereas AIME-80 excludes them.

For a new latent-collaboration system, the transferable operation is to report both benchmark gain and a sender-information contrast: remove or replace input-specific sender signals, train a receiver-only adaptation control, and compare against the strongest applicable control. A positive PACT-Score supports sender-information benefit only relative to those tested controls; it does not rule out untested explanations. The research question to carry forward is whether the result survives stronger controls across tasks, rather than whether the bridge raises accuracy once.

Read this for a concrete evaluation design showing why latent cross-model gains must be separated from adaptation learned by the bridge or receiver.

[abstract](https://arxiv.org/abs/2611.06976v1)

## Auditing policy benchmarks reveals score changes from reference and evaluator defects

*[Follow the Policy, Fail the Benchmark: Auditing and Revising Policy-Based Decision Benchmarks](https://arxiv.org/abs/2611.07042v1)*

Policy-based decision benchmarks evaluate whether systems apply written rules to financial and operational cases, but a policy-following response can be marked wrong when a benchmark misstates the required decision. This paper audits nine public benchmarks. The authors purposively select tasks with inspectable inputs, code, or scorers, then combine source tracing, program execution, input-consistency checks, and controlled tests of scoring conditions. They release BAR, a versioned collection of audit evidence and revisions for reevaluation.

Methodologically, the paper separates a benchmark change from a model change. In fixed-response rescoring, it corrects a reference or evaluator while retaining saved responses. In the OpenExempt experiment, it amends task assumptions, varies supplied intermediate amounts, and generates one new response per model, case, and condition. That distinction keeps the two kinds of score change analytically separate.

The clearest fixed-response result is in RuleArena Tax: the reference program omits a required zero floor. Replaying all 300 cases while restoring only that floor changes 27 references; rescoring the same official-interface responses changes acceptance from 209 to 224 for Haiku 5.5, 241 to 261 for GPT6 Luna, and 195 to 220 for Gemma 4 31B. ConditionalQA exposes a different failure: its official evaluator excludes questions with missing prediction IDs from the aggregate denominator. Full-coverage rescoring lowers Luna from 52.34% to 47.93% and Gemma from 58.02% to 47.23%, while Haiku remains at 58.63%; this measures submission coverage under the specified interface, not worsened per-answer quality.

In the amended OpenExempt task, revising supplied exemption amounts improves acceptance for Haiku and Luna and reduces it by one case for Gemma; omitting the amounts yields 69/69 accepted responses for each model in the retained single generations. A strict PolicyGuardBench split also contains conflicting labels for identical complete visible inputs, producing a 61-case consistency bound—but not an identification of erroneous labels or a model-performance measure.

For a researcher, the reusable operation is to audit the decision contract in layers: verify visible policy and case facts, replay reference computation, probe evaluator boundary conditions, and keep fixed-output rescoring separate from regenerated-answer experiments. Treat the conclusions narrowly: selected cases do not establish benchmark-wide defect prevalence; semantic review was model-assisted without independent domain-expert adjudication; and the score experiments used three models without tools and one retained response per input and condition. The OpenExempt result concerns an amended, fully stipulated task, not a complete repair or adjudication of native records.

Read it to learn how to distinguish a grader-induced score change from a model-induced change by replaying references and holding outputs fixed.

[abstract; Section 2.1; Appendix A.2; Section 3.1; Section 4.1, Table 1; Appendix B.1.1; Appendix C.2; Section 3.3; Section 4.1, Table 2; Appendix B.5.1, Table 8; Appendix C.4, Table 11; Section 4.2, Table 3; Appendix C.5, Tables 12 and paragraphs 1–2; Section 3.4, paragraph 4; Appendix B.7, Table 9; Limitations, paragraph 1; Appendix A.3, paragraph 1; Limitations, paragraph 2; Limitations, paragraph 2; Appendix C.5, paragraph 1](https://arxiv.org/abs/2611.07042v1)

## Full-scale Video-MME audit reports no tested frame selector significantly beating uniform sampling

*[Where Do Reported Long-Video QA Gains Come From? A Controlled Audit of Frame Selection, Evidence Injection, and Expert Routing](https://arxiv.org/abs/2611.07329v1)*

The paper isolates a concrete attribution problem: a reported long-video QA gain may mix three interventions—frame selection, non-visual evidence injection, and answering-model routing. VideoRouteAudit holds the backbone, frame budget, decoding, prompt, and grader fixed while varying one decision at a time. This turns a compound system comparison into a controlled audit of which decision accounts for the measured change.

On the full Video-MME long bucket (n=900, K=8), no tested selection rule significantly outperformed uniform sampling. The largest selection-only estimate was +1.9 points, with a 95% confidence interval of [-1.2,+5.0]; the cascade estimate was +1.2 points, with an interval of [-1.7,+4.1]. The cascade met the study’s ±5-point equivalence margin, but not its tighter ±3-point margin. The result therefore narrows the claim supported by this experiment: it does not show that frame selection never matters, only that these tested contrasts were small under this protocol.

Measurement scale was decisive. At the n=200 subset scale, three of four contrasts were up to 3.8 times larger, one reversed sign, and resampled 200-item subsets reversed the full-bucket effect’s sign in 35.8% of draws. For a new audit, the transferable operation is to use the largest feasible evaluation set, compare paired predictions under a one-change-at-a-time design, and report confidence intervals alongside a predeclared equivalence or minimum-effect margin.

The protocol checks also change how earlier evidence should be read. The original anomaly-domain “+ASR” arms injected no text, so their pooled +4.7-point gain was selection plus a development prefix. When transcripts were actually added after the question, accuracy fell by 10.0 points on XD-Violence and 13.0 points on UCF-Crime. On Video-MME long, putting the ASR block before the question improved accuracy by 4.4 points over no-text uniform sampling, but the placement comparison was post hoc and unadjusted. Swapping the answering model produced +15.1 points on MUSIC-AVQA and +33.3 points on its worst type; silencing the expert’s soundtrack retained 92% of the gain, indicating that the contrast was mostly a model swap.

The boundaries are important. The audit cannot determine whether near-equivalent selection performance reflects uniform sampling already providing sufficient evidence or the VLM failing to exploit better-selected frames. Generalization beyond the evaluated datasets, models, and frame budgets is untested. The expert comparison is also not an audio-only estimate: the models differ in more than audio access, and the soundtrack controls cover only one expert and a type-stratified subset.

Read this as a practical template for attributing gains in compound AI systems: hold the protocol fixed, verify that the intervention actually occurred, and treat small-sample improvements as uncertain until they survive larger paired evaluation.

[abstract; Section 4.2; Table 1; Appendix H; Section 5](https://arxiv.org/abs/2611.07329v1)

## Terminal-Bench Repairs Change Agent Scores, While Time Budgets Change the Measurement

*[Benchmarks as Software: Terminal-Bench and the Case for Continuous Benchmarks](https://arxiv.org/abs/2611.08417v1)*

### The limitation
A released coding-agent benchmark can accumulate maintenance debt: as models improve, valid solutions may be rejected by existing verifiers, while changes to evaluation infrastructure can invalidate assumptions embedded in tasks and tests. The resulting score can drift away from the capability the benchmark is intended to measure.

### The method change
Instead of treating release as the end of validation, the paper treats the benchmark as maintained software. Its continuous-validation workflow combines community reports, task artifacts, prior agent traces, automated oracle checks, agent-based auditing, and human-gated repairs. The workflow separates proposing a defect from accepting a repair: auditors label likely problems and suggest fixes, verification challenges those judgments and checks the proposed change, and maintainers decide what enters the next release.

Applied to Terminal-Bench 2.0's 89 tasks, the audit surfaced defects requiring repair in 28 tasks. The categories overlap, including instruction–verification mismatches, task drift, and environment issues. The resulting repairs were released as Terminal-Bench 2.1. The workflow's 57.1% precision and 71.4% recall against that repair set are retrospective measurements, because the workflow helped construct the released set; they are not independent estimates of defect-discovery performance.

### Decisive measurement effects
The authors reran 19 agents on both benchmark versions. Agent rankings remained highly correlated, with Spearman rho = 0.958, but individual scores shifted by up to 12 percentage points and nearby leaderboard positions moved by as many as three ranks. Thus, aggregate ranking stability does not guarantee that close model comparisons are unchanged.

Resource policy was another measurement variable. Under the default time budget, more than half of failed trials ended in timeout in the reported decomposition, although the fraction varied by harness. The paper's abstract gives concrete scaling examples: extending the time limit closed a 20-point harness gap on GPT 5.4 and reduced a 30-point gap on GPT 5.4 mini to 5 points. The decomposition filters upstream infrastructure failures, so a fixed-time score can mix task-solving ability with execution speed.

### Boundary and research operation
Agreement among auditors is evidence of consistency, not correctness; lower-cost auditors were less consistent, especially for task-drift attribution. A small transfer check on 34 Harbor-Index tasks also found defects that the workflow missed. These results argue against fully automatic validation.

For a new agent benchmark, borrow the operational loop rather than only the headline metric: retain task artifacts and traces, make repairs versioned and maintainer-gated, rerun a fixed agent panel after repairs, and report sensitivity to time budgets. The paper's evidence supports treating task validity and resource settings as separate parts of the evaluation specification—not assuming that a stable leaderboard alone establishes a stable measurement.

Read this if you report coding-agent scores: it provides a concrete audit-and-repair loop, then tests whether repaired tasks and wall-clock limits change scores, harness gaps, and leaderboard comparisons.

[abstract](https://arxiv.org/abs/2611.08417v1)

## Refined Reproduction Handoffs Raise Fresh-Session Success, but Workflow and Format Effects Remain Bundled

*[ReproBridge: Building Reproducibility into ML Research Artifacts](https://arxiv.org/abs/2611.08452v1)*

CORE-Bench's Hard condition supplied only a README, requiring an agent to install dependencies and choose a reproduction command. Its failure analysis identified dependency installation and version resolution, together with retrieval from multiple output files, as recurring obstacles on the hardest tasks.

ReproBridge packages the recovered procedure into refined code, environment setup, experiment launchers, and a reproduction guide or change record for downstream reuse. Its main comparison bundles upstream investigation, repair, review, and packaging with the resulting handoff, so it does not isolate the effect of standardized documentation or handoff format.

ReproBridge-Bench contains 1,463 curated tasks from 36 papers, while 1,029 tasks from 387 experiments were retained for downstream evaluation after reference verification; each retained task has five human-verified reference observations. In the main test, fresh sessions receive either raw code or a refined artifact. Success requires a numerical match to a fixed 95% compatibility interval and no confirmed execution-integrity violation from the primary Auditor.

Across four evaluated models, refined artifacts increased mean reproduction success from 76.4% to 92.6%, and every model improved. Downstream API spending fell by 16.8%–23.7%, with the savings varying by model and excluding artifact construction, auditing, and GPU costs. In a one-model ablation on a 12-paper subset, removing any of the four components reduced success; the largest measured drops followed removal of refined code or environment setup.

The result is not a full-fidelity certificate. Against human review of 818 outcomes from eight papers, the automated audit had 79.5% recall and missed 8 of 39 invalid outcomes. There were also 136 raw-success-to-refined-failure task–model reversals, including 84 numerical mismatches, concentrated in a few papers. The evaluation is therefore limited to its retained tasks, fixed reference regions, tested agents, and audit procedure rather than ML reproduction in general.

For a follow-up study, hold the repaired code and measurements fixed while independently varying the construction workflow and the handoff format. Then measure fresh-session success, audit misses, and total cost—including construction, GPU, maintenance, and human review—rather than treating downstream API savings as end-to-end savings.

Read it for a concrete design pattern for making recovered dependencies, repairs, launch commands, and measurements reusable across agent handoffs, together with an evaluation that exposes audit and total-cost limits.

[Section 2.1; Table 3; Section 4.6, Agents struggle to retrieve results from many files and often time out while installing dependencies](https://arxiv.org/abs/2409.11363v2) · [abstract; §2.2; Table 1; §4.1–4.2; Table 3; §4.2; Table 3; Appendix E; §4.5; Table 6; Appendix D.4; §6.3; §6.3; §4.6; Table 12; §4.4; Appendix D.3, Table 17; §6.3; §4.7; Appendix E](https://arxiv.org/abs/2611.08452v1)
