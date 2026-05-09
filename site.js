// ============================================================
// Vanguard Private Client Group — Site JS
// ============================================================

(function () {
  // -- Header solid on scroll
  const header = document.querySelector('.site-header');
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 40) header.classList.add('is-solid');
    else header.classList.remove('is-solid');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // -- Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  if (toggle && header) {
    toggle.addEventListener('click', () => header.classList.toggle('menu-open'));
    header.querySelectorAll('.nav-link').forEach(a => {
      a.addEventListener('click', () => header.classList.remove('menu-open'));
    });
  }

  // -- Reveal on scroll
  const reveals = document.querySelectorAll('[data-reveal]');
  if (reveals.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach((el, i) => {
      // stagger inline if not pre-set
      if (!el.style.getPropertyValue('--reveal-delay')) {
        const delay = parseInt(el.getAttribute('data-delay') || '0', 10);
        el.style.setProperty('--reveal-delay', delay + 'ms');
      }
      io.observe(el);
    });
  }

  // -- Marquee duplication
  document.querySelectorAll('.marquee-track').forEach(track => {
    const inner = track.innerHTML;
    track.innerHTML = inner + inner;
  });
})();

// ============================================================
// Theme application — read localStorage on every page
// ============================================================
(function () {
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "palette": "ivory",
    "typeface": "cormorant",
    "density": "spacious",
    "theme": "light",
    "heroHeadline": "Operator-led capital. Institutional-quality execution.",
    "heroEm": "Operator-led",
    "heroSub": "Vanguard Private Client Group is a vertically integrated investment, brokerage, and operating platform focused on middle-market multifamily and adaptive reuse."
  }/*EDITMODE-END*/;

  let saved = {};
  try { saved = JSON.parse(localStorage.getItem('vpcg-tweaks') || '{}'); } catch (e) {}
  const merged = Object.assign({}, TWEAK_DEFAULTS, saved);
  window.__tweakDefaults = TWEAK_DEFAULTS;
  window.__tweakState = merged;

  const root = document.documentElement;
  root.setAttribute('data-palette', merged.palette);
  root.setAttribute('data-typeface', merged.typeface);
  root.setAttribute('data-density', merged.density === 'compact' ? 'compact' : 'spacious');
  root.setAttribute('data-theme', merged.theme === 'dark' ? 'dark' : 'light');

  // Inject hero copy if present on this page
  document.addEventListener('DOMContentLoaded', () => {
    const heroH1 = document.querySelector('[data-hero-headline]');
    const heroSub = document.querySelector('[data-hero-sub]');
    if (heroH1) {
      const em = (merged.heroEm || '').trim();
      let html = merged.heroHeadline;
      if (em && html.includes(em)) {
        html = html.replace(em, `<em>${em}</em>`);
      }
      heroH1.innerHTML = html;
    }
    if (heroSub) heroSub.textContent = merged.heroSub;
  });
})();
