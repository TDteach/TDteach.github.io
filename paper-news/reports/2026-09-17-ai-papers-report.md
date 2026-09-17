# 2026-09-17

## Traverse benchmarks first-mistake localization in long-horizon agent runs

*[Locating Hidden Failures Makes Long-Horizon Agents More Reliable](https://arxiv.org/abs/2609.17930v1)*

End-task success can hide an earlier mistake: the paper notes that a run may continue while appearing correct, even after an error. Rahman et al. therefore make first-mistake localization—not only final-outcome scoring—the operational target for long-horizon oversight.

Traverse contains 1,423 agent trajectories and 44,341 steps, with every step labelled correct or incorrect and the first mistake of every failed run marked by hand. Its trajectories are 20–200 steps long and span software engineering, computer use, and science. The annotation is the substantive method change: it turns an opaque pass/fail trace into a sequence-level supervision problem.

For Scout's supervision, the authors provide each trajectory's steps and gold labels to Gemini-3 Flash and prompt it to write a step-by-step chain-of-thought analysis judging every step. They then use those analyses for SFT of Qwen3-4B-Thinking and apply GRPO with a reward combining per-step product recall and a trajectory-level verdict. This trains a verifier around locating the first error, rather than assuming that a generic outcome reward will explain it.

Reported behavior motivates the target. After its first mistake, an agent recovered in only 30.5% of runs and never detected the error at all in 38.5%; it nevertheless kept acting. Six frontier judges also struggled: the strongest achieved 26.8% exact localization on software-engineering runs and 32.3% on computer-use runs, with no judge exceeding one third on either. The safety audit further flagged 65 unsafe actions; the paper reports that all were unnecessary, 97% lacked risk acknowledgment, and 75% were irreversible.

Compared with ToolPRMBench's 984 step-level samples and 78.6% average for binary-reward ToolPRM-GRPO, Traverse changes the target to first-error localization on long trajectories; the reported scores are not directly comparable because the tasks and trajectory regimes differ.

Transferable operation: label the first mistake before optimizing a verifier for final success; evaluate localization, recovery, and unsafe actions separately, then test whether verifier-ranked candidate runs improve outcomes. A clean replication should ablate the label-conditioned synthetic analyses and compare the composite GRPO reward with binary reward on the same split. These are proposed experiments, not results established here.

The evidence has clear boundaries. Fine-grained mistake categories are noisy: agreement is much lower for the single fine category (Cohen's κ=0.30) than for family, root-versus-cascade, or phase labels. The study covers three domains; whether its patterns hold in embodied, multimodal, or multi-user settings remains open.

Read it to compare first-error localization with end-task judging and extract a concrete annotation-and-verifier design for long-horizon agent evaluation.

[\[S1.I1.i2\]; \[S2.SS3.SSS0.Px1.p1\]; \[S2.SS4.SSS0.Px2.p1\]; \[S1.p7\]; \[S1.p9\]; Table 1 \[S3.T1\]; \[S1.p3\]; \[S2.SS2.SSS0.Px3\]; \[S4.p3\]](https://arxiv.org/abs/2609.17930v1) · [S3.SS4.p1; S4.T2; S4.SS2.SSS0.Px1](https://arxiv.org/abs/2601.12294v1)

## SAFE identifies distinct optional-evidence inspection policies across four frontier models

*[Do Frontier Models Seek Safety Evidence Before Acting?](https://arxiv.org/abs/2609.17865v1)*

## The decision before deployment

SAFE studies whether models choose to acquire safety-relevant evidence before acting. Its controlled environments vary retrieval cost, stated probability, severity, and presentation; at Stage 1, models choose INSPECT or SKIP. The supplied protocol describes 900 environments across five domains, with five independent rollouts per scenario for GPT-5.5, o3, Claude Opus 4.8, and Claude Sonnet 4.6. Inspection reveals a deterministic, severity-aligned finding before a downstream deployment choice. This separates willingness to obtain safety information from the response after that information is known. [§3.1–3.2]

Results differ substantially by model in the Offered Report condition. Opus 4.8 inspected in 96.3% of rollouts, while Sonnet 4.6 and GPT-5.5 inspected in 72.3% and 68.4%; o3 inspected in 48.3% and was the only model to skip in a majority of cases. Inspection rose with severity, but the stated likelihood signal had a smaller reported effect: raising likelihood from 10% to 70% changed inspection by 14 points for GPT-5.5, 21 for Sonnet 4.6, and 13 for o3; o3 was also slightly less likely to inspect at 70% than at 40%. These figures are reported for Offered Report environments, rather than as evidence about open-ended deployment behavior. [§4]

The rationale analysis adds a useful measurement warning. An automated monitor, validated against human annotators, classified expected-value reasoning as 92–100% of inspection rationales and 99–100% of skip rationales across the four models. Yet the authors' counterfactual analysis concludes that rationales can omit variables that change behavior while emphasizing variables with little influence. Generated explanations should therefore be evaluated alongside behavioral edits, not treated as a sufficient account of why a decision changed. [Appendix A.1; §6]

A transferable research operation is to make information acquisition an explicit action in a safety evaluation, factorially vary its costs and the properties of the available evidence, and compare decision flips with rationale acknowledgement after targeted edits. The next question is whether the same stated-versus-behavioral gap persists when a model must search for evidence autonomously: SAFE measures observable decisions and generated rationales, not latent motivation, and it studies prompted evidence acquisition in a stylized single-turn setting. [§7.1]

Read this to adapt a concrete inspect-or-skip evaluation pattern that distinguishes whether a model seeks safety evidence from how it acts after receiving it, while keeping explanation-faithfulness and single-turn-setting limits explicit.

[Abstract; §3.1–3.2; §4; §6; §7.1; Appendix A.1](https://arxiv.org/abs/2609.17865v1)

## XConf (eXperiential Confidence): estimating confidence together with the model's accumulated experience

*[Confidence Comes from Experience: Experiential Confidence Estimation from Reasoning to Agents](https://arxiv.org/abs/2609.17708v1)*

### The design change

The paper targets a specific limitation in confidence estimation: existing estimators “only read the current inference process,” whether through introspection, token probabilities, or resampling. XConf instead keeps graded records of prior episodes. Each record contains the task, the model’s reflection and stated confidence before grading, the outcome, and a lesson written after the grade arrives.

At inference, the method has two readings of this history. **Recall retrieves past episodes on similar tasks met with a similar stated confidence, and reads off their historical success rate.** **Reflect** then presents the retrieved record and the current reflection to the model, asking it to identify a recurring failure mode and restate its confidence. The authors describe the estimator as format-general, without logit access or weight updates, and requiring one answer generation; their cost description also includes a short Reflect call.

### What the reported evaluation shows

Across nine benchmarks in reasoning, coding, multimodal QA, and interactive agents, and four models from three families, the authors use five-fold out-of-sample retrieval so that the bank contains earlier-fold episodes. Under that protocol, **XConf beats or matches ten-sample self-consistency in discrimination (AUROC) on 23 of 24 comparisons, with much lower calibration error (ECE), at a tenth of the generation cost.** The reported calibration improvement is therefore paired with a comparison to a substantially more generation-heavy sampling baseline, rather than establishing that XConf dominates every estimator or task type.

For a deployment decision, the selective-prediction result is especially concrete: ranking episodes by XConf confidence and abstaining on the lowest-confidence 10% raised delivered success by up to 8.7 points on agent tasks. The authors also report control analyses in which permuting stored outcomes destroys the estimate, hiding outcomes removes the gain, and increasing bank size improves calibration; these are evidence that the stored outcome record, rather than merely a longer prompt, supplies the reported signal.

### A transferable experiment

An editorially useful prototype is a small bank of graded episodes for one target workflow. Compare the statistical Recall score with Recall plus Reflect, then evaluate AUROC, ECE, and success among accepted cases on temporally held-out episodes. The key question is whether retrieved historical outcomes help after controlling for task similarity and the model’s original stated confidence. Do not assume the method is uniformly preferable: **Voting keeps an edge on votable factual recall**, and the authors report one main-table loss on such a cell.

Read this to extract a concrete retrieval-plus-reflection confidence design, including an out-of-sample evaluation setup and a boundary case where sampling remains stronger.

[Abstract; §5.1; Table 3; §5.4; §5.5; §7](https://arxiv.org/abs/2609.17708v1)

## DRAG Is a Query-Adaptive Framework for Selecting Retriever–Generator Configurations

*[One Size Does Not Fit All! Dynamic Retriever and Generator Selection for RAG](https://arxiv.org/abs/2609.17709v1)*

### The fixed-pipeline limitation

RAG systems “typically employ fixed retriever and generator configurations across queries,” although query complexity and information needs differ; the abstract links this practice to inefficient allocation of computational resources. The paper also states that retrieval and generation adaptivity have been studied independently, while their joint effect on end-to-end RAG performance remains underexplored. [arxiv:2609.17709v1, Abstract]

### The routing change

DRAG selects a retriever–generator configuration adaptively. Its training-free DRAG_QPP router uses Query Performance Prediction signals to guide retriever selection and perplexity-based measures over retrieved context to guide generator selection. DRAG_SFT instead fine-tunes an LLM to jointly predict a retriever–generator configuration. The reported analysis covers factoid and multi-hop QA, including bridge and composition reasoning tasks, across three LLM families and four QA benchmarks. [arxiv:2609.17709v1, Abstract; §6.1]

### What the reported evidence says

Across that setup, the authors report that stronger retrieval generally yields larger gains than increased generation effort, but both exhibit diminishing and non-monotonic returns. Thus, in these experiments, higher-complexity configurations were not uniformly better across queries. [arxiv:2609.17709v1, §6.1]

The abstract reports that DRAG_QPP achieved performance comparable to strong static RAG baselines while substantially reducing inference latency across the evaluated families and benchmarks. For the supervised variant, the authors report that DRAG_SFT typically improved downstream performance by approximately 2–12% across datasets relative to DRAG_QPP, while increasing latency by approximately 5–40%. [arxiv:2609.17709v1, Abstract; §6.2]

### Boundaries and a reusable operation

The training-free method has a direct constraint: its effectiveness “relies heavily on data-specific threshold selection and the sequential estimation of generation complexity.” Moreover, the efficiency-aware oracle consistently outperformed the adaptive methods and baselines, leaving a gap between attainable routing decisions and oracle choices. [arxiv:2609.17709v1, §4.2; §6.2]

For an extension, construct an efficiency-aware oracle over retriever–generator pairs before training a router. Then ask whether a routing signal closes the oracle gap without thresholds tuned to each dataset, and report effectiveness and per-query latency together. This turns “use a stronger model” into a measurable allocation question: which retrieval and generation budget is justified for this query?

Read it for a concrete joint-routing design—QPP plus context perplexity without training, or supervised joint prediction—and for the oracle-gap evaluation that exposes where per-query RAG allocation remains difficult.

[Abstract; §6.1, joint retriever–generator analysis; §6.2, adaptive-method trade-off discussion; §4.2, DRAG_QPP limitations](https://arxiv.org/abs/2609.17709v1)

## OBC-Prune uses causal rollout weighting to recalibrate one-shot pruning

*[OBC-Prune: Outcome-Based Calibration for Large Reasoning Model Pruning](https://arxiv.org/abs/2609.17890v1)*

## The calibration statistic becomes outcome-aware

One-shot pruning of reasoning models has a specific calibration limitation: self-generated chain-of-thought better represents inference than generic data, but treating all reasoning tokens uniformly can preserve weights associated with erroneous computation as readily as weights associated with correct computation. RAC addressed the distribution mismatch by adding on-policy chain-of-thought activations to existing pruning workflows, while SSGR selected harder, moderately long correct traces. OBC-Prune changes the calibration objective instead of changing the pruning solver.

Its pipeline samples 16 rollouts per problem at temperature 0.8, retains problems with at least one correct and one incorrect rollout until it has 128 pairs, and divides each rollout into reasoning sentences. For each sentence, it suppresses future-token attention to that sentence and measures the resulting downstream KL divergence. These sentence-level causal scores become per-token weights: causally important tokens in correct rollouts are upweighted, while causally important tokens in incorrect rollouts are downweighted. The weighted activations then replace the usual calibration statistic used by SparseGPT, Wanda, or ALPS; their pruning solvers remain unchanged.

The strongest evidence is conditional but operationally useful. On DeepSeek-R1-Distill-Qwen models at 1.5B, 7B, and 14B parameters, OBC-Prune matched or improved C4, RAC, and SSGR calibration in most tested model-and-sparsity settings on MATH500, LiveCodeBench, and AIME 2025. The reported gains also extended across SparseGPT, Wanda, and ALPS. In the authors’ SparseGPT analyses, reconstruction fidelity was measured at 40% sparsity, while collapse rate and completion length were measured at 50%; OBC-Prune’s pruned models had lower hidden-state reconstruction error, lower termination-collapse rates, and shorter mean completions than baseline calibration methods. Component ablations on the 1.5B model at 40% sparsity found that removing correct-rollout upweighting, wrong-rollout downweighting, softmax normalization, or sentence-level weighting reduced MATH500 accuracy.

The transferable research operation is to treat calibration as an intervention-design problem: hold the rollout and token budget fixed against RAC and SSGR, replace only the second-order statistic, and log accuracy, reconstruction error, completion length, collapse, discarded problems, and intervention cost. This tests whether the gain comes from outcome-based causal weighting rather than extra sampling or a different calibration budget.

The method has a sharp boundary. It discards problems whose sampled rollouts are all correct or all incorrect, because it requires mixed outcomes. Under very aggressive one-shot pruning, it delays rather than eliminates collapse; the supplied evidence does not establish recovery after iterative pruning or retraining.

Read this to learn how to convert correct/incorrect reasoning-rollout contrasts into a solver-agnostic pruning statistic, then test whether the extra causal measurement—not merely more calibration data—preserves reasoning behavior.

[Algorithm 1 (alg1.l3–alg1.l23); §4 (S4.p1, S4.SS1–S4.SS4); §5 (S5.SS0.SSS0.Px3–Px6); Appendix F (A6, Table 6); §5 (S5.SS0.SSS0.Px8) and Appendix D (A4.p1, A4.F4)](https://arxiv.org/abs/2609.17890v1) · [S4 (Algorithm 1); S5.SS2.SSS0.Px2.p1.1; S5.SS1.SSS0.Px1.p5; S5.SS2.SSS0.Px1.p1](https://arxiv.org/abs/2509.12464v2) · [S3.SS3.p3; S3.SS4.p3.1; S5.SS2.p1](https://arxiv.org/abs/2511.18864v1)
