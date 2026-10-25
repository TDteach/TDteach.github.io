# 2026-10-26

## Causal Audits Find Example-Specific Hidden Messages and Task-Dependent Timing in Diffusion Agents

*[Hidden Messages Between Diffusion Language Model Agents: Causal Evidence for Latent Communication](https://arxiv.org/abs/2610.28905v1)*

Aggregate accuracy alone does not identify whether a receiver used example-specific latent content. A prior audit addressed this by comparing no message, a current-example message, an other-example message, and a receiver-generated message, with metrics separating message presence, identity, content-attributable task gain, and self-substitution.

Hidden Messages applies this causal question to independent diffusion-agent trajectories. The sender compresses selected denoising states into four signed BF16 vectors (4×128), rather than sending token IDs, logits, or a partially decoded sequence; agents retain separate contexts, canvases, and trajectories. Tiny-A2D uses gated residual fusion, whereas Dream-7B consumes the vectors as virtual prefix embeddings. At the receiver boundary, the study compares matched messages with no message and tests content by replacing a message with one from a different-target example while holding receiver context fixed.

In HM-Synth on frozen Tiny-A2D, matched messages raise accuracy from 8.6% to 72.9%, while a different-target message gives 9.3%; the matched-minus-deranged gap is +63.6 points. Targeted sender-fact replacement changes the receiver’s answer in 89.4% of examples and selects the substituted target in 72.9%, supporting decision-relevant content. For the tested sequential out-and-back dependency on Dream-7B, matched two-stage communication reaches 100.0%, versus 9.8% with no message and 0.0% under derangement. On distributed QASC, matched recurrent communication reaches 80.8%, while a wrong-example message lowers accuracy to 46.8%.

In these tested tasks, timing differs by dependency structure: on QASC, where two supporting facts are split between agents, one late transfer reaches 87.8%, outperforming four recurrent exchanges by 7.0 points. A useful replication for a new system is to hold the receiver’s context and trajectory fixed while running matched, absent, deranged, and targeted-substitution arms; then compare late and recurrent schedules when the sender may need either to redirect the next computation or to consolidate private evidence first. The timing result therefore supports a conditional design question, not a universal exchange rule.

The channels are supervised, task-specific adapters, so the evidence supports learned hidden communication, not an emergent or task-independent protocol. The paper reports that initial zero-shot reuse across heterogeneous tasks did not yield a detectable benefit. Natural-question evidence currently comes from Dream-7B on QASC, and the paper does not establish comparative benefits against matched text communication or wall-clock cost.

Read it for a reusable causal-audit design—matched, absent, deranged, and targeted messages—plus a concrete timing comparison that links exchange schedules to task dependency structure.

[abstract](https://arxiv.org/abs/2610.28905v1) · [The Audit Framework → Message Settings and Audit Metrics (Sx3.SSx2.p1-p3)](https://arxiv.org/abs/2607.26773v1) · [abstract](https://arxiv.org/abs/2608.04893v2)

## MOSAIC diagnoses representation, retrieval, delivery, and reading losses in multimodal conversational memory

*[MOSAIC: An Omni-Modal Benchmark for Long-Term Memory and Cross-Modal Reasoning in Conversational Agents](https://arxiv.org/abs/2610.29249v1)*

Prior long-term memory benchmarks often report a single end-to-end score, making it difficult to locate whether evidence was lost during representation, retrieval, delivery, or reading. MOSAIC responds with 923 questions over persona-grounded histories of 11–24 sessions spanning text, image, video, and audio. It targets spatial, temporal, and prosodic signals rather than decorative media; spatial information receives the strongest causal validation, while prosody receives selector-level validation.

The method change is a matched diagnostic protocol: stage substitutions keep the question, reader, prompt, packer, and budget fixed, while tracking retrieved evidence that is dropped before reaching the reader. Within-item interventions change one required carrier while keeping the question and other evidence hops fixed. This gives a concrete experimental operation for memory work: vary one information carrier or pipeline stage, rather than infer a bottleneck from an aggregate score.

In the matched ladder on 784 answerable items, gold native evidence scores 0.783, generic caption/ASR text scores 0.690, and query-blind structured text scores 0.704; the 1.4-point structured-text recovery is not statistically distinguishable from zero. Gold symbolic facts score 0.846, so the remaining 15.4 points bound reading and grading failure, not reading alone, because they also include reader, output-format, and judge error. On 194 spatial items, an explicit spatial description improves performance over object-only text by 15.4 points (95% interval: 9.5–21.5), but closes only part of the gap to raw images. The annotated prosodic selector is load-bearing in its intervention: replacing the correct tag with its opposite reduces score by 4.6 points, while the raw-audio-versus-ASR contrast is inconclusive. Tight packing can sharply reduce complete-chain delivery even with ranking fixed, but the reported 17.7-point drop combines a smaller top-k and a one-media-per-modality cap, so it cannot be assigned to the cap alone.

The diagnosis has important boundaries. Stage labels are protocol associations rather than fully isolated causal mechanisms because gold and retrieved contexts also differ in distractors and composition. Video intervention nulls are underpowered to rule out smaller effects; their reported 80%-power minimum detectable effects are 8.9–11.2 points. Near-null audio contrasts do not establish acoustic or transcript-based sentiment recovery. The personas, evidence sessions, and media are synthetic, so evaluation on organically collected multimodal histories remains future work. Finally, the strongest reported answerable score does not imply reliable abstention: the system scoring 0.732 on answerable items correctly refuses only 0.410 of refusal controls, which retain observable form cues.

Read this to borrow a controlled evaluation design: freeze the reader and scoring setup, then change one evidence carrier or pipeline stage to distinguish missing evidence from failed interpretation.

[abstract; §5, S5.p1.1; §5.1, S5.SS1.p1; §6.1, S6.SS1.p1; Table 3; §6.1, S6.SS1.p1; Table 3; Appendix K.1; §6.2, S6.SS2.SSS0.Px1.p1; Appendix K, Table 27; §6.2, S6.SS2.SSS0.Px2.p1; Appendix K, Table 27 and A11.SS4.SSS0.Px1; §6.1, S6.SS1.SSS0.Px3.p1; Appendix K.3; §6.4, S6.SS4.p1; Appendix K, Table 28; Appendix G, A7.SS0.SSS0.Px1.p1; Appendix G, A7.SS0.SSS0.Px2.p1; Appendix F, Table 19; Appendix G, A7.SS0.SSS0.Px3.p1; §8 Limitations, S8.p1](https://arxiv.org/abs/2610.29249v1)

## Event-targeted patches beat pixel-error rankings in Atari return-error localization

*[Events, Not Pixels: Where World Models Get the Return Wrong](https://arxiv.org/abs/2610.29435v1)*

World models can render plausible frames while assigning the wrong return; this paper targets the gap between frame fidelity and planning-relevant return accuracy. Rather than treating the largest visual discrepancy as the most important failure, it asks which imagined transitions change the return estimate when replaced by real counterparts.

For each Atari probe, the authors replay a fixed action sequence in the environment and world model. A frozen, memoryless, per-game detector reads reward and termination from consecutive frames; selected imagined transitions are replaced with both corresponding real frames while actions remain fixed. The event mask starts with real nonzero reward or termination and is dilated by one step. Event-targeted patches are then compared with random patches containing the same number of steps, plus complementary and all-transition controls.

Across 44 Atari model–collection pairs that pass reliability checks, event patches have positive lift over random in 39 pairs, with median lift of about 44 percentage points. In the aggregate, restoring event transitions removes a median 70% of return error, versus 17% for random patches. Yet event frames are not unusually bad under the reported visual measures: their median pixel-error ratio to other frames is 0.85, while largest-MSE, SSIM, and LPIPS patches remove no more return error than random at the median.

That is the paper’s decisive change in evaluation: intervention is budget-matched and return-based, rather than inferred from visual error. For a researcher, the transferable operation is to run this patch test before designing a repair: localize the transitions that matter, then ask whether the intervention changes the decision metric. Here, event patching improves pairwise plan-ranking accuracy in all reported reliable ranking pairs.

The boundaries are important. The Atari attribution requires a detector to reach reward-event F1 0.90 on an independent collection, and the reported attribution covers only the 44 pairs that pass the checks. Alignment is operational, not automatic: on Freeway, an undilated patch is negative because the reward digit appears after the earning transition. Termination is included in the mask, but termination substitutions remove a median 0.7% of return error in the reported setup. Finally, the repair experiment does not show that sampling alone helps: a deterministic variant of the diffusion network also beats the MSE baseline. Read the result as a localization diagnostic, not a validated general repair recipe; the next question is whether the same event definition survives outside these detector-qualified Atari settings.

Read it to borrow the budget-matched real-frame patch test for diagnosing planning-relevant failures before changing a world-model objective.

[abstract; Section 3, Substitutions and Their Controls; Section 6.2, Main Results; Abstract; Section 6.1, Table 2; Section 6.2, Comparison with Pixel Error; Section 6.1, Table 2; Section 6.5, A4: Event Transitions Drive Plan Selection; Section 6.1, Experimental Setup; Section 6.4, Ablation on Sampling](https://arxiv.org/abs/2610.29435v1)

## FairAMO finds orchestration gains depend on candidate complementarity under controlled forecasts

*[Rethinking Agentic Model Orchestration for Time Series Forecasting](https://arxiv.org/abs/2610.29504v1)*

Agentic model orchestration (AMO) can improve forecasting accuracy, but a reported gain may reflect stronger or more complementary candidate time-series foundation models (TSFMs) rather than better orchestration. FairAMO addresses that attribution problem as a controlled evaluation protocol.

The protocol caches candidate forecasts in a Frozen Forecast Bank, supplies orchestrators with the same permitted historical evidence, withholds test labels, and requires a selection or combination decision before test scoring. This design holds the candidate pool and evidence budget fixed while comparing orchestration rules, helping isolate the contribution of the decision process from the available forecasts.

Under the main five-candidate pool with validation plus 10 backtests (val+B10), TSOrchestra SLSQP reaches 0.658 MASE versus 0.697 for the best single candidate, TiRex2—a 5.6% improvement under official GIFT-Eval test scoring. The result is bounded by the pool: it is not evidence that orchestration creates gains independent of candidate quality. Pool-size ablations show that increasing the pool from two to five candidates expands available headroom, but incremental realization diminishes after the third member.

Composition is more informative than count alone. At fixed pool size, candidate subsets containing TiRex2 recover more available headroom than subsets without it. Conversely, a weak standalone candidate can improve an ensemble when its errors add useful diversity, so standalone leaderboard rank does not determine pool value. Historical evidence also has a limited return: for the tested methods and main pool, added backtests help up to a small budget but do not produce monotonic improvement as the budget grows.

The transferable research operation is to freeze forecasts first, preregister the evidence budget, and vary pool size, complementarity, and historical windows separately. Report both raw accuracy and the fraction of candidate-pool headroom recovered; otherwise a stronger pool can be mistaken for a better orchestrator. The conclusions remain bounded: the experiments are on GIFT-Eval, so transfer to other benchmarks or deployment settings is not established. FairAMO also commits one decision per dataset-and-horizon configuration and holds it across windows, leaving finer-grained window-specific decisions untested. Finally, the authors say the contribution of LLM-mediated orchestration remains unresolved; the strongest reported methods here are selection and weighting rules.

Read this when evaluating an agentic or ensemble forecasting system: it provides a concrete matched-forecast protocol and ablations for separating candidate-pool quality from orchestration quality.

[§1, paragraph 3; §3, paragraph 1; §4, RQ1; Appendix Table B1; §4, RQ2; Appendix Table B2; §4, RQ2; Appendix Table B3; §4, RQ3; §5 Conclusion](https://arxiv.org/abs/2610.29504v1)

## ChronoEvo measures whether updated medical evidence reaches the final recommendation

*[Large language models show systematic failures in incorporating evolving medical knowledge](https://arxiv.org/abs/2610.30631v1)*

Earlier temporal-guideline work, TempoMed-Bench, constructed 721 guideline-version difference pairs and used them to generate multiple-choice questions; it examined current-versus-historical knowledge, temporal consistency, and retrieval effects. ChronoEvo’s supported increment is narrower: it asks whether a model fully incorporates explicitly supplied updated evidence into a recommendation, rather than only recognizing temporal change.

ChronoEvo contains 1,709 verified recommendation-level revisions across 12 types of knowledge change. Its primary full-evidence evaluation separates revision recognition, clinical correctness, and full incorporation, with the updated recommendation withheld from generation while updated evidence is available. This turns “the model noticed an update” into a different endpoint from “the model used its consequences”; that distinction is the paper’s main evaluation operation.

For Qwen3-4B in the primary full-evidence condition, 90.8% of responses reflected recognition of the revision, 80.2% were clinically correct, and 58.5% fully incorporated the revised guidance—a 32.3-percentage-point recognition–incorporation gap. Updated evidence moved responses closer to the current recommendation by lexical similarity for 90.2% of revisions, but that movement did not guarantee full incorporation. Certain revision types—especially strength or certainty changes—were associated with greater outdated-content retention after adjustment; this is an association, not evidence of causation.

A revision-salience prompt reduced outdated-content retention and improved clinical correctness, yet full incorporation remained essentially unchanged at 58.5% versus 59.3%. Clinician adjudication found that 156 of 300 validation responses (52.0%) fully incorporated the update, a 40.3-point gap; because this sample used targeted enrichment and two physicians, its absolute proportions are descriptive of the validation sample.

For a transferable research operation, score recognition, clinical correctness, incorporation, and outdated retention as separate endpoints when testing an update-handling intervention; do not collapse them into one accuracy number. ChronoEvo does not test retrieval of the correct guideline, selection of the applicable version, or prolonged deployment-time knowledge maintenance, because its experiment supplies relevant updated evidence. Its recognition measure is observable response behavior, not a direct measurement of internal knowledge. Finally, GPT-5 performed recommendation extraction, verification, and primary response evaluation, so model-dependent judgment contributes to benchmark construction and the main evaluation.

Read it to learn how to design an update benchmark that separates recognizing a revision from carrying its clinical consequences into the final recommendation.

[abstract; Results, §2.1, paragraph 1; Results, §2.2, paragraph 1; Results, §2.2, paragraph 2; Results, §2.5, paragraph 3; Results, §2.7, paragraph 3; Table 2; Results, §2.8, paragraph 2; Discussion, §3, paragraph 7; Methods, §4.8](https://arxiv.org/abs/2610.30631v1) · [Section 3.1, Trajectory Difference Extraction; Section 4.2, Collapsed Accuracy on Outdated-targeted Questions; Section 4.3, Diversified Consistency Patterns; Section 4.4, Limited Improvements in Accuracy; Table 3](https://arxiv.org/abs/2605.13045v1)
