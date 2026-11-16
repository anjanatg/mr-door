
$(function () {

    const $header = $('#siteHeader');
    const $toggle = $('#menuToggle');
    const $menu = $('#mobileMenu');

    if (!$header.length) return;

    // Header shadow on scroll
    function checkScroll() {
        $header.toggleClass('is-scrolled', $(window).scrollTop() > 10);
    }

    checkScroll();
    $(window).on('scroll', checkScroll);

    // Mobile menu
    if (!$toggle.length || !$menu.length) return;

    function openMenu() {
        $menu.prop('hidden', false);
        $toggle.attr('aria-expanded', 'true')
            .find('i').attr('class', 'bi bi-x-lg');
    }

    function closeMenu() {
        $menu.prop('hidden', true);
        $toggle.attr('aria-expanded', 'false')
            .find('i').attr('class', 'bi bi-list');
    }

    $toggle.on('click', function () {
        $menu.prop('hidden') ? openMenu() : closeMenu();
    });

    // Close after clicking a link
    $menu.find('a').on('click', closeMenu);

    // Close with Escape key
    $(document).on('keydown', function (e) {
        if (e.key === 'Escape' && !$menu.prop('hidden')) {
            closeMenu();
            $toggle.trigger('focus');
        }
    });

    // Close on desktop screen
    $(window).on('resize', function () {
        if ($(window).width() >= 992) closeMenu();
    });

});
