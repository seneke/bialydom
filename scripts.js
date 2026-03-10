document.addEventListener('DOMContentLoaded', function () {
  /* =========================
     MOBILE MENU (hamburger)
     ========================= */
  const menuToggle = document.querySelector('.mobile-nav-toggle');
  const mobileMenu = document.querySelector('#mobile-menu');

  const isMenuOpen = () => mobileMenu && mobileMenu.classList.contains('is-open');

  const openMenu = () => {
    if (!menuToggle || !mobileMenu) return;
    mobileMenu.classList.add('is-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
  };

  const closeMenu = () => {
    if (!menuToggle || !mobileMenu) return;
    mobileMenu.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  };

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      if (isMenuOpen()) closeMenu();
      else openMenu();
    });

    // zamknij po kliknięciu w link
    mobileMenu.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', closeMenu);
    });

    // zamknij po kliknięciu poza menu
    document.addEventListener('click', function (event) {
      if (!isMenuOpen()) return;
      if (menuToggle.contains(event.target)) return;
      if (mobileMenu.contains(event.target)) return;
      closeMenu();
    });

    // na większych ekranach zawsze zamknięte
    window.addEventListener('resize', function () {
      if (window.innerWidth > 768) closeMenu();
    });
  }

  /* =========================
     ScrollReveal
     ========================= */
  if (typeof ScrollReveal === 'function') {
    ScrollReveal().reveal('.gallery-container, .contact-container, .contact-map, #offer', {
      distance: '20px',
      duration: 1000,
      easing: 'ease-in-out',
      origin: 'bottom',
      opacity: 0,
      interval: 200,
      reset: false
    });
  }

  /* =========================
     Smooth scroll dla a[href^="#"]
     ========================= */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', function (e) {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* =========================
     Magnific Popup (jQuery)
     ========================= */
  if (typeof window.jQuery !== 'undefined' && typeof jQuery.fn.magnificPopup === 'function') {
    jQuery(function ($) {
      $('.gallery-container, .gallery').each(function () {
        $(this).find('.image-popup').magnificPopup({
          type: 'image',
          gallery: { enabled: true, navigateByImgClick: true, preload: [0, 2] },
          zoom: { enabled: false },
          closeOnContentClick: true,
          closeBtnInside: true,
          mainClass: 'mfp-no-zoom',
          disableOn: 0
        });
      });
    });
  }

  /* =========================
     Carousels
     ========================= */
  const carousels = document.querySelectorAll('.gallery-carousel');

  carousels.forEach((carousel) => {
    const prevButton = carousel.querySelector('.carousel-control-prev');
    const nextButton = carousel.querySelector('.carousel-control-next');
    const carouselInner = carousel.querySelector('.carousel-inner');
    if (!prevButton || !nextButton || !carouselInner) return;

    const items = carouselInner.querySelectorAll('.carousel-item');
    if (!items.length) return;

    const indicators = carousel.querySelectorAll('.carousel-indicators button');
    let currentIndex = 0;

    const firstClone = items[0].cloneNode(true);
    const lastClone = items[items.length - 1].cloneNode(true);

    carouselInner.appendChild(firstClone);
    carouselInner.insertBefore(lastClone, items[0]);

    carouselInner.style.transform = 'translateX(-100%)';

    function updateIndicators(index) {
      indicators.forEach((indicator, idx) => {
        indicator.classList.toggle('active', idx === index);
      });
    }

    function updateCarousel(index) {
      carouselInner.style.transition = 'transform 0.5s ease-in-out';
      carouselInner.style.transform = `translateX(-${(index + 1) * 100}%)`;
      updateIndicators(Math.max(0, Math.min(index, items.length - 1)));
    }

    carouselInner.addEventListener('transitionend', () => {
      if (currentIndex === -1) {
        carouselInner.style.transition = 'none';
        currentIndex = items.length - 1;
        carouselInner.style.transform = `translateX(-${(currentIndex + 1) * 100}%)`;
        updateIndicators(currentIndex);
      }

      if (currentIndex === items.length) {
        carouselInner.style.transition = 'none';
        currentIndex = 0;
        carouselInner.style.transform = 'translateX(-100%)';
        updateIndicators(0);
      }
    });

    function goToIndex(index) {
      currentIndex = index;
      updateCarousel(currentIndex);
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
      if (touchendX < touchstartX) goToIndex(currentIndex + 1);
      if (touchendX > touchstartX) goToIndex(currentIndex - 1);
    });

    updateCarousel(0);
  });

  /* =========================
     Header: is-scrolled
     ========================= */
  (function () {
  const header = document.querySelector('header');
  const homeHero = document.querySelector('.background-container');
  const galleryHero = document.querySelector('.gallery-page-hero');
  const hero = homeHero || galleryHero;

  if (!header || !hero) return;

  function updateHeader() {

  let trigger;

  if (homeHero) {
    // STRONA GŁÓWNA – szybciej pojawia się tło
    trigger = homeHero.offsetHeight - header.offsetHeight - 700;
  } else if (galleryHero) {
    // STRONA GALERII – zostaje jak było
    trigger = galleryHero.offsetTop + galleryHero.offsetHeight - header.offsetHeight - 1;
  }

  if (window.scrollY > trigger) {
    header.classList.add('is-scrolled');
  } else {
    header.classList.remove('is-scrolled');
  }
  }

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
  window.addEventListener('resize', updateHeader);
})();
});

function disableParallaxOnMobile() {
  if (window.innerWidth <= 768) {
    document.querySelectorAll('.parallax-mirror').forEach(el => el.remove());
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const fab = document.querySelector('.contact-fab');
  const toggle = document.getElementById('contactFabToggle');

  if (!fab || !toggle) return;

  toggle.addEventListener('click', function (e) {
    e.stopPropagation();
    fab.classList.toggle('active');
  });

  document.addEventListener('click', function (e) {
    if (!fab.contains(e.target)) {
      fab.classList.remove('active');
    }
  });
});

disableParallaxOnMobile();
window.addEventListener('resize', disableParallaxOnMobile);


