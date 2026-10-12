# 2026-10-12

## Mutual information alone cannot certify slow fine-tuning recovery in open-weight models

*[Removing Information Content Does Not Certify Tamper Resistance in Open-Weight Models](https://arxiv.org/abs/2610.09004v1)*

The concrete limitation is a mismatch between release statistics and attack behavior. Deep Ignorance reported that filtered models resisted the tested adversarial fine-tuning attacks up to its 10,000-step, 305M-token budget, but its open-book evaluation found that supplying relevant information in context defeated all evaluated defenses. This was a protocol-bounded result, not a release-independent recovery-time certificate.

Rosati et al. make the mismatch formal. Under smooth, representation-compatible symmetries, a transformation can preserve the relevant mutual information while changing the parameter Jacobian; for invertible linear, loss-preserving transformations under plain gradient descent, the change appears as an orbit-dependent preconditioner. They then study weight–data MI and label–representation MI separately rather than treating “information removal” as one quantity.

The decisive counterexamples are small but exact. In a scalar training construction, moving one harmful sample later in the sequence changes recovery time while preserving its weight–data MI. In a separate linear construction, label–representation MI is zero at release, yet gradient descent reaches zero loss in one update; the example assumes task-relevant structure remains in the input and a specified representation and attack. These results rule out a universal MI-only lower bound on recovery time over attack and release classes containing the constructions.

The experiments test whether this mechanism survives beyond toy models. In a Deep Ignorance checkpoint comparison, exact Q/K rescaling preserved the represented function while changing the median first logged 60%-training-accuracy attainment from 125 to 225 updates for the unfiltered checkpoint, versus 150 for unscaled strong-filtering; at 293 updates, strong-filtering at α=8 reached 69.3±4.4% and unfiltered at α=1 reached 68.9±1.8%. The comparison is paired and single-seed, with full-model plain SGD, so it is not a like-for-like replacement for Deep Ignorance’s longer multi-attack evaluation. The Pythia order experiments likewise report order-dependent recovery at fixed target exposure, but do not measure weight–data MI; exact fixed-MI order dependence comes from the scalar proposition.

The transferable operation is to evaluate two layers separately: first measure the release statistic, then specify and stress-test the attack dynamics—optimizer, trainable blocks, learning rate, data order, parameterization, and budget. The paper’s own boundary is explicit: the orbit derivation is for plain gradient descent, and other optimizers or restricted trainable blocks require separate analysis. Thus the paper challenges standalone MI certification, not the usefulness of filtering or unlearning in every setting.

Read it to learn how to separate a release-time information metric from the optimizer and parameterization that determine recovery speed.

[abstract; Section 3, Lemma 3.1; Section 4, “Deep Ignorance: recovery rankings depend on coordinates”; experimental protocol and values in Appendix B.1; Section 4.1, Proposition 4.2; Section 4.1, Figure 2 caption; protocols in Appendix B.2; Section 5.1, Proposition 5.3 and proof; Section 5.1, paragraph following Proposition 5.3; Section 3, paragraph following Proposition 3.2](https://arxiv.org/abs/2610.09004v1) · [§3.2, Pretraining data filtering confers state-of-the-art tamper resistance; §4.1, Retrieval-augmentation attacks](https://arxiv.org/abs/2508.06601v2)

## Label-Flipping Tests Reveal Decision-Label Sensitivity in LLM Judges for Entity Alignment

*[Reliability of LLM Judges for Evaluating Entity Alignment](https://arxiv.org/abs/2610.09554v1)*

Evaluating Entity Alignment (EA) systems at scale is expensive because it requires expert annotation. This paper asks whether an LLM judge evaluates the evidence for an EA decision or instead follows the visible MATCH/NON-MATCH label. It benchmarks three frontier models, three datasets, and four EA systems using perturbation-bias diagnostics, meta-evaluation across dataset–judge–prompt combinations, counterfactual label flips, and a human check.

A related counterfactually augmented data study asked human editors to make coherent, minimal changes that make a specified alternative label apply; the examples were used to probe and augment task-model training. That study also cautioned that it did not formally identify causal effects, because human edits may change multiple document aspects. The current paper changes the intervention target: it flips the displayed EA decision while holding pair evidence fixed, testing the evaluator rather than editing training examples.

In the label-flip test, the intervention supports a causal effect of visible decision labels on judge scores: across reported conditions, 53–99% of pairs had a score shift exceeding two points. That figure is a sensitivity measure, not by itself a directional result, because FSR measures shift magnitude while the paper reports label-following separately as LFR. With the system decision visible, judge discrimination often collapses or inverts, particularly on the distinctive-name general-domain dataset and in many biomedical conditions, although the pattern is not uniform.

On distinctive-name datasets, the label-free protocol reaches J-ROC-AUC 0.93–1.00, and on biomedical pairs 0.93–0.95. This recovery is conditional: the label-free prompt changes both label exposure and task framing, from judging a system decision to predicting alignment, so it is not a label-visibility-only ablation. Separately, removing entity identity cues on the biomedical benchmark causes large score collapses in many judge-prompt conditions, consistent with dependence on recognizable names. A blinded two-annotator study of 102 pairs reports Cohen’s kappa=0.902, but the annotators were the paper’s authors rather than independent external experts.

For a new evaluator, the transferable operation is simple: keep pair evidence fixed, flip only the displayed decision, record score magnitude and direction, and compare the resulting judgments with gold correctness. The study’s scope remains limited: only three closed-source frontier judges were evaluated; open-source models and non-English datasets remain untested. Reported discrimination uses 50/50 class-balanced evaluation, and the biomedical gold links inherit UMLS CUI co-membership rather than newly adjudicated annotation. The paper also releases a 15,000-pair MeSH–SNOMED CT resource, whose provenance and licensing constraints matter for reuse.

This gives researchers a concrete audit for detecting whether an LLM evaluator responds to evidence or to a visible system label, while showing why label-free recovery cannot be read as a pure label-removal effect.

[abstract](https://arxiv.org/abs/2610.09554v1) · [Abstract](https://arxiv.org/abs/1909.12434v2)

## Caddie Trains LLM Critics by Branching a Frozen Agent from the Same State

*[Training Advisors for LLM Agents from Task Outcomes](https://arxiv.org/abs/2610.09858v1)*

Caddie targets a concrete supervision gap: natural-language feedback need not be trained from step-level labels or reference critiques. It instead assigns a critic’s reward from the final outcomes of agent continuations after the critique, while keeping the base model frozen and updating only the critic.

Outcome-trained advice for a frozen student is already represented by Advisor Models; the supported methodological distinction here is Caddie’s explicit same-prefix branching and group-relative credit assignment across candidate critiques. For each sampled intermediate point, Caddie generates multiple candidate critiques, appends each to the same prefix, runs continuations of the frozen agent, scores each critique by mean terminal reward, normalizes rewards within the group, and updates only the critic with DAPO. At inference, the agent may invoke a critic tool; the main evaluations allow up to three critiques per trajectory.

In the in-domain evaluations, Caddie raises mean success over no critic by 25.31 percentage points on MuSiQue with attached passages, 10.75 points with Wikipedia retrieval, and 25.93 points on ALFWorld. The MuSiQue-trained critic has a higher mean than no critic and both prompted-critic baselines in all six reported unseen-base-model conditions, although gains are much smaller and less consistent with Wikipedia retrieval than with attached passages. Without further training, the MuSiQue-wiki critic also transfers to unseen task families: with Qwen3.8-27B, mean success rises on all three evaluated tasks, including τ³ Retail and Airline.

The transfer result is conditional, not uniformly positive: the attached-trained variant lowers Qwen3.8-27B DeepDive success from 48.83% to 44.53%. For a researcher, the reusable operation is to evaluate advice as an intervention: hold an intermediate state fixed, branch the same agent under several candidate critiques, and use their terminal outcomes for relative credit. That operation requires multiple base-model continuations per sampled state and restoration of equivalent environment states across branches. The paper trains only Qwen3-4B critics, so the effect of critic capacity on effectiveness and transfer remains unverified. It also does not establish superiority over scalar verification under matched compute and inference conditions, and the self-call comparison is conditioned on the agent requesting help rather than being a causal intervention. On self-contained tasks, the outcome objective may instead train the critic to generate complete solutions for the base model to copy.

Read this to learn a same-state branching recipe for training language advice from terminal rewards, and to test whether its transfer survives model, domain, and environment constraints.

[abstract; Section 1, paragraph 5; Section 2.2; Section 3.1; Section 3.2, Table 1 and accompanying text; Section 3.3, Table 2 and accompanying text; Section 3.4, Table 3 and accompanying text; Section 5, Practical constraints; Appendix K, Environment restoration; Section 5, Practical constraints; Appendix K, Critic scale; Section 5, Scalar verification; Section 4, Figure 2 caption; Section 5, Task structure; Appendix K, Task structure](https://arxiv.org/abs/2610.09858v1) · [abstract](https://arxiv.org/abs/2510.02453v3)

## Action-changing scene counterfactuals diagnose instruction-action binding in VLA policies

*[When Instructions Retrieve Trajectories: Diagnosing and Mitigating Generalization Failures in VLA Models](https://arxiv.org/abs/2609.39971v1)*

High in-distribution success and robustness to nuisance changes can conceal a failure on counterfactual changes that require a different action. This paper calls that failure instruction-action binding: a policy responds to language and vision but does not combine them to select the action required by the task. The proposed diagnosis is narrower than language being ignored: failed rollouts can retain the source behavior or switch to another demonstrated task.

In 381 targeted LIBERO-PRO probes of the official fine-tuned π₀.₅, 69.3% were labeled source-task, other-task, or hybrid retrieval, versus 26.5% correct or near-correct following; the retrieval-like grouping is a behavioral label, not proof of a retrieval algorithm. In 45 Goal cases, the executed familiar task ranked first in 34 cases and in the top three in 43 from an instruction-dependent prefix-KV readout. Replacing that task-conditioned state redirected end-effector motion toward the target object in 109/200 rollouts versus 0/200 controls, but no injected rollout completed the target task.

ECT addresses this failure in supervision. It supplies valid demonstrations with the same instruction but distinguishable scenes requiring different actions, then trains each demonstration with its counterpart in the same update. This is a different counterfactual axis from CAST’s supplied alternative instruction–action branches: ECT holds the instruction fixed while changing the scene and required action. A practical research operation is to test action-changing, same-instruction pairs before trusting aggregate robustness, and to separate gains from adding alternatives from gains attributed to pairing.

In matched LIBERO-PRO π₀.₅ experiments, full ECT raised mean position-swap success from 36% to 59%; the component ablation indicated that added data supplied most of the gain, while paired training was not uniformly helpful. On CALVIN, where counterparts already occur naturally, the paired loss raised five-task completion from 58% to 76% without constructed demonstrations; this was a one-seed result. Under a fixed 400-demonstration UR5e budget, Standard succeeded on 3/40 unseen-position trials, ECT data on 30/40, and the paired method on 35/40.

These results do not establish complete counterfactual generalization: Swap and Task remained below in-distribution performance in every suite. The paired-loss comparison jointly changes counterpart co-presentation, example balance, and shared flow-matching noise/time. Training-seed evidence is limited, especially for CALVIN; the evidence comes from task-specific fine-tuning, not generalist, contact-rich, mobile, or navigation settings. The LIBERO-PRO Environment perturbation was also not evaluated.

Read it to learn how to turn a vague claim of VLA robustness into an action-changing, same-instruction counterfactual test, then distinguish the value of new demonstrations from the value of paired optimization.

[abstract; Section 4.1, S4.SS1.p1; protocol in Appendix E.1, A5.SS1.p2; Section 5.2, S5.SS2.p1; Tables 2 and 4; seed details in Appendix G.3; Appendix K, A11.p1; results in Table 23](https://arxiv.org/abs/2609.39971v1) · [abstract](https://arxiv.org/abs/2508.13446v2)

## RoboJEPA makes latent rollout error a conditional scaling proxy for robot planning

*[RoboJEPA: Scaling Robotic Latent World Models](https://arxiv.org/abs/2610.10515v1)*

V-JEPA 2-AC already reported action-conditioned latent prediction, image-goal CEM planning, and zero-shot real-robot deployment after under 62 hours of DROID interaction video. RoboJEPA shifts the empirical target: rather than only demonstrating deployment, it asks whether predictor compute predicts latent rollout quality and downstream planning.

RoboJEPA trains a JEPA-based latent world model on data spanning 12 robotic embodiments. Its scaling sweep varies the predictor from 22M to 8B parameters while keeping the pretrained V-JEPA 2.1 encoder frozen. The offline metric is per-token latent L1 error averaged over a nine-step rollout on held-out DROID and RoboCasa data. The authors fit candidate compute–error relationships on 22M–2B models and test extrapolation on held-out 4B and 8B checkpoints.

The decisive result is comparative rather than merely correlational: on those held-out checkpoints, the reported second-order power law has lower extrapolation error than a standard power law, BNSL, and UNSL. The authors also report that downstream performance improves with training compute on two short-horizon RoboCasa planning tasks. For longer-horizon obstacle planning, however, the evidence is recipe-dependent: the reported improvement uses a K=10, mixed-resolution cooldown rather than the K=2, 240×320 cooldown, and the paper places its compute-efficiency advantage beyond roughly 10^21 FLOPs. Model size alone is therefore not isolated in that comparison.

On real Franka tasks, the authors report an overall improvement trend with model size, although individual task success rates are not strictly monotonic. These estimates use 30 episodes per model–task combination, and the supplied protocol reports no uncertainty intervals.

The transferable research operation is to fit the offline law only on smaller checkpoints, freeze the representation, data mixture, planner, and evaluation protocol, and then test both latent-error extrapolation and task-level planning on larger held-out models. A useful follow-up question is whether error rank orders planning performance separately by task and horizon, rather than only in aggregate. Interpret the result narrowly: the law concerns a predictor on one fixed pretrained representation; the authors say the fixed-corpus fits are already near data saturation. The tested agent also plans toward a single image goal, uses no text, and uses no learned action proposal.

Read it for a concrete template connecting an offline latent-rollout metric to downstream planning while exposing how a changed long-horizon recipe weakens a model-size-only interpretation.

[abstract; Section 3.1, World Model Scaling Laws; Section 3.1, Table 2 and Results; Section 3.3, Better Scaling for Long Horizon Planning; Section 5, Conclusion; Section 3.4, Real World Robotic Capabilities; Appendix G.2, Table 12; Appendix G.2, Real-robot tasks and evaluation protocol](https://arxiv.org/abs/2610.10515v1) · [Section 3.1; Section 4.1–4.2, Tables 2–3; Appendix B.1–B.2](https://arxiv.org/abs/2506.09985v1)
