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
  {%- comment -%}
  Hide Chinese pages in the main list.
  Legacy Chinese permalinks used: /paper-news/YYYY-MM-DD/zh/
  New Chinese permalinks use:     /paper-news/YYYY-MM-DD-zh/
  {%- endcomment -%}
  {% unless p.url contains '-zh/' or p.url contains '/zh/' %}
    {% assign d = p.date | date: "%Y-%m-%d" %}

    {% assign zh_url_new = "/paper-news/" | append: d | append: "-zh/" %}
    {% assign zh_pages_new = site.paper_news | where: "url", zh_url_new %}

    {% assign zh_url_legacy = "/paper-news/" | append: d | append: "/zh/" %}
    {% assign zh_pages_legacy = site.paper_news | where: "url", zh_url_legacy %}

    <li>
      <a href="{{ p.url | relative_url }}">{{ p.title }}</a>
      <span style="color:#666; font-size:0.9em;">({{ p.date | date: "%Y-%m-%d" }})</span>
      {% if zh_pages_new and zh_pages_new.size > 0 %}
        <a href="{{ zh_url_new | relative_url }}" style="margin-left:8px;">[中文]</a>
      {% elsif zh_pages_legacy and zh_pages_legacy.size > 0 %}
        <a href="{{ zh_url_legacy | relative_url }}" style="margin-left:8px;">[中文]</a>
      {% endif %}
    </li>
  {% endunless %}
{% endfor %}
</ul>
