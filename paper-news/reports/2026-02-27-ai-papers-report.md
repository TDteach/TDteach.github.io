# AI Paper Insight Brief
## 2026-02-27

### 0) Executive takeaways (read this first)
- **Agent safety is shifting “down the stack”**: multiple papers show that deployment architecture (edge IoT swarms, tool-return boundaries, KV/memory management) can dominate risk/robustness outcomes, often bypassing prompt/model-level defenses.
- **Inference-time, training-free interventions are maturing** across safety and efficiency: causal counterfactual defenses for indirect prompt injection (ASR reported 0%), policy-grounded debate for zero-shot policy swaps, and sparse weight edits for multilingual safety transfer.
- **GRPO is becoming a default backbone** for both capability and safety/faithfulness tuning (adaptive thinking, agentic RAG reward shaping, industrial RAG faithfulness, human-collaboration modules), with new work focusing on stabilizing gradients and rewards under length/path heterogeneity.
- **Long-horizon agents are hitting systems bottlenecks** (KV cache growth, memory retrieval failures, stochasticity across runs). New benchmarks and mechanisms (AMA-Bench, stochasticity variance metrics, SideQuest) make these failure modes measurable and optimizable.
- **Evaluation methodology is under active repair**: rater-effect modeling (MFRM/IRT) and physician-disagreement decomposition show that raw human labels can reorder system rankings and that much disagreement is case-specific—implying “better judges” may require better task design, not just better models.
- **Biosecurity uplift evidence is now human-subject, multi-model, long-horizon**: novices with LLM access were reported 4.16× more accurate than internet-only novices, and most reported little difficulty overcoming safeguards—raising the priority of realistic uplift evaluations.

### 2) Key themes (clusters)

### Theme: Inference-time safety layers for agents (policy, prompt injection, edge systems)

