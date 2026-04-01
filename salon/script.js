/* =========================================
   GULABI STUDIO — script.js
   ========================================= */

/* =========================================
   1. NAVBAR — Scroll Effect & Hamburger
   ========================================= */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

// Add shadow + background when user scrolls down
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Toggle mobile menu open/close
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close mobile menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Close menu if user clicks outside of it
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }
});


/* =========================================
   2. SCROLL REVEAL ANIMATIONS
   ========================================= */
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Stop observing once revealed for performance
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));


/* =========================================
   3. TESTIMONIAL SLIDER
   ========================================= */
const track = document.getElementById('testimonialTrack');
const cards = track ? track.querySelectorAll('.testimonial-card') : [];
const dotsContainer = document.getElementById('tDots');
const prevBtn = document.getElementById('tPrev');
const nextBtn = document.getElementById('tNext');

let currentSlide = 0;

// Determine how many cards to show at once
function getSlidesPerView() {
  return window.innerWidth <= 768 ? 1 : 2;
}

function getTotalSlides() {
  return Math.ceil(cards.length / getSlidesPerView());
}

// Build dot indicators
function buildDots() {
  if (!dotsContainer) return;
  dotsContainer.innerHTML = '';
  const total = getTotalSlides();
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('button');
    dot.className = 't-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }
}

// Move the slider to a specific slide index
function goToSlide(index) {
  const total = getTotalSlides();
  if (index < 0) index = total - 1;
  if (index >= total) index = 0;
  currentSlide = index;

  const perView = getSlidesPerView();
  const cardWidth = cards[0] ? cards[0].offsetWidth + 24 : 0; // 24px gap
  track.style.transform = `translateX(-${currentSlide * cardWidth * perView}px)`;

  // Update active dot
  dotsContainer.querySelectorAll('.t-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

// Auto-advance every 5 seconds
let autoSlide = setInterval(() => goToSlide(currentSlide + 1), 5000);

// Pause auto-advance on hover
if (track) {
  track.addEventListener('mouseenter', () => clearInterval(autoSlide));
  track.addEventListener('mouseleave', () => {
    autoSlide = setInterval(() => goToSlide(currentSlide + 1), 5000);
  });
}

// Rebuild on window resize
window.addEventListener('resize', () => {
  currentSlide = 0;
  buildDots();
  goToSlide(0);
});

// Initialize slider
buildDots();
goToSlide(0);


/* =========================================
   4. CONTACT FORM VALIDATION
   ========================================= */
const bookingForm = document.getElementById('bookingForm');

/**
 * Show an error message below a field
 * @param {string} fieldId - The input element's ID
 * @param {string} errorId - The error span's ID
 * @param {string} message - Error message to show
 */
function showError(fieldId, errorId, message) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  if (field) field.classList.add('error');
  if (error) error.textContent = message;
}

/**
 * Clear an error on a specific field
 */
function clearError(fieldId, errorId) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  if (field) field.classList.remove('error');
  if (error) error.textContent = '';
}

/**
 * Validate a Pakistani phone number
 * Accepts formats: 03XXXXXXXXX, +923XXXXXXXXX, 923XXXXXXXXX
 */
function isValidPakistaniPhone(phone) {
  const cleaned = phone.replace(/[\s\-()]/g, '');
  const regex = /^(\+?92|0)3[0-9]{9}$/;
  return regex.test(cleaned);
}

/**
 * Basic email format validation
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Clear errors as user types (real-time feedback)
['name', 'phone', 'email', 'service', 'date'].forEach(id => {
  const field = document.getElementById(id);
  if (field) {
    field.addEventListener('input', () => clearError(id, id + 'Error'));
    field.addEventListener('change', () => clearError(id, id + 'Error'));
  }
});

// Form submit handler
if (bookingForm) {
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent actual form submission

    let isValid = true;

    // — Name validation —
    const name = document.getElementById('name').value.trim();
    clearError('name', 'nameError');
    if (!name) {
      showError('name', 'nameError', 'Please enter your full name.');
      isValid = false;
    } else if (name.length < 3) {
      showError('name', 'nameError', 'Name must be at least 3 characters.');
      isValid = false;
    }

    // — Phone validation —
    const phone = document.getElementById('phone').value.trim();
    clearError('phone', 'phoneError');
    if (!phone) {
      showError('phone', 'phoneError', 'Please enter your phone number.');
      isValid = false;
    } else if (!isValidPakistaniPhone(phone)) {
      showError('phone', 'phoneError', 'Enter a valid Pakistani number (e.g. 03001234567).');
      isValid = false;
    }

    // — Email validation (optional field) —
    const email = document.getElementById('email').value.trim();
    clearError('email', 'emailError');
    if (email && !isValidEmail(email)) {
      showError('email', 'emailError', 'Please enter a valid email address.');
      isValid = false;
    }

    // — Service validation —
    const service = document.getElementById('service').value;
    clearError('service', 'serviceError');
    if (!service) {
      showError('service', 'serviceError', 'Please select a service.');
      isValid = false;
    }

    // — Date validation —
    const date = document.getElementById('date').value;
    clearError('date', 'dateError');
    if (!date) {
      showError('date', 'dateError', 'Please select a preferred date.');
      isValid = false;
    } else {
      const selected = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        showError('date', 'dateError', 'Please choose a date in the future.');
        isValid = false;
      }
    }

    // If all fields are valid — show success message
    if (isValid) {
      const submitBtn = document.getElementById('submitBtn');
      const successMsg = document.getElementById('formSuccess');

      // Simulate loading state
      submitBtn.textContent = 'Sending... ✦';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';

      // Simulate async submission (replace with actual API call)
      setTimeout(() => {
        submitBtn.style.display = 'none';
        successMsg.style.display = 'block';
        bookingForm.reset();

        // Re-enable after 8 seconds if needed
        setTimeout(() => {
          submitBtn.style.display = '';
          submitBtn.textContent = 'Confirm Appointment ✦';
          submitBtn.disabled = false;
          submitBtn.style.opacity = '1';
          successMsg.style.display = 'none';
        }, 8000);
      }, 1200);
    }
  });
}


/* =========================================
   5. SMOOTH SCROLL (fallback for older browsers)
   ========================================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navHeight = navbar.offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 8;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  });
});


/* =========================================
   6. SET MINIMUM DATE on Date Input (today)
   ========================================= */
