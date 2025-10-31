// PR Floral Marketing - JavaScript

// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeGalleryFilters();
    initializeContactForm();
    initializeSmoothAnimations();
});

// Initialize navigation
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('data-section');
            navigateToSection(targetSection);
        });
    });

    // Handle hash changes (for direct URL navigation)
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash.slice(1);
        if (hash) {
            navigateToSection(hash);
        }
    });

    // Load correct section on page load
    const initialHash = window.location.hash.slice(1);
    if (initialHash && document.getElementById(initialHash)) {
        navigateToSection(initialHash);
    }
}

// Navigate to a specific section
function navigateToSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');

    // Hide all sections
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Remove active class from all nav links
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Add active class to corresponding nav link
        const activeLink = document.querySelector(`[data-section="${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // Update URL hash
        window.location.hash = sectionId;

        // Scroll to top of section
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Trigger animations for gallery items if navigating to gallery
        if (sectionId === 'gallery') {
            animateGalleryItems();
        }
    }
}

// Initialize gallery filters
function initializeGalleryFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');

            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Filter gallery items with animation
            galleryItems.forEach((item, index) => {
                const category = item.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    setTimeout(() => {
                        item.style.display = 'block';
                        item.style.animation = 'none';
                        setTimeout(() => {
                            item.style.animation = 'slideInUp 0.6s ease forwards';
                        }, 10);
                    }, index * 100);
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Animate gallery items
function animateGalleryItems() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, index) => {
        item.style.opacity = '0';
        setTimeout(() => {
            item.style.animation = 'slideInUp 0.6s ease forwards';
        }, index * 100);
    });
}

// Initialize contact form
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                service: document.getElementById('service').value,
                message: document.getElementById('message').value
            };

            // Validate form
            if (!formData.name || !formData.email || !formData.message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }

            // Show success message
            showNotification('Thank you for your message! We will get back to you soon.', 'success');

            // Reset form
            contactForm.reset();

            // Log form data (in production, this would be sent to a server)
            console.log('Form submitted:', formData);
        });
    }
}

// Show notification
function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? '#10B981' : '#E63946'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
        z-index: 2000;
        max-width: 90%;
        text-align: center;
        font-size: 0.9rem;
        animation: slideDown 0.3s ease;
    `;

    // Add to page
    document.body.appendChild(notification);

    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// Initialize smooth animations
function initializeSmoothAnimations() {
    // Add hover effects to service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add click animation to gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            // Add a pulse effect
            this.style.animation = 'pulse 0.5s ease';
            setTimeout(() => {
                this.style.animation = '';
            }, 500);
        });
    });

    // Add CSS for pulse animation
    if (!document.getElementById('dynamic-animations')) {
        const style = document.createElement('style');
        style.id = 'dynamic-animations';
        style.textContent = `
            @keyframes pulse {
                0%, 100% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.05);
                }
            }

            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }

            @keyframes slideUp {
                from {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-20px);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Add floating animation to logo on scroll
let lastScrollY = 0;
window.addEventListener('scroll', function() {
    const logo = document.querySelector('.main-logo');
    if (logo) {
        const scrollY = window.scrollY;
        const scrollDelta = scrollY - lastScrollY;
        
        if (Math.abs(scrollDelta) > 5) {
            logo.style.transform = `translateY(${scrollDelta * 0.1}px)`;
        }
        
        lastScrollY = scrollY;
    }
});

// Add parallax effect to floral patterns
window.addEventListener('scroll', function() {
    const floralPatterns = document.querySelectorAll('.floral-pattern');
    const scrollY = window.scrollY;
    
    floralPatterns.forEach((pattern, index) => {
        const speed = (index + 1) * 0.5;
        pattern.style.transform = `translateY(${scrollY * speed}px) rotate(${scrollY * 0.1}deg)`;
    });
});

// Expose navigateToSection globally for button onclick handlers
window.navigateToSection = navigateToSection;
