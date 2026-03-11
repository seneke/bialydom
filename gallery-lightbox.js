(function () {
  const galleryLinks = Array.from(document.querySelectorAll('#galleryGrid a'));
  const featureLinks = Array.from(document.querySelectorAll('.feature-lightbox'));

  const lightbox = document.getElementById('mobileLightbox');
  const image = document.getElementById('lightboxImage');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');

  let currentIndex = 0;
  let activeLinks = [];
  let arrowsEnabled = false;

  if (!lightbox || !image) return;

  function setImage(index) {
    currentIndex = index;
    const link = activeLinks[currentIndex];
    if (!link) return;

    image.src = link.getAttribute('href');
    image.alt = link.querySelector('img')?.alt || '';
  }

  function openLightbox(index, links, showArrows) {
    activeLinks = links;
    arrowsEnabled = showArrows;

    setImage(index);

    if (prevBtn) prevBtn.style.display = showArrows ? '' : 'none';
    if (nextBtn) nextBtn.style.display = showArrows ? '' : 'none';

    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    image.src = '';
    image.alt = '';
  }

  function showNext() {
    if (!arrowsEnabled || activeLinks.length < 2) return;
    const nextIndex = (currentIndex + 1) % activeLinks.length;
    setImage(nextIndex);
  }

  function showPrev() {
    if (!arrowsEnabled || activeLinks.length < 2) return;
    const prevIndex = (currentIndex - 1 + activeLinks.length) % activeLinks.length;
    setImage(prevIndex);
  }

  galleryLinks.forEach((link, index) => {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      openLightbox(index, galleryLinks, true);
    });
  });

  featureLinks.forEach((link, index) => {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      openLightbox(index, featureLinks, false);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', function (event) {
      event.stopPropagation();
      showPrev();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function (event) {
      event.stopPropagation();
      showNext();
    });
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
})();
