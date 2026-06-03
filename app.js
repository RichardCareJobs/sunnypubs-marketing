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

// Places data and tabs
var NEIGHBORHOODS = [
  { id: 'islington', label: 'Islington' },
  { id: 'highbury', label: 'Highbury' },
  { id: 'dalston', label: 'Dalston' },
  { id: 'hackney', label: 'Hackney' },
  { id: 'shoreditch', label: 'Shoreditch' }
];

var PLACES = {
  islington: [
    { name: 'The Albion', dist: '0.2 mi', hood: 'Islington', sun: 5, tag: 'Sunny now', grad: 'linear-gradient(135deg,#a4c79c,#e7a866 70%,#ffc88a)' },
    { name: 'The Old Queen\'s Head', dist: '0.4 mi', hood: 'Islington', sun: 4, tag: 'Sunny until 7pm', grad: 'linear-gradient(135deg,#7da38b,#cf8c5c 70%,#ffd089)' },
    { name: 'The Flask', dist: '0.6 mi', hood: 'Islington', sun: 5, tag: 'Sunny now', grad: 'linear-gradient(135deg,#c9b58a,#e0a472 70%,#ffd99c)' }
  ],
  highbury: [
    { name: 'The Snooty Fox', dist: '0.3 mi', hood: 'Highbury', sun: 5, tag: 'Sunny now', grad: 'linear-gradient(135deg,#b6c7a3,#dba16a 70%,#ffce8a)' },
    { name: 'The Compton Arms', dist: '0.5 mi', hood: 'Highbury', sun: 3, tag: 'Patchy sun', grad: 'linear-gradient(135deg,#94a98b,#bd9067 70%,#e5b582)' },
    { name: 'The Famous Cock', dist: '0.6 mi', hood: 'Highbury', sun: 4, tag: 'Sunny until 6pm', grad: 'linear-gradient(135deg,#a6b48d,#d29964 70%,#f5c187)' }
  ],
  dalston: [
    { name: 'Ridley Road Bar', dist: '0.4 mi', hood: 'Dalston', sun: 5, tag: 'Sunny now', grad: 'linear-gradient(135deg,#c2b385,#dfa367 70%,#ffd28e)' },
    { name: 'Farr\'s School', dist: '0.5 mi', hood: 'Dalston', sun: 4, tag: 'Sunny until 7pm', grad: 'linear-gradient(135deg,#9ab18d,#c69162 70%,#f0bb82)' },
    { name: 'The Three Compasses', dist: '0.6 mi', hood: 'Dalston', sun: 4, tag: 'Sunny until 6pm', grad: 'linear-gradient(135deg,#a5b58e,#cd9763 70%,#f3c082)' }
  ],
  hackney: [
    { name: 'The Pembury', dist: '0.5 mi', hood: 'Hackney', sun: 4, tag: 'Sunny until 7pm', grad: 'linear-gradient(135deg,#aab98a,#d39863 70%,#f5c386)' },
    { name: 'Spurstowe Arms', dist: '0.7 mi', hood: 'Hackney', sun: 5, tag: 'Sunny now', grad: 'linear-gradient(135deg,#c5b785,#e0a263 70%,#ffd089)' },
    { name: 'The Cock Tavern', dist: '0.8 mi', hood: 'Hackney', sun: 3, tag: 'Patchy sun', grad: 'linear-gradient(135deg,#94a78b,#bd9067 70%,#e6b582)' }
  ],
  shoreditch: [
    { name: 'The Owl & Pussycat', dist: '0.6 mi', hood: 'Shoreditch', sun: 4, tag: 'Sunny until 7pm', grad: 'linear-gradient(135deg,#b6c2a0,#daa467 70%,#fcc88a)' },
    { name: 'Queen of Hoxton', dist: '0.7 mi', hood: 'Shoreditch', sun: 5, tag: 'Sunny now', grad: 'linear-gradient(135deg,#d2bf86,#e8a364 70%,#ffd089)' },
    { name: 'The Mason & Taylor', dist: '0.9 mi', hood: 'Shoreditch', sun: 3, tag: 'Patchy sun', grad: 'linear-gradient(135deg,#92a888,#bd9067 70%,#e3b481)' }
  ]
};

var SUN_LABELS = ['Shaded', 'Mostly shaded', 'Patchy', 'Sunny', 'Very sunny', 'Full sun'];

var savedSet = {};

function sunMeterHTML(value) {
  var cells = '';
  for (var i = 0; i < 5; i++) {
    cells += '<div class="sun-cell' + (i < value ? ' on' : '') + '"></div>';
  }
  return '<div class="sun-meter">' + cells + '<span>' + SUN_LABELS[value] + '</span></div>';
}

function heartSVG(filled) {
  if (filled) {
    return '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 21s-7-4.5-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.5-9 9-9 9Z"/></svg>';
  }
  return '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-4.5-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.5-9 9-9 9Z"/></svg>';
}

function renderPlaces(activeId) {
  var grid = document.getElementById('places-grid');
  if (!grid) return;
  var places = PLACES[activeId];
  var html = '';
  places.forEach(function (p, i) {
    var key = activeId + '-' + i;
    var isSaved = !!savedSet[key];
    html += '<article class="place">' +
      '<div class="place-img" style="background:' + p.grad + '">' +
      '<div class="place-tag"><span class="sun"></span>' + p.tag + '</div>' +
      '<button class="place-save' + (isSaved ? ' saved' : '') + '" data-key="' + key + '" aria-label="' + (isSaved ? 'Remove from saved' : 'Save place') + '">' +
      heartSVG(isSaved) +
      '</button>' +
      '</div>' +
      '<div class="place-body">' +
      '<div class="place-row"><h3 class="place-name">' + p.name + '</h3></div>' +
      '<div class="place-meta"><strong>' + p.dist + '</strong> &middot; ' + p.hood + ' &middot; Beer garden</div>' +
      sunMeterHTML(p.sun) +
      '</div></article>';
  });
  grid.innerHTML = html;

  grid.querySelectorAll('.place-save').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var k = btn.getAttribute('data-key');
      savedSet[k] = !savedSet[k];
      renderPlaces(activeId);
    });
  });
}

function renderTabs(activeId) {
  var row = document.getElementById('tab-row');
  if (!row) return;
  var html = '';
  NEIGHBORHOODS.forEach(function (n) {
    html += '<button role="tab" aria-selected="' + (activeId === n.id) + '" class="tab' + (activeId === n.id ? ' is-active' : '') + '" data-id="' + n.id + '">' + n.label + '</button>';
  });
  row.innerHTML = html;
  row.querySelectorAll('.tab').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.getAttribute('data-id');
      renderTabs(id);
      renderPlaces(id);
    });
  });
}

renderTabs('islington');
renderPlaces('islington');

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
