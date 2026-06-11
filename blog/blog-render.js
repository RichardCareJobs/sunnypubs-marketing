/* Sunny blog — shared rendering helpers.
   Used in two places:
     1. scripts/build-blog.js (Node) pre-renders the static HTML at build time.
     2. blog/blog.js (browser) re-renders the listing / related grid when a
        city filter pill is clicked.
   Keep these functions pure (post data in, HTML string out). */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) { module.exports = factory(); }
  else { root.SunnyBlogRender = factory(); }
})(typeof self !== 'undefined' ? self : this, function () {

  // Warm, clearly-branded gradient placeholders (from the design system)
  var GRADS = {
    sunset: 'linear-gradient(150deg,#FF6B00 0%,#FFC400 100%)',
    ember:  'linear-gradient(150deg,#FF4A00 0%,#FF8A3D 55%,#FFE2BE 100%)',
    golden: 'linear-gradient(160deg,#FFC400 0%,#FF6B00 100%)',
    garden: 'linear-gradient(135deg,#A4C79C 0%,#E7A866 70%,#FFC88A 100%)',
    peach:  'linear-gradient(150deg,#FFE2BE 0%,#FF8A3D 100%)',
    dusk:   'linear-gradient(155deg,#FF4A00 0%,#FFC400 100%)'
  };

  var CATEGORY = {
    Guide:     { label: 'City guide',  cls: 'cat-guide' },
    Spotlight: { label: 'Spotlight',   cls: 'cat-spotlight' },
    News:      { label: 'Sunny news',  cls: 'cat-news' }
  };

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function postUrl(post) { return '/blog/' + post.slug + '/'; }

  function mediaStyle(post) {
    if (post.image && post.image.type === 'photo') {
      return 'background-image:url(' + esc(post.image.src) + ')';
    }
    var grad = (post.image && GRADS[post.image.grad]) || GRADS.sunset;
    return 'background-image:' + grad;
  }

  // Branded image / gradient placeholder block
  function mediaHtml(post, extraClass, inner) {
    var isPhoto = post.image && post.image.type === 'photo';
    var html = '<div class="post-media' + (extraClass ? ' ' + extraClass : '') +
      (isPhoto ? ' is-photo' : '') + '" style="' + mediaStyle(post) + '">';
    if (!isPhoto) {
      html += '<img class="media-motif" src="/assets/sunny_sun_motif.png" alt="" aria-hidden="true">';
      html += '<div class="media-scrim" aria-hidden="true"></div>';
    }
    html += inner || '';
    html += '</div>';
    return html;
  }

  function categoryTag(post, onImage) {
    var c = CATEGORY[post.category] || { label: post.category, cls: 'cat-guide' };
    return '<span class="cat-tag ' + c.cls + (onImage ? ' on-image' : '') + '">' + esc(c.label) + '</span>';
  }

  function cityTag(city) {
    return '<span class="city-tag">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s7-7.58 7-13a7 7 0 1 0-14 0c0 5.42 7 13 7 13Z"/><circle cx="12" cy="9" r="2.5"/></svg>' +
      esc(city) + '</span>';
  }

  function metaLine(post) {
    return '<div class="meta-line">' +
      '<span class="meta-author">' + esc(post.author) + '</span>' +
      '<span class="meta-sep">&middot;</span>' +
      '<span>' + esc(post.date) + '</span>' +
      '<span class="meta-sep">&middot;</span>' +
      '<span class="meta-read">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg> ' +
      esc(post.read) + '</span></div>';
  }

  // Standard vertical card (listing grid)
  function cardHtml(post) {
    return '<a class="post-card" href="' + postUrl(post) + '" data-city="' + esc(post.city) + '">' +
      mediaHtml(post, 'card-media',
        '<div class="media-tags">' + categoryTag(post, true) + '</div>') +
      '<div class="post-card-body">' +
        cityTag(post.city) +
        '<h3 class="post-card-title">' + esc(post.title) + '</h3>' +
        '<p class="post-card-excerpt">' + esc(post.excerpt) + '</p>' +
        '<div class="post-card-meta">' + metaLine(post) + '</div>' +
      '</div></a>';
  }

  // Large featured card (horizontal)
  function featureHtml(post) {
    var cta = post.category === 'Guide' ? 'Read the guide' : 'Read the story';
    return '<a class="feature-card" href="' + postUrl(post) + '">' +
      mediaHtml(post, 'feature-media',
        '<div class="media-tags">' + categoryTag(post, true) +
        '<span class="city-pill-on-image">' +
        '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s7-7.58 7-13a7 7 0 1 0-14 0c0 5.42 7 13 7 13Z"/><circle cx="12" cy="9" r="2.5"/></svg>' +
        esc(post.city) + '</span></div>') +
      '<div class="feature-body">' +
        '<span class="feature-eyebrow">Featured</span>' +
        '<h2 class="feature-title">' + esc(post.title) + '</h2>' +
        '<p class="feature-excerpt">' + esc(post.excerpt) + '</p>' +
        metaLine(post) +
        '<span class="btn btn-primary feature-btn">' + cta +
        ' <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>' +
      '</div></a>';
  }

  // Compact card (post page "more stories" grid)
  function relatedCardHtml(post) {
    return '<a class="related-card" href="' + postUrl(post) + '">' +
      mediaHtml(post, 'card-media',
        '<div class="media-tags">' + categoryTag(post, true) + '</div>') +
      '<div class="related-card-body">' +
        cityTag(post.city) +
        '<h4 class="related-card-title">' + esc(post.title) + '</h4>' +
      '</div></a>';
  }

  // City filter — pill chips (orange active). counts is optional.
  function pillsHtml(cities, active, counts) {
    var all = ['All'].concat(cities);
    return all.map(function (c) {
      var isActive = active === c;
      var n = counts ? (c === 'All' ? counts.__all : counts[c]) : null;
      return '<button type="button" class="city-pill' + (isActive ? ' is-active' : '') +
        '" data-city="' + esc(c) + '">' + esc(c) +
        (n != null ? ' <span class="pill-count">' + n + '</span>' : '') +
        '</button>';
    }).join('');
  }

  // Listing page state: featured + grid for the active city
  function listingState(posts, active) {
    var filtered = active === 'All' ? posts : posts.filter(function (p) { return p.city === active; });
    var featured = null;
    for (var i = 0; i < filtered.length; i++) { if (filtered[i].featured) { featured = filtered[i]; break; } }
    if (!featured) featured = filtered[0] || null;
    var rest = filtered.filter(function (p) { return !featured || p.slug !== featured.slug; });
    return {
      featured: featured,
      rest: rest,
      heading: active === 'All' ? 'Latest stories' : 'More in ' + active,
      countText: rest.length + (rest.length === 1 ? ' story' : ' stories')
    };
  }

  // Post page: up to 3 more stories for the selected city
  function relatedPosts(posts, currentSlug, city) {
    var pool = city === 'All' ? posts : posts.filter(function (p) { return p.city === city; });
    return pool.filter(function (p) { return p.slug !== currentSlug; }).slice(0, 3);
  }

  return {
    GRADS: GRADS, CATEGORY: CATEGORY, esc: esc, postUrl: postUrl,
    mediaHtml: mediaHtml, categoryTag: categoryTag, cityTag: cityTag, metaLine: metaLine,
    cardHtml: cardHtml, featureHtml: featureHtml, relatedCardHtml: relatedCardHtml,
    pillsHtml: pillsHtml, listingState: listingState, relatedPosts: relatedPosts
  };
});
