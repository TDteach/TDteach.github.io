---
layout: paper-news-index
title: "Paper News"
permalink: /paper-news/
author_profile: false
---

{% assign sorted_items = site.paper_news | sort: "date" | reverse %}
{% assign latest = nil %}
{% for item in sorted_items %}
  {% unless item.url contains '-zh/' or item.url contains '/zh/' %}
    {% assign latest = item %}
    {% break %}
  {% endunless %}
{% endfor %}

{% if latest %}
  {% assign latest_date = latest.date | date: "%Y-%m-%d" %}
  {% assign zh_url_new = "/paper-news/" | append: latest_date | append: "-zh/" %}
  {% assign zh_pages_new = site.paper_news | where: "url", zh_url_new %}
  {% assign zh_url_legacy = "/paper-news/" | append: latest_date | append: "/zh/" %}
  {% assign zh_pages_legacy = site.paper_news | where: "url", zh_url_legacy %}

  <section class="paper-news-index-hero" aria-labelledby="paper-news-index-title">
    <div class="paper-news-index-hero__main">
      <p class="paper-news-kicker">{{ latest.date | date: "%B %-d, %Y" }} Research Brief</p>
      <h1 id="paper-news-index-title">{{ latest.brief_title | default: latest.title }}</h1>
      {% if latest.brief_dek %}
        <p class="paper-news-dek">{{ latest.brief_dek }}</p>
      {% endif %}

      {% if latest.lead_paper %}
        <article class="paper-news-lead-card paper-news-lead-card--compact">
          <div class="paper-news-rank">#1</div>
          <div>
            <h2>Start with: {{ latest.lead_paper.title }}</h2>
            {% if latest.lead_paper.why %}
              <p><strong>Why it catches my eye:</strong> {{ latest.lead_paper.why }}</p>
            {% endif %}
            {% if latest.lead_paper.skepticism %}
              <p><strong>Read skeptically for:</strong> {{ latest.lead_paper.skepticism }}</p>
            {% endif %}
          </div>
        </article>
      {% endif %}

      <div class="paper-news-actions">
        <a class="btn btn--primary" href="{{ latest.url | relative_url }}">Read the brief</a>
        {% if zh_pages_new and zh_pages_new.size > 0 %}
          <a class="btn" href="{{ zh_url_new | relative_url }}">中文版本</a>
        {% elsif zh_pages_legacy and zh_pages_legacy.size > 0 %}
          <a class="btn" href="{{ zh_url_legacy | relative_url }}">中文版本</a>
        {% endif %}
      </div>
    </div>

    {% if latest.signals %}
      <aside class="paper-news-index-hero__side" aria-label="Today's research signals">
        <h2>Today's signals</h2>
        {% for signal in latest.signals limit:3 %}
          <article class="paper-news-mini-signal">
            <b>{{ signal.label }}</b>
            <strong>{{ signal.title }}</strong>
            <span>{{ signal.text }}</span>
          </article>
        {% endfor %}
      </aside>
    {% endif %}
  </section>
{% endif %}

<section class="paper-news-section" aria-labelledby="recent-briefs">
  <div class="paper-news-section__head">
    <div>
      <h2 id="recent-briefs">Recent Briefs</h2>
      <p>Each issue should tell you why the day is worth reopening, not only when it was published.</p>
    </div>
  </div>

  <div class="paper-news-issue-list">
    {% for p in sorted_items %}
      {% unless p.url contains '-zh/' or p.url contains '/zh/' %}
        {% assign d = p.date | date: "%Y-%m-%d" %}
        {% assign zh_url_new = "/paper-news/" | append: d | append: "-zh/" %}
        {% assign zh_pages_new = site.paper_news | where: "url", zh_url_new %}
        {% assign zh_url_legacy = "/paper-news/" | append: d | append: "/zh/" %}
        {% assign zh_pages_legacy = site.paper_news | where: "url", zh_url_legacy %}

        <article class="paper-news-issue-row">
          <time datetime="{{ p.date | date_to_xmlschema }}">{{ p.date | date: "%b %-d" }}</time>
          <div>
            <a href="{{ p.url | relative_url }}"><strong>{{ p.brief_title | default: p.title }}</strong></a>
            {% if p.brief_dek %}
              <span>{{ p.brief_dek }}</span>
            {% elsif p.excerpt %}
              <span>{{ p.excerpt | markdownify | strip_html | truncate: 180 }}</span>
            {% endif %}
          </div>
          <div class="paper-news-languages">
            <a href="{{ p.url | relative_url }}">EN</a>
            {% if zh_pages_new and zh_pages_new.size > 0 %}
              <a href="{{ zh_url_new | relative_url }}">中文</a>
            {% elsif zh_pages_legacy and zh_pages_legacy.size > 0 %}
              <a href="{{ zh_url_legacy | relative_url }}">中文</a>
            {% endif %}
          </div>
        </article>
      {% endunless %}
    {% endfor %}
  </div>
</section>
