# 2026-10-31

## Automated-interpretability scores can be high without reading explanations

*[Scoring Explanations Without Reading Them: Structural Shortcuts in Automated-Interpretability Evaluation Data](https://arxiv.org/abs/2610.37676v1)*

The limitation this paper targets is concrete: an automated-interpretability score can reflect how evaluation items are constructed—token position, marked-token layout or count, and sequence order—rather than whether a model read the explanation. The method change is to test explanation-free rules using only those signals, derive closed forms for their scores, and compare them with explanation-based scorers on the same items.

On Neuronpedia’s stored fuzzing runs for 500 random GPT-2 small features, 91.3% of activating examples put the peak on the centre token. A centre-mark rule reached balanced accuracy 0.979, versus 0.838 for stored LLM scorers, while a rule using only mark count reached 0.969; the marks were rebuilt from pipeline code. On the stored Gemma sample, the count rule reached 0.981 versus 0.794 for stored scorers.

These cues vary across pipelines: current delphi always marks the same slot in its fuzzing negatives, while full-context runs mark negatives with more tokens. In OpenAI’s simulation benchmark, each neuron’s top-activating sequences are listed first; on 400 GPT-2 XL neurons, a post hoc rule predicting activity on the first five reached pooled correlation 0.227, versus 0.160 for GPT-4’s published simulator. That ordering result does not establish that GPT-4 used the cue.

The paper formalizes the sequence problem: any predictor constant within a sequence is bounded by the sequence-mean correlation ratio, so pooled correlation can contain separable within-sequence and between-sequence components. This gives a direct diagnostic rather than treating one pooled number as a single measure of explanation use.

The paper’s position control uses natural-text windows cut at random offsets: the best shared fixed-offset prior still reached only 0.015. On those windows, Jev reached pooled correlation 0.331 over 49 features, versus 0.013 with shuffled explanations; most of its correlation came from ranking tokens within sequences. The study nevertheless finds a geometry confound in score levels without demonstrating that it reorders features.

For a new benchmark, run the strongest explanation-free baseline on the identical items, report it beside the explanation score, and decompose pooled simulation performance into within- and between-sequence parts. The useful research question is whether the explanation changes token ranking after position, mark, and sequence-order cues have been neutralized.

The main boundary is that the principal stored-run fuzzing results depend on reconstructed marks and an inferred pipeline version; evidence is uneven across pipelines, and the proposed matched positive/negative mark construction was derived but not tested. The study also does not establish that structural cues have no effect on feature rankings, because its real-data test has limited scope and uncalibrated sensitivity to partial reordering.

Use it to design a same-item explanation-free baseline and diagnose whether pooled simulation scores are driven by within-sequence ordering.

[abstract; Sections 3–8](https://arxiv.org/abs/2610.37676v1)

## Training contrast determines whether a latent monitor reads exposure or commitment

*[Exposure Is Not Commitment: Double-Stratified Evaluation of Latent Monitors for Tool-Using Agents](https://arxiv.org/abs/2610.37679v1)*

The paper’s central correction is to stop treating injection exposure as evidence that an agent will make an unsafe tool call. It proposes “double stratification”: separate exposure from behavioral commitment in both evaluation and the monitor’s training population.

The supplied exposure-monitoring study makes the narrower target explicit: immediate exposure is not attack success or downstream harm. That distinction changes both labels and sampling. The paper compares a naive unsafe-versus-rest contrast with a commitment contrast restricted to exposed cases—unsafe versus attacked-but-safe—and tests whether a monitor can predict the agent’s own unsafe action before the call.

On the primary Qwen AgentDojo grid, the naive mixed contrast strongly captures exposure but provides little pre-action discrimination of which exposed cases become unsafe. With the commitment contrast, a logistic activation probe reaches AUROC 0.853 for pre-action prediction of the model’s own unsafe tool call, up to two steps early—the maximum allowed by the three-step trajectories. A trained visible-text TF-IDF baseline reaches 0.855 on the same target, so the result does not establish a general latent-representation advantage.

Cross-model observations sharpen the condition rather than remove it. On the reported Mistral-7B and OLMo-2-7B cases, commitment AUROC reaches 0.896 and 0.912, respectively; under naive contrasts, Mistral’s probe ranks exposure inversely while OLMo’s captures both axes. The authors interpret the contrast effect as one candidate explanation for conflicting pre-action-probe results: the signal may exist, while zero-shot forecasts and NLA verbalizations fail to recover it reliably.

For a new monitor, the transferable operation is concrete: publish separate exposure and exposed-only commitment scores, train the latter only within the exposed stratum, and include a visible-text baseline before claiming a latent pre-action signal. This prevents an unstratified AUROC from silently answering the easier question—whether injected content was present—instead of the operational question—whether the agent will act unsafely.

Evidence remains bounded. The primary generated-action results are not live interactive rollouts, so their action distribution and monitor lead time may differ in deployed environments. The attacks are non-adaptive, making reported AUROCs upper bounds against monitor-aware evasion. Commitment monitors are evaluated within the exposed stratum, and clean-traffic false-alarm costs are not measured. Cross-model replication is limited to Qwen, Mistral, and OLMo on AgentDojo; it does not establish generality across benchmarks.

It gives a concrete audit design for distinguishing a monitor that recognizes injection exposure from one that predicts the agent’s imminent unsafe tool action, while preserving the paper’s non-adaptive and non-live-rollout limits.

[Abstract; Section 7, paragraph 4; Table 1, Section 6; Section 8, Limitations](https://arxiv.org/abs/2610.37679v1) · [Appendix A, paragraph on label semantics](https://arxiv.org/abs/2608.02657v2)

## Seq@K makes feedback design part of sequential model evaluation

*[Seq@K: Evaluating Language Models Under Sequential Feedback](https://arxiv.org/abs/2610.37859v1)*

Pass@K draws K independent samples from the original prompt. It cannot capture whether a model uses a failed attempt and feedback to repair its next answer, so it is incomplete for systems built around sequential revision.

Seq@K changes the unit of evaluation: it asks whether a task is solved within K sequential attempts; after each failure, the next attempt receives specified feedback and prior history, and the trajectory ends at success or the attempt budget. A score is therefore conditioned on the verifier, feedback mode, prompt/history construction, decoding settings, and K—not just the model.

This is not the first feedback-conditioned evaluation in the supplied record: RefineBench studies checklist-guided multi-turn refinement, while ICPC-Eval defines Refine@K for code revision from execution feedback. Seq@K’s supported increment is a broader protocol framing across task types, with explicit model-selection and feedback-sensitivity analyses.

The decisive model-selection test is narrower than that framing. With four coding actors, T=0.7, three repetitions, ten calibration tasks, held-out tasks, test-detail feedback, and Seq@5 evaluation, Seq@3 and Seq@4 calibration selected actors with higher held-out Seq@5 than Pass@5 calibration: gains were +8.3/+8.1 on MBPP Pro and +26.0/+25.9 on HumanEval Pro. Average costs were similar or lower, but three of four cost-ratio intervals included parity.

Feedback content also changes what is repaired. On CLBench DKR, pooled over five models and thirty tasks, rubric-aware critics repaired 73.8% of initially failed requirements, versus 36.5% for independent sampling, 34.4% for binary feedback, and 36.8% for rubric-blind critics.

Across 26 model–benchmark pairs, gains from additional independent samples did not predict gains from sequential feedback (Spearman ρ = -0.08), but the interval was broad [-0.47, +0.31]. Two cautions matter: Seq@3 and Seq@4 were read from runs told K=5, and Seq@4 was added after seeing Seq@3 results. Revision-following labels were model-generated, with 80% overall agreement and lower DKR agreement (κ=0.53).

A useful research operation follows: report the full protocol tuple alongside every score; pre-specify calibration depth; hold feedback modes fixed when comparing models; and log per-turn issue repair plus full-history versus summary ablations. The transferable question is whether a model that wins independent sampling also wins the intended feedback loop—not whether Pass@K alone predicts it.

Read this to design an evaluation that fixes the feedback channel, verifier, history format, and attempt budget before comparing models built to revise from critique.

[Section 3, Feedback Modes and Protocol Dependencies](https://arxiv.org/abs/2610.37859v1) · [abstract](https://arxiv.org/abs/2511.22173v1) · [abstract](https://arxiv.org/abs/2506.04894v1)

## Self-improving agents can pass current safety checks while losing redundant safeguards

*[Masked Erosion: How Acceptance Gates Lose Redundant Safeguards in Self-Improving Agents](https://arxiv.org/abs/2610.38392v1)*

### What changes

A self-improving harness can look safe to its current model while silently losing a backup safeguard: if another layer still blocks the harm, deleting one produces little immediate signal, even though the harness becomes less tolerant of a later failure. That is the paper’s “masked erosion” mechanism.

The previous limitation is concrete: task-success gates and current-model harm checks observe present outcomes, not the harm that would appear after a safeguard fails. PACE provides per-candidate false-commit control under paired-null assumptions. SAGE accepts only when discounted paired gain is positive, the one-sided paired test is significant, and the observed regression fraction is within the specified cap. The present paper adds a different measurement target: harm over safeguard subsets and remaining deletion margin.

Masked Erosion operationalizes that target by evaluating harm for all subsets of four written safeguards and defining margin as the fewest further deletions needed to exceed a harm threshold. In each environment, a state is protected at harm ≤0.05. The study uses AppWorld credential misuse and OpsSim destructive cleanup; across 411 loops, mostly controlled one-layer deletions, it compares ten gate rules and adds three GEPA runs.

The results separate two failure modes. In 27 AppWorld stress loops with near-neutral deletions, the paired significance gate accepted 0.04 of proposals, versus 0.48 for greedy and 0.44 for split-half; greedy loops ended unprotected in five of six runs, paired loops in none. In OpsSim at cost 0.15, 20-task batches kept all six harnesses protected, while 40-task batches lost all six: significance testing did not block deletions with genuine task-success gains. Harm audits reduced observed exposure, but five of six audit-veto finals had margin 1; after reuse under Qwen3-30B, non-paired versus paired final credential misuse was 0.30 versus 0.004. GEPA kept the credential rules verbatim in all three runs, yet two finals misused credentials under Qwen3-30B.

For a researcher, the concrete operation is to evaluate each candidate’s current harm and its one-layer ablations, record remaining margin, and repeat the check under a weaker model. This separates present safety from retained resilience rather than treating unchanged safety text or current zero harm as sufficient.

Boundaries matter. The controlled design covers two environments, one harm, and four written safeguards per environment; most loops plant one deletion per generation, so it does not estimate how often deployed optimizers erode safeguards. Natural-edit and GEPA results are case studies, and GEPA has only three seeds. Long-horizon erosion is projected by chaining acceptance probabilities under fixed-pool and stationary-edge assumptions, not observed in long real runs. The authors treat the 20-versus-40 comparison as cleaner support for batch-size effects; the 120-task runs resampled a 60-task pool and some logged outcomes were affected by repeated draws and a cache race.

Read it to learn how to test whether a self-editing harness retains safety depth after a safeguard or model changes, rather than checking only current-model task success.

[abstract; §4.5; Table 3](https://arxiv.org/abs/2610.38392v1) · [§4, Guarantee](https://arxiv.org/abs/2606.08106v1) · [Section 3.3, Hypothesis-Test Denoising; Equation (11)](https://arxiv.org/abs/2609.36043v1)

## Batched Neighbours Change LLM Verdicts While AUROC Barely Moves

*[Judged in Company: In-Context Batching Makes LLM Verdicts Depend on Other Items](https://arxiv.org/abs/2610.40241v1)*

### The gap

Batching independent items is often presented as a cost-saving implementation, but its hidden assumption is stronger: a verdict should not depend on other items or its position in the prompt. An earlier screening study already showed that batch presentation changed more decisions than oracle prevalence metadata, and that an aggregate F2 gain could coexist with more article-level worsening than improvement. Its evidence was limited to five software-engineering reviews, two models, one prompt formulation, and one batch arrangement and execution per condition.

### What changes methodologically

Xie and Alanwar assign the same 2,000 items to different random batches of 25 across three judgment tasks and five open-weight models with 4–9B parameters. They compare partition-induced changes with renamed item keys and reworded instructions, then decompose flip rates into neighbour order, item slot, and neighbour membership. Follow-up experiments test permutation voting, majority decisions across 15 random batches, and token-level interventions that replace earlier verdicts, neighbours’ texts, or both.

### Decisive results

On harm and short-answer grading, a new random partition changes 11–22% of decisions. On the comparatively easy star-rating task, only 2.9–3.9% change. Yet, in the main five-model harm and grading comparison, AUROC of written levels against human labels changes by only −0.033 to +0.010. Aggregate ranking validation can therefore miss substantial item-level instability. For harm and grading, the decomposition attributes 0.42–0.69 of latent dissimilarity to neighbour order; slot and membership also contribute, although the slot–membership interaction estimates can be negative within sampling error. Nine-order permutation voting still leaves 52–60% of partition flips, and the majority of 15 random batches disagrees with the single-item decision for 8.4–17.8% of items. Token interventions show that both neighbour text and the model’s earlier verdicts can affect the target decision in the tested generation setup.

### Research use and boundary

For a researcher, I would report item-level flip rates under random regrouping and agreement with single-item grading alongside AUROC, while treating membership, order, and slot as experimental variables. The paper recommends grading ambiguous items one per prompt, recovering some batching cost with a cached prefix, and reporting agreement with single-item grading whenever items are batched. These conclusions are scoped: the main models are open-weight 4–9B, the four 14–32B follow-up models cover only harm and grading and omit intervention and voting studies, and proprietary models were not tested. Generalization to other languages, task formats, decoding strategies, conversational workflows, and prompt designs remains uncertain. The latent-scale and voting interpretations assume a Gaussian threshold model with common context variance, and the order-versus-interaction split relies on a five-designated-slot estimator.

Useful for researchers building LLM-as-a-judge or annotation pipelines because it turns a hidden batching assumption into measurable item-level tests and shows why permutation voting and aggregate AUROC do not guarantee single-item agreement.

[abstract](https://arxiv.org/abs/2610.40241v1) · [Section 5, paragraph 4](https://arxiv.org/abs/2608.14737v1)
