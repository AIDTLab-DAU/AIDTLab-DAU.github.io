# AI Digital Twin Lab · Dong-A University

Source of **https://aidtlab-dau.github.io** — a Jekyll site built automatically by GitHub Pages on every push to `main`.

Almost everything you will ever need to change is **plain data**, not HTML.

| I want to…                         | Edit                                   |
|------------------------------------|----------------------------------------|
| add / update / graduate a member   | `_data/members.yml` (+ photo in `images/members/<id>.jpg`) |
| add a paper                        | `_data/publications.yml`               |
| post news with photos              | new file in `_news/`                   |
| add a short milestone (no photos)  | `_data/timeline.yml`                   |
| add / update a research project    | `_data/projects.yml` (+ optional page `_pages/research-*.md`) |
| change research-area cards         | `_data/research_areas.yml`             |
| add lecture slides                 | PDF in `lectures/…` + entry in `_data/lectures.yml` |
| change address, recruiting text    | `_data/lab.yml`                        |
| change a menu/button label (EN/KO) | `_data/i18n.yml`                       |

---

## Members

```yaml
- id: abc                 # short unique id
  name: Gil-Dong Hong
  name_ko: 홍길동          # optional
  group: phd              # faculty | phd | ms | undergrad | staff | alumni
  since: Mar 2026
  field: Digital twins, 3D vision
  page: /member/phd/abc   # optional CV page
  links:                  # all optional
    email: abc@dau.ac.kr
    github: https://github.com/abc
    scholar: https://scholar.google.com/citations?user=…
    orcid: https://orcid.org/…
```

- **Photo:** save a portrait as `images/members/abc.jpg` (roughly 480 px wide is plenty). If there's no photo yet, add `photo: default`.
- **Graduating:** change `group: alumni` and add `until: Aug 2027`, optionally with `note: Now at …`.
- **CV page (optional):** copy any file in `_pages/phd/` and set `member: abc` plus a `permalink`. The header (photo, links, dates) comes from `members.yml` automatically, so the page only needs sections such as `# Education`. Empty sections are hidden.

## Publications

```yaml
- type: journal           # journal (international) | domestic | conference
  year: 2027
  title: …
  authors: A, B, C
  venue: Sensors
  details: 27(1), 123
  doi: 10.3390/…
  members: [abc, sukhwanlee]   # member ids → powers the member filter & profile counts
  award: Best Paper Award      # optional
```

## News

Create `_news/YYYY-MM-DD-short-name.md`:

```markdown
---
title: English title
title_ko: 한국어 제목            # optional
date: 2027-03-02
tag: award                      # news | project | event | award | graduation
images: [/images/news/2027-xyz-1.jpg, /images/news/2027-xyz-2.jpg]
links:
  - { kind: article, url: "https://…" }
  - { kind: video,   url: "https://youtube.com/…" }
excerpt: One-sentence summary.
excerpt_ko: 한 문장 요약.
---
Body text in Markdown.
```

The page appears at `/news/2027/short-name/`. Keep photos at most about 1600 px wide and 300 KB each.
For bilingual body text, wrap each language in `<div class="en" markdown="1">…</div>` and `<div class="ko" markdown="1">…</div>`.

## Languages & themes

English is the default. The **EN / 한** button switches the language, and the choice is remembered. Any link can force a language with `?lang=ko`.
Most text fields accept a `_ko` twin (`title_ko`, `field`/`excerpt_ko`, …). Anything without a Korean version falls back to English.
Light and dark themes follow the visitor's system setting and can be toggled with the moon/sun button.

## The 3D hero

The homepage hero renders the **BIM model of the Smart City Lab building** in Eco Delta City as a live wireframe twin. The model is a Revit export (`SMARTCITY LAB (RV2024)_mod_IFC4x3.ifc`), which is kept outside the repo.
The hero uses Three.js r160, loaded from jsDelivr, and the code is in `assets/js/twin.js`.

To regenerate the model, or to swap in another building:

```bash
pip install ifcopenshell numpy pillow
python3 _tools/ifc_to_wire.py "SMARTCITY LAB (RV2024)_mod_IFC4x3.ifc" assets/twin/smartcity-lab.bin   # IFC (BIM)
python3 _tools/citygml_to_wire.py building.gml assets/twin/smartcity-lab.bin                          # or CityGML
python3 _tools/render_poster.py assets/twin/smartcity-lab.bin assets/twin/poster.webp                 # no-WebGL fallback image
```

The IFC converter leaves out foundations, raised-floor pedestals, plumbing and underground drainage. It also keeps the road, curbs and parking within about 42 m of the building as a faint site layer.
Tune these with the constants at the top of `_tools/ifc_to_wire.py`.

## Local preview

```bash
bundle install
bundle exec jekyll serve   # → http://localhost:4000
```

## Layout of the code

```
_config.yml         site settings
_data/              all lab content (see table above)
_news/              news stories
_pages/             Research, Publications, Members, News, Lectures, Contact + CV & project pages
_layouts/           default · page · member · project · news
_includes/          header, footer, cards, icons, i18n helpers (t.html, bi.html)
assets/css/main.css design system (tokens, light/dark, components) — plain CSS, no build step
assets/js/main.js   theme/language toggles, TOC, publication filters, lightbox
assets/js/twin.js   3D digital-twin hero
_tools/             one-off asset scripts (not published)
```
