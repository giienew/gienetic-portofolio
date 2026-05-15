/* ============================
   APP.JS — Premium iOS Portfolio
   Full Interactive, Lottie Intro,
   Sound Design, Mini Game
   ============================ */

'use strict';

document.addEventListener('DOMContentLoaded', async () => {
    // Load settings and render dynamic content
    try {
        const res = await fetch('settings.json');
        if (res.ok) {
            const cfg = await res.json();
            Settings.apply(cfg);
        }
    } catch(e) { /* settings.json optional — falls back to HTML defaults */ }

    Intro.init();
    SFX.init();
    Theme.init();
    Clock.init();
    ScrollFX.init();
    TabBar.init();
    SkillCharts.init();
    Contact.init();
    Ripple.init();
});

/* ===== SETTINGS LOADER ===== */
const Settings = {
    apply(cfg) {
        // Profile
        if (cfg.profile) {
            const p = cfg.profile;
            this._set('.hero-name', p.name);
            this._set('.hero-role', p.role);
            if (p.photo) {
                const img = document.querySelector('.hero-avatar img');
                if (img) img.src = p.photo;
            }
            // About info
            const rows = document.querySelectorAll('.info-row span');
            if (rows.length >= 4) {
                rows[0].textContent = p.fullName || '';
                rows[1].textContent = p.location || '';
                rows[2].textContent = p.status || '';
                rows[3].textContent = p.hobbies || '';
            }
            const bio = document.querySelector('.bio');
            if (bio && p.bio) bio.textContent = p.bio;
        }

        // Stats
        if (cfg.stats) {
            const statEls = document.querySelectorAll('.stat strong');
            if (statEls[0]) statEls[0].textContent = cfg.stats.years || '3+';
            if (statEls[1]) statEls[1].textContent = cfg.stats.projects || '6';
            if (statEls[2]) statEls[2].textContent = cfg.stats.passion || '100';
        }

        // Contact WhatsApp number
        if (cfg.contact && cfg.contact.whatsappNumber) {
            window._waNumber = cfg.contact.whatsappNumber;
        }

        // Default theme
        if (cfg.theme && cfg.theme.default) {
            const saved = localStorage.getItem('theme');
            if (!saved) {
                document.documentElement.setAttribute('data-theme', cfg.theme.default);
                document.querySelectorAll('.theme-btn').forEach(b => {
                    b.classList.toggle('active', b.dataset.theme === cfg.theme.default);
                });
            }
        }
    },

    _set(selector, text) {
        const el = document.querySelector(selector);
        if (el && text) el.textContent = text;
    }
};

/* ===== INTRO SPLASH (CSS Animated) ===== */
const Intro = {
    init() {
        const overlay = document.getElementById('introOverlay');
        if (!overlay) return;

        // Auto dismiss after loading bar finishes (2.2s)
        setTimeout(() => {
            overlay.classList.add('dismiss');
            document.body.classList.add('ready');
            setTimeout(() => overlay.remove(), 600);
        }, 2200);

        // Skip on tap
        overlay.addEventListener('click', () => {
            overlay.classList.add('dismiss');
            document.body.classList.add('ready');
            setTimeout(() => overlay.remove(), 400);
        });
    }
};

/* ===== SOUND DESIGN (Distinct per action) ===== */
const SFX = {
    ctx: null,
    ready: false,

    init() {
        const wake = () => {
            if (!this.ctx) {
                this.ctx = new (window.AudioContext || window.webkitAudioContext)();
                this.ready = true;
            }
            document.removeEventListener('pointerdown', wake);
            document.removeEventListener('touchstart', wake);
        };
        document.addEventListener('pointerdown', wake);
        document.addEventListener('touchstart', wake);
    },

    // Soft tap — button/card press
    tap() {
        if (!this.ready) return;
        this._play([
            { type: 'sine', freq: [1400, 900], dur: 0.045, vol: 0.05 }
        ]);
    },

    // Navigation switch — two-tone chime
    nav() {
        if (!this.ready) return;
        this._play([
            { type: 'sine', freq: [700, 1050], dur: 0.07, vol: 0.04 },
            { type: 'sine', freq: [1050, 1400], dur: 0.07, vol: 0.03, delay: 0.06 }
        ]);
    },

    // Section open / reveal
    open() {
        if (!this.ready) return;
        this._play([
            { type: 'triangle', freq: [300, 600], dur: 0.12, vol: 0.035 },
            { type: 'sine', freq: [600, 900], dur: 0.1, vol: 0.025, delay: 0.08 }
        ]);
    },

    // Theme switch — whoosh
    theme() {
        if (!this.ready) return;
        this._play([
            { type: 'sine', freq: [400, 1100], dur: 0.1, vol: 0.04 },
            { type: 'triangle', freq: [800, 500], dur: 0.08, vol: 0.025, delay: 0.08 }
        ]);
    },

    // Success — ascending triad
    success() {
        if (!this.ready) return;
        this._play([
            { type: 'sine', freq: [700, 700], dur: 0.1, vol: 0.04 },
            { type: 'sine', freq: [900, 900], dur: 0.1, vol: 0.035, delay: 0.09 },
            { type: 'sine', freq: [1200, 1200], dur: 0.12, vol: 0.03, delay: 0.18 }
        ]);
    },

    // Error — descending buzz
    error() {
        if (!this.ready) return;
        this._play([
            { type: 'sawtooth', freq: [300, 180], dur: 0.15, vol: 0.03 }
        ]);
    },

    // Internal: play array of tone configs
    _play(tones) {
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        tones.forEach(cfg => {
            try {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.type = cfg.type;
                const start = t + (cfg.delay || 0);
                osc.frequency.setValueAtTime(cfg.freq[0], start);
                osc.frequency.exponentialRampToValueAtTime(cfg.freq[1], start + cfg.dur);
                gain.gain.setValueAtTime(cfg.vol, start);
                gain.gain.exponentialRampToValueAtTime(0.001, start + cfg.dur + 0.01);
                osc.start(start);
                osc.stop(start + cfg.dur + 0.02);
            } catch(e) {}
        });
    }
};

