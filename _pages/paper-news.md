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
  <li>
    <a href="{{ p.url | relative_url }}">{{ p.title }}</a>
    <span style="color:#666; font-size:0.9em;">({{ p.date | date: "%Y-%m-%d" }})</span>
  </li>
{% endfor %}
</ul>
