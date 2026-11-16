// Collections slider: cards flow to the left again and again, like water.
// The CSS does the moving (smooth). This file only measures and makes the copies.

const slider = document.querySelector('.slider');
const track = document.querySelector('.slider-track');

// Stop here if the slider is not on this page (so no error is shown)
if (slider && track) {

  const speed = 100;   // how fast the cards move (pixels per second). Bigger = faster

  // Remove any copied cards that were written by hand in the HTML.
  // This file makes the copies by itself.
  track.querySelectorAll('[aria-hidden="true"]').forEach(function (card) {
    card.remove();
  });

  // The cards we wrote in the HTML (the first set)
  const originalCards = Array.from(track.children);

  function setup() {
    // remove old copies (needed when the screen size changes)
    track.querySelectorAll('.copy').forEach(function (card) {
      card.remove();
    });

    // read the gap and the number of visible cards from the CSS
    const styles = getComputedStyle(slider);
    const gap = parseFloat(styles.getPropertyValue('--gap'));
    const visible = parseFloat(styles.getPropertyValue('--visible'));

    // Card size in WHOLE pixels. Whole pixels keep the images from shaking.
    const cardWidth = Math.floor((slider.clientWidth - (visible - 1) * gap) / visible);

    // Width of one full set of cards, and how long one trip takes
    const setWidth = originalCards.length * (cardWidth + gap);

    slider.style.setProperty('--card-w', cardWidth + 'px');
    slider.style.setProperty('--set-width', setWidth + 'px');
    slider.style.setProperty('--duration', (setWidth / speed) + 's');

    // Copies, so there is always a card ready on the right side
    const sets = Math.ceil(slider.clientWidth / setWidth) + 1;
    for (let i = 0; i < sets; i++) {
      originalCards.forEach(function (card) {
        const copy = card.cloneNode(true);
        copy.classList.add('copy');
        copy.setAttribute('aria-hidden', 'true');
        copy.setAttribute('tabindex', '-1');
        track.appendChild(copy);
      });
    }
  }

  setup();
  window.addEventListener('resize', setup);
}