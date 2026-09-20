(function () {
  const revealSelector = [
    'main > section',
    '.content-section',
    '.hero-section',
    '.contact-section',
    '.location-section',
    '.why-section',
    '.cards-grid',
    '.cards-section',
    '.card',
    '.page-header',
    'body > .jumbotron',
    'body > .card.bg-dark',
    '#carouselExampleIndicators',
    '.hero-image',
    '.quote-text',
    '.section-strip',
    '.show-all-wrapper'
  ].join(', ');

  const revealElements = Array.from(document.querySelectorAll(revealSelector))
    .filter(function (element) {
      return !element.closest('nav, footer, .modal');
    });

  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(function (element) {
      element.classList.add('site-reveal', 'is-visible');
    });
    return;
  }

  const observer = new IntersectionObserver(function (entries, currentObserver) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -35px 0px'
  });

  revealElements.forEach(function (element, index) {
    element.classList.add('site-reveal');
    element.style.setProperty('--site-reveal-delay', Math.min(index * 0.08, 0.32) + 's');
    observer.observe(element);
  });
})();
