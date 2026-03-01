# AI Paper Insight Brief
## 2026-03-02

### 0) Executive takeaways (read this first)
- **Agent safety is shifting “down the stack”**: multiple papers show that *systems architecture* (edge IoT deployment, event-sourced orchestration, KV-cache/memory management) can dominate risk and reliability, often bypassing prompt/model-level defenses.
- **Inference-time, model-agnostic safety is getting sharper**: retrieval-grounded policy adjudication (CourtGuard) and counterfactual causal diagnostics for indirect prompt injection (AgentSentry) both report strong results without weight updates—at the cost of extra inference.
- **RL for agents is moving from sparse outcome rewards to structured process signals**: path-centric reward shaping for agentic RAG (Search-P1) and difficulty-aware entropy/length control for reasoning compression (CEEH) target stability and sample efficiency failures in GRPO-style training.
- **Evaluation is becoming more “operational”**: new benchmarks/harnesses emphasize reproducibility and decomposition (MobilityBench API replay; AuditBench for hidden behaviors; AMA-Bench for agent memory; General Agent Evaluation’s Unified Protocol), plus work quantifying evaluator noise (IRT rater effects; physician disagreement decomposition).
- **Compute efficiency for long-horizon agents is now a first-class research axis**: semantic KV eviction (SideQuest) and hardware-aware KV quantization (InnerQ) report large throughput/latency gains with limited accuracy loss, directly enabling longer agent horizons under fixed budgets.
- **Dual-use risk is being measured in humans, not just models**: a long-form uplift study finds LLM access makes novices substantially more accurate on biosecurity-relevant in silico tasks (OR 4.16), and most users report no difficulty with safeguards.

### 2) Key themes (clusters)

### Theme: Systems-level agent security & governance (beyond prompts)

