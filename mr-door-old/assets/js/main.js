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
    const response = await fetch(filePath);   //without the async funtion error-SyntaxError await is only valid in async functions
                                              //fetch() - give the instant result
    const htmlText = await response.text();   //response.text()-extracts that body as plain text

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
  startPageFeatures();  //interactive features like menu ,carousel form etc..
}


/* ---------- STEP 2: Turn on the page features ---------- */

function startPageFeatures() {
  setupCarousels();
  setupContactForm();
  setupReadMoreToggle();
  setupScrollAnimations(); 
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
/* ---------- About malayalam content "Read More" toggle ---------- */

function setupReadMoreToggle() {
  const content = document.getElementById('aboutNoteContent');
  const button = document.getElementById('aboutNoteToggle');

  if (!content || !button) {
    return;
  }

  button.addEventListener('click', function () {
    const isExpanded = content.classList.toggle('expanded');
    button.textContent = isExpanded ? 'Show Less' : 'Show More';
  });
}


/* ---------- Everything starts here ---------- */

// Once the page's basic HTML has loaded, run this function
document.addEventListener('DOMContentLoaded', loadAllPartials);

/* ---------- Scroll-reveal + animated counters ---------- */

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
  var counterItems = document.querySelectorAll(".stat-num");

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
