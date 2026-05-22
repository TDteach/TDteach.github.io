# AI 论文洞察简报
## 2026-05-23

### 0) 执行要点（请先读这里）
- Agent 工作的重心正从“更努力地训练模型”转向“塑造模型周围的接口、状态与数据”：编译式 agent 轨迹、特权过程筛选、运行时 harness 自适应、事件溯源执行，以及毫秒级检查点/回滚，都在不改变核心模型架构的情况下带来了显著收益。
- 安全评估正变得更贴近现实，也更悲观。多篇论文表明，静态或仅文本层面的安全检查遗漏了真正的失效模式：领域伪装的提示注入、多轮/有状态规避、制品层面的不安全编辑、基准利用，以及潜在 KV 泄漏，仍然构成重大风险。
- 评估方法本身正在成为一级研究议题。多篇论文指出，基准分数很容易被误读或被“刷分”：数据污染可能隐藏在 CoT 背后，单阈值指标在预测任务中可能颠倒结论，而安全基准甚至可能被其所测试的 agent 利用。
- 长上下文与过程监督仍然是高杠杆的能力放大器。ACC 将 agent 日志转化为长上下文问答，使 30B 模型在长程基准上接近更大的模型；P2T 在降低推理成本的同时提升了 SWE Pass@1；Search-E1 则从模型自身的搜索 rollout 中提取稠密监督。
- 前沿 agent 系统在真实工作流上依然脆弱。真实终端任务的最高通过率仅为 62.5%，金融表格 agent 的最高得分为 69.1/100，而科学预测在可行性与时间判断上依然薄弱，即便模型能够识别看似合理的机制。
- 安全与鲁棒性论文中反复出现一个模式：最有用的干预点往往并不在朴素诊断所指向的位置。修补“最具因果性”的模块可能反而有害，更强的模型在尾部风险场景中可能预测更差，而暴露更多推理轨迹虽然能提升效用，却也会增加蒸馏风险。

### 2) 关键主题（聚类）

### 主题：基于轨迹与过程信号的 Agent 训练

