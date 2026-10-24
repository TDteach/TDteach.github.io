# 2026-10-25

## Self-Conditioning Makes Additional Flow-Matching Steps More Useful for Visual Reasoning

*[Self-Conditioning Enables Deep Sequential Reasoning in Flow Matching](https://arxiv.org/abs/2610.19628v1)*

Flow matching invites treating each sampler update as a reasoning step. This paper identifies a specific reason that intuition can fail. For VanillaFM, Theorem 1 proves that, under bounded velocity, Lipschitz, finite-precision, and acceptance-margin assumptions, K sequential Euler steps can be simulated in O(L) sequential rounds of parallel model evaluations, independent of K. With constant L, increasing sampling steps therefore does not expand the backbone’s stated circuit class.

Self-conditioning was already used in Analog Bits, so the change here is not simply introducing the technique. Analog Bits reported a self-conditioning ablation for diffusion generation; SelfCondFM instead conditions on the previous step’s estimate of the final image. The paper treats that endpoint estimate as information carried between sampler calls—a mutable computational state that vanilla sampling does not explicitly pass forward.

Controlled experiments on diverse visual-reasoning tasks report higher accuracy and greater reasoning depth for SelfCondFM than VanillaFM, and performance improves with more sampling steps. In long-text rendering, evaluated at 50 NFE on 100 held-out instances, the reported character error rate is 0.005 for SelfCondFM versus 0.046 for VanillaFM at matched training-compute budget. The error rate was computed from text parsed from generated and reference images; this task had no multi-seed evaluation.

This is a conditional result; the paper does not establish those assumptions globally for trained models. For one line-tracing model, the empirical Lipschitz estimates are “not certified upper bounds,” so they do not verify the theorem’s global regularity premise. The empirical scope is image-space visual reasoning: the paper does not demonstrate similar gains in video, continuous diffusion language modeling, or visuomotor policy learning. Its EndoCoT comparison is a reference rather than directly comparable because that method additionally uses latent chain-of-thought guidance.

**Research operation.** Hold the backbone, data, and training budget fixed, then sweep NFE while comparing a sampler that carries only its current state with one that carries an endpoint prediction. Measure both final accuracy and task difficulty solved, and inspect whether the carried state changes across steps. The question is not merely whether more compute helps, but whether each step receives enough mutable information to perform a new computation.

Read it to test whether an iterative generative model’s step count can add computation without changing its backbone, using the paper’s endpoint-feedback and NFE-scaling comparison as a concrete experimental template.

[abstract; §3.1, Theorem 1; Appendix D.2, Long text rendering; Appendix D.5.1; §6, Conclusion and Discussion; §4.3, Large-scale comparisons](https://arxiv.org/pdf/2610.19628v1) · [Section 3.2, Ablation of Self-Conditioning](https://arxiv.org/pdf/2208.04202v2)

## Physics-shaped underwater restoration shows an uncertain low-data benefit while predicted transmission lacks range correspondence

*[Physics-Shaped, Not Physical: Auditing Physics-Guided Underwater Image Restoration](https://arxiv.org/abs/2610.19763v1)*

The paper separates a restoration model’s performance claim from its physicality claim. It addresses a concrete limitation in this area: physics-guided networks can predict transmission and backscatter and invert a formation model, yet rarely test whether the physics does any work. The audit combines five-seed ablations on UIEB, zero-shot evaluation on complete LSUI (4,279 pairs) and AUIED3K (3,000 pairs), a capacity-matched control in a reduced-data study, and validation against measured range on Sea-thru. For researchers, the reusable move is to make output quality, data efficiency, and latent-variable validity separate tests.

With all 800 UIEB training images, the full model versus plain U-Net changed PSNR by -0.06 dB on LSUI (95% interval [-0.25, +0.12]) and -0.01 dB on AUIED3K ([-0.72, +0.70]); both intervals include zero. The physics module multiplies FLOPs by 3.4. In this regime, its added computation was not accompanied by a reliable zero-shot gain.

At 80 images (10%), the module’s gain over the no-module variant was +0.65 dB on UIEB-validation and +1.48 dB on AUIED3K. The latter had a 95% seed-level interval of [-0.08, +3.03]; after Holm correction, only the full-data UIEB-validation comparison remained significant. At this data size, a capacity-matched generic control trailed the full model by +1.03 dB on AUIED3K, but none of the six full-versus-control comparisons was significant after correction. This is a useful low-data signal, not a conclusive effect.

Physicality was a separate failure point. Across 411 Sea-thru images from five sites, pooled transmission–range Spearman correlation was -0.07 versus -0.10 for a same-site, different-image null; the image-specific difference was +0.02, and a Beer–Lambert fit explained 0.4% of variance. In this unsupervised design and transfer setting, predicted transmission therefore did not show correspondence with measured range consistent with a physical transmission quantity.

The paper’s interpretation is that the observed benefit comes from a physics-shaped inductive bias rather than from physics. A practical audit operation follows: pair multi-seed full-data and low-data comparisons with capacity matching, direct validation against a measured physical variable, and gradient-flow checks. The implementation audit found that an earlier torch.no_grad wrapper around frozen task and VGG feature extractors prevented those feature losses from influencing training, so loss ablations require this check before interpretation.

Keep the conclusion bounded: the evaluation covers one architecture, one 800-image training set, and one resolution. The authors state that these conclusions concern this design and regime, not physics guidance in general. The physical result is scoped to a transfer from linear Sea-thru images, exposure-normalized and sRGB-encoded, to a model trained on display-referred UIEB images; the authors note that this domain shift may depress correlation with range. The study reports PSNR and SSIM, not downstream-task performance.

Read this to learn how to distinguish a module’s low-data performance signal from evidence that its latent variables represent the claimed physics.

[abstract](https://arxiv.org/abs/2610.19763v1)

## Self-generated updates destabilize long-horizon test-time training; independent-text checks screen candidate states

*[Self-Generated Feedback Destabilizes Test-Time Training: A Causal Decomposition of Long-Horizon Adaptation](https://arxiv.org/abs/2610.05076v1)*

### The limitation
TTT-E2E, the inherited setup, updates selected MLP weights at inference with next-token prediction and is meta-trained for performance after those updates. The new limitation is long-horizon self-contamination: retaining an update from generated text changes the model that generates the next training chunk. Across 128K-token streams, retaining generated-text updates worsens prediction on independent human-written text for 125M, 760M, and 3B TTT-E2E configurations. The paper also says the same update mechanisms can improve on real text, so the failure is not attributed to writing itself.

### Matched decomposition
Three matched comparisons identify the links. Fixed Generation uses a frozen generator and removes over 98% of damage at 125M and 760M. Recorded Replay holds saved tokens fixed and separates the loss from reading degraded text from the additional loss stored by writing on it. A paired one-update comparison uses identical pre-update state and source chunk: the retained update predicts its source better but next independent real text worse. Its mean next-passage cost is .0381 nats after Closed Loop history, versus .0045 after Writes Off and .0018 after Fixed Generation history.

### The commit rule
Settlement changes the commit rule, not the update target. It tests a temporary candidate state against the currently accepted state on independent real text and commits only when validation NLL does not increase. On generated-stream tests, endpoint gaps are .07 nats at 125M and -.02 at 760M; an all-real stream reports 89 of 113 proposals accepted and a .0534-nat first-to-last benefit relative to Reject All. These numbers show a tested selection criterion, not proof of equivalence or superiority to disabling writes: the residual intervals include zero, and the two language-model scales use separate suites.

### Research operation
Preserve the causal separation: compare source fit and independent-text transfer from the same state, log whether damage is concentrated in a few trajectories, then validate a candidate before committing it. The key question is whether the validation stream remains independent as the system runs, and how much validation cost is justified by avoided persistent error. The principal outcome here is independent-text NLL, not remembering generated text; passages from the same book can still qualify as independent under the paper's protocol. The 3B screening removes anomalously low-loss books but cannot rule out contamination, so scaling claims remain uncertain.

Read it for the matched Fixed Generation, Recorded Replay, and paired-update design, plus a concrete candidate-state validation rule for diagnosing whether an adaptive system is corrupting its own future evidence.

[abstract](https://arxiv.org/abs/2610.05076v1) · [Abstract; Sections 2.1 and 2.3; Section 2.3.1](https://arxiv.org/abs/2512.23675v2)

## TRACER trains across prompt-injection channels and lowers RAG-framed attack success on GSM8K

*[TRACER: Trace-Regularized Training Against Indirect Prompt Injection](https://arxiv.org/abs/2610.19133v1)*

Earlier evaluation work in the supplied comparison argues that prompt-injection defenses should be assessed on both utility and effectiveness, rather than attack resistance alone. Relative win rates can also conceal low absolute capability. TRACER adds a channel variable: in its controlled evaluation, the same attack content was more successful when rendered as retrieved context than as a follow-up message. The reported averages were 18% for follow-up and 53% for retrieved context.

TRACER makes presentation wrappers part of adversarial training by sampling them during training. Its objective combines an answer-anchored, evidence-gated reward with ATRC, which aligns attacked reasoning with clean evidence when an injection is invalid. The method also gates the trace-regularization signal on a correct clean answer and invalid injected evidence, so it is not intended to preserve an incorrect clean response or suppress valid evidence-based correction.

On GSM8K with Qwen2.5-3B-Instruct, RAG-framed TRACER training reduced conditional ASR from 65.5% for the base model to 6.1%, while reported clean accuracy stayed in the 78–82% band. An objective ablation reports 21.3% ASR for answer-only training, 13.8% after adding composite reward, and 6.1% with ATRC; this associates improvement with both additions beyond answer-only training, without establishing that the same component contributions generalize to other tasks or models. Transfer is not uniform: on 3B evaluations, joint RAG+tool training gave the best average cross-framing result, while single-channel training produced different native-versus-transfer profiles. At 7B, the best reported cross-framing average occurred after one RAG-training epoch, at 9.4%; later training did not improve that average.

Boundaries matter. The primary attacks are template-based, and the reported training mitigation is evaluated within Qwen2.5 at 3B and 7B scale; cross-architecture training remains untested. The authors frame TRACER as complementary to runtime protections, not a replacement for filtering, validation, monitoring, sandboxing, or least-privilege access. The practical experiment to borrow is therefore simple: hold the malicious payload fixed, vary its wrapper, report conditional ASR alongside clean accuracy, and compare specialized with joint training under held-out paraphrases and defense-aware attacks. TRACER supplies a training intervention and a channel axis for testing, not a standalone security boundary.

Read it to turn wrapper variation into an explicit prompt-injection experiment: the paper provides a same-payload comparison, an implementable trace-regularized objective, component ablations, and cross-channel transfer results, while clearly bounding the evidence to template-family attacks and Qwen2.5 training.

[abstract; Section 1, paragraph 3; Section 5, “The framing gap is large and consistent”; Appendix A.3, Table 5; Section 5, “TRACER closes the native RAG vulnerability”; Appendix A.3, Table 5; Section 5, “Stress tests, mixed evidence, and component attribution,” Table 1(b); Appendix A.2, paragraph 2; Section 5, “Cross-framing transfer reveals a depth–breadth trade-off”; Appendix D, Table 8; Section 5, “Ablations, scaling, and broader transfer strengthen the story”; Appendix D, Table 8; Appendix F, Table 12; Limitations, paragraph 1; Ethical Considerations, paragraph 2](https://arxiv.org/abs/2610.19133v1) · [Section 4, paragraph 1; Section 4.1.1, paragraph 2](https://arxiv.org/abs/2505.18333v1)

## STRATA makes test-time agent memory a maintained graph with typed retrieval and conflict warnings

*[STRATA: Self-Maintaining Structured Experience Graphs for Self-Evolving Language Agents](https://arxiv.org/abs/2610.19386v1)*

## What changes

The paper targets two failure modes it identifies in earlier memory designs: single-level memory can degrade sharply as the task set grows, while concrete memories can produce negative transfer when superficially similar experiences point in opposite directions. AWM stores abstract reusable subroutines from successful trajectories. ReasoningBank distills strategies or preventative lessons from judged successes and failures. STRATA instead integrates these pieces into a three-layer graph of atomic skills/code, task workflows, and generalized meta-frameworks connected by typed edges.

Its similarity geometry combines content/applicability embeddings, operation-and-target tags, and lexical overlap. Retrieval returns a confidence-filtered subgraph: generalized principles are rendered before workflows and callable skills, with contrast neighbours added when relevant. After episodes, the system writes procedures from successes and pitfalls from failures, induces meta-frameworks by clustering workflows, deletes low-quality workflows under pressure while protecting articulation points, and links direction-opposite experiences with warning edges.

## Evidence

Across AppWorld, WebArena, ALFWorld, and ScienceWorld, using two frozen DeepSeek-V4 backbones, seven memory baselines, and three seeds, STRATA has the strongest reported average and leads most individual benchmark-metric columns; some pairwise gaps remain within seed variation. On DeepSeek-V4-Pro, it is the fastest memory-augmented method and uses the fewest output tokens and environment steps among measured memory methods: 58.7 seconds, 5,217 output tokens, and 11.7 environment steps per task.

The component ablation says every tested mechanism contributes; removing operation/target tags costs the most, 13.1 average points, although the shared similarity geometry means this does not isolate retrieval alone. The within-system negative-transfer diagnostic is direct: removing contrast edges lowers ScienceWorld from 96.7 to 78.7 and ALFWorld from 98.6 to 89.5. With collection disabled, the store grew to 269 workflows and 48.7 injected lines per task while scoring 70.7 versus 72.9 for full STRATA; matched-size results separately favored articulation-point protection.

## Boundaries and a research operation

The evidence is limited to two frozen backbones from one model family. Contrast edges use a supplied opposition lexicon rather than discovering opposition. The main-table ScienceWorld comparison is not statistically separable from the best baseline given 23 tasks. The authors also report an unexplained ALFWorld `clean_and_place` deficit. The claim that single-level memory degrades as task sets grow is suggestive rather than a controlled scaling test because the comparisons change other factors.

A useful next experiment is to fix task difficulty, memory size, and seeds, compare flat, graph, and graph-plus-contrast retrieval, and test warnings on held-out operator oppositions and additional model families. The research question is whether structured tags and warnings remain useful when the opposition signal is not supplied.

Read it to see how typed operation/target matching, forgetting, and contrast warnings are evaluated alongside latency and environment-step costs.

[abstract](https://arxiv.org/abs/2610.19386v1) · [Section 2.3, LM-based Workflow Induction](https://arxiv.org/abs/2409.07429v1) · [§3.2; Appendix A.1–A.2](https://arxiv.org/abs/2509.25140v2)
