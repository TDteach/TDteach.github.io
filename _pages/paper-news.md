---
layout: paper-news-index
title: "Paper News"
permalink: /paper-news/
lang: zh-CN
author_profile: false
---

{% assign sorted_items = site.paper_news | sort: 'date' | reverse %}
{% assign latest = nil %}
{% for item in sorted_items %}
  {% unless item.url contains '-zh/' or item.url contains '/zh/' %}{% assign latest = item %}{% break %}{% endunless %}
{% endfor %}

{% if latest %}
{% assign latest_date = latest.date | date: '%Y-%m-%d' %}
{% assign latest_zh_url = '/paper-news/' | append: latest_date | append: '-zh/' %}
{% assign latest_zh = site.paper_news | where: 'url', latest_zh_url | first %}
{% unless latest_zh %}
  {% assign latest_zh_url = '/paper-news/' | append: latest_date | append: '/zh/' %}
  {% assign latest_zh = site.paper_news | where: 'url', latest_zh_url | first %}
{% endunless %}
{% assign featured = latest_zh | default: latest %}
{% assign home_papers = featured.article_index | default: featured.top_papers %}
{% assign lead = home_papers | first %}
{% capture lead_url %}{{ featured.url | relative_url }}{% if lead.paper_id %}#paper-{{ lead.paper_id | replace: '/', '-' | escape }}{% endif %}{% endcapture %}
<section class="pn-home-issue" aria-labelledby="latest-headline">
  <header class="pn-home-lead" data-paper-id="{{ lead.paper_id | escape }}">
    <p class="pn-home-date"><time datetime="{{ latest_date }}">{{ latest_date | date: '%Y年%m月%d日' }}</time></p>
    <h1 id="latest-headline"><a href="{{ lead_url }}">{{ lead.headline | default: lead.title | default: featured.brief_title | escape }}</a></h1>
    {% if lead.paper_title %}<p class="pn-home-original"><a href="{{ lead_url }}">{{ lead.paper_title | escape }}</a></p>{% endif %}
    {% if lead.opening_html %}<div class="pn-home-opening">{{ lead.opening_html }}</div>{% endif %}
    <div class="pn-home-actions">
      <a class="pn-home-button" href="{{ lead_url }}">{% if latest_zh %}阅读全文{% else %}Read article{% endif %} →</a>
      {% if latest_zh %}<a class="pn-home-language" href="{{ latest.url | relative_url }}" lang="en" hreflang="en">English</a>{% endif %}
    </div>
  </header>
  {% if home_papers.size > 1 %}
  <div class="pn-home-grid">
    {% for paper in home_papers offset:1 %}
    {% capture article_url %}{{ featured.url | relative_url }}{% if paper.paper_id %}#paper-{{ paper.paper_id | replace: '/', '-' | escape }}{% endif %}{% endcapture %}
    <article class="pn-home-card" data-paper-id="{{ paper.paper_id | escape }}">
      {% if paper.paper_id %}<span class="pn-home-badge">arXiv · {{ paper.paper_id | escape }}</span>{% endif %}
      <h2><a href="{{ article_url }}">{{ paper.headline | default: paper.title | escape }}</a></h2>
      {% if paper.paper_title %}<p class="pn-home-original"><a href="{{ article_url }}">{{ paper.paper_title | escape }}</a></p>{% endif %}
      {% if paper.opening_html %}<div class="pn-home-opening">{{ paper.opening_html }}</div>{% endif %}
      <a class="pn-home-card-link" href="{{ article_url }}">{% if latest_zh %}阅读全文{% else %}Read article{% endif %} →</a>
    </article>
    {% endfor %}
  </div>
  {% endif %}
</section>

{% endif %}

<section id="archive" class="pn-archive" data-pn-archive aria-labelledby="archive-title">
  <header class="pn-archive-header">
    <h2 id="archive-title">往期</h2>
    <label class="pn-search"><input type="search" data-pn-search placeholder="检索日期或标题" aria-label="检索日期或标题" autocomplete="off"></label>
  </header>
  {% assign previous_month = '' %}
  {% for p in sorted_items %}
    {% unless p.url contains '-zh/' or p.url contains '/zh/' %}
      {% assign d = p.date | date: '%Y-%m-%d' %}
      {% if d == latest_date %}{% continue %}{% endif %}
      {% assign month = p.date | date: '%Y-%m' %}
      {% assign zh_url = '/paper-news/' | append: d | append: '-zh/' %}
      {% assign zh_page = site.paper_news | where: 'url', zh_url | first %}
      {% unless zh_page %}
        {% assign zh_url = '/paper-news/' | append: d | append: '/zh/' %}
        {% assign zh_page = site.paper_news | where: 'url', zh_url | first %}
      {% endunless %}
      {% assign display_issue = zh_page | default: p %}
      {% assign archive_title = display_issue.brief_title %}
      {% if archive_title contains 'AI 论文日报' or archive_title contains 'Daily AI' %}{% assign archive_title = nil %}{% endif %}
      {% unless archive_title %}{% assign archive_title = display_issue.top_papers.first.title %}{% endunless %}
      {% if month != previous_month %}
        {% unless previous_month == '' %}</ol></details>{% endunless %}
        <details class="pn-archive-month"{% if previous_month == '' %} open{% endif %}>
          <summary>{{ p.date | date: '%Y · %m' }}</summary><ol>
        {% assign previous_month = month %}
      {% endif %}
      <li class="pn-archive-row" data-search="{{ d }} {{ d | remove: '-' }} {{ display_issue.brief_title | escape }} {{ p.brief_title | escape }} {% for paper in display_issue.article_index %}{{ paper.paper_id | escape }} {{ paper.headline | escape }} {{ paper.paper_title | escape }} {% endfor %}">
        <a href="{{ display_issue.url | relative_url }}"><time datetime="{{ d }}">{{ p.date | date: '%m.%d' }}</time></a>
        {% if archive_title %}<a class="pn-archive-title" href="{{ display_issue.url | relative_url }}">{{ archive_title | escape }}</a>{% else %}<span></span>{% endif %}
        <span class="pn-languages">{% if zh_page %}<a href="{{ zh_page.url | relative_url }}" hreflang="zh-CN">中文</a>{% endif %}<a href="{{ p.url | relative_url }}" hreflang="en">EN</a></span>
      </li>
    {% endunless %}
  {% endfor %}
  {% unless previous_month == '' %}</ol></details>{% endunless %}
  <p class="pn-archive-empty" data-pn-empty role="status" hidden>没有匹配的期次。</p>
</section>