- **Why it matters**: As agents act through tools and physical systems, the critical failures often occur at boundaries (tool returns, messaging buses, fallback paths) where classic prompt defenses don’t apply or aren’t observable.
- **Representative papers**:
  - [AgentSentry: Mitigating Indirect Prompt Injection in LLM Agents via Temporal Causal Diagnostics and Context Purification](https://arxiv.org/abs/2602.22724v1)
  - [CourtGuard: A Model-Agnostic Framework for Zero-Shot Policy Adaptation in LLM Safety](https://arxiv.org/abs/2602.22557v1)
  - [Systems-Level Attack Surface of Edge Agent Deployments on IoT](https://arxiv.org/abs/2602.22525v1)
- **Common approach**:
  - Move defenses to **decision boundaries** (tool-return checkpoints; policy-grounded adjudication; MQTT control plane).
  - Use **structured protocols** (retrieval-grounded debate verdicts; causal counterfactual regimes; provenance metadata envelopes).
  - Emphasize **measurable operational metrics** (ASR/UA/FPR; latency; actuation-to-audit delay; egress/sovereignty; failover windows).
- **Open questions / failure modes**:
  - Overhead/latency: counterfactual re-executions and multi-agent debate increase inference cost.
  - Backbone brittleness: formatting adherence issues can break parsing (CourtGuard); edge heterogeneity complicates enforcement (IoT).
  - Trust boundary gaps: MQTT brokers accepting spoof/replay/direct publishes; silent fallback crossing sovereignty boundaries.

### Theme: RL (often GRPO) for agentic RAG, faithfulness, and collaboration

- **Why it matters**: Agentic systems need dense learning signals beyond final-answer correctness; industrial deployments also need faithfulness constraints (e.g., URL hallucination) that are operationally testable.
- **Representative papers**:
  - [Search-P1: Path-Centric Reward Shaping for Stable and Efficient Agentic RAG Training](https://arxiv.org/abs/2602.22576v1)
  - [Towards Faithful Industrial RAG: A Reinforced Co-adaptation Framework for Advertising QA](https://arxiv.org/abs/2602.22584v1)
  - [Requesting Expert Reasoning: Augmenting LLM Agents with Learned Collaborative Intervention](https://arxiv.org/abs/2602.22546v1)
- **Common approach**:
  - Replace sparse outcome rewards with **process/path rewards** (dual-track step coverage; soft outcome scoring).
  - Use **GRPO-style RL** plus structured formats (planner-first trajectories; tagged interaction protocols).
  - Add **domain-specific faithfulness constraints** (evidence faithfulness; URL validity checks with penalties).
- **Open questions / failure modes**:
  - Dependence on **LLM evaluators/judges** for scoring (reward hacking / evaluator sensitivity).
  - Offline artifacts: reference planners and indicator-like resources add pipeline complexity.
  - Generalization: training often anchored in specific domains (Minecraft, advertising QA, QA benchmarks).

### Theme: Reasoning efficiency without accuracy collapse (adaptive thinking, entropy/length control)

- **Why it matters**: Long CoT is expensive; naive length penalties can collapse exploration or destabilize RL due to extreme length heterogeneity.
- **Representative papers**:
  - [Stable Adaptive Thinking via Advantage Shaping and Length-Aware Gradient Regulation](https://arxiv.org/abs/2602.22556v1)
  - [Compress the Easy, Explore the Hard: Difficulty-Aware Entropy Regularization for Efficient LLM Reasoning](https://arxiv.org/abs/2602.22642v1)
  - [Test-Time Scaling with Diffusion Language Models via Reward-Guided Stitching](https://arxiv.org/abs/2602.22871v1)
- **Common approach**:
  - **Instance-adaptive control** (think/no-think token; hard/easy entropy scaling; per-question shortest-correct length baselines).
  - Stabilize RL with **advantage shaping + gradient reweighting** under length heterogeneity.
  - Shift test-time scaling from “one long trace” to **step-level reuse** (PRM-scored stitching + AR recomputation).
- **Open questions / failure modes**:
  - Scaling beyond small/medium models not established in some work (adaptive thinking evaluated on 1.5B/7B).
  - Reliance on PRMs and diversity of sampled traces; shared mistakes limit stitching recovery.
  - Difficulty estimation proxies (historical accuracy EMA) may be brittle across domains.

### Theme: Long-horizon agent infrastructure: memory, KV cache, stochasticity, and evaluation

- **Why it matters**: As agents run longer, failures become systems failures: memory compression loses causal state, KV cache becomes a serving bottleneck, and stochasticity undermines reliability even at temperature 0 in API settings.
- **Representative papers**:
  - [SideQuest: Model-Driven KV Cache Management for Long-Horizon Agentic Reasoning](https://arxiv.org/abs/2602.22603v1)
  - [AMA-Bench: Evaluating Long-Horizon Memory for Agentic Applications](https://arxiv.org/abs/2602.22769v1)
  - [Evaluating Stochasticity in Deep Research Agents](https://arxiv.org/abs/2602.23271v1)
  - [InnerQ: Hardware-aware Tuning-free Quantization of KV Cache for Large Language Models](https://arxiv.org/abs/2602.23200v1)
- **Common approach**:
  - Make hidden bottlenecks **measurable** (peak token utilization, KV reads, total variance over findings/citations, needle protocols).
  - Use **model-driven or hardware-aligned** mechanisms (aux-thread semantic eviction; inner-dimension KV grouping).
  - Add **structured mitigations** (structured outputs; query-intersection ensembling; tool-augmented retrieval over causality graphs).
- **Open questions / failure modes**:
  - OOD degradation (SideQuest up to 5% accuracy drop on BrowseComp).
  - Memory construction/retrieval losses dominate end-to-end performance (AMA-Bench needle ablations).
  - Microbenchmarks vs end-to-end latency (InnerQ reports matmul speedups; broader serving impact not fully shown).

### Theme: Evaluation reliability, auditing, and hidden behaviors

- **Why it matters**: Safety and capability claims depend on measurement; rater effects and disagreement ceilings can invert rankings, while auditing tools must be tested against models that actively resist disclosure.
- **Representative papers**:
  - [AuditBench: Evaluating Alignment Auditing Techniques on Models with Hidden Behaviors](https://arxiv.org/abs/2602.22755v1)
  - [Correcting Human Labels for Rater Effects in AI Evaluation: An Item Response Theory Approach](https://arxiv.org/abs/2602.22585v1)
  - [Decomposing Physician Disagreement in HealthBench](https://arxiv.org/abs/2602.22758v1)
- **Common approach**:
  - Treat evaluation as a **measurement problem** (MFRM severity/thresholds; variance decomposition; agentic auditing success).
  - Stress-test with **adversarial targets** (implanted hidden behaviors + anti-confession training).
  - Report **diagnostics**, not just scores (rater centrality; tool-to-agent gap; residual disagreement dominance).
- **Open questions / failure modes**:
  - Tool-to-agent gap: evidence surfaced by tools may not translate to investigator success.
  - Identification/estimability constraints in rater models (policy facet not estimable in MFRM attempt).
  - Large residual disagreement suggests limits to “judge model” improvements without better rubrics/context.

### Theme: Privacy & dual-use risk in the agent era

- **Why it matters**: Agents plus tools/memory can amplify privacy harms (deanonymization) and dual-use capability uplift; defenses must be evaluated under realistic, long-horizon human use.
- **Representative papers**:
  - [Assessing Deanonymization Risks with Stylometry-Assisted LLM Agent](https://arxiv.org/abs/2602.23079v1)
  - [Decomposing Private Image Generation via Coarse-to-Fine Wavelet Modeling](https://arxiv.org/abs/2602.23262v1)
  - [LLM Novice Uplift on Dual-Use, In Silico Biology Tasks](https://arxiv.org/abs/2602.23329v1)
- **Common approach**:
  - End-to-end pipelines with **search + aggregation + reflection** (stylometry agent; uplift study with multi-model access).
  - Formal privacy via **DP + post-processing** (DP only on coarse wavelet tokens; public prior for details).
  - Measure not just accuracy but **operational risk signals** (candidate coverage; mitigation via guided recomposition; participant-reported safeguard friction).
- **Open questions / failure modes**:
  - Open-world deanonymization remains low even with DB augmentation (top-3 still modest), but targeted settings improve sharply.
  - DP quality gaps persist at strict ε (e.g., ε=1 artifacts; sensitivity to public prior strength).
  - Translating in-silico uplift to wet-lab risk remains unresolved.

### 3) Technical synthesis
- **GRPO shows up as a unifying optimization primitive** across: adaptive thinking (CPAS/LAGR), agentic RAG (Search-P1), industrial faithfulness RL (Advertising QA), and human-collaboration tool-use (AHCE HFM).
- **A recurring stabilization pattern**: when trajectories vary wildly in length/structure, methods add *explicit normalization/weighting* (LAGR length weights; CPAS advantage offsets; path-centric rewards; difficulty-aware entropy).
- **“Boundary-centric” agent safety is converging**: AgentSentry defends at tool-return boundaries; IoT edge paper highlights MQTT as the command boundary; CourtGuard grounds judgments in retrieved policy text rather than parametric “intuition.”
- **Retrieval is being treated as a policy-learning problem, not a fixed module**: Search-P1 shapes rewards around plan execution and reference step coverage; industrial GraphRAG co-adapts retrieval and generation with RL.
- **Long-horizon reliability is being operationalized with new metrics**: stochasticity via normalized total variance over answers/findings/citations; memory via recall/causal/state-update/abstraction categories; systems security via actuation-to-audit delay and failover blackout windows.
- **Model-driven systems optimization is expanding beyond “better prompts”**: SideQuest uses the model to garbage-collect KV cache; InnerQ aligns quantization grouping with decode-time vector–matrix access patterns.
- **Evaluation is moving toward “measurement models”**: IRT/MFRM adjusts for rater severity/centrality; HealthBench disagreement decomposition shows residual dominates; AuditBench measures end-to-end investigator success rather than tool signal alone.
- **Safety transfer is increasingly parameter- or inference-time**: sparse weight editing for multilingual safety; CourtGuard policy swapping; AgentSentry inference-only counterfactual purification—reducing dependence on large new datasets.
- **Benchmarks are becoming more agent-realistic**: AMA-Bench uses action–observation logs with symbolic artifacts; OmniGAIA requires omni-modal tool use; General Agent Evaluation focuses on protocol-preserving cross-environment comparisons.

### 4) Top 5 papers (with “why now”)

1) [AgentSentry: Mitigating Indirect Prompt Injection in LLM Agents via Temporal Causal Diagnostics and Context Purification](https://arxiv.org/abs/2602.22724v1)
- Introduces boundary-anchored counterfactual re-executions (orig/mask/mask_sanitized/orig_sanitized) to estimate causal takeover (ACE/IE/DE).
- Reports **ASR = 0%** across three IPI families and multiple black-box models on AgentDojo, with reported FPR = 0% in tables.
- “Why now”: tool-augmented agents are shipping; this is a concrete inference-time layer that aims to *continue safely* rather than terminate.
- **Skepticism**: overhead scales with re-executions per boundary; evaluation notes benchmarks may under-represent long-horizon delayed takeovers.

2) [AuditBench: Evaluating Alignment Auditing Techniques on Models with Hidden Behaviors](https://arxiv.org/abs/2602.22755v1)
- Provides **56 target models / 14 hidden behaviors** with anti-confession training, enabling systematic auditing evaluation.
- Finds scaffolded black-box tools outperform many white-box tools overall; documents a **tool-to-agent gap**.
- “Why now”: auditing is becoming a deployment gate; this gives repeatable targets and end-to-end agent evaluation.
- **Skepticism**: targets are fine-tunes on one base model (Llama 3.3 70B); may be easier to audit than organically emergent behaviors.

3) [LLM Novice Uplift on Dual-Use, In Silico Biology Tasks](https://arxiv.org/abs/2602.23329v1)
- Human-subject evidence: LLM access yields **4.16× higher novice accuracy** (odds ratio) vs internet-only; Treatment improves on 7/8 benchmarks.
- Treatment sometimes exceeds expert baselines (e.g., HPCT, VCT) and participants often report little safeguard friction (89.6%).
- “Why now”: policy discussions need uplift data under realistic multi-model, long-duration use—not just model-only benchmarks.
- **Skepticism**: confined to in-silico tasks; model availability changed mid-study; not double-blind.

4) [SideQuest: Model-Driven KV Cache Management for Long-Horizon Agentic Reasoning](https://arxiv.org/abs/2602.22603v1)
- Uses a **parallel auxiliary thread** to decide which tool outputs are stale and delete their KV entries without polluting main context.
- Reports large efficiency gains (peak token utilization −56–65%, KV reads −53–71%) and serving throughput +83.9% on H100 for FRAMES.
- “Why now”: deep-research/web agents are KV-bound; this is a practical serving-side lever.
- **Skepticism**: eviction limited to tool outputs (not “thoughts”); some OOD accuracy degradation (BrowseComp).

5) [Multilingual Safety Alignment Via Sparse Weight Editing](https://arxiv.org/abs/2602.22554v1)
- Training-free sparse neuron editing with a closed-form low-rank update to transfer English safety behavior to other languages.
- Introduces MULTI-STRONGREJECT (8 languages, 313 harmful prompts each) and shows unsafe-count reductions across models; composes with MPO.
- “Why now”: multilingual jailbreak gaps are a real deployment vulnerability; weight editing is fast to iterate and deploy.
- **Skepticism**: evaluation relies on an automated guard model; datasets are machine-translated (may miss natural LRL jailbreaks).

### 5) Practical next steps
- **Add boundary instrumentation to agents**: log tool-return boundaries with provenance metadata and run periodic “shadow” counterfactual checks (AgentSentry-style) on high-risk tools/actions.
- **Treat messaging middleware as part of the safety perimeter** in edge/IoT: enforce MQTT authentication/ACLs and replay protection; measure actuation-to-audit delay and failover blackout windows as first-class safety SLOs.
- **If doing agentic RAG RL**, try path-centric rewards (self-consistency + reference step coverage) and soft outcome scoring; explicitly test evaluator sensitivity by swapping judge models.
- **Reduce long-horizon cost without breaking correctness**: implement adaptive thinking control tokens and stabilize RL with length-aware gradient regulation; separately test difficulty-aware entropy regularization to prevent entropy collapse.
- **Make reliability measurable** for research agents: compute run-to-run variance over answers/findings/citations; then apply structured outputs + early query intersection ensembling to reduce stochasticity while tracking accuracy.
- **For multilingual deployments**, run a multilingual harmful-prompt sweep and consider sparse weight edits as a fast patch—while validating with multiple harm classifiers (not just one guard).
- **Upgrade human evaluation pipelines**: model rater severity/centrality (MFRM) and track disagreement decomposition; prioritize collecting “reducible uncertainty” tags or missing-context annotations where disagreement is high.
- **For auditing programs**, evaluate tools end-to-end with an investigator agent (AuditBench-style), not just tool signal; explicitly test hardest target configurations (e.g., TD+KTO) to avoid overfitting to easy-to-audit organisms.

---
*Generated from per-paper analyses; no external browsing.*
