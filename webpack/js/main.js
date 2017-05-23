$ = require("jquery");
d3 = require('d3');
c3 = require('c3');
_ = require('lodash');
Vue = require('vue');

jQuery = $;

animationHelpers = require('./animationHelpers');
graphs = require('./graphs');
pickers = require('./pickers');

require('./modal.js');

pickers.initPickerPlugins($);

countries = _.each([{
	name: {
		'en': "Albania",
		'hr': "Albania"
	},
	code: "ALB",
	protected_areas: [ { name: 'NP Bredhi i Drenoves', code: '' }, { name: 'NP Bredhi i Hotoves', code: '' }, { name: 'NP Butrinti', code: '' }, { name: 'NP Dajti', code: '' }, { name: 'NP Divjakë-Karavasta', code: '' }, { name: 'NP Dolina Valbona', code: '' }, { name: 'NP Karaburun-Sazan', code: '' }, { name: 'NP Llogara', code: '' }, { name: 'NP Mali i Tomorrit', code: '' }, { name: 'NP Prespa', code: '' }, { name: 'NP Qaf Shtama', code: '' }, { name: 'NP Shebenik Jabllanica', code: '' }, { name: 'NP Thethi', code: '' }]
}, {
	name: {
		'en': "Bosnia & Herzegovina",
		'hr': "Bosnia i Hercegovina"
	},
	code: "BIH",
	protected_areas: [ { name: 'NP Kozara', code: '' }, { name: 'NP Sutjeska', code: '' }, { name: 'NP Una', code: '' }, { name: 'PP Bijambare', code: '' }, { name: 'PP Hutovo Blato', code: '' }, { name: 'PP Vrelo Bosne', code: '' } ]
}, {
	name: {
		'en': "Croatia",
		'hr': "Hrvatska"
	},
	code: "HRV",
	protected_areas: [ { name: 'NP Brijuni', code: '' }, { name: 'NP Kornati', code: '' }, { name: 'NP Krka', code: '' }, { name: 'NP Mljet', code: '' }, { name: 'NP Paklenica', code: '' }, { name: 'NP Plitvička Jezera', code: '' }, { name: 'NP Risnjak', code: '' }, { name: 'NP Sjeverni Velebit', code: '' }, { name: 'NP Telašćica', code: '' }, { name: 'PP Biokovo', code: '' }, { name: 'PP Kopački Rit', code: '' }, { name: 'PP Lastovo', code: '' }, { name: 'PP Lonjsko Polje', code: '' }, { name: 'PP Medvednica', code: '' }, { name: 'PP Papuk', code: '' }, { name: 'PP Velebit', code: '' }, { name: 'PP Vransko Jezero', code: '' }, { name: 'PP Žumberak', code: '' } ]
}, {
	name: {
		'en': "Kosovo*",
		'hr': "Kosovo*",
	},
	code: "KOS",
	protected_areas: [ { name: 'NP Sharri', code: '' }, { name: 'PP Germia', code: '' } ]
}, {
	name: {
		'en': "Macedonia",
		'hr': "Makedonija",
	},
	code: "MKD",
	protected_areas: [ { name: 'NP Galičica', code: '' }, { name: 'NP Mavrovo', code: '' }, { name: 'NP Pelister', code: '' }]
}, {
	name: {
		'en': "Montenegro",
		'hr': "Crna Gora",
	},
	code: "MNE",
	protected_areas: [ { name: 'NP Biogradska Gora', code: '' }, { name: 'NP Durmitor', code: '' }, { name: 'NP Lovćen', code: '' }, { name: 'NP Prokletje', code: '' }, { name: 'NP Skadarsko Jezero', code: '' } ]
}, {
	name: {
		'en': "Serbia",
		'hr': "Srbija",
	},
	code: "SRB",
	protected_areas: [ { name: 'NP Fruška Gora', code: '' }, { name: 'NP Kopaonik', code: '' }, { name: 'NP Tara', code: '' }, { name: 'NP Đerdap', code: '' }, { name: 'PP Gornje Podunavlje', code: '' }, { name: 'PP Vlasina', code: '' } ]
}, {
	name: {
		'en': "Slovenia",
		'hr': "Slovenija",
	},
	code: "SVN",
	protected_areas: [ { name: 'NP Triglav', code: '' }, { name: 'PP Krajinski Park Goričko', code: '' }, { name: 'PP Logarska Dolina', code: '' }, { name: 'PP Sečovlje', code: '' } ]
}], function (country) {
	_.each(country.protected_areas, function(pa) {
		var new_name = { 'en': pa.name, 'hr': pa.name };
		pa.name = new_name;
	})
});

