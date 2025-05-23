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
        
        if (pageYOffset >= sectionTop - 200) {
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
    const correctText = "statistical models.";
    
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
