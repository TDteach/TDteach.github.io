# 2026-11-04

## Randomized Group Scoring Reduces Self-Evaluation Variance but Leaves Ranking Bias

*[On the Limits of Test-Time Compute for Self-Evaluation](https://arxiv.org/abs/2611.00350v1)*

## The problem
The paper starts from a concrete failure mode: increasing the number of candidates does not consistently narrow the gap between final-answer accuracy and pass@N. It models self-evaluation as pairwise ranking rather than treating selection accuracy as a direct function of candidate count. Its ranking loss counts correct–incorrect pairs in which the incorrect candidate is ranked above the correct one. The resulting bias–variance decomposition separates persistent misranking from stochastic inconsistency.

## The method change
Scorpio’s method change is to jointly score randomly grouped candidates. The paper applies this scorer to verification, tree search, and aggregation; in tree search, Scorpio scores partial solutions and selects the final answer. This changes the comparison context used by the evaluator, while the paper also studies how repeated scoring affects ranking error.

## Decisive evidence
Under the reported verification settings—candidate pools of N=128, group size K=4, and inference cost including candidate generation and verification—Scorpio improved peak accuracy over the strongest baseline by 2–7 percentage points on HMMT and Reasoning Gym games, or matched or exceeded that baseline’s peak accuracy with 17–41% lower inference cost. On LCBv6, the methods had similar peak accuracy, while GPT-OSS-20B with Scorpio matched the strongest baseline at 18% lower cost. The abstract also reports up to 10 percentage points of improvement for tree search and an 11-percentage-point improvement in aggregation scaling on coding tasks.

## Boundary and research use
Across the experiments, additional compute reduces variance, while bias initially decreases before approaching a plateau. This means repeated scoring can stabilize an incorrect ordering without correcting the systematic error that produced it. The paper explicitly reports that Scorpio does not eliminate ranking bias or close the gap between selection accuracy and pass@N. Group size is also a tradeoff rather than a monotonic improvement: on LCBv6, increasing the group size to K=8 raised bias, potentially because comparing more candidates in one context is harder.

For a replication, hold the candidate pool fixed and sweep scoring repetitions and group size separately. Report selected accuracy, pass@N, inference cost, and the bias and variance components together. The useful research question is not simply whether more test-time compute helps, but whether each added call reduces variance or attacks the evaluator’s systematic errors.

Read it to learn a concrete diagnostic for deciding whether extra verifier calls reduce ranking variance or merely repeat systematic errors, then test randomized group scoring under explicit cost and group-size sweeps.

[abstract; §4, S4.p4; §5.1, S5.SS1.p2; Appendix A, Limitations; §5.1, S5.SS1.p5](https://arxiv.org/abs/2611.00350v1)

## CoT oversight requires separate evidence for faithfulness, monitorability, and localization

*[Chain-of-Thought Oversight Requires Separate Evidence for Faithfulness and Monitorability](https://arxiv.org/abs/2611.01620v1)*

### The inference problem

A readable or decodable chain-of-thought (CoT) is only one observation in an oversight chain. The paper separates reasoning visibility, mechanistic faithfulness, mechanistic localizability, and behavioral monitorability, because evidence for one does not establish the others.

That separation targets a concrete inferential limitation: a probe can recover stated reasoning content, and an intervention can affect outputs, without proving that the trace faithfully reports the computation or that the intervention selectively controls the named step. The method change is a claim-licensing report: for each conclusion, researchers specify the target property, access tier, artifact, and whether each required evidential link is supported, unsupported, or assumed.

The security case makes the distinction operational. On DeepSeek-14B, probes trained while the model reread its own reasoning achieved mean cross-validated AUCs between 0.84 and 0.98, but their labels represented the presence of reasoning-step content rather than correctness. Ablating a decoded vulnerability-identification direction changed verdicts in 15 of 59 cases; the authors treat this as causal evidence relevant to faithfulness, not as proof of selective control or full trace faithfulness. The decisive behavioral test was weaker: a reference-assisted LLM jury did not reliably judge held-out security-analysis correctness and remained below the majority-class baseline for all three tested models. This result concerns the tested monitor and evaluation, not every possible monitor.

The authority-hint case reverses the pattern. A monitor correctly classified all 22 evaluated cases, but the final answer alone achieved the same result; the cases had been selected using patching criteria, so the result does not establish incremental value from the trace or performance on the full question distribution. Seven tested localization procedures did not isolate a compact intervention target. That failure leaves localization unresolved: it does not show that no mechanism exists or that the traces are unfaithful.

A practical research operation suggested by this framework is to write one licensing line before each experiment: name the target property, access tier, artifact, and status of every required link. Then ask separate questions: does a monitor beat a majority and answer-only baseline on held-out cases; does an intervention selectively control the named step; and does a localization result survive stronger measurement and held-out tests? The paper’s cases do not prove that the four properties are fully independent, and they do not establish that authority-hint traces are mechanistically unfaithful.

Read this to learn how to turn a probe, intervention, or monitor score into a claim-by-claim evidence table without upgrading it into a faithfulness claim.

[abstract; abstract; §3.1, Recoverability versus faithfulness; abstract; §3.1, Causal evidence for faithfulness; Appendix A.2, Intervention and scoring; abstract; §3.2, Held-out monitorability test; abstract; Appendix B.1, Case selection and monitor evaluation; abstract; §4.1, Mechanistic localization attempts; Appendix B.2, Patching protocols and interpretation; abstract; §5, Proposed reporting and licensing standard; abstract; §7 Conclusion](https://arxiv.org/abs/2611.01620v1)

## Terminal-task synthesis can add work without adding sequential depth

*[Is Your Long-Horizon Benchmark Really Deep? Measuring and Synthesizing Depth in Terminal Tasks](https://arxiv.org/abs/2611.01927v1)*

Long-horizon terminal tasks are used to evaluate and train agents, but this paper identifies a measurement trap: synthesis methods usually treat model turn count as task length and LLM-set labels as difficulty, even though turn count largely reflects model habits and labels barely track how often models pass.

Instead, the authors separate work—the number of operations required when the initial environment is known—from depth, the number of turns that must occur in sequence because each turn's commands can be chosen only after reading the previous output. They estimate work with non-blank, non-comment lines in a reference solution; the authors note that line count depends on coding style. Depth is estimated as the smallest stated turn cap under which the task passes.

DEPTH changes synthesis itself: a generation agent writes one segment at a time in a real software environment, executes that segment before writing the next, and starts the next segment from the state it left behind. The audit covered 734 tasks from six existing datasets. Among solved synthetic tasks, 94% passed within three turns. Yet estimated depth, unlike turn count, was associated with lower public pass rates beyond estimated work: in the reported solved TB2/TW sample, its association with public pass rates remained negative after controlling for W (rank partial correlation −0.31; TB2 alone, −0.49).

The resulting 105 DEPTH tasks exceeded every audited dataset in both measured depth and work, while none of six evaluated models passed half of them. A limited transfer result is also reported: fine-tuning Qwen3-8B on runs from generated tasks raised pass@1 from 2.6% to 4.9% on Terminal-Bench 2.1 and from 3.4% to 9.1% on OpenThoughts-TBLite, with three evaluation runs per task.

The key boundary is that D is an estimate, not an intrinsic lower bound: it depends on evaluated models, harness, and initial environment state. The audit distributions are conditional on tasks solved by DeepSeek-V4.1-Flash and exclude tasks without an estimate; work also remains a coding-style-sensitive proxy. The fine-tuning result covers one model and two benchmarks, so it does not establish broad transfer or identify which training-data property caused the gains.

For a researcher, the transferable operation is to report W and D separately, then re-estimate D under alternate solvers, harnesses, and initial states. A matched-W comparison across those estimates would test whether the ranking is robust or merely protocol-dependent.

Read this to learn how to audit whether a terminal benchmark requires sequential observation rather than merely many commands, and how to turn that distinction into a synthesis experiment.

[abstract](https://arxiv.org/abs/2611.01927v1)

## LEDGER Tests Whether Retrieval Logs Determine Individual Memory Values

*[Top-$k$ Retrieval Leaves Memory Value Undetermined](https://arxiv.org/abs/2611.03289v1)*

### Why this paper is useful
Read this before using retrieval logs for per-memory retention or deletion: the paper turns attribution into a design-level identifiability test and measures the accuracy trade-off of changing retrieval.

### The limitation
Under its d-additive outcome model, the paper’s theorem says fixed-size retrieval leaves every individual memory value unidentified, regardless of the number of logged episodes. At d=1, identifiability can be checked before using outcomes: individual retrieval frequencies and pairwise co-retrieval counts supply the relevant test. In an audit of 14 benchmarks and 55 benchmark-and-retrieval-size configurations, none determined an individual memory value; the authors attribute this to fixed retrieval sizes within blocks, often combined with private stores.

### What changes
LEDGER tests the design matrix’s kernel before fitting. It estimates only determined Shapley values, attaches confidence intervals, reports other values as undetermined, and merges memories with identical retrieval histories without claiming an unsupported individual split. For future logs, it varies retrieval sizes and combines relevant candidates with less-retrieved memories. The stated interval guarantee is conditional on mean-zero conditionally sub-Gaussian noise, exogeneity, and retrieved sets that do not depend on past outcomes.

### Evidence and boundary
The practical result is a trade-off. On pooled HotpotQA, across 300 questions and 24 passes, LEDGER increased the determined-memory fraction from 0.001 to 0.797 versus deterministic top-k, while accuracy on 1,600 held-out questions fell by 2.6 points (95% interval [-4.2,-0.9]). This direction did not transfer uniformly: the paper reports a 2.7-point accuracy improvement on LoCoMo, while the 0.8-point LongMemEval difference was uncertain. A preregistered label-free query-time gate also failed to reproduce the oracle accuracy result, leaving the low-cost deployment strategy unresolved.

### Transferable operation
For a memory system, log the retrieved set—not only the outcome—and run the identifiability test before assigning per-memory credit. If a value is not determined, abstain or report the identifiable group rather than claiming an unsupported split. Then treat retrieval as experimental design: vary set size and co-retrieval structure, and evaluate both how many values become determined and what accuracy is displaced. The open research question is whether query-aware designs can improve identifiability without reproducing HotpotQA’s measured accuracy cost.

Read this before using retrieval logs for per-memory retention or deletion: it provides a concrete identifiability test and shows that making more values measurable can impose a benchmark-dependent accuracy cost.

[§3, Theorem 1; proof in Appendix B.2; §3, What a log cannot see; Lemma B.1 in Appendix B.1; §5.2 and Table 2; Appendix E.1–E.2; §4, Estimation; Proposition 3; Appendix C.1; §5.3; Table 6 in Appendix F.1; §5.3; Table 7 and Appendix F.2; Appendix F.3; Appendix G.1–G.2, Table 13](https://arxiv.org/abs/2611.03289v1)

## In tested pretraining, sphere optimization beats larger hard row-orthogonality blocks

*[Do Orthogonality Constraints Help Language-Model Training Beyond Sphere Optimization?](https://arxiv.org/abs/2611.00593v1)*

### The control that changes the conclusion

The paper starts from reported benefits of orthogonality constraints in LLM fine-tuning and asks whether they also help decoder-only LLM pre-training. It examines fourteen variants across 360M–3.1B-parameter models trained on nearly 200B tokens. The attribution test is the block-size ladder: per-row gains and norm treatment remain fixed while increasing the block size adds within-block row-angle constraints. At `d=1`, the method is sphere optimization—each row direction lies on its own unit sphere—whereas `d&gt;1` adds row orthogonality within blocks.

The decisive comparison is unfavorable to larger blocks. In the matched 360M per-row-gain ladder, using C4 validation loss and three paired seeds at each of the 2×, 4×, and 7.69× token budgets, `d=32` worsens loss at every budget and on every seed; `d=8` shows mixed or small differences with no resolved improvement. The `d=1` control itself improves on tuned Muon in the tested pretraining runs, although the paper reports that this gain depends on the optimizer and parameterization.

There is one placement-specific exception rather than a reversal. Query/key SPD factors with block size 64 help the smallest tested model, but their mean gain declines with longer training and larger model size; the 3.1B comparison is within the reported paired uncertainty. In the tested diffusion-transformer setup, sphere optimization likewise improves FID over the corresponding Adam and Muon baselines, while 64-row query/key blocks do not improve on `d=1`. After fine-tuning, no tested `d&gt;1` or query/key configuration beats its matched `d=1` control, but the reported intervals cannot rule out smaller downstream effects.

The paper also audits selected prior gains. In its POET experiments, the short-run advantage over AdamW depends strongly on baseline precision and does not persist in a separate longer-training comparison, so the result cannot be attributed to orthogonality alone.

For an optimizer experiment, the transferable operation is to hold magnitude treatment fixed, sweep the granularity of the added geometric constraint, and compare paired seeds across training horizons before naming that constraint the cause of an improvement. The conclusion here remains bounded: the main evidence concerns hard constraints and tested reparameterizations, fixed contiguous row blocks, and C4 validation loss; soft orthogonality penalties, learned groupings, and all evaluation objectives are not established. Most core pretraining cells use three seeds, but the longest 360M run uses one, and some large-block SPD results have fewer than three converged seeds.

Read it to learn a concrete attribution design: preserve row-magnitude treatment, vary only the added orthogonality constraint, and test whether an apparent gain survives changes in precision, optimizer realization, and training horizon.

[abstract; Section 3.2, Block size; Appendix F, Paired intervals and dispersion; Table 11; Section 4.4, Row mixing in queries and keys helps only small models; Table 3; Appendix Q, Table 40; Section 4.6, Scope across scale, data, modality, and fine-tuning; Appendix T, Tables 45–46; Appendix U, Table 49 and accompanying text; Section 5.1, POET and Pion: precision and training horizon; Table 6; Appendices V, Tables 50–51; Appendix Z, Limitations; Section 2, Orthogonality in neural-network training](https://arxiv.org/abs/2611.00593v1)
