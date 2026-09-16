# 2026-09-13

## AttnFuse Makes RoPE a First-Class Attention Compilation Operation

*[AttnFuse: A Composable DSL for Compiling Attentions to Fused GPU Kernels](https://arxiv.org/abs/2609.13612v1)*

AttnFuse addresses a specific compiler-interface limitation in flexible attention. PyTorch’s `flex_attention` lets researchers describe custom attention patterns in Python and compile them to fused kernels, but its design applies modifications after the central matrix multiplication, excluding Rotary Position Embedding (RoPE). AttnFuse changes the attention language instead: RoPE and other pre-multiplication transformations become explicit, composable operations.

The DSL is deliberately narrow. Researchers combine ten high-level building blocks, including RoPE, causality, and softmax, and the compiler turns every well-formed program into one fused GPU kernel. Its four-stage process—fusing, tiling, lowering, and code generation—therefore targets a constrained attention intermediate representation rather than arbitrary GPU programs. The practical research question is whether this restriction is enough to expose useful variants without returning kernel implementation to each researcher.

The reported performance is conditional but substantial. On an RTX 3090, the paper reports a 2.10× speedup over `flex_attention` for the RoPE+causal pattern, while on an H100 it reports a full Llama-3-8B training step within 5% of PyTorch’s hand-tuned backend. The authors’ strongest systems lesson is that these results do not imply that fused RoPE should always be selected. Their “Rotation Calculus” models pre-rotation as a memory-bandwidth cost and in-kernel rotation as a compute-and-tiling cost. The derived Hopper crossover is approximately N*=5,500, consistent with measurements between sequence lengths of 4K and 8K.

The boundary conditions change the interpretation. The Hopper optimization currently covers causal MHA/GQA, head dimension 64 or 128, fp16/bf16, sequence length at least 2,048, and forward-only execution. On H100 at N≥8K, the paper reports that pre-rotation wins, making the current fused RoPE path less favorable for very long contexts on compute-rich hardware. In addition, the reported HuggingFace end-to-end graph applies RoPE before the registered attention function, so that experiment traces plain causal attention rather than fused RoPE.

A transferable operation is to treat each proposed attention transform as a compiler-choice experiment: implement both a fused path and a pre-transform path, then measure them across GPU architecture, sequence length, head dimension, and precision. The question to carry into a new project is not simply “can this operation be fused?” but “under which hardware and shape conditions does fusion beat the extra memory traffic?”

Read it to study a concrete compiler decision: when should an attention transformation such as RoPE be fused into the kernel, and when should it remain a separate operation?

[Abstract; S1.SS0.SSS0.Px3.p2; S3.SS1.p3; S5.SS3; S9.SS1.p1-p2; S6.SS5.SSS0.Px1.p1](https://arxiv.org/abs/2609.13612v1)

## mKernel Extends Tile-Level Fused Kernels Across NVLink Domains and RDMA Nodes

*[mKernel: Fast Multi-GPU, Multi-Node Fused Kernels](https://arxiv.org/abs/2609.13585v1)*

mKernel addresses a concrete boundary in distributed GPU execution: the paper says existing fused kernels are largely confined to a single NVLink domain, while overlapping communication and computation on separate streams reduces only part of communication cost. Its method extends fusion across nodes by overlapping computation, intra-node NVLink communication, and inter-node RDMA at tile granularity. The change is therefore architectural: inter-node movement becomes part of the persistent kernel’s tile schedule rather than a separate collective stage.

Each persistent kernel partitions streaming multiprocessors into compute and communication roles. An on-GPU controller adjusts that split at runtime because the useful partition varies with the kernel and input shape. Data movement is hierarchical: mKernel uses NVSwitch for local reduction and broadcast, then exchanges per-node aggregates across the inter-node network. For RDMA submission, a GPU-side command queue signals a host proxy implemented directly on libibverbs; the same approach is reported for InfiniBand and AWS EFA. The library implements five patterns: AllGather+GEMM, GEMM+ReduceScatter, GEMM+AllReduce, Ring Attention, and MoE Dispatch+GEMM.

The paper reports up to 1.72× speedup for GEMM+AllReduce and 1.88× for Ring Attention on two 16-GPU H200 clusters, using unfused cuBLAS or FlashAttention followed by NCCL collectives as baselines. These are author-reported maxima from the stated testbeds, not evidence that every kernel or topology benefits equally. In the authors’ ConnectX-7 experiments, GPUDirect Async reportedly added little benefit over host-assisted GPU-initiated communication. The adaptive controller achieved a 1.18× geometric-mean result across 21 configurations versus the static best fixed partition, but that adaptation experiment was limited to a single node by testbed constraints.

For a researcher building a distributed kernel, the transferable operation is to design the communication schedule from the topology inward: first identify what can be reduced or broadcast within an NVLink domain, then send only the necessary aggregate across nodes, while reserving explicit SM capacity for communication. A useful follow-up question is whether the same controller remains beneficial when inter-node RDMA contention, node count, and topology change. That question should be tested separately from fusion gains, with static and adaptive SM splits compared under identical shapes and baselines; the paper does not provide multi-node evidence for that adaptive component.

Read this paper to learn a concrete topology-aware recipe for fusing computation with multi-node communication, while keeping the reported speedups and the single-node limit of adaptive SM partitioning explicit.

[abstract1.1; S3.SS1.SSS0.Px1.p1; S4.p1; S7.p1; S5.SS5.SSS0.Px2.p1; S5.SS5.p1](https://arxiv.org/abs/2609.13585v1)

## SAS Trains Sparse-Attention Context Ranking with the Language-Modeling Loss

*[SAS: Simple Attention Sparsification via End-to-End Optimization of Context Ranking](https://arxiv.org/abs/2609.13141v1)*

Post-training attention sparsification asks a selector to retain only a small set of historical tokens or blocks for each query. The practical constraint is a fixed attention budget: every retained context unit must justify its place. The paper identifies a mismatch in common trainable selectors. They score context units, apply hard Top-K selection, and thereby block the language-modeling loss from directly updating the selector. Instead, many methods distill layer-wise dense-attention distributions. That can imitate where the original model attends without directly optimizing which units are most useful for predictions under the sparse budget.

SAS changes the training interface rather than replacing Top-K inference. Its selector produces scores for historical blocks, converts them into normalized softmax gates, and injects the logarithm of each gate into the attention logits before the attention softmax. The language-modeling loss can then update the selector through ordinary backpropagation. The forward pass preserves continuous gate values, while inference still uses hard Top-K selection. A Triton kernel integrates the per-block gate injection into FlashAttention-style computation for memory-efficient long-context training.

The paper’s ablations make four implementation choices central: place the gate inside attention as a log-space bias, normalize gates with softmax, preserve continuous scores rather than reducing them to binary masks, and train mainly over the selected sparse scope. These choices are evaluated in controlled ablations using an AttnGate selector with block size 64 and Top-K 32 on Qwen3-4B trained on OpenR1-Math-220k.

The reported evaluation spans reasoning, long-context understanding, and agentic tasks. The abstract says SAS consistently outperforms trainable sparse-attention baselines across attention budgets, with especially large gains under tight budgets. Because the supplied evidence gives no numerical effect sizes or context-length breakdown in the abstract, this supports a directional conclusion about ranking under the reported settings, not a claim that the method wins in every long-context regime.

A useful replication is to hold the backbone, selector, block size, and Top-K budget fixed while comparing dense-attention distillation against the SAS gradient path. Then remove one design choice at a time—inner versus outer gating, normalized versus unnormalized gates, continuous versus binary values, and dense versus selected-scope training—and measure both task quality and selector cost. This isolates whether the gain comes from objective alignment, gate parameterization, or the training scope.

Read it if you are implementing post-training block-sparse attention and need a way to train the selector against the language-modeling objective under a fixed Top-K budget.

[Abstract; S1.p4; S4.SS1.SSS0.Px2](https://arxiv.org/abs/2609.13141v1)

## Herald classifies harmful prompts from seven-feature activation trajectories

*[Harmfulness Propagation Dynamics: Layer-wise Trajectories of Adversarial Intent in Large Language Models](https://arxiv.org/abs/2609.13534v1)*

Earlier work used a single difference-of-means refusal direction and tested it by ablating residual-stream activations across layers and token positions. The relevant limitation for this brief is that a single-direction intervention does not itself record when a safety signal emerges across depth. Herald targets that observability gap by learning one supervised LDA harm direction per layer from labeled prefill last-token states and forming a cross-layer projection sequence.

It compresses the sequence into seven geometric features— including slope, curvature, monotonicity, onset, and related statistics—and classifies them with a 288-parameter MLP. The method requires no gradients at direction-learning time and reports 262 KB of direction storage and about 2.6×10−6 of prefill FLOPs for a 32-layer, d=4096 model.

On WildGuardMix, Herald approaches its performance plateau at about 1,000 samples per class and leads latent baselines by more than 2 F1 at 100 samples on all tested backbones. In a 200-prompt jailbreak intervention on Llama-3.1-8B-Instruct and OLMo2-7B-Instruct, zero-projecting the harm direction at the peak-monotonicity layer reduced refusal from about 94% to about 60%, with refusals judged by a Llama-Guard-3 oracle. This is useful evidence for a compact detection-and-intervention recipe, but it does not establish that one layer explains refusal generally.

The reported advantage is bounded. Herald trails the best guard by 4.3 F1 on ToxicChat and 8.4 F1 on OpenAI Moderation. WildGuardMix training data and WildJailbreak test data share WildChat as a source corpus, so those distributions are not fully independent. Because HPD is measured at prefill, the method may miss harmful intent that becomes resolvable only after extended reasoning.

A concrete follow-up is to hold out an entire source corpus, compare the seven-feature trajectory with a single-layer score, and add generation-time probes for post-prefill harms. That experiment would test whether the trajectory is the transferable signal, rather than merely a compact encoding of the training distribution.

Read it to learn how to turn per-layer hidden-state probes into a low-cost moderator, then test whether its apparent jailbreak advantage survives source-level holdouts and prefill-only blind spots.

[S1.p6 / S4.SS3.SSS0.Px1 / A1.p1; S6.T2 / S6.SS2.p1; Appendix N (A14.SS0.SSS0.Px1 / A14.T17); S6.p1 / S8.SS0.SSS0.Px2.p1.1; Appendix S (A19.SS0.SSS0.Px1.p1.1); Appendix U (A21.SS0.SSS0.Px3.p1.1)](https://arxiv.org/abs/2609.13534v1) · [§3.1 (S3.SS1.p1–p2) and Figure 1 (S1.F1)](https://arxiv.org/abs/2406.11717v3)

## Internal-DW Reweights Long-Horizon Backward Routes Without Changing the Forecast Rollout

*[Large Distant Gradients Need Not Be Reliable: reliability-weighted credit assignment for long-horizon autoregressive forecasting](https://arxiv.org/abs/2609.12890v1)*

In long-horizon autoregressive forecasting, BPTT carries each future loss through repeated autoregressive Jacobian products. The concrete limitation examined here is that transported gradient magnitude is not the same as reliable learning signal: in a controlled system, distant gradients can grow while their signal-to-noise ratio falls, because predictable signal and unpredictable variation are carried together.

The method, Internal Dual-Wiener routing (Internal-DW), changes only backward routing. It preserves the full forward rollout and all horizon losses while reliability-weighting internal gradient routes. At each residual block, bounded Wiener gains weight the identity and nonlinear routes; the gains are estimated from route-level gradient statistics and an explicit noise model. The intervention is therefore backward-only rather than a change to the forward rollout.

Decisive evidence comes in two stages. In the known-SNR control, Internal-DW reduced held-out error in recovering predictable gradient signals and improved forecasting. On four history-dominated, weak-drive testbeds, it reduced forecast error by 5.16%–13.76% relative to full BPTT, beat gradient clipping and Jacobian regularization on all four, and beat validation-selected TBPTT on three. The reported comparisons used shared models, training horizons, optimizers, and other settings, with three matched seeds; TBPTT settings and the DW sampler were selected through validation procedures. A fitted training-horizon analysis also found that the Internal-DW optimum was no shorter than the full-BPTT optimum on every matched seed and in the seed-averaged fits, with lower fitted minimum error on all four datasets.

These results are conditional rather than a guarantee. The current estimator’s benefit diminished or reversed when usable history was limited or when the selected noise sampler failed to represent dominant drive-dependent variation. The supplied examples include approximately 7.87% worse forecasting on NARMA and a 7.71% degradation after a driven-Mackey–Glass intervention. In addition, Internal-DW minimizes a local quadratic route risk rather than the observed rollout loss, so it does not guarantee a better training trajectory.

A transferable research operation is to test reliability before applying selective backward control: use held-out probes to assess whether usable history dominates and whether a candidate sampler represents drive-dependent variation, then compare full BPTT, Internal-DW, clipping, and TBPTT at matched horizons. Log horizon-wise gradient magnitude, estimated SNR, and forecast loss. The key question is whether the estimator’s predicted route reliability tracks improvement in the actual rollout objective.

Read it to learn how to test whether long-horizon gradient magnitude reflects predictable signal, and to identify the history and sampler conditions under which reliability-weighted routing stops helping.

[Abstract; S5.SS2.SSS0.Px1.p1–p2; S5.SS2.SSS0.Px2.p1; S6.p1](https://arxiv.org/abs/2609.12890v1)

Prepared retrospectively from the 2026-09-13 candidate papers; verified on 2026-09-16.
