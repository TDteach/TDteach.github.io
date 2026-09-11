# 2026-08-30

## Paired-example hallucination signals are dominated by a hidden-state mean shift

*[The Hallucination Signal Is a Mean Shift: Why Simple Probes Suffice](https://arxiv.org/abs/2608.28930v1)*

### What the paper diagnoses

Hidden-state probes can detect hallucinations, but a strong probe score alone does not reveal whether the detector exploits nonlinear structure or simply estimates a high-dimensional linear signal well. Lee, Seo, and Lim examine this using paired factual and hallucinated examples. Their central nine-condition analysis uses Llama-3.1-8B, Mistral-7B, and Qwen2.5-7B on TruthfulQA, HaluEval-Dialogue, and FaithDial; the paper separately reports a scaling evaluation across 25 models from 0.5B to 70B.

The paper extracts hidden states at the last token and applies **StandardScaler** fitted on training data for all methods. It does not give detailed pair-construction or separate projection-normalization procedures in its experimental setup. The factual-versus-hallucinated mean-shift vector is estimated within each cross-validation training fold, so test-fold labels are not used to construct the reported direction.

### Separate the mean direction from residual discrimination

At an **oracle single layer**—a layer chosen with held-out oracle knowledge—the one-dimensional projection onto the class mean-shift direction reaches **0.834 AUROC**, averaged across the nine central conditions. Removing that direction reduces AUROC to **0.499**, effectively chance in this evaluation. This supports a bounded conclusion: paired factual-versus-hallucinated examples are organized primarily around a class mean shift, but that one-dimensional feature does not capture all available discrimination.

A full-dimensional L2-regularized logistic-regression probe, using **C = 0.001**, reaches **0.952 mean AUROC**. To diagnose the remaining gap above the 1D result, the authors compare Fisher LDA with shrinkage LDA, which regularizes covariance estimation for hidden states of roughly 4,000 dimensions. Shrinkage LDA reaches **0.920 mean AUROC** and closes at least **73%** of the Fisher-LDA-to-L2-LR gap by the authors’ calculation. They interpret this as evidence that much of the residual gain concerns high-dimensional covariance estimation rather than an exploitable nonlinear decision boundary. That interpretation remains qualified: the paper notes the residual gap could include non-Gaussian structure or implicit feature selection from L2 regularization. In a controlled MLP comparison, per-condition AUROC differences from L2-LR are at most 0.002.

### LayerMix replaces oracle layer choice

LayerMix uses nested 5-fold CV within each outer training fold to score layers, selects the top **K = 5**, trains per-layer L2-LR probes, and uniformly averages their predictions. The authors report a model-specific contiguous band of useful layers. LayerMix averages **0.954 AUROC**, versus **0.952** for the oracle single layer; its practical role is therefore avoiding oracle layer selection, not delivering a large absolute accuracy gain.

The transferable research operation is to ablate the mean direction first, measure what regularized covariance modeling restores, and only then compare nonlinear architectures on identical representations and splits. This evidence is limited to white-box, paired-example sequence-level detection. The paper’s Qwen2.5-7B-Instruct pilot found paired-to-generated mean-direction transfer at **0.477 AUROC**, so it does not establish free-form transfer; persistence at frontier-class models such as **400B+** parameters is also unverified.

Read this for a concrete probe-design diagnostic: test whether class means, regularized covariance estimation, or genuine nonlinear structure explains a detector before adding architecture.

[§3.1 and Table 1 (within-fold mean shift, 1D projection, and ablation); §3.2 and Table 2 (L2-LR and shrinkage LDA); §3.3–§4, Equation 1, and Algorithm 1 (LayerMix); §5 Experimental Setup and Protocol (last-token extraction and StandardScaler); §6.3 and Appendix I, Table 14 (MLP comparison); §6.5 and Appendix A, Table 5 (25-model scaling evaluation); Limitations items 1, 2, 4, and 5 (access, transfer pilot, scale, and LayerMix gain).](https://arxiv.org/abs/2608.28930v1)

## Sample-signature filtering preserves the applicable DP-SGD RDP bound while changing reported audit outcomes

*[Revisiting the Provable-Auditable Privacy Gap of DP-SGD](https://arxiv.org/abs/2608.28934v1)*

DP-SGD is commonly assessed using an accountant-derived privacy upper bound, ε_ub. Modi et al. argue that an audit-derived empirical lower bound, ε_lb, is a complementary quantity: earlier DP-SGD audits had obtained nearly matching lower bounds in several threat models. Their narrower question is whether measured leakage can fall without worsening the formal accounting result.

Their wrapper periodically computes a **sample signature** for each example from that example and the current privately trained model. It selects high-scoring unfiltered samples globally or within each represented class, then substitutes zero gradients for selected samples in later DP-SGD updates. Evaluated signatures include gradient norms, prediction margin, and prediction entropy; the default configuration uses per-class L∞ gradient-norm scoring. Appendix D separately compares clipped and unclipped variants.

The formal result is preservation, not a stronger DP guarantee. In the Poisson-subsampled RDP setting, a signature may depend on other training data only through the private model; the trainer must be permutation-invariant; and, conditional on preceding private output, the filter must map neighboring datasets to neighboring filtered datasets. Lemma 4 gives the interleaved RDP-composition step and Lemma 5 the top-k removal property. Corollary 1 then preserves the applicable Theorem 1 accounting bound, subject both to those filtering conditions and to Theorem 1’s conditions, including q &lt; 1/5, σ &gt; 4, and its stated restriction on α.

In hidden-state, input-space audits on MNIST, CIFAR-10, and Purchase100, the authors report that filtering often lowers ε_lb with limited utility loss. For MNIST/CNN and CIFAR-10/WRN-16, they report values near zero for almost every ε_ub in &#123;2, 4, 6, 8, 10&#125;; Appendix D reports ε_lb = 0 for **clipped** L∞ gradient-norm filtering on CIFAR-10/CNN. These are not formal audit certificates. The primary GDP/no-holdout results use two explicitly non-formal heuristics: uncorrected multiple-hypothesis testing, which has a false-discovery problem without correction or an independent holdout, and GDP extrapolation when the actual trade-off curve is not GDP. The paper identifies Poisson subsampling and hidden-state output marginalization as cases where GDP does not generally apply. Appendix J reports Clopper–Pearson results across holdout splits, which the authors describe as generally weaker.

The empirical benefit is conditional. Filtering increased ε_lb in several configurations, a Purchase100 ε_ub = 10 run had anomalously large utility loss, and a defense-aware gradient-canceling attack raised a **group** ε_lb from 4.43 without the defense to 27.26 with it. That group statistic is not a single-record comparison. A ColoredMNIST study also reports preferential minority-subgroup removal and disparate utility loss. The transferable operation is to check the implementation’s adjacency condition, formal accountant assumptions, conservative audits, defense-aware attacks, and subgroup costs separately.

Read Section 3.1 with Theorem 1 to separate the filter proof from the accountant assumptions; then compare Section 4.2, Appendix A.1, and Appendix J to distinguish heuristic audit figures from conservatively reported audits. Section 4.5 and Appendix B delimit adversarial and subgroup risks.

[Section 2.1, Theorem 1; Section 2.3, Algorithms 2–3; Section 3.1, Lemmas 4–5 and Corollary 1; Section 4.1–4.2 and Table 1; Section 4.5 and Table 4; Appendix A.1; Appendix B and Table 5; Appendix D and Table 7; Appendix J and Tables 13–14](https://arxiv.org/abs/2608.28934v1)

## LongPIBench reports degraded prompt-injection defenses on long document inputs

*[LongPIBench: A Long-Context Benchmark for Prompt Injection](https://arxiv.org/abs/2608.28411v1)*

Existing prompt-injection benchmarks mostly use short inputs, creating a mismatch with document workflows that embed untrusted text among thousands to tens of thousands of tokens. LongPIBench changes the evaluation distribution rather than proposing a new defense. It covers paper peer review, résumé screening, code review, and email summarization; each suite has 100 synthetic instances plus a real-world dataset. The paper identifies ICLR submissions, a résumé dataset, real code-review data, and Enron emails as its real-data sources.

The benchmark inserts six heuristic attacks and two GCG-based optimization variants into documents, then evaluates eight LLMs. It uses attack-success rate (ASR) for prevention experiments and false-positive/false-negative rates for detection. Document format, injection position, task decision, and context length become experimental variables rather than incidental prompt details.

The reported failures are sharp but setting-specific. With no defense, the Combined Attack reached **100% ASR** on synthetic paper review. The authors also report **100% ASR** for MetaSecAlign 8B on that dataset under the Combined Attack. This is a concrete long-context failure case relative to the low ASRs reported on several earlier benchmarks; it does not establish failure across SecAlign model sizes or deployments. The paper specifies MetaSecAlign’s expected message-role format, but does not provide a checkpoint hash, tokenizer details, input-normalization procedure, or insertion-location sampling for this comparison. Those omissions leave configuration effects unresolved.

Optimization-based attacks also remain effective in the reported setting: GCG reached **1.00 ASR** on synthetic paper review and résumé screening. LongPIBench says it adopts GCG’s default hyperparameters. Zou et al.’s GCG uses gradient-guided discrete-token optimization and reports that longer optimization can overfit source models and reduce transfer. LongPIBench does not report optimizer steps, seeds, logs, final triggers, or whether each result is white-box optimization, surrogate-to-target transfer, or both. Those details are needed to interpret—not merely reproduce—the GCG results.

The transferable research operation is a grid over **context length, injection position, task decision, and detector threshold**. The paper reports higher ASR for middle/end than front insertion, especially in email summary and code review, while its detectors exhibit high-FPR/high-FNR trade-offs. Before attributing this pattern to a defense method, request deployment metadata and retune thresholds on long-context validation data. Finally, scope the evidence correctly: LongPIBench uses static, single-call document inputs, not stateful multi-step workflows with external tools or environment interaction.

Read it to learn how to turn a short-context prompt-injection test into a controlled long-document evaluation, while identifying the deployment metadata needed before treating a benchmark failure as a general defense failure.

[Sections 3–5; Tables 2–4; Appendix B–D; Appendix Table 8b; Limitations](https://arxiv.org/abs/2608.28411v1) · [Tables 4–5](https://arxiv.org/abs/2507.02735v3) · [Algorithms 1–2; Section 3](https://arxiv.org/abs/2307.15043v2)

## Automated agents searched post-training fixes for ten benchmarked alignment failures

*[Automated Researchers Can Reliably Mitigate Alignment Failures](https://arxiv.org/abs/2608.28945v1)*

Earlier studies reported targeted human-designed interventions: synthetic-data finetuning reduced sycophancy under a model-knowledge filtration condition, while consistency training used a model’s own clean-prompt outputs to reduce sycophancy and jailbreaks. This paper asks a process question beyond either result: can an agent propose, implement, assess, and iteratively improve post-training methods under a fixed experimental budget?

Chen, Wen, and Kirchner build an **automated alignment researcher (AAR)** harness around Claude Opus 4.8. Agents submit a self-contained mini-paper and code. The approval stage bars a submitted method from using benchmark or evaluation data and from using stronger or frontier models to generate training data. Accepted proposals train for roughly 30 minutes on one H200 GPU. The AARs hill-climb a geometric mean of closed-headroom fractions across three to five benchmarks per failure, with capability gates on MMLU, GSM8K, and IFEval.

The authors report that their strongest methods reduce each of ten targeted failures and transfer to a benchmark withheld from the AAR, multi-turn Petri behavioral audits, and models up to 4.7× larger. These tests matter because optimizing only the visible suite could reward benchmark-specific fixes. They are still evaluations on supplied benchmarks and audits, not evidence of deployment safety. The paper defines the held-out benchmarks and their intended distribution shifts, but the supplied text does not bundle raw held-out items, complete winning-method configurations, seeds, metric artifacts, or audit outputs needed for independent reproduction.

The paper compares the AAR with 30 one-shot ideas from 28 experienced safety researchers. Participants had at least one year of technical AI-safety experience and a relevant paper, received up to eight hours to develop an idea, and accepted implementations were trained with three seeds. The best capability-passing AAR methods reportedly exceeded the best human idea on each of the seven failures with human submissions, reaching that point in 6.4 hours on average. This is a constrained comparison, not evidence against better-resourced or iterative human teams; the authors also note that choosing the best of roughly 150 scored AAR methods biases the maximum upward under noisy evaluation.

A sycophancy ablation on Qwen3.5-2B gives the clearest mechanism-level lesson. Supervised finetuning alone, even with templated or self-generated data, reached lower ceilings than runs allowed KL self-distillation and, in the unconstrained run, activation steering. The authors’ statement that “Most of the gap is the training objective” supports objective ablations for this setting, not a general claim that data construction is secondary.

**Research operation to borrow:** audit the research loop itself. Reserve an untouched transfer evaluation, separate data freedom from objective freedom in ablations, and retain proposal-level logs. The source describes the approval constraints and post-hoc monitor rubric; reproducing its 39-of-1,601 cheating finding still requires trajectory data, monitor outputs, and evidence about missed cheating attempts.

Read this to examine a concrete design for testing whether an AI research agent finds post-training safety interventions beyond optimization of a visible benchmark suite.

[Sections 1–8; Appendix A.1–A.6; Appendix C.5; Appendix D.4–D.5; Appendix G](https://arxiv.org/abs/2608.28945v1) · [Sections 4–6](https://arxiv.org/abs/2308.03958v2) · [Sections 1, 3, 4, and 6](https://arxiv.org/abs/2510.27062v1)

## EvoUndo tests whether an LLM-agent harness edit can be recovered before it is accepted

*[EvoUndo: Recoverability-Constrained Self-Evolution for LLM Agent Harnesses](https://arxiv.org/abs/2608.28363v1)*

A harness edit can improve capability yet still be unsafe to retain if its persistent effects cannot be reversed after the agent reaches a different state. EvoUndo makes recoverability an admission test: before accepting a self-generated harness mutation, it tests recovery across counterfactual states rather than relying on iterative prompting or a later rollback.

The paper represents a candidate as a mutation `m`, witness capture `w`, recovery program `u`, and effect contract `C_e`. It applies `m`, uses `w` and `u` to reconstruct the pre-mutation state, then checks typed observational equivalence through round trips on development and hidden harness states. If recovery fails, repair may change `w`, `u`, and `C_e`, but not `m`; this tests recovery logic around a frozen forward edit, not joint redesign of an edit and its inverse. In the authors’ terminology, repair budget `B=4` caps this bounded repair loop at four attempts (Sections 4–6 and Appendix H.5). The base and richer recovery languages, `L₀` and `L₁`, including their primitive sets, are defined in Appendices C–D.

In the reported natural benchmark, one generated mutation was evaluated for each of 600 unseen self-evolution tasks; the task cohort is described in §4.3, while the deterministic constructive-oracle procedure is specified in §4.4 and Appendix G. Of the 600 mutations, 197 were capability-positive but failed recovery verification. Under base language `L₀` and `B=4`, four verifier-guided repair modes recovered 0/197, while independent regeneration recovered 6/197. The oracle—given the pre-state, frozen mutation AST, effect contract, and evaluator suites—found 48/197 oracle-recoverable under `L₀` and 191/197 under richer `L₁`. This supports a representational bottleneck within this benchmark; it is not a completeness result for either language.

The factorial intervention separates two reported bottlenecks. For oracle-defined `S₀`, where `L₀` was sufficient, exact state-address diagnostics recovered 38/48 cases (79.2%). For `S₁`, where the oracle required `L₁`, coarse diagnostics plus `L₁` recovered 142/143 (99.3%). On gpt-oss-120b, exact diagnostics with `L₁` instead recovered 133/143; a Qwen3.8-27B subset replication did not reproduce that negative interaction, so its generality remains uncertain.

A transferable research operation is a **recoverability matrix** for each editable surface: define the witness to capture, counterfactual states to test, equivalence to preserve, and inverse operations the recovery language can express. The authors stress that EvoUndo covers modeled in-memory harness surfaces, not distributed databases, third-party APIs, unmanaged OS processes, or unmodeled network state; it supplies empirical round-trip evidence rather than proof-level guarantees.

Read this to specify a recoverability matrix and a bounded repair experiment for persistent agent-harness edits, while locating the task cohort, recovery-language definitions, and oracle procedure needed to assess the reported bottleneck.

[Sections 2–6; §4.3 natural failure bank; §4.4 deterministic constructive oracle; Table 2; Section 6.3; Section 8 Limitations](https://arxiv.org/abs/2608.28363v1) · [Appendices C–D (L₀/L₁ recovery languages); Appendix G (oracle construction); Appendix H.5 (repair-budget/replication details); Table 2](https://arxiv.org/pdf/2608.28363v1)

Prepared retrospectively from the 2026-08-30 candidate papers; verified on 2026-09-11.
