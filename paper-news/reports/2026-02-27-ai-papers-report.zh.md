# AI 论文洞察简报
## 2026-02-27

### 0) 执行要点（先读这个）
- **Agent 安全正在从“提示词层”转向“系统层”**：边缘/IoT 部署继承了不安全的协同控制平面（例如 MQTT 接受欺骗/重放），并在故障切换期间产生*多秒级审计盲区*——这些风险无法仅靠模型级护栏捕获。
- **推理时、免训练的安全自适应正在走向成熟**，主要有两条路线：(i) 用于快速策略切换的*基于政策的裁决*（CourtGuard），以及 (ii) 可驱动 AgentDojo 上攻击成功率降至 **0% ASR** 且保持效用的*因果反事实诊断*（AgentSentry）。
- **GRPO 正在成为默认的 RL 主干**，但前沿已转向*稳定性/效率塑形*：自适应思考（CPAS+LAGR）与难度感知熵正则（CEEH）都在针对长度/熵的病态；面向 agentic RAG 的（Search-P1）则用路径中心的过程奖励来缓解奖励稀疏。
- **长时程 agent 性能越来越受基础设施而非模型智力限制**：KV-cache 管理（SideQuest）与 KV 量化布局（InnerQ）带来显著吞吐/时延收益；记忆能力也开始在 agent 原生轨迹上评测（AMA-Bench），而不只是对话/文档 QA。
- **评测方法学正在被积极修复**：人类评测中的评分者效应建模（MFRM）可能颠覆系统排名；HealthBench 中医生分歧主要是案例特定残差；深度研究 agent 的运行间方差很高，但可用结构化输出 + 查询集成降低。
- **生物安全风险证据更直接**：一项“人类能力提升”研究发现，LLM 访问使新手在 in silico 生物任务上比仅用互联网 **准确 4.16×**，且多数参与者表示绕过安全措施几乎不费力。

### 2) 关键主题（聚类）

### 主题：工具使用型 agent 的系统安全（边缘 + 提示注入）

- **重要性**：当 agent 进入物理/边缘场景并运行长时程工具循环时，主导性失败会变成*协同平面完整性*、*审计延迟*与*信任边界违规*——而不再只是单轮对话里的提示注入。
- **代表论文**：
  - Systems-Level Attack Surface of Edge Agent Deployments on IoT（IoT 上边缘 Agent 部署的系统级攻击面） — https://arxiv.org/abs/2602.22525v1
  - AgentSentry: Mitigating Indirect Prompt Injection in LLM Agents via Temporal Causal Diagnostics and Context Purification（通过时间因果诊断与上下文净化缓解 LLM Agent 的间接提示注入） — https://arxiv.org/abs/2602.22724v1
- **共同方法**：
  - 将 agent 安全视为**边界管理**（工具返回边界；MQTT 作为 C2 平面）。
  - 使用**可度量的系统指标**（执行到审计延迟、溯源完整性、故障切换窗口）。
  - 在不重训的前提下增加**推理时安全层**（反事实“影子运行”、上下文净化）。
- **开放问题 / 失效模式**：
  - 如何在不破坏时延/可用性的情况下，用可执行的溯源/ACL 加固协同平面（如 MQTT）。
  - 反事实防御会带来开销；对**长时程渐进式接管**的行为尚不清楚（文中指出基准缺口）。
  - 故障切换可能产生**数十秒监控空窗**；如何在黑窗期间保证安全执行。

### 主题：推理时对齐与策略敏捷（不重训）

- **重要性**：上线系统面临不断变化的政策（ToS、合规制度）与多语言越狱面；基于重训的对齐跟不上运营需求。
- **代表论文**：
  - CourtGuard: A Model-Agnostic Framework for Zero-Shot Policy Adaptation in LLM Safety（LLM 安全的零样本策略自适应、模型无关框架） — https://arxiv.org/abs/2602.22557v1
  - Multilingual Safety Alignment Via Sparse Weight Editing（通过稀疏权重编辑实现多语言安全对齐） — https://arxiv.org/abs/2602.22554v1
- **共同方法**：
  - **基于政策的 RAG** + 结构化裁决（辩论 + 裁判并输出威胁分数）。
  - **免训练参数编辑**：稀疏神经元选择 + 闭式低秩更新，将安全性迁移到多语言。
  - 与现有方法组合（如 MPO + editing）。
