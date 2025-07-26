// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navigation links - only hover effects, no scroll-based active states
const navLinks = document.querySelectorAll('.nav-links a');

// Handle hash navigation on page load
function handleHashNavigation() {
    const hash = window.location.hash.slice(1); // Remove the '#'
    if (hash) {
        const targetSection = document.getElementById(hash);
        if (targetSection) {
            // Clear all active states for hash navigation - only use hover effects
            navLinks.forEach(link => {
                link.classList.remove('active');
            });
            
            // Scroll to the section
            setTimeout(() => {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Clear the hash after a short delay to prevent sticky active states
                setTimeout(() => {
                    if (window.location.hash) {
                        history.replaceState(null, null, window.location.pathname);
                    }
                }, 1000);
            }, 100);
        }
    }
}

// Handle hash navigation on page load and hash changes
window.addEventListener('load', handleHashNavigation);
window.addEventListener('hashchange', handleHashNavigation);

// Fade-in on scroll for sections
const fadeSections = document.querySelectorAll('.fade-in-section');
const fadeInObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15
});

fadeSections.forEach(section => {
    fadeInObserver.observe(section);
});

// Scroll down arrow functionality
document.querySelector('.scroll-down-arrow').addEventListener('click', () => {
    document.getElementById('about').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
});

// Playful typing animation
function playfulTypingAnimation() {
    const element = document.getElementById('typing-text');
    const baseText = "I'm exploring how to build ";
    const wrongText = "sentient sand.";
    const correctText = "machines that can learn.";
    const contactBtn = document.querySelector('.intro-flex .contact-btn');
    
    let currentText = "";
    let phase = 'typing-wrong'; 
    let charIndex = 0;
    
    function type() {
        if (phase === 'typing-wrong') {
            if (charIndex < (baseText + wrongText).length) {
                currentText = (baseText + wrongText).substring(0, charIndex + 1);
                charIndex++;
            } else {
                phase = 'pausing';
                setTimeout(() => {
                    phase = 'deleting';
                    charIndex = baseText.length + wrongText.length;
                    type();
                }, 300);
                element.textContent = currentText;
                return;
            }
        } else if (phase === 'deleting') {
            if (charIndex > baseText.length) {
                currentText = (baseText + wrongText).substring(0, charIndex - 1);
                charIndex--;
            } else {
                phase = 'typing-correct';
                charIndex = 0;
            }
        } else if (phase === 'typing-correct') {
            if (charIndex < correctText.length) {
                currentText = baseText + correctText.substring(0, charIndex + 1);
                charIndex++;
            } else {
                phase = 'done';
                element.textContent = currentText;
                // Show the Get in Touch button with animation
                if (contactBtn) contactBtn.classList.add('visible');
                return;
            }
        } else if (phase === 'pausing') {
            return;
        }
        
        element.textContent = currentText;
        
        let speed = 55;
        if (phase === 'deleting') {
            speed = 50;
        } else if (phase === 'typing-correct') {
            speed = 60;
        }
        
        setTimeout(type, speed);
    }
    
    setTimeout(() => {
        type();
    }, 1500);
}

document.addEventListener('DOMContentLoaded', playfulTypingAnimation);

// AJAX Web3Forms contact form submission with custom validation
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('form-status');

function validateEmail(email) {
    // Simple email regex
    return /^\S+@\S+\.\S+$/.test(email);
}

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        let valid = true;
        // Clear all error messages
        contactForm.querySelectorAll('.error-message').forEach(div => div.textContent = '');

        // Validate email
        const email = contactForm.querySelector('input[name="email"]');
        if (!email.value.trim()) {
            email.parentElement.querySelector('.error-message').textContent = 'Please enter your email.';
            valid = false;
        } else if (!validateEmail(email.value.trim())) {
            email.parentElement.querySelector('.error-message').textContent = 'Please enter a valid email.';
            valid = false;
        }
        // Validate message
        const message = contactForm.querySelector('textarea[name="message"]');
        if (!message.value.trim()) {
            message.parentElement.querySelector('.error-message').textContent = 'Please enter a message.';
            valid = false;
        }
        if (!valid) return;

        formStatus.textContent = '';
        contactForm.style.transition = 'opacity 0.4s';
        contactForm.style.opacity = '0.5';

        const formData = new FormData(contactForm);
        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            if (result.success) {
                contactForm.style.transition = 'opacity 0.4s';
                contactForm.style.opacity = '0';
                setTimeout(() => {
                    contactForm.style.display = 'none';
                    formStatus.textContent = 'Message sent!';
                    formStatus.style.opacity = '0';
                    formStatus.style.transition = 'opacity 0.6s';
                    formStatus.style.color = '#7ed6a7';
                    formStatus.style.fontSize = '1.2rem';
                    formStatus.style.fontWeight = '600';
                    formStatus.style.marginTop = '2.5rem';
                    formStatus.style.textAlign = 'center';
                    setTimeout(() => {
                        formStatus.style.opacity = '1';
                    }, 50);
                }, 400);
            } else {
                throw new Error(result.message || 'Something went wrong.');
            }
        } catch (err) {
            contactForm.style.opacity = '1';
            formStatus.textContent = 'Could not send message. Please try again later.';
            formStatus.style.color = '#e57373';
            formStatus.style.fontWeight = '600';
            formStatus.style.marginTop = '1.5rem';
            formStatus.style.textAlign = 'center';
        }

        // Fly-off animation for paper plane
        const planeIcon = contactForm.querySelector('.submit-btn .fa-paper-plane');
        if (planeIcon) {
            planeIcon.classList.remove('fly-off');
            // Force reflow to restart animation if needed
            void planeIcon.offsetWidth;
            planeIcon.classList.add('fly-off');
            planeIcon.addEventListener('animationend', function handler() {
                planeIcon.classList.remove('fly-off');
                planeIcon.removeEventListener('animationend', handler);
            });
        }
    });
}

