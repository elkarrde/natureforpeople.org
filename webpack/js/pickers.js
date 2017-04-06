function initPickerPlugins($) {
	$.fn.graphTypePicker = function(callback) {
		this.each(function() {
			var $t = $(this);

			$t.find('.graph-card').click(function(event) {
				var $tgt = $(event.currentTarget),
					chosen_gt = $tgt.data('graphid');

				$tgt.addClass('graph-card-hover');

				callback({name: '', code: chosen_gt});
			});
		});

		return this;
	}
}

module.exports.initPickerPlugins = initPickerPlugins;
