# 2026-11-06

## Office-document extraction can mislead LLMs, and Prism reconstructs the human view

*[When File Ingestion Misleads Language Models: Measuring and Mitigating Divergences in Office Documents](https://arxiv.org/abs/2611.05806v1)*

LLM document pipelines often treat extracted text as the document to analyze. This paper tests that assumption for OOXML-based DOCX, XLSX, and PPTX ingestion. The limitation it exposes is representational: an extractor can expose content hidden from the default human view, omit visible content, or deliver visible content with different formatting or order. Across ten selected open-source extractors, the hybrid study found 31 visibility discrepancies: 19 injection channels and 12 omission channels. The measured constructs also occur in ordinary files: speaker notes appeared in 71% of sampled presentations, while value-altering number formats appeared in 7% of sampled spreadsheets. The authors caution that the measurement is not exhaustive and that proprietary ingestion paths can change.

Methodologically, the paper moves the audit to the file-to-text boundary. Static source analysis models reachable XML selectors; dynamic analysis inserts unique markers into candidate OOXML channels and checks which markers reach extractor output. The authors compare those channels with default human visibility, then use the divergence patterns to build five attacks that require no injected instruction. The end-to-end evaluation covers four chat assistants and four coding agents.

The extraction hypothesis receives a controlled test. With GPT-5.6, Claude Opus 5.5, and Gemini 4, all models followed the attacker-chosen reading for naive extracted text in every tested trial and answered according to the human view for clean-control text in every trial. Across the eight evaluated applications, the five attacks succeeded in 64% of 400 end-to-end trials, and every system was misled in all ten trials of at least one scenario. The formatted-value attack was the strongest of the five tested scenarios in that evaluation.

Prism changes the ingestion boundary by reconstructing the human view from the OOXML specification before model input. Its static interpreter handles specification-defined visibility and display behavior; a multi-renderer oracle addresses layout-dependent cases, where ordering may not be determined by the specification alone. On 28 additional payloads covering four mechanisms, the three tested models were misled by all 84 naive-extraction answers and by none of the 84 Prism-reconstruction answers. The transferable operation is to enumerate file channels, plant canary markers, compare extractor output with default rendering, and evaluate semantic interpretation separately from layout fallback.

The boundary remains important: Prism's static coverage is incomplete, especially for PowerPoint content channels; layout-dependent cases need a slower render oracle, whose VLM may vary and whose renderer agreement does not guarantee correctness. Very small text can evade some visibility checks, and the image-reading render oracle was not evaluated on that variant. Read the result as a method for auditing representation boundaries and mitigating tested mechanisms, not as a complete security guarantee.

Read it to learn a concrete test for whether a document agent receives the rendered content a reviewer sees before spending effort on prompts or model behavior.

[abstract; §4.1.2, Injection and Omission Channels; Table 1; §4.3, Results; Table 3; §5.2, Overall Results; Table 4; §5.3, Isolated Extraction Experiment; Table 5; §6.4.1, Generalization; §6.4.1, Attack Mitigation; §6.2, Render Oracle; §6.4.3, Overhead; §7, Discussion](https://arxiv.org/abs/2611.05806v1)

## Identifier Probes Reveal Which Split Axis Changes Encrypted-Traffic Scores

*[The Split Protocol Decides the Result: Re-Evaluating Encrypted Traffic Classification](https://arxiv.org/abs/2611.06290v1)*

## Why the split changes the result

Encrypted-traffic classification can look highly accurate until the partition changes. On one of the two public corpora examined, the same model and code reached macro-F1 0.992 under the literature-standard evaluation, but 0.567 when flows from one packet capture were kept on one side of the split—a 0.426 gap across eight seeds (p = 0.008 after Holm–Bonferroni correction). The paper stresses that this inflation is not a property of random splitting by itself.

Which split matters is collection-dependent. On a month of backbone QUIC traffic, five protocols were tested at eight seeds each. Random, temporal, and client-disjoint splitting were statistically indistinguishable from session-disjoint splitting, whereas server-disjoint splitting reduced macro-F1 by 0.192 (d = 17.0, p = 0.008). The practical implication is not to replace random splitting with one universally preferred alternative, but to test which grouping axis blocks the collection-specific shortcut.

## The diagnostic operation

The paper’s diagnostic is a set of single-identifier probes run before any model is trained. A decision tree using the capture identifier alone reached 0.983 under a random split and exactly 0.000 under session-disjoint splitting. For a researcher, this is a concrete pre-model audit: test whether provenance identifiers still predict labels under each candidate partition, then treat a large change as evidence that the split is exposing collection structure rather than the intended generalization.

## What survives stricter evaluation

The model comparison is mixed. A metric-trained flow embedding led four deep baselines but did not beat gradient-boosted trees on twenty packet sizes. Five of the authors’ preregistered architectural claims failed. Distance-based rejection beat softmax thresholding, yet removing every metric objective made rejection better; the reported association between class separation and rejection quality was negative (r = −0.88), which does not establish a causal mechanism.

Few-shot enrollment was flat within a corpus. In one direction of the cross-corpus experiment, five labelled flows per class recovered 91% of the deficit left by failed zero-shot transfer. That result is narrow: the reported experiment used one seed, three shared classes, and no baseline in that transfer setting.

## Research takeaway

For a new corpus, make the collection identifiers part of the evaluation design, probe them separately under candidate splits, and only then compare architectures. The evidence here comes from two corpora, so the workflow is a diagnostic rather than a universal rule about which split axis always matters.

Read it for a reusable pre-training audit: single-identifier probes can reveal whether a reported classifier score depends on collection structure before architecture comparisons begin.

[abstract; §4.3, PDF page 4; §6.4 and §7.1, PDF pages 6–8](https://arxiv.org/abs/2611.06290v1)

## Repository context can improve functionality without making generated code much safer

*[A.S.E 2.0: Understanding How Repository Context Impacts the Security of LLM-Generated Code](https://arxiv.org/abs/2611.06294v1)*

Repository-aware coding systems often optimize context for functional correctness, while secure-code benchmarks have treated that context as fixed. That leaves a concrete design question: is security improved by adding more repository text, or by exposing the particular evidence that enforces a safeguard? A.S.E. 2.0 addresses this question with CASE-Bench.

CASE-Bench contains 145 repository-level tasks from 144 CVEs in 51 projects. Each task runs in Docker, pairs functional tests with an executable proof-of-concept exploit validated in both directions, and annotates repository code that enforces or undermines security. The main experiment holds the task, prompt, and oracle fixed while varying context; six models and 13 context construction methods are compared, followed by single-element context edits. For readers, the transferable operation is to annotate security-relevant evidence in the repository, intervene on one context property at a time, and score functionality and exploitability jointly.

On the main comparison, functionality-oriented retrieval changed functional-pass rates by −4.8 to +8.2 percentage points but secure-pass rates by only −1.1 to +3.7 points; none differed significantly from Local-only after Holm correction. A security-targeted source-sink context condition improved SecPass@1 by 5.5 points over Local-only with a Holm-adjusted significant comparison, although the result does not isolate retrieval logic from context length or other method differences.

The controlled edits sharpen the result: withholding a safeguard lowered secure pass by up to 8.1 points, while inserting one insecure exemplar increased correct-but-exploitable outputs by 6.3 points even while the safeguard remained present. The evaluated coding agents observed a task’s relevant safeguard in only 27–36% of trajectories, while observing insecure exemplars in 43–51% of trajectories on tasks containing one. Trajectories that observed and used the safeguard achieved 34.5% SecPass@1, compared with 12.7% for trajectories that never observed it; this association is observational, not causal.

A practical next experiment is to preserve the task, prompt, model, and oracle while removing or inserting one safeguard or exemplar, then log whether an agent observed, used, and acted on that evidence before editing. Interpret the resulting secure-pass scores narrowly: a proof-of-concept can demonstrate but not exclude a vulnerability, so SecPass@1 is relative to the supplied tests and exploits. Generalization is also uncertain because six projects contribute 67 tasks and task characteristics such as weakness type and language remain confounded. CASE-Bench therefore supports security-aware context construction under its tested conditions, not a claim that more retrieval is broadly unsafe or that observing a safeguard guarantees secure code.

Read it to learn a reusable experiment for separating context quantity from security-relevant context content in repository-aware coding agents, while keeping exploit-based security judgments and correlational trajectory evidence properly bounded.

[abstract; §1, paragraph 3; §3.1–§3.2; §5.1–§5.4; §6.2](https://arxiv.org/abs/2611.06294v1)

## Verifier acceptance is only the first audit surface in LLM-generated verified code

*[Verified but Vacuous: Three Failure Surfaces of LLM-Driven Verified Code Generation](https://arxiv.org/abs/2611.05590v1)*

The paper’s audit separates one “verified” number into three conditional surfaces: A, verifier acceptance; B, syntactic specification binding; and C, semantic specification fidelity. A is assessed first, B among A-accepted artifacts, and C among artifacts passing B; these are conditional audit populations, not logical implications.

The earlier Dafny-as-IR prototype already used Dafny verifier feedback in an automated repair loop, and an LLM reconstructed a Dafny program from a natural-language rendering as a consistency check. The present paper’s concrete method change is to make binding an explicit, conditional audit measure. It operationalizes B with a Dafny-specific ensures-binding gate: a method passes only when an `ensures` clause references a predicate or function in the paired specification. That check is structural, not semantic: it can still accept a referenced predicate whose body is vacuous, such as `true`.

The decisive A→B result is a separation between acceptance and binding. In Li@Opus, the paper’s same-model reproduction of a Dafny-as-intermediate-representation pipeline, HumanEval reached 99.1% verifier acceptance, but only 1.9% of accepted samples carried a certificate binding to a spec-defined predicate or function. Across three Python benchmarks, verifier acceptance stayed between 92.2% and 99.1%, while the conditional binding rate remained in a narrow 1.9–2.7% range.

The separate B→C demonstration uses VCG on Rust, where shipped components pass the binding gate by construction. Even then, 11.48% of structurally verified MBPP-Rust samples and 14.82% of VeriContest LC samples failed hidden tests. This is consistent with a remaining behavioral-fidelity gap, but it is not a diagnosis of specification failure: implementation, composition, translation, wrapper, oracle, or resource problems could also produce those failures. VCG’s reported 7.79% End2End @1 on the VeriContest LC slice is therefore a descriptive result, not a matched comparison with external rates because budgets, repair procedures, and harnesses differ.

For a new evaluation, log A, B, and C separately: run the verifier, inspect specification references syntactically, then probe behavior with tests or other requirement-level checks. Treat the binding gate as an inexpensive necessary audit signal, not evidence that the specification is meaningful. A useful research question is whether stronger binding checks—such as detecting vacuity and testing specification behavior—predict hidden-test success better than verifier acceptance alone. The reported rates remain point estimates without main-body confidence intervals, and the primary results use one model family, so this question needs broader, matched evaluations.

Use this paper to redesign one verified-code evaluation: add a conditional AST-level binding audit and a separate behavioral-fidelity check before interpreting a verifier-acceptance rate.

[Abstract; §2; §3, definition of the ensures-binding gate; §6, Table 5](https://arxiv.org/abs/2611.05590v1) · [Section 2.1, Higher quality code generation with Dafny (S2.SS1.p4); Section 2.5, Consistency checks help validate translations (S2.SS5.SSS0.Px2.p1)](https://arxiv.org/abs/2501.06283v1)

## SlackBench tests cross-source workplace reasoning with reconstructed research projects

*[SlackBench: Benchmarking Agents on Collaborative Projects Grounded in Real Code Repositories](https://arxiv.org/abs/2611.05512v1)*

SlackBench targets a concrete evaluation gap: workplace questions may require locating relevant channels and direct messages, recovering context from long discussions, inspecting repository state, reconciling stale or conflicting evidence, and synthesizing across communication and code artifacts. The benchmark contains 140 tasks across heterogeneous-source agentic search, abstention on unanswerable or false-premise questions, goal-directed summarization, and circumstance inference over long, multi-party dialogues. It therefore tests more than static corpus question answering: agents must determine which conversations matter, traverse threads, inspect repository state, and synthesize evidence.

SlackBench constructs channels as research projects: humans and coding agents carry out projects in Slack, channels link to GitHub repositories and sometimes Google Docs, and exported conversations are manually filtered and corrected against project repositories. Humans manually curate and verify reference answers and rubrics.

In the main evaluation, using medium reasoning effort and a 20-minute limit per query, the 33 model–harness combinations produced a best overall score of 80.25%; every other listed system was below 66%.

An interface ablation provides a sharper design signal: when agents received direct CLI access to exported Slack files rather than Slack information through MCP tools, pass rates improved by an average of 7.85% across the authors’ six configurations. That comparison supports testing access interfaces as an experimental variable, not assuming tool choice is neutral.

The authors’ trajectory analysis identifies insufficient cross-workspace verification as a recurring failure pattern: agents often retrieve plausible candidates but do not verify them against broader context. A practical follow-up is to require each answer to expose its supporting messages, repository state, and unresolved conflicts, then score whether the agent checked each evidence path before answering. This turns a qualitative diagnosis into an ablation: compare ordinary retrieval with explicit evidence-ledger and contradiction-checking procedures.

Boundaries matter. The described collection has 15 channels, around 3,000 messages, 14 GitHub repositories, and 9 Google Docs, so transfer beyond these reconstructed research projects is uncertain. About 35.0% of Slack messages were directly authored by humans and another 35.2% substantially rewritten by humans; the conversations are therefore curated reenactments, not unaltered workplace data. The authors also note limited model/harness coverage and no prompting-strategy comparison. During development, some agents navigated to a repository and retrieved reference answers; the authors report such cases were rare, but they remain an evaluation-integrity risk.

Read this to learn how to turn distributed conversation–code evidence, abstention, and workspace access into separate experimental variables for tool-using agents.

[abstract; §3, paragraph 4; §5.2, paragraph 1; §7, subsection “Direct CLI access to Slack workspace files improves agent performance and efficiency”; Table 2; §10, Limitations](https://arxiv.org/abs/2611.05512v1)
