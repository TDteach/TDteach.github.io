# 2026-10-10

## The paper attributes activation-probe synthetic-data needs to cross-kind coverage, not per-kind difficulty

*[Coverage, Not Difficulty, Sets How Much Synthetic Data an Activation Probe Needs](https://arxiv.org/abs/2610.10594v1)*

An earlier supplied study focused on detecting high-stakes interactions with activation probes. This paper changes the experimental question by comparing high-stakes situations, replies harmful to a person, and replies that do not follow the user’s instruction. It asks whether different sample requirements reflect intrinsic concept difficulty or how well one kind of conversation covers another.

The study traces learning curves from 10 to 590 synthetic samples across fourteen held-out evaluation distributions and four probe models, varying both the generator LLM and prompt detail. Per-split curves are summarized with a fitted half-gain size: the sample count at which half of the curve’s total gain has been reached. The analysis also relates each distribution’s own-kind requirement to transfer between conversation kinds.

The main detailed-prompt experiment shows the practical gap. On Gemma-3-27B-IT at layer 32, every high-stakes curve saturated at 110–170 samples, three of four harmful curves saturated at 110–350, and no instruction curve saturated below 350; two instruction curves were still gaining at 590. The fitted median half-gain sizes were 22 samples for high-stakes and harmful, versus 164 for instruction. These saturation locations are uncertain by about one listed size.

The mechanism result shifts attention from depth to coverage. Every kind, one per evaluation distribution, had a median half-gain size of 7–11 own-kind synthetic samples under all three concepts. What differed was transfer: samples of one kind covered other kinds almost fully for high-stakes, less for harmful, and least for instruction. The authors’ decomposition attributes 79% of the instruction-versus-other-concepts gap on generated samples, and 66% on real dev-set samples, to this coverage difference.

A concrete research operation follows: tag generated conversations by kind, measure cross-kind transfer, and use that signal to decide whether the next batch should add kinds or add depth within existing kinds. The proposed transfer-AUROC rule is a coarse multiplier for relative depth needs, not a point prediction of a split’s absolute sample requirement. Treat the result as bounded evidence: the ordering was tested on only three monitoring concepts and fourteen evaluation splits, so extension to other targets remains open. Half-gain estimates are also less secure for curves still climbing at 590 samples.

Read it to decide whether a new synthetic-data batch should broaden conversation kinds or deepen existing kinds, while treating transfer as a relative budgeting diagnostic rather than an absolute sample-count forecast.

[abstract](https://arxiv.org/abs/2610.10594v1) · [abstract](https://arxiv.org/abs/2506.10805v4)

## RAG-Stress Measures Wrong-Evidence Adoption After Correct Closed-Book Answers

*[RAG-Stress: Probing the Limits of Evidence Reliance in Retrieval-Augmented Generation](https://arxiv.org/abs/2610.11183v1)*

RAG-Stress is best read as a measurement-design paper, not as a mitigation. Earlier RECALL already separated answer-bearing from non-answer counterfactual edits and compared original, edited, and no-context conditions; baseline-correct conditioning alone is therefore not the new point. RAG-Stress narrows the target to a behavioral transition: when a model is correct without retrieval, does edited evidence make it emit a designated incorrect answer?

For each question, the authors hold the question and reference answer fixed, edit one assertion so the passage supports a designated foil, and move the answer span to the beginning, middle, or end while keeping document order fixed. They cross this edit with Soft instructions, which permit prior knowledge to override conflicting documents, and Strict instructions, which prioritize documents. Misleading rate (MR) is computed only on each model’s closed-book-correct questions and counts responses matching the foil but not the reference; clean accuracy is reported on the full evaluation set. This denominator is the key methodological change in interpretation: it separates evidence-induced foil adoption from errors the model already made.

Across fifteen systems, equal averaging over models and positions produced higher Strict than Soft MR, with Strict–Soft gaps of 10.9–13.5 percentage points on TriviaQA-RC, HotpotQA, and SearchQA. Mean MR was highest when the answer span appeared at the end and lowest in the middle, but this was an aggregate pattern rather than a rule for every model. In a separate paired audit of 500 items and two checkpoints, Strict increased harmful override at both checkpoints, while the data did not establish a corresponding beneficial-correction gain.

Read these results narrowly. Strict versus Soft deliberately changes the requested conflict-resolution policy; it is not a general robustness ranking or evidence about internal attention. The fifteen-system rate tables are descriptive, without paired uncertainty intervals, and their baseline-correct cohorts differ. The 500-item audit verifies lexical construction and response scoring rather than independent semantic validity, so it is less secure than the main sampled human validation. The output changes also do not establish changed parametric knowledge or isolate the causal effect of editing.

For a new RAG evaluation, copy the accounting rather than the headline number: pre-register a closed-book-correct cohort, define a foil-only transition, report clean accuracy separately, and test whether an intervention reduces harmful replacement without merely suppressing beneficial correction. This turns “the model followed the source” into a falsifiable question about which answers it preserved, replaced, or corrected.

Use this paper to learn how to turn a RAG accuracy test into a baseline-correct foil-adoption test, while checking whether prompt changes trade harmful overrides against beneficial corrections.

[Abstract; Sections 4.3 and Appendix E, Tables 13–14](https://arxiv.org/abs/2610.11183v1) · [§2.5, Adding Counterfactual Information; §3.2, Experimental Settings](https://arxiv.org/abs/2311.08147v1)

## Public clinical benchmarks covered only a minority of one assistant’s observed task mix

*[Clinician use of language models diverges from how the models are evaluated](https://arxiv.org/abs/2610.11069v1)*

### The comparison changed

Two supplied evaluation designs illustrate different moves beyond exam-style question answering. HealthBench Professional released 525 physician-authored clinician-chat tasks across care consult, writing and documentation, and medical research. Real-POCQi used physician-originated queries from a live tool and specialty-matched, blinded comparisons. This paper changes the unit of analysis: it asks whether benchmark task distributions resemble deployment use, rather than only how systems answer a selected set.

The authors analyzed 127,625 annotated first clinician turns from 6,342 clinicians using one institutional assistant. RCQ-Map records task, intent, answerability, missing information, potential harm, and safest response. They applied the same framework to 10,659 items sampled from 58 public benchmarks, up to 200 per benchmark, and measured coverage as one minus total variation distance between task distributions. In a 100-query clinician-validation sample, the LLM annotator’s agreement with a held-out clinician was similar to the held-out clinicians’ agreement, with modest agreement on several fields.

Documentation and administration (36.2%) plus knowledge retrieval (28.9%) made up nearly two-thirds of observed use; diagnosis was 3.7%. More than a third of requests (36.1%) could not be answered well as posed, including 22.2% needing patient or local institutional information absent from the query. The median benchmark shared 31% of the deployment task mix and contained no documentation or administrative requests. Practice-oriented suites were not demonstrably closer to the observed workload than benchmarks used in frontier-model reports. This supports the authors’ interpretation that examination-style sets provide little coverage of when a system should clarify or retrieve rather than answer directly.

The paper also supplies a useful safety-evaluation lead: text-observable features identified high- or critical-risk queries at AUC 0.78, but capturing 90% of them required flagging 60% of all queries. For a researcher, the reusable operation is to log requests, freeze a task taxonomy before scoring, report distributional coverage, and then evaluate answers within task, answerability, and response-route strata. Treat the risk classifier as a triage hypothesis, not a safety proof.

Scope matters. The workload comes from one academic health system and assistant, and other clinician tools were not observed. First-turn analysis missed later requests; 9.0% of first turns had no recoverable request. The risk labels concern potential, not observed, harm, and clinician agreement was modest for harm, missing information, and safest response. The benchmark sample was author-selected and limited to public English text-only sets, so private or newer evaluations may differ.

Useful for researchers designing evaluation sets: it provides a concrete deployment-to-benchmark coverage audit and shows why task prevalence, missing context, and safe response routing should be measured alongside answer correctness.

[abstract](https://arxiv.org/abs/2610.11069v1) · [Section 2, HealthBench Professional](https://arxiv.org/abs/2604.27470v1) · [§2.1 Overview of the benchmark and evaluation study, paragraph 1](https://arxiv.org/abs/2606.28960v1)

## Delayed-label evaluation changes measured conclusions about forecasting test-time adaptation

*[Training on the Future: A Delay-Aware Audit of Test-Time Adaptation for Time-Series Forecasting](https://arxiv.org/abs/2610.12232v1)*

An H-step forecast’s target exists only H steps later, while real pipelines can add further delay. The audit addresses the resulting protocol risk by withholding the target window for origin `s` until step `s+d`, with `d ≥ H`, and enforcing that rule inside the released implementations of TAFAS, COSA, PETSA, and DynaTTA.

The method adds a deliberately simple reference rather than judging adaptation only against neural adapters. The RLS-Bank fits per-channel, per-horizon linear corrections from the frozen forecast and two causal deviation features, uses six forgetting factors plus a passthrough expert, and aggregates them with a per-coordinate median. Each expert updates only when its labels mature.

Delayed-label causal adaptation is not itself the novelty: Act-Now already separates immediate partial-feedback updates from parallel updates using delayed complete labels. The papers address different objects, however: Act-Now is a streaming-training framework, whereas this work audits released TTA implementations across label-release timings and adds a closed-form reference.

The results are asymmetric. On ETTm1, every audited method genuinely adapts, but the RLS-Bank beats three of four; only DynaTTA beats the bank at the minimum causal delay, at roughly 2,500 times its per-update cost, while the ELF-style corrector beats all four published methods. Outside ETTm1, the largest statistically significant improvement by an audited published method over its own frozen checkpoint is 0.5% on Traffic in this test set. On all four of those datasets, at least one published method is significantly worse than its frozen model at the minimum causal delay. On drift-heavy ETTh2, longer delays make every adapter that separates from the frozen model, including the bank, significantly harmful.

The protocol itself can dominate the apparent gain: in the reported ETTh2 bias-EMA cells, causal MSE was 83% and 110% higher than leaky MSE. Backbone choice also needs isolation; on Electricity, the reported PatchTST training recipes produce frozen online MSEs differing by about a factor of 25, larger than the adaptation effects measured in the paper.

For a new experiment, make label release a declared input: test `d=H` and larger delays, retain a frozen checkpoint, add a cheap closed-form comparator, and report the backbone training recipe before attributing changes to adaptation. Treat the conclusions as conditional, not universal: the external audit uses one deep architecture, PatchTST; Weather, Electricity, and Traffic each use one checkpoint and a reduced external method set. The ELF-style reference is unavailable for the 321- and 862-channel streams, the RLS-Bank median can fail when most experts are harmful, and the bootstrap may understate uncertainty when dependence extends beyond twice the seasonal period.

Read this when designing a forecasting-TTA benchmark: it provides a concrete way to expose label leakage and separate adaptation effects from baseline and backbone-training effects.

[abstract; Section 4, Per-coordinate correction; The bank, and why a median; Section 5.2, ETTm1 is the positive control; Section 5.2, Weather, Electricity, Traffic: the frozen model and the closed-form correctors set the pace; Section 5.2, ETTh2: one statistical cluster at the minimum delay, harm beyond it; Section 5.1, fourth pattern; Appendix B, Table 3; Section 5.4, Diagnostics: label staleness, plasticity and the training recipe; Section 7, Limitations; Appendix E, Bootstrap Details; Section 6, When Closed-Form Adaptation Fails](https://arxiv.org/abs/2610.12232v1) · [Section IV-C, Streaming Buffer Mechanism](https://arxiv.org/abs/2412.00108v1)

## LGWM uses action-conditioned latent forecasts to verify GUI transitions

*[Right Screen, Wrong Transition: World Models as Verifiers for GUI Agents](https://arxiv.org/abs/2610.11942v1)*

Safety in GUI agents depends on the transition, not merely the endpoint. The paper’s motivating example is that a login screen after “Sign in” is expected, while the same screen after “View order” can signal an attack. A screen-only monitor can therefore be defeated by reusing a legitimate screen, and existing world models that output text, code, or images require a second model to judge the prediction against the observed screen.

The methodological change is narrower than “representation-space prediction is new”: I-JEPA already predicted learned target representations, and DINO-WM already predicted action-conditioned future patch features. LGWM’s described change is to use a latent next-state forecast as a verifier against the observed outcome, rather than as an input to goal-directed planning. LGWM predicts the next GUI state directly in the visual encoder’s spatial representation, enabling direct comparison with the encoded observed state without a decoder or separate judge. The paper trains it without semantic annotation on 1.85M real GUI transitions. At runtime, verification reduces to comparing the predicted and observed representations.

On RSWT-BENCH, where each credential screen appears under both legitimate and hijacked transitions, the training-free latent alignment score achieves 0.987 AUC on the benchmark’s identical-screen, opposite-transition test. The paper reports 17 ms per decision for this score. Its residual direction reaches 0.953 AUC at separating harmful from benign violations. The 0.953 Harm AUC result is not training-free: distinguishing harmful from benign violations requires a supervised linear head trained on a disjoint labeled split. Retrieval and counterfactual-action diagnostics support that the forecast contains transition-specific future-state information and responds to action identity, target, and touch location.

RSWT-Bench’s central paired test has 222 donor pairs. The construction controls outcome-only shortcuts, but its restricted sample and credential-screen focus limit how broadly the result establishes real-world GUI safety performance. The paper also does not quantify whether an adversary can deliberately craft an outcome that evades comparison in the learned representation space.

For a new agent, the transferable experiment is to build donor-paired transitions with identical observed outcomes but different preceding actions, report latent inconsistency separately from harm classification, and test counterfactual action swaps. That setup asks whether a monitor learned the transition—or merely recognized a plausible screen.

Read it to learn how to design a verifier that compares an action-conditioned forecast with the observed GUI state, then stress-test it with paired cases sharing the same outcome.

[abstract](https://arxiv.org/abs/2610.11942v1) · [Section 3, Method; Figure 3 caption](https://arxiv.org/abs/2301.08243v3) · [Section 3.1.1](https://arxiv.org/abs/2411.04983v2)

Prepared retrospectively from the 2026-10-10 candidate papers; verified on 2026-10-14.
