# 2026-10-17

## In 46 SimpleRL 7B Comparisons, Most Harness-Reported Gain Is Format Gain

*[Same Answer, New Box: How Much of RLVR's Out-of-Domain Gain Is Answer Format?](https://arxiv.org/abs/2610.20639v1)*

RLVR transfer claims can contain an evaluation artifact: benchmark accuracy is read from generated text by an answer extractor, so a model can score higher by placing an already stated answer where the extractor looks without answering better. This paper tests that possibility for out-of-domain multiple-choice gains.

The method changes measurement, not training. For each base–RL pair, benchmark, and prompt, the authors hold generated outputs fixed and score the same outputs with two readers: a public-code harness extractor and a study-written fixed extractor that reads a stated answer in either an answer box or specified text positions. The fixed extractor treats the two models alike, abstains when it finds no answer, and scores abstentions wrong. Format gain is the harness-reported gain minus the fixed-extractor gain; the pooled share is the sum of format gains divided by the sum of reported gains.

Across 46 eligible comparisons from four released 7B SimpleRL base–RL pairs on MMLU, MMLU-Pro, and ARC-Challenge, the pooled format share is 82.2% (95% item-bootstrap CI: 77.4–87.2%). Thus, most gain reported by the selected harness extractors is absent under the common reader. The figure describes the study’s generated outputs and protocol, not the checkpoints’ published evaluation numbers. The proposed mechanism is an answer-location shift: among outputs readable by the fixed extractor, 26.6% of base-model answers versus 58.3% of RL answers contained a box, which box-first extractors preferentially read. Two blinded LLM readers with a third resolver produced a 77.1% format share on a sample, but the sample was too small to establish a difference from 82.2%. No human read the responses.

The result is also reader-sensitive: across 112 pair–benchmark–prompt combinations, the largest and smallest harness gains on identical outputs differed by a median of 15 points (10 points excluding simple-evals’ two extractors). The boundary matters. On the one Qwen2.5-32B pair with a decomposable gain, format share was 2.1% (95% CI −18.5% to 19.9%); the paper cannot separate scale from training recipe or base-model behavior. Nor does the study decompose any published SimpleRL-Zoo score. Its main estimate covers one release family at 7B.

For a practical audit, re-score stored generations before rerunning RL: preserve the original harness, add a common reader that accepts both boxed and textual answers, publish extraction and abstention rates, and repeat the comparison across prompts and readers. The operation avoids rerunning RL, but its interpretation remains protocol-dependent: a format share is a result of the pair, prompt, and extractors together, not an intrinsic property of RL.

It gives a concrete post-generation audit for deciding whether an RLVR transfer result survives a matched answer-reading rule.

[abstract; Section 2.1, “Two gains from the same outputs”; Section 4.1; Figure 2 caption; Appendix D, Table 8; Section 4.2; Section 4.3; Appendix C, “Result”; Section 4.4; Appendix E, Table 18; Section 6, “Scale”; Appendix G, Table 22; Section 6, “No published gain is decomposed”; Section 6, “One release family at 7B”; Section 6, “The readers”; Section 4.3; Section 6, “Prompts”; Appendix B, “The pilot’s own result”](https://arxiv.org/abs/2610.20639v1)

## In controlled trace conflicts, separate answer calls follow current evidence more often than continuation

*[When Reasoning Traces Conflict with Evidence: How Answer Configuration Shapes Evidence Following](https://arxiv.org/abs/2610.20805v1)*

A reasoning trace can improve accuracy without being the source an answer follows when evidence changes. This paper separates two properties: trace contribution, measured by the accuracy change from retaining the trace, and conflict response, measured by whether an answer follows current evidence or the trace when they disagree. It measures both on the same evidence pairs and saved traces, rather than treating trace deletion as a proxy for source arbitration.

Earlier behavioral CoT probes tested answer changes under complementary interventions; this paper instead tests arbitration between a trace and verified, conflicting evidence.

For each question, the authors create original and edited evidence versions with different targets, generate a trace from each, and retain pairs whose traces state their own target but not the other. Each trace is then paired with both evidence versions, producing matched and crossed cells; crossed outputs are labeled evidence-following, trace-following, or neither/both. Continuation places the trace in the thinking block after the evidence; a separate answer call puts the trace and evidence in a new request with thinking off. This contrast also changes trace placement, input order, and instruction; component tests attribute much of the effect to input order for two of three models, but not for gpt-oss-20b.

On 533 retained HotpotQA pairs for gpt-oss-20b with gold evidence, the separate call follows current evidence 54.0 percentage points more often than continuation, with a paired 95% bootstrap interval of [+50.6, +57.4]. Across the tested models, continuation repeats the stale trace conclusion in 65.6% to 87.0% of crossed answers. Yet, on the same pairs, removing the trace lowers accuracy by similar amounts under both configurations. This is the central empirical distinction: benefiting from a trace and deferring to it are not the same property.

In tested Qwen3-4B and Qwen3-14B settings, the final line alone stays within 2.0 exact-match points of the full trace on both datasets. In one Qwen3-14B HotpotQA setting, renewed reasoning follows current evidence in 86.6% of crossed answers, whereas the tested verification instruction does not materially reduce trace-following; renewed reasoning also generates more text.

Interpretation is bounded: the conflicts are automatically constructed by editing evidence and retaining pairs whose traces explicitly express competing answers. Automatic screening can leave residual implications of the original answer in edited evidence, and generalization to naturally updated evidence, other tasks, or less explicit traces remains unestablished. Because the configuration contrast changes several prompt and model details, the 54.0-point result should be read as a configuration comparison, not a pure trace-placement intervention.

For a new evaluator, preserve traces and evidence as separate artifacts, create paired evidence revisions, and report two numbers together: accuracy change after trace removal and evidence-following in crossed cells. Then vary trace placement and input order, and test renewed reasoning as a correction baseline. The operational question is not only whether the trace helps, but which source the answer follows when it conflicts with current evidence.

Read this for a useful evaluation distinction: deleting a chain of thought can show that it affects accuracy, but cannot by itself show whether the model follows it over updated evidence. The paper tests that distinction with matched inputs and reports concrete configuration effects, plus practical probes of trace content, evidence timing, distractors, and correction.

[abstract; Section 1, contributions; Section 2.2; Section 2.1, “Stages and Answer Configurations”; Section 5.2; Appendix D, Table 12, HotpotQA, gpt-oss-20b row; Section 3.3, “Continuation Retains the Stale Conclusion”; Section 4.1; Appendix E.1, Table 23; Section 5.1, Table 3; Limitations; Appendix C.1, “Residual leakage”](https://arxiv.org/abs/2610.20805v1) · [Section 1, paragraph 2](https://arxiv.org/abs/2307.13702v1)

## INFUSE Measures Prompt Injection Across Terminal-Agent Surfaces and Workflows

*[INFUSE: A Unified Surface Benchmark for Indirect Prompt Injection in Agentic Systems](https://arxiv.org/abs/2610.20776v1)*

INFUSE is an evaluation benchmark for indirect prompt injection in long-horizon terminal-agent workflows. Its injection engine maps planted payloads to task-compatible surfaces and records the runtime surface through which the agent encounters them. The benchmark uses 40 realistic tasks and 56 attack scenarios spanning five threat categories; the targeting surfaces include file names, file content, config files, terminal output, and archives.

The authors evaluated 19 models from six model families. The realized corpus contains 26,220 undefended attack trajectories and 41,824 attack trajectories in total, alongside 720 benign reference runs.

Across the undefended full-benchmark results, mean attack success was 19.6% under LLM judging and 15.4% under heuristic verification; per-model ASR-L ranged from 3.2% to 41.9%. The two metrics capture different outcomes and should be read together: ASR-L is the GPT-4o-mini judge score, whereas ASR-H checks for concrete attack artifacts. A blinded human study of 219 items with 624 labels found κ=0.918 for a judge committee against human consensus, versus κ=0.527 for the single GPT-4o-mini judge; the single judge labeled compromise less often in that sample.

Defense results are narrower than the headline benchmark rate. On a selected high-vulnerability stress test, instructional hardening—reasserting user-task authority and repeating the rule after observations—produced the largest reported average reduction among the main prompt-level interventions, with model-dependent utility trade-offs; mean ASR-L fell from 58.2% to 14.3%. Because these comparisons use high-baseline-ASR tasks and attacks, the reduction should not be generalized to the full benchmark.

Cross-harness results replay task–attack pairs already compromised in Mini-SWE-Agent on Claude Code or Codex CLI, so they show conditional transfer rather than absolute attack rates for those harnesses. All tasks, payloads, and judge prompts are in English, and the 56 attacks are hand-authored; cross-lingual robustness and adaptive adversaries therefore remain uncharacterized. Results come from isolated Docker sandboxes with sinkholed exfiltration endpoints and sandboxed package mirrors, so production success depends on deployment-specific access and egress controls.

Transferable operation: preserve task–attack compatibility, stratify by the runtime surface actually encountered, retain benign reference runs, and report behavioral and artifact-based compromise together. Then audit judge disagreements before interpreting a defense reduction as portable. The useful research question is whether a defense lowers compromise while preserving task completion across new surfaces and harnesses; INFUSE supplies the measurement scaffold, not that answer.

Read it to learn how to pair attack placement with runtime-surface provenance and utility measurement, while avoiding overinterpretation of judge- or harness-specific rates.

[abstract; Abstract; Section 1, Our Framework; Appendix A.2.2; Section 4.1, Benchmark Protocol; Appendix D.4; Section 4.2, Main Results; Table 3; Section 4.3, Defense Analysis; Appendix D.3.1; Section 4.3, Cross-Harness Transfer; Table 4; Appendix A.4.2, Results; Table 9; Appendix H, English-only; Appendix H, Static payload set; Appendix H, Primary harness; Appendix C, Ethics and Broader Impact](https://arxiv.org/abs/2610.20776v1)

## Some Multi-Hop RAG Retrieval Failures Are Search-Guidance Failures

*[Beyond Retrieval Failure: Understanding Why LLMs Miss Evidence in Multi-Hop RAG](https://arxiv.org/abs/2610.21184v1)*

### The diagnostic

Multi-hop RAG can miss a required passage for two different reasons: the passage may be inaccessible, or the agent may never issue a query that would retrieve it. Standard retrieval evaluations conflate these causes. A-RAG already lets an LLM choose among keyword search, semantic search, and chunk reading, so the concrete question here is whether better state tracking can diagnose failures without changing the retrieval infrastructure.

ExecutionRAG is a training-free requirement register that records open sub-questions and their supporting evidence. With the retriever, corpus, and generation model fixed, the register changes search guidance but not evidence access. The diagnostic is asymmetric: recovering an individually mapped gold passage establishes that the passage was reachable by the original retriever, while failing to recover it does not prove that it was unreachable.

### Evidence and remaining failures

On 1,000 MuSiQue questions, missing-evidence-labeled wrong answers fall from 382 to 234 with all-MiniLM-L6-v2 and from 383 to 274 with Qwen3-Embedding-0.6B. These aggregate reductions show a recoverable component of apparent retrieval failure, but they do not identify which individual baseline failures were converted. In the matched MuSiQue comparison, LLM-Evaluation Accuracy rises from 44.9 to 50.2, while HotpotQA Contain-Match is 77.0 versus 77.3.

The error profile shifts as search improves: reasoning errors and abstentions take a larger share of remaining MuSiQue failures, and the increase in recorded reasoning errors is not proof that the generator’s reasoning worsened. Missing-evidence failures still constitute 55.3% of ExecutionRAG’s four-hop failures under MiniLM, indicating residual difficulty across long, weakly connected chains. The authors state that “The register guides search but does not provide a reliable evidence verifier”; the LLM still judges whether a requirement is resolved.

Two measurement boundaries matter. The gold-evidence mapping matches only 87.9% of supporting paragraphs, so failure labels depend on an imperfect passage-to-chunk mapping. On MuSiQue, the method reads 7,161 retrieved tokens per question, compared with 5,015 for A-RAG in the main MiniLM comparison.

### Research operation

Editorial suggestion: when testing a new agent, log each open requirement, the query issued for it, mapped-gold recovery, final correctness, and retrieval tokens separately. Then ask whether an evidence-sufficiency verifier reduces false resolutions more reliably than adding another search action.

Read it for a controlled debugging pattern: separate evidence reachability from query-selection failure, then measure whether improved search merely shifts the bottleneck to evidence verification and long-chain retrieval.

[abstract; Section 2.2; Section 4.3; Appendix E, Tables 12 and 14; Section 4.3 and Table 1; Section 4.4; Appendix E, Tables 13 and 15; Appendix E, Annotation method; Section 4.7](https://arxiv.org/abs/2610.21184v1) · [§3.1, Hierarchical Index Construction](https://arxiv.org/abs/2602.03442v1)

## FEB-30 Tests Agent Memory State Alongside Downstream QA

*[Beyond Downstream QA: Rethinking How We Evaluate Agent Memory](https://arxiv.org/abs/2610.22209v1)*

Downstream QA does not by itself establish whether an agent’s persistent memory is correct: answer quality can be affected by retrieval and generation, creating both false positives and false negatives for memory evaluation. FEB-30 addresses this problem by making the stored fact state inspectable alongside the final answer.

FEB-30 comprises 30 fact-evolution trajectories, covering six diagnostic categories and three difficulty levels, with ten trajectories per level. FEB-30 uses paradigm inversion: start with a specified sequence of fact states and generate multi-document artifacts from it, making the trajectory the benchmark ground truth rather than annotating real documents. The benchmark separates new claims in each document from cumulative expected memory state, allowing it to test whether a system retains prior knowledge while incorporating later information. A memory system can therefore be evaluated after each ingestion step against the expected state, while downstream QA remains a complementary end-to-end view.

The transferable research operation is straightforward: define atomic fact states first, generate or assemble artifacts that realize each transition, then score both the memory store and answers about the final state. Disagreement between the two scores becomes a diagnostic signal rather than a reason to choose one metric as the sole proxy.

For the tested memory system, intrinsic fact-state accuracy and extrinsic QA accuracy diverged by a mean absolute 16.8 percentage points; about 44% of trajectories exceeded the paper’s 15-point disagreement threshold. The evaluated system correctly classified memory operations only about 20% of the time, a diagnostic that downstream QA scores do not directly measure. In this evaluation, the system’s operation-classification accuracy fell as benchmark difficulty increased, from 33.8% at L1 to 10.1% at L3. The intrinsic–extrinsic divergence persisted across four tested configurations, although its magnitude varied.

These results are diagnostic, not a broad comparison of memory architectures. The benchmark is small, limiting fine-grained comparisons across categories, difficulty levels, or systems. Its synthetic and hybrid-generated documents may not transfer to real-world artifact sequences; the paper calls for validation against human-annotated real sequences. Intrinsic scoring uses an embedding-similarity threshold followed by LLM entailment judging, so reported scores depend on those measurement choices. The benchmark also targets factual evolution across multi-author artifacts; it does not cover episodic or procedural memory or single-turn conversational recall.

Read FEB-30 to learn a concrete way to separate “the fact was stored incorrectly” from “the system retrieved or expressed it incorrectly”—and to test that distinction before interpreting downstream QA as a memory score.

Read it to learn how to build a trajectory-based evaluation that distinguishes incorrect stored facts from retrieval or generation failures.

[abstract; Section 3.4, Distribution; Section 4, Document Generation Pipeline; Section 3.3, Trajectory Schema; Section 6.2, Finding 1; Table 3; Section 6.2, Finding 3; Table 4; Section 6.2, Finding 2; Table 4; Section 6.2, Finding 5; Appendix H, Table 12; Section 7, Scope and Limitations; Section 7, Synthetic Document Validity; Sections 5.1 and 7; Section 6.1; Section 6.2, Finding 5](https://arxiv.org/abs/2610.22209v1)
