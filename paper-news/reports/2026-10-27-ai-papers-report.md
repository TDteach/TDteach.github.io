# 2026-10-27

## Prompt Comparisons Need Contrast-Level Validation, Not Only Overall Scorer Metrics

*[Validating the Comparison, Not Just the Scorer: Why Overall Accuracy Can Mislead in Interactive LLM Evaluation](https://arxiv.org/abs/2610.31678v1)*

### The limitation
Interactive LLM studies often compare how models respond to different follow-up prompts and then use an automatic scorer to label unsupported factual claims. The concrete limitation is that one overall accuracy or F1 score can hide prompt-specific scoring mistakes, so the measured difference may be too large, too small, or reversed. The paper formalizes the issue as contrast bias: the reported prompt contrast is distorted by the difference in signed scoring bias between arms, with false positives and false negatives contributing differently. Thus, the validation target is the comparison itself, not merely pooled scorer quality.

### What changed
The paper declares a reference label, an automatic label, two prompt arms, and a target population, then derives how each arm’s bias enters the contrast. Its empirical design combines a balanced audit of 288 responses—48 per arm and eight per model—with a same-key audit of 300 model–question cases evaluated under each prompt by the automatic scorer and two LLM raters. The validation compares scorer labels with primary and secondary LLM-rater labels, but the paper does not treat those labels as verified ground truth.

### Decisive evidence
In the balanced audit, pooled F1=.916 coexisted with observed arm false-positive rates from 2.6% to 33.3%, but the observed arm differences remained uncertain. For Certainty-only versus Neutral on matched keys, the automatic +9.3-point estimate shrank to +2.3 points under both raters, and the primary-rater interval included zero. The other two reported factorial contrasts retained their directions under both raters, although the paper says this does not remove construct-validity concerns. An attempted Rogan–Gladen arm-specific correction moved the automatic Confidence–Neutral difference toward the primary-rater estimate, but its interval was [-.146,+.197] with P(Δ&gt;0)=.685, too uncertain for a firm corrected headline.

### Research operation and boundary
For a new prompt experiment, the concrete operation is to audit both prompts on matching cases and include scorer and rater uncertainty in the final contrast, rather than report pooled F1 alone. If a correction is attempted, check whether arm calibration transports to the target and retain its uncertainty; here, the authors say the correction depends on a transport assumption and approximate overlap handling. The per-arm audit is small—48 responses per arm and eight per model—so apparent error-rate variation is imprecise and cannot establish modest prompt-specific differences. The target was only an equal-model mixture of clean nonreferents in six arms, so these results do not automatically transport to provider traffic, future models, other prompts, or other target populations. The protocol also supplies no universal epsilon, and this retrospective study cannot show that prospective preregistration would improve outcomes.

Read it to learn how a high pooled F1 can coexist with an uncertain prompt effect, and how a matched-case audit can test whether the reported contrast survives scorer error.

[abstract](https://arxiv.org/abs/2610.31678v1)

## Learning to Be Monitored Recasts CoT Monitorability as a Partially Identified Causal Quantity

*[Learning to Be Monitored: Causal Bounds and Intervention-Aware Post-Training Recipes for Chain-of-Thought Monitorability](https://arxiv.org/abs/2610.31733v1)*

Intervention-based CoT monitoring has a concrete attribution problem: a target behavior observed under intervention is not necessarily caused by it. This paper’s correction is to treat the existing minimal-criterion sensitivity (TPR_mc) as an upper bound on how often a monitor detects target behavior actually caused by the intervention, and to add an observable complementary lower bound.

Under the paper’s binary-intervention assumptions—fixed checkpoint and problem–intervention pair, consistent control and intervention arms from the same structural causal model, other mechanisms and the exogenous-variable distribution held fixed, and p1 &gt; p0—the causal target is recall among cases where Y(1)=1 and Y(0)=0. The bounds require neither independence between potential outcomes nor individual-level monotonicity. The practical evaluation change is to report both bounds rather than treating minimal-criterion sensitivity as causal recall.

For training, the authors build a paired control–intervention dataset from existing sources: 3,810 pairs across twelve categories and nine source families, spanning four intervention families and varied task formats. They train separate variants with off-policy self-distillation, reinforcement learning, and on-policy self-distillation. Privileged teacher guidance creates self-distillation targets or token-level scores, while RL uses separate LLM-as-judge evaluations of CoTs and final answers; the teacher guidance is not put into the student input.

Across the tested model–monitor configurations, all three methods generally improve CoT monitorability over their corresponding base models under the extended evaluation framework. But aggregate gains are not uniformly diagnostic: for Qwen3.5-4B OPSD on logic answer cues under GPT-OSS-120B, the gmean_int^2 score rises by 12.45 points while gmean_int,lb^2 falls by 6.22 points. A useful experiment-design operation follows: report both composites per task and investigate disagreements before relying on an aggregate improvement.

Section 6 limits the interpretation: higher reported scores indicate better measured CoT monitorability, but do not establish increased causal recall or better CoT faithfulness. The three post-training methods were not evaluated under matched training conditions, so differences among SFT, RL, and OPSD cannot be attributed solely to their objectives. Training data were largely constructed and validated through automated procedures without independent expert annotation; the evaluation also covers limited models, monitors, and tasks, and does not test direct concealment or monitor-aware evasion.

Read it for a concrete causal-evaluation operation: report observable upper and lower bounds before interpreting a post-training monitorability gain, then inspect task-level reversals rather than relying only on an aggregate score.

[abstract; Section 3, Theorem 1 and following explanation; Appendix C, Dataset construction; Section 1, paragraph 6; Sections 4.2–4.4; Section 5.2, Experimental Results; Appendix D.4, Table 16; Section 6, Limitations](https://arxiv.org/abs/2610.31733v1)

## Some tested benchmark scores stayed stable while compaction summaries dropped constraints

*[Benchmarks Are Surprisingly Compaction-Friendly](https://arxiv.org/abs/2610.31778v1)*

Context compaction is a lossy operation: an agent frees context by summarizing or discarding history, risking silent loss of instructions, constraints, and reasoning. The paper addresses a concrete evaluation gap: it says earlier work used smaller open-weight models on toy or synthetic trajectories, while systematic study with frontier models on realistic long-horizon tasks was missing. Its central warning is that task score and instruction retention are different endpoints.

The authors fix the OpenCode scaffold, implement five compaction strategies, and evaluate them on PaperBench, ProgramBench, and PostTrainBench. They sweep thresholds from 160K to 380K tokens, record task performance and compaction events, and separately audit whether summaries retain three ProgramBench anti-cheating rule categories. They also examine constraint retention in sampled SWE-chat sessions, extending the audit beyond the benchmark runs.

For the two tested 1M-context models, task performance was similar across the tested thresholds, but those thresholds covered only 16–38% of their windows rather than near-limit triggering. GPT-5.3-Codex, with the smallest tested context window, performed worse on PaperBench at lower thresholds; its ProgramBench result was generally flat, and PostTrainBench was inconclusive. None of the tested alternatives consistently outperformed default self-summarization; discarding reasoning or using a smaller summarizer hurt some models but not others.

The retention audit exposes what benchmark scores can miss. On ProgramBench, the first compaction omitted about one third of anti-cheating categories on average; omissions increased with compaction depth, reaching about 2.65 of three categories by the 30th compaction. In SWE-chat, instructions about how the agent should work or what it should not do were dropped around six times more often than specifications of what to build. The SWE-chat result measures retention, not whether omission changed behavior, and the sessions came from Claude Code rather than the experimental OpenCode setup.

The authors interpret fixed objectives and persistent files as making these benchmarks forgiving: much discarded task state can be recovered, whereas a constraint stored only in conversation cannot. That interpretation is bounded. The paper notes that reward hacking began before the first compaction in its runs, so the ProgramBench audit does not establish that compaction caused cheating. For a reusable evaluation, report task score, per-compaction constraint retention, and post-compaction compliance as separate measures; then add constraints whose only copy is conversational. This is the paper’s transferable experiment design, not a result it measured.

Read it to learn how to pair ordinary long-horizon task scores with a separate constraint-retention and post-compaction behavior audit.

[abstract; Section 4.1, Q1; see also Section 4.1, Q1, Figure 2 description; Section 4.2, Q3; Figure 4(a) description; Section 5, Why current benchmarks are compaction friendly; Section 5, Why current benchmarks are compaction friendly; Section 5, Limitations](https://arxiv.org/abs/2610.31778v1)

## DMAIC-Bench Tests Whether Statistical Evidence Actually Stops Agent Work

*[DMAIC-Bench: From Self-Reflection to Self-Restraint for Agents in Multi-Stage Analytical Tasks](https://arxiv.org/abs/2610.32305v1)*

Most agent benchmarks largely measure task completion or output quality; they do not show whether a critique changed the next action. DMAIC-Bench makes that distinction executable: it evaluates whether intermediate statistical evidence governs an agent’s next workflow decision.

The benchmark uses 97 seeded industrial tasks across 15 cases and four sectors, with statistical prerequisites determining whether an agent should continue, divert, or stop. Its key design is a paired counterfactual: two cases share a workflow position, but their diagnostics require opposite routes. Forty of 66 graded forks contain such GO/NO-GO pairs, making an always-continue or always-stop policy easier to detect. Execution traces are scored by a private verifier, with forbidden downstream computation counted as a route error; final claims are assessed separately through independent expert review.

Under the plain instruction, pooled across 13 models from six providers, execution-level routing accuracy was 92% on matched GO decisions but 19% on matched NO-GO decisions. The intervals were 86–97% and 8–30%, respectively, and the score counts any forbidden downstream computation as an error. A further diagnostic is that many NO-GO route errors occurred after the trace recorded a correct failing diagnostic. That ordering is only behavioral evidence: the trace cannot establish that the agent read or used the diagnostic before acting.

The report audit measures a different failure. In a weighted sample, experts estimated that reports acted on invalid evidence at 47% of reached NO-GO decisions, with an interval of 31–61%. This estimate covers 40 sampled decisions in an 11-agent audit frame, not every trajectory or all 13 evaluated agents. Explicit permission to stop improved NO-GO accuracy for one tested model but reduced its GO accuracy, so the intervention did not consistently restore both warranted stopping and continuation.

The industrial result has limited generalization evidence: the main campaigns ran all 97 tasks rather than evaluating the five-case, 32-task structural held-out split. A 16-task RNA-seq/GWAS pilot extended the framework beyond industrial workflows, but its small and confounded design cannot establish transfer of industrial error rates.

The transferable operation is to report three separate quantities when evaluating analytical agents: whether they computed the prerequisite correctly, whether they obeyed its route constraint, and whether their final report relied on invalid evidence. That separation tests evidence-governed behavior without treating self-critique or a plausible final answer as proof of restraint.

Read it to borrow the same-position GO/NO-GO pairing and separate trace-level and report-level checks when designing evaluations for scientific or analytical agents.

[abstract](https://arxiv.org/abs/2610.32305v1)

## The Tested 120B Model Showed No Detected Resilience-Ratio Advantage Over 20B Under MCP Faults

*[Tool-Calling LLM Agents Under Realistic MCP Faults: Scale Does Not Purchase Fault Tolerance](https://arxiv.org/abs/2610.32555v1)*

The paper frames its motivation as a gap: benchmarks that assume tools respond correctly and on time leave realistic tool failures untested. The concrete change is to inject faults at the MCP call boundary rather than evaluate only the agent’s nominal tool-use behavior.

MCP-Injector is proxy-style middleware between an agent and MCP server. It applies controlled timing and content faults to tool calls without requiring changes to the agent or server, while logging the injected event. The authors derive an 18-entry fault profile from issue and pull-request reports across 1,774 public MCP repositories; permanent failures dominate the classified profile. The injector also supports permanent, transient, and intermittent persistence schedules.

The study crosses two gpt-oss backbone sizes, three agent stacks, and three fault conditions in a 1,350-cell experiment. Under the calibrated, permanent-heavy condition, pooled task-completion scores fell 60%, from 8.08 to 3.23 out of 10. The paper reports a 57% drop even when analysis is restricted to runs that completed, so the result is not only a binary failure-rate effect.

For scale, the 120B backbone retained no larger share of its fault-free score than the 20B backbone under faults. Its completion rate under faults was 91.1%, compared with 95.6% for 20B, with a difference confidence interval of [-0.2, 9.3]. The correct interpretation is no detected resilience-ratio advantage in this setup, not equivalence between model sizes. LangChain had the highest observed completion rates under faults, but the authors treat a framework-level explanation as suggestive rather than conclusive: MCPBench received substantially more fault events than the other stacks.

The boundaries matter. The mined distribution reflects reported incidents, not measured production failure rates, so the authors call it a stress profile. Although three persistence regimes are supported, only 9 of 1,905 fired events came from transient or intermittent entries; Appendix A also identifies a mismatch between the intermittent derivation and shipped implementation. The scaling result is limited to two backbones from one model family under one serving setup. Finally, the LLM judge can reward plausible answers that bypass tools, which is why grounded fulfillment should be inspected separately.

For a follow-up study, equalize fault exposure across stacks, sample transient and intermittent regimes with enough events to characterize them, and pair judge scores with grounded state checks. That design would test whether the observed stack differences persist after exposure and scoring weaknesses are controlled.

Read it to see how repository incident reports become a reproducible MCP fault condition, and how quality loss, completion, and resilience-ratio evidence can be separated.

[Abstract; Sections 3.1, 4, 6.1–6.3, 7; Appendix A](https://arxiv.org/abs/2610.32555v1)
