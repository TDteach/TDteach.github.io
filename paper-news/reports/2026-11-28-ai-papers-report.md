# 2026-11-28

## Patient-Level Splits Cannot Certify Pathology When Acquisition Tracks Diagnosis

*[Leakage-Free Is Not Confounder-Free: What a Patient-Level Split Cannot Certify About a Medical Imaging Benchmark](https://arxiv.org/abs/2611.27585v1)*

Patient-level splitting blocks subject overlap, but it cannot remove an acquisition variable that is aligned with diagnosis across the cohort. The evaluation limitation is concrete: a patient-disjoint AUROC does not by itself certify that residual discrimination reflects pathology.

The method change is from controlled availability manipulation to an observational benchmark audit. The earlier paper supplied here varied feature predictivity and availability in controlled synthetic and image experiments. Here, the authors separate five questions that a single diagnostic score would conflate: whether the candidate confounder predicts the label, whether it is legible in images, whether diagnostic scores depend on it, whether the image adds predictive value beyond it, and what discrimination remains after controlling for it. These are predictive diagnostics, not causal effects.

On DMR-IR, 236 patients were evaluated under a strict patient-disjoint protocol. Acquisition date alone reached AUROC 0.980, while the strongest of nine imaging arms reached 0.949. Among 133 benign patients acquired in 2012 or 2013, background temperature summaries separated the two acquisition years at AUROC 0.938, showing that era information was recoverable from thermograms without using diagnosis as the era proxy. That result does not establish model reliance: only the all-frames ConvNeXt-T arm showed a statistically detectable association between diagnostic scores and era in the reported within-diagnosis test. On paired folds, combining the calendar with the strongest imaging arm produced an estimated AUROC increase of only 0.003, with a confidence interval crossing zero; the authors do not interpret this as equivalence.

The controlled-discrimination question remains constrained by the dataset: it contains only eight cross-label same-date pairs, from ten patients, limiting reliable evaluation within recorded acquisition-date groups. A second thermography cohort, with age rather than calendar date as its dominant channel, produced a similar control pattern, but this is another thermography application rather than validation across modalities.

For a new benchmark, the transferable operation is to run the five tests before interpreting an image AUROC as pathology recognition, and to report when cross-label support is insufficient. Evidence that score tracks acquisition era is configuration-specific: the authors report exploitation on one arm of nine and one encoder of three. The proposed acquisition-signature explanation is also indirect because DMR-IR records date, not session, room, operator, or camera state. Finally, the cohorts are small, so null comparisons do not establish equivalence.

Read it to learn a concrete pre-training audit for separating image legibility, model-score dependence, and genuinely controllable pathology evidence in medical-imaging benchmarks.

[abstract; §3 Setup, §3.p1; §4.1 Results, Table 1; §4.2 Results, §4.2.p2; Appendix Q, Table 17; §4.2 Results, §4.2.p3; Appendix C, Table 5; §4.3 Results, Table 3; §4.5 Results, §4.5.p1; §7 Limitations](https://arxiv.org/abs/2611.27585v1) · [§4, paragraph 2 (S4.p2; methods in S4.p1 and Appendix C.3); §5, paragraph 3 (S5.p3; Figure 4 caption in S5.F4; methods in Appendix C.4)](https://arxiv.org/abs/2310.16228v2)

## In a selected cohort, source-linked HPO evidence sharply changed rare-disease rankings

*[Observed, Curated, Reused: Observation Bias in Clinical AI Evaluation](https://arxiv.org/abs/2611.27301v1)*

## In a selected cohort, source-linked HPO evidence sharply changed rare-disease rankings

Clinical AI evaluations can inherit observation bias: routine medical documentation captures what clinicians notice, test, and record rather than a complete clinical picture. As that evidence travels into publications and reference knowledge graphs, unexamined symptoms can blur with confirmed negatives and chronological disease progression can be lost.

The paper turns this limitation into a provenance question: does diagnostic ranking improve when HPO first incorporates the publication describing a test patient? Authors tracked 6,503 clinical cases across six historical HPO releases from October 2021 to June 2026 and formed a confirmatory cohort with an observable source-ingestion event.

The main comparison held patient queries fixed, contrasting the release before first observed source citation with the first release containing it, and then removing source-citing assertions from that ingestion release. That is a transferable audit operation: compare the ordinary ingestion snapshot with a same-release, source-removed version before interpreting a benchmark score as generalization.

For the primary directional Resnik ranker, publication-weighted MRR rose from 0.26 before source ingestion to 0.84 at ingestion and was 0.05 after source-citing assertions were removed from the ingestion release. IC-cosine and LIRICAL reproduced this trajectory, while control experiments confirmed that the diagnostic jump was driven by the patient’s publication rather than background HPO growth.

Because the cohort was selected for observable ingestion events, this effect cannot be treated as a prevalence or average effect for other benchmarks. The exact ingestion date is also unavailable: the study observes snapshots, not every change between releases. A citation is not a patient-level link, so the provenance does not identify the exact patient, sentence, or curator decision; deleting multiply cited assertions can also remove evidence supported elsewhere.

The findings are scoped to rare-disease retrieval rankers rather than routine inpatient care, clinical outcomes, or foundation-model internals. MRR is an evaluation measure, not a clinical outcome. For a literature-derived benchmark, the practical question is whether each historical test uses only knowledge available at its intended decision time and keeps patients, source-linked evidence, and time separate.

Read it for a concrete provenance audit: compare a benchmark against the knowledge-base snapshot before and after first source citation, then test whether the score survives removal of source-linked assertions.

[abstract; Findings, S3.SS0.SSS0.Px1.p1; Appendix A.7, A1.SS7.p1](https://arxiv.org/abs/2611.27301v1)

## A Matched Retry Baseline Separates Text-to-Image Selection Gains from Agentic Gains

*[Is It the Agent or the Retry? Separating Selection from Agency in Text-to-Image Generation](https://arxiv.org/abs/2611.28116v1)*

Agentic text-to-image systems wrap generators in planning, routing, verification, and refinement, but their reported gains are almost always measured against a single sample. That baseline can confound an agent policy with the benefit of selecting a better draw.

The paper’s concrete control is Single-tool Rejection Retry (SRR): use the strongest generator already in the system’s pool, keep the original request, apply a verifier threshold, draw independent samples until one is accepted or the budget is exhausted, and return the highest-scoring sample if none passes. SRR deliberately removes planning, routing, prompt rewriting, memory, and training. A closed-form analysis predicts accepted-sample accuracy at each budget and shows that, with unlimited retries, improvement in posterior odds is capped by the verifier’s likelihood ratio.

The control changes several headline comparisons. On GenEval, retrying OctoT2I’s Flow-GRPO tool with the NVILA verifier, threshold 0.8, and a maximum of four generations reaches 0.962, versus OctoT2I’s reported 0.96 at the same maximum generation budget; the agent’s routing uses less compute. In the paper’s cross-paper GEMS comparison, SRR raises the measured baseline from 0.746 to 0.827 with two generations per image, close to GEMS’s reported improvement but below its reported full score. On comparable T2I-CompBench++ categories, SRR approximately matches OctoT2I’s average, 0.621 versus 0.619, while the complex category remains lower.

The strongest evidence for gains beyond selection is on GenEval 2: the evaluator-selected best of five original-prompt samples scores 48.7 GM, whereas GEMS reports 63.5, a 14.8-point gap; the upper end of the relevant 95% interval still leaves a 12-point gap. This supports a contribution from mechanisms such as planning or prompt rewriting, but the comparison is across papers with potentially different seeds and sampling settings. Conversely, the authors interpret OctoT2I’s routing advantage as about 2.5× less compute at equal accuracy, not higher accuracy; that ratio is approximate because timing came from different hardware sources.

A separate offline LoRA experiment on 2,000 prompts found selected-sample fine-tuning at 0.733 versus 0.729 for random samples, a difference of +0.006 ± 0.008. This is evidence about one accepted-versus-random protocol, not distillation generally. For a new agentic result, run SRR first with the same generator pool, verifier, threshold, stopping rule, and budget; report accuracy and compute separately, then test prompt rewriting, planning, and learning as residual explanations.

Read it to obtain a practical selection-only control before attributing an agentic text-to-image improvement to planning, routing, or learning.

[abstract; Section 3, Single-tool Rejection Retry; Section 4.1, OctoT2I; Table 1; Section 4.1, GEMS and D-OPCD; Table 1; Section 4.2; Table 2; Section 4.3; Supplementary Table S2; Section 5.1, What routing buys: compute; Figure 6; Section 5.2; Supplementary Table S5; Section 4.3, Where selection is not enough: GenEval 2; Section 6, Limitations](https://arxiv.org/abs/2611.28116v1)

## DriveOddsBench Finds Under-Coverage in Eleven Driving World Models

*[DriveOddsBench: Are Driving Video World Models Aligned with Real-World Odds?](https://arxiv.org/abs/2611.29275v1)*

A realistic-looking sample does not by itself test whether sampled futures have the right frequencies. The paper starts from a concrete gap: each natural driving history supplies one recorded future, so its conditional probabilities are unknown; physical quantities must also be read from video, and many possible analyses create a selective-reporting risk.

DriveOddsBench addresses this by replacing per-history probability labels with pooled ranks of measured outcomes. For each history, each model generates 16 futures, while one validated instrument reads quantities such as lead-vehicle gap and ego motion from generated clips and from the recorded future after it passes through that model’s autoencoder. If the generated conditional distribution matches reality, the real outcome’s rank among 16 generated readings is uniform over 17 positions under the paper’s exchangeability and sampling assumptions, with randomized tie-breaking; pooling these ranks avoids requiring probability labels for individual histories. The confirmatory analyses were frozen before any test clip was measured.

The evaluation covers eleven general and driving models on 200 test histories from distinct Argoverse 2 logs, with 16 generated futures per model-history pair. All eleven models under-cover the measured real outcomes: the real value falls outside all 16 generated readings in 28.0–61.2% of cases, versus 11.8% under the real distribution. Five models show significant directional bias in the lead-gap readout, with Epona and DrivingWorld placing the lead too far ahead and VaViM, Wan2.1-VACE, and Vista placing it too close. Nine models are informative relative to climatology while still failing alignment tests, showing that useful scene-conditioned predictions and correct conditional odds are distinct properties.

For research practice, the transferable operation is to pre-register the readout and horizon, apply one measurement pipeline to generated and reconstructed real clips, and pool ranks across histories rather than treating visual quality as a calibration result. The verdict remains narrower than a full world-model audit. The authors state that conclusions concern measured quantities, so the tests do not establish that complete generated videos follow the real conditional distribution. Passing pooled tests would not prove alignment either, because finite rank resolution, cancellation of opposite errors, and unmeasured dimensions can hide mismatches. The histories are at most 2 s long and come from US cities, and the benchmark covers open-loop forecasts rather than interventions or closed-loop driving.

Read it to learn a concrete way to evaluate uncertainty in video futures when each driving history has only one logged outcome.

[abstract; Abstract; §4.1, Theorem 1; Abstract; §3.2; §5.2, “Every model underestimates its uncertainty (H2)”; Table 3; §5.2, “Five models are skewed, in opposite directions (H1)”; Table 3; §5.2, “Informative samples still miss the real distribution”; §4.4; §6, Limitations; §6, Limitations; Appendix A.5; Appendix B.5, Scope](https://arxiv.org/abs/2611.29275v1)

## Models trained on audited SWE-Gym tasks score higher in matched RL comparisons

*[What Makes Good Data for Training Coding Agents? A Systematic Study on SWE-Gym](https://arxiv.org/abs/2611.30207v1)*

RL coding-agent training turns hidden-test outcomes into reward, but SWE-Gym task collections check those tests only against the reference fix. A pass rate shows whether a task yields reward, not whether that reward is right. The paper therefore targets a concrete curation shortcut: treating low solve rate as evidence of task difficulty. In the audit, 74% of never-solved tasks had tests that rejected fixes judged correct for the stated issue, compared with 20% of sometimes-solved tasks.

The method combines LLM inspection with execution rather than accepting a suspected error from judgment alone. For false negatives, auditors inspect fail-to-pass assertions and propose witness fixes; execution must show the flagged test rejecting a fix judged consistent with the issue. For false positives, a passing patch counts only when an executed counterexample demonstrates a regression. The authors then repair or remove flawed tasks.

To test downstream impact, they train Qwen3.5-9B with GRPO in the SWE-agent scaffold for 80 steps. The main Clean and Orig sets each contain 512 tasks, with matched difficulty quotas and three seeds. Clean outperformed Orig by 2.4 percentage points on SWE-bench Verified and 2.7 points on SWE-bench Pro. Simply dropping never-solved tasks did not show the same gain.

The audit also finds that false-positive patches were common under its conservative rule: 26.1% of 1,854 distinct passing patches were confirmed false positives, while another 37.3% were undetermined. Sometimes-solved flawed tasks mattered for training because they generated reward variation and contributed to gradient-carrying groups. Adding counterexample-derived tests did not produce a detectable held-out pass@1 change in this experiment; that result does not establish equivalence between the two training sets.

A useful research operation follows: use solve rate to prioritize review, then audit reward labels at assertion level with executable witness fixes and regression counterexamples. Compare the resulting construction with an equal-size, matched-difficulty original before attributing gains to curation. The evidence remains bounded: the study uses one base model, scaffold, RL recipe, and task source, with three seeds and an 80-step budget. Repair, removal, and replacement vary together, and the audit covers only fail-to-pass false negatives and regression-style false positives.

Read this if you use solve rate or pass-rate filtering to curate RL coding tasks: the paper tests whether executable label auditing changes held-out training results under matched-size and matched-difficulty conditions.

[abstract; §4, opening paragraph; §5.2, False negatives are common and concentrate on never-solved tasks; §5.2, False positives are common at every difficulty level; §5.3, Sometimes-solved flawed tasks train the policy; §5.4, Audited data scores higher on both held-out benchmarks; Table 2; Abstract; §5.5; Table 2; §6, Limitations; §6, Limitations; §3, False positives](https://arxiv.org/abs/2611.30207v1)
