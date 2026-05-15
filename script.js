/* ===================================
   Portfolio Script — iOS 2026 Style
   Ayogi Akbar
   =================================== */

document.addEventListener('DOMContentLoaded', () => {
    initStatusBar();
    initScrollAnimations();
    initTabBar();
    initProjectFilters();
    initProjectModal();
    initContactForm();
    initSkillBars();
});

/* ===== Status Bar Clock ===== */
function initStatusBar() {
    const timeEl = document.getElementById('statusTime');
    if (!timeEl) return;

    function updateTime() {
        const now = new Date();
        timeEl.textContent = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    }

    updateTime();
    setInterval(updateTime, 30000);
}

/* ===== Scroll Animations (Intersection Observer) ===== */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
}

/* ===== Tab Bar Navigation ===== */
function initTabBar() {
    const tabs = document.querySelectorAll('.tab-item');
    const sections = document.querySelectorAll('.section');

    // Click handler
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = tab.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
                setActiveTab(tab);
            }
        });
    });

    // Scroll spy
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                const correspondingTab = document.querySelector(`.tab-item[data-section="${id}"]`);
                if (correspondingTab) {
                    setActiveTab(correspondingTab);
                }
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-20% 0px -50% 0px'
    });

    sections.forEach(section => scrollObserver.observe(section));

    function setActiveTab(activeTab) {
        tabs.forEach(t => t.classList.remove('active'));
        activeTab.classList.add('active');
    }
}

