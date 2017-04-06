data_for_graphs = require('./preloadData');

data = data_for_graphs.timian_data;

questions_g1 = ['Tourism & recreation', 'Commercial & non-commercial water use', 'Jobs in PA', 'Water quality & quantity', 'Nature conservation', 'Wood', "Traditional agriculture", 'Fishing', 'Livestock grazing', 'Hunting', 'Pollination & honey production', 'Formal & informal education', 'Building knowledge', 'Wild food plants and mushrooms', 'Nature materials'];
questions_g3 = ['Tourism & recreation', 'Livestock grazing', 'Traditional agriculture', 'Nature conservation', 'Building knowledge', 'Cultural & historical values', 'Formal & informal education', 'Pollination & honey production', 'Commercial & non-commercial water use', 'Jobs in PA', 'Hunting', 'Medicinal herbs', 'Wild food plants and mushrooms', 'Fishing', 'Water quality & quantity', 'Genetic material', 'Climate change mitigation'];
questions_g4 = ['Flood prevention', 'Genetic material', 'Formal & informal education', 'Specific site value', 'Cultural & historical values', 'Nature conservation', 'Building knowledge', 'Tourism & recreation', 'Pollination & honey production', 'Livestock grazing', 'Fishing', 'Water quality & quantity', 'Hunting', 'Wood', 'Climate change mitigation', 'Commercial & non-commercial water use', 'Traditional agriculture', 'Wild food plants and mushrooms', 'Jobs in PA', 'Nature materials', 'Soil stabilization', 'Medicinal herbs'];
sectors = ['Bussiness sector', 'National and regional and local government', 'Local people living near the PA', 'Local people living in the PA', 'Civil associations'];
stakeholder = ['Local people living in the PA', 'Local people living near the PA', 'Civil associations', 'National and regional and local government', 'Non-governmental organizations & experts & scientists', 'National population', 'Global community', 'Bussiness sector'];

translations = {
	'Flood prevention'                      : '___PREVENCIJA POPLAVE',
	'Genetic material'                      : '___GENETSKI MATERIJAL',
	'Formal & informal education'           : 'Formalna i neformalna edukacija',
	'Specific site value'                   : '___SPECIFICNO MJESTO',
	'Cultural & historical values'          : '___KURTULA I HISTORIJA',
	'Nature conservation'                   : 'Zaštita prirode',
	'Building knowledge'                    : 'Istraživanje i nadogradnja znanja',
	'Tourism & recreation'                  : 'Turizam i rekreacija',
	'Pollination & honey production'        : 'Oprašivanje i proizvodnja meda',
	'Livestock grazing'                     : 'Stočarstvo',
	'Fishing'                               : 'Ribarstvo',
	'Water quality & quantity'              : 'Kvaliteta i količina vode',
	'Hunting'                               : 'Lovni turizam',
	'Wood'                                  : 'Šumarstvo',
	'Climate change mitigation'             : '___USPORAVENJA CLIMATE CHANGE',
	'Commercial & non-commercial water use' : 'Komercijalna upotreba vode',
	'Traditional agriculture'               : 'Tradicionalna poljoprivreda',
	'Wild food plants and mushrooms'        : 'Samoniklo jestivo bilje i gljive',
	'Jobs in PA'                            : 'Zapošljavanje u zaštićenom području',
	'Nature materials'                      : 'Prirodni materijali',
	'Soil stabilization'                    : '___STABILIZACIJA TLA',
	'Medicinal herbs'                       : '___ZDRAVE BILJKE'
}

function renderGraph(graph_choices) {
	if (!!graph_choices.protected_area) {
		if (graph_choices.graph_type == "overall") { renderPAOverall(graph_choices) }
		else if (graph_choices.graph_type == "overall_econ") { renderPAOverallEconomic(graph_choices) }
		else if (graph_choices.graph_type == "flow_econ") { renderPAFlowEconValue(graph_choices) }
		else if (graph_choices.graph_type == "potentials") { renderPAMainPotentials(graph_choices) }
	} else {
		if (graph_choices.graph_type == "overall") { renderCountryOverall(graph_choices) }
		else if (graph_choices.graph_type == "overall_econ") { renderCountryOverallEconomic(graph_choices) }
		else if (graph_choices.graph_type == "flow_econ") { renderCountryFlowEconValue(graph_choices) }
		else if (graph_choices.graph_type == "potentials") { renderCountryMainPotentials(graph_choices) }
	}
}

