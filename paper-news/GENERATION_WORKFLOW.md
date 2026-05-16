# Paper News Generation Workflow

Use this workflow when generating `_paper_news/YYYY-MM-DD.md` from a daily AI paper report.

## Goal

The page should read like a research brief, not a pipeline log. The first screen must answer:

- What is the shortest useful headline for today's research movement?
- What are the 3 focus areas a researcher can understand at a glance?
- Which paper should a researcher open first?
- What is the biggest shift or warning from today's papers?

The generated Markdown has two jobs:

1. Preserve the full daily report body for deep reading.
2. Add structured front matter that the Jekyll layouts use to create the visual top section on `/paper-news/` and `/paper-news/YYYY-MM-DD/`.

## Current Layout Contract

The current site uses these files:

- `_pages/paper-news.md`: the index page at `/paper-news/`.
- `_layouts/paper-news-index.html`: removes the default page title so the research brief is the first visual element.
- `_layouts/paper-news.html`: renders an individual daily issue.
- `assets/css/main.scss`: styles the researcher-focused paper-news components.

The index page uses the latest English issue's front matter:

- `brief_title` and `brief_dek` become the main headline.
- `themes[0..2]` become the three focus cards under the headline.
- `lead_paper` becomes the `Best first paper` item in `Start here`.
- `top_papers[1]` becomes `Also worth opening`.
- `signals[0]` becomes `Biggest shift`.
- `brief_dek` is also used in the recent-issues list.

The daily issue page uses:

- `brief_title`, `brief_dek`
- `takeaways`
- `themes`
- `lead_paper`
- `signals`
- `top_papers`

If any field is missing, the page will still build, but the top section will feel empty. Do not omit required fields.

## Extraction Recipe From The Raw Daily Report

Start from the raw daily report body, usually containing:

- `Executive takeaways`
- `Key themes (clusters)`
- `Technical synthesis`
- `Top 5 papers`
- selected-paper table with arXiv IDs, scores, reasons, and tags

Generate the structured front matter as follows:

### `brief_title`

Extract the dominant movement across the day. Use 3-6 words. It should be a claim, not a label.

Good:

- `AI reliability gets real.`
- `Agent evaluation gets harder.`
- `Robustness moves downstream.`

Bad:

- `Daily AI Paper Report`
- `Today’s AI Papers`
- `What should I read?`

### `brief_dek`

Condense the top 2-3 executive takeaways into one sentence. It should explain why the title is true.

### `themes`

Create exactly 3 themes from `Key themes (clusters)` or the strongest recurring ideas in `Executive takeaways`.

Each theme must be short enough for a card:

- `title`: 2-4 words.
- `text`: one concrete sentence, preferably under 22 words.

The index page labels these cards as:

- `Why it matters`
- `What changed`
- `What to watch`

So order the themes accordingly:

1. The most important implication.
2. The clearest shift from prior expectations.
3. The thing to monitor next.

### `takeaways`

Create exactly 3 high-level conclusions from `Executive takeaways`. These can be longer than theme card text because they are shown on the daily issue page, not the compact index hero.

### `lead_paper`

Choose the paper a researcher should open first. Do not pick purely by score. Prefer a paper with:

- a reusable method,
- a surprising result,
- strong deployment relevance,
- a claim likely to be cited,
- or a useful limitation.

Fill:

- `title`
- `url`
- `pdf`
- `why`: one sentence explaining why this paper should be opened first.
- `skepticism`: one sentence with the main caveat.
- `tags`: 2-4 short tags.

### `top_papers`

Create 3-5 entries from the `Top 5 papers` section. The first item should normally match `lead_paper`.

For each:

- `why`: why a researcher should spend time on it.
- `why_now`: why it is timely now.
- `skepticism`: what could limit the claim.

The index page uses `top_papers[1]` as `Also worth opening`, so make the second paper genuinely complementary to the first.

### `signals`

Create exactly 3 signals. These are not topics; they are research movements, warnings, or method patterns.

The index page only shows `signals[0]` as `Biggest shift`, so put the strongest signal first.

Each signal:

- `label`: concrete category, not generic wording.
- `title`: specific claim a researcher can agree or disagree with.
- `text`: concrete evidence from the day’s papers.

Good labels:

- `Evaluation shift`
- `Agent pattern`
- `Robustness bet`
- `Safety warning`
- `Deployment gap`
- `Method pattern`

Avoid labels like:

- `Signal`
- `Tension`
- `Bet`
- `Theme`
- `Insight`

## Length Budget For The Visual Top Section

The front matter controls a compact visual layout. Keep it tight:

- `brief_title`: 3-6 words.
- `brief_dek`: 18-35 words.
- `themes.*.title`: 2-4 words.
- `themes.*.text`: under 22 words.
- `signals.*.title`: under 9 words.
- `signals.*.text`: under 28 words.
- `lead_paper.why`: under 30 words.
- `lead_paper.skepticism`: under 26 words.

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
takeaways:
  - "Most important research-level conclusion."
  - "Second important conclusion."
  - "Third important conclusion."
themes:
  - title: "Short theme name"
    text: "One sentence explaining the theme."
  - title: "Short theme name"
    text: "One sentence explaining the theme."
  - title: "Short theme name"
    text: "One sentence explaining the theme."
signals:
  - label: "Concrete category"
    title: "Specific research claim."
    text: "Concrete evidence or implication in one sentence."
  - label: "Concrete category"
    title: "Specific research claim."
    text: "Concrete evidence or implication in one sentence."
  - label: "Concrete category"
    title: "Specific research claim."
    text: "Concrete evidence or implication in one sentence."
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
- `takeaways` is mandatory. Use 3 high-level conclusions from the executive takeaways.
- `themes` is mandatory. Use 3 theme cards that summarize the day’s intellectual clusters.
- `signals` should summarize the day’s intellectual structure, not paper categories.
- Avoid generic signal labels such as `Signal`, `Tension`, `Bet`, `Theme`, or `Insight`.
- Use concrete labels that name the actual research movement, such as `Evaluation shift`, `Agent pattern`, `Robustness bet`, `Safety warning`, `Deployment gap`, or `Method pattern`.
- Each signal title should make a specific claim a researcher can agree or disagree with.
- Each signal text should mention concrete evidence from the day’s papers, not abstract phrasing.
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

## Generation Checklist

Before saving the file, verify:

- The front matter is valid YAML.
- `layout` is `paper-news`.
- `brief_title` is not the same as `title`.
- `themes` has exactly 3 entries and each entry is visually short.
- `takeaways` has exactly 3 entries.
- `signals` has exactly 3 entries and `signals[0]` is the strongest because it appears on the index page.
- `lead_paper` is not selected only by score; it is selected for research value.
- `top_papers` has at least 3 entries and `top_papers[1]` is a good companion paper.
- The report body still includes the full detailed analysis after the front matter.
- Pipeline telemetry stays in the body, not in `brief_title`, `brief_dek`, `themes`, or `signals`.

## Chinese Pages

Chinese pages can keep the existing `layout: single` until the Chinese brief schema is added. If adding a Chinese structured version, use translated field values and `layout: paper-news`.
