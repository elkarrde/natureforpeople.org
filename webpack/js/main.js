$ = require("jquery");
d3 = require('d3');
c3 = require('c3');
_ = require('lodash');
jQuery = $;

animationHelpers = require('./animationHelpers');
graphs = require('./graphs')

graph_choices = {
	country: null,
	protected_area: null,
	graph_type: null
}

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

countriesOrder = ["albania", "bosnia", "croatia", "kosovo", "macedonia", "montenegro", "serbia", "slovenia"];

$( document.body ).on( 'click', '.dropdown-menu li', function( event ) {
	var $target = $( event.currentTarget );

	$target.closest( '.btn-group' )
		.find( '[data-bind="label"]' ).text( $target.text() )
		.end()
		.children( '.dropdown-toggle' ).dropdown( 'toggle' );

	return false;
});

jQuery(document).ready(function(){
	$('.country-chooser-menu li').click(pickCountry);
	$('.graph-type-picker .graph-card').click(pickGraphType);

	var $navbar = $("#navbar"),
		y_pos = $navbar.offset().top,
		height = $navbar.height();

	$navbar.css('height', '4.5rem');
	var $l_select = $('.local-dropdown button');

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

	if ($('#counter').length == 1) {
		animationHelpers.animateValue("counter", 0, parseInt($('#counter').html()), 4000);
	}

	if ($('#counter300').length == 1) {
		animationHelpers.animateValue("counter300", 0, parseInt($('#counter300').html()), 4000);
	}

	animationHelpers.drawBarChart('#chart', [7, 14]);
	animationHelpers.drawBarChart('#frewhwater-util-chart', [118]);
	animationHelpers.drawBarChart('#chart9200', [9200]);
	animationHelpers.drawDonutChart('#donut39', $('#donut39').data('donut'), 200, 200, ".4em");
	animationHelpers.drawDonutChart('#pie25', $('#pie25').data('donut'), 200, 200, ".4em");
	animationHelpers.drawDonutChart('#pie63', $('#pie63').data('donut'), 200, 200, ".4em");
	animationHelpers.drawDonutChart('#pie2', $('#pie2').data('donut'), 200, 200, ".4em");
	animationHelpers.drawDonutChart('#pie77', $('#pie77').data('donut'), 200, 200, ".4em");

	// Check if correct localization string

	if (window.location.pathname.split('/')[1] == 'hr') {
		$('.local-dropdown button span').html('HR')
	} else {
		$('.local-dropdown button span').html('EN')
	}

	// Check if first li element is hidden then show
	if( jQuery('#carouselNav li:first-child').is(':hidden') ) {
		// Toggle visibility
		jQuery('#carouselNav li:first-child').toggle();
	}

	// Interval time
	var carouselInterval = 3000;

	// Slider
	function carouselSlide(){
		// Check if last element was reached
		if( jQuery('#carouselNav li:visible').next().length == 0 ) {
			// Hide last li element
			jQuery('#carouselNav li:last-child').slideUp('fast');
			// Show the first one
			jQuery('#carouselNav li:first-child').slideDown('fast');
		} else {
			// Rotate elements
			jQuery('#carouselNav li:visible').slideUp('fast').next('li:hidden').slideDown('fast');
		}
	}

	// Set Interval
	var carouselScroll = setInterval(carouselSlide,carouselInterval);

	// Pause on hover
	jQuery('#carousel').hover(function() {
		clearInterval(carouselScroll);
	}, function() {
		carouselScroll = setInterval(carouselSlide,carouselInterval);
		carouselSlide();
	});

	var currentCountry = "croatia";

	$('.map-wrapper svg .flag-icon').click(panToCountry);
	$(".map-wrapper .arrow-austria").click(function() { panToViewBox(-50, -50) });
	$(".map-wrapper .arrow-greece").click(function() { panToViewBox(300, 300) });

	$('.map-wrapper .big-map-desc .country-prev').click(function() {
		currentCountry = prevCountry(currentCountry);
		$('.map-wrapper svg .' + currentCountry + ' .flag-icon').click();
	});

	$('.map-wrapper .big-map-desc .country-next').click(function() {
		currentCountry = nextCountry(currentCountry);
		$('.map-wrapper svg .' + currentCountry + ' .flag-icon').click();
	});
});

// ---------------------------------------------------------
// Functions for manipulating graphs on Protected Areas page
// ---------------------------------------------------------