function renderCountryOverall(graph_choices) {
	var dataset = pluckDataCountryOverall(graph_choices.country)
		, questions = questions_g1
		, only_counts = countNestedVals(dataset, ['eco_v', 'exi_v'], sizeOf)
		, eco_line =  ['Economic values'].concat(_.map(only_counts, 'eco_v'))
		, exi_line =  ['Subsistence values'].concat(_.map(only_counts, 'exi_v'))
		, questions_line = ['x'].concat(questions);

	renderTwicePartedXGraph({
		id: '#country_chart_overall',
		columns: [questions_line, eco_line, exi_line],
		colors: ['#fdbc5f', '#da1d52']
	});
}

function renderCountryOverallEconomic(graph_choices) {
	var dataset = pluckDataCountryOverallEconomic(graph_choices.country)
		, questions = questions_g1
		, only_counts = countNestedVals(dataset, ['low_eco', 'high_eco'], sizeOf)
		, low_eco_line =  ['Low economic values'].concat(_.map(only_counts, 'low_eco'))
		, high_eco_line =  ['High economic values'].concat(_.map(only_counts, 'high_eco'))
		, questions_line = ['x'].concat(questions);

	renderTwicePartedXGraph({
		id: '#country_chart_overall_econ',
		columns: [questions_line, low_eco_line, high_eco_line],
		colors: ['#fdbc5f', '#da1d52']
	});
}

function renderCountryFlowEconValue(graph_choices) {
	var dataset = pluckDataCountryFlowOfEconValue(graph_choices.country)
		, datasetForSectors = _.pick(dataset, sectors)
		, only_counts = countNestedVals(datasetForSectors, ['low_eco', 'high_eco'], sizeOf)
		, low_eco_line =  ['Low economic values'].concat(_.map(only_counts, 'low_eco'))
		, high_eco_line =  ['High economic values'].concat(_.map(only_counts, 'high_eco'))
		, stakeholders_line = ['x'].concat(sectors);

	renderTwicePartedXGraph({
		id: '#country_chart_flow_econ',
		columns: [stakeholders_line, low_eco_line, high_eco_line],
		colors: ['#fdbc5f', '#da1d52']
	});
}

function renderCountryMainPotentials(graph_choices) {
	var dataset = pluckDataCountryMainPotentials(graph_choices.country)
		, questions = questions_g4
		, only_non_empty = countNestedAndFilterOutZeros(dataset, ['eco_p', 'exi_p'], sizeOf)
		, eco_pots_line = ['Potential with economic value'].concat(_.map(only_non_empty, 'eco_p'))
		, exi_pots_line = ['Potential with existential value'].concat(_.map(only_non_empty, 'exi_p'))
		, questions_line = ['x'].concat(questions);

	renderTwicePartedXGraph({
		id: '#country_chart_potentials',
		columns: [questions_line, eco_pots_line, exi_pots_line],
		colors: [ '#8dc63f', '#007476']
	})
}

function renderPAOverall(graph_choices) {
	var dataset = pluckDataPAOverall(graph_choices.country, graph_choices.protected_area)
		, questions = questions_g4
		, only_non_empty = countNestedAndFilterOutZeros(dataset, ['eco_v', 'exi_v'], sizeOf)
		, eco_vals_line = ['Economic values'].concat(_.map(only_non_empty, 'eco_v'))
		, exi_vals_line = ['Subsistence values'].concat(_.map(only_non_empty, 'exi_v'))
		, questions_line = ['x'].concat(questions);

	renderTwicePartedXGraph({
		id: '#pa_chart_overall',
		columns: [ questions_line, eco_vals_line, exi_vals_line ],
		colors: [ '#007476', '#8dc63f']
	})
}

