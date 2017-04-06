$ = require("jquery");
d3 = require('d3');
c3 = require('c3');
_ = require('lodash');
Vue = require('vue');

jQuery = $;

animationHelpers = require('./animationHelpers');
graphs = require('./graphs')
pickers = require('./pickers')

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
		'en': "Kosovo",
		'hr': "Kosovo",
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

locale = 'hr';

countriesOrder = ["slovenia", "croatia", "bosnia", "serbia", "kosovo", "montenegro", "albania", "macedonia"];
currentCountry = "croatia";

var Dropdown = Vue.extend({
	template: `
		<div class=\"country-picker picker relative inline-block\">
			<button @focus=\"toggled = true\" @blur=\"toggled = false\" class=\"btn border-hr-blue p2 grey-dark pointer-cursor\">
				<span>{{ pickedText }}</span>
				<i class=\"icon-arrow-drop-down right\"></i>
			</button>
			<ul v-show=\"toggled\" class=\"z2 m0 absolute bg-hr-blue list-reset\">
				<li v-for=\"c in choices\">
					<a @mousedown=\"pick(c.name, c.code, $event)\">{{ c.name | localize }}</a>
				</li>
			</ul>
		</div>
	`,
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

	$('.graph-type-picker').graphTypePicker(function(choice) {
		store.setState('graph_type', choice)
	});

	$('#homepage-view-map-btn').click(function() {
		$('html,body').animate({scrollTop: $('#homepage-map').offset().top}, 'slow');
	});

	animationHelpers.drawDonutChart('#homepage-fact-1', $('#homepage-fact-1').data('donut'), 200, 200, ".4em");
	animationHelpers.drawDonutChart('#homepage-fact-2', $('#homepage-fact-2').data('donut'), 200, 200, ".4em");
	animationHelpers.drawDonutChart('#homepage-fact-3', $('#homepage-fact-3').data('donut'), 200, 200, ".4em");

	animationHelpers.animateValue("#croatia-fact-1", 4000);
	animationHelpers.drawBarChart("#croatia-fact-2", parseDataSet($('#croatia-fact-2').data('bars')), 200, 200);
	animationHelpers.drawDonutChart('#croatia-fact-3', $('#croatia-fact-3').data('percent'), 200, 200, ".4em");
	animationHelpers.drawDonutChart('#croatia-fact-4', $('#croatia-fact-4').data('percent'), 200, 200, ".4em");

	animationHelpers.animateValue("#bosnia-fact-2", 4000);
	animationHelpers.drawDonutChart('#bosnia-fact-1', $('#bosnia-fact-1').data('percent'), 200, 200, ".4em");
	animationHelpers.drawDonutChart('#bosnia-fact-4', $('#bosnia-fact-4').data('percent'), 200, 200, ".4em");

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
