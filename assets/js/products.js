// products.js — scroll animations, stat counters, navbar shadow and product filter for the Products page

document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  setupScrollReveal(reduceMotion);
  setupStatCounters(reduceMotion);
  setupNavbarShadow();
  setupProductFilter(reduceMotion);
});

/* ---------- Scroll reveal (cards, stats, CTA) ---------- */
function setupScrollReveal(reduceMotion) {
  const revealEls = document.querySelectorAll(".reveal");

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

/* ---------- Animated stat counters ---------- */
function setupStatCounters(reduceMotion) {
  const counters = document.querySelectorAll(".stat-item2 .num");

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

/* ---------- Filter pills with fade-out / fade-in transition ---------- */
function setupProductFilter(reduceMotion) {
  const pills = document.querySelectorAll(".filter-pill");
  const items = document.querySelectorAll(".prod-item");
  const noResults = document.getElementById("noResults");

  pills.forEach((pill) => {
    pill.addEventListener("click", () => {
      if (pill.classList.contains("active")) return;

      pills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      const filter = pill.dataset.filter;

      const delay = reduceMotion ? 0 : 220;
      items.forEach((item) => item.classList.add("filtering-out"));

      setTimeout(() => {
        let visibleCount = 0;

        items.forEach((item) => {
          const show = filter === "all" || item.dataset.cat === filter;
          item.style.display = show ? "" : "none";
          if (show) visibleCount++;
        });

        requestAnimationFrame(() => {
          items.forEach((item) => item.classList.remove("filtering-out"));
        });

        noResults.classList.toggle("d-none", visibleCount !== 0);
      }, delay);
    });
  });
}