graph_types = [{
	name: {
		'en': "Overall values",
		'hr': "Sve vrijednosti",
	},
	code: "overall"
}, {
	name: {
		'en': "Overall economic values",
		'hr': "Glavne ekonomske vrijednosti",
	},
	code: "overall_econ"
}, {
	name: {
		'en': "Flow of economic benefits",
		'hr': "Tijek prihoda dionicima",
	},
	code: "flow_econ"
}, {
	name: {
		'en': "Main potentials",
		'hr': "Glavni potencijali",
	},
	code: "potentials"
}];

translations = {
	default_choice: {
		'en': "Please choose",
		'hr': "Izaberite"
	}
}

geolocation = null;
locale = 'hr';

countriesOrder = ["si", "hr", "ba", "rs", "xk", "me", "al", "mk"];
currentCountry = randomElement(countriesOrder);

var Dropdown = Vue.extend({
	template: "<div class=\"country-picker picker relative inline-block\"> <button @focus=\"toggled = true\" @blur=\"toggled = false\" class=\"btn border-hr-blue p2 grey-dark pointer-cursor\"> <span>{{ pickedText }}</span> <i class=\"icon-arrow-drop-down right\"></i> </button> <ul v-show=\"toggled\" class=\"z2 m0 absolute bg-hr-blue list-reset\"> <li v-for=\"c in choices\"> <a @mousedown=\"pick(c.name, c.code, $event)\">{{ c.name | localize }}</a> </li> </ul> </div>",
	filters: {
		localize: function(value) {
			return value[this.locale];
		}
	},
	methods: {
		pick: function (picked, code, event) {
			var selected = _.first(_.filter(this.choices, { code: code }));
			this.picked = picked[this.locale];
			this.shared.setState(this.prop_name, selected);
		}
	},
});

var store = {
	debug: true,
	state: {
		country: null,
		protected_area: null,
		graph_type: null,
	},
	setState: function(prop, newValue) {
		if (prop == 'country') { this.state.protected_area = null }
		if (prop == 'graph_type') {
			$('.graph-card').removeClass('active');
			$('#graph-card-'+newValue.code).addClass('active');
		}
		this.state[prop] = newValue
		renderGraph(this);
	},
	toChoice: function() {
		return {
			country: this.state.country['code'],
			protected_area: this.state.protected_area && this.state.protected_area['name'][locale],
			graph_type: this.state['graph_type']['code']
		}
	}
}

var countryPicker = new Dropdown({
	el: '#graphs-country-picker',
	data: function() {
		return {
			toggled: false,
			picked: translations.default_choice[locale],
			shared: store,
			prop_name: 'country',
			choices: countries,
			locale: locale
		}
	},
	computed: {
		pickedText: function() { return this.picked }
	}

})

var paPicker = new Dropdown({
	el: '#graphs-pa-picker',
	data: function() {
		return {
			toggled: false,
			picked: "-",
			shared: store,
			prop_name: 'protected_area',
			locale: locale
		}
	},
	computed: {
		choices: function() {
			var country = this.shared.state.country;
			return country && country.protected_areas || [];
		},
		pickedText: function() {
			return this.shared.state[this.prop_name] ? this.picked : "-";
		}
	}
})

var graphTypePicker = new Dropdown({
	el: '#graphs-type-picker-narrow',
	data: function() {
		return {
			toggled: false,
			picked: translations.default_choice[locale],
			shared: store,
			prop_name: 'graph_type',
			choices: graph_types,
			locale: locale
		}
	},
	computed: {
		pickedText: function() { return this.picked }
	}
})

jQuery(document).ready(function(){
	setLocale();
	setGeolocation();

	$('.graph-type-picker').graphTypePicker(function(choice) {
		store.setState('graph_type', choice)
	});

	$('#homepage-view-map-btn').click(function() {
		$('html,body').animate({scrollTop: $('#homepage-map').offset().top}, 'slow');
	});

	animationHelpers.drawDonutChart('#homepage-fact-graph-1', $('#homepage-fact-graph-1').data('donut'), 200, 200, ".4em");
	animationHelpers.drawDonutChart('#homepage-fact-graph-3', $('#homepage-fact-graph-3').data('donut'), 200, 200, ".4em");

	animationHelpers.drawBarChart("#croatia-fact-2", parseDataSet($('#croatia-fact-2').data('bars')), 200, 200);
	animationHelpers.drawDonutChart('#croatia-fact-3', $('#croatia-fact-3').data('percent'), 200, 200, ".4em");
	animationHelpers.drawDonutChart('#croatia-fact-4', $('#croatia-fact-4').data('percent'), 200, 200, ".4em");

	animationHelpers.drawDonutChart('#bosnia-fact-1', $('#bosnia-fact-1').data('percent'), 200, 200, ".4em");
	animationHelpers.drawDonutChart('#bosnia-fact-4', $('#bosnia-fact-4').data('percent'), 200, 200, ".4em");

	animationHelpers.drawDonutChart('#montenegro-fact-5', $('#montenegro-fact-5').data('percent'), 200, 200, ".4em");
	animationHelpers.drawDonutChart('#montenegro-fact-7', $('#montenegro-fact-7').data('percent'), 200, 200, ".4em");

	$("#homepage-map .country").click(function() {
		panToCountry(this);
	});

	$('#homepage-map-desc .country-prev').click(function() {
		console.log("sjdfklsdjflsdkjfslkj levo");
		currentCountry = countriesOrder[crawlArray(countriesOrder, countriesOrder.indexOf(currentCountry), -1)];
		console.log(currentCountry)
		$('#homepage-map .' + currentCountry).click();
	});

	$('#homepage-map-desc .country-next').click(function() {
		console.log("sjdfklsdjflsdkjfslkj desno");
		currentCountry = countriesOrder[crawlArray(countriesOrder, countriesOrder.indexOf(currentCountry), 1)];
		console.log(currentCountry)
		$('#homepage-map .' + currentCountry).click();
	});

	$(document).keyup(function(e) {
		if (e.which === 37) {
			currentCountry = countriesOrder[crawlArray(countriesOrder, countriesOrder.indexOf(currentCountry), -1)];
			$('#homepage-map .' + currentCountry).click();
		} else if (e.which === 39) {
			currentCountry = countriesOrder[crawlArray(countriesOrder, countriesOrder.indexOf(currentCountry), 1)];
			$('#homepage-map .' + currentCountry).click();
		}
	});

  // initialize modals
  $('[data-toggle="modal"]').modal();
});

