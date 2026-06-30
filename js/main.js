/* ================================================================
   MAIN.JS — Portfolio JavaScript
   Navigation, Scroll Reveals, Tilt, Smooth Interactions
   ================================================================ */

'use strict';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isDesktop = window.innerWidth > 768;
const isDesktopLg = window.innerWidth > 1024;

/* ========== NAV ========== */
const nav        = document.getElementById('nav');
const menuBtn    = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
  nav?.classList.toggle('nav--scrolled', window.scrollY > 20);
}, { passive: true });

menuBtn?.addEventListener('click', () => {
  const open = menuBtn.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(open));
  mobileMenu?.classList.toggle('open', open);
  mobileMenu?.setAttribute('aria-hidden', String(!open));
  document.body.style.overflow = open ? 'hidden' : '';
});

mobileMenu?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    menuBtn?.classList.remove('open');
    menuBtn?.setAttribute('aria-expanded', 'false');
    mobileMenu?.classList.remove('open');
    mobileMenu?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  });
});

const currentPath = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__link').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPath || (currentPath === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

/* ========== SCROLL REVEAL (Step 6) ========== */
if (!prefersReducedMotion) {
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });

  revealEls.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 60, 400)}ms`;
    revealObserver.observe(el);
  });
} else {
  document.querySelectorAll('.reveal-up, .reveal-right').forEach(el => {
    el.classList.add('visible');
  });
}

/* ========== STAGGER CHILD ANIMATIONS ========== */
if (!prefersReducedMotion) {
  document.querySelectorAll('.bento, .projects-grid__inner, .contact-links').forEach(container => {
    const children = container.querySelectorAll(':scope > *');
    children.forEach((child, i) => {
      child.style.transitionDelay = `${i * 80}ms`;
    });
  });
}

/* ========== BENTO CARD TILT + CURSOR GLOW (Steps 4 & 6) ========== */
if (!prefersReducedMotion && isDesktop) {
  document.querySelectorAll('.bento__card, .project-card').forEach(card => {
    // Cursor glow (custom property approach — no layout triggers)
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update CSS custom props for the ::after radial gradient
      card.style.setProperty('--card-glow-x', `${x}px`);
      card.style.setProperty('--card-glow-y', `${y}px`);

      // Tilt (small angle, clamped to ±5deg for cards)
      const cx = (x / rect.width  - 0.5);
      const cy = (y / rect.height - 0.5);
      card.style.transform = `perspective(900px) rotateX(${-cy * 5}deg) rotateY(${cx * 5}deg) translateZ(6px)`;
    }, { passive: true });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ========== PORTRAIT MOUSE PARALLAX TILT (Step 1) ========== */
if (!prefersReducedMotion && isDesktopLg) {
  const portraitFrame = document.getElementById('portrait-tilt');
  const heroBg        = document.querySelector('.hero__bg-glow');
  const heroPortrait  = document.querySelector('.hero__portrait');

  // Float animation runs via CSS. JS only adds tilt offset on top.
  // We intercept transform but still need float, so we combine.
  // Approach: store tilt in data attrs, apply via requestAnimationFrame.
  let tiltX = 0, tiltY = 0;
  let rafId = null;

  window.addEventListener('mousemove', e => {
    const mx = (e.clientX / window.innerWidth  - 0.5) * 2;
    const my = (e.clientY / window.innerHeight - 0.5) * 2;

    // Clamp to ±6deg for portrait, ±12px for bg parallax
    tiltX = clamp(my * -6, -6, 6);
    tiltY = clamp(mx *  6, -6, 6);

    if (!rafId) {
      rafId = requestAnimationFrame(() => {
        if (portraitFrame) {
          // Compose with float animation by using a nested wrapper approach:
          // float runs on .hero__portrait-frame via CSS keyframe,
          // tilt applied as a CSS var so they combine.
          portraitFrame.style.setProperty('--tilt-x', `${tiltX}deg`);
          portraitFrame.style.setProperty('--tilt-y', `${tiltY}deg`);
        }
        if (heroBg) {
          heroBg.style.transform = `translate(${mx * 14}px, ${my * 8}px)`;
        }
        rafId = null;
      });
    }
  }, { passive: true });
}

function clamp(val, min, max) { return Math.min(Math.max(val, min), max); }

/* ========== MAGNETIC BUTTONS (Step 6) ========== */
if (!prefersReducedMotion && isDesktop) {
  document.querySelectorAll('.btn--primary').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const cx = e.clientX - rect.left - rect.width  / 2;
      const cy = e.clientY - rect.top  - rect.height / 2;
      // Magnetic pull: max offset 8px, falls off toward center
      const dx = clamp(cx * 0.28, -8, 8);
      const dy = clamp(cy * 0.28, -8, 8);
      btn.style.setProperty('--btn-x', `${dx}px`);
      btn.style.setProperty('--btn-y', `${dy}px`);
    }, { passive: true });

    btn.addEventListener('mouseleave', () => {
      btn.style.setProperty('--btn-x', '0px');
      btn.style.setProperty('--btn-y', '0px');
    });
  });
}

/* ========== BENTO CARD CLICK NAVIGATION ========== */
document.querySelectorAll('.bento__card[data-href]').forEach(card => {
  card.addEventListener('click', e => {
    if (e.target.closest('a')) return;
    window.location.href = card.dataset.href;
  });
});

document.querySelectorAll('.project-card[data-href]').forEach(card => {
  card.addEventListener('click', e => {
    if (e.target.closest('a')) return;
    window.location.href = card.dataset.href;
  });
});

/* ========== CASE STUDY TOC ACTIVE STATE ========== */
const tocLinks = document.querySelectorAll('.case-study__toc-link');
if (tocLinks.length) {
  const sections = document.querySelectorAll('.case-study__section[id]');

  const tocObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        tocLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: '-20% 0px -60% 0px' });

  sections.forEach(s => tocObserver.observe(s));
}

/* ========== SMOOTH SCROLL FOR ANCHOR LINKS ========== */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ========== COUNT-UP FOR STAT/NUMBER ELEMENTS (Step 6) ========== */
if (!prefersReducedMotion) {
  const countEls = document.querySelectorAll('[data-count]');
  if (countEls.length) {
    const countObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el    = entry.target;
        const end   = parseFloat(el.dataset.count);
        const dur   = parseInt(el.dataset.countDur || '1200', 10);
        const dec   = parseInt(el.dataset.countDec  || '0',    10);
        const start = performance.now();
        function step(now) {
          const p = Math.min((now - start) / dur, 1);
          const v = easeOut(p) * end;
          el.textContent = v.toFixed(dec) + (el.dataset.countSuffix || '');
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        countObserver.unobserve(el);
      });
    }, { threshold: 0.5 });
    countEls.forEach(el => countObserver.observe(el));
  }
}

function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

/* ========== COPY EMAIL ON CLICK ========== */
document.querySelectorAll('[data-copy]').forEach(btn => {
  btn.addEventListener('click', () => {
    const text = btn.dataset.copy;
    navigator.clipboard?.writeText(text).then(() => {
      const orig = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => { btn.textContent = orig; }, 2000);
    });
  });
});

console.log('%c Akshat — Portfolio', 'color: #4f9eff; font-size: 14px; font-weight: bold;');
console.log('%c github.com/Akshat0359', 'color: #8b97a5; font-size: 12px;');
