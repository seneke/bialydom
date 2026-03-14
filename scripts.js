/* =========================
   MOBILE MENU (hamburger)
   ========================= */
const menuToggle = document.querySelector('.mobile-nav-toggle');
const mobileMenu = document.querySelector('#mobile-menu-panel');

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

  mobileMenu.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', function (event) {
    if (!isMenuOpen()) return;
    if (menuToggle.contains(event.target)) return;
    if (mobileMenu.contains(event.target)) return;
    closeMenu();
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 1023) closeMenu();
  });
}

  /* =========================
     ScrollReveal
     ========================= */
  if (typeof ScrollReveal === 'function') {
    ScrollReveal().reveal('.gallery-container, .contact-container, .contact-map, #about', {
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

    const header = document.querySelector('header');
    const headerOffset = header ? header.offsetHeight : 0;

    let extraOffset = 20;

    if (href === '#gallery' || href === '#contact') {
      extraOffset = 30;
    }

    if (href === '#about-anchor') {
      extraOffset = 65;
    }

    const targetPosition =
      target.getBoundingClientRect().top + window.pageYOffset - headerOffset - extraOffset;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  });
});

/* ========================= Story accordion ========================= */
const featureItems = document.querySelectorAll('.feature-accordion .feature-item');

featureItems.forEach((item) => {
  item.addEventListener('toggle', function () {
    if (!item.open) return;

    featureItems.forEach((otherItem) => {
      if (otherItem !== item) {
        otherItem.removeAttribute('open');
      }
    });
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
  /* =========================
   Carousels
   ========================= */
const carousels = document.querySelectorAll('.gallery-carousel');

carousels.forEach((carousel) => {
  const prevButton = carousel.querySelector('.carousel-control-prev');
  const nextButton = carousel.querySelector('.carousel-control-next');
  const carouselInner = carousel.querySelector('.carousel-inner');

  if (!prevButton || !nextButton || !carouselInner) return;

  const originalItems = Array.from(carouselInner.querySelectorAll('.carousel-item'));
  if (!originalItems.length) return;

  const firstClone = originalItems[0].cloneNode(true);
  const lastClone = originalItems[originalItems.length - 1].cloneNode(true);

  carouselInner.appendChild(firstClone);
  carouselInner.insertBefore(lastClone, originalItems[0]);

  const allItems = () => carouselInner.querySelectorAll('.carousel-item');
  let currentIndex = 0;
  let isAnimating = false;

  const indicators = carousel.querySelectorAll('.carousel-indicators button');

  function updateIndicators(index) {
    indicators.forEach((indicator, idx) => {
      indicator.classList.toggle('active', idx === index);
    });
  }

  function getSlideWidth() {
    const items = allItems();
    return items[0] ? items[0].getBoundingClientRect().width : 0;
  }

  function setPosition(index, withTransition = true) {
    const slideWidth = getSlideWidth();
    if (!slideWidth) return;

    carouselInner.style.transition = withTransition ? 'transform 0.5s ease-in-out' : 'none';
    carouselInner.style.transform = `translateX(-${(index + 1) * slideWidth}px)`;
    updateIndicators(Math.max(0, Math.min(index, originalItems.length - 1)));
  }

  function goToIndex(index) {
    if (isAnimating) return;
    isAnimating = true;
    currentIndex = index;
    setPosition(currentIndex, true);
  }

  carouselInner.addEventListener('transitionend', () => {
    if (currentIndex === -1) {
      currentIndex = originalItems.length - 1;
      setPosition(currentIndex, false);
    }

    if (currentIndex === originalItems.length) {
      currentIndex = 0;
      setPosition(currentIndex, false);
    }

    isAnimating = false;
  });

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
    if (touchendX < touchstartX - 30) goToIndex(currentIndex + 1);
    if (touchendX > touchstartX + 30) goToIndex(currentIndex - 1);
  });

  window.addEventListener('resize', () => {
    setPosition(currentIndex, false);
  });

  setPosition(0, false);
});

  /* =========================
     Header: is-scrolled
     ========================= */
  (function () {
  const header = document.querySelector('header');
  const hero = document.querySelector('.background-container') || document.querySelector('.gallery-page-hero');

  if (!header || !hero) return;

  function updateHeader() {
    const isMobile = window.innerWidth < 1023;

    const trigger = isMobile
      ? Math.max(90, hero.offsetHeight * 0.22)
      : Math.max(40, hero.offsetHeight * 0.15);

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



  const reveals = document.querySelectorAll(".reveal-up");

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });

  reveals.forEach((el) => observer.observe(el));


