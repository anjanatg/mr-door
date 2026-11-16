// Smooth "water-like" scrolling (needs the Lenis library loaded first)
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion && window.Lenis) {
  const lenis = new Lenis({
    duration: 1.35,                              // bigger = slower glide
    easing: function (t) { return 1 - Math.pow(1 - t, 4); },
    smoothWheel: true,
    wheelMultiplier: 0.9
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}