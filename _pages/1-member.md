---
title: Members
title_ko: 구성원
kicker: PEOPLE · 구성원
permalink: /member/
wide: true
description: The people of the AI Digital Twin Lab — faculty, graduate students, undergraduate researchers and alumni.
description_ko: AI 디지털 트윈 연구실의 교수진, 대학원생, 학부 연구생, 졸업생을 소개합니다.
---
{%- assign M = site.data.members -%}
<div class="wrap">
  <nav class="jump mono" aria-label="Groups">
    {%- assign _list_g = "faculty,phd,ms,undergrad,staff,alumni" | split: "," -%}{%- for g in _list_g -%}
    {%- assign gm = M | where: "group", g -%}
    <a href="#{{ g }}">{% include t.html k=g %} <span class="jump__n">{{ gm.size }}</span></a>
    {%- endfor -%}
  </nav>

  <section class="member-group" id="faculty">
    <h2 class="group-title">{% include t.html k="faculty" %}</h2>
    <div class="faculty">
      {%- assign fac = M | where: "group", "faculty" -%}
      {%- for m in fac %}
      <article class="faculty-card">
        <div class="faculty-card__photo scan">{% include member-photo.html m=m %}</div>
        <div class="faculty-card__body">
          <h3><a href="{{ m.page | relative_url }}">{{ m.name }}</a>{% if m.name_ko %} <span lang="ko" class="muted">{{ m.name_ko }}</span>{% endif %}</h3>
          <p class="faculty-card__title">{% include bi.html en=m.title ko=m.title_ko %}</p>
          <p class="faculty-card__field mono">{{ m.field }}</p>
          <p class="faculty-card__bio">{{ m.bio | truncatewords: 70 }}</p>
          <div class="faculty-card__foot">
            {% include member-links.html links=m.links px=16 %}
            <a class="link-arrow" href="{{ m.page | relative_url }}">{% include t.html k="profile" %} {% include icon.html n="arrow" px=16 %}</a>
          </div>
        </div>
      </article>
      {%- endfor %}
    </div>
  </section>

  {%- assign _list_g = "phd,ms,undergrad,staff" | split: "," %}{%- for g in _list_g %}
  {%- assign gm = M | where: "group", g -%}
  {%- if gm.size > 0 %}
  <section class="member-group" id="{{ g }}">
    <h2 class="group-title">{% include t.html k=g %}</h2>
    <div class="member-grid{% if g == 'undergrad' or g == 'staff' %} member-grid--small{% endif %}">
      {%- for m in gm %}{% include member-card.html m=m %}{% endfor %}
    </div>
  </section>
  {%- endif %}
  {%- endfor %}

  <section class="member-group" id="alumni">
    <h2 class="group-title">{% include t.html k="alumni" %}</h2>
    <ul class="alumni">
      {%- assign al = M | where: "group", "alumni" -%}
      {%- for m in al %}
      <li class="alumni__item">
        <span class="alumni__photo">{% include member-photo.html m=m %}</span>
        <span class="alumni__body">
          <span><strong>{% if m.page %}<a href="{{ m.page | relative_url }}">{{ m.name }}</a>{% else %}{{ m.name }}{% endif %}</strong>{% if m.name_ko %} <span lang="ko" class="muted">{{ m.name_ko }}</span>{% endif %}</span>
          <small>{{ m.title }}{% if m.since %} · <span class="mono">{{ m.since }}{% if m.until %} – {{ m.until }}{% endif %}</span>{% endif %}{% if m.field %} · {{ m.field }}{% endif %}</small>
          {%- if m.note %}<small class="alumni__note">→ {% include bi.html en=m.note ko=m.note_ko %}</small>{% endif %}
        </span>
      </li>
      {%- endfor %}
    </ul>
  </section>
</div>