- **Why it matters**: Tool-using agents expand trust boundaries; deployment choices (edge vs cloud, orchestration/auditing transport, immutable logs) can create bypasses and blind spots even if the model is “aligned.”
- **Representative papers**:
  - [Systems-Level Attack Surface of Edge Agent Deployments on IoT](https://arxiv.org/abs/2602.22525v1)
  - [AgentSentry: Mitigating Indirect Prompt Injection in LLM Agents](https://arxiv.org/abs/2602.22724v1)
  - [ESAA: Event Sourcing for Autonomous Agents in LLM-Based Software Engineering](https://arxiv.org/abs/2602.23193v1)
- **Common approach**:
  - Treat agent security as **architecture + protocol** problems (MQTT as C2 plane; tool-return boundaries as control points; intention/effect separation).
  - Add **auditable structure** (provenance fields, append-only event logs, deterministic replay + hashing).
  - Use **inference-time gating** around tool use (authorization policies; purification/rewrites before high-impact actions).
- **Open questions / failure modes**:
  - MQTT-style coordination can accept spoofing/replay/direct publishes without cryptographic enforcement; provenance can be “present” but meaningless.
  - Failover can create long monitoring gaps (e.g., measured 35.7s blackout) and silent sovereignty boundary crossings (DNS evidence only).
  - Counterfactual defenses add overhead; out-of-scope runtime compromises (tool runtime tampering) remain.

### Theme: Dynamic policy enforcement & auditing hidden behaviors

- **Why it matters**: Safety policies change faster than models; auditing must work even when models *don’t confess* and when tools that look good in isolation don’t help end-to-end investigators.
- **Representative papers**:
  - [CourtGuard: A Model-Agnostic Framework for Zero-Shot Policy Adaptation in LLM Safety](https://arxiv.org/abs/2602.22557v1)
  - [AuditBench: Evaluating Alignment Auditing Techniques on Models with Hidden Behaviors](https://arxiv.org/abs/2602.22755v1)
- **Common approach**:
  - Decouple safety logic from weights via **retrieval-grounded reasoning** over policy corpora (RAG + debate + judge).
  - Evaluate auditing as an **agentic task** with tool configurations, not just static probes.
  - Stress targets with **anti-confession training** (KTO vs SFT) and multiple behavior instillation methods (TD vs SDF).
- **Open questions / failure modes**:
  - Inference latency/cost for debate + retrieval; formatting brittleness on smaller backbones.
  - “Tool-to-agent gap”: evidence surfaced by tools may not translate into correct hypotheses for an investigator agent.
  - Auditability is highly sensitive to how the hidden behavior was trained (easiest: SDF+SFT; hardest: TD+KTO).

### Theme: RL stabilization for reasoning/agentic RAG (process signals over sparse outcomes)

- **Why it matters**: GRPO/RLVR pipelines can collapse (mode collapse to no-thinking; entropy collapse under length pressure; slow learning under sparse rewards). Process-aware shaping is emerging as the fix.
- **Representative papers**:
  - [Stable Adaptive Thinking via Advantage Shaping and Length-Aware Gradient Regulation](https://arxiv.org/abs/2602.22556v1)
  - [Search-P1: Path-Centric Reward Shaping for Stable and Efficient Agentic RAG Training](https://arxiv.org/abs/2602.22576v1)
  - [Compress the Easy, Explore the Hard (CEEH)](https://arxiv.org/abs/2602.22642v1)
  - [Towards Faithful Industrial RAG: Reinforced Co-adaptation Framework for Advertising QA](https://arxiv.org/abs/2602.22584v1)
- **Common approach**:
  - Add **trajectory/process rewards** (plan execution ratios; reference step coverage; partial credit for “good path, wrong answer”).
  - Stabilize RL under length heterogeneity via **advantage shaping** and **length-aware gradient weighting**.
  - Make exploration/compression **instance-dependent** (hard questions get stronger entropy regularization; easy ones get stronger compression).
- **Open questions / failure modes**:
  - Reliance on external LLM judges/evaluators during training (cost, bias, brittleness).
  - Translation-built safety/benchmark data can introduce artifacts (relevant for multilingual and some RAG settings).
  - Domain transfer beyond verifiable math/QA remains constrained by availability of trustworthy rewards/verifiers.

### Theme: Long-horizon agent efficiency (KV cache, memory, and search parallelism)

- **Why it matters**: Long-horizon agents are often memory-bandwidth bound (KV reads) and context-budget bound; efficiency improvements directly expand feasible autonomy and reduce cost.
- **Representative papers**:
  - [SideQuest: Model-Driven KV Cache Management](https://arxiv.org/abs/2602.22603v1)
  - [InnerQ: Hardware-aware Tuning-free Quantization of KV Cache](https://arxiv.org/abs/2602.23200v1)
  - [Search More, Think Less](https://arxiv.org/abs/2602.22675v1)
  - [AMA-Bench: Evaluating Long-Horizon Memory for Agentic Applications](https://arxiv.org/abs/2602.22769v1)
- **Common approach**:
  - Replace heuristics with **semantic/model-driven decisions** (LLM decides which tool outputs to evict; parallel auxiliary thread).
  - Hardware co-design for decode: **inner-dimension grouping** + 2-bit KV quantization + sink/recent high-precision windows.
  - Shift scaling from sequential deliberation to **parallel evidence acquisition** and structured context resets.
  - Benchmark memory on **machine-generated, causally grounded trajectories**, not just dialogue/doc QA.
- **Open questions / failure modes**:
  - Small fine-tuning sets can cause OOD degradation (SideQuest reports up to 5% on BrowseComp).
  - Quantization results shown on limited tasks/models (e.g., GSM8K few-shot; specific GPUs).
  - Memory construction loss and retrieval unreliability compound over horizons (needle protocol drops in AMA-Bench).

### Theme: Evaluation reliability & reproducibility (humans, APIs, and protocols)

- **Why it matters**: If evaluation is noisy or non-reproducible, optimization targets drift; agent comparisons become artifacts of raters, live APIs, or protocol mismatches.
- **Representative papers**:
  - [MobilityBench](https://arxiv.org/abs/2602.22638v1)
  - [General Agent Evaluation](https://arxiv.org/abs/2602.22953v1)
  - [Correcting Human Labels for Rater Effects (IRT)](https://arxiv.org/abs/2602.22585v1)
  - [Decomposing Physician Disagreement in HealthBench](https://arxiv.org/abs/2602.22758v1)
- **Common approach**:
  - Make tool environments reproducible via **API replay sandboxes** and schema validation.
  - Standardize cross-benchmark execution via **canonical task/context/action protocols** and adapters.
  - Model human label noise explicitly (MFRM rater severity/thresholds; mixed models/ICCs for disagreement).
- **Open questions / failure modes**:
  - Human disagreement is largely case-specific/residual (HealthBench residual 81.8% for labels), limiting achievable “ground truth.”
  - Rater-model estimability requires overlap/linkage; short scales constrain IRT robustness.
  - Tool-count limits and protocol constraints can dominate outcomes (e.g., GPT 5.2 tool cap vs AppWorld’s 468 tools).

### 3) Technical synthesis
- **Boundary control is converging**: AgentSentry’s tool-return boundary diagnostics, ESAA’s intention/effect boundary, and edge IoT’s MQTT boundary all treat “where state crosses trust domains” as the key security lever.
- **GRPO is the common substrate**, but papers diverge on how to fix its pathologies: CPAS/LAGR target length heterogeneity and mode collapse; Search-P1 densifies reward via plan/path scoring; CEEH targets entropy collapse via difficulty-aware entropy.
- **“Process supervision” is being operationalized without full supervision**: Search-P1 uses offline reference planners + step coverage; diffusion stitching uses PRM step scores; industrial RAG uses multi-dimensional rewards including URL validity checks.
- **RAG is splitting into two concerns**: (i) retrieval quality/coverage (GraphRAG + parallel channels; agentic multi-step search), and (ii) *faithful use* of evidence (URL validity, faithfulness rewards, and knowledge attribution probes).
- **Agent reliability is increasingly measured as variance, not just mean**: stochasticity metrics for deep research agents (total variance over answers/findings/citations) complement success-rate leaderboards and highlight early-step randomness amplification.
- **Memory and KV cache are treated as first-class optimization targets**: SideQuest reduces peak token utilization and KV reads; InnerQ targets decode-phase matmul layout to reduce latency, not just memory footprint.
- **Evaluation infrastructure is becoming a research contribution**: deterministic replay (MobilityBench), unified protocol harnesses (Exgentic), and auditing benchmarks with non-confessing targets (AuditBench) aim to prevent “benchmark overfitting to quirks.”
- **Human factors are now part of capability/risk measurement**: bio uplift shows novices improve with LLMs but can still underperform LLM-only baselines; safety governance needs to model *human–LLM systems*, not models alone.
- **Interpretability is branching**: from neuron/subspace editing for multilingual safety (sparse weight edits) to formal robustness guarantees for circuits (certified circuits) to SSM-specific bottleneck steering (Mamba subspace bottlenecks).

### 4) Top 5 papers (with “why now”)

1) [AgentSentry: Mitigating Indirect Prompt Injection in LLM Agents via Temporal Causal Diagnostics and Context Purification](https://arxiv.org/abs/2602.22724v1)
- Introduces a **counterfactual, temporal causal** framing of multi-turn indirect prompt injection at tool-return boundaries.
- Reports **ASR = 0%** across three IPI families and three black-box LLMs on AgentDojo, with substantial utility retained (UA reported per model).
- Ablations show sanitized counterfactuals and temporal diagnostics are critical (removing them raises ASR to ~22% on a suite).
- **Skepticism**: overhead can be large in general (up to four regimes per boundary with sampling); benchmark settings use lightweight K/w.

2) [CourtGuard: A Model-Agnostic Framework for Zero-Shot Policy Adaptation in LLM Safety](https://arxiv.org/abs/2602.22557v1)
- Makes safety **policy-updatable at inference time** via RAG-grounded adversarial debate and citation-based adjudication.
- Strong reported benchmark performance (macro Acc 0.87 / F1 0.86) and high recall on a human-verified suite.
- Demonstrates **policy/domain swapping** (Wikipedia vandalism) without weight updates.
- **Skepticism**: increased inference latency/cost; performance bounded by policy corpus coverage and backbone formatting adherence.

3) [AuditBench: Evaluating Alignment Auditing Techniques on Models with Hidden Behaviors](https://arxiv.org/abs/2602.22755v1)
- Provides **56 non-confessing target models** across 14 hidden behaviors with varied instillation and anti-confession training.
- Finds scaffolded black-box tools best in agentic auditing and surfaces a **tool-to-agent gap** (static tool signal ≠ agent success).
- Shows auditability depends strongly on training recipe (TD+KTO hardest).
- **Skepticism**: targets are LoRA fine-tunes with explicit behaviors; may be easier to audit than diffuse emergent behaviors.

4) [Systems-Level Attack Surface of Edge Agent Deployments on IoT](https://arxiv.org/abs/2602.22525v1)
- Empirically demonstrates that edge-local swarms can reduce egress (0 external IPs/bytes in a session) but introduce **MQTT C2 vulnerabilities** and **failover blind spots**.
- Shows provenance metadata can be trivially bypassed (missing/spoofed sender, replay, direct safety-topic publish accepted).
- Measures concrete operational metrics (actuation-to-audit latency; blackout windows; DNS-only sovereignty crossings).
- **Skepticism**: single small testbed; no mitigation prototypes evaluated; cloud comparison not workload-matched.

5) [LLM Novice Uplift on Dual-Use, In Silico Biology Tasks](https://arxiv.org/abs/2602.23329v1)
- Human-subject evidence that LLM access yields **4.16× higher novice accuracy** vs internet-only across bio task suites (7/8 benchmarks).
- Highlights a governance-relevant nuance: **LLM-only often beats LLM-assisted novices**, so uplift depends on user strategy/task structure.
- Reports most users had **no difficulty overcoming safeguards**, relevant for dual-use risk assessment.
- **Skepticism**: not double-blind; model availability changed mid-study; confined to in silico tasks (wet-lab translation unknown).

### 5) Practical next steps
- **For agent security**: add cryptographic enforcement/ACLs to agent coordination planes (e.g., MQTT) and measure whether provenance becomes non-bypassable under adversarial publish/replay.
- **Instrument sovereignty boundaries**: treat “fallback to cloud inference” as a security event; log and alert on DNS/API boundary crossings and correlate with agent-level traces.
- **Adopt boundary-anchored defenses**: prototype AgentSentry-style tool-return checks (even simplified) and measure ASR/utility trade-offs under multi-turn IPI.
- **Make policy updates operational**: stand up a CourtGuard-like policy RAG store for your org’s governance docs; measure latency and failure modes on smaller backbones (formatting/parsing).
- **Train agents with process rewards**: if using GRPO/RLVR, test path-centric or difficulty-aware shaping (Search-P1/CEEH ideas) and explicitly monitor entropy/mode-collapse indicators.
- **Optimize long-horizon cost**: evaluate SideQuest-like semantic eviction and/or InnerQ-like KV quantization on your agent workloads; track KV reads, throughput, and task completion rates.
- **Benchmark memory realistically**: run your memory system on agent-trajectory benchmarks (AMA-Bench-style) and include needle protocols to quantify construction loss vs retrieval loss.
- **Harden evaluation pipelines**: where humans rate outputs, consider IRT/MFRM adjustments; where tools/APIs are involved, prefer replayable sandboxes (MobilityBench pattern) to reduce variance.

---
*Generated from per-paper analyses; no external browsing.*
