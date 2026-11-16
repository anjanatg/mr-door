// Values section: each card fades in when it scrolls into view.

const valueCards = document.querySelectorAll('.value-card');

if (valueCards.length > 0 && 'IntersectionObserver' in window) {

  // Hide the cards first (the CSS uses this class)
  document.querySelector('.values').classList.add('js-reveal');

  // Small delay for each card, so cards in the same row come one by one
  valueCards.forEach(function (card, index) {
    card.style.transitionDelay = ((index % 4) * 0.12) + 's';
  });

  // Watch every card, and show it when it is on the screen
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);   // only once
      }
    });
  }, { threshold: 0.1 });

  valueCards.forEach(function (card) {
    observer.observe(card);
  });
}