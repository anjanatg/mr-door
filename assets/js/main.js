/* =========================================================
   Mr.Door — main.js (simple version)

   What this file does:
   1. Every section (hero, about, products, etc.) is saved as
      its own separate HTML file (called a "partial").
      This file fetches all of those files and places them
      into the correct spot on the page.
   2. Once every section has loaded onto the page, it turns
      on the buttons, carousels, and form so they actually work.
   ========================================================= */


/* ---------- STEP 1: Load all partial files ---------- */

// Fetches a single partial (example: header.html) and puts its HTML on the page
async function loadOnePartial(placeholderDiv) {
  // Get the file path from the data-partial="..." attribute
  const filePath = placeholderDiv.getAttribute('data-partial');

  try {
    const response = await fetch(filePath);
    const htmlText = await response.text();

    // Replace the placeholder div with the actual HTML content
    placeholderDiv.outerHTML = htmlText;

  } catch (error) {
    console.error('Could not load file:', filePath, error);
  }
}

// Loads every partial on the page
async function loadAllPartials() {
  // Find every div that has a data-partial attribute
  const allPlaceholders = document.querySelectorAll('[data-partial]');

  // Loop through each one and wait until it finishes loading
  for (const div of allPlaceholders) {
    await loadOnePartial(div);
  }

  // Once everything is loaded, turn on the page features
  startPageFeatures();
}


/* ---------- STEP 2: Turn on the page features ---------- */

function startPageFeatures() {
  setupMobileMenu();
  setupCarousels();
  setupContactForm();
}


/* ---------- Mobile menu button (hamburger icon) ---------- */

function setupMobileMenu() {
  const menuButton = document.getElementById('navToggle');
  const menu = document.getElementById('mainNav');

  // If the button doesn't exist, do nothing
  if (!menuButton || !menu) {
    return;
  }

  // Clicking the button opens/closes the menu
  menuButton.addEventListener('click', function () {
    menu.classList.toggle('open');
  });

  // Clicking a link inside the menu closes it (useful on mobile)
  const allLinks = menu.querySelectorAll('a');
  allLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      menu.classList.remove('open');
    });
  });
}


/* ---------- Bootstrap Carousels (Products + Testimonials) ----------

   Why this function is needed:
   Both Products and Testimonials use Bootstrap's built-in
   "carousel" component to slide between items.

   Normally Bootstrap finds and activates carousels automatically
   when the page first loads. But on this page, the carousel HTML
   doesn't exist yet at that point — it arrives later, after the
   partial files finish loading. So we have to manually tell
   Bootstrap "this is a carousel, please activate it."
------------------------------------------------------------------ */

function setupCarousels() {
  // Find every .carousel element currently on the page
  const allCarousels = document.querySelectorAll('.carousel');

  allCarousels.forEach(function (carouselElement) {
    // Tell Bootstrap: "activate this one"
    new bootstrap.Carousel(carouselElement);
  });
}


/* ---------- Contact Form ---------- */

function setupContactForm() {
  const form = document.getElementById('contactForm');
  const statusMessage = document.getElementById('formStatus');

  if (!form || !statusMessage) {
    return;
  }

  form.addEventListener('submit', function (event) {
    // Stop the form from doing its default page reload
    event.preventDefault();

    // Check if all required fields are properly filled in
    if (!form.checkValidity()) {
      statusMessage.textContent = 'Please fill in all fields before sending.';
      statusMessage.style.color = 'red';
      return;
    }

    // TODO: Replace this with a real backend/API call
    statusMessage.style.color = 'green';
    statusMessage.textContent = 'Thanks! Your message has been sent.';
    form.reset();
  });
}


/* ---------- Everything starts here ---------- */

// Once the page's basic HTML has loaded, run this function
document.addEventListener('DOMContentLoaded', loadAllPartials);