function renderGraph(data, graph_choices, locale) {
	if (!!graph_choices.protected_area) {
		if (graph_choices.graph_type == "overall") { renderPAOverall(data, graph_choices, locale) }
		else if (graph_choices.graph_type == "overall_econ") { renderPAOverallEconomic(data, graph_choices, locale) }
		else if (graph_choices.graph_type == "flow_econ") { renderPAFlowEconValue(data, graph_choices, locale) }
		else if (graph_choices.graph_type == "potentials") { renderPAMainPotentials(data, graph_choices, locale) }
	} else {
		if (graph_choices.graph_type == "overall") { renderCountryOverall(data, graph_choices, locale) }
		else if (graph_choices.graph_type == "overall_econ") { renderCountryOverallEconomic(data, graph_choices, locale) }
		else if (graph_choices.graph_type == "flow_econ") { renderCountryFlowEconValue(data, graph_choices, locale) }
		else if (graph_choices.graph_type == "potentials") { renderCountryMainPotentials(data, graph_choices, locale) }
	}
}

function renderCountryOverall(data, graph_choices, locale) {
	var dataset = pluckDataCountryOverall(data, graph_choices.country)
		, only_counts = countNestedVals(dataset, ['eco_v', 'exi_v'], sizeOf)
		, only_non_empty = countNestedAndFilterOutZeros(only_counts, ['eco_v', 'exi_v'], _.identity)
		, sorted_counts = sortNestedVals(only_non_empty, 'exi_v', 'desc')
		, eco_line = [partition_names['eco_v'][locale]].concat(_.map(sorted_counts, 'eco_v'))
		, exi_line = [partition_names['exi_v'][locale]].concat(_.map(sorted_counts, 'exi_v'))
		, questions_line = localizeNames(question_names, ['x'].concat(_.keys(sorted_counts)), locale);

	renderTwicePartedXGraph({
		id: '#country_chart_overall',
		columns: [questions_line, eco_line, exi_line],
		colors: ['#fdbc5f', '#da1d52']
	}, dataset, locale, {height: 1000});
}

function renderCountryOverallEconomic(data, graph_choices, locale) {
	var dataset = pluckDataCountryOverallEconomic(data, graph_choices.country)
		, only_counts = countNestedVals(dataset, ['low_eco', 'high_eco'], sizeOf)
		, only_non_empty = countNestedAndFilterOutZeros(only_counts, ['low_eco', 'high_eco'], _.identity)
		, sorted_counts = sortNestedVals(only_non_empty, 'low_eco', 'desc')
		, low_eco_line = [partition_names['low_eco'][locale]].concat(_.map(sorted_counts, 'low_eco'))
		, high_eco_line = [partition_names['high_eco'][locale]].concat(_.map(sorted_counts, 'high_eco'))
		, questions_line = localizeNames(question_names, ['x'].concat(_.keys(sorted_counts)), locale);

	renderTwicePartedXGraph({
		id: '#country_chart_overall_econ',
		columns: [questions_line, low_eco_line, high_eco_line],
		colors: ['#fdbc5f', '#da1d52']
	}, dataset, locale, {height: 1000});
}

function renderCountryFlowEconValue(data, graph_choices, locale) {
	var dataset = pluckDataCountryFlowOfEconValue(data, graph_choices.country)
		, only_counts = countNestedVals(dataset, ['low_eco', 'high_eco'], sizeOf)
		, sorted_counts = sortNestedVals(only_counts, 'low_eco', 'desc')
		, low_eco_line = [partition_names['low_eco'][locale]].concat(_.map(sorted_counts, 'low_eco'))
		, high_eco_line = [partition_names['high_eco'][locale]].concat(_.map(sorted_counts, 'high_eco'))
		, stakeholders_line = localizeNames(stakeholder_names, ['x'].concat(_.keys(sorted_counts)), locale);

	renderTwicePartedXGraph({
		id: '#country_chart_flow_econ',
		columns: [stakeholders_line, low_eco_line, high_eco_line],
		colors: ['#fdbc5f', '#da1d52']
	}, dataset, locale, {height: 1000});
}