/* ===== Project Filters ===== */
function initProjectFilters() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const projectCards = document.querySelectorAll('.project-card');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filter = tab.dataset.filter;

            // Filter cards with animation
            projectCards.forEach(card => {
                const category = card.dataset.category;
                if (filter === 'all' || category === filter) {
                    card.style.display = '';
                    card.style.animation = 'fadeInUp 0.4s ease forwards';
                } else {
                    card.style.animation = 'fadeOut 0.2s ease forwards';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 200);
                }
            });
        });
    });

    // Add animation keyframes dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(10px); }
        }
    `;
    document.head.appendChild(style);
}

/* ===== Project Modal ===== */
function initProjectModal() {
    const projectData = {
        'exsala-api': {
            title: 'Exsala REST API',
            category: 'API',
            date: '2025',
            description: 'Public REST API service built for developers. Provides various endpoints including AI tools, downloader, converter, and more. Built with Node.js and Express for high performance and reliability.',
            tech: ['Node.js', 'Express', 'REST API', 'JSON'],
            images: [],
            demoUrl: 'https://exsalapi.my.id'
        },
        'whatsapp-bot': {
            title: 'WhatsApp Bot Multi-Device',
            category: 'Bot / Tools',
            date: '2025',
            description: 'WhatsApp Multi-Device bot built using the Baileys library. Supports automated replies, group management, media handling, and integration with external APIs. Designed for smooth operation and real-time interaction.',
            tech: ['JavaScript', 'Node.js', 'Baileys', 'API Integration'],
            images: ['assets/images/dashboard317/menubot.png'],
            demoUrl: 'https://chat.whatsapp.com/FGraEUnCIsUIhzgee0C0CR'
        },
        'koperasi': {
            title: 'Unit Usaha Koperasi 317',
            category: 'Web App',
            date: '2025',
            description: 'Full-featured web application for cooperative business unit management. Includes sales transactions, receipt generation, Excel report export, user management, and product settings.',
            tech: ['PHP', 'Bootstrap', 'MySQL', 'Chart.js'],
            images: [
                'assets/images/koperasi/dashboard.png',
                'assets/images/koperasi/login.png',
                'assets/images/koperasi/transaksi.png',
                'assets/images/koperasi/riwayat-transaksi.png',
                'assets/images/koperasi/laporan.png',
                'assets/images/koperasi/contoh-report-excel.png',
                'assets/images/koperasi/contoh-struk.png',
                'assets/images/koperasi/profile.png',
                'assets/images/koperasi/setting-produk.png'
            ],
            demoUrl: 'http://debang.my.id/koperasi'
        },
        'tracking-banking': {
            title: 'Tracking Banking',
            category: 'Web App',
            date: '2024',
            description: 'Finance tracking web application with user authentication and data visualization. Helps users manage their finances with categorized transactions, monthly summaries, and visual reports.',
            tech: ['PHP', 'Bootstrap', 'MySQL', 'Chart.js'],
            images: [
                'assets/images/sallary/dashboard.png',
                'assets/images/sallary/login.png',
                'assets/images/sallary/register.png',
                'assets/images/sallary/report.png',
                'assets/images/sallary/pemasukan.png',
                'assets/images/sallary/pengeluaran.png',
                'assets/images/sallary/profile-setting.png'
            ],
            demoUrl: null
        }
    };

    const modal = document.getElementById('projectModal');
    const closeBtn = document.getElementById('closeModal');
    const detailBtns = document.querySelectorAll('.project-detail-btn');

    detailBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const projectKey = btn.dataset.project;
            const project = projectData[projectKey];
            if (!project) return;

            // Fill modal content
            document.getElementById('modalTitle').textContent = project.title;
            document.getElementById('modalCategory').textContent = project.category;
            document.getElementById('modalDate').textContent = project.date;
            document.getElementById('modalDescription').textContent = project.description;

            // Tech chips
            const techContainer = document.getElementById('modalTech');
            techContainer.innerHTML = project.tech.map(t =>
                `<span class="tech-chip">${t}</span>`
            ).join('');

            // Main image
            const mainImg = document.getElementById('modalMainImage');
            if (project.images.length > 0) {
                mainImg.src = project.images[0];
                mainImg.style.display = 'block';
            } else {
                mainImg.style.display = 'none';
            }

            // Thumbnails
            const thumbContainer = document.getElementById('modalThumbnails');
            thumbContainer.innerHTML = '';
            if (project.images.length > 1) {
                project.images.forEach((img, index) => {
                    const thumb = document.createElement('img');
                    thumb.src = img;
                    thumb.alt = `Screenshot ${index + 1}`;
                    if (index === 0) thumb.classList.add('active');
                    thumb.addEventListener('click', () => {
                        mainImg.src = img;
                        thumbContainer.querySelectorAll('img').forEach(t => t.classList.remove('active'));
                        thumb.classList.add('active');
                    });
                    thumbContainer.appendChild(thumb);
                });
            }

            // Demo link
            const demoLink = document.getElementById('modalDemoLink');
            if (project.demoUrl) {
                demoLink.href = project.demoUrl;
                demoLink.style.display = 'inline-flex';
            } else {
                demoLink.style.display = 'none';
            }

            // Show modal
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

/* ===== Contact Form ===== */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !message) {
            showToast('Please fill in Name and Message', 'error');
            return;
        }

        const waMessage = [
            `*Portfolio Contact*`,
            ``,
            `*Name:* ${name}`,
            `*Email:* ${email || 'Not provided'}`,
            `*Subject:* ${subject || 'No subject'}`,
            ``,
            `*Message:*`,
            message
        ].join('\n');

        const encoded = encodeURIComponent(waMessage);
        window.open(`https://wa.me/6282173230348?text=${encoded}`, '_blank');
        showToast('Opening WhatsApp...', 'success');
    });
}

/* ===== Skill Bars Animation ===== */
function initSkillBars() {
    const skillFills = document.querySelectorAll('.skill-fill');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target;
                const width = fill.dataset.width;
                setTimeout(() => {
                    fill.style.width = width + '%';
                }, 200);
                observer.unobserve(fill);
            }
        });
    }, { threshold: 0.5 });

    skillFills.forEach(fill => observer.observe(fill));
}

/* ===== Toast Notification ===== */
function showToast(message, type = 'info') {
    // Remove existing toast
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.textContent = message;

    Object.assign(toast.style, {
        position: 'fixed',
        top: '80px',
        left: '50%',
        transform: 'translateX(-50%) translateY(-20px)',
        padding: '12px 24px',
        borderRadius: '12px',
        fontSize: '13px',
        fontWeight: '600',
        zIndex: '3000',
        opacity: '0',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        maxWidth: '90%',
        textAlign: 'center'
    });

    if (type === 'success') {
        toast.style.background = 'rgba(52, 199, 89, 0.9)';
        toast.style.color = 'white';
    } else if (type === 'error') {
        toast.style.background = 'rgba(255, 59, 48, 0.9)';
        toast.style.color = 'white';
    } else {
        toast.style.background = 'rgba(0, 122, 255, 0.9)';
        toast.style.color = 'white';
    }

    document.body.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    // Remove after 3s
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(-20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
