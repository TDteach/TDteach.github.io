# 2026-11-23

## Full AI-safety research traces did not reliably expose expert-planted sabotage to auditors

*[Auditors Struggle to Catch Sabotage In End-to-End Transcripts of AI Safety Research](https://arxiv.org/abs/2611.21832v1)*

The earlier evaluations in this comparison gave agents specified side tasks in ML-engineering or long-horizon AI R&D settings. ResearchArena reports that artifact access can still fail when monitors do not formulate the right behavioral probe. Here, the paper instead uses a human expert’s attempt to alter the conclusion of a greenfield AI-safety project as the attack setting, making the complete research process the audit object.

One expert human researcher ran ten greenfield AI-safety projects, first benignly and then with attempts intended to change their topline conclusions. The saboteur saw the corresponding benign results before attempting each attack. Human auditors received full timestamped traces, AI assistance, and the ability to run validation experiments, with up to 90 minutes per audit. The evaluation scored trace-level suspicion separately from identification of the specific sabotage mechanism.

Under this protocol, human auditors weakly distinguished sabotaged from benign traces: the reported AUROC was 0.59, with a bootstrap interval that was not significantly above chance. At the final mechanism checkpoint, auditors missed 114 of 155 audit–mechanism opportunities, fully identified 27, and partially identified 14. The strongest evaluated AI auditors had higher observed discrimination and mechanism-identification scores than the human auditing system, but the study did not establish a statistically clear advantage.

That AI comparison is not controlled: human auditors could run experiments and receive feedback, whereas AI-only auditors could not, and the strongest AI models were newer than the human-audit cutoff. The paper also retrospectively selected attacks using the saboteur’s ratings of auditability; this does not demonstrate that an attacker could prospectively choose such cases. The study uses one human proxy saboteur and ten selected projects, and the saboteur’s access to benign results gives the attacks task-specific advance knowledge. It therefore does not estimate how often deployed AI systems would sabotage research, or whether these attacks represent future AI behavior.

For audit designers, the operational lesson is to report suspicion and actionable mechanism identification separately, and to label attack-selection analyses retrospective unless prospective selection and its rejected cases are actually tested.

Read it to learn how to separate “an auditor noticed something suspicious” from “an auditor found the defect that would repair the research conclusion” in end-to-end research audits.

[abstract; §1, paragraph 3; §2.1–2.2; §3.1; Figure 2 caption; §3.2, paragraph 1; §3.3, paragraph 1; Appendix H.4; Appendix A.1; Appendix A.2; Appendix A.10; Appendix A.12; Appendix A.13; Appendix G.5, paragraph 4](https://arxiv.org/abs/2611.21832v1) · [§3, Two side-task classes; §5.2, Inspecting the artifact raises suspicion](https://arxiv.org/abs/2607.19321v2) · [Section 4.1, Extending MLE-Bench with code-sabotage tasks](https://arxiv.org/abs/2511.09904v2)

## PDE-solver evaluations show that LLM correctness can hide representation and causal failures

*[Solver to System: LLM Reasoning Across Representations and Execution in Scientific Simulation](https://arxiv.org/abs/2611.21964v1)*

A prior supplied study focused on identifier-only changes in code summarization and execution prediction. Solver2System changes the evaluation target: it tests whether LLMs can recover the physical system underlying a PDE solver through cross-representation consistency and static or agentic detection of physical invalidity. It introduces a dataset linking solver code with equations, natural-language descriptions, and numerical trajectories, then applies controlled corruptions and lexical perturbations. For researchers, the method change is important because code names become a probe of whether linked scientific views are reconciled, not only whether code-focused behavior changes.

Across eight open-weight models, the paper reports systematic preference for some representations when evidence conflicts. On consistent items, models incorrectly reported disagreement 47% of the time. Detection varied by corrupted view: code was hardest among the stated representation types, with reported detection rates ranging from 63% for corrupted code to 88% for an invalid solver’s trajectory. When representations conflicted, trajectories were blamed disproportionately even when another view was corrupted.

The lexical result crosses representation boundaries. Changing only code identifiers can impair identification of inconsistencies in other, unchanged representations. Across corrupted items, obfuscation reduced correct outlier identification by 4.0 percentage points, with a 95% confidence interval of [-5.0, -3.0]. This makes identifier perturbation a useful counterfactual for testing whether an agent is integrating evidence or relying on code-side cues.

Execution improved physical-validity judgments in the tested agent settings: Gemini 2.5 Flash without thinking gained 9.3 percentage points, while Gemini 3.7 Flash with high thinking gained 1.9 points from 93% static accuracy. Yet execution did not uniformly improve discrimination between matched valid and invalid solvers: for Gemini 2.5 Flash without thinking, inversions moved from 12% to 13%, while with thinking they fell from 15% to 6%.

The causal boundary is sharper. Among correctly identified invalid snippets after agentic execution, Gemini 2.5 high-thinking justifications made false code claims in 21% of cases and missed all causal defects in 31%. This analysis used an LLM judge, with a separate human audit of 20 cases. The paper also documents a case where execution reinforced an incorrect physical interpretation because the diagnostic did not target the causal defect. A transferable evaluation operation is therefore to score verdict, outlier localization, and causal diagnosis separately after both representation corruptions and tool use.

Read it for a concrete benchmark pattern that separates verdict accuracy from representation localization and causal diagnosis when a scientific coding agent can execute a solver.

[abstract](https://arxiv.org/abs/2611.21964v1) · [abstract](https://arxiv.org/abs/2510.03178v1)

## Same-Prefix Counterfactuals Separate Error Detection from Continuation Value

*[A Full-Ledger Counterfactual Audit of Adaptive Reasoning](https://arxiv.org/abs/2611.22778v1)*

## The evaluation problem

The paper targets a specific evaluation shortcut: treating a likely-wrong current answer as evidence that more compute will help. **FLCVA treats current-answer error as insufficient evidence of continuation value.** A continuation can repair an incorrect answer, but it can also damage a correct one, so both outcomes must be measured.

## What FLCVA changes

At each checkpoint, FLCVA holds the prompt and existing reasoning tokens fixed, compares an answer-now result with four fixed-length continuations, and applies the same answer procedure. The primary protocol uses one stored on-spine continuation and three independently sampled off-spine continuations, each 256 tokens long. The signed target compares correctness after continuation with correctness at the checkpoint and divides the change by logical-token cost, including answer probes. The study then separates three questions: can local continuation value be measured, can observable signals predict it, and can those predictions improve budgeted allocation after signal costs are charged?

## What it finds

On GSM8K and MATH-500, a uniformly selected 256-token continuation recovered a wrong answer in 26.6% of Qwen3-8B wrong checkpoints and 18.9% of DeepSeek-R1-Distill-Qwen-7B wrong checkpoints. It damaged a currently correct answer in 1.4% and 1.9% of cases, respectively. Answer persistence was the strongest recovery proxy in both models, with AUROC 0.658 and 0.673, but the paper cautions that predictive ranking is not reliable individual outcome prediction.

The allocation result is more restrained. Under full logical-token accounting, continuation-specific Ridge-M allocation produced no reliable increment for Qwen3: −0.21% normalized AULC, with a 95% confidence interval of [−0.52%, +0.12%]. DeepSeek showed a modest +0.70% increment [＋0.07%, ＋1.35%] beyond a shortcut that prioritizes likely-wrong answers; the two-stage conditional-EV controller was inconclusive for both. Offline labels from independently sampled branches predicted a separate continuation’s outcome, but this is diagnostic evidence rather than a deployable signal. The paper also shows that apparent value can shrink when the trajectories used to acquire a signal are charged.

## Research use and boundary

For a new adaptive-inference experiment, log frozen prefixes, answer-now outcomes, fixed-continuation outcomes, signal-acquisition cost, and policy decisions separately. The concrete question is not merely “Can the system detect likely errors?” but “After paying for that detection, does predicting continuation-specific repair or damage beat a current-wrongness baseline?”

These conclusions remain bounded: the study covers three open-weight models, mathematics benchmarks, and short 128-, 256-, or 512-token actions. Continuation value depends on the sampling and answer-generation procedure, and the weak gains of lightweight, myopic controllers do not establish that richer or non-myopic deployable policies would fail.

Read it to learn a concrete audit protocol that distinguishes detecting a likely-wrong answer from estimating whether additional reasoning will improve it, then tests that distinction under a charged inference budget.

[abstract; Section 3.1, paragraph 1; Section 3.2, paragraph 1; Eq. 1; Section 5.1, paragraph 1; Table 3; Section 5.2, paragraphs 1–2; Table 4; Appendix C.2; Section 5.3, paragraph 1; Table 5; Section 5.4, paragraph 1; Appendix B, Table 12; Section 5.4, Effects of signal cost and scheduling, paragraph 1; Appendix B, Table 15; Section 8 Limitations, paragraph 1; Section 8 Limitations, paragraph 2](https://arxiv.org/abs/2611.22778v1)

## Fixed-history interventions test whether semantic driving forecasts use future actions

*[Does the Action Matter? Probing Action-Conditioned Semantic Forecasting as a World Model for Autonomous Driving](https://arxiv.org/abs/2611.24840v1)*

Action-conditioned world models are commonly evaluated by prediction fidelity or planning performance, but those checks do not necessarily show that a forecast uses its supplied action. This paper isolates that question for semantic forecasting: does changing a future ego action, with the observed scene history fixed, change the predicted future in a measurable way? A supplied earlier record, GAIA-1, describes action-conditioned driving-scene generation; this paper instead makes dependence on the action the direct evaluation target.

The probe keeps the observed segmentation history and past actions fixed while replacing the future action at test time. Replacements include an action from another sequence, zero yaw, a stop command, and the training-set mean; the resulting forecasts are scored with mIoU and movable-object mIoU. The study compares feature-wise action conditioning, input-level action concatenation, and an otherwise identical model without action input. A synthetic environment with known action-dependent dynamics and a shuffled-action training control tests whether the intervention distinguishes action-using models.

The results separate ordinary accuracy from action sensitivity. On Cityscapes, action conditioning improves mIoU over no action by 1.12 points for FiLM and 0.86 for concatenation at short term, and by 2.46 and 2.12 points at mid term. By contrast, a shuffled future action lowers mid-term mIoU by 23.17 points for FiLM and 14.78 for concatenation, putting both below the no-action baseline. On the reported real-data mid-term comparisons, FiLM conditioning has a 1.6-fold larger shuffled-action drop on both Cityscapes and BDD100K than input-level concatenation at similar executed-action accuracy. In cross-platform transfer, the shuffled-action effect tracks the training dataset more than the evaluation dataset.

The practical lesson is to report both executed-action accuracy and fixed-history intervention sensitivity. The latter measures how strongly the forecast responds to the supplied action, not whether the counterfactual forecast is physically correct. A useful follow-up is to construct history-matched interventions, because shuffled and stop actions can be inconsistent with the observed history and partly outside the training distribution.

The evidence remains bounded: BDD100K targets are SegFormer-B5 pseudo-labels rather than human annotations, and the study covers one front camera, a compact semantic forecaster, horizons up to 0.6 seconds, and two datasets. It therefore does not establish the same dependence for larger video or occupancy world models or show that measured dependence improves planning.

Read it to borrow the fixed-history action-intervention protocol when ordinary forecast accuracy does not show whether a control input is actually being used.

[abstract; Section 3.4, Action interventions; Section 4.4, Action dependence; Table 2](https://arxiv.org/abs/2611.24840v1) · [abstract](https://arxiv.org/abs/2309.17080v1)

## General progress lowers the data cost of relearning withheld skills

*[General progress substitutes for specific training data in language models](https://arxiv.org/abs/2611.24844v1)*

### The measurement change

An earlier transfer study measured pretraining benefit as the additional Python data a same-sized from-scratch model would need to match a fine-tuned model’s loss. For a filtering study, the useful follow-up question is whether a missing target signal is delayed relative to progress on the rest of training, and how much return data is needed. This paper measures both: skill delay at matched background loss and post-return acquisition cost.

### Method

The authors withhold individual skill signals in chess, Othello, molecular strings, bracket languages, and web text. In the central intervention, selected skill-specific next-token targets lose their training signal, while their input tokens remain in the stream. Skill competence is then compared with background loss at matched progress. Fully supervised and never-supervised trajectories provide endpoints for predicting the deficit caused by target thinning. For relearning, the withheld targets return at checkpoints; the analysis relates acquisition cost to the model’s logit surplus and compares true-skill returns with a difficulty-matched permuted chess rule.

### Evidence

In the chess experiments, the endpoint method predicted the deficit under thinning with an RMSE of 0.039 logits for 9.7M-parameter models and 0.089 logits at 64M, without fitting a parameter to the thinned models. Keeping 10% of in-check targets delayed onset by 0.29–0.49 nats, with little change in delay across the tested 9.7M–3.0B sizes under the paper’s onset measure. With no in-check targets ever supervised, a 64M model’s most probable legal reply matched the game move in 0.64 of held-out positions, versus 0.68 for the fully supervised model; it nevertheless assigned substantial probability to moves that would be legal outside check.

Across chess, web text, and SMILES, each logit of surplus lowered acquisition cost by about tenfold in chess and web text and fourfold in SMILES. The permuted chess control required 2.4–16 times as many tokens as the true rule from the same checkpoints. A separate 7B capital-recall demonstration reached acquisition at small fractions of initialization data at selected late checkpoints, while earlier returns were censored; a 7B Rust case showed rapid but incomplete functional recovery.

### Boundary and research use

Target thinning is not equivalent to removing all information-bearing examples because inputs remain unchanged. The thinning derivation also rests on assumptions about representations, optimal predictions, and the targets’ contribution to unsafe outputs. Finally, the quantitative acquisition-cost fit excludes Othello, where acquisition was often near the measurement-resolution limit. A useful replication should therefore report both matched-background-loss delay and return-data cost, then add a difficulty-matched control rather than treating apparent recovery as generic learning.

Read it to learn a concrete evaluation design: match models on background loss to measure skill delay, then test whether post-return data savings survive a difficulty-matched control.

[abstract; Methods §4.3 (S4.SS3.p1); Results §2.1 (S2.SS1.p5); Results §2.1 (S2.SS1.p7); Results §2.2 (S2.SS2.p1); further details in Appendix C.1 (A3.SS1.p2); Results §2.3 (S2.SS3.p2, S2.SS3.p5); Results §2.4 (S2.SS4.p1); Results §2.4 (S2.SS4.p3); Appendix A, paragraph 2 (A1.p2); Methods §4.10 (S4.SS10.p2)](https://arxiv.org/abs/2611.24844v1) · [Abstract, paragraph 1](https://arxiv.org/abs/2102.01293v1)
