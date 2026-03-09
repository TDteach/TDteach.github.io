# AI Paper Insight Brief
## 2026-03-10

### 0) Executive takeaways (read this first)
- **Counterfactual signals are becoming the workhorse for training and data selection**: multiple papers use “remove/mask a modality or feedback” to create dense learning signals (VisNec for multimodal data filtering; InfoPO for turn-level RL credit).
- **Evaluation is shifting from end-task scores to *typed, auditable failure modes***: canonical DSL scoring for geometric perception (GEOPERCEIVE), subset-level statistical tests for unlearning (SDE), agentified assessment with structured runtime failure labels (AAA on FOLIO), and rubric+atomic-claim factuality in medicine (PanCanBench).
- **Small, specialized “critics/routers” are a practical robustness lever**: Tiny-Critic RAG shows a LoRA-tuned 1.7B router can approach a heavyweight evaluator’s routing quality while cutting TTFT and cost by ~an order of magnitude.
- **Multimodal efficiency gains look real and mechanistic**: visual-token analyses suggest ~40% of projected visual tokens are sink/dead and can be pruned without hurting (sometimes improving) performance; mid-layer injection can often replace early visual processing.
- **Privacy/security threats are broadening beyond APIs**: EM side-channels can leak GPU Tensor Core computations (near-field extraction demonstrated; far-field leakage shown as PoC), and FL backdoors can be *architecture-amplified* (SCC/SRS metrics predict success).
- **Governance/alignment work is pushing “architectural limits” and “boundary semantics”**: one paper argues RLHF-style optimization cannot be norm-responsive in principle; another formalizes second-order “authority expansion” as a first-class governance event requiring atomic Decide→Anchor→Effect and replayable witnesses.

### 2) Key themes (clusters)

### Theme: Counterfactual signals for better credit assignment & data efficiency

