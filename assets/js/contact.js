
  const form = document.getElementById('contactForm');
  const toast = document.getElementById('formToast');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    toast.classList.add('show');
    form.reset();
    toast.scrollIntoView({behavior:'smooth', block:'center'});
  });
