/* =========================================================
   Each section has its own block below.
   Every block has its own variable names (coll..., bed..., test...)
   and checks that its section exists, so one section can never
   break another one.
   The ids and class names here match index.html and style.css.
   ========================================================= */


/* ---------- 1. Collections: cards slide to the left again and again ---------- */
const collTrack = document.getElementById("collectionTrack");

if (collTrack) {
  const collSpeed = 0.6;          // bigger number = faster
  let collPosition = 0;
  let collPaused = false;

  // copy all the cards once, so there is never an empty space
  const collOriginalCards = Array.from(collTrack.children);
  collOriginalCards.forEach(function (card) {
    collTrack.appendChild(card.cloneNode(true));
  });

  function collMove() {
    if (!collPaused) {
      collPosition = collPosition - collSpeed;

      // the first copied card starts exactly where the first set ends
      // (the track has "position: relative" in CSS, so this is measured from the track)
      const collSetWidth = collTrack.children[collOriginalCards.length].offsetLeft;
      if (Math.abs(collPosition) >= collSetWidth) {
        collPosition = 0;
      }

      collTrack.style.transform = "translateX(" + collPosition + "px)";
    }
    requestAnimationFrame(collMove);
  }
  collMove();

  // stop when the mouse is over the cards
  collTrack.addEventListener("mouseenter", function () { collPaused = true; });
  collTrack.addEventListener("mouseleave", function () { collPaused = false; });
}


/* ---------- 2. Bedroom: small image changes every few seconds ---------- */
const bedSlides = document.querySelectorAll("#bedroomSlider .bedroom-slide");

if (bedSlides.length > 0) {
  let bedCurrent = 0;

  setInterval(function () {
    bedSlides[bedCurrent].classList.remove("active");
    bedCurrent = (bedCurrent + 1) % bedSlides.length;   // back to 0 after the last one
    bedSlides[bedCurrent].classList.add("active");
  }, 2500);                                             // 2500 = 2.5 seconds
}


/* ---------- 3. Testimonials: 3 slides change automatically ---------- */
const testSlides = document.querySelectorAll("#testimonialSlides .testimonial-slide");
const testBars = document.querySelectorAll("#testimonialBars .bar");

if (testSlides.length > 0) {
  let testIndex = 0;
  let testTimer;

  function testShow(number) {
    testSlides[testIndex].classList.remove("active");
    testBars[testIndex].classList.remove("active");

    testIndex = number;

    testSlides[testIndex].classList.add("active");
    testBars[testIndex].classList.add("active");
  }

  function testNext() {
    testShow((testIndex + 1) % testSlides.length);
  }

  function testStartTimer() {
    testTimer = setInterval(testNext, 5000);            // 5000 = 5 seconds
  }
  testStartTimer();

  // clicking a line shows that slide and restarts the timer
  testBars.forEach(function (bar, number) {
    bar.addEventListener("click", function () {
      testShow(number);
      clearInterval(testTimer);
      testStartTimer();
    });
  });
}