# AI Paper Insight Brief
## 2026-03-01

### 0) Executive takeaways (read this first)
- **Agent safety is shifting from “prompt-level” to “systems-level”**: edge IoT swarms show that coordination buses (MQTT), failover behavior, and silent cloud fallback can dominate real risk—even when model behavior is unchanged.
- **Inference-time, policy-grounded safety is getting more updateable**: CourtGuard demonstrates zero-shot policy swapping via RAG + adversarial debate with strong benchmark performance, suggesting a path to reducing “alignment lag” without retraining.
- **Multi-turn agent attacks/defenses are becoming causal and temporal**: AgentSentry reports 0% attack success on AgentDojo by localizing takeover at tool-return boundaries using counterfactual re-executions, then purifying only the untrusted mediator context to continue safely.
- **Efficiency work is converging on “adaptive compute” with stability fixes**: multiple papers tackle overthinking/long-horizon cost via GRPO stabilizers (CPAS/LAGR), difficulty-aware entropy regularization (CEEH), and step-level reuse (diffusion stitching) rather than blunt length penalties.
- **Evaluation is maturing toward variance/noise-aware measurement**: rater-effect correction (IRT) can change system rankings; HealthBench disagreement is mostly case-specific; deep-research agents show measurable run-to-run variance with module attribution and mitigation.
- **Dual-use risk evidence is becoming more direct**: a human study finds LLM access yields **4.16× higher novice accuracy** on in silico biology tasks and most users report little difficulty overcoming safeguards.

### 2) Key themes (clusters)

### Theme: Tool-using agent security beyond prompts (systems + temporal defenses)

