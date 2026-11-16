$(function () {

    // Gallery image slider
    const $slides = $('#gallerySlides');
    const $photos = $slides.find('img');

    let current = 0;
    let timer = null;
    const delay = 3000;

    function showNext() {
        $photos.eq(current).removeClass('is-active');

        current = (current + 1) % $photos.length;

        $photos.eq(current).addClass('is-active');
    }

    function start() {
        if (!timer && $photos.length > 1) {
            timer = setInterval(showNext, delay);
        }
    }

    function stop() {
        clearInterval(timer);
        timer = null;
    }

    if ($slides.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        start();

        $slides.on('mouseenter', stop);
        $slides.on('mouseleave', start);

        $(document).on('visibilitychange', function () {
            document.hidden ? stop() : start();
        });
    }


    // Gallery scroll animation
    const $gallery = $('.gallery');

    if (!$gallery.length) return;

    $gallery.addClass('js-gallery');

    function checkScroll() {
        if ($gallery[0].getBoundingClientRect().top < $(window).height() * 0.7) {
            $gallery.addClass('is-visible');
            $(window).off('scroll', checkScroll);
        }
    }

    $(window).on('scroll', checkScroll);
    checkScroll();

});