data_for_graphs = require('./preloadData');

data = data_for_graphs.timian_data;

function generateGraphOne(country) {
  var results_g1 = graphOne(data, country)
  var y_labels = ['Turizam i rekreacija', 'Komercijalna upotreba vode', 'Zapošljavanje u zaštićenom području', 'Kvaliteta i količina vode', 'Zaštita prirode', 'Šumarstvo', "Tradicionalna poljoprivreda", 'Ribarstvo', 'Stočarstvo', 'Lovni turizam', 'Oprašivanje i proizvodnja meda', 'Formalna i neformalna edukacija', 'Istraživanje i nadogradnja znanja', 'Samoniklo jestivo bilje i gljive', 'Prirodni materijali']
  var colors = ['#da1d52', '#743873', '#8dc63f', '#743873', '#8dc63f', '#743873', '#fdbc5f', '#fdbc5f', '#fdbc5f', '#da1d52', '#fdbc5f', '#007476', '#007476', '#fdbc5f', '#743873']
  
  for (var i in results_g1) {
    if (results_g1[i] == 0) {
      results_g1.splice(i, 1);
      y_labels.splice(i, 1);
      colors.splice(i, 1)
    } 
  }

  results_g1 = [''].concat(results_g1)
  y_labels = ['x'].concat(y_labels)


  var chart = c3.generate({
    bindto: '#chart_1',
    padding: {
      left: 110
    },
    data: {
      x: 'x',
      columns:
      [
        y_labels,
        results_g1
      ],
      type: 'bar',
      color: function (color, d) {
        return colors[d.index];
      }
    }, 
    axis: {
      rotated: true,
      x: {
        type: 'category'
      }
    },
    bar: {
      width: {
        ratio: 0.5
      }
    },
    grid: {
      y: {
        show: true
      }
    },
    legend: {
      show: false
    }
  });
}

function graphOne(dataset, country) {
  var pas = dataset[country]
  if (_.isEmpty(pas)) {
    return null
  }

  var results = {}

  var questions_g1 = ['Tourism & recreation', 'Commercial & non-commercial water use', 'Jobs in PA', 'Water quality & quantity',
                'Nature conservation', 'Wood', "Traditional agriculture", 'Fishing', 'Livestock grazing', 'Hunting',
                'Pollination & honey production', 'Formal & informal education', 'Building knowledge',
                'Wild food plants and mushrooms', 'Nature materials']

  for (var pa in pas) {
    for (var i in questions_g1) {
      question = questions_g1[i]
      for (var stakeholder in pas[pa][question]) {
        if (pas[pa][question][stakeholder].Eco.value == 2) {
          if (results[question] === undefined) {
            results[question] = {}
            results[question][pa] = true
          } else {
            results[question][pa] = true
          }
        }
      }
    }
  }

  var results_by_question = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

  for (var i in questions_g1) {
    var question = questions_g1[i]
    for (var area in results[question]) {
      results_by_question[i]++;
    }
  }

  return results_by_question
}

function graphTwo(dataset, country) {
  var pas = dataset[country]
  if (_.isEmpty(pas)) {
    return null
  }

  var results_high = {}
  var results_low = {}


  var questions_g1 = ['Tourism & recreation', 'Commercial & non-commercial water use', 'Jobs in PA', 'Water quality & quantity',
                'Nature conservation', 'Wood', "Traditional agriculture", 'Fishing', 'Livestock grazing', 'Hunting',
                'Pollination & honey production', 'Formal & informal education', 'Building knowledge',
                'Wild food plants and mushrooms', 'Nature materials']

  for (var pa in pas) {
    for (var i in questions_g1) {
      question = questions_g1[i]
      for (var stakeholder in pas[pa][question]) {
        if (pas[pa][question][stakeholder].Eco.value == 2) {
          if (results_high[stakeholder] === undefined) {
            results_high[stakeholder] = {}
            results_high[stakeholder][pa] = true
          } else {
            results_high[stakeholder][pa] = true
          }
        } else if((pas[pa][question][stakeholder].Eco.value == 1)) {
          if (results_low[stakeholder] === undefined) {
            results_low[stakeholder] = {}
            results_low[stakeholder][pa] = true
          } else {
            results_low[stakeholder][pa] = true
          }
        }
      }
    }
  }

  low = {}
  high = {}

  for (var sector in results_low) {
    low[sector] = Object.keys(results_low[sector]).length
  }

  for (var sector in results_high) {
    high[sector] = Object.keys(results_high[sector]).length
  }

  return [low, high]
}