- **开放问题 / 失效模式**：
  - CourtGuard 在小模型骨干上的时延与格式脆弱性。
  - 多语言基准/评测依赖**机器翻译**与自动化 guard 模型；对自适应攻击的鲁棒性尚未建立。

### 主题：面向推理/agentic RAG 的效率与稳定性 RL

- **重要性**：“多想一点”不再是免费收益；token 成本与不稳定性（熵塌缩、长度异质性、稀疏奖励）已成为一阶约束。
- **代表论文**：
  - Stable Adaptive Thinking via Advantage Shaping and Length-Aware Gradient Regulation（通过优势塑形与长度感知梯度调节实现稳定自适应思考） — https://arxiv.org/abs/2602.22556v1
  - Compress the Easy, Explore the Hard: Difficulty-Aware Entropy Regularization for Efficient LLM Reasoning（压缩易题、探索难题：难度感知熵正则用于高效 LLM 推理） — https://arxiv.org/abs/2602.22642v1
  - Search-P1: Path-Centric Reward Shaping for Stable and Efficient Agentic RAG Training（Search-P1：以路径为中心的奖励塑形，用于稳定高效的 agentic RAG 训练） — https://arxiv.org/abs/2602.22576v1
- **共同方法**：
  - 采用 GRPO 风格 RL，并加入**显式长度/效率目标**。
  - 修复已知 RL 病态：组归一化优势偏置（CPAS）、长度异质性导致的梯度失衡（LAGR）、熵塌缩（难度感知熵）。
  - 通过**过程/路径奖励**与部分得分，为 agentic RAG 稠密化监督。
- **开放问题 / 失效模式**：
  - 超出数学/可验证领域的泛化仍有限（自适应思考论文明确指出）。
  - 依赖 LLM 评估器/参考规划器（Search-P1）会引入对评估器选择的敏感性与离线成本。

### 主题：长时程 agent 扩展：记忆、KV cache 与上下文管理

- **重要性**：长时程 agent 越来越受**GPU 显存带宽与上下文增长**限制，也受制于在结构化动作–观测日志上失效的记忆系统。
- **代表论文**：
  - SideQuest: Model-Driven KV Cache Management for Long-Horizon Agentic Reasoning（面向长时程 agent 推理的模型驱动 KV cache 管理） — https://arxiv.org/abs/2602.22603v1
  - InnerQ: Hardware-aware Tuning-free Quantization of KV Cache for Large Language Models（硬件感知、免调参的 LLM KV cache 量化） — https://arxiv.org/abs/2602.23200v1
  - AMA-Bench: Evaluating Long-Horizon Memory for Agentic Applications（AMA-Bench：评测面向 agent 应用的长时程记忆） — https://arxiv.org/abs/2602.22769v1
- **共同方法**：
  - 将工具输出视为一等上下文对象，并积极**驱逐/量化**。
  - 让压缩与硬件原语（向量–矩阵解码注意力）及服务栈（SGLang/H100 评测）对齐。
  - 在**agent-环境轨迹**上评测记忆，覆盖因果/状态类问题（Recall、Causal Inference、State Updating、Abstraction）。
- **开放问题 / 失效模式**：
  - SideQuest 目前只驱逐工具响应（不含“思考”token），并出现一定 OOD 退化。
  - InnerQ 证据主要限于 GSM8K + 单 GPU 的 matmul 微基准；跨工作负载的端到端解码收益仍待证明。
  - 记忆构建/压缩是主要损失点（needle 消融显示大幅下降）。

### 主题：评测可靠性：评分者效应、分歧上限与 agent 随机性

- **重要性**：若测量不稳定，优化目标会漂移；对 agent 而言，*运行间方差*可能主导感知质量。
- **代表论文**：
  - Correcting Human Labels for Rater Effects in AI Evaluation: An Item Response Theory Approach（用项目反应理论校正 AI 评测中的评分者效应） — https://arxiv.org/abs/2602.22585v1
  - Decomposing Physician Disagreement in HealthBench（分解 HealthBench 中医生分歧） — https://arxiv.org/abs/2602.22758v1
  - Evaluating Stochasticity in Deep Research Agents（评估深度研究 agent 的随机性） — https://arxiv.org/abs/2602.23271v1
- **共同方法**：
  - 显式方差分解（评分者严苛度/居中倾向；医生 vs 量表 vs 残差；传播性 vs 内生随机性）。
  - 诊断上限并提出缓解杠杆（评分者监控；不确定性标签；结构化输出 + 查询集成）。