- **Why it matters**: Sparse rewards and noisy multimodal supervision waste compute and produce brittle agents/models. Counterfactual comparisons create dense, task-relevant signals without requiring new labels.
- **Representative papers**:
  - [InfoPO: Information-Driven Policy Optimization for User-Centric Agents](https://arxiv.org/abs/2603.00656)
  - [VisNec: Measuring and Leveraging Visual Necessity for Multimodal Instruction Tuning](https://arxiv.org/abs/2603.01195)
  - [ENHANCING GEOMETRIC PERCEPTION IN VLMs VIA TRANSLATOR-GUIDED REINFORCEMENT LEARNING](https://arxiv.org/abs/2602.22703)
- **Common approach**:
  - Compute a **difference signal** between factual vs masked/ablated context (mask user feedback; blind image pass; translate NL→DSL for structured scoring).
  - Use the difference as **dense per-turn / per-sample reward** or selection score, then fuse with outcome rewards (InfoPO) or preference learning (GeoDPO).
  - Add **stabilizers** (variance gating in InfoPO; DPO regularization; clustering+top-r% selection in VisNec).
- **Open questions / failure modes**:
  - Counterfactual inputs can be **out-of-distribution** (VisNec notes blind pass OOD; relies on intra-cluster ranking to mitigate).
  - Compute overhead (InfoPO requires extra teacher-forced forward passes per turn).
  - Reward hacking / over-querying risk if information gain dominates outcome reward (InfoPO mitigates via variance-gated fusion).

### Theme: “Auditable evaluation” via canonicalization, rubrics, and structured failure typing

- **Why it matters**: End-to-end accuracy hides whether failures come from perception, translation, tool/runtime errors, or factuality. Auditable decompositions enable targeted fixes and safer deployment.
- **Representative papers**:
  - [GEOPERCEIVE / GeoDPO (geometric perception)](https://arxiv.org/abs/2602.22703)
  - [UNLEARNING EVALUATION THROUGH SUBSET STATISTICAL INDEPENDENCE (SDE)](https://arxiv.org/abs/2603.00587)
  - [Agentified Assessment of Logical Reasoning Agents](https://arxiv.org/abs/2603.02788)
  - [PanCanBench: pancreatic oncology benchmark](https://arxiv.org/abs/2603.01343)
- **Common approach**:
  - Define **canonical targets** (GEODSL) or **typed outputs** (TRUE/FALSE/UNCERTAIN + TIMEOUT/PARSEERROR).
  - Use **statistical tests** rather than per-sample attacks for auditing (split-half HSIC for subset membership).
  - Use **rubric criteria + atomic-claim checking** to separate completeness from factual errors (PanCanBench).
- **Open questions / failure modes**:
  - Reference-set dependence and kernel/bandwidth sensitivity in SDE; cost scaling \(O(m|S|^2 d)\).
  - LLM-as-judge bias despite validation (PanCanBench shows κ comparable to humans but still a judge-model dependency).
  - Canonical DSL coverage limits (GEODSL currently misses some quantitative/algebraic constraints).

### Theme: Lightweight gating/critique for robust agentic RAG

- **Why it matters**: Agentic pipelines can cascade failures from noisy retrieval into long tool-use loops; heavyweight critics add latency/cost. A small deterministic router can prevent waste early.
- **Representative papers**:
  - [Tiny-Critic RAG](https://arxiv.org/abs/2603.00846)
  - [EvoSkill: Automated Skill Discovery for Multi-Agent Systems](https://arxiv.org/abs/2603.02766)
  - [HiMAP-Travel: Hierarchical Multi-Agent Planning](https://arxiv.org/abs/2603.04750)
- **Common approach**:
  - Insert **explicit control points**: binary routing (Tiny-Critic), transactional CHECK/COMMIT/ROLLBACK (HiMAP), skill triggers/metadata (EvoSkill).
  - Prefer **cheap, structured decisions** over full “reflective” generation (Tiny-Critic’s constrained 1-token decoding).
  - Use **held-out validation** to accept improvements (EvoSkill frontier) or ablations to prove necessity (HiMAP).
- **Open questions / failure modes**:
  - Generalization beyond constructed noise protocols (Tiny-Critic evaluated on 5k queries with ρ=0.45).
  - Transactional monitors only cover tracked invariants (HiMAP’s Σ doesn’t enforce all constraints like min-nights/route feasibility).
  - Limited variance reporting (EvoSkill single-run due to compute).

### Theme: Multimodal internals: sparsity, redundancy, and evidence grounding

- **Why it matters**: If many visual tokens are non-informative, we can cut compute and potentially reduce hallucination. For high-stakes domains (medicine), explicit evidence can improve accountability.
- **Representative papers**:
  - [What Do Visual Tokens Really Encode?](https://arxiv.org/abs/2603.00510)
  - [CARE: Clinical accountability with evidence-grounded agentic framework](https://arxiv.org/abs/2603.01607)
  - [Evaluating AI Grading on Real-World Handwritten College Mathematics](https://arxiv.org/abs/2603.00895)
- **Common approach**:
  - Probe representations directly (EmbedLens) and validate with pruning/ablation.
  - Decompose pipelines into **specialists + coordinator** with explicit evidence artifacts (CARE: entity proposal → referring segmentation → evidence-grounded VQA).
  - Use **human-in-the-loop evaluation** when ground truth is ambiguous (handwritten grading; CARE trace pass rates).
- **Open questions / failure modes**:
  - Encoder dependence: sink/dead clustering prominent for some CLIP ViTs but not all encoders.
  - Evidence tools can still hallucinate (CARE notes coordinator hallucination; segmentation quality dependence).
  - OCR and rubric ambiguity remain major error sources in handwritten grading.

### Theme: Privacy & security: from unlearning audits to physical and federated threats

- **Why it matters**: Safety isn’t only about outputs—models can leak training data, be backdoored in distributed training, or have weights stolen via side-channels.
- **Representative papers**:
  - [SDE unlearning evaluation](https://arxiv.org/abs/2603.00587)
  - [MiM-MU: mutual-information minimization for diffusion unlearning](https://arxiv.org/abs/2603.00992)
  - [Kraken: EM side-channel attacks on GPUs](https://arxiv.org/abs/2603.02891)
  - [Structure-Aware Distributed Backdoor Attacks in FL](https://arxiv.org/abs/2603.03865)
  - [PTOPOFL: persistent homology descriptors for FL](https://arxiv.org/abs/2603.04323)
- **Common approach**:
  - Replace brittle heuristics with **principled signals**: HSIC dependence (SDE), mutual information objective (MiM-MU), topology descriptors (PTOPOFL), architecture sensitivity metrics (SRS/SCC).
  - Evaluate under **OOD / sequential / degraded** settings (MiM-MU sequential unlearning + COCO-10k OOD; FL under DP/Krum; EM far-field through glass PoC).
- **Open questions / failure modes**:
  - MiM-MU uses an approximation (omits pre-trained U-Net Jacobian) and struggles with entangled concepts.
  - PTOPOFL theory assumes strongly convex objectives; PH computation scalability (subsampling used).
  - EM far-field extraction remains costly (PoC-level), but leakage existence changes threat modeling.

### Theme: Alignment & governance as architectural/semantic constraints

- **Why it matters**: If certain safety properties require architectural features (interrupts, incommensurable constraints, non-bypassable boundaries), “more RLHF” may not fix them; governance must track second-order capability expansion.
- **Representative papers**:
  - [Agency and Architectural Limits: Why Optimization-Based Systems Cannot Be Norm-Responsive](https://arxiv.org/abs/2602.23239)
  - [AI Space Physics: Constitutive boundary semantics for open AI institutions](https://arxiv.org/abs/2603.03119)
  - [VISA: Value Injection via Shielded Adaptation](https://arxiv.org/abs/2603.04822)
- **Common approach**:
  - Specify **formal/functional requirements** (normative standing; membrane decision functions; witness/atomicity laws).
  - Decouple concerns via **modularity** (VISA freezes base knowledge and trains a rewriter with value+consistency rewards).
- **Open questions / failure modes**:
  - Conceptual work lacks instantiated non-optimization architectures (norm-responsiveness paper).
  - Governance semantics depend on strong scope conditions (channel completeness, non-bypassability, witness integrity).
  - VISA depends on Schwartz values and judge/distillation pipelines (GPT-4o), with dataset bias concerns.

### 3) Technical synthesis
- **Counterfactual evaluation is converging across domains**: mask user feedback (InfoPO), mask vision tokens (VisNec), translate NL to canonical DSL for scoring (GeoDPO). This pattern yields dense signals without new human labels.
- **Preference/RL fine-tuning is being “instrumented” by structured evaluators**: GeoDPO uses a translator to turn free-form NL into element-level rewards; CARE uses verifiable rewards (matching, format, entropy-based confidence) for specialist modules.
- **Canonical representations reduce ambiguity in supervision**: GEODSL makes diagram→program mapping unique; AAA forces deterministic label parsing; PanCanBench uses question-specific rubrics with atomic-claim factuality checks.
- **Efficiency work is increasingly mechanistic rather than heuristic**: EmbedLens + clustering identifies sink/dead/alive tokens and validates pruning; Tiny-Critic uses constrained decoding (Lmax=1) to make routing deterministic and cheap.
- **“Global state” patterns are emerging for long-horizon constraint satisfaction**: HiMAP’s transactional Σ is an explicit external memory enforcing invariants; similar spirit to governance “membrane” semantics (Decide→Anchor→Effect) but at task level.
- **Security evaluation is broadening to non-standard channels**: EM leakage on Tensor Cores suggests model confidentiality needs physical-layer considerations; FL backdoors depend on architecture (SCC) and temporal coordination.
- **Unlearning verification is moving from per-sample MIAs to subset-level tests**: SDE’s split-half HSIC provides a standalone audit signal that can disagree with ASR-style membership metrics.
- **Medical safety evaluation is becoming rubric- and claim-centric**: PanCanBench shows web search doesn’t reliably improve rubric scores and can crowd out internal knowledge; CARE pushes pixel-level evidence as accountability artifacts.
- **Synthetic data pipelines are getting stricter about validation**: CHIMERA uses dual-verifier filtering and low n-gram overlap checks; ARC-TGI uses executable witnesses and episode-level constraints to prevent degenerate samples.
- **Role of middle layers keeps recurring**: visual-token work finds projection norms align to mid-layers; INTRA finds intermediate layers most informative for retrieval-free fact checking.

### 4) Top 5 papers (with “why now”)

1) [VisNec: Measuring and Leveraging Visual Necessity for Multimodal Instruction Tuning](https://arxiv.org/abs/2603.01195)
- Shows **15% of data** can match/exceed full-data tuning (e.g., 100.2% on LLaVA-665K; 115.8% on Vision-Flan).
- Uses a simple, scalable **blind-vs-multimodal loss difference** plus clustering to keep diversity.
- Practical “why now”: multimodal training costs are exploding; this is a direct lever to cut compute while improving grounding.
- **Skepticism**: blind forward pass is OOD; strict filtering of non-positive scores may discard partially useful samples.

2) [InfoPO: Information-Driven Policy Optimization for User-Centric Agents](https://arxiv.org/abs/2603.00656)
- Introduces **turn-level counterfactual info-gain** reward to fix long-horizon credit assignment.
- Adaptive variance gate ties intrinsic signal to when external reward is non-discriminative (many zero-variance rollout groups reported).
- Practical “why now”: interactive agents are everywhere; sparse terminal rewards are a major blocker for RL training stability.
- **Skepticism**: extra forward passes per turn increase training cost; simulator fidelity affects results.

3) [PanCanBench: A Comprehensive Benchmark for Evaluating LLMs in Pancreatic Oncology](https://arxiv.org/abs/2603.01343)
- Real patient/caregiver questions (282) with **3,130 rubric criteria**; measures completeness + factual errors.
- Finds **web search doesn’t reliably improve** rubric scores and can cause omissions; AI-generated rubrics inflate scores (+17.9 pts).
- Practical “why now”: patient-facing medical use is rising; this benchmark directly targets deployment risk.
- **Skepticism**: single-disease scope; judge-model dependence despite validation.

4) [ENHANCING GEOMETRIC PERCEPTION IN VLMs VIA TRANSLATOR-GUIDED REINFORCEMENT LEARNING](https://arxiv.org/abs/2602.22703)
- Canonical GEODSL + program-level metric isolates perception; GeoDPO improves in-domain perception (example +26.5%) and downstream geometry reasoning (up to +39% on MathVista geometry subset).
- Translator keeps policy in **natural language** while still getting structured rewards.
- Practical “why now”: diagram/geometry failures are a common VLM hallucination mode; this offers both benchmark + fix.
- **Skepticism**: depends on translator quality; GEODSL currently misses quantitative/algebraic constraints.

5) [Tiny-Critic RAG: Empowering Agentic Fallback with Parameter-Efficient Small Language Models](https://arxiv.org/abs/2603.00846)
- LoRA-tuned 1.7B router achieves **routing F1 0.912** vs gpt-4o-mini 0.934, with **TTFT 492 ms vs 1235 ms** and **CPQ $0.06 vs $3.00** per 10k queries.
- Constrained 1-token decoding makes routing deterministic and cheap.
- Practical “why now”: high-throughput agentic RAG needs latency/cost control without sacrificing robustness.
- **Skepticism**: evaluation uses a specific adversarial noise protocol and a 5k-query corpus; broader noise distributions not shown.

### 5) Practical next steps
- **Adopt counterfactual scoring in your pipeline**: implement (text-only vs multimodal) loss deltas to filter/weight multimodal instruction data (VisNec-style), and measure whether hallucination/grounding improves at fixed compute.
- **Instrument agent training with dense turn-level signals**: prototype InfoPO-style masked-feedback info-gain and compare learning curves vs GRPO/PPO baselines on your multi-turn tasks; track “zero outcome-variance” frequency early in training.
- **Add a small local router before expensive critics/tools**: replicate Tiny-Critic’s constrained decoding gate for “retrieval is contaminated?” or “tool call needed?” decisions; measure TTFT, CPQ, and faithfulness deltas.
- **Separate perception from reasoning in eval**: for diagram-heavy domains, consider a canonical intermediate representation (DSL/program) and score at the representation level (GEOPERCEIVE pattern) to localize failures.
- **For unlearning audits, test subset-level dependence**: try SDE/HSIC-style split-half dependence on candidate forget sets; compare conclusions to membership-attack ASR and look for disagreements (as reported for Unroll).
- **Harden your threat model beyond APIs**: if you deploy on shared/accessible hardware, review physical side-channel exposure assumptions (Kraken) and consider operational mitigations (shielding, access control, workload isolation).
- **In FL or distributed training, include architecture in backdoor risk assessment**: measure whether your model family exhibits high “compatibility” with structured triggers (SCC/SRS idea) and test defenses under DP/robust aggregation.
- **For high-stakes domains, prefer rubric + atomic-claim evaluation**: emulate PanCanBench’s separation of completeness vs factual errors; explicitly test whether web search “crowds out” internal knowledge for your model.

---
*Generated from per-paper analyses; no external browsing.*
