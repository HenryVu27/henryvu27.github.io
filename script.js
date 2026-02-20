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

        // Show checkmark on submit
        const submitIcon = contactForm.querySelector('.submit-btn i');
        if (submitIcon) {
            submitIcon.classList.remove('fa-paper-plane');
            submitIcon.classList.add('fa-check', 'submitted');
        }
    });
}

// Theme switching functionality - Light/Dark toggle
const themes = [
    { key: 'morning-fog', name: 'Light', icon: 'fa-sun' },
    { key: 'piano-symphony', name: 'Dark', icon: 'fa-moon' }
];

document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.querySelector('.theme-toggle-icon');
    const themeToggleLi = document.querySelector('.theme-toggle-btn');
    const root = document.documentElement;
    let currentThemeIndex = 0;

    // Default to morning-fog (light) unless user has previously selected a theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && themes.some(t => t.key === savedTheme)) {
        currentThemeIndex = themes.findIndex(t => t.key === savedTheme);
    } else {
        currentThemeIndex = 0; // morning-fog (light) is default
        root.setAttribute('data-theme', themes[0].key);
        localStorage.setItem('theme', themes[0].key);
    }
    root.setAttribute('data-theme', themes[currentThemeIndex].key);

    // Update icon based on current theme
    const updateIcon = () => {
        const icon = themeToggleBtn.querySelector('i');
        if (icon) {
            icon.className = 'fas ' + (currentThemeIndex === 0 ? 'fa-moon' : 'fa-sun');
        }
    };
    updateIcon();

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            // Toggle between light and dark
            currentThemeIndex = currentThemeIndex === 0 ? 1 : 0;
            const theme = themes[currentThemeIndex];
            root.setAttribute('data-theme', theme.key);
            localStorage.setItem('theme', theme.key);
            updateIcon();
        });
    }
});

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

// Fade-in for project cards
(function() {
    const projects = document.querySelectorAll('.project-card.fade-in-project');
    if (!projects.length) return;
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry, idx) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, idx * 50);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    projects.forEach(p => observer.observe(p));
})();

// Filter tabs
(function() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const projectCards = document.querySelectorAll('.project-card');
    if (!filterTabs.length) return;

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const filter = tab.dataset.filter;

            // Update active tab
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Filter cards with animation
            let visibleIndex = 0;
            projectCards.forEach(card => {
                const show = filter === 'all' || card.dataset.category === filter;
                if (show) {
                    card.classList.remove('hidden');
                    card.style.animation = 'none';
                    card.offsetHeight; // trigger reflow
                    card.style.animation = '';
                    card.style.animationDelay = `${visibleIndex * 40}ms`;
                    card.classList.add('card-animate');
                    visibleIndex++;
                } else {
                    card.classList.add('hidden');
                    card.classList.remove('card-animate');
                }
            });
        });
    });
})();
