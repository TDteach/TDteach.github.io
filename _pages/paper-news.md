---
layout: single
title: "Paper News"
permalink: /paper-news/
author_profile: true
---

这里展示我每天自动整理的 AI / AI Safety 论文日报。

<ul>
{% assign items = site.paper_news | sort: "date" | reverse %}
{% for p in items %}
  {% unless p.url contains '-zh/' %}
    {% assign d = p.date | date: "%Y-%m-%d" %}
    {% assign zh_url = "/paper-news/" | append: d | append: "-zh/" %}
    {% assign zh_pages = site.paper_news | where: "url", zh_url %}
    <li>
      <a href="{{ p.url | relative_url }}">{{ p.title }}</a>
      <span style="color:#666; font-size:0.9em;">({{ p.date | date: "%Y-%m-%d" }})</span>
      {% if zh_pages and zh_pages.size > 0 %}
        <a href="{{ zh_url | relative_url }}" style="margin-left:8px;">[中文]</a>
      {% endif %}
    </li>
  {% endunless %}
{% endfor %}
</ul>
