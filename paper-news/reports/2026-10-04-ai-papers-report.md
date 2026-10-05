# 2026-10-04

## CELLAUDIT audits claimed input use beyond held-out prediction scores

*[Discover, Falsify, Revise: Auditing Input-Use Claims from Source Code to Predictive Contribution in Agent-Discovered Cell Models](https://arxiv.org/abs/2609.27234v1)*

A held-out prediction score does not by itself show that a model used the supplied perturbation input. CELLAUDIT turns that gap into three separate checks: whether the cited source code permits the input to enter the computation, whether fitted predictions change when that input is replaced, and whether the change improves prediction of the observed response. The method's key change is to treat implementation, fitted dependence, and target-relevant contribution as different claims rather than one inference from PCC.

On BBBC047, a high-scoring predictor was exactly invariant to compound replacement: its Global PCC was 0.3153 versus 0.3142 for a control-only predictor on Fold 5, and the paired full-minus-control interval crossed zero. Source inspection traced the inactive cited compound pathway to singleton key-value attention, whose normalized weight is constant and therefore cannot transmit compound information through its query. The distinction between dependence and benefit also appeared across a stratified sample: 47 of 48 candidates changed predictions under compound replacement on both folds, but only 20 had positive target-loss scaffold intervals on both folds.

The audit findings also drive revision rather than merely post hoc criticism. On BBBC047, falsification-guided residual models retained predictive gains over a control-only anchor: full-minus-anchor Global PCC gains were +0.0037 on Fold 4 and +0.0028 on Fold 5, while mean compound effects were positive on both folds and joint model-scaffold intervals for the predictive increments were above zero. However, the registered dose-eligibility rule was unmet on both folds, so these panels do not establish dose use.

The broader feedback result is suggestive but not decisive. In matched sci-Plex searches, audit-enriched feedback produced higher mean held-out prediction and compound/dose contributions than score-only feedback, but the comparison used five paired trajectories and paired intervals spanning zero. In independent-acquisition refits, dose-use support transferred under the registered criterion, whereas compound-identity support did not, despite positive full-model predictive gains over the control-only baseline.

For a research pipeline, the concrete operation to borrow is to record the claimed input path and replacement distribution before evaluation, then report source implementation, prediction dependence, and target benefit separately on frozen checkpoints. Replacement effects remain conditional on that registered distribution; they do not establish causal effects or biological mechanism. The operational question is whether a claimed input changes predictions and whether the registered replacement test shows that the change improves the observed target—not merely whether PCC rises.

Read it to learn how to turn a strong score into three separately testable input-use claims before trusting an agent-discovered model.

[abstract; §6.1; §6.4–§6.6; §7](https://arxiv.org/abs/2609.27234v1)

## Pointwise LLM-Judged Benchmarks Have a Judge-Dependent Reliability Ceiling

*[Ask Which, Not How Good: Sizing Benchmarks Scored by an LLM](https://arxiv.org/abs/2609.27787v1)*

Adding benchmark items is not always a route to a more decisive LLM-judged comparison. Prior statistical planning for LLM evaluations models uncertainty over sampled questions and can use paired question-level differences. The concrete limitation for judge-scored benchmarks is that item-level planning alone does not reveal residual system-by-judge error: under this paper’s model, items cannot reduce that component.

The method changes the measurement target. Using 373,019 judgments, the paper fits a crossed generalizability-theory model with the system as the object of measurement, decomposing variation into system, item, judge, and interaction components. With one judge, generalizability approaches σ²_s/(σ²_s + σ²_sj) as item count grows. The resulting ceiling concerns reliability—reproducibility of system comparisons—not whether the rubric measures quality validly.

The estimates depend on the judge universe and scoring protocol. For pointwise MT-Bench scoring, the reported ceiling is 0.798 for six current-generation judges but 0.600 when all nine judges are included. In a matched MT-Bench comparison, the native protocol nearly doubles the system share of variance, from 4.8% to 8.4%, and raises the estimated single-judge ceiling from 0.623 to 0.798. These are closed-panel, benchmark- and rubric-specific estimates, not universal properties of MT-Bench.

Pairwise scoring is not a simple fix. In a separate order-balanced pairwise arm, the estimated single-judge ceiling reached 0.986, with bootstrap interval [0.934, 1.000], but presenting a system first increased its win rate by 8.6 percentage points on average. The authors caution that this arm used their own items, judges, and fixed baseline, so it does not directly measure deployed Arena-Hard or AlpacaEval 2 pipelines.

The practical sizing signal is consequential: measured floors were 0.41–1.24 points on a 0–5 scale at native item counts, against a median reported improvement of 0.28 points. In the paper’s only exactly matched benchmark comparison, all 17 recovered MT-Bench improvements fell below the estimated floor at both 30 items and MT-Bench’s native 80 items. For a new evaluation, pilot a crossed subset with multiple judges, estimate system-by-judge and protocol effects, and calculate the detectable difference before choosing more items or reporting a small gain.

The boundaries matter. “Reliability is a precondition for a believable comparison, not a substitute for one.” The discrimination-screened Sieve set illustrates instrument design, but is not representative task coverage. The disclosure audit also has an unresolved denominator conflict: its prose refers to 227 papers while the Table 5 caption says 92. These qualifications should accompany any transfer of the paper’s ceilings or audit rates.

Read it before sizing an LLM-judged evaluation: it gives a concrete way to decide whether the next dollar should buy more items, more judges, or a protocol-bias pilot.

[abstract; abstract; §3, The measurement model and The ceiling; equations (2) and (4); abstract; §5.5; Table 4, MT-Bench row; abstract; §5.3, matched protocol comparison; Table 2, lower block; abstract; §5.4, pairwise design and position bias; Table 3; abstract; §5.6, The matched comparison; abstract; §8, Protocol; abstract; Appendix A, Reliability is not validity; abstract; Appendix A6, Sieve; abstract; §6, opening paragraph; Table 5 caption](https://arxiv.org/abs/2609.27787v1) · [§2, §2.1; §4.2](https://arxiv.org/abs/2411.00640v1)

## LIMBO finds that exactly-once protection depends on whether a write outcome is observable

*[Where Does Exactly-Once Live? Model, Harness, and Tool-Contract Effects on Duplicate Side Effects in LLM Agents](https://arxiv.org/abs/2609.29095v1)*

An ambiguous write can already have taken effect when a timeout or server error arrives: retrying may duplicate the side effect, while giving up may skip required work.

A supplied prior study already proposed a task-specific postcondition check before retrying an ambiguous action. Its concrete limitation was scope: evidence covered two simulated workflows with hand-designed verifiers, and live external APIs were not evaluated. LIMBO changes the evaluation target rather than presenting verification-before-retry as new: it introduces a deterministic sandbox with six services, realistic contracts, twelve service-boundary fault modes, and a ledger of committed effects. Across 25,930 episodes, it crosses nine models, three production harnesses, two contract variants, and fifteen recovery conditions.

The decisive split is whether immediate read-back can reveal what happened. For the six tested frontier models, duplicate rates were 0.5% for a committed write with a lost acknowledgement, versus 56% for late commits and 74% for redelivery episodes. The variance decomposition assigned 30% of explained duplicate variance to contract on read-back-resolvable faults and 81% when read-back could not resolve them; model shares were 53% and 8%, respectively. In the verified-before-retry subset, eventual consistency was associated with more duplicates than strong consistency (13.4% versus 0.8%).

When keys were available on every write and the guard attached them, late-commit duplicates fell from 68% to 7% and redelivery duplicates from 74% to 0%, with exactly-once success reaching 99%. The paper also proves that verification alone cannot guarantee exactly-once completion for late commits without a bound on in-flight time. Under the tested heavy-tailed delays, waiting one hour reached 84% exactly-once success at 49.9 simulated minutes per episode.

But these are simulated-service results, not production estimates; the paper notes gateway-controlled settings, time-specific model versions, and exploratory analyses as limitations. The exact waiting-versus-keys tradeoff also depends on the chosen delay distribution. For a new reliability experiment, stratify faults by observability first: use read-back verification where it can distinguish states, and test contract-level guarantees where it cannot.

Read this to decide whether your next reliability experiment should tune verification logic or add a write-contract guarantee.

[abstract; §6.1; §6.2; §6.3; §7](https://arxiv.org/abs/2609.29095v1) · [§4.1; §4.4–4.5; §5.1; §7; §8](https://arxiv.org/abs/2608.02645v1)

## RAG needs temporal-validity checks to avoid stale-document poisoning

*[Stale-Document Poisoning: When Outdated Retrieval Overrides Correct Model Answers](https://arxiv.org/abs/2609.31342v1)*

RAG helps with outdated knowledge only when retrieved evidence is still valid. This paper studies stale-document poisoning: authentic, once-valid evidence makes a model wrong despite a correct answer without retrieval.

A nearby medical benchmark, MedRevQA, asks models to answer without supplied context and compares predictions with outdated and latest labels. That design measures internal-knowledge performance, but it does not test whether retrieval overturns an answer that the same model initially got right.

The authors construct a 317-item benchmark of knowledge reversals across medicine, law, software/API, and platform policy, grounded in dated official sources. They count poisoning conditionally: a failure is recorded only when the model answers correctly without retrieval and then changes to an incorrect answer after receiving the outdated document.

The decisive control uses 50 verified reversals. Within each pair, the historical evidence, question, answer options, and instructions remain fixed; only the evaluation date changes. The results separate date recognition from validity judgment. Qwen-72B made all 50 required old-to-current transitions when the validity boundary was stated explicitly, whereas date-only transitions produced only 7 of 50 changes for that model. In the matched medical comparison, outdated retrieval flipped 30% of Llama and 37% of Qwen answers without a follow directive; explicit instructions to follow the document raised those rates to 66% and 75%.

Activation patching adds a mechanistic probe: changing internal states at the evaluation-date position shifted answer preference, while patches at the unchanged source-date position and self-patches had negligible effects. The authors restrict this causal interpretation to a controlled answer-logit task, using up to 20 behaviorally eligible items per large model; it is not evidence that the same components govern unconstrained generation or deployed RAG.

The proposed mitigation is narrower than the diagnosis. A fixed hybrid re-ranker combining semantic similarity, document year, and a supersession cue reduced poisoning by 4.6–10.0 percentage points when dates were correct. Incorrect dates could reverse the benefit, so the intervention depends on reliable temporal metadata.

For a new evaluation, borrow the matched design: keep evidence and question fixed, vary only the evaluation date, and compare date-only prompts with explicit validity boundaries. This directly tests whether a system is merely following retrieved text or judging whether that text still applies. Also report item-difficulty limitations: the paper’s settled-versus-recent medical comparison uses different questions and therefore cannot fully separate recency from difficulty.

Read it to borrow a controlled temporal-applicability test for RAG: the paper separates obedience to retrieved text from judging whether the evidence remains valid, then shows why metadata quality limits a simple recency fix.

[abstract; Section 2, paragraph 4; Section 3.2, paragraphs 1–2; Appendix G, paragraphs 1–3; Appendix N, paragraphs 2–3; Table 14](https://arxiv.org/abs/2609.31342v1) · [§4, Experimental Setup; Table 2](https://arxiv.org/abs/2509.04304v1)

## Mismatched targets and random rewards preserve some world-model post-training gains

*[Does Learning to Predict the World Help Agents Act? Auditing World-Model Post-Training](https://arxiv.org/abs/2609.33335v1)*

Next-observation post-training has a concrete attribution problem: the optimization used to reward prediction may introduce effects other than learning to predict the world. Thus, a task gain after world-model training does not by itself identify what the agent learned.

This paper turns that concern into controlled interventions. It compares true next-observation targets (GT) with real observations from the training distribution that are mismatched to the transition (MIS), while keeping the training procedures matched. A separate COIN condition replaces the prediction-based reward with independent random signals. The evaluation measures held-out prediction accuracy alongside pass@1 and pass@64, then examines candidate-action generation and looping.

The clearest result is a dissociation between prediction quality and task metrics. Across ALFWorld GRPO, ScienceWorld GRPO, and ALFWorld OPSD, prediction accuracy fell by 15.3–61.6% under MIS relative to GT, while the absolute pass@1 difference was 0.51–2.75 percentage points and the pass@64 difference was at most 3.0 points. In these comparisons, badly aligned targets and near-preserved task performance coexist; this is evidence about attribution under the tested procedures, not evidence that wrong targets are universally equivalent to correct ones.

The random-reward control makes the optimization explanation more concrete. In the ALFWorld list regime, COIN raised pass@64 from 56.20% for BASE to 87.23%, even though its reward contained no environment information. Ground-truth reward was associated with higher single-attempt success than COIN—37.30% versus 30.41% pass@1—while COIN reached higher 64-attempt coverage than GT, 87.23% versus 83.94%. Training, including COIN, also coincided with broader candidate-action consideration and less looping than BASE; these behavioral measures do not establish that every additional candidate improves success.

The result extends beyond the text environments only in a bounded test: on 201 held-out, read-only VisualWebArena tasks, COIN pass@64 was 39.80% versus 34.83% for BASE, a reported 14.3% relative improvement, with a paired exact McNemar test of p=0.0414.

The reusable research operation is an attribution audit: hold the optimizer, data volume, and evaluation fixed; corrupt only target correspondence; then replace the environment-informed reward with an independent placebo. Report both one-shot success and multi-sample coverage. Interpret the result cautiously: prediction accuracy is judged by an LLM, the main text-environment comparisons do not report multi-seed robustness, and the web test covers only 201 read-only tasks. The supported conclusion is that some gains survive removal of target correspondence or reward information in these implementations—not that environment information never helps.

Read it to learn a practical placebo-control design for separating environment information from optimization effects, while comparing both single-attempt success and multi-attempt coverage.

[abstract; §3.1, prediction accuracy and task performance; Table 2; §3.2; Table 2, ALFWorld list regime; §3.4 and Table 3; Table 2, ALFWorld list regime; §4.2, Table 4; Appendix D, Paired results; §2.2, prediction-accuracy measure; Appendix A.1, data and training settings; Appendix D, Task split](https://arxiv.org/abs/2609.33335v1)

Prepared retrospectively from the 2026-10-04 candidate papers; verified on 2026-10-05.
