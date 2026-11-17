const footer = document.querySelector('.site-footer');

if (footer) {
  footer.classList.add('js-footer');      

  const observer = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) {
      footer.classList.add('is-visible'); 
      observer.disconnect();              
    }
  }, { threshold: 0.1 });

  observer.observe(footer);
}