- **为什么重要**：多篇论文用 agent 运行、补丁或同胞 rollout 中已存在的信号，替代昂贵的人工监督。共同的赌注是：更好的过程数据——而不只是更多 RL——可以提升长程推理、搜索质量和软件 agent 行为。
- **代表论文**：
  - [ACC: Compiling Agent Trajectories for Long-Context Training](https://arxiv.org/abs/2605.21850v1)
  - [From Patches to Trajectories: Privileged Process Supervision for Software-Engineering Agents](https://arxiv.org/abs/2605.21996v1)
  - [Search-E1: Self-Distillation Drives Self-Evolution in Search-Augmented Reasoning](https://arxiv.org/abs/2605.22511v1)
  - [Post-Training is About States, Not Tokens: A State Distribution View of SFT, RL, and On-Policy Distillation](https://arxiv.org/abs/2605.22731v1)
- **共同方法**：
  - 复用已有轨迹或制品作为监督，而不是收集定制标签。
  - 从仅基于结果的奖励，转向更稠密的过程级或状态条件信号。
  - 过滤或重构轨迹，以去除模仿噪声、泄漏或被遮蔽的证据。
  - 使用 on-policy 或特权上下文监督，瞄准学习器实际会访问到的状态。
- **开放问题 / 失效模式**：
  - 对强教师或特权制品的依赖，可能限制可扩展性或引入偏差。
  - 收益往往只在单一基础模型或单一 scaffold 上展示，迁移性仍不确定。
  - 过程筛选可能计算开销很大，并且在基于日志构建时带来隐私/版权问题。
  - 关于自蒸馏或 OPD 在崩溃或收益递减前究竟能扩展多远，仍有疑问。

### 主题：运行时脚手架、状态管理与可审计的 Agent 基础设施

- **为什么重要**：今天一个很强的主题是，许多 agent 失败其实是接口与系统失败，而不纯粹是模型失败。这里的论文表明，改变 harness、执行日志或沙箱底座，可以实质性提升可靠性、可复现性和搜索深度。
- **代表论文**：
  - [Adapting the Interface, Not the Model: Runtime Harness Adaptation for Deterministic LLM Agents](https://arxiv.org/abs/2605.22166v1)
  - [The Log is the Agent: Event-Sourced Reactive Graphs for Auditable, Forkable Agentic Systems](https://arxiv.org/abs/2605.21997v1)
  - [DeltaBox: Scaling Stateful AI Agents with Millisecond-Level Sandbox Checkpoint/Rollback](https://arxiv.org/abs/2605.22781v1)
  - [Diagnosis Is Not Prescription: Linguistic Co-Adaptation Explains Patching Hazards in LLM Pipelines](https://arxiv.org/abs/2605.21958v1)
- **共同方法**：
  - 将执行状态、日志和工具契约视为一等优化目标。
  - 在冻结模型周围加入确定性验证、重放、回滚或规制层。
  - 使用轨迹分析来演化 harness 规则，或诊断干预应发生的位置。
  - 将缓慢的语义推理与快速的运行时执行约束或恢复机制分离。
- **开放问题 / 失效模式**：
  - 许多结果在确定性或固定拓扑设置中最强。
  - 更好的诊断并不保证找到最佳修补目标；协同适应可能使局部修复变得有害。
  - 系统层收益通常伴随部署复杂性：内核修改、存储开销或更严格的契约。
  - 目前很少有论文证明审计/重放原语不仅提升可观测性，也能提升下游任务成功率。

### 主题：Agent 安全正从提示攻击转向有状态、规避式与协议层威胁

- **为什么重要**：威胁模型正从单轮越狱扩展到利用持久状态、制品、辩论动态、OAuth 流程、检索漂移和潜在通道的攻击。实践上的信息是：当前防护通常校准在错误的攻击面上。
- **代表论文**：
  - [Blind Spots in the Guard: How Domain-Camouflaged Injection Attacks Evade Detection in Multi-Agent LLM Systems](https://arxiv.org/abs/2605.22001v1)
  - [Benchmarking Autonomous Agents against Temporal, Spatial, and Semantic Evasions](https://arxiv.org/abs/2605.22321v1)
  - [Boiling the Frog: A Multi-Turn Benchmark for Agentic Safety](https://arxiv.org/abs/2605.22643v1)
  - [A First Measurement Study on Authentication Security in Real-World Remote MCP Servers](https://arxiv.org/abs/2605.22333v1)
- **共同方法**：
  - 评估具有持久状态、工具和多轮交互的真实或逼真 agent 栈。
  - 衡量制品级或动作级危害，而不仅仅是文本拒答。
  - 用语义适配或碎片化载荷来压力测试检测器，而不是静态模板。
  - 纳入 OAuth/DCR 等协议与基础设施层，而不只看模型输出。
- **开放问题 / 失效模式**：
  - 许多评估具有平台特异性，因此跨 agent 泛化仍不清楚。
  - 现有护栏在高级规避下通常只带来边际收益。
  - 高置信度假阴性很常见，使基于置信度的监控不可靠。
  - 更真实的工具与多模态通道很可能暴露更多攻击面。

### 主题：评估正受到污染、指标选择与基准可利用性的攻击

- **为什么重要**：多篇论文认为，当前评估流水线可能系统性高估能力或安全性。共同结论是：可信测量如今需要对抗性鲁棒的协议，而不只是更大的基准集合。
- **代表论文**：
  - [The Illusion of Reasoning: Exposing Evasive Data Contamination in LLMs via Zero-CoT Truncation](https://arxiv.org/abs/2605.21856v1)
  - [Measuring Security Without Fooling Ourselves: Why Benchmarking Agents Is Hard](https://arxiv.org/abs/2605.22568v1)
  - [Is Capability a Liability? More Capable Language Models Make Worse Forecasts When It Matters Most](https://arxiv.org/abs/2605.22672v1)
  - [Agentic CLEAR: Automating Multi-Level Evaluation of LLM Agents](https://arxiv.org/abs/2605.22608v1)
- **共同方法**：
  - 直接探测隐藏混杂因素：抑制 CoT、使用金丝雀、检查轨迹或切换评分规则。
  - 比较结构匹配但经过扰动的参考项表现，以区分记忆与推理。
  - 报告多层级诊断，而不是单一标量分数。
  - 强调分布式或尾部感知评估，而不是一次性平均值。
- **开放问题 / 失效模式**：
  - 黑盒约束技巧（如 zero-CoT 提示）可能随着模型行为变化而失效。
  - LLM-as-judge 流水线会引入自身的方差与偏差。
  - 合适的评分规则与动态基准更昂贵，也更难标准化。
  - 基准加固本身可能演变成与自适应 agent 的军备竞赛。

### 主题：真实世界基准正在暴露合成能力与部署效用之间的巨大差距

- **为什么重要**：基于真实终端会话、金融表格、科学里程碑和冲突情境的新基准表明，前沿模型在任务需要持久制品、时间锚定或领域敏感判断时仍然表现不佳。
- **代表论文**：
  - [TerminalWorld: Benchmarking Agents on Real-World Terminal Tasks](https://arxiv.org/abs/2605.22535v1)
  - [WorkstreamBench: Evaluating LLM Agents on End-to-End Spreadsheet Tasks in Finance](https://arxiv.org/abs/2605.22664v1)
  - [Forecasting Scientific Progress with Artificial Intelligence](https://arxiv.org/abs/2605.22681v1)
  - [Can AI Make Conflicts Worse? An Alignment Failure in LLM Deployment Across Conflict Contexts](https://arxiv.org/abs/2605.22720v1)
- **共同方法**：
  - 从真实工作流或时间锚定事件构建基准，而不是合成谜题。
  - 评分制品质量、时机或领域敏感行为，而不仅是最终答案正确性。
  - 跨模型与 harness 比较，以区分模型能力与系统效应。
  - 在精确匹配不足时，使用人工或专家验证来校准 LLM 评审。
- **开放问题 / 失效模式**：
  - 真实基准构建成本高，而且通常高度领域化。
  - 对开放式制品的人类/LLM 评判仍然噪声较大。
  - 一些基准子集仍然较小，或经过选择性筛选。
  - 从一个真实领域迁移到另一个领域的能力仍然较弱。

### 主题：隐私与泄漏正转向更难察觉的通道

- **为什么重要**：今天的隐私研究涵盖黑盒 RDP 审计、多 agent 系统中的潜在 KV 泄漏，以及富输出带来的蒸馏泄漏。共同模式是：最重要的泄漏通道往往不是显而易见的文本输出。
- **代表论文**：
  - [Optimal Guarantees for Auditing Rényi Differentially Private Machine Learning](https://arxiv.org/abs/2605.21938v1)
  - [LCGuard: Latent Communication Guard for Safe KV Sharing in Multi-Agent Systems](https://arxiv.org/abs/2605.22786v1)
  - [The Distillation Game: Adaptive Attacks & Efficient Defenses](https://arxiv.org/abs/2605.22737v1)
  - [A First Measurement Study on Authentication Security in Real-World Remote MCP Servers](https://arxiv.org/abs/2605.22333v1)
- **共同方法**：
  - 通过可重构性、散度估计或自适应学生收益来操作化定义泄漏。
  - 从被动评估转向自适应攻击者或最坏情况金丝雀设置。
  - 在表示层或解码层加入轻量防御，而不只是策略文本过滤器。
  - 将理论与面向部署的审计或互联网规模测量结合。
- **开放问题 / 失效模式**：
  - 许多防御是经验性的，缺乏形式化保证。
  - 代理攻击者/解码器可能低估更强对手。
  - 实际部署依赖基础设施支持与协议合规，而不只是模型侧修复。
  - 在若干场景中，隐私-效用权衡仍然十分陡峭。

### 3) 技术综合
- 很大一部分论文用结构化中间对象替代端到端优化：编译上下文（ACC）、过程图（P2T）、类型化预测（Steins;Gate Drive）、事件日志（ActiveGraph）以及净化后的 KV 变换（LCGuard）。趋势是让隐藏的 agent 状态变得显式且可控。
- 多种方法通过改变监督目标而非基础模型来提升性能：ACC 直接监督证据 token，P2T 对每一步的 groundedness/progress 打分，Search-E1 从特权同胞轨迹中蒸馏，而 OPD/RL 被表述为改变被更新的状态分布。
- 安全论文越来越多地在制品/动作层而非响应层进行评估：Boiling the Frog 中的不安全文件谓词、A3S-Bench 中真实 OpenClaw 执行上的 RTR，以及 MCP servers 中的 OAuth 生命周期缺陷。
- 多篇论文表明，静态检测器在语义适配下会失效：用于污染检测的 ZCP、领域伪装注入，以及自适应蒸馏评估，都利用了表面线索与潜在能力/泄漏之间的鸿沟。
- 运行时控制正变得分层化：LIFE-HARNESS 将契约/技能/动作/轨迹规制拆分；Pre-VLA 在动作执行前加入验证器；Steins;Gate Drive 将缓慢的战略选择与快速的基于谓词的失效判定分离。
- 若干工作在通常依赖启发式的地方采用了精确或有原则的优化：RADAR 用精确 Min-Cut 做上下文选择，RDP 审计器给出有限样本置信界与极小极大下界，而蒸馏论文推导了指数倾斜的最优响应。
- 真实评估论文反复发现，从标准基准到真实任务的迁移很弱：TerminalWorld 与 Terminal-Bench 的相关性很低（r = 0.20），预测结论会在 CRPS 与 Brier 下翻转，而科学预测即便在机制性 MCQ 表现强时仍然较差。
- 反复出现一种“更大/更强并不总是更安全或更好”的模式：更强模型在尾部风险场景中可能预测更差，修补最高归因模块可能有害，而更丰富的输出会增加蒸馏泄漏。
- 系统论文越来越针对分支搜索工作负载进行优化：DeltaBox 的毫秒级 checkpoint/restore 与 ActiveGraph 的低成本 fork 都瞄准同一个瓶颈——复用共享前缀，而不必重放昂贵的模型/工具调用。
- 许多论文依赖 LLM 评审，但较强的工作要么用人工进行验证（WorkstreamBench、Agentic CLEAR），要么用精确的制品检查与形式化谓词加以约束（Boiling the Frog、RADAR、RDP auditing）。

### 4) Top 5 论文（附“为什么是现在”）

#### [ACC: Compiling Agent Trajectories for Long-Context Training](https://arxiv.org/abs/2605.21850v1)
- 将经过答案验证的 agent 日志转化为长上下文 QA 样本，直接监督对远距离证据的整合，而不是遮蔽工具输出。
- 在 Qwen3-30B-A3B 上带来显著的长上下文提升：MRCR 68.28（+18.09），GraphWalks 77.51（+7.59），在这些基准上的表现可与 Qwen3-235B-A22B 相当。
- 现在很有用，因为许多团队已经拥有大量 agent 轨迹，但缺少高质量的长上下文训练语料。
- 它提出了一条实用途径：无需改架构或依赖重 RL 流水线，也能提升较小模型的长程推理能力。
- **审慎看法**：证据仅来自一个基础模型和三类 agent，并且依赖教师 rationale；对于 SWE 轨迹，rationale 通过率较低。

#### [RADAR: Defending RAG Dynamically against Retrieval Corruption](https://arxiv.org/abs/2605.22041v1)
- 将动态 RAG 防御重构为对原子答案进行精确图割选择，并引入贝叶斯记忆节点以平衡稳定性与适应性。
- 在静态和动态设置中都表现出较强鲁棒性，包括某个静态 PIA 设置下 75.0% 准确率与 5.0% ASR，以及累积动态评估中 63.60% 准确率 / 17.85% ASR。
- 现在很有用，因为实时网页 RAG 正越来越成为默认配置，而大多数防御仍然是为静态语料设计的。
- 记忆节点设计尤其适合无法存储完整历史文档的生产系统。
- **审慎看法**：在更大的检索深度下，运行时与稠密图成本可能变得显著，而且该方法假设良性证据构成主导性的连贯簇。

#### [TerminalWorld: Benchmarking Agents on Real-World Terminal Tasks](https://arxiv.org/abs/2605.22535v1)
- 从 80,870 条真实 asciinema 录制中构建了 1,530 个经过验证的终端任务，其中包含一个 200 题、人工审查的 VERIFIED 子集。
- 结果表明前沿 agent 在真实 CLI 工作流上仍然吃力；VERIFIED 子集上的最佳通过率仅为 62.5%，且从 Terminal-Bench 的迁移很弱（Pearson r = 0.20）。
- 现在很有用，因为终端 agent 正被部署到真实开发者工作流中，而合成谜题型基准似乎高估了其就绪度。
- 该基准的命令多样性是一大优势：1,280 个唯一命令，其中 91% 不在 Terminal-Bench 中。
- **审慎看法**：该流水线排除了 TUI/GUI 工作流和不可复现环境，因此仍缺失一些重要的真实复杂性。

#### [Benchmarking Autonomous Agents against Temporal, Spatial, and Semantic Evasions](https://arxiv.org/abs/2605.22321v1)
- 提出了 A3S-Bench，一个包含 2,254 条轨迹的有状态 agent 攻击基准，覆盖时间碎片化、制品介导规避和良性上下文隐藏。
- 发现高级规避会将 10 个骨干模型上的平均 RTR@1 从 28.3% 提高到 52.6%，且多轮注入明显强于单轮注入。
- 现在很有用，因为 agent 安全讨论仍过度聚焦于单轮提示注入，而已部署 agent 拥有持久状态和系统权限。
- 还包含防御测试，显示当前护栏与平台升级只能提供有限缓解。
- **审慎看法**：主要评估基于 OpenClaw，因此平台特定的设计选择可能影响绝对脆弱性画像。

#### [A First Measurement Study on Authentication Security in Real-World Remote MCP Servers](https://arxiv.org/abs/2605.22333v1)
- 提供了首个互联网规模的远程 MCP 认证测量，验证了 7,973 台在线服务器，并发现其中 40.55% 在无认证情况下暴露工具。
- 在一个启用 DCR、经测试的 119 台服务器子集中，发现了 325 个已确认缺陷实例；每一台被测服务器至少存在一个缺陷，并且负责任披露产生了 9 个 CVE。
- 现在很有用，因为 MCP 的采用速度快于其安全卫生建设，而协议层弱点无论模型质量如何都可能导致账户接管。
- 对于部署远程 MCP 且使用 OAuth、DCR 或委托授权的团队，尤其具有决策相关性。
- **审慎看法**：覆盖范围仅限于可公开发现的资产和人工验证子集，因此企业/私有部署情况可能不同。

### 5) 实际下一步
- 将 agent 日志视为战略资产：试点 ACC 风格的编译用于长上下文训练，并衡量直接证据 token 监督是否能改善你自己的检索/工具轨迹。
- 如果你训练 SWE 或工具 agent，加入逐步 groundedness 与轨迹效率过滤；在成功率和推理成本上，对比基于结果过滤的 SFT 与 P2T 风格的筛选轨迹。
- 审计你的评估栈是否存在隐藏混杂因素：用 zero-CoT 风格探针做污染检查，在安全基准中加入金丝雀，并在适用场景报告尾部感知指标。
- 用语义伪装载荷和多轮碎片化来红队测试提示注入防御，而不只是显式覆盖字符串。
- 对于部署在确定性环境中的生产 agent，在重新训练前先测试 harness 侧干预：动作规范化、轨迹规制、技能检索和契约更新，可能带来更快收益。
- 如果你的 agent 会在有状态环境中分支或搜索，显式基准测试 checkpoint/rollback 开销；DeltaBox 风格的快速 C/R 或事件日志分叉会实质性改变可行搜索深度。
- 将安全评分更靠近制品/状态变化：对文件、配置或工具动作定义不安全谓词，而不是只依赖拒答文本。
- 对于共享潜在状态的多 agent 系统，评估共享 KV 制品的可重构性；如果使用潜在通信，可考虑表示层净化。
- 如果你在动态来源上部署 RAG，测试在持续演化的污染下稳定性/可塑性权衡；精确一致性选择加轻量记忆，可能优于静态过滤器。
- 增加多层级可观测性：结合轨迹级评审、节点级聚类和可重放日志，以便在 harness/模型变体之间定位并比较失败。

---
*基于逐篇论文分析生成；未进行外部浏览。*
