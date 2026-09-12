# 2026-09-01

## Measured Effective Learning-Rate Schedules Align Pretraining Loss Trajectories

*[Effective Learning Rate Governs Loss Dynamics in Language Model Pretraining](https://arxiv.org/abs/2608.24814v1)*

Earlier evidence for effective-learning-rate matching was narrower: in GPT-2-124M/OpenWebText experiments with AdamW, matching the effective learning rate induced by weight decay reproduced the full training dynamics in float32. That work also reported that matching ELR alone did not prevent some bfloat16 divergences, leaving the scope of the effect beyond that optimizer and setup unresolved. [arxiv:2310.04415v2; S3.p6; S3.p9; S3.F8]

The current paper turns the idea into a paired schedule-matching test. Runs use identical initialization and data-order seeds, while distinct learning-rate and parameter-norm schedules are constructed to match ELR, defined here as learning rate divided by parameter norm. The study reports comparisons across multiple optimizers, architectures, datasets, and model scales rather than only a single AdamW language-model configuration. [arxiv:2608.24814v1; S1.SS0.SSS0.Px1.p1.2]

The central result is reported as ELR collapse: when ELR schedules are matched, full loss trajectories have mean absolute discrepancies of only a few times 10^-3. The condition matters: the comparisons are paired and evaluated after warmup, so the result is trajectory alignment under controlled schedule matching, not an assertion that arbitrary runs become equivalent. [arxiv:2608.24814v1; S1.SS0.SSS0.Px1.p1.2]

The ablations identify where this alignment weakens. In the reported Llama-124M AdamW/FineWeb setting, removing QK-Norm increased mean collapse error from 2.3 times 10^-3 to 5.2 times 10^-3. With ELR-preserving sinusoidal modulation, increasing the number of cycles from 2 to 32 raised the reported error from 2.8 times 10^-3 to 7.5 times 10^-3. Thus normalization design and the timescale of LR–norm variation are experimental variables, not implementation details to hide. [arxiv:2608.24814v1; S4.SS2.SSS0.Px1.p2.1]

The operational extension is an ELR-based functional scaling law. Fitted on four non-Hyperball trajectories, it predicted two held-out Hyperball runs without refitting with mean RMSE 0.0212, versus 0.2508 for the LR-parameterized version. [arxiv:2608.24814v1; S6.SS0.SSS0.Px2.p2.1]

The boundary is macroscopic: the supplied limitation record notes that transformers are not exactly scale invariant because they contain trainable vector-valued parameters, and that the paper does not provide a microscopic dynamical explanation. [arxiv:2608.24814v1; A1.SS1.p1.2] A useful follow-up is therefore to log η, parameter norm, and loss per step, reproduce the paired ELR intervention, then add representation and downstream probes while deliberately varying normalization components and modulation speed. That separates loss-trajectory control from broader claims about what the model learns.

Read this to obtain a low-compute paired-run protocol for testing whether a norm-control method changes loss dynamics beyond the ELR schedule it induces.

[S1.SS0.SSS0.Px1.p1.2; S4.SS2.SSS0.Px1.p2.1; S6.SS0.SSS0.Px2.p2.1; A1.SS1.p1.2](https://arxiv.org/abs/2608.24814v1) · [S3.p6; S3.p9; S3.F8](https://arxiv.org/abs/2310.04415v2)

## ZID separates ranking, equality testing, and dispersion diagnosis beyond FID and KID

*[What FID Hides: Detecting, Ranking, and Diagnosing Deviations in Generative Evaluation](https://arxiv.org/abs/2608.24881v1)*

FID's concrete weakness is its moment restriction: for any distribution with finite second moments and nonzero covariance, the paper proves that a different distribution can share its mean and covariance, making any moment-only discrepancy—and specifically population FID—zero. FID and KID also produce scalar discrepancies that are unchanged when the two samples are exchanged, so they do not encode whether a generated set is under-dispersed or over-dispersed.

The paper demonstrates the first limitation with a reference-adaptive ImageNet construction. Images optimized from noise to match the reference Inception mean and covariance receive FID 24.7, versus 58.6 for held-out real images, where lower is better. For the same comparison, ZID reports departure scores of 17.2 versus 0.86, and none of 499 random label permutations produces an equally large score; the held-out comparison has permutation p = .328.

ZID changes the evaluation object from one scalar to three linked outputs. It combines six standardized location- and dispersion-sensitive arms: RISE, a rank-graph representation, and Gaussian-kernel representations at two bandwidths. It then reports an index for ranking departure magnitude, a permutation-calibrated p-value for distributional equality, and a signed dispersion readout. The directional readout is conditional: when member signs conflict, ZID reports “member-sign conflict” rather than forcing a single under- or over-dispersion label.

In controlled experiments on CIFAR-Inception PCA-128 features with m = n = 200, 300 repetitions, and 499 outer permutations, ZID is the only tested row with power of at least .70 in every departure column. Across six-level severity sweeps, its score has positive rank association on every sweep, ranging from .56 for matched-moment multimodality to .95 for off-manifold support. An ablation links this coverage to complementary components: removing RISE causes the largest power loss on six of eight departures, while removing median-bandwidth GPK reduces location power from .830 to .237 and removing small-bandwidth GPK reduces nonlinear-dependence power from .980 to .860.

The reusable research operation is to ask three separate questions—whether a departure is detected, how large it is under a fixed protocol, and whether a dispersion direction is defensible—rather than treating one metric as all three. Keep sample size, embedding, reference set, and preprocessing fixed when comparing scores. For reference-adaptive sets such as the optimized ImageNet images, the permutation tail is descriptive, not a population-calibrated two-sample p-value.

Read this paper to see how a generative-evaluation metric can expose moment-matched failures, rank departure severity, and attach a conditional dispersion diagnosis without treating a reference-adaptive permutation tail as calibrated evidence.

[abstract; Thmproposition1.p1; S1.F1; S6.p2; S4.SS1.p3; Fig. 3 (text description); S4.SS2.p2; Fig. 5 (text description); S4.SS3.p2; Table 2 (text description); S3.SS4.SSS0.Px2.p1.2; S3.SS3.SSS0.Px1.p1.2](https://arxiv.org/abs/2608.24881v1)

## A targeted, structured restatement adjacent to the decision restores disclosure influence.

*[Reading Is Not Using: Retrieval, Judgment, and the Design of AI Financial Research Workflows](https://arxiv.org/abs/2608.24842v1)*

## What the experiment tests

The paper targets a specific evaluation limitation: “Retrieval-based evaluations can certify systems whose investment judgments ignore information they demonstrably retrieved.” The authors hold focal-firm information fixed while varying unrelated context from 2,000 to 128,000 tokens, then separate directed retrieval from the disclosure’s effect on an investment judgment. This is a useful experimental decomposition: a system can be asked both whether it can state a disclosure and whether changing that disclosure changes its decision.

## The reported gap

Under directed questioning, “Direct retrieval, by contrast, remains stable.” For the primary Qwen3.5-9B-Base family, the supplied evidence reports retrieval for 12/12 firms at every tested context length, including 128k tokens, with zero false-positive retrievals on neutral-control filings. Yet the risk disclosure’s decision influence falls to the experimental noise floor at long context in the reported setup. More capable models delay rather than remove this pattern: “More capable models postpone but do not eliminate the gap.”

The workflow result is concrete. At 128k tokens on Qwen3.5-9B-Base, the paper reports baseline retention of 12%, whereas extract-then-decide—placing a targeted, structured restatement next to the decision—reaches 67% retention, with positive effects for 12/12 firms. In contrast, chunk-then-aggregate eliminates the effect at all tested lengths. The authors’ note audit locates this failure before the decision stage: “the target disclosure is absent from the consolidated notes in twenty-four of twenty-four firm-arrangement cells at 2k.”

## What to reuse

The authors also use interventions to distinguish two proposed transmission routes: compressed running summaries and attention-based lookup. They report that each carries a substantial share of the disclosure’s influence and that the estimated effects are statistically indistinguishable firm by firm. The transferable research operation is to evaluate a workflow with paired counterfactuals: preserve the document and decision task, alter one decision-relevant disclosure, measure both retrieval and the resulting decision difference, and audit whether an intermediate representation retained the disclosure.

This is not yet an architecture-general causal account. The channel identification comes from one hybrid model family; the authors state that how disclosures travel in architectures without a recurrent channel remains to be mapped. Their real-filing replication is also described as exploratory and capability-conditional, rather than universal.

Read this for a measured template for testing whether retrieved evidence changes an LLM’s downstream decision, plus a workflow intervention whose long-context effect is reported numerically.

[Abstract; Section S4.SS3.p1–p3; Table 3; Section S4.SS5.p1–p3; Figure 4; Table 4; Section S5.SS4.p4–p5; Table 6; Section S6.SS2.p2–p3; Table 7; Table 8; Appendix Table 18; Section S7.p7](https://arxiv.org/abs/2608.24842v1)

## Recuris Uses Verified Working State and Gated Memory Patches for Long-Horizon Agents

*[Recursive Experiential-Working Memory Evolution for Long-Horizon Agent Harnesses](https://arxiv.org/abs/2608.24876v1)*

Long-horizon agents face a concrete control failure: as histories grow, task state can become obscured and skill invocation can become misaligned. Recuris addresses this by separating current task control from accumulated experience. Its Working Memory tracks progress and guides skill selection from Experiential Memory according to current needs rather than the full history.

Recuris maintains a verified Working Memory for task progress, uses it to select skills from Experiential Memory, emits structured execution traces, and applies component-scoped patches only after a validation gate on held-out or development tasks. The traces connect the working state, retrieved experience, action, observation, proposed state update, checker result, and committed state. A fixed Meta-Agent uses this evidence to localize a failure to one of four memory-control components before proposing a patch. The outer procedure is fixed: the base LLM, tools, Meta-Agent, localization and patching procedures, validation gate, and harness mechanisms outside the memory-control layer do not change across rounds.

For a researcher, the transferable operation is to narrow the editable surface before adding recursion: define a state schema with explicit invariants, make mutations produce machine-checkable evidence, associate failures with a specific component, and validate only that scoped change on held-out tasks. This is a design lesson, not evidence that structured traces outperform alternative diagnosis methods; the supplied record does not contain a head-to-head localization-accuracy comparison.

Across four long-horizon benchmarks and ten models, the abstract reports gains in 35 of 37 completed model-benchmark pairs, including +17.8 points for GPT-5.6 Sol and +15.6 for Claude Opus 5 on tau-bench, +16.6 and +13.5 for Qwen3.6-27B and Qwen3.6-35B on SkillFlow, up to +32.2 points on the longest tasks, and reductions of common long-horizon failures by up to 80%.

The important boundary is test-time adaptation. In the Terminal-Bench 2.1 test-time adaptation study, with 87 tasks and a four-attempt matched budget, adaptation added 2.3 points over retrying the seed memory, with 7 tasks won and 5 lost (p=0.774), and this difference was not statistically significant; retrying itself explained most of the +26.4-point improvement over the single-attempt baseline. Transfer is conditional: if held-out tasks retain none of the failure types the memory repairs, there is nothing left to transfer.

Read it to learn how to make recursive external-memory updates auditable by coupling explicit state checks, localized failure traces, scoped patches, and held-out validation.

[Abstract; §2.1.1 (S2.SS1.SSS1.p2); §3.5 (S3.SS5); Table 8 (S3.T8); §3.4.5 (S3.SS4.SSS5.p3)](https://arxiv.org/abs/2608.24876v1)

## Validated Task Coverage evaluates finite LLM candidate sets by distinct useful outcomes

*[Evaluating Multiple LLM Generations with Validated Task Coverage](https://arxiv.org/abs/2608.24228v1)*

Most LLM evaluations score outputs one at a time. This paper instead treats a finite set of generations as the evaluation object: the question is how many distinct, task-relevant outcomes appear within a fixed number of attempts.

Validated Task Coverage (VTC) makes that question explicit. For task \(x\), it validates and maps each generation \(y_i\) to useful outcomes, takes the union across attempts, and applies a coverage utility:

\[
\operatorname&#123;VTC&#125;_&#123;x&#125;(y_&#123;1:k&#125;)=u_x\left(\bigcup_&#123;i=1&#125;^&#123;k&#125;\tau_x(y_i)\right).
\]

The construction requires a task-specific deterministic function \(\tau_x\): it must identify outputs that satisfy the task constraints and map valid outputs to discrete outcomes whose distinctness matters. VTC-Bench instantiates this design on five real-data tasks—molecule design, repository repair, bug finding, differential diagnosis, and evidence search—using automatic, reproducible scoring without model-based judges. Its outcome representations include molecular scaffolds, modified-function sets, behavioral bug classes, UMLS concepts, and reasoning aspects.

The selection result is consequential. Across 24 model–inference configurations and the benchmark’s headline budgets, the five configurations ranked highest by one-draw quality incurred mean VTC regret from 2.2% in evidence search to 25.0% in repository repair, with a 12.1% task-macro average; the one-draw and VTC Top-5 sets shared only 10 of 25 positions. The preferred configuration also depends on the number of attempts: in four of five tasks, the leader at \(k=1\) differed from the leader at the headline budget \(H\). Simple output-variation measures therefore should not be treated as substitutes for task-grounded coverage.

The intervention results offer a concrete experimental lesson. Raising temperature from 0.6 to 1.2 increased VTC at \(H\) in 38 of 40 matched comparisons, although one-draw quality fell in 25 of those comparisons. Chaining later attempts on earlier outputs, with an explicit non-repetition prompt, was not uniformly beneficial: it consistently improved evidence search, consistently reduced repository-repair coverage, reduced coverage in most differential-diagnosis configurations, had little effect on bug finding, and had larger configuration-dependent effects on molecule design. Thus, temperature and chaining should be tested as task-specific coverage interventions rather than assumed to improve candidate sets generally.

A transferable follow-up operation is to specify the validator and outcome mapping before comparing inference settings, then report coverage over \(k\) alongside single-draw quality. The main boundary is that frozen targets make absolute coverage reference-relative: valid outcomes outside the annotated target receive no credit. Attempt counts also are not comparable across tasks in token use, compute, or human review effort, so a higher VTC curve is not by itself a resource-equated win.

Read this to learn how to replace single-output or surface-diversity comparisons with deterministic, task-grounded coverage measurements—and how temperature, chaining, and attempt budget can change the selected configuration.

[Section 3, equation (1) (S3.E1); Section 4, overview and Table 1 (S4.p1, S4.T1); Section 6.1 (S6.SS1.p2); Section 6.2 and Table 2 (S6.SS2.p2, S6.T2); Section 6.3 and Table 3 (S6.SS3.SSS0.Px1.p1, S6.SS3.SSS0.Px3.p1, S6.T3); Section 7 (S7.p1–S7.p2); Abstract](https://arxiv.org/abs/2608.24228v1)

Prepared retrospectively from the 2026-09-01 candidate papers; verified on 2026-09-12.
