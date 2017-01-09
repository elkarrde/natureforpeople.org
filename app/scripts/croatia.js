$(document).ready(function(){
    var data = {};

    // LoadJson function
    function loadJSON( callback ) {   

        var xobj = new XMLHttpRequest();
            xobj.overrideMimeType("application/json");
        xobj.open('GET', 'scripts/pabat-croatia.min.json', false); // Replace 'my_data' with the path to your file
        xobj.onreadystatechange = function () {
              if (xobj.readyState == 4 && xobj.status == "200") {
                // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
                callback(xobj.responseText);
              }
        };
        xobj.send(null);  
    }
    function parseLodash(str){
        return _.attempt(JSON.parse.bind(null, str));
    }
    // loadJSON init
    loadJSON(function( response ) {
        // Parse JSON string into object
        //var actual_JSON = JSON.parse(response);
        //
        data = JSON.parse(response);
    });
    _.mixin({
        'sortKeysBy': function (obj, comparator) {
            var keys = _.sortBy(_.keys(obj), function (key) {
                return comparator ? comparator(obj[key], key) : key;
            });
        
            return _.zipObject(keys, _.map(keys, function (key) {
                return obj[key];
            }));
        }
    });

    function filterBy(dataset, filters, key, rejects) {
        return _.chain(dataset)
            .filter(filters)
            .reject(rejects)
            .map(function(n){return {"value": n[key]};})
            .countBy("value")
            .sortKeysBy()
            .value();
    }
    var chart1_ = filterBy(data, {'Type of value': 'Economic importance of value', 'Value' : '2', 'Question' : 'Commercial & non-commercial water use'}, 'Stakeholder', '');
    var chart1_tog = filterBy(data, {'Type of value': 'Importance of value', 'Value' : '2', 'Question' : 'Commercial & non-commercial water use'}, 'Stakeholder', '');
   
    var chart2_ = filterBy(data, {'Type of value': 'Economic importance of value', 'Question' : 'Tourism & recreation'}, 'Protected area', {'Value' : '0'});
    
    var chart3_ = filterBy(data, {'Type of value': 'Importance of value', 'Question' : 'Values related to food'}, 'Stakeholder', {'Value' : '0'});
 
    parseLodash(chart2_);

    var chart1 = c3.generate({
        bindto: '#chart1',
        data: {
            json: chart1_,
            type: 'pie',
            order: 'null'
        },
        color: {
            pattern: ['#a8216b', '#ec1b4b', '#2e9598', '#f7db6a', '#f26a44', '#467f98']
        },
        axis: {            
            x: {
                tick: {
                    values: ['']
                }
            },
            rotated: false,
        }
    });

    console.log(chart2_);

    var chart2 = c3.generate({
    bindto: '#chart2',
    data: {
        json: chart2_,
        type: 'bar',
    },
    axis: {            
        x: {
            tick: {
                values: ['']
            }
        },
        rotated: true,
    }
});

        var chart3 = c3.generate({
    bindto: '#chart3',
    data: {
        json: chart3_,
        type: 'bar',
        order: 'null'
    },
    color: {
        pattern: ['#a8216b', '#ec1b4b', '#2e9598', '#f7db6a', '#f26a44', '#467f98']
    },
    axis: {            
        x: {
            tick: {
                values: ['']
            }
        },
        rotated: true,
    }
});

  $('.bxslider').bxSlider();
  $('.click-me-1').on("click", function(){
    if( $(this).hasClass('toggled')) {       
        chart1.load({
            json: chart1_,
            unload: chart1.json
        });
        $(this).removeClass('toggled');
    } else {
        chart1.load({
            json: chart1_tog,
            unload: chart1.json
        });
        $(this).addClass('toggled');
    }
  });
});