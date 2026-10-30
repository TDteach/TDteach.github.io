# 2026-10-30

## Item Construction Can Predict Automated-Interpretability Scores Without Reading the Explanation

*[Scoring Explanations Without Reading Them: Structural Shortcuts in Automated-Interpretability Evaluation Data](https://arxiv.org/abs/2610.37676v1)*

### Question

Automated-interpretability scores judge sparse-autoencoder (SAE) explanations by asking a model to predict, token by token, where a feature fires or whether marked tokens fit it. This paper tests whether the evaluation item itself can predict the answer without the explanation.

### Method and evidence

It defines an explanation-free rule as one that uses item construction—token positions, mark sets or counts, and sequence identity—but not the explanation. The study compares these rules with scorers on the same items, audits stored and locally built fuzzing and simulation pipelines, reconstructs missing marks where needed, and decomposes simulation correlation into within-sequence and between-sequence terms.

On Neuronpedia’s stored fuzzing runs for 500 random GPT-2 small features, 91.3% of activating examples had the peak on the centre token. A centre-token rule reached balanced accuracy 0.979, versus 0.838 for the stored LLM scorers; a mark-count rule reached 0.969. The marks for these position-dependent results were rebuilt from inferred pipeline code, so the count result is the safer shortcut comparison. Across pipelines, the cue changed form: current delphi negatives always mark a fixed slot, while Neuronpedia fuzzing negatives contain more marks than positives.

Sequence order supplied another shortcut. In OpenAI’s simulation benchmark, sampled over 400 neurons, predicting activity for the first five sequences reached pooled correlation 0.227, above the published GPT-4 simulator’s 0.160. This is evidence about information in the released ordering, not evidence that GPT-4 used that ordering.

### What to do with the result

The clean-window control is important. On 64-token natural-text windows cut at random offsets from OpenWebText, Jev scored 0.331 across 49 GPT-2 small features, versus 0.013 with shuffled explanations; an open Llama-3.1-8B-Instruct simulator scored 0.194 versus 0.019. These controls support explanation use beyond the tested shared position priors, but they do not establish general simulator ability. In a separate Jev comparison, stored scores correlated with crop geometry (0.512), yet the study did not show that geometry reordered feature rankings; sensitivity to partial reordering on real data was not established.

For a new evaluation, report the strongest explanation-free rule beside the scorer on the same items. For simulation, also report within-sequence and between-sequence components rather than treating pooled correlation as a single capability measure.

### Boundaries

Matched-mark negatives are proposed analytically but were not tested. Large-scale stored-run evidence comes from one SAE; the Gemma result uses 27 runs across 12 features, and delphi items were built locally. No current closed LLM simulator was run.

Use this paper to add an explanation-free baseline and clean-item control before comparing SAE explanations or simulator scores.

[abstract](https://arxiv.org/abs/2610.37676v1)

## Double-Stratified Evaluation Separates Prompt-Injection Exposure from Unsafe Tool-Action Commitment in AgentDojo Tests

*[Exposure Is Not Commitment: Double-Stratified Evaluation of Latent Monitors for Tool-Using Agents](https://arxiv.org/abs/2610.37679v1)*

### Why target definition matters

An internal monitor can score highly because it recognizes that an injection was present, without identifying whether the agent will comply. Earlier hidden-state work used immediate IPI exposure as its primary label; that label explicitly did not mean attack success, compliance, or a harmful tool action.

### What changes

This paper changes both the evaluation population and the training contrast. In AgentDojo-grounded tool-agent trajectories, exposure compares attacked-but-safe cases with clean cases; commitment compares unsafe cases with attacked-but-safe cases, using pre-action states. It contrasts a naive unsafe-versus-rest training population with an exposed-only unsafe-versus-attacked-but-safe population.

On the primary Qwen grid, the naive mixed contrast mainly detects exposure: among exposed cases, strictly pre-action AUROC was 0.556 for trained NLA text and 0.672 for an activation probe. When training uses only exposed cases, the activation probe reaches 0.853 for commitment prediction, with trajectories allowing at most two steps of lead time.

The decisive control is visible text. A TF-IDF logistic classifier reaches 0.855 on the same Qwen commitment task versus 0.853 for activations, so the in-distribution result does not demonstrate an activation advantage. On Mistral-7B and OLMo-2-7B, the exposed-only activation probes reach 0.896 and 0.912, respectively; their naive contrasts capture different axes across models.

Taken together, the paper’s result is about what the contrast asks the monitor to learn: an unstratified unsafe-versus-rest AUROC can reward exposure detection, whereas exposed-only training can reveal a pre-action commitment signal. The paper therefore treats contrast choice as a candidate explanation for conflicting pre-action-probe results.

### Research operation

A useful next experiment is to build the 2×2 evaluation first—clean versus attacked-but-safe for exposure, and attacked-but-safe versus unsafe for commitment—then train and test both contrasts, with a trained visible-text baseline. Report the two scores separately and inspect whether a monitor’s apparent gain survives within the exposed population. This makes the label, population, and representation comparison auditable before attempting steering or deployment.

The evidence is bounded. The strongest behavioral results use model-generated actions in exported AgentDojo-grounded trajectories, not interactive live rollouts. The three model families share the AgentDojo benchmark, so benchmark-independent transfer is not established. Operational false-alarm costs and deployment-prevalence performance are not established, and the attacks are non-adaptive; adaptive evasion was not measured.

To learn how to test whether a monitor predicts unsafe action among exposed cases instead of merely detecting injection content.

[abstract; Section 7, paragraph 4; Table 1; Section 7, paragraph 4; Table 1; Appendix C, paragraph 3; Section 7, paragraph 6; Appendix F, Table 3; Section 7, paragraph 1; Section 8, paragraph 1; Section 8, paragraph 1; Appendix C, paragraph 3; Appendix E, paragraph 1](https://arxiv.org/abs/2610.37679v1) · [Appendix A, Label semantics](https://arxiv.org/abs/2608.02657v2)

## CLadder Accuracy Alone Does Not Establish Formal Causal Reasoning

*[Evaluating Causal Reasoning in LLMs: A Case Study in the Challenges of Procedural Generation](https://arxiv.org/abs/2610.38100v1)*

CLadder is a procedurally generated benchmark for formal causal reasoning. The paper asks what can actually be inferred when an LLM performs well on its generated test sets—not whether a model can ever reason causally. Its central warning is that benchmark accuracy can coexist with answer-predictive structure in the generator, so a high score alone does not establish formal causal reasoning.

Clarke et al. turn that warning into a diagnostic audit. They inspect the generator and describe three levels at which answer determinism can enter: parametric, structural, and formula-level. In practical terms, a story identity, graph structure, or polarity flag can sometimes predict the answer independently of the numerical information displayed. This is an analysis of the benchmark’s construction, not a measurement of how often a particular model uses each pattern.

They then train simple random forests on generated CLadder examples. The abstract reports that these non-LLM models perform well after seeing a sample of generated data, weakening the inference that strong benchmark accuracy necessarily requires formal causal computation. The authors also perturb the test prompts: commercial LLM performance is described as brittle, and removing large sections that are critical for formal causal reasoning has almost no effect on performance. These interventions directly test whether model performance changes when the prompt loses information the intended calculation requires.

The paper’s most likely explanation is therefore exposure to superficial patterns learned from generator data, not established formal reasoning. That is a hypothesis, not proof that every CLadder answer is produced by a shortcut; the paper says any stronger causal-reasoning inference must rule this explanation out. For a new procedural benchmark, the reusable operation is to inspect the generator for deterministic answer regularities, train a simple model on generated examples, delete information required by the intended inference, and evaluate on data produced outside the original generation process. This sequence tests whether scores survive removal of task-relevant information and transfer beyond the generation process.

One boundary matters for interpreting the audit: the authors did not apply CLadder’s surface-level interventions when generating their experimental dataset, so the reported evidence is tied to their stated generator configurations rather than every robustness split. The practical takeaway is not to discard CLadder, but to treat its scores as one measurement that requires shortcut, ablation, and transfer checks before being interpreted as formal reasoning.

Read this if you use procedurally generated reasoning benchmarks and need a concrete audit for separating generator predictability from the capability a benchmark is meant to measure.

[abstract; Appendix A.7, opening paragraph; Appendix A.3, paragraph 3](https://arxiv.org/abs/2610.38100v1)

## Model-Derived Scores Need Reliability Gates and Protocol-Specific Rankings

*[Measured or Real? When Model-Derived Measurements Can Be Corrected or Compared](https://arxiv.org/abs/2610.38015v1)*

Model-derived numbers can vary with seed and prompt, so a benchmark lead or difficulty score is not automatically a stable scalar. The paper asks when such measurements can be corrected or compared, rather than treating every reported number as directly comparable.

The previous failure mode is concrete: textbook disattenuation divides an observed correlation by the square root of two estimated reliabilities. Under Proposition 2’s conditions, the plug-in correction can have an infinite second moment even when the observed correlation and reliability estimates use disjoint seed blocks. In the CIFAR-100 demonstration, it exceeded one in magnitude in 70 of 100 classwise scores. The practical lesson is to test whether reliability is estimable before applying a correction.

Algorithm 1 gates both reliability estimates with significance tests; if either gate fails, it returns the clipped uncorrected correlation, and otherwise divides by upper confidence bounds before clipping. The output is therefore bounded in [-1,1], while the coverage claims for those bounds assume a balanced Gaussian one-way model. In a simulation with 500 units, three replicates per unit, true correlation 0.4, reliabilities 0.2, Gaussian noise, and 2,000 runs, the gated correction had MSE 0.048 versus 0.105 for the uncorrected estimate; its benefit depended on enough units to estimate reliability.

For model comparisons, Algorithm 2 treats prompt configurations as named protocols rather than silently pooling them. It compares paired per-item correctness gaps, constructs simultaneous max-t intervals across model pairs and protocols, and returns certified, protocol-dependent, or refused verdicts under a fixed prompt grid and shared scoring. In the reported ARC comparison, Qwen2-1.5B trails Llama-3.2-3B by 3.8 points zero-shot but leads by 16.6 points two-shot. Across four benchmarks, pooling the two settings named one winner for 15 of 16 such reversals.

A separate alignment experiment raised held-out per-dimension reliability from 0.003 to 0.813 in a ResNet-18 CIFAR-100 setup. The boundaries matter: Algorithm 1’s inferential guarantees rely on the balanced Gaussian one-way model, strong heteroscedasticity reduces exact-F coverage, and the max-rule branch has no reported MSE or coverage evaluation. Algorithm 2’s family-wise error guarantee is asymptotic, assumes independently sampled items and a fixed prompt grid shared by all models, and does not cover unseen prompts or other harnesses. The per-protocol verdict rule can also refuse comparisons that pooling resolves.

For a new evaluation, write down the estimand, unit, replicate sources, and prompt grid before choosing a correction or leaderboard summary. If settings can change the estimand, report their verdicts separately; if reliability fails its gate, preserve that uncertainty instead of manufacturing a corrected number.

Read this paper to learn a concrete audit procedure for seed-sensitive scores and prompt-sensitive rankings: it shows when naive reliability correction becomes mathematically unstable and how protocol-specific inference can prevent a pooled leaderboard from hiding a reversal.

[abstract; Section 3.2; Proposition 2; Section 3.3; Algorithm 1; Proposition 3; Section 3.4; Table 3; Appendix D.1; Section 3.5; Appendix E.2; Section 4.2; Algorithm 2; Section 4.3; Tables 4 and 5; Appendix G.8; Section 5; Appendix H; Table H.1; Section 7, Limitations; Sections 3.3 and Appendix E.4; Section 7, Limitations; Section 4.2; Section 7, Limitations; Table 5](https://arxiv.org/abs/2610.38015v1)

## A decoy-tested checker conservatively traces some AI-written paper numbers to recorded results

*[Beyond fabrication: Misattributed numbers in papers written by AI research agents](https://arxiv.org/abs/2610.38691v1)*

## What changed

A prior benchmark evaluates a research workflow in which agents receive an original paper, its code and data, and a specified direction, then return a paper, code, and logs for rubric-based grading. Its automated integrity verdicts can flag failure without explaining whether a numerical issue is fabrication, absence from available artifacts, or misattribution. This leaves a concrete audit gap: value presence is not the same as provenance.

This paper changes the unit of analysis from the submission-level verdict to the numerical claim. The authors re-analyze all 540 released judgments from nine agents across 15 research problems and manually label 256 numerical claims from 18 submissions. Their deterministic checker scores whether the surrounding context identifies the claimed result and calibrates each claim against numerical decoys. The strict operating point was fixed before claims were labeled, separating checker design from confirmation labels.

The decisive diagnosis is that unsupported numbers were often not invented. Of 53 unsupported claims in the labeled samples, 47 were classified as wrong-source cases, with a population-weighted wrong-source share of 81%; a value not found in the available artifacts is absent from those artifacts, not thereby proven fabricated. At the strict operating point, the checker certified 85 of 211 labeled real claims, of which 78 were traceable; this corresponds to 92% precision, while coverage remained limited. On the held-out confirmation sample, it certified 27 of 29 traceable claims. That positive result should be read conservatively: many uncertified claims were also traceable—19 of 31 in the held-out sample—so non-certification is not evidence of falsehood.

The comparison with an LLM verifier sharpens the operating choice. Given the same evidence, the LLM verifier recovered more traceable claims but accepted substantially more non-traceable claims than the strict deterministic checker; the authors recommend it for triage rather than final verification. Applied to 99 submissions, the checker found substantial differences in certification rates across agents, broadly consistent with the official integrity assessments, but certification is only a lower bound on traceability.

The boundary is essential: the checker certifies provenance, not correctness; the underlying experiment may still be flawed. These findings come from one benchmark, nine agents, and 15 computational and physical-science tasks, with reference labels produced by two members of the research team. For an audit design, the transferable operation is to require a positive claim-to-context match, challenge it with nearby numerical decoys, and send non-certified claims to review rather than treating them as false.

Read this to learn a conservative audit pattern for AI-generated research: distinguish a number appearing in an artifact from that number being attributed to the correct experiment, metric, and run.

[abstract](https://arxiv.org/abs/2610.38691v1) · [Section 2.1, 'Task formulation', paragraph 1](https://arxiv.org/abs/2610.19159v1)
