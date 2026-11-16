
$(function () {

    const $cards = $('.value-card');
    const $values = $('.values');

    if (!$cards.length || !$values.length) return;

    // Enable reveal animation
    $values.addClass('js-reveal');

    // Add delay to each card
    $cards.each(function (index) {
        this.style.transitionDelay = ((index % 4) * 0.12) + 's';
    });

    // Show cards on scroll
    if ('IntersectionObserver' in window) {

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    $(entry.target).addClass('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        $cards.each(function () {
            observer.observe(this);
        });

    } else {
        $cards.addClass('is-visible');
    }

});
