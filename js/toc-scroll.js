// Table of Contents scroll behavior enhancement
document.addEventListener('DOMContentLoaded', function() {
  // Select all headings in the main content
  const headings = document.querySelectorAll('.page__content h1, .page__content h2, .page__content h3');
  const tocLinks = document.querySelectorAll('.toc-list a');
  let toc = document.querySelector('.toc-wrapper');
  
  // Get offset for determining which section is active
  let headerOffset = 120;
  
  // Function to get visible sections in viewport
  function getVisibleSections() {
    const visibleSections = [];
    const scrollPosition = window.scrollY + headerOffset;
    const windowHeight = window.innerHeight;
    
    headings.forEach(heading => {
      const topPosition = heading.getBoundingClientRect().top + window.scrollY;
      const bottomPosition = topPosition + heading.offsetHeight;
      
      // Check if the heading is currently visible in the viewport
      if ((topPosition < (scrollPosition + windowHeight)) && 
          (bottomPosition > scrollPosition)) {
        visibleSections.push(heading.id);
      }
    });
    
    return visibleSections;
  }
  
  // Function to get parent heading text
  function getParentHeadingText(element) {
    // Try to find the nearest previous heading
    let current = element;
    while (current && current.tagName !== 'H1') {
      current = current.previousElementSibling;
      if (current && (current.tagName === 'H1' || current.tagName === 'H2')) {
        return current.textContent.trim();
      }
    }
    return null;
  }
  
  // Function to position TOC based on window width and align with #Supervisors heading
  function positionToc() {
    if (!toc) return;
    
    let headerHeight = document.querySelector('header').offsetHeight;
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Find the Supervisors heading to align TOC with it
    const supervisorsHeading = document.querySelector('.page__content h1');
    
    if (supervisorsHeading) {
      // Calculate the top position of the Supervisors heading
      const headingTop = supervisorsHeading.getBoundingClientRect().top + window.scrollY;
      
      // Set TOC top position to match the heading
      toc.style.top = (headingTop) + 'px';
      
      // Adjust TOC top position when scrolling past the header
      if (scrollTop > (headingTop - headerHeight - 20)) {
        toc.style.top = (headerHeight + 20) + 'px';
      }
    } else {
      // Fallback if heading not found
      if (scrollTop > headerHeight) {
        toc.style.top = (headerHeight + 20) + 'px';
      } else {
        toc.style.top = '110px'; // Default position
      }
    }
    
    // Handle window width for TOC positioning
    const windowWidth = window.innerWidth;
    const container = document.querySelector('.container');
    
    if (windowWidth > 1500 && container) {
      // For very large screens, position relative to the main container
      const containerRect = container.getBoundingClientRect();
      const rightEdge = containerRect.right;
      toc.style.right = 'calc(50% - 700px)'; // Match the media query
    }
  }
  
  if (toc) {
    // Position TOC initially and on resize
    positionToc();
    window.addEventListener('resize', function() {
      // Use requestAnimationFrame for better performance during resize
      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(positionToc);
      } else {
        positionToc();
      }
    });
    
    // Make sure TOC is visible and scrollable
    window.addEventListener('scroll', function() {
      // Add a small debounce to avoid performance issues
      if (!window.requestAnimationFrame) {
        return;
      }
      
      window.requestAnimationFrame(function() {
        positionToc();
        
        // Get all currently visible sections
        const visibleSections = getVisibleSections();
        
        // Get the current main section (first visible in the list)
        let currentSection = visibleSections.length > 0 ? visibleSections[0] : null;
        
        if (currentSection) {
          // First, remove active class from all links
          tocLinks.forEach(link => {
            link.classList.remove('active');
          });
          
          // Context info to disambiguate sections with same name
          const currentHeadingElement = document.getElementById(currentSection);
          const parentContext = currentHeadingElement ? getParentHeadingText(currentHeadingElement) : null;
          
          // Find all links that might match this section
          tocLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.includes(currentSection)) {
              // Check if we need to disambiguate (for sections with same name)
              const linkText = link.textContent.trim();
              const linkParent = link.closest('li').parentElement.closest('li');
              const linkParentText = linkParent ? linkParent.querySelector('a').textContent.trim() : null;
              
              // Set as active if it matches the section and context (if available)
              if (!parentContext || !linkParentText || linkParentText.includes(parentContext)) {
                link.classList.add('active');
              }
            }
          });
          
          // If no links were activated, just highlight the first match
          const anyActive = Array.from(tocLinks).some(link => link.classList.contains('active'));
          if (!anyActive && currentSection) {
            const firstMatchingLink = Array.from(tocLinks).find(link => {
              const href = link.getAttribute('href');
              return href && href.includes(currentSection);
            });
            
            if (firstMatchingLink) {
              firstMatchingLink.classList.add('active');
            }
          }
        }
      });
    });
    
    // Add click event to smooth scroll when clicking TOC links
    tocLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          // Calculate header height dynamically
          let headerHeight = document.querySelector('header').offsetHeight;
          
          window.scrollTo({
            top: targetElement.offsetTop - headerHeight - 20,
            behavior: 'smooth'
          });
          
          // Update URL hash without jumping
          history.pushState(null, null, targetId);
          
          // Set this link as active
          tocLinks.forEach(l => l.classList.remove('active'));
          this.classList.add('active');
        }
      });
    });
    
    // Initial check on page load
    setTimeout(function() {
      // Run positioning function explicitly first
      positionToc();
      // Then trigger scroll event for any other scroll-based behaviors
      window.dispatchEvent(new Event('scroll'));
    }, 200); // Slightly longer timeout to ensure page elements are rendered
  }
});
