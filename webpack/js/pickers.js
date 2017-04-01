protected_areas_by_country = {
	'ALB': ['NP Bredhi i Drenoves', 'NP Bredhi i Hotoves', 'NP Butrinti', 'NP Dajti', 'NP Divjakë-Karavasta', 'NP Dolina Valbona', 'NP Karaburun-Sazan', 'NP Llogara', 'NP Mali i Tomorrit', 'NP Prespa', 'NP Qaf Shtama', 'NP Shebenik Jabllanica', 'NP Thethi'],
	'BIH': ['NP Kozara', 'NP Sutjeska', 'NP Una', 'PP Bijambare', 'PP Hutovo Blato', 'PP Vrelo Bosne'],
	'HRV': ['NP Brijuni', 'NP Kornati', 'NP Krka', 'NP Mljet', 'NP Paklenica', 'NP Plitvička Jezera', 'NP Risnjak', 'NP Sjeverni Velebit', 'NP Telašćica', 'PP Biokovo', 'PP Kopački Rit', 'PP Lastovo', 'PP Lonjsko Polje', 'PP Medvednica', 'PP Papuk', 'PP Velebit', 'PP Vransko Jezero', 'PP Žumberak'],
	'KOS': ['NP Sharri', 'PP Germia'],
	'MKD': ['NP Galičica', 'NP Mavrovo', 'NP Pelister'],
	'MNE': ['NP Biogradska Gora', 'NP Durmitor', 'NP Lovćen', 'NP Prokletje', 'NP Skadarsko Jezero'],
	'SRB': ['NP Fruška Gora', 'NP Kopaonik', 'NP Tara', 'NP Đerdap', 'PP Gornje Podunavlje', 'PP Vlasina'],
	'SVN': ['NP Triglav', 'PP Krajinski Park Goričko', 'PP Logarska Dolina', 'PP Sečovlje']
}

function valCleaner(val) { if (val == '-') { return null } else { return val }};

function initPickerPlugins($) {
	$.fn.countryPicker = function(callback, pa_chooser_class) {
		var $pa_chooser = $(pa_chooser_class);

		this.each(function() {
			var $t = $(this);
			$t.find('ul').click(function(event) {
				var $tgt = $(event.target).closest('li'),
					chosen_country_code = $tgt.data('countrycode'),
					chosen_country_text = $tgt.data('countryname');

				$t.find('button span').removeClass('hide');
				$t.find('button span').text(chosen_country_text);

				$pa_chooser.find('ul').html('<li><a>-</a></li>');
				_.each(protected_areas_by_country[chosen_country_code], function(pa) {
					$pa_chooser.find('ul').append('<li><a>' + pa + '</a></li>')
				})

				callback(valCleaner(chosen_country_code));
			});
		});

		return this;
	};

	$.fn.paPicker = function(callback) {
		this.each(function() {
			var $t = $(this);

			$t.find('ul').click(function(event) {
				var $tgt = $(event.target).closest('li'),
					chosen_pa_text = $tgt.text();

				$t.find('button span').removeClass('hide');
				$t.find('button span').text(chosen_pa_text);

				callback(valCleaner(chosen_pa_text));
			});
		});

		return this;
	}


	$.fn.graphTypePicker = function(callback) {
		this.each(function() {
			var $t = $(this);

			$t.find('.graph-card').click(function(event) {
				var $tgt = $(event.currentTarget),
					chosen_gt_text = $tgt.data('graphid');

				$tgt.addClass('graph-card-hover');

				callback(valCleaner(chosen_gt_text));
			});
		});

		return this;
	}
}

module.exports.initPickerPlugins = initPickerPlugins;
