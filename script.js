/* ================================================================
   404 INDUSTRIES — Main Script v2.0
   Features: Scroll progress · Typewriter · Counters · Glow cards
             Portfolio filter · Form validation · Reveal animations
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Scroll Progress Bar ───────────────────────────────────── */
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    const updateProgress = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = maxScroll > 0 ? `${(scrolled / maxScroll) * 100}%` : '0%';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
  }

  /* ── Mobile Hamburger Menu ─────────────────────────────────── */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  /* ── Intersection Observer — Reveal ───────────────────────── */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = parseInt(el.dataset.delay || '0', 10);
        setTimeout(() => el.classList.add('visible'), delay);
        obs.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => io.observe(el));
  }

  /* ── Typewriter Effect ─────────────────────────────────────── */
  const twEl = document.getElementById('typewriter');
  if (twEl) {
    const words = twEl.dataset.words.split(',').map(w => w.trim());
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;

    const naturalDelay = (base) => base + (Math.random() * 30 - 15);

    const type = () => {
      if (isPaused) return;
      const current = words[wordIndex];

      if (!isDeleting) {
        charIndex++;
        twEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          isPaused = true;
          setTimeout(() => { isPaused = false; isDeleting = true; type(); }, 1900);
          return;
        }
      } else {
        charIndex--;
        twEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          isDeleting = false;
          wordIndex = (wordIndex + 1) % words.length;
        }
      }

      setTimeout(type, naturalDelay(isDeleting ? 50 : 90));
    };

    setTimeout(type, 600);
  }

  /* ── Animated Counters ─────────────────────────────────────── */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    // Cubic ease-out for satisfying deceleration
    const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

    const animateCounter = el => {
      const target    = parseFloat(el.dataset.count);
      const suffix    = el.dataset.suffix || '';
      const prefix    = el.dataset.prefix || '';
      const decimals  = parseInt(el.dataset.decimals || '0', 10);
      const duration  = 1500;
      let startTime   = null;

      const tick = ts => {
        if (!startTime) startTime = ts;
        const elapsed  = ts - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const value    = target * easeOutCubic(progress);
        el.textContent = prefix + value.toFixed(decimals) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    };

    const cio = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.5 });

    counters.forEach(el => cio.observe(el));
  }

  /* ── Glow Card Mouse Tracking ──────────────────────────────── */
  const glowCards = document.querySelectorAll('.glow-card');
  glowCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  ) * 100;
      const y = ((e.clientY - rect.top)  / rect.height ) * 100;
      card.style.setProperty('--mx', `${x}%`);
      card.style.setProperty('--my', `${y}%`);
    });
  });

  /* ── Active Nav Highlight (scroll-spy) ─────────────────────── */
  const sections  = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  if (sections.length && navAnchors.length) {
    const updateActive = () => {
      const scrollY = window.scrollY + 120;
      sections.forEach(sec => {
        const id = sec.getAttribute('id');
        if (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight) {
          navAnchors.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + id);
          });
        }
      });
    };
    window.addEventListener('scroll', updateActive, { passive: true });
    updateActive();
  }

  /* ── Portfolio Filter ──────────────────────────────────────── */
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const portItems   = document.querySelectorAll('.port-item[data-category]');

  if (filterBtns.length && portItems.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const cat = btn.dataset.filter;

        portItems.forEach(item => {
          const match = cat === 'all' || item.dataset.category === cat;

          if (match) {
            item.style.display = '';
            // Force reflow then fade in
            void item.offsetWidth;
            item.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
            item.style.opacity    = '1';
            item.style.transform  = 'scale(1)';
          } else {
            item.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
            item.style.opacity    = '0';
            item.style.transform  = 'scale(0.95)';
            setTimeout(() => { item.style.display = 'none'; }, 260);
          }
        });
      });
    });
  }

  /* ── Contact Form Validation ───────────────────────────────── */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const rules = {
      name:    val => val.length >= 2,
      email:   val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      message: val => val.length >= 10,
    };

    const validateField = input => {
      const group = input.closest('.form-group');
      if (!group) return true;
      const rule = rules[input.id];
      const valid = !rule || rule(input.value.trim());
      group.classList.toggle('has-error', !valid && input.value.trim() !== '');
      return valid || input.value.trim() === '';
    };

    const validateAll = () => {
      let allValid = true;
      contactForm.querySelectorAll('.form-input[required]').forEach(input => {
        const group = input.closest('.form-group');
        const rule  = rules[input.id];
        const valid = rule ? rule(input.value.trim()) : input.value.trim() !== '';
        if (!valid) { group?.classList.add('has-error'); allValid = false; }
      });
      return allValid;
    };

    // Live validation on blur/input
    contactForm.querySelectorAll('.form-input').forEach(input => {
      input.addEventListener('blur',  () => validateField(input));
      input.addEventListener('input', () => {
        if (input.closest('.form-group')?.classList.contains('has-error')) {
          validateField(input);
        }
      });
    });

    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      if (!validateAll()) return;

      const btn  = contactForm.querySelector('[type="submit"]');
      const name = contactForm.querySelector('#name')?.value    || '';
      const email= contactForm.querySelector('#email')?.value   || '';
      const svc  = contactForm.querySelector('#service')?.value || '';
      const msg  = contactForm.querySelector('#message')?.value || '';

      btn.disabled     = true;
      btn.textContent  = 'Sending…';

      const subject = encodeURIComponent('New Inquiry — ' + (svc || 'General'));
      const body    = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nService: ${svc}\n\nMessage:\n${msg}`
      );

      setTimeout(() => {
        window.location.href = `mailto:404industries@pleasebeimpressed.art?subject=${subject}&body=${body}`;
        btn.disabled    = false;
        btn.textContent = 'Send Message';
      }, 600);
    });
  }

  /* ── Footer Year ───────────────────────────────────────────── */
  document.querySelectorAll('.year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  /* ── Magnetic Button Effect ────────────────────────────────── */
  const magnetBtns = document.querySelectorAll('.btn--primary.btn--lg');
  if (window.matchMedia('(hover: hover)').matches) {
    magnetBtns.forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width  / 2;
        const cy = rect.top  + rect.height / 2;
        const dx = (e.clientX - cx) * 0.22;
        const dy = (e.clientY - cy) * 0.22;
        btn.style.transform = `translate(${dx}px, ${dy}px) translateY(-2px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

});
