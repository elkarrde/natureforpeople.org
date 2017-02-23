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
		interval;

	var arrowAustria = $(".map-wrapper .arrow-austria"),
		arrowGreece = $(".map-wrapper .arrow-greece");

	var switchCountryName = function(name) {
		$(".big-map-desc .country-name").html(name);
	}

	var panToViewBox = function(vpx, vpy) {
		svg.transition().duration(500).attr("viewBox", vpx + " " + vpy + " 800 800");
	}

	var panToCountry = function() {
		var currentViewBox = svg[0][0].viewBox.baseVal;

		var vpx = d3.select(this).select(".flag").node().getAttribute("mydata:vpx");
		var vpy = d3.select(this).select(".flag").node().getAttribute("mydata:vpy");

		var countryName = this.parentNode.getAttribute("mydata:countryname")
		var kita = d3.select(this.parentNode).node().getAttribute("mydata:countryname");

		switchCountryName(countryName);
		svg.transition().duration(500).attr("viewBox", vpx + " " + vpy + " 800 800");
	}

	flags.on("click", panToCountry);


	arrowAustria.on("click", function() {
		panToViewBox(-50, -50);
	});

	arrowGreece.hover(function() {
		panToViewBox(300, 300);
	});

	// arrowGreece.hover(function() {
	// 	interval = window.setInterval(panToBottomRight, 50);
	// }, function() {
	// 	window.clearInterval(interval);
	// });

	graphs.generateGraphOne('HRV')
	graphs.generateGraphTwo('HRV')
	graphs.generateGraphThree('HRV')
	graphs.generateGraphFour('HRV', 'PP Lonjsko Polje')
});
