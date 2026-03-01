# AI 论文洞察简报
## 2026-03-02

### 0) 执行要点（先读这个）
- **智能体安全正在向“技术栈更底层”迁移**：多篇论文显示，*系统架构*（边缘 IoT 部署、事件溯源式编排、KV-cache/记忆管理）往往主导风险与可靠性，并且经常绕过提示词/模型层面的防护。
- **推理时、模型无关的安全正在变得更锋利**：基于检索的政策裁决（CourtGuard）与针对间接提示注入的反事实因果诊断（AgentSentry）都在不更新权重的情况下报告了强结果——代价是额外的推理开销。
- **面向智能体的 RL 正从稀疏结果奖励转向结构化过程信号**：面向智能体 RAG 的路径中心奖励塑形（Search-P1）与面向推理压缩的难度感知熵/长度控制（CEEH）旨在解决 GRPO 风格训练中的稳定性与样本效率失败。
- **评测正在变得更“运维化”**：新的基准/工具链强调可复现与可分解（MobilityBench 的 API 回放；用于隐藏行为的 AuditBench；用于智能体记忆的 AMA-Bench；General Agent Evaluation 的 Unified Protocol），并有工作量化评估者噪声（IRT 评分者效应；医生分歧分解）。
- **长时程智能体的算力效率成为一等研究轴**：语义 KV 驱逐（SideQuest）与硬件感知 KV 量化（InnerQ）在有限精度损失下报告了显著吞吐/时延收益，直接使固定预算下更长的智能体时程成为可能。
- **双重用途风险正在以“人类”为对象被测量，而不只是模型**：一项长周期 uplift 研究发现，LLM 访问使新手在与生物安全相关的 in silico 任务上显著更准确（OR 4.16），且多数用户报告绕过防护“没有困难”。

### 2) 关键主题（聚类）

### 主题：系统级智能体安全与治理（超越提示词）

