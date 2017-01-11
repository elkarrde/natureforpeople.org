function drawBarChart(element, dataSet, canvasHeight, canvasWidth) {
  var canvasHeight = typeof canvasHeight !== 'undefined' ? canvasHeight : 200
  var canvasWidth = typeof canvasWidth !== 'undefined' ? canvasWidth : 200
  var heightRatio = d3.max(dataSet) / canvasHeight;

  var canvas = d3.select(element)
      .append("svg").attr("width", canvasWidth + "px")
      .attr("height", canvasHeight + "px")

  var rectWidth = canvas.style("width").replace("px", "") / dataSet.length;
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
  .attr("fill", function(d){ return "rgb(0, " + Math.floor(150 - d/d3.max(dataSet) * 75 )   +", 214)"; });

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
  .attr('x', function(d,i){return i*( rectWidth ) + barPadding * 2 ;}) 
  .attr('y',  function(d, i){return canvasHeight - d/heightRatio + 20;})
  .style("text-anchor", "middle")
  .attr("font-size", "14px")
  .attr("font-weight", "600")
  .attr("fill", "#ffffff")
  .text(function(d){return d;});
}