(function () {
  'use strict';

  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#site-nav');

  function updateHeader() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 12);
  }

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  if (menuButton && nav) {
    menuButton.addEventListener('click', function () {
      const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!isOpen));
      nav.classList.toggle('is-open', !isOpen);
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menuButton.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
      });
    });
  }

  const revealItems = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(function (entries, instance) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const delay = entry.target.dataset.delay || 0;
        entry.target.style.transitionDelay = delay + 'ms';
        entry.target.classList.add('is-visible');
        instance.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    revealItems.forEach(function (item) { observer.observe(item); });
  } else {
    revealItems.forEach(function (item) { item.classList.add('is-visible'); });
  }

  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
}());