const dateInput = document.getElementById('date');
if (dateInput) {
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);
}


/* =========================================
   7. ACTIVE NAV LINK HIGHLIGHT ON SCROLL
   ========================================= */
const sections = document.querySelectorAll('section[id]');
const allNavLinks = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      allNavLinks.forEach(link => link.classList.remove('active-link'));
      const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (activeLink) activeLink.classList.add('active-link');
    }
  });
}, {
  threshold: 0.4,
  rootMargin: '-80px 0px -40% 0px'
});

sections.forEach(section => sectionObserver.observe(section));


/* =========================================
   8. GALLERY LIGHTBOX (Simple)
   ========================================= */
function createLightbox() {
  const overlay = document.createElement('div');
  overlay.id = 'lightbox';
  overlay.style.cssText = `
    position: fixed; inset: 0; background: rgba(44, 38, 40, 0.95);
    display: flex; align-items: center; justify-content: center;
    z-index: 9999; cursor: zoom-out; opacity: 0; transition: opacity 0.3s ease;
    padding: 24px;
  `;

  const img = document.createElement('img');
  img.style.cssText = `
    max-width: 90vw; max-height: 85vh; object-fit: contain;
    border-radius: 12px; box-shadow: 0 24px 80px rgba(0,0,0,0.5);
    transform: scale(0.9); transition: transform 0.3s ease;
  `;

  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '×';
  closeBtn.style.cssText = `
    position: fixed; top: 20px; right: 24px;
    color: #fff; font-size: 2.5rem; background: none; border: none;
    cursor: pointer; line-height: 1; opacity: 0.8; font-family: inherit;
    transition: opacity 0.2s;
  `;
  closeBtn.addEventListener('mouseenter', () => closeBtn.style.opacity = '1');
  closeBtn.addEventListener('mouseleave', () => closeBtn.style.opacity = '0.8');

  overlay.appendChild(img);
  overlay.appendChild(closeBtn);
  document.body.appendChild(overlay);

  // Close lightbox
  function closeLightbox() {
    overlay.style.opacity = '0';
    img.style.transform = 'scale(0.9)';
    setTimeout(() => { overlay.style.display = 'none'; }, 300);
    document.body.style.overflow = '';
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeLightbox();
  });
  closeBtn.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  return { overlay, img };
}

const { overlay: lightboxOverlay, img: lightboxImg } = createLightbox();

// Attach click to gallery items
document.querySelectorAll('.gallery-item img').forEach(img => {
  img.style.cursor = 'zoom-in';
  img.addEventListener('click', () => {
    lightboxImg.src = img.src.replace('w=400', 'w=1200').replace('w=500', 'w=1200').replace('w=600', 'w=1200');
    lightboxImg.alt = img.alt;
    lightboxOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => {
      lightboxOverlay.style.opacity = '1';
      lightboxImg.style.transform = 'scale(1)';
    });
  });
});


/* =========================================
   9. ACTIVE NAV LINK CSS (injected dynamically)
   ========================================= */
const styleTag = document.createElement('style');
styleTag.textContent = `.active-link { color: var(--rose) !important; }`;
document.head.appendChild(styleTag);


/* =========================================
   Console message for developers
   ========================================= */
console.log('%c✦ Gulabi Studio Website', 'color: #c9748a; font-size: 16px; font-weight: bold;');
console.log('%cBuilt with ❤️ | Modify freely!', 'color: #8a7a7d; font-size: 12px;');
