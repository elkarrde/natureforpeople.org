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

  var with_eco_line = ['Potential with economic value'];
  var without_eco_line = ['Potential without economic value']
  var questions_line = ['x']

  var questions_g1 = ['Flood prevention', 'Genetic material', 'Formal & informal education',
                      'Specific site value', 'Cultural & historical values', 'Nature conservation',
                      'Building knowledge', 'Tourism & recreation', 'Pollination & honey production',
                      'Livestock grazing', 'Fishing', 'Water quality & quantity', 'Hunting', 'Wood',
                      'Climate change mitigation', 'Commercial & non-commercial water use',
                      'Traditional agriculture', 'Wild food plants and mushrooms', 'Jobs in PA',
                      'Nature materials', 'Soil stabilization', 'Medicinal herbs']

  for (var i in questions_g1) {
    var qst = questions_g1[i];
    if (with_eco[qst] || without_eco[qst]) {
      if (without_eco[qst]) {
        without_eco_line.push(without_eco[qst]); 
      } else {
        without_eco_line.push(0)
      }
      if (with_eco[qst]) {
        with_eco_line.push(with_eco[qst]);
      } else {
        with_eco_line.push(0)
      }
      questions_line.push(qst);
    }
  }

  var chart = c3.generate({
    bindto: '#chart_3',
    padding: {
      left: 110
    },
    data: {
      x: 'x',
      columns:
      [
        questions_line, without_eco_line, with_eco_line
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
                      'Traditional agriculture', 'Wild food plants and mushrooms', 'Jobs in PA',
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

function generateGraphFour(country, pa) {
  var chartData = graphFour(data, country, pa)

  var eco = chartData[0]
  var egz = chartData[1]

  var questions_g1 = ['Flood prevention', 'Genetic material', 'Formal & informal education',
                      'Specific site value', 'Cultural & historical values', 'Nature conservation',
                      'Building knowledge', 'Tourism & recreation', 'Pollination & honey production',
                      'Livestock grazing', 'Fishing', 'Water quality & quantity', 'Hunting', 'Wood',
                      'Climate change mitigation', 'Commercial & non-commercial water use',
                      'Traditional agriculture', 'Wild food plants and mushrooms', 'Jobs in PA',
                      'Nature materials', 'Soil stabilization', 'Medicinal herbs']

  var egz_line = ['Subsistence']

  var eco_line = ['Economic']

  var stakeholders_line = ['x']

  for (var i in questions_g1) {
    var qst = questions_g1[i];
    if (eco[qst] || egz[qst]) {
      if (egz[qst]) {
        egz_line.push(egz[qst]); 
      } else {
        egz_line.push(0)
      }
      if (eco[qst]) {
        eco_line.push(eco[qst]);
      } else {
        eco_line.push(0)
      }
      stakeholders_line.push(qst);
    }
  }

  var chart = c3.generate({
    bindto: '#chart_4',
    padding: {
      left: 110
    },
    data: {
      x: 'x',
      columns:
      [
        stakeholders_line, egz_line, eco_line
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

function graphFive(dataset, country, pa) {

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
                      'Traditional agriculture', 'Wild food plants and mushrooms', 'Jobs in PA',
                      'Nature materials', 'Soil stabilization', 'Medicinal herbs']

  for (var i in questions_g1) {
    question = questions_g1[i]
    for (var stakeholder in pas[question]) {
      if (pas[question][stakeholder].Eco !== undefined) {
        if ((pas[question][stakeholder].Eco.value == 2 || pas[question][stakeholder].Eco.value == 1)) {
          if (results_eco[stakeholder] === undefined) {
            results_eco[stakeholder] = 1
          } else {
            results_eco[stakeholder] += 1
          }
        }
      } 
      if (pas[question][stakeholder].Exi !== undefined) {
        if ((pas[question][stakeholder].Exi.value == 2 || pas[question][stakeholder].Exi.value == 1)) {
          if (results_egz[stakeholder] === undefined) {
            results_egz[stakeholder] = 1
          } else {
            results_egz[stakeholder] += 1
          }
        }
      }
    }
  }

  return [results_eco, results_egz]
}

function generateGraphFive(country, pa) {
  var chartData = graphFive(data, country, pa)

  var eco = chartData[0]
  var egz = chartData[1]

  var egz_line = ['Subsistence']
  var eco_line = ['Economic']

  var stakeholders = ['Local people living in the PA', 'Local people living near the PA', 'Civil associations',
                      'National and regional and local government', 'Non-governmental organizations & experts & scientists',
                      'National population', 'Global community', 'Bussiness sector']

  var stakeholders_line = ['x']

  for (var i in stakeholders) {
    var stk = stakeholders[i];
    if (eco[stk] || egz[stk]) {
      if (egz[stk]) {
        egz_line.push(egz[stk]); 
      } else {
        egz_line.push(0)
      }
      if (eco[stk]) {
        eco_line.push(eco[stk]);
      } else {
        eco_line.push(0)
      }
      stakeholders_line.push(stk);
    }
  }

  var chart = c3.generate({
    bindto: '#chart_5',
    padding: {
      left: 110
    },
    data: {
      x: 'x',
      columns:
      [
        stakeholders_line,
        egz_line,
        eco_line
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
module.exports.generateGraphFive = generateGraphFive;
