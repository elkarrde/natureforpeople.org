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
	protected_area: null,
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
		renderGraph();
	}, '.pa-picker');

	$('.pa-picker').paPicker(function(choice) {
		graph_choices.protected_area = choice;
		renderGraph();
	});

	$('.graph-type-picker').graphTypePicker(function(choice) {
		graph_choices.graph_type = choice;
		renderGraph();
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

function renderGraph() {
	if (!graphRenderable()) {
		hideGraphs();
		$('.no-graphs').removeClass('hide');
	} else {
		graphs.renderGraph(graph_choices)
		hideGraphs();
		$('.no-graphs').addClass('hide');
		showGraph(graph_choices.graph_type, graph_choices.protected_area);
	}
}

function graphRenderable() {
	return graph_choices.country && graph_choices.graph_type;
}

function hideGraphs() {
	_.each(_.range(1, 4), function(i) {
		$('#country_chart_'+i).addClass('hide');
		$('#pa_chart_'+i).addClass('hide');
	})
}

function showGraph(graph_number, protected_area) {
	var graph_prefix = !!protected_area ? "pa" : "country",
		graph_id = "#" + graph_prefix + "_chart_" + graph_number;

	$(graph_id).removeClass('hide');
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
