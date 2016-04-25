(function() {
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

	// loadJSON init
	loadJSON(function( response ) {
		// Parse JSON string into object
		//var actual_JSON = JSON.parse(response);
		data = JSON.parse(response);
	});
	
	function filterBy(dataset, filters, key) {
		return _.chain(dataset).filter(filters).map(function(n){return {type: n[key]};}).countBy('type').toPairs().value();
	}
	var arr = filterBy(data, {'Type of value': 'Economic importance of value', 'Value' : '2', 'Question' : 'Commercial & non-commercial water use'}, 'Stakeholder');
	var brr = filterBy(data, {'Type of value': 'Importance of value', 'Value' : '2', 'Question' : 'Commercial & non-commercial water use'}, 'Stakeholder');
	// _.chain(data)
	// .filter({'Type of value': 'Economic importance of value', 'Value' : '2', "Question" : "Commercial & non-commercial water use" })
	// .map(function(n) {
	// 	return { // return what new object will look like
 //        	stakeholder: n.Stakeholder
 //    	};
	// })
	// .countBy("stakeholder")
	// .toPairs()
	// .value();

	var chart = c3.generate({
	    data: {
            columns: arr,
            type: 'bar',
        },
        color: {
	        pattern: ['#a8216b', '#ec1b4b', '#2e9598', '#f7db6a', '#f26a44', '#467f98']
	    },
	    axis: {
	    	x:{
	    		type: 'stakehoder'
	    	},
	        rotated: true
	    }
	});

	document.getElementById("click-me").onclick = function() {
		chart.load({
	        columns: brr,
	        unload: chart.columns
	    });
	};
})();