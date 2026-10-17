/* RAINBOW HEALTH CLINIC AND HOSPITAL — lightweight interactions, no dependencies required. */
document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const primaryNav = document.querySelector('.primary-nav');
  const navLinks = [...document.querySelectorAll('.nav-link')];
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const supportedLanguages = ['en', 'hi', 'hinglish'];
  let activeLanguage = 'en';
  try {
    const savedLanguage = window.localStorage.getItem('rainbowHospitalLanguage');
    if (supportedLanguages.includes(savedLanguage)) activeLanguage = savedLanguage;
  } catch (error) {
    // Local storage may be unavailable in a private or embedded preview.
  }

  // Header and mobile navigation
  const menuLabels = {
    en: { open: 'Open navigation menu', close: 'Close navigation menu' },
    hi: { open: 'नेविगेशन मेनू खोलें', close: 'नेविगेशन मेनू बंद करें' },
    hinglish: { open: 'Navigation menu open karein', close: 'Navigation menu close karein' }
  };
  const setMenuOpen = (isOpen) => {
    header.classList.toggle('is-menu-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    const labels = menuLabels[activeLanguage] || menuLabels.en;
    menuToggle.setAttribute('aria-label', isOpen ? labels.close : labels.open);
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
  const carouselCaptions = {
    en: [
      'Welcoming spaces, designed around families',
      'A bright arrival for every visit',
      'Comfortable spaces to pause and listen',
      'Clean, thoughtful treatment rooms',
      'Gentle pediatric care, close to home'
    ],
    hi: [
      'परिवारों को ध्यान में रखकर बनाए गए स्वागतपूर्ण स्थान',
      'हर मुलाकात के लिए उजला और सहज प्रवेश',
      'ठहरने और सुनने के लिए आरामदायक स्थान',
      'स्वच्छ और सुविचारित उपचार कक्ष',
      'आपके पास कोमल और भरोसेमंद बाल देखभाल'
    ],
    hinglish: [
      'Parivaar ke liye thoughtfully designed welcoming spaces',
      'Har visit ke liye bright aur easy arrival',
      'Rukne aur sunne ke liye comfortable spaces',
      'Clean aur thoughtfully prepared treatment rooms',
      'Aapke paas gentle aur trusted pediatric care'
    ]
  };
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

    const currentCaptions = carouselCaptions[activeLanguage] || carouselCaptions.en;
    if (caption) caption.textContent = currentCaptions[currentSlide] || '';
    if (captionNumber) captionNumber.textContent = String(currentSlide + 1).padStart(2, '0');
    const carouselLabel = activeLanguage === 'hi'
      ? 'अस्पताल के स्थान और देखभाल'
      : activeLanguage === 'hinglish'
        ? 'Hospital spaces aur care'
        : 'Hospital spaces and care';
    carousel.setAttribute('aria-label', `${carouselLabel}. Slide ${currentSlide + 1} of ${slides.length}: ${currentCaptions[currentSlide]}`);
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

  // Language switcher: English, Hindi and Hinglish are fully client-side and require no API.
  const languageButtons = [...document.querySelectorAll('[data-language]')];
  const translations = {
    en: {
      lang: 'en-IN',
      title: 'RAINBOW HEALTH CLINIC AND HOSPITAL | Pediatric, Newborn, Gynecology & Obstetrics Care in Saidpur, Ghazipur',
      description: 'RAINBOW HEALTH CLINIC AND HOSPITAL in Saidpur, Ghazipur provides compassionate pediatric, newborn, gynecology and obstetrics care for families across the area.',
      ogTitle: 'RAINBOW HEALTH CLINIC AND HOSPITAL | Compassionate Care for Every Generation',
      ogDescription: 'Pediatric, newborn, gynecology and obstetrics care in Saidpur, Ghazipur. Call RAINBOW HEALTH CLINIC AND HOSPITAL for appointments and directions.',
      text: {
        '.nav-link[href="#home"]': 'Home',
        '.nav-link[href="#doctors"]': 'Doctors',
        '.nav-link[href="#services"]': 'Services',
        '.nav-link[href="#about"]': 'About Us',
        '.nav-link[href="#contact"]': 'Contact',
        '.nav-call span': 'Call Now',
        '.hero .eyebrow': 'Family-focused care in Saidpur',
        '.hero-tagline': 'Compassionate Care for Every Generation',
        '.hero-description': 'Expert Pediatric, Newborn, Gynecology & Obstetrics Care',
        '.hero-actions a:nth-child(1) span': 'Call Now',
        '.hero-actions a:nth-child(2) span': 'Get Directions',
        '.hero-note span': 'Thoughtful care for newborns, children and women',
        '.quick-item:nth-child(1) strong': 'Daily clinic hours',
        '.quick-item:nth-child(1) small': '2:00 PM – 8:00 PM',
        '.quick-item:nth-child(2) strong': 'Easy to find',
        '.quick-item:nth-child(2) small': 'Saidpur, Ghazipur',
        '.quick-item:nth-child(3) strong': 'Care for every generation',
        '.quick-item:nth-child(3) small': 'Newborns · children · women',
        '.quick-link': 'Plan your visit',
        '.section-copy .eyebrow': 'A calmer healthcare experience',
        '.section-copy h2': 'Care that grows with your family',
        '.section-copy p.lead': 'RAINBOW HEALTH CLINIC AND HOSPITAL is dedicated to providing accessible, compassionate healthcare for newborns, children, and women. Our doctors focus on patient care and helping families make informed healthcare decisions.',
        '.section-copy > p:nth-of-type(3)': 'From a child’s first check-up to women’s health and maternity guidance, our approach is simple: listen carefully, explain clearly, and support every family with respect.',
        '.text-link': 'Explore our services',
        '.visual-badge strong': 'Here for your family',
        '.visual-badge span': 'Clear guidance · compassionate care',
        '.services-section .section-heading .eyebrow': 'How we can help',
        '.services-section .section-heading h2': 'Care for the moments that matter',
        '.services-section .section-heading-note': 'Focused consultations for newborns, children and women—delivered with warmth, clarity and care.',
        '.service-card:nth-child(1) h3': 'Newborn Care',
        '.service-card:nth-child(1) p': 'Gentle, attentive consultations for newborn health and early development.',
        '.service-card:nth-child(2) h3': 'Pediatric Consultation',
        '.service-card:nth-child(2) p': 'Thoughtful medical guidance for babies, children and growing families.',
        '.service-card:nth-child(3) h3': 'Childhood Illness Consultation',
        '.service-card:nth-child(3) p': 'Support for common childhood health concerns with clear next steps for parents.',
        '.service-card:nth-child(4) h3': 'Gynecology Consultation',
        '.service-card:nth-child(4) p': 'Respectful, confidential care for women’s health across different life stages.',
        '.service-card:nth-child(5) h3': 'Obstetrics & Maternal Care',
        '.service-card:nth-child(5) p': 'Compassionate guidance for pregnancy and maternal wellbeing, with time to listen and answer questions.',
        '.doctors-section .section-heading .eyebrow': 'Meet your care team',
        '.doctors-section .section-heading h2': 'Meet Our Doctors',
        '.doctors-section .section-heading-note': 'Experienced clinicians committed to clear communication and compassionate patient care.',
        '.doctor-card:nth-child(1) .doctor-role': 'Pediatrician & Neonatologist',
        '.doctor-card:nth-child(2) .doctor-role': 'Doctor profile',
        '.doctor-card:nth-child(3) .doctor-role': 'Women’s health',
        '.doctor-card:nth-child(1) .appointment-link': 'Call for Appointment',
        '.doctor-card:nth-child(2) .appointment-link': 'Call for Appointment',
        '.doctor-card:nth-child(3) .appointment-link': 'Call for Appointment',
        '.doctor-note': 'Doctor profile images are intentionally represented with neutral illustrations rather than unrelated stock photography.',
        '.contact-section .section-heading .eyebrow': 'We are here to help',
        '.contact-section .section-heading h2': 'Plan your visit',
        '.contact-section .section-heading-note': 'Call ahead for an appointment or use the address below to find RAINBOW HEALTH CLINIC AND HOSPITAL in Saidpur.',
        '.contact-card .card-kicker': 'Visit us',
        '.contact-card h3': 'Contact information',
        '.contact-row:nth-child(1) strong': 'Address',
        '.contact-row:nth-child(2) strong': 'Phone numbers',
        '.contact-row:nth-child(3) strong': 'Operating hours',
        '.contact-actions .button:nth-child(1)': 'Call 8528695991',
        '.contact-actions .button:nth-child(2)': 'Call 8090945179',
        '.map-topline > span:last-child': 'Find your way to us',
        '.map-overlay h3': 'Near Saidpur Kotwali',
        '.map-overlay p': 'HR Restaurant ke paas, Saidpur - Ghazipur',
        '.map-overlay .button-full': 'Get Directions',
        '.map-overlay small': 'Opens the exact Google Maps location shared by RAINBOW HEALTH CLINIC AND HOSPITAL.',
        '.doctor-card:nth-child(3) .portrait-label': 'Profile illustration',
        '.emergency-banner strong': 'Emergency support',
        '.button-emergency': 'Emergency Call',
        '.footer-brand > p': 'Compassionate care for every generation.',
        '.footer-column:nth-child(2) h2': 'Quick navigation',
        '.footer-column:nth-child(3) h2': 'Contact',
        '.footer-column:nth-child(4) h2': 'Hours',
        '.footer-column:nth-child(2) a:nth-of-type(1)': 'Home',
        '.footer-column:nth-child(2) a:nth-of-type(2)': 'Doctors',
        '.footer-column:nth-child(2) a:nth-of-type(3)': 'Services',
        '.footer-column:nth-child(2) a:nth-of-type(4)': 'About Us',
        '.footer-column:nth-child(2) a:nth-of-type(5)': 'Contact',
        '.footer-column:nth-child(4) p:nth-of-type(1)': 'Daily: 2:00 PM – 8:00 PM',
        '.footer-column:nth-child(4) p:nth-of-type(2)': 'Emergency: 24/7',
        '.footer-bottom > span:last-child': 'Made for families in Saidpur',
        '.emergency-fab strong': 'Emergency Call',
        '.emergency-fab small': '8528695991'
      },
      all: {
        '.doctor-details dt': ['Qualifications', 'Specialty', 'Additional qualifications', 'Current posting', 'Qualification', 'Specialty', 'Qualifications', 'Additional experience'],
        '.doctor-details dd': ['MBBS, DCH', 'Pediatrician & Neonatologist', 'MD (RCH), Lucknow; FBNC (IMS BHU)', 'Senior Consultant, SNCU, Medical College Ghazipur', 'MBBS', 'Gynecology & Obstetrics', 'MBBS, DGO, MS (G.S.V.M. Kanpur)', 'Ex. MO - IMS BHU']
      },
      html: {
        '.contact-row:nth-child(1) p': 'Near Saidpur Kotwali,<br>HR Restaurant ke paas,<br>Saidpur - Ghazipur',
        '.contact-row:nth-child(3) p': 'Daily: 2:00 PM – 8:00 PM<br><span class="emergency-inline">Emergency: 24/7</span>',
        '.emergency-banner p': 'For urgent assistance, call <a href="tel:+918528695991">8528695991</a>. Alternate contact: <a href="tel:+918090945179">8090945179</a>.',
        '.footer-column:nth-child(3) p': 'Near Saidpur Kotwali,<br>HR Restaurant ke paas,<br>Saidpur - Ghazipur',
        '.footer-bottom > span:first-child': '© <span id="current-year"></span> RAINBOW HEALTH CLINIC AND HOSPITAL. All rights reserved.'
      },
      attributes: {
        'meta[name="description"]': ['content', 'RAINBOW HEALTH CLINIC AND HOSPITAL in Saidpur, Ghazipur provides compassionate pediatric, newborn, gynecology and obstetrics care for families across the area.'],
        'meta[property="og:title"]': ['content', 'RAINBOW HEALTH CLINIC AND HOSPITAL | Compassionate Care for Every Generation'],
        'meta[property="og:description"]': ['content', 'Pediatric, newborn, gynecology and obstetrics care in Saidpur, Ghazipur. Call RAINBOW HEALTH CLINIC AND HOSPITAL for appointments and directions.']
      }
    },
    hi: {
      lang: 'hi-IN',
      title: 'RAINBOW HEALTH CLINIC AND HOSPITAL | सैदपुर, गाज़ीपुर में बाल, नवजात, स्त्री रोग एवं प्रसूति देखभाल',
      description: 'सैदपुर, गाज़ीपुर में RAINBOW HEALTH CLINIC AND HOSPITAL नवजात शिशुओं, बच्चों और महिलाओं के लिए संवेदनशील बाल, नवजात, स्त्री रोग एवं प्रसूति देखभाल प्रदान करता है।',
      ogTitle: 'RAINBOW HEALTH CLINIC AND HOSPITAL | हर पीढ़ी के लिए संवेदनशील देखभाल',
      ogDescription: 'सैदपुर, गाज़ीपुर में बाल, नवजात, स्त्री रोग एवं प्रसूति देखभाल। अपॉइंटमेंट और दिशा-निर्देश के लिए RAINBOW HEALTH CLINIC AND HOSPITAL को कॉल करें।',
      text: {
        '.nav-link[href="#home"]': 'होम',
        '.nav-link[href="#doctors"]': 'डॉक्टर',
        '.nav-link[href="#services"]': 'सेवाएँ',
        '.nav-link[href="#about"]': 'हमारे बारे में',
        '.nav-link[href="#contact"]': 'संपर्क',
        '.nav-call span': 'कॉल करें',
        '.hero .eyebrow': 'सैदपुर में परिवार-केंद्रित देखभाल',
        '.hero-tagline': 'हर पीढ़ी के लिए संवेदनशील देखभाल',
        '.hero-description': 'विशेषज्ञ बाल, नवजात, स्त्री रोग एवं प्रसूति देखभाल',
        '.hero-actions a:nth-child(1) span': 'कॉल करें',
        '.hero-actions a:nth-child(2) span': 'दिशा-निर्देश',
        '.hero-note span': 'नवजात शिशुओं, बच्चों और महिलाओं के लिए संवेदनशील देखभाल',
        '.quick-item:nth-child(1) strong': 'दैनिक क्लिनिक समय',
        '.quick-item:nth-child(1) small': 'दोपहर 2:00 – रात 8:00 बजे',
        '.quick-item:nth-child(2) strong': 'आसानी से पहुँचें',
        '.quick-item:nth-child(2) small': 'सैदपुर, गाज़ीपुर',
        '.quick-item:nth-child(3) strong': 'हर पीढ़ी के लिए देखभाल',
        '.quick-item:nth-child(3) small': 'नवजात · बच्चे · महिलाएँ',
        '.quick-link': 'अपनी विज़िट की योजना बनाएँ',
        '.section-copy .eyebrow': 'एक शांत और बेहतर स्वास्थ्य अनुभव',
        '.section-copy h2': 'आपके परिवार के साथ बढ़ती देखभाल',
        '.section-copy p.lead': 'RAINBOW HEALTH CLINIC AND HOSPITAL नवजात शिशुओं, बच्चों और महिलाओं के लिए सुलभ और संवेदनशील स्वास्थ्य सेवा प्रदान करने के लिए समर्पित है। हमारे डॉक्टर मरीजों की देखभाल और परिवारों को सही स्वास्थ्य निर्णय लेने में मदद करने पर ध्यान देते हैं।',
        '.section-copy > p:nth-of-type(3)': 'बच्चे के पहले चेक-अप से लेकर महिलाओं के स्वास्थ्य और मातृत्व मार्गदर्शन तक, हमारा तरीका सरल है: ध्यान से सुनना, स्पष्ट समझाना और हर परिवार को सम्मान के साथ सहयोग देना।',
        '.text-link': 'हमारी सेवाएँ देखें',
        '.visual-badge strong': 'आपके परिवार के साथ',
        '.visual-badge span': 'स्पष्ट मार्गदर्शन · संवेदनशील देखभाल',
        '.services-section .section-heading .eyebrow': 'हम कैसे मदद कर सकते हैं',
        '.services-section .section-heading h2': 'ज़रूरी पलों के लिए देखभाल',
        '.services-section .section-heading-note': 'नवजात शिशुओं, बच्चों और महिलाओं के लिए केंद्रित परामर्श—स्नेह, स्पष्टता और देखभाल के साथ।',
        '.service-card:nth-child(1) h3': 'नवजात शिशु देखभाल',
        '.service-card:nth-child(1) p': 'नवजात स्वास्थ्य और शुरुआती विकास के लिए कोमल और ध्यानपूर्वक परामर्श।',
        '.service-card:nth-child(2) h3': 'बाल रोग परामर्श',
        '.service-card:nth-child(2) p': 'शिशुओं, बच्चों और बढ़ते परिवारों के लिए विचारपूर्ण चिकित्सा मार्गदर्शन।',
        '.service-card:nth-child(3) h3': 'बचपन की बीमारी परामर्श',
        '.service-card:nth-child(3) p': 'बचपन की सामान्य स्वास्थ्य चिंताओं के लिए माता-पिता को स्पष्ट अगले कदमों के साथ सहयोग।',
        '.service-card:nth-child(4) h3': 'स्त्री रोग परामर्श',
        '.service-card:nth-child(4) p': 'जीवन के अलग-अलग चरणों में महिलाओं के स्वास्थ्य के लिए सम्मानजनक और गोपनीय देखभाल।',
        '.service-card:nth-child(5) h3': 'प्रसूति एवं मातृत्व देखभाल',
        '.service-card:nth-child(5) p': 'गर्भावस्था और मातृत्व स्वास्थ्य के लिए संवेदनशील मार्गदर्शन, जिसमें सुनने और सवालों के जवाब देने का समय मिले।',
        '.doctors-section .section-heading .eyebrow': 'आपकी देखभाल टीम से मिलिए',
        '.doctors-section .section-heading h2': 'हमारे डॉक्टरों से मिलिए',
        '.doctors-section .section-heading-note': 'स्पष्ट संवाद और संवेदनशील मरीज देखभाल के लिए प्रतिबद्ध अनुभवी चिकित्सक।',
        '.doctor-card:nth-child(1) .doctor-role': 'बाल रोग विशेषज्ञ एवं नवजात रोग विशेषज्ञ',
        '.doctor-card:nth-child(2) .doctor-role': 'डॉक्टर प्रोफ़ाइल',
        '.doctor-card:nth-child(3) .doctor-role': 'महिला स्वास्थ्य',
        '.doctor-card:nth-child(1) .appointment-link': 'अपॉइंटमेंट के लिए कॉल करें',
        '.doctor-card:nth-child(2) .appointment-link': 'अपॉइंटमेंट के लिए कॉल करें',
        '.doctor-card:nth-child(3) .appointment-link': 'अपॉइंटमेंट के लिए कॉल करें',
        '.doctor-note': 'डॉक्टर प्रोफ़ाइल चित्रों में जानबूझकर तटस्थ चित्रों का उपयोग किया गया है, किसी असंबंधित स्टॉक फोटो का नहीं।',
        '.contact-section .section-heading .eyebrow': 'हम आपकी मदद के लिए यहाँ हैं',
        '.contact-section .section-heading h2': 'अपनी विज़िट की योजना बनाएँ',
        '.contact-section .section-heading-note': 'अपॉइंटमेंट के लिए पहले कॉल करें या सैदपुर में RAINBOW HEALTH CLINIC AND HOSPITAL तक पहुँचने के लिए नीचे दिया गया पता देखें।',
        '.contact-card .card-kicker': 'हमसे मिलिए',
        '.contact-card h3': 'संपर्क जानकारी',
        '.contact-row:nth-child(1) strong': 'पता',
        '.contact-row:nth-child(2) strong': 'फोन नंबर',
        '.contact-row:nth-child(3) strong': 'खुलने का समय',
        '.contact-actions .button:nth-child(1)': '8528695991 पर कॉल करें',
        '.contact-actions .button:nth-child(2)': '8090945179 पर कॉल करें',
        '.map-topline > span:last-child': 'हम तक पहुँचने का रास्ता',
        '.map-overlay h3': 'सैदपुर कोतवाली के पास',
        '.map-overlay p': 'एचआर रेस्टोरेंट के पास, सैदपुर - गाज़ीपुर',
        '.map-overlay .button-full': 'दिशा-निर्देश पाएँ',
        '.map-overlay small': 'यह RAINBOW HEALTH CLINIC AND HOSPITAL द्वारा साझा की गई सटीक Google Maps लोकेशन खोलता है।',
        '.doctor-card:nth-child(3) .portrait-label': 'प्रोफ़ाइल चित्र',
        '.emergency-banner strong': 'आपातकालीन सहायता',
        '.button-emergency': 'आपातकालीन कॉल',
        '.footer-brand > p': 'हर पीढ़ी के लिए संवेदनशील देखभाल।',
        '.footer-column:nth-child(2) h2': 'त्वरित नेविगेशन',
        '.footer-column:nth-child(3) h2': 'संपर्क',
        '.footer-column:nth-child(4) h2': 'समय',
        '.footer-column:nth-child(2) a:nth-of-type(1)': 'होम',
        '.footer-column:nth-child(2) a:nth-of-type(2)': 'डॉक्टर',
        '.footer-column:nth-child(2) a:nth-of-type(3)': 'सेवाएँ',
        '.footer-column:nth-child(2) a:nth-of-type(4)': 'हमारे बारे में',
        '.footer-column:nth-child(2) a:nth-of-type(5)': 'संपर्क',
        '.footer-column:nth-child(4) p:nth-of-type(1)': 'दैनिक: दोपहर 2:00 – रात 8:00 बजे',
        '.footer-column:nth-child(4) p:nth-of-type(2)': 'आपातकाल: 24/7',
        '.footer-bottom > span:last-child': 'सैदपुर के परिवारों के लिए',
        '.emergency-fab strong': 'आपातकालीन कॉल',
        '.emergency-fab small': '8528695991'
      },
      all: {
        '.doctor-details dt': ['योग्यताएँ', 'विशेषज्ञता', 'अतिरिक्त योग्यताएँ', 'वर्तमान पद', 'योग्यता', 'विशेषज्ञता', 'योग्यताएँ', 'अतिरिक्त अनुभव'],
        '.doctor-details dd': ['MBBS, DCH', 'बाल रोग विशेषज्ञ एवं नवजात रोग विशेषज्ञ', 'MD (RCH), Lucknow; FBNC (IMS BHU)', 'सीनियर कंसल्टेंट, SNCU, मेडिकल कॉलेज गाज़ीपुर', 'MBBS', 'स्त्री रोग एवं प्रसूति', 'MBBS, DGO, MS (G.S.V.M. Kanpur)', 'Ex. MO - IMS BHU']
      },
      html: {
        '.contact-row:nth-child(1) p': 'सैदपुर कोतवाली के पास,<br>एचआर रेस्टोरेंट के पास,<br>सैदपुर - गाज़ीपुर',
        '.contact-row:nth-child(3) p': 'दैनिक: दोपहर 2:00 – रात 8:00 बजे<br><span class="emergency-inline">आपातकाल: 24/7</span>',
        '.emergency-banner p': 'तत्काल सहायता के लिए <a href="tel:+918528695991">8528695991</a> पर कॉल करें। वैकल्पिक संपर्क: <a href="tel:+918090945179">8090945179</a>।',
        '.footer-column:nth-child(3) p': 'सैदपुर कोतवाली के पास,<br>एचआर रेस्टोरेंट के पास,<br>सैदपुर - गाज़ीपुर',
        '.footer-bottom > span:first-child': '© <span id="current-year"></span> RAINBOW HEALTH CLINIC AND HOSPITAL। सर्वाधिकार सुरक्षित।'
      },
      attributes: {
        'meta[name="description"]': ['content', 'सैदपुर, गाज़ीपुर में RAINBOW HEALTH CLINIC AND HOSPITAL नवजात शिशुओं, बच्चों और महिलाओं के लिए संवेदनशील बाल, नवजात, स्त्री रोग एवं प्रसूति देखभाल प्रदान करता है।'],
        'meta[property="og:title"]': ['content', 'RAINBOW HEALTH CLINIC AND HOSPITAL | हर पीढ़ी के लिए संवेदनशील देखभाल'],
        'meta[property="og:description"]': ['content', 'सैदपुर, गाज़ीपुर में बाल, नवजात, स्त्री रोग एवं प्रसूति देखभाल। अपॉइंटमेंट और दिशा-निर्देश के लिए RAINBOW HEALTH CLINIC AND HOSPITAL को कॉल करें।']
      }
    },
    hinglish: {
      lang: 'en-IN',
      title: 'RAINBOW HEALTH CLINIC AND HOSPITAL | Saidpur, Ghazipur mein Pediatric, Newborn, Gynecology aur Obstetrics Care',
      description: 'Saidpur, Ghazipur mein RAINBOW HEALTH CLINIC AND HOSPITAL families ke liye compassionate pediatric, newborn, gynecology aur obstetrics care provide karta hai.',
      ogTitle: 'RAINBOW HEALTH CLINIC AND HOSPITAL | Har generation ke liye compassionate care',
      ogDescription: 'Saidpur, Ghazipur mein pediatric, newborn, gynecology aur obstetrics care. Appointment aur directions ke liye RAINBOW HEALTH CLINIC AND HOSPITAL ko call karein.',
      text: {
        '.nav-link[href="#home"]': 'Home',
        '.nav-link[href="#doctors"]': 'Doctors',
        '.nav-link[href="#services"]': 'Services',
        '.nav-link[href="#about"]': 'About Us',
        '.nav-link[href="#contact"]': 'Contact',
        '.nav-call span': 'Call Now',
        '.hero .eyebrow': 'Saidpur mein parivaar-kendrit care',
        '.hero-tagline': 'Har generation ke liye compassionate care',
        '.hero-description': 'Expert pediatric, newborn, gynecology aur obstetrics care',
        '.hero-actions a:nth-child(1) span': 'Call Now',
        '.hero-actions a:nth-child(2) span': 'Directions paayen',
        '.hero-note span': 'Newborns, bachchon aur mahilaon ke liye thoughtful care',
        '.quick-item:nth-child(1) strong': 'Daily clinic hours',
        '.quick-item:nth-child(1) small': '2:00 PM – 8:00 PM',
        '.quick-item:nth-child(2) strong': 'Dhoondhna aasaan',
        '.quick-item:nth-child(2) small': 'Saidpur, Ghazipur',
        '.quick-item:nth-child(3) strong': 'Har generation ke liye care',
        '.quick-item:nth-child(3) small': 'Newborns · bachche · mahilaen',
        '.quick-link': 'Apni visit plan karein',
        '.section-copy .eyebrow': 'Shaant aur behtar healthcare experience',
        '.section-copy h2': 'Aapke parivaar ke saath badhti care',
        '.section-copy p.lead': 'RAINBOW HEALTH CLINIC AND HOSPITAL newborns, bachchon aur mahilaon ke liye accessible aur compassionate healthcare dene ke liye dedicated hai. Hamare doctors patient care aur families ko informed healthcare decisions lene mein help karne par focus karte hain.',
        '.section-copy > p:nth-of-type(3)': 'Bachche ke pehle check-up se lekar women’s health aur maternity guidance tak, hamara approach simple hai: dhyan se sunna, clearly samjhana aur har family ko respect ke saath support karna.',
        '.text-link': 'Hamari services dekhein',
        '.visual-badge strong': 'Aapke parivaar ke saath',
        '.visual-badge span': 'Clear guidance · compassionate care',
        '.services-section .section-heading .eyebrow': 'Hum kaise help kar sakte hain',
        '.services-section .section-heading h2': 'Zaroori moments ke liye care',
        '.services-section .section-heading-note': 'Newborns, bachchon aur mahilaon ke liye focused consultations—warmth, clarity aur care ke saath.',
        '.service-card:nth-child(1) h3': 'Newborn Care',
        '.service-card:nth-child(1) p': 'Newborn health aur early development ke liye gentle, attentive consultations.',
        '.service-card:nth-child(2) h3': 'Pediatric Consultation',
        '.service-card:nth-child(2) p': 'Babies, bachchon aur growing families ke liye thoughtful medical guidance.',
        '.service-card:nth-child(3) h3': 'Childhood Illness Consultation',
        '.service-card:nth-child(3) p': 'Common childhood health concerns ke liye parents ko clear next steps ke saath support.',
        '.service-card:nth-child(4) h3': 'Gynecology Consultation',
        '.service-card:nth-child(4) p': 'Women’s health ke liye respectful aur confidential care, alag-alag life stages mein.',
        '.service-card:nth-child(5) h3': 'Obstetrics & Maternal Care',
        '.service-card:nth-child(5) p': 'Pregnancy aur maternal wellbeing ke liye compassionate guidance, questions sunne aur answer karne ka time ke saath.',
        '.doctors-section .section-heading .eyebrow': 'Apni care team se miliye',
        '.doctors-section .section-heading h2': 'Meet Our Doctors',
        '.doctors-section .section-heading-note': 'Clear communication aur compassionate patient care ke liye committed experienced clinicians.',
        '.doctor-card:nth-child(1) .doctor-role': 'Pediatrician & Neonatologist',
        '.doctor-card:nth-child(2) .doctor-role': 'Doctor profile',
        '.doctor-card:nth-child(3) .doctor-role': 'Women’s health',
        '.doctor-card:nth-child(1) .appointment-link': 'Appointment ke liye call karein',
        '.doctor-card:nth-child(2) .appointment-link': 'Appointment ke liye call karein',
        '.doctor-card:nth-child(3) .appointment-link': 'Appointment ke liye call karein',
        '.doctor-note': 'Doctor profile images mein jaanbujhkar neutral illustrations use ki gayi hain, kisi unrelated stock photo ka use nahi hua hai.',
        '.contact-section .section-heading .eyebrow': 'Hum aapki help ke liye yahan hain',
        '.contact-section .section-heading h2': 'Apni visit plan karein',
        '.contact-section .section-heading-note': 'Appointment ke liye pehle call karein ya Saidpur mein RAINBOW HEALTH CLINIC AND HOSPITAL tak pahunchne ke liye neeche diya address use karein.',
        '.contact-card .card-kicker': 'Visit karein',
        '.contact-card h3': 'Contact information',
        '.contact-row:nth-child(1) strong': 'Address',
        '.contact-row:nth-child(2) strong': 'Phone numbers',
        '.contact-row:nth-child(3) strong': 'Operating hours',
        '.contact-actions .button:nth-child(1)': '8528695991 par call karein',
        '.contact-actions .button:nth-child(2)': '8090945179 par call karein',
        '.map-topline > span:last-child': 'Yahan tak pahunchne ka raasta',
        '.map-overlay h3': 'Saidpur Kotwali ke paas',
        '.map-overlay p': 'HR Restaurant ke paas, Saidpur - Ghazipur',
        '.map-overlay .button-full': 'Directions paayen',
        '.map-overlay small': 'Yeh RAINBOW HEALTH CLINIC AND HOSPITAL dwara share ki gayi exact Google Maps location kholta hai.',
        '.doctor-card:nth-child(3) .portrait-label': 'Profile illustration',
        '.emergency-banner strong': 'Emergency support',
        '.button-emergency': 'Emergency Call',
        '.footer-brand > p': 'Har generation ke liye compassionate care.',
        '.footer-column:nth-child(2) h2': 'Quick navigation',
        '.footer-column:nth-child(3) h2': 'Contact',
        '.footer-column:nth-child(4) h2': 'Hours',
        '.footer-column:nth-child(2) a:nth-of-type(1)': 'Home',
        '.footer-column:nth-child(2) a:nth-of-type(2)': 'Doctors',
        '.footer-column:nth-child(2) a:nth-of-type(3)': 'Services',
        '.footer-column:nth-child(2) a:nth-of-type(4)': 'About Us',
        '.footer-column:nth-child(2) a:nth-of-type(5)': 'Contact',
        '.footer-column:nth-child(4) p:nth-of-type(1)': 'Daily: 2:00 PM – 8:00 PM',
        '.footer-column:nth-child(4) p:nth-of-type(2)': 'Emergency: 24/7',
        '.footer-bottom > span:last-child': 'Saidpur ke families ke liye',
        '.emergency-fab strong': 'Emergency Call',
        '.emergency-fab small': '8528695991'
      },
      all: {
        '.doctor-details dt': ['Qualifications', 'Specialty', 'Additional qualifications', 'Current posting', 'Qualification', 'Specialty', 'Qualifications', 'Additional experience'],
        '.doctor-details dd': ['MBBS, DCH', 'Pediatrician aur Neonatologist', 'MD (RCH), Lucknow; FBNC (IMS BHU)', 'Senior Consultant, SNCU, Medical College Ghazipur', 'MBBS', 'Gynecology aur Obstetrics', 'MBBS, DGO, MS (G.S.V.M. Kanpur)', 'Ex. MO - IMS BHU']
      },
      html: {
        '.contact-row:nth-child(1) p': 'Saidpur Kotwali ke paas,<br>HR Restaurant ke paas,<br>Saidpur - Ghazipur',
        '.contact-row:nth-child(3) p': 'Daily: 2:00 PM – 8:00 PM<br><span class="emergency-inline">Emergency: 24/7</span>',
        '.emergency-banner p': 'Urgent help ke liye <a href="tel:+918528695991">8528695991</a> par call karein. Alternate contact: <a href="tel:+918090945179">8090945179</a>.',
        '.footer-column:nth-child(3) p': 'Saidpur Kotwali ke paas,<br>HR Restaurant ke paas,<br>Saidpur - Ghazipur',
        '.footer-bottom > span:first-child': '© <span id="current-year"></span> RAINBOW HEALTH CLINIC AND HOSPITAL. All rights reserved.'
      },
      attributes: {
        'meta[name="description"]': ['content', 'Saidpur, Ghazipur mein RAINBOW HEALTH CLINIC AND HOSPITAL families ke liye compassionate pediatric, newborn, gynecology aur obstetrics care provide karta hai.'],
        'meta[property="og:title"]': ['content', 'RAINBOW HEALTH CLINIC AND HOSPITAL | Har generation ke liye compassionate care'],
        'meta[property="og:description"]': ['content', 'Saidpur, Ghazipur mein pediatric, newborn, gynecology aur obstetrics care. Appointment aur directions ke liye RAINBOW HEALTH CLINIC AND HOSPITAL ko call karein.']
      }
    }
  };

  const localizedSlideAlts = {
    en: [
      'Modern hospital building exterior at dusk',
      'Bright hospital entrance with a welcoming front canopy',
      'Bright, clean hospital reception and waiting area',
      'Clean hospital treatment room prepared for a patient',
      'Nurse gently examining a young child in a pediatric room'
    ],
    hi: [
      'शाम के समय आधुनिक अस्पताल की इमारत का बाहरी दृश्य',
      'स्वागतपूर्ण प्रवेश द्वार वाला उजला अस्पताल',
      'उजला और साफ अस्पताल रिसेप्शन एवं प्रतीक्षा क्षेत्र',
      'मरीज के लिए तैयार साफ उपचार कक्ष',
      'बाल चिकित्सा कक्ष में बच्चे की कोमल जांच करती नर्स'
    ],
    hinglish: [
      'Shaam ke samay modern hospital building ka exterior',
      'Welcoming canopy wala bright hospital entrance',
      'Bright aur clean hospital reception aur waiting area',
      'Patient ke liye taiyaar clean treatment room',
      'Pediatric room mein bachche ko gently examine karti nurse'
    ]
  };

  const setPreservedText = (element, value) => {
    if (!element) return;
    const textNodes = [...element.childNodes].filter((node) => node.nodeType === Node.TEXT_NODE);
    if (!textNodes.length) {
      element.textContent = value;
      return;
    }
    const target = textNodes[textNodes.length - 1];
    const original = target.nodeValue || '';
    const leadingSpace = /^\s/.test(original) ? ' ' : '';
    const trailingSpace = /\s$/.test(original) ? ' ' : '';
    target.nodeValue = `${leadingSpace}${value}${trailingSpace}`;
  };

  const setText = (selector, value) => setPreservedText(document.querySelector(selector), value);
  const setAllText = (selector, values) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      if (values[index] !== undefined) setPreservedText(element, values[index]);
    });
  };

  const applyLanguage = (language) => {
    activeLanguage = supportedLanguages.includes(language) ? language : 'en';
    const copy = translations[activeLanguage];
    Object.entries(copy.text).forEach(([selector, value]) => setText(selector, value));
    Object.entries(copy.all).forEach(([selector, values]) => setAllText(selector, values));
    Object.entries(copy.html).forEach(([selector, value]) => {
      const element = document.querySelector(selector);
      if (element) element.innerHTML = value;
    });
    Object.entries(copy.attributes).forEach(([selector, [attribute, value]]) => {
      const element = document.querySelector(selector);
      if (element) element.setAttribute(attribute, value);
    });

    document.documentElement.lang = copy.lang;
    document.title = copy.title;
    const currentYear = document.querySelector('#current-year');
    if (currentYear) currentYear.textContent = String(new Date().getFullYear());
    document.querySelectorAll('.slide-image').forEach((image, index) => {
      const alt = localizedSlideAlts[activeLanguage]?.[index] || localizedSlideAlts.en[index];
      if (alt) image.alt = alt;
    });
    const visualImage = document.querySelector('.visual-frame img');
    if (visualImage) {
      visualImage.alt = activeLanguage === 'hi'
        ? 'साफ और आरामदायक अस्पताल का मरीज कक्ष'
        : activeLanguage === 'hinglish'
          ? 'Clean aur comfortable hospital patient room'
          : 'Clean, comfortable hospital patient room';
    }

    languageButtons.forEach((button) => {
      const isActive = button.dataset.language === activeLanguage;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    const carouselLabels = {
      en: ['Previous hospital image', 'Next hospital image', 'Choose hospital image'],
      hi: ['पिछली अस्पताल तस्वीर', 'अगली अस्पताल तस्वीर', 'अस्पताल की तस्वीर चुनें'],
      hinglish: ['Previous hospital image', 'Next hospital image', 'Hospital image choose karein']
    }[activeLanguage];
    prevButton?.setAttribute('aria-label', carouselLabels[0]);
    nextButton?.setAttribute('aria-label', carouselLabels[1]);
    dots.forEach((dot, index) => {
      const slideNames = activeLanguage === 'hi'
        ? ['अस्पताल का बाहरी दृश्य', 'अस्पताल का प्रवेश', 'रिसेप्शन क्षेत्र', 'उपचार कक्ष', 'बाल देखभाल']
        : activeLanguage === 'hinglish'
          ? ['Hospital exterior', 'Hospital entrance', 'Reception area', 'Treatment room', 'Pediatric care']
          : ['hospital exterior', 'hospital entrance', 'reception area', 'treatment room', 'pediatric care'];
      dot.setAttribute('aria-label', `${carouselLabels[2]}: ${slideNames[index]}`);
    });

    const menuAccessibilityLabels = menuLabels[activeLanguage] || menuLabels.en;
    menuToggle?.setAttribute('aria-label', header.classList.contains('is-menu-open') ? menuAccessibilityLabels.close : menuAccessibilityLabels.open);
    try {
      window.localStorage.setItem('rainbowHospitalLanguage', activeLanguage);
    } catch (error) {
      // Continue without persistence when storage is unavailable.
    }
    renderSlide(currentSlide);
  };

  languageButtons.forEach((button) => {
    button.addEventListener('click', () => {
      applyLanguage(button.dataset.language);
      if (window.innerWidth <= 840) setMenuOpen(false);
    });
  });
  applyLanguage(activeLanguage);

  // Footer year is intentionally generated at runtime.
  const year = document.querySelector('#current-year');
  if (year) year.textContent = String(new Date().getFullYear());

  // Expose only a tiny debug hook for local manual verification in the browser console.
  root.dataset.carouselReady = 'true';
});
