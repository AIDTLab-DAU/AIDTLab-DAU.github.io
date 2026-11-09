---
title: Lectures
title_ko: 강의
kicker: TEACHING · 강의
permalink: /lecture/
wide: true
description: Course materials from lectures led or managed by the AI Digital Twin Lab.
description_ko: AI 디지털 트윈 연구실이 진행하거나 관리하는 강의 자료입니다.
---
{%- assign L = site.data.lectures -%}
<div class="wrap wrap--mid">
  <p class="note">{% include icon.html n="file" px=18 %} {% include t.html k="lectures_note" %}</p>

  <h2 class="group-title">{% include t.html k="graduate_courses" %}</h2>
  <div class="courses">
    {%- for c in L.graduate %}
    <details class="course"{% if forloop.first %} open{% endif %}>
      <summary><span class="course__idx mono">{{ forloop.index | prepend: "G0" }}</span><span class="course__name">{{ c.course }}</span><span class="course__n mono">{{ c.items.size }} PDF</span></summary>
      <ul class="files">
        {%- for f in c.items %}
        <li><a href="{{ f.file | relative_url | uri_escape }}" target="_blank" rel="noopener">{% include icon.html n="file" px=18 %}<span>{{ f.title }}</span>{% include icon.html n="download" px=16 %}</a></li>
        {%- endfor %}
      </ul>
    </details>
    {%- endfor %}
  </div>

  <h2 class="group-title">{% include t.html k="undergrad_courses" %}</h2>
  <ul class="files files--grid">
    {%- for f in L.undergraduate %}
    <li><a href="{{ f.url }}" target="_blank" rel="noopener">{% include icon.html n="github" px=18 %}<span>{{ f.title }}</span>{% include icon.html n="external" px=16 %}</a></li>
    {%- endfor %}
  </ul>
</div>
