// Navigation mobile
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Gestion des dropdowns sur mobile
        const navDropdowns = navMenu.querySelectorAll('.nav-dropdown');
        
        navDropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.nav-dropdown-toggle');
            
            if (toggle) {
                toggle.addEventListener('click', function(e) {
                    // Sur mobile uniquement
                    if (window.innerWidth <= 768) {
                        // Si c'est un span (pas un lien direct), empêcher le comportement par défaut
                        if (toggle.tagName === 'SPAN') {
                            e.preventDefault();
                        }
                        // Fermer les autres dropdowns
                        navDropdowns.forEach(other => {
                            if (other !== dropdown) {
                                other.classList.remove('active');
                            }
                        });
                        dropdown.classList.toggle('active');
                    }
                });
            }
        });

        // Fermer le menu au clic sur un lien de mega menu
        const megaItems = navMenu.querySelectorAll('.nav-mega-item');
        megaItems.forEach(item => {
            item.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                navDropdowns.forEach(dropdown => dropdown.classList.remove('active'));
            });
        });
    }

    // Formulaire de contact avec Formsubmit
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');

    if (contactForm && formSuccess) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Envoi en cours...';
            submitBtn.disabled = true;
            
            try {
                const formData = new FormData(contactForm);
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    contactForm.style.display = 'none';
                    formSuccess.style.display = 'block';
                    contactForm.reset();
                } else {
                    throw new Error('Erreur lors de l\'envoi');
                }
            } catch (error) {
                alert('Une erreur est survenue. Veuillez réessayer ou nous contacter directement par email à contact@elmformations.fr');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // Smooth scroll pour les ancres
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 120;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll animations - all animated elements
    const animatedElements = document.querySelectorAll('.fade-in, .slide-left, .slide-right, .scale-in');
    
    if (animatedElements.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };

        const animObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        animatedElements.forEach(el => animObserver.observe(el));
    }

    // Counter animation for numbers
    const countElements = document.querySelectorAll('.count-up');
    
    if (countElements.length > 0) {
        const countObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted');
                    animateCounter(entry.target);
                }
            });
        }, { threshold: 0.5 });

        countElements.forEach(el => countObserver.observe(el));
    }

    function animateCounter(element) {
        const text = element.textContent;
        const hasPlus = text.includes('+');
        const hasPercent = text.includes('%');
        const target = parseInt(text.replace(/[^0-9]/g, ''));
        
        if (isNaN(target)) return;
        
        const duration = 1500;
        const steps = 40;
        const stepDuration = duration / steps;
        let current = 0;
        const increment = target / steps;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            let display = Math.floor(current);
            if (hasPlus) display += '+';
            if (hasPercent) display += '%';
            element.textContent = display;
        }, stepDuration);
    }
});