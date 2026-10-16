/* Rainbow Hospital — lightweight interactions, no dependencies required. */
document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const primaryNav = document.querySelector('.primary-nav');
  const navLinks = [...document.querySelectorAll('.nav-link')];
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Header and mobile navigation
  const setMenuOpen = (isOpen) => {
    header.classList.toggle('is-menu-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  };

  menuToggle?.addEventListener('click', () => {
    setMenuOpen(!header.classList.contains('is-menu-open'));
  });

  primaryNav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenuOpen(false));
  });

  document.addEventListener('click', (event) => {
    if (header.classList.contains('is-menu-open') && !header.contains(event.target)) {
      setMenuOpen(false);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && header.classList.contains('is-menu-open')) {
      setMenuOpen(false);
      menuToggle.focus();
    }
  });

  const updateHeaderShadow = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  updateHeaderShadow();
  window.addEventListener('scroll', updateHeaderShadow, { passive: true });

  // Hero carousel: autoplay, buttons, dots, keyboard and touch/pointer swipe.
  const carousel = document.querySelector('[data-carousel]');
  const track = carousel?.querySelector('.carousel-track');
  const slides = carousel ? [...carousel.querySelectorAll('.hero-slide')] : [];
  const dots = carousel ? [...carousel.querySelectorAll('.carousel-dot')] : [];
  const prevButton = carousel?.querySelector('[data-carousel-prev]');
  const nextButton = carousel?.querySelector('[data-carousel-next]');
  const caption = carousel?.querySelector('[data-carousel-caption]');
  const captionNumber = carousel?.querySelector('.caption-number');
  const captions = [
    'Welcoming spaces, designed around families',
    'A bright arrival for every visit',
    'Comfortable spaces to pause and listen',
    'Clean, thoughtful treatment rooms',
    'Gentle pediatric care, close to home'
  ];
  let currentSlide = 0;
  let autoplayTimer = null;
  let isHovering = false;
  let isFocusWithin = false;
  let pointerStartX = null;

  const renderSlide = (nextIndex) => {
    if (!slides.length || !track) return;
    currentSlide = (nextIndex + slides.length) % slides.length;
    track.style.transform = `translate3d(-${currentSlide * 100}%, 0, 0)`;

    slides.forEach((slide, index) => {
      const isActive = index === currentSlide;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
    });

    dots.forEach((dot, index) => {
      const isActive = index === currentSlide;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-selected', String(isActive));
      dot.tabIndex = isActive ? 0 : -1;
    });

    if (caption) caption.textContent = captions[currentSlide] || '';
    if (captionNumber) captionNumber.textContent = String(currentSlide + 1).padStart(2, '0');
    carousel.setAttribute('aria-label', `Rainbow Hospital spaces and care. Slide ${currentSlide + 1} of ${slides.length}: ${captions[currentSlide]}`);
  };

  const stopAutoplay = () => {
    if (autoplayTimer) {
      window.clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  };

  const startAutoplay = () => {
    stopAutoplay();
    if (reducedMotionQuery.matches || document.hidden || isHovering || isFocusWithin) return;
    autoplayTimer = window.setInterval(() => renderSlide(currentSlide + 1), 3600);
  };

  prevButton?.addEventListener('click', () => {
    renderSlide(currentSlide - 1);
    startAutoplay();
  });
  nextButton?.addEventListener('click', () => {
    renderSlide(currentSlide + 1);
    startAutoplay();
  });
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      renderSlide(Number(dot.dataset.slideTo));
      startAutoplay();
    });
  });

  carousel?.addEventListener('mouseenter', () => {
    isHovering = true;
    stopAutoplay();
  });
  carousel?.addEventListener('mouseleave', () => {
    isHovering = false;
    startAutoplay();
  });
  carousel?.addEventListener('focusin', () => {
    isFocusWithin = true;
    stopAutoplay();
  });
  carousel?.addEventListener('focusout', () => {
    window.setTimeout(() => {
      isFocusWithin = carousel.contains(document.activeElement);
      if (!isFocusWithin) startAutoplay();
    }, 0);
  });
  carousel?.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      renderSlide(currentSlide - 1);
      startAutoplay();
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      renderSlide(currentSlide + 1);
      startAutoplay();
    }
  });
  carousel?.addEventListener('pointerdown', (event) => {
    pointerStartX = event.clientX;
  });
  carousel?.addEventListener('pointerup', (event) => {
    if (pointerStartX === null) return;
    const distance = event.clientX - pointerStartX;
    if (Math.abs(distance) > 45) {
      renderSlide(distance < 0 ? currentSlide + 1 : currentSlide - 1);
      startAutoplay();
    }
    pointerStartX = null;
  });
  carousel?.addEventListener('pointercancel', () => { pointerStartX = null; });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAutoplay();
    else startAutoplay();
  });
  reducedMotionQuery.addEventListener?.('change', startAutoplay);

  document.querySelectorAll('.slide-image').forEach((image) => {
    image.addEventListener('error', () => {
      image.closest('.hero-slide')?.classList.add('image-failed');
    });
  });

  renderSlide(0);
  startAutoplay();

  // Keep the small active state in the navigation useful while scrolling.
  const sectionLinks = new Map(
    navLinks
      .map((link) => [link.getAttribute('href')?.slice(1), link])
      .filter(([id]) => id && document.getElementById(id))
  );
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => link.classList.remove('active'));
        sectionLinks.get(entry.target.id)?.classList.add('active');
      }
    });
  }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
  sectionLinks.forEach((_, id) => sectionObserver.observe(document.getElementById(id)));

  // Subtle reveal motion; content remains visible if motion is reduced or JS is unavailable.
  const revealItems = [...document.querySelectorAll('.reveal')];
  if (!reducedMotionQuery.matches && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  // Footer year is intentionally generated at runtime.
  const year = document.querySelector('#current-year');
  if (year) year.textContent = String(new Date().getFullYear());

  // Expose only a tiny debug hook for local manual verification in the browser console.
  root.dataset.carouselReady = 'true';
});
