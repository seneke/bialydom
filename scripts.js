document.addEventListener('DOMContentLoaded', function () {

    // Inicjalizacja ScrollReveal
        ScrollReveal().reveal('.gallery-container, .contact-container, .contact-map, #offer', {
            distance: '20px',
            duration: 1000,
            easing: 'ease-in-out',
            origin: 'bottom',
            opacity: 0,
            interval: 200,
            reset: false // Reset animacji po przewinięciu z powrotem
        });
    
        // Dodanie funkcji płynnego przewijania dla linków w menu
        document.addEventListener('click', function(event) {
            const mobileMenuToggle = document.querySelector('.desktop-menu'); // Zmień selektor na odpowiedni
            const mobileMenu = document.querySelector('.desktop-menu .list'); // Upewnij się, że ten selektor odpowiada Twojemu menu
        
            // Sprawdź, czy kliknięcie miało miejsce na przycisku menu lub w menu
            if (!mobileMenuToggle.contains(event.target) && !mobileMenu.contains(event.target)) {
                // Jeśli nie, ustaw menu jako zamknięte
                mobileMenuToggle.classList.add('hidden'); // lub inna metoda ukrywania
            }
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
                    targetId = '#galeria';
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

        $(document).ready(function() {
            // Inicjalizacja Magnific Popup dla każdej galerii indywidualnie
            $('.gallery-container, .gallery').each(function() {
                $(this).find('.image-popup').magnificPopup({
                    type: 'image',
                    gallery: {
                        enabled: true, // Umożliwia przechodzenie między zdjęciami
                        navigateByImgClick: true, // Możliwość przechodzenia do zdjęcia po kliknięciu
                        preload: [0, 2] // Preload poprzedniego i następnego zdjęcia
                    },
                    zoom: {
                        enabled: false, // Wyłącza funkcję zoom (powiększania/pomniejszania)
                    },
                    closeOnContentClick: true, // Zamknięcie popupu po kliknięciu w zawartość
                    closeBtnInside: true, // Przycisk zamknięcia wewnątrz okna popup
                    mainClass: 'mfp-no-zoom', // Dodatkowa klasa, która wyłącza animacje zoom
                    disableOn: 0 // Ustawienie, by Magnific Popup działał na wszystkich ekranach
                });
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

            // Klonowanie pierwszego i ostatniego elementu
            const firstClone = items[0].cloneNode(true);
            const lastClone = items[items.length - 1].cloneNode(true);

            // Dodajemy klony do galerii
            carouselInner.appendChild(firstClone);
            carouselInner.insertBefore(lastClone, items[0]);

            // Aktualizujemy listę elementów
            const allItems = carouselInner.querySelectorAll('.carousel-item');
            const totalItems = allItems.length;

            // Ustawiamy początkową pozycję (pomijając klon na początku)
            carouselInner.style.transform = `translateX(-100%)`;
    
            // Funkcja do aktualizacji widoku
            function updateCarousel(index) {
                carouselInner.style.transition = 'transform 0.5s ease-in-out';
                carouselInner.style.transform = `translateX(-${(index + 1) * 100}%)`; // +1 dla uwzględnienia klona
            }

            // Obsługa zapętlania
            carouselInner.addEventListener('transitionend', () => {
            if (currentIndex === -1) {
                carouselInner.style.transition = 'none'; // Wyłączamy animację
                currentIndex = items.length - 1; // Przechodzimy na ostatni oryginalny element
                carouselInner.style.transform = `translateX(-${(currentIndex + 1) * 100}%)`;
            }
            if (currentIndex === items.length) {
                carouselInner.style.transition = 'none'; // Wyłączamy animację
                currentIndex = 0; // Przechodzimy na pierwszy oryginalny element
                carouselInner.style.transform = `translateX(-100%)`;
            }
            });
    
            // Go to specific index
            function goToIndex(index) {
                currentIndex = index;
                updateCarousel(currentIndex);
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