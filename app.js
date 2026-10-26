/* ============ EASYLEARN ============ */
(function () {
  'use strict';

  var root = document.documentElement;
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var sysDark = window.matchMedia('(prefers-color-scheme: dark)');
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  /* ---------- Strings ---------- */
  // Ukrainian lives in the markup; English overrides it. JS-only strings are in both.
  var EN = {
    nav1: 'Mechanics', nav2: 'Screens', nav3: 'Reader', nav4: 'Formats', nav5: 'Under the hood', navCta: 'Download APK',
    heroTitleA: 'Read every day.', heroTitleB: 'Never fall behind.',
    heroSub: 'Add a textbook or a book, set a daily goal — Easylearn works out the deadline, carries unread pages over to tomorrow and keeps reminding you until the goal is closed.',
    ctaApk: 'Download APK', ctaHow: 'How it works',
    metaOffline: 'Offline, no account', metaLang: 'Ukrainian · English',
    hudLabel: 'Hover the pages', hudGoal: 'Goal', scroll: 'Scroll',
    e1: 'Goals and debt', e1r: 'Try it — drag the bars',
    h1a: 'Unread pages don’t vanish.', h1b: 'They wait for tomorrow.',
    p1: 'Read 18 of 20 — tomorrow’s goal is 22. Read 26 — tomorrow it’s only 14. Days you never opened the course don’t create debt.',
    simTarget: 'Daily goal', pr1: 'Steady week', pr2: 'Slow start', pr3: 'Sprint',
    sRead: 'Read this week', sBal: 'Balance on Monday', sNext: 'Next day’s goal', sDays: 'To finish · 388 pages',
    e2: 'Screens', h2a: 'Three tabs.', h2b: 'Nothing extra.',
    g1: 'Home', g1d: 'A “today” ring, what’s left and the debt. List or thumbnails, sorted by date, title or progress.',
    g2: 'New course', g2d: 'Pages per day or days per course. The preview tells you right away: 388 pages is 20 days.',
    g3: 'Reader', g3d: 'The “Goal: 4 / 20” pill is always in sight. A page counts once you see its end.',
    g4: 'Leaving with debt', g4d: 'Try to leave early and the app tells you honestly how many pages move to tomorrow.',
    g5: 'Goal closed', g5d: 'Hit the limit — confetti. You can’t page further: tomorrow needs something to read too.',
    g6: 'Statistics', g6d: 'Overall and per course: pages read, days spent, pages and days left.',
    g7: 'Course menu', g7d: 'Telegram-style long press: the course shrinks, the background blurs, the menu sits under your finger.',
    g8: 'Settings', g8d: 'Theme, language, reminder time, default reading mode and “Clean up”.',
    e3: 'Reader', e3r: 'PDF with pinch-zoom · text in your font',
    h3a: 'Three modes.', h3b: 'Three themes.',
    p3: 'Set the mode and theme globally or per course — then that course stops following the defaults.',
    m1: 'Book', m1d: 'one swipe, one page, no skipping',
    m2: 'Horizontal', m2d: 'pages in a strip, left to right',
    m3: 'Vertical', m3d: 'continuous scroll down',
    t1: 'Light', t2: 'Sepia', t3: 'Dark', tn0: 'The page as it is in the file.',
    e4: 'Light and dark', e4r: 'Drag the slider', h4a: 'Glass by day.', h4b: 'Glass by night.',
    p4: 'Glassmorphism in two themes. Unless you pick one, theme and language follow the system and change with it.',
    cl: 'Light', cd: 'Dark',
    e5: 'Formats', e5r: 'Original is copied, text extracted once',
    h5a: 'Whatever you were assigned.', h5b: 'In whatever file.',
    p5: 'Several PDFs can be merged into one bundle — shared page numbers, one progress.',
    fx1: 'Page-by-page render, pinch-zoom, bundles of several files',
    fx2: 'Document paragraphs, slide texts in order',
    fx3: 'Chapter order from the spine, navigation files skipped',
    fx4: 'Poems, headings, old Cyrillic in windows-1251, .fb2.zip',
    fx5: 'Paragraphs and headings, LibreOffice slides',
    fx6: 'UTF-8 with latin1 fallback, paginated for your font',
    fx7: 'Tags and control words stripped, paragraphs kept',
    fx8: 'Not supported — and the app says so',
    e6: 'Under the hood',
    sp1: 'servers', sp1d: 'Everything lives in a local SQLite database. No accounts, no internet.',
    sp2: 'strings × 2 languages', sp2d: 'Ukrainian and English UI, language taken from the system.',
    sp3: 'tests', sp3d: 'Debt math, pagination, FB2/EPUB/ODT parsers, 1251 encoding.',
    sp4: 'hours between reminders', sp4d: 'Missed the time — catch-up notifications until 22:00 while goals are open.',
    e7: 'Download', h7a: 'Tomorrow’s goal', h7b: 'depends on today.',
    dlBtn: 'APK for Android', dlSoon: 'Google Play — soon', dlMeta: 'Android 13+ · iOS 15+ planned · free',
    footTag: 'A reader that keeps the books on your pages.', fc1: 'Product', fc2: 'More'
  };
  var JS = {
    uk: {
      days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'],
      debt: 'борг', plus: 'запас', skip: 'пропуск', exact: 'рівно', d: 'дн.',
      goal: 'Ціль', done: 'Ціль закрито', extra: 'Запас',
      skipNote: '// день без читання — боргу не створює',
      notes: ['Звичайна сторінка, як у файлі.', 'Теплий фільтр — менше синього ввечері.', 'Растр: білий → #262626, чорний → білий. Текст: сірий фон, білі букви.']
    },
    en: {
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      debt: 'debt', plus: 'credit', skip: 'skipped', exact: 'exact', d: 'days',
      goal: 'Goal', done: 'Goal closed', extra: 'Credit',
      skipNote: '// a day without reading creates no debt',
      notes: ['The page as it is in the file.', 'A warm filter — less blue in the evening.', 'Raster: white → #262626, black → white. Text: grey background, white letters.']
    }
  };
  var UK = {};
  $$('[data-i18n]').forEach(function (el) {
    var k = el.getAttribute('data-i18n');
    if (!(k in UK)) UK[k] = el.innerHTML;
  });

  var lang = store('el-lang') || ((navigator.language || 'en').toLowerCase().indexOf('uk') === 0 ? 'uk' : 'en');
  var listeners = [];
  function t() { return JS[lang]; }
  function applyLang(code) {
    lang = code === 'uk' ? 'uk' : 'en';
    var dict = lang === 'uk' ? UK : EN;
    $$('[data-i18n]').forEach(function (el) {
      var v = dict[el.getAttribute('data-i18n')];
      if (v !== undefined) el.innerHTML = v;
    });
    root.setAttribute('lang', lang);
    $$('[data-lang]').forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-lang') === lang); });
    listeners.forEach(function (fn) { fn(); });
  }
  $$('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { store('el-lang', b.getAttribute('data-lang')); applyLang(b.getAttribute('data-lang')); });
  });

  /* ---------- Theme ---------- */
  var themeListeners = [];
  function isDark() {
    var forced = root.getAttribute('data-theme');
    return forced ? forced === 'dark' : sysDark.matches;
  }
  $('#themeBtn').addEventListener('click', function () {
    var next = isDark() ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    store('el-theme', next);
    themeListeners.forEach(function (fn) { fn(); });
  });
  if (sysDark.addEventListener) sysDark.addEventListener('change', function () { themeListeners.forEach(function (fn) { fn(); }); });

  /* ---------- Nav ---------- */
  var burger = $('#burger'), mnav = $('#mobileNav');
  burger.addEventListener('click', function () {
    var open = mnav.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
  });
  $$('a', mnav).forEach(function (a) { a.addEventListener('click', function () { mnav.classList.remove('open'); }); });

  var navLinks = $$('.nav-links a');
  if ('IntersectionObserver' in window) {
    var navIO = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navLinks.forEach(function (a) { var s = $(a.getAttribute('href')); if (s) navIO.observe(s); });
  }

  /* ---------- Reveal ---------- */
  $$('[data-reveal-group]').forEach(function (g) {
    $$('[data-reveal]', g).forEach(function (el, i) { el.style.setProperty('--d', (i * 0.06) + 's'); });
  });
  $$('.sec-head, .reader-text, .compare-copy, .dl-body, .hero-content').forEach(function (g) {
    $$(':scope > [data-reveal]', g).forEach(function (el, i) { el.style.setProperty('--d', (i * 0.09) + 's'); });
  });
  var revealCbs = new Map();
  function onReveal(el, fn) { revealCbs.set(el, fn); }
  var revealIO = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add(e.target.matches('.sec, .dl') ? 'drawn' : 'in');
      var cb = revealCbs.get(e.target);
      if (cb) cb();
      revealIO.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }) : null;
  function watchReveal() {
    $$('[data-reveal], .sec, .dl').forEach(function (el) {
      if (revealIO) revealIO.observe(el);
      else { el.classList.add('in', 'drawn'); var cb = revealCbs.get(el); if (cb) cb(); }
    });
  }

  /* ---------- Marquee ---------- */
  var formats = ['PDF', 'DOCX', 'PPTX', 'EPUB', 'FB2', 'ODT', 'ODP', 'TXT', 'MD', 'CSV', 'JSON', 'HTML', 'RTF', 'FB2.ZIP', 'Bundles'];
  var mq = formats.map(function (f) { return '<li class="hud">' + f + '</li>'; }).join('');
  $('#marquee').innerHTML = mq;
  $('#marquee2').innerHTML = mq;

  /* ---------- Wordmark ---------- */
  var wm = $('#wordmark');
  var letters = wm.textContent.split('');
  wm.innerHTML = letters.map(function (c, i) { return '<span class="ch" aria-hidden="true" style="--i:' + i + '">' + c + '</span>'; }).join('');
  var chs = $$('.ch', wm);
  var hero = $('#hero');
  var mouse = { x: -9999, y: -9999, active: false, last: 0 };

  function shapeLetters() {
    if (calm) return;
    chs.forEach(function (ch) {
      var r = ch.getBoundingClientRect();
      var dx = (r.left + r.width / 2) - mouse.x;
      var dy = (r.top + r.height / 2) - mouse.y;
      var d = Math.sqrt(dx * dx + dy * dy);
      var k = mouse.active ? clamp(1 - d / 260, 0, 1) : 0;
      ch.style.fontVariationSettings = '"wdth" ' + (125 - k * 55).toFixed(1) + ', "wght" ' + (800 + k * 100).toFixed(0);
      ch.classList.toggle('hot', k > 0.72);
    });
  }

  /* ---------- Hero canvas: pages that get "read" under the cursor ---------- */
  var canvas = $('#pagesCanvas');
  var ctx = canvas.getContext('2d');
  var cells = [], cols = 0, rows = 0, dpr = 1, W = 0, H = 0;
  var CELL = 30, PW = 9, PH = 12, RADIUS = 64;
  var readCount = 0, GOAL = 20;
  var colors = {};
  var running = false;
  var wander = { x: 0, y: 0, a: Math.random() * 6.28 };

  function readColors() {
    var cs = getComputedStyle(root);
    colors.line = cs.getPropertyValue('--line').trim();
    colors.lineStrong = cs.getPropertyValue('--line-strong').trim();
    colors.accent = cs.getPropertyValue('--accent').trim();
    colors.debt = cs.getPropertyValue('--debt').trim();
  }
  function sizeCanvas() {
    var r = hero.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    CELL = W < 600 ? 24 : 30;
    cols = Math.ceil(W / CELL) + 1; rows = Math.ceil(H / CELL) + 1;
    var old = cells;
    cells = [];
    for (var i = 0; i < cols * rows; i++) cells.push(old[i] || { v: 0, read: false });
    wander.x = W * 0.5; wander.y = H * 0.7;
    draw();
  }
  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    var ox = (W - (cols - 1) * CELL) / 2, oy = (H - (rows - 1) * CELL) / 2;
    ctx.lineWidth = 1;
    for (var y = 0; y < rows; y++) {
      for (var x = 0; x < cols; x++) {
        var c = cells[y * cols + x];
        var px = Math.round(ox + x * CELL - PW / 2) + 0.5, py = Math.round(oy + y * CELL - PH / 2) + 0.5;
        if (c.v > 0.02) {
          ctx.globalAlpha = c.v;
          ctx.fillStyle = colors.accent;
          ctx.fillRect(px - 0.5, py - 0.5, PW + 1, PH + 1);
          ctx.globalAlpha = 1;
        }
        ctx.strokeStyle = c.read ? colors.lineStrong : colors.line;
        ctx.beginPath();
        // a page with a folded corner
        ctx.moveTo(px, py); ctx.lineTo(px + PW - 3, py); ctx.lineTo(px + PW, py + 3);
        ctx.lineTo(px + PW, py + PH); ctx.lineTo(px, py + PH); ctx.closePath();
        ctx.stroke();
      }
    }
  }
  function touch(mx, my, count) {
    var ox = (W - (cols - 1) * CELL) / 2, oy = (H - (rows - 1) * CELL) / 2;
    var x0 = Math.max(0, Math.floor((mx - RADIUS - ox) / CELL)), x1 = Math.min(cols - 1, Math.ceil((mx + RADIUS - ox) / CELL));
    var y0 = Math.max(0, Math.floor((my - RADIUS - oy) / CELL)), y1 = Math.min(rows - 1, Math.ceil((my + RADIUS - oy) / CELL));
    for (var y = y0; y <= y1; y++) {
      for (var x = x0; x <= x1; x++) {
        var dx = ox + x * CELL - mx, dy = oy + y * CELL - my;
        var k = 1 - Math.sqrt(dx * dx + dy * dy) / RADIUS;
        if (k <= 0) continue;
        var c = cells[y * cols + x];
        c.v = Math.max(c.v, Math.min(1, k * 1.6) * (count ? 0.9 : 0.35));
        if (count && k > 0.8 && !c.read) { c.read = true; readCount++; updateHud(); }
      }
    }
  }
  function tick(now) {
    var busy = false;
    if (mouse.active) {
      touch(mouse.x - heroRect.left, mouse.y - heroRect.top, true);
      busy = true;
    } else if (!calm && heroVisible && now - mouse.last > 2500) {
      // idle: a slow invisible reader drifts across the grid
      wander.a += (Math.random() - 0.5) * 0.25;
      wander.x += Math.cos(wander.a) * 1.4; wander.y += Math.sin(wander.a) * 1.4;
      if (wander.x < 40 || wander.x > W - 40) wander.a = Math.PI - wander.a;
      if (wander.y < 40 || wander.y > H - 40) wander.a = -wander.a;
      wander.x = clamp(wander.x, 40, W - 40); wander.y = clamp(wander.y, 40, H - 40);
      touch(wander.x, wander.y, false);
      busy = true;
    }
    for (var i = 0; i < cells.length; i++) {
      var c = cells[i];
      if (c.v > 0) { c.v *= 0.955; if (c.v < 0.02) c.v = 0; else busy = true; }
    }
    draw();
    if (mouse.active) shapeLetters();
    if (busy && heroVisible) requestAnimationFrame(tick);
    else running = false;
  }
  function kick() { if (!running && heroVisible) { running = true; requestAnimationFrame(tick); } }

  var hud = $('.hero-hud'), hudRead = $('#hudRead'), hudBar = $('#hudBar');
  function updateHud() {
    hudRead.textContent = readCount;
    hudBar.style.transform = 'scaleX(' + Math.min(1, readCount / GOAL) + ')';
    var done = readCount >= GOAL;
    hud.classList.toggle('done', done);
    var label = $('.hero-hud-label');
    if (done) label.textContent = readCount > GOAL ? t().extra + ' +' + (readCount - GOAL) : t().done;
    else label.innerHTML = (lang === 'uk' ? UK : EN).hudLabel;
  }
  listeners.push(updateHud);

  var heroRect = hero.getBoundingClientRect();
  var heroVisible = true;
  hero.addEventListener('pointermove', function (e) {
    if (e.pointerType === 'touch') return;
    heroRect = hero.getBoundingClientRect();
    mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true; mouse.last = performance.now();
    kick();
  });
  hero.addEventListener('pointerleave', function () {
    mouse.active = false; mouse.last = performance.now();
    shapeLetters();
  });
  hero.addEventListener('pointerdown', function (e) {
    if (e.pointerType !== 'touch') return;
    heroRect = hero.getBoundingClientRect();
    touch(e.clientX - heroRect.left, e.clientY - heroRect.top, true);
    mouse.last = performance.now();
    kick();
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      heroVisible = es[0].isIntersecting;
      if (heroVisible) { heroRect = hero.getBoundingClientRect(); kick(); }
    }).observe(hero);
  }
  readColors();
  sizeCanvas();
  themeListeners.push(function () { readColors(); draw(); });
  kick();

  /* ---------- Debt simulator ---------- */
  var TOTAL = 388;
  var sim = { target: 20, reads: [18, 22, 26, 0, 10, 24, 20], focus: 4 };
  var chart = $('#simChart'), simBuilt = false, simShown = calm;
  var dayEls = [];

  function computeSim() {
    var bal = 0, out = [];
    sim.reads.forEach(function (r) {
      var dayTarget = Math.max(0, sim.target + bal);
      var before = bal;
      if (r > 0) bal += sim.target - r;
      out.push({ r: r, target: dayTarget, before: before, after: bal });
    });
    return { days: out, bal: bal };
  }
  function buildSim() {
    chart.innerHTML = '';
    dayEls = sim.reads.map(function (_, i) {
      var d = document.createElement('div');
      d.className = 'day';
      d.innerHTML =
        '<div class="day-head"><span class="hud dn"></span><span class="hud faint">D' + (i + 1) + '</span></div>' +
        '<div class="day-plot"><div class="day-target"></div><div class="day-gap"></div><div class="day-read"></div></div>' +
        '<div class="day-foot"><b></b><span class="tag"></span></div>';
      chart.appendChild(d);
      bindDrag(d, i);
      return d;
    });
    simBuilt = true;
  }
  function scaleMax(res) {
    var m = sim.target * 2;
    res.days.forEach(function (d) { m = Math.max(m, d.r, d.target); });
    return m * 1.12;
  }
  var simMax = 40;
  function renderSim() {
    if (!simBuilt) buildSim();
    var res = computeSim();
    if (!dragging) simMax = scaleMax(res);
    var tx = t();
    res.days.forEach(function (d, i) {
      var el = dayEls[i];
      var k = simShown ? 1 : 0;
      var hT = d.target / simMax * 100 * k, hR = d.r / simMax * 100 * k;
      $('.dn', el).textContent = tx.days[i];
      var tg = $('.day-target', el);
      tg.style.height = hT + '%';
      tg.setAttribute('data-v', d.target);
      $('.day-read', el).style.height = hR + '%';
      var gap = $('.day-gap', el);
      var short = d.r > 0 && d.r < d.target;
      gap.style.bottom = hR + '%';
      gap.style.height = short ? (hT - hR) + '%' : '0%';
      gap.style.opacity = short ? 1 : 0;
      el.classList.toggle('over', d.r > 0 && d.r >= d.target);
      $('b', el).textContent = d.r;
      var tag = $('.tag', el);
      if (d.r === 0) { tag.className = 'tag zero'; tag.textContent = tx.skip; }
      else if (d.r < d.target) { tag.className = 'tag debt'; tag.textContent = tx.debt + ' +' + (d.target - d.r); }
      else if (d.r > d.target) { tag.className = 'tag plus'; tag.textContent = tx.plus + ' ' + (d.r - d.target); }
      else { tag.className = 'tag plus'; tag.textContent = tx.exact + ' ✓'; }
    });
    var sum = sim.reads.reduce(function (a, b) { return a + b; }, 0);
    $('#sRead').textContent = sum;
    var sBal = $('#sBal');
    sBal.textContent = res.bal > 0 ? '+' + res.bal : res.bal < 0 ? '−' + Math.abs(res.bal) : '0';
    sBal.className = res.bal > 0 ? 'debt' : res.bal < 0 ? 'plus' : '';
    $('#sNext').textContent = Math.max(0, sim.target + res.bal);
    $('#sDays').textContent = Math.ceil(Math.max(0, TOTAL - sum) / sim.target) + ' ' + tx.d;
    $('#tVal').textContent = sim.target;
    renderCode(res.days[sim.focus], sim.focus);
  }
  function renderCode(d, i) {
    var tx = t();
    var lines = ['<span class="k">// ' + tx.days[i] + '</span>',
      'todayTarget = dailyTarget + balance      = ' + sim.target + ' + ' + fmt(d.before) + ' = <b>' + d.target + '</b>',
      'readToday   = ' + d.r];
    if (d.r > 0) lines.push('balance    += dailyTarget − readToday    = ' + fmt(d.before) + ' + (' + sim.target + ' − ' + d.r + ') = <span class="o">' + fmt(d.after) + '</span>');
    else lines.push('<span class="k">' + tx.skipNote + '</span>');
    $('#simCode').innerHTML = lines.join('\n');
  }
  function fmt(n) { return n < 0 ? '(' + n + ')' : String(n); }

  var dragging = false;
  function bindDrag(el, i) {
    var plot = $('.day-plot', el);
    function set(e) {
      var r = plot.getBoundingClientRect();
      var v = Math.round(clamp((r.bottom - e.clientY) / r.height, 0, 1) * simMax);
      sim.reads[i] = v; sim.focus = i;
      $$('.chip').forEach(function (c) { c.classList.remove('active'); });
      renderSim();
    }
    el.addEventListener('pointerdown', function (e) {
      dragging = true; el.setPointerCapture(e.pointerId); set(e);
    });
    el.addEventListener('pointermove', function (e) { if (dragging && el.hasPointerCapture(e.pointerId)) set(e); });
    function end() { if (!dragging) return; dragging = false; renderSim(); }
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
    el.addEventListener('mouseenter', function () { if (!dragging) { sim.focus = i; renderCode(computeSim().days[i], i); } });
  }
  var presets = {
    steady: [1, 1, 1, 1, 1, 1, 1],
    lazy: [0.4, 0.6, 0, 1.3, 1.5, 1.2, 1],
    sprint: [1.8, 1.6, 0.5, 0, 1.4, 0, 0.8]
  };
  $$('.chip').forEach(function (c) {
    c.addEventListener('click', function () {
      var p = presets[c.getAttribute('data-preset')];
      sim.reads = p.map(function (k) { return Math.round(k * sim.target); });
      $$('.chip').forEach(function (x) { x.classList.toggle('active', x === c); });
      renderSim();
    });
  });
  function step(dv) {
    var ratio = sim.reads.map(function (r) { return r / sim.target; });
    sim.target = clamp(sim.target + dv, 5, 60);
    sim.reads = ratio.map(function (k) { return Math.round(k * sim.target); });
    renderSim();
  }
  $('#tMinus').addEventListener('click', function () { step(-5); });
  $('#tPlus').addEventListener('click', function () { step(5); });
  listeners.push(function () { if (simBuilt) renderSim(); });
  renderSim();
  onReveal($('.sim'), function () { setTimeout(function () { simShown = true; renderSim(); }, 250); });

  /* ---------- Pinned gallery ---------- */
  var gal = $('#screens'), pin = $('.gallery-pin', gal), track = $('#gTrack'), vp = $('.gallery-viewport', gal);
  var shots = $$('.shot', track);
  var gIdx = $('#gIdx'), gBar = $('#gBar');
  $('#gTotal').textContent = String(shots.length).padStart(2, '0');
  var pinned = false, galDist = 0;
  function layoutGallery() {
    pinned = window.innerWidth > 860;
    if (!pinned) { gal.style.height = ''; return; }
    galDist = Math.max(0, track.scrollWidth - vp.clientWidth);
    gal.style.height = (pin.offsetHeight + galDist) + 'px';
    updateGallery();
  }
  function setGalleryProgress(p) {
    var idx = Math.round(p * (shots.length - 1));
    gIdx.textContent = String(idx + 1).padStart(2, '0');
    gBar.style.transform = 'scaleX(' + p + ')';
  }
  function updateGallery() {
    if (!pinned) return;
    var r = gal.getBoundingClientRect();
    var span = gal.offsetHeight - pin.offsetHeight;
    var p = span > 0 ? clamp((-r.top + navH()) / span, 0, 1) : 0;
    track.style.transform = 'translate3d(' + (-p * galDist) + 'px,0,0)';
    setGalleryProgress(p);
  }
  vp.addEventListener('scroll', function () {
    if (pinned) return;
    var max = vp.scrollWidth - vp.clientWidth;
    setGalleryProgress(max > 0 ? vp.scrollLeft / max : 0);
  }, { passive: true });
  function navH() { return $('#nav').offsetHeight; }

  /* ---------- Reader themes ---------- */
  var seg = $('#themeSeg'), segBtns = $$('button', seg), pill = $('.seg-pill', seg);
  var phoneImgs = $$('#readerPhone img'), note = $('#themeNote');
  var shotIdx = 0, autoTheme = null, userPicked = false;
  function pickTheme(i) {
    shotIdx = i;
    segBtns.forEach(function (b, j) { b.classList.toggle('active', j === i); b.setAttribute('aria-selected', String(j === i)); });
    pill.style.transform = 'translateX(' + (i * 100) + '%)';
    phoneImgs.forEach(function (im, j) { im.classList.toggle('on', j === i); });
    note.textContent = t().notes[i];
  }
  segBtns.forEach(function (b, i) {
    b.addEventListener('click', function () { userPicked = true; clearInterval(autoTheme); pickTheme(i); });
  });
  listeners.push(function () { pickTheme(shotIdx); });
  onReveal($('#readerPhone'), function () {
    if (calm) return;
    autoTheme = setInterval(function () { if (!userPicked) pickTheme((shotIdx + 1) % 3); }, 3200);
  });

  /* ---------- Light / dark compare ---------- */
  var cmp = $('#compare'), handle = $('.compare-handle', cmp);
  function setX(p) {
    p = clamp(p, 0, 100);
    cmp.style.setProperty('--x', p + '%');
    handle.setAttribute('aria-valuenow', Math.round(p));
  }
  var cmpDrag = false, cmpTouched = false;
  function cmpFrom(e) { var r = cmp.getBoundingClientRect(); setX((e.clientX - r.left) / r.width * 100); }
  cmp.addEventListener('pointerdown', function (e) { cmpDrag = cmpTouched = true; cmp.setPointerCapture(e.pointerId); cmpFrom(e); });
  cmp.addEventListener('pointermove', function (e) { if (cmpDrag) cmpFrom(e); });
  cmp.addEventListener('pointerup', function () { cmpDrag = false; });
  cmp.addEventListener('pointercancel', function () { cmpDrag = false; });
  handle.addEventListener('keydown', function (e) {
    var cur = parseFloat(handle.getAttribute('aria-valuenow'));
    if (e.key === 'ArrowLeft') { setX(cur - 5); e.preventDefault(); }
    if (e.key === 'ArrowRight') { setX(cur + 5); e.preventDefault(); }
    cmpTouched = true;
  });
  onReveal(cmp, function () {
    if (calm) return;
    var keys = [50, 18, 82, 50], seg = 900, t0 = null;
    function ease(x) { return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
    function frame(ts) {
      if (cmpTouched) return;
      if (t0 === null) t0 = ts;
      var el = (ts - t0) / seg, i = Math.floor(el);
      if (i >= keys.length - 1) { setX(50); return; }
      setX(keys[i] + (keys[i + 1] - keys[i]) * ease(el - i));
      requestAnimationFrame(frame);
    }
    setTimeout(function () { requestAnimationFrame(frame); }, 400);
  });

  /* ---------- Count-up ---------- */
  $$('.spec b[data-count]').forEach(function (el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    el.textContent = calm ? target : 0;
    onReveal(el.parentNode, function () {
      if (calm || !target) return;
      var t0 = null;
      function frame(ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min(1, (ts - t0) / 1400);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    });
  });

  /* ---------- Scroll-linked bits ---------- */
  var dl = $('#download'), mark = $('.dl-mark');
  var ticking = false;
  function onScroll() {
    ticking = false;
    updateGallery();
    var r = dl.getBoundingClientRect();
    var p = clamp(1 - (r.top + r.height * 0.5) / window.innerHeight, 0, 1);
    mark.style.setProperty('--dy', (30 - p * 30).toFixed(1) + '%');
    if (!calm) blobs.style.setProperty('--sy', (-window.scrollY * 0.08).toFixed(1) + 'px');
  }

  /* ---------- Glass blobs: one trails the cursor, the rest drift with scroll ---------- */
  var blobs = $('.blobs'), cursorBlob = $('#blobCursor');
  var bx = window.innerWidth * 0.5, by = window.innerHeight * 0.4, tbx = bx, tby = by, blobRunning = false;
  function blobFrame() {
    bx += (tbx - bx) * 0.06; by += (tby - by) * 0.06;
    cursorBlob.style.setProperty('--bx', bx.toFixed(1) + 'px');
    cursorBlob.style.setProperty('--by', by.toFixed(1) + 'px');
    if (Math.abs(tbx - bx) + Math.abs(tby - by) > 0.5) requestAnimationFrame(blobFrame);
    else blobRunning = false;
  }
  if (!calm) {
    window.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch') return;
      tbx = e.clientX; tby = e.clientY;
      if (!blobRunning) { blobRunning = true; requestAnimationFrame(blobFrame); }
    }, { passive: true });
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  var resizeT;
  window.addEventListener('resize', function () {
    clearTimeout(resizeT);
    resizeT = setTimeout(function () { sizeCanvas(); layoutGallery(); onScroll(); }, 120);
  });
  window.addEventListener('load', function () { layoutGallery(); onScroll(); });

  applyLang(lang);
  watchReveal();
  layoutGallery();
  onScroll();
})();