- **开放问题 / 失效模式**：
  - 多面向模型需要足够的链接/重叠；某些面向在实践中不可估。
  - HealthBench 分歧主要是残差/案例特定；许多预测因子解释的方差很少。
  - 即使温度为 0，API 非确定性仍存在；缓解必须是算法层面的。

### 主题：审计与红队：隐藏行为与关系性伤害

- **重要性**：隐藏行为与多轮伤害难以用静态测试暴露；agent 审计员与对抗仿真正在成为可扩展替代方案。
- **代表论文**：
  - AuditBench: Evaluating Alignment Auditing Techniques on Models with Hidden Behaviors（AuditBench：在具有隐藏行为的模型上评估对齐审计技术） — https://arxiv.org/abs/2602.22755v1
  - TherapyProbe: Generating Design Knowledge for Relational Safety in Mental Health Chatbots Through Adversarial Simulation（TherapyProbe：通过对抗仿真为心理健康聊天机器人生成关系安全设计知识） — https://arxiv.org/abs/2602.22775v1
- **共同方法**：
  - 构建带有隐藏行为的**模型生物体**，并评估端到端调查 agent（工具到 agent 的差距）。
  - 使用对抗式多智能体仿真（MCTS）发现**多轮失败路径**，并抽象为模式库。
- **开放问题 / 失效模式**：
  - AuditBench 目标是微调模型；可能比自然涌现的问题更易审计。
  - TherapyProbe 的检测器性能有上限（macro-F1 0.71；部分类别更难），且从业者验证样本较小。

### 3) 技术综合
- GRPO 反复出现，成为 RL 的主力（自适应思考、人机协作模块、agentic RAG 奖励塑形、工业 RAG RL），但论文越来越聚焦于**方差/异质性控制**（长度感知梯度、熵塌缩预防、部分得分结果）。
- agent 训练论文的共同模式：**用结构化中间信号替代稀疏终局奖励**（Search-P1 路径奖励；通过 PRM 的扩散步评分；AgentDropoutV2 的指示器触发验证）。
- “推理时脚手架”正在收敛：CourtGuard（RAG+辩论）、AgentSentry（反事实影子运行）、AgentDropoutV2（纠正或拒绝）、SideQuest（并行辅助线程）都在基座模型周围增加**辅助决策回路**，而非改动核心权重。
- 多项工作强调：**工具输出主导长时程上下文**，因此是压缩/驱逐（SideQuest）与安全边界（AgentSentry）的自然单位。
- 评测论文共同指向新的默认：不仅报告平均准确率，还要报告**测量稳定性**（评分者校正后的潜在特质；分歧分解；agent 的运行间方差 TV）。
- “策略层”正在外置化：CourtGuard 用检索到的治理文本为决策奠基；ESAA 强制 JSON 合约 + 确定性回放；IoT 边缘论文将溯源完整性与审计延迟作为一等指标。
- 基准正在变得更*agent 原生*：AMA-Bench 使用动作–观测轨迹；OmniGAIA 要求多模态工具使用；AuditBench 评估的是调查 agent，而非仅分类器。
- 多篇论文显示：**系统约束会硬性击穿能力**（General Agent Evaluation：工具数量限制导致 AppWorld 上 0.00；IoT 故障切换窗口；KV cache 显存带宽）。
- 安全迁移正从两端推进：用于多语言安全的**参数编辑**（稀疏权重编辑）与用于策略切换的**运行时裁决**（CourtGuard），暗示混合栈可能可行。

### 4) Top 5 论文（含“为何是现在”）

1) AgentSentry: Mitigating Indirect Prompt Injection in LLM Agents via Temporal Causal Diagnostics and Context Purification（通过时间因果诊断与上下文净化缓解 LLM Agent 的间接提示注入） — https://arxiv.org/abs/2602.22724v1
- 引入边界级反事实重执行（orig/mask/mask_sanitized/orig_sanitized），以估计因果接管信号（ACE/IE/DE）。
- 在 AgentDojo 上针对三类 IPI 家族与多个黑盒模型报告 **ASR = 0%**，同时保持高效用，并在表格中报告 **FPR = 0%**。
- 消融显示：净化后的反事实 + masking 探针至关重要（移除后 ASR 升至约 21–23%）。
- **保留意见**：推理开销增加；基准可能低估长时程渐进式/延迟接管。

