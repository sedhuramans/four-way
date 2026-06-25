/**
 * Fourways — Luxury French Experience JS
 * All DOM-dependent code runs inside DOMContentLoaded.
 */
(function () {
  'use strict';

  /* ── Page Loader (window.load — no DOM needed) ─────────── */
  window.addEventListener('load', function () {
    var loader = document.querySelector('.lux-loader');
    if (loader) setTimeout(function () { loader.classList.add('hidden'); }, 1400);

    // Ken Burns on static hero pages
    var hero = document.querySelector('.lux-hero');
    if (hero) hero.classList.add('loaded');
  });

  /* ── Everything else after DOM is ready ────────────────── */
  document.addEventListener('DOMContentLoaded', function () {

    /* ── i18n ───────────────────────────────────────────── */
    if (typeof i18n !== 'undefined') i18n.apply(i18n.getCurrentLang());

    /* ═══════════════════════════════════════════════════════
       NAVBAR
    ═══════════════════════════════════════════════════════ */
    var nav        = document.querySelector('.lux-nav');
    var hamburger  = document.getElementById('luxHamburger');
    var overlay    = document.getElementById('luxNavLinks');
    var menuOpen   = false;
    var savedScrollY = 0;

    /* Scroll state */
    var startsTransparent = nav && nav.classList.contains('transparent');

    function setNavState() {
      if (!nav || !startsTransparent) return;
      if (menuOpen || window.scrollY > 50) {
        nav.classList.remove('transparent');
        nav.classList.add('scrolled');
      } else {
        nav.classList.add('transparent');
        nav.classList.remove('scrolled');
      }
    }
    if (nav) {
      setNavState();
      window.addEventListener('scroll', setNavState, { passive: true });
    }

    /* Open menu */
    function openNav() {
      if (!overlay || !hamburger) return;
      menuOpen = true;
      savedScrollY = window.scrollY;

      overlay.classList.add('open');
      hamburger.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');

      /* Lock body without position:fixed (avoids iOS jump-to-top) */
      document.body.style.overflow = 'hidden';

      /* Always dark while open */
      if (nav) {
        nav.classList.remove('transparent');
        nav.classList.add('scrolled');
      }
    }

    /* Close menu */
    function closeNav() {
      if (!overlay || !hamburger) return;
      menuOpen = false;

      overlay.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');

      document.body.style.overflow = '';

      /* Restore correct nav state */
      setNavState();
    }

    /* Wire up hamburger */
    if (hamburger) {
      hamburger.addEventListener('click', function (e) {
        e.stopPropagation();
        menuOpen ? closeNav() : openNav();
      });
    }

    /* Close on link tap */
    if (overlay) {
      overlay.querySelectorAll('.lux-nav__link').forEach(function (link) {
        link.addEventListener('click', closeNav);
      });

      /* Close on backdrop tap (clicking the overlay bg itself) */
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closeNav();
      });
    }

    /* Close on Escape */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuOpen) {
        closeNav();
        if (hamburger) hamburger.focus();
      }
    });

    /* ── Inject EN/FR button inside the mobile overlay ──── */
    var headerLangBtn = document.getElementById('langSwitcher');
    if (overlay && headerLangBtn && !overlay.querySelector('.lux-nav__lang--mobile')) {
      var mlBtn       = document.createElement('button');
      mlBtn.className = 'lux-nav__lang--mobile';
      mlBtn.type      = 'button';
      mlBtn.setAttribute('aria-label', 'Switch language');
      mlBtn.textContent = headerLangBtn.textContent || 'EN / FR';
      mlBtn.addEventListener('click', function () {
        if (typeof i18n !== 'undefined') {
          i18n.toggleLanguage();
          var cur   = typeof i18n.getCurrentLang === 'function' ? i18n.getCurrentLang() : 'en';
          var label = cur === 'fr' ? 'FR / EN' : 'EN / FR';
          mlBtn.textContent         = label;
          headerLangBtn.textContent = label;
        }
      });
      overlay.appendChild(mlBtn);
    }

    /* Sync label after i18n runs */
    if (headerLangBtn && overlay) {
      var ml = overlay.querySelector('.lux-nav__lang--mobile');
      if (ml) ml.textContent = headerLangBtn.textContent;
    }

    /* Active link highlight */
    var page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.lux-nav__link').forEach(function (lnk) {
      var href = lnk.getAttribute('href');
      if (href && (href === page || href.split('?')[0] === page ||
          (page === '' && href === 'index.html'))) {
        lnk.classList.add('active');
      }
    });

    /* ═══════════════════════════════════════════════════════
       SCROLL-TRIGGERED REVEALS
    ═══════════════════════════════════════════════════════ */
    if (window.IntersectionObserver) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
      document.querySelectorAll('.lux-reveal').forEach(function (el) {
        io.observe(el);
      });
    }

    /* ═══════════════════════════════════════════════════════
       SCROLL-TO-TOP
    ═══════════════════════════════════════════════════════ */
    var topBtn = document.querySelector('.lux-scroll-top');
    if (topBtn) {
      window.addEventListener('scroll', function () {
        topBtn.classList.toggle('visible', window.scrollY > 400);
      }, { passive: true });
      topBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    /* ═══════════════════════════════════════════════════════
       SMOOTH ANCHOR SCROLLING
    ═══════════════════════════════════════════════════════ */
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          window.scrollTo({
            top: target.getBoundingClientRect().top + window.scrollY - 80,
            behavior: 'smooth'
          });
        }
      });
    });

    /* ═══════════════════════════════════════════════════════
       LIGHTBOX  (pages using .lux-gallery-item)
    ═══════════════════════════════════════════════════════ */
    var lb      = document.querySelector('.lux-lightbox');
    var lbImg   = document.querySelector('.lux-lightbox__img');
    var imgs    = [];
    var lbIdx   = 0;

    if (lb && lbImg) {
      document.querySelectorAll('.lux-gallery-item').forEach(function (item, i) {
        var img = item.querySelector('img');
        if (!img) return;
        imgs.push({ src: img.src, alt: img.alt });
        item.addEventListener('click', function () { openLb(i); });
        item.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLb(i); }
        });
      });

      function openLb(i) {
        lbIdx = i; lbImg.src = imgs[i].src; lbImg.alt = imgs[i].alt || '';
        lb.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
      function closeLb() {
        lb.classList.remove('open');
        document.body.style.overflow = '';
      }
      function nav_lb(d) {
        lbIdx = (lbIdx + d + imgs.length) % imgs.length;
        lbImg.style.opacity = '0';
        setTimeout(function () { lbImg.src = imgs[lbIdx].src; lbImg.style.opacity = '1'; }, 160);
      }

      var lbClose = document.querySelector('.lux-lightbox__close');
      var lbPrev  = document.querySelector('.lux-lightbox__prev');
      var lbNext  = document.querySelector('.lux-lightbox__next');
      if (lbClose) lbClose.addEventListener('click', closeLb);
      if (lbPrev)  lbPrev.addEventListener('click', function () { nav_lb(-1); });
      if (lbNext)  lbNext.addEventListener('click', function () { nav_lb(1); });
      lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
      document.addEventListener('keydown', function (e) {
        if (!lb.classList.contains('open')) return;
        if (e.key === 'Escape')     closeLb();
        if (e.key === 'ArrowLeft')  nav_lb(-1);
        if (e.key === 'ArrowRight') nav_lb(1);
      });
    }

  }); // end DOMContentLoaded

})();
