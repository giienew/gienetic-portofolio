/* ============================
   APP.JS — Interactive Portfolio
   Real developer feel, not template BS
   ============================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
    Loader.init();
    Sound.init();
    Theme.init();
    Clock.init();
    Scroll.init();
    TabBar.init();
    Skills.init();
    Contact.init();
    Ripple.init();
    Tilt.init();
    Counter.init();
    Particles.init();
});

/* ===== LOADER (Skeleton → Content) ===== */
const Loader = {
    init() {
        document.body.classList.add('loading');
        window.addEventListener('load', () => {
            setTimeout(() => {
                document.body.classList.remove('loading');
                document.body.classList.add('loaded');
            }, 300);
        });
    }
};

/* ===== SOUND ENGINE (Multi-tone, realistic) ===== */
const Sound = {
    ctx: null,
    enabled: true,

    init() {
        const activate = () => {
            if (!this.ctx) {
                this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            }
            document.removeEventListener('pointerdown', activate);
            document.removeEventListener('touchstart', activate);
        };
        document.addEventListener('pointerdown', activate);
        document.addEventListener('touchstart', activate);
    },

    // Subtle click — like iOS keyboard tap
    tap() {
        if (!this.ctx || !this.enabled) return;
        try {
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1800, t);
            osc.frequency.exponentialRampToValueAtTime(800, t + 0.04);
            gain.gain.setValueAtTime(0.06, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
            osc.start(t);
            osc.stop(t + 0.05);
        } catch(e) {}
    },

    // Navigation switch sound
    nav() {
        if (!this.ctx || !this.enabled) return;
        try {
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(600, t);
            osc.frequency.setValueAtTime(900, t + 0.05);
            gain.gain.setValueAtTime(0.04, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
            osc.start(t);
            osc.stop(t + 0.1);
        } catch(e) {}
    },

    // Success / send
    success() {
        if (!this.ctx || !this.enabled) return;
        try {
            const t = this.ctx.currentTime;
            [880, 1100, 1320].forEach((freq, i) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.type = 'sine';
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0, t + i * 0.08);
                gain.gain.linearRampToValueAtTime(0.05, t + i * 0.08 + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.15);
                osc.start(t + i * 0.08);
                osc.stop(t + i * 0.08 + 0.15);
            });
        } catch(e) {}
    },

    // Theme switch
    toggle() {
        if (!this.ctx || !this.enabled) return;
        try {
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(400, t);
            osc.frequency.exponentialRampToValueAtTime(1200, t + 0.08);
            osc.frequency.exponentialRampToValueAtTime(800, t + 0.12);
            gain.gain.setValueAtTime(0.05, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
            osc.start(t);
            osc.stop(t + 0.14);
        } catch(e) {}
    },

    // Error
    error() {
        if (!this.ctx || !this.enabled) return;
        try {
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(200, t);
            osc.frequency.setValueAtTime(150, t + 0.1);
            gain.gain.setValueAtTime(0.04, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
            osc.start(t);
            osc.stop(t + 0.2);
        } catch(e) {}
    }
};

/* ===== RIPPLE EFFECT (Material-style on tap) ===== */
const Ripple = {
    init() {
        document.querySelectorAll('.btn, .tab, .social-btn, .stat, .theme-btn, .tag, .card').forEach(el => {
            el.style.position = el.style.position || 'relative';
            el.style.overflow = 'hidden';
            el.addEventListener('pointerdown', (e) => this.create(e, el));
        });
    },

    create(e, el) {
        const rect = el.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
        el.appendChild(ripple);

        Sound.tap();

        ripple.addEventListener('animationend', () => ripple.remove());
    }
};

/* ===== 3D TILT on Cards ===== */
const Tilt = {
    init() {
        if (window.matchMedia('(hover: none)').matches) return; // Skip on touch devices
        
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                const rotateX = (y - 0.5) * -6;
                const rotateY = (x - 0.5) * 6;
                card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }
};

/* ===== ANIMATED COUNTER ===== */
const Counter = {
    init() {
        const stats = document.querySelectorAll('.stat strong');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animate(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.8 });

        stats.forEach(el => observer.observe(el));
    },

    animate(el) {
        const text = el.textContent;
        const match = text.match(/(\d+)/);
        if (!match) return;

        const target = parseInt(match[1]);
        const suffix = text.replace(match[1], '');
        let current = 0;
        const step = Math.ceil(target / 30);
        const interval = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(interval);
            }
            el.textContent = current + suffix;
        }, 30);
    }
};

/* ===== PARTICLES (Subtle floating dots) ===== */
const Particles = {
    init() {
        const canvas = document.createElement('canvas');
        canvas.id = 'particles';
        canvas.style.cssText = 'position:fixed;inset:0;z-index:-1;pointer-events:none;opacity:0.4';
        document.body.prepend(canvas);

        const ctx = canvas.getContext('2d');
        let particles = [];
        let w, h;

        const resize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Create particles
        for (let i = 0; i < 30; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                size: Math.random() * 2 + 0.5,
                alpha: Math.random() * 0.3 + 0.1
            });
        }

        const draw = () => {
            ctx.clearRect(0, 0, w, h);
            const color = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#007AFF';

            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0) p.x = w;
                if (p.x > w) p.x = 0;
                if (p.y < 0) p.y = h;
                if (p.y > h) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.globalAlpha = p.alpha;
                ctx.fill();
            });

            requestAnimationFrame(draw);
        };
        draw();
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
                Sound.toggle();
                Toast.show(`${t.charAt(0).toUpperCase() + t.slice(1)} mode activated`, 'info');
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

/* ===== CLOCK ===== */
const Clock = {
    init() {
        const el = document.getElementById('clock');
        if (!el) return;
        const update = () => {
            el.textContent = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        };
        update();
        setInterval(update, 30000);
    }
};

/* ===== SCROLL ANIMATIONS ===== */
const Scroll = {
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

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
                    this.setActive(tab, tabs);
                    Sound.nav();
                }
            });
        });

        const spy = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const t = document.querySelector(`.tab[data-section="${entry.target.id}"]`);
                    if (t) this.setActive(t, tabs);
                }
            });
        }, { threshold: 0.3, rootMargin: '-15% 0px -50% 0px' });

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
                    setTimeout(() => {
                        entry.target.style.width = entry.target.dataset.w + '%';
                    }, 200);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        fills.forEach(f => observer.observe(f));
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
                Sound.error();
                Toast.show('Please fill name & message!', 'error');
                return;
            }

            const text = `*Portfolio Contact*\n\n*Name:* ${name}\n*Email:* ${email || '-'}\n\n*Message:*\n${msg}`;
            window.open(`https://wa.me/6282173230348?text=${encodeURIComponent(text)}`, '_blank');
            Sound.success();
            Toast.show('Opening WhatsApp...', 'success');
            form.reset();
        });
    }
};

/* ===== TOAST NOTIFICATIONS ===== */
const Toast = {
    show(msg, type = 'info') {
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i> ${msg}`;
        document.body.appendChild(toast);

        requestAnimationFrame(() => toast.classList.add('show'));

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    }
};