function renderCountryMainPotentials(data, graph_choices, locale) {
	var dataset = pluckDataCountryMainPotentials(data, graph_choices.country)
		, only_non_empty = countNestedAndFilterOutZeros(dataset, ['eco_p', 'exi_p'], sizeOf)
		, sorted_counts = sortNestedVals(only_non_empty, 'eco_p', 'desc')
		, eco_pots_line = [partition_names['eco_p'][locale]].concat(_.map(sorted_counts, 'eco_p'))
		, exi_pots_line = [partition_names['exi_p'][locale]].concat(_.map(sorted_counts, 'exi_p'))
		, questions_line = localizeNames(question_names, ['x'].concat(_.keys(sorted_counts)), locale);

	renderTwicePartedXGraph({
		id: '#country_chart_potentials',
		columns: [questions_line, eco_pots_line, exi_pots_line],
		colors: [ '#8dc63f', '#007476']
	}, dataset, locale);
}

function renderPAOverall(data, graph_choices, locale) {
	var dataset = pluckDataPAOverall(data, graph_choices.country, graph_choices.protected_area)
		, only_non_empty = countNestedAndFilterOutZeros(dataset, ['eco_v', 'exi_v'], sizeOf)
		, eco_vals_line = [partition_names['eco_v'][locale]].concat(_.map(only_non_empty, 'eco_v'))
		, exi_vals_line = [partition_names['exi_v'][locale]].concat(_.map(only_non_empty, 'exi_v'))
		, questions_line = localizeNames(question_names, ['x'].concat(_.keys(only_non_empty)), locale);

	renderTwicePartedXGraph({
		id: '#pa_chart_overall',
		columns: [ questions_line, eco_vals_line, exi_vals_line ],
		colors: [ '#007476', '#8dc63f']
	}, dataset, locale);
}

function renderPAOverallEconomic(data, graph_choices, locale) {
	var dataset = pluckDataPAOverallEconomic(data, graph_choices.country, graph_choices.protected_area)
		, only_non_empty = countNestedAndFilterOutZeros(dataset, ['low_eco', 'high_eco'], sizeOf)
		, low_eco_line = [partition_names['low_eco'][locale]].concat(_.map(only_non_empty, 'low_eco'))
		, high_eco_line = [partition_names['high_eco'][locale]].concat(_.map(only_non_empty, 'high_eco'))
		, questions_line = localizeNames(question_names, ['x'].concat(_.keys(only_non_empty)), locale);

	renderTwicePartedXGraph({
		id: '#pa_chart_overall_econ',
		columns: [ questions_line, low_eco_line, high_eco_line ],
		colors: [ '#007476', '#8dc63f']
	}, dataset, locale);
}

function renderPAFlowEconValue(data, graph_choices, locale) {
	var dataset = pluckDataPAFlowEconValue(data, graph_choices.country, graph_choices.protected_area)
		, all_values = countNestedVals(dataset, ['eco_v', 'exi_v'], sizeOf)
		, eco_vals_line = [partition_names['eco_v'][locale]].concat(_.map(all_values, 'eco_v'))
		, exi_vals_line = [partition_names['exi_v'][locale]].concat(_.map(all_values, 'exi_v'))
		, stakeholders_line = localizeNames(stakeholder_names, ['x'].concat(_.keys(all_values)), locale);

	renderTwicePartedXGraph({
		id: '#pa_chart_flow_econ',
		columns: [ stakeholders_line, exi_vals_line, eco_vals_line ],
		colors: [ '#007476', '#8dc63f']
	}, dataset, locale);
}

