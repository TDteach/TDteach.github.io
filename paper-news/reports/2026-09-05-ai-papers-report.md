# 2026-09-05

## reasoning can be effectively incentivized by an extremely small fraction of generated tokens—as few as one or two tokens per reasoning trajectory

*[Extremely Sparse Supervision Incentivizes Reasoning Ability](https://arxiv.org/abs/2609.04565v1)*

## The assumption under test

The authors revisit a concrete premise of post-training: prevailing methods optimize over massive numbers of tokens and thereby implicitly assume that learning must be token-intensive. In on-policy distillation (OPD), they instead test whether a student can learn from only a few selected positions in each of its generated reasoning trajectories. The reported lower end is one or two supervised tokens per trajectory, corresponding to 0.05% of generated tokens ([paper, abstract](https://arxiv.org/abs/2609.04565v1)).

## What changes in the training objective

Rather than retaining loss contributions at every generated position, sparse OPD retains selected token positions. The tested selectors include one uniformly random token per trajectory (`rand1tok`) and selectors based on tokens with extreme OPD rewards (`mintok`, `maxtok`, and `minmaxtok`). This makes supervision density—not merely the teacher, data, or rollout count—an experimental variable. The paper reports that “rand1tok consistently improves the reasoning capability of base students across all nine teacher–student families” in its Qwen3 mathematical-reasoning setting ([§4](https://arxiv.org/abs/2609.04565v1)).

## Decisive evidence and a diagnostic caveat

Across nine Qwen3 teacher–student families, the authors report that “we can always identify a sparse OPD variant that matches (two out of nine families) or outperforms (seven out of nine families) plain OPD in terms of both reasoning capability boundary and sampling efficiency.” This is their main comparison against dense OPD, under their reported math evaluations ([§5](https://arxiv.org/abs/2609.04565v1)).

The result does not mean that better reasoning scores necessarily come from closer distributional matching to the teacher. The authors report that “many of the best-performing sparse OPD variants exhibit a larger reverse KL divergence than plain OPD.” In this setting, reverse-KL reduction is therefore not a sufficient proxy for downstream reasoning performance.

## A transferable experiment

At a fixed on-policy rollout budget, compare dense OPD with random-one-token and reward-extreme masking. Measure task performance and reverse KL together, then ask whether the selector that best matches the teacher is also the selector that best improves reasoning. This directly tests whether dense token correction is useful signal or harmful overconstraint in a particular training regime.

## Boundary

The authors caution that their study is “primarily conducted on the Qwen3 family and focuses on mathematical reasoning tasks, with additional validation on the Llama family.” They also report validation on coding reasoning and sparse PPO/RLVR, but sparse OPD still uses the same number of on-policy rollouts as dense OPD; the paper says those rollouts dominate computation and training time. Sparse masking alone should therefore not be interpreted as an overall runtime reduction.

It offers a concrete ablation for testing whether one-token or reward-extreme supervision can replace dense OPD loss terms without reducing the on-policy rollout budget.

[Abstract; §4; §5; §7](https://arxiv.org/abs/2609.04565v1)

## Cache interventions separate exact retrieval from language control in tested hybrid language models

*[What Attention Recalls and Recurrence Controls in Hybrid Language Models](https://arxiv.org/abs/2609.04434v1)*

Hybrid language models combine attention with a fixed-size recurrent state, but the roles of those two channels at inference have remained unclear. This paper turns that ambiguity into a causal question: when a trained hybrid model answers from a context, which channel drives the answer’s exact content and which drives its response mode? The experiments cover Qwen3.5 and Falcon-H1 hybrid families. [arxiv:2609.04434v1](https://arxiv.org/abs/2609.04434v1)

The method has two useful interventions. In **split-prefill**, the authors prefill a context, then answer a shared query while retaining either the attention KV cache or the recurrent state. This produces full, KV-only, and recurrence-only conditions. In **state-swap**, they prefill two contexts that disagree on relevant properties, then form a mixed cache: KV from one context and recurrent state from the other. The latter test is valuable because it asks which source a *single generated answer* follows, rather than merely comparing performance after an ablation. The study uses programmatic retrieval and behavioural diagnostics, including KV retrieval, list indexing, language following, and persona tasks, with greedy decoding. [arxiv:2609.04434v1](https://arxiv.org/abs/2609.04434v1)

On KV-retrieve and list-indexing diagnostics, KV-only retained 64–98% of full-model accuracy, while recurrence-only accuracy was zero. The reverse pattern appeared for output language and persona: the abstract reports that language and persona survive through recurrence, whereas KV-only language accuracy falls to about 1%. State-swap supplies the decisive attribution: generated values follow the KV-side context while output language follows the recurrent-side context. In recurrence-only generation, the models also accepted some absent words that were semantically or morphologically related to words in the context, rather than treating presence as an exact lookup problem. [arxiv:2609.04434v1](https://arxiv.org/abs/2609.04434v1)

The authors interpret this as an addressable KV store for specific items and a compressed recurrent prior that shapes language, persona, and semantic field. That interpretation is deliberately limited: these interventions identify what each channel *causally drives at inference*, not what information is statically encoded in either representation. Split-prefill also breaks the normal co-updating of the two channels and can create partly out-of-distribution cache combinations; state-swap mitigates, but does not remove, that concern. [arxiv:2609.04434v1](https://arxiv.org/abs/2609.04434v1)

A transferable research operation is to make two contexts disagree on separable properties—such as a factual value and an output-language instruction—then cross-swap internal channels and score each property independently. For a follow-up, ask whether the result persists under alternative decoding and with controls that quantify disruption from breaking normal channel coherence.

Read this to adapt split-prefill and state-swap as causal tests for whether different memory pathways retrieve exact context items or steer generation behaviour.

[Abstract; §3 Method; §4 Quantitative Dissociation; Table 1 (S4.T1); §6 Conclusion; Limitations](https://arxiv.org/abs/2609.04434v1)

## Hallucination Space Projection Reduces Whisper’s Non-Speech Hallucinations at Inference Time

*[Reducing Hallucinated Transcripts in Whisper via Hallucination Space Projection](https://arxiv.org/abs/2609.04561v1)*

Whisper’s generative decoder can produce fluent hallucinated transcripts for inputs containing little or no speech. The concrete limitation addressed here is non-speech rejection, not a general solution to every ASR hallucination scenario. WhisperX mitigates this failure through external VAD Cut & Merge and independent segment transcription. Calm-Whisper instead changes selected decoder parameters through targeted fine-tuning. This paper changes the intervention point again: it modifies decoder activations at inference time, with no parameter updates.

For each decoder layer, the authors construct activation differences between non-speech examples that hallucinate and non-speech examples that are correctly rejected. SVD compresses those differences into a rank-r hallucination-associated subspace. At inference, the selected decoder hidden state is replaced using `h_l - α(h_l Bᵀ)B`, removing the component aligned with the learned basis. The projection can be always-on, or gated so it runs only when Whisper’s initial `no_speech_prob` exceeds `γ`; final rejection still uses Whisper’s no-speech threshold. The gated variant therefore requires no external VAD.

The reported non-speech results are large: always-on projection lowers average hallucination rate from 31.31% to 2.44%, while gated projection lowers it to 3.74%. On LibriSpeech, however, gated projection increases absolute WER by 0.33–4.39 percentage points and produces false-rejection rates of 0.41–9.97% across model and split settings. The operating-point choice matters: in large-v3 validation-clean development selection with layer 28, rank 4, α=1.0, and γ=0.05, always-on projection had 11.59% WER and 9.69% FRR, compared with 5.32% WER and 1.85% FRR for gated projection.

The authors kept the subspace estimated from ESC-50 development folds fixed and report reductions on held-out ESC-50 folds, UrbanSound8K, and filtered FSD50K; they interpret this as evidence of a reusable decoder-level signature rather than an ESC-50-specific acoustic effect. A useful research operation follows: estimate the subspace on one non-speech calibration corpus, freeze it, then measure HR, WER, and FRR under deployment-like distribution shifts while sweeping `α` and `γ`. The key question is not whether one setting suppresses hallucinations, but where its operating point remains acceptable.

The boundary is explicit. The study does not evaluate long-form transcription, multilingual audio, or acoustically ambiguous inputs. It also reports an HR–WER–FRR trade-off, and gated projection depends on Whisper’s internal no-speech probability; calibration-to-deployment shifts may therefore change the preferred setting.

Read this paper to learn how a low-rank activation intervention can target a specific ASR failure mode without retraining, and how to evaluate the resulting hallucination, speech-error, and false-rejection trade-off under calibration shift.

[Abstract; Section 3 (S3.SS1, S3.SS2, S3.SS3) and Eq. (1); Section 5.1 (S5.SS1.p5); Section 5.2 (S5.SS2.p1-2) and Table 1; Limitations (Sx1.p1 and Sx1.p2)](https://arxiv.org/abs/2609.04561v1) · [S3.SS4.SSS3.p1](https://arxiv.org/abs/2303.00747v2) · [Section 4.3 / Table 3 and discussion (S4.T3.2.1.5 / S4.SS3.p4)](https://arxiv.org/abs/2505.12969v1)

## Peer Context Can Invalidate Solo-Calibrated Conformal Certificates

*[Conformity Breaks Conformal Prediction](https://arxiv.org/abs/2609.04445v1)*

A conformal certificate calibrated while an LLM answers alone can under-cover when the same question is shown with peers that unanimously assert a wrong answer. Hu and Su frame the failure as a **score-mechanism shift**: the question distribution is held fixed, but peer context changes the model’s conditional nonconformity-score behavior. In their setup, the score is `1 − p_gt`, where `p_gt` is the probability assigned to the ground-truth option; calibration therefore certifies the solo scoring mechanism, not necessarily the pressured one. [§4.1]

The experiment isolates this mismatch rather than changing the question set. The authors calibrate split (inductive) conformal prediction with LAC on round-1, solo scores, then deploy against unanimous-wrong peer transcripts. They report pooled results over open-weight models on ARC-Challenge and TruthfulQA, using 2,000 random 50/50 calibration/test splits and the standard `α = 0.10` operating point. [§3.1; Appendix F]

Under that condition, nominal 90% coverage falls to about 74%. The proposed mechanism is threshold crossing: peer pressure moves probability mass away from the correct answer, so items formerly retained in the prediction set can fall below the fixed conformal threshold. Crucially, the monitored input variable has not drifted—the question is identical—so this is not the ordinary covariate-shift setting that a reweighting method is designed to address. [§3.1; §4.2]

The paper also reports negative results for familiar repairs. Weighted conformal correction based on the question gives `w(x)=1` here and therefore reduces to the identity. Per-model (Mondrian) calibration removes some pooling artifacts, but at `α = 0.10`, three of four models remain below target coverage in the reported evaluation. [§4.2–§4.3]

The transferable research operation is to test the **scoring mechanism**, not only accuracy or the question distribution. Hold the questions and solo-calibrated threshold fixed; introduce controlled peer contexts; then measure changes in `p_gt`, answer flips, and coverage. This directly tests whether a certificate survives the context in which the model will actually act.

The scope is limited. The authors explicitly do not claim a universal conformity failure. Their tested effective repair—condition-aware recalibration—requires pressure-labeled calibration data that a defender may not have beforehand, and it restores coverage by widening sets until the decision layer escalates nearly everything. [§8; §4.4]

Read this to turn a conformal-calibration evaluation into a context-shift stress test: keep questions fixed, perturb peer messages, and measure whether correct-answer scores cross the deployed threshold.

[Sections 3.1, 4.1–4.4, 8; Appendix F](https://arxiv.org/abs/2609.04445v1)

## PatchBench finds PoC-only validation inflates C/C++ agent patch solve rates by 1.83× on average

*[PatchBench: Evaluating AI Agents for Vulnerability Patching](https://arxiv.org/abs/2609.04075v1)*

## The evaluation gap

PatchBench examines two ways a vulnerability-patching evaluation can over-credit an agent: its patch may substantially resemble a historical developer fix, or it may suppress the supplied proof-of-concept (PoC) crash near the sanitizer-reported site without repairing the underlying vulnerability. In the authors’ SEC-bench study, the estimated fraction of memorized patches rose from 11% for local-context prompting to 25% for repository-level agents, under their DiffBLEU threshold and experimental setup.

## What changes in the benchmark

DiffBLEU operationalizes a generated patch as memorized when its score exceeds 0.75. The benchmark then changes task construction rather than relying solely on this detector: it selects vulnerabilities whose ground-truth fixes are outside the crash stack, transplants historical vulnerabilities into newer repository contexts, and applies code mutations at patch sites. The resulting PatchBench contains 213 C/C++ tasks from 32 projects and 16 CWEs, with curated reference patches.

Validation also becomes a two-part behavioral test. The Security Condition requires that every input in the task’s crashing corpus that triggers the target sanitizer error in the vulnerable repository no longer causes a sanitizer error after the agent patch. Semantic validation compares the agent-patched repository with the reference-patched repository on benign inputs, checking sanitizer regressions, observable output-state equality, and unit tests. The crashing and benign corpora are produced with both directed and undirected fuzzing, each run for 10 minutes per task.

## The decisive result—and its limit

Across 11 agents on PatchBench, original-PoC-only validation inflated solve rates by 1.83× on average. Under the paper’s $5-per-task cap and no-external-web-access setting, the top three agents passed more than 97% of original PoCs but solved roughly half the tasks under combined Security and Semantic Validation. This gap is evidence that an original PoC pass should be reported separately from a broader repair-success claim.

The broader protocol is still not proof of root-cause removal. The authors report that their fuzzing-derived input corpus is incomplete: manual review found partially unfixed root causes in 6.8% of validation-passing Atlantis patches and 7.1% of validation-passing Codex patches. Deployment has a second constraint: without a reference-patched repository, their semantic comparison cannot be performed.

A transferable research operation is to design repair evaluations around the shortcuts an agent can exploit: alter historical task contexts, measure patch similarity, generate multiple adversarial inputs, and distinguish crash suppression from the specific behavioral properties being tested. Treat each passing corpus as coverage evidence with stated gaps, rather than as a complete correctness certificate.

Learn a concrete evaluation design for agentic vulnerability repair that separates historical-patch similarity, crash suppression, security testing, and semantic behavior.

[§3.2–§3.3; §4.2–§4.3; §5.2; §6](https://arxiv.org/abs/2609.04075v1)

Prepared retrospectively from the 2026-09-05 candidate papers; verified on 2026-09-15.
