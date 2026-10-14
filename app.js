/**
 * ARSUS SOLUTIONS & SERVICES PRIVATE LIMITED - OFFICIAL PORTAL ENGINE V6.0
 * Pure Vanilla JavaScript: Accessible, High-Performance, Zero External Heavy Deps
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initHeroRotator();
  initMetricCounters();
  initNavigation();
  initContactForm();
  initHeroCardDeck();
});

/* ==========================================================================
   1. LIGHT / DARK THEME SYSTEM
   ========================================================================== */
function initTheme() {
  const themeToggleButtons = document.querySelectorAll('.theme-toggle-btn');
  const storedTheme = localStorage.getItem('arsus_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Set initial theme
  const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');
  applyTheme(initialTheme);

  themeToggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
      localStorage.setItem('arsus_theme', nextTheme);
    });
  });

  // Listen for system theme changes if user has not manually set preference
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('arsus_theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const themeToggleButtons = document.querySelectorAll('.theme-toggle-btn');
  themeToggleButtons.forEach(btn => {
    const icon = btn.querySelector('i');
    if (icon) {
      if (theme === 'dark') {
        icon.className = 'fa-solid fa-sun';
        btn.setAttribute('aria-label', 'Switch to Light Mode');
        btn.setAttribute('title', 'Switch to Light Mode');
      } else {
        icon.className = 'fa-solid fa-moon';
        btn.setAttribute('aria-label', 'Switch to Dark Mode');
        btn.setAttribute('title', 'Switch to Dark Mode');
      }
    }
  });
}

/* ==========================================================================
   2. HERO ROTATING HEADLINE
   ========================================================================== */
function initHeroRotator() {
  const phrases = document.querySelectorAll('.hero-rotator-phrase');
  if (phrases.length <= 1) return;

  let currentIndex = 0;
  setInterval(() => {
    phrases[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + 1) % phrases.length;
    phrases[currentIndex].classList.add('active');
  }, 3200);
}

/* ==========================================================================
   3. METRIC COUNTERS (INTERSECTION OBSERVER)
   ========================================================================== */
function initMetricCounters() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        if (isNaN(target)) return;

        let start = 0;
        const duration = 1600;
        const stepTime = 30;
        const totalSteps = duration / stepTime;
        const increment = target / totalSteps;

        const timer = setInterval(() => {
          start += increment;
          if (start >= target) {
            el.textContent = target;
            clearInterval(timer);
          } else {
            el.textContent = Math.floor(start);
          }
        }, stepTime);

        obs.unobserve(el);
      }
    });
  }, { threshold: 0.25 });

  counters.forEach(c => observer.observe(c));
}

/* ==========================================================================
   4. NAVIGATION & MOBILE DRAWER
   ========================================================================== */
function initNavigation() {
  const siteHeader = document.querySelector('.site-header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const drawerClose = document.getElementById('drawer-close');

  // Sticky header shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      siteHeader?.classList.add('scrolled');
    } else {
      siteHeader?.classList.remove('scrolled');
    }
  }, { passive: true });

  // Open drawer
  mobileToggle?.addEventListener('click', () => {
    mobileDrawer?.classList.add('active');
    drawerOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  // Close drawer helpers
  const closeDrawer = () => {
    mobileDrawer?.classList.remove('active');
    drawerOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  };

  drawerClose?.addEventListener('click', closeDrawer);
  drawerOverlay?.addEventListener('click', closeDrawer);

  // Close when drawer links are clicked
  document.querySelectorAll('.drawer-nav-link').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Escape key closes drawer
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileDrawer?.classList.contains('active')) {
      closeDrawer();
    }
  });

  // Smooth scroll for internal hash links with sticky header offset
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ScrollSpy for Active Section Navigation on Landing Page
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');

  if (sections.length && navLinks.length) {
    window.addEventListener('scroll', () => {
      let current = '';
      const scrollY = window.pageYOffset;

      sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.offsetHeight;
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${current}` || href === `index.html#${current}`) {
          link.classList.add('active');
        } else if (href.startsWith('#')) {
          link.classList.remove('active');
        }
      });
    }, { passive: true });
  }
}