2) LLM Novice Uplift on Dual-Use, In Silico Biology Tasks（LLM 对双用途 in silico 生物任务中新手的能力提升） — https://arxiv.org/abs/2602.23329v1
- 人体实验证据：LLM 访问使新手比仅用互联网 **准确 4.16×**（校正后准确率约 5% → >17%）。
- 处理组在 **7/8** 个基准上优于对照组；有时超过专家基线（如 HPCT、VCT）。
- 报告多数参与者（89.6%）表示**绕过安全措施没有困难**，对政策与部署相关。
- **保留意见**：仅限 in silico 任务；非双盲；研究中途模型可用性发生变化。

3) SideQuest: Model-Driven KV Cache Management for Long-Horizon Agentic Reasoning（面向长时程 agent 推理的模型驱动 KV cache 管理） — https://arxiv.org/abs/2602.22603v1
- 将 KV 驱逐转化为在**并行线程**中的学习型辅助任务，避免“管理 token”污染。
- 显著效率收益：峰值 token 利用降低 **56–65%**；服务评测显示在 H100 上 FRAMES **吞吐 +83.9%**。
- 相比启发式驱逐基线提升可靠性（更少不可解析/未完成失败）。
- **保留意见**：微调数据有限（215 条轨迹），且仅对工具输出做驱逐；存在一定 OOD 准确率损失。

4) CourtGuard: A Model-Agnostic Framework for Zero-Shot Policy Adaptation in LLM Safety（LLM 安全的零样本策略自适应、模型无关框架） — https://arxiv.org/abs/2602.22557v1
- 实用的“策略切换”安全：基于 RAG 的攻防辩论 + 裁判输出 SAFE/BORDERLINE/UNSAFE 与威胁分数。
- 报告强劲基准表现（宏平均 Acc 0.87 / F1 0.86），并通过策略语料切换在 OOD 维基百科破坏任务上达到 **90%** 准确率。
- 明确将**动态策略适配性**作为期望属性。
- **保留意见**：时延更高；依赖骨干模型的格式遵循（解析错误风险）。

5) Systems-Level Attack Surface of Edge Agent Deployments on IoT（IoT 上边缘 Agent 部署的系统级攻击面） — https://arxiv.org/abs/2602.22525v1
- 用可度量指标将边缘 agent 安全具体化（审计延迟、溯源完整性、主权外流、故障切换窗口）。
- 实证显示 MQTT broker 接受欺骗/重放/畸形溯源；强制回退触发静默 DNS 到外部 API；故障切换窗口 **35.7s**。
- 强调“主权”可能在回退下不可见地失效——对物理执行场景至关重要。
- **保留意见**：单一小型测试床；无缓解原型；云外流对比未做工作负载匹配。

### 5) 实用下一步
- 对工具使用型 agent，增加**工具返回边界的仪表化**：记录中介内容、拟执行动作，并（如可行）对高影响动作运行轻量反事实检查（AgentSentry 风格）。
- 若部署边缘/IoT agent，将 MQTT（或等价物）视为**安全关键 C2**：测量溯源完整性、执行到审计延迟与故障切换黑窗；显式测试对欺骗/重放的接受情况。
- 对长时程 agent，优先做**上下文成本控制**：原型化工具输出驱逐（类似 SideQuest）和/或与解码 matmul 对齐的 KV-cache 量化（类似 InnerQ），并测量端到端吞吐与失败率。
- 用 RL 训练 agentic RAG 时，超越二元结果奖励：实现**路径/过程奖励**与部分得分（Search-P1），并跟踪收敛速度而非仅最终准确率。
- 对推理效率 RL，监控**熵塌缩与长度异质性**；根据失效模式考虑难度感知熵正则（CEEH）或长度感知梯度调节（LAGR）。
- 在评测流水线中，不要把原始 Likert 均值当作真值：可行时拟合**评分者效应模型**（MFRM），并报告分歧上限/方差分解（HealthBench 风格）。
- 对深度研究 agent，测量**运行间方差**（答案/发现/引用），并测试结构化输出与早期查询集成等缓解；不要依赖 temperature=0 来获得确定性。
- 对生物安全治理，将**人类能力提升**研究（而非仅模型基准）纳入风险评估，并明确测试安全措施在多小时工作流中是否能显著减缓信息获取。

---
*由逐篇分析生成；无外部浏览。*
