---
title: Publications
title_ko: 논문
kicker: OUTPUT · 연구 성과
permalink: /publication/
wide: true
description: Journal articles and conference papers from the AI Digital Twin Lab.
description_ko: AI 디지털 트윈 연구실의 학술지 및 학술대회 논문입니다.
---
{%- assign P = site.data.publications -%}
{%- assign years = P | map: "year" | uniq | sort | reverse -%}
<div class="wrap">
  <div class="pub-tools" data-pub-tools>
    <div class="seg" role="group" aria-label="Type">
      <button type="button" class="seg__btn is-on" data-type="all">{% include t.html k="all" %} <span class="mono">{{ P.size }}</span></button>
      {%- assign _list_t = "journal,domestic,conference" | split: "," -%}{%- for t in _list_t -%}
      {%- assign tn = P | where: "type", t -%}
      <button type="button" class="seg__btn" data-type="{{ t }}">{% include t.html k=t %} <span class="mono">{{ tn.size }}</span></button>
      {%- endfor -%}
    </div>
    <label class="search">
      {% include icon.html n="search" px=18 %}
      <input type="search" data-pub-search data-ph-en="{{ site.data.i18n.search_pubs.en }}" data-ph-ko="{{ site.data.i18n.search_pubs.ko }}" placeholder="{{ site.data.i18n.search_pubs.en }}" aria-label="Search publications">
    </label>
    <select class="select" data-pub-member aria-label="Filter by member">
      <option value="">{{ site.data.i18n.any_member.en }} / {{ site.data.i18n.any_member.ko }}</option>
      {%- for m in site.data.members -%}
        {%- assign mp = P | where_exp: "p", "p.members contains m.id" -%}
        {%- if mp.size > 0 %}<option value="{{ m.id }}">{{ m.name }} ({{ mp.size }})</option>{% endif -%}
      {%- endfor %}
    </select>
  </div>

  <div class="pub-years" data-pub-list>
    {%- for y in years %}
    <section class="pub-year" data-year-group="{{ y }}">
      <h2 class="pub-year__label mono">{{ y }}</h2>
      <ol class="pub-list">
        {%- assign py = P | where: "year", y -%}
        {%- for p in py %}{% include pub-item.html p=p %}{% endfor %}
      </ol>
    </section>
    {%- endfor %}
    <p class="empty" data-pub-empty hidden>{% include t.html k="no_results" %}</p>
  </div>
</div>
