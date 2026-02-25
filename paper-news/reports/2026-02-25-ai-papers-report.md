# AI & AI Safety Daily Paper Report
## 2026-02-25

**Generated at**: 2026-02-25 22:59:38
**Paper count**: 1

---

## 1. Research Problems

### Privacy/Security
- LLM-driven agentic systems are increasingly used as trusted copilots for consequential tasks (e.g., email handling, resume screening, healthcare reporting). This creates a security problem that differs from classic online deception: attackers can compromise the agent’s environment, memory, or tools and then leverage the agent as a trusted intermediary to deceive the human user—an Agent-Mediated Deception (AMD) attack. In AMD, the agent may execute a corrupted mission “faithfully,” while the human—primed for collaboration and task completion—fails to notice the deception. The paper argues that prior work has largely focused on agent-centric threats (how to compromise perception/memory/tools) but has not empirically measured the human side: how susceptible users are when their delegated agent becomes the attack vector.  The core problem is therefore human perception and behavior under realistic agent workflows: (1) how often users notice something is wrong, (2) whether they can correctly identify the attack mechanism, (3) what cognitive factors predict susceptibility (including whether domain expertise helps or hurts), and (4) what user-facing defenses (warnings/guardrails) can meaningfully reduce risk without being ignored or backfiring by increasing trust. This matters because agentic systems operate in open, untrusted environments where technical defenses may be imperfect, making the human user an implicit last line of defense; if humans systematically fail to detect AMD, high-stakes delegated actions can lead to harms like biased decisions, privacy leakage, and unauthorized actions. (p. 1–3, Introduction; p. 12, Discussion)

---

## 2. Methods & Approaches

### Privacy/Security
- The paper introduces HAT-Lab (Human-Agent Trust Laboratory), a high-fidelity platform for immersive behavioral experiments with LLM agents. HAT-Lab is designed around principles of realism, generalizability, principled coverage, experimental control, and extensibility (p. 4, Section III-A). The authors propose a Trust Boundary Framework that organizes AMD threats by which implicit user trust boundary is violated: Perception, Memory, or Action (p. 4, Section III-B). They operationalize this framework into nine realistic scenarios (Table I) spanning everyday and professional domains, with five perception attacks via indirect prompt injection, three memory attacks (RAG poisoning, context bleeding, state manipulation), and one action attack (tool-description hijacking / supply-chain style manipulation) (p. 5, Section III-C; Table I; Appendix A p. 15–16).  A large-scale user study is conducted with N=303 participants recruited via Prolific, with eligibility and quality filters described (p. 7, Section IV-B; Appendix K p. 18). The experimental design uses a between-subjects assignment to one of three guardrail conditions—static disclaimer (G1), persistent reminder (G2), interactive alert (G3)—and a within-subjects block design where each participant completes three scenarios (p. 6, Section IV-A; Fig. 3; Fig. 4; Appendix J p. 18). Metrics include baseline attitudes (trust, vigilance, confidence, prior negative experience), in-situ susceptibility (risk perception rate; accurate identification rate), and post-survey measures (severity, trust change, caution change, defense preferences) (p. 7–8, Section IV-D). Statistical tests include Mann–Whitney U and Fisher’s exact test (p. 8, Section IV-D). Platform validation includes attack stimulus reproducibility (ASR), cross-model generalizability (COMET), and user-rated realism/usability (p. 6, Section III-D; Table IX; Fig. 11).

---

## 3. Trends & Insights

### Hot topics
- Privacy/Security (1 papers)

### Technical trends
- Growing focus on agent reliability: process audits, communication pitfalls, and runtime controls.

### Cross-area connections
- Security/privacy is increasingly treated as a systems problem for tool-using agents (mediation layers, auditability, governance signals).
- Cost/latency concerns (reasoning efficiency, CoT compression) intersect with evaluation methodology and deployment constraints.

---

## 4. Top 5 Recommended Papers

Ranked by overall significance and insightfulness (based on available evidence):

### 1. "Are You Sure?": An Empirical Study of Human Perception Vulnerability in LLM-Driven Agentic Systems
**Category**: Privacy/Security
**Importance**: ⭐⭐⭐⭐
**Authors**: Xinfeng Li, Shenyu Dai, Kelong Zheng, Yue Xiao, Gelei Deng, Wei Dong, Xiaofeng Wang
**Link**: http://arxiv.org/abs/2602.21127v1

**Core problem**:
LLM-driven agentic systems are increasingly used as trusted copilots for consequential tasks (e.g., email handling, resume screening, healthcare reporting). This creates a security problem that differs from classic online deception: attackers can compromise the agent’s environment, memory, or tools and then leverage the agent as a trusted intermediary to deceive the human user—an Agent-Mediated Deception (AMD) attack. In AMD, the agent may execute a corrupted mission “faithfully,” while the human—primed for collaboration and task completion—fails to notice the deception. The paper argues that prior work has largely focused on agent-centric threats (how to compromise perception/memory/tools) but has not empirically measured the human side: how susceptible users are when their delegated agent becomes the attack vector.