function renderPAMainPotentials(data, graph_choices, locale) {
	var dataset = pluckDataPAMainPotentials(data, graph_choices.country, graph_choices.protected_area)
		, only_non_empty = countNestedAndFilterOutZeros(dataset, ['p_with_val', 'p_without_val'], sizeOf)
		, sorted = sortNestedVals(only_non_empty, 'p_with_val', 'desc')
		, p_plus_vals_line = [partition_names['p_with_val'][locale]].concat(_.map(sorted, 'p_with_val'))
		, p_minus_vals_line = [partition_names['p_without_val'][locale]].concat(_.map(sorted, 'p_without_val'))
		, stakeholders_line = localizeNames(stakeholder_names, ['x'].concat(_.keys(sorted)), locale);

	renderTwicePartedXGraph({
		id: '#pa_chart_potentials',
		columns: [stakeholders_line, p_plus_vals_line, p_minus_vals_line],
		colors: [ '#007476', '#8dc63f']
	}, dataset, locale);
}

function pluckDataCountryOverall(data, country) {
	var country_data = data[country]
		, results = {};

	if (_.isEmpty(country_data)) { return };

	_.each(country_data, function(pa_data, pa_name) {
		_.each(pa_data.questions, function(q_data, q_name) {
			results[q_name] = results[q_name] || {'eco_v': new Set(), 'exi_v': new Set()};
			_.each(q_data, function(sh_data, sh_name) {
				if (sh_data.Eco && sh_data.Eco.value > 0) {
					results[q_name]['eco_v'].add(pa_data.name)
				} else if (sh_data.Exi && sh_data.Exi.value > 0) {
					results[q_name]['exi_v'].add(pa_data.name)
				}
			});
		});
	});

	return results;
}

function pluckDataCountryOverallEconomic(data, country) {
	var country_data = data[country]
		, results = {};

	if (_.isEmpty(country_data)) { return };

	_.each(country_data, function(pa_data, pa_name) {
		_.each(pa_data.questions, function(q_data, q_name) {
			results[q_name] = results[q_name] || {'high_eco': new Set(), 'low_eco': new Set()};
			_.each(q_data, function(sh_data, sh_name) {

				if (sh_data.Eco && sh_data.Eco.value == 2) {
					results[q_name]['high_eco'].add(pa_data.name)
				} else if (sh_data.Eco && sh_data.Eco.value == 1) {
					results[q_name]['low_eco'].add(pa_data.name)
				}
			});
		});
	});

	return results;
}

function pluckDataCountryFlowOfEconValue(data, country) {
	var country_data = data[country]
		, results = {};

	if (_.isEmpty(country_data)) { return };

	_.each(country_data, function(pa_data, pa_name) {
		_.each(pa_data.questions, function(q_data, q_name) {
			_.each(q_data, function(sh_data, sh_name) {
				results[sh_name] = results[sh_name] || {'low_eco': new Set(), 'high_eco': new Set()};

				if (sh_data.Eco && sh_data.Eco.value == 2) {
					results[sh_name]['high_eco'].add(pa_data.name)
				} else if (sh_data.Eco && sh_data.Eco.value == 1) {
					results[sh_name]['low_eco'].add(pa_data.name)
				}
			});
		});
	});

	return results;
}

function pluckDataCountryMainPotentials(data, country) {
	var country_data = data[country]
		, results = {};

	if (_.isEmpty(country_data)) { return }

	_.each(country_data, function(pa_data, pa_name) {
		_.each(pa_data.questions, function(q_data, q_name) {
			results[q_name] = results[q_name] || {'eco_p': new Set(), 'exi_p': new Set()};
			_.each(q_data, function(sh_data, sh_name) {
				if (sh_data.Eco && sh_data.Eco.value > 0 && sh_data.Eco.potential == 1) {
					results[q_name]['eco_p'].add(pa_data.name);
				} else if(sh_data.Eco && sh_data.Eco.value == 0 && sh_data.Eco.potential == 1) {
					results[q_name]['exi_p'].add(pa_data.name);
				}
			});
		});
	});

	return results;
}