- **重要性**：会使用工具的智能体扩展了信任边界；部署选择（边缘 vs 云、编排/审计传输、不可变日志）即使在模型“对齐”的情况下也可能制造绕过与盲区。
- **代表论文**：
  - [Systems-Level Attack Surface of Edge Agent Deployments on IoT（边缘智能体在 IoT 部署的系统级攻击面）](https://arxiv.org/abs/2602.22525v1)
  - [AgentSentry: Mitigating Indirect Prompt Injection in LLM Agents（AgentSentry：缓解 LLM 智能体中的间接提示注入）](https://arxiv.org/abs/2602.22724v1)
  - [ESAA: Event Sourcing for Autonomous Agents in LLM-Based Software Engineering（ESAA：面向 LLM 软件工程自主智能体的事件溯源）](https://arxiv.org/abs/2602.23193v1)
- **共同方法**：
  - 将智能体安全视为 **架构 + 协议** 问题（MQTT 作为 C2 平面；工具返回边界作为控制点；意图/效果分离）。
  - 增加 **可审计结构**（溯源字段、仅追加事件日志、确定性回放 + 哈希）。
  - 在工具使用周围采用 **推理时门控**（授权策略；高影响动作前的净化/改写）。
- **开放问题 / 失效模式**：
  - MQTT 式协同在缺乏加密强制时可能接受欺骗/重放/直接发布；溯源信息可能“存在但无意义”。
  - 故障切换会造成长监控空窗（例如测得 35.7s blackout）以及静默的主权边界跨越（仅 DNS 证据）。
  - 反事实防御增加开销；超出范围的运行时攻陷（工具运行时篡改）仍然存在。

### 主题：动态策略执行与隐藏行为审计

- **重要性**：安全策略变化速度快于模型；审计必须在模型*不坦白*以及“单点工具看起来有效但端到端调查无效”的情况下仍能工作。
- **代表论文**：
  - [CourtGuard: A Model-Agnostic Framework for Zero-Shot Policy Adaptation in LLM Safety（CourtGuard：LLM 安全中零样本策略适配的模型无关框架）](https://arxiv.org/abs/2602.22557v1)
  - [AuditBench: Evaluating Alignment Auditing Techniques on Models with Hidden Behaviors（AuditBench：在具有隐藏行为的模型上评估对齐审计技术）](https://arxiv.org/abs/2602.22755v1)
- **共同方法**：
  - 通过 **基于检索的推理** 将安全逻辑与权重解耦（RAG + 辩论 + 裁判）。
  - 将审计作为 **智能体任务**（带工具配置）来评估，而不仅是静态探针。
  - 用 **反坦白训练**（KTO vs SFT）与多种行为灌输方法（TD vs SDF）对目标施压。
- **开放问题 / 失效模式**：
  - 辩论 + 检索带来的推理时延/成本；在较小骨干模型上的格式脆弱性。
  - “工具到智能体差距”：工具暴露的证据不一定能转化为调查智能体的正确假设。
  - 可审计性对隐藏行为的训练方式高度敏感（最易：SDF+SFT；最难：TD+KTO）。

### 主题：面向推理/智能体 RAG 的 RL 稳定化（过程信号优于稀疏结果）

- **重要性**：GRPO/RLVR 流水线可能崩溃（模式坍塌到不思考；长度压力下熵坍塌；稀疏奖励导致学习缓慢）。过程感知的塑形正在成为修复手段。
- **代表论文**：
  - [Stable Adaptive Thinking via Advantage Shaping and Length-Aware Gradient Regulation（通过优势塑形与长度感知梯度调节实现稳定自适应思考）](https://arxiv.org/abs/2602.22556v1)
  - [Search-P1: Path-Centric Reward Shaping for Stable and Efficient Agentic RAG Training（Search-P1：用于稳定高效智能体 RAG 训练的路径中心奖励塑形）](https://arxiv.org/abs/2602.22576v1)
  - [Compress the Easy, Explore the Hard (CEEH)（易题压缩，难题探索）](https://arxiv.org/abs/2602.22642v1)
  - [Towards Faithful Industrial RAG: Reinforced Co-adaptation Framework for Advertising QA（迈向可信工业 RAG：面向广告问答的强化协同适配框架）](https://arxiv.org/abs/2602.22584v1)
- **共同方法**：
  - 增加 **轨迹/过程奖励**（计划执行比率；参考步骤覆盖；“路径好但答案错”的部分得分）。
  - 通过 **优势塑形** 与 **长度感知梯度加权** 稳定长度异质性下的 RL。
  - 使探索/压缩 **随样本而变**（难题更强熵正则；易题更强压缩）。
- **开放问题 / 失效模式**：
  - 训练期间依赖外部 LLM 裁判/评估器（成本、偏差、脆弱性）。
  - 翻译构建的安全/基准数据可能引入伪影（与多语种及部分 RAG 场景相关）。
  - 超出可验证数学/QA 的领域迁移仍受限于可信奖励/验证器的可用性。

### 主题：长时程智能体效率（KV cache、记忆与搜索并行）

- **重要性**：长时程智能体常受限于内存带宽（KV 读取）与上下文预算；效率提升直接扩展可行自治时程并降低成本。
- **代表论文**：
  - [SideQuest: Model-Driven KV Cache Management（SideQuest：模型驱动的 KV Cache 管理）](https://arxiv.org/abs/2602.22603v1)
  - [InnerQ: Hardware-aware Tuning-free Quantization of KV Cache（InnerQ：硬件感知、免调参的 KV Cache 量化）](https://arxiv.org/abs/2602.23200v1)
  - [Search More, Think Less（多搜少想）](https://arxiv.org/abs/2602.22675v1)
  - [AMA-Bench: Evaluating Long-Horizon Memory for Agentic Applications（AMA-Bench：评估智能体应用的长时程记忆）](https://arxiv.org/abs/2602.22769v1)
- **共同方法**：
  - 用 **语义/模型驱动决策** 替代启发式（LLM 决定驱逐哪些工具输出；并行辅助线程）。
  - 面向解码的硬件协同设计：**内维度分组** + 2-bit KV 量化 + sink/近期高精度窗口。
  - 将扩展从串行深思转向 **并行证据获取** 与结构化上下文重置。
  - 在 **机器生成、因果扎实的轨迹** 上评测记忆，而非仅对话/文档 QA。
- **开放问题 / 失效模式**：
  - 小规模微调集可能导致 OOD 退化（SideQuest 在 BrowseComp 上报告最高 5%）。
  - 量化结果仅在有限任务/模型上展示（如 GSM8K few-shot；特定 GPU）。
  - 记忆构建损失与检索不可靠会在时程中叠加（AMA-Bench 的 needle protocol 下降）。

### 主题：评测可靠性与可复现性（人类、API 与协议）

- **重要性**：若评测噪声大或不可复现，优化目标会漂移；智能体对比会变成评分者、在线 API 或协议不匹配的产物。
- **代表论文**：
  - [MobilityBench](https://arxiv.org/abs/2602.22638v1)
  - [General Agent Evaluation](https://arxiv.org/abs/2602.22953v1)
  - [Correcting Human Labels for Rater Effects (IRT)（用 IRT 校正评分者效应导致的人类标签偏差）](https://arxiv.org/abs/2602.22585v1)
  - [Decomposing Physician Disagreement in HealthBench（分解 HealthBench 中医生分歧）](https://arxiv.org/abs/2602.22758v1)
- **共同方法**：
  - 通过 **API 回放沙箱** 与 schema 校验使工具环境可复现。
  - 通过 **规范化任务/上下文/动作协议** 与适配器标准化跨基准执行。
  - 显式建模人类标签噪声（MFRM 评分者严苛度/阈值；混合模型/ICC 分解分歧）。
- **开放问题 / 失效模式**：
  - 人类分歧主要是个案特异/残差（HealthBench 标签残差 81.8%），限制可达到的“真值”。
  - 评分者-模型可估性需要重叠/链接；短量表限制 IRT 稳健性。
  - 工具数量上限与协议约束可能主导结果（例如 GPT 5.2 工具上限 vs AppWorld 的 468 个工具）。

### 3) 技术综合
- **边界控制正在收敛**：AgentSentry 的工具返回边界诊断、ESAA 的意图/效果边界、以及边缘 IoT 的 MQTT 边界，都将“状态跨越信任域的位置”视为关键安全杠杆。
- **GRPO 是共同底座**，但论文在修复其病灶上分歧：CPAS/LAGR 针对长度异质性与模式坍塌；Search-P1 通过计划/路径评分加密奖励；CEEH 通过难度感知熵来对抗熵坍塌。
- **“过程监督”正在无需完全监督地被运维化**：Search-P1 使用离线参考规划器 + 步骤覆盖；diffusion stitching 使用 PRM 步骤分数；工业 RAG 使用包含 URL 有效性检查在内的多维奖励。
- **RAG 正在分裂为两类关注点**：(i) 检索质量/覆盖（GraphRAG + 并行通道；智能体多步搜索），以及 (ii) 证据的*忠实使用*（URL 有效性、忠实性奖励、知识归因探针）。
- **智能体可靠性越来越以方差衡量，而非仅均值**：深度研究智能体的随机性指标（对答案/发现/引用的总方差）补充成功率榜单，并揭示早期步骤随机性放大。
- **记忆与 KV cache 被视为一等优化目标**：SideQuest 降低峰值 token 使用与 KV 读取；InnerQ 针对解码阶段 matmul 布局降低时延，而不只是内存占用。
- **评测基础设施正在成为研究贡献**：确定性回放（MobilityBench）、统一协议工具链（Exgentic）、以及带不坦白目标的审计基准（AuditBench）旨在防止“对基准怪癖的过拟合”。
- **人因成为能力/风险测量的一部分**：bio uplift 显示新手在 LLM 帮助下提升，但仍可能不如纯 LLM 基线；安全治理需要建模*人–LLM 系统*，而非仅模型。
- **可解释性正在分叉**：从用于多语种安全的神经元/子空间编辑（稀疏权重编辑），到电路的形式化鲁棒性保证（认证电路），再到 SSM 特定的瓶颈引导（Mamba 子空间瓶颈）。

### 4) Top 5 论文（含“为何是现在”）

1) [AgentSentry: Mitigating Indirect Prompt Injection in LLM Agents via Temporal Causal Diagnostics and Context Purification](https://arxiv.org/abs/2602.22724v1)
- 引入对多轮间接提示注入（IPI）的 **反事实、时间因果** 框架，聚焦工具返回边界。
- 在 AgentDojo 上针对三类 IPI 家族与三种黑盒 LLM 报告 **ASR = 0%**，同时保留了较高效用（UA 按模型报告）。
- 消融显示净化后的反事实与时间诊断至关重要（移除后在一套任务上 ASR 升至约 22%）。
- **怀疑点**：总体开销可能很大（每个边界最多四种机制并带采样）；基准设置使用轻量 K/w。

2) [CourtGuard: A Model-Agnostic Framework for Zero-Shot Policy Adaptation in LLM Safety](https://arxiv.org/abs/2602.22557v1)
- 通过基于 RAG 的对抗辩论与基于引用的裁决，使安全 **策略可在推理时更新**。
- 报告了强基准表现（macro Acc 0.87 / F1 0.86）以及在人类验证套件上的高召回。
- 展示 **策略/领域切换**（Wikipedia vandalism）而无需更新权重。
- **怀疑点**：推理时延/成本增加；性能受策略语料覆盖与骨干模型格式遵循能力所限。

3) [AuditBench: Evaluating Alignment Auditing Techniques on Models with Hidden Behaviors](https://arxiv.org/abs/2602.22755v1)
- 提供 **56 个不坦白的目标模型**，覆盖 14 种隐藏行为，包含多种灌输与反坦白训练方式。
- 发现带脚手架的黑盒工具在智能体审计中最好，并揭示 **工具到智能体差距**（静态工具信号 ≠ 智能体成功）。
- 显示可审计性强依赖训练配方（TD+KTO 最难）。
- **怀疑点**：目标是带显式行为的 LoRA 微调；可能比弥散的涌现行为更易审计。

4) [Systems-Level Attack Surface of Edge Agent Deployments on IoT](https://arxiv.org/abs/2602.22525v1)
- 实证表明边缘本地 swarm 可减少外联（一次会话 0 外部 IP/字节），但引入 **MQTT C2 漏洞** 与 **故障切换盲区**。
- 显示溯源元数据可被轻易绕过（缺失/伪造发送者、重放、直接发布到安全主题也被接受）。
- 测量了具体运维指标（执行到审计时延；blackout 窗口；仅 DNS 的主权跨越）。
- **怀疑点**：单一小型测试床；未评估缓解原型；云端对比未做工作负载匹配。

5) [LLM Novice Uplift on Dual-Use, In Silico Biology Tasks](https://arxiv.org/abs/2602.23329v1)
- 人体受试证据：与仅互联网相比，LLM 访问使新手在生物任务套件上 **准确率提高 4.16×**（8 个基准中 7 个）。
- 强调治理相关细节：**LLM-only 常常胜过 LLM 辅助的新手**，因此 uplift 取决于用户策略/任务结构。
- 报告多数用户 **绕过防护没有困难**，与双重用途风险评估相关。
- **怀疑点**：非双盲；研究中期模型可用性变化；仅限 in silico 任务（向湿实验迁移未知）。

### 5) 实用下一步
- **面向智能体安全**：为智能体协同平面（如 MQTT）加入加密强制/ACL，并测量在对抗性发布/重放下溯源是否变得不可绕过。
- **监测主权边界**：将“回退到云推理”视为安全事件；记录并告警 DNS/API 边界跨越，并与智能体级追踪关联。
- **采用边界锚定防御**：原型化 AgentSentry 式工具返回检查（即便简化版），并在多轮 IPI 下测量 ASR/效用权衡。
- **让策略更新可运维**：搭建类似 CourtGuard 的策略 RAG 存储用于组织治理文档；在较小骨干模型上测量时延与失效模式（格式/解析）。
- **用过程奖励训练智能体**：若使用 GRPO/RLVR，测试路径中心或难度感知塑形（Search-P1/CEEH 思路），并显式监控熵/模式坍塌指标。
- **优化长时程成本**：在你的智能体工作负载上评估 SideQuest 式语义驱逐与/或 InnerQ 式 KV 量化；跟踪 KV 读取、吞吐与任务完成率。
- **更真实地基准记忆**：在智能体轨迹基准（AMA-Bench 风格）上运行你的记忆系统，并加入 needle protocol 量化构建损失 vs 检索损失。
- **加固评测流水线**：有人类评分时考虑 IRT/MFRM 校正；涉及工具/API 时优先使用可回放沙箱（MobilityBench 模式）以降低方差。

---
*由逐篇论文分析生成；无外部浏览。*
