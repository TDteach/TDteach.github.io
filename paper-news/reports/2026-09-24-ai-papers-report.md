# 2026-09-24

## Near-Ceiling ISOT Scores Measure Source and Topic Separability Rather Than Veracity

*[What Does 99% Accuracy Measure? A Reproducible Audit of Shortcut Learning in a Widely Used Fake News Corpus](https://arxiv.org/abs/2609.25006v1)*

Near-ceiling scores on the ISOT/Kaggle “Fake and Real News” corpus have a concrete interpretive problem: classifiers routinely exceed 0.98 accuracy and F1, yet those scores can quantify source and topic separability rather than veracity. The audit therefore replaces a single in-corpus score with a per-channel measurement plan.

The actual method change is to use a transparent TF–IDF and linear-classifier pipeline as a measurement instrument, rather than treating the classifier score as the endpoint. The audit removes three possible leakage channels—subject metadata, a newswire source tag, and duplicate documents—and evaluates random, topic-disjoint, and temporal protocols. It also uses representation ablations, small-sample learning curves, prior-controlled shift analysis, a DistilBERT capacity comparison, and transfer to LIAR.

The first diagnostic is deliberately destructive: with article text discarded and only the subject field retained, the classifier reaches F1 = 1.000 and accuracy = 1.000 on a held-out split. After removing all three leakage channels, including a source tag present in 99.2% of real articles and 6,251 duplicate documents contaminating 19.4% of a naive test split, F1 falls only from 0.9935 to 0.9814. The remaining signal is not concentrated in a few giveaway words: deleting the 1,000 highest-weight unigrams leaves F1 = 0.9263.

The decisive evidence is shifted evaluation. Under topic-disjoint testing, average precision falls from 0.9995 to 0.9475 and deployed F1 from 0.9905 to 0.8067; prior matching confirms a 5.2-point loss of discrimination, while temporal transfer is nearly lossless. DistilBERT reaches F1 = 0.9993 in-distribution but loses 12.9 average-precision points under topic shift, versus 5.2 for the linear model. On LIAR, all three models fall to ROC-AUC 0.54–0.57 and do not beat a majority-class baseline.

For a new corpus, the practical operation is to run the metadata-only baseline before tuning models, remove known provenance and duplicate channels, then require topic-disjoint and temporal tests while reporting ranking discrimination separately from deployed F1. The audit’s boundary matters: its conclusions concern ISOT and, by extension, corpora built by pairing disjoint publisher sets. Its primary bag-of-words probe also cannot represent word order, negation, or discourse structure, so the result is a diagnostic of this benchmark—not a complete test of every possible text model.

Read it to learn a compact sequence of leakage, residual-signal, and distribution-shift tests that can be reused before interpreting near-ceiling benchmark scores as task competence.

[Abstract; Sections VII-B, VII-C, and IX](https://arxiv.org/pdf/2609.25006v1)

## In Reliable Upworthy Tests, a No-Persona LLM Ranked Headlines Better Than a Ten-Persona Panel

*[Do Synthetic Personas Predict Real Audience Response? A Sim-to-Real Study Where a No-Persona Baseline Beats Persona-Based Copy Simulation](https://arxiv.org/abs/2609.25010v1)*

Persona simulation needs a harder test than plausible responses: does conditioning an LLM on demographic roles improve its ranking of variants against revealed audience behavior? This paper compares a demographically grounded ten-persona panel with a no-persona zero-shot baseline for ranking headline variants against real click-through outcomes.

Ground-truth reliability is the first methodological constraint. Of 1,695 eligible Upworthy packages, only 399 (23.5%) had a statistically reliable within-package winner under the paper’s one-sided two-proportion z-test filter (p &lt; 0.05); eligibility required at least two distinct headlines and at least 3,000 impressions per headline. The paper therefore evaluates predictive validity only on the reliable subset, rather than treating every observed A/B winner as a dependable label.

On those 399 packages, the primary Gemini setup used ten demographic personas, three draws per persona at temperature 0.8, arithmetic-mean click-intent scores, and a no-persona baseline with 30 draws of the generic prompt. Under this matched setup, the no-persona ranker achieved Kendall’s τ = 0.361 and top-1 accuracy of 49.2%, versus τ = 0.084 and 34.6% for the persona panel; their 95% bootstrap confidence intervals did not overlap.

The gap was not confined to the primary model: OpenAI gpt-4.1 again put the baseline above the panel, with τ = 0.300 versus 0.082 and top-1 accuracy of 49.1% versus 35.8%, with a significant paired gap. Nor did the panel recover baseline validity through pooling choices: six aggregation rules, including median, rank fusion, and pairwise majority, all produced persona τ confidence intervals below the baseline’s. Author interpretation: persona conditioning may replace a useful population-level prior with biased role-played responses, so averaging personas does not recover the unconditioned signal.

That interpretation should not be generalized beyond the tested construct. The evidence is English-language editorial headlines from circa 2013–2015, while the LLM was trained on a later and broader slice of the web, creating a possible temporal or data-overlap threat to generalization. The simulator also elicits stated click-intent, whereas the benchmark is revealed click-through; the authors warn this construct gap limits maximum transfer validity and may attenuate measured effects.

Practical research operation: for a new audience simulator, predefine a reliable-outcome filter, keep a matched no-persona control, and evaluate ranking against revealed outcomes before adding persona complexity. The next replication question is whether the result changes with other persona designs, domains, time periods, or behaviorally matched elicitation.

To see whether persona prompting improves prediction of real audience clicks—or instead worsens it—when tested against reliable A/B-test outcomes.

[abstract; S6.SS0.SSS0.Px1.p1.1; S6.SS0.SSS0.Px2.p1.2; S7.SS0.SSS0.Px6.p1.6; S6.SS0.SSS0.Px9.p1.4; S7.SS0.SSS0.Px1.p1.1; S7.SS0.SSS0.Px2.p1.1; S7.SS0.SSS0.Px4.p1.1](https://arxiv.org/abs/2609.25010v1)

## Claim-Relative Questions Improve Precision for Code-Memory Invalidation

*[Impact Is Not Invalidation: Ask About the Claim, Not the Diff](https://arxiv.org/abs/2609.25130v1)*

## The change in question

When a repository changes, a coding agent’s memory must decide which stored claims have become false. Content anchoring invalidates a claim when its source artifact changes, while semantic-equivalence classification asks whether a diff preserves behavior—a question about the diff, not the stored claim.

On the held-out, stratified evaluation, five models spanning a roughly 40-fold price range fired on 59–72% of real commits and reached precision 0.291–0.329 for the diff-level question, against a 0.25 base rate. With the same models and diffs, the claim-relative question reached precision 0.705–0.974. That gain is not simply missing context: in a 2×2 control, giving the behavior-preservation judge the claim text changed precision by 0.010 and 0.016, while changing only the question moved it by 0.49 and 0.65.

The paper grounds labels in execution: a claim is a test function passing at commit *t*, and it flips when the same assertion text fails at *t+1*. Constructing this oracle exposed a CI-gating problem. A naive search for unmodified tests that pass at *t* and fail at *t+1* found zero positives among 1,005 mined claims, because maintained CI-gated mainlines exclude commits that leave pre-existing tests failing. The authors instead restored parent tests on the child commit for evaluation.

The resulting benchmark contains 10,369 claims and 184 execution-verified flips from 23 Python libraries, with repository-held-out, post-knowledge-cutoff, shuffled-diff, paraphrase, and leave-one-repository-out analyses over 17 repositories. Coverage is not enough: pytest-testmon reached 0.868 recall but only 0.415 precision, so knowing which tests a change can reach did not identify which claims it falsified.

For a transferable research operation, define the maintenance decision as a claim-specific predicate, then hold the model, diff, and claim fixed while crossing question wording with claim availability. Use execution-grounded labels where possible, and retain shuffled-diff and post-cutoff controls.

These conditions narrow the claim. Every scored claim is a test function, because that provides an unambiguous oracle; the paper does not test general prose memories. The corpus contains 23 Python libraries, none large, and no other language. The natural flip rate is 2.0% even after targeted mining, so deployment precision must be interpreted separately from the stratified result. The tested models came from Gemini and Claude only.

Read this to learn how an execution-grounded label and a 2×2 prompt control separate change impact from claim invalidation, then adapt the same evaluation design to an agent-memory gate.

[Abstract; Sections III-B, V-B, V-C, and VI](https://arxiv.org/abs/2609.25130v1)

## Chain-of-thought entropy separates scaffold uncertainty from content uncertainty

*[What Does Chain-of-Thought Entropy Measure? A Channel Audit of Scaffolding, Routing, and Content](https://arxiv.org/abs/2609.25039v1)*

Raw chain-of-thought (CoT) next-token entropy is not automatically uncertainty about reasoning content. The paper identifies three choices inside the same distribution: whether to emit connective scaffolding, which connective to emit, and what substantive continuation to produce. This mixture creates a concrete measurement problem for token selection, pruning, and collapse diagnostics: a high-entropy token need not represent a difficult reasoning decision.

A related compression study found that sentence-level entropy selection offered no advantage over random selection, while low-entropy token selection helped mainly on mathematical tasks because it retained numeric tokens. Papamichalis and Ruane change the scoring operation by designating a scaffold vocabulary S and a content complement C, then factoring each next-token distribution as `p = (s p^S, (1-s) p^C)`. For `0 &lt; s &lt; 1`, their Proposition 1 gives an exact entropy chain rule: raw entropy equals binary gate entropy plus the weighted within-scaffold and within-content entropies. Theorem 1 further identifies an open region, `δ(δ+γ)&lt;0`, where raw entropy and content-only entropy rank positions in opposite orders; the positions selected by the two conventions can therefore be disjoint.

The empirical audit makes this decomposition operational. Across 23 configurations, the scaffold side accounts for up to 41% of the raw high-entropy set. On a matched-tokenizer ladder, coupling changes only at the math-corpus step while the scaffold entropy share continues growing through distillation. A zero-parameter forecast from one channel correlation tracks selection retention across a 54-point range to within five points. For compression, content-channel scoring beats raw surprisal in every evaluated cell. But the answer-survival audit changes how that result should be read: re-fed chains obtain roughly 25–50% of their accuracy from restated answers, and after exact restatements and the final sentence are stripped, no token scorer beats a random contiguous block.

A useful research operation follows: define the scaffold set and tokenizer before scoring, report raw and content-channel selectors separately, and rerun compression after removing answer restatements. The paper’s empirical scope remains limited: measurements are at or below 3B on GSM8K and MATH-500, and within-family checkpoint contrasts are observational rather than randomized interventions. The stripping correction is also string-based, so paraphrased copying can survive while genuine final-step content can be removed; the 25–50% estimate is therefore bounded, not exact.

Read this paper to learn how an exact scaffold/content factorization changes entropy-based CoT selection and how answer-restatement audits can overturn apparently successful compression results.

[abstract; Proposition 1 (Sec. 4 / A.1); Theorem 1 (Sec. 4.1 / A.4); Contributions and §5.4 / Table 2; §6 Limits (S6.p2)](https://arxiv.org/abs/2609.25039v1) · [Abstract; §5 'Does entropy-based sentence pruning outperform random selection?', Table 1; Abstract; §5 'Is entropy the right explanation at token-level?', Figure 2, Appendix token-level tables](https://arxiv.org/abs/2607.28707v3)

## Task difficulty shapes whether chain-of-thought is load-bearing

*[From Decorative to Load-Bearing: Task Difficulty Shapes the Causal Role of Chain-of-Thought](https://arxiv.org/abs/2609.25366v1)*

Earlier work established large per-task variation in whether a model’s final answer depends on its generated chain-of-thought (CoT). The present paper addresses a narrower measurement gap by localizing the perturbation to one reasoning step and forcing a continuation from the corrupted prefix.

**Method.** The paper introduces continuation-based causal testing: it perturbs exactly one intermediate CoT step, truncates the chain there, and forces the model to continue autoregressively from the altered prefix. The continuation becomes the behavioral readout of whether the written trace constrained the answer. The resulting behaviors are classified as silent bypass, self-correction, or error propagation.

**Evidence.** On Gemma-2-9B-IT across GSM8K, MMLU, and BIG-Bench Hard, the judge-corrected split of 21,238 continuations was approximately 45% silent bypass, 27% self-correction, and 28% error propagation. Across Gemma-2-9B-IT, Llama-3.1-8B-Instruct, and DeepSeek-R1-Distill-Qwen-7B, CoT load-bearingness tracked model-relative task difficulty. In the matched 2×2 analysis, error propagation rose 16× from GSM8K to BIG-Bench Hard multistep arithmetic; a variance partition over 28,584 continuations attributed 98.8% of explained deviance to task difficulty and 0.8% to perturbation type. Reasoning-specific reinforcement learning suppressed error propagation and compressed this difficulty gradient.

The paper defines load-bearingness as a behavioral notion distinct from mechanistic faithfulness. The authors therefore frame the gradient as a monitoring problem: traces that are easy to read may carry little causal signal, while traces that matter may propagate an error before a monitor can intervene. A four-variant judge-sensitivity analysis and a blind two-annotator study (n=500) found the error-propagation versus non-propagation label invariant to judge prompt, with Cohen’s kappa = 1.00.

Hidden-state linear probes separated silent bypass, self-correction, and error propagation, but additive activation steering flipped only about 25% of error-propagation cases at best. The practical lesson is to treat probe readout as measurement rather than control until an intervention demonstrates otherwise. A useful follow-up is to repeat the continuation test with multi-step, internally consistent corruptions and compare propagation rates against the single-step baseline.

The study is limited to roughly 7–9B instruction-tuned models and a single-H100 compute budget, so its results may not generalize to much larger models or different experimental scales. It also perturbs one step at a time; multi-step internally consistent perturbations were not tested.

Read this to learn a reusable causal test for whether a written reasoning trace constrains an answer, and to see why probe-based detection of that behavior does not yet imply reliable control.

[abstract; abstract1.1; S5.SS1.p1; S5.SS5.p2; S6.SS3.p1](https://arxiv.org/abs/2609.25366v1) · [Abstract](https://arxiv.org/abs/2307.13702v1)
