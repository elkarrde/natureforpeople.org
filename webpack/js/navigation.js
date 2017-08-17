$('#mobile-burger').click(function() {
    $(this).toggleClass('is-active');

    $('#mobile-nav-dropdown').animate({
        height: 'toggle'
    }, 'fast');
});
