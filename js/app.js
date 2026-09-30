(function () {
  'use strict';

  var D = window.DMK;
  var LANGS = ['en', 'ru'];
  var lang = 'en';
  var root = document.documentElement;

  /* ---------- helpers ---------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function ui(key, vars) {
    var s = (D.ui[lang] && D.ui[lang][key]) || D.ui.en[key] || key;
    if (vars) Object.keys(vars).forEach(function (k) { s = s.replace('{' + k + '}', vars[k]); });
    return s;
  }
  function findProject(slug) { return D.projects.filter(function (p) { return p.slug === slug; })[0]; }

  /* ---------- theme ---------- */
  function initTheme() {
    $('#theme-toggle').addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      set('dmk-theme', next);
    });
  }

  /* ---------- language ---------- */
  function detectLang() {
    var saved = get('dmk-lang');
    if (LANGS.indexOf(saved) > -1) return saved;
    return (navigator.language || 'en').toLowerCase().indexOf('ru') === 0 ? 'ru' : 'en';
  }
  function setLang(next) {
    lang = next;
    set('dmk-lang', lang);
    renderAll();
  }
  function applyStatic() {
    root.setAttribute('lang', lang);
    document.title = ui('meta.title');
    var meta = $('meta[name="description"]');
    if (meta) meta.setAttribute('content', ui('meta.desc'));
    $$('[data-i18n]').forEach(function (el) { el.textContent = ui(el.getAttribute('data-i18n')); });
    $$('[data-i18n-aria]').forEach(function (el) { el.setAttribute('aria-label', ui(el.getAttribute('data-i18n-aria'))); });
    $$('[data-lang]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang)); });
  }

  /* ---------- page sections ---------- */
  function renderStripCaps() {
    $$('#strip a').forEach(function (a) {
      var p = findProject(a.getAttribute('href').replace('#project/', ''));
      if (!p) return;
      var cap = $('.strip-cap', a);
      if (!cap) { cap = document.createElement('span'); cap.className = 'strip-cap'; a.appendChild(cap); }
      cap.innerHTML = '<span class="strip-title">' + esc(p.title) + '</span><span class="strip-plat">' + esc(p.platforms.join(', ')) + '</span>';
    });
  }

  /* ---------- carousel (hero strip) ---------- */
  var AUTO_MS = 10000;
  function initCarousel() {
    var box = $('#carousel'), strip = $('#strip');
    var timer = null, hovering = false;
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

    var SETS = 5, HOME_SET = 2; // 5 copies of the strip, the real one in the middle
    var origCount = $$('a', strip).length;
    var period = 0, anchor = 0, settle = null;

    // Build SETS copies of the cards: clones before and after the real ones.
    (function () {
      var real = $$('a', strip).filter(function (a) { return !a.hasAttribute('aria-hidden'); });
      var frag = document.createDocumentFragment();
      for (var s = 0; s < SETS; s++) real.forEach(function (a) {
        if (s === HOME_SET) frag.appendChild(a);
        else { var c = a.cloneNode(true); c.setAttribute('aria-hidden', 'true'); c.setAttribute('tabindex', '-1'); frag.appendChild(c); }
      });
      strip.innerHTML = ''; strip.appendChild(frag);
    })();

    function cards() { return $$('a', strip); }
    function home() { return period * HOME_SET - anchor; }
    function measure() {
      var list = cards();
      period = list[origCount].offsetLeft - list[0].offsetLeft;
      anchor = $('.hero .wrap').getBoundingClientRect().left; // first card lines up with the page column
    }
    function recentre() {
      var h = home(), x = strip.scrollLeft;
      if (x > h + period / 2) strip.scrollLeft = x - period;
      else if (x < h - period / 2) strip.scrollLeft = x + period;
    }
    function goTo(x) { strip.scrollTo({ left: x, behavior: reduce ? 'auto' : 'smooth' }); }
    function step(dir) {
      var list = cards(), cur = strip.scrollLeft, i;
      if (dir > 0) {
        for (i = 0; i < list.length; i++) if (list[i].offsetLeft - anchor > cur + 4) break;
        goTo(list[Math.min(i, list.length - 1)].offsetLeft - anchor);
      } else {
        for (i = list.length - 1; i >= 0; i--) if (list[i].offsetLeft - anchor < cur - 4) break;
        goTo(list[Math.max(i, 0)].offsetLeft - anchor);
      }
    }
    // After any scroll settles, silently jump by one period so the strip never runs out of copies.
    strip.addEventListener('scroll', function () { clearTimeout(settle); settle = setTimeout(recentre, 140); }, { passive: true });
    window.addEventListener('resize', function () { measure(); strip.scrollLeft = home(); });
    measure(); strip.scrollLeft = home();
    function restart() {
      clearInterval(timer);
      if (reduce || hovering) return;
      timer = setInterval(function () { if (!document.hidden) step(1); }, AUTO_MS);
    }

    $('.car-prev', box).addEventListener('click', function () { step(-1); restart(); });
    $('.car-next', box).addEventListener('click', function () { step(1); restart(); });
    box.addEventListener('mouseenter', function () { hovering = true; restart(); });
    box.addEventListener('mouseleave', function () { hovering = false; restart(); });
    strip.addEventListener('touchstart', restart, { passive: true });
    strip.addEventListener('keydown', restart);
    // Shift + wheel already scrolls sideways natively; Ctrl + wheel is mapped to it here.
    var wheelLock = 0;
    strip.addEventListener('wheel', function (e) {
      if (!e.ctrlKey) return;
      e.preventDefault();
      var d = e.deltaY || e.deltaX, now = Date.now();
      if (!d || now - wheelLock < 450) return;
      wheelLock = now;
      step(d > 0 ? 1 : -1); restart();
    }, { passive: false });
    restart();
  }

  function initTileVideos() {
    var tiles = $('#tiles');
    function start(tile) {
      if ($('.tile-video', tile)) return;
      var p = findProject(tile.getAttribute('href').replace('#project/', ''));
      if (!p || !p.video) return;
      var v = document.createElement('video');
      v.className = 'tile-video';
      v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'auto';
      v.style.objectPosition = p.focal || '50% 50%';
      v.src = p.video;
      v.addEventListener('playing', function () { v.classList.add('is-playing'); });
      tile.insertBefore(v, $('img', tile).nextSibling);
      var pr = v.play(); if (pr && pr.catch) pr.catch(function () {});
    }
    function stop(tile) {
      var v = $('.tile-video', tile);
      if (!v) return;
      v.pause(); v.removeAttribute('src'); v.load(); v.remove(); // stop, not pause: next hover starts from 0:00
    }
    tiles.addEventListener('pointerover', function (e) {
      if (e.pointerType !== 'mouse') return;
      var t = e.target.closest('.tile');
      if (t && !t.contains(e.relatedTarget)) start(t);
    });
    tiles.addEventListener('pointerout', function (e) {
      if (e.pointerType !== 'mouse') return;
      var t = e.target.closest('.tile');
      if (t && !t.contains(e.relatedTarget)) stop(t);
    });
  }

  function renderTiles() {
    $('#tiles').innerHTML = D.projects.map(function (p) {
      var c = p[lang];
      return '<a class="tile" data-layout="' + p.layout + '" href="#project/' + p.slug + '">' +
        '<img src="assets/img/' + p.slug + '/' + (p.cover || 1) + '.webp" alt="" loading="lazy" decoding="async" style="object-position:' + (p.focal || '50% 50%') + '">' +
        (p.video ? '<span class="tile-play" aria-hidden="true"></span>' : '') +
        '<span class="tile-cap"><span class="tile-title">' + esc(p.title) + '</span>' +
        '<span class="tile-role">' + esc(c.role) + '</span>' +
        '<span class="tile-plat">' + esc(p.platforms.join(', ')) + '</span></span></a>';
    }).join('');
  }
  function renderSkills() {
    $('#skills-list').innerHTML = D.skills.map(function (s) {
      var c = s[lang];
      return '<div class="skill-row"><dt>' + esc(c.label) + '</dt><dd>' + c.items.map(esc).join(', ') + '</dd></div>';
    }).join('');
  }
  function renderJobs() {
    $('#jobs').innerHTML = D.experience.map(function (j) {
      var c = j[lang];
      return '<details class="job"' + (j.open ? ' open' : '') + '>' +
        '<summary><span class="job-when">' + esc(c.period) + '</span>' +
        '<span><h3 class="job-place">' + esc(j.place) + '</h3><span class="job-role">' + esc(c.role) + '</span></span></summary>' +
        '<div class="job-body"><div><p class="job-sum">' + esc(c.summary) + '</p><ul>' +
        c.points.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></div></div></details>';
    }).join('');
  }

  /* ---------- project dialog ---------- */
  var dlg = $('#project-dialog');
  var body = $('#pd-body');
  var current = null;
  var openedByNavigation = false;

  function stageHTML(p, item) {
    var c = p[lang];
    if (item.type === 'video') {
      var attrs = p.loop ? 'autoplay muted loop playsinline' : 'controls playsinline preload="metadata"';
      return '<video ' + attrs + ' poster="assets/img/' + p.slug + '/' + (p.cover || 1) + '.webp" src="' + p.video + '"></video>';
    }
    return '<img src="assets/img/' + p.slug + '/' + item.n + '.webp" alt="' + esc(p.title + ': ' + ui('pd.shot', { n: item.n })) + '">';
  }
  function itemsFor(p) {
    var items = [];
    if (p.video) items.push({ type: 'video' });
    for (var n = 1; n <= p.shots; n++) items.push({ type: 'img', n: n });
    return items;
  }
  function showItem(p, index) {
    var items = itemsFor(p);
    var stage = $('.pd-stage', body);
    var old = $('video', stage);
    if (old) old.pause();
    stage.innerHTML = stageHTML(p, items[index]);
    $$('.pd-thumb', body).forEach(function (b, i) { b.setAttribute('aria-current', String(i === index)); });
  }
  function row(dt, dd) { return dd ? '<dt>' + esc(dt) + '</dt><dd>' + esc(dd) + '</dd>' : ''; }

  function renderDialog(p) {
    var c = p[lang];
    var items = itemsFor(p);
    var orient = p.layout === 'tall' ? 'tall' : 'wide';
    var idx = D.projects.indexOf(p);
    var prev = D.projects[(idx - 1 + D.projects.length) % D.projects.length];
    var next = D.projects[(idx + 1) % D.projects.length];

    var thumbs = items.map(function (it, i) {
      var src = 'assets/img/' + p.slug + '/' + (it.type === 'video' ? (p.cover || 1) : it.n) + '.webp';
      var label = it.type === 'video' ? ui('pd.video') : ui('pd.shot', { n: it.n });
      return '<button type="button" class="pd-thumb' + (it.type === 'video' ? ' is-video' : '') + '" data-i="' + i + '" aria-label="' + esc(label) + '">' +
        '<img src="' + src + '" alt="" loading="lazy"></button>';
    }).join('');

    body.innerHTML =
      '<div class="pd-media"><div class="pd-stage" data-orient="' + orient + '" style="--ar:' + p.aspect + '"></div>' +
      '<div class="pd-thumbs">' + thumbs + '</div></div>' +
      '<div class="pd-info">' +
        '<h2 class="pd-title" id="pd-title">' + esc(p.title) + '</h2>' +
        '<dl class="pd-meta">' +
          row(ui('pd.platforms'), p.platforms.join(', ')) + row(ui('pd.role'), c.role) +
          row(ui('pd.period'), c.period) + row(ui('pd.status'), c.status) +
        '</dl>' +
        '<p class="pd-summary">' + esc(c.summary) + '</p>' +
        (c.highlights.length ? '<div><h3>' + esc(ui('pd.highlights')) + '</h3><ul class="pd-list">' +
          c.highlights.map(function (h) { return '<li>' + esc(h) + '</li>'; }).join('') + '</ul></div>' : '') +
        '<div><h3>' + esc(ui('pd.stack')) + '</h3><p class="pd-stack">' + p.stack.map(esc).join(', ') + '</p></div>' +
        (p.links.length ? '<p class="pd-links">' + p.links.map(function (l) {
          return '<a href="' + esc(l.href) + '" target="_blank" rel="noopener">' + esc(l.label) + '</a>'; }).join(' &nbsp; ') + '</p>' : '') +
        '<div class="pd-nav"><button type="button" data-go="' + prev.slug + '">' + esc(ui('pd.prev')) + '</button>' +
        '<button type="button" data-go="' + next.slug + '">' + esc(ui('pd.next')) + '</button></div>' +
      '</div>';
    showItem(p, 0);
    var shell = $('.pd-shell', dlg);
    shell.scrollTop = 0;
    var info = $('.pd-info', body); if (info) info.scrollTop = 0;
  }

  function openProject(slug) {
    var p = findProject(slug);
    if (!p) return;
    current = p;
    renderDialog(p);
    if (!dlg.open) dlg.showModal();
  }

  function syncFromHash() {
    var m = location.hash.match(/^#project\/([\w-]+)$/);
    if (m) { openProject(m[1]); }
    else if (dlg.open) { dlg.close(); }
  }

  function initDialog() {
    $('#pd-close').addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('close', function () {
      var v = $('video', dlg); if (v) v.pause();
      current = null;
      if (/^#project\//.test(location.hash)) {
        if (openedByNavigation) { history.back(); }
        else { history.replaceState(null, '', location.pathname + location.search); }
      }
      openedByNavigation = false;
    });
    body.addEventListener('click', function (e) {
      var thumb = e.target.closest('.pd-thumb');
      if (thumb && current) { showItem(current, Number(thumb.getAttribute('data-i'))); return; }
      var go = e.target.closest('[data-go]');
      if (go) { location.replace('#project/' + go.getAttribute('data-go')); }
    });
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#project/"]');
      if (a) openedByNavigation = true;
    });
    window.addEventListener('hashchange', syncFromHash);
  }

  /* ---------- boot ---------- */
  function renderAll() {
    applyStatic();
    renderStripCaps();
    renderTiles();
    renderSkills();
    renderJobs();
    if (current && dlg.open) renderDialog(current);
  }

  function boot() {
    lang = detectLang();
    $$('[data-lang]').forEach(function (b) { b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); }); });
    initTheme();
    initDialog();
    initCarousel();
    initTileVideos();
    renderAll();
    syncFromHash();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
