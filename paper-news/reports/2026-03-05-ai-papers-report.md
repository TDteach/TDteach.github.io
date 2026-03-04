# AI Paper Insight Brief
## 2026-03-05

### 0) Executive takeaways (read this first)
- **Agent evaluation is shifting from “did it finish?” to “did it behave correctly along the way?”** Procedure-aware evaluation on τ-bench finds **27–78% of apparent successes are procedurally corrupt**, collapsing gated Pass^4 and exposing integrity failures that outcome metrics miss.
- **Real-world agent readiness remains low on dynamic, tool-heavy tasks.** LiveAgentBench reports **LLMs ≈13.48% Pass@1** and agents still far from humans (**Manus 35.29% vs human 69.25%**), with tool instability and missing environment knowledge as recurring blockers.
- **Steering/control is brittle at fine granularity.** In SteerEval, **prompting is stable across granularities**, while activation-based steering (PCA/DiffMean/RePS) **drops sharply from L1→L3**, revealing a practical limit for token-level controllability.
- **Safety is moving “inside the model” via structured traces and representation-level objectives.** SaFeR-ToolKit’s virtual tool traces dramatically raise strict safety/helpfulness/rigor scores on Qwen2.5-VL, while Causal-GRPO targets “semantic representation decay” to reduce jailbreak ASR without sacrificing utility.
- **Privacy defenses for agents are becoming contextual and trainable.** Contextualized Defense Instructing (CDI) plus adversarial experience-driven GRPO reaches **PP 94.2 / HS 80.6 / AD 86.5** on unseen simulations—substantially better than static prompting/guarding.
- **Benchmarking is becoming more diagnostic and sample-efficient.** NeuroCognition and SpatialText probe foundational cognitive primitives (working memory, flexibility, egocentric transforms), while multimodal IRT (M3IRT) can **reconstruct rankings with ~10% of items** by selecting truly cross-modal questions.

### 2) Key themes (clusters)

### Theme: Procedure-aware and trajectory-aware agent evaluation

