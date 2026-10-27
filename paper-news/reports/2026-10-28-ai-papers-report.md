# 2026-10-28

## CQ2-CARE beats tested retrievers and compressors at matched budgets, but same-file compression matches or exceeds it

*[Skip the Compressor: Coding Agents Fix More Issues When They Pick Whole Files](https://arxiv.org/abs/2610.21073v1)*

The paper frames repository-level repair as requiring two properties at once: the files that must change and their code exactly as written. It identifies two failure modes in common context strategies: retrievers may rank similar code instead of files that must change, while compressors may delete or alter text that the model needs to reproduce. The research question is consequently operational: at an equal per-issue token budget, should an agent choose a few files and show them verbatim, rather than retrieve chunks or prune tokens?

CQ2-CARE implements that choice by asking the model under test twice, independently, which files must change. It selects files named by both localization samples, falls back to a third sample if the intersection is empty, can add short grep-derived evidence spans, and shows selected code files whole and verbatim subject to size caps. The baselines are fitted to CQ2-CARE's realized per-issue token budget, making the comparison about budget allocation rather than nominal context length.

On 300 eligible recent Python SWE-rebench issues, with one patch call per context and official benchmark-harness grading, CQ2-CARE resolved 43.7% with GPT-5.6 and 46.7% with Claude Opus 5. It outperformed the strongest tested compressor by 6.3 points for each model, and the strongest tested retriever by 9.3 points for GPT-5.6 and 12.7 points for Claude Opus 5. In a GPT-5.6 diagnostic, chunk retrievers devoted at most about a fifth of context lines to files edited by the gold patch, while CQ2-CARE devoted about half.

Two controls sharpen the mechanism. With file choice held fixed, token deletion reduced patch applicability and resolution, consistent with altered code text making edits harder to apply. But when LongCodeZip started from CQ2-CARE's candidate files, it matched or slightly exceeded CQ2-CARE in observed resolution; the reported difference was not significant. The main comparison therefore does not establish that exact-file selection is superior to compression applied to the same candidate files.

External validity is limited: the experiment does not test interactive agents that can reopen files, run tests, or recover information over multiple turns. A useful follow-up is a matched 2×2 experiment: hold the candidate-file set fixed, compare verbatim code with code-aware compression, and then repeat the test with interactive file reopening. The key question is whether fidelity still matters after file recall is controlled, rather than whether selection wins against compressors that began from different candidate contexts.

Read it to learn how to separate file recall, code fidelity, and compression in a matched-budget repair experiment—and to see why a same-candidate compression control changes the headline conclusion.

[abstract; Section 1, paragraph 5; Section 2, paragraph 5; Algorithm 1; Section 3.3, paragraph 1; Table 1; Section 4.1, paragraph 1; Table 2; Section 4.2, paragraph 2; Appendix Table 8; Section 4.2, paragraph 3; Appendix Table 8; Limitations, Setting; Discussion, Choose files or compress tokens?](https://arxiv.org/abs/2610.21073v1)

## AOS-Bench Measures Coding Agents on Timed, Shared-Resource Task Streams

*[AOS-Bench: Can LLM Agents Manage Dynamic Workloads?](https://arxiv.org/abs/2610.33178v1)*

The paper identifies a measurement gap in coding-agent evaluation: existing benchmarks evaluate each task in isolation, whereas a persistent assistant must accept work arriving over time under shared CPU and memory limits. AOS-Bench changes the evaluation unit to a workload manager: verified CLI tasks arrive over time, are delivered under shared CPU and memory limits, and are compared with the same tasks run one at a time as a per-system reference.

AOS-Bench operationalizes workload management by combining timed task arrivals, a shared resource budget, and per-task verification; the agent system decides when to claim and organize released work. Each task has an instruction, release time, and verifier, while the workload specifies shared CPU and memory; stream tasks are revealed over time through a dispatcher interface. The same tasks run one at a time serve as a per-system reference. For researchers, the useful design operation is to retain that matched reference while logging where delivery fails: intake, execution, or final verification.

The measured gap is substantial. All five tested systems had lower verified task success in heavy stream execution than in their matched individual reference, with drops of 13.0–22.7 percentage points. On medium workloads, the tested systems’ stream success scores varied more than their individual baselines; two systems only 0.6 points apart in individual SR scored 53.9% and 68.1% in stream execution. In the GLM-5.3/Claude Code policy intervention, serial FIFO substantially limited intake: on heavy workloads it left nearly three quarters of released tasks unclaimed. A simple fixed concurrency of two approached the best tested agent-managed policy in this intervention, without workload-dependent scheduling decisions. Every tested policy left at least 70% of the four provisioned cores idle while tasks waited.

A follow-up experiment should vary intake and concurrency while holding the model–harness pair, prompts, workspace, and resource allocation constant, then report claimed, completed, and verifier-passing tasks separately. That would test whether the observed stream gap comes from scheduling, shared-environment interference, or both.

The stream-vs-individual difference is not a clean causal estimate of scheduling alone: stream runs also introduce a shared filesystem, task-pool interface, scheduling preamble, and shared resource allocation, while individual runs receive more aggregate resource opportunity. The five evaluated pairs are not controlled model-only comparisons: harness settings, tool availability, routing, and output-token caps differ across systems. The results describe the tested model–harness configurations. Uncertainty is limited by the small number of independent workload clusters, especially for heavy-tier estimates. Most heavy trials also reach the wall-clock limit, making heavy-tier delivery a lower bound. Read AOS-Bench as a benchmark design and a diagnosis of tested policies, not as evidence that simple concurrency is generally sufficient.

Read it to learn a reusable evaluation pattern for persistent coding agents: compare verified task-stream delivery with matched isolated-task performance, then intervene on intake and concurrency while keeping the tested setup explicit.

[abstract](https://arxiv.org/abs/2610.33178v1)

## Matched MCP and CLI Interfaces Change Agent Behavior Under Shared Execution

*[Matched Capabilities, Different Behaviors: A Controlled Study of MCP and CLI Interfaces for Language Agents](https://arxiv.org/abs/2610.34298v1)*

Earlier MCP-versus-CLI evidence left a concrete attribution problem: the paired MCP-to-CLI cost comparison was highly variable, spanning both directions, and the paper treated it as inconclusive. MICA addresses that narrower question by rendering MCP and CLI from a shared semantic action contract and routing decoded actions through the same runtime. The comparison also holds task state, semantic action contract, validation and execution path, generation settings, and interaction budget constant.

MICA adds matched-state probes that vary capability presentation, action realization, and feedback, alongside paired natural trajectories that expose how early divergences propagate. Across six models and three interactive environments, matched interfaces changed task outcomes and interaction cost, with effects varying across model–environment pairs rather than consistently favoring MCP or CLI. The effect was not limited to surface validity: interface differences also changed semantic action selection among responses that decoded into typed proposals. At fixed decision contexts, presentation, realization, and feedback could interact. Paired trajectories showed structured divergence in 94.3% of 2,004 episodes.

DART turns this decomposition into an intervention: it preserves a validated semantic commitment while repairing only the interface-specific realization. In six Gemini-2.5-Flash benchmark–interface settings, DART improved the reported benchmark score relative to a protocol-matched Base, with gains up to 9.0 points. Under MCP, it reduced token cost in all three environments by up to 27.1k tokens per task, whereas CLI token-cost changes were mixed.

The intervention evidence applies to one model, so it does not establish generalization to the other five models in the baseline comparison. The preserving-correction branch is also supported by only four opportunities. More broadly, the controlled comparison isolates these dimensions within constructed contracts and three benchmarks; it does not establish that the same effect sizes apply to other interfaces or environments. A useful replication operation is therefore to log semantic choice, surface realization, and feedback separately, then rerun the matched-state factorial probe before changing the underlying tool runtime.

Read this paper to learn a concrete experimental decomposition—semantic choice, interface realization, and feedback—and a repair strategy that changes the surface action without changing a validated semantic commitment.

[abstract; Section 6.4, PDF page 10; Appendix D.4, PDF pages 32–33](https://arxiv.org/abs/2610.34298v1) · [Section 4.1, PDF p. 13; repeat-run resolution in Section 8.1, PDF p. 20](https://arxiv.org/abs/2608.08654v1)

## SABench Separates Tool-Agent Task Completion From Unauthorized Writes

*[Task Success Is Not Enough: Side-effect-Aware Evaluation of Tool-Using Language Model Agents](https://arxiv.org/abs/2610.34167v1)*

Tool-agent evaluation can mark an episode successful even when the agent performs an unauthorized state-changing action. The SABench authors call this failure mode *collateral damage* (CD). This targets a concrete gap in outcome-focused evaluation: the earlier τ-bench evaluates a final database state and required user-facing information, while its authors caution that its reward can miss policy violations that leave those outputs unchanged, such as acting without explicit confirmation ([τ-bench, Section 3](https://arxiv.org/abs/2406.12045v1)).

SABench changes the measurement target rather than the agent. Each task specifies an initial state, a goal, and an explicit set of authorized writes across email, calendar, and ticket tools. Its deterministic oracle extracts successful state-mutating calls from the trace, replays them against the initial state, evaluates goal satisfaction, and separately checks whether realized writes fall outside authorization ([SABench, Section 4](https://arxiv.org/abs/2610.34167v1)). The benchmark contains 201 tasks from 47 templates, crossing four state structures and four trap families. For ambiguity tasks, any successful write before clarification counts as a violation ([Section 3](https://arxiv.org/abs/2610.34167v1)).

The decisive result is that completion and authorization compliance diverged under this scoring. Across 2,211 single-run model-task pairs from 11 models, 15.2% incurred CD; among goal-satisfied runs, 12.8% still had collateral damage ([Section 6.1](https://arxiv.org/abs/2610.34167v1)). DeepSeek V3.2 and GPT-5.4 had nearly identical goal rates—87.6% and 88.1%—but differed by 16.4 CD percentage points; the reported template-clustered 95% interval was +8.9 to +24.8 points ([Section 6.2](https://arxiv.org/abs/2610.34167v1)). Thus, within this benchmark, goal rate did not determine authorization compliance.

A transferable research operation is to define an authorization set before running agents, then report a second trace-level outcome beside task success: whether every successful mutation was permitted. Varying task structure—such as dependencies, cross-tool effects, and ambiguity—can then reveal where the two measures separate. The boundaries matter: the experiments cover office-style workflows, authorization judgments are partly policy-dependent, and each model-task pair was run once; the authors state that their rates and rankings should not be extrapolated to other domains ([Section 9](https://arxiv.org/abs/2610.34167v1); [Appendix A.6](https://arxiv.org/abs/2610.34167v1)).

Read this for a concrete evaluation design: replay an agent’s successful writes and score authorization compliance separately from task completion.

[Section 4, Oracle and Evaluation (S4.p1); Section 6.1, Task success understates agent risk (S6.SS1.p1); Section 6.2, Model-level CD varies by 4.7× at comparable goal rates (S6.SS2.p1); Section 9, Limitations (S9.p1)](https://arxiv.org/abs/2610.34167v1) · [Section 3, paragraph 6](https://arxiv.org/abs/2406.12045v1)

## Scientific-agent memory needs decision-validity tests, not retrieval alone

*[The Right Fact, the Wrong Decision: SciValidityBench for Scientific Agent Memory](https://arxiv.org/abs/2610.34767v1)*

The paper targets a specific gap: most agent-memory benchmarks frame long-term memory as retrieval—whether an agent can recover a relevant record from a long, evolving history. SciValidityBench instead evaluates scientific use validity: whether remembered evidence is eligible to influence a decision under the state governing its interpretation. The distinction is concrete: the same reported test result may support confirmation when the outcome and stopping rule were fixed in advance, but only exploration when the outcome was selected from twenty inspected results.

SciValidityBench is an executable benchmark factory with 64 TaskSpecs spanning five validity modules and six scientific domains. Each TaskSpec couples generated experimental histories with scientific-state definitions, programmatic decision oracles, controlled interventions, and automatic scoring. Its SciStateForge compiler-reader framework turns distributed histories into explicit decision-governing state. Counterfactual pairs and targeted corruption-repair controls then test whether models use those dependencies and localize failures. Content-identical flat and typed views help separate the value of exposing governing state from the effect of a particular graph serialization.

The primary matrix used four open-weight readers, 64 TaskSpecs, ten unseen seeds, and five memory views. Typed compiled state outperformed a generic Event Graph by 9.2–18.8 percentage points in valid-action rate across the four tested open-weight model families. Conventional BM25 retrieval did not reproduce the cross-family gain from compiled state: its effect was small or negative for most readers, with a modest positive result for Mistral. The authors interpret the representation controls as evidence that the central improvement is associated with making decision-governing state explicit, although the most effective rendering varies by reader.

The benchmark uses procedurally generated histories and fictitious clinical scenarios. Its reported breadth is therefore across a deliberately generated catalog and four open-weight model families; the paper does not establish the same effect for deployed scientific agents or naturally occurring research histories. The repair control is also conditional: targeted repair selectively recovered valid decisions for three readers, while Phi showed no corresponding recovery over the matched irrelevant repair.

For a transferable evaluation, hold the remembered fact fixed, vary the historical condition that licenses its use, and score the action rather than retrieval alone. Pair counterfactuals with exact restoration and edit-matched irrelevant repairs so that a correct answer can be distinguished from genuine dependence on governing state.

Read this for a concrete evaluation pattern: keep a true fact constant, change the hidden condition that makes it admissible, and use counterfactual plus matched-repair controls to test whether an agent follows state rather than merely retrieving content.

[abstract; §3.4; Appendix A.1, Table 5; §4.2, Table 3; §4.3; Appendix D.1, Table 13; §4.2–§4.3, Table 4; Appendix G.1, Table 23; §4.4; Appendix F.2, Table 21; Ethics Statement; Appendix D.2, §4.1](https://arxiv.org/abs/2610.34767v1)
