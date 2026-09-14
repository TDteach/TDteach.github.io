# 2026-09-04

## Interpretive Drift Dominates Persona Effects in Long-Document LLM Financial Analysis

*[The Analyst in the Prompt: Role, Retrieval, and Memory Biases in LLM Financial Analysis](https://arxiv.org/abs/2609.03218v1)*

Earlier prompt-sensitivity work found performance differences of up to 76 accuracy points when semantically equivalent formats were used in few-shot classification tasks. The limitation for a long-document RAG evaluation is attribution: a changed answer may reflect changed retrieval, changed interpretation, or both. This paper changes the control by testing those channels separately rather than treating persona bias as one prompt-level effect.

The audit covers 3,575 SEC 10-K/10-Q filings and twelve LLMs. PR combines persona-conditioned retrieval with a persona role prompt. NR uses neutral retrieval with the same role prompt, while the retrieved chunks are byte-identical across personas. MEM keeps retrieval and assistant role neutral, places the investor mindset in a user-profile or memory blurb, and routes the response into evidence-based and personalized fields.

Across four matched pairs, NR retains 69% of the PR effect on average, 68% at the median, with model-level retention from 44–89%. Thus, in this setup, most persona movement survives fixed evidence: the paper identifies interpretive drift as the dominant channel. Retrieval still changes selection: ShortSeller pulls Risk Factors 20.9% of the time, versus 13.9% for the neutral baseline. These are distinct channels, and the selection difference does not explain the majority of the measured effect.

The mitigations are useful but incomplete. For the strongest ShortSeller/DownsideProtection pair, moving from NR to MEM shrinks the evidence-score coefficient by 51–87%, with a panel median of 73%. In MEM, all twelve models have mean leakage below 0.5, but the authors describe dual-output routing as risk reduction rather than a guarantee.

For a reusable evaluation, copy the sequence: allow personalization to change retrieval, pin the retrieved text byte-for-byte, then move the same mindset from assistant role to user profile. Report PR-to-NR retention and NR-to-MEM shrinkage, and inspect leakage in the evidence field instead of assuming that a JSON schema enforces separation.

Keep the conclusion scoped. The main analysis uses SEC filings, one retrieval encoder, and one prompt-template family, so effect magnitudes may differ elsewhere. The three-channel decomposition is an accounting decomposition, not formal causal mediation. Public filings may have appeared in pretraining, and within-filing comparisons cannot eliminate memorization or look-ahead concerns. Finally, spillover measures movement relative to a neutral-condition invariance reference, not deviation from externally validated ground truth.

Read it to copy a three-arm RAG audit that distinguishes retrieval changes from interpretation drift and tests whether profile-based framing reduces leakage.

[S4.SS1.p1.1; S4.SS2.p2.1; S4.SS3.p1.1; A4.SS7.SSS0.Px1.p1.1; Sx1.p1.1; Sx1.p2.1; Sx1.p3.1; Sx1.p4.1](https://arxiv.org/abs/2609.03218v1) · [Abstract and S1.p1](https://arxiv.org/abs/2310.11324v2)

## Counterfactual audit flip rates need a measured per-action instability floor

*[Counterfactual Fairness Audits of Multi-Step Clinical LLM Agents Require a Measured Per-Action Instability Floor](https://arxiv.org/abs/2609.03221v1)*

An action flip in a counterfactual audit is not interpretable as demographic disparity until it is compared with the agent’s own action-specific instability under an identical condition. FairMedAgent tests this baseline by rerunning a reference condition with the same vignette and descriptor, within a six-stage clinical-agent trajectory containing five model-facing decisions and one deterministic environment step.

The reported reference protocol used 10 independent replicates over 16 vignettes with provider-default, non-zero-temperature sampling. Pairwise comparisons across replicates produced 4,320 outcome–vignette comparisons. The pooled decoding-instability floor was 0.087, or 374 flips out of 4,320 comparisons, with a cluster-bootstrap interval of [0.056, 0.116]. The floor was strongly action-dependent: the reported rates ranged from 0.022 for ICU escalation to 0.179 for controlled-substance caution.

That spread makes the action, rather than only the overall agent, the relevant comparison unit. The paper therefore recommends reporting a per-action floor beside each demographic contrast and stating the decoding configuration. This baseline was not confined to one system: a second model produced a pooled floor of 0.067 versus 0.087 for the first model, while the six action-wise instability rates had Spearman correlation ρ=0.94 across models.

Replication helps, but does not make the problem disappear. Majority-vote aggregation lowered the pooled floor from 0.087 for a single draw to 0.063 at three draws and 0.053 at five draws, removing about 39% before flattening. A null simulation placed the remaining curve within the range expected from heterogeneous per-cell sampling probabilities.

The available demographic pilot is not a disparity result: no demographic contrast was distinguishable from the measured floor, and the authors make no disparity claim. It used four vignettes with single-draw demographic cells; some prescribing comparisons were affected by a prompt reissue, and clinician band adjudication was incomplete. The proposed within-range counterfactual flip rate (WCFR) counts flips only when both actions fall inside a clinician-adjudicated acceptable-action set, so it remains undefined for these draft vignettes until adjudication is completed.

The main measurement boundary is that a flip may reflect sensitivity to descriptor phrasing or token differences rather than demographic reasoning. The benchmark also uses synthetic vignettes and coarse demographic descriptors with modest cluster counts, making some domain-level intervals wide. One action, controlled-substance caution, lacks operational clinical criteria and may reflect construct underspecification.

For a new audit, the transferable operation is concrete: rerun the reference condition, estimate a floor separately for each action, compare demographic contrasts with the matching floor, and report the decoding settings. A contrast below or near that baseline should remain a stochasticity finding—not evidence of demographic disparity—until better-powered, adjudicated measurements distinguish the mechanisms.

Read this paper to learn how to turn a raw counterfactual flip rate into an interpretable, action-specific comparison against a measured stochastic baseline.

[Abstract; §V-A; §V-B; §V-C; §IV-A; §VI-A](https://arxiv.org/abs/2609.03221v1)

## Teacher probe pass-rates gate dense on-policy distillation per prompt

*[Verify Before You Distill: Prompt-Level Teacher Gating for On-Policy Distillation](https://arxiv.org/abs/2609.02998v1)*

Vanilla OPD applies teacher supervision uniformly across prompts, even though reverse KL is mode-seeking and a confidently wrong teacher can induce a strong but misleading update. Entropy and teacher–student likelihood agreement offer uncertainty or agreement signals, but they do not directly verify outcome correctness.

TGOPD changes the unit of trust from an unqualified prompt to an empirically tested prompt. For each prompt, the frozen teacher generates K_T probes; a binary verifier scores them, and the empirical pass-rate q_T(x) becomes a hard gate. In main experiments, K_T=3 and τ=2/3: at least two passing probes route the prompt to dense token-level OPD; otherwise teacher supervision is withheld and verifier-grounded GRPO is used. The gate is exclusive rather than a continuous weakening of teacher logits. The probes are scheduled into otherwise-idle teacher windows in the asynchronous setup, so reliability estimation also uses capacity that would otherwise be idle.

The strongest reported evidence is not a single aggregate number. TGOPD outperformed Vanilla OPD in all six single-domain settings across 4B and 35B students in mathematics, code, and instruction following, and produced higher seven-benchmark averages at both scales in multi-domain training. In the reported 35B code setting, the authors state that other distillation variants produced negative transfer, whereas TGOPD was the only method with positive transfer (+3.0 over base) and exceeded the teacher on LiveCodeBench (+1.3) and OJBench (+1.1). In a measured 4B single-domain run, teacher-node GPU utilization rose from 9.8% to 78.9% when probe work reused idle capacity. These are reported conditions, not evidence that the recipe transfers to every verifier or deployment.

A practical pilot should therefore log more than final benchmark scores: vary K_T and τ, record the fraction of prompts sent to OPD versus GRPO, and measure probe wall-clock cost alongside utilization. Include a masking/no-update fallback, because when all rollouts in a gated-off group receive the same reward, centered GRPO has exactly zero advantage and produces no update. The method currently requires an automatic binary verifier and binary routing, so its evidence does not directly cover open-ended tasks. The transferable question is whether prompt-level pass-rate predicts when dense teacher tokens help better than a global OPD weight, under the same student, teacher, verifier, and rollout budget.

Read this if you are deciding whether to add a verifier-backed, prompt-level trust gate to an asynchronous OPD pipeline and need the key fallback failure case before running a pilot.

[Abstract; §3; §4; §6](https://arxiv.org/abs/2609.02998v1)

## EarlyEval cuts agent-evaluation cost inside tasks by predicting outcomes from partial trajectories

*[EarlyEval: Cheaper Agent Evaluation via Early Outcome Prediction](https://arxiv.org/abs/2609.02783v1)*

Agent evaluation has a concrete inefficiency: prior efforts centered on benchmark distillation reduce the number of evaluation tasks but leave the cost of executing each retained task untouched. EarlyEval treats this as a complementary efficiency axis: predict whether a run will ultimately succeed or fail, then stop the run before completion when the prediction is sufficiently confident. [arxiv:2609.02783v1, Abstract]

EarlyEval trains a pair of LightGBM success and failure classifiers over behavioral, textual, and reference-solution features. At runtime, it extracts prefix features during the run and halts the agent when either calibrated classifier crosses a preset confidence threshold. The reported implementation adds negligible per-step overhead. [arxiv:2609.02783v1, Abstract; III-D, III-E, IV-D] The evaluation protocol uses task-partitioned leave-one-agent-out testing; for TerminalBench, the authors additionally test settings that exclude either the same model or the same scaffold from training. [arxiv:2609.02783v1, IV-B]

The paper reports results on SWE-bench Verified, TerminalBench, and Toolathlon. Across these benchmarks, EarlyEval eliminates 13%–26% of agent steps and up to 44.1% of input tokens and 29.4% of output tokens, with 89%–97% prediction accuracy. Per-agent resolve rates change by only one to two percentage points on average. [arxiv:2609.02783v1, Abstract] These numbers describe an approximate evaluation mode, not an exact replacement for full execution.

That boundary is operationally important. EarlyEval requires a pool of completed, outcome-labeled trajectories on the target benchmark, so it is not applicable to a brand-new benchmark with no historical runs. [arxiv:2609.02783v1, S8.p1] The authors also state that early stopping introduces a systematic resolve-rate deviation of approximately 1–2 percentage points; canonical, citable scores and headline leaderboard claims should therefore still come from agents run to completion. [arxiv:2609.02783v1, S8.p2]

A transferable research operation is to separate exploratory evaluation from score publication: train the predictors on completed runs, set a confidence threshold against an explicitly chosen compute–fidelity trade-off, and use early stopping for repeated development checks while reserving full runs for final reporting. The method’s useful question is not simply whether an agent can be stopped early, but which trajectory signals remain reliable across held-out agents and how much historical data is needed before the savings justify the approximation.

Read this to learn how to build a thresholded early-stop evaluator from completed benchmark runs, and where its approximate scores must give way to full execution.

[Abstract; IV-B; S8.p1; S8.p2](https://arxiv.org/abs/2609.02783v1)

## Declarative Attention cuts attended KV positions with modest accuracy loss in 15 long-context tasks

*[Language Models Can Control Their Own Attention](https://arxiv.org/abs/2609.02737v1)*

Declarative Attention (DA) turns attention selection into a text protocol. DA divides a long input into numbered “magic chunks” and asks an off-the-shelf model, without parameter updates, to emit `&lt;global&gt;`, `&lt;focus magic_chunks="K"&gt;`, or `&lt;local&gt;` declarations. At runtime, a vLLM-integrated state machine reads the output stream, translates those transitions into a block-aligned KV-cache mask, and lets existing attention kernels run unchanged; masking is applied to global-attention layers, while focus and local modes retain only the named chunks or recent output.

The systems idea is distinct from merely adding another span predictor. Earlier self-selected-span work reported that its custom kernel was effective only when ignored context occurred in blocks of 64 or more tokens. DA moves the selection signal into parseable text and delegates execution to an inference-engine mask rewrite, rather than requiring model fine-tuning or a new attention kernel. This makes the key research question operational: can the model’s declared scope be reliable enough to drive sparse reads?

The headline result is measured in attended KV positions: across 15 long-context tasks, DA reduced average decoding attention cost by 52.0% on Gemma-4-31B and 31.1% on Qwen-3.6-27B, with accuracy drops of 1.27 and 2.75 percentage points. An ablation isolates the mechanism: relative to DA-nm, the same protocol without custom masking, the mask cut attended tokens by 71.1% on Gemma and 46.5% on Qwen. Relative accuracy also increased with model size in both evaluated families, reaching 99% for Gemma-4-31B and 97% for Qwen-3.6-27B.

The runtime conclusion needs narrower wording. The reported 0.71× and 0.77× decode-time figures are roofline estimates under B200 bf16 assumptions, not measured wall-clock results. DA also has two protocol boundaries: chunking can destroy information needed for global counts or tables split across chunks, and the authors disabled thinking mode because models failed to follow the tags inside thinking traces.

A useful replication operation is to log each declaration, resulting mask, attended-token count, and answer correctness, then compare vanilla, DA-nm, and DA on the same traces. The concrete question is whether block-aligned masks produce measured end-to-end speedups after parsing, chunking failures, and model-specific tag adherence are included.

Read this to trace whether a model-generated attention plan survives the path from text tags to a KV-cache mask, and to identify the timing and robustness experiments still needed before treating modeled savings as deployment speed.

[\[S1.SS0.SSS0.Px1.p1.1\]; \[S2.SS3.SSS0.Px1.p1.1\]; \[S1.I1.i2.p1.1\]; \[S5.SS1.SSS0.Px3.p1.1\]; \[S5.SS2.SSS0.Px1.p1.1\]; \[S5.SS4.SSS0.Px1.p2.1\]; \[S5.SS4.SSS0.Px1.p1\]; \[A4.SS4.p1\]; \[S4.SS0.SSS0.Px6.p1.1\]](https://arxiv.org/abs/2609.02737v1) · [\[S5.SS2.p5.1; S5.F9 caption (text)\]](https://arxiv.org/abs/2404.09336v1)

Prepared retrospectively from the 2026-09-04 candidate papers; verified on 2026-09-14.
