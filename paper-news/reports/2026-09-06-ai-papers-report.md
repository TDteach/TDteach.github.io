# 2026-09-06

## Plausible corrupted tool returns can override previously correct agent answers

*[Agents Trust Tools Too Much: Measuring Reliance on Unreliable Tools](https://arxiv.org/abs/2609.05587v1)*

Existing evaluations of tool-using agents “primarily measure whether an agent can successfully complete diverse tasks with tools” and “generally assume that tools return reliable information.” This paper targets the missing case: outputs that are plausible but incorrect.

The authors “investigate how agents respond to unreliable tool returns by evaluating fourteen LLMs using three tools-web search, LLM sub-agent delegation, and code execution.” For each tool, they corrupt its returns and measure whether the final answer adopts the corrupted content. The useful evaluation move is to separate simple adoption from **Override**: adoption on questions for which a model already answered correctly without a tool.

The decisive result is that corruption can replace an answer the agent could otherwise produce. “For P1, it remains above one half in Search and near one third in the Code Executor; in the executor, the Adoption rate is 35.4% and the Override rate is 33.4%.” Here P1 denotes the paper’s plausible-corruption condition, and these figures are pooled across its 14-model roster. The failure is not only wrong final content. “Among final answers that adopt corrupted content, only 5.3% in Search and 1.8% in Code Executor warn the user.” Retained reasoning traces add a narrower, troubling observation: “reasoning models often recognize the conflict and even recover the correct answer internally, but their final responses still present the corrupted answer and almost never mention the conflict or the correct answer.” That trace result is reported for reasoning-configured models with retained thinking traces, not established for every model configuration.

The paper tested prompting, tool-provider metadata, and post-training. Its conclusion is qualified but practical: “Although some interventions help for particular models or tools, none consistently mitigates overtrust across tools.” A related design result suggests that tool provenance itself changes behavior: “Code execution is strikingly different. The Adoption rate is 39.9% when the corrupted number is returned by the executor, but only 1.8% when it is stated by the user and 3.8% under RAG.” The presentation arms have differing repetition and payload-handling details, so this is evidence of a measured association in this setup rather than a clean causal comparison of interface routes.

Two boundaries matter when reusing the benchmark. “Novel summaries are generated from titles rather than source text,” leaving the receiving Sub-Agent without an independent checking route. Outcome labels also use an automated judge: “A second model family agrees on 98.5% of overlapping labels.”

A concrete next operation is to corrupt fixed outputs for each tool in an agent stack, then report adoption, Override, and a user-visible conflict/disclosure rate separately. The key question is not merely whether an agent detects a contradiction internally, but whether it either resists the corrupted output or communicates unresolved evidence to the user.

It provides a concrete robustness-evaluation pattern for tool-using agents: inject plausible errors and measure final-answer adoption, replacement of previously correct answers, and conflict disclosure separately.

[Abstract; §4.1; §4.3; §5.1; Appendix A; Appendix B](https://arxiv.org/abs/2609.05587v1)

## Models achieve only 32% accuracy when doing computational tasks where retrieved business rules modify the computation.

*[DI-Bench: Systematically Generating In-Domain Data Intelligence Benchmarks for Enterprise Agents](https://arxiv.org/abs/2609.05776v1)*

### The benchmark target

“Evaluating enterprise agents on domain-specific benchmarks is critical, yet public benchmarks rarely evaluate whether agents can integrate business knowledge with analytical computation, and constructing such benchmarks manually is costly.” Applied to two public datasets, “the pipeline produces a 731-task benchmark covering knowledge retrieval, analytical computation, and rule-grounded reasoning.” [Source](https://arxiv.org/abs/2609.05776v1)

### Method: make documents change executable work

“To emulate realistic DI tasks that require both computation and knowledge retrieval, DI-Bench builds an artifact linkage graph over data tables, dimensions, metrics, and documents to form questions involving structured data and associated knowledge.” For labels, “Rather than have a model produce it, DI-Bench computes each gold answer by executing SQL against the real database, making it deterministic and correct by construction.” [Source](https://arxiv.org/abs/2609.05776v1)

For a benchmark designer, the transferable operation is to create an instance in which a retrieved document is supposed to alter an executable computation, then deterministically score the resulting output. The paper supplies a check on whether the linkage is consequential: “The graph-selected rule changes the answer in 82% of cases, versus 29% for semantic-similarity pairing and 22% for random pairing.” A useful follow-up question is whether an agent’s errors arise in selecting the relevant rule, translating it into a query change, or carrying out the changed computation.

### Evidence and scope

“To show the discriminatory capability and difficulty of the benchmark, we evaluate four models,” and “models achieve only 32% accuracy when doing computational tasks where retrieved business rules modify the computation.” The authors’ interpretation is: “These findings suggest that retrieving business knowledge is not the primary challenge for enterprise agents, but correctly grounding it in downstream tasks remains a major bottleneck.” [Source](https://arxiv.org/abs/2609.05776v1)

The result is bounded by the demonstration setup. “The pipeline is demonstrated on two domains (e-commerce and banking); broader validation across additional industries would strengthen the transferability claim.” Moreover, “The business-rule documents and metric catalogs used in our demonstration are synthetic augmentations rather than artifacts from a real enterprise.” Finally, “Additionally, scoring is based on exact match and does not award partial credit for correct reasoning with minor computational errors.” A decisive extension would repeat the document-to-computation test with real enterprise artifacts across additional industries while retaining executable gold answers.

Read this to study a benchmark design that tests whether retrieved business rules actually change an agent’s analytical computation, rather than testing retrieval alone.

[Abstract; Section 3.3; Section 4; Appendix C Table 8; Conclusion; Limitations](https://arxiv.org/abs/2609.05776v1)

## Compressed NOTES Shifted Asymmetrically by +9.91 or -13.28 Percentage Points Across Tested Migration Directions

*[Does Your Agent's Memory Survive a Model Upgrade? A Controlled Study of Memory Portability](https://arxiv.org/abs/2609.05339v1)*

Keeping an agent’s memory store does not guarantee that an upgraded model can use it: the authors identify changed interpretation of old notes, incompatible embedding versions, and repair without original evidence as distinct failure modes. Their controlled question is therefore not whether a store exists after an upgrade, but whether the information remains usable.

The study preserved each of 48 synthetic histories in four forms: verbatim long-context text (LC-RAW), retrieval chunks (RAG), model-compressed natural-language notes (NOTES), and a fixed-schema knowledge graph (KG-fixed). It used randomized answer codes and exact scoring, and tested writer–reader swaps between Llama-3.1-8B-Instruct and Qwen2.5-7B-Instruct-1M. A separate RAG experiment upgraded embeddings from bge-large-en v1.0 to v1.5 using a single-stage cosine top-8 retriever without a reranker.

The format comparison gives a concrete portability split. KG-fixed accuracy changed by only +0.0004 ± 0.0020 after a writer change, while compressed NOTES shifted by +9.91 or -13.28 percentage points depending on migration direction. This directional asymmetry matters: a migration that looks safe from one writer to one reader need not behave similarly in reverse. For the tested RAG pipeline, full re-embedding gained 11.90 accuracy points, whereas a 50/50 index of old and new embeddings gained only 4.96. The authors’ decomposition further attributes 0.364 ± 0.012 of RAG’s 0.450 ± 0.012 pooled deficit to retrieval, a descriptive 81% share. Repair results sharpen the operational consequence: store-only rewriting of NOTES reached a 90% recovery target in none of 48 cases; with retained raw history, repair met that target in 34 of 48 cases in one tested direction.

**Editorial research operation:** evaluate an upgrade as a matrix over memory representation, writer-to-reader direction, and embedding version. Measure normal reads separately from reads supplied with correct evidence, so construction loss and retrieval loss are not conflated. Before deleting raw histories, test whether the remaining store alone can meet a predefined recovery target; retain source histories only where policy permits.

The evidence is deliberately narrow. KG-fixed portability was shown for this workload and schema, not as universal knowledge-graph superiority. The retrieval figures apply to one single-stage dense setup and two same-dimensional embedding spaces, while the model study covers one cross-family migration between two similarly scaled open-weight models. Natural conversational histories, other model upgrades, and other retrieval pipelines may yield different retention levels.

Read this to obtain a compact experimental template for testing whether an agent-memory design, vector-index migration, and repair procedure survive a model upgrade under direction-specific measurements.

[Abstract; Sections 3.2, 4.2–4.3, 4.6; Appendix D Table 6; Appendix E Table 7](https://arxiv.org/abs/2609.05339v1)

## Decompile-Diverge Tests Behavioral Fidelity Beyond Recompilation

*[When LLM Decompilers Recompile More and Preserve Less](https://arxiv.org/abs/2609.05370v1)*

Recompilability and passing every shipped input/output test do not establish behavioral equivalence. The paper’s motivating failure is concrete: a decompiled function can agree on shipped tests yet diverge on other legitimate inputs, while a disclosed vulnerability can disappear without a visible crash. Decompile-Diverge is designed to expose that gap rather than treat build success as fidelity.

For each reference function, the method automatically synthesizes a driver, runs AFL++ on the compiled reference to grow an input corpus, recompiles the decompiler’s C output, and replays the same inputs on both binaries. It compares crashes and hangs as well as differences in a bounded observable post-state. The GitHub and CVE tracks require observed divergences to reproduce across four reruns, making the oracle more than a single counterexample run.

The resulting measurement changes the interpretation of shipped-test success. Across eight systems in nine configurations, candidates that passed every shipped test still diverged on the generated corpus: 4.9% overall and as many as 13% for one system, pooled over 12,133 passing candidates. On 300 real GitHub library functions and 287 CVE-grounded functions, the strongest refinement LLM raised Ghidra’s build rate from 75% to 90%, while its Matched rate fell from 74% to 62%. On the CVE track, one LLM refiner lost the reference crash in 25 of 183 builds, producing full-track Crash Absence of 25/287, or 8.7%.

The authors’ source-level analysis traces the divergence to introduced fields, types, callees, and guards that replace the visible unknowns traditional tools leave behind. This suggests a transferable evaluation operation: when a model transforms executable artifacts, generate inputs from the reference, replay them against both versions, define the observable state explicitly, and record disappearance of failure behavior as its own error class.

The oracle is not proof of equivalence. Because comparison is limited to the generated corpus and bounded observable post-state, Matched is an upper bound on agreement across all valid inputs, while Divergence and Crash Absence are lower bounds. Multi-dimensional arrays, function pointers, and functions not built with AddressSanitizer are excluded. The practical research question is therefore not whether this oracle certifies a decompiler, but whether broader input generation and state observation uncover additional failures, especially in the excluded function classes.

To learn how to replace recompilation and shipped-test success with an executable behavioral oracle that can expose semantic drift and lost vulnerability crashes.

[abstract1.1; abstract1.2; S1.I1.i1.p1.1; S4.SS1.p1.1; S5.SS1.p2; S5.SS2.SSS0.Px3.p1](https://arxiv.org/abs/2609.05370v1)

## CONTINUITY carries signed security context across agent transitions and binds it to final effects

*[CONTINUITY: Security-Context Contracts for Composable LLM Agent Controls](https://arxiv.org/abs/2609.05269v1)*

### What changes

The paper frames the problem as a composition failure: individually useful security controls can lose their guarantees as a request crosses representations. It names this failure **security-context discontinuity**. A security-relevant fact required to justify an effect may be absent, weakened, reinterpreted under a non-equivalent schema, modified without an authorized relation, or stale when the effect occurs.

CONTINUITY responds by modeling pipeline components with assume–guarantee contracts and carrying authenticated context across transitions. Its artifacts include signed root grants, provenance commitments, role-bound transition receipts, bounded typed releases, transformation witnesses, and effect-bound execution permits. A release is not a field-name whitelist: it binds one validated source value to one named target field under a bounded predicate and task context. This makes the handoff itself an object that a verifier can check rather than an implicit assumption between components.

### Formal and measured evidence

The formal target is **End-to-end Consequence Integrity (ECI)**: every realized protected effect must have a valid authorization witness connecting the principal, task, provenance, delegation, policy state, canonical action, and finality boundary. If conditions C1–C7 hold, the paper’s theorem states that every realized protected effect has a valid effect witness and that ECI holds even when the planner and attacker-writable content are adversarial. The model assumes unforgeable signatures and collision-resistant digests, with the conditions enforced by the deployment’s trusted computing base.

The reference verifier was tested with a deterministic fault-injection suite. In 2,560 attack instances covering 128 fault–domain classes, CONTINUITY reported no harmful effect; it also completed all 700 benign tasks and escalated all 200 ambiguous tasks. Removing field provenance, contract conformance, or complete mediation each reopened 24 classes in the designed ablation suite.

### Boundary and research use

These results are conformance evidence for a generated suite, not a real-world attack-probability estimate. The guarantees also fail if trusted roots, validators, the verifier, or the mandatory finality sink are compromised or maliciously configured. CONTINUITY preserves authenticated security facts and authorization decisions; it does not establish that those facts are true. The Python prototype is regression-tested but not mechanically verified or formally shown to refine the abstract model.

For a new agent, use the design as a boundary-audit operation: enumerate every representation change from instruction to external effect, specify the fact and authorization that must survive it, bind transformations to explicit witnesses, and test which invariant disappears when each verifier check is removed. The research question is whether the deployment can produce those artifacts—and protect their roots—without making the finality path too costly or too weakly mediated.

Read this to learn how to turn provenance and authorization from component-local checks into explicit, testable obligations at every transition to an external effect.

[abstract / §4 / §5 / §8 / §12](https://arxiv.org/abs/2609.05269v1)

Prepared retrospectively from the 2026-09-06 candidate papers; verified on 2026-09-16.
