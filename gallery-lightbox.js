(function () {
  const galleryLinks = Array.from(document.querySelectorAll('#galleryGrid a'));
  const featureLinks = Array.from(document.querySelectorAll('.feature-lightbox'));
  const sectionCarousels = Array.from(document.querySelectorAll('.gallery-section .gallery-carousel'));

  const lightbox = document.getElementById('mobileLightbox');
  const image = document.getElementById('lightboxImage');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');

  let currentIndex = 0;
  let activeLinks = [];
  let arrowsEnabled = false;
  let previouslyFocusedElement = null;

  if (!lightbox || !image) return;

  function updateArrowPositions() {
    if (!arrowsEnabled || !prevBtn || !nextBtn || !image.src) return;

    const rect = image.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const isSmall = window.innerWidth <= 767;
    const arrowSize = isSmall ? 44 : 52;
    const offset = isSmall ? 8 : 12;

    const top = rect.top + rect.height / 2;
    const roomOnLeft = rect.left >= arrowSize + offset * 2;
    const roomOnRight = window.innerWidth - rect.right >= arrowSize + offset * 2;

    const prevLeft = roomOnLeft
      ? rect.left - arrowSize - offset
      : rect.left + offset;

    const nextLeft = roomOnRight
      ? rect.right + offset
      : rect.right - arrowSize - offset;

    prevBtn.style.top = `${top}px`;
    prevBtn.style.left = `${Math.max(offset, prevLeft)}px`;
    prevBtn.style.right = 'auto';

    nextBtn.style.top = `${top}px`;
    nextBtn.style.left = `${Math.min(window.innerWidth - arrowSize - offset, nextLeft)}px`;
    nextBtn.style.right = 'auto';
  }

  function setImage(index) {
    currentIndex = index;
    const link = activeLinks[currentIndex];
    if (!link) return;

    image.src = link.getAttribute('href');
    image.alt = link.querySelector('img')?.alt || '';
  }

  function openLightbox(index, links, showArrows) {
    previouslyFocusedElement = document.activeElement;
    activeLinks = links;
    arrowsEnabled = showArrows;

    setImage(index);

    if (closeBtn) {
      closeBtn.style.display = 'flex';
    }

    if (prevBtn) {
      prevBtn.style.display = showArrows ? 'flex' : 'none';
      prevBtn.style.visibility = showArrows ? 'visible' : 'hidden';
      prevBtn.style.opacity = showArrows ? '1' : '0';
    }

    if (nextBtn) {
      nextBtn.style.display = showArrows ? 'flex' : 'none';
      nextBtn.style.visibility = showArrows ? 'visible' : 'hidden';
      nextBtn.style.opacity = showArrows ? '1' : '0';
    }

    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (closeBtn) {
      closeBtn.focus();
    }

    setTimeout(updateArrowPositions, 30);
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    image.src = '';
    image.alt = '';

    if (closeBtn) {
      closeBtn.style.display = '';
    }

    if (prevBtn) {
      prevBtn.style.display = '';
      prevBtn.style.visibility = '';
      prevBtn.style.opacity = '';
      prevBtn.style.top = '';
      prevBtn.style.left = '';
      prevBtn.style.right = '';
    }

    if (nextBtn) {
      nextBtn.style.display = '';
      nextBtn.style.visibility = '';
      nextBtn.style.opacity = '';
      nextBtn.style.top = '';
      nextBtn.style.left = '';
      nextBtn.style.right = '';
    }

    if (previouslyFocusedElement instanceof HTMLElement) {
      previouslyFocusedElement.focus();
    }

    previouslyFocusedElement = null;
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

  function trapFocus(event) {
    const focusableControls = [closeBtn, prevBtn, nextBtn].filter((control) => {
      if (!control) return false;

      const style = window.getComputedStyle(control);
      return style.display !== 'none' && style.visibility !== 'hidden';
    });

    if (!focusableControls.length) return;

    const firstControl = focusableControls[0];
    const lastControl = focusableControls[focusableControls.length - 1];

    if (event.shiftKey && document.activeElement === firstControl) {
      event.preventDefault();
      lastControl.focus();
    } else if (!event.shiftKey && document.activeElement === lastControl) {
      event.preventDefault();
      firstControl.focus();
    }
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
      const showArrows = link.dataset.lightboxArrows === 'true';
      openLightbox(index, featureLinks, showArrows);
    });
  });

  sectionCarousels.forEach((carousel) => {
    const carouselLinks = Array.from(
      carousel.querySelectorAll('.carousel-item:not([data-carousel-clone="true"]) .image-popup')
    );
    const interactiveLinks = Array.from(carousel.querySelectorAll('.image-popup'));

    interactiveLinks.forEach((link) => {
      const index = carouselLinks.findIndex(
        (carouselLink) => carouselLink.getAttribute('href') === link.getAttribute('href')
      );

      if (index === -1) return;

      link.addEventListener('click', function (event) {
        event.preventDefault();
        openLightbox(index, carouselLinks, true);
      });
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
    if (event.key === 'Tab') trapFocus(event);
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowRight') showNext();
    if (event.key === 'ArrowLeft') showPrev();
  });
})();
