# 2026-09-07

## ObserverBench evaluates mechanistic observers by downstream action loss, not prediction accuracy alone

*[ObserverBench: Testing Mechanistic Estimates for Intervention and Control](https://arxiv.org/abs/2609.03026v1)*

ObserverBench asks whether an internal mechanistic estimate (an “observer”) is adequate for the intervention, control, or safety task it directs. Each task fixes the model, information boundary, allowed actions, decision rule, held-out cases, and loss. The benchmark reports estimation accuracy separately from the loss caused by the chosen action. That contract makes the observer part of a decision procedure: the relevant question is whether it selects lower-loss actions on held-out cases, not only whether it predicts an internal quantity accurately.

For affine target and observer readouts, Proposition 1 says adequacy requires agreement at the starting state and along directions spanned by the allowed edits—the reachable subspace. This criterion is conditional on affine readouts, a defined starting state, and the edit directions available to the controller. In the small learned Transformer experiment, a finite-horizon certificate correlated 0.952 with final error and got the sign right in 96.0% of conditions, under proportional feedback and residual edits after the first block.

On GPT-2-small IOI, an all-pairs observer reduced held-out candidate-mask mean-effect MAE to 0.395, from 0.486 for per-head additivity and 0.473 for count additivity. But the paper’s interpretation is that mean-effect prediction and action selection are different tasks: per-prompt dispersion can make masks with the same average effect have different losses. In a fixed-action confirmation using held-out prompts, frozen measurements, and a frozen action pool, the direct-loss observer reduced action loss from 1.076 to 0.833, a 22.6% reduction.

In budgeted authorization triage on Qwen2.5-7B-Instruct, a label observer had AUROC 1.000 but deployment loss 3.334; multiplying its score by severity lowered AUROC to 0.954 and loss to 2.155, under a controller that blocked the top 10% and escalated the next 10%.

A transferable experimental operation is to specify the action rule and loss before fitting an observer, hold out cases for the final decision test, compare prediction-target training with action-loss training, and test adequacy along the intervention’s reachable directions. These results are scoped: the control analysis assumes affine readouts, one fixed direction, proportional control, and no clipping, while its nonlinear test uses a small model with known binary features. The pretrained-model studies use pinned checkpoints, selected head sets, fixed ablations, and narrow prompt distributions; the IOI confirmation was pilot-informed and locally sealed rather than independently preregistered. The authorization task asks Qwen directly for an authorization verdict and therefore cannot establish a uniquely hidden safety state or test harmful execution, deception, or adaptive attacks.

Read it to redesign an interpretability experiment around the loss of the action it enables: fix the task contract, test held-out decisions, and check whether a better observer actually improves intervention or triage outcomes.

[Abstract; Sec. 3, Proposition 1 (Reachable-subspace adequacy); Sec. 3.2 (nonlinear-suffix experiment); Sec. 4.1.2 (GPT-2 IOI mean-effect prediction), Table 5; Sec. 4.1.3 (GPT-2 IOI: prediction vs decision), Eq. 2; Sec. 4.1.4 (predicting action loss) and Sec. 4.1.5 (confirmation), Tables 6–7; Sec. 5.1 (Authorization interlock), Table 11; Sec. 7 (Limitations), S7.I1.i1; Sec. 7 (Limitations), S7.I1.i2; Sec. 7 (Limitations), S7.I1.i3](https://arxiv.org/abs/2609.03026v1)

## Response rewriting produces stronger, more persistent, and bidirectional behavioral shifts

*[From Reweighting to Rewriting: Unlocking the Intervention Effects of Influential Samples in Training Data Attribution](https://arxiv.org/abs/2609.02771v1)*

Training-data attribution (TDA) seeks examples that shape model behavior, but influence functions (IF) estimate the effect of *infinitesimal reweighting*. The paper starts from a practical failure case: IF-selected examples often have limited advantage over random selection when the intervention is only a weight change. That evidence does not by itself establish that the selected examples lack leverage; it also leaves open whether reweighting is the wrong operation for realizing it.

The authors change the intervention while retaining IF-based selection. Their influence-guided response rewriting identifies targets with IF, holds each instruction fixed, and replaces its response with behavior-aligned or behavior-opposed supervision. In the main abstention setup, they select 1,600 examples—2.5% of a 64,000-example SFT subset—using EK-FAC influence scores for a held-out 300-query target. They then retrain from the same base checkpoints, with fixed data order, after deletion, upweighting, aligned rewriting, or opposed rewriting. Abstention recall on held-out evaluations is the primary outcome across four open-weight LLMs.

Under those conditions, the reported contrast is decisive at the level of intervention type: rewriting produces stronger, persistent, bidirectional shifts, whereas reweighting of the same selected examples is weak and inconsistent. The authors also report that deletion and upweighting can be unstable, fail to beat the baseline, and sometimes move in the opposite direction. This is not evidence that reweighting fails under every conceivable schedule or retraining regime; the reported sweeps cover specified weights and intervention budgets in this SFT setup.

Selection still matters after changing the edit. On OLMo2-1B, IF-selected examples reportedly yield greater rewriting leverage than probing, TRAK, first-order gradient variants, loss, and random selection when equal-sized rewritten sets are compared. Scenario-wise abstention changes remain concentrated on the target scenarios rather than becoming a uniform refusal increase. The safety-refusal extension follows the same qualitative rewrite-versus-reweighting contrast, but its aligned safety gains come with a tangible over-refusal cost on benign prompts.

The transferable research operation is to evaluate attribution as a two-stage procedure: separately test **which data are selected** and **which permissible edit is applied**, then measure durable, bidirectional target effects and collateral behavior. The scope remains narrow: the framework is most natural where explicit aligned and opposed responses can be written, and standard IF construction remains a local reweighting analysis.

Read this to design an SFT data-curation experiment that compares attribution-based selection and response-level editing separately, rather than treating weak reweighting effects as a verdict on the selected examples.

[Abstract; S4.SS2.SSS0.Px1.p1.1; S5.SS1.SSS0.Px1.p1.1; S5.SS3.p2.1; S6.SS0.SSS0.Px2.p1.1; S7.p2.1](https://arxiv.org/abs/2609.02771v1)

## Routing separation alone may not prevent negative transfer.

*[Routing Is Not Enough: Diagnosing Intra-Adapter Subspace Contention in MoE+LoRA Fine-Tuning](https://arxiv.org/abs/2609.03150v1)*

## The failure mode

Token-level routing can be near-disjoint across domains while negative transfer still occurs in LoRA-adapted MoE: routing separation alone did not prevent increased code perplexity when biomedical data was added. The paper treats this as a warning that an expert-routing proxy for domain separation does not, by itself, establish separation of the trainable update space.

## Diagnosis and intervention

The authors introduce Jaccard routing overlap and adapter-gradient cosine similarity, which measure expert sharing and update compatibility, respectively. They report that per-domain LoRA adapter gradients were essentially unaligned (near-orthogonal), implicating intra-adapter gradient competition as the interference mechanism rather than shared routing. In the reported code–biomedical experiment, the aggregate gradient cosine across 20 trials was \(\cos(g_c,g_m)=-0.002\pm0.003\), while the accompanying routing overlap was near-disjoint.

SpawnLoRA implements input-gated sub-adapters inside experts so new adaptation pathways are added without changing token routing; the expert output sums frozen base weights, a base LoRA adapter, plus gated sub-adapter outputs. Thus the proposed change is structural separation *within* an already selected expert, rather than changing the router or only enlarging one shared adapter.

## What the evidence says

SpawnLoRA reduces negative transfer (lower code perplexity and variance) compared to standard LoRA and a rank-adaptive baseline (DR-LoRA) in the studied mixtures and architectures. The reported comparison covers Phi-tiny-MoE-instruct and OLMoE-1B-7B under 80/20 and 50/50 mixtures, with means and standard deviations over three seeds. **Author interpretation:** Expanding shared adapter rank (DR-LoRA) can worsen negative transfer under strong domain conflict because it increases the shared subspace where near-orthogonal gradients compete.

A useful research operation follows: in a multi-domain MoE+PEFT run, log routing overlap and per-domain adapter-gradient cosine before assuming routing has isolated updates. If routing is separated but gradient compatibility is poor, compare shared-rank growth with a mechanism that creates gated, localized adapter paths; treat this as a testable design question, not as a guaranteed remedy.

The boundaries are substantial. The authors write that whether the diagnosis and mitigation remain stable at \(\geq70\)B parameters or substantially longer training runs “remains open.” Their headline results use perplexity, and they state that HumanEval pass@1 was not informative at the controlled 2,000-example training scale. They also do not establish whether the reported gradient pattern extends to less-dissimilar domain pairs or more than two domains.

Read this to design a concrete diagnostic ablation: test whether low routing overlap actually coincides with compatible adapter gradients before choosing rank expansion or adapter splitting for multi-domain MoE fine-tuning.

[Abstract; §4; §5.1–§5.2; Limitations](https://arxiv.org/abs/2609.03150v1)

## A consistent model bias favors earlier-positioned evidence in contextual-conflict resolution

*[Large Language Models in Resolving Contextual Knowledge Conflicts](https://arxiv.org/abs/2609.03148v1)*

Most prior work on knowledge conflicts has focused on a mismatch between an LLM’s parametric knowledge and externally supplied context. Yang et al. instead study conflicts *within* the supplied context ([Abstract]). Their ContextConflict dataset contains 5,781 samples and defines six conflict types—misinformation, inferential, temporal, granularity, perspective, and ambiguity—across reasoning and summarization tasks ([§2]). It includes both explicit contradictions and implicit cases requiring multi-step reasoning, so the benchmark is not restricted to directly opposed statements.

The empirical question is whether models combine incompatible evidence rather than merely select an answer. The authors report that modern LLMs still fall short on this benchmark ([§3.3]). There is a reporting detail worth checking when using the paper: the abstract says the experiments cover nine LLMs, whereas the supplied §3.3 evidence record describes seven named models. The conclusion is therefore benchmark-specific, with reasoning evaluated by accuracy and summarization evaluated by balance and faithfulness.

The diagnostic contribution goes beyond final outputs. The authors report latent awareness of contextual conflicts, with conflict types emerging at different layer depths and occupying distinct latent geometries ([§4.1–§4.2]). They also report a consistent preference for earlier-positioned evidence, at representation and output levels, and interpret this positional preference as an obstacle to comprehensive evidence integration ([§3.3; §4.3]). A transferable experiment follows directly: when evaluating multi-document systems, permute evidence order and measure both answer quality and each source’s contribution, separately for conflict types rather than only in aggregate.

For intervention, the authors propose “a simple training-free, label-free steering method” that steers activations toward more comprehensive evidence incorporation ([Abstract]). They report improved reasoning accuracy and higher-quality, more balanced summaries on ContextConflict. These are results on this benchmark, not evidence that the intervention will handle noisy retrieval pipelines: the authors state that evaluating heterogeneous real-world retrieval evidence remains open. The method also requires white-box residual-stream access and inference-time overhead, thus applying only to open-weight models; steering experiments were limited to 8B and 20B GPT and LLaMA models ([Limitations]). A useful follow-up question is whether rebalancing should remain symmetric when evidence sources differ in reliability, since the paper’s Shapley-based attribution assumes equal expected contribution from each evidence piece.

Read this to turn evidence-order sensitivity into a measurable multi-source evaluation and to examine a white-box activation-steering intervention with clearly stated deployment limits.

[Abstract; §2 (p. 3); §3.3; §4.1–§4.3; Limitations](https://arxiv.org/abs/2609.03148v1)

## Trace-before-context outperformed trace-after-context in 26 of 27 reported long-context comparisons

*[Trace as State: Reasoning Traces as Conditional States for Long-Context Transformers](https://arxiv.org/abs/2609.02702v1)*

## The limitation is causal ordering

The authors frame a causal-ordering mismatch: long-context reasoning can depend on task state discovered only later, whereas transformers process information causally. In their formal conditional-state-update setting, supplying a condition before an information sequence can require exponentially less memory in the worst case than supplying it afterward. This is a formal result about the stated processor setting; the supplied evidence does not establish that its worst-case effect size directly predicts behavior in deployed transformers.

## Method: reread with the trace first

**Trace as State** runs a read–compute–feedback–reread procedure. It collects one or more first-pass reasoning traces, serializes them as a trace block `T`, then makes a fresh causal pass with prompt order `[T, x, q]`: trace, original long context, question. The trace is intended as a textual proxy for task state, so information derived on the earlier pass is available while the model rereads the context.

The matched control, **Trace Append**, uses the same trace block but orders the prompt `[x, T, q]`. This makes ordering—not merely adding generated text—the central experimental contrast.

## What the reported tests show

Across three models, three long-context datasets, and reported metrics, Trace as State outperformed Trace Append in 26 of 27 combinations. On GraphWalks Parents, DeepSeek V4 Pro Preview rose from 29.2% exact match on the initial pass and 43.0% with Trace Append to 81.8% with Trace as State. For GLM-5.2, the corresponding reported values were 66.4%, 83.2%, and 100.0%.

An ablation on DeepSeek V4 Pro Preview for GraphWalks 256K also weakens two narrower explanations: random traces performed worse than the no-trace first pass, and providing traces without the original context remained below Trace as State. These are constrained ablations on one model and task family, rather than evidence that every generated trace or domain will behave this way.

## What to test next

A focused follow-up is to hold the generated trace fixed and compare trace-before-context against trace-after-context under a matched token budget. Report answer quality alongside added passes, token cost, latency, and any loss of key–value-cache reuse. The evaluated textual realization requires raw reasoning traces or another exposed state interface; models or APIs that expose only final answers may need another interface. The authors also tested only three causal-transformer models and three task families, and did not evaluate multi-round agent tasks.

It gives a sharply testable long-context intervention: keep the same generated trace but move it from after to before the context, then measure whether causal ordering—not extra text—accounts for the result and whether the added inference cost is justified.

[Abstract; §1; §3.3; §4.3 and Table 3; Limitations](https://arxiv.org/abs/2609.02702v1)

Prepared retrospectively from the 2026-09-07 candidate papers; verified on 2026-09-16.
