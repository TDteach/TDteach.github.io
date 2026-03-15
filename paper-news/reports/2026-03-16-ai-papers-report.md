# AI Paper Insight Brief
## 2026-03-16

### 0) Executive takeaways (read this first)
- **“Self-report / recall” evaluations for agents can be structurally misleading**: identity ingredients may appear within a window without ever *co-instantiating* at a decision step, so “stable identity” can fail to constrain actions even when tests pass ([Time, Identity and Consciousness in Language Model Agents](https://arxiv.org/abs/2603.09043v1)).
- **Structured, executable intermediates are winning across domains**: object–attribute world states for reward estimation, relational schemas + SQL for multi-doc QA, meta-graphs + operator execution for messy tables, and AST allocentric maps for spatial reasoning all show sizable gains vs flat-text/RAG baselines.
- **LLM-as-judge is increasingly the bottleneck**: multimodal agent benchmarks show judge inconsistency and safety-label noise; rubric-guided RL and policy/label pipelines depend heavily on judge calibration and can be gamed or drift ([MM-tau-p²](https://arxiv.org/abs/2603.09643v1), [RubiCap](https://arxiv.org/abs/2603.09160v1)).
- **Agentic “plan–execute–verify–repair” loops are moving from demos to measurable engineering wins**: mobile kernel generation jumps from low compile/correctness to high CSR/FCR with multi-agent iteration and hardware-in-loop evaluation ([MobileKernelBench](https://arxiv.org/abs/2603.11935v1)); similar closed loops appear in tabular research and RL environment translation.
- **Continual learning is splitting into two practical recipes**: (a) world-model replay with distribution-matching buffers reduces forgetting in continual RL ([ARROW](https://arxiv.org/abs/2603.11395v1)); (b) for large pretrained VLAs, *simple* sequential LoRA + on-policy RL can yield near-zero forgetting across benchmarks ([Simple Recipe Works](https://arxiv.org/abs/2603.11653v1)).
- **Safety/compliance work is becoming pipeline-verified and auditable**: large-scale PP↔DS discrepancy detection triangulated with APK evidence ([PrivPRISM](https://arxiv.org/abs/2603.09214v1)) and falsifiable “proof-carrying” certificates for ML interatomic potentials with adversarial search + Lean proofs ([Proof-Carrying Materials](https://arxiv.org/abs/2603.12183v1)).

### 2) Key themes (clusters)

### Theme: Temporal grounding & “identity actually constrains action”

- **Why it matters**: Agent evaluations that check whether traits/memories appear *somewhere* in context can overestimate stability and safety; what matters is whether the full grounded conjunction is present at the decision step.
- **Representative papers**:
  - [Time, Identity and Consciousness in Language Model Agents](https://arxiv.org/abs/2603.09043v1)
  - [AI Knows What's Wrong But Cannot Fix It: Helicoid Dynamics in Frontier LLMs Under High-Stakes Decisions](https://arxiv.org/abs/2603.11559v1)
- **Common approach**:
  - Formalize agent scaffolds / interaction steps and define operational metrics over traces.
  - Emphasize regimes where meta-recognition or recall exists but behavior does not reliably change.
- **Open questions / failure modes**:
  - How to instrument real agent stacks to measure co-instantiation (vs ingredient occurrence) at action time.
  - Whether interventions that improve “recognition” (reflection, self-critique) can reliably improve behavior in unverifiable/high-stakes settings.

### Theme: Structured state & reward as a backbone for planning

- **Why it matters**: Zero-shot/generalizable planning needs dense progress signals; flat text similarity or judge-based rewards often misalign with step-wise task progress.
- **Representative papers**:
  - [Reward Prediction with Factorized World States](https://arxiv.org/abs/2603.09400v1)
  - [ARROW: Augmented Replay for RObust World models](https://arxiv.org/abs/2603.11395v1)
- **Common approach**:
  - Build factorized latent/state representations (object–attribute beliefs; RSSM world models).
  - Use replay/imagined rollouts to train policies while controlling forgetting.
- **Open questions / failure modes**:
  - Sensitivity to embedding/LLM choice for state extraction and similarity geometry (StateFactory).
  - Task-order and reward-scale sensitivity in continual settings; fixed buffer splits and scaling issues (ARROW).

### Theme: RAG is becoming “structure-first” (schemas, chunks, operators)

- **Why it matters**: Retrieval quality is increasingly limited by upstream structuring (chunking, schema discovery, table meta-structure), not just embedding models.
- **Representative papers**:
  - [DocSage: An Information Structuring Agent for Multi-Doc Multi-Entity Question Answering](https://arxiv.org/abs/2603.11798v1)
  - [QChunker: Learning Question-Aware Text Chunking for Domain RAG via Multi-Agent Debate](https://arxiv.org/abs/2603.11650v1)
  - [Deep Tabular Research via Continual Experience-Driven Execution](https://arxiv.org/abs/2603.09151v1)
- **Common approach**:
  - Convert unstructured corpora into query-aware structured artifacts (relational tables + SQL; question-aware chunks; operation graphs).
  - Use execution feedback (SQL execution, operator execution) and iterative correction/memory.
- **Open questions / failure modes**:
  - Cost/latency of multi-stage pipelines and robustness under noisy/contradictory documents.
  - Whether chunk “completion” can introduce subtle leakage or overfitting to document phrasing (needs careful constraints; QChunker claims completion uses only explicit doc info).

### Theme: Multimodal evaluation realism (voice, figures, long papers)

- **Why it matters**: Text-only evaluation overstates capability; real deployments involve speech, figures, and long multimodal documents where attention dilution and pipeline noise dominate.
- **Representative papers**:
  - [MM-tau-p$^2$: Persona-Adaptive Prompting for Robust Multi-Modal Agent Evaluation in Dual-Control Settings](https://arxiv.org/abs/2603.09643v1)
  - [Do What I Say: A Spoken Prompt Dataset for Instruction-Following](https://arxiv.org/abs/2603.09881v1)
  - [SciMDR: Benchmarking and Advancing Scientific Multimodal Document Reasoning](https://arxiv.org/abs/2603.12249v1)
  - [MaterialFigBENCH](https://arxiv.org/abs/2603.11414v1)
- **Common approach**:
  - Build benchmarks that force grounding in modality-specific evidence (spoken prompts; figures; full-paper contexts).
  - Add explicit localization / rubric-based judging and analyze modality gaps.
- **Open questions / failure modes**:
  - Judge inconsistency and correlated label noise (MM-tau-p²).
  - Memorization shortcuts where models answer without using figures (MaterialFigBENCH).
  - Large oracle→full-context drops indicating unresolved long-context multimodal retrieval (SciMDR).

### Theme: Agentic engineering loops with hard verifiers (compile/run/measure)

- **Why it matters**: When verifiers exist (compilers, unit tests, on-device benchmarks), multi-agent iterative repair can turn LLMs into practical automation tools.
- **Representative papers**:
  - [MobileKernelBench: Can LLMs Write Efficient Kernels for Mobile Devices?](https://arxiv.org/abs/2603.11935v1)
  - [Automatic Generation of High-Performance RL Environments](https://arxiv.org/abs/2603.12145v1)
  - [GenePlan: Evolving Better Generalized PDDL Plans using Large Language Models](https://arxiv.org/abs/2603.09481v1)
- **Common approach**:
  - Iterative generate→validate→repair loops with increasingly strong verification (compile + functional tests + performance; L1–L4 verification; plan validators).
  - Search/optimization over programs (evolutionary selection; multi-agent roles).
- **Open questions / failure modes**:
  - Generalization across frameworks/devices/backends (MobileKernelBench currently MNN CPU on one SoC).
  - Empirical verification coverage vs rare-path bugs (RL env translation uses finite rollout tests).
  - Domains without compact general strategies remain hard (GenePlan on Sokoban).

### Theme: Auditable safety/compliance pipelines (privacy + concept erasure + formal certs)

- **Why it matters**: Deployment needs *inspectable* artifacts (matrices, proofs, structured discrepancies) rather than opaque “model says it’s safe”.
- **Representative papers**:
  - [PrivPRISM](https://arxiv.org/abs/2603.09214v1)
  - [OrthoEraser: Coupled-Neuron Orthogonal Projection for Concept Erasure](https://arxiv.org/abs/2603.11493v1)
  - [Proof-Carrying Materials](https://arxiv.org/abs/2603.12183v1)
- **Common approach**:
  - Combine LLM extraction with verifier models / constraints (self-supervised verifiers; logical envelopes; geometric null-space projection).
  - Triangulate across sources (policy text vs DS labels vs APK evidence; adversarial search + DFT recomputation; safety vs fidelity metrics).
- **Open questions / failure modes**:
  - Static analysis misses runtime behavior (PrivPRISM).
  - SAE quality and limited null-space for mass erasure (OrthoEraser).
  - Proofs certify reasoning under axioms, not physics; compositional probes may differ from real structures (PCM).

### 3) Technical synthesis
- Many papers converge on **“intermediate representations as contracts”**: AST (allocentric spatial tree), object–attribute states, relational schemas/SQL tables, meta-graphs for tables, and rubrics for captions all serve as *checkable* interfaces between perception/retrieval and generation.
- **Closed-loop execution feedback** is the dominant robustness lever: operator execution traces (DTR), compile/test/profile (MobileKernelBench), hierarchical verification (RL env translation), SQL execution + constraint checking (DocSage), and VQA boolean success checks + reset FSM (RADAR).
- **Evaluation is shifting from single scalar scores to multi-metric dashboards** (MM-tau-p²’s 12 metrics; identity weak/strong persistence; compliance matrices; EPIC distance for reward prediction), reflecting that “pass/fail” hides failure modes.
- **Judge dependence is a recurring fragility**: rubric RL uses an LLM judge; MM-tau-p² shows judge inconsistency; SciMDR uses LLMs for synthesis and evaluation; these pipelines need calibration/robustness checks akin to software testing.
- **Continual learning results suggest architecture matters more than “CL tricks” in some regimes**: world-model replay buffers (ARROW) vs large-pretrained + LoRA + on-policy RL (VLA continual RL) show different paths to stability.
- **RAG-specific insight**: upstream chunking/schema/structure can dominate downstream QA quality; QChunker’s ChunkScore correlates strongly with ROUGE-L (λ≈0.3), and DocSage’s structured extraction is the most critical ablated component.
- **Safety/robustness is becoming geometry- and logic-aware**: OrthoEraser uses null-space projection to avoid collateral damage; DocSage uses cross-record constraints; PCM uses bootstrap envelopes + Lean proofs.
- **Modality realism exposes hidden gaps**: spoken prompts degrade text-output tasks (DOWIS), persona conditioning can degrade safety recall (MM-tau-p²), and full-paper contexts sharply reduce performance vs oracle contexts (SciMDR).

### 4) Top 5 papers (with “why now”)

1) [Time, Identity and Consciousness in Language Model Agents](https://arxiv.org/abs/2603.09043v1)
- Formalizes a concrete eval failure: within-window “occurrence” doesn’t imply decision-time co-instantiation (Theorem 3.10), so recall/self-report can be false reassurance.
- Provides instrumentable metrics (weak/strong persistence) and an algorithm to compute them from traces—actionable for agent stack logging.
- Architectural implications: RAG can raise weak persistence while not improving (or reducing) strong persistence; concurrency capacity bounds co-instantiation.
- **Skepticism**: theoretical/methodological; no empirical measurements reported.

2) [DocSage: An Information Structuring Agent for Multi-Doc Multi-Entity Question Answering](https://arxiv.org/abs/2603.11798v1)
- Big empirical jump on MDMEQA: 0.892 vs 0.620 for GPT-4o+RAG on MEBench (+27.2pp).
- Shows a practical recipe: interactive schema discovery + constraint-checked extraction + SQL reasoning with provenance.
- Ablations identify what matters most (structured extraction).
- **Skepticism**: multi-stage pipeline cost and dependence on foundation model quality; may degrade on very noisy/contradictory corpora.

3) [MobileKernelBench: Can LLMs Write Efficient Kernels for Mobile Devices?](https://arxiv.org/abs/2603.11935v1)
- Demonstrates that “LLM writes kernels” is mostly blocked by compilation/API hallucinations—until you add repository-aware multi-agent iteration + device-in-loop verification.
- MoKA reaches CSR 93.7% and FCR 75.3%, with 27.4% kernels >1.5× faster than native MNN; includes a 6.82× LayerNorm2D case study.
- Provides a benchmark + automated pipeline (registration→compile→verify→on-device perf).
- **Skepticism**: evaluated on one engine (MNN CPU) and one device/SoC; broader backend generality untested.

4) [PrivPRISM](https://arxiv.org/abs/2603.09214v1)
- Large-scale measurement: ~53% PP–DS discrepancies in 7,770 popular games; ~61% in 1,711 non-game apps.
- Encoder–decoder + self-supervised verifiers is a pragmatic pattern for reducing LLM hallucinations while keeping interpretability.
- Triangulates with APK static analysis and manual audits (e.g., policy URL redirection issues).
- **Skepticism**: static analysis can miss runtime behavior; some discrepancies may be interpretive/ambiguous.

5) [Proof-Carrying Materials: Falsifiable Safety Certificates for Machine-Learned Interatomic Potentials](https://arxiv.org/abs/2603.12183v1)
- Quantifies a severe deployment failure: MLIP screening recall 0.07 on 25k materials (misses 93% of DFT-stable).
- PCM pipeline combines adversarial search, bootstrap safety envelopes, and Lean 4 machine-checked proofs; validates failures with independent DFT recomputation (20/20, median force ratio ~12×).
- Adds a prospective risk model (AUC-ROC 0.938 ± 0.004) and a case study improving thermoelectric yield (+62 stable materials at 20% DFT budget).
- **Skepticism**: proofs depend on axioms; DFT is ground truth (not experiment); compositional probes introduce approximation gaps.

### 5) Practical next steps
- **Agent evaluation**: add trace-level logging of “identity ingredient activations” and compute both **Pweak and Pstrong**; treat recall/self-report as weak evidence unless co-instantiation at action time is shown.
- **RAG systems**: pilot **structure-first pipelines**—(a) question-aware chunking + completion (QChunker-style), or (b) query-specific schema + constraint-checked extraction + SQL (DocSage-style)—and measure gains vs embedding-only RAG.
- **Judge reliability**: for any LLM-as-judge metric, run **multi-judge / multi-seed consistency checks** and explicitly track disagreement rates (MM-tau-p² shows correlated label noise on escalation cases).
- **Closed-loop agents**: where verifiers exist (compile/tests/execution), invest in **iterative repair loops** with role separation (coder/debugger/optimizer) and hardware-in-loop measurement (MobileKernelBench pattern).
- **Continual learning**: if you’re doing continual RL, compare (i) **world-model replay with distribution-matching buffers** (ARROW) vs (ii) **SeqFT + LoRA + on-policy RL** (for large pretrained VLAs) under the same task-order perturbations.
- **Multimodal realism**: add spoken-prompt evaluation (DOWIS-style) and full-document multimodal QA with explicit localization (SciMDR-style) to avoid overestimating capability from text-only tests.
- **Safety/compliance auditing**: adopt “auditable artifacts” (compliance matrices, discrepancy reports, safety envelopes) and triangulate across sources (policy text + declarations + code evidence; adversarial discovery + independent recomputation).

---
*Generated from per-paper analyses; no external browsing.*
