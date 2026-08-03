<script>
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.prod-carousel-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const track = document.getElementById(btn.dataset.target);
      if (!track) return;

      // scroll by roughly one card width + gap
      const card = track.querySelector('.prod-card');
      const scrollAmount = card ? card.offsetWidth + 24 : 220;

      const isPrev = btn.classList.contains('prod-prev') || btn.getAttribute('aria-label') === 'Previous';
      track.scrollBy({
        left: isPrev ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    });
  });
});
</script>