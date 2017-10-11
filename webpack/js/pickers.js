function initPickerPlugins($) {
  $.fn.graphTypePicker = function(callback) {
    this.each(function() {
      var $t = $(this);

      $t.find(".graph-card").click(function(event) {
        var $tgt = $(event.currentTarget),
          chosen_gt = $tgt.data("graphid"),
          graph_card_id = "#graph-card-" + chosen_gt;

        $t.find(".graph-card").removeClass("active");
        $(graph_card_id).addClass("active");

        callback({ name: "", code: chosen_gt });
      });
    });
    return this;
  };
}

module.exports.initPickerPlugins = initPickerPlugins;
