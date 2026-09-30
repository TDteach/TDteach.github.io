# 2026-10-01

## Alignment Forecasting turns SFT-data curation into a pre-training hazard prediction task

*[Alignment Forecasting: Predicting Misalignment From Training Data](https://arxiv.org/abs/2609.35805v1)*

Earlier work showed that fine-tuning aligned LLMs on a 6,000-example insecure-code dataset caused broadly misaligned responses on out-of-distribution free-form prompts. The paper frames the operational gap as a pre-training decision: current practice catches alignment failures only after training, by auditing the resulting model.

Alignment Forecasting formalizes this gap as predicting alignment failures before training. The input is a target model, a candidate fine-tuning dataset, and a specified failure mode; the output is the probability that fine-tuning will meaningfully increase that failure mode. To measure progress, the authors introduce ALIGNMENTFORECASTBENCH, with more than 5,000 forecasting questions spanning 17 target models, 32 datasets, and 16 failure modes. Frontier models prompted directly perform poorly on the benchmark.

The proposed scaffold has two stages: an LLM reads the dataset and rates how strongly and broadly it pushes the model toward misbehavior; a simple learned model combines that rating with the failure mode’s base rate and the target model’s prior tendency. The transferable research operation is to turn an open-ended curation judgment into a probability-producing pipeline, then evaluate it against held-out model–dataset–failure-mode combinations rather than relying on data inspection alone.

On the benchmark, the scaffold forecasts well above chance and beats both a model fine-tuned on the forecasting task and a simple forecaster allowed to observe how weaker models behaved after fine-tuning on the same data. Its signals also flag problematic training examples that a frontier-model classifier misses. When those examples are filtered from real post-training data such as UltraChat, the resulting models are more aligned on the authors’ multiple-choice evaluation in most cases; the benefit in open-ended conversations is unclear.

The mitigation result is therefore conditional, not a general safety guarantee. The authors limit their evidence to supervised fine-tuning on 1,000-example datasets and one capability-based split, and note that the forecaster operates at dataset level while filtering removes individual rows. They also caution that MCQ-based emergence labels may not transfer to open-ended behavior. In the paper’s own description, the decomposed forecaster estimates how hazardous a dataset is per failure mode, with only a weak model-specific correction. A useful next experiment is to test whether forecasts trained on one SFT recipe retain ranking quality across dataset sizes, training procedures, and open-ended behavioral evaluations.

Read this to learn a concrete auditor-plus-combiner design for turning SFT-data curation into a pre-training probability estimate, while preserving the paper’s explicit boundary between MCQ-measured emergence and open-ended behavior.

[abstract](https://arxiv.org/abs/2609.35805v1) · [\[abstract1.1\]; \[S1.p3\]; \[S2.SS1.p5\]; \[S2.SS1.p6\]; \[S3.SS2.p1\]](https://arxiv.org/abs/2502.17424v7)

## LLM Annotation Repeats Reliably Within a Setup but Shifts Across Defensible Designs

*[Reliable but Design-Sensitive: Instrument Uncertainty in LLM Annotation](https://arxiv.org/abs/2609.35824v1)*

### The change in test

Repeating one model under one task design tests run-to-run reproducibility, but it cannot reveal labels that change under another defensible design. This is the concrete limitation the study addresses: it calls variation caused by task design and model choice **instrument uncertainty**, and says that comparing reasonable designs—not repeating one setup or relying on confidence scores—is required to measure it.

### Experiment and evidence

The fully crossed experiment used seven LLMs, 12 task designs, three independent runs, and the same 3,000 tweets, covering offensive-language and hate-speech labels. The designs varied task structure, individual versus six-tweet batch presentation, and whether confidence was elicited; temperature was fixed at 1. Within a fixed model-design cell, run-to-run reproducibility was high, with median Fleiss’ κ = 0.91, but modal labels were less stable across task designs, with median Cohen’s κ = 0.76.

The prevalence result is larger than a reliability statistic alone suggests. Adding run, task-design, model×design, and model-choice variance to nominal sampling variance produced design effects of 76.7× for offensive language and 110.6× for hate speech. Average design manipulations also shifted estimated prevalence: batching reduced offensive-language prevalence by about 590 basis points, while asking offensive language first in joint labeling increased offensive-language and hate-speech prevalence by about 270 and 230 basis points, respectively. In the paper’s comparison on the same items, LLM task-design variation was about 560–572 basis points, versus 270–331 basis points across five human instrument versions.

Confidence did not provide a substitute diagnostic: it tracked repeated model outputs more closely than agreement with human labels and did not identify labels that would change across task designs. Grouping six tweets in one prompt also lowered mean offensive-language confidence by about 660 basis points.

### Transferable operation

For a new annotation study, treat the model-plus-design combination as the instrument. On a shared item set, enumerate defensible structural designs and model choices, repeat each cell, and estimate both agreement and prevalence variance before selecting a protocol. The useful question is not only “Does this setup repeat?” but also “How much does the estimate move across reasonable setups?”

### Boundary

The evidence concerns offensive language and hate speech, so it may not generalize to objective NLP tasks with tight ground-truth constraints. The seven-model sample was limited and non-random; the study also held wording constant, did not test other prompt parameters such as few-shot exemplars or multi-turn workflows, fixed temperature and one collection window, and did not test propagation into downstream models trained on the labels.

Read this to learn how to turn an apparently reliable LLM annotation pipeline into a crossed sensitivity experiment that measures design-induced prevalence uncertainty rather than only repeatability.

[abstract; Abstract; §4.1; Table 6; Abstract; §4.2; Table 2; §4.2; Table 3 (pooled mixed-effects LPMs); Abstract; §4.4; Table 7; Figure 3; §7 Task and Construct Scope; §7 Task-Design Parameter Space; §7 Model Selection; §7 Prompt Wording; §7 Temperature and Time; §7 No Downstream Model Training](https://arxiv.org/abs/2609.35824v1)

## Visible model-family labels split heterogeneous LLM teams and slow consensus

*[Prompted Identity Degrades Cooperation in Multi-Agent LLM Systems](https://arxiv.org/abs/2609.35928v1)*

Earlier work quantified self-preference in pairwise LLM judging and linked lower evaluator-conditioned perplexity with higher preference; its proposed ensemble mitigation was not empirically tested there. This paper changes the unit of analysis to repeated multi-agent coordination, asking whether identity metadata changes group behavior.

In the tested setup, agents from up to five open-weight model families play two cooperative games and a GPQA-Diamond reasoning benchmark. The conditions remove identity labels, show the announced family, shuffle that label relative to the underlying model, or replace family names with neutral color tokens. This is the key method change: identity metadata becomes an experimental variable while the models participate in the same coordination setting.

Under shuffled labels, emergent communities align with the announced labels rather than the true architectures. Neutral labels also drive same-label clustering, while removing labels makes the behavior disappear. An adoption probe finds that agents assign higher probability to peers’ votes aligned with the visible label; under mislabeling, this alignment follows the visible label, whereas raw stylistic similarity follows true architecture. This is a mechanism signal, not a causal intervention, so it supports a label-driven account without establishing that adoption is the sole cause.

The coordination cost is substantial in the tested strictly cooperative tasks: labeled groups use average 30% more rounds and 55% more tokens to reach a decision, and success falls from 96% to 81%. The paper presents withholding identity labels as a simple mitigation, and the tested unlabeled condition suppresses factionalism and improves coordination metrics.

The evidence is bounded: experiments use up to five open-weight families and controlled text-only consensus games; larger rosters, closed models, other decoding regimes, and richer agent workflows remain untested. The bespoke games limit external validity, and GPQA-Diamond uses the Leader Election protocol; whether the cost transfers to other externally evaluated interaction protocols remains open.

For a new system, hold task and model roster fixed while toggling no labels, true labels, shuffled labels, and neutral tokens, then compare community alignment, rounds, tokens, and success. The useful research question is whether a discovered cluster follows model behavior or merely a prompt-visible token.

Read it for a concrete metadata-ablation design: shuffle or neutralize agent identities to test whether coordination follows visible labels rather than model architecture.

[abstract](https://arxiv.org/abs/2609.35928v1) · [abstract](https://arxiv.org/abs/2410.21819v2)

## Reserved Token IDs Carry Much of Chat-Template Injection Authority Even When Marker Bytes Stay Fixed

*[Same Bytes, Different Authority: Reserved-Token Representations in Chat-Template Prompt Injection](https://arxiv.org/abs/2609.35932v1)*

The paper isolates a hidden interface in chat-template injection: the same marker characters can be delivered either as one reserved control token or as ordinary subword tokens. Compared with Phantom’s earlier structural-template work—which automated the search for forged histories—this study adds a fixed-byte control for separating visible text from token identity; it also probes the corresponding embedding row rather than only measuring attack outputs.

The core experiment makes three variants: Reserved, Split, and Matched. Reserved uses default reserved ids; Split forces ordinary segmentation of the same characters; Matched keeps reserved ids but adds the same number of extra ordinary tokens elsewhere, controlling token-count changes. The paired tests run on InjecAgent direct-harm and data-stealing cases and on multi-turn AgentDojo execution. The mechanism probe replaces only marker-position input vectors with mean subword vectors, nearest ordinary-token vectors, or other reserved-token vectors. These choices make the question operational: is success explained by bytes, sequence length, or a learned representation at the marker?

The decisive result is model-dependent but large in most tested families. On InjecAgent, subword-encoding the forged markers while holding text fixed lowers attack success by 39–66 percentage points on three of four open-weight families. Qwen3-8B shows an 8-point gap; the authors attribute this residual attack to text-level reasoning, and suppressing its reasoning block widens the gap to 50 points. The mean of marker subword vectors does not restore attack strength, whereas the nearest ordinary-token vector restores it on Llama-3.1; an adaptive search finds non-reserved embedding neighbours on three of four families. Instruction tuning strengthens reserved-marker preference in every tested base/instruction pair. The same gap carries to AgentDojo, so the result is not limited to a single next-turn benchmark.

The engineering implication is narrower than “sanitize strings.” A tokenizer option that splits declared special tokens helps only for tokens actually declared special: the paper reports that 33 of 67 tokenizer configurations, covering 255 of 400 most-downloaded chat models, leave tool-protocol tokens intact, with the gap persisting through untrusted tool output. For a reproducible audit, compare Reserved, Split, and Matched on the exact tool-channel bytes, then inspect which protocol markers remain reserved.

The boundary matters: these results concern self-hosted open-weight models where the deployer controls tokenization; hosted APIs accepting only strings are outside scope. The primary outcomes are parsed attacker tool calls on InjecAgent and execution-level goal checks on AgentDojo, not every possible harm or long-horizon trace.

Read this to learn how a Reserved–Split–Matched tokenization contrast separates visible prompt text from the token representation actually consumed by a self-hosted model.

[abstract; abstract; S1.I1.i2.p1.1; S4.SS4; S4.T4; S5.SS0.SSS0.Px1](https://arxiv.org/abs/2609.35932v1) · [abstract; §1 (S1.p5) and Appendix A (A1.p1); abstract; §1 (S1.I1.i2) and §5.2 (S5.SS2)](https://arxiv.org/abs/2602.16958v1)

## Rendering Untrusted Text as Images Can Reduce Prompt-Injection Success

*[Render Before Reading: Visual Rendering as a Prompt Injection Defense](https://arxiv.org/abs/2609.36121v1)*

The paper isolates a concrete channel-level limitation for multimodal prompt-injection defenses: identical adversarial instructions are more likely to be followed when delivered as text than when delivered through an image or another non-text channel. In a paired conflict experiment spanning 21 instruction pairs and six VLMs, the text channel was reported to be 2–300 times more persuasive than the image channel in the measured cases.

Pictionary turns that asymmetry into a harness-level intervention. It converts all untrusted payloads into typographic images (or audio) before they reach the model, and the defense is training-free. The proposal therefore changes the delivery channel without changing model parameters.

Across ten models and the DirectInject and AgentDojo benchmarks, the authors report lower attack success rates, including under adaptive attacks and human red teaming. In their pooled worst-case comparison, GPT-5.4 mini falls from 100% to 17.8% on DirectInject and from 83.3% to 31.0% on AgentDojo after rendering; Claude Haiku 4.5 falls from 98.2% to 10.7% and from 97.6% to 9.5%, respectively. On τ²-Bench, with tool outputs rendered as images, task success stays within 0.9–2.1 percentage points of the text baseline for three tested models.

The paper’s explanation is training-related: the modality gap emerges with instruction tuning, is largely absent in base models, and is eroded when models receive benign image-rendered instruction fine-tuning. This makes the training distribution a security variable and suggests that the defense should be re-tested as models acquire stronger instruction-following in visual channels.

Three constraints qualify the result. First, Pictionary depends on OCR; weak text-in-image recognition can suppress essential benign content as well as malicious instructions. Second, it does not relocate payloads that are already visual, such as screenshots or GUI content. Third, effectiveness is model-dependent: Gemini 3.1 Flash Lite is reported to remain nearly fully compromised, with ASR changing from 100.0% to 97.8%. Rendering also raises serving cost because image inputs are typically billed at a fixed token count an order of magnitude above the text they replace.

For a short research session, reproduce the paired security–utility test per target model, log OCR failures on benign payloads, and add native-image inputs to the threat model. Treat the resulting ASR reduction as conditional evidence for a channel-routing layer, not as a universal prompt-injection fix.

Read this to learn how a training-free channel change can be evaluated as a prompt-injection defense, while checking OCR fidelity, model dependence, native-visual coverage, and serving cost.

[abstract](https://arxiv.org/abs/2609.36121v1)