// Theme switching functionality
// For now, only one theme, but code is ready for more
const themes = [
    { key: 'digital-abyss', name: 'Digital Abyss' },
    { key: 'morning-fog', name: 'Morning Fog' },
    { key: 'sakura-garden', name: 'Sakura Garden' },
    { key: 'green-wilder', name: 'Green Wilder' },
    { key: 'piano-symphony', name: 'Piano Symphony' }
];

document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.querySelector('.theme-toggle-icon');
    const themeToggleLi = document.querySelector('.theme-toggle-btn');
    const root = document.documentElement;
    let currentThemeIndex = 0;

    // Always default to morning-fog unless user has previously selected a theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && themes.some(t => t.key === savedTheme)) {
        currentThemeIndex = themes.findIndex(t => t.key === savedTheme);
    } else {
        currentThemeIndex = 1; // morning-fog is second in the array
        root.setAttribute('data-theme', themes[1].key);
        localStorage.setItem('theme', themes[1].key);
    }
    root.setAttribute('data-theme', themes[currentThemeIndex].key);
    if (themeToggleLi) themeToggleLi.title = `${themes[currentThemeIndex].name}`;

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            // Cycle to next theme
            currentThemeIndex = (currentThemeIndex + 1) % themes.length;
            const theme = themes[currentThemeIndex];
            root.setAttribute('data-theme', theme.key);
            localStorage.setItem('theme', theme.key);
            if (themeToggleLi) themeToggleLi.title = `${theme.name}`;
            // Animate icon
            themeToggleBtn.classList.add('spinning');
            setTimeout(() => {
                themeToggleBtn.classList.remove('spinning');
                themeToggleBtn.blur();
            }, 600);
        });
    }
});

// Plexus/Particle Network Background for Intro Section
const PlexusAnimation = (function() {
    const canvas = document.getElementById('plexus-bg');
    if (!canvas) return { pause: () => {}, resume: () => {} };
    
    const ctx = canvas.getContext('2d');
    let dpr = window.devicePixelRatio || 1;
    let width = 0, height = 0;
    const PARTICLE_COUNT = 46;
    const PARTICLE_RADIUS = 2.2;
    const LINE_DIST = 110;
    let particles = [];
    let mouse = { x: null, y: null };
    let animationId = null;
    let isRunning = false;
    
    function getColors() {
        const styles = getComputedStyle(document.documentElement);
        return {
            particle: styles.getPropertyValue('--plexus-particle-color').trim() || 'rgba(0,240,194,0.18)',
            line: styles.getPropertyValue('--plexus-line-color').trim() || 'rgba(0,240,194,0.13)'
        };
    }

    function resize() {
        width = window.innerWidth;
        height = Math.max(document.body.scrollHeight, window.innerHeight);
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
    }

    function randomVel() {
        return (Math.random() - 0.5) * 0.18;
    }

    function getParticleCount() {
        // 1 particle per 20,000 px², min 32, max 180
        return Math.max(32, Math.min(180, Math.floor((width * height) / 20000)));
    }

    function createParticles() {
        particles = [];
        for (let i = 0; i < getParticleCount(); i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: randomVel(),
                vy: randomVel(),
                r: PARTICLE_RADIUS + Math.random() * 0.7
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        const colors = getColors();
        // Draw lines
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const a = particles[i], b = particles[j];
                const dx = a.x - b.x, dy = a.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < LINE_DIST) {
                    ctx.save();
                    ctx.globalAlpha = 1;
                    ctx.strokeStyle = colors.line;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                    ctx.restore();
                }
            }
        }
        // Draw particles
        for (const p of particles) {
            ctx.save();
            ctx.globalAlpha = 1;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
            ctx.fillStyle = colors.particle;
            ctx.shadowColor = colors.particle;
            ctx.shadowBlur = 6;
            ctx.fill();
            ctx.restore();
        }
    }

    function animate() {
        if (!isRunning) return;
        
        for (const p of particles) {
            p.x += p.vx;
            p.y += p.vy;
            // Bounce off edges
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;
            // Gentle mouse repulsion
            if (mouse.x !== null && mouse.y !== null) {
                const dx = p.x - mouse.x, dy = p.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 80) {
                    p.vx += dx / dist * 0.03;
                    p.vy += dy / dist * 0.03;
                }
            }
        }
        draw();
        animationId = requestAnimationFrame(animate);
    }

    function onMouseMove(e) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = (e.clientX - rect.left) * (width / rect.width);
        mouse.y = (e.clientY - rect.top) * (height / rect.height);
    }
    
    function onMouseLeave() {
        mouse.x = null;
        mouse.y = null;
    }

    window.addEventListener('resize', () => {
        if (isRunning) {
            resize();
            createParticles();
        }
    });
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);

    // Initialize
    setTimeout(() => {
        resize();
        createParticles();
        start();
    }, 100);

    function start() {
        if (!isRunning) {
            isRunning = true;
            animate();
        }
    }

    function pause() {
        isRunning = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    }

    function resume() {
        if (!isRunning) {
            start();
        }
    }

    // Return public API
    return {
        pause,
        resume
    };
})();

