# 2026-10-16

## Fixed Proof Obligations Turn Verifier Diagnostics into a Trainable Code-Agent Reward

*[Verifier-Grounded Agentic RL for Provably Correct Code](https://arxiv.org/abs/2610.19298v1)*

### The limitation and the change

Code agents can pass tests while failing on inputs the tests do not cover. A formal verifier offers a stronger oracle relative to a specification, but a binary accept/reject signal provides no learning gradient when every candidate fails. The earlier SWE-Proof work supplied real issue tasks with formal specifications and verified reference implementations; this paper’s methodological increment is the training environment and reward, not the benchmark construction.

Before each episode, the environment fixes the set and denominator of proof obligations for the instance. The agent can submit candidates to a live verifier over multiple turns and receive diagnostics. Its reward is a weighted fraction of obligations discharged, with hidden isolated assertions derived from reference-proof annotations for annotation repair. Because the denominator is fixed, adding trivial annotations or weakening the candidate’s own proof burden does not directly increase the score. An integrity audit overrides the verifier: candidates that alter the specification or introduce constructs that let verification escape the intended proof are rejected.

### What the controlled evidence says

The cleanest comparison is the matched binary-reward ablation on DafnyBench. For the 35B-A3B model, verifier-grounded reward reaches 76.7% rather than 75.2% on annotation repair, and 93.5% rather than 71.0% on code generation. The environment, hyperparameters, training steps, and verifier-graded episode batches are otherwise held constant, so this comparison isolates the candidate-reward change more closely than a comparison across unrelated systems.

The held-out SWE-Proof result is larger but answers a different question. For the same 35B-A3B model, annotation-repair verification rises from 3.1% to 68.8%, while code-generation verification rises from 56.3% to 100.0%. In a separate repository-patch task, the specialist-assisted setting raises held-out issue resolution from 59.6% to 72.5%; resolution is determined by each project’s withheld tests, not verification alone. These results support inspecting the reward design and specialist condition separately rather than treating them as one end-to-end effect.

### What to carry into a new experiment

Treat the audit as a second instrument, not as evidence that the specification is correct: verification establishes fidelity to the supplied contract, while whether that contract expresses intended behavior remains a human responsibility. Audit coverage also depends on correctly enumerating verification-escaping constructs for the language in use.

A useful replication operation is to keep the environment, training schedule, and verifier batches fixed while replacing only the reward, then report the obligation denominator, hidden-probe policy, and artifact-audit failures. Finally, interpret the rates cautiously: the paper reports one greedy episode per instance, selects the checkpoint by held-out verified rate, and notes that held-out splits contain only 58–129 instances. The result is a concrete recipe for testing dense verifier feedback—not a general guarantee of correct software.

Read it to examine a matched binary-reward ablation that isolates whether verifier diagnostics provide a more useful RL signal than pass/fail feedback, while checking how the integrity audit and single-episode evaluation limit that conclusion.

[abstract; Section 3, The obligation ratio (S3.SS0.SSS0.Px1.p1); Hidden probes (S3.SS0.SSS0.Px2.p1); Section 4, Table 3 (S4.T3.2.4–5); controlled-ablation description in Section 4.5 (S4.SS5.p1); Section 4, Table 2 (S4.T2.6.8); Appendix E.3, SWE-Proof split (A5.SS3.SSS0.Px2.p1); Section 4, Table 4 (S4.T4.1.3); task and metric description in Section 4.6 (S4.SS6.p1–p2); Appendix I, Intended use and misuse (A9.SS0.SSS0.Px7.p1); Appendix C.3, What the two halves guarantee (A3.SS3.SSS0.Px4.p1); Appendix D.3, Reproducibility (A4.SS3.p2); Appendix F.1, Training curves (A6.SS1.p3)](https://arxiv.org/abs/2610.19298v1) · [Abstract; Section 1, paragraph 5; Appendix A, Table 4](https://arxiv.org/abs/2609.21190v1)

## A response-reconstruction game yields lower-error, less variable jailbreak judgments—but misses some fulfillments

*[Did the LLM Answer the Question? A Semantic Reconstruction Game for Jailbreak Evaluation](https://arxiv.org/abs/2610.19306v1)*

The paper starts from a specific evaluator failure: existing evaluators can mistake refusals or topically related responses for successful attacks, and changing only the judge LLM altered reported ASR by up to 82 percentage points. This is a narrower contribution than a first substantive-fulfillment evaluator: FJAR had already used query-specific anchored references and staged judgments to assess fulfillment. The distinct change here is to make response-only reconstruction rather than a query-specific anchored reference the central test.

Given only a response, the first LLM reconstructs a concise request represented by substantive content, excluding repeated, named, or refused material. A second LLM generates five semantically close decoys that differ in requested action, information, outcome, or direction. The judge receives the original request and randomized reconstruction–decoy pairs, selects a matching candidate or abstains when neither matches; abstentions count against the reconstruction, and a majority of reconstruction wins yields a jailbreak label. Thus the operational signal is semantic recoverability, not a direct harmfulness judgment. The paper’s analysis makes its central assumption explicit: fulfilling responses should usually make the request recoverable, while non-fulfillment should usually leave it unrecoverable.

On both human-labeled benchmarks, the game has the lowest mean MAE among evaluated methods. With three off-the-shelf judges and the stated benchmark conditions, mean MAE is 0.147 versus 0.181 for vanilla judging on StrongREJECT and 0.224 versus 0.389 on HarmBench. Across five tested attacks against Qwen2-7B-Instruct, the game has the smallest ASR spread among LLM-based classifiers, but the spread remains 12–28 percentage points; for I-GCG, vanilla-judge ASR ranges from 6% to 88% while game ASR ranges from 36% to 48%. This comparison is qualified because each attack run used its evaluator as the in-loop judge, so the judge also influenced attack generation.

The conservative tradeoff is visible in SorryBENCH: the game’s mean MAE is 0.000, 0.012, and 0.011 for refusal, specific-refusal, and refusal-with-safe-alternative categories, but 0.519 and 0.425 for incomplete and substantive successful responses. That pattern is consistent with the paper’s estimated fulfillment–recoverability gap: incomplete responses can fulfill a request without exposing enough content for reconstruction. For a replication, the concrete question is whether changing the number of decoys shifts recall and false positives; the paper uses five decoys but does not ablate their number. Transfer remains uncertain: the experiments use small 8–12B judge models and small attack targets, do not cover chain-of-thought traces, multi-turn jailbreaks, or multi-agent interactions, and do not establish robustness against attacks optimized for the evaluator’s verdicts. The practical takeaway is to report recoverability and fulfillment as separate quantities rather than treating the game’s label as ground truth.

Read it to learn how to separate semantic recoverability from harmful fulfillment when reporting jailbreak ASR, and how to test that choice against human labels and judge variation.

[abstract; Section 6.2; Tables 3–4; Section 6.3; Table 5](https://arxiv.org/abs/2610.19306v1) · [Section III-A, Anchored Reference Generation; Section III-B, Evaluation Process](https://arxiv.org/abs/2601.03288v1)

## Best-of-N Can Degrade When Incorrect Score Tails Outrun Correct Ones

*[Tail Competition Explains Scaling in Best-of-N Sampling for Verifiable Problems](https://arxiv.org/abs/2610.19362v1)*

Best-of-N is not only a question of whether sampling has produced a correct candidate. This paper treats selection as a race between the largest reward among correct candidates and the largest reward among incorrect candidates: success requires the former to win. Its extreme-value analysis separates correct-tail-dominant, incorrect-tail-dominant, and critical regimes, providing an account of both improving and degrading scaling.

Earlier work in the supplied comparison already studies inference-time proxy-reward hacking and proposes HedgeTune, whose principled calibration requires true-reward feedback. The practical change here is to diagnose selection risk from unlabeled, per-query reward scores rather than from true-reward feedback. Specifically, the authors fit a two-component Gaussian mixture, use the high-mean component as a proxy for correct responses and the low-mean component as a proxy for incorrect responses, estimate a leading-order crossover budget, and stop after that point when the lower-mean component has higher variance.

The decisive condition appears in the Gaussian analysis. Even when correct responses have a higher mean score, sufficiently larger variance for incorrect responses makes their upper tail eventually dominate as the sampling budget grows; the paper interprets this non-monotonic case as reward hacking. This gives a sharper diagnostic than average score separation: measure which class is more competitive at the maximum, not merely which class has the better mean.

The reported evidence is consistent with that mechanism but remains conditional. In the real-score statistics, correct responses generally have higher means while incorrect responses often have higher variance, with exceptions. For early stopping, Appendix B.2 reports one concrete setting in which, at planned n=8192, Skywork Qwen3-1.7B reduces computation by 27.6% and raises hack-subset accuracy from 0.0366 without stopping to 0.0792 with stopping. The paper also notes that stopping can be suboptimal when accuracy improves monotonically.

Do not treat the rule as a universal verifier controller. The framework targets verifiable problems, and the heuristic is not established for non-bimodal or far-from-Gaussian scores, cases where incorrect answers have higher average rewards, or reliable finite-budget regime identification. A useful research operation is to fit the mixture on a new verifier, estimate its crossover, and then test accuracy and cost on both sides of that budget while checking whether the mixture components actually align with correctness.

Read it to test whether your verifier's score variance marks the point at which additional Best-of-N samples stop helping.

[abstract; Section 3.2, Example: Gaussian distribution, Eq. (6) and surrounding text; Section 5, Eqs. (15)–(17); Section 6, Effectiveness of the proposed early stopping method; Appendix B.2, table of full early-stopping results; Appendix B.3, Table 3 caption and score statistics; Section 8, Limitations and Future Work](https://arxiv.org/abs/2610.19362v1) · [abstract; Section 4, paragraph 1; Section 5.2](https://arxiv.org/abs/2506.19248v2)

## In the tested JEPA setting, better one-step fidelity did not reliably predict planning gains

*[One-Step Prediction Fidelity Is a Poor Proxy for Planning Performance in JEPA World Models](https://arxiv.org/abs/2610.19375v1)*

One-step prediction loss is an attractive checkpoint metric, but its target is the model’s own embedding rather than an interpretable physical quantity. It can therefore mix errors already present in the encoder’s representation with errors added by the dynamics predictor. This paper turns that limitation into a measurement experiment: does deliberately improving one-step fidelity also improve goal-conditioned planning?

The proposed protocol fits a decoder from encoder embeddings of real observations to simulator state, freezes it, and evaluates both the decoded real next state and the decoded predicted latent on separate test episodes. Errors are normalized in physical units. The report separates representation error, prediction error, and excess error—the latter intended to identify the predictor’s added error when the encoder/decoder contribution dominates. The authors also repeat the analysis with latent drift, a decoder-free measure. They move fidelity through warm-started fine-tuning checkpoints and evaluate planning with three training seeds and paired planning seeds.

The clearest evidence comes from the PushT checkpoint ladder. The first epoch improved fidelity by 32.0% and planning by 4.44 percentage points. After that, fidelity continued improving monotonically across the 15 later checkpoints, but the correlation between one-step error and planning success was approximately zero (r = -0.010). This was not explained by a task ceiling: planning in the lowest-support data stratum began at 80%, leaving headroom, yet remained flat from epoch 1 onward as fidelity improved. Across environments, the numerical exchange was also unstable: a 93% prediction-error reduction in TwoRoom corresponded to -0.7 percentage points of planning, while a 40% reduction in PushT corresponded to +4.9 points. These percentages are illustrative rather than directly comparable across tasks.

A matched continued-training control also absorbed the fidelity improvement attributed to an auxiliary state-grounding objective; the measured arm effects were not distinguishable. The practical operation is therefore to treat one-step loss as a diagnostic, not a deployment proxy: freeze a task-relevant decoder, separate representation from predictor error, and evaluate matched checkpoints on the actual planning objective.

The boundary is substantial. The study evaluates one 15M-parameter architecture, three low-dimensional simulated environments, one planner, and warm-started fine-tunes from one checkpoint family. Its central within-task result covers a limited post-epoch-1 fidelity range, and the authors note that three training seeds make small effects difficult to resolve. The result is a checkpoint-selection caution for this tested setting, not a general claim about all world models.

Read this if you use one-step predictive loss to select world-model checkpoints: it provides a concrete physical-unit diagnostic and a controlled example where continued fidelity gains did not track planning.

[abstract; §1, contributions; §3.1–3.2](https://arxiv.org/abs/2610.19375v1)

## P2Patch Turns Confirmed Post-Patch Exploits into Accumulated Repair Requirements

*[P2Patch: Exploit-Guided Vulnerability Repair](https://arxiv.org/abs/2610.20245v1)*

### The limitation

The paper targets a concrete validation limitation: repair agents often validate a patch against the same evidence used to construct it—such as a static alert, sanitizer trace, published exploit, or test suite. Blocking that evidence can therefore leave a variation of the same vulnerability exploitable.

### The method change

P2Patch changes the loop from one-shot validation to adaptive attack-and-repair. Starting from a normalized vulnerability finding, an exploitation agent constructs a reproducing proof of vulnerability (PoV), a patching agent repairs the program, and the exploiter attacks the patched program for a distinct same-vulnerability exploit. Every execution-confirmed bypass becomes a permanent repair requirement, while construction-time PoVs remain separate from held-out evaluation oracles.

The accompanying VulnRepairBench contains 101 CVEs across 60 Java and 41 C/C++ subjects, 61 repositories, and 20 weakness classes. Its held-out design separates attack paths blocked by the official fix from candidate paths that remain reproducible after that fix.

### Decisive evidence

In the main configuration, the adversarial stage found at least one confirmed bypass in 41% of runs after the patch had already blocked its bootstrap PoV. Against single-pass repair from the same finding using Claude Code, P2Patch raised fix-closed coverage from 78.1% to 84.7% and beyond-upstream coverage from 42.1% to 62.5% under the benchmark’s scoring policy. The reported ablation attributes detectable coverage gains to adversarial hardening rather than the bootstrap PoV alone. This improvement came with a mean per-subject cost of $2.09, compared with $0.45 for single-pass repair.

### What to reuse—and what not to conclude

A transferable research operation is to treat each execution-confirmed counterexample as a new acceptance requirement, accumulate those requirements during repair, and reserve an independent suite for final scoring. This makes the evaluation question operational: does the system improve on attack paths it did not use while repairing?

The result remains bounded testing evidence, not proof of patch completeness. The held-out suites are curated and incomplete; the paper reports that later upstream fixes corroborated 14 residual cases, while closure on later trees was verified for only 8. Semantic distinctness beyond rejecting duplicate commands was not machine-checked, so the authors qualify the 41% bypass rate as an upper bound on genuinely distinct paths.

Read it to learn how an executable counterexample can expand a repair objective without reusing the same evidence for final evaluation; the reported ablation and held-out oracle design make that protocol directly testable in a new repair system.

[abstract; Section 1, contribution bullet 1; Section 5, “Benchmark”; Table 1; Appendix D, paragraph 4; Section 6.1, paragraph 3; Section 6.2, paragraph 3; Table 2; Section 6.3, paragraphs 2–3; Table 3; Section 6.2, paragraph 5; Table 6; Section 7, “Oracle curation”; Section 6.1, paragraph 5](https://arxiv.org/abs/2610.20245v1)
