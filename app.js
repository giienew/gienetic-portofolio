/* ============================
   APP.JS — iOS 2026 Portfolio
   Modular, Sound Effects, Themes
   ============================ */

document.addEventListener('DOMContentLoaded', () => {
    Sound.init();
    Theme.init();
    Clock.init();
    Scroll.init();
    TabBar.init();
    Skills.init();
    Contact.init();
});

/* ===== SOUND MODULE ===== */
const Sound = {
    ctx: null,

    init() {
        // Create AudioContext on first interaction (browser policy)
        const activate = () => {
            if (!this.ctx) {
                this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            }
            document.removeEventListener('pointerdown', activate);
        };
        document.addEventListener('pointerdown', activate);

        // Attach click sound to all interactive elements
        document.querySelectorAll('a, button, .tab, .stat, .social-btn, .tag, .theme-btn').forEach(el => {
            el.addEventListener('pointerdown', () => this.click());
        });
    },

    click() {
        if (!this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.06);
            gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
            osc.start(this.ctx.currentTime);
            osc.stop(this.ctx.currentTime + 0.08);
        } catch (e) { /* silent fail */ }
    },

    success() {
        if (!this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1400, this.ctx.currentTime + 0.12);
            gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
            osc.start(this.ctx.currentTime);
            osc.stop(this.ctx.currentTime + 0.15);
        } catch (e) { /* silent fail */ }
    }
};

/* ===== THEME MODULE ===== */
const Theme = {
    init() {
        const saved = localStorage.getItem('theme') || 'dark';
        this.apply(saved);

        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const t = btn.dataset.theme;
                this.apply(t);
                localStorage.setItem('theme', t);
                Sound.click();
            });
        });
    },

    apply(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        document.querySelectorAll('.theme-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.theme === theme);
        });
    }
};

/* ===== CLOCK MODULE ===== */
const Clock = {
    init() {
        const el = document.getElementById('clock');
        if (!el) return;
        const update = () => {
            const now = new Date();
            el.textContent = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        };
        update();
        setInterval(update, 30000);
    }
};

/* ===== SCROLL ANIMATIONS ===== */
const Scroll = {
    init() {
        const elements = document.querySelectorAll('[data-anim]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });

        elements.forEach(el => observer.observe(el));
    }
};

/* ===== TAB BAR ===== */
const TabBar = {
    init() {
        const tabs = document.querySelectorAll('.tab');
        const sections = document.querySelectorAll('.section');

        // Click
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const id = tab.getAttribute('href').substring(1);
                const target = document.getElementById(id);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                    this.setActive(tab, tabs);
                }
            });
        });

        // Scroll spy
        const spy = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    const t = document.querySelector(`.tab[data-section="${id}"]`);
                    if (t) this.setActive(t, tabs);
                }
            });
        }, { threshold: 0.35, rootMargin: '-15% 0px -50% 0px' });

        sections.forEach(s => spy.observe(s));
    },

    setActive(active, all) {
        all.forEach(t => t.classList.remove('active'));
        active.classList.add('active');
    }
};

/* ===== SKILL BARS ===== */
const Skills = {
    init() {
        const fills = document.querySelectorAll('.fill');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    setTimeout(() => {
                        el.style.width = el.dataset.w + '%';
                    }, 150);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        fills.forEach(f => observer.observe(f));
    }
};

/* ===== CONTACT FORM ===== */
const Contact = {
    init() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('fname').value.trim();
            const email = document.getElementById('femail').value.trim();
            const msg = document.getElementById('fmsg').value.trim();

            if (!name || !msg) return;

            const text = [
                '*Portfolio Contact*',
                '',
                `*Name:* ${name}`,
                `*Email:* ${email || '-'}`,
                '',
                `*Message:*`,
                msg
            ].join('\n');

            window.open(`https://wa.me/6282173230348?text=${encodeURIComponent(text)}`, '_blank');
            Sound.success();
            form.reset();
        });
    }
};
