---
title: Research
title_ko: 연구
kicker: RESEARCH · 연구
permalink: /research/
wide: true
description: From semantic 3D city models to agentic AI — what we work on and the projects that fund it.
description_ko: 시맨틱 3D 도시 모델부터 에이전틱 AI까지, 연구 분야와 수행 과제를 소개합니다.
---
<section class="section section--tight">
  <div class="wrap">
    {% include section-head.html idx="01" kicker="AREAS" k="research_areas" %}
    <div class="areas">
      {%- for a in site.data.research_areas %}
      <article class="area-card">
        <span class="area-card__icon">{% include icon.html n=a.icon px=28 %}</span>
        <span class="area-card__idx mono">{{ forloop.index | prepend: "0" }}</span>
        <h3>{% include bi.html en=a.title ko=a.title_ko %}</h3>
        <p>{% include bi.html en=a.text ko=a.text_ko %}</p>
        <ul class="kw">{% for k in a.keywords %}<li>{{ k }}</li>{% endfor %}</ul>
      </article>
      {%- endfor %}
    </div>
  </div>
</section>

<section class="section section--alt">
  <div class="blueprint" aria-hidden="true"></div>
  <div class="wrap">
    {% include section-head.html idx="02" kicker="PROJECTS" k="projects" %}
    <ol class="project-timeline">
      {%- for pr in site.data.projects %}
      {%- assign href = pr.page | default: pr.news -%}
      <li class="project-row">
        <div class="project-row__when mono"><span class="status status--{{ pr.status }}">{{ pr.status }}</span>{{ pr.period }}</div>
        <article class="project-row__card">
          <div class="project-row__media scan"><img src="{{ pr.image | relative_url }}" alt="" loading="lazy"></div>
          <div class="project-row__body">
            <h3><a class="stretched" href="{{ href | relative_url }}">{% include bi.html en=pr.title ko=pr.title_ko %}</a></h3>
            <p>{% include bi.html en=pr.summary ko=pr.summary_ko %}</p>
            <p class="mono muted small">{% include bi.html en=pr.program ko=pr.program_ko %} · {{ pr.funder }}</p>
            <ul class="kw">{% for k in pr.tags %}<li>{{ k }}</li>{% endfor %}</ul>
          </div>
        </article>
      </li>
      {%- endfor %}
    </ol>
  </div>
</section>
