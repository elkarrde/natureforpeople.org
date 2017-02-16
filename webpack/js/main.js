$ = require("jquery");
jQuery = $;
$( document.body ).on( 'click', '.dropdown-menu li', function( event ) {

  var $target = $( event.currentTarget );

  $target.closest( '.btn-group' )
     .find( '[data-bind="label"]' ).text( $target.text() )
        .end()
     .children( '.dropdown-toggle' ).dropdown( 'toggle' );

  return false;

});

(function($) {
    "use strict";

    var $navbar = $("#navbar"),
        y_pos = $navbar.offset().top,
        height = $navbar.height();
        $navbar.css('height', '4.5rem')
    var $l_select = $('#localization-select')  

    $(document).scroll(function() {
        var scrollTop = $(this).scrollTop();

        if (scrollTop > y_pos + height) {
            $navbar.css('height', '2.5rem');
            $l_select.css('height', '2.5rem');
        } else if (scrollTop <= y_pos) {
            $navbar.css('height', '4.5rem');
            $l_select.css('height', '4.5rem');
        }
    });

})(jQuery, undefined);