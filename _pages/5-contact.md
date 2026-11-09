---
title: Contact
title_ko: 연락처
kicker: CONTACT · 연락처
permalink: /contact/
wide: true
image: /images/lab/seunghak-campus.jpg
description: Find us at Dong-A University's Seunghak Campus in Busan — and join the lab.
description_ko: 부산 동아대학교 승학캠퍼스에서 만나요. 연구실 지원 방법도 안내합니다.
---
{%- assign lab = site.data.lab -%}
<div class="wrap">
  <div class="contact">
    <div class="contact__cards">
      {%- for o in lab.offices %}
      <article class="office-card">
        <p class="office-card__room mono">{{ o.room }}</p>
        <h2>{% include bi.html en=o.name ko=o.name_ko %}</h2>
        {%- if o.email %}<p>{% include icon.html n="email" px=16 %} <a href="mailto:{{ o.email }}">{{ o.email }}</a></p>{% endif %}
        {%- if o.phone %}<p>{% include icon.html n="phone" px=16 %} <a href="tel:{{ o.phone | remove: '-' }}">{{ o.phone }}</a></p>{% endif %}
      </article>
      {%- endfor %}
      <p class="contact__address">{% include icon.html n="pin" px=18 %} <span>{% include bi.html en=lab.address ko=lab.address_ko %}</span></p>
    </div>
    <div class="map frame">
      <iframe src="{{ lab.map_embed }}" title="Map — Dong-A University Seunghak Campus" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
    </div>
  </div>

  <section class="join" id="join">
    <div class="blueprint" aria-hidden="true"></div>
    <div class="join__head">
      <p class="kicker"><span class="kicker__idx">→</span>RECRUIT</p>
      <h2 class="section-title">{% include t.html k="join" %}</h2>
      <p class="lead">{% include bi.html en=lab.recruit.intro ko=lab.recruit.intro_ko %}</p>
    </div>
    <div class="join__cols">
      <div class="join__card">
        <h3>{% include t.html k="how_to_apply" %}</h3>
        <ol class="checklist">{% for i in lab.recruit.apply %}<li>{% include bi.html en=i.en ko=i.ko %}</li>{% endfor %}</ol>
        <a class="btn btn--primary" href="mailto:{{ lab.recruit.contact }}?subject=%5BAIDT%20Lab%5D%20Application">{% include icon.html n="email" px=18 %} {{ lab.recruit.contact }}</a>
      </div>
      <div class="join__card">
        <h3>{% include t.html k="support" %}</h3>
        <ul class="checklist checklist--plus">{% for i in lab.recruit.support %}<li>{% include bi.html en=i.en ko=i.ko %}</li>{% endfor %}</ul>
      </div>
    </div>
  </section>

  <section class="campus">
    <h2 class="group-title">{% include t.html k="campus_map" %}</h2>
    <button type="button" class="campus__map frame" data-zoom="{{ '/images/lab/seunghak-map.jpg' | relative_url }}"><img src="{{ '/images/lab/seunghak-map.jpg' | relative_url }}" alt="Seunghak Campus map" loading="lazy"></button>
  </section>
</div>
