$(function () {
    const $about = $('.about');
    const $image = $('.about-image');
    const $content = $('.about-content');

    if (!$about.length || !$image.length || !$content.length) return;

    let target = 1;
    let current = 1;

    // Image movement on scroll
    function updateTarget() {
        const screen = $(window).height();
        const scrolled = screen - $about[0].getBoundingClientRect().top;

        const wait = screen * 0.1;
        const distance = screen * 0.4;

        let progress = (scrolled - wait) / distance;
        progress = Math.min(Math.max(progress, 0), 1);

        target = 1 - progress;
    }

    // Smooth image animation
    function animate() {
        current += (target - current) * 0.12;

        if (Math.abs(target - current) < 0.001) {
            current = target;
        }

        $image[0].style.setProperty('--move', current);

        requestAnimationFrame(animate);
    }

    $(window).on('scroll', updateTarget);
    updateTarget();
    animate();

    // Text reveal animation
    const observer = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
            $content.addClass('is-visible');
            observer.disconnect();
        }
    }, { threshold: 0.3 });

    observer.observe($content[0]);
});