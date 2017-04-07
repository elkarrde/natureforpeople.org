$( function() {
    $.fn.modal = function( opts ) {
        return this.each(function() {
            var $self = $(this);
            var $body = $('body');
            var $target = $( $self.data('target') );
            var $closeBtn = $target.find('[data-dismiss="modal"]');

            var openModal = function() {
                $body.addClass('overflow-hidden');
                $target.fadeIn('fast');
            };

            var closeModal = function() {
                $target.fadeOut('fast');
                $body.removeClass('overflow-hidden');
            };

            $self.on('click', openModal);

            $closeBtn.on('click', closeModal);

            $target.on('click', function(e) {
                if ($(e.target).is( $self.data('target') )) {
                    closeModal();
                }
            });
        });
    };
});