function generateGraphTwo(country) {
  var chart_data = graphTwo(data, country)

  var sectors = ['Bussiness sector', 'National and regional and local government', 'Local people living near the PA', 'Local people living in the PA', 'Civil associations']

  var chart = c3.generate({
    bindto: '#chart_2',
    padding: {
      left: 110
    },
    data: {
      x: 'x',
      columns:
      [
        ['x', 'Poslovni sektor', 'Vlada/javni sektor', ' ',
         'Stanovništvo u blizini zaštićenog područja', 'Stanovništvo u zaštićenom području', 'Udruženja građana', '  ',
         'Stručnjaci/ znanstvenici', 'Stanovništvo RH', 'Međunarodna zajednica'],
        ['Mala ekonomska vrijednost', chart_data[0]['Bussiness sector'] || 0, chart_data[0]['National and regional and local government'] || 0, 0,
         chart_data[0]['Local people living near the PA'] || 0, chart_data[0]['Local people living in the PA'] || 0, chart_data[0]['Civil associations'] || 0, 0,
         chart_data[0]['Non-governmental organizations & experts & scientists'] || 0, chart_data[0]['National population'] || 0, chart_data[0]['Global community'] || 0],
        ['Značajna ekonomska vrijednost', chart_data[1]['Bussiness sector'] || 0, chart_data[1]['National and regional and local government'] || 0, 0,
         chart_data[1]['Local people living near the PA'] || 0, chart_data[1]['Local people living in the PA'] || 0, chart_data[1]['Civil associations'] || 0, 0,
         chart_data[1]['Non-governmental organizations & experts & scientists'] || 0, chart_data[1]['National population'] || 0, chart_data[1]['Global community'] || 0]
      ],
      type: 'bar'
    },
    color: {
      pattern: [ '#fdbc5f', '#da1d52']
    }, 
    axis: {
      rotated: true,
      x: {
        type: 'category'
      }
    },
    bar: {
      width: {
        ratio: 0.5
      }
    },
    grid: {
      y: {
        show: true
      }
    },
    legend: {
      position: 'inset'
    }
  });
}

function graphThree(dataset, country) {
  var pas = dataset[country]
  if (_.isEmpty(pas)) {
    return null
  }

  var results_high = {}
  var results_low = {}


  var questions_g1 = ['Tourism & recreation', 'Livestock grazing', 'Traditional agriculture',
                      'Nature conservation', 'Building knowledge', 'Cultural & historical values',
                      'Formal & informal education', 'Pollination & honey production', 'Commercial & non-commercial water use',
                      'Jobs in PA', 'Hunting', 'Medicinal herbs', 'Wild food plants and mushrooms', 'Fishing', 'Water quality & quantity',
                      'Genetic material', 'Climate change mitigation']

  for (var pa in pas) {
    for (var i in questions_g1) {
      question = questions_g1[i]
      for (var stakeholder in pas[pa][question]) {
        if ((pas[pa][question][stakeholder].Eco.value == 2 || pas[pa][question][stakeholder].Eco.value == 1) && pas[pa][question][stakeholder].Eco.potential == 1) {
          if (results_high[question] === undefined) {
            results_high[question] = {}
            results_high[question][pa] = true
          } else {
            results_high[question][pa] = true
          }
        } else if(pas[pa][question][stakeholder].Eco.value == 0 && pas[pa][question][stakeholder].Eco.potential == 1) {
          if (results_low[question] === undefined) {
            results_low[question] = {}
            results_low[question][pa] = true
          } else {
            results_low[question][pa] = true
          }
        }
      }
    }
  }

  low = {}
  high = {}

  for (var sector in results_low) {
    low[sector] = Object.keys(results_low[sector]).length
  }

  for (var sector in results_high) {
    high[sector] = Object.keys(results_high[sector]).length
  }

  return [low, high]
}