function pickCountry(event) {
	var chosen_country_data = $(event.currentTarget).data('countrycode'),
		chosen_country_text = $(event.currentTarget).data('countryname');

	if (chosen_country_text == '-') {
		$('.graph-card').removeClass('graph-card-hover');
	} else {
		$('.graph-card').addClass('graph-card-hover');
	};

	$('#choose-country-init-text').addClass('hide');
	$('#choose-country-chosen-text').removeClass('hide');
	$('#choose-country-chosen-text').text(chosen_country_text);
	$('#choose-pa-chosen-text').text('-');

	$('.pa-chooser').removeClass('hide');
	$('.pa-chooser ul').html('<li><a>-</a></li>')

	for (var i in protected_areas_by_country[chosen_country_data]) {
		var pa = protected_areas_by_country[chosen_country_data][i];
		$('.pa-chooser ul').append('<li><a>' + pa + '</a></li>')
	}

	$('.pa-chooser-menu li').click(pickProtectedArea);

	set_choices({chosen_country_text: chosen_country_data})
	render_graph();
};

function pickProtectedArea(event) {
	var chosen_pa_text = $(event.currentTarget).text();
	console.log(chosen_pa_text);

	$('#choose-pa-init-text').addClass('hide');
	$('#choose-pa-chosen-text').removeClass('hide');
	$('#choose-pa-chosen-text').text(chosen_pa_text);

	set_choices({chosen_pa_text: chosen_pa_text});
	render_graph();
}

function pickGraphType( event ) {
	var graph_type_text = $(event.currentTarget).data('graphid');
	set_choices({chosen_graph_type_text: graph_type_text})
	render_graph();
};

function set_choices(choice) {
	if (choice['chosen_country_text']) {
		graph_choices.protected_area = null;

		if (choice.chosen_country_text != '-') {
			graph_choices.country = choice.chosen_country_text;
		} else {
			graph_choices.country = null;
		}

	} else if (choice['chosen_pa_text']) {
		if (choice.chosen_pa_text != '-') {
			graph_choices.protected_area = choice.chosen_pa_text;
		} else {
			graph_choices.protected_area = null;
		}

	} else if (choice['chosen_graph_type_text']) {
		graph_choices.graph_type = parseInt(choice.chosen_graph_type_text, 10);
	}
}

function render_graph() {
	var country = graph_choices.country;
	var protected_area = graph_choices.protected_area;
	var graphType;

	if (protected_area) {
		graphType = graph_choices.graph_type + 3;
	} else {
		graphType = graph_choices.graph_type;
	};

	if (!country || !graphType) { return };

	graphs.generateGraph(graphType, country, protected_area)

	$('.no-graphs-h1').addClass('hide');
	$('.no-graphs-ol').addClass('hide');

	hide_other_graphs(graphType)

	$('#chart_' + graphType).removeClass('hide')
}

function hide_other_graphs(graph_number) {
	for(var i = 0; i <= 5; i++) {
		if (i + 1 == graph_number) { continue };
		$('#chart_'+(i+1)).addClass('hide');
	}
}

// ------------------------------------------------------
// Functions for manipulating the map on the landing page
// ------------------------------------------------------

function prevCountry(currCntry) {
	var currIdx = countriesOrder.indexOf(currCntry), len = countriesOrder.length;

	console.log(currIdx);

	if (currIdx <= 0) {
		console.log("BU");
		return countriesOrder[len - 1];
	} else {
		console.log("BA");
		return countriesOrder[currIdx - 1];
	}
}

function nextCountry(currCntry) {
	var currIdx = countriesOrder.indexOf(currCntry), len = countriesOrder.length;

	console.log(currIdx);

	if (currIdx >= len-1) {
		return countriesOrder[currIdx + 1 - len];
	} else {
		return countriesOrder[currIdx + 1];
	}
}

function panToViewBox(vpx, vpy) {
	var svg = d3.select(".map-wrapper svg");
	svg.transition().duration(500).attr("viewBox", vpx + " " + vpy + " 800 800");
}

function panToCountry() {
	var svg = d3.select(".map-wrapper svg"),
		currentViewBox = svg[0][0].viewBox.baseVal,
		vpx = d3.select(this).select(".flag").node().getAttribute("mydata:vpx"),
		vpy = d3.select(this).select(".flag").node().getAttribute("mydata:vpy"),
		countryName = this.parentNode.getAttribute("mydata:country_name"),
		countryDesc = this.parentNode.getAttribute("mydata:country_about"),
		countryUrl = this.parentNode.getAttribute("mydata:country_url"),
		localizationLocation = window.location.pathname.split('/')[1];

	if (localizationLocation == 'hr') {
      $("#country_path").prop("href", '/' + localizationLocation + countryUrl);
    } else {
      $("#country_path").prop("href", countryUrl);
    }

	switchCountry(countryName, countryDesc);
	svg.transition().duration(500).attr("viewBox", vpx + " " + vpy + " 800 800");
}

function switchCountry(countryName, countryDesc) {
	$(".big-map-desc .country-name").html(countryName);
	$(".big-map-desc .country-desc").html(countryDesc);
	$(".big-map-desc .more-about-name").html(countryName);
}
