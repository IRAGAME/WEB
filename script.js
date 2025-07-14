// SPOOA-PM AFRICA SAFE ANESTHESIA - Script principal

document.addEventListener('DOMContentLoaded', function() {
    
    // Animation au scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observer les éléments pour l'animation
    document.querySelectorAll('.service-card, .stat-item, .section-title').forEach(el => {
        observer.observe(el);
    });

    // Navigation smooth scroll
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

    // Navbar active state
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Counter animation for stats
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }
        updateCounter();
    }

    // Trigger counter animation when stats are visible
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('h3');
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.textContent);
                    if (!isNaN(target)) {
                        animateCounter(stat, target);
                    }
                });
                statsObserver.unobserve(entry.target);
            }
        });
    });

    document.querySelectorAll('.stats').forEach(statSection => {
        statsObserver.observe(statSection);
    });

    // Form validation and submission
    const contactForm = document.querySelector('#contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Basic validation
            const name = document.getElementById('nom');
            const email = document.getElementById('email');
            const message = document.getElementById('message');
            const sujet = document.getElementById('sujet');
            
            if (!name.value.trim() || !email.value.trim() || !message.value.trim() || !sujet.value) {
                showNotification('Veuillez remplir tous les champs obligatoires.', 'error');
                return;
            }
            
            if (!isValidEmail(email.value)) {
                showNotification('Veuillez entrer une adresse email valide.', 'error');
                return;
            }
            
            // Collect form data
            const formData = {
                nom: name.value.trim(),
                email: email.value.trim(),
                telephone: document.getElementById('telephone')?.value || '',
                pays: document.getElementById('pays')?.value || '',
                sujet: sujet.value,
                message: message.value.trim(),
                newsletter: document.getElementById('newsletter')?.checked || false
            };
            
            try {
                // Show loading state
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Envoi en cours...';
                submitBtn.disabled = true;
                
                // Send to backend
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showNotification(result.message, 'success');
                    contactForm.reset();
                } else {
                    showNotification(result.message, 'error');
                }
                
            } catch (error) {
                console.error('Erreur:', error);
                showNotification('Erreur de connexion. Veuillez réessayer.', 'error');
            } finally {
                // Reset button state
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type === 'error' ? 'danger' : type === 'success' ? 'success' : 'info'} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    // Mobile menu toggle enhancement
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', function() {
            navbarCollapse.classList.toggle('show');
        });
        
        // Close mobile menu when clicking on a link
        document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth < 992) {
                    navbarCollapse.classList.remove('show');
                }
            });
        });
    }

    // Back to top button
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.className = 'btn btn-primary position-fixed';
    backToTopBtn.style.cssText = 'bottom: 20px; right: 20px; z-index: 1000; width: 50px; height: 50px; border-radius: 50%; display: none;';
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    document.body.appendChild(backToTopBtn);
    
    // Show/hide back to top button
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });

    // Preloader
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        });
    }

    // Lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    console.log('SPOOA-PM AFRICA SAFE ANESTHESIA - Application chargée avec succès !');
    
    // Fonction pour changer le background
    function changeBackground(variant) {
        const body = document.body;
        body.className = ''; // Supprime toutes les classes existantes
        body.classList.add(`bg-variant-${variant}`);
    }
    
    // Expose la fonction globalement pour pouvoir l'utiliser dans la console
    window.changeBackground = changeBackground;
    
    // Ajoute des boutons de changement de background (optionnel)
    function addBackgroundSwitcher() {
        const switcher = document.createElement('div');
        switcher.innerHTML = `
            <div style="position: fixed; top: 10px; left: 10px; z-index: 9999; background: rgba(255,255,255,0.9); padding: 10px; border-radius: 8px; font-size: 12px;">
                <strong>Background:</strong><br>
                <button onclick="changeBackground(1)" style="margin: 2px; padding: 4px 8px; font-size: 10px;">1</button>
                <button onclick="changeBackground(2)" style="margin: 2px; padding: 4px 8px; font-size: 10px;">2</button>
                <button onclick="changeBackground(3)" style="margin: 2px; padding: 4px 8px; font-size: 10px;">3</button>
                <button onclick="changeBackground(4)" style="margin: 2px; padding: 4px 8px; font-size: 10px;">4</button>
                <button onclick="changeBackground(5)" style="margin: 2px; padding: 4px 8px; font-size: 10px;">5</button>
                <button onclick="changeBackground(6)" style="margin: 2px; padding: 4px 8px; font-size: 10px;">6</button>
                <button onclick="changeBackground(7)" style="margin: 2px; padding: 4px 8px; font-size: 10px;">7</button>
                <button onclick="changeBackground(8)" style="margin: 2px; padding: 4px 8px; font-size: 10px;">8</button>
                <button onclick="changeBackground(9)" style="margin: 2px; padding: 4px 8px; font-size: 10px;">9</button>
                <button onclick="changeBackground(10)" style="margin: 2px; padding: 4px 8px; font-size: 10px;">10</button>
            </div>
        `;
        document.body.appendChild(switcher);
    }
    
    // Décommentez la ligne suivante pour activer le sélecteur de background
    // addBackgroundSwitcher();
}); 