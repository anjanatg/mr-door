// contact.js — enquiry form submit + scroll animations for the Contact page

document.addEventListener("DOMContentLoaded", () => {
  setupContactForm();
  setupScrollReveal();
  setupNavbarShadow();
});

/* ---------- Enquiry form ---------- */
function setupContactForm() {
  const form = document.getElementById("contactForm");
  const toast = document.getElementById("formToast");

  if (!form || !toast) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    // TODO: wire this up to a real endpoint / email service (e.g. Formspree,
    // your own API route) — this currently only shows the success message.
    toast.classList.add("show");
    form.reset();
    toast.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

/* ---------- Scroll-reveal (quick cards, form, map, branches, FAQ) ---------- */
function setupScrollReveal() {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

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