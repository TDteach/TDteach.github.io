# 2026-11-21

## At 1.3–8B, Canon makes architectural differences measurable while standard scores still hide retrieval failures

*[Physics of Language Models: Part 4.2, Canon Layers at Scale where Synthetic Pretraining Resonates in Reality](https://arxiv.org/abs/2611.24963v1)*

The paper tests whether architecture differences obscured in smaller pretraining studies become measurable at larger, resource-matched scales. It reports 64 from-scratch runs of Transformers and linear-model families from 1.3B to 8B parameters, trained on 1–2T Nemotron-CC tokens. An earlier 1.3B/100B-token comparison found that careful tuning could make architectural differences nearly disappear; however, the present study changes both token budget and data corpus, so it cannot attribute the greater visibility of differences to scale alone.

The main intervention is Canon, which adds local token mixing to the model. The paper also introduces GLA5 and GDN2, replacing full-rank recurrent-layer output gates with low-rank gates and reallocating the saved parameters. These changes are evaluated in aligned comparisons rather than as isolated implementation anecdotes. In particular, the large-scale GLA5/GDN2 comparison matches key model and training resources, while the gate factorization and parameter reallocation remain a combined intervention.

The decisive Transformer result is consistent across the four matched settings tested: the worst LlamaCanon run exceeds the best vanilla Llama run on the reported lm-eval average, with a stated 0.8–1.5-point gain. At 8B/1T, the authors estimate that LlamaCanon reaches vanilla Llama’s final MMLU accuracy with roughly 28% fewer tokens. This is a curve-based estimate: its value changes with smoothing and with a ±1-point shift in the target accuracy.

The aligned linear-model comparison supports a narrower interpretation. With Canon, GLA5 becomes close to GDN2 on training loss and the standard benchmark average, although the models are not identical on every metric. The authors interpret this pattern as evidence that some benefit of more elaborate recurrent updates may come from local token mixing; it is not a direct measurement of the mechanism. Standard averages also do not settle basic in-context behavior: the tested models generally remain near the 33.3% guessing reference on the paper’s synthetic two-hop task, including at 8B/1T.

The transferable research operation is to pair matched pretraining ablations with probes for the capability the architecture is supposed to support. Here, each custom task uses 1,000 examples per background length, so the two-hop result should not be generalized to naturalistic reasoning. A useful follow-up question is whether the retrieval deficit comes from encoding information into recurrent state or reading it back—the reported accuracy alone cannot distinguish those failures.

Read this when designing architecture ablations: the study shows how to combine resource-matched pretraining with capability-specific retrieval probes instead of treating similar benchmark averages as evidence of equivalent models.

[abstract; Section 3.1, paragraph 5; Section 3.1, Result 1; Table 1; Section 3.2, Result 2; Appendix D.2; Section 4.1, Result 3; Section 4.1.2; Equation 4.2; Section 4.2, Result 4; Table 4; Section 4.3, Result 5; Section 5.2, Result 7; Figure 8; Appendix B, paragraph 7; Appendix E, Future directions, bullet 1](https://arxiv.org/abs/2611.24963v1)

## Calibrated decision rewards reach answer-key-level MATH500 accuracy in one setup but lose calibration on harder data

*[Calibrated Decision Rewards: Training Language Models with a Judge That Knows How Sure It Is](https://arxiv.org/abs/2611.25135v1)*

Answer checkers are exact but require a reference answer; learned reward models and LLM judges work without one, but their scores are not probabilities. RLCDR changes the reward interface by converting an LLM into a decision model: it asks a typed question about a response, reads an option-probability distribution in one forward pass, debiases option order, and calibrates it with about a hundred labels. For outcomes, it can ask whether the final answer is correct; for process feedback, it can ask which step contains the first error.

In one reported setup, Qwen3-1.7B trained with GRPO on MATH improved MATH500 accuracy from 72.2% to 76.8% (+4.65 points, p &lt; 1e-4). The matched random-reward control gained only 0.65 points, while answer-key training reached 76.9%; the paper describes RLCDR and answer-key training as statistically indistinguishable in this experiment, not as provably equal. The gain was larger on difficult questions: level-5 accuracy rose from 44.8% to 51.7% (+6.9 points).

The useful operational evidence is not only the final score. On the policy’s own math trajectory, RLCDR had lower calibration error than a softmax judge using the same 27B backbone: ECE was 0.074 versus 0.141, with Brier scores of 0.077 versus 0.106 and AUROC of 0.956 versus 0.943. The authors also report no sign of reward hacking in the full-set run under their measured reward–truth gap. Offline, the decision model localized first errors better than the tested 7B process reward model on every reported split, despite having no step-label training.

The boundary appears when the difficulty distribution shifts. On hard-only training data, where 83% of answers were wrong, reference-free RL still improved the policy by 1.9 MATH500 points but trailed answer-key training; the authors attribute the shortfall to overconfident probabilities. In that setting, the decision model still ranked answers well (AUROC 0.89), but its mean reward probability was 0.28 against a true accuracy of 0.17. The end-to-end policy evidence remains limited to one Qwen3-1.7B seed on math, and the proposed recalibration fix was not tested.

The practical experiment to carry forward is to measure both ranking and probability calibration on the policy’s current samples, then test recalibration after a measured distribution shift; this paper motivates that design but does not establish that the fix works.

Read it to see an end-to-end reward test where policy improvement, on-policy calibration, and a hard-distribution failure are measured together.

[abstract](https://arxiv.org/abs/2611.25135v1)

## LLM-Judge RL Transfers Category-Linked Refusals but Little Answer-Specific Knowledge

*[Blind Spots Travel, Knowledge Stays Home: What RL Inherits from an LLM Judge](https://arxiv.org/abs/2611.25191v1)*

### Finding

The paper targets a measurement gap in judge-based RL: overall accuracy and abstention rates can miss whether rejections concentrate on a question category. Across 814 RL runs, the authors trained 7–8B models to answer closed-book questions or abstain. The main setup used Qwen2.5-7B-Instruct and Llama-3.1-8B-Instruct, GRPO with LoRA for 120 steps, 750 questions per run from TriviaQA, PopQA, or NQ-open, and a KL penalty of 0.2.

The first test asks whether a judge’s factual knowledge improves selection on new questions. At matched abstention, training with answer-aware graders did not improve question selection over a 32-sample self-consistency rule; for the answer key, the measured average difference was negative by 0.8 points. This separates learning which individual answer is correct from learning a policy for when to answer.

The decisive method change was a targeted verdict intervention. The authors copied a judge’s verdict pattern while changing only twelve known-correct training answers about capitals of former states. In this hand-set experiment, rejecting those twelve answers increased refusals on unseen former-state capitals from 5% to 90%, with three runs per condition. The effect therefore attaches to the placement of verdicts within a recognizable question type, not simply to the judge’s overall acceptance rate.

A forced-decoding probe tests whether the model forgot the answers. When the authors blocked “I don’t know,” forced decoding recovered mostly correct capitals on the tested probe. The result supports interpreting the refusals primarily as suppressed willingness to answer rather than erased knowledge in this setting.

The paper also proposes a judge-free signal: reward an answer when most of the untrained student’s 32 samples agree. Treat this as an experimental baseline, not automatically label-free calibration: the cutoff was checked on labelled data, and a fixed 20-of-32 threshold underperformed on Qwen TriviaQA.

The boundary is important. The main study is restricted to short-answer closed-book QA and LoRA-tuned students in the 7–8B range; open-ended generation was not tested. Many comparisons have only two to six runs, and some key estimates were not stable run to run. The retention result is also conditional on the KL penalty: without it, many more held-out answers changed and some runs lost substantial accuracy. A useful replication is therefore to transplant the twelve-verdict intervention across categories, models, and KL settings before treating category-level blind-spot transfer as general.

Read it for a reusable evaluation pattern: alter a small, suspected systematic subset of judge verdicts, then use forced decoding to distinguish lost knowledge from suppressed answering.

[abstract; Abstract; §2 “Task and training”; Appendix A, Table 4; §3 “Right answers a grader knows”; Figure 2; Appendix H, Table 20; Appendix E, §“The twelve verdicts at the key-matched cut”; §4 “The answers are still there”; Appendix J, Table 24; Limitations](https://arxiv.org/abs/2611.25191v1)

## Fewer denoising steps can raise Physics-IQ while Kernel Physics-IQ declines

*[What One Sample Cannot See: Why Fewer Denoising Steps Can Score Higher on Physics Benchmarks](https://arxiv.org/abs/2611.25632v1)*

Physics-IQ compares each generated video with one recorded take, although a scene can have multiple valid futures. For its negative-type distance components, the paper decomposes the expected single-sample distance into a proper kernel score plus half the model’s self-dispersion. Because the dispersion term is independent of the recording, reduced predictive variation can outweigh a loss in distributional accuracy.

Kernel Physics-IQ estimates and subtracts self-dispersion with two independent generated samples per condition. It retains the three Physics-IQ mask components and replaces pixel MSE with full-video RMS (β=1), using frozen normalization constants from 52 non-duplicate take pairs. The RMS component is intended to distinguish video distributions that pixel-MSE kernel scoring can conflate. Physics-IQ Verified is a different intervention: it refines prompts, cleans reference activation maps, and uses clipped, equally weighted sample-level aggregation, whereas this paper changes the estimator to target generated-sample dispersion.

The main real-model evaluation covers five image-to-video models, 66 center-view scenes, and seven generated samples per setting. Default two-step sampling produced a detected Kernel Physics-IQ decline in every tested model. For CogVideoX in the 50-versus-2-step comparison, the official score gained 0.055 while Kernel Physics-IQ fell 0.131; the paper attributes this divergence to a dispersion premium larger than the kernel-score loss. A fixed-weight sweep also matters: changing only the sampling node produced a detected Kernel Physics-IQ gain of 0.099 without a detected official-score difference. In two controlled physical worlds with known outcome probabilities, Kernel Physics-IQ ranked the true distribution above collapsed and miscalibrated alternatives, while the official raw composite tied those predictors.

A useful research operation is therefore to report the distributional score and self-dispersion separately, use paired independent samples, and hold weights, prompts, and seeds fixed while sweeping inference controls. That design tests whether a benchmark rewards calibrated futures or merely reduced variation. The evidence remains bounded: real-data take pairs only approximate repeated draws from the physical future distribution; the cross-model study covers five image-to-video systems and 66 scenes rather than other model classes or benchmark designs; and seven-seed comparisons retain finite-sample uncertainty despite paired scene-bootstrap intervals.

Read it to learn how a reference-based video metric can reward low predictive variation, and how two samples per condition can test distributional accuracy instead.

[abstract; §3.1, Eq. 2 and accompanying text; §3.3, Eqs. 4–5; §4.2, dispersion-premium results; Table 1; §5.1, fixed-weight node shifts; §5.4, controlled-world evaluation](https://arxiv.org/abs/2611.25632v1) · [Section 3.1, Improving text prompts (S3.SS1.p2); Section 3.3, Cleaning of Spurious Metric Activations or Artifacts (S3.SS3.p4); Section 3.2, Eq. (2) and paragraph S3.SS2.p4; Appendix C.7, Eq. (19)](https://arxiv.org/abs/2606.18943v1)

## Fixed-budget RLVR can trade in-budget accuracy for weaker test-time scaling

*[Budget Internalization: Fixed-Budget RLVR Trades Test-Time Scaling for In-Budget Accuracy](https://arxiv.org/abs/2611.26172v1)*

### Finding
A fixed rollout cap in RLVR can improve accuracy near its budget while weakening scaling when inference receives more tokens. The paper calls this **budget internalization**: after training, models use few additional tokens beyond the training budget, so the cap changes model behavior rather than only controlling training cost.

The clearest reversal appears in Qwen3.5-4B trained with fixed-budget GRPO on DeepScaleR. The 4k-trained checkpoint moves from a **+34.8 percentage-point** AIME advantage at 4K to a **−30.2-point** deficit at 64K; the 8k-trained checkpoint moves from **+42.4 points** at 8K to **−24.6 points** at 64K. At the largest evaluated budget, mean response lengths are also much shorter than the base model’s: 4.97–6.22k versus 27.32k tokens for Qwen, 1.05–1.90k versus 6.85k for Gemma, and 1.01–1.97k versus 6.11k for Nemotron.

### How the result was tested
The study trains Qwen3.5-4B, Gemma4-E2B, and Nemotron-3-Nano-4B with fixed generated-token caps on mathematical reasoning or procedurally generated problems, then evaluates accuracy and response length across inference budgets. Its trace ablation is especially informative: SFT on artificially shortened traces reproduces a high-budget scaling loss, while SFT on naturally completed short traces does not. This supports a role for truncated or artificially shortened training traces, but it does not isolate every difference between the trace sets or establish an internal representation of the cap.

### Research operation
The practical lesson is to treat the training cap as an experimental variable, not merely a compute limit. For every post-trained checkpoint, sweep inference budgets below, at, and above the rollout cap; report accuracy and mean response length together; and compare against the base model at each budget. A useful follow-up is to preserve the same successful examples while varying only whether long traces are truncated, naturally short, or allowed to finish. That design directly tests whether low-budget gains survive without sacrificing high-budget scaling.

### Boundary
The evidence is mainly mathematical reasoning with models having four to five billion active parameters, and the authors state that they do not establish how universal the effect is. Replication is strongest for the main DeepScaleR/AIME experiments; transfer and ablation findings generally use one training seed. The reported mitigations also do not combine the full in-budget improvement with the base model’s high-budget performance, so the trade-off remains unresolved.

Read it to see why a model that improves at its training cap can reverse relative to its base model at 64K-token inference, and how to design evaluations that expose that reversal.

[abstract; §2.1; Appendix A, Table 8; Appendix I, §A9 and Tables 15–16; §2.1, Table 1; exact accuracy and length values in Appendix A, Table 8; §3, SFT/RFT ablation; Table 3; §5 Limitations and Future Work; §1 Introduction, contribution summary](https://arxiv.org/abs/2611.26172v1)
