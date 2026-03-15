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

  function updateArrowPositions() {
    if (!arrowsEnabled || !prevBtn || !nextBtn || !image.src) return;

    const rect = image.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const isSmall = window.innerWidth <= 767;
    const arrowSize = isSmall ? 44 : 52;
    const offset = isSmall ? 8 : 12;

    const top = rect.top + rect.height / 2 - arrowSize / 2;
    const prevLeft = rect.left + offset;
    const nextRight = window.innerWidth - rect.right + offset;

    prevBtn.style.top = `${top}px`;
    prevBtn.style.left = `${prevLeft}px`;
    prevBtn.style.right = 'auto';

    nextBtn.style.top = `${top}px`;
    nextBtn.style.right = `${nextRight}px`;
    nextBtn.style.left = 'auto';
  }

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

    if (prevBtn) prevBtn.style.display = showArrows ? 'flex' : 'none';
    if (nextBtn) nextBtn.style.display = showArrows ? 'flex' : 'none';

    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    setTimeout(updateArrowPositions, 30);
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
    setTimeout(updateArrowPositions, 30);
  }

  function showPrev() {
    if (!arrowsEnabled || activeLinks.length < 2) return;
    const prevIndex = (currentIndex - 1 + activeLinks.length) % activeLinks.length;
    setImage(prevIndex);
    setTimeout(updateArrowPositions, 30);
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

  image.addEventListener('load', updateArrowPositions);
  window.addEventListener('resize', updateArrowPositions);

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