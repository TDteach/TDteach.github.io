# 2026-09-03

## 在给定的高斯/矩阵条件下，负相关性使边际匹配的泊松采样在整阶Rényi散度上占优

*[Privacy Amplification Without Independence: How Far Negative Dependence Carries the Guarantees of Poisson Subsampling](https://arxiv.org/abs/2609.01944v1)*

Poisson subsampling is the default sampler in differentially private optimization because independence makes privacy amplification tractable. This paper asks when structured participation can safely replace a marginal-matched independent sampler—and treats that as a conditional comparison, not a general matched-rate rule.

Within the paper’s canonical Gaussian/matrix setting, the authors prove that if the participation-indicator vector is negatively associated (NA), the Gram matrix \(G\) is symmetric and elementwise nonnegative, and \(\alpha\ge2\) is an integer, then the structured scheme’s Rényi divergence is at most that of the marginal-matched independent scheme. The statement is exact at finite parameters under those conditions. The method change is therefore to examine dependence in the indicator vector, rather than infer privacy solely from a matching participation rate.

For a fixed-gradient mechanism-level comparison, the paper adds a mechanism condition: \(G\) must be sign-balanced. Under that condition, it reports the same integer-order dominance after taking the supremum over admissible Gram factors. This separates a sampler-side requirement (NA) from a noise/geometry-side requirement (sign balance).

The boundary is consequential. For the canonical \(k=1\) allocation pair with \(q=1/t\), fixed \(\sigma\), and \(t\to\infty\), the authors derive \(\Psi(\alpha)=-(2\alpha-3)v^2/(4t^2)+o(t^&#123;-2&#125;)\). They report that dominance reverses for every fixed real \(\alpha&lt;3/2\), including the KL limit. That is an asymptotic result for this allocation setting, not a claim that all NA samplers fail below \(3/2\). Separately, the abstract reports that below \((1-q)^t\), the hockey-stick ordering reverses, making substitution of the Poisson pair into composition machinery unsound in that threshold range.

A useful research operation follows: before reusing a Poisson RDP computation, characterize the participation indicators’ dependence and, in the fixed-gradient Gaussian/matrix model, test whether the relevant Gram matrix is sign-balanced. Then inspect noninteger Rényi orders and the hockey-stick thresholds separately rather than extrapolating an integer-order guarantee. The transferable idea is to turn a convenient independent surrogate into a theorem with explicit structural preconditions and explicit counter-regimes.

审计 DP-SGD 采样时请阅读：在重用整阶泊松 RDP 上界前，它给出具体检查——负相关性与符号平衡——并标记两个使该重用不被证实的制度边界。

[Abstract; Theorem 3.2 and Proposition 3.4 (Section 3); Theorem 4.3 (Section 4)](https://arxiv.org/abs/2609.01944v1)

## 相较于标准下一个标记预测（NTP），前向知识蒸馏在预训练期间同时提升了推理与事实回忆，但在中期训练却放慢了事实回忆获取，尽管推理仍继续受益。

*[Knowledge Distillation During Mid-Training Favors Reasoning over Factual Recall](https://arxiv.org/abs/2609.01532v1)*

### The reported limitation

The authors report this stage-dependent pattern in controlled experiments using OLMo-2 1B students and post-trained OLMo-2 Instruct teachers at 1B, 7B, and 13B parameters. Their pre-training runs start from random initialization for 100B tokens, whereas mid-training continues a 4T-token checkpoint for 60B tokens; they evaluate macro-averaged Reasoning and Factual Recall. [arxiv:2609.01532v1, abstract1.1; S1.p2; S3.SS0.SSS0.Px2]

The concrete limitation is therefore not simply that distillation changes overall scores. In this setup, selecting standard forward-KL KD because it helped during pre-training would miss that, later in training, it can retain reasoning gains while impeding acquisition of the factual knowledge that remains unresolved. This is a stage-specific empirical finding, not a claim that the same tradeoff holds for every model family or scale.

### The authors’ diagnosis and intervention

The paper attributes the tradeoff to an alignment between teacher uncertainty and the student’s learning state. The authors report lower teacher predictive entropy on procedural domains such as math and instruction following than on knowledge-intensive domains such as web text, Wikipedia, and Stack Exchange. [arxiv:2609.01532v1, S4.SS1.p1] On factual-recall tasks, they further report that, by the end of pre-training, the student had learned 67% of facts in the lowest teacher-entropy quintile but only 5% in the highest. [arxiv:2609.01532v1, S4.SS2.p3; S4.F4] The paper presents this entropy pattern as its explanation for why remaining factual targets at mid-training are disproportionately difficult for the teacher.

Its method change is selective supervision rather than applying KD uniformly:

&gt; “To mitigate this imbalance, we propose Switch Distillation, a simple mid-training objective that distills on tokens where the teacher is confident, using teacher predictive entropy as a lightweight routing signal, and otherwise falls back to cross-entropy.” [arxiv:2609.01532v1, S5.p1; S6.SS2.p1; table 1]

In the reported configuration, the lowest-entropy 20% of in-batch tokens receive reverse-KL distillation and the remainder use cross-entropy. Relative to NTP, the abstract reports 1.61–1.71× reasoning performance, 1.13–1.19× knowledge-and-commonsense performance, and preservation of 96.7–96.8% of factual recall. [arxiv:2609.01532v1, abstract1.1]

### A transferable research operation

For another training stack, treat teacher entropy as a diagnostic before treating it as a routing signal: compare NTP and uniform KD at the intended training stage, stratify factual acquisition by teacher-entropy quantile, then test entropy-routed KD against both baselines while reporting reasoning and recall separately. The needed boundary is close: the authors state that their controlled experiments focus on OLMo-2, and they do not exhaustively ablate student sizes, token budgets, or teacher–student capacity gaps. [arxiv:2609.01532v1, A1.SS1.p1; A1.SS1.p2]

它给出一个具体的熵路由蒸馏中期训练实验，以及一个均匀 KD 可能掩盖的推理—事实回忆权衡，适合在中期训练时测试。

[abstract1.1; S1.p2; S3.SS0.SSS0.Px2; S4.SS1.p1; S4.SS2.p3; S4.F4; S5.p1; S6.SS2.p1; table 1; A1.SS1.p1; A1.SS1.p2](https://arxiv.org/abs/2609.01532v1)

## 在匹配预算的 4-bit 量化测试中，全局更细粒度优于基于预言机的层级修复

*[The Structure of Quantization Damage in LLMs: Why the Next Bit Should Be Spent Globally](https://arxiv.org/abs/2609.01587v1)*

Post-training quantization reduces serving cost, but the allocation question is concrete: if only a small precision increment is available, should it protect selected layers or improve granularity everywhere? Hu and Ramachandran turn that choice into a causal test. A layer’s drift, activation sensitivity, or unusual weight statistics is treated as a hypothesis—not as evidence that restoring its precision will recover task accuracy.

Across nine open-weight models in four architecture families, the authors raise each layer to 8-bit in turn while leaving the other layers at 4-bit per-row RTN. They measure the fraction of the 4-bit-to-8-bit CORE accuracy gap recovered, then compare this intervention ground truth with task-circuit drift, causal activation patching, and per-layer weight statistics. For the allocation experiment, they match a +0.146 effective-bits-per-weight increment: the global arm changes per-row quantization to group-128 RTN, while the local arm restores the oracle-selected top-k whole layers to 8-bit.

The recovery pattern is usually diffuse. In eight of nine models, recovering roughly 75% of the gap requires restoring about half the layers, and no single layer accounts for more than approximately 44% of the damage. The decisive budget comparison therefore favors the global arm: finer group-128 granularity beats the best matched local repair for all eight group-128-compatible models, by 21–52 percentage points of the CORE gap. OpenLLaMA is excluded because its width is incompatible with group-128. The local baseline is unusually favorable to layer protection because its ranking uses measured single-layer recovery, yet global granularity still wins under the tested accounting.

Two measurements clarify what is driving the result. At 8-bit, per-row RTN is near-lossless relative to fp16: the mean gap is -0.001 CORE and every model is within ±0.005. At 4-bit, per-row-to-group-128 RTN recovers +0.095 CORE on average, whereas GPTQ and AWQ add only +0.020 and +0.017 over that same granularity. These results support the authors’ bounded default: within this matched-budget setting, spend the next precision increment globally before selectively protecting whole layers.

The transferable research operation is to validate every proposed localizer causally. Rank candidate layers using the cheap signal, restore precision one layer at a time, and compare its recovery curve with a globally finer-grained quantizer under explicit bit accounting. Do not treat correlation with quantization damage as sufficient evidence of allocation value.

The boundary is material: runs were capped at models of at most 8B parameters by a single 40 GB A100 partition, and the top-k curves rank and score on the same evaluation set, making them oracle rather than deployable selectors. The conclusion is also specific to the tested 4-bit RTN probe, whole-layer repairs, group-128-compatible models, and first-order weight-only budget matching.

阅读此文以学习如何因果验证看似受损的层是否经修复能恢复精度，并查看在匹配预算下支持全局更细粒度优于层保护的实证测试。

[Abstract; §4 and Appendix E; §5 (Table 1); Appendix F (8-bit tier, Table 8); §6 Limitations](https://arxiv.org/abs/2609.01587v1)

## 精确状态修复将记忆形成孤立为 EAL-Bench 的瓶颈

*[Agent Memory Is a Surface for Endogenous Authorization Laundering](https://arxiv.org/abs/2609.01836v1)*

Persistent agent memory can record authorization state as well as task facts. The authors call the resulting failure **endogenous authorization laundering**: permissions written into memory can create apparent authority that the underlying interaction history never granted. For an evaluation, an unauthorized action alone is ambiguous: the error may have been created while writing persistent state or while interpreting it at execution time.

EAL-Bench separates those links. It uses multi-session organizational histories with a deterministic canonical authorization ledger, evaluates five LLMs as memory writers and two as executors across procurement, cybersecurity, and finance, and compares free-text versus typed memory under one-shot or incremental updates. For typed memory, it compares stored authorization state against the ledger; frozen memories are then replayed behind executors to measure whether a memory error becomes an action ([§3.1](https://arxiv.org/abs/2609.01836v1)).

The update regime matters under the paper’s matched evaluation conditions: incremental updating raises unauthorized submission in every domain and both representations, with typed incremental memory reaching 51.0% unauthorized submission in finance. These results pool three seeds, five writers, and both executors ([§4.1; Table 6](https://arxiv.org/abs/2609.01836v1)). The repair experiment makes the two-stage diagnosis more decisive. Among naturally generated typed memories in which false authority had been detected, replacing the stored state with an oracle-exact version eliminated unauthorized execution across domains while holding the executor, tools, and canonical state fixed ([§4.2; Table 3](https://arxiv.org/abs/2609.01836v1)). The paper reports unauthorized submission in about 98.6% of eligible trials before that replacement. Replaying frozen artifacts across the two executors also produced rates within 1.1 percentage points per domain, which the authors interpret as the failure travelling with the memory artifact rather than a particular executor ([§4.3](https://arxiv.org/abs/2609.01836v1)).

Two writer-side controls reduced pooled unauthorized submission—source-authority gating from 25.3% to 7.3%, and bounded event-sourced extraction to 9.0%—but authorized use fell from 93.3% to 53.8% and 64.7%, respectively. The gate accepts permissions only with valid, authoritative cited sources; event sourcing has writers emit block-level changes for a deterministic reducer. This is a measured safety–utility tradeoff, not evidence of a free safety improvement ([§4.4; Tables 21 and 24](https://arxiv.org/abs/2609.01836v1)).

A transferable research operation is to add a ledger-backed repair-and-replay test to a persistent-state agent evaluation: detect a state mismatch, replace only the stored authorization artifact, and replay the identical request. That experiment can localize the failure link before proposing an executor-side fix.

The boundary is important. EAL-Bench retains more structure than workplace communication, including explicit session blocks, unusually clear authorization events, and simulated tools; its results therefore demonstrate this route under controlled workflows rather than deployment prevalence. Moreover, deterministic formation measurement is available only for typed memory; free-text memory would require validated semantic annotations ([§4.6](https://arxiv.org/abs/2609.01836v1)).

阅读此文以借用一个具体的修复-重放协议，用以区分写入代理记忆的授权错误与执行器引入的错误。

[Sections 3.1, 4.1–4.4, 4.6; Tables 3, 6, 21, and 24](https://arxiv.org/abs/2609.01836v1)

## 评分决策在一个共享的晚层迅速“结晶”

*[Beyond Scores: Understanding LLM-as-a-Judge Mechanisms in Summarization Evaluation](https://arxiv.org/abs/2609.01604v1)*

LLM-based evaluators are used as scoring tools and automated training signals, yet the procedure by which they assign a rating remains poorly understood. Vasava and Jiang study two summarization evaluators—Themis (Llama-3-8B) and Prometheus (Mistral-7B)—to trace where defect evidence becomes a rating.

Their setup creates paired clean and corrupt summaries through an eight-attack taxonomy spanning Readability and Adequacy, with controlled error intensity and explicit token-level modification maps. The experiments combine activation patching around modified tokens and at the final input position, logit-lens projections of final-position residual streams, and attention-head knockouts.

In window-mode causal tracing, the authors report: “Early MLP layers locally register the perturbation at the perturbed-token position uniformly across attacks and across both evaluators.” Their reported pipeline then assigns local comparison and routing to attention below layer 15, while an upper-layer MLP cascade integrates the routed signal and writes the rating. At the final input position, logit-lens trajectories over five rating tokens identify the maximum-slope “crystallization” layer at L=26 for Themis and L=25 for Prometheus; the reported bootstrap 95% intervals are [26,26] and [25,25], respectively. This is the paper’s decisive depth-resolved evidence for a late rating commitment, rather than merely a changed final score.

A matched un-fine-tuned Llama-3-8B control reproduced routing and late crystallization but not the two-stage separation. The authors attribute the difference to two fine-tuning-associated changes: suppressing below-L15 MLP contribution at the last position and advancing crystallization from L=28 to L=26. They interpret this as fine-tuning sculpting an existing substrate rather than constructing the pipeline from scratch; this comparison was supplied only for the Llama-3-8B substrate, not a matched Mistral control.

Keep the conclusion narrow. The circuit analysis covers two open-source evaluators, English summaries from CNN/DailyMail, and a fixed prompt per evaluator. It excludes perturbations whose ratings did not change, and “All experiments use single-attack samples at intensity k = 1.” Logit-lens decoding is also an approximation, so the authors treat absolute pre-crystallization probabilities qualitatively.

A useful research operation is to apply the same controlled-corruption → activation-patching → depth-trace sequence to an evaluator you use. Then test whether the proposed circuit also appears when the judge *misses* an error, under stronger corruptions, or with mixed attacks—cases left uncharacterized here.

用此文来借用一个受控破坏、激活修补和分层解码的诊断流程，以检查一个 LLM 评审器如何将检测到的缺陷转化为分数，并保留对“未察觉错误”的检验。

[Abstract; §5.2; Figure 5; Tables 2–3; §7 Limitations](https://arxiv.org/abs/2609.01604v1)

本期按 2026-09-03 的候选论文事后编制，核验日期为 2026-09-12。