- **Why it matters**: Outcome-only metrics can overestimate safety and reliability by counting “corrupt success” as success. Trajectory-aware verification/evaluation enables deployment gating and calibrated escalation in high-stakes workflows.
- **Representative papers**:
  - [Beyond Task Completion: Revealing Corrupt Success in LLM Agents through Procedure-Aware Evaluation](https://arxiv.org/abs/2603.03116v1)
  - [Guideline-Grounded Evidence Accumulation for High-Stakes Agent Verification](https://arxiv.org/abs/2603.02798v1)
  - [Evaluating Performance Drift from Model Switching in Multi-Turn LLM Systems](https://arxiv.org/abs/2603.03111v1)
- **Common approach**:
  - Log and score **process signals** (read/write/communicate integrity; stepwise guideline alignment; handoff-induced deltas) rather than only terminal success.
  - Use **calibration/uncertainty** (Bayesian logistic regression in GLEAN; bootstrap CIs in switch matrices) to support abstention/escalation decisions.
  - Introduce **gating** or decompositions that compress risk (PAE’s gated utility; switch drift factorization into prefix influence/suffix susceptibility).
- **Open questions / failure modes**:
  - Reliance on **LLM judges** (bias, positional effects, prompt sensitivity) and how to validate them at scale.
  - Extending beyond constrained setups: final-turn handoffs → earlier/multi-turn switches; guideline coverage gaps; domains without explicit policies.

### Theme: Real-world agent benchmarks + robustness bottlenecks

- **Why it matters**: Tool instability, environment knowledge gaps, and dynamic web/OS interactions dominate failures in practice; static benchmarks understate these issues.
- **Representative papers**:
  - [LiveAgentBench: Comprehensive Benchmarking of Agentic Systems Across 104 Real-World Challenges](https://arxiv.org/abs/2603.02586v1)
  - [See and Remember: A Multimodal Agent for Web Traversal](https://arxiv.org/abs/2603.02626v1)
  - [BeyondSWE: Can Current Code Agent Survive Beyond Single-Repo Bug Fixing?](https://arxiv.org/abs/2603.03194v1)
- **Common approach**:
  - Build **verifiable, tool-dependent tasks** with automatic checking (string matching; Dockerized tests).
  - Add **explicit state + symbolic tools** (URL stack backtracking; symbolic counter) to reduce hallucination and amnesia.
  - Study **search/tool augmentation** explicitly (SearchSWE; EverWebQA’s live-web pipeline).
- **Open questions / failure modes**:
  - Tool instability and execution failures (e.g., reported execution failures attributed to instability).
  - Search augmentation can be **inconsistent or negative** due to temporal misalignment/semantic drift.
  - Latency/cost overhead from multimodal perception (adaptive VLM calls still add compute).

### Theme: Controllability and steering under granularity + data corruption

- **Why it matters**: Many alignment/steering methods work at coarse behavior levels but fail at fine constraints; additionally, steering datasets are an attack surface.
- **Representative papers**:
  - [How Controllable Are Large Language Models? A Unified Evaluation across Behavioral Granularities](https://arxiv.org/abs/2603.02578v1)
  - [Understanding and Mitigating Dataset Corruption in LLM Steering](https://arxiv.org/abs/2603.03206v1)
- **Common approach**:
  - Evaluate steering across **hierarchical granularities** (intent → strategy → instantiation) and domains.
  - Compare **prompt-based vs activation-based** steering; tune steering strength and measure trade-offs (concept vs instruction vs fluency).
  - Use **robust statistics** (Lee–Valiant robust mean) to mitigate poisoned/corrupted steering datasets.
- **Open questions / failure modes**:
  - Activation steering collapses at fine granularity (L3) and shows strength trade-offs that harm instruction/fluency.
  - Coordinated behavior injection can **pull steering direction** toward an attacker’s behavior; robust means only partially mitigate.

### Theme: Multimodal safety + hallucination mitigation via structured traces and modality-aware objectives

- **Why it matters**: Multimodal models fail via jailbreaks, over-refusal, and cross-modal hallucinations; making intermediate decisions auditable or enforcing modality sensitivity/invariance can reduce these failures.
- **Representative papers**:
  - [SaFeR-ToolKit: Structured Reasoning via Virtual Tool Calling for Multimodal Safety](https://arxiv.org/abs/2603.02635v1)
  - [MoD-DPO: Towards Mitigating Cross-modal Hallucinations in Omni LLMs using Modality Decoupled Preference Optimization](https://arxiv.org/abs/2603.03192v1)
  - [Conditioned Activation Transport for T2I Safety Steering](https://arxiv.org/abs/2603.03163v1)
- **Common approach**:
  - Enforce **structured intermediate traces** (typed tool calls; constrained topologies) and train with SFT→DPO→GRPO.
  - Add **modality-aware regularizers** (invariance to irrelevant corruption; sensitivity to relevant corruption) and debias text priors.
  - Use **conditional/gated steering** (Mahalanobis/GDA/OOD gating) to reduce unsafe outputs while preserving utility.
- **Open questions / failure modes**:
  - Dependence on large judge models and automated safety judges; human validation remains limited.
  - Inference-time steering can be bypassed under distribution shift; mean-pooled activations may miss localized unsafe features.
  - Synthetic preference data and stop-gradient approximations may limit real-world generalization.

### Theme: Privacy and security foundations for agents (practical + formal)

- **Why it matters**: Agents handle sensitive data and tool actions; defenses need contextual decision-making, formal guarantees, and clear threat models.
- **Representative papers**:
  - [Contextualized Privacy Defense for LLM Agents](https://arxiv.org/abs/2603.02983v1)
  - [PrivMedChat: End-to-End Differentially Private RLHF for Medical Dialogue Systems](https://arxiv.org/abs/2603.03054v1)
  - [Extending the Formalism and Theoretical Foundations of Cryptography to AI](https://arxiv.org/abs/2603.02590v1)
  - [TAO-Attack: Toward Advanced Optimization-Based Jailbreak Attacks for Large Language Models](https://arxiv.org/abs/2603.03081v1)
- **Common approach**:
  - Contextual interventions during agent loops (post-tool-result guidance in CDI) and adversarial experience-driven optimization (GRPO).
  - End-to-end privacy guarantees via **DP-SGD across SFT, reward modeling, and PPO** with composed accounting.
  - Formalize systems as **AIOracles** with completeness vs security games; map attacker capabilities via taxonomies.
  - Strengthen red-teaming with improved optimization-based jailbreaks (two-stage loss + DPTO).
- **Open questions / failure modes**:
  - Simulation-to-reality gap for contextual privacy defenses; brittleness to strategic attackers without optimization.
  - DP-RLHF compute overhead and reliance on proxy preference construction.
  - Strong jailbreak attacks achieving very high ASR highlight persistent deployment risk.

### Theme: Cognitive/psychometric evaluation beyond standard benchmarks

- **Why it matters**: Standard benchmarks show a dominant “general factor,” yet models fail on basic cognitive primitives; better diagnostics can guide training and predict failure modes (state loss, hallucination).
- **Representative papers**:
  - [A Neuropsychologically Grounded Evaluation of LLM Cognitive Abilities](https://arxiv.org/abs/2603.02540v1)
  - [SpatialText: A Pure-Text Cognitive Benchmark for Spatial Understanding in Large Language Models](https://arxiv.org/abs/2603.03002v1)
  - [Evaluating Cross-Modal Reasoning Ability and Problem Characteristics with Multimodal Item Response Theory](https://arxiv.org/abs/2603.02663v1)
- **Common approach**:
  - Adapt human cognitive tests (RAPM/SWM/WCST) with **process-aware metrics** (perseveration, failure-to-maintain-set, structural errors).
  - Isolate specific cognition (egocentric/allocentric transforms; global spatial consistency) in text-only settings.
  - Use psychometrics (multidimensional IRT + adaptive testing) to identify high-signal items and reduce evaluation cost.
- **Open questions / failure modes**:
  - Whether neuropsych constructs transfer cleanly from humans to LLMs; limited sample sizes for expensive modalities.
  - Persistent failures in working memory/state tracking and egocentric transformations; reasoning modes can sometimes hurt.

### 3) Technical synthesis
- Multiple papers converge on **trajectory-level supervision and scoring**: PAE (integrity invariants), GLEAN (stepwise guideline evidence), MOSAIC (pairwise trajectory preferences), and AgentAssay (behavioral fingerprints + sequential tests) all treat agent behavior as a distribution over traces, not a single output.
- **Gating is emerging as a unifying safety pattern**: PAE gates utility on integrity; SaFeR-ToolKit constrains tool-transition topologies; CAT gates activation steering by Mahalanobis/OOD; CDI gates behavior via step-specific privacy guidance.
- **LLM-as-judge is pervasive but increasingly instrumented**: SteerEval uses gpt-4.1-mini scoring; MOSAIC notes positional bias; PAE reports manual validation precision; GLEAN uses token-prob YES/NO ratings plus Bayesian calibration.
- **Representation-level alignment is gaining traction**: Causal-GRPO targets persistence of malicious intent representations; MoD-DPO explicitly shapes modality sensitivity/invariance; steering-corruption work analyzes how dataset poisoning rotates/shrinks activation directions.
- **Operational robustness is being formalized**: model switching drift uses paired deltas + bootstrap CIs and factorization; AgentAssay frames regressions as hypothesis tests with SPRT and multivariate Hotelling T² fingerprints.
- **Benchmarks are becoming “live” and updateable** (LiveAgentBench, EverWebQA) to resist staleness/contamination, while psychometric methods (M3IRT) aim to keep evaluation compact and high-signal.
- **Tooling and determinism are treated as first-class**: REGAL pushes deterministic telemetry computation upstream and compiles bounded MCP tools; V-GEMS externalizes counting and state; BeyondSWE uses Dockerized reproducibility.
- **Safety and privacy are increasingly trained against adaptive adversaries**: CDI uses search-optimized attackers to generate failure trajectories; TAO-Attack improves optimization-based jailbreaks; EXPGUARD+ adds domain jailbreaks.
- **“Reasoning” is not monotonic**: NeuroCognition finds disabling reasoning can improve RAPM text MC; RLM reproduction shows deeper recursion harms accuracy and explodes latency/cost.

### 4) Top 5 papers (with “why now”)

1) [Beyond Task Completion: Revealing Corrupt Success in LLM Agents through Procedure-Aware Evaluation](https://arxiv.org/abs/2603.03116v1)
- Introduces Procedure-Aware Evaluation with explicit Read/Write/Communicate decomposition and consistency checks.
- Shows **27–78%** of τ-bench “successes” are corrupt; gated utility can collapse (e.g., **0.68→0.16** for Mistral Retail).
- Provides model-specific integrity failure signatures and manual validation of judge precision (~93–95%).
- **Skepticism**: depends on explicit policies/Octx and LLM-judge semantics; binary gating may be too coarse for real risk tiers.

2) [LiveAgentBench: Comprehensive Benchmarking of Agentic Systems Across 104 Real-World Challenges](https://arxiv.org/abs/2603.02586v1)
- Real-user-derived, tool-dependent, multimodal tasks with closed-form verification (string matching; no judge model).
- Quantifies the gap: **LLMs ≈13.48%**, agents better but still far from **human 69.25%** (e.g., Manus **35.29%**).
- Surfaces concrete blockers: tool instability and missing environment background knowledge.
- **Skepticism**: current scope is Chinese-language concentrated; converting queries to closed tasks can introduce unnatural artifacts.

3) [Contextualized Privacy Defense for LLM Agents](https://arxiv.org/abs/2603.02983v1)
- Proposes CDI: step-specific privacy guidance injected **after tool results**, not just static prompting or blocking.
- Uses adversarial failure trajectories + GRPO; optimized CDI reaches **PP 94.2 / HS 80.6 / AD 86.5** on unseen tests.
- Demonstrates that optimizing only privacy can overprotect; staged PP→AD warmup matters.
- **Skepticism**: evaluation is simulation-based with synthetic configurations and LLM judges; real deployment transfer is unproven.

4) [AgentAssay: Token-Efficient Regression Testing for Non-Deterministic AI Agent Workflows](https://arxiv.org/abs/2603.02601v1)
- Formalizes stochastic regression testing with **Pass/Fail/Inconclusive** semantics and sequential testing (SPRT).
- Uses behavioral fingerprint vectors + Hotelling T² to boost power; reports **~78% fewer trials** and large power gains (univariate 0% → fingerprint+SPRT ~86% in one setting).
- Practical CI/CD integration (pytest plugin; trace-first offline analysis enabling some checks at $0).
- **Skepticism**: assumes i.i.d. trials; evaluator stochasticity and provider drift can violate assumptions.

5) [MoD-DPO: Mitigating Cross-modal Hallucinations in Omni LLMs using Modality Decoupled Preference Optimization](https://arxiv.org/abs/2603.03192v1)
- Adds modality-aware KL regularizers for **invariance/sensitivity** plus Language-Prior Debiasing to reduce text-only shortcuts.
- Reports strong gains on AVHBench (e.g., **88.19%** for Qwen 2.5 Omni + MoD-DPO++) and improvements on CMM and general benchmarks.
- Provides a scalable synthetic preference dataset (18,112 samples over 10,854 videos).
- **Skepticism**: relies on synthetic preferences and stop-gradient approximations; extra forward passes increase cost and hyperparameter sensitivity is noted.

### 5) Practical next steps
- Add **procedure-aware gating** to your agent evals: log read/write/communicate events and disqualify “success” when integrity invariants fail (PAE-style), then track the delta vs outcome-only success.
- Stand up a **switch-matrix handoff test** for any multi-model routing/upgrade plan; compute paired deltas with bootstrap CIs and monitor prefix-influence/suffix-susceptibility factors.
- For stochastic agents, adopt **three-valued regression verdicts + SPRT** and store traces for **trace-first offline checks** to cut CI token cost.
- If using activation steering, treat the steering dataset as security-critical: test robustness under **coordinated behavior injection** and consider robust mean estimation (Lee–Valiant) rather than raw means.
- For privacy in tool-using agents, prototype a **post-tool-result instructor** (CDI-like) and train it on **adversarially discovered failure prefixes**; measure PP/HS/AD trade-offs and cold-start behavior.
- For multimodal systems, evaluate cross-modal hallucination with **modality corruption tests** and consider preference objectives that explicitly enforce **invariance/sensitivity** (MoD-DPO-style) rather than only response-level preferences.
- Use “live” agent benchmarks (or internal equivalents) that include **tool instability** and **environment knowledge**; track failure causes separately (execution failure vs reasoning vs missing info).
- Expand cognitive diagnostics beyond standard benchmarks: add at least one **working-memory/state** task (SWM-like) and one **flexibility** task (WCST-like) with process metrics to catch “trivial-for-humans” failures.

---
*Generated from per-paper analyses; no external browsing.*