function generateGraphThree(country) {
  var chartData = graphThree(data, country)

  var with_eco = chartData[1]
  var without_eco = chartData[0]

  var chart = c3.generate({
    bindto: '#chart_3',
    padding: {
      left: 110
    },
    data: {
      x: 'x',
      columns:
      [
        ['x', 'Turizam i rekreacija', 'Stočarstvo', 'Tradicionalna poljoprivreda', 'Zaštita prirode', 'Istraživanje i nadogradnja znanja', 'Kulturne i povijesne vrijednosti', 'Formalna i neformalna edukacija', 'Oprašivanje i proizvodnja meda', 'Komercijalno korištenje vode', 'Zapošljavanje u zaštićenom području', 'Lovni turizam', 'Ljekovito bilje', 'Samoniklo jestivo bilje i gljive', 'Ribarstvo', 'Kvaliteta i količina vode', 'Genetski materijal', 'Ublažavanje klimatskih promijena'],
        ['Potencijal bez ekonomske vrijednosti', without_eco['Tourism & recreation'] || 0, without_eco['Livestock grazing'] || 0, without_eco['Traditional agriculture'] || 0,
                                                without_eco['Nature conservation'] || 0, without_eco['Building knowledge'] || 0, without_eco['Cultural & historical values'] || 0,
                                                without_eco['Formal & informal education'] || 0, without_eco['Pollination & honey production'] || 0, without_eco['Commercial & non-commercial water use'] || 0,
                                                without_eco['Jobs in PA'] || 0, without_eco['Hunting'] || 0, without_eco['Medicinal herbs'] || 0,
                                                without_eco['Wild food plants and mushrooms'] || 0, without_eco['Fishing'] || 0, without_eco['Water quality & quantity'] || 0,
                                                without_eco['Genetic material'] || 0, without_eco['Climate change mitigation'] || 0] || 0,
        ['Potencijal s ekonomskom vrijednosti', with_eco['Tourism & recreation'] || 0, with_eco['Livestock grazing'] || 0, with_eco['Traditional agriculture'] || 0,
                                                with_eco['Nature conservation'] || 0, with_eco['Building knowledge'] || 0, with_eco['Cultural & historical values'] || 0,
                                                with_eco['Formal & informal education'] || 0, with_eco['Pollination & honey production'] || 0, with_eco['Commercial & non-commercial water use'] || 0,
                                                with_eco['Jobs in PA'] || 0, with_eco['Hunting'] || 0, with_eco['Medicinal herbs'] || 0,
                                                with_eco['Wild food plants and mushrooms'] || 0, with_eco['Fishing'] || 0, with_eco['Water quality & quantity'] || 0,
                                                with_eco['Genetic material'] || 0, with_eco['Climate change mitigation'] || 0]
      ],
      type: 'bar'
    },
    color: {
      pattern: [ '#8dc63f', '#007476']
    }, 
    axis: {
      rotated: true,
      x: {
        type: 'category'
      }
    },
    bar: {
      width: {
        ratio: 0.5
      }
    },
    grid: {
      y: {
        show: true
      }
    },
    legend: {
      position: 'inset'
    }
  });
}










function graphFour(dataset, country, pa) {

  var pas = dataset[country][pa]
  if (_.isEmpty(pas)) {
    return null
  }

  var results_eco = {}
  var results_egz = {}

  var questions_g1 = ['Flood prevention', 'Genetic material', 'Formal & informal education',
                      'Specific site value', 'Cultural & historical values', 'Nature conservation',
                      'Building knowledge', 'Tourism & recreation', 'Pollination & honey production',
                      'Livestock grazing', 'Fishing', 'Water quality & quantity', 'Hunting', 'Wood',
                      'Climate change mitigation', 'Commercial & non-commercial water use',
                      'Traditional agriculture', 'Wild food plants and mushrooms', 'Jobs in Protected Areas',
                      'Nature materials', 'Soil stabilization', 'Medicinal herbs']




  for (var i in questions_g1) {
    question = questions_g1[i]
    for (var stakeholder in pas[question]) {
      if (pas[question][stakeholder].Eco !== undefined) {
        if ((pas[question][stakeholder].Eco.value == 2 || pas[question][stakeholder].Eco.value == 1)) {
          if (results_eco[question] === undefined) {
            results_eco[question] = 1
          } else {
            results_eco[question] += 1
          }
        }
      } 
      if (pas[question][stakeholder].Exi !== undefined) {
        if ((pas[question][stakeholder].Exi.value == 2 || pas[question][stakeholder].Exi.value == 1)) {
          if (results_egz[question] === undefined) {
            results_egz[question] = 1
          } else {
            results_egz[question] += 1
          }
        }
      }
    }
  }

  eco = {}
  egz = {}

  for (var sector in results_eco) {
    eco[sector] = Object.keys(results_eco[sector]).length
  }

  for (var sector in results_egz) {
    egz[sector] = Object.keys(results_egz[sector]).length
  }

  return [results_eco, results_egz]
}

