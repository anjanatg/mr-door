// Gallery section: the small photo on the right changes by itself.
// The CSS does the fade. This file only switches which photo is active.

const gallerySlides = document.getElementById('gallerySlides');

// Stop here if the section is not on this page (so no error is shown)
if (gallerySlides) {

  const delay = 3000;   // time each photo stays (milliseconds). 3000 = 3 seconds

  const photos = gallerySlides.querySelectorAll('img');
  let current = 0;
  let timer = null;

  function showNext() {
    photos[current].classList.remove('is-active');
    current = (current + 1) % photos.length;      // after the last photo, go back to the first
    photos[current].classList.add('is-active');
  }

  function start() {
    if (timer === null && photos.length > 1) {
      timer = setInterval(showNext, delay);
    }
  }

  function stop() {
    clearInterval(timer);
    timer = null;
  }

  // Do not auto-change for people who turned off animations
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduceMotion) {
    start();
    // Pause while the mouse is over the photo, and while the tab is hidden
    gallerySlides.addEventListener('mouseenter', stop);
    gallerySlides.addEventListener('mouseleave', start);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { stop(); } else { start(); }
    });
  }
}