// gallery.js — filter pills + fullscreen lightbox for the Gallery page

document.addEventListener('DOMContentLoaded', function () {
  setupGalleryFilter();
  setupGalleryLightbox();
  setupScrollAnimations();
});

/* ---------- Scroll-reveal + animated stat counters ---------- */
function setupScrollAnimations() {

  // 1. Fade elements up into view as you scroll to them
  var revealItems = document.querySelectorAll(".reveal");

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target); // only animate once
      }
    });
  }, { threshold: 0.15 });

  revealItems.forEach(function (item) {
    revealObserver.observe(item);
  });


  // 2. Count numbers up (e.g. "0" -> "5000+") when they scroll into view
  var counterItems = document.querySelectorAll(".num[data-count]");

  function startCounting(el) {
    var target = parseInt(el.dataset.count, 10) || 0;
    var suffix = el.dataset.suffix || "";
    var current = 0;
    var step = Math.max(1, Math.round(target / 60)); // ~60 small jumps

    var timer = setInterval(function () {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = current + suffix;
    }, 20);
  }

  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        startCounting(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  counterItems.forEach(function (el) {
    counterObserver.observe(el);
  });
}

/* ---------- Filter pills ---------- */
function setupGalleryFilter() {
  const pills = document.querySelectorAll('.filter-pill');
  const items = document.querySelectorAll('.gallery-item');
  const noResults = document.getElementById('noResults');

  if (pills.length === 0) return;

  pills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      pills.forEach(function (p) { p.classList.remove('active'); });
      pill.classList.add('active');

      const filter = pill.dataset.filter;
      let visibleCount = 0;

      items.forEach(function (item) {
        const show = filter === 'all' || item.dataset.cat === filter;
        item.style.display = show ? '' : 'none';
        if (show) visibleCount++;
      });

      if (noResults) {
        noResults.classList.toggle('d-none', visibleCount !== 0);
      }
    });
  });
}

/* ---------- Gallery Lightbox (fullscreen photo viewer) ---------- */
function setupGalleryLightbox() {
  const items = Array.from(document.querySelectorAll('.gallery-item'));
  const lightbox = document.getElementById('lightbox');

  // If this page has no gallery, or the lightbox markup isn't here, stop.
  if (items.length === 0 || !lightbox) return;

  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');

  function getVisibleItems() {
    return items.filter(function (item) {
      return item.style.display !== 'none';
    });
  }

  let currentIndex = 0;

  function openLightbox(item) {
    const visible = getVisibleItems();
    currentIndex = visible.indexOf(item);
    showCurrentPhoto(visible);
    lightbox.classList.add('active');
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
  }

  function showCurrentPhoto(visible) {
    const item = visible[currentIndex];
    const img = item.querySelector('img');

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;

    const title = item.dataset.title || img.alt;
    const sub = item.dataset.sub || '';
    lightboxCaption.textContent = sub ? title + ' — ' + sub : title;
  }

  function showNextPhoto() {
    const visible = getVisibleItems();
    currentIndex = (currentIndex + 1) % visible.length;
    showCurrentPhoto(visible);
  }

  function showPrevPhoto() {
    const visible = getVisibleItems();
    currentIndex = (currentIndex - 1 + visible.length) % visible.length;
    showCurrentPhoto(visible);
  }

  // Open the lightbox when the fullscreen (zoom) button is clicked
  items.forEach(function (item) {
    const zoomBtn = item.querySelector('.gallery-zoom');

    if (zoomBtn) {
      zoomBtn.addEventListener('click', function (event) {
        event.stopPropagation(); // don't also trigger the item's own click
        openLightbox(item);
      });
    }

    // Also let clicking anywhere on the photo open it
    item.addEventListener('click', function () {
      openLightbox(item);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', showNextPhotoGuard(showPrevPhoto));
  if (nextBtn) nextBtn.addEventListener('click', showNextPhotoGuard(showNextPhoto));

  // Small helper so prev/next button clicks don't also bubble up
  // and immediately re-trigger the lightbox's own item click logic.
  function showNextPhotoGuard(fn) {
    return function (event) {
      event.stopPropagation();
      fn();
    };
  }

  // Click the dark background (not the photo) to close
  lightbox.addEventListener('click', function (event) {
    if (event.target === lightbox) closeLightbox();
  });

  // Keyboard support: Escape closes, arrow keys navigate
  document.addEventListener('keydown', function (event) {
    if (!lightbox.classList.contains('active')) return;

    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowRight') showNextPhoto();
    if (event.key === 'ArrowLeft') showPrevPhoto();
  });
}