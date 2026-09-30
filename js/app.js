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
    renderAll();
    syncFromHash();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
