# AI Paper Insight Brief
## 2026-05-23

### 0) Executive takeaways (read this first)
- Agent work is shifting from “train the model harder” toward “shape the interface, state, and data around the model”: compiled agent trajectories, privileged process curation, runtime harness adaptation, event-sourced execution, and millisecond checkpoint/rollback all show meaningful gains without changing core model architectures.
- Security evaluation is getting more realistic and more pessimistic. Multiple papers show that static or text-only safety checks miss the real failure modes: domain-camouflaged prompt injection, multi-turn/stateful evasions, artifact-level unsafe edits, benchmark exploitation, and latent KV leakage all remain substantial risks.
- Evaluation methodology itself is now a first-order research topic. Several papers argue that benchmark scores are easy to misread or game: contamination can hide behind CoT, single-threshold metrics can reverse conclusions in forecasting, and security benchmarks can be exploited by the agents they test.
- Long-context and process supervision continue to look like high-leverage capability multipliers. ACC turns agent logs into long-context QA and gets a 30B model near a much larger model on long-range benchmarks; P2T improves SWE Pass@1 while reducing inference cost; Search-E1 extracts dense supervision from the model’s own search rollouts.
- Frontier agent systems are still brittle on authentic workflows. Real-world terminal tasks top out at 62.5% pass rate, finance spreadsheet agents top out at 69.1/100, and scientific forecasting remains weak on feasibility and timing even when models can identify plausible mechanisms.
- A recurring pattern across safety and robustness papers: the most useful interventions are often not where naive diagnosis points. Patching the “most causal” module can hurt, stronger models can forecast worse in tail-risk settings, and more exposed reasoning traces can improve utility while increasing distillation risk.

### 2) Key themes (clusters)

### Theme: Agent training from trajectories and process signals

