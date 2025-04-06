/**
 * Certificates Lightbox
 * Handles certificate gallery and lightbox functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    const certificateItems = document.querySelectorAll('.certificate-img');
    const lightbox = document.getElementById('certificate-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    let currentIndex = 0;
    const certificates = [];

    // Collect all certificate images and titles
    certificateItems.forEach((item, index) => {
        const img = item.querySelector('img');
        const title = item.closest('.certificate-item').querySelector('.certificate-title').textContent;

        certificates.push({
            src: img.src,
            alt: img.alt,
            title: title
        });

        // Open lightbox when clicking on a certificate
        item.addEventListener('click', function() {
            openLightbox(index);
        });
    });

    // Open lightbox with specific image
    function openLightbox(index) {
        currentIndex = index;
        updateLightboxContent();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    // Update lightbox content
    function updateLightboxContent() {
        const certificate = certificates[currentIndex];

        // Create new image and add load event to ensure smooth transitions
        const newImg = new Image();
        newImg.src = certificate.src;

        newImg.onload = function() {
            lightboxImg.src = certificate.src;
            lightboxImg.alt = certificate.alt;
            lightboxCaption.textContent = certificate.title;
        };

        // Pre-load adjacent images for smoother navigation
        if (currentIndex > 0) {
            const preloadPrev = new Image();
            preloadPrev.src = certificates[currentIndex - 1].src;
        }

        if (currentIndex < certificates.length - 1) {
            const preloadNext = new Image();
            preloadNext.src = certificates[currentIndex + 1].src;
        }
    }

    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling

        // Reset src to reduce memory usage
        setTimeout(() => {
            if (!lightbox.classList.contains('active')) {
                lightboxImg.src = '';
            }
        }, 300);
    }

    // Navigate to previous image
    function prevImage() {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : certificates.length - 1;
        updateLightboxContent();
    }

    // Navigate to next image
    function nextImage() {
        currentIndex = (currentIndex < certificates.length - 1) ? currentIndex + 1 : 0;
        updateLightboxContent();
    }

    // Event listeners
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', prevImage);
    lightboxNext.addEventListener('click', nextImage);

    // Close when clicking outside the image
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            prevImage();
        } else if (e.key === 'ArrowRight') {
            nextImage();
        }
    });

    // Prevent image dragging
    lightboxImg.addEventListener('dragstart', function(e) {
        e.preventDefault();
    });

    // Add touch support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });

    lightbox.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;

        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left - next image
            nextImage();
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right - previous image
            prevImage();
        }
    }
});