The core problem is therefore human perception and behavior under realistic agent workflows: (1) how often users notice something is wrong, (2) whether they can correctly identify the attack mechanism, (3) what cognitive factors predict susceptibility (including whether domain expertise helps or hurts), and (4) what user-facing defenses (warnings/guardrails) can meaningfully reduce risk without being ignored or backfiring by increasing trust. This matters because agentic systems operate in open, untrusted environments where technical defenses may be imperfect, making the human user an implicit last line of defense; if humans systematically fail to detect AMD, high-stakes delegated actions can lead to harms like biased decisions, privacy leakage, and unauthorized actions. (p. 1–3, Introduction; p. 12, Discussion)

**Method novelty**:
The paper introduces HAT-Lab (Human-Agent Trust Laboratory), a high-fidelity platform for immersive behavioral experiments with LLM agents. HAT-Lab is designed around principles of realism, generalizability, principled coverage, experimental control, and extensibility (p. 4, Section III-A). The authors propose a Trust Boundary Framework that organizes AMD threats by which implicit user trust boundary is violated: Perception, Memory, or Action (p. 4, Section III-B). They operationalize this framework into nine realistic scenarios (Table I) spanning everyday and professional domains, with five perception attacks via indirect prompt injection, three memory attacks (RAG poisoning, context bleeding, state manipulation), and one action attack (tool-description hijacking / supply-chain style manipulation) (p. 5, Section III-C; Table I; Appendix A p. 15–16).

A large-scale user study is conducted with N=303 participants recruited via Prolific, with eligibility and quality filters described (p. 7, Section IV-B; Appendix K p. 18). The experimental design uses a between-subjects assignment to one of three guardrail conditions—static disclaimer (G1), persistent reminder (G2), interactive alert (G3)—and a within-subjects block design where each participant completes three scenarios (p. 6, Section IV-A; Fig. 3; Fig. 4; Appendix J p. 18). Metrics include baseline attitudes (trust, vigilance, confidence, prior negative experience), in-situ susceptibility (risk perception rate; accurate identification rate), and post-survey measures (severity, trust change, caution change, defense preferences) (p. 7–8, Section IV-D). Statistical tests include Mann–Whitney U and Fisher’s exact test (p. 8, Section IV-D). Platform validation includes attack stimulus reproducibility (ASR), cross-model generalizability (COMET), and user-rated realism/usability (p. 6, Section III-D; Table IX; Fig. 11).

**Key contributions**:
- A large-scale (N=303) empirical measurement of human susceptibility to agent-mediated deception (AMD), including risk perception and accurate identification rates. (p. 1–2, Abstract/Contributions; p. 8, Section V-A)
- HAT-Lab: a high-fidelity, extensible platform plus a Trust Boundary Framework (Perception/Memory/Action) and nine mapped scenarios to study human-centric agent security. (p. 3–5, Section III; Table I)
- Identification of six cognitive failure modes (e.g., task-focused tunneling, partial verification, transparency preference) and a described “cognitive escalation effect,” plus evidence that in-situ cognitive factors correlate with susceptibility. (p. 9–10, Section V-B; Table VII)
- Evaluation of three user-facing guardrails and design principles for defenses emphasizing interruptive warnings and low verification cost (“calibrated friction”), alongside evidence for experiential learning effects. (p. 10–12, Section V-C; Fig. 8–10)

**Results**:
Users show high baseline trust and confidence but low AMD detection. Pre-survey: 97.0% report moderate-to-high trust in AI agents; 96.4% report moderate-to-very-high confidence in identifying risks (Fig. 5, p. 8). In the basic test, only 8.6% perceive risks (p. 8, Finding 2; Table IV). Accurate identification is reported as 2.7% under Guard 1 (static disclaimer) (Fig. 8, p. 11), and the conclusion reiterates that only 2.7% correctly identify AMD (p. 13, Conclusion).

Domain professionals (IT/technical) can be more susceptible: Table IV reports lower perception rates for domain professionals vs general users across guardrails, and highlights code scenarios where domain professionals reach 0.0% and 9.1% perception vs general users 8.1% and 13.5% (Table IV, p. 9; described in Finding 2, p. 8).

Guardrails: visibility and effectiveness increase from G1 to G3. Fig. 8 shows guardrail visibility (G1 24.0%, G2 71.7%, G3 90.0%), risk perception (G1 8.6%, G2 20.0%, G3 25.0%), and accurate identification (G1 2.7%, G2 8.9%, G3 17.2%) (p. 11). Per-scenario breakdown shows varying gains and that accurate identification remains low across scenarios (Fig. 9, p. 11).

Cognitive factors: Table VII reports strong associations between risk perception and in-situ consistency judgments and in-situ trust (both p<.0001), and weaker/unexpected effects for education and age (Table VII, p. 10). A “security mindset” profile is supported by lower baseline trust and higher vigilance among those who perceived attacks (Table V, p. 10), and proactive personal judgment is associated with higher perception rates (Table VI, p. 10).

Experiential learning: users who perceived attacks report increased future caution at high rates (over 90% in G2 and G3 per Fig. 10) (p. 12).

---

## 5. Summary & Outlook

### Today’s highlights
- This report summarizes 1 deep-read analyses.
- Covered categories: Privacy/Security

### Key progress
- Multiple papers target agent reliability and safety governance at the system level (auditing, mediation, telemetry).
- Reasoning cost and evaluation methodology continue to be first-class research topics.

### Future directions
- Combine process-level auditing signals with runtime policies to build deployable 'agent firewall + audit' loops.
- Validate generalization under real tool environments and adversarial conditions; clearly report when evidence is missing.

---

*Report generated at: 2026-02-25 22:59:38*