function renderPAOverallEconomic(graph_choices) {
	var dataset = pluckDataPAOverallEconomic(graph_choices.country, graph_choices.protected_area)
		, questions = questions_g4
		, only_non_empty = countNestedAndFilterOutZeros(dataset, ['low_eco', 'high_eco'], sizeOf)
		, low_eco_line = ['Low economic values'].concat(_.map(only_non_empty, 'low_eco'))
		, high_eco_line = ['High economic values'].concat(_.map(only_non_empty, 'high_eco'))
		, questions_line = ['x'].concat(questions);

	renderTwicePartedXGraph({
		id: '#pa_chart_overall_econ',
		columns: [ questions_line, low_eco_line, high_eco_line ],
		colors: [ '#007476', '#8dc63f']
	})
}

function renderPAFlowEconValue(graph_choices) {
	var dataset = pluckDataPAFlowEconValue(graph_choices.country, graph_choices.protected_area)
		, only_non_empty = countNestedAndFilterOutZeros(dataset, ['eco_v', 'exi_v'], sizeOf)
		, eco_vals_line = ['Economic values'].concat(_.map(only_non_empty, 'eco_v'))
		, exi_vals_line = ['Subsistence values'].concat(_.map(only_non_empty, 'exi_v'))
		, stakeholders_line = ['x'].concat(_.keys(only_non_empty));

	renderTwicePartedXGraph({
		id: '#pa_chart_flow_econ',
		columns: [ stakeholders_line, exi_vals_line, eco_vals_line ],
		colors: [ '#007476', '#8dc63f']
	});
}

function renderPAMainPotentials(graph_choices) {
	var dataset = pluckDataPAMainPotentials(graph_choices.country, graph_choices.protected_area)
		, questions = questions_g4
		, only_non_empty = countNestedAndFilterOutZeros(dataset, ['p_with_val', 'p_without_val'], sizeOf)
		, sorted = sortNestedVals(only_non_empty, 'p_with_val', 'desc')
		, p_plus_vals_line = ['Potential with economic value'].concat(_.map(sorted, 'p_with_val'))
		, p_minus_vals_line = ['Potential without economic value'].concat(_.map(sorted, 'p_without_val'))
		, stakeholders_line = ['x'].concat(_.keys(sorted));

	renderTwicePartedXGraph({
		id: '#pa_chart_potentials',
		columns: [stakeholders_line, p_plus_vals_line, p_minus_vals_line],
		colors: [ '#007476', '#8dc63f']
	})
}

function pluckDataCountryOverall(country) {
	var country_data = data[country]
		, questions = questions_g1
		, results = {};

	if (_.isEmpty(country_data)) { return };

	_.each(questions, function(q) {
		results[q] = {'eco_v': new Set(), 'exi_v': new Set()};
		_.each(country_data, function(pa_data, pa_name) {
			_.each(pa_data[q], function(sh_data, sh_name) {

				if (sh_data.Eco && sh_data.Eco.value > 0) {
					results[q]['eco_v'].add(pa_name)
				} else if (sh_data.Exi && sh_data.Exi.value > 0) {
					results[q]['exi_v'].add(pa_name)
				}
			});
		});
	});

	return results;
}

function pluckDataCountryOverallEconomic(country) {
	var country_data = data[country]
		, questions = questions_g1
		, results = {};

	if (_.isEmpty(country_data)) { return };

	_.each(questions, function(q) {
		results[q] = {'high_eco': new Set(), 'low_eco': new Set()};
		_.each(country_data, function(pa_data, pa_name) {
			_.each(pa_data[q], function(sh_data, sh_name) {

				if (sh_data.Eco && sh_data.Eco.value == 2) {
					results[q]['high_eco'].add(pa_name)
				} else if (sh_data.Eco && sh_data.Eco.value == 1) {
					results[q]['low_eco'].add(pa_name)
				}
			});
		});
	});

	return results;
}

function pluckDataCountryFlowOfEconValue(country) {
	var country_data = data[country]
		, questions = questions_g1
		, results = {};

	if (_.isEmpty(country_data)) { return };

	_.each(questions, function(q) {
		_.each(country_data, function(pa_data, pa_name) {
			_.each(pa_data[q], function(sh_data, sh_name) {
				results[sh_name] = results[sh_name] || {'low_eco': new Set(), 'high_eco': new Set()};

				if (sh_data.Eco && sh_data.Eco.value == 2) {
					results[sh_name]['high_eco'].add(pa_name)
				} else if (sh_data.Eco && sh_data.Eco.value == 1) {
					results[sh_name]['low_eco'].add(pa_name)
				}
			});
		});
	});

	return results;
}

