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

// News Card Image Slider
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all news card image sliders
    const newsImageSliders = document.querySelectorAll('.news-card__image .image-slider');
    
    newsImageSliders.forEach(slider => {
        initializeNewsSlider(slider);
    });
    
    function initializeNewsSlider(sliderContainer) {
        const slides = sliderContainer.querySelectorAll('.slide');
        const prevBtn = sliderContainer.querySelector('.nav-arrow.prev');
        const nextBtn = sliderContainer.querySelector('.nav-arrow.next');
        const indicators = sliderContainer.querySelectorAll('.slide-indicators .indicator');
        
        if (slides.length <= 1) {
            // Hide navigation elements if there's only one slide or no slides
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
            if (sliderContainer.querySelector('.slide-indicators')) {
                sliderContainer.querySelector('.slide-indicators').style.display = 'none';
            }
            return;
        }
        
        let currentSlideIndex = 0;
        let autoSlideInterval;
        
        // Set first slide as active
        slides[0].classList.add('active');
        if (indicators.length > 0) indicators[0].classList.add('active');
        
        function goToSlide(index) {
            // Remove active classes
            slides[currentSlideIndex].classList.remove('active');
            if (indicators[currentSlideIndex]) {
                indicators[currentSlideIndex].classList.remove('active');
            }
            
            // Update current index
            currentSlideIndex = index;
            
            // Add active classes
            slides[currentSlideIndex].classList.add('active');
            if (indicators[currentSlideIndex]) {
                indicators[currentSlideIndex].classList.add('active');
            }
        }
        
        function nextSlide() {
            const nextIndex = (currentSlideIndex + 1) % slides.length;
            goToSlide(nextIndex);
        }
        
        function prevSlide() {
            const prevIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
            goToSlide(prevIndex);
        }
        
        function startAutoSlide() {
            autoSlideInterval = setInterval(nextSlide, 7000); // Change slide every 5 seconds
        }
        
        function stopAutoSlide() {
            if (autoSlideInterval) {
                clearInterval(autoSlideInterval);
                autoSlideInterval = null;
            }
        }
        
        // Event listeners for navigation arrows
        if (nextBtn) {
            nextBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                stopAutoSlide();
                nextSlide();
                setTimeout(startAutoSlide, 3000); // Restart auto-slide after 3 seconds
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                stopAutoSlide();
                prevSlide();
                setTimeout(startAutoSlide, 3000); // Restart auto-slide after 3 seconds
            });
        }
        
        // Event listeners for indicators
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                stopAutoSlide();
                goToSlide(index);
                setTimeout(startAutoSlide, 3000); // Restart auto-slide after 3 seconds
            });
        });
        
        // Hover events to pause/resume auto-slide
        const newsCard = sliderContainer.closest('.news-card');
        if (newsCard) {
            newsCard.addEventListener('mouseenter', stopAutoSlide);
            newsCard.addEventListener('mouseleave', startAutoSlide);
        }
        
        // Start auto-slide
        startAutoSlide();
    }
});