function pluckDataPAOverall(data, country, pa) {
	var pa_data = data[country][pa]
		, results = {};

	if (_.isEmpty(pa_data)) { return }

	_.each(pa_data.questions, function(q_data, q_name) {
		results[q_name] = results[q_name] || {'eco_v': new Set(), 'exi_v': new Set()};
		_.each(q_data, function(sh_data, sh_name) {
			if (sh_data.Eco && sh_data.Eco.value > 0) {
				results[q_name]['eco_v'].add(sh_name);
			} else if(sh_data.Exi && sh_data.Exi.value > 0) {
				results[q_name]['exi_v'].add(sh_name);
			}
		})
	});

	return results;
}

function pluckDataPAOverallEconomic(data, country, pa) {
	var pa_data = data[country][pa]
		, results = {};

	if (_.isEmpty(pa_data)) { return }

	_.each(pa_data.questions, function(q_data, q_name) {
		results[q_name] = results[q_name] || {'low_eco': new Set(), 'high_eco': new Set()};
		_.each(q_data, function(sh_data, sh_name) {

			if (sh_data.Eco && sh_data.Eco.value == 1) {
				results[q_name]['low_eco'].add(sh_name);
			} else if(sh_data.Eco && sh_data.Eco.value == 2) {
				results[q_name]['high_eco'].add(sh_name);
			}
		});
	});

	return results;
}

function pluckDataPAFlowEconValue(data, country, pa) {
	var pa_data = data[country][pa]
		, results = {};

	if (_.isEmpty(pa_data)) { return }

	_.each(pa_data.questions, function(q_data, q_name) {
		_.each(q_data, function(sh_data, sh_name) {

			results[sh_name] = results[sh_name] || {'eco_v': new Set(), 'exi_v': new Set()};

			if (sh_data.Eco && sh_data.Eco.value > 0) {
				results[sh_name]['eco_v'].add(q_name);
			} else if(sh_data.Exi && sh_data.Exi.value > 0) {
				results[sh_name]['exi_v'].add(q_name);
			}
		});
	});

	return results;
}

function pluckDataPAMainPotentials(data, country, pa) {
	var pa_data = data[country][pa]
		, results = {};

	if (_.isEmpty(pa_data)) { return }

	_.each(pa_data.questions, function(q_data, q_name) {
		results[q_name] = results[q_name] || {'p_with_val': new Set(), 'p_without_val': new Set()};
		_.each(q_data, function(sh_data, sh_name) {
			if (sh_data.Eco && sh_data.Eco.potential == 1 && sh_data.Eco.value > 0) {
				results[q_name]['p_with_val'].add(sh_name);
			} else if(sh_data.Eco && sh_data.Eco.potential == 1 && sh_data.Eco.value == 0) {
				results[q_name]['p_without_val'].add(sh_name);
			}
		});
	});

	return results;
}


function renderTwicePartedXGraph(data, dataset, locale, opts) {
	var ticks = generateTicks(data),
		height = opts && opts.height || 600;

	c3.generate({
		bindto: data.id,
		data: {
			columns: data.columns,
			type: 'bar',
			x: 'x'
		},
		size: { height: 800 },
		axis: {
			rotated: true,
			x: {
				type: 'category',
			},
			y: {
				tick: { values: ticks },
				label: label_x_axis[data.id][locale]
			}
		},
		color: { pattern: data.colors },
		bar: { width: { ratio: 0.5 } },
		grid: { y: { show: true } },
		legend: { position: 'inset' },
		tooltip: {
			contents: function (d, defaultTitleFormat, defaultValueFormat, color) {
				var $$ = this, config = $$.config,
					titleFormat = config.tooltip_format_title || defaultTitleFormat,
					nameFormat = config.tooltip_format_name || function (name) { return name; },
					valueFormat = config.tooltip_format_value || defaultValueFormat,
					text, i, title, value, name, bgcolor,
					orderAsc = $$.isOrderAsc();

				var table = "<table colspan=2 class='" + $$.CLASS.tooltip + "'>";

				var a_names = data.columns[0],
					b_idx = d[0].index + 1,
					c_name = revertToEn(locale, a_names[b_idx]),
					x_vals = dataset[c_name];

				_.each(x_vals, function(set, key) {
					var vals = Array.from(set);

					if (vals.length > 0) { table += "<tr><th>" + partition_names[key][locale] + ":</th></tr>" }

					_.each(vals, function(v) {
						table += "<tr><td>" + v + "</td></tr>";
					});
				});

				return table + "</table>";
			}

		}
	});
}