function pluckDataCountryMainPotentials(country) {
	var country_data = data[country]
		, questions = questions_g3
		, results = {};

	if (_.isEmpty(country_data)) { return }

	_.each(questions, function(q) {
		results[q] = {'eco_p': new Set(), 'exi_p': new Set()};
		_.each(country_data, function(pa_data, pa_name) {
			_.each(pa_data[q], function(sh_data, sh_name) {

				if (sh_data.Eco && sh_data.Eco.value > 0 && sh_data.Eco.potential == 1) {
					results[q]['eco_p'].add(pa_name);
				} else if(sh_data.Eco && sh_data.Eco.value == 0 && sh_data.Eco.potential == 1) {
					results[q]['exi_p'].add(pa_name);
				}
			});
		});
	});

	return results;
}


function pluckDataPAOverall(country, pa) {
	var pa_data = data[country][pa]
		, questions = questions_g4
		, results = {};

	if (_.isEmpty(pa_data)) { return }

	_.each(questions, function(q) {
		results[q] = {'eco_v': new Set(), 'exi_v': new Set()};
		_.each(pa_data[q], function(sh_data, sh_name) {

			if (sh_data.Eco && sh_data.Eco.value > 0) {
				results[q]['eco_v'].add(sh_name);
			} else if(sh_data.Exi && sh_data.Exi.value > 0) {
				results[q]['exi_v'].add(sh_name);
			}
		});
	});

	return results;
}

function pluckDataPAOverallEconomic(country, pa) {
	var pa_data = data[country][pa]
		, questions = questions_g4
		, results = {};

	if (_.isEmpty(pa_data)) { return }

	_.each(questions, function(q) {
		results[q] = {'low_eco': new Set(), 'high_eco': new Set()};
		_.each(pa_data[q], function(sh_data, sh_name) {

			if (sh_data.Eco && sh_data.Eco.value == 1) {
				results[q]['low_eco'].add(sh_name);
			} else if(sh_data.Eco && sh_data.Eco.value == 2) {
				results[q]['high_eco'].add(sh_name);
			}
		});
	});

	return results;
}

function pluckDataPAFlowEconValue(country, pa) {
	var pa_data = data[country][pa]
		, questions = questions_g4
		, results = {};

	if (_.isEmpty(pa_data)) { return }

	_.each(questions, function(q) {
		_.each(pa_data[q], function(sh_data, sh_name) {
			results[sh_name] = results[sh_name] || {'eco_v': new Set(), 'exi_v': new Set()};

			if (sh_data.Eco && sh_data.Eco.value > 0) {
				results[sh_name]['eco_v'].add(q);
			} else if(sh_data.Exi && sh_data.Exi.value > 0) {
				results[sh_name]['exi_v'].add(q);
			}
		});
	});

	return results;
}

function pluckDataPAMainPotentials(country, pa) {
	var pa_data = data[country][pa]
		, questions = questions_g4
		, results = {};

	if (_.isEmpty(pa_data)) { return }

	_.each(questions, function(q) {
		results[q] = {'p_with_val': new Set(), 'p_without_val': new Set()};
		_.each(pa_data[q], function(sh_data, sh_name) {

			if (sh_data.Eco && sh_data.Eco.potential == 1 && sh_data.Eco.value > 0) {
				results[q]['p_with_val'].add(sh_name);
			} else if(sh_data.Eco && sh_data.Eco.potential == 1 && sh_data.Eco.value == 0) {
				results[q]['p_without_val'].add(sh_name);
			}
		});
	});

	return results;
}


function renderTwicePartedXGraph(data) {
	c3.generate({
		bindto: data.id,
		data: {
			columns: data.columns,
			type: 'bar',
			x: 'x'
		},
		padding: { left: 110 },
		axis: {
			rotated: true,
			x: { type: 'category' }
		},
		color: { pattern: data.colors },
		bar: { width: { ratio: 0.5 } },
		grid: { y: { show: true } },
		legend: { position: 'inset' }
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

function translateLables(labels) {
	return _.map(labels, function(l) {
		return translations[l];
	})
}

module.exports.renderGraph = renderGraph;
