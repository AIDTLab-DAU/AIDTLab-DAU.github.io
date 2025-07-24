// Homepage About Section Slideshow
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.image-slideshow .slide');
    let currentSlide = 0;
    
    if (slides.length === 0) return;
    
    function showNextSlide() {
        // Remove active class from current slide
        slides[currentSlide].classList.remove('active');
        
        // Move to next slide
        currentSlide = (currentSlide + 1) % slides.length;
        
        // Add active class to new slide
        slides[currentSlide].classList.add('active');
    }
    
    // Start the slideshow - change image every 4 seconds
    setInterval(showNextSlide, 4000);
});
