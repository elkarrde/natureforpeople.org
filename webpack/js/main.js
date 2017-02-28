$ = require("jquery");
d3 = require('d3');
c3 = require('c3');
_ = require('lodash');
jQuery = $;

animationHelpers = require('./animationHelpers');
graphs = require('./graphs')

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
	var $l_select = $('.local-dropdown button')

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
	animationHelpers.drawDonutChart(
		'#donut39',
		$('#donut39').data('donut'),
		200,
		200,
		".4em"
	);
	animationHelpers.drawDonutChart(
		'#pie25',
		$('#pie25').data('donut'),
		200,
		200,
		".4em"
	);
	animationHelpers.drawDonutChart(
		'#pie63',
		$('#pie63').data('donut'),
		200,
		200,
		".4em"
	);
	animationHelpers.drawDonutChart(
		'#pie2',
		$('#pie2').data('donut'),
		200,
		200,
		".4em"
	);
	animationHelpers.drawDonutChart(
		'#pie77',
		$('#pie77').data('donut'),
		200,
		200,
		".4em"
	);
})(jQuery, undefined);


jQuery(document).ready(function(){
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

	var svg = d3.select(".map-wrapper svg"),
		flags = d3.selectAll(".map-wrapper svg .flag-icon"),
		duration = 500,
		panning,
		interval,
		countries = ["albania", "bosnia", "croatia", "kosovo"],
		currentCountry = "croatia";


	var switchCountry= function(countryName, countryDesc) {
		$(".big-map-desc .country-name").html(countryName);
		$(".big-map-desc .country-desc").html(countryDesc);
		$(".big-map-desc .more-about-name").html(countryName);
	}

	var panToViewBox = function(vpx, vpy) {
		svg.transition().duration(500).attr("viewBox", vpx + " " + vpy + " 800 800");
	}

	var panToCountry = function() {
		var currentViewBox = svg[0][0].viewBox.baseVal;

		var vpx = d3.select(this).select(".flag").node().getAttribute("mydata:vpx");
		var vpy = d3.select(this).select(".flag").node().getAttribute("mydata:vpy");

		var countryName = this.parentNode.getAttribute("mydata:country_name");
		var countryDesc = this.parentNode.getAttribute("mydata:country_about");

		switchCountry(countryName, countryDesc);
		svg.transition().duration(500).attr("viewBox", vpx + " " + vpy + " 800 800");
	}

	$('.map-wrapper svg .flag-icon').on("click", panToCountry);

	$(".map-wrapper .arrow-austria").click(function() {
		panToViewBox(-50, -50);
	});

	$(".map-wrapper .arrow-greece").click(function() {
		panToViewBox(300, 300);
	});

	$('.map-wrapper .big-map-desc .country-prev').click(function() {
		countries.indexOf(this.country)
		$('.map-wrapper svg .macedonia .flag-icon').click();
	});

	$('.map-wrapper .big-map-desc .country-next').click(function() {
		$('.map-wrapper svg .slovenia .flag-icon').click();
	});

	// arrowGreece.hover(function() {
	// 	interval = window.setInterval(panToBottomRight, 50);
	// }, function() {
	// 	window.clearInterval(interval);
	// });
});

country = null;
chosen_pa = null;


