$ = require("jquery");
d3 = require('d3');
c3 = require('c3');
_ = require('lodash');
jQuery = $;

animationHelpers = require('./animationHelpers');
graphs = require('./graphs')
pickers = require('./pickers')

pickers.initPickerPlugins($);

graph_choices = {
	country: null,
	pa: null,
	graph_type: null
}

countriesOrder = ["slovenia", "croatia", "bosnia", "serbia", "kosovo", "montenegro", "albania", "macedonia"];
currentCountry = "croatia";

$( document.body ).on( 'click', '.dropdown-menu li', function( event ) {
	var $target = $( event.currentTarget );

	$target.closest( '.btn-group' )
		.find( '[data-bind="label"]' ).text( $target.text() )
		.end()
		.children( '.dropdown-toggle' ).dropdown( 'toggle' );

	return false;
});


jQuery(document).ready(function(){
	$('.country-picker').countryPicker(function(choice) {
		graph_choices.country = choice;
		console.log(graph_choices);
	}, '.pa-picker');

	$('.pa-picker').paPicker(function(choice) {
		graph_choices.pa = choice;
		console.log(graph_choices);
	});

	$('.graph-type-picker').graphTypePicker(function(choice) {
		graph_choices.graph_type = choice;
		console.log(graph_choices);
	});

	var $navbar = $("#main-nav"),
		y_pos = $navbar.offset().top,
		height = $navbar.height();


	$navbar.css('height', '4.5rem');
	var $l_select = $('.local-dropdown button');

	$(document).scroll(function() {
		var scrollTop = $(this).scrollTop();

		if (scrollTop > y_pos + height) {
			$navbar.css('height', '1.5rem');
			$l_select.css('height', '1.5rem');
		} else if (scrollTop <= y_pos) {
			$navbar.css('height', '2.5rem');
			$l_select.css('height', 'r.5rem');
		}
	});

	if ($('#counter').length == 1) {
		animationHelpers.animateValue("counter", 0, parseInt($('#counter').html()), 4000);
	}

	if ($('#counter300').length == 1) {
		animationHelpers.animateValue("counter300", 0, parseInt($('#counter300').html()), 4000);
	}

	animationHelpers.drawDonutChart('#homepage-fact-1', $('#homepage-fact-1').data('donut'), 200, 200, ".4em");
	animationHelpers.drawDonutChart('#homepage-fact-2', $('#homepage-fact-2').data('donut'), 200, 200, ".4em");
	animationHelpers.drawDonutChart('#homepage-fact-3', $('#homepage-fact-3').data('donut'), 200, 200, ".4em");

	// Check if correct localization string

	if (window.location.pathname.split('/')[1] == 'hr') {
		$('.local-dropdown button span').html('HR')
	} else {
		$('.local-dropdown button span').html('EN')
	}

	$('.landing-page-carousel .message-prev').click(function() {
		$messages = $('.carousel-messages li');
		$active_msg = $('.carousel-messages li.show');
		$active_msg.addClass("hide").removeClass("show");

		curr_index = $messages.index($active_msg);
		next_index = crawlArray($messages, curr_index, -1);

		$next_active_msg = $messages.eq(next_index);
		$next_active_msg.removeClass("hide").addClass("show");

	});

	$('.landing-page-carousel .message-next').click(function() {
		$messages = $('.carousel-messages li');
		$active_msg = $('.carousel-messages li.show');
		$active_msg.addClass("hide").removeClass("show");

		curr_index = $messages.index($active_msg);
		next_index = crawlArray($messages, curr_index, 1);

		$next_active_msg = $messages.eq(next_index);
		$next_active_msg.removeClass("hide").addClass("show");
	});

	$('.map-wrapper svg .country').click(panToCountry);
	$(".map-wrapper .arrow-austria").click(function() { panToViewBox(-50, -50) });
	$(".map-wrapper .arrow-greece").click(function() { panToViewBox(300, 300) });

	$('.map-wrapper .big-map-desc .country-prev').click(function() {
		currentCountry = countriesOrder[crawlArray(countriesOrder, countriesOrder.indexOf(currentCountry), -1)];
		$('.map-wrapper svg .' + currentCountry).click();
	});

	$('.map-wrapper .big-map-desc .country-next').click(function() {
		currentCountry = countriesOrder[crawlArray(countriesOrder, countriesOrder.indexOf(currentCountry), 1)];
		$('.map-wrapper svg .' + currentCountry).click();
	});

	$(document).keyup(function(e) {
		if (e.which === 37) {
			currentCountry = countriesOrder[crawlArray(countriesOrder, countriesOrder.indexOf(currentCountry), -1)];
			$('.map-wrapper svg .' + currentCountry).click();
		} else if (e.which === 39) {
			currentCountry = countriesOrder[crawlArray(countriesOrder, countriesOrder.indexOf(currentCountry), 1)];
			$('.map-wrapper svg .' + currentCountry).click();
		}
	});
});

// ---------------------------------------------------------
// Functions for manipulating graphs on Protected Areas page
// ---------------------------------------------------------

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

function panToViewBox(vpx, vpy) {
	var svg = d3.select(".map-wrapper svg");
	panMapToPoint(svg, vpx, vpy);
}

function panToCountry() {
	var svg = d3.select(".map-wrapper svg"),
		currentViewBox = svg[0][0].viewBox.baseVal,
		countryG = d3.select(this),
		countryNode = countryG.node(),
		vpx = countryNode.getAttribute("mydata:vpx"),
		vpy = countryNode.getAttribute("mydata:vpy"),
		countryName = countryNode.getAttribute("mydata:country_name"),
		countryBtn = countryNode.getAttribute("mydata:country_btn"),
		countryDesc = countryNode.getAttribute("mydata:country_about"),
		countryUrl = countryNode.getAttribute("mydata:country_url"),
		localizationLocation = window.location.pathname.split('/')[1],
		fullCountryUrl;

	if (localizationLocation == 'hr') {
      fullCountryUrl = '/' + localizationLocation + countryUrl;
    } else {
      fullCountryUrl = countryUrl;
    }

	switchCountry(countryName, countryDesc, countryBtn, fullCountryUrl);
	d3.selectAll("svg .country").style("opacity", 1);
	countryG.style("opacity", 0.5);
	panMapToPoint(svg, vpx, vpy);

}

function switchCountry(countryName, countryDesc, countryBtn, countryUrl) {
	$(".big-map-desc .country-name").html(countryName);
	$(".big-map-desc .country-desc").html(countryDesc);
	$(".big-map-desc .about-country-button").attr("href", countryUrl);
	$(".big-map-desc .more-about-name").html(countryBtn);
}

function crawlArray(array, index, step) {
    return ((index + step) % array.length + array.length) % array.length;
}


function panMapToPoint(svg, x, y) {
	var $svg = $(d3.select(".map-wrapper svg")[0]),
		x = parseInt(x, 10),
		y = parseInt(y, 10),
		w =  $svg.width(),
		h = $svg.height(),
		vb = parseViewBox($svg.attr("viewBox"));

	var real_x = x * (w / vb.w),
		real_y = y * (h / vb.h);

	svg.style("transform", "translate3d(" + (real_x*-1) + "px, " + (real_y*-1) + "px, 0.1px)");
}

function parseViewBox(viewBoxStr) {
	var vbAttrs = viewBoxStr.split(" ").map(function(istr) { return parseInt(istr, 10) });
	return { "w": vbAttrs[2], "h": vbAttrs[3] };
}
