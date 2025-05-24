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

// Add active class to navigation links on scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

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
                }, 600);
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
                return;
            }
        } else if (phase === 'pausing') {
            return;
        }
        
        element.textContent = currentText;
        
        let speed = 60;
        if (phase === 'deleting') {
            speed = 60;
        } else if (phase === 'typing-correct') {
            speed = 80;
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
    });
}
