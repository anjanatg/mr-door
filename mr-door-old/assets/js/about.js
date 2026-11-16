// about.js — scroll animations, number counters and navbar shadow for the About page

document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  setupScrollReveal(reduceMotion);
  setupCounters(reduceMotion);
  setupNavbarShadow();
});

/* ---------- Scroll reveal (story, cards, stats, timeline, testimonials, CTA) ---------- */
function setupScrollReveal(reduceMotion) {
  const revealEls = document.querySelectorAll(".reveal, .reveal-scale");

  if (reduceMotion) {
    revealEls.forEach((el) => el.classList.add("in-view"));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach((el) => revealObserver.observe(el));
}

/* ---------- Animated number counters (stats strip + story badge) ---------- */
function setupCounters(reduceMotion) {
  const counters = document.querySelectorAll(".num[data-count]");

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10) || 0;
    const suffix = el.dataset.suffix || "";

    if (reduceMotion) {
      el.textContent = target + suffix;
      return;
    }

    const duration = 1100;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(tick);
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach((el) => counterObserver.observe(el));
}

/* ---------- Navbar shadow on scroll ---------- */
function setupNavbarShadow() {
  const nav = document.querySelector(".navbar-custom");
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle("scrolled", window.scrollY > 20);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}