'Flood prevention', 'Genetic material', 'Formal & informal education', 'Specific site value', 'Cultural & historical values', 'Nature conservation', 'Building knowledge', 'Tourism & recreation', 'Pollination & honey production', 'Livestock grazing', 'Fishing', 'Water quality & quantity', 'Hunting', 'Wood', 'Climate change mitigation', 'Commercial & non-commercial water use', 'Traditional agriculture', 'Wild food plants and mushrooms', 'Jobs in Protected Areas', 'Nature materials', 'Soil stabilization', 'Medicinal herbs'

function generateGraphFour(country, pa) {
  var chartData = graphFour(data, country, pa)

  console.log(chartData);

  var eco = chartData[0]
  var egz = chartData[1]

  var chart = c3.generate({
    bindto: '#chart_3',
    padding: {
      left: 110
    },
    data: {
      x: 'x',
      columns:
      [
        ['x', 'Flood prevention', 'Genetic material', 'Formal & informal education', 'Specific site value', 'Cultural & historical values', 'Nature conservation', 'Building knowledge', 'Tourism & recreation', 'Pollination & honey production', 'Livestock grazing', 'Fishing', 'Water quality & quantity', 'Hunting', 'Wood', 'Climate change mitigation', 'Commercial & non-commercial water use', 'Traditional agriculture', 'Wild food plants and mushrooms', 'Jobs in Protected Areas', 'Nature materials', 'Soil stabilization', 'Medicinal herbs'],
        ['Subsistence', egz['Flood prevention'] || 0, egz['Genetic material'] || 0, egz['Formal & informal education'] || 0,
                                       egz['Specific site value'] || 0, egz['Cultural & historical values'] || 0, egz['Nature conservation'] || 0,
                                       egz['Building knowledge'] || 0, egz['Tourism & recreation'] || 0, egz['Pollination & honey production'] || 0,
                                       egz['Livestock grazing'] || 0, egz['Fishing'] || 0, egz['Medicinal herbs'] || 0,
                                       egz['Wild food plants and mushrooms'] || 0, egz['Fishing'] || 0, egz['Water quality & quantity'] || 0,
                                       egz['Hunting'] || 0, egz['Wood'] || 0, egz['Climate change mitigation'] || 0, egz['Commercial & non-commercial water use'] || 0,
                                       egz['Traditional agriculture'] || 0, egz['Wild food plants and mushrooms'] || 0, egz['Jobs in Protected Areas'] || 0,
                                       egz['Nature materials'] || 0, egz['Soil stabilization'] || 0, egz['Medicinal herbs'] || 0],
        ['Economic', eco['Flood prevention'] || 0, eco['Genetic material'] || 0, eco['Formal & informal education'] || 0,
                                 eco['Specific site value'] || 0, eco['Cultural & historical values'] || 0, eco['Nature conservation'] || 0,
                                 eco['Building knowledge'] || 0, eco['Tourism & recreation'] || 0, eco['Pollination & honey production'] || 0,
                                 eco['Livestock grazing'] || 0, eco['Fishing'] || 0, eco['Medicinal herbs'] || 0,
                                 eco['Wild food plants and mushrooms'] || 0, eco['Fishing'] || 0, eco['Water quality & quantity'] || 0,
                                 eco['Hunting'] || 0, eco['Wood'] || 0, eco['Climate change mitigation'] || 0, eco['Commercial & non-commercial water use'] || 0,
                                 eco['Traditional agriculture'] || 0, eco['Wild food plants and mushrooms'] || 0, eco['Jobs in Protected Areas'] || 0,
                                 eco['Nature materials'] || 0, eco['Soil stabilization'] || 0, eco['Medicinal herbs'] || 0]
      ],
      type: 'bar'
    },
    color: {
      pattern: [ '#007476', '#8dc63f']
    }, 
    axis: {
      rotated: true,
      x: {
        type: 'category'
      }
    },
    bar: {
      width: {
        ratio: 0.5
      }
    },
    grid: {
      y: {
        show: true
      }
    },
    legend: {
      position: 'inset'
    }
  });
}
















module.exports.generateGraphOne = generateGraphOne;
module.exports.generateGraphTwo = generateGraphTwo;
module.exports.generateGraphThree = generateGraphThree;
module.exports.generateGraphFour = generateGraphFour;
