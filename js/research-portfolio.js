/**
 * Academic Portfolio Research Page JavaScript
 * Handles expandable project cards and smooth animations
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeResearchPortfolio();
});

function initializeResearchPortfolio() {
    const expandableCards = document.querySelectorAll('.project-card.expandable');
    
    expandableCards.forEach(card => {
        setupExpandableCard(card);
    });
    
    // Add smooth scroll behavior for better UX
    addSmoothScrolling();
    
    // Add intersection observer for animations
    addScrollAnimations();
}

function setupExpandableCard(card) {
    const header = card.querySelector('.project-header');
    const content = card.querySelector('.project-content');
    const expandIcon = card.querySelector('.expand-icon');
    
    if (!header || !content || !expandIcon) return;
    
    // Set initial state
    content.style.maxHeight = '0px';
    
    // Add click event listener
    header.addEventListener('click', function(e) {
        e.preventDefault();
        toggleCard(card, content, expandIcon);
    });
    
    // Add keyboard accessibility
    header.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleCard(card, content, expandIcon);
        }
    });
    
    // Make header focusable
    header.setAttribute('tabindex', '0');
    header.setAttribute('role', 'button');
    header.setAttribute('aria-expanded', 'false');
    
    // Add ARIA labels for accessibility
    const title = card.querySelector('.project-title').textContent;
    header.setAttribute('aria-label', `Expand details for ${title}`);
}

function toggleCard(card, content, expandIcon) {
    const isExpanded = card.classList.contains('expanded');
    const header = card.querySelector('.project-header');
    
    if (isExpanded) {
        // Collapse the card
        content.style.maxHeight = '0px';
        card.classList.remove('expanded');
        header.setAttribute('aria-expanded', 'false');
        
        // Update expand icon with animation
        expandIcon.style.transform = 'rotate(0deg)';
        
        // Update aria-label
        const title = card.querySelector('.project-title').textContent;
        header.setAttribute('aria-label', `Expand details for ${title}`);
        
    } else {
        // Collapse any other expanded cards first (accordion behavior)
        collapseOtherCards(card);
        
        // Expand the card
        const scrollHeight = content.scrollHeight;
        content.style.maxHeight = scrollHeight + 'px';
        card.classList.add('expanded');
        header.setAttribute('aria-expanded', 'true');
        
        // Update expand icon with animation
        expandIcon.style.transform = 'rotate(90deg)';
        
        // Update aria-label
        const title = card.querySelector('.project-title').textContent;
        header.setAttribute('aria-label', `Collapse details for ${title}`);
        
        // Smooth scroll to the card after a short delay
        setTimeout(() => {
            scrollToCard(card);
        }, 200);
    }
}

function collapseOtherCards(currentCard) {
    const allExpandableCards = document.querySelectorAll('.project-card.expandable');
    
    allExpandableCards.forEach(card => {
        if (card !== currentCard && card.classList.contains('expanded')) {
            const content = card.querySelector('.project-content');
            const expandIcon = card.querySelector('.expand-icon');
            const header = card.querySelector('.project-header');
            
            content.style.maxHeight = '0px';
            card.classList.remove('expanded');
            header.setAttribute('aria-expanded', 'false');
            expandIcon.style.transform = 'rotate(0deg)';
            
            // Update aria-label
            const title = card.querySelector('.project-title').textContent;
            header.setAttribute('aria-label', `Expand details for ${title}`);
        }
    });
}

function scrollToCard(card) {
    const cardRect = card.getBoundingClientRect();
    const isVisible = cardRect.top >= 0 && cardRect.bottom <= window.innerHeight;
    
    if (!isVisible) {
        card.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
        });
    }
}

function addSmoothScrolling() {
    // Add smooth scrolling to any internal links
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function addScrollAnimations() {
    // Create intersection observer for fade-in animations
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        }
    );
    
    // Observe all project cards for animations
    const cards = document.querySelectorAll('.project-card');
    cards.forEach((card, index) => {
        // Set initial state for animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        
        observer.observe(card);
    });
    
    // Observe year labels
    const yearLabels = document.querySelectorAll('.year-label');
    yearLabels.forEach((label, index) => {
        label.style.opacity = '0';
        label.style.transform = 'translateX(-20px)';
        label.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
        
        observer.observe(label);
    });
}

// Utility function to handle window resize events
function handleResize() {
    const expandedCards = document.querySelectorAll('.project-card.expanded');
    
    expandedCards.forEach(card => {
        const content = card.querySelector('.project-content');
        if (content) {
            // Recalculate max-height on resize
            content.style.maxHeight = 'none';
            const height = content.scrollHeight;
            content.style.maxHeight = height + 'px';
        }
    });
}

// Add resize event listener with debounce
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleResize, 250);
});

// Export functions for potential external use
window.ResearchPortfolio = {
    init: initializeResearchPortfolio,
    toggleCard: toggleCard,
    collapseOtherCards: collapseOtherCards
};
