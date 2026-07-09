document.addEventListener('DOMContentLoaded', function () {

  // Event dla menu-toggle
  const mobileMenuToggle = document.querySelector('.menu-toggle'); // Upewnij się, że to odpowiada Twojemu przyciskowi menu
  const mobileMenu = document.querySelector('.menu .list'); // Upewnij się, że to odpowiada Twojemu menu

  $(document).ready(function () {
      // Obsługa mobilnego menu
      $('.menu').on('click', function () {
          $('.menu .list').toggleClass('hidden');
      });
  
      $(document).on('click', function (event) {
          if (!$(event.target).closest('.menu').length) {
              $('.menu .list').addClass('hidden');
          }
      });

  // Inicjalizacja ScrollReveal
  ScrollReveal().reveal('.gallery-container, .contact-container, .contact-map, #offer', {
      distance: '20px',
      duration: 1000,
      easing: 'ease-in-out',
      origin: 'bottom',
      opacity: 0,
      interval: 200,
      reset: true // Reset animacji po przewinięciu z powrotem
  });

  console.log('ScrollReveal is loaded and ready to use.');

  // Dodanie funkcji płynnego przewijania dla linków w menu
  const menuItems = document.querySelectorAll('.menu .list li');
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

      // Update Carousel
      function updateCarousel() {
          items.forEach((item, index) => {
              item.style.transform = `translateX(-${currentIndex * 100}%)`;
          });

          indicators.forEach((indicator, index) => {
              indicator.classList.toggle('active', index === currentIndex);
          });
      }

      // Go to specific index
      function goToIndex(index) {
          currentIndex = (index + items.length) % items.length;
          updateCarousel();
      }

      // Event Listeners for Controls
      prevButton.addEventListener('click', () => goToIndex(currentIndex - 1));
      nextButton.addEventListener('click', () => goToIndex(currentIndex + 1));

      // Event Listeners for Indicators
      indicators.forEach((indicator, index) => {
          indicator.addEventListener('click', () => goToIndex(index));
      });

      // Touch events for mobile
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
              goToIndex(currentIndex + 1); // Swipe left
          }
          if (touchendX > touchstartX) {
              goToIndex(currentIndex - 1); // Swipe right
          }
      }

      // Initialize
      updateCarousel();
  });
});

console.log(ScrollReveal);
});