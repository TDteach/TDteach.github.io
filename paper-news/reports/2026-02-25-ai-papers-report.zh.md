# AI 论文简报
## 2026-02-25

**生成时间**：2026-02-26 00:06:56  
**收录论文**：18  
**排除（来源缺失/获取失败）**：4

---
## TL;DR
**热点方向：** 其他（10）、鲁棒性（5）、幻觉/事实性（2）、隐私/安全（1）  
**常见标签：** 鲁棒性、智能体、基准、幻觉、信任、不确定性、长上下文、评估、推理、系统

---
## Top picks（按排名）
1. **Why Pass@k Optimization Can Degrade Pass@1: Prompt Interference in LLM Post-training**（⭐⭐⭐⭐）
   - 链接：http://arxiv.org/abs/2602.21189v1
   - 原因：通过一个 pass@1 的梯度相似性核来定义“提示干扰（prompt interference）”，并形式化正/负干扰（p. 5，Definition 3.1；Eq. (5)）。

2. **VAUQ: Vision-Aware Uncertainty Quantification for LVLM Self-Evaluation**（⭐⭐⭐⭐）
   - 链接：http://arxiv.org/abs/2602.21054v1
   - 原因：提出 VAUQ，一个免训练（training-free）的 LVLM 自评框架，显式考虑对视觉证据的依赖，并通过不确定性降低来刻画（p. 2，Introduction；p. 4–5，Section 4.2）。

3. **Untied Ulysses: Memory-Efficient Context Parallelism via Headwise Chunking**（⭐⭐⭐⭐）
   - 链接：http://arxiv.org/abs/2602.21196v1
   - 原因：UPipe：一种按注意力头维度分块（headwise-chunked）的多阶段执行 Ulysses 风格上下文并行注意力的方法，通过复用缓冲区降低注意力激活的峰值内存（p. 2，Contributions；p. 5，Section 3.3）。

4. **Tool Building as a Path to "Superintelligence"**（⭐⭐⭐⭐）
   - 链接：http://arxiv.org/abs/2602.21061v1
   - 原因：一个分步的 GF(2)/ANF 电路重建基准，使得“下一步正确操作”是唯一的，并直接度量逐步成功率 γg（p. 2；p. 6，Section 4.1）。

5. **Test-Time Training with KV Binding Is Secretly Linear Attention**（⭐⭐⭐⭐）
   - 链接：http://arxiv.org/abs/2602.21204v1
   - 原因：实证识别 TTT-KVB 的多种行为（例如：梯度上升有效；内循环拟合可能有害；Q/K 不匹配；Q→K 替换），与“存储-检索”解释相矛盾……

6. **Scaling State-Space Models on Multiple GPUs with Tensor Parallelism**（⭐⭐⭐⭐）
   - 链接：http://arxiv.org/abs/2602.21144v1
   - 原因：一种按通道分片的 SSM 缓存（SSM 状态 + 卷积历史），实现 prefill/decode 分离，并在解码期间无需额外的跨 GPU 同步（p. 4–5，Section IV-A；Fig. 2）。

7. **SELAUR: Self Evolving LLM Agent via Uncertainty-aware Rewards**（⭐⭐⭐⭐）
   - 链接：http://arxiv.org/abs/2602.21158v1
   - 原因：统一的 token 级不确定性估计（结合熵、最小置信度、间隔等指标），并聚合为 step 与 trajectory 信号以提供稠密监督（p. 2；p. 5，Section 3.1–3.2）。

8. **Prompt-Level Distillation: A Non-Parametric Alternative to Model Fine-Tuning for Efficient Reasoning**（⭐⭐⭐⭐）
   - 链接：http://arxiv.org/abs/2602.21103v1
   - 原因：提出提示级蒸馏（PLD），一种非参数方法：将教师模型的推理“编译”进学生模型的 system prompt，而不是微调权重（p. 2，Sectio...

---
## 分类速览
### 幻觉/事实性（2）
- **VAUQ: Vision-Aware Uncertainty Quantification for LVLM Self-Evaluation**（⭐⭐⭐⭐）
  - http://arxiv.org/abs/2602.21054v1
  - 问题：大型视觉-语言模型（LVLM）可能生成流畅但错误、且不被输入图像支持的回答（幻觉），从而在真实世界带来安全与可靠性风险……
  - 方法：VAUQ 是一个免训练自评框架，将预测不确定性与“视觉信息利用”的显式度量结合（p. 2，Introduction；p. 4，Section 4.2；Fig. 2）。Fi...

