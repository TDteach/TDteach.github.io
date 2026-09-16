# 2026-09-08

## Near-tied LLM rankings show composition-sensitive reversals in four of five tested benchmarks

*[Are Near-Tied LLM Rankings Robust to Family-DIF-Guided Benchmark Recomposition?](https://arxiv.org/abs/2609.00482v1)*

The paper treats a near-tied leaderboard result as a benchmark-composition question: does a pair’s ordering survive when item weights are changed in a principled way? Its method uses a family-label-free spectral approximation to multidimensional item-response theory, rather than a traditional marginal maximum-likelihood MIRT estimator, to remove a response-derived multidimensional signal before estimating residual item-by-family effects.

Within owner-disjoint folds, one owner half identifies items with low residual differential item functioning across observational model families. The procedure then selects source- and easiness-balanced low-DIF anchors, freezes their weights, and applies them to the other owner half. The primary comparison restricts attention to different-owner, different-family pairs whose full-benchmark scores differ by at most one percentage point. Blueprint-matched random subtests, matched on source-by-easiness cell size and weights, provide a control for generic subtest variation.

The aggregate picture is stable: full-benchmark and frozen low-DIF rankings have Kendall’s τ_b values between .900 and .948. Pairwise near ties are less stable. In four benchmarks, 30.9%–47.1% of eligible pairs reverse order under low-DIF scoring, exceeding matched-random medians by 16.9–28.6 percentage points; all matched-random comparisons have p=.001. WinoGrande is the boundary case: its low-DIF and matched-random reversal rates are 33.8% and 34.7%, respectively, with an excess of −0.9 points and p=.689. Residual item–family signatures also replicate across owner-disjoint halves, with positive median family-wise correlations of ρ=.308–.589 and above-chance top-20% high-DIF overlap. The positive excess-reversal pattern in MMLU-Pro, BBH, MMLU, and HellaSwag persists across the reported population perturbations, including owner caps, checkpoint selection, lineage filtering, and leave-one-family-out variants. No observational model family shows a consistent advantage across benchmarks.

A transferable research operation is therefore to audit a new leaderboard rather than report only its aggregate correlation: define a near-tie band, construct low-DIF weights on disjoint owners, apply them to held-out owners, and compare pairwise reversals with blueprint-matched random subtests. This is a diagnostic reweighting, not evidence that the selected items are a universally better benchmark. Interpretation remains conditional because family labels inferred from model identifiers may conflate architecture, training, data, and uploader practices. The spectral approximation is linear and may leave nonlinear, higher-dimensional, or unmeasured capability differences in the residuals, so residual DIF does not establish a semantic or causal mechanism. The evidence also covers five static benchmarks from one response collection; MMLU and MMLU-Pro share content lineage and are not independent replications.

Read this to learn a concrete, controlled audit for deciding whether a sub-one-point LLM leaderboard gap survives benchmark recomposition, while seeing exactly where that diagnostic does and does not support interpretation.

[S3.SS2.p1.1; S5.SS1.p1.1 / Table 1; S5.SS1.p2.1 / Table 1; S5.SS4.p1.1 / Table 2; S5.SS3.p1.1 / Appendix A2 Table 6; Abstract / S7.p1.1 / S5.SS3.p2.1; S6.SS0.SSS0.Px1.p1.1; S6.SS0.SSS0.Px2.p1.1; S6.SS0.SSS0.Px3.p1.1](https://arxiv.org/abs/2609.00482v1)

## Rubric-Only Probes Find Recoverable Signals in LLM-as-a-Judge Labels

*[Judging LLM-as-a-Judge: Concerning Rubric Artifacts in LLM-based Automated Text Generation Evaluation](https://arxiv.org/abs/2609.02942v1)*

The paper tests whether an LLM-as-a-Judge verdict can be predicted from the rubric without seeing the candidate response. That is a concrete audit question for rubric-based benchmarks. HealthBench uses 48,562 physician-written, example-specific rubric criteria. Its model-based grader was meta-evaluated only on 34 consensus criteria, so the supplied prior evidence does not validate grader reliability across all example-specific criteria.

The authors train classifiers using only rubric text as input and binary LLM-judge labels as targets. The primary probe uses PubMedBERT, alongside TF-IDF classifiers, Naive Bayes, BERT, RoBERTa, and DeBERTa-v3. It covers HealthBench-Eval-Probe, HealthBench-Hard-Probe, and ResearchRubrics, with an 80/20 split, five-fold cross-validation, and 10,000 bootstrap resamples. The rubric-only classifier outputs exceed 0.5 and, in some cases, exceed 0.8 after accounting for dataset imbalance. A similar pattern appears on ResearchRubrics, suggesting that the signal is not confined to the healthcare setting.

The paper then examines what the rubric signal contains. In the HealthBench variants, “fail,” “pass,” and “not” occur more often in label-0 rubrics; label-0 rubrics are longer on average; and BERTopic yields class-associated topical distinctions. These observations make wording an auditable part of the evaluation pipeline rather than merely a container for instructions.

The study also uses counterfactual perturbations: candidate responses and rubric criteria are separately reversed before re-evaluation. The reported outcome is that judges often fail to reliably update decisions when either the candidate response or the rubric criterion is reversed. For a new evaluator, a useful research operation is therefore to run the rubric-only probe first, then perform paired response and criterion reversals and measure whether verdicts change in the expected direction.

The boundary is important. Because the probe intentionally isolates rubric text, a positive result indicates a recoverable rubric-conditioned prior, not proof of end-to-end judge failure. The authors also rely on a binary formulation and a limited set of probing methods, which may understate or distort subtler effects; the findings may not generalize to other domains, rubric styles, or languages. Their interpretation is consequently a methodological recommendation: benchmark builders should try to eliminate recoverable rubric priors and validate rubric design before treating automated scores as response-sensitive measurements.

Read this to learn a concrete two-stage audit—rubric-only prediction followed by response and criterion counterfactuals—for detecting scoring artifacts before relying on an automated evaluator.

[\[S4.SS2.p1\]; Appendix C Table 2 (A3.T2); \[A6.SS1.p2\]; \[A6.SS2.p1\]; \[A6.SS3.p2\]; \[S1.p3\]; Abstract; \[S7.p1\]; \[S6.p1\]](https://arxiv.org/abs/2609.02942v1) · [abstract1.1; S3.p2.1; S1.p5.1; S9.SS0.SSS0.Px1.p1; S8.SS1.p1](https://arxiv.org/abs/2505.08775v1)

## A high NAVSIM score does not require a planner to react to the current traffic scene

*[Driving on Memory](https://arxiv.org/abs/2608.31029v1)*

End-to-end driving scores are often read as evidence that a planner understands the scene it is currently seeing. This paper tests that inference with a direct information intervention: “we remove a model's camera input and replace it with memories from prior drives at the same location.” Those memories can retain persistent, location-conditioned information, while the evaluated scene's current traffic state is not observed.

The implementation, **MemoryDrivoR**, uses a pose-indexed bank of encoded prior camera frames. At test time it retrieves up to 10 nearby memories within 20 m, represents their relative pose, compresses 64 register tokens into 8 memory tokens with a learned transformer resampler, and supplies those tokens to a DrivoR-based planner. The reported NAVSIMv1 setting retains ego-status input, initializes from DrivoR weights, and fine-tunes for five epochs after current-scene camera input is removed.

Under those conditions, MemoryDrivoR reported a PDMS of **91.1** on NAVSIMv1. The authors therefore state that the result suggests a high NAVSIM score need not require reaction to current traffic, and should be interpreted cautiously. This is a diagnostic result, not a claim that the planner safely handles arbitrary current scenes: the retrieval setup makes static scene structure and location-conditioned regularities available from earlier traversals.

The same intervention was less sufficient in the reported closed-loop setting. On Bench2Drive—evaluated over 220 routes across 12 towns—MemoryDrivoR reported a success rate of **9.5** and a driving score of **34.7**. The paper characterizes the larger drops on Bench2Drive and RealEngine as benchmark-dependent. It also reports that the resampler learns to filter outdated dynamic information that could distract the planner; this is consistent with a memory representation designed to retain useful persistent information rather than stale actor states.

The transferable research operation is to ablate the *specific information* a benchmark score is meant to demonstrate. For an embodied benchmark, construct a baseline that preserves plausible static priors and query-time state, but withholds the current observation. Then ask whether the retained score survives on interaction-heavy, closed-loop tests. A strong score after this ablation does not by itself identify online perception as its source.

This protocol has clear limits. It assumes repeated traversals of the same locations and accurate relative poses across traversals, and the authors explicitly say it does not establish the limit of what ego status and static information can support.

Learn a concrete information-ablation design for testing whether an embodied benchmark score reflects online perception or static, location-conditioned priors.

[Abstract (PDF page 1); Method Section 3.2 (PDF page 4); Table 1 (PDF page 6); Table 3 (PDF page 7); Appendix A.6 (PDF page 17); Section 5.2 and Conclusion (PDF page 9)](https://arxiv.org/abs/2608.31029v1)

## INT4 KV-Cache Compression Degrades Faithfulness Even When Accuracy Is Preserved

*[Faithfulness Is Not Free: Auditing Offline KV-Cache Quantization in Retrieval-Augmented Generation](https://arxiv.org/abs/2608.30996v1)*

### The limitation being audited
The paper targets a concrete evaluation gap: a compressed RAG answer can retain containment-EM while losing support from the retrieved evidence. Its central conclusion is that EM and F1 alone cannot validate compressed RAG, because surface accuracy does not expose every grounding regression.

### The controlled change
The audit isolates cache precision rather than changing the retrieved context or generation procedure. For each query, the system builds one unified prefill cache from the system prompt and top-*K* retrieved chunks, stores it as BF16, INT8, or INT4, and compares outputs with the same context and decoding. The reported setup uses Qwen2.5-7B-Instruct on RGB and HotpotQA, with *K* in &#123;1, 3, 5&#125;. Accuracy is measured with containment-EM and token F1; faithfulness is assessed with HHEM-2.1, DeBERTa-v3 NLI entailment, and a Claude Haiku 4.5 LLM judge.

This paired design matters: the BF16 cache round-trip reproduced the ordinary full-context baseline within floating-point tolerance on all 50 validation examples. The quantized conditions therefore have a specific comparison target rather than an unverified cache implementation.

### Decisive evidence
INT8 stayed close to the BF16 baseline across accuracy and faithfulness. INT4 exposed the more consequential failure mode. Among examples whose containment-EM was unchanged between BF16 and INT4, the LLM judge recorded 231 faithfulness worsenings versus 24 improvements on RGB, and 173 versus 31 on HotpotQA. Thus, an unchanged answer-accuracy result did not guarantee unchanged evidence support in this experiment.

The paper also reports larger INT4 degradation under harder retrieval settings, including more chunks and more distractor passages. The retrieval-depth trend is directional rather than statistically robust, however: only *K* = 1, 3, and 5 were tested and the slope test was underpowered (*p* = 0.12). INT4 additionally produced empty or looping outputs at *K* = 5—6% on RGB and 3% on HotpotQA—whereas BF16 and INT8 did not.

### Transferable operation and boundary
For an offline RAG deployment, reproduce this paired audit: hold retrieved text, prompts, and decoding fixed; compare the candidate cache format with an unquantized reference; report accuracy and multiple faithfulness signals; then stratify by retrieval depth, distractor fraction, refusals, and degenerate generations. Treat that protocol as a measurement operation, not as evidence that INT4 will fail identically elsewhere. The study covers one model family, two QA benchmarks, and three retrieval depths. HotpotQA also has a low-*K* refusal-calibration confound, so HHEM and NLI are less reliable there and the authors rely primarily on the LLM judge.

Read it to learn how a paired cache-precision audit can reveal grounding regressions that unchanged EM or F1 would miss.

[S5.p2–p3; S6.p1; Sx1.p1; A1.SS1; A1.SS5](https://arxiv.org/pdf/2608.30996v1)

## Benign-query likelihood replay infers hidden context in agentic AI systems

*[Context Inference Attacks Without Jailbreaks](https://arxiv.org/abs/2609.01663v1)*

Prior privacy analyses emphasized jailbreaks that induce direct disclosure; this paper identifies a concrete blind spot: the abstract says prior work had “largely overlooked the agentic setting where the context is assembled by the agent's own tool calls.” The relevant threat is membership or context identification, not necessarily verbatim extraction.

The attack treats each possible hidden context as a hypothesis. It collects responses to benign, target-agnostic queries, rebuilds a scoring context for every candidate, computes per-token negative log-likelihoods, aggregates them across queries and filler draws, and selects the hypothesis with the lowest score. Grey-box scoring uses the target model; black-box scoring uses a surrogate. The paper carries this replay procedure across known contexts, unknown contexts, and contexts retrieved through the agent's own tool calls.

The decisive known-context result is 100% attack success on small candidate sets and 63% at 1,024 candidates, where chance is 1/|Z|. In the agent-retrieval setting, after uninformative queries are filtered, the attack reaches 81.8 AUROC on a measured agent. These results concern inference from ordinary responses rather than a request to reveal records. They also remain compatible with controls aimed at direct disclosure: the paper reports that refusal instructions and logit suppression held excess response–target overlap below 0.0021 BLEU “while the attack proceeds unaffected.”

The boundary is important for replication. The authors state that black-box results “rely on a surrogate whose likelihoods order hypotheses similarly to the target’s,” and report that this holds within a model family; that condition should not be silently generalized to arbitrary deployed models. They also warn: “Several settings are constructed to isolate the mechanism.” Candidate sets, membership priors, retrieval lists, and credential tokens are therefore experimental controls, not evidence that the reported rates transfer unchanged to every deployment.

A useful research operation is to build a small candidate set for a sensitive retrieval workload, issue only benign queries, and compare replay scores under the true candidate contexts. Report AUROC or recovery against its chance baseline while varying candidate-set size, query budget, context size, and surrogate family. The transferable question is whether a defense reduces only response overlap, or also equalizes likelihoods across plausible hidden-context hypotheses.

Read this to learn how to test hidden-context privacy with benign queries when direct-disclosure checks appear to pass.

[abstract1.1; S5.p1; S6.SS2; S6.SS4; S7.p1; S8.p1](https://arxiv.org/abs/2609.01663v1)

Prepared retrospectively from the 2026-09-08 candidate papers; verified on 2026-09-16.