- **Why it matters**: As agents act through tools and physical devices, the main vulnerabilities increasingly come from *coordination substrates, context persistence, and runtime fallbacks*—not just prompt injection in a single turn.
- **Representative papers**:
  - [Systems-Level Attack Surface of Edge Agent Deployments on IoT](https://arxiv.org/abs/2602.22525v1)
  - [AgentSentry: Mitigating Indirect Prompt Injection in LLM Agents via Temporal Causal Diagnostics and Context Purification](https://arxiv.org/abs/2602.22724v1)
  - [ESAA: Event Sourcing for Autonomous Agents in LLM-Based Software Engineering](https://arxiv.org/abs/2602.23193v1)
- **Common approach**:
  - Treat safety properties as *systems metrics* (audit delay, provenance completeness, egress, failover windows) rather than purely model behavior.
  - Insert *boundary checks* at tool-return / state-transition points (where untrusted content enters).
  - Prefer *auditable state kernels* (append-only logs, deterministic replay, contracts) to reduce state drift and enable governance.
- **Open questions / failure modes**:
  - How to harden coordination layers (e.g., MQTT) with cryptographic provenance/ACLs under edge constraints without breaking latency.
  - Counterfactual diagnostics add overhead; unclear robustness on *long-horizon delayed takeovers* beyond current benchmarks.
  - Event-sourcing kernels validate compliance/replay, but don’t directly measure software quality or broader security side channels.

### Theme: Dynamic, policy-grounded alignment and multilingual safety transfer

- **Why it matters**: Deployed policies change faster than retraining cycles, and safety gaps across languages remain exploitable; both push toward *updateable, modular alignment*.
- **Representative papers**:
  - [CourtGuard: A Model-Agnostic Framework for Zero-Shot Policy Adaptation in LLM Safety](https://arxiv.org/abs/2602.22557v1)
  - [Multilingual Safety Alignment Via Sparse Weight Editing](https://arxiv.org/abs/2602.22554v1)
  - [Obscure but Effective: Classical Chinese Jailbreak Prompt Optimization via Bio-Inspired Search](https://arxiv.org/abs/2602.22983v1)
- **Common approach**:
  - Ground safety decisions in *retrieved policy text* and produce auditable rationales (CourtGuard).
  - Transfer safety via *sparse, low-rank edits* on identified “safety neurons,” avoiding full retraining (Sparse Weight Editing).
  - Stress-test guardrails with *distributionally shifted language* and automated black-box optimization (Classical Chinese FOA search).
- **Open questions / failure modes**:
  - RAG+debate evaluators trade accuracy for latency/cost; smaller backbones may fail structured outputs.
  - Weight edits may be brittle under adaptive jailbreaks or when safety representations differ strongly by language.
  - Classical-Chinese jailbreak results suggest defenses tuned to modern-language surface forms may fail catastrophically.

### Theme: Stable efficiency scaling for reasoning and agentic RAG

- **Why it matters**: Serving cost is now a first-order constraint; naive length penalties can collapse exploration or accuracy. The trend is toward *stability-aware* efficiency mechanisms.
- **Representative papers**:
  - [Stable Adaptive Thinking via Advantage Shaping and Length-Aware Gradient Regulation](https://arxiv.org/abs/2602.22556v1)
  - [Compress the Easy, Explore the Hard: Difficulty-Aware Entropy Regularization for Efficient LLM Reasoning](https://arxiv.org/abs/2602.22642v1)
  - [Search-P1: Path-Centric Reward Shaping for Stable and Efficient Agentic RAG Training](https://arxiv.org/abs/2602.22576v1)
  - [Test-Time Scaling with Diffusion Language Models via Reward-Guided Stitching](https://arxiv.org/abs/2602.22871v1)
- **Common approach**:
  - Modify GRPO/RLVR to avoid mode collapse under length heterogeneity (CPAS/LAGR; difficulty-aware entropy).
  - Replace sparse/binary outcome rewards with *trajectory/process* signals (path-centric scoring; step-level PRM scoring).
  - Reuse partial progress (stitching steps across diffusion traces) instead of selecting whole trajectories.
- **Open questions / failure modes**:
  - Reliance on verifiable rewards (math/QA) limits domain transfer; verification for open-ended tasks remains hard.
  - PRM misranking can discard crucial steps or over-trust incorrect anchors in stitching.
  - Difficulty estimation and selective entropy may allocate too much budget to unsolved hard instances.

### Theme: Long-horizon agent memory + inference infrastructure

- **Why it matters**: Long-horizon agents hit context/KV bottlenecks and memory retrieval failures; improvements increasingly require *systems + model co-design*.
- **Representative papers**:
  - [SideQuest: Model-Driven KV Cache Management for Long-Horizon Agentic Reasoning](https://arxiv.org/abs/2602.22603v1)
  - [InnerQ: Hardware-aware Tuning-free Quantization of KV Cache for Large Language Models](https://arxiv.org/abs/2602.23200v1)
  - [AMA-Bench: Evaluating Long-Horizon Memory for Agentic Applications](https://arxiv.org/abs/2602.22769v1)
- **Common approach**:
  - Treat tool outputs as first-class cache occupants; evict them with *semantic, model-driven* decisions (SideQuest).
  - Align quantization layout with decode-time kernels (inner-dimension grouping) to reduce memory traffic (InnerQ).
  - Benchmark memory on *agent–environment trajectories* with machine-generated artifacts and causal state transitions (AMA-Bench).
- **Open questions / failure modes**:
  - SideQuest currently evicts only tool responses (not “thought” tokens) and shows some OOD degradation.
  - KV quantization results are shown on GSM8K few-shot; broader task impacts and interactions with eviction are open.
  - Memory benchmarks rely on LLM-as-judge for some scoring; robustness of judging remains a concern.

### Theme: Evaluation reliability, stochasticity, and disagreement as first-class signals

- **Why it matters**: As models converge, measurement error (rater effects, disagreement, run-to-run variance) can dominate perceived progress and mis-rank systems.
- **Representative papers**:
  - [Correcting Human Labels for Rater Effects in AI Evaluation: An Item Response Theory Approach](https://arxiv.org/abs/2602.22585v1)
  - [Decomposing Physician Disagreement in HealthBench](https://arxiv.org/abs/2602.22758v1)
  - [Evaluating Stochasticity in Deep Research Agents](https://arxiv.org/abs/2602.23271v1)
  - [AuditBench: Evaluating Alignment Auditing Techniques on Models with Hidden Behaviors](https://arxiv.org/abs/2602.22755v1)
- **Common approach**:
  - Model annotators explicitly (MFRM) to adjust scores and diagnose severity/centrality.
  - Decompose variance into rater/rubric/residual or module/time-step contributions.
  - Evaluate tools in *agentic use*, exposing tool-to-agent gaps rather than static tool quality.
- **Open questions / failure modes**:
  - HealthBench disagreement is mostly residual/case-specific; predicting it from embeddings is near chance, limiting automation.
  - API non-determinism can persist even at temperature 0, complicating reproducibility.
  - Auditing tools can hurt on harder targets; effectiveness depends strongly on target training (TD vs SDF; KTO vs SFT).

### 3) Technical synthesis
- **Boundary-centric thinking is recurring**: AgentSentry’s tool-return boundaries, ESAA’s intention/effect boundary, and edge-IoT’s MQTT coordination boundary all treat “where state changes” as the right place to measure/control risk.
- **GRPO is becoming a common substrate** for both reasoning efficiency (adaptive thinking; CEEH) and agentic RAG training (Search-P1), with papers focusing on stabilizing gradients/rewards under heterogeneity.
- **Process signals are replacing binary outcomes**: Search-P1’s path-centric scoring and diffusion step-stitching both extract learning/selection signal from partially correct trajectories.
- **“Model as systems component” is expanding**: SideQuest uses the LRM to manage its own KV cache; AgentSentry uses the model in controlled re-executions; CourtGuard uses multiple roles (attacker/defender/judge) to structure evaluation.
- **Evaluation work is converging on variance decomposition**: rater effects (IRT), physician disagreement ICCs, and DRA stochasticity all formalize “where variance comes from” rather than treating it as noise.
- **Language distribution shift remains a primary jailbreak vector**: Classical Chinese optimization shows near-complete compromise across multiple closed models; Sparse Weight Editing tries to close multilingual gaps without retraining.
- **Privacy auditing is broadening threat models**: MOFIT removes the “ground-truth caption” assumption for diffusion MIAs; DP-Wavelet and DPSQL+ focus on deployable DP with practical constraints (post-processing, minimum frequency rules).
- **Agent benchmarks are becoming more environment-faithful and reproducible**: MobilityBench’s API replay sandbox and General Agent Evaluation’s Unified Protocol both target reproducibility and cross-system comparability.
- **Interpretability is increasingly tied to interventions**: SSM bottleneck steering (Mamba) and certified circuit stability both aim to make mechanistic artifacts actionable and reliable.

### 4) Top 5 papers (with “why now”)

1) [AgentSentry: Mitigating Indirect Prompt Injection in LLM Agents via Temporal Causal Diagnostics and Context Purification](https://arxiv.org/abs/2602.22724v1)
- Introduces boundary-anchored counterfactual diagnostics (orig/mask/mask_sanitized/orig_sanitized) to localize mediator takeover.
- Reports **ASR = 0%** on AgentDojo across multiple attack families and backbones while keeping high utility under attack.
- Mitigates by rewriting only untrusted mediator content into evidence-only form, enabling continuation rather than termination.
- **Be skeptical about**: added inference overhead from counterfactual runs; benchmark may underrepresent long-horizon delayed takeovers.

2) [Systems-Level Attack Surface of Edge Agent Deployments on IoT](https://arxiv.org/abs/2602.22525v1)
- Makes agent security measurable: actuation-to-audit delay (~23 ms mean on one path), provenance completeness, egress, failover windows.
- Shows MQTT broker accepts spoofing/replay/direct safety-topic publishes without cryptographic enforcement.
- Demonstrates silent sovereignty boundary crossing via forced fallback (DNS to api.anthropic.com) with no app-layer anomaly.
- **Be skeptical about**: single testbed/topology; cloud egress comparison not workload-matched.

3) [CourtGuard: A Model-Agnostic Framework for Zero-Shot Policy Adaptation in LLM Safety](https://arxiv.org/abs/2602.22557v1)
- Retrieval-grounded adversarial debate produces interpretable verdicts with threat scores and policy citations.
- Strong reported benchmark performance (macro Acc 0.87 / F1 0.86) and high recall on a human-verified suite.
- Demonstrates **zero-shot policy swapping** (e.g., Wikipedia vandalism) by changing the policy corpus.
- **Be skeptical about**: latency/cost of RAG + multi-turn debate; dependence on backbone format adherence.

4) [AuditBench: Evaluating Alignment Auditing Techniques on Models with Hidden Behaviors](https://arxiv.org/abs/2602.22755v1)
- Provides 56 hardened target models with 14 hidden behaviors and reduced confession rates (KTO harder than SFT).
- Agentic evaluation reveals scaffolded black-box tools outperform many white-box tools; effectiveness depends on target training.
- Surfaces a concrete “tool-to-agent gap” (underuse, noise distraction, hypothesis failures).
- **Be skeptical about**: targets are fine-tuned “model organisms” on one base model; may not match naturally emerging hidden behaviors.

5) [LLM Novice Uplift on Dual-Use, In Silico Biology Tasks](https://arxiv.org/abs/2602.23329v1)
- Human-subject evidence: LLM access yields **4.16×** higher novice accuracy; Treatment beats Control on 7/8 benchmarks.
- Treatment novices sometimes exceed expert baselines; but standalone LLMs often exceed LLM-assisted novices (elicitation gap).
- Reports most Treatment participants indicated no difficulty overcoming safeguards (89.6%).
- **Be skeptical about**: study limitations include changing model availability, possible information leakage (some questions found online), and lack of full blinding.

### 5) Practical next steps
- For tool-using agents, add **tool-return boundary instrumentation**: log mediator content, proposed action, and a lightweight “takeover risk” proxy; measure how often high-impact actions are mediator-attributed.
- In edge/IoT deployments, treat **message bus security as safety-critical**: test spoof/replay/direct-topic publish in your MQTT (or equivalent) setup; measure actuation-to-audit delay and failover blackout windows.
- If you need rapid policy updates, prototype a **policy-RAG evaluator** with explicit citations and a deterministic verdict mapping; benchmark latency vs static classifiers.
- For multilingual safety, evaluate **language-shift jailbreaks** (including stylistic shifts) and consider sparse interventions; measure utility drift on non-safety tasks.
- For reasoning efficiency, avoid blunt length penalties: try **difficulty-aware exploration control** (entropy only on hard instances) or **advantage/gradient regulation** under length heterogeneity; track mode collapse.
- For long-horizon agents, combine **semantic KV eviction** (tool-response garbage collection) with **hardware-aligned KV quantization**; measure throughput and non-completion/parsing failures.
- Upgrade evaluation pipelines: (i) model **rater effects** when using human labels, (ii) report **disagreement-aware metrics**, and (iii) for research agents, report **run-to-run variance** on answers/findings/citations plus module attribution.
- For dual-use governance, incorporate **human+LLM uplift** studies into risk assessments (not just LLM-only benchmarks), and explicitly test whether safeguards meaningfully slow task completion.

---
*Generated from per-paper analyses; no external browsing.*
