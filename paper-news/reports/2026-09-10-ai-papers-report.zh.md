# 2026-09-10

## Event-CST 在 Meta-FSA 上将训练长度 1k 外推到 128k 时的改进

*[Learning Length-Extrapolatable Recurrent Models](https://arxiv.org/abs/2609.09157v1)*

循环模型为长上下文建模提供了天然途径，但用 BPTT 训练的模型在推理长度超过训练视界时可能失败。论文的诊断是，仅凭梯度范数衰减（gradient-norm decay）并不能决定可学性：任务还必须要求远处的损失为更早的循环状态提供方向性（credit）。

CST 仅改变反向传递：在分段 BPTT 的暴露区块边界处，它将传入的 state-credit 向量乘以一个正的标量增益以稳定其范数，同时不对被修正的分量进行旋转，而保持前向计算不变。论文将控制器专门化到具体场景：用于受控合成任务的 Event-CST，以及用于真实文本的 symmetric head-wise CST。由此直接得出一个有用的复现操作：在边界处记录状态-信用范数的对数和方向对齐情况，然后测试失败是否源于缺失的方向性归因，还是仅仅幅度太弱，然后再修改前向循环。

在 Meta-FSA 上，Event-CST 在 16k–128k 的全部 16 项汇总评估中均优于 BPTT，平均领先 6.58 百分点；这是一项 three-seed 实验，训练时的物理长度为 1k。 在 MQAR 上，2k–128k 区间的平均准确率从 74.95% 提升到 80.61%，而在 128k 处的准确率从 25.56% 提升到 41.66%。这些结果为该向后干预提供了一个具体的长度外推测试，而不是单纯把梯度统计作为唯一诊断指标。

对于一个在 4K 上训练的 one 123.30M 的循环语言模型，symmetric head-wise CST 在全部 14 个评估的数据集–长度设置上都改善了全标记 NLL，平均提升约为 0.00724 NLL。在最长的注释上下文中，关键标记（key-token）的增益比全标记增益大数倍，包括在 LongData 32K 上为 3.50×，在 GovReport 32K 上为 4.54×。然而，CST 只控制所选边界信号的尺度：它不能恢复缺失的方向或去除时间干扰，而且其被修改的反向信号并非原始目标的精确梯度。论文关于语言模型的证据来自 one 123M-parameter 模型，CST 配置是在所报告的评估套件上选择的，并且每种方法只有 one 次训练运行。应将该控制器视为一个聚焦的消融目标，而非对循环问题的通用修复方案。

阅读此文以学习一种诊断与干预流程：先测试任务是否需要跨边界的归因，再测试该信号到达时幅度是否足够可用，然后才改变前向模型。

[abstract1.1; S1.p3.2; S4.SS0.SSS0.Px1.p1; S5.SS2.SSS0.Px1.p1; S5.SS3.p4; S6.SS4.SSS0.Px1.p1; S6.SS4.SSS0.Px2.p1; S8.SS0.SSS0.Px1.p1.1; S8.SS0.SSS0.Px1.p1.2](https://arxiv.org/abs/2609.09157v1)

## 耦合权重衰减在尺度不变块中产生确切的有效步长递推关系

*[When Does Scale-Invariant Optimization Become Unstable? An Exact Schedule Law with Weight Decay](https://arxiv.org/abs/2609.09116v1)*

训练一个尺度不变的参数块可能会掩盖实际上决定其方向性更新的变量：名义学习率会被不断变化的参数范数所除。本文把这种反馈在带有耦合（coupled）权重衰减的 SGD 中离散化并显式化。对于满足 L(\alpha w)=L(w) 的块，作者定义了 \(\Phi_t=\eta_t/(a_t r_t^2)\)，其中 \(a_t=1-\eta_t\lambda_t&gt;0\)。他们推导出

\[
\Phi_&#123;t+1&#125;=\frac&#123;B_t\Phi_t&#125;&#123;1+\Phi_t^2\|\bar g_t\|^2&#125;,
\]

其中 \(B_t=(\eta_&#123;t+1&#125;/\eta_t)/(a_ta_&#123;t+1&#125;)\)。因此，\(B_t\) 是由学习率表（schedule）和衰减产生的强迫项，而分母则在当前步长和无量纲梯度增长时抑制下一步的有效方向步长。在随机版本中，条件对数漂移为 \(\beta_t-q_t\)，将可预测的强迫项与期望的几何修正分离开来。

决定性的动力学测试是具有各向同性协方差和常数调度的归一化线性回归模型。它在高维下的更新可以化约为对齐度和 \(\Phi\) 上的二维映射。唯一的内部平衡点位于递推的切换面上，作者证明在存在耦合衰减时它是一个不稳定的螺旋源（unstable spiral source）。这并不意味着对任意神经网络都能建立周期性行为或不稳定性：论文明确不证明全局收敛到极限环，也不将该表征扩展到各向异性协方差或一般深度网络。

该项提出的迁移是可操作的而非仅作诊断：当一个归一化块满足定理假设时，可以将对数 \(\Phi\) 作为状态变量追踪，并将 \(B_t\) 作为其调度控制。作者报告说，合成调度以强制恒定 \(B_t\) 会在 CIFAR-10 上产生在 \(B=1\) 处峰值明显的准确率曲线；不过提供的绘图曲线及随机种子级的变异没有在证据中被检查。一个有用的后续实验是对若干目标 \(B\) 值施加约束，同时记录每个块的 \(\Phi\)、范数和验证结果，然后测试预测的边界是否能在块间迁移。

这里的适用范围尤其重要。该一标量恒等式要求严格的块尺度不变性和耦合权重衰减的乘法收缩；解耦衰减会破坏该结构。向齐次优化器（homogeneous-optimizer）的扩展也使 Adam 的陈述有条件性：其在 \(\nu=0\) 时的精确规律是一个 \(\varepsilon\to0\) 的极限结论，而有限 \(\varepsilon\) 会扰动尺度不变性。

阅读此文可将学习率调度和耦合权重衰减转化为可测量的每块控制问题，同时牢记定理所要求的严格不变性和优化器假设。

[Section 2.1, Theorem 2.1, Eq. (6); Section 2.2, Theorem 2.3, Eqs. (10), (11), (13); Section 3.1, Theorem 3.4; Proposition 3.6; Section 5.1–5.3, Target-B intervention; Appendix F, Section A6 (Limitations and Open directions); Section 4.2, Theorem 4.3; Appendix F discussion](https://arxiv.org/abs/2609.09116v1)

## One-step AVI 在论文解决的游戏上学得了比 AlphaZero 更准确的估值

*[The Surprising Effectiveness of Approximate Value Iteration in Self-Play](https://arxiv.org/abs/2609.09094v1)*

### 变化点

基于蒙特卡洛树搜索（MCTS）的流行自对弈方法可能带来大量计算开销。本文测试了一个更窄的替代方案：Approximate Value Iteration（AVI），它用一步回溯（one-step backups）训练神经价值函数，而不是将 MCTS 作为训练过程的核心。[1]

AVI 在 ε-greedy 的自对弈数据收集与对一步 negamax 目标的监督 MSE 回归之间交替。所报告的实现还使用了重放缓冲区和在收集期间的目标网络快照。在论文的双人设定中，目标通过动作的即时回报和从对手视角评估的下一状态价值来评估该动作。这是一个刻意最小化的价值学习管线：其部署策略可以简单地选择根据学习到的价值进行一步前瞻最优的动作。[1]

### 证据及其适用范围

最强的比较使用了在 Connect Four、Hex(7x7) 和合成 F-Games 上的真实解算器（ground-truth oracles）。在所报告的协议下，作者报告 AVI 在这些已解的游戏上学得的价值函数明显比他们的 AlphaZero 基线更准确。他们还报告在其前向等价的神经网络计算代理下，AVI 的贪婪一步前瞻策略在与基于 MCTS 的策略比较时具有竞争力。[1]

一个有用的诊断超越了对最终智能体的比较。固定 AlphaZero 的 MCTS 策略先验（policy prior）不变，仅用 AVI 的价值替换 AlphaZero 的叶节点价值，会在 Connect Four 和 Hex(7x7) 的测试 MCTS 预算范围内降低错误率。这支持一个更窄的解释：在那些实验中，AVI 提供了更好的叶节点估值；但这并不表明 AVI 智能体的所有部分都优于 AlphaZero 智能体的所有部分。[1]

更大棋盘的证据则不那么决定性。作者报告 AVI 在 Othello 和 Go(9x9) 上训练稳定且交叉推断有用，但这些实验仅以固定的 MiniZero 基线为基准，无法确定与最优博弈的距离。计算成本的比较也不是墙钟时间（wall-clock）的声明：其代理排除了经过时间（elapsed-time）的解释。最后，作者指出 ε-greedy 的自对弈可能会遗漏稀疏策略。[1]

### 一个可复用的研究操作

在评估替代的价值学习目标时，应区分“价值质量”（value quality）与“搜索策略质量”（search-policy quality）。如果有 Oracle，可分别测量价值误差与策略后悔（policy regret）。然后进行交叉推断：固定 MCTS 的策略先验和搜索预算，仅替换叶节点价值，测试搜索结果是否改变。这在不把端到端对局强度视为唯一诊断的情况下，隔离了价值函数的贡献。

[1]: https://arxiv.org/abs/2609.09094v1

学习一个具体的交叉推断实验，用于测试当 MCTS 的策略先验和预算固定时，价值函数是否能够改善搜索表现。

[Abstract; S5.SS1–S5.SS3; S6.p4–p5](https://arxiv.org/abs/2609.09094v1)

## On SWE-bench Verified：测试质量决定反馈是否有帮助

*[ExecCritic: Learn to Test, Test to Improve for Coding Agents](https://arxiv.org/abs/2609.09133v1)*

执行反馈并非自动地为编程修复代理提供可靠监督。作者指出了一个具体的失败模式：生成的测试可能编码不完整或不正确的行为目标，而既生成测试又编写补丁的轨迹可能会产生相互一致的错误，从而造成虚假的置信度。 [Source](https://arxiv.org/abs/2609.09133v1)

ExecCritic 通过将测试和修复分配给不同的代理来改变工作流。其 Test 代理独立产生与仓库原生（repository-native）兼容的测试；一个 fail-closed 的测试夹具（harness）对被接纳的测试包进行资格审查并冻结；然后 Repair 代理在无法修改这些测试的情况下根据执行反馈更改源代码。两种角色都使用 Qwen-3.5-35B-A3B 并分别训练。在 “Learn to Test” 中，Test 代理被训练以产生能够区分正确补丁与不正确补丁的行为有效测试。在 “Test to Improve” 中，Repair 代理被训练以同时进行直接修复和基于反馈的修订。[Source](https://arxiv.org/abs/2609.09133v1)

决定性实验在 SWE-bench Verified 上固定基线 Repair 代理并改变测试来源。相对于 61.2% 的无测试修复率基线，来自基线 Test 代理的测试将修复率降至 57.3%，而来自 GPT-5.6-sol 的测试将其提高到 65.3%。该条件使论文的中心判断适当地变窄：执行反馈在此处是否有帮助取决于所提供测试的质量，而不是单纯取决于是否执 行了修复回环。[Source](https://arxiv.org/abs/2609.09133v1)

角色专属的后训练（role-specific post-training）将 Qwen Test 代理的 Base-to-Gold 成功率从 22.2% 提高到 62.2%。当两个经后训练的 Qwen 代理被组合时，报告的 SWE-bench Verified 率为 72.6%，比原始无测试基线高出 11.4-point；作者声明评估中未使用更强模型或 Oracle 反馈。[Source](https://arxiv.org/abs/2609.09133v1)

一个可迁移的后续操作是固定 Repair 策略，用无反馈和具有测量质量的测试包分别测试它，并按测试质量报告修复结果。接纳协议并不是语义 Oracle：制品的有效性、声明节点绑定（declared-node binding）和干净的 Base 失败并不证明问题对齐。此外，该框架将 Test 和 Repair 作为独立策略进行训练，并仅在训练后将它们组合。那些边界条件仍然留有空间，以验证联合优化的角色或更强的语义测试验证是否会改变测试质量与修复价值之间的观察关系。 [Source](https://arxiv.org/abs/2609.09133v1)

阅读此文以提取一个受控实验，用来验证仅当独立生成的测试足够可靠时，执行反馈才会改进修复结果。

[Abstract; Section 3.1; Section 7](https://arxiv.org/abs/2609.09133v1)

## REAL 将证据可用性转换为反事实监督信号

*[Evaluating and Improving Evidence-Grounded Fact-Checking in LLMs via Multi-Round Evidence Ablation](https://arxiv.org/abs/2609.08943v1)*

### 论文检验的内容

一个事实核查器可以返回正确结论，同时使用非推理时提供的文档以外的信息。本文问的是：当其被引用的证据被移除时，LLM 验证器是否会修正其结论，而不是把准确性或引用生成当作有根据的证据。它引入了证据消融评价（Fact-Ablated Evaluation, FAE），即“迭代地消融被引用的证据以评估 LLM 是否相应地修正其预测。”（[Abstract](https://arxiv.org/abs/2609.08943v1)）

具体的诊断是行为性的：多轮移除选定证据并观察验证器预测的轨迹。作者定义了即时敏感性（Immediate Sensitivity），用以测量“验证器对证据消融的即时响应”。他们的解释是，这一方法暴露了与普通事实核查分数不同的属性：“证据消融是证据支撑行为的主要驱动因素，这揭示了真伪预测准确性与证据依赖性之间的明显断层。”（[§4.3; §7.3](https://arxiv.org/abs/2609.08943v1)）

### 训练的改变

REAL 通过把完整证据条件与被消融证据条件配对来改变微调。在被消融证据条件下，期望的输出是在没有证据时的“不足以判断”（NEI），因此训练信号要求验证器在支持消失时做出不同的反应。作者如是表述：“通过联合监督这两种对比条件，REAL 将证据可用性转换为反事实的监督信号。”（[§5.1, Equation 7](https://arxiv.org/abs/2609.08943v1)）

在所报告的 REAL 微调后的 Llama-3.1-8B-Instruct 的域内 FEVER 评估中，表格给出的证据选择精确率/召回率/F1 为 71.64/85.89/78.12，真伪判定准确率为 95.66，并且 FAE IS/ER/IO 为 99.06/99.99/99.69。这些数字是在该特定模型和数据集上的报告结果，而非断言该干预在所有证据情形下都能干净地度量“接地”。（[Table 1](https://arxiv.org/abs/2609.08943v1)）

### 一个可复用的研究操作

对于证据条件化模型，在引用支持存在时先进行一次评估答案，然后重复移除该支持并记录输出是否按预期方向改变。如果不改变，则应把答案准确性视为不足以证明系统使用了其文档。训练可以包含匹配的完整上下文与移除支持的示例，并在移除后给出明确的弃权目标。

### 需要注意的边界

FAE “需要迭代的证据消融和重复的验证器推理”，因此它比单次评估更昂贵。从更根本的角度看，“证据冗余和不完全的注释”可能在黄金证据被移除后仍保留有效支持，使得“完全区分证据支撑的核查与参数化记忆”变得困难。（[Limitations](https://arxiv.org/abs/2609.08943v1)）

阅读此文以借鉴一个具体的反事实协议：移除验证器引用的证据，测量其结论是否改变，并用同一干预生成成对的微调示例。

[Abstract; §4.3; §5.1 Equation (7); Table 1; §7.3; Limitations](https://arxiv.org/abs/2609.08943v1)

本期按 2026-09-10 的候选论文事后编制，核验日期为 2026-09-16。
