---
title: News
title_ko: 소식
kicker: UPDATES · 소식
permalink: /news/
wide: true
description: Awards, projects, events and lab life.
description_ko: 수상, 연구 과제, 행사, 연구실 소식을 전합니다.
---
<div class="wrap">
  <div class="news-layout news-layout--page">
    <div class="news-grid news-grid--page">
      {%- assign all = site.news | sort: "date" | reverse -%}
      {%- for n in all %}{% include news-card.html n=n %}{% endfor %}
    </div>
    <aside class="milestones">
      <h2 class="milestones__title mono">{% include t.html k="milestones" %}</h2>
      <ol class="timeline">
        {%- for e in site.data.timeline %}
        <li class="timeline__item">
          <time class="mono">{{ e.date | date: "%Y.%m.%d" }}</time>
          <p>{% if e.url %}<a href="{{ e.url | relative_url }}">{% endif %}{% include bi.html en=e.en ko=e.ko %}{% if e.url %}</a>{% endif %}</p>
        </li>
        {%- endfor %}
      </ol>
    </aside>
  </div>
</div>