// ---------------------------------------------------------
// Functions for manipulating graphs on Protected Areas page
// ---------------------------------------------------------

function renderGraph(store) {
	if (!graphRenderable(store)) {
		$('.graphs-container .pabat-chart').addClass('hide');
		$('.no-graphs').removeClass('hide');
	} else {
		graphs.renderGraph(store.toChoice())
		$('.graphs-container .pabat-chart').addClass('hide');
		$('.no-graphs').addClass('hide');
		$(graphId(store)).removeClass('hide');
	}
}

function graphRenderable(store) {
	return store.state.country && store.state.graph_type;
}

function graphId(store) {
	var graph_prefix = !!store.state.protected_area ? "pa" : "country";
	return "#" + graph_prefix + "_chart_" + store.state.graph_type.code;
}

// ------------------------------------------------------
// Functions for manipulating the map on the landing page
// ------------------------------------------------------

function panToViewBox(vpx, vpy) {
	var svg = d3.select(".map-wrapper svg");
	panMapToPoint(svg, vpx, vpy);
}

function panToCountry(country) {
	var svg = d3.select("#homepage-map")
		, currentViewBox = svg[0][0].viewBox.baseVal
		, country_group = d3.select(country)
		, country_node = country_group.node()
		, vpx = country_node.getAttribute("mydata:vpx")
		, vpy = country_node.getAttribute("mydata:vpy")

	switchCountry.call(window, country_node);
	d3.selectAll("svg .country").style("opacity", 1);
	country_group.style("opacity", 0.5);
	panMapToPoint(svg, vpx, vpy);

}

function switchCountry(country_node) {
	[country_name, country_btn, country_url] = countryInfo(country_node);
	$("#homepage-map-desc h2").html(country_name);
	$("#homepage-map-desc a").html(country_btn);
	$("#homepage-map-desc a").attr("href", country_url);
}

function countryInfo(country_node) {
	var $c = $(country_node)
		, country_name = $c.attr("mydata:country_name")
		, country_btn = $c.attr("mydata:country_btn")
		, country_url = $c.attr("mydata:country_url");

	return [country_name, country_btn, localizedUrl(country_url, locale)];
}

function panMapToPoint(svg, x, y) {
	var $svg = $(d3.select("#homepage-map")[0]),
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

function parseDataSet(bars) {
	if (!bars) { return }
	return _.map(bars.split(','), function(num) { return parseInt(num, 10) });
}

function setLocale() {
	if (window.location.pathname.split('/')[1] == 'hr') {
		locale = 'hr';
		$('.local-dropdown button span').html('HR');
	} else {
		locale = 'en';
		$('.local-dropdown button span').html('EN');
	}
}

function setGeolocation() {
	$.getJSON({
		url: "https://eu-js-geolocation.appspot.com/api/geolocation?format=jsonp&callback=?",
		dataType: "jsonp",
	}, function(json) {
		geolocation = json;
		var currentCountry = json.country.toLowerCase();
		var $country = $('.'+currentCountry);
		switchCountry($country);
	});
}

function randomElement(array) {
	var idx = Math.floor(Math.random() * array.length);
	return array[idx];
}

function localizedUrl(url, locale) {
	if (locale == 'hr') {
		return '/' + locale + url;
	} else {
		return url;
	}
}

function crawlArray(array, index, step) {
    return ((index + step) % array.length + array.length) % array.length;
}
