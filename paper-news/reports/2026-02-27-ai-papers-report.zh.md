# AI 论文洞察简报
## 2026-02-27

### 0) 核心要点（先读这个）
- **智能体安全正从“提示词层”转向“系统层”**：边缘/IoT 部署会继承协调基础设施（如 MQTT）的安全属性，从而产生溯源伪造、重放以及多秒级审计盲区等问题，而这些在集中式编排中不明显。([2602.22525](https://arxiv.org/abs/2602.22525v1))
- **推理时防御与适配正变得更“可运营”**：基于政策的辩论可零样本切换治理规则（CourtGuard），因果反事实“影子运行”可在保留效用的同时阻止间接提示注入（AgentSentry）。([2602.22557](https://arxiv.org/abs/2602.22557v1), [2602.22724](https://arxiv.org/abs/2602.22724v1))
- **GRPO 正成为智能体训练的常见骨干**，但论文越来越聚焦于*稳定性/信用分配*（长度异质性、熵塌缩、路径级奖励），而不只是“RL 有效”。([2602.22556](https://arxiv.org/abs/2602.22556v1), [2602.22642](https://arxiv.org/abs/2602.22642v1), [2602.22576](https://arxiv.org/abs/2602.22576v1))
- **长时程智能体正遭遇基础设施瓶颈**（KV cache 增长、记忆可靠性、随机性）。新工作提出学习式 KV“垃圾回收”（SideQuest）、硬件感知的 KV 量化（InnerQ）以及面向智能体的记忆基准（AMA-Bench）。([2602.22603](https://arxiv.org/abs/2602.22603v1), [2602.23200](https://arxiv.org/abs/2602.23200v1), [2602.22769](https://arxiv.org/abs/2602.22769v1))
- **评估方法正在被积极修复**：审计隐藏行为现在有了系统化基准（AuditBench），人类评分噪声也被显式建模（IRT/MFRM；HealthBench 分歧分解）。([2602.22755](https://arxiv.org/abs/2602.22755v1), [2602.22585](https://arxiv.org/abs/2602.22585v1), [2602.22758](https://arxiv.org/abs/2602.22758v1))
- **生物安全风险证据更直接**：一项人类受试者提升研究发现，LLM 访问使新手在 in-silico 生物任务上的准确率约提升 ~4.16×，且多数参与者表示几乎不难绕过防护。([2602.23329](https://arxiv.org/abs/2602.23329v1))

### 2) 关键主题（聚类）

#### 主题：野外智能体的系统安全（边缘、工具、溯源、隐私）
- **重要性**：当智能体进入物理与工具密集环境时，主导风险变为*协调平面完整性*、*审计延迟*与*信任边界跨越*——而不仅是提示注入。
- **代表论文**：  
  - [Systems-Level Attack Surface of Edge Agent Deployments on IoT](https://arxiv.org/abs/2602.22525v1)  
  - [AgentSentry: Mitigating Indirect Prompt Injection…](https://arxiv.org/abs/2602.22724v1)  
  - [Assessing Deanonymization Risks with Stylometry-Assisted LLM Agent](https://arxiv.org/abs/2602.23079v1)
- **常见方法**：
  - 将智能体视为*分布式系统*（边缘群体、工具返回边界、多阶段流水线）。
  - 让安全可度量（执行→审计延迟；ASR/UA；候选覆盖率；故障切换窗口）。
  - 偏好可包裹黑盒模型的推理时层（反事实重执行；上下文净化；工具门控）。
- **开放问题 / 失效模式**：
  - 边缘 IoT：MQTT broker 接受伪造/重放/直接发布表明**默认不强制溯源**；缓解原型未评估。([2602.22525](https://arxiv.org/abs/2602.22525v1))
  - AgentSentry：反事实开销随边界/重执行次数扩展；基准可能低估长时程延迟接管。([2602.22724](https://arxiv.org/abs/2602.22724v1))
  - 去匿名：即便 DB 增强，开放世界归因仍偏低；除已报告指标外，缓解质量/覆盖度不清晰。([2602.23079](https://arxiv.org/abs/2602.23079v1))

#### 主题：可*适配*的推理时对齐（政策、语言、人类）
- **重要性**：部署系统面临政策变化、多语言越狱面以及领域特定缺口；再训练缓慢且耗数据。
- **代表论文**：  
  - [CourtGuard: Zero-Shot Policy Adaptation in LLM Safety](https://arxiv.org/abs/2602.22557v1)  
  - [Multilingual Safety Alignment Via Sparse Weight Editing](https://arxiv.org/abs/2602.22554v1)  
  - [Requesting Expert Reasoning… Learned Collaborative Intervention](https://arxiv.org/abs/2602.22546v1)
- **常见方法**：
  - 通过 RAG + 结构化裁决（辩论 + 裁判）在推理时切换*治理文档*。  
  - 通过**免训练的稀疏低秩权重编辑**，针对“安全神经元”实现跨语言安全迁移。  
  - 通过学习**何时提问**并将人类反馈结构化为可执行计划，减少长尾领域失败。
- **开放问题 / 失效模式**：
  - CourtGuard：检索 + 多轮辩论带来延迟；较小骨干可能难以满足严格格式。([2602.22557](https://arxiv.org/abs/2602.22557v1))
  - 稀疏权重编辑：评估使用翻译提示与自动 guard 模型；对自适应攻击的鲁棒性仍待验证。([2602.22554](https://arxiv.org/abs/2602.22554v1))
  - 人机协作：在 Minecraft 中结果强，但所给文本未清晰列出限制/失败案例。([2602.22546](https://arxiv.org/abs/2602.22546v1))

#### 主题：面向智能体/推理的 RL 正收敛到“过程信号”（不只是结果）
- **重要性**：仅结果奖励对长时程推理/搜索而言稀疏且不稳定；效率压力（更短 CoT）会导致探索塌缩。
- **代表论文**：  
  - [Search-P1: Path-Centric Reward Shaping for Agentic RAG](https://arxiv.org/abs/2602.22576v1)  
  - [Stable Adaptive Thinking… Advantage Shaping + Length-Aware Gradients](https://arxiv.org/abs/2602.22556v1)  
  - [Compress the Easy, Explore the Hard… Entropy Regularization](https://arxiv.org/abs/2602.22642v1)
- **常见方法**：
  - 使用 GRPO 风格 RL，并引入**更稠密的过程奖励**（计划执行、步骤覆盖、部分得分）。
  - 显式修正优化病灶：组归一化优势偏差（CPAS）、长度异质梯度（LAGR）、熵塌缩（难度感知熵）。
  - 让效率随难度条件化（自适应 think/no-think；仅对困难样本提升探索）。
- **开放问题 / 失效模式**：
  - 依赖外部评估器/参考规划器可能脆弱且昂贵；较小评估器会降低性能。([2602.22576](https://arxiv.org/abs/2602.22576v1))
  - 自适应思考方法在 7B 以上的扩展性尚未建立。([2602.22556](https://arxiv.org/abs/2602.22556v1))
  - CEEH 的数值增益在所给文本中部分来自图表；限制部分不明确。([2602.22642](https://arxiv.org/abs/2602.22642v1))

#### 主题：长时程智能体基础设施：记忆、KV cache、随机性与吞吐
- **重要性**：智能体能力越来越受*服务约束*（KV 内存/带宽）、*记忆正确性*与*运行间可靠性*所限制。
- **代表论文**：  
  - [SideQuest: Model-Driven KV Cache Management](https://arxiv.org/abs/2602.22603v1)  
  - [AMA-Bench: Evaluating Long-Horizon Memory](https://arxiv.org/abs/2602.22769v1)  
  - [Evaluating Stochasticity in Deep Research Agents](https://arxiv.org/abs/2602.23271v1)  
  - [InnerQ: Tuning-free Quantization of KV Cache](https://arxiv.org/abs/2602.23200v1)
- **常见方法**：
  - 用模型驱动或硬件对齐的决策替代启发式（辅助线程驱逐；内维分组）。
  - 在*智能体-环境轨迹*（因果/状态更新）上评测记忆，而非仅对话回忆。
  - 将可靠性量化为答案/发现/引用的方差；用结构化输出 + 早期集成缓解。
- **开放问题 / 失效模式**：
  - SideQuest：驱逐仅限工具输出；BrowseComp 上 OOD 准确率最多下降 5%。([2602.22603](https://arxiv.org/abs/2602.22603v1))
  - InnerQ：延迟证据来自微基准（RTX 4090，batch=1），任务评估有限（少样本 GSM8K）。([2602.23200](https://arxiv.org/abs/2602.23200v1))
  - 随机性：temperature=0 也无法消除 API 非确定性；精确模块归因不可解（使用干预）。([2602.23271](https://arxiv.org/abs/2602.23271v1))

#### 主题：评估与审计：从“分数”走向*在噪声与隐匿下的可审计性*
- **重要性**：安全主张依赖测量；评分者效应、分歧上限与隐匿行为会使朴素比较失效。
- **代表论文**：  
  - [AuditBench: Evaluating Alignment Auditing Techniques…](https://arxiv.org/abs/2602.22755v1)  
  - [Correcting Human Labels… Item Response Theory](https://arxiv.org/abs/2602.22585v1)  
  - [Decomposing Physician Disagreement in HealthBench](https://arxiv.org/abs/2602.22758v1)
- **常见方法**：
  - 构建带隐藏行为的*模型生物体*，并评估端到端调查智能体（工具到智能体差距）。
  - 使用心理测量（MFRM）与混合模型分离评分者/量表/案例方差。
  - 诊断分歧何处可约化（信息缺口）与何处为结构性。
- **开放问题 / 失效模式**：
  - AuditBench 目标是微调模型；可能比自然涌现的隐藏行为更易审计；且仅单一基座模型。([2602.22755](https://arxiv.org/abs/2602.22755v1))
  - IRT 方法需要足够的链接/评分；其尝试中“政策作为 facet”的模型不可估计。([2602.22585](https://arxiv.org/abs/2602.22585v1))
  - HealthBench：多数案例仅两位评分者；无 test–retest 时无法分离模式噪声与偶发噪声。([2602.22758](https://arxiv.org/abs/2602.22758v1))

### 3) 技术综合
- **GRPO 是统一的训练原语**，贯穿：自适应思考（CPAS/LAGR）、智能体 RAG（Search-P1）、工业 RAG 协同适配（GRPO 用于忠实性/URL 有效性）、以及人类反馈工具使用（AHCE 的 HFM）。([2602.22556](https://arxiv.org/abs/2602.22556v1), [2602.22576](https://arxiv.org/abs/2602.22576v1), [2602.22584](https://arxiv.org/abs/2602.22584v1), [2602.22546](https://arxiv.org/abs/2602.22546v1))
- **过程监督正被运营化为“轨迹结构”**：显式计划 + 步骤覆盖（Search-P1）、think/no-think 控制 token（自适应思考）、以及难度条件化探索（CEEH）。  
- **推理时“封装器（wrappers）”成为趋势**：CourtGuard（政策 RAG + 辩论）、AgentSentry（反事实诊断 + 净化）与边缘 IoT 指标（执行→审计延迟、溯源完整性）都旨在无需重训基座模型即可部署。  
- **智能体可靠性越来越被视为系统属性**：随机性按模块与时间步分解；边缘故障切换窗口以秒计；KV cache 管理/量化以吞吐与内存读取衡量。([2602.23271](https://arxiv.org/abs/2602.23271v1), [2602.22525](https://arxiv.org/abs/2602.22525v1), [2602.22603](https://arxiv.org/abs/2602.22603v1))
- **基准更贴近真实部署产物**：AMA-Bench 使用带符号数据的动作–观测日志；OmniGAIA 要求全模态工具使用；General Agent Evaluation 聚焦协议忠实的跨环境 harness 与成本。([2602.22769](https://arxiv.org/abs/2602.22769v1), [2602.22897](https://arxiv.org/abs/2602.22897v1), [2602.22953](https://arxiv.org/abs/2602.22953v1))
- **审计正以智能体端到端方式评估**，揭示工具到智能体差距：能呈现证据的工具不一定提升调查者成功率。([2602.22755](https://arxiv.org/abs/2602.22755v1))
- **忠实性正在获得领域特定的运营化定义**：工业广告 QA 将 URL 幻觉视为一等失败，并进行显式验证（证据/前缀/HTTP 状态）。([2602.22584](https://arxiv.org/abs/2602.22584v1))
- **归因/溯源分裂为两条路线**：(i) 系统溯源（MQTT sender 字段、重放接受）与 (ii) 通过探针进行模型内部知识来源归因（ATTRIWIKI）。([2602.22525](https://arxiv.org/abs/2602.22525v1), [2602.22787](https://arxiv.org/abs/2602.22787v1))
- **人因既是能力风险也是测量风险**：生物提升显示新手真实增益；IRT/HealthBench 显示评分者噪声可主导结论。([2602.23329](https://arxiv.org/abs/2602.23329v1), [2602.22585](https://arxiv.org/abs/2602.22585v1), [2602.22758](https://arxiv.org/abs/2602.22758v1))

### 4) Top 5 论文（含“为何是现在”）

1) [AgentSentry: Mitigating Indirect Prompt Injection…](https://arxiv.org/abs/2602.22724v1)
- 将 IPI 视为**时间因果接管**问题，并通过受控反事实重执行在工具返回边界定位风险。
- 在 AgentDojo 上，针对三类 IPI 家族与多个黑盒 LLM，报告 **ASR = 0%**，同时保持高效用（UA），且报告表格中 FPR=0%。
- 提供*对续写友好*的缓解（上下文净化 + 门控动作修订），而非“疑似即终止”。
- **质疑点**：推理开销增加（多种机制/重执行）；评估可能未覆盖长时程延迟接管。

2) [Systems-Level Attack Surface of Edge Agent Deployments on IoT](https://arxiv.org/abs/2602.22525v1)
- 用**可度量指标**将边缘智能体安全具体化（执行→审计延迟、溯源完整性、主权外流、故障切换窗口）。
- 实证显示默认 MQTT 协调可接受**伪造/重放/直接发布**，且故障切换可造成 **~35.7s 监控盲区**。
- 强调“静默主权退化”：回退触发外部 API 访问（DNS 到 api.anthropic.com），但 MQTT 层无异常。
- **质疑点**：单一小型测试床；未评估缓解原型；云外流对比未做工作负载匹配。

3) [AuditBench: Evaluating Alignment Auditing Techniques on Models with Hidden Behaviors](https://arxiv.org/abs/2602.22755v1)
- 提供 56 个隐匿行为目标，覆盖 14 类行为，并进行反坦白训练，使审计评估可重复。
- 用带工具套件的**调查智能体**进行评估，揭示**工具到智能体差距**以及对目标训练配置（TD vs SDF；SFT vs KTO）的依赖。
- 发现带脚手架的黑盒工具总体最佳；白盒工具在更难目标上退化。
- **质疑点**：目标为单一基座模型上的微调；可能不反映自然涌现的隐藏行为。

4) [Search-P1: Path-Centric Reward Shaping for Stable and Efficient Agentic RAG Training](https://arxiv.org/abs/2602.22576v1)
- 用**双轨路径奖励**（自一致性 + 参考对齐）与**软结果评分**（部分得分）替代稀疏的仅结果 RL。
- 报告平均准确率显著提升（如 Qwen2.5-7B 平均 ACC 47.3 vs Search-R1 的 39.6；AD-QA 86.2 vs 65.6）。
- 显示更快收敛（约 60 步达到 Search-R1 最终准确率 vs >150）。
- **质疑点**：依赖外部评估器与离线参考规划生成；对评估器选择的敏感性不容忽视。

5) [LLM Novice Uplift on Dual-Use, In Silico Biology Tasks](https://arxiv.org/abs/2602.23329v1)
- 人类受试者证据显示，LLM 访问使新手在生物安全相关任务上**准确率约提升 ~4.16×**（仅互联网 vs LLM 增强）。
- 在 8 个基准中 Treatment 优于 Control 的有 7 个；有时超过专家基线（如 HPCT、VCT）。
- 报告多数参与者**未表示绕过防护有困难**（89.6%）。
- **质疑点**：非双盲；研究中途模型可用性变化；仅限 in-silico 任务（向湿实验迁移未知）。

### 5) 实用下一步
- **面向工具使用型智能体安全**：实现工具返回边界的“影子运行”测试框架（即便 K=1），估计中介内容是否因果驱动后续动作；衡量 UA/ASR 权衡与开销。（启发自 [2602.22724](https://arxiv.org/abs/2602.22724v1)）
- **面向边缘/IoT 智能体部署**：加入*应用层溯源强制*（如签名 sender ID / topic ACL），并测量论文同款指标：伪造接受率、执行→审计延迟、故障切换黑窗。([2602.22525](https://arxiv.org/abs/2602.22525v1))
- **面向合规/政策团队**：原型化政策切换评估器（RAG + 结构化裁决 + 威胁评分），跟踪延迟 vs 适配性；在更小骨干上测试格式鲁棒性。([2602.22557](https://arxiv.org/abs/2602.22557v1))
- **面向智能体 RAG 训练**：加入路径中心奖励（计划执行 + 关键步骤覆盖）与软结果评分；对评估器规模与参考计划生成成本做消融。([2602.22576](https://arxiv.org/abs/2602.22576v1))
- **面向长时程服务**：评估 SideQuest 式语义驱逐（工具输出）与 InnerQ 式 KV 量化；在你的智能体工作负载上比较端到端吞吐、完成可靠性与准确率。([2602.22603](https://arxiv.org/abs/2602.22603v1), [2602.23200](https://arxiv.org/abs/2602.23200v1))
- **面向评估流水线**：若依赖人类 Likert 评分，拟合 MFRM（严苛度 + 阈值中心性），同时报告原始与校正后的排名；为 QA 增加评分者诊断。([2602.22585](https://arxiv.org/abs/2602.22585v1))
- **面向生物安全治理**：将“提升（uplift）”视为一等指标；在你的任务集上复现实验，并显式测量防护摩擦（而非仅拒答率）。([2602.23329](https://arxiv.org/abs/2602.23329v1))

---
*由逐篇论文分析生成；未进行外部浏览。*
