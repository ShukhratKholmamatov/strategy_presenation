// ===== Navigation scroll effect =====
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
});

// ===== Active nav link based on scroll =====
const sections = document.querySelectorAll('.hero, .q1-section');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveNav() {
    const scrollY = window.scrollY + 200;

    if (scrollY < document.getElementById('q1').offsetTop) {
        navLinks.forEach(l => l.classList.remove('active'));
        navLinks[0].classList.add('active');
    } else {
        navLinks.forEach(l => l.classList.remove('active'));
        navLinks[1].classList.add('active');
    }
}

window.addEventListener('scroll', updateActiveNav);

// ===== Quarter tabs =====
const quarterTabs = document.querySelectorAll('.quarter-tab');
const quarterContents = document.querySelectorAll('.quarter-content');

quarterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = tab.dataset.quarter;

        quarterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        quarterContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === target) {
                content.classList.add('active');
                // Re-trigger animations
                content.querySelectorAll('.task-card').forEach(card => {
                    card.style.animation = 'none';
                    card.offsetHeight; // trigger reflow
                    card.style.animation = null;
                });
            }
        });
    });
});

// ===== Category tabs =====
const categoryTabs = document.querySelectorAll('.category-tab');
const categoryContents = document.querySelectorAll('.category-content');

categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = tab.dataset.category;

        categoryTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        categoryContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === 'cat-' + target) {
                content.classList.add('active');
            }
        });
    });
});

// ===== Intersection Observer for scroll animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe achievement blocks
document.querySelectorAll('.achievement-block, .result-card, .dept-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
});

// Add visible class styles
const style = document.createElement('style');
style.textContent = `
    .visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// ===== Smooth progress bar animation =====
const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bar = entry.target.querySelector('.bar-fill');
            if (bar) {
                const targetWidth = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = targetWidth;
                }, 100);
            }
            barObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.report-stat-card').forEach(card => {
    barObserver.observe(card);
});

// ===== Counter animation for stat numbers =====
function animateCounter(el, target, suffix = '') {
    const duration = 1500;
    const start = performance.now();
    const startVal = 0;

    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(startVal + (target - startVal) * eased);
        el.textContent = current + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const text = el.textContent.trim();
            const match = text.match(/(\d+)(\+?)/);
            if (match) {
                const num = parseInt(match[1]);
                const suffix = match[2] || '';
                animateCounter(el, num, suffix);
            }
            statObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.hero-stat-number, .report-stat-number').forEach(el => {
    statObserver.observe(el);
});
