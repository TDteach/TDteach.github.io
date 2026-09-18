# 2026-09-18

## Relation Information Controls Final-Token Recall Before Entity Commitment

*[Relation Before Entity: Deferred Commitment in Language Model Factual Recall](https://arxiv.org/abs/2609.17537v1)*

### The question

The paper isolates a timing question in factual recall: do relation-type information, such as “capital-of,” and entity-specific information, such as “France → Paris,” become causally active at the final prediction position at the same depth? Its methodological target is the distinction between information being available somewhere in the network and information controlling the generated answer. An entity signal can be locally accessible before it has been routed to the final token.

### The design

The study applies causal activation patching to four decoder-only models—Llama-3.2-3B, Llama-3-8B, Qwen2.5-3B, and Phi-2—across eight controlled fill-in-the-blank prompt families. Its main transfer curves patch a donor state into a receiver’s final-token state. At the primary threshold, onset is the first tested layer above 0.4 for two consecutive tested layers; layers were sampled every other layer.

The key design change is to patch both positions separately: donor entity-token states into receiver entity-token states, and donor final-token states into receiver final-token states. This distinguishes early entity availability from later final-token commitment. The paper also tests direct conflicts in which donor and receiver differ in both relation and entity, wrong-entity donors that preserve the relation, and steering with relation- and entity-specific direction vectors.

### The finding

At threshold 0.4, relation onset precedes entity onset by 10–16 tested layers, or 31–44% of network depth. The ordering holds across all 16 model–threshold combinations tested from thresholds 0.2 to 0.5. Entity information is not absent in the early layers: entity-token patching succeeds at 90–100% in early and middle layers while final-token patching remains approximately 2.4%. In late layers, final-token patching rises to 88–97% while entity-token patching falls to 2–4%.

The conflict test gives the same temporal pattern: relation wins dominate in middle layers and entity wins dominate in late layers, with the crossover tracking entity onset within two tested layers for every model. Wrong-entity controls further report relation-only transfer of 0.79–0.86 at peak relation layers, while donor-answer copying remains at or below 0.11. Steering also places relation effects in middle layers and entity effects in late layers.

### Research use and boundary

For a new recall task, measure “is represented” and “controls the answer” as separate hypotheses. Construct same-relation/different-entity pairs, patch the entity and final-token positions independently, and test competing relation/entity changes before interpreting an early signal as an output mechanism. These layer targets are intervention hypotheses, not universal coordinates: the evaluated models are open-weight decoder-only systems in the 3B–8B range. The experiments also use controlled prompts and greedy first-answer generation; natural-language QA, longer contexts, and free-form reasoning remain untested. Finally, the routing mechanism from entity-token information to final-token commitment remains to be localized.

Read this paper for a concrete causal-testing pattern: it separates early information availability from later control of the output, while providing model-specific layer ranges for testing relation and entity interventions.

[S9.p1.8; S3.T1 (Table 1); S5.SS0.SSS0.Px3.p1.7; S5.T3 (Table 3); S4.SS0.SSS0.Px2.p1.1; S4.T2 (Table 2); S3.SS0.SSS0.Px3.p1.3; A4.T6 (Table 6); S8.SS0.SSS0.Px3.p1.2](https://arxiv.org/abs/2609.17537v1)

## SAE ablations dissociate probe readouts from behavioral drivers in a Gemma-2-9B case study

*[Decodability is Not Causality: Dissociating Probe Readouts from Behavioral Drivers via SAE Decomposition](https://arxiv.org/abs/2609.18080v1)*

A linear probe can show that a concept is decodable without showing that the features it weights drive model behavior. Tiwari et al. test that distinction for a True/False truth probe in an instructed truth/deception setting on Gemma-2-9B-Instruct.

## Replace a single ranking with an intervention test

The authors decompose the probe through a 16,384-feature sparse autoencoder (SAE) at layer 20. They then make two feature rankings: geometric alignment with the probe direction, and gradient sensitivity of the model’s True/False margin. Rather than assuming that highly probe-aligned features matter to behavior, they form matched Shared, Probe-only, and Random sets and ablate their reconstructed SAE contributions while continuing the forward pass. Output coherence is used as a gate on interpreting the intervention. [§5.1–5.2; Tables 1–2]

The rankings did not identify the same features well: their overlap was approximately 11–14% across the reported scales, with Spearman \(\rho=0.10\). In the deceptive-instruction evaluation, Shared features flipped the model’s True/False output on 13–27% of statements, whereas equally sized Probe-only features flipped 6% and Random features 1%; reported coherence was 1.00. The paper therefore supplies intervention evidence that a probe-aligned feature can influence the probe’s own readout without being among the features that most change the measured behavior. [§5.1–5.2; Tables 1–2; Figure 2]

The authors further report that an activation-aware selection combining probe information with feature activations flipped behavior substantially more often than geometric probe features alone. Their interpretation is limited: activation-free projection of a probe weight vector is insufficient for identifying behaviorally used features in this setting, not proof that this pattern holds for probes generally. [§6]

## A reusable research operation

For a probe result, the useful follow-up question is: *after decomposing the readout into an intervention substrate, which matched feature set changes the target behavior while outputs remain coherent?* Compare geometric and behavior-sensitive rankings, then measure behavioral flips separately from changes in the probe score. Before assigning causal meaning to SAE-feature ablations, also verify that the SAE preserves the probe margin. In the paper’s auxiliary reward-hacking code-probe check, only 26% of the raw margin was preserved by the SAE reconstruction, so interventions could not be interpreted as affecting the original probe prediction. [Appendix A.2; Table 7]

These results are concentrated in one model, layer, SAE, and behavioral setting; moreover, features that influence this True/False behavior do not by themselves establish a general mechanism for deception. [§7]

It offers a concrete intervention workflow for testing whether probe-decodable SAE features actually change the behavior a probe is meant to explain.

[Abstract; §5.1–5.2, Tables 1–2; §6–7; Appendix A.2, Table 7](https://arxiv.org/abs/2609.18080v1)

## XConf combines retrieved graded episodes with reflection to estimate LLM confidence

*[Confidence Comes from Experience: Experiential Confidence Estimation from Reasoning to Agents](https://arxiv.org/abs/2609.17708v1)*

XConf targets a limitation in existing confidence estimators: according to the authors, they “only read the current inference process,” through introspection, token probabilities, or resampling. The proposed alternative is to consult an actor model’s own *graded* history rather than treating the current answer as the only evidence.

The experience bank stores past episodes containing the task, the model’s reflection and stated confidence before grading, the outcome, and a lesson written after the grade arrives. For a new task, **Recall** retrieves 50 nearest episodes using a frozen task embedding augmented by the prior stated confidence and a correctness-supervised reweighting. It produces a historical success-rate estimate that weights neighbours with similar earlier confidence. **Reflect** presents short cards from retrieved episodes, asks the model to identify a recurring failure mode, and elicits a revised 0–100 confidence. The final score averages Recall and Reflect. This is a non-parametric, black-box procedure: it does not require logit access or weight updates.

The paper evaluates XConf on nine benchmarks spanning reasoning, multimodal QA, code, and agents, using four models and a five-fold out-of-sample bank protocol, so the confidence bank contains only previously graded episodes. The authors report that XConf “beats or matches ten-sample self-consistency on 23 of 24 model-dataset comparisons, at a tenth of the generation cost.” The reported comparison uses AUROC for discrimination and ECE for calibration; the paper also reports substantially lower ECE for XConf. The cost condition matters: XConf uses one answer generation plus a short Reflect call, whereas the reference self-consistency baseline uses ten samples.

A useful research operation is to log externally graded rollouts, then evaluate whether retrieved historical outcomes improve confidence ranking beyond a current-run-only baseline at a matched generation budget. Keep the label source independent of the actor: “The bank tolerates inaccurate outcome labels, but not labels produced by the model itself.” The authors report that an independent LLM judge agreeing with gold labels at about 0.911 retained much of the method’s value, whereas actor self-labelling degraded performance.

Two boundaries should shape a replication. The authors state that “Voting keeps an edge on votable factual recall,” so short factual queries need a separate self-consistency comparison. They also leave actor evolution untested: if the actor changes over time, the central question is whether older episodes remain predictive or require forgetting and reweighting.

Learn a concrete retrieval-and-reflection confidence-gating design for costly code or agent rollouts, including the outcome-label and task-type tests needed to evaluate it.

[Abstract; S3.p1; S3.SS3; S3.SS4; Equations (3.3) and (3.4); S5.SS1; Table 3; S6.p6; S7.p1–p3](https://arxiv.org/abs/2609.17708v1)

## A 4B verifier improves first-mistake localization and test-time trajectory selection

*[Locating Hidden Failures Makes Long-Horizon Agents More Reliable](https://arxiv.org/abs/2609.17930v1)*

Long-horizon agents are still judged largely by whether they finish successfully. The paper’s concrete objection is that terminal outcome cannot show where a run went wrong, whether it recovered, or what irreversible harm occurred en route. In its safety audit, 65 unsafe actions were flagged: every one unnecessary, 97% taken without acknowledging risk, and 75% irreversible; the audit included runs scored as solved.

The useful method shift is from judging only the endpoint—or, in earlier ToolPRMBench work, evaluating tool-agent process models by step-level accuracy—to explicitly labeling the trajectory. Human annotators label every step as correct or incorrect and mark the first mistake. The released Traverse annotations classify 6,967 mistakes into 78 failure types. This makes the verifier’s target a point of intervention: identify where a candidate run first derails, not merely whether its final output passes.

The baseline exposes why that target matters. In the reported software-engineering and computer-use tests, the strongest of the evaluated frontier judges located the first mistake in only 26.8% and 32.3% of runs, respectively; no judge exceeded one-third, and accuracy fell as trajectories lengthened. Scout, the authors’ 4B verifier, located failure far better than these judges and transferred to a domain it had not seen. Used to select among candidate runs at test time, it raised task success above the agent’s own single-attempt performance without retraining the agent.

The transferable research operation is to turn agent logs into step-level supervision: label the first consequential error, record whether later actions repair or compound it, and train the evaluator for localization rather than terminal scoring alone. Then test the evaluator as a candidate-run selector, measuring both first-error localization and final task success. This is a practical intervention point, but the evidence remains bounded: the study covers software engineering, terminal/computer use, and AI-for-science, while whether the reported patterns hold in embodied, multimodal, or multi-user settings is open.

Read this to learn how to convert trajectory logs into first-mistake labels and use a specialized verifier for candidate-run selection.

[Abstract; S1.p6; S1.p9; S3.SS1.SSS0.Px5.p1; S4.p3](https://arxiv.org/abs/2609.17930v1) · [Table 2 (S4.T2 rows for Tool-using PRMs and overall table)](https://arxiv.org/abs/2601.12294v1)

## Measured HQQ 3-Bit Quality Losses Vary by Domain and Model

*[A Calibrated Instrument for Measuring How Inference Optimizations Affect Output Quality](https://arxiv.org/abs/2609.18005v1)*

## The measurement problem

Kaplan frames a practical limitation in inference-optimization research: quantization, early exit, and speculative decoding are usually evaluated with their own benchmark scores, rather than with one calibrated measure suitable for comparing quality costs across techniques.

## What the instrument changes

The paper uses an LLM judge, but first measures whether that judge can distinguish a change from ordinary sampling variation. For every prompt, it draws two independent bf16 reference responses; their judged difference is the exchangeability null. It also includes an implementation null: strict speculative decoding with a 4-bit drafter, specified to be distributionally identical to the unmodified model. The study adds positive controls and pre-registers a ±0.3-point equivalence bound on the judge’s seven-point scale.

On 220 prompts across five domains, the observed reference-reference difference was −0.05 with a 95% interval of [−0.18, +0.08]. Its per-prompt standard deviation was 0.94. These checks give operational meaning to an equivalence claim: an optimized arm must fall inside the pre-set tolerance while null arms indicate the pipeline is not introducing a detectable apparent loss.

## What it measured

For Qwen2.5-7B-Instruct, 4-bit NF4 quantization and lenient speculative decoding were equivalent to the bf16 model under that ±0.3 bound. In contrast, HQQ 3-bit quantization had a pooled judged-quality loss of −0.70, with the largest reported loss on hard-verifiable items, −1.11. The replication on Llama-3.1-8B-Instruct retained the pooled NF4 equivalence result, but HQQ 3-bit was substantially worse: −1.84 pooled and −3.11 on code, while arithmetic was reported as nearly unchanged at −0.09. The reported magnitudes therefore depend on both the target model and the prompt domain under this protocol.

A useful research operation follows directly: before selecting an optimization from an aggregate score, measure a distribution-preserving null, include a deliberately detectable control, pair optimized and reference outputs on the same prompts, and ask which deployment domains have enough samples for the desired equivalence resolution.

## Boundaries

These are results from one primary judge family and two 7–8B target models. The authors state that another judge rubric or pairwise protocol could resolve comparisons differently, and that the measured magnitudes will not transfer to larger models. Per-domain claims are also less precise where variance is high: the hard-verifiable domain had paired standard deviation near 2.0 and requires more prompts for a precise equivalence decision.

Read this to adapt a concrete null-and-positive-control protocol before claiming that an inference optimization preserves output quality in a specific deployment domain.

[Abstract; Section 3 (The Instrument); Section 3.6 (Equivalence, power, and pre-registration), PDF pages 5-7; Section 3.3 (The exchangeability null), PDF page 6; Section 5.1 (The quality surface), Tables 1-2, PDF pages 9-11; Section 5.3 (Replication on Llama-3.1-8B), Tables 4-5, PDF pages 11-13; Section 7 (Limitations), PDF page 14](https://arxiv.org/abs/2609.18005v1)
