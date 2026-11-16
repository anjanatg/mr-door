
$(function () {

    // Enable CSS reveal animations
    $('html').addClass('js-reveal');


    // 1. Collections slider
    const $slider = $('.slider');
    const $track = $('.slider-track');

    if ($slider.length && $track.length) {

        const speed = 180;

        // Remove old copied cards
        $track.find('[aria-hidden="true"], .copy').remove();

        const $originalCards = $track.children().clone();

        function setupSlider() {
            $track.find('.copy').remove();

            const styles = getComputedStyle($slider[0]);
            const gap = parseFloat(styles.getPropertyValue('--gap')) || 0;
            const visible = parseFloat(styles.getPropertyValue('--visible')) || 1;

            const cardWidth = Math.floor(
                ($slider[0].clientWidth - (visible - 1) * gap) / visible
            );

            const setWidth = $originalCards.length * (cardWidth + gap);

            $slider.css({
                '--card-w': cardWidth + 'px',
                '--set-width': setWidth + 'px',
                '--duration': (setWidth / speed) + 's'
            });

            const sets = Math.ceil($slider[0].clientWidth / setWidth) + 1;

            for (let i = 0; i < sets; i++) {
                $originalCards.each(function () {
                    const $copy = $(this).clone();

                    $copy.addClass('copy')
                        .attr({
                            'aria-hidden': 'true',
                            'tabindex': '-1'
                        });

                    $track.append($copy);
                });
            }
        }

        setupSlider();
        $(window).on('resize', setupSlider);
    }


    // 2. Scroll reveal animations

    function countUp($el) {
        const text = $el.text();
        const match = text.match(/[\d,]+/);

        if (!match) return;

        const before = text.slice(0, match.index);
        const after = text.slice(match.index + match[0].length);
        const target = parseInt(match[0].replace(/,/g, ''), 10);

        const duration = 1500;
        let startTime = null;

        function step(now) {
            if (!startTime) startTime = now;

            const progress = Math.min((now - startTime) / duration, 1);

            $el.text(before + Math.floor(progress * target) + after);

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                $el.text(text);
            }
        }

        requestAnimationFrame(step);
    }


    function show(el) {
        const $el = $(el);

        $el.addClass('is-visible');

        if ($el.hasClass('feature-item')) {
            setTimeout(function () {
                countUp($el.find('h6'));
            }, 350);
        }
    }


    // Add reveal to feature items
    $('.feature-item').attr('data-reveal', '');

    let $targets = $('[data-reveal]');

    // Add reveal to sections without reveal elements
    $('section').not('[data-reveal-skip], .hero, :has(.hero)').each(function () {
        const $section = $(this);

        if (!$section.is('[data-reveal]') && !$section.find('[data-reveal]').length) {
            $section.attr('data-reveal', '');
            $targets = $targets.add($section);
        }
    });


    // Set animation delays
    $targets.each(function () {
        const $parent = $(this).parent();
        const index = $parent.data('revealCount') || 0;

        $parent.data('revealCount', index + 1);
        this.style.setProperty('--d', index * 120 + 'ms');
    });

    $('.feature-item').each(function (index) {
        this.style.setProperty('--d', index * 150 + 'ms');
    });


    // Show elements when they enter the screen
    if ('IntersectionObserver' in window) {

        const observer = new IntersectionObserver(function (entries) {
            $.each(entries, function (index, entry) {
                if (entry.isIntersecting) {
                    show(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        $targets.each(function () {
            observer.observe(this);
        });

    } else {
        $targets.each(function () {
            show(this);
        });
    }


    // 3. Pause collections slider on hover or keyboard focus
    $slider.on('mouseenter focusin', function () {
        $track.css('animation-play-state', 'paused');
    });

    $slider.on('mouseleave focusout', function () {
        $track.css('animation-play-state', 'running');
    });

});
