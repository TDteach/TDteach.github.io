# 2026-09-30

## Sparse overlap is a first-order determinant of LLM-judge deployment decisions

*[LLM Judge Validation Under Sparse Overlap: From Inference to Design](https://arxiv.org/abs/2609.31857v1)*

## What changes

The paper studies LLM-judge validation when annotation budgets do not permit every item to be multiply labeled. It treats overlap sparsity as two actionable design levers: overlap quantity and allocation. At 5% pairwise overlap, wrong-decision rates reach 25%, and the probability of selecting the wrong best judge among ten candidates is 65%. The experiments validate the analysis on 10 LLM judges across four evaluation matrices.

Under i.i.d. items, a label-independent overlap mask, and fixed rater marginals, Theorem 1 gives Var(F̂_m) = γ_F(π)/m + O(1/m²). The amplification factor depends on prevalence and the agreement estimator. Under label skew, amplification factors for chance-corrected coefficients—Cohen’s kappa and Krippendorff’s alpha—can diverge, while those for observed agreement and AC1 stay bounded. This makes the choice of agreement statistic part of sparse-overlap design rather than a post-hoc reporting detail.

For overlap quantity, Equation (7) and Theorem 2 give m* = ceil(z_(1−α_sig/2)² σ² / δ²), linking the required number of co-annotated items to per-item variance and tolerance under a Gaussian/CLT approximation. The abstract reports that ρ ≥ 0.25 suffices for non-borderline judges, while borderline cases remain fundamentally hard.

Allocation is the second lever. Static stratified shared-overlap sampling, called Strat, substantially reduces bias—often by an order of magnitude—relative to random sparse allocation when the stratification signal correlates with labels. A zero-cost stratified scheme also halves false-rejection rates relative to random sampling when strata are informative. The authors’ practical recipe is observed agreement with Strat, target per-pair overlap ρ ≥ 0.25, use K = 3–5 human raters, and obtain extra overlap for ranking.

A transferable research operation is to preregister overlap quantity and allocation separately: state whether the decision is certification or ranking, set a tolerance, and test whether candidate strata are informative before committing the shared panel. Treat the resulting overlap count as a planning approximation, not an assumption-free guarantee.

## Boundary conditions

The paper states that its results assume i.i.d. items and batched annotation; clustered item difficulty demands cluster-aware stratification. Strat requires informative strata and degrades under extreme skew (π_max &gt; 0.90). The planning rule is stated under a Gaussian/CLT approximation and includes per-item variance σ² as an input.

Read this to decide how many items to double-label and whether informative strata can improve LLM-judge validation under a fixed human-label budget.

[abstract; Theorem 1 (Section 2, displayed equation (2)); Equation (7) (Section 2.4) and Theorem 2 (Section 2); Section 4.3 (S4.SS3.p3) and Table 1 (S4.T1); Conclusion (Section 5, S5.p1); Section 5 (Limitations and future work)](https://arxiv.org/abs/2609.31857v1)

## RADAR makes evidence-conflicting data-analysis operations fail loudly

*[Fail Loudly: An Auditable Runtime for Agentic Data Analysis](https://arxiv.org/abs/2609.32528v1)*

LLM-based data-analysis agents can execute a computation successfully while choosing the wrong data source, scope, or statistical definition, producing a plausible output that does not answer the intended question. RADAR addresses this silent-error mode with an auditable runtime that keeps the agent's analytical choices inspectable and revisable through execution feedback.

During exploration, the runtime retrieves task-relevant content while retaining source locations and observation coverage. Typed operators record the agent's declared inputs, operation arguments, and resulting observations. Runtime validation checks a proposed operation against those observations; on conflict, it rejects the operation or supplies diagnostic feedback so the agent can revise before the error propagates. In the paper's ranking example, preserved input sizes and a missing pairing condition provide grounds to reject an implicit join and request an explicit correspondence.

For an implementer, the transferable unit is therefore a proposed operation plus its evidence contract, not only a final answer. A minimal prototype could log each operation's declared inputs, source locations, and coverage, then test filters and joins only when the required observations exist. A useful experiment is to compare complete enumeration with partial previews: does increased coverage cause more justified interventions, and which checks remain blind? This is a proposed research operation, not a reported result.

On KramaBench, RADAR reports overall scores of 0.723 with full source retrieval and 0.747 with gold sources supplied, corresponding to relative gains of 35.9% and 28.8% over the strongest baselines. Across 1,054 tasks from the three evaluated benchmarks, it reports 405 to 289 counted silent-error cases and 84 to 24 non-deliveries versus DS-STAR. Among substantive deliveries, the silent-error rate falls from 41.8% for DS-STAR to 28.1% for RADAR.

The boundary is important: validation is conditional rather than universal. Each check requires a supported SQL structure and the observations specified by its rule, and is skipped when either requirement is unmet. Observation coverage determines whether an unobserved filter value provides grounds for rejection; partial previews do not provide grounds for rejection. Thus, if exploration does not obtain complete coverage, some silent errors can persist. RADAR's lesson is not that runtime checks replace semantic judgment, but that they expose specific assumptions early enough to revise them.

Read this to learn a concrete pattern for building coverage-aware evidence logs and typed pre-execution checks, while seeing exactly how incomplete evidence limits what the runtime can detect.

[abstract; abstract1.1; S1.p4.1; S1.p5.1; S1.p6.1; S3.SS2.p1.1; S3.SS2.p2.1; S4.SS3.p3.1; S6.p1.1](https://arxiv.org/abs/2609.32528v1)

## SMem Makes Transformer Context Exactly Composable and Deletable by Construction

*[Memory as a cache: Exact context reuse and deletion by construction](https://arxiv.org/abs/2609.32395v1)*

Transformer KV caches entangle every token’s representation with its entire prefix. Exact reuse is therefore limited to shared prefixes, and removing a passage requires recomputing everything after it. SMem changes the representation boundary instead of treating reuse as a cache-policy problem: a block-local encoder maps each block independently to memory rows, and a reader conditions generation on their union through cross-attention.

The architectural payoff is stated as an invariant, not a learned behavior. For every parameter setting, memory composes exactly at fixed block indices, deletion of a b-token block is an exact O(b) update, and the memory state is independent of the edit path. Theorem 1 gives the concrete deletion test: removing a block’s rows yields exactly the state in which that block was never encoded, while remaining blocks keep their indices.

The strongest empirical checks target the promised operating regimes. In the reported FineWeb-Edu planted-needle protocol at 4× training context, SMem reaches exact-match 0.14–0.28 at distances of 31 and 63 blocks; the tested learned-position, RoPE, and Block-Attention-style transformers score at most 0.02. For a fully cached context, the block-skip path runs the reader only on the final block; on the reported H200/L40S, bf16, batch-1 measurements, latency is 3.1–6.2 ms across context lengths and final logits agree up to floating-point error. These are conditional tests: the retrieval result is a controlled needle probe, and the serving result assumes a fully cached context and the stated hardware/path.

Quality is an explicit boundary. Across 160M–1.5B models on FineWeb-Edu, two recipes, and a learning-rate search, SMem’s perplexity gap versus a parameter-matched transformer with the same positional scheme ranges from −4.7% to +2.8%; negative values favor SMem. The paper also states that SMem is a pretraining-time choice, not a retrofit.

A useful replication question is whether exactness, retrieval, and serving gains survive when block size, reader capacity, hardware, and edit patterns change. Test the representation invariant first, then report learned quality and system measurements separately; this keeps a formal cache guarantee from being mistaken for a universal quality or latency guarantee.

Read this paper to study an architectural route to exact context reuse and deletion, then separate its formal memory guarantees from its controlled retrieval, latency, and perplexity trade-offs.

[abstract; §1 (S1.I1.i1.p1); §2 (Thm.1) and Appendix B (A2); §3.2 (S3.SS2.p2) and Appendix J (A10); §3.1 (S3.SS1.p1) and Appendix K (A11.SS0); §6 (S6.p1)](https://arxiv.org/abs/2609.32395v1)

## A Sparse Commit–Abstain Circuit Shows How Early Commitment Can Outrun Late Correction

*[The Commit-Abstain Circuit: Why Language Models Hallucinate Instead of Abstaining](https://arxiv.org/abs/2609.32964v1)*

Existing work largely mitigates hallucination through detection or abstention mechanisms, but leaves open how a model internally arrives at commit or abstain. This paper frames hallucination as unsupported commitment: the model commits despite signals of unanswerability. The paper studies that commit-versus-abstain decision before generation, rather than offering a general account of every wrong answer.

**Method.** The authors define Δ(x) as the top commit-logit minus top abstain-logit, using a manually validated abstention-token set. They decompose this margin into residual-stream contributions from attention heads and MLP sublayers. Adapted causal gating jointly gates those components: a three-phase procedure first optimizes margin separation, then applies retention and removal pressures to identify components whose gates support the decision. The resulting Commit–Abstain Circuit (CAC) is a sparse, causally localised subset of heads and MLP sublayers; the reported median is 5.2% of components.

**Result.** Across ten instruction-tuned LMs (3B–14B) from five families and three benchmarks—KUQ, SQuAD 2.0, and MuSiQue—the authors report a recurring “accumulate-yet-undercorrect” pattern. Commitment-promoting components act earlier and build commitment, while abstention-promoting components appear later as corrective signals that are often too weak to overturn it. This gives a component-level account of unsupported commitment under the paper’s margin and gating definitions. A lightweight policy trained on CAC activations improves decision accuracy by 12.2 points over the model’s intrinsic commit–abstain margin, reduces false abstentions by 2.5 times, transfers to unseen benchmarks, and extends to 27B–35B models.

**Boundary and research use.** The study is restricted to unsupported commitment on unanswerable inputs in instruction-tuned models; it does not address incorrect answers to otherwise answerable questions. The authors also state that both the abstention readout and the CAC are partial operationalisations of the underlying behaviour. Treat the circuit as a testable feature set, not a complete causal inventory. A useful replication is to keep the model and benchmark fixed, compare the intrinsic margin with the CAC-feature policy, and then stress-test whether the early-versus-late contribution pattern survives a new abstention-token set. That experiment directly probes which parts of the result belong to the model’s computation and which belong to the paper’s operational choices.

Read it to learn a concrete workflow for turning a pre-generation commit–abstain margin into a sparse causal feature set and a lightweight policy, while keeping the operational limits explicit.

[abstract](https://arxiv.org/abs/2609.32964v1)

## GiRPO Targets Agent Action Trajectories While Preserving Task Success

*[Trajectory Unlearning on LLM-based Agents](https://arxiv.org/abs/2609.33639v1)*

**The limitation.** Existing LLM unlearning has focused primarily on removing knowledge such as harmful facts, private data, or copyrighted content. Agents introduce a different target: preventing the reproduction of undesired behaviors through action trajectories. The paper calls this trajectory-level unlearning and emphasizes that the target is what the agent does, not what it says. Because trajectories are sequentially dependent, reducing them to isolated prompt-response pairs can lose the inter-step structure that produces the behavior.

Prompt-only unlearning is an inadequate answer in the paper’s tests. Its adaptation of NL was ineffective and brittle: it scaled poorly to multiple trajectories and could be bypassed by prompt attacks. The authors therefore use parameter updates rather than relying on instructions alone.

**The method.** GiRPO changes the policy-optimization data unit. It injects designated forget trajectories into the rollout group as pseudo-rollouts with penalized rewards. Advantage normalization uses statistics from real rollouts only; the pseudo-rollouts are evaluated against those statistics but do not alter them. The forget advantage is also lower-clipped, bounding the magnitude of the negative learning signal when real-rollout reward variance is low. The intended result is a forget update that is additive to, rather than biasing, the normal rollout update.

**The evidence and its condition.** Across ALFWorld and WebShop, GiRPO produced stronger forgetting of target trajectories while preserving task success better than the evaluated knowledge-unlearning baselines. On ALFWorld Clean target tasks, it reduced Exact Match by 32.5% while retaining an 88.4% Success Rate, the paper’s reported best forgetting-versus-utility trade-off among the compared methods.

The utility guarantee is not unconditional. Forget trajectories that fail their task are much easier to remove than complete, successful trajectories. When the trajectory being removed is the only successful path the agent has learned, success falls from 100% to 92.94%. The reported experiments cover ALFWorld and WebShop; generalization to other modalities, richer environments, multi-agent settings, or physical robots is not demonstrated.

**Research operation.** A compact follow-up is to stratify forget data by complete versus incomplete trajectories, apply the same update, and plot Exact Match against Success Rate. The useful question is whether an unlearning update removes one behavioral route while retaining alternatives, or deletes the task capability because the targeted route was the only learned solution.

Read this paper to learn how a policy update can suppress a specific long-horizon action sequence, and how to measure the resulting forgetting-versus-task-success trade-off rather than treating unlearning as knowledge deletion.

[Abstract (abstract1.1); Appendix A.2 (A1.SS2.p6.1); Section 3.2 (S3.SS2.SSS0.Px3.p1.2); Section 3.2 (S3.SS2.SSS0.Px3.p2.2); Abstract and Section 4.2 summary (Abstract; S4.SS2.SSS0.Px1.p1; Tables 2 and 3); Section 4.2 (S4.SS2.SSS0.Px1.p1.1) and Table 2; Section 4.2 (S4.SS2.SSS0.Px2.p2.1); Section 4.2 (S4.SS2.SSS0.Px2.p3.1); Appendix A.6 (A1.SS6.p2.1)](https://arxiv.org/abs/2609.33639v1)