/* ==========================================================================
   5. CONTACT FORM & DIRECT WHATSAPP INTEGRATION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('form-name')?.value.trim() || '';
    const email = document.getElementById('form-email')?.value.trim() || '';
    const phone = document.getElementById('form-phone')?.value.trim() || '';
    const service = document.getElementById('form-service')?.value || 'General Consultation';
    const message = document.getElementById('form-message')?.value.trim() || '';

    // Validation
    if (!name || !email || !phone || !message) {
      showFeedback('Please complete all required fields.', 'error');
      return;
    }

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,6}$/;
    if (!emailRegex.test(email)) {
      showFeedback('Please enter a valid email address.', 'error');
      return;
    }

    // Prepare WhatsApp Message
    const waText = `Hello ARSUS Team,

I would like to enquire about your services.

Name: ${name}
Email: ${email}
Phone: ${phone}
Service: ${service}

Message:
${message}

Thank you.`;

    // WhatsApp Official Click-to-Chat URL
    const waNumber = '919345201493';
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`;

    // Success State Feedback
    showFeedback('Enquiry validated! Connecting directly to WhatsApp...', 'success');

    // Open WhatsApp in new tab/window directly (Single-click interaction)
    window.open(waUrl, '_blank', 'noopener,noreferrer');

    // Reset Form
    form.reset();
  });

  function showFeedback(msg, type) {
    if (!feedback) return;
    feedback.className = `form-feedback ${type}`;
    feedback.innerHTML = type === 'success'
      ? `<i class="fa-solid fa-circle-check"></i> <span>${msg}</span>`
      : `<i class="fa-solid fa-circle-exclamation"></i> <span>${msg}</span>`;
    feedback.style.display = 'flex';
  }
}

/* ==========================================================================
   6. HERO 4-SERVICE FLOATING CARD DECK (SMOOTH 4s SHUFFLE LOOP)
   ========================================================================== */
function initHeroCardDeck() {
  const container = document.getElementById('hero-deck-container');
  const stack = document.getElementById('hero-deck-stack');
  if (!container || !stack) return;

  const cards = Array.from(stack.querySelectorAll('.deck-card'));
  if (!cards.length) return;

  const totalCards = cards.length;
  // currentOrder[0] is front card (pos-0), currentOrder[3] is back card (pos-3)
  let currentOrder = [0, 1, 2, 3];
  let isAnimating = false;
  let isPaused = false;
  const loopIntervalMs = 4000;
  let shuffleTimer = null;

  function updateCardClasses() {
    cards.forEach((card, idx) => {
      const pos = currentOrder.indexOf(idx);
      card.className = `deck-card pos-${pos}`;
    });
  }

  function shuffleFrontCardToBack() {
    if (isAnimating) return;
    isAnimating = true;

    const frontCardIdx = currentOrder[0];
    const frontCard = cards[frontCardIdx];

    // Trigger smooth shuffle animation on front card
    frontCard.classList.add('floating-shuffle-out');

    // Shift currentOrder: front card moves to the back
    const [first, ...rest] = currentOrder;
    currentOrder = [...rest, first];

    // Simultaneously step other cards forward smoothly
    cards.forEach((card, idx) => {
      if (idx !== frontCardIdx) {
        const newPos = currentOrder.indexOf(idx);
        card.className = `deck-card pos-${newPos}`;
      }
    });

    // When animation completes, settle card at back position
    setTimeout(() => {
      frontCard.classList.remove('floating-shuffle-out');
      frontCard.className = `deck-card pos-${totalCards - 1}`;
      isAnimating = false;
    }, 700);
  }

  function startAutoShuffle() {
    stopAutoShuffle();
    shuffleTimer = setInterval(() => {
      if (!isPaused && !isAnimating) {
        shuffleFrontCardToBack();
      }
    }, loopIntervalMs);
  }

  function stopAutoShuffle() {
    if (shuffleTimer) {
      clearInterval(shuffleTimer);
      shuffleTimer = null;
    }
  }

  function restartTimer() {
    stopAutoShuffle();
    startAutoShuffle();
  }

  // Pause on mouse hover so user can read comfortably and click links
  container.addEventListener('mouseenter', () => {
    isPaused = true;
  });

  container.addEventListener('mouseleave', () => {
    isPaused = false;
    restartTimer();
  });

  // Clicking on any card triggers smooth shuffle to next or clicked card
  cards.forEach((card, idx) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      if (isAnimating) return;

      if (currentOrder[0] === idx) {
        // Clicking the front card shuffles to next
        shuffleFrontCardToBack();
        restartTimer();
      } else {
        // Clicking a card peeking behind brings it to the front
        while (currentOrder[0] !== idx) {
          const [first, ...rest] = currentOrder;
          currentOrder = [...rest, first];
        }
        updateCardClasses();
        restartTimer();
      }
    });
  });

  // Initial setup and start loop
  updateCardClasses();
  startAutoShuffle();
}