$( document.body ).on( 'click', '.country-chooser-menu li', function( event ) {

	var $target = $( event.currentTarget );
	country = $target.text();

  if (country == '-') {
    $('#graph1-card').removeClass('graph-card-hover');
    $('#graph2-card').removeClass('graph-card-hover');
    $('#graph3-card').removeClass('graph-card-hover');
  } else {
    $('#graph1-card').addClass('graph-card-hover');
    $('#graph2-card').addClass('graph-card-hover');
    $('#graph3-card').addClass('graph-card-hover');
  }

  $('#choose-country-init-text').addClass('hide');
  $('#choose-country-chosen-text').removeClass('hide');
  $('#choose-country-chosen-text').text(country);
  $('#choose-pa-chosen-text').text('-');
  chosen_pa = '-';


	protected_areas_by_country = { 'ALB': ['NP Bredhi i Drenoves', 'NP Bredhi i Hotoves', 'NP Butrinti', 'NP Dajti', 'NP Divjakë-Karavasta', 'NP Dolina Valbona',
																				 'NP Karaburun-Sazan', 'NP Llogara', 'NP Mali i Tomorrit', 'NP Prespa', 'NP Qaf Shtama',
																				 'NP Shebenik Jabllanica', 'NP Thethi'],
																 'BIH': ['NP Kozara', 'NP Sutjeska', 'NP Una', 'PP Bijambare', 'PP Hutovo Blato', 'PP Vrelo Bosne'],
																 'HRV': ['NP Brijuni', 'NP Kornati', 'NP Krka', 'NP Mljet', 'NP Paklenica', 'NP Plitvička Jezera',
																 				 'NP Risnjak', 'NP Sjeverni Velebit', 'NP Telašćica', 'PP Biokovo', 'PP Kopački Rit',
																 				 'PP Lastovo', 'PP Lonjsko Polje', 'PP Medvednica', 'PP Papuk', 'PP Velebit',
																 				 'PP Vransko Jezero', 'PP Žumberak'],
																 'KOS': ['NP Sharri', 'PP Germia'],
																 'MKD': ['NP Galičica', 'NP Mavrovo', 'NP Pelister'],
																 'MNE': ['NP Biogradska Gora', 'NP Durmitor', 'NP Lovćen', 'NP Prokletje', 'NP Skadarsko Jezero'],
																 'SRB': ['NP Fruška Gora', 'NP Kopaonik', 'NP Tara', 'NP Đerdap', 'PP Gornje Podunavlje', 'PP Vlasina'],
																 'SVN': ['NP Triglav', 'PP Krajinski Park Goričko', 'PP Logarska Dolina', 'PP Sečovlje'] }

	$('.pa-chooser').removeClass('hide');
	$('.pa-chooser ul').empty();
  $('.pa-chooser ul').append('<li><a>-</a></li>')
	for (var i in protected_areas_by_country[country]) {
		var pa = protected_areas_by_country[country][i];
		$('.pa-chooser ul').append('<li><a>' + pa + '</a></li>')
	}
});

$( document.body ).on( 'click', '.pa-chooser-menu li', function( event ) {
	var $target = $( event.currentTarget );
	chosen_pa = $target.text();
  $('#choose-pa-init-text').addClass('hide');
  $('#choose-pa-chosen-text').removeClass('hide');
  $('#choose-pa-chosen-text').text(chosen_pa);
});

$( document.body ).on( 'click', '#graph3-card', function( event ) {
  if (chosen_pa == '-') chosen_pa = null
  if (country == '-') country = null
  if (country && !chosen_pa) {
    graphs.generateGraphThree(country)
    $('.no-graphs-h1').addClass('hide');
    $('.no-graphs-ol').addClass('hide');
    hide_other_graphs(3);
    $('#chart_3').removeClass('hide')
  } else if (country && chosen_pa) {
    $('.no-graphs-h1').addClass('hide');
    $('.no-graphs-ol').addClass('hide');
    graphs.generateGraphSix(country, chosen_pa)
    hide_other_graphs(6)
    $('#chart_6').removeClass('hide')
  }
});

$( document.body ).on( 'click', '#graph2-card', function( event ) {
  if (chosen_pa == '-') chosen_pa = null
  if (country == '-') country = null
  if (country && !chosen_pa) {
    $('.no-graphs-h1').addClass('hide');
    $('.no-graphs-ol').addClass('hide');
    graphs.generateGraphTwo(country)
    hide_other_graphs(2)
    $('#chart_2').removeClass('hide')
  } else if (country && chosen_pa) {
    $('.no-graphs-h1').addClass('hide');
    $('.no-graphs-ol').addClass('hide');
    graphs.generateGraphFive(country, chosen_pa)
    hide_other_graphs(5)
    $('#chart_5').removeClass('hide')
  }
});

$( document.body ).on( 'click', '#graph1-card', function( event ) {
  if (chosen_pa == '-') chosen_pa = null
  if (country == '-') country = null
  if (country && !chosen_pa) {
    graphs.generateGraphOne(country)
    $('.no-graphs-h1').addClass('hide');
    $('.no-graphs-ol').addClass('hide');
    hide_other_graphs(1)
    $('#chart_1').removeClass('hide')
  } else if (country && chosen_pa) {
    graphs.generateGraphFour(country, chosen_pa)
    $('.no-graphs-h1').addClass('hide');
    $('.no-graphs-ol').addClass('hide');
    hide_other_graphs(4)
    $('#chart_4').removeClass('hide')
  }
});

function hide_other_graphs(graph_number) {
  var graph_array = [1, 2, 3, 4, 5, 6]
  var removeIndex = graph_array.indexOf(graph_number)
  if (removeIndex > -1) {
      graph_array.splice(removeIndex, 1);
  }
  for(var i in graph_array) {
    var chart_to_hide = graph_array[i];
    var graph = $('#chart_'+chart_to_hide);
    graph.addClass('hide');
  }
}
	graphs.generateGraphFour(country, choosen_pa)
	graphs.generateGraphFive(country, choosen_pa)
	graphs.generateGraphSix(country, choosen_pa)
});
