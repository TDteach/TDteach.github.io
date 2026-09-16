# 2026-09-10

## Event-CST Improves Meta-FSA Length Extrapolation from 1k Training to 128k

*[Learning Length-Extrapolatable Recurrent Models](https://arxiv.org/abs/2609.09157v1)*

Recurrent models provide a natural route to long-context modeling, but BPTT-trained models can fail when inference exceeds the training horizon. The paper’s diagnosis is that gradient-norm decay alone does not determine learnability: the task must also require distant losses to credit earlier recurrent states.

CST changes only the backward pass: at exposed chunk boundaries in segmented BPTT, it multiplies an incoming state-credit vector by a positive scalar gain to stabilize its norm without rotating the corrected component, while leaving the forward computation unchanged. The paper specializes the controller to the setting: Event-CST for controlled synthetic tasks and symmetric head-wise CST for real text. A useful replication operation follows directly: log state-credit norms and directional alignment at boundaries, then test whether the failure is missing directional credit or merely weak magnitude before modifying the forward recurrence.

On Meta-FSA, Event-CST outperformed BPTT in all 16 aggregate evaluations at 16k–128k, by 6.58 percentage points on average; this was a three-seed experiment with training at physical length 1k. On MQAR, mean accuracy over 2k–128k increased from 74.95% to 80.61%, while accuracy at 128k increased from 25.56% to 41.66%. These results give the backward intervention a concrete length-extrapolation test rather than making gradient statistics the only diagnostic.

For a 123.30M recurrent language model trained at 4K, symmetric head-wise CST improved all-token NLL at all 14 evaluated dataset–length settings, with an average gain of about 0.00724 NLL. At the longest annotated contexts, key-token gains were several times larger than full-token gains, including 3.50× on LongData 32K and 4.54× on GovReport 32K. However, CST controls only the scale of selected boundary signals: it cannot recover missing directions or remove temporal interference, and its modified backward signal is not the exact gradient of the original objective. The paper’s language-model evidence comes from one 123M-parameter model, with the CST configuration selected on the reported evaluation suite and one training run per method. Treat the controller as a focused ablation target, not a general fix for recurrence.

Read this to learn a diagnostic-and-intervention procedure: first test whether a task needs boundary-crossing credit, then test whether that signal arrives with usable scale before changing the forward model.

[abstract1.1; S1.p3.2; S4.SS0.SSS0.Px1.p1; S5.SS2.SSS0.Px1.p1; S5.SS3.p4; S6.SS4.SSS0.Px1.p1; S6.SS4.SSS0.Px2.p1; S8.SS0.SSS0.Px1.p1.1; S8.SS0.SSS0.Px1.p1.2](https://arxiv.org/abs/2609.09157v1)

## Coupled weight decay yields an exact effective-stepsize recurrence in scale-invariant blocks

*[When Does Scale-Invariant Optimization Become Unstable? An Exact Schedule Law with Weight Decay](https://arxiv.org/abs/2609.09116v1)*

Training a scale-invariant parameter block can conceal the variable that actually sets its directional update: the nominal learning rate is divided by the evolving parameter norm. This paper makes that feedback discrete and explicit for SGD with **coupled** weight decay. For a block whose loss satisfies \(L(\alpha w)=L(w)\), the authors define \(\Phi_t=\eta_t/(a_t r_t^2)\), where \(a_t=1-\eta_t\lambda_t&gt;0\). They derive

\[
\Phi_&#123;t+1&#125;=\frac&#123;B_t\Phi_t&#125;&#123;1+\Phi_t^2\|\bar g_t\|^2&#125;,
\]

with \(B_t=(\eta_&#123;t+1&#125;/\eta_t)/(a_ta_&#123;t+1&#125;)\). Thus, \(B_t\) is the schedule-and-decay forcing term, while the denominator suppresses the next effective directional stepsize as the current step and scale-free gradient grow. In the stochastic version, the conditional log-drift is \(\beta_t-q_t\), separating predictable forcing from the expected geometric correction.

The decisive dynamical test is a normalized linear regression model with isotropic covariance and a constant schedule. Its high-dimensional updates reduce to a two-dimensional map in alignment and \(\Phi\). The unique interior balance point is on the recurrence's switching surface, and the authors prove that it is an unstable spiral source when coupled decay is present. This does **not** establish recurrent behavior or instability for arbitrary neural networks: the paper explicitly does not prove global convergence to a limit cycle or extend that characterization to anisotropic covariance or general deep networks.

The proposed transfer is operational rather than merely diagnostic: when a normalized block satisfies the theorem's assumptions, log \(\Phi\) can be tracked as a state variable and \(B_t\) as its schedule control. The authors report that synthesizing schedules to enforce constant \(B_t\) produced a sharply peaked CIFAR-10 accuracy curve whose maximum was at \(B=1\); the underlying plotted curves and seed-level variation were not inspected in the supplied evidence. A useful follow-up experiment is therefore to impose several target \(B\) values while logging per-block \(\Phi\), norms, and validation outcomes, then test whether the predicted boundary transfers across blocks.

Scope is unusually consequential here. The one-scalar identity requires strict block-scale invariance and the multiplicative shrinkage of coupled weight decay; decoupled decay breaks this structure. The homogeneous-optimizer extension also makes the Adam statement conditional: its exact \(\nu=0\) law is an \(\varepsilon\to0\) result, while finite \(\varepsilon\) perturbs scale invariance.

Read this to turn learning-rate schedules and coupled weight decay into a measurable per-block control problem, while keeping the theorem’s strict invariance and optimizer assumptions in view.

[Section 2.1, Theorem 2.1, Eq. (6); Section 2.2, Theorem 2.3, Eqs. (10), (11), (13); Section 3.1, Theorem 3.4; Proposition 3.6; Section 5.1–5.3, Target-B intervention; Appendix F, Section A6 (Limitations and Open directions); Section 4.2, Theorem 4.3; Appendix F discussion](https://arxiv.org/abs/2609.09116v1)

## One-step AVI learned more accurate values than AlphaZero on the paper’s solved games

*[The Surprising Effectiveness of Approximate Value Iteration in Self-Play](https://arxiv.org/abs/2609.09094v1)*

### What changes

Popular self-play methods based on Monte Carlo Tree Search (MCTS) can carry substantial computational overhead. This paper tests a narrower alternative: Approximate Value Iteration (AVI) trains a neural value function from one-step backups rather than making MCTS the central training procedure. [1]

AVI alternates ε-greedy self-play data collection with supervised MSE regression on one-step negamax targets. The reported implementation also uses a replay buffer and a target-network snapshot during collection. In the paper’s two-player setup, the target evaluates an action through its immediate reward and the next state’s value from the opposing player’s perspective. This is a deliberately minimal value-learning pipeline: its deployed policy can simply choose the action with the best one-step lookahead according to the learned value. [1]

### Evidence and its scope

The strongest comparison uses ground-truth oracles on Connect Four, Hex(7x7), and synthetic F-Games. Under the reported protocol, the authors report that AVI learned substantially more accurate value functions than their AlphaZero baseline on these solved games. They also report that AVI’s greedy one-step-lookahead policies were competitive with MCTS-based policies under their forward-equivalent neural-network compute proxy. [1]

A useful diagnostic goes beyond comparing final agents. With AlphaZero’s MCTS policy prior held fixed, replacing AlphaZero’s leaf value with AVI’s value reduced error rates across the tested MCTS-budget range in Connect Four and Hex(7x7). This supports the narrower interpretation that, in those experiments, AVI supplied better leaf evaluations; it does not show that every part of an AVI agent is better than every part of an AlphaZero agent. [1]

The larger-game evidence is less decisive. The authors report stable AVI training and useful cross-inference results in Othello and Go(9x9), but those experiments are benchmarked only against a fixed MiniZero baseline and cannot establish distance to optimal play. The compute comparison is also not a wall-clock claim: its proxy excludes elapsed-time interpretation. Finally, the authors note that ε-greedy self-play may miss sparse strategies. [1]

### A research operation to reuse

When evaluating an alternative value-learning target, separate *value quality* from *search-policy quality*. Where an oracle is available, measure value error and policy regret separately. Then run cross-inference: hold an MCTS policy prior and search budget fixed, swap only the leaf value, and test whether the search outcome changes. This isolates a value function’s contribution without treating end-to-end playing strength as the only diagnostic.

[1]: https://arxiv.org/abs/2609.09094v1

Learn a concrete cross-inference experiment for testing whether a value function improves search when the MCTS policy prior and budget are held fixed.

[Abstract; S5.SS1–S5.SS3; S6.p4–p5](https://arxiv.org/abs/2609.09094v1)

## On SWE-bench Verified, test quality determines whether feedback helps

*[ExecCritic: Learn to Test, Test to Improve for Coding Agents](https://arxiv.org/abs/2609.09133v1)*

Execution feedback is not automatically reliable supervision for a coding agent. The authors identify a concrete failure mode: generated tests can encode incomplete or incorrect behavioral targets, and a trajectory that writes both the test and the patch can make mutually consistent mistakes and therefore create false confidence. [Source](https://arxiv.org/abs/2609.09133v1)

ExecCritic changes the workflow by assigning testing and repair to separate agents. Its Test agent independently produces repository-native tests; a fail-closed harness qualifies and freezes the admitted test bundle; then the Repair agent changes source code from execution feedback while being unable to modify those tests. Both roles use Qwen-3.5-35B-A3B and are trained separately. In *Learn to Test*, the Test agent is trained to produce behaviorally valid tests that distinguish correct from incorrect patches. In *Test to Improve*, the Repair agent is trained for both direct resolution and feedback-guided revision. [Source](https://arxiv.org/abs/2609.09133v1)

The decisive experiment holds the base Repair agent fixed on SWE-bench Verified and varies the source of tests. Relative to a 61.2% no-test resolved-rate baseline, tests from the base Test agent reduce resolution to 57.3%, while tests from GPT-5.6-sol raise it to 65.3%. This condition makes the paper’s central judgment appropriately narrow: execution feedback helped or hurt here according to the quality of the supplied tests, rather than simply according to whether a repair loop executed tests. [Source](https://arxiv.org/abs/2609.09133v1)

Role-specific post-training improved the Qwen Test agent’s Base-to-Gold success from 22.2% to 62.2%. When the two post-trained Qwen agents were composed, the reported SWE-bench Verified rate was 72.6%, an 11.4-point gain over the original no-test baseline; the authors state that evaluation used neither stronger-model nor Oracle feedback. [Source](https://arxiv.org/abs/2609.09133v1)

A transferable follow-up is to fix a Repair policy, test it with no feedback and with test bundles of measured quality, and report repair outcomes conditional on that quality. The admission protocol is not a semantic oracle: artifact validity, declared-node binding, and a clean Base failure do not prove issue alignment. Moreover, the framework trains Test and Repair as separate policies and composes them only after training. Those boundaries leave open whether jointly optimized roles, or stronger semantic test validation, would change the observed relationship between test quality and repair value. [Source](https://arxiv.org/abs/2609.09133v1)

Read this to extract a controlled experiment for testing whether execution feedback improves repair only when independently generated tests are sufficiently reliable.

[Abstract; Section 3.1; Section 7](https://arxiv.org/abs/2609.09133v1)

## REAL Converts Evidence Availability into a Counterfactual Supervision Signal

*[Evaluating and Improving Evidence-Grounded Fact-Checking in LLMs via Multi-Round Evidence Ablation](https://arxiv.org/abs/2609.08943v1)*

### What the paper tests

A fact-checker can return the right verdict while using information other than the documents supplied at inference time. This paper asks whether LLM verifiers revise their verdicts when their cited evidence is removed, rather than treating accuracy or citation production as sufficient evidence of grounding. It introduces Fact-Ablated Evaluation (FAE), which “iteratively ablates the cited evidence to assess whether LLMs revise their predictions accordingly.” ([Abstract](https://arxiv.org/abs/2609.08943v1))

The concrete diagnostic is behavioral: remove selected evidence over multiple rounds and observe the verifier’s prediction trajectory. The authors define Immediate Sensitivity as a measure of “the immediate response of a verifier’s predictions to evidence ablation.” Their interpretation is that this exposes a property distinct from ordinary fact-checking scores: “Evidence Ablation is the primary driver of evidence-grounded behaviour, revealing a clear disconnect between veracity prediction accuracy and evidence dependency.” ([§4.3; §7.3](https://arxiv.org/abs/2609.08943v1))

### The training change

REAL changes fine-tuning by pairing a full-evidence condition with an ablated-evidence condition. In the latter, the intended output is *not enough information* (NEI) with no evidence, so the training signal requires the verifier to respond differently when support disappears. As the authors put it, “By jointly supervising these two contrasting conditions, REAL converts evidence availability into a counterfactual supervision signal.” ([§5.1, Equation 7](https://arxiv.org/abs/2609.08943v1))

For the reported in-domain FEVER evaluation of REAL-trained Llama-3.1-8B-Instruct, the table gives evidence-selection precision/recall/F1 of 71.64/85.89/78.12, veracity accuracy of 95.66, and FAE IS/ER/IO of 99.06/99.99/99.69. These numbers are reported for that particular model and dataset, not as a claim that the intervention cleanly measures grounding in every evidence setting. ([Table 1](https://arxiv.org/abs/2609.08943v1))

### A reusable research operation

For an evidence-conditioned model, evaluate the answer once with the cited support present, then repeatedly remove that support and record whether the output changes in the expected direction. If it does not, treat answer accuracy as insufficient evidence that the system used its documents. Training can then include matched full-context and removed-support examples, with an explicit abstention target after removal.

### Boundary to keep nearby

FAE “requires iterative evidence ablation and repeated verifier inference,” so it is more expensive than single-pass evaluation. More fundamentally, “evidence redundancy and incomplete annotations” can leave valid support after gold evidence is removed, making it difficult “to perfectly separate evidence-grounded verification from parametric recall.” ([Limitations](https://arxiv.org/abs/2609.08943v1))

Read this to borrow a concrete counterfactual protocol: remove the evidence a verifier cites, measure whether its verdict changes, and use the same intervention to create paired fine-tuning examples.

[Abstract; §4.3; §5.1 Equation (7); Table 1; §7.3; Limitations](https://arxiv.org/abs/2609.08943v1)

Prepared retrospectively from the 2026-09-10 candidate papers; verified on 2026-09-16.