function sizeOf(x) { return x.size }

function countVals(results, counterFn) {
	return _.mapValues(results, function(v) {
		return counterFn(v);
	})
}

function countNestedAndFilterOutZeros(dataset, props, counterFn) {
	return filterNested(countNestedVals(dataset, props, counterFn), function(pair) {
		return _.some(props, function(prop) {
			return pair[1][prop] > 0;
		})
	})
}

function countNestedVals(results, props, counterFn) {
	return _.fromPairs(_.map(_.toPairs(results), function(pair) {
		var key = pair[0]
			, val = pair[1]
			, new_val = _.fromPairs(_.map(props, function(prop) {
			var nested = val[prop];
			return [prop, counterFn(nested)]
		}));

		return [key, new_val];
	}))
}

function sortNestedVals(results, prop, direction) {
	var sorted = _.sortBy(_.toPairs(results), function(pair) { return pair[1][prop] })
	if (direction == 'asc') {
		return _.fromPairs(sorted);
	} else if (direction == 'desc') {
		return _.fromPairs(_.reverse(sorted));
	}
}

function filterNested(dataset, predicateFn) {
	return _.fromPairs(_.filter(_.toPairs(dataset), predicateFn));
}

function generateTicks(data) {
	var group_1 = _.filter(data.columns[1], function(v) { return _.isNumber(v) }),
		group_2 = _.filter(data.columns[2], function(v) { return _.isNumber(v) }),
		group_1_max = _.max(group_1),
		group_2_max = _.max(group_2);

		return _.range(_.max([group_1_max, group_2_max]) + 1);
}

function localizeNames(translations, names, locale) {
	return _.map(names, function(name) {
		if (translations[name]) { return translations[name][locale] } else { return name };
	})
}

function revertToEn(locale, name) {
	if (locale == 'en') {
		return name;
	} else {
		if (_.has(questions_hr_to_en, name)) {
			return questions_hr_to_en[name];
		} else if (_.has(stakeholders_hr_to_en, name)) {
			return stakeholders_hr_to_en[name];
		} else {
			return name;
		}
	}
}


stakeholder_names = {
	'Business sector': {
		'en': 'Business sector',
		'bcs': 'Poslovni sektor'
	},
	'National and regional and local government': {
		'en': 'National and regional and local government',
		'bcs': 'Vlada/javni sektor'
	},
	'National, regional and local government': {
		'en': 'National, regional and local government',
		'bcs': 'Vlada/javni sektor'
	},
	'Local people living near the PA': {
		'en': 'Local people living near the PA',
		'bcs': 'Stanovništvo u blizini zaštićenog područja'
	},
	'Local people living in the PA': {
		'en': 'Local people living in the PA',
		'bcs': 'Stanovništvo u zaštićenom području'
	},
	'Civil associations': {
		'en': 'Civil associations',
		'bcs': 'Udruženja građana'
	},
	'Non-governmental organizations, experts, scientists': {
		'en': 'Non-governmental organizations, experts, scientists',
		'bcs': 'Nevladine udruge, stručnjaci i znanstvenici'
	},
	'Non-governmental organizations': {
		'en': 'Non-governmental organizations',
		'bcs': 'Nevladine udruge'
	},
	'Experts and scientists': {
		'en': 'Experts & Scientists',
		'bcs': 'Stručnjaci i znanstvenici'
	},
	'National population': {
		'en': 'National population',
		'bcs': 'Stanovništvo',
	},
	'Global community': {
		'en': 'Global community',
		'bcs': 'Međunarodna zajednica'
	}
}


