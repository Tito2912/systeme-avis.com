// Systeme.io Avis - Main JS File
// Version corrigée et optimisée + Consent Mode v2
(function () {
  'use strict';

  // -------------------------------
  // Utilitaires & consentement
  // -------------------------------
  var CONSENT_KEY = 'cookieConsent';

  function ensureGtagProxy() {
    if (typeof gtag !== 'function') {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { dataLayer.push(arguments); };
    }
  }

  function isEnglish() {
    var lang = (document.documentElement.getAttribute('lang') || '').toLowerCase();
    return lang.startsWith('en');
  }

  function applyConsentFromStorage() {
    try {
      var consent = localStorage.getItem(CONSENT_KEY);
      ensureGtagProxy();
      if (consent === 'accepted') {
        gtag('consent', 'update', {
          analytics_storage: 'granted',
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied'
        });
        // Si la page a défini window.loadGA4, on charge GA4 après consentement
        if (typeof window.loadGA4 === 'function') window.loadGA4();
      } else if (consent === 'rejected') {
        gtag('consent', 'update', {
          analytics_storage: 'denied',
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied'
        });
      }
    } catch (e) {
      console.warn('Consent storage not available', e);
    }
  }

  // -------------------------------
  // Initialisation générale
  // -------------------------------
  function init() {
    applyConsentFromStorage();
    setupMobileMenu();
    setupFAQAccordion();
    setupSmoothScroll();
    setupCookieConsent();
    setupScrollAnimations();
    setupBackToTop();
    trackExternalLinks();
  }

  // -------------------------------
  // Menu Mobile Responsive
  // -------------------------------
  function setupMobileMenu() {
    var headerContainer = document.querySelector('.header .container');
    if (!headerContainer) return;

    var menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    menuToggle.setAttribute('aria-label', 'Toggle menu');
    menuToggle.setAttribute('aria-expanded', 'false');

    headerContainer.prepend(menuToggle);
    var mainNav = document.querySelector('.main-nav');

    menuToggle.addEventListener('click', function () {
      var isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!isExpanded));
      this.innerHTML = isExpanded ? '<i class="fas fa-bars"></i>' : '<i class="fas fa-times"></i>';
      if (mainNav) mainNav.style.display = isExpanded ? 'none' : 'flex';
    });

    // Fermer le menu quand un lien est cliqué
    document.querySelectorAll('.main-nav a').forEach(function (link) {
      link.addEventListener('click', function () {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        if (mainNav) mainNav.style.display = 'none';
      });
    });
  }

  // -------------------------------
  // FAQ Accordéon
  // -------------------------------
  function setupFAQAccordion() {
    var faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(function (item) {
      var question = item.querySelector('.faq-question');
      var answer = item.querySelector('.faq-answer');
      if (!question || !answer) return;

      // Initialisation
      answer.style.maxHeight = '0';
      answer.style.overflow = 'hidden';
      answer.style.transition = 'max-height 0.3s ease';

      question.addEventListener('click', function () {
        // Fermer les autres items
        faqItems.forEach(function (otherItem) {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            var otherAns = otherItem.querySelector('.faq-answer');
            if (otherAns) otherAns.style.maxHeight = '0';
          }
        });
        // Basculer l'item actuel
        item.classList.toggle('active');
        answer.style.maxHeight = item.classList.contains('active') ? answer.scrollHeight + 'px' : '0';
      });
    });
  }

  // -------------------------------
  // Smooth Scroll (respect RWD + R-M)
  // -------------------------------
  function setupSmoothScroll() {
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (!targetId || targetId === '#') return;
        var targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          var top = targetElement.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({
            top: top,
            behavior: reduceMotion ? 'auto' : 'smooth'
          });
        }
      });
    });
  }

  // -------------------------------
  // Bannière Cookies (RGPD / Consent Mode v2)
  // -------------------------------
  function setupCookieConsent() {
    if (localStorage.getItem(CONSENT_KEY)) {
      // déjà traité par applyConsentFromStorage()
      return;
    }

    var isEN = isEnglish();
    var policyHref = isEN ? '/en/privacy-policy.html#cookies' : '/politique-de-confidentialite.html#cookies';
    var text = isEN
      ? 'We use audience measurement cookies (GA4). You can accept or refuse. Learn more in our '
      : 'Nous utilisons des cookies de mesure d’audience (GA4). Vous pouvez accepter ou refuser. En savoir plus dans notre ';
    var linkText = isEN ? 'cookie policy' : 'politique des cookies';
    var acceptLabel = isEN ? 'Accept' : 'Accepter';
    var rejectLabel = isEN ? 'Reject' : 'Refuser';

    var cookieBanner = document.createElement('div');
    cookieBanner.className = 'cookie-banner';
    cookieBanner.setAttribute('role', 'dialog');
    cookieBanner.setAttribute('aria-live', 'polite');
    cookieBanner.style.position = 'fixed';
    cookieBanner.style.left = '0';
    cookieBanner.style.right = '0';
    cookieBanner.style.bottom = '0';
    cookieBanner.style.zIndex = '9999';
    cookieBanner.style.background = '#0f1020';
    cookieBanner.style.color = '#fff';
    cookieBanner.style.padding = '14px 18px';
    cookieBanner.style.boxShadow = '0 -8px 24px rgba(0,0,0,.3)';

    cookieBanner.innerHTML =
      '<div class="cookie-content" style="max-width:1000px;margin:0 auto;display:flex;gap:16px;align-items:center;justify-content:space-between;flex-wrap:wrap;">' +
      '<p style="margin:0;line-height:1.5;">' + text +
      '<a href="' + policyHref + '" style="color:#8ab4ff;text-decoration:underline;">' + linkText + '</a>.</p>' +
      '<div class="cookie-actions" style="display:flex;gap:10px;">' +
      '<button class="btn" id="acceptCookies" style="padding:8px 14px;border-radius:10px;border:none;background:#5E56E8;color:#fff;font-weight:600;cursor:pointer;">' + acceptLabel + '</button>' +
      '<button class="btn" id="rejectCookies" style="padding:8px 14px;border-radius:10px;border:1px solid #999;background:transparent;color:#fff;cursor:pointer;">' + rejectLabel + '</button>' +
      '</div></div>';

    document.body.appendChild(cookieBanner);

    function consentUpdate(granted) {
      ensureGtagProxy();
      gtag('consent', 'update', {
        analytics_storage: granted ? 'granted' : 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied'
      });
      if (granted) {
        if (typeof window.acceptAll === 'function') {
          // Utilise le flux défini dans les pages (charge GA4 + met à jour les signaux)
          window.acceptAll();
        } else if (typeof window.loadGA4 === 'function') {
          // Fallback : charge GA4 si disponible
          window.loadGA4();
        }
      } else if (typeof window.rejectAll === 'function') {
        window.rejectAll();
      }
      // Event custom (si utile côté front)
      try {
        window.dispatchEvent(new CustomEvent('cookie-consent', { detail: { granted: !!granted } }));
      } catch (e) {}
    }

    document.getElementById('acceptCookies').addEventListener('click', function () {
      localStorage.setItem(CONSENT_KEY, 'accepted');
      consentUpdate(true);
      cookieBanner.remove();
    });

    document.getElementById('rejectCookies').addEventListener('click', function () {
      localStorage.setItem(CONSENT_KEY, 'rejected');
      consentUpdate(false);
      cookieBanner.remove();
    });

    // Expose une API pour réafficher la bannière
    window.showCookieBanner = function () {
      if (!document.body.contains(cookieBanner)) document.body.appendChild(cookieBanner);
      cookieBanner.style.display = 'block';
    };
  }

  // -------------------------------
  // Animations au Scroll
  // -------------------------------
  function setupScrollAnimations() {
    var animElements = document.querySelectorAll('.card, .section-title, .avantage-card');
    if (!animElements.length) return;

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    animElements.forEach(function (el) { observer.observe(el); });
  }

  // -------------------------------
  // Bouton Retour en Haut
  // -------------------------------
  function setupBackToTop() {
    var backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTop.setAttribute('aria-label', 'Retour en haut');
    backToTop.style.display = 'none';

    document.body.appendChild(backToTop);

    window.addEventListener('scroll', function () {
      backToTop.style.display = window.scrollY > 500 ? 'block' : 'none';
    });

    backToTop.addEventListener('click', function () {
      var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  // -------------------------------
  // Tracking des liens externes
  // -------------------------------
  function trackExternalLinks() {
    document.querySelectorAll('a[href^="http"]').forEach(function (link) {
      try {
        if (link.hostname && link.hostname !== window.location.hostname) {
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');
          link.addEventListener('click', function () {
            // Console pour debug
            console.log('Lien externe cliqué:', this.href);

            // GA4 event si consentement OK
            if (localStorage.getItem(CONSENT_KEY) === 'accepted' && typeof gtag === 'function') {
              gtag('event', 'click_external_link', {
                event_category: 'engagement',
                event_label: this.href
              });
            }
          });
        }
      } catch (e) {}
    });
  }

  // -------------------------------
  // Démarrage
  // -------------------------------
  if (document.readyState !== 'loading') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();