/* ===== RIPPLE + HAPTIC ===== */
const Ripple = {
    init() {
        document.querySelectorAll('.btn, .tab, .social-btn, .stat, .theme-btn, .tag, .chip').forEach(el => {
            el.style.position = el.style.position || 'relative';
            el.style.overflow = 'hidden';
            el.addEventListener('pointerdown', (e) => this.fire(e, el));
        });
    },

    fire(e, el) {
        const rect = el.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2.2;
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        const r = document.createElement('span');
        r.className = 'ripple';
        r.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
        el.appendChild(r);
        r.addEventListener('animationend', () => r.remove());
    }
};

/* ===== THEME (3 modes) ===== */
const Theme = {
    init() {
        const saved = localStorage.getItem('theme') || 'dark';
        this.set(saved);

        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.set(btn.dataset.theme);
                localStorage.setItem('theme', btn.dataset.theme);
                SFX.theme();
                Toast.show(`${btn.dataset.theme.charAt(0).toUpperCase() + btn.dataset.theme.slice(1)} mode`, 'info');
            });
        });
    },

    set(t) {
        document.documentElement.setAttribute('data-theme', t);
        document.querySelectorAll('.theme-btn').forEach(b => b.classList.toggle('active', b.dataset.theme === t));
    }
};

/* ===== CLOCK ===== */
const Clock = {
    init() {
        const el = document.getElementById('clock');
        if (!el) return;
        const tick = () => { el.textContent = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }); };
        tick();
        setInterval(tick, 30000);
    }
};

/* ===== SCROLL ANIMATIONS ===== */
const ScrollFX = {
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('[data-anim]').forEach(el => observer.observe(el));
    }
};

/* ===== TAB BAR ===== */
const TabBar = {
    init() {
        const tabs = document.querySelectorAll('.tab');
        const sections = document.querySelectorAll('.section');

        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.getElementById(tab.getAttribute('href').substring(1));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                    this.activate(tab, tabs);
                    SFX.nav();
                }
            });
        });

        const spy = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const t = document.querySelector(`.tab[data-section="${entry.target.id}"]`);
                    if (t) this.activate(t, tabs);
                }
            });
        }, { threshold: 0.3, rootMargin: '-10% 0px -55% 0px' });
        sections.forEach(s => spy.observe(s));
    },

    activate(active, all) {
        all.forEach(t => t.classList.remove('active'));
        active.classList.add('active');
    }
};

/* ===== ANIMATED CIRCULAR SKILL CHARTS ===== */
const SkillCharts = {
    init() {
        const charts = document.querySelectorAll('.chart-ring');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const ring = entry.target;
                    const pct = ring.dataset.pct;
                    const circumference = 2 * Math.PI * 40; // r=40
                    const offset = circumference - (pct / 100) * circumference;
                    ring.style.strokeDashoffset = offset;
                    // Animate number
                    const numEl = ring.closest('.chart-item').querySelector('.chart-num');
                    this.countUp(numEl, pct);
                    observer.unobserve(ring);
                }
            });
        }, { threshold: 0.5 });

        charts.forEach(c => observer.observe(c));
    },

    countUp(el, target) {
        let current = 0;
        const step = Math.max(1, Math.ceil(target / 40));
        const interval = setInterval(() => {
            current += step;
            if (current >= target) { current = target; clearInterval(interval); }
            el.textContent = current + '%';
        }, 25);
    }
};

/* ===== CONTACT ===== */
const Contact = {
    init() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('fname').value.trim();
            const email = document.getElementById('femail').value.trim();
            const msg = document.getElementById('fmsg').value.trim();

            if (!name || !msg) {
                SFX.error();
                Toast.show('Fill name & message!', 'error');
                // Shake the form
                form.classList.add('shake');
                setTimeout(() => form.classList.remove('shake'), 500);
                return;
            }

            const waNum = window._waNumber || '6282173230348';
            const text = `*Portfolio Contact*\n\n*Name:* ${name}\n*Email:* ${email || '-'}\n\n*Message:*\n${msg}`;
            window.open(`https://wa.me/${waNum}?text=${encodeURIComponent(text)}`, '_blank');
            SFX.success();
            Toast.show('Opening WhatsApp...', 'success');
            form.reset();
        });
    }
};

/* ===== TOAST ===== */
const Toast = {
    show(msg, type = 'info') {
        const old = document.querySelector('.toast');
        if (old) old.remove();
        const t = document.createElement('div');
        t.className = `toast toast-${type}`;
        const icon = type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : 'info-circle';
        t.innerHTML = `<i class="fas fa-${icon}"></i> ${msg}`;
        document.body.appendChild(t);
        requestAnimationFrame(() => t.classList.add('show'));
        setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 2500);
    }
};
