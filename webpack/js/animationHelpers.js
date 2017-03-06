var animateValue = function(id, start, end, duration) {
  var range = end - start;
  var current = start;
  var factor = Math.ceil(Math.log10(Math.abs(start-end))*1000)
  var increment = end > start ? factor * 1 : factor * -1;
  var stepTime = Math.abs(Math.floor(duration / range));
  var obj = document.getElementById(id);
  if (obj !== null) {
    var timer = setInterval(function() {
      if (Math.abs(current + increment) >= Math.abs(end)){
          increment = Math.ceil(increment / factor * Math.log10(factor))
      }
      current += increment;
      obj.innerHTML = current;
      if (current == end) {
          clearInterval(timer);
      }
    }, stepTime);
  }
}

var drawBarChart = function(element, dataSet, canvasHeight, canvasWidth) {
  var canvasHeight = typeof canvasHeight !== 'undefined' ? canvasHeight : 200
  var canvasWidth = typeof canvasWidth !== 'undefined' ? canvasWidth : 200
  var heightRatio = d3.max(dataSet) / canvasHeight;

  var canvas = d3.select(element)
      .append("svg").attr("width", canvasWidth + "px")
      .attr("height", canvasHeight + "px")

  var rectWidth = canvasWidth / dataSet.length;
  var barPadding = rectWidth / 5;

  //Chart
  canvas.selectAll('rect')
      .data(dataSet)
      .enter()
      .append('rect');

  canvas.selectAll('rect')
  .attr('x', function(d,i){return i*( rectWidth );})
  .attr('y',  function(d){return canvasHeight;})
  .attr("height", function(d){return 0;})
  .attr("width", rectWidth - barPadding)
  .attr("fill", function(d){ return "rgb(0, " + Math.floor(176 - d/d3.max(dataSet) * 33 )   +", 155)"; });

  //Animate the chart
  canvas.selectAll('rect')
  .transition().duration(3000)
  .attr('y',  function(d){return canvasHeight - d/heightRatio;})
  .attr("height", function(d){return d/heightRatio;});

  // Text
  canvas.selectAll('text')
      .data(dataSet)
      .enter()
      .append('text');

  canvas.selectAll('text')
  .attr('x', function(d, i){return i*( rectWidth ) + barPadding * 2 ;})
  .attr('y', function(d, i){return canvasHeight - d/heightRatio + 20;})
  .style("text-anchor", "middle")
  .attr("font-size", "14px")
  .attr("font-weight", "600")
  .attr("fill", "#ffffff")
  .text(function(d){return d;});
}

function drawDonutChart(element, percent, width, height, text_y) {
  width = typeof width !== 'undefined' ? width : 200;
  height = typeof height !== 'undefined' ? height : 200;
  text_y = typeof text_y !== 'undefined' ? text_y : "-.10em";
  var duration   = 4000,
      transition = 400;

  var dataset = {
        lower: calcPercent(0),
        upper: calcPercent(percent)
      },
      radius = Math.min(width, height) / 2,
      pie = d3.layout.pie().sort(null),
      format = d3.format(".0%");

  var arc = d3.svg.arc()
        .innerRadius(radius - 20)
        .outerRadius(radius);

  pie.startAngle(0 * (Math.PI/180));
  pie.endAngle(360 * (Math.PI/180));

  var svg = d3.select(element).append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var path = svg.selectAll("path")
        .data(pie(dataset.lower))
        .enter().append("path")
        .attr("class", function(d, i) { return "color" + i })
        .attr("d", arc)
        .each(function(d) { this._current = d; });

  var text = svg.append("text")
        .attr("text-anchor", "middle")
        .attr("class", "donut-text")
        .attr("dy", text_y);

  if (typeof(percent) === "string") {
    text.text(percent);
  }
  else {
    var progress = 0;
    var timeout = setTimeout(function () {
      clearTimeout(timeout);
      path = path.data(pie(dataset.upper));
      path.transition().duration(duration).attrTween("d", function (a) {

        var i  = d3.interpolate(this._current, a);
        var i2 = d3.interpolate(progress, percent)
        this._current = i(0);
        return function(t) {
          text.text( format(i2(t) / 100) );
          return arc(i(t));
        };
      });
    }, 1000);
  }
};

function calcPercent(percent) {
  return [percent, 100-percent];
};

module.exports.animateValue = animateValue;
module.exports.drawBarChart = drawBarChart;
module.exports.drawDonutChart = drawDonutChart;
