# 2026-09-09

## Kalman Delta Networks add scan-compatible uncertainty to delta-rule associative memory

*[Kalman Delta Networks: Uncertainty-aware Associative Memory](https://arxiv.org/abs/2609.07816v1)*

Linear-attention associative memory has a specific online limitation: a delta-rule model chooses how strongly to overwrite from the current token, without representing confidence accumulated in its memory estimate. KDN changes the state, not just the gate. It models a latent associative map with noisy key-conditioned observations as a linear–Gaussian state-space model. Under that model, the Kalman filter jointly propagates the memory mean and covariance, and its gain weights a residual write using accumulated evidence and observation reliability. The delta-style update is recovered as a special case that substitutes a token-wise isotropic predictive-covariance surrogate and drops covariance tracking.

The engineering constraint is decisive: the exact Kalman update carries a dense d_k×d_k covariance per head and a state-dependent Riccati recursion, so it is poorly suited to GPU-parallel linear-attention scans. KDN replaces that exact recursion with two scan-compatible approximations. Diagonal KDN assumes diagonal dynamics and process noise, applies an online reverse-KL mean-field projection after each update, and keeps O(d_k) uncertainty state per head. Isotropic KDN compresses uncertainty to one scalar per head. In both variants, the uncertainty recurrence is a Möbius map, so gains can be emitted by an associative scan with logarithmic parallel depth.

Diagonal KDN has a narrower guarantee: conditional on a diagonal predictive prior, its reverse-KL projection preserves the exact one-step Kalman posterior mean while replacing the dense posterior covariance with a diagonal state.

At model scale, the paper reports that both KDN variants improve WikiText and LAMBADA perplexity and mean six-task zero-shot accuracy over the evaluated linear-time recurrent mixers. The comparison used matched-capacity models trained from scratch on FineWeb-Edu: 750M parameters for 50B tokens and 1.3B for 100B, with a 4K sequence length and matched optimizer and batch settings.

Runtime evidence is more qualified. In a one-H200 mixer-layer benchmark, Isotropic KDN closely tracks KDA; Diagonal KDN costs more because of its channel-wise uncertainty scan, although the paper reports that it remains close to GDN-2 and scales linearly with sequence length.

The transferable research operation is an overwrite-stress ablation: hold the paper’s controlled pretraining recipe fixed, compare a delta baseline, Diagonal KDN, and Isotropic KDN on repeated and conflicting keys, and measure retention of old associations, residual-write gains, and language-model loss separately. This would test whether the benefit comes from calibrated uncertainty, diagonal factorization, or simply an additional token-dependent write mechanism.

Read this paper to learn how to turn uncertainty into an explicit recurrent-memory state while retaining associative scans, then test whether uncertainty-derived write gains actually reduce destructive overwriting.

[Sx1.p1; S1.p4; S4.SS1.SSS0.Px2–Px3; S4.Thmdefinition1; S5.SS2.SSS0.Px1; Table 1; S5.SS3.SSS0.Px3](https://arxiv.org/abs/2609.07816v1)

## SVRL trains multimodal search agents to verify snippets inside reinforcement-learning trajectories

*[Eliciting Self-Verification in Multimodal Reasoning Agents with Reinforcement Learning](https://arxiv.org/abs/2609.08025v1)*

Earlier MMSearch-R1 used image and text search with an outcome-based reward and a search penalty to guide on-demand tool use. SVRL targets the associated limitation described by its authors: sparse outcome-level supervision does not provide an explicit signal for which retrieved evidence to trust. The method fine-tunes Qwen-2.5-VL-7B on 5,000 visual question-answering examples and moves evidence assessment into the agent’s trajectory.

During training, the agent proposes multiple candidate text queries and emits a binary usefulness vector for retrieved items. A stronger GPT-5 verifier with access to the ground-truth answer supplies query and snippet labels; the alignment rewards are applied only when the final answer is correct. SVRL also adds a search-aware penalty for unnecessary tool calls and a query-diversity reward that encourages diverse, well-formed search queries. The intended inference procedure uses the learned verification behavior without invoking that external verifier.

The clearest reported result is a test-time scaling experiment: on a 256-example FVQA-test subset with up to 15 parallel text searches, SVRL continued to benefit from additional search budget, whereas MMSearch-R1++ saturated after roughly five searches. This is a useful research operation to reproduce: vary the parallel-search budget, aggregate answers identically, and measure accuracy together with search count rather than reporting a single fixed-budget score. Also log snippet-level decisions, because they expose a failure mode hidden by final-answer accuracy.

The boundary is important. Training still relies on verifier-generated labels with ground-truth access, which the authors say creates dependence on teacher-model biases. The learned filter is conservative in a specific direction: it accepted 1,495 summaries that GPT-5.0 labeled as noise, while rejecting 82 summaries that GPT-5.0 considered useful. The experiments cover a short interaction horizon and a restricted action space centered on image search, text search, verification, and answering. Finally, primary accuracy evaluation uses GPT-5.0 as a judge, which the authors note is not fully reproducible and can be sensitive to prompt phrasing. SVRL therefore offers a concrete policy-design recipe, not yet a teacher-independent account of reliable evidence filtering.

Read this paper to examine whether making snippet verification an RL action changes the search-budget curve of a compact multimodal agent, while checking how much the result depends on a ground-truth-aware teacher.

[abstract; S3.SS3.SSS0.Px2 (Verifying Search Results); S5.SS0.SSS0.Px4 (Test-time scaling); Appendix E.2 (Verification and Filtering) / Table S5; Appendix H; Appendix D.4](https://arxiv.org/abs/2609.08025v1) · [abstract1.1; S2.SS2.p1.1; S2.SS4.p1.1-S2.SS4.p2.1](https://arxiv.org/abs/2506.20670v1)

## Blind Text Judging Reproduces Debate-Tone Disagreement Patterns

*[A Layered Analysis of Disagreement And Answer Quality in Multi-Agent LLM Debate](https://arxiv.org/abs/2609.08016v1)*

Multi-agent debate is widely assumed to improve answers by surfacing genuine disagreement, but the paper states that this mechanism is rarely checked. It separates four observations: an agent’s reported agreement; textual pushback in the reply; persistence after removing the eliciting instruction; and, for open-weight models, stance responses in token log-probabilities. [Source: Abstract]

The authors evaluate three-model committees on open-ended GlobalOpinionQA in 750 debates under friendly, neutral, and hostile tones. The surface intervention is substantial: full agreement differs by 50.4 percentage points between the friendly and hostile endpoints. To test whether this is merely a changed label, they use an external judge that reads each reply alone, without the self-report or stance instruction. This blind judge reproduces the friendly-to-hostile agreement drop at pilot and grid scale, so the evidence supports a change in the reply text as well as in emitted agreement labels. [Source: Abstract; S1.I2.i2; S5.SS2]

The later layers narrow what can be inferred from that result. After the hostile instruction was deleted, labels reverted toward agreement 23.1 points more often than under a matched re-ask retaining it. The first-round, question-weighted persistence analysis was inconclusive (*p* = 0.0625), whereas pooling rounds was significant (*p* = 0.016); only 11 of 28 first-round reversions also appeared in reply text. For final answers, the bias-checked jury produced 299/299 ties, while accuracy on a verifiable control task was unchanged. The authors therefore report no detected quality gain, while explicitly noting that the jury rules out only large differences. A jury without the bias check had favored debate 66% of the time, which the paper attributes to reading order. [Source: Abstract]

A transferable experiment is to treat “the agent changed its mind” as a multi-measurement hypothesis. Collect self-reports, run a condition-blind text assessment, and compare prompt removal with a retained-instruction re-ask before making a persistence claim. Validate the judge separately: on 107 completed cases, the paper’s Gemini judge was close to human agreement for four-level disagreement severity, but clearly weaker for binary direction. For open-weight probes, treat token-logprob movement as an additional diagnostic rather than evidence of belief: the authors warn that saturated responses can flatten at a pole without directional relocation. [Source: S3.SS2.p1.2; S5.SS6.SSS0.Px3]

Read this for a concrete audit design that tests whether debate-induced disagreement is present in labels, text, post-prompt persistence, and token probabilities rather than assuming these signals mean the same thing.

[Abstract; S1.I2.i2; S3.SS2.p1.2; S5.SS2; S5.SS6.SSS0.Px3](https://arxiv.org/abs/2609.08016v1)

## Performance consistently drops from vulnerability-status prediction to justification prediction.

*[VEX-Bench: Benchmarking LLM Agents for Assessing Exploitability of Software Supply Chain Vulnerabilities](https://arxiv.org/abs/2609.08040v1)*

Existing defenses such as GitHub Dependabot often raise many false alerts because their coarse-grained matching cannot determine whether a vulnerable dependency is actually exploitable. VEX-Bench evaluates the downstream question instead: whether a known vulnerability in an upstream dependency affects a particular dependent repository.

The benchmark changes the evaluation unit from an alert to a cross-repository case. It contains 75 real-world cases mined from GitHub and labeled by security experts, covering Python, Java, and Go. The authors mined dependency-update pull requests, applied filters including dependency-manifest or lockfile changes, and then used manual annotation. In calibration, five annotators independently labeled 15 cases across the three languages, with an initial Fleiss’ Kappa of 0.667; the subsequent process produced consensus labels. The task measures both a binary affected/not-affected status and fine-grained justification classes: one vulnerable class plus four not-affected reason categories.

The reported experiment evaluates nine models across three agent harnesses. Under the paper’s isolated-Docker setup and three-run reporting protocol, GPT-5.5 and Claude Opus 4.6 reach approximately 80% F1 on binary vulnerability-status classification. For the finer label, only GPT-5.5 surpasses 70% macro-F1 on fine-grained justification classification; its reported macro-F1 is 73.5%. The authors therefore observe that performance consistently drops when the task requires a reason category rather than only a status. This is a measured benchmark pattern, not evidence that a binary decision is sufficient for a deployment decision.

The scope matters. The benchmark has 75 cases across three ecosystems, and some justification categories have few examples. A case may also admit multiple valid explanations even though the benchmark assigns a single gold explanation. Finally, VEX-Bench assesses repository snapshots from source code and configuration available in the repository, so it cannot fully capture dynamic inputs or deployment-specific environments.

A transferable evaluation operation is to score the decision and its explanation separately. For an agent that correctly marks a project as not affected, ask whether it selects the same operational reason class as the reference—not merely whether its final label is correct. Reviewing status-correct but reason-incorrect cases can expose where an agent’s apparent triage success is not yet an auditable justification.

Read §3.2 and Table 2 for a concrete template that separates binary agent triage from explanation-quality evaluation, including the annotation and static-snapshot constraints.

[Abstract; §3.2; §4.1–§4.2; Table 2; Limitations](https://arxiv.org/abs/2609.08040v1)

## ObGynLongBench Measures the Evidence-to-EHR Gap in Longitudinal EHR Decisions

*[ObGynLongBench: Revealing the Evidence-to-EHR Gap in Longitudinal EHR Decision-Making](https://arxiv.org/abs/2609.07601v1)*

Existing medical benchmarks, the authors argue, largely present static questions with pre-selected evidence; this leaves unclear whether a model can make decisions after locating and time-anchoring the relevant facts in a patient's record. ObGynLongBench changes the input rather than the clinical question: it contains 1,500 rule-grounded multiple-choice decision points drawn from 976 real pregnancy EHR histories. Each case has a patient anchor, a pregnancy-timeline point, and a pre-decision information boundary, so the same task can be evaluated with supporting evidence supplied, same-day records, or the full history available before the decision. ([Abstract])

Across 17 LLMs, the reported central result is a clear Evidence-to-EHR Gap: models perform well with Evidence-only input, but accuracy falls when they must extract evidence from Visit-level or History-level EHR input. The paper therefore separates rule application from evidence access. In the History setting, accuracy is reported to be highest for single-evidence cases (L1), lower for multi-source local-context cases (L2), and lowest for long-horizon cases requiring evidence more than seven days apart (L3). The authors also report lower performance as pre-decision EHR context length increases. ([Section 3.2; Sections 4.1–4.2])

The failure pattern is not only per question. Among 240 patients with two consecutive decision points, most models had lower accuracy at the second point when they had missed the first, and higher accuracy when they had answered the first correctly. This is evidence of within-history error association in this benchmark, not proof that one model error causes the next. ([Section 4.3; Table 3])

The most concrete systems result comes from the EHR-access comparison. Averaged over three Qwen3.5-series models, an active-search Agent achieved 64.2% accuracy, a 4.6-percentage-point improvement over Direct access; its largest reported gain was 5.7 points on L3 cases. The Agent could use up to 20 interaction turns for iterative semantic retrieval, so this result applies to that tested setup and should not be read as a general comparison of all agents. ([Section 5; Table 4])

A transferable research operation is to keep the decision rule and question fixed while progressively widening the available record—from gold evidence to local visit to full pre-decision history. This makes it possible to ask whether an apparent reasoning failure is instead a retrieval or temporal-grounding failure, and whether an intervention helps most on long-horizon evidence.

The boundary is substantial: the cohort comes from one tertiary hospital, records are Chinese-language, and MCQ accuracy does not assess open-ended recommendations, uncertainty expression, or interactive clarification. The benchmark can diagnose these controlled EHR decision tasks; it does not establish reliable clinical assistance. ([Limitations])

Read this to adopt a controlled evaluation design that distinguishes clinical-rule application from patient-specific evidence retrieval and temporal grounding in longitudinal records.

[Abstract; Section 3.2; Table 2; Sections 4.1–4.3; Table 3; Section 5; Table 4; Limitations](https://arxiv.org/abs/2609.07601v1)

Prepared retrospectively from the 2026-09-09 candidate papers; verified on 2026-09-16.
