document.addEventListener('DOMContentLoaded', function () {
    // Inicjalizacja ScrollReveal
    ScrollReveal().reveal('.gallery-container, .contact-container, .contact-map, #offer', {
        distance: '20px',
        duration: 1000,
        easing: 'ease-in-out',
        origin: 'bottom',
        opacity: 0,
        interval: 200,
        reset: true
    });

    // Dodanie funkcji płynnego przewijania dla linków w menu
    const menuItems = document.querySelectorAll('.desktop-menu');
  menuItems.forEach(item => {
      item.addEventListener('click', function() {
          const targetText = this.textContent.toLowerCase();
          let targetId = '';

          if (targetText === 'oferta') {
              targetId = '#offer';
          } else if (targetText === 'galeria') {
              targetId = '#gallery';
          } else if (targetText === 'kontakt') {
              targetId = '#contact';
          } else if (targetText === 'mapa') {
              targetId = '.contact-map'; 
          }

          if (targetId) {
              const targetSection = document.querySelector(targetId);
              if (targetSection) {
                  targetSection.scrollIntoView({
                      behavior: 'smooth'
                  });
              }
          }
      });
  });

    // Initialize Carousels
    const carousels = document.querySelectorAll('.gallery-carousel');

    carousels.forEach((carousel) => {
        const prevButton = carousel.querySelector('.carousel-control-prev');
        const nextButton = carousel.querySelector('.carousel-control-next');
        const carouselInner = carousel.querySelector('.carousel-inner');
        const items = carouselInner.querySelectorAll('.carousel-item');
        const indicators = carousel.querySelectorAll('.carousel-indicators button');

        let currentIndex = 0;

        function updateCarousel() {
            items.forEach((item, index) => {
                item.style.transform = `translateX(-${currentIndex * 100}%)`;
            });

            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentIndex);
            });
        }

        function goToIndex(index) {
            currentIndex = (index + items.length) % items.length;
            updateCarousel();
        }

        prevButton.addEventListener('click', () => goToIndex(currentIndex - 1));
        nextButton.addEventListener('click', () => goToIndex(currentIndex + 1));

        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => goToIndex(index));
        });

        let touchstartX = 0;
        let touchendX = 0;

        carouselInner.addEventListener('touchstart', (event) => {
            touchstartX = event.changedTouches[0].screenX;
        });

        carouselInner.addEventListener('touchend', (event) => {
            touchendX = event.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            if (touchendX < touchstartX) {
                goToIndex(currentIndex + 1);
            }
            if (touchendX > touchstartX) {
                goToIndex(currentIndex - 1);
            }
        }

        updateCarousel();
    });
});