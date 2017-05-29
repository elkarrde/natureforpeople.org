require('lodash');

data = {};

// LoadJson function
function loadJSON( callback ) {

    xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', '/static/pabat-all.json', false); // Replace 'my_data' with the path to your file
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
    //actual_JSON = JSON.parse(response);
    //
    data = JSON.parse(response);
});
_.mixin({
    'sortKeysBy': function (obj, comparator) {
        keys = _.sortBy(_.keys(obj), function (key) {
            return comparator ? comparator(obj[key], key) : key;
        });

        return _.zipObject(keys, _.map(keys, function (key) {
            return obj[key];
        }));
    }
});

function preloadData() {
    return data;
}


module.exports.timian_data = data;
