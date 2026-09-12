# 2026-09-02

## Controlled horizon sweeps find geometric agent-success decay in 28 of 36 model-task cells

*[How Fast Do Agents Rot? An Empirical Study of Long-Horizon Degradation in LLM Agents for Production Decision-Making](https://arxiv.org/abs/2609.01660v1)*

Benchmark performance alone is not the quantity this paper recommends using to set an agent’s achievable workflow horizon. The authors instead advise measuring per-step reliability on the relevant task and budgeting conservatively below a geometric estimate, because the measured hazard can accelerate rather than remain flat (Section 4.7).

The study isolates dependent-step count in four synthetic task families—Ledger, Refchain, Cipher, and the ToolQA tool-use loop—chosen for oracle verification. It evaluates nine instruction-tuned models across five horizons and three context regimes, with 10,664 analyzed trajectories. To characterize the shape of degradation rather than report one aggregate score, the authors use AIC to choose among geometric, threshold, and linear success-versus-horizon forms for each model-task cell (Section 4.1).

The main result is conditional but concrete: the geometric form wins in 28 of 36 tested cells. Under that description, an agent’s end-to-end success compounds multiplicatively across dependent steps through a per-step reliability parameter. The agentic ToolQA result makes the operational consequence visible: by horizon 16, every tested model had fallen to a small fraction of its starting performance. This finding is not a measurement of longer ToolQA chains, however: the API budget ended before the longest condition, so the reported horizon-16 collapse is a lower bound on severity at longer horizons.

The context ablation sharpens the diagnosis for the tested streaming families. Holding task instances paired across regimes, bounding the context window steepened the decay slope rather than easing it: the pooled logit slope per horizon doubling was -0.69 in the compressed regime versus -0.44 in the natural regime, with *p* = 3×10⁻⁶. Thus, in these synthetic multi-step settings, simply pruning history is not evidence-based as a remedy for horizon degradation. The authors also report that unparseable format or tool-call outputs affected 21% of trajectories and increased with horizon, so interface validity is a measurable component to track alongside final success.

A transferable research operation is to build an oracle-verified horizon sweep for one agent workflow: vary the number of dependent steps independently of retained-context length, run paired natural/compressed/padded conditions, fit competing decay forms, and record both task success and invalid-action rates. The resulting question is practical: **what per-step reliability is required for the intended horizon, and does a proposed memory intervention improve that parameter rather than only a short-horizon pass rate?** The paper does not establish a universal law: its task families are synthetic, its sample contains nine models, and decoding sensitivity was not tested beyond a fixed moderate temperature.

Learn a compact experimental design for separating dependent-step failure from raw context-length effects, then turn its fitted per-step reliability into a testable deployment metric.

[Sections 4.1–4.7 and Section 5 (pages 6–9)](https://arxiv.org/abs/2609.01660v1)

## World-model beliefs improve LLM-agent task performance under partial observability

*[Towards a Belief-Based World Model for LLM Agents](https://arxiv.org/abs/2609.00455v1)*

The paper targets a specific gap in simulation-based agent design. During inference, agents can use a world model to simulate candidate actions before acting, but the authors argue that this interface is incomplete under partial observability because simulation does not adequately represent uncertainty about the current state. The relevant question is therefore not only whether an agent can forecast an action’s consequence, but whether it can inspect what the world model knows—and what remains uncertain—before selecting that action.

The proposed Belief-Based World Model (BB-WM) adds that interface. In the authors’ description, BB-WMs “model and maintain a belief” that an LLM can query for information about known and uncertain aspects of the current state. This belief access is designed to sit alongside, rather than replace, action-conditioned simulation. The paper asks the focused empirical question of whether directly exposing a world model’s belief to an LLM policy improves decision-making.

The reported evidence is an interface ablation across ALFWorld and ScienceWorld. For ALFWorld, the authors summarize Table 1 as: “BB-WM improves over the base agent in terms of efficiency and performance.” For ScienceWorld, Table 2 gives the same conclusion for Llama and Qwen: “BB-WM improves over the base agent in terms of efficiency and performance for Llama and Qwen.” The paper’s broader interpretation is that access to world-model beliefs improves task performance under partial observability while remaining complementary to simulation-based world models. This is evidence for the combined interface in the reported benchmark settings, not evidence that a complete learned world model has been obtained.

A useful experimental operation follows directly: treat belief exposure and simulation exposure as separate factors. Compare a base policy, belief-only access, simulation-only access, and their combination; then inspect whether gains come from avoiding invalid actions, resolving state uncertainty, or both. Also vary the quality of belief updates, because the paper’s simulation component has a material boundary: “WALL-E is an incomplete next-state predictor.” Finally, keep model capability in the analysis: the authors report that “Sonnet saturates both benchmarks,” so these results leave limited headroom for measuring interface gains with that model on these tasks.

For a researcher, the transferable idea is to evaluate a world model as an inspectable state-uncertainty service, not solely as a rollout engine.

Read this for a clean belief-only versus simulation-only versus combined-interface question that can be reused when evaluating partially observable LLM agents.

[Abstract; S5.T1 (Table 1); S5.T2 (Table 2); S4.SS1.p6; S5.SS3.p2](https://arxiv.org/abs/2609.00455v1)

## The most effective pathway depends strongly on the task structure

*[S3Gym: Can LLMs Turn Self-Testing and Self-Judging into Self-Improvement?](https://arxiv.org/abs/2608.31100v1)*

Existing agent benchmarks largely evaluate LLM agents as fixed policies. This leaves open whether an agent can actively test its behavior, judge the resulting experience, and use that experience to improve later decisions.

S3Gym changes the evaluation protocol rather than assuming that accumulated interaction is itself improvement. “S3Gym separates permissive exploration from strict held-out evaluation and instantiates this protocol in seven text-based games with executable environment verifiers.” During exploration, verifier-computed immediate rewards are withheld from the agent while its self-judgments are recorded; evaluation then uses stricter, disjoint seeds. The authors compare three ways of incorporating the judged interactions: direct History ICL, score-conditioned Summary Memory, and parameter Training.

The central result is conditional rather than a ranking of one mechanism. The paper reports that “summaries are beneficial when experience can be compressed into reusable strategic rules, yet often underperform raw history when success depends on precise, state-contingent information.” Parameter training also “produces substantial gains on some tasks, but also exhibits unstable improvement and severe negative transfer on others.” In the Qwen3-8B fine-tuning study, “Training yields substantial self-improvement on Trust Evolution. The score rises from 0 to a maximum of 30 and remains above the initial baseline at 18 of the 19 updated checkpoints.” Under the same study conditions, Plants-vs-Zombies showed the opposite pattern: “The initial score is 23, whereas every updated checkpoint obtains a score of 6.” These are per-task observations from strict-mode evaluation, not evidence that parameter updates reliably improve an agent across games.

The authors place a direct boundary on memory compression: “Summary Memory is therefore a selective improvement mechanism: it is effective when experience admits compact causal abstractions, but it cannot universally replace direct access to state-rich interaction histories.” Self-judging is also not uniformly reliable; Chess and Trust are identified as clear failure cases.

### Research operation
For a follow-up, keep exploration and evaluation seeds separate; log both an agent’s self-scores and hidden verifier outcomes; then compare raw trajectories against summaries at the same interaction budget. The concrete question is whether successful actions require a reusable strategic rule or precise state-contingent information at decision time. This is an editorial experiment design suggested by the reported task dependence, not a demonstrated universal recipe.

Read this to design an agent-improvement experiment that distinguishes genuine held-out gains from apparent learning during exploration, and to test whether compressing interaction traces removes state information required for control.

[Abstract; §4.2; §6.1; §6.2; §6.3](https://arxiv.org/pdf/2608.31100v1)

## An External Authorization Broker Blocks Four Studied Delegation Threats in a Controlled Harness

*[Delegation Without Trust: An Empirical Gap Analysis of Identity, Authorization, and Runtime Governance in Multi-Agent LLM Systems](https://arxiv.org/abs/2609.00267v1)*

Multi-agent delegation becomes a security boundary when an agent can pass credentials to another agent. This paper evaluates that boundary under an explicit untrusted-model assumption: a fully prompt-injected agent must not exceed authority explicitly delegated to it. The concrete prior limitation is a runtime that gives the primary agent one broad bearer credential, passes it unchanged to sub-agents and tools, and lets the model decide authorization. In the authors’ test, “a hijacked agent succeeds at all four” studied attacks—confused deputy, replay, privilege escalation, and over-broad sub-agent—because the runtime provides none of R1–R8.

The method changes the enforcement point rather than trying to make model reasoning more reliable. The paper derives eight requirements from four adversaries, then implements an authorization broker. Its governing rule is: “Authorization decisions are made by infrastructure PEPs, never by the untrusted model.” The broker composes sender-constrained, attenuated, short-lived delegation tokens with external verification, intending to let each delegation hop narrow authority. The authors frame this as a composition gap: “no single standard covers the requirement set,” with provenance, attenuation, sender-constraining, rotation, and model-independent enforcement distributed across different primitives.

In the controlled harness, the authors report that the broker blocks all four studied threats, resists 11 direct design attacks, accepts 0 of 200,000 forged tokens, and confines a compromised sub-agent to a mean of 1.5 reachable actions versus all 8,100 under bearer delegation across 2,000 randomized scenarios. The reported enforcement cost is about 2.6 microseconds per decision. These results are bounded evidence for the broker design under the paper’s stated adversaries and harness; they do not establish that every framework or deployment will behave identically.

A useful research operation is to reproduce the comparison as an authority-budget experiment: keep the task and adversarial outputs fixed, then measure reachable actions under broad bearer delegation and under sender-bound, attenuated tokens. Record replay, escalation, and cross-agent reachability separately rather than collapsing them into one attack-success rate. The paper’s explicit boundary matters for interpreting that experiment: the broker “do[es] not yet integrate it into the evaluated frameworks,” and live-model end-to-end evaluation is future work. Thus, framework integration and model-in-the-loop testing remain the next validation step, not an established result.

Read this to turn prompt-injection risk into a reproducible authority-budget experiment, while keeping the broker’s controlled-harness results separate from its not-yet-tested framework integration.

[Abstract; S4.I1.ix8.p1; S4.p3; S5.SS1.p1; S6.p2; S10.p1](https://arxiv.org/abs/2609.00267v1)

## A Shared Irreversibility Budget Prevents Simulated Fleet-Level Overdraws

*[The Irreversibility Budget: Fleet-Level Risk Accounting and Admission Control for Agent Operating Systems](https://arxiv.org/abs/2609.00275v1)*

## The missed unit of control

Local authorization can be correct for each purchase and still fail for the tenant that owns a fleet. In the authors’ controlled procurement simulation, under the stated charge model, local gates approved every purchase but overdrew the tenant tolerance in all 300 seeded runs; the budget produced no overdraws. [arxiv:2609.00275v1, §5.1] The main configuration used 50 agents over a 1,000-tick window, a $250k tolerance, $50k per-agent call caps, and charges of \(c_&#123;0.95&#125;(e)=0.52\cdot v\). [arxiv:2609.00275v1, §5.1]

## Change the accounting boundary

The proposed control treats irreversibility as a cumulative per-principal account: a trusted runtime charges each effect’s residual loss and denies the marginal effect that would overdraw the budget. [arxiv:2609.00275v1, Abstract] In the evaluated design, the runtime reserves charges atomically across an agent→workflow→tenant ledger path; this makes the tenant budget, rather than an individual call cap, the admission boundary. [arxiv:2609.00275v1, §5.1]

The scale sweep is the decisive result. With fixed tolerance and the same charge model, local gates were safe at ten agents but reached 2.4× tolerance at 50 agents, 9.7× at 200, and 48× at 1,000; the budget stayed near 0.48× at every tested size. [arxiv:2609.00275v1, §5.2] The authors also report trace analysis of 38,452 trajectories from τ-bench and AgentDojo: external effects were 22% of tool calls, task-determined effects had z values up to 198 against an independent-agent null, and one planted instruction propagated the same external effect across 84% of a heterogeneous fleet on average, with a 48% minimum. [arxiv:2609.00275v1, §5.5] These are evidence for testing cumulative controls against cross-agent correlation, not only against per-agent bursts.

A single-host, in-memory ledger microbenchmark reported 2.6 μs median reserve-then-confirm latency, 240 bytes per live reservation, and a few ×10^5 reservation cycles per second at a shared tenant root with 32 threads. [arxiv:2609.00275v1, §5, Ledger overhead]

## What remains unproven

Those performance measurements do not assess persistence, replication, or crash recovery. More fundamentally, the ledger bounds declared charge units only under authenticated principals, strongly consistent authorities, idempotent reservation lifecycles, and trusted effect specifications; it does not bound realized loss under stale prices, unmodelled correlations, malicious declarations, or misattributed workflows. [arxiv:2609.00275v1, §4] The study is a feasibility evaluation rather than a deployed system, and dependency-aware pricing, early shared-trigger detection, and cross-host coordination remain unresolved. [arxiv:2609.00275v1, §6]

**Research operation:** evaluate a proposed agent control by measuring local approval and shared-principal overdraw under correlated triggers, then stress the result with charge miscalibration, delayed dependency detection, cancellation/refund paths, and distributed double-spending scenarios.

Read §5.1–§5.2 to study a concrete experiment in which individually compliant agent actions exceed a shared risk limit, then use §4 and §6 to identify the pricing and coordination assumptions your own admission controller would need to test.

[Abstract; §4 (The Runtime); §5.1 (Composition, RQ1); §5.2 (Scale and alternatives, RQ2); §5.5 (Trace evidence, RQ5); §6 (Discussion and Limitations)](https://arxiv.org/abs/2609.00275v1)

Prepared retrospectively from the 2026-09-02 candidate papers; verified on 2026-09-12.
