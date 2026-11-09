/* AIDT Lab — site interactions (no dependencies). */
(function () {
  'use strict';
  var root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  var reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Theme ---------- */
  function isDark() {
    var t = root.getAttribute('data-theme');
    if (t) return t === 'dark';
    return window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches;
  }
  $$('[data-theme-toggle]').forEach(function (b) {
    b.addEventListener('click', function () {
      var next = isDark() ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      store.set('aidt-theme', next);
    });
  });

  /* ---------- Language ---------- */
  function applyLang(l) {
    if (l === 'ko') root.setAttribute('data-lang', 'ko'); else root.removeAttribute('data-lang');
    root.setAttribute('lang', l === 'ko' ? 'ko' : 'en');
    $$('[data-ph-en]').forEach(function (el) { el.placeholder = el.getAttribute(l === 'ko' ? 'data-ph-ko' : 'data-ph-en'); });
  }
  applyLang(root.getAttribute('data-lang') === 'ko' ? 'ko' : 'en');
  $$('[data-lang-toggle]').forEach(function (b) {
    b.addEventListener('click', function () {
      var next = root.getAttribute('data-lang') === 'ko' ? 'en' : 'ko';
      applyLang(next); store.set('aidt-lang', next);
      document.dispatchEvent(new CustomEvent('aidt:lang', { detail: next }));
    });
  });

  /* ---------- Header: mobile nav + scrolled state ---------- */
  var header = $('[data-header]');
  var navBtn = $('[data-nav-toggle]');
  if (navBtn) {
    navBtn.addEventListener('click', function () {
      var open = document.body.classList.toggle('nav-open');
      navBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    $$('#site-nav a').forEach(function (a) { a.addEventListener('click', function () { document.body.classList.remove('nav-open'); navBtn.setAttribute('aria-expanded', 'false'); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { document.body.classList.remove('nav-open'); navBtn.setAttribute('aria-expanded', 'false'); } });
  }
  if (header && header.classList.contains('is-overlay')) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 40); };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }

  /* ---------- Prose: hide empty CV sections, build TOC ---------- */
  $$('[data-hide-empty]').forEach(function (prose) {
    $$('h1, h2', prose).forEach(function (h) {
      var n = h.nextElementSibling;
      while (n && n.tagName === 'HR') n = n.nextElementSibling;
      if (!n || /^H[12]$/.test(n.tagName)) h.hidden = true;
    });
  });
  $$('[data-toc]').forEach(function (toc) {
    var prose = $('[data-prose]');
    var list = $('ol', toc);
    if (!prose || !list) return;
    var heads = $$('h1, h2, h3', prose).filter(function (h) { return h.id && !h.hidden && !h.closest('.ko, .en'); });
    var top = heads.filter(function (h) { return h.tagName !== 'H3'; });
    if (top.length < 2) { toc.setAttribute('data-empty', ''); return; }
    var links = [];
    heads.forEach(function (h) {
      if (h.hidden) return;
      var li = document.createElement('li');
      if (h.tagName === 'H3') { if (top.length > 6) return; li.className = 'toc-sub'; }
      var a = document.createElement('a');
      a.href = '#' + h.id; a.textContent = h.textContent.trim();
      li.appendChild(a); list.appendChild(li); links.push([h, a]);
    });
    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (p) { p[1].classList.toggle('is-active', p[0] === e.target); });
      });
    }, { rootMargin: '-80px 0px -70% 0px' });
    links.forEach(function (p) { io.observe(p[0]); });
  });

  /* ---------- Publications: filter + search + cite ---------- */
  var tools = $('[data-pub-tools]');
  if (tools) {
    var state = { type: 'all', q: '', member: '' };
    var params = new URLSearchParams(location.search);
    if (params.get('member')) state.member = params.get('member');
    if (params.get('type')) state.type = params.get('type');
    var search = $('[data-pub-search]', tools), sel = $('[data-pub-member]', tools);
    var pubs = $$('[data-pub-list] .pub');
    pubs.forEach(function (p) { p._text = p.textContent.toLowerCase(); });
    if (sel) sel.value = state.member;
    var render = function () {
      var shown = 0;
      $$('.seg__btn', tools).forEach(function (b) { b.classList.toggle('is-on', b.getAttribute('data-type') === state.type); });
      pubs.forEach(function (p) {
        var ok = (state.type === 'all' || p.getAttribute('data-type') === state.type) &&
          (!state.member || (' ' + p.getAttribute('data-members') + ' ').indexOf(' ' + state.member + ' ') > -1) &&
          (!state.q || p._text.indexOf(state.q) > -1);
        p.hidden = !ok; if (ok) shown++;
      });
      $$('[data-year-group]').forEach(function (g) { g.hidden = !$$('.pub', g).some(function (p) { return !p.hidden; }); });
      var empty = $('[data-pub-empty]'); if (empty) empty.hidden = shown > 0;
      var u = new URL(location.href);
      ['member', 'type'].forEach(function (k) { var v = state[k]; if (v && v !== 'all') u.searchParams.set(k, v); else u.searchParams.delete(k); });
      history.replaceState(null, '', u);
    };
    $$('.seg__btn', tools).forEach(function (b) { b.addEventListener('click', function () { state.type = b.getAttribute('data-type'); render(); }); });
    if (search) search.addEventListener('input', function () { state.q = search.value.trim().toLowerCase(); render(); });
    if (sel) sel.addEventListener('change', function () { state.member = sel.value; render(); });
    render();
  }
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-cite]');
    if (!btn) return;
    var text = btn.getAttribute('data-cite');
    var done = function () {
      var lab = $('.cite-label', btn); if (!lab) return;
      var old = lab.innerHTML;
      lab.innerHTML = '<span class="en">Copied!</span><span class="ko" lang="ko">복사됨!</span>';
      setTimeout(function () { lab.innerHTML = old; }, 1600);
    };
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () { window.prompt('Copy citation:', text); });
    else window.prompt('Copy citation:', text);
  });

  /* ---------- Lightbox ---------- */
  var lb = $('[data-lightbox]');
  if (lb) {
    var lbImg = $('img', lb);
    var close = function () { lb.hidden = true; lbImg.removeAttribute('src'); document.body.style.overflow = ''; };
    document.addEventListener('click', function (e) {
      var z = e.target.closest('[data-zoom]');
      if (z) {
        e.preventDefault();
        var src = z.getAttribute('data-zoom') || (z.tagName === 'IMG' ? z.currentSrc || z.src : ($('img', z) || {}).src);
        if (!src) return;
        lbImg.src = src; lbImg.alt = (z.getAttribute('alt') || ''); lb.hidden = false; document.body.style.overflow = 'hidden';
        return;
      }
      if (!lb.hidden && (e.target === lb || e.target.closest('[data-lightbox-close]') || e.target === lbImg)) close();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !lb.hidden) close(); });
  }

  /* ---------- Carousel autoplay ---------- */
  $$('[data-carousel]').forEach(function (c) {
    if (reduceMotion || c.children.length < 2) return;
    var i = 0, paused = false;
    c.addEventListener('pointerenter', function () { paused = true; });
    c.addEventListener('pointerleave', function () { paused = false; });
    setInterval(function () {
      if (paused || document.hidden) return;
      i = (i + 1) % c.children.length;
      c.scrollTo({ left: c.clientWidth * i, behavior: 'smooth' });
    }, 5000);
  });

  /* ---------- Reveal on scroll + count-up ---------- */
  if ('IntersectionObserver' in window && !reduceMotion) {
    var items = $$('.area-card, .project-card, .news-card, .member-card, .faculty-card, .project-row, .pub-list--compact .pub, .stat, .office-card, .join__card');
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var sibs = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
        el.style.transitionDelay = Math.min(sibs, 6) * 60 + 'ms';
        el.classList.add('is-in'); rio.unobserve(el);
        var num = el.querySelector && el.querySelector('[data-count]');
        if (num) countUp(num);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) {
      if (el.getBoundingClientRect().top < innerHeight) return; // already visible: leave as-is
      el.classList.add('reveal'); rio.observe(el);
    });
  }
  function countUp(el) {
    var to = +el.getAttribute('data-count'), t0 = null;
    var step = function (t) { if (!t0) t0 = t; var k = Math.min(1, (t - t0) / 900); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }
})();
