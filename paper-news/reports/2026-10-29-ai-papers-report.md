# 2026-10-29

## Policy changes can be handled by recalibrating a fixed one-step world model when conditional dynamics stay shared

*[Calibrated for Which Policy? Conformal Uncertainty for Fixed World Models Under Intervention](https://arxiv.org/abs/2610.35877v1)*

A deployment policy can change the distribution of state-action queries while leaving a fixed world model and the physical transition mechanism unchanged. This paper treats that intervention as a one-step calibration problem. The key condition is shared conditional dynamics: source and target laws must agree on `P(Y|X)`, while the target distribution of pre-outcome inputs `X` changes. Then the target/source ratio is `w(X)=dQ_X/dP_X`, so it can be estimated before observing `Y`.

The paper applies weighted conformal calibration to transport marginal coverage to the target law. With an estimated ratio `ŵ`, its target-coverage statement subtracts `TV(Q,Q̂)`, which is itself bounded by the source-law ratio error `E_P|w−ŵ|`. A practical route estimates the ratio with a source-versus-target domain classifier: if `h` is its clipped target posterior, `ρ` is the target-domain prior, and `Δ(h)` is population log-loss regret, the paper gives `E_P|w−ŵ_h| ≤ (1/(ργ))√(Δ(h)/2)`. The authors also report an exact cancellation that improves the dependence from a generic odds-map order of `γ⁻²` to `(ργ)⁻¹`.

The experiment keeps a released DINO-feature world model fixed and uses physical Franka trajectories. Under the strongest controlled state-action shift, ordinary 90% conformal sets cover 55.0%, while oracle and learned-ratio calibration cover 91.0% and 90.9%. Across the tested shift grid, the learned-ratio surrogate stays within 0.7–0.9% total variation of the target. The result is sensitive to how weights are handled: at the strongest shift, clipping at five raises total variation to 18.7% and lowers nominal-90% coverage from 90.9% to 83.8%.

For a new deployment, the transferable research operation is to separate two questions before calibrating: did the policy only change the pre-outcome query law, or did it change the conditional outcome mechanism as well? The identification result assumes the former, plus absolute continuity of the target `X`-law with respect to the source `X`-law. The empirical demonstration is narrower than a live policy evaluation: it uses controlled tilts on a fixed pool of 192 physical transitions and therefore does not establish performance under independently collected deployment-policy data. This makes support and ratio-estimation diagnostics part of the calibration procedure, rather than optional post hoc checks.

Read it to learn how to turn a policy-induced coverage failure into a weighted-conformal calibration workflow, while testing whether the pre-outcome shift and support assumptions remain credible.

[abstract](https://arxiv.org/abs/2610.35877v1)

## AI productivity measurement pairs time saved with escaped defects

*[Counting the Bandages: On measuring the time that AI saves](https://arxiv.org/abs/2610.35942v1)*

A shorter clock time is not sufficient if the work lets more errors through; this paper therefore argues for a workflow ledger rather than a stopwatch alone.

It defines time saved from mean completion times and excess escapes from audited defect rates, then reports the break-even downstream defect cost instead of imposing a universal composite productivity score. That is the actual method change: compare assisted and unaided workflows at the level of final deliverables, and leave the value of an escaped defect to the decision-maker.

The paper then derives predictions from a stylized checking model: until a model is good enough not to check, a calibrated worker’s escaped-defect rate does not depend on model quality; checking time grows logarithmically with model error; and over-trust can save clock minutes while increasing total minutes. Those predictions depend on assumptions including one defect per draft, exponential search, fixed checking budget, risk-neutral workers, and no false alarms.

Applied to METR’s public developer-study data, the same 246 issues support a 2.6%–82.1% range for the share of issues helped; slowdown is 18.8% by forecast-adjusted geometric mean and 24.0% by ratio of means, versus 33.7% unadjusted. The result is an identification lesson: an average treatment effect does not identify which individual tasks benefited, and headline slowdown depends on the estimand.

Under GDPval’s review-every-output workflow and the paper’s stated assumptions, GPT-5’s one-try speedup ranges from 1.12× to 3.56×; the upper end is about 3.6×, not an observed model-only speedup.

In a small pre-specified experiment, an AI reviewer checked AI-generated financial briefs against SEC filings: when the true draft error rate was 30% but the reviewer was told 3%, it made 7.2 fewer lookups and let a wrong figure through in 22.5% of briefs instead of none. All 16 escapes came from reviews that did not look up the relevant line, so the paper attributes the effect in this setup to reduced checking effort.

The boundary is important: the author collected no data on people, so this experiment does not establish how human reviewers or other AI systems behave. It also primarily tests seeded errors; the planned check against naturally occurring draft errors found none to check.

A transferable research operation is to report, for each assisted workflow, mean completion time, audited escaped-defect rate, and break-even defect cost together, then state which task-level conclusions the design can and cannot identify.

Read it to learn how to turn an AI speedup claim into a time–defect ledger and to test whether a randomized estimate says anything about which tasks actually benefited.

[abstract; Section 2, Definitions 1–2; Section 6.1, Table 2 and discussion; Section 6.2; Section 7, Table 4, H4a–H4c; Section 7, Over-trust is faster and worse; Section 10; Section 7, Limits](https://arxiv.org/abs/2610.35942v1)

## Control Map evaluates test-time updates by their ordered pre-answer histories

*[Beyond Update Counts: A Control Map for Evaluating Test-Time Model Updates](https://arxiv.org/abs/2610.36109v1)*

### Why update counts fail

Test-time updating lets a language model change persistent state—such as weights, adapter parameters, or a memory module—before or while answering queries. The paper identifies a concrete evaluation blind spot: existing summaries often compare update count or frequency with performance immediately afterward, even though the same total can hide different update histories. One system may answer after one update while another answers after two.

### The evaluation change

Control Map is an evaluation framework rather than an update algorithm. It links each scored answer to the ordered updates completed before it, then keeps history resolution, behavioral effects, acquisition, retention, locality, and cost as separate evidence fields. The trace depends on a declared dependency specification; missing or invalid evidence is reported as undefined rather than zero. This turns “how many updates occurred?” into the more operational question “which committed state changes were available before this answer?”

The paper also gives a conditional comparison certificate. Under a common initial state, coupled exogenous randomness, policy-independent row weights, and a history that is score-sufficient for the contrast, the absolute average-score difference is bounded by the score range multiplied by the total-variation distance between the pre-answer history distributions. This is a design bound, not proof that the trace captures every score-relevant dependency.

### Evidence that the distinction matters

At one approximately 760M-parameter checkpoint, 24 schedules with the same update count produced retrieval accuracy from 19.733% to 34.233%, supporting schedule sensitivity in that tested setting. A separate correction also changed the interpretation of an apparent dose–locality relationship: after matching the complete event order, the terminal parameters and locality scores were identical, so query-time dose did not identify a causal effect on terminal locality.

The paper’s selected memory-quality results reinforce the need to separate dimensions: all six selected CounterFact LoRA settings learned the new information, while ROME retained edits at all 13 operating points but failed locality at each. In three GPT-2XL endpoint studies, the MEMIT-minus-ROME locality contrast changed sign across benchmarks despite positive acquisition contrasts, so the reported results do not justify a stable editor ranking.

### What to borrow

For an editing or test-time-learning experiment, log the exact ordered committed updates preceding every scored answer. Measure immediate acquisition separately from later retention, unrelated-behavior locality, and performance in a new setting. Treat the resulting comparison as conditional: execution conformance does not establish complete ancestry coverage, and cross-setting differences cannot be attributed to model, benchmark, or test-question changes individually when those factors change together.

Use this paper to redesign one update-evaluation table: replace a single update-count column with ordered pre-answer histories, then score acquisition, retention, locality, and new-setting performance separately.

[abstract; https://arxiv.org/pdf/2610.36109v1](https://arxiv.org/abs/2610.36109v1)

## SpecGuard Turns Multi-Turn Jailbreak Detection into Auditable Specification Monitoring

*[SpecGuard: Detecting Multi-Turn LLM Jailbreaks via Specification-Based Runtime Monitoring](https://arxiv.org/abs/2610.36258v1)*

The paper frames a concrete limitation in existing guard models: they largely classify individual messages or exchanges and return risk scores or labels, without executable safety semantics or a formally checkable decision trail. SpecGuard instead treats safety as a property of an ordered dialogue trace. A fixed atomic-proposition contract maps natural-language observations into causally scoped, evidence-backed facts, while forbidden interaction patterns are written as Linear Temporal Logic specifications and compiled into symbolic finite automata.

The same monitor supports two uses. In runtime mode, it checks a buffered candidate reply before committing the turn; in audit mode, it replays a transcript. When a specification is triggered, the system emits a witness identifying the rule, supporting facts, relevant turns, provenance, and trace identifiers. The framework is training-free and does not require access to the protected model. This explicit separation between evidence extraction and policy execution is the paper’s main systems contribution—not a guarantee that the natural-language extraction stage is error-free.

The reported benchmark comparison is favorable under its stated protocol: against four open-weight guard models, SpecGuard has the highest AUC, F1, and recall on SafeDialBench-ZH, SafeDialBench-EN, and SafeMTData. The endpoint differs on SafeMTData, where positives represent an ActorAttack trajectory rather than a response-side violation. The trade-off matters: at the frozen operating point, balanced accuracy is highest on all three benchmarks, but English SafeDialBench reports 96.9% recall with a 10.7% false-positive rate.

The most informative experiment holds the extracted atomic-proposition traces fixed and adds six cross-turn specifications to the same-turn rules. F1 rises from 0.975 to 0.981 on SafeDialBench-ZH, from 0.899 to 0.942 on SafeDialBench-EN, and from 0.877 to 0.939 on SafeMTData. This isolates a contribution from temporal rule composition, rather than proving an end-to-end gain from better extraction.

The audit evidence is correspondingly scoped: all 1,652 emitted witnesses from 995 alarmed traces replay successfully, and the paper reports zero score–verdict mismatches over 10,075 benchmark dialogues. These checks validate the symbolic path once a trace exists; missing or spurious extracted facts can still change the result. Also, the controlled baseline comparison aggregates stateless per-turn alarms, so it is not a matched comparison against stateful monitors.

For a reusable research operation, keep the extractor fixed, toggle temporal rules, and report both detection gains and false positives; then evaluate extraction errors separately. That design makes a monitor’s auditable core measurable without confusing it with the quality of its language-to-fact interface.

Read this paper for its fixed-trace ablation: it separates the value of cross-turn rule composition from the harder question of whether natural-language evidence extraction is correct.

[abstract; Section V-A, S5.SS1.p1–p3; Table III, S5.T3; Section V-B, S5.SS2.p1–p2; Section V-B, S5.SS2.p3–p4; Table III, S5.T3; Section V-B, S5.SS2.p8–p9; Section V-C, S5.SS3.p2; Table V, S5.T5; Appendix -E, A0.SS5.p11; Appendix -E, A0.SS5.p11; Section V-A, S5.SS1.p2; Section V-B, S5.SS2.p6](https://arxiv.org/abs/2610.36258v1)

## Pre-commit noninterference is required for unbiased episode-coin audit certification against adaptive agents

*[Blindfold: Keeping the Audit Coin Secret from LLM Agents](https://arxiv.org/abs/2610.37055v1)*

Audit-based certification estimates an LLM agent’s violation rate by auditing a random fraction of actions and reweighting audited labels. This paper argues that randomization alone is insufficient: before an action commits, the audit coin must not interfere with the agent’s view, at a commit time the agent chooses. Otherwise, an adaptive agent can condition its behavior on whether it is being audited, changing the quantity that the certificate estimates.

### Treat the audit decision as a secret input

The authors call this condition **pre-commit noninterference** (PNI) and quantify departures from it with D_A, the total-variation distance between the agent’s pre-commit views under the two audit-coin values. For an episode-level coin, PNI characterizes unbiased certification against adaptive agents at every policy and reachable history; the paper additionally requires an exclusion restriction for its anytime-valid certificate.

The resulting metric has a direct interpretation. At a fixed reachable history and policy, the exact worst-case bias of the plain inverse-propensity-weighted certificate is `(1 − ε)D_A`. The result is worst-case over commit rules, rather than evidence that every agent will attain that bias. The paper also gives bounds for leakage accumulated across pre-commit steps, including a coupling-based bound and a simpler sum bound.

### Measured leakage can translate into certificate failure

The empirical case study separates an agent’s ability to exploit a channel from the downstream behavior of a certificate. In E3, an injection explicitly naming a visible audit notice reduced attack success from 0.676 when the signal was hidden to 0.544 when shown, on 136 screened-vulnerable task/injection pairs for gpt-4.1-mini. This supports notice-specific conditioning, not general audit awareness.

More directly, E5 resampled 560 recorded task/injection pairs at ε = 0.2, with 4,000 episodes and 400 seeds. With the channel open and no shift, plain-certificate coverage for the stricter unaudited propensity was 0.007; it was 0.993 in the silent-audit arm. Thus, the reported result concerns resampled labels from a measured population, not a new deployment.

A useful research operation is to enumerate the full pre-commit view—especially content-silent signals such as timing—then test paired audit conditions before relying on an audit estimate. Measure channel leakage, agent exploitation, and certificate coverage separately: they answer different questions.

The evidence does not establish spontaneous or generic conditioning, or real-agent timing exploitation. The live E8 demonstration is one content-channel run whose realized-rate comparison is post-hoc. Finally, a leakage-inflated certificate needs a valid design-time upper bound on leakage for all reachable behavior; the authors report that none of their deployed configurations meets that requirement.

Read this for a concrete way to turn “can the agent tell it is being audited?” into a testable statistical-validity condition, with separate evidence for leakage, agent response, and certificate coverage.

[§IV-A–C; §VII-A–C; §VIII](https://arxiv.org/abs/2610.37055v1)
