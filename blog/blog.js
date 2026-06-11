/* Sunny blog — city filter behaviour for the listing page and post pages.
   The pages are fully pre-rendered by scripts/build-blog.js; this script
   only re-renders the featured card / grids when a filter pill is clicked,
   using the same render helpers (blog-render.js) the build uses. */
(function () {
  'use strict';
  var R = window.SunnyBlogRender;
  var DATA = window.SUNNY_BLOG;
  if (!R || !DATA) return;

  var filterEl = document.getElementById('cityFilter');

  function setPills(active) {
    if (!filterEl) return;
    filterEl.querySelectorAll('.city-pill').forEach(function (btn) {
      btn.classList.toggle('is-active', btn.getAttribute('data-city') === active);
    });
  }

  // ── Listing page ──────────────────────────────────────────────
  var grid = document.getElementById('postGrid');
  if (grid && filterEl) {
    var featuredSlot = document.getElementById('featuredSlot');
    var heading = document.getElementById('gridHeading');
    var count = document.getElementById('gridCount');

    filterEl.addEventListener('click', function (e) {
      var btn = e.target.closest('.city-pill');
      if (!btn) return;
      var active = btn.getAttribute('data-city');
      setPills(active);
      var state = R.listingState(DATA.posts, active);
      featuredSlot.innerHTML = state.featured ? R.featureHtml(state.featured) : '';
      grid.innerHTML = state.rest.map(R.cardHtml).join('');
      heading.textContent = state.heading;
      count.textContent = state.countText;
    });
  }

  // ── Post page ("more stories" filter) ─────────────────────────
  var related = document.getElementById('relatedGrid');
  if (related && filterEl && DATA.currentSlug) {
    var moreHeading = document.getElementById('moreHeading');

    filterEl.addEventListener('click', function (e) {
      var btn = e.target.closest('.city-pill');
      if (!btn) return;
      var active = btn.getAttribute('data-city');
      setPills(active);
      var posts = R.relatedPosts(DATA.posts, DATA.currentSlug, active);
      related.innerHTML = posts.length
        ? posts.map(R.relatedCardHtml).join('')
        : '<p class="related-empty">No other stories in ' + R.esc(active) + ' yet — more sunny spots coming soon.</p>';
      moreHeading.textContent = active === 'All' ? 'More sunny stories' : 'More stories in ' + active;
    });
  }

  // ── Newsletter (no provider wired up yet — mailto fallback) ───
  document.querySelectorAll('form[data-newsletter]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = form.querySelector('input[name="email"]').value;
      window.location.href = 'mailto:sunny@sunnypubs.app' +
        '?subject=' + encodeURIComponent('Newsletter sign-up') +
        '&body=' + encodeURIComponent('Please add ' + email + ' to the Sunny newsletter.');
    });
  });
})();
