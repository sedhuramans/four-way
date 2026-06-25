/* GitHub Pages Fallback JavaScript */

// Simple mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Simple reveal animation on scroll
    const revealElements = document.querySelectorAll('.reveal-up');
    
    function reveal() {
        revealElements.forEach(element => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', reveal);
    reveal(); // Check on load
});

// Demo alert function
function showDemoAlert() {
    alert('🚀 This is a GitHub Pages demo version!\n\nFor full functionality including:\n• Real order processing\n• Database integration\n• Payment handling\n• Owner portal management\n• Real-time order tracking\n\nContact us at sales@fourwaysint.com for the complete system deployment!');
}

// Contact form handler
function handleContactForm(event) {
    if (event) event.preventDefault();
    
    const name = document.getElementById('name')?.value || '';
    const email = document.getElementById('email')?.value || '';
    const interest = document.getElementById('interest')?.value || 'general';
    const message = document.getElementById('message')?.value || '';
    
    // Create mailto link
    const subject = `Inquiry about ${interest} - ${name}`;
    const body = `Name: ${name}\nEmail: ${email}\nInterest: ${interest}\n\nMessage:\n${message}`;
    const mailtoLink = `mailto:sales@fourwaysint.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Show confirmation
    alert('Thank you for your inquiry! Your email client will open with the message pre-filled.');
}

// Simple product filtering
function initProductFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            productCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initProductFilters();
});

// Global functions for inline handlers
window.showDemoAlert = showDemoAlert;
window.handleContactForm = handleContactForm;