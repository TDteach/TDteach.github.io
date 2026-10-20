# 2026-10-21

## SAGE-CP calibrates adaptive VLM routes instead of trusting marginal coverage

*[SAGE-CP: When Marginal Coverage Hides Route-Conditional Failures in Adaptive VLM Ensembles](https://arxiv.org/abs/2610.23864v1)*

Adaptive VLM ensembles can stop on easy images and escalate harder ones. SAGE-CP identifies a specific failure in evaluating them with one conformal threshold: if a route has prevalence π, marginal 1−α coverage permits route coverage as low as max&#123;0, 1−α/π&#125;; a route with π≤α can therefore have zero coverage while the overall predictor remains marginally valid.

**Method.** The router is learned on development data, then its routing choices, aggregation rule, score, and finite route map are frozen before final calibration. SAGE-CP computes a separate split-conformal threshold for each operational route, chiefly first-source exits versus escalated inputs. Under exchangeability of calibration and test examples conditional on development data, Theorem 4 gives finite-sample coverage of at least 1−α within every positive-probability route.

That is a narrower contribution than conformal prediction for adaptive inference generally. Conformal Cascade instead calibrates per-tier answer sets, accepts only singleton sets, and defers otherwise; its unconditional bound is Kα, while its sharper α guarantee requires an additional selection-preservation condition. SAGE-CP’s target is route-level prediction-set coverage for the frozen VLM ensemble.

**Evidence.** In the matched comparison at α=0.10, across ten datasets and five aligned splits, marginal coverage remains 0.900, while mean worst-route coverage rises from 0.623 to 0.887 and the mean route-coverage gap falls from 0.324 to 0.025. Mean prediction-set size increases from 1.893 to 2.212. Against the full four-source ensemble, SAGE-CP uses 70.6% fewer source calls, with mean set size 2.212 versus 2.486.

Finer route partitions are not free: mean minimum-route coverage falls from 0.887 for the binary taxonomy to 0.849 for four depths, and some four-depth thresholds become vacuous; at least one route had fewer than nine calibration examples in 27 of 50 splits. The guarantee is conditional on calibration and deployment data being exchangeable given development data; route-conditional validity is neither pointwise nor class conditional. Reported latency reductions of 58.8%–63.4% and gross GPU-energy reductions of 55.7%–57.5% come from batch-one measurements on one RTX A4500 with all models resident.

For a new adaptive predictor, freeze routing before final calibration, report marginal and route-specific coverage together with route prevalence, set size, and calibration counts, and add finer partitions only after checking support. Treat rare-route full-set thresholds as a diagnostic of insufficient calibration data, not as evidence that the refinement is useful.

It gives a concrete protocol for auditing adaptive predictors: freeze routing, calibrate the operational groups whose reliability matters, and measure the resulting coverage–set-size cost before refining routes.

[abstract](https://arxiv.org/abs/2610.23864v1) · [§3.4, Theorem 2; Eq. (5); §3.1, Eq. (3); Appendix L.1, Lemma 5](https://arxiv.org/abs/2607.25018v3)

## ToolRosetta finds shell-form false positives in four of five tested specialized guards

*[ToolRosetta: Surface-Form Invariance of Tool-Call Guards](https://arxiv.org/abs/2610.24055v1)*

ToolRosetta targets a concrete integration failure: step-level guards are evaluated on tidy JSON tool calls, whereas deployed coding agents act through `execute_bash` and `execute_code` tools whose payloads are strings. The paper asks whether a guard preserves its verdict when the same action is represented differently.

**Method.** The core intervention uses programmatic Python and shell renderings with round-trip checks rather than model-written conversions, allowing the authors to vary action surface form while keeping the original label and context fixed. The study re-renders renderable AgentDojo and AgentHarm steps from TS-Bench, and separately removes the agent’s rationale. The rendering is accepted only when parsing recovers the original tool and arguments, so the tested change is the representation rather than the underlying action.

**Result.** On AgentDojo, the shell form substantially increased false-positive rates for four specialized guards—TS-Guard, AgentDoG, ShieldAgent, and Safiron—with increases of 21 to 47 percentage points. StepGuard is the counterexample: in the tested splits, shell rendering produced little change in its error rates. The tested frontier guards were comparatively stable, but not perfectly invariant; Gemini’s AgentHarm shell-form false-positive rate increased by 3.4 points. The effect also appeared for TS-Guard on the evaluated ASB extension, where shell rendering increased false positives by 37.8 points. A request-blind control is consistent with Gemini using the agent’s rationale to recover intent when the user request is unavailable, but this control does not explain the specialized guards.

The practical research operation is to add semantic-preserving serialization tests to guard evaluation: render each canonical action in the actual Python or shell interface used by the agent, verify reversibility, and compare guard operating points across forms. A boundary parser that restores the canonical tool call before judging removes the observed effect for the reversible renderings tested; this is a construction-specific mitigation, not a demonstrated defense for arbitrary code.

The evidence remains bounded. The test covers fictional wrapper definitions, one canonical rendering style per form, and shell encodings that preserve values but not types. The specialized comparison includes only five guards, with one remaining stable, so the paper cannot identify which guard property accounts for the difference. Hosted-guard results are based on one run per condition, limiting conclusions about run-to-run variability.

Read this paper to learn a concrete paired evaluation for whether a guard remains calibrated when an agent moves from structured tool calls to code or shell interfaces.

[abstract; §1 Introduction, paragraph 3; §3.1; §3.4 Mitigation: resolve, then judge](https://arxiv.org/abs/2610.24055v1)

## GUI world-model gains depend on the evaluator, while direct action ranking improves the tested AndroidWorld deployment

*[Beyond Next-Screen Prediction: The Decision Value of GUI World Models](https://arxiv.org/abs/2610.24372v1)*

The paper isolates a specific attribution problem: an end-to-end lookahead gain may come from the predicted successor, the evaluator that interprets it, or their interaction. It defines a GUI world model’s “decision value” as the incremental action-selection improvement from predicted observations beyond direct evaluation of the same candidates. In a fixed-prediction intervention, changing how the same predicted successors were presented to the evaluator changed the reported lookahead gain. This makes the evaluator part of the experimental object, not merely a neutral measurement layer.

The practical method is Direct Action Ranking (DAR). DAR scores each candidate from the task goal, current interface, and action description, learning from reference-action matches with a listwise within-set ranking loss plus a pointwise match loss; it does not generate a successor screen at selection time. The paper compares DAR with a prediction-augmented variant under matched supervision, so the added predicted successor—not a different candidate set or training target—is the intended experimental difference.

The decisive offline finding is that predicted successors add no detectable ranking signal once evaluation is learned directly. The deployment result is stronger operationally but narrower causally: without retraining, DAR improves AndroidWorld task success by 5.8–16.4 percentage points across three proposers and outperforms the tested world-model lookahead configurations. The paper explicitly notes that this DAR-versus-lookahead comparison does not measure decision value, because the comparison is not matched.

The zero-shot transfer result also needs its metric attached: on 14 unseen Korean-language apps in MWMBench-KApps, every tested prediction-conditioned configuration falls below proposer confidence in reference-match AUROC, while DAR has the highest AUROC for each proposer. This is evidence about candidate ranking, not task success.

The boundary is one-step, inference-time candidate selection; the study does not establish multi-step planning, policy training, or other simulator uses. It also reports that pooled AUROC and online success can diverge, so offline selector quality is not a sufficient downstream proxy. A reusable experiment follows: freeze the proposer and candidate set, train direct and prediction-augmented evaluators with identical supervision, then vary the evaluator while holding predictions fixed. Ask whether the successor changes action ordering beyond the direct evaluator, and report ranking, execution, and transfer outcomes separately.

Read it to learn how to separate a world model’s contribution from the evaluator’s contribution before investing in richer successor-screen prediction.

[abstract; §1; §4.1; Appendix D, Table 16; §5.1; §6.1; Appendix C.1, Table 14; §6.3; Appendix C.2; §3.3; §5.3; §6.4](https://arxiv.org/abs/2610.24372v1)

## PAA-Bench evaluates VLM token pruning beyond accuracy and token count

*[Are We Evaluating VLM Token Pruning Right? Looking Beyond Accuracy and Token Count](https://arxiv.org/abs/2610.24740v1)*

Visual-token pruning is commonly evaluated with aggregate task accuracy and retained token count. The paper identifies two resulting blind spots: aggregate accuracy can obscure whether critical visual tokens were selected, while identical token budgets can incur different end-to-end costs depending on where and how pruning occurs. It therefore argues that comparisons using those proxies can fail to recover the global performance–efficiency Pareto frontier across methods.

PAA-Bench is a plug-and-play evaluation framework for existing benchmarks. Its first move is to evaluate preservation on examples the dense model answers correctly, so wrong-to-correct gains do not mask losses of dense-model successes. Random-Pass@k then counts successful trials among k random masks for each such example; it is a per-example counterfactual sensitivity measure under fixed model, budget, pruning location, eligible positions, and decoding rule. With k=10, the paper reports Easy (8–10), Medium (4–7), and Hard (0–3) strata. PCS finally reports the maximum speedup among evaluated configurations that meet a shared preservation target, using complete-pipeline runtime that includes token-selection and gathering overhead.

The need for stratification is empirical: more than 80% of examples remain correct in 8–10 out of 10 random-pruning trials under most evaluated settings. Preservation-aware scoring can therefore change conclusions: on LLaVA-1.5 with 64 retained visual tokens, CDPruner has higher relative aggregate accuracy than SparseVLM (96.9 versus 88.1), but lower W-Avg (89.3 versus 93.3). In the reported settings, selector differences widen on examples less likely to survive random pruning; difficulty-stratified reporting can expose distinctions muted by the empirical example mix.

The runtime results add a separate warning. Greater token compression does not necessarily yield greater realized speedup. On LLaVA-1.5/MMBench-EN, SparseVLM is faster than DivPrune at 95% preservation (1.74× versus 1.53×), while DivPrune is faster at 90% (1.95× versus 1.83×). For a new pruning study, report dense-correct preservation, Random-Pass strata, and measured PCS operating points rather than one accuracy/token-count pair. Treat Easy, Medium, and Hard as intervention-specific strata—not general question difficulty—and remember that PCS selects the best measured configuration, not an exhaustive continuous frontier. The runtime tables cover three primary backbones and four tasks; supplementary model configurations have no runtime measurements.

Read this when comparing VLM token-pruning methods and deciding whether a reported compression result reflects meaningful token selection or actual end-to-end speed.

[abstract; Sections 1, 4.1–5.3; Appendices A.2, A.4, C.1, C.4, E.1, G.2](https://arxiv.org/abs/2610.24740v1)

## Perturbed Retrieval Certifies Adaptive Sparse-Attention Value Reads

*[Certified Sparse Attention via Perturbed Retrieval](https://arxiv.org/abs/2610.24991v1)*

Long-context sparse attention has a concrete reliability gap: existing methods do not control a query’s error, and errors on real KV caches have heavy tails.

*Certified Sparse Attention via Perturbed Retrieval* changes the estimator and stopping rule together. It adds an independent Exp(1) perturbation to every key score; threshold retrieval then samples keys with probability proportional to their attention weights. Heavy keys are retained exactly, while sampled lighter keys support a Horvitz–Thompson estimate. Lowering the threshold over a geometric grid creates nested samples, and simultaneous confidence bounds let each head stop at the first level whose certificate meets the target error. The key methodological change is that stopping can depend on the observed sample without invalidating the stated bounds.

At a suitable threshold, the estimator reads a number of values of order ε⁻² log(1/δ), independent of context length and attention-distribution entropy for value-scale error. Output-norm error additionally depends on a cancellation factor. This is an oracle-threshold result: in practice, the adaptive rule reads 2.7–4.9 times as many keys as an oracle that knows the true error.

The operator-level results are strong under their stated accounting. At matched key reads, the proposed estimator’s 90th-percentile error was 4.6–7.9 times lower than that of the best qualifying configurations among 15 baseline families. Across 120 reported configurations, the authors observed no certificate violations and no exact-attention fallbacks. At equal bytes, however, the best baselines had 0.6–1.6 times the proposed method’s 90th-percentile error and at least 4.9 times its largest error. On CPU, whole decoding steps at 32K–128K tokens were 1.1–1.4× faster than the authors’ dense kernel on the same 16-bit cache.

The central boundary is architectural: deterministic candidate generation still scans every key, and the paper identifies certified sublinear candidate generation as open. The reported speed comparison is CPU-only; baseline comparisons use bytes read rather than runtime, so these results do not establish optimized-GPU or matched-kernel superiority. The certificate applies to an eligible attention output, not unchanged model behavior, and closed-loop generation requires fresh perturbations at every decoding step; fixed perturbations are outside the stated guarantee.

A useful replication question is whether the certificate remains cost-effective after replacing the full scan with an approximate candidate generator: keep ε and δ fixed, then report certificate violations, value reads, total bytes, and runtime separately.

Read it to learn how to make a data-dependent stopping rule statistically valid, while checking whether its full key scan erases the claimed value-read savings.

[Abstract; Section 5, paragraph 4; Section 5, paragraph 13; Section 6.2, paragraph 1; Table 1; Section 6.3, paragraph 1; Section 6.5, paragraph 1; Table D.11b; Section 7, paragraph 2; Section 7, paragraph 6; Impact Statement, paragraph 1; Section 7, paragraph 6; Section 3, paragraph 3](https://arxiv.org/abs/2610.24991v1)
