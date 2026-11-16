
$(function () {

    const $slides = $('#testimonialSlides');
    const $barsContainer = $('#testimonialBars');

    if (!$slides.length || !$barsContainer.length) return;

    const $quotes = $slides.find('.testimonial-slide');
    const delay = 5000;

    let current = 0;
    let timer = null;

    // Create navigation bars
    $quotes.each(function (index) {
        const $bar = $('<button>', {
            type: 'button',
            class: 'testimonial-bar',
            'aria-label': 'Show quote ' + (index + 1)
        });

        $bar.append(
            $('<span>', { class: 'testimonial-bar-line' }),
            $('<span>', {
                class: 'testimonial-bar-label',
                text: $(this).data('label') || ''
            })
        );

        $bar.on('click', function () {
            show(index);
            restart();
        });

        $barsContainer.append($bar);
    });

    const $bars = $barsContainer.find('.testimonial-bar');


    // Show selected testimonial
    function show(index) {
        current = index;

        $quotes.each(function (i) {
            $(this)
                .toggleClass('is-active', i === index)
                .attr('aria-hidden', i === index ? 'false' : 'true');

            $bars.eq(i).toggleClass('is-active', i === index);
        });
    }


    function showNext() {
        show((current + 1) % $quotes.length);
    }

    function start() {
        if (!timer && $quotes.length > 1) {
            timer = setInterval(showNext, delay);
        }
    }

    function stop() {
        clearInterval(timer);
        timer = null;
    }

    function restart() {
        stop();
        start();
    }


    // Show first testimonial
    show(0);

    // Respect reduced-motion preference
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {

        start();

        $slides.on('mouseenter', stop);
        $slides.on('mouseleave', start);

        $(document).on('visibilitychange', function () {
            document.hidden ? stop() : start();
        });
    }

});
