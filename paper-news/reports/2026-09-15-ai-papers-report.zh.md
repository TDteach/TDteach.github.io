# 2026-09-15

## ATR 只重新检查受状态变化影响的决策条件

*[From Version Conflicts to Decision Conflicts: Selective Revalidation for Long-Running AI Agents](https://arxiv.org/abs/2609.08015v1)*

长期运行的 agent 可能读取状态、推理、等待工具或审批，然后在使该动作合理的状态已经改变后再执行。论文指出普通版本检查的一个精确限制：检测到资源版本已改变本身并不能决定待定动作的正当性是否因此失效。作者将前者称为“version conflict（版本冲突）”，并将“decision conflict（决策冲突）”保留用于那种使待定意图所需前提被证伪或无法验证的变化。

ATR 记录待定动作背后的显式、可执行前提。当相关状态发生变化——或在执行前即时——它遵循记录的依赖并仅重新检查受影响的条件。声明的结果允许运行时保留一个动作、刷新非决定性元数据、要求重新规划或阻止执行。该协议还将被检查的状态绑定到目标端的事务或 compare-and-set 操作，而不是将事前生效验证单独视为足够。在一个有意调度的跨资源历史中，target-only CAS 提交了 100/100 个 effect，当策略条件变为 false 后；加入已检查的策略令牌时则拒绝了 100/100。

受控评估在 210,000 次执行、覆盖 15 个变异案例中匹配了每一个开发者指定的结果，既没有错误允许也没有错误阻止。在十个持久 SQLite checkpoint/resume 单元中也可测得选择性：ATR 每次变更评估 0.6 个条件，而 FullScan 为 6.0。在 4,093 次记录读取下，摘要报告 ATR 为 9.3 microseconds，而 FullScan 为 2595.9 microseconds。上述数字描述的是一个用开发者撰写前提和确定性工作负载的 Python 原型，因此它们支持受控可行性，而非生产级延迟估计。

主要的工程问题并不仅仅是某个状态版本是否改变，而是运行时是否捕获了判定该待定决策所需的每一条依赖。这一条件具有重要后果：随机省略唯一关键依赖边会在 1%、5% 和 10% 的省略率下分别产生 0.95%、5.05% 和 9.97% 的错误允许率。论文也不声称分布式跨系统的原子性或外部效果的 exactly-once；其门控仅适用于显式绑定进目标的证据。

一个有用的研究操作是实现一种带显式前提的待定动作类型，然后对缺失的依赖边和策略变化进行故障注入。衡量不必要的重新规划与错误允许，并检验最终目标是否能原子性地强制执行被检查的证据令牌。该实验检验了选择性重验证所依赖的依赖捕获和目标强制假设。

研究一个将全面重试替换为基于前提层面重验证的具体协议，然后在 agent 运行时复用其依赖省略故障注入测试。

[Abstract; §2.2; §3.1–§3.2; §5](https://arxiv.org/abs/2609.08015v1)

## CausalVerify 针对固定的已实现数据估计对已执行的因果工作流进行评分

*[CausalVerify: An Execution-Grounded Benchmark for LLM Causal Inference Workflows](https://arxiv.org/abs/2609.07944v1)*

CausalVerify 将 LLM 辅助因果分析中的一个特定失效点孤立出来：在研究问题、数据描述和制度背景被指定之后，已执行的工作流能否返回一个以基准固定的处理效应估计？（CausalVerify, S1.p3.1; S4.SS0.SSS0.Px1.p1.2）

它通过两条轨道将解释与验证分离。实验 A 使用 259 篇重构的已发表经济学论文和四-LLM 共识标签去评分方法族和方向一致性；实验 B 使用 100 个固定种子合成情形，覆盖 difference-in-differences、event study、instrumental-variable 与 regression-discontinuity 设计。（CausalVerify, S1.p3.1）每个模型生成一次性 R 代码并执行，当提取的标量系数相对于规范已实现数据估计的相对误差不超过默认容差 50% 时，标记为 L2b+ 正确。（CausalVerify, S4.SS0.SSS0.Px1.p1.2）

决定性结果是代码执行并不等价于数值正确。在默认 50% 容差下，被评估的七个 LLM 在 L2b+ 通过率上跨度为 10% 到 88%。（CausalVerify, Abstract）在 426 个可执行工作流中，66 个（15.5%）返回了错误估计。（CausalVerify, S5.SS0.SSS0.Px2.p1）基于执行的排名与 L2b+ 的一致性远高于仅基于文本方向评分：对 L2b，Kendall’s τ 为 0.81，Spearman’s ρ 为 0.93，而 L4 的 Kendall’s τ 则在 −0.20 到 0.10 之间波动。（CausalVerify, Abstract）在所测试的回顾性置信提示下，自报置信度并不能可靠地区分正确与错误的工作流。（CausalVerify, S5.SS0.SSS0.Px5.p1）

CausalReasoningBenchmark 将结构化识别与数值估计分开评分。（CausalReasoningBenchmark, Abstract / [abstract1.1] and Section 3 (S3.p1–S3.p3)）而 CausalVerify 则固定合成的已实现数据目标用于执行检查。（CausalVerify, S1.p3.1）这一互补设计明确了一个有用的研究操作：在评估之前冻结已实现数据集和规范估计器，执行每个生成的分析，提取报告的标量并评分一致性，而不是仅仅评估代码能否执行。（CausalVerify, S4.SS0.SSS0.Px1.p1.2）

不要将这些通过率解读为一般的因果推断能力。实验 B 是合成且有结构的，量测的是在已知 CSV 数据上的教材式工作流，而不是整个实证研究项目。（CausalVerify, S7.p2）其 R 后端是固定的，因此数值大小依赖于后端实现。（CausalVerify, S7.p3）真实论文轨道也使用了四-LLM 共识标签；一项完成的 30 篇论文歧义审计在方法标签上与共识一致率为 60.0%，在方向标签上为 47.6%，方向的一致性 Cohen’s κ=0.294。（CausalVerify, S7.p1）

阅读以学习如何为生成的因果代码构造基于执行的检查，同时评估现实性与后端权衡。

[Abstract; S1.p3.1; S4.SS0.SSS0.Px1.p1.2; S5.SS0.SSS0.Px2.p1; S5.SS0.SSS0.Px5.p1; S7.p1; S7.p2; S7.p3](https://arxiv.org/abs/2609.07944v1) · [Abstract / \[abstract1.1\] and Section 3 (S3.p1–S3.p3)](https://arxiv.org/abs/2602.20571v2)

## TaskGuard 使用恢复残差和检测器敏感性来选择恢复或保留

*[TaskGuard: Task-Conditioned Restoration Utility for Risk-Aware Object Detection](https://arxiv.org/abs/2609.08011v1)*

先恢复再检测的检测管道存在一个具体失败模式：图像在恢复后看起来更好，但并未改善下游检测。TaskGuard 将这种不匹配转化为对每个候选的“恢复还是保留”决策，而不是假定恢复总是应该被接受。

该设置将修复器和检测器都保持冻结。给定退化图像 I_d 和候选 I_c，控制器形成已实现残差 R = I_c - I_d。然后它将该实际图像变化方向与检测器敏感性耦合：伪标签来自对 I_c 的检测，检测器损失梯度在 I_d 处被评估，并且区域分数由梯度–残差交互计算得出。检测器响应与残差统计被加入任务梯度特征中。这是关键方法变化：效用从干预改变了什么以及检测器如何响应来估计，而不是仅依赖外观。

TaskGuard 在 Gaussian 退化上拟合了一个 Ridge 效用预测器。它使用 50 个折叠特定回归器，平均它们的预测，并从 Gaussian TRAIN 的 out-of-fold 预测中在 98% 效益保留规则下冻结单一阈值；验证和测试数据不用于重新调整。该协议将迁移问题显式化：在一种退化族上学到的控制器能否决定何时接受来自其他退化族的候选？

在未见的运动模糊、雨和失焦上，论文报告了 family-macro 上 54.2% 更少的负损失干预（loss-negative interventions）和 pooled 上 37.0% 更少的实际逐图像检测恶化，同时保留了 Always-Restore COCO AP 的 98.8%。事后冻结的特征消融支持方向分量：任务梯度特征达到 family-macro Spearman ρ_s = 0.631，相比之下检测器响应特征为 0.480，残差单独特征为 0.240。在自然雨 DAWN 数据集上，TaskGuard 在保留通过 deraining 获得的 AP 改进的 77.8% 的同时，将负损失干预减少了 97.9%。

证据有明确边界。既有的优先一阶近似和可部署的伪梯度并不完美，仅提供衰减的方向信息。TaskGuard 必须先生成候选恢复再判断，因此它不能避免恢复成本；计算梯度也增加了运行时开销。实验展示了从 Gaussian 训练到运动模糊、合成雨、失焦和自然雨 DAWN 的迁移，但并未建立跨修复器、检测器、数据集或任务的任意迁移。检测器损失是可微的逐图像训练效用，并不等同于 AP 或逐图像 F1。因此一个可借用的具体研究操作是：记录已实现的干预，配对下游敏感性，在持出退化测试前冻结决策规则，并同时报告损失级别与任务度量结果。最后一句是编辑性建议，而非测得结果。

学习如何使用残差–检测器敏感性信号将候选恢复转化为任务条件化的恢复或保留决策，同时在测试未见退化前冻结阈值并追踪证据的适用边界。

[Abstract; Section 3 (Eq. (4)–(6)); Appendix C (as1_A3); Appendix D Table 2 (as1_A4.T2); Section 6](https://arxiv.org/abs/2609.08011v1)

## 在线替代模型修复将搜索长度与高保真查询预算分离

*[Online Surrogate Repair: Decoupling High-Fidelity Feedback from Search Length in Closed-Loop Discovery](https://arxiv.org/abs/2609.07655v1)*

闭环发现存在一个具体的预算不匹配：候选设计可以以低边际计算成本生成，而可靠的反馈可能需要湿实验合成、表征或高保真计算。先前的具体限制是用固定替代模型替换新实验会留下持久的模型误差，而优化可能放大这些误差。

在线替代模型修复（Online surrogate repair, OSR）在固定替代模型运行和每集后都进行高保真反馈之间插入第三种反馈机制。在主要由廉价替代反馈驱动的更长代理搜索期间，一个采集规则会从代理累计的提案中选择设计进行高保真评估；得到的标签会更新替代模型以供后续集使用。这将昂贵反馈的频率与搜索的持续时间分离开来。

决定性的设计选择在于在哪里修复替代模型。在使用 40 个合成表格世界、两种上下文大小以及 TabPFN-3 或 TabICLv2 的静态实验中，Q90-UCB 和 expected improvement (EI) 在 32 个 oracle 查询下分别产生了平均最大后悔（mean maximum-regret）减少 0.424 和 0.409，而 Global-UQ 与 Random 分别为 0.063 和 0.052。作者将这一差距解释为：改善按 NRMSE 测量的全局预测精度并不必然消除被优化器利用的虚假极大值。

在在线合成循环中，Online EI 用仅 16% 的 oracle 查询数关闭了无修复和完全 oracle 反馈之间 76% 的差距：即在 200 个 episode 中安排 32 次查询，而不是在每个 episode 后都反馈。在报告的无噪声 TabPFN-3 结果中，mean normalized regret 为 0.0552，95% 置信区间为 0.0298–0.0843，中位数为 0.0393。

论文在 MADE 上报告了相同的查询预算模式：在 300 个 episode 且 Online EI 使用 32 个 oracle 查询时，完全反馈控制需要 6.36–7.23 倍更多的 oracle 查询来匹配两个 LLM 协调器下的发现计数，在 Chemeleon+MLIP 工作流下需要 10.27 倍更多。这些是报告的 oracle 查询比较，并非端到端时钟加速的证据。

可转移的研究操作是使用优化器的实际后悔或发现目标来定义修复成功，然后在固定的 oracle 预算下比较 EI 和 Q90-UCB 与全局覆盖（Global-UQ）及随机选择的表现。一项有用的后续工作是同时改变查询计数与调度，而不是假定均匀间隔的修复是最优的。

作者指出 OSR 需要一个表格表示和一个能够将新标签以上下文方式纳入的表格基础模型。它们也未将其用于测试时训练、强化学习代理、其他替代模型类别或更先进的面向优化的调度；因此所报告的收益仍然依赖于所研究的表格替代模型、合成世界和 MADE 设置。

学习如何在长闭环搜索期间用稀疏、针对优化器的高保真评估修复替代模型，而无需在每个 episode 后都询问 oracle。

[Abstract; Section 4.1 (Static surrogate repair) / Table 1; paragraph S4.SS1.p2; Table 2 (Synthetic world results), row for Online EI (Q=32), TabPFN-3; Abstract and Section 4.3 (MADE benchmark), Table 3 and paragraph S4.SS3.p3; Section 5 (Discussion), paragraphs S5.p3–S5.p4](https://arxiv.org/abs/2609.07655v1)

## 稳定流式并不能建立长期回忆

*[Separating Stream Stability from Long-Term Recall in Language Models](https://arxiv.org/abs/2609.07282v1)*

论文指出将流式、长上下文和记忆方法互换使用的一个限制：模型可以在生成上保持良好表现，同时失去对早期内容的因果访问。它定义了三个不同的地平线：stability horizon（稳定性地平线），在其上预测行为保持良好；access horizon（访问地平线），在其上过去的内容仍能因果地影响输出；以及 utility horizon（效用地平线），在其上某项任务仍保持可接受的性能。一个构造性论证表明，即使稳定性可以是无限的，访问与效用仍可能有界。

作者将这一区别形成 ThreeH，一个评估契约，要求在一个声明的资源与计算预算下提供稳定、因果保留与延迟任务效用三条轨道。保留轨道使用滞后干预与反事实对，而效用轨道在写入证据时隐藏最终查询。该设计测试系统是否能使用一个远端事实，而不仅仅是继续产生局部上合理的 token。

实验使用了 2,048 tokens 的活动缓存，并比较了普通窗口 attention、带 attention sinks 的 StreamingLLM、窗口重计算、循环记忆与 sink-plus-retrieval 系统。在 128K-token 的流上，StreamingLLM 的归一化困惑度为其 2K reference 的 1.04×，接近窗口重计算的 1.02×，同时保持恒定的 KV 内存与较低的每-token 延迟。该结果支持将 attention sinks 视为一种稳定性机制，而非语义记忆。

保留测试明确了边界。在滞后 2W 时，当目标不置于固定的 sink 位置上时，Window 与 StreamingLLM 在一个四选绑定任务上的准确率都降至约 26%，接近随机水平；循环记忆在 2W 达到 70%，在 8W 为 46%；sink-plus-retrieval 分别达到 89% 和 78%。效用是另一个独立测量：StreamingLLM 的延迟决策准确率从 0.5W 时的 93% 降至 2W 时的 36%，接近 33.3% 的随机率。

对于新流式或 agent 系统，可迁移的操作是先声明资源预算，然后报告所有三条轨道，而不是将稳定的困惑度当作记忆的证据。确切的地平线依赖于流、任务族、评分阈值与参考系统；外部记忆的计量与困惑度也存在方法相关的混淆。ThreeH 亦不评估隐私、校准、事实性或对恶意记忆内容的鲁棒性。

阅读以学习一个具体的、与预算匹配的测试，用来判断流式模型是在仅保持流畅性还是仍能在下游决策中使用远端事实。

[Thmproposition1.p1; S4.SS2.p1; S4.T1; S4.SS3.p1; S4.SS4.p1; S5.p1; S5.T4; Sx1.p1](https://arxiv.org/pdf/2609.07282v1)

本期按 2026-09-15 的候选论文事后编制，核验日期为 2026-09-16。