stakeholders_hr_to_en = {
	'Poslovni sektor': 'Bussiness sector',
	'Vlada/javni sektor': 'National and regional and local government',
	'Stanovništvo u blizini zaštićenog područja': 'Local people living near the PA',
	'Stanovništvo u zaštićenom području': 'Local people living in the PA',
	'Udruženja građana': 'Civil associations',
	'Nevladine udruge': 'Non-governmental organizations',
	'Stručnjaci i znanstvenici': 'Experts & Scientists',
	'Stanovništvo': 'National population',
	'Međunarodna zajednica': 'Global community'
}

question_names = {
	'Flood prevention': {
		'en': 'Flood prevention',
		'bcs': 'Obrana od poplava'
	},
	"Genetic material": {
		'en':'Genetic material',
		'bcs':'Genetski materijal'
	},
	"Formal & informal education": {
		'en':'Formal & informal education',
		'bcs':'Formalna i neformalna edukacija'
	},
	"Specific site value": {
		'en':'Specific site value',
		'bcs':'Specifična obilježja'
	},
	"Cultural & historical values": {
		'en': 'Cultural & historical values',
		'bcs': 'Kulturne i povijesne vrijednosti'
	},
	"Nature conservation": {
		'en': 'Nature conservation',
		'bcs': 'Zaštita prirode'
	},
	"Building knowledge": {
		'en': 'Building knowledge',
		'bcs': 'Istraživanje i nadogradnja znanja'
	},
	"Tourism & recreation": {
		'en': 'Tourism & recreation',
		'bcs': 'Turizam i rekreacija'
	},
	"Pollination & honey production": {
		'en': 'Pollination & honey production',
		'bcs': 'Oprašivanje i proizvodnja meda'
	},
	"Livestock grazing": {
		'en': 'Livestock grazing',
		'bcs': 'Stočarstvo'
	},
	"Fishing": {
		'en': 'Fishing',
		'bcs': 'Ribarstvo'
	},
	"Water quality & quantity": {
		'en': 'Water quality & quantity',
		'bcs': 'Kvaliteta i količina vode'
	},
	"Hunting": {
		'en': 'Hunting',
		'bcs': 'Lov'
	},
	"Wood": {
		'en': 'Wood',
		'bcs': 'Šumarstvo'
	},
	"Climate change mitigation": {
		'en': 'Climate change mitigation',
		'bcs': 'Ublažavanje klimatskih promjena'
	},
	"Commercial & non-commercial water use": {
		'en': 'Commercial & non-commercial water use',
		'bcs': 'Komercijalna i nekomercijalna uporaba vode'
	},
	"Traditional agriculture": {
		'en': 'Traditional agriculture',
		'bcs': 'Tradicionalna poljoprivreda'
	},
	"Wild food plants and mushrooms": {
		'en': 'Wild food plants and mushrooms',
		'bcs': 'Samoniklo jestivo bilje i gljive'
	},
	"Jobs in Protected Areas": {
		'en': 'Jobs in Protected Areas',
		'bcs': 'Zapošljavanje u zaštićenom području'
	},
	"Jobs in PA": {
		'en': 'Jobs in Protected Areas',
		'bcs': 'Zapošljavanje u zaštićenom području'
	},
	"Nature materials": {
		'en': 'Nature materials',
		'bcs': 'Prirodni materijali'
	},
	"Soil stabilization": {
		'en': 'Soil stabilization',
		'bcs': 'Stabilizacija tla'
	},
	"Medicinal herbs": {
		'en': 'Medicinal herbs',
		'bcs': 'Ljekovito bilje'
	}
}


