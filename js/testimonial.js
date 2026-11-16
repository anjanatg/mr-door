// Testimonial section: the 3 quotes change by themselves.
// The CSS does the fade. This file only switches which quote is active.

const testimonialSlides = document.getElementById('testimonialSlides');
const testimonialBars = document.getElementById('testimonialBars');

// Stop here if the section is not on this page (so no error is shown)
if (testimonialSlides && testimonialBars) {

  const delay = 5000;   // time each quote stays (milliseconds). 5000 = 5 seconds

  const quotes = testimonialSlides.querySelectorAll('.testimonial-slide');
  const bars = [];
  let current = 0;
  let timer = null;

  // Make one small bar (a line + a label) for each quote
  quotes.forEach(function (quote, index) {
    const bar = document.createElement('button');
    bar.type = 'button';
    bar.className = 'testimonial-bar';
    bar.setAttribute('aria-label', 'Show quote ' + (index + 1));

    const line = document.createElement('span');
    line.className = 'testimonial-bar-line';

    const label = document.createElement('span');
    label.className = 'testimonial-bar-label';
    label.textContent = quote.dataset.label || '';   // text comes from data-label in the HTML

    bar.appendChild(line);
    bar.appendChild(label);
    bar.addEventListener('click', function () {
      show(index);
      restart();             // start counting again after a click
    });
    testimonialBars.appendChild(bar);
    bars.push(bar);
  });

  // Show one quote and hide the others
  function show(index) {
    current = index;
    quotes.forEach(function (quote, i) {
      quote.classList.toggle('is-active', i === index);
      quote.setAttribute('aria-hidden', i === index ? 'false' : 'true');
      bars[i].classList.toggle('is-active', i === index);
    });
  }

  function showNext() {
    show((current + 1) % quotes.length);   // after the last quote, go back to the first
  }

  function start() {
    if (timer === null && quotes.length > 1) {
      timer = setInterval(showNext, delay);
    }
  }

  function stop() {
    clearInterval(timer);
    timer = null;
  }

  function restart() {
    stop();
    start();
  }

  show(0);

  // Do not auto-change for people who turned off animations
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduceMotion) {
    start();
    // Pause while the mouse is over the quote, and while the tab is hidden
    testimonialSlides.addEventListener('mouseenter', stop);
    testimonialSlides.addEventListener('mouseleave', start);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { stop(); } else { start(); }
    });
  }
}