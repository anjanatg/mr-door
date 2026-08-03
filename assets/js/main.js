/* =========================================================
   Mr.Door — main.js
   1) Loads every page section from its own partial HTML file
      (partials/hero.html, partials/types.html, etc.) into the
      matching placeholder <div data-partial="..."> in index.html.
   2) Once everything is loaded, wires up nav toggle, carousels,
      testimonial dots and the contact form.
   ========================================================= */

/**
 * Fetches a partial HTML file and injects it into a target element.
 * @param {HTMLElement} el - the placeholder div with data-partial="path/to/file.html"
 */
async function loadPartial(el) {
  const url = el.getAttribute('data-partial');
  try {
    const res = await fetch(url, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`${url} → ${res.status}`);
    el.outerHTML = await res.text();
  } catch (err) {
    console.error('Could not load partial:', url, err);
    el.innerHTML = `<p style="padding:24px;color:#a33;">Failed to load ${url}</p>`;
  }
}

/**
 * Loads all partials on the page, in document order, then runs
 * initPage() once every section has been injected into the DOM.
 */
async function loadAllPartials() {
  const placeholders = Array.from(document.querySelectorAll('[data-partial]'));
  await Promise.all(placeholders.map(loadPartial));
  initPage();
}

/* ---------------------------------------------------------
   Runs once all partials (header, hero, types, about, ...)
   are in the DOM.
   --------------------------------------------------------- */
function initPage() {
  initNavToggle();
  initCarousel('productsTrack');
  initTestimonialCarousel();
  initContactForm();
}

/* ---------- Mobile nav toggle ---------- */
function initNavToggle() {
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('mainNav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
  });

  // close menu after a link is tapped (mobile)
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => nav.classList.remove('open'));
  });
}

/* ---------- Generic left/right scroll carousel (Products) ---------- */
function initCarousel(trackId) {
  const track = document.getElementById(trackId);
  if (!track) return;

  const prevBtn = document.querySelector(`.carousel-prev[data-target="${trackId}"]`);
  const nextBtn = document.querySelector(`.carousel-next[data-target="${trackId}"]`);
  const scrollAmount = 220;

  prevBtn?.addEventListener('click', () => {
    track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });
  nextBtn?.addEventListener('click', () => {
    track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });
}

/* ---------- Testimonials carousel with dots ---------- */
function initTestimonialCarousel() {
  const track = document.getElementById('testimonialTrack');
  const dotsWrap = document.getElementById('testimonialDots');
  if (!track || !dotsWrap) return;

  const cards = Array.from(track.children);
  dotsWrap.innerHTML = '';

  cards.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => {
      const card = cards[i];
      track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: 'smooth' });
    });
    dotsWrap.appendChild(dot);
  });

  const dots = Array.from(dotsWrap.children);

  const prevBtn = document.querySelector('.carousel-prev[data-target="testimonialTrack"]');
  const nextBtn = document.querySelector('.carousel-next[data-target="testimonialTrack"]');
  prevBtn?.addEventListener('click', () => track.scrollBy({ left: -320, behavior: 'smooth' }));
  nextBtn?.addEventListener('click', () => track.scrollBy({ left: 320, behavior: 'smooth' }));

  // keep the active dot in sync while scrolling
  let scrollTimeout;
  track.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      let closestIdx = 0;
      let closestDist = Infinity;
      cards.forEach((card, i) => {
        const dist = Math.abs(card.offsetLeft - track.offsetLeft - track.scrollLeft);
        if (dist < closestDist) { closestDist = dist; closestIdx = i; }
      });
      dots.forEach(d => d.classList.remove('active'));
      dots[closestIdx]?.classList.add('active');
    }, 100);
  });
}

/* ---------- Contact form (front-end only demo handling) ---------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (!form || !status) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      status.textContent = 'Please fill in all fields before sending.';
      status.style.color = '#c0392b';
      return;
    }

    // NOTE: replace this with a real fetch() call to your backend / form API.
    status.style.color = '';
    status.textContent = 'Thanks! Your message has been sent — we will get back to you soon.';
    form.reset();
  });
}

/* Kick everything off */
document.addEventListener('DOMContentLoaded', loadAllPartials);