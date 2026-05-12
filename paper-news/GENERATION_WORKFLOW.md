# Paper News Generation Workflow

Use this workflow when generating `_paper_news/YYYY-MM-DD.md` from a daily AI paper report.

## Goal

The page should read like a research brief, not a pipeline log. The first screen must answer:

- What is the strongest research signal today?
- Which paper should a researcher open first?
- Why does it matter now?
- What should the reader be skeptical about?

## Required File Path

Create the English issue at:

```text
_paper_news/YYYY-MM-DD.md
```

Create the Chinese issue at:

```text
_paper_news/YYYY-MM-DD-zh.md
```

## Required Front Matter

Every new English issue should use this front matter schema:

```yaml
---
layout: paper-news
title: "Daily AI Paper Report (YYYY-MM-DD)"
date: YYYY-MM-DD
permalink: /paper-news/YYYY-MM-DD/
author_profile: false
brief_title: "Concise information-bearing headline."
brief_dek: "One sentence explaining the main research pattern and why it matters."
lead_paper:
  title: "Paper title"
  url: "https://arxiv.org/abs/..."
  pdf: "https://arxiv.org/pdf/....pdf"
  why: "Why this paper should be opened first."
  skepticism: "The most important limitation or caveat."
  tags:
    - short tag
    - short tag
signals:
  - label: "Signal"
    title: "Short claim."
    text: "Evidence or implication in one sentence."
  - label: "Tension"
    title: "Short tension."
    text: "Why this is unresolved or risky."
  - label: "Bet"
    title: "Short bet."
    text: "What direction seems promising."
top_papers:
  - title: "Paper title"
    url: "https://arxiv.org/abs/..."
    pdf: "https://arxiv.org/pdf/....pdf"
    why: "Why a researcher should spend time on it."
    why_now: "Why this is timely."
    skepticism: "Main caveat."
---
```

## Writing Rules

- `brief_title` should be short and information-bearing. Aim for 3-6 words.
- Avoid vague titles like “What should I read today?” or “Today’s AI paper digest.”
- Good title pattern: “AI reliability gets real.”
- `brief_dek` carries the nuance. Keep it to one sentence.
- `lead_paper.why` should describe the paper’s research value, not its score.
- `lead_paper.skepticism` is mandatory; researchers trust pages that show judgment.
- `signals` should summarize the day’s intellectual structure, not paper categories.
- `top_papers` should contain 3-5 papers. The template currently displays the first 3.
- Keep telemetry such as candidates, selected count, and deepread completion inside the report body, not the front-page headline.

## Body Order

After the front matter, keep the current long report body format:

1. Language link.
2. Optional run stats/details block.
3. `# AI Paper Insight Brief`.
4. Executive takeaways.
5. Key themes.
6. Technical synthesis.
7. Top papers.

The `paper-news` layout renders the structured front matter first, then renders the full Markdown report below it.

## Chinese Pages

Chinese pages can keep the existing `layout: single` until the Chinese brief schema is added. If adding a Chinese structured version, use translated field values and `layout: paper-news`.