// Fade-in for About Me paragraphs
(function() {
    const paragraphs = document.querySelectorAll('.about-paragraph.fade-in-paragraph');
    if (!paragraphs.length) return;
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry, idx) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, idx * 180); // Staggered fade-in
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.18 });
    paragraphs.forEach(p => observer.observe(p));
})();

// Hide header when scrolling past the intro section
(function() {
    const header = document.querySelector('header');
    const intro = document.getElementById('intro');
    if (!header || !intro) return;
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                header.classList.remove('hide-header');
            } else {
                header.classList.add('hide-header');
            }
        });
    }, { threshold: 0.01 });
    observer.observe(intro);
})();

// Flowing Timeline Animation
(function() {
    const items = document.querySelectorAll('.timeline-item');
    if (!items.length) return;
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.18 });
    items.forEach(item => observer.observe(item));
})();

// Fade-in for project blocks
(function() {
    const projects = document.querySelectorAll('.fade-in-project');
    if (!projects.length) return;
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry, idx) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, idx * 120); // Staggered fade-in
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    projects.forEach(p => observer.observe(p));
})();

// Other Projects CTA navigation
(function() {
  const cta = document.querySelector('.other-projects-cta');
  if (!cta) return;
  cta.addEventListener('click', () => {
    navigateToProjects();
  });
  cta.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigateToProjects();
    }
  });
})();

// SPA Routing System
const Router = {
    currentPage: 'home',
    homeObservers: [], // Store observers for home page
    
    init() {
        // Handle initial route
        this.handleRoute();
        
        // Listen for browser back/forward buttons
        window.addEventListener('popstate', () => {
            this.handleRoute();
        });
    },
    
    handleRoute() {
        const path = window.location.pathname;
        const hash = window.location.hash;
        
        // Determine which page to show
        if (path.includes('/projects') || hash === '#projects-archive') {
            this.showPage('projects');
        } else {
            this.showPage('home');
        }
    },
    
    showPage(page) {
        const homeContent = document.getElementById('home-content');
        const projectsContent = document.getElementById('projects-archive-content');
        const plexusCanvas = document.getElementById('plexus-bg');
        
        if (page === 'projects') {
            // Show projects page
            homeContent.style.display = 'none';
            projectsContent.style.display = 'block';
            plexusCanvas.style.display = 'none'; // Hide plexus on projects page
            document.title = 'Project Archive - Henry Vu | Dallas UTDallas CS Graduate';
            this.currentPage = 'projects';
            
            // Pause plexus animation to improve performance
            if (PlexusAnimation) {
                PlexusAnimation.pause();
            }
            
            // Scroll to top
            window.scrollTo(0, 0);
            
        } else {
            // Show home page
            homeContent.style.display = 'block';
            projectsContent.style.display = 'none';
            plexusCanvas.style.display = 'block'; // Show plexus on home page
            document.title = 'Henry Vu - Dallas Computer Science Graduate Student at UTDallas | ML & AI Portfolio';
            this.currentPage = 'home';
            
            // Resume plexus animation
            if (PlexusAnimation) {
                PlexusAnimation.resume();
            }
        }
    },
    
    navigateTo(page, section = null) {
        if (page === 'projects') {
            // Navigate to projects page
            history.pushState({ page: 'projects' }, 'Project Archive - Henry Vu | Dallas UTDallas CS Graduate', '/projects');
            this.showPage('projects');
        } else if (page === 'home') {
            // Navigate to home page
            const url = section ? `/#${section}` : '/';
            history.pushState({ page: 'home', section }, 'Henry Vu - Dallas Computer Science Graduate Student at UTDallas | ML & AI Portfolio', url);
            this.showPage('home');
            
            // Scroll to section if specified
            if (section) {
                setTimeout(() => {
                    const targetSection = document.getElementById(section);
                    if (targetSection) {
                        targetSection.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }, 100);
            }
        }
    }
};

// Global navigation functions
function navigateToProjects() {
    Router.navigateTo('projects');
}

function navigateToHome(section = null) {
    Router.navigateTo('home', section);
}

// Initialize router on DOM load
document.addEventListener('DOMContentLoaded', () => {
    Router.init();
});