questions_hr_to_en = {
		'Obrana od poplava': "Flood prevention",
		'Genetski materijal': "Genetic material",
		'Formalna i neformalna edukacija': "Formal & informal education",
		'Specifična obilježja': "Specific site value",
		'Kulturne i povijesne vrijednosti': "Cultural & historical values",
		'Zaštita prirode': "Nature conservation",
		'Istraživanje i nadogradnja znanja': "Building knowledge",
		'Turizam i rekreacija': "Tourism & recreation",
		'Oprašivanje i proizvodnja meda':  "Pollination & honey production",
		'Stočarstvo':  "Livestock grazing",
		'Ribarstvo':  "Fishing",
		'Kvaliteta i količina vode':  "Water quality & quantity",
		'Lov':  "Hunting",
		'Šumarstvo':  "Wood",
		'Ublažavanje klimatskih promjena':  "Climate change mitigation",
		'Nekomercijalna upotreba vode':  "Commercial & non-commercial water use",
		'Tradicionalna poljoprivreda':  "Traditional agriculture",
		'Samoniklo jestivo bilje i gljive':  "Wild food plants and mushrooms",
		'Zapošljavanje u zaštićenom području':  "Jobs in PA",
		'Prirodni materijali':  "Nature materials",
		'Stabilizacija tla':  "Soil stabilization",
		'Ljekovito bilje':  "Medicinal herbs"
}



partition_names = {
	'low_eco': {
		'en': 'Low economic values' ,
		'bcs': 'Niske ekonomske vrijednosti'
	},
	'high_eco': {
		'en': 'High economic values',
		'bcs': 'Visoke ekonomske vrijednosti'
	},
	'eco_v': {
		'en': 'Economic values',
		'bcs': 'Ekonomske vrijednosti'
	},
	'exi_v': {
		'en': 'Subsistence values',
		'bcs': 'Egzistencijalne vrijednosti'
	},
	'eco_p': {
		'en': 'Potential with economic value',
		'bcs': 'Ekonomski potencijali'
	},
	'exi_p': {
		'en': 'Potential with existential value',
		'bcs': 'Egzistencijalni potencijali'
	},
	'p_with_val': {
		'en': 'Potential with current economic value',
		'bcs': 'Potencijal sa trenutnom ekonomskom vrijednosti'
	},
	'p_without_val': {
		'en': 'Potential without current economic value',
		'bcs': 'Potencijal bez trenutne ekonomske vrijednosti'
	}
}

label_x_axis = {
	/* Country graphs */
	"#country_chart_overall": {
		"en": "Number of protected areas",
		"bcs": "Broj zaštićenih područja"
	},
	"#country_chart_overall_econ": {
		"en": "Number of protected areas",
		"bcs": "Broj zaštićenih područja"
	},
	"#country_chart_flow_econ": {
		"en": "Number of protected areas",
		"bcs": "Broj zaštićenih područja"
	},
	"#country_chart_potentials": {
		"en": "Number of protected areas",
		"bcs": "Broj zaštićenih područja"
	},
	/* PA graphs */
	"#pa_chart_overall": {
		"en": "Number of stakeholder groups",
		"bcs": "Broj grupa dionika"
	},
	"#pa_chart_overall_econ": {
		"en": "Number of protected area values",
		"bcs": "Broj vrijednosti zaštićenog područja",
	},
	"#pa_chart_flow_econ": {
		"en": "Number of stakeholder groups",
		"bcs": "Broj grupa dionika"
	},
	"#pa_chart_potentials": {
		"en": "Number of stakeholder groups",
		"bcs": "Broj grupa dionika"
	}
}

module.exports.renderGraph = renderGraph;
