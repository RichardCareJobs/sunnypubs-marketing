// Sticky header scroll effect
(function () {
  var header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    }, { passive: true });
  }
})();

// Count-up animation
(function () {
  var el = document.getElementById('count-up');
  if (!el) return;
  var to = 37, duration = 1400, start = performance.now();
  function tick(now) {
    var t = Math.min(1, (now - start) / duration);
    var eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(to * eased);
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();


// FAQ
var FAQS = [
  { q: 'Is Sunny just for pubs, or other venues too?', a: 'Pubs, beer gardens, rooftops, sports clubs and casual restaurants — anywhere serving a drink with proper outdoor seating. If it has a chair in the sun, we\'ll find it.' },
  { q: 'Where can I use Sunny?', a: 'Anywhere on the planet. Sunny works worldwide — wherever there\'s a venue with outdoor seating and a bit of sky overhead, you can find it. No regions, no waitlists, no limits.' },
  { q: 'Do venues pay to be listed?', a: 'No. Listings are organic and ranked purely by sun, distance and quality. Venues can claim their listing to update photos and opening hours, but they can\'t pay for placement.' },
  { q: 'Is the app free?', a: 'Yep — Sunny is free to download and use. We\'re working on a Sunny+ tier later this year with weekend forecasts and group planning, but the core map and live sun is and will stay free.' }
];

(function () {
  var list = document.getElementById('faq-list');
  if (!list) return;
  var openIndex = 0;
  function render() {
    var html = '';
    FAQS.forEach(function (f, i) {
      var isOpen = openIndex === i;
      html += '<div class="faq-item' + (isOpen ? ' is-open' : '') + '">' +
        '<button class="faq-q" data-i="' + i + '" aria-expanded="' + isOpen + '">' +
        '<span>' + f.q + '</span>' +
        '<span class="chev"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></span>' +
        '</button>' +
        '<div class="faq-a"><div class="faq-a-inner">' + f.a + '</div></div></div>';
    });
    list.innerHTML = html;
    list.querySelectorAll('.faq-q').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = parseInt(btn.getAttribute('data-i'));
        openIndex = openIndex === idx ? -1 : idx;
        render();
      });
    });
  }
  render();
})();

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(function (a) {
  a.addEventListener('click', function (e) {
    var target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
