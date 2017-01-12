function animateValue(id, start, end, duration) {
    var range = end - start;
    var current = start;
    var factor = Math.ceil(Math.log10(Math.abs(start-end))*1000)
    var increment = end > start ? factor * 1 : factor * -1;
    var stepTime = Math.abs(Math.floor(duration / range));
    var obj = document.getElementById(id);
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
