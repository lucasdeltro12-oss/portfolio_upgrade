// LinkedIn QR Code
new QRCode(document.getElementById('linkedin-qr'), {
    text: 'https://www.linkedin.com/in/lucas-delmas-trochain-182632405/',
    width: 200,
    height: 200,
    colorDark: '#00f5d4',
    colorLight: '#0a0a14',
    correctLevel: QRCode.CorrectLevel.M
});

// GitHub QR Code
new QRCode(document.getElementById('github-qr'), {
    text: 'https://github.com/lucasdeltro12-oss',
    width: 200,
    height: 200,
    colorDark: '#00f5d4',
    colorLight: '#0a0a14',
    correctLevel: QRCode.CorrectLevel.M
});

// Custom cursor
const cursorDot  = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');
let ringX = 0, ringY = 0;
let dotX  = 0, dotY  = 0;

window.addEventListener('mousemove', e => {
    dotX = e.clientX;
    dotY = e.clientY;
    cursorDot.style.left = dotX + 'px';
    cursorDot.style.top  = dotY + 'px';
});

(function animateRing() {
    ringX += (dotX - ringX) * 0.07;
    ringY += (dotY - ringY) * 0.07;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
})();

document.querySelectorAll('a, button, .btn, .skill-tag, .project-card, .social-link').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

// Network constellation background
(function () {
    const canvas = document.getElementById('network-canvas');
    const ctx = canvas.getContext('2d');
    const PARTICLE_COUNT = 120;
    const CONNECTION_DIST = 200;
    const MOUSE_DIST = 250;
    let mouse = { x: null, y: null };
    let particles = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

    function randomBetween(a, b) { return a + Math.random() * (b - a); }

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = randomBetween(0, canvas.width);
            this.y = randomBetween(0, canvas.height);
            this.vx = randomBetween(-0.3, 0.3);
            this.vy = randomBetween(-0.3, 0.3);
            this.r = randomBetween(2, 4);
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 245, 212, 1)';
            ctx.shadowColor = 'rgba(0, 245, 212, 0.8)';
            ctx.shadowBlur = 6;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONNECTION_DIST) {
                    const alpha = (1 - dist / CONNECTION_DIST) * 0.7;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 245, 212, ${alpha})`;
                    ctx.lineWidth = 1.2;
                    ctx.stroke();
                }
            }
            // Connect to mouse
            if (mouse.x !== null) {
                const dx = particles[i].x - mouse.x;
                const dy = particles[i].y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MOUSE_DIST) {
                    const alpha = (1 - dist / MOUSE_DIST) * 0.9;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(123, 44, 191, ${alpha})`;
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        drawConnections();
        requestAnimationFrame(animate);
    }
    animate();
})();

// Reveal on scroll
const revealElements = document.querySelectorAll('.reveal');

const revealOnScroll = () => {
    revealElements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (elementTop < windowHeight - 100) {
            el.classList.add('active');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// Smooth scroll for navigation (fast, ~350ms)
function fastScrollTo(target) {
    const start = window.scrollY;
    const end = target.getBoundingClientRect().top + start;
    const duration = 350;
    let startTime = null;

    function easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        window.scrollTo(0, start + (end - start) * easeInOutQuad(progress));
        if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) fastScrollTo(target);
    });
});

// Parallax effect for orbs
window.addEventListener('mousemove', (e) => {
    const orbs = document.querySelectorAll('.orb');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    orbs.forEach((orb, index) => {
        const speed = (index + 1) * 20;
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;
        orb.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// Navigation background on scroll
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        nav.style.background = 'rgba(5, 5, 8, 0.95)';
    } else {
        nav.style.background = 'rgba(5, 5, 8, 0.7)';
    }
});

// Back to top button
const backToTopBtn = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
    backToTopBtn.classList.toggle('visible', window.scrollY > 400);
});
backToTopBtn.addEventListener('click', () => fastScrollTo(document.getElementById('hero')));

// Add stagger animation delay to reveal elements
revealElements.forEach((el, index) => {
    const inFastSection = el.closest('.projects, .contact');
    el.style.transitionDelay = inFastSection ? `${index * 0.04}s` : `${index * 0.1}s`;
});
