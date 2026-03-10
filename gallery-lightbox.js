(function () {
  const links = Array.from(document.querySelectorAll('#galleryGrid a'));
  const lightbox = document.getElementById('mobileLightbox');
  const image = document.getElementById('lightboxImage');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');
  let currentIndex = 0;
  let touchStartX = 0;
  let touchEndX = 0;

  if (!links.length || !lightbox || !image) return;

  function openLightbox(index) {
    currentIndex = index;
    image.src = links[currentIndex].getAttribute('href');
    image.alt = links[currentIndex].querySelector('img')?.alt || '';
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % links.length;
    openLightbox(currentIndex);
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + links.length) % links.length;
    openLightbox(currentIndex);
  }

  links.forEach((link, index) => {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      openLightbox(index);
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  nextBtn.addEventListener('click', showNext);
  prevBtn.addEventListener('click', showPrev);

  lightbox.addEventListener('click', function (event) {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', function (event) {
    if (!lightbox.classList.contains('is-open')) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowRight') showNext();
    if (event.key === 'ArrowLeft') showPrev();
  });

  lightbox.addEventListener('touchstart', function (event) {
    touchStartX = event.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', function (event) {
    touchEndX = event.changedTouches[0].screenX;
    const delta = touchEndX - touchStartX;
    if (Math.abs(delta) < 40) return;
    if (delta < 0) showNext();
    if (delta > 0) showPrev();
  }, { passive: true });
})();