- **Why it matters**: Several papers replace expensive manual supervision with signals already present in agent runs, patches, or sibling rollouts. The common bet is that better process data—not just more RL—can improve long-horizon reasoning, search quality, and software-agent behavior.
- **Representative papers**:
  - [ACC: Compiling Agent Trajectories for Long-Context Training](https://arxiv.org/abs/2605.21850v1)
  - [From Patches to Trajectories: Privileged Process Supervision for Software-Engineering Agents](https://arxiv.org/abs/2605.21996v1)
  - [Search-E1: Self-Distillation Drives Self-Evolution in Search-Augmented Reasoning](https://arxiv.org/abs/2605.22511v1)
  - [Post-Training is About States, Not Tokens: A State Distribution View of SFT, RL, and On-Policy Distillation](https://arxiv.org/abs/2605.22731v1)
- **Common approach**:
  - Reuse existing trajectories or artifacts as supervision rather than collecting bespoke labels.
  - Move from outcome-only rewards to denser process-level or state-conditioned signals.
  - Filter or restructure trajectories to remove imitation noise, leakage, or masked evidence.
  - Use on-policy or privileged-context supervision to target the states the learner actually visits.
- **Open questions / failure modes**:
  - Dependence on strong teachers or privileged artifacts may limit scalability or introduce bias.
  - Gains are often shown on one base model or one scaffold, leaving transfer uncertain.
  - Process curation can be compute-heavy and may create privacy/copyright concerns when built from logs.
  - Questions remain about how far self-distillation or OPD scales before collapse or diminishing returns.

### Theme: Runtime scaffolds, state management, and auditable agent infrastructure

- **Why it matters**: A strong theme today is that many agent failures are interface and systems failures, not pure model failures. Papers here show that changing the harness, execution log, or sandbox substrate can materially improve reliability, reproducibility, and search depth.
- **Representative papers**:
  - [Adapting the Interface, Not the Model: Runtime Harness Adaptation for Deterministic LLM Agents](https://arxiv.org/abs/2605.22166v1)
  - [The Log is the Agent: Event-Sourced Reactive Graphs for Auditable, Forkable Agentic Systems](https://arxiv.org/abs/2605.21997v1)
  - [DeltaBox: Scaling Stateful AI Agents with Millisecond-Level Sandbox Checkpoint/Rollback](https://arxiv.org/abs/2605.22781v1)
  - [Diagnosis Is Not Prescription: Linguistic Co-Adaptation Explains Patching Hazards in LLM Pipelines](https://arxiv.org/abs/2605.21958v1)
- **Common approach**:
  - Treat execution state, logs, and tool contracts as first-class optimization targets.
  - Add deterministic validation, replay, rollback, or regulation layers around frozen models.
  - Use trajectory analysis to evolve harness rules or diagnose where interventions should occur.
  - Separate slow semantic reasoning from fast runtime enforcement or recovery mechanisms.
- **Open questions / failure modes**:
  - Many results are strongest in deterministic or fixed-topology settings.
  - Better diagnosis does not guarantee the best patch target; co-adaptation can make local fixes harmful.
  - Systems gains often come with deployment complexity: kernel changes, storage overhead, or stricter contracts.
  - Few papers yet show that auditability/replay primitives improve downstream task success, not just observability.

### Theme: Agent security is moving from prompt attacks to stateful, evasive, and protocol-level threats

- **Why it matters**: The threat model is broadening from single-turn jailbreaks to attacks that exploit persistence, artifacts, debate dynamics, OAuth flows, retrieval drift, and latent channels. The practical message is that current guards are often calibrated to the wrong surface.
- **Representative papers**:
  - [Blind Spots in the Guard: How Domain-Camouflaged Injection Attacks Evade Detection in Multi-Agent LLM Systems](https://arxiv.org/abs/2605.22001v1)
  - [Benchmarking Autonomous Agents against Temporal, Spatial, and Semantic Evasions](https://arxiv.org/abs/2605.22321v1)
  - [Boiling the Frog: A Multi-Turn Benchmark for Agentic Safety](https://arxiv.org/abs/2605.22643v1)
  - [A First Measurement Study on Authentication Security in Real-World Remote MCP Servers](https://arxiv.org/abs/2605.22333v1)
- **Common approach**:
  - Evaluate real or realistic agent stacks with persistent state, tools, and multi-turn interactions.
  - Measure artifact-level or action-level harm rather than only text refusals.
  - Stress detectors with semantically adapted or fragmented payloads instead of static templates.
  - Include protocol and infrastructure layers such as OAuth/DCR, not just model outputs.
- **Open questions / failure modes**:
  - Many evaluations are platform-specific, so cross-agent generalization is still unclear.
  - Existing guardrails often provide only marginal gains under advanced evasions.
  - High-confidence false negatives are common, making confidence-based monitoring unreliable.
  - More realistic tools and multimodal channels will likely expose additional attack surfaces.

### Theme: Evaluation is under attack—from contamination, metric choice, and benchmark exploitability

- **Why it matters**: Several papers argue that current evaluation pipelines can systematically overstate capability or safety. The common lesson is that trustworthy measurement now requires adversarially robust protocols, not just bigger benchmark suites.
- **Representative papers**:
  - [The Illusion of Reasoning: Exposing Evasive Data Contamination in LLMs via Zero-CoT Truncation](https://arxiv.org/abs/2605.21856v1)
  - [Measuring Security Without Fooling Ourselves: Why Benchmarking Agents Is Hard](https://arxiv.org/abs/2605.22568v1)
  - [Is Capability a Liability? More Capable Language Models Make Worse Forecasts When It Matters Most](https://arxiv.org/abs/2605.22672v1)
  - [Agentic CLEAR: Automating Multi-Level Evaluation of LLM Agents](https://arxiv.org/abs/2605.22608v1)
- **Common approach**:
  - Probe hidden confounders directly: suppress CoT, use canaries, inspect traces, or switch scoring rules.
  - Compare performance on structurally matched but perturbed references to separate memorization from reasoning.
  - Report multi-level diagnostics rather than a single scalar score.
  - Emphasize distributional or tail-aware evaluation over one-shot averages.
- **Open questions / failure modes**:
  - Black-box enforcement tricks (e.g. zero-CoT prompting) may weaken as models change behavior.
  - LLM-as-judge pipelines add their own variance and bias.
  - Proper scoring rules and dynamic benchmarks are more expensive and harder to standardize.
  - Benchmark hardening itself can become an arms race with adaptive agents.

### Theme: Real-world benchmarks are exposing a large gap between synthetic competence and deployed usefulness

- **Why it matters**: New benchmarks grounded in real terminal sessions, finance spreadsheets, scientific milestones, and conflict contexts show that frontier models still struggle when tasks require durable artifacts, temporal grounding, or domain-sensitive judgment.
- **Representative papers**:
  - [TerminalWorld: Benchmarking Agents on Real-World Terminal Tasks](https://arxiv.org/abs/2605.22535v1)
  - [WorkstreamBench: Evaluating LLM Agents on End-to-End Spreadsheet Tasks in Finance](https://arxiv.org/abs/2605.22664v1)
  - [Forecasting Scientific Progress with Artificial Intelligence](https://arxiv.org/abs/2605.22681v1)
  - [Can AI Make Conflicts Worse? An Alignment Failure in LLM Deployment Across Conflict Contexts](https://arxiv.org/abs/2605.22720v1)
- **Common approach**:
  - Build benchmarks from authentic workflows or temporally grounded events rather than synthetic puzzles.
  - Score artifact quality, timing, or domain-sensitive behavior instead of only final-answer correctness.
  - Compare across models and harnesses to separate model capability from system effects.
  - Use human or expert validation to calibrate LLM judges where exact matching is insufficient.
- **Open questions / failure modes**:
  - Realistic benchmarks are expensive to build and often domain-specific.
  - Human/LLM judging remains noisy for open-ended artifacts.
  - Some benchmark subsets are still small or selectively curated.
  - Transfer from one realistic domain to another remains weak.

### Theme: Privacy and leakage are shifting to harder-to-see channels

- **Why it matters**: Privacy work today spans black-box RDP auditing, latent KV leakage in multi-agent systems, and distillation leakage from rich outputs. The common pattern is that the most important leakage channels are often not the obvious text outputs.
- **Representative papers**:
  - [Optimal Guarantees for Auditing Rényi Differentially Private Machine Learning](https://arxiv.org/abs/2605.21938v1)
  - [LCGuard: Latent Communication Guard for Safe KV Sharing in Multi-Agent Systems](https://arxiv.org/abs/2605.22786v1)
  - [The Distillation Game: Adaptive Attacks & Efficient Defenses](https://arxiv.org/abs/2605.22737v1)
  - [A First Measurement Study on Authentication Security in Real-World Remote MCP Servers](https://arxiv.org/abs/2605.22333v1)
- **Common approach**:
  - Define leakage operationally via reconstructability, divergence estimation, or adaptive student gain.
  - Move beyond passive evaluation to adaptive attackers or worst-case canary settings.
  - Add lightweight defenses at the representation or decoding layer rather than only policy text filters.
  - Pair theory with deployment-facing audits or Internet-scale measurement.
- **Open questions / failure modes**:
  - Many defenses are empirical and lack formal guarantees.
  - Proxy attackers/decoders may underestimate stronger adversaries.
  - Practical deployment depends on infrastructure support and protocol compliance, not just model-side fixes.
  - Privacy-utility tradeoffs remain steep in several settings.

### 3) Technical synthesis
- A large fraction of papers replace end-to-end optimization with structured intermediate objects: compiled contexts (ACC), process graphs (P2T), typed forecasts (Steins;Gate Drive), event logs (ActiveGraph), and sanitized KV transforms (LCGuard). The trend is toward making hidden agent state explicit and controllable.
- Several methods improve performance by changing the supervision target rather than the base model: ACC supervises evidence tokens directly, P2T scores per-step groundedness/progress, Search-E1 distills from privileged sibling trajectories, and OPD/RL are framed as changing the state distribution being updated.
- Security papers increasingly evaluate at the artifact/action layer instead of the response layer: unsafe file predicates in Boiling the Frog, RTR on real OpenClaw executions in A3S-Bench, and OAuth lifecycle flaws in MCP servers.
- Multiple papers show that static detectors fail under semantic adaptation: ZCP for contamination, domain-camouflaged injection, and adaptive distillation evaluation all exploit the gap between surface cues and latent capability/leakage.
- Runtime control is becoming layered: LIFE-HARNESS splits contract/skill/action/trajectory regulation; Pre-VLA adds a verifier before action execution; Steins;Gate Drive separates slow strategic selection from fast predicate-based invalidation.
- Several works use exact or principled optimization in places where heuristics are common: RADAR uses exact Min-Cut for context selection, the RDP auditor gives finite-sample confidence bounds with minimax lower bounds, and the distillation paper derives exponential-tilt best responses.
- Realistic evaluation papers repeatedly find weak transfer from standard benchmarks: TerminalWorld correlates weakly with Terminal-Bench (r = 0.20), forecasting conclusions flip under CRPS vs Brier, and scientific forecasting remains poor even when mechanistic MCQ performance is strong.
- There is a recurring “bigger/stronger is not always safer or better” pattern: more capable models can forecast worse in tail-risk regimes, patching the highest-blame module can hurt, and richer outputs can increase distillation leakage.
- Systems papers are increasingly optimized for branching search workloads: DeltaBox’s millisecond checkpoint/restore and ActiveGraph’s cheap forks both target the same bottleneck—reusing shared prefixes without replaying expensive model/tool calls.
- Many papers rely on LLM judges, but the stronger ones either validate them against humans (WorkstreamBench, Agentic CLEAR) or constrain them with exact artifact checks and formal predicates (Boiling the Frog, RADAR, RDP auditing).

### 4) Top 5 papers (with “why now”)

#### [ACC: Compiling Agent Trajectories for Long-Context Training](https://arxiv.org/abs/2605.21850v1)
- Turns answer-verified agent logs into long-context QA examples, directly supervising integration over distant evidence rather than masking tool outputs.
- Delivers large long-context gains on Qwen3-30B-A3B: MRCR 68.28 (+18.09) and GraphWalks 77.51 (+7.59), with performance comparable to Qwen3-235B-A22B on those benchmarks.
- Useful now because many teams already have abundant agent traces but lack high-quality long-context training corpora.
- Suggests a practical path to improve smaller models’ long-range reasoning without architecture changes or RL-heavy pipelines.
- **Skeptical take**: Evidence is from one base model and three agent types, with teacher-rationale dependence and low rationale pass rates for SWE trajectories.

#### [RADAR: Defending RAG Dynamically against Retrieval Corruption](https://arxiv.org/abs/2605.22041v1)
- Recasts dynamic RAG defense as exact graph-cut selection over atomic answers, with a Bayesian memory node to balance stability against adaptation.
- Shows strong robustness in both static and dynamic settings, including 75.0% accuracy with 5.0% ASR on one static PIA setting and 63.60% accuracy / 17.85% ASR in cumulative dynamic evaluation.
- Useful now because live-web RAG is increasingly the default, and most defenses are still designed for static corpora.
- The memory-node design is especially relevant for production systems that cannot store full historical documents.
- **Skeptical take**: Runtime and dense-graph costs may become significant at larger retrieval depths, and the method assumes benign evidence forms the dominant coherent cluster.

#### [TerminalWorld: Benchmarking Agents on Real-World Terminal Tasks](https://arxiv.org/abs/2605.22535v1)
- Builds 1,530 validated terminal tasks from 80,870 real asciinema recordings, with a 200-task manually reviewed VERIFIED subset.
- Shows frontier agents still struggle on authentic CLI workflows; best VERIFIED pass rate is 62.5%, and transfer from Terminal-Bench is weak (Pearson r = 0.20).
- Useful now because terminal agents are being deployed into real developer workflows, and synthetic puzzle benchmarks appear to overstate readiness.
- The benchmark’s command diversity is a major asset: 1,280 unique commands, 91% absent from Terminal-Bench.
- **Skeptical take**: The pipeline excludes TUI/GUI workflows and irreproducible environments, so some important real-world complexity is still missing.

#### [Benchmarking Autonomous Agents against Temporal, Spatial, and Semantic Evasions](https://arxiv.org/abs/2605.22321v1)
- Introduces A3S-Bench, a 2,254-trajectory benchmark for stateful agent attacks spanning temporal fragmentation, artifact-mediated evasion, and benign-context concealment.
- Finds advanced evasions raise average RTR@1 from 28.3% to 52.6% across 10 backbones, with multi-turn injection much stronger than single-turn.
- Useful now because agent security discussions are still too focused on single-turn prompt injection, while deployed agents have persistent state and system privileges.
- Includes defense tests showing current guardrails and platform upgrades offer only limited mitigation.
- **Skeptical take**: Main evaluation is on OpenClaw, so platform-specific design choices may influence the absolute vulnerability profile.

#### [A First Measurement Study on Authentication Security in Real-World Remote MCP Servers](https://arxiv.org/abs/2605.22333v1)
- Provides the first Internet-scale measurement of remote MCP authentication, validating 7,973 live servers and finding 40.55% expose tools without authentication.
- On a tested DCR-enabled subset of 119 servers, finds 325 confirmed flaw instances; every tested server had at least one flaw, and responsible disclosure yielded 9 CVEs.
- Useful now because MCP adoption is accelerating faster than its security hygiene, and protocol-layer weaknesses can lead to account takeover regardless of model quality.
- Particularly decision-relevant for teams deploying remote MCP with OAuth, DCR, or delegated authorization.
- **Skeptical take**: Coverage is limited to publicly discoverable assets and a manually verified subset, so enterprise/private deployments may differ.

### 5) Practical next steps
- Treat agent logs as a strategic asset: pilot ACC-style compilation for long-context training and measure whether direct evidence-token supervision improves your own retrieval/tool traces.
- If you train SWE or tool agents, add per-step groundedness and trajectory-efficiency filters; compare outcome-filtered SFT against P2T-style curated trajectories on both success rate and inference cost.
- Audit your evaluation stack for hidden confounders: run contamination checks with zero-CoT-style probes, add canaries to security benchmarks, and report tail-aware metrics where applicable.
- Red-team prompt-injection defenses with semantically camouflaged payloads and multi-turn fragmentation, not just explicit override strings.
- For production agents in deterministic environments, test harness-side interventions before retraining: action canonicalization, trajectory regulation, skill retrieval, and contract updates may yield faster wins.
- If your agents branch or search over stateful environments, benchmark checkpoint/rollback overhead explicitly; DeltaBox-style fast C/R or event-log forking can materially change feasible search depth.
- Move safety scoring closer to artifact/state changes: define unsafe predicates over files, configs, or tool actions rather than relying on refusal text alone.
- For multi-agent systems sharing latent state, evaluate reconstructability of shared KV artifacts and consider representation-level sanitization if latent communication is used.
- If you deploy RAG over dynamic sources, test stability/plasticity tradeoffs under evolving corruption; exact consistency selection plus lightweight memory may outperform static filters.
- Add multi-level observability: combine trace-level judges, node-level clustering, and replayable logs so failures can be localized and compared across harness/model variants.

---
*Generated from per-paper analyses; no external browsing.*