- **PaperTrail: A Claim-Evidence Interface for Grounding Provenance in LLM-based Scholarly Q&A**（⭐⭐⭐⭐）
  - http://arxiv.org/abs/2602.21045v1
  - 问题：基于 LLM 的学术问答工具越来越多地用于帮助研究者在大量科学文献基础上综合与编辑文本，但它们可能产生细微且高-...
  - 方法：PaperTrail 是一个系统与界面，通过将源论文与 LLM 答案分解为离散的“主张（claims）”与“证据（evidence）”，并将其匹配到相应片段，从而将“以论证为基础的溯源（argument-grounded provenance）”落地实现……

### 其他（10）
- **Untied Ulysses: Memory-Efficient Context Parallelism via Headwise Chunking**（⭐⭐⭐⭐）
  - http://arxiv.org/abs/2602.21196v1
  - 问题：在超长序列上训练 Transformer 受 GPU 显存限制，尤其是训练时所需的激活内存。上下文并行（也称序列并行）会加剧...
  - 方法：提出 UPipe 作为 DeepSpeed-Ulysses 的“解耦（untied）”变体，通过沿注意力头维度分块执行注意力来降低注意力激活内存（p. 1，Abstract；p. 5，Se...

- **Tool Building as a Path to "Superintelligence"**（⭐⭐⭐⭐）
  - http://arxiv.org/abs/2602.21061v1
  - 问题：研究“勤勉学习者（Diligent Learner）”框架中的关键经验瓶颈：当任务规模增大时，大语言模型（LLM）能否维持非消失的逐步成功概率（记为 γ）...
  - 方法：提出一个在 GF(2) 上的分步布尔函数重建任务，目标函数以代数正规形（ANF）表示为若干单项式的 XOR。输入被拆分为...

- **Test-Time Training with KV Binding Is Secretly Linear Attention**（⭐⭐⭐⭐）
  - http://arxiv.org/abs/2602.21204v1
  - 问题：测试时训练（TTT）已从分布偏移下的自适应技术演化为一种序列建模的架构原语，可作为 softmax 注意力的替代...
  - 方法：结合实证探针与解析重写。实证上，通过在推理时操控内循环行为并测量下游表现，来检验“记忆化视角”的预测；解析上...

- **Scaling State-Space Models on Multiple GPUs with Tensor Parallelism**（⭐⭐⭐⭐）
  - http://arxiv.org/abs/2602.21144v1
  - 问题：选择性状态空间模型（SSM）（如 Mamba）因其流式处理序列、适合长上下文负载，正越来越多地作为大语言模型骨干...
  - 方法：提出面向 Mamba 风格选择性 SSM mixer block 的张量并行推理设计。首先引入 SSM cache，避免在 prefill 与 decode 间重复处理提示；...

- **Prompt-Level Distillation: A Non-Parametric Alternative to Model Fine-Tuning for Efficient Reasoning**（⭐⭐⭐⭐）
  - http://arxiv.org/abs/2602.21103v1
  - 问题：思维链（CoT）提示常用于诱导 LLM 多步推理并提升推理任务准确率，但往往产生很长的推理文本（rationales），这...
  - 方法：提出提示级蒸馏（PLD），一种监督式、非参数框架：将教师模型的推理编译进学生模型的 system prompt，而不是更新模型...

- **On Data Engineering for Scaling LLM Terminal Capabilities**（⭐⭐⭐⭐）
  - http://arxiv.org/abs/2602.21193v1
  - 问题：基于 LLM 的智能体越来越被期望通过命令行界面（CLI）解决真实世界任务，成功往往需要与在线环境进行多步交互（如安装...
  - 方法：提出一个由粗到细的数据工程框架 Terminal-Task-Gen，结合（i）数据集适配与（ii）合成任务生成，随后进行轨迹生成与后处理...

- **Multi-Vector Index Compression in Any Modality**（⭐⭐⭐⭐）
  - http://arxiv.org/abs/2602.21202v1
  - 问题：后交互（late-interaction）的多向量检索（如 ColBERT 风格 MaxSim）已成为跨模态检索（文本、视觉文档、视频等）的强范式，但其存储与...
  - 方法：采用 ColBERT 风格的后交互：查询 token 序列 Q 与文档 token 序列 C 之间用 MaxSim 计分（p. 3，“Late Interaction”）。研究与查询无关（query-agnostic）的压缩...

- **LogicGraph : Benchmarking Multi-Path Logical Reasoning via Neuro-Symbolic Generation and Verification**（⭐⭐⭐⭐）
  - http://arxiv.org/abs/2602.21044v1
  - 问题：多数 LLM 逻辑推理评测聚焦于收敛式推理：对给定前提产出一个正确证明或最终标签。论文认为这忽略了...
  - 方法：LogicGraph 通过自动化的神经-符号流水线构建，保证穷尽的多路径真值。首先通过自底向上（backward）的方式生成符号“Logic DAG”...

