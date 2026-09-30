/* ============================================================
   GIENETIC — Portfolio interactions
   ============================================================ */
(function () {
  'use strict';

  /* ---------- CLOCK (status bar) ---------- */
  var clock = document.getElementById('clock');
  function tick() {
    if (!clock) return;
    var d = new Date();
    clock.textContent = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  }
  tick();
  setInterval(tick, 1000);

  /* ---------- BATTERY ---------- */
  var fill = document.getElementById('batteryFill');
  var pct = document.getElementById('batteryPct');
  function setBattery(level, charging) {
    var p = Math.max(0, Math.min(100, Math.round(level * 100)));
    if (fill) fill.style.width = p + '%';
    if (pct) pct.textContent = p + '%';
    if (fill) {
      fill.style.background = charging
        ? 'linear-gradient(90deg, #FFD60A, #30D158)'
        : p <= 20
          ? 'linear-gradient(90deg, #FF453A, #FF6961)'
          : 'linear-gradient(90deg, #30D158, #34C759)';
    }
  }
  if (navigator.getBattery) {
    navigator.getBattery().then(function (b) {
      var upd = function () { setBattery(b.level, b.charging); };
      upd();
      b.addEventListener('levelchange', upd);
      b.addEventListener('chargingchange', upd);
    }).catch(function () {});
  }

  /* ---------- INTRO OVERLAY ---------- */
  var intro = document.getElementById('introOverlay');
  window.addEventListener('load', function () {
    setTimeout(function () {
      if (intro) intro.classList.add('hidden');
      document.querySelectorAll('.hero [data-anim], .hero [data-anim].in').forEach(function (el) {
        el.classList.add('in');
      });
      animateBars();
    }, 2000);
  });

  /* ---------- SCROLL REVEAL ---------- */
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        e.target.querySelectorAll('.widget-bar-fill').forEach(function (bar) {
          bar.style.width = (bar.dataset.fill || 0) + '%';
        });
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('[data-anim]').forEach(function (el) { observer.observe(el); });

  function animateBars() {
    document.querySelectorAll('.hero .widget-bar-fill').forEach(function (bar) {
      setTimeout(function () { bar.style.width = (bar.dataset.fill || 0) + '%'; }, 260);
    });
  }

  /* ---------- NAV (float nav + active section) ---------- */
  var fnavs = Array.prototype.slice.call(document.querySelectorAll('.fnav'));
  var indicator = document.getElementById('fnavIndicator');
  var sections = Array.prototype.slice.call(document.querySelectorAll('section[id]'));

  function moveIndicator(el) {
    if (!indicator || !el) return;
    var nav = el.parentElement;
    var navRect = nav.getBoundingClientRect();
    var r = el.getBoundingClientRect();
    indicator.style.width = (r.width * 0.55) + 'px';
    indicator.style.transform = 'translateX(' + (r.left - navRect.left + (r.width - r.width * 0.55) / 2) + 'px)';
  }

  fnavs.forEach(function (a) {
    a.addEventListener('click', function () { moveIndicator(a); });
  });

  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        var id = e.target.id;
        fnavs.forEach(function (a) {
          var on = a.dataset.section === id;
          a.classList.toggle('active', on);
          if (on) moveIndicator(a);
        });
      }
    });
  }, { threshold: 0.35 });
  sections.forEach(function (s) { spy.observe(s); });

  window.addEventListener('load', function () {
    var first = document.querySelector('.fnav.active') || fnavs[0];
    moveIndicator(first);
  });

  /* ---------- SMOOTH SCROLL ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (ev) {
      var target = document.querySelector(a.getAttribute('href'));
      if (target) {
        ev.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---------- THEME TOGGLE ---------- */
  var toggle = document.getElementById('themeToggle');
  if (toggle) {
    toggle.addEventListener('click', function (ev) {
      var btn = ev.target.closest('.theme-btn');
      if (!btn) return;
      var theme = btn.dataset.theme || 'dark';
      document.documentElement.setAttribute('data-theme', theme);
      toggle.querySelectorAll('.theme-btn').forEach(function (b) {
        b.classList.toggle('active', b === btn);
      });
    });
  }

  /* ---------- FINGERPRINT SCANNER ---------- */
  var fp = document.getElementById('fingerprint');
  var fpStatus = document.getElementById('fpStatus');
  var fpFill = document.getElementById('fpFill');
  var busy = false;
  if (fp) {
    fp.addEventListener('click', function () {
      if (busy) return;
      busy = true;
      fp.classList.add('scanning');
      if (fpStatus) fpStatus.textContent = 'Memindai...';
      var p = 0;
      var iv = setInterval(function () {
        p = Math.min(100, p + 7 + Math.random() * 9);
        if (fpFill) fpFill.style.width = p + '%';
        if (p >= 100) {
          clearInterval(iv);
          setTimeout(function () {
            fp.classList.remove('scanning');
            if (fpStatus) fpStatus.textContent = '✓ Terverifikasi — Ayogi Akbar';
            if (fpFill) fpFill.style.width = '100%';
            busy = false;
          }, 300);
        }
      }, 90);
    });
  }

  /* ---------- FOCUS SLIDER ---------- */
  var slider = document.getElementById('focusSlider');
  var sliderVal = document.getElementById('sliderVal');
  if (slider && sliderVal) {
    var label = function (v) {
      if (v < 34) return 'Relax — ';
      if (v < 67) return 'Focused — ';
      return 'Deep Work — ';
    };
    var update = function () { sliderVal.textContent = label(+slider.value) + slider.value + '%'; };
    slider.addEventListener('input', update);
    update();
  }

  /* ---------- UPSIDE NAV indicator reposition on resize ---------- */
  window.addEventListener('resize', function () {
    moveIndicator(document.querySelector('.fnav.active'));
  });

  /* ---------- FAB (scroll top) ---------- */
  var fab = document.getElementById('fabTop');
  if (fab) {
    window.addEventListener('scroll', function () {
      fab.classList.toggle('show', window.scrollY > 320);
    }, { passive: true });
    fab.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- CONTACT FORM -> WhatsApp ---------- */
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var name = (document.getElementById('fname') || {}).value || '';
      var email = (document.getElementById('femail') || {}).value || '';
      var msg = (document.getElementById('fmsg') || {}).value || '';
      var text = 'Hai Ayogi! Saya ' + name + (email ? ' (' + email + ')' : '') + '.%0A%0A' + msg;
      window.open('https://api.whatsapp.com/send?phone=6282173230348&text=' + encodeURIComponent(text).replace(/%250A/g, '%0A'), '_blank');
    });
  }
})();
