# 2026-09-11

## Loss-based membership is flat within noise from 1 to 1,000 copies and turns on above that.

*[Detectable Only Where It Is Confounded: What Verified Duplication Counts Say About Membership Evidence in Language Models](https://arxiv.org/abs/2609.10830v1)*

## Why the labels matter

Loss-based membership inference is often read as evidence that a candidate sentence appeared in a model’s training data. The paper identifies a basic evaluation problem: “Almost every published test of that inference has had to guess which sentences were in the training data, the members, and which were not.” Instead, it uses public pretraining corpora for OLMo-2 and Pythia plus an exact-match index that returns sentence copy counts. These counts measure an exact-match exposure floor, rather than treating membership as an unverified binary label.

## The design holds text fixed

The key methodological operation is cross-corpus comparison of the same sentence: “We measure that trace with a design that reads the same sentence through two models, which cancels fluency and quality by construction.” For each mid-book sentence, the authors compare OLMo-minus-Pythia loss with OLMo-mix-minus-Pile log copy count, centering both quantities within each book before calculating within-book rank correlations. This targets variation in exposure while retaining the sentence itself.

The study also tests a common local control: a one-word, near-synonym edit of a corpus sentence that is verified to have zero exact-match copies. This matters because an edit can be a non-member while still changing how natural the sentence sounds.

## What the measurements show

For the 7B model pair, the within-book correlation is small: “For the 7B pair it is -0.084 (permutation p = 0.016, n = 747).” Under this design, loss therefore carries only a faint exposure trace at the tested duplication levels. The paired-edit result sharpens the caution: “The original beats its edit by a median of about 0.4 nats per token, in 92 to 100 percent of pairs, at every model size.” Yet the reported gap is flat across the 1–999-copy bands, so the authors interpret it as sensitivity to authorial word choice rather than an exposure gradient.

At the high-duplication positive control, control choice also changes apparent separability: against one-word edits, the loss detector scored 0.83 AUC; against composed-prose controls, it scored 0.94 AUC. Both estimates use the same 12 famous-line members.

## A transferable research operation

For a membership study, treat exposure as a measured dose where possible, then compare the same items across training distributions. As an editorial test question: does a proposed non-member control preserve loss-relevant properties—register, fluency, and lexical fit—or does it create the detector signal?

## Boundaries

“The text is English literary prose from six books, in sentences of 10 to 16 words.” Model size stops at 13B, with 13B-class runs in 8-bit precision. Exact-match counts undercount formatting and punctuation variants, and the authors report no injected-sequence condition; consequently, the study does not directly causally separate controlled exposure from text-fit effects.

Learn a concrete evaluation pattern for membership inference: replace guessed labels with verified duplicate-count floors, and hold sentence content fixed while exposure varies across public corpora.

[Abstract; \[Sx6.SSx2.p2.1\]; \[Sx6.SSx1.p2\]; \[Sx7.p2.1\]; \[Sx7.p3.p1\]; \[Sx8.p1.1\]; \[Sx2.I1.i4.p1.1\]; \[Sx11.p1.1\]; \[Sx4.SSx1.p1\]; \[Sx3.SSx1.p3\]](https://arxiv.org/abs/2609.10830v1)

## SearchAtlas Reconstructs Web-Search Traces as Evidential Query DAGs

*[SearchAtlas: Analyzing Agentic Search Strategies via Evidential Query Graphs](https://arxiv.org/abs/2609.10901v1)*

Search agents are often judged by final-answer accuracy, leaving unanswered how retrieved evidence satisfies the question. SearchAtlas addresses the parsing problem by converting a long search trajectory into a typed evidential graph rather than treating it only as an ordered list of actions.

The graph contains the original question (`q0`), issued queries, a prior-knowledge node (`PK`) for unattributed knowledge, and the final answer (`A`). Its edges encode observable contributions: a query can use a question constraint, retrieved content can support a later query or answer unit, a failure can prompt a later action, and prior knowledge can enter the answer. The pipeline combines deterministic extraction of queries, snippets, page visits, and failure signals with LLM-based local attribution. Minimal parent-set pruning then keeps a compact set of supporting parents for each target.

The reconstruction quality is measurable: against 100 human-adjudicated trajectory DAGs spanning three benchmarks and five systems, the parser reports a macro edge F1 of 0.860, with similar performance across benchmarks. Applying the graphs to five agents on three benchmarks exposes fragmented answer support, constraints that never reach the answer, and unverified parametric knowledge entering responses. The paper reports that these process failures are strongly associated with incorrect answers and are more informative than an LLM judge given either the raw trajectory or the ordered query list. The supplied evidence supports that directional comparison, but not the detailed metric sizes or statistical tests behind it.

The graph statistics also separate search scale from answer quality: on BrowseComp, median graph size ranges from 6 nodes and 7 edges for TYDP-Qwen3 to 103 nodes and 165 edges for MiroThinker. A transferable research operation is to log every answer unit and ask three local questions: which retrieved query supports it, which question constraint reaches it, and whether support is instead attributed to `PK`. This turns trajectory debugging into an auditable provenance task rather than a single score.

The result is not a complete account of an agent’s internal reasoning: edge decisions concern observable contributions, and SearchAtlas uses an LLM for local attribution, so shared systematic errors and nontrivial construction cost remain possible. Evaluation is limited to closed-answer, English-language deep-search tasks with identifiable answers; generalization to open-ended, non-English, or multimodal settings is untested.

Read it to learn a concrete way to turn search logs into auditable evidence paths, then reuse its answer-unit and constraint-grounding questions when debugging an agent.

[Abstract; S3.SS1.p1-p3 (Graph Definition); S3.SS2.p4; S1.p4; Sx1.p1-p2](https://arxiv.org/abs/2609.10901v1)

## TTIQ Builds VLM Test-Time RL Rewards from Joint Image–Question Dependence

*[Harnessing Image Question Dependence for Better VLM Test-time Reinforcement Learning](https://arxiv.org/abs/2609.13296v1)*

Test-time reinforcement learning can adapt vision-language models (VLMs) to unlabeled target data, but its update signal is only as reliable as the model-generated responses being reinforced. This paper tests that premise rather than treating consensus as a sufficient proxy for correctness.

Across 24 full-test model–dataset settings, the authors identified 4,131 cases in which consensus-based test-time training changed an exact-match error into an exact-match success. Of those corrections, 72.3% were form-only; macro exact-match rose 3.36 points while ground-truth answer containment fell 0.41 points. Thus, output normalization can improve the metric without adding answer content. The analysis also reports that incorrect initial responses can lack joint image–question use, allowing consensus rewards to preserve grounding errors.

TTIQ changes the learning signal by measuring dependence directly. For each sampled response, it teacher-forces under the original image–question pair, a zero-image variant, and a question-masked variant. Token log-likelihood changes estimate image and question dependence. The method combines rank-normalized image dependence, question dependence, and length-normalized confidence through a minimum-bottleneck response reward. At token level, positive credit is proportional to the smaller of the image- and question-support signals, favoring tokens supported by both inputs rather than merely popular continuations.

The abstract reports the best average performance at every model scale across eight VQA datasets and multiple VLM sizes. It also reports that models adapted on one dataset improved on unseen target datasets without further training, and that the method generalized across VLM families. A transferable research operation follows: ablate each conditioning input, measure token-likelihood changes, and test whether requiring joint support changes content metrics alongside normalized exact match.

The boundary is compute: two extra teacher-forced scoring passes increased update time from 21.9 to 35.8 seconds in the matched comparison, while peak memory remained 76.84 GB per GPU.

Read it to examine how controlled image and question ablations can turn a multimodal grounding diagnostic into both a response reward and a token-credit signal, while checking whether the reported gains extend beyond answer normalization.

[Abstract; Section 3.1; Section 3.2; Section 4.3 and Table 2; Appendix B and Table 7](https://arxiv.org/abs/2609.13296v1)

## ReactHuman Evaluates Whether MLLMs React to Sudden Hazards Like a Competent Human

*[ReactHuman: A Physics-Grounded Benchmark for Human-Like Reactive Decision-Making in Embodied Multimodal LLMs](https://arxiv.org/abs/2609.10895v1)*

## What limitation does it target?

The paper argues that prior evaluations either test intuitive physics passively through video question answering or focus on deliberate long-horizon tasks, leaving immediate, safety-critical reactions unmeasured. Its target is narrower and operational: can an MLLM turn a short visual observation of a sudden household hazard into a catch, dodge, or no-action plan that a humanoid can execute? This is an author-framed benchmark gap rather than an independently verified comparison with earlier benchmarks.

## The method change: score the decision after execution

ReactHuman uses a **freeze-and-predict** protocol. The evaluated MLLM receives an approximately 0.6-second, up-to-three-viewpoint observation window and returns a structured plan containing intent, confidence, a walking command, and 3D hand keyframes. The simulation then resumes; a pre-trained whole-body controller executes that plan on a simulated Unitree G1 humanoid under 240 Hz rigid-body physics.

This design moves evaluation beyond whether a textual action label sounds plausible. Its five metrics separate semantic action selection from safety and physical grounding: Semantic Action Accuracy, Safety Validity, Physical Endpoint Distance, Action–Intent Alignment, and Hand-Distance Evolution. The benchmark contains 17 event families and more than 1,000 reproducible scenes. Ground truth is extracted from the simulator rather than manually annotated, and adversarial variants deliberately decouple appearance from material properties—for example, a foam anvil and a steel apple.

## What execution reveals

In the reported zero-shot study, seven MLLMs were evaluated on a balanced 306-scene subset. The paper reports that models mishandle roughly one hazard in three; Table 1 reports 54.0% average Semantic Action Accuracy and 80.8% mean Safety Validity. The diagnostic is particularly useful because semantically correct choices can still fail kinematically: among executed plans labeled Catch, hands end a median 0.48 m from the true arrival point, with 89% of misses falling short.

The authors also report three failure patterns under this setup: models favor fixed action dispositions over scene-specific behavior, trust visual appearance over observed motion in adversarial material probes, and do not show shrinking errors with scale. These are benchmark-specific measurements, not permanent capability rankings: the tested API snapshots can change.

## A transferable evaluation operation

For embodied-agent work, retain the separation between **choosing an action** and **reaching its physically relevant endpoint**. A useful follow-up question is: if an agent selects Catch correctly, does its executable trajectory reach the simulator-derived interception location without violating safety rules? That question forces a benchmark to preserve timing, execute a committed control representation, and report failure modes that a label-only score can conceal.

The boundary matters: ReactHuman is simulator-derived, omits deformation and shattering, and executes one open-loop plan without mid-motion replanning. Its reported conclusions therefore require validation on real hardware and in closed-loop settings.

Read Section 3 through Table 1 to see how a short visual observation can be converted into an executable motor-plan test, and how endpoint-distance metrics reveal failures hidden by correct action labels.

[Abstract; §3.1; §4; §5 Table 1; §6](https://arxiv.org/abs/2609.10895v1)

## DriftNet is a compact log-only detector for prompt-injection localization on the AgentDrift benchmark

*[DriftNet: A Dual-Head Trajectory Transformer for Detecting and Localizing Prompt Injection in LLM Agents](https://arxiv.org/abs/2609.10892v1)*

Indirect prompt-injection monitoring has an operational gap: the paper describes existing systems as returning either a whole-trace verdict or a single unsafe index, while an operator needs the attack’s entry point, the steps it corrupted, and whether apparent poison was resisted. DriftNet changes the output contract rather than inspecting the agent’s internals. It reads a logged tool-call trajectory with a frozen sentence encoder and four identity-free world features, then uses a trained trunk with two heads: one trajectory-level compromise classifier and one four-way per-step labeler for benign, injection point, hijacked, and failed injection. The trunk has fewer than two million trainable parameters and the heads are optimized with a class-weighted joint objective.

On the AgentDrift task-disjoint split—12,536 trajectories and 71,024 labeled steps—the paper reports trajectory-level F1 of 0.983, exact injection-point recovery on 98.7% of attacked trajectories, hijacked-span IoU of 0.979, zero flags on 218 resisted attacks, and flags on 2.9% of hard negatives. These figures come from the sweep-selected configuration after a 20-configuration sweep; the test part was evaluated exactly once. On the same held-out split, a retrained surface baseline recovers 11.1% of partial hijacks and 17.1% of delayed executions, versus DriftNet’s 98.6% and 93.2%, respectively, while DriftNet lowers every reported false-alarm rate.

The transferable research operation is to make localization an explicit prediction target and evaluate it with strict measures: injection-point exact-set match and hijacked-span IoU, not only per-step F1. A useful follow-up would keep these metrics while removing the four world features, anonymizing world identity, and testing a generator held out from training; that would separate behavior cues from corpus regularities.

The reported accuracy is conditional on a narrow benchmark. The authors state that all attacked and benign trajectories come from one generator model under one protocol, and the corpus contains only 3–11 steps per trajectory, with mean length 5.67. On the task-disjoint split, a world-identity lookup reaches 86.9% binary accuracy against a 55.0% majority class. The paper also evaluates no adaptive attacker. Therefore, the results do not establish transfer to other generators, real agent traffic, longer runs, or detector-aware attacks. DriftNet is best read as a compact audit design plus a reminder to test what a detector can exploit before treating high localization scores as deployment evidence.

Read it to see how to turn a binary injection alarm into an auditable step map, while using the paper’s artifact analysis to design a stronger evaluation.

[Abstract \[abstract1.1\]; Section X \[S10.p1.1\]; Section X \[S10.p2.1\]; Section X \[S10.p3.1\]; Section X \[S10.p6.1\]](https://arxiv.org/abs/2609.10892v1)

Prepared retrospectively from the 2026-09-11 candidate papers; verified on 2026-09-16.