- **Aletheia tackles FirstProof autonomously**（⭐⭐⭐⭐）
  - http://arxiv.org/abs/2602.21201v1
  - 问题：报告并记录数学研究智能体 Aletheia（由 Gemini 3 Deep Think 驱动）在首届 FirstProof 挑战中的表现；该挑战包含十个研究级...
  - 方法：作者用 FirstProof 官方 LaTeX 源中的题目原文直接提示 Aletheia，不做修改。生成输出随后通过一个 pr...

- **The Initial Exploration Problem in Knowledge Graph Exploration**（⭐⭐⭐）
  - http://arxiv.org/abs/2602.21066v1
  - 问题：讨论普通用户首次接触陌生且复杂的知识图谱（KG）时面临的特定障碍：由于缺乏方向感，往往甚至无法开始探索...
  - 方法：这是一篇概念/立场论文而非实证研究。作者通过综合信息行为与 HCI 理论提出 IEP 框架，并将其应用于该问题的分析...

### 隐私/安全（1）
- **"Are You Sure?": An Empirical Study of Human Perception Vulnerability in LLM-Driven Agentic Systems**（⭐⭐⭐⭐）
  - http://arxiv.org/abs/2602.21127v1
  - 问题：LLM 驱动的智能体系统越来越多地作为可信副驾驶用于高影响任务（如邮件处理、招聘、医疗文档）。这种信任带来一种独特的安全风险：...
  - 方法：提出 HAT-Lab（Human-Agent Trust Laboratory），一个用于沉浸式行为实验的高保真平台，让参与者在真实、目标导向的任务中与智能体协作...

### 鲁棒性（5）
- **Why Pass@k Optimization Can Degrade Pass@1: Prompt Interference in LLM Post-training**（⭐⭐⭐⭐）
  - http://arxiv.org/abs/2602.21189v1
  - 问题：Pass@k 是可验证 LLM 任务（如数学/代码）的标准指标：模型可独立采样 k 个解，由验证器检查正确性；只要任一采样通过即算成功（...）
  - 方法：将 LLM 建模为在提示 \(x\sim D\) 条件下对响应的随机策略 \(\pi_\theta(\cdot|x)\)，验证器奖励为二值 \(r(x,y)\in\{0,1\}\)（p. 3，Section 2）。逐提示成功...

- **SELAUR: Self Evolving LLM Agent via Uncertainty-aware Rewards**（⭐⭐⭐⭐）
  - http://arxiv.org/abs/2602.21158v1
  - 问题：LLM 智能体在交互式环境中通过生成多步动作轨迹而非单次回答来工作。用强化学习训练此类智能体往往依赖稀疏...
  - 方法：SELAUR 是一个将不确定性估计注入奖励塑形的强化学习框架，包含三个模块：（1）token 级不确定性估计，（2）聚合为...

- **Matching Multiple Experts: On the Exploitability of Multi-Agent Imitation Learning**（⭐⭐⭐⭐）
  - http://arxiv.org/abs/2602.21020v1
  - 问题：多智能体模仿学习（MA-IL）旨在从马尔可夫博弈中专家交互示范学习策略。尽管以往离线 IL 理论常给出以性能为...
  - 方法：在 n 玩家折扣马尔可夫博弈中、以乘积策略形式化 MA-IL，并使用占用度量（仅状态与状态-动作）将模仿目标与诱导行为联系起来（p...

- **Generative Pseudo-Labeling for Pre-Ranking with LLMs**（⭐⭐⭐⭐）
  - http://arxiv.org/abs/2602.20995v1
  - 问题：解决工业推荐系统预排序中的样本选择偏差与训练-服务不一致。在级联推荐中，预排序需要高效为成千上万的召回候选打分...
  - 方法：提出生成式伪标注（GPL）框架，为未曝光的用户-物品对生成内容感知的伪标签，并用真实标签与伪标签的联合目标训练预排序模型...

- **A Benchmark for Deep Information Synthesis**（⭐⭐⭐⭐）
  - http://arxiv.org/abs/2602.21143v1
  - 问题：LLM 智能体越来越多地用于复杂的工具使用任务（如网页浏览、代码执行、数据分析），但现有基准大多无法衡量这些系统是否能...
  - 方法：提出 DEEPSYNTH：包含 120 个专家撰写任务的基准，用于评估基于网页的信息综合能力，并要求结构化、可验证的输出。任务要求智能体浏览并...

---
## 备注
- 本简报由逐论文的 JSON 分析生成。缺少 PDF URL 或 deepread 失败的论文会被排除，而不会以占位符形式展示。
