 // Filtering
  const pills = document.querySelectorAll('.filter-pill');
  const items = Array.from(document.querySelectorAll('.gallery-item'));
  const noResults = document.getElementById('noResults');

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const filter = pill.dataset.filter;
      let visibleCount = 0;

      items.forEach(item => {
        const show = filter === 'all' || item.dataset.cat === filter;
        item.style.display = show ? '' : 'none';
        if (show) visibleCount++;
      });

      noResults.classList.toggle('d-none', visibleCount !== 0);
    });
  });

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  let currentIndex = 0;

  function getVisibleItems(){
    return items.filter(item => item.style.display !== 'none');
  }

  function openLightbox(item){
    const visible = getVisibleItems();
    currentIndex = visible.indexOf(item);
    showCurrent(visible);
    lightbox.classList.add('active');
  }

  function showCurrent(visible){
    const item = visible[currentIndex];
    const img = item.querySelector('img');
    lightboxImg.src = img.src.replace('w=800', 'w=1600');
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = `${item.dataset.title} — ${item.dataset.sub}`;
  }

  items.forEach(item => {
    item.addEventListener('click', () => openLightbox(item));
  });

  document.getElementById('lightboxClose').addEventListener('click', () => lightbox.classList.remove('active'));
  lightbox.addEventListener('click', (e) => { if(e.target === lightbox) lightbox.classList.remove('active'); });

  document.getElementById('lightboxPrev').addEventListener('click', (e) => {
    e.stopPropagation();
    const visible = getVisibleItems();
    currentIndex = (currentIndex - 1 + visible.length) % visible.length;
    showCurrent(visible);
  });
  document.getElementById('lightboxNext').addEventListener('click', (e) => {
    e.stopPropagation();
    const visible = getVisibleItems();
    currentIndex = (currentIndex + 1) % visible.length;
    showCurrent(visible);
  });

  document.addEventListener('keydown', (e) => {
    if(!lightbox.classList.contains('active')) return;
    if(e.key === 'Escape') lightbox.classList.remove('active');
    if(e.key === 'ArrowLeft') document.getElementById('lightboxPrev').click();
    if(e.key === 'ArrowRight') document.getElementById('lightboxNext').click();
  });
