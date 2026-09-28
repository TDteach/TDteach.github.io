# 2026-09-29

## Quantized Interpretability Transfer Requires a Noise-Floor Baseline for Cosine Similarity

*[Cosine Similarity Is Not Evidence: Measuring the Noise Floor of Interpretability Transfer Under Quantization](https://arxiv.org/abs/2609.30275v1)*

Earlier compression work reported that quantization (LLM.int8(), AWQ) preserves the original refusal source/direction with high cosine similarity around 0.99. The concrete limitation is calibration: a scale-invariant similarity does not say whether the observed agreement is larger than the estimator’s own sampling noise. The paper’s motivating example is a published cosine of 0.996 whose sample size `n` was not reported, so the number cannot by itself be read as preservation.

To fix this, the paper derives a split-half null for the difference-in-means direction estimator. Under its stated isotropic Gaussian sampling model, the expected cosine between two independent estimators is approximately `(1 + 4/κ)^-1`, with `κ = nρ²/d`, where `n` is the per-class sample size, `ρ` is class separation relative to activation noise, and `d` is activation dimension. The formula matched Monte Carlo simulation to a maximum absolute error of approximately 0.0015 across the tested κ range.

The missing empirical quantity is measured on real activations rather than assumed: for Qwen2.5-1.5B-Instruct, with hidden size `d = 1536` and `n = 256`, measured `ρ` ranges from 33 to 61. This makes a high split-half cosine plausible from sampling alone in that configuration, so a cross-precision cosine must be compared with a null rather than interpreted in isolation.

The decisive transfer test uses the split-half null measured inside each quantized model. With the stated sample size and resampling procedure, the FP16-derived refusal direction shows detectable rotation at INT4: cosine 0.9647 versus an INT4 own-model null of 0.9803, with a deficit greater than two standard deviations. At INT8, no movement is detected; this is not an equivalence claim.

The paper also shows why cosine is insufficient for a second reason: a scale-invariant statistic cannot distinguish translation from attenuation of a transferred decision variable, even though those cases call for different remedies. The authors recommend reporting `κ`—or at least `n` and `d`—beside similarity statistics and pairing them with scale-sensitive checks. A practical audit is therefore: estimate class separation, construct the within-quantized-model split-half null, and separately test whether the transferred direction retains usable magnitude.

The evidence remains bounded. The measured `ρ` comes from one model, hidden size, and dataset, and the quantization experiments are simulated and weight-only. The authors also withhold refusal-rate outcomes from a 45,000-completion experiment because the substring refusal classifier’s agreement with humans was not established; this paper therefore calibrates direction-transfer evidence, not downstream safety preservation in general.

Read it to learn a concrete procedure for turning a cross-precision cosine into a calibrated test: estimate κ, compare against a within-quantized-model split-half null, and check magnitude separately.

[abstract](https://arxiv.org/abs/2609.30275v1) · [§5 (S5.p1.1) ; Table 5](https://arxiv.org/abs/2504.04215v1)

## ScopeBench Separates Security-Agent Capability from Scope Adherence Under Goal Pressure

*[ScopeBench: Do Agents Preserve Engagement Boundaries Under Goal Pressure?](https://arxiv.org/abs/2609.30325v1)*

## Why this paper
Existing offensive-security benchmarks measure raw hacking capability; ScopeBench targets the separate question of whether an agent preserves a stated engagement boundary when the objective can be reached only by violating it.

## What changes
This is a measurement change, not a claim that trajectory judging itself is new: PentestJudge evaluated long penetration-testing trajectories with LLM judges, whereas ScopeJudge studied pre-execution gating. ScopeBench's specific combination is dead-end tasks, a deterministic verifier, and a calibrated trajectory judge.

## How the benchmark works
The benchmark contains 30 dead-end agentic security tasks in which the stated objective is reachable only by violating the stated scope. Each task is run under two conditions sharing its environment, verifier, and objective: a scopeless condition measures capability, while a scoped condition measures adherence. In the scoped condition, the flag sits behind the boundary, so a verifier pass proves by construction that a forbidden action occurred. That mechanical guarantee depends on the flag remaining inaccessible from the in-scope surface and on the harness not leaking task or verifier state through a side channel.

Trajectories that do not pass the deterministic verifier are sent to an agentic judge that reads the tool-call sequence for hidden violations. The judge was calibrated against 100 human-labeled trajectories; a blinded audit found no false negatives among 36 audited violations, with over-flagging the only observed error.

## What it found
Across eight models in one harness, raw capability spans 12.2% to 81.1%, while scope adherence spans 34.4% to 86.7%. The judge finds 331 violations that mechanical verification misses. In the pooled pilot comparison, opus-4-8 scores 10 percentage points higher in raw capability than sonnet-4-6 and 35.6 percentage points higher in scope adherence. The paired design therefore makes capability and boundary adherence separate quantities rather than one task-success score.

## Transferable operation
For a new boundary-sensitive evaluation, run each task twice: first without scope to establish a capability baseline, then with scope to measure adherence. Keep final-outcome verification and trajectory review as separate signals, and calibrate the reviewer on human-labeled trajectories before treating its estimate as a result. The useful unit of analysis is the boundary-crossing call and whether final-outcome verification detects it.

## Boundary
Interpret the pilot narrowly. Every task offers only one completion path requiring a boundary crossing; this simplifies mechanical verification but differs from settings where compliant and noncompliant routes coexist. All 30 tasks are web-application security. The trajectory arm infers violations, and its error profile may vary by task family, violation type, acting model, or trajectory length. Calibration used five annotators, while the blinded audit used one domain expert.

Read it for a reusable paired experiment that separates whether an agent can finish a security task from whether it respects the stated boundary while doing so.

[Abstract](https://arxiv.org/abs/2609.30325v1) · [Abstract (abstract1.1)](https://arxiv.org/abs/2508.02921v1) · [abstract](https://arxiv.org/abs/2607.07774v2)

## HARDEN Uses Constrained Evolutionary Search for Harder, Answer-Preserving Evaluation Cases

*[HARDEN: Constrained Evolutionary Search for Harder, Answer-Preserving Evaluation Cases](https://arxiv.org/abs/2609.30571v1)*

### Why this matters

The paper starts from a concrete evaluation limitation: curated benchmarks may underrepresent the complexity of enterprise deployments. HARDEN adapts existing evaluation cases into harder variants while keeping their expected outputs fixed.

### Method

Compared with single-pass baselines, it uses evolutionary search to propose and select increasingly challenging cases. HARDEN is a constrained evolutionary search that enforces separate correctness, realism, and validity feasibility checks while optimizing for lower task-model fitness and higher output uncertainty. Correctness is intended to preserve the evidence needed to derive the expected output; realism keeps a variant plausible in its deployment domain; validity keeps it well-formed and executable by the original benchmark. This separates whether a mutation preserves the task from whether it merely lowers a model score.

### Evidence

Across FinQA, PubMedQA, and ContractNLI, using Qwen3.5 task models at 35B-A3B, 122B-A10B, and 397B-A17B, the paper reports a 22.7% average reduction in task-model accuracy and up to a 49.9% reduction relative to single-pass baselines using the same feasibility checks. It also reports a 112% average increase in normalized discrete semantic entropy over constraint-filtered single-pass baselines. The latter gives the search a signal for cases that are not only wrong more often, but also produce less concentrated outputs under the reported sampling setup.

### Boundary and research use

These results are bounded by the evaluated setup. Generality across model families and mutation models is untested: the experiments use one task-model family and one mutation model. Task-model evaluation did not enable model-internal reasoning, so the effects of reasoning-enabled decoding on robustness to HARDEN mutations remain unresolved. The LM-based correctness and realism checks were validated with small human and co-author adjudication studies that show mixed alignment, so their calibration is not conclusive. Finally, HARDEN incurs higher compute and cost than single-pass baselines because it generates and evaluates many candidates across multiple generations.

For a replication or evaluation pipeline, the transferable operation is to define domain-specific mutation axes, keep correctness, realism, and validity as separate gates, and use uncertainty as a secondary selection signal—not as evidence that a hard case is valid. The key research question is whether the feasibility gates are trustworthy enough that measured hardness reflects model weakness rather than label corruption.

I read this to understand a practical method for producing harder, answer-preserving evaluation cases that are plausibly realistic for applied domains and to extract transferable ideas about combining domain-driven mutation axes, LM-based feasibility checks, and model-conditioned evolutionary selection.

[abstract; §1 (S1.p4) and §3 (S3.p1.3); §1 Contributions (S1.I1.i3); Abstract; §5 (S5.p1); §5 (S5.p1); Appendix A.11 & A.12](https://arxiv.org/abs/2609.30571v1)

## KNOWS benchmarks web agents on retrieval-to-artifact workflows

*[The Hard Part Comes After Search: Benchmarking Web Agents on Synthesizing, Organizing, and Displaying Knowledge](https://arxiv.org/abs/2609.30604v1)*

The paper starts from a concrete evaluation gap: existing computer-use agent benchmarks do not fully evaluate agents acting as assistants, whose workflows should retrieve information, synthesize it into artifacts, and navigate program interfaces to produce a coherent final product.

Relative to that earlier setup, PresentBench used 238 slide-generation instances built from authoritative background materials and instance-specific checklists. KNOWS instead evaluates browser-based, multi-step workflows that culminate in produced artifacts.

KNOWS contains 110 tasks across Docs, Slides, and Sheets, with each task decomposed into checkpoints and paired with an evaluator. The evaluator combines deterministic checks with LLM judgments, making the produced artifact—not only the retrieved answer—the object of evaluation. Evaluator decisions were compared with expert judgments: overall agreement was Cohen’s κ=0.64 and 82% pairwise accuracy, with higher agreement reported for LLM/VLM-based steps.

On the 110-task benchmark, the best performer fully succeeded on fewer than 3% of complex, long-horizon tasks. Partial-success metrics nevertheless reached approximately 35–70% for the best-performing baseline, while the resulting artifacts were often unusable. The abstract gives the decisive failure pattern: visual-step failures rendered artifacts unusable even when agents completed more than 50% of other evaluation steps.

The same underlying model also performed differently across harnesses: Comet exceeded BrowserGym on success rate and three partial-success metrics. The authors’ analysis identifies visual/spatial understanding, workspace tool knowledge, and long-horizon reasoning as the largest gaps, while retrieval alone was insufficient for coherent artifact production.

The result is informative but bounded. KNOWS’s 110 tasks emphasize depth and complexity rather than full coverage of domains encountered in real-world web use. Its live-web dependence means the web state can change between runs. The benchmark is confined to Google Docs, Slides, and Sheets, and a full cross-platform check was outside scope because many deterministic checks rely on Google APIs. Task creation also requires approximately 9–18 hours of expert work per task.

A transferable research operation is to rerun identical workflows across agent harnesses while logging separate retrieval, tool-execution, visual/spatial, and final-artifact verdicts. The resulting question is narrower and more useful than whether an agent “can browse”: which intervention changes the failure stage without merely improving partial checkpoint scores?

Read this to borrow a benchmark design for separating retrieval, tool execution, visual/spatial reasoning, and final-artifact quality.

[Abstract](https://arxiv.org/abs/2609.30604v1) · [Section 3.1 (S3.SS1.p1 / S3.SS1.p2)](https://arxiv.org/abs/2603.07244v1)

## Trajectory Calibration Separates and Mitigates Two Quantization Failures in Looped Transformers

*[Quantizing Looped Transformers: Feedback Exposure and Calibration Blindness](https://arxiv.org/abs/2609.30820v1)*

Looped transformers reuse weights across recurrence steps, but one-step GPTQ builds its Hessian from step-0 activations alone. The paper calls the resulting mismatch calibration blindness: later recurrent states can activate input directions that the step-0 statistic barely represents. In Huginn-3.5B, only 43 of 10,560 adapter input dimensions exceeded the stated relative-energy threshold in the step-0 Hessian proxy, indicating how narrowly that calibration can cover the adapter’s input space.

The paper separates this statistical failure from feedback exposure. It defines a perturbation as “feedback-exposed” if it directly modifies the recurrent state through a path that lacks an additive identity bypass; such perturbations can be repeatedly applied at each recurrence step and therefore may be amplified. The Huginn result is sharp under deterministic symmetric round-to-nearest per-channel INT4, with all other weights kept in bf16: quantizing the non-residual loop-entry adapter reduces final-step agreement with bf16 to 10.5%, whereas quantizing all 16 residual-core projections leaves 87.9% agreement. The structural interpretation also appears in four linear IIR controls: quantizing the state-transition matrix A at 10 bits or below moves at least one pole outside the unit circle in every tested filter, while quantizing B, C, and D leaves poles unchanged across the tested precisions.

The proposed fix changes the calibration statistic rather than the GPTQ solver. Trajectory calibration forms H_deploy = sum_&#123;t=0&#125;^&#123;N-1&#125; X_t^T X_t across the deployment rollout and applies the same column-wise GPTQ procedure to that accumulated Hessian. Under grouped INT4 with group size 128, the paper reports that this approach outperforms both one-step GPTQ and round-to-nearest on all nine tested checkpoints and restores bf16-level accuracy on Huginn.

A transferable research operation is to log per-step activation covariances before choosing a quantizer: first test whether errors enter through a feedback-exposed path, then measure whether the calibration Hessian gains substantial directions as recurrence proceeds. This separates a placement or precision problem from a calibration-coverage problem and suggests testing weighted, truncated, and full-horizon Hessians rather than assuming step 0 is representative.

The boundary is important: the evaluation covers nine checkpoints up to 4.17B parameters; trajectory calibration does not always recover full-precision performance, and rank gain alone does not predict recovery magnitude. The appropriate calibration horizon or weighting is also model-dependent: excluding or reweighting step 0 helps some architectures but hurts others.

To learn a concrete diagnostic for recurrent PTQ—distinguishing error amplification at the loop entry from a Hessian that misses later states—and a minimal rollout-aware calibration change that can be tested with an existing GPTQ implementation.

[abstract; S4.p1.2; S3.SS2.p1.2; S3.SS1.p1; S3.SS2.SSS0.Px3.p1.1; abstract1.1; S8.p3; A16.p2](https://arxiv.org/abs/2609.30820v1)
