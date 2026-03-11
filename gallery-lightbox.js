(function () {
  const galleryLinks = Array.from(document.querySelectorAll('#galleryGrid a'));
  const featureLinks = Array.from(document.querySelectorAll('.feature-lightbox'));
  const allLinks = [...galleryLinks, ...featureLinks];

  const lightbox = document.getElementById('mobileLightbox');
  const image = document.getElementById('lightboxImage');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');

  let currentIndex = 0;
  let activeGroup = [];
  let touchStartX = 0;
  let touchEndX = 0;

  if (!lightbox || !image || !allLinks.length) return;

  function updateArrowVisibility() {
    const shouldHideArrows = activeGroup.length <= 1;
    lightbox.classList.toggle('hide-arrows', shouldHideArrows);
  }

  function openLightbox(index, group) {
    activeGroup = group;
    currentIndex = index;

    const currentLink = activeGroup[currentIndex];
    image.src = currentLink.getAttribute('href');
    image.alt = currentLink.querySelector('img')?.alt || '';

    updateArrowVisibility();

    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.classList.remove('hide-arrows');
    document.body.style.overflow = '';
  }

  function showNext() {
    if (activeGroup.length <= 1) return;

    currentIndex = (currentIndex + 1) % activeGroup.length;
    const currentLink = activeGroup[currentIndex];
    image.src = currentLink.getAttribute('href');
    image.alt = currentLink.querySelector('img')?.alt || '';
  }

  function showPrev() {
    if (activeGroup.length <= 1) return;

    currentIndex = (currentIndex - 1 + activeGroup.length) % activeGroup.length;
    const currentLink = activeGroup[currentIndex];
    image.src = currentLink.getAttribute('href');
    image.alt = currentLink.querySelector('img')?.alt || '';
  }

  galleryLinks.forEach((link, index) => {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      openLightbox(index, galleryLinks);
    });
  });

  featureLinks.forEach((link, index) => {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      openLightbox(index, featureLinks);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', showPrev);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', showNext);
  }

  lightbox.addEventListener('click', function (event) {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (!lightbox.classList.contains('is-open')) return;

    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowRight') showNext();
    if (event.key === 'ArrowLeft') showPrev();
  });

  lightbox.addEventListener(
    'touchstart',
    function (event) {
      touchStartX = event.changedTouches[0].screenX;
    },
    { passive: true }
  );

  lightbox.addEventListener(
    'touchend',
    function (event) {
      if (activeGroup.length <= 1) return;

      touchEndX = event.changedTouches[0].screenX;
      const delta = touchEndX - touchStartX;

      if (Math.abs(delta) < 40) return;
      if (delta < 0) showNext();
      if (delta > 0) showPrev();
    },
    { passive: true }
  );
})();
