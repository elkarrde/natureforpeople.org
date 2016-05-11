$(function() {
  "use strict";
    var wp1 = new Waypoint({
      element: document.getElementById('wp-1'),
      handler: function(direction) {
        if(direction == 'down' && !this.element.classList.contains('animated')) this.element.className += ' animated';
      },
      offset: 600
    });
    var wp2 = new Waypoint({
      element: document.getElementById('wp-2'),
      handler: function(direction) {
        if(direction == 'down' && !this.element.classList.contains('animated')) this.element.className += ' animated';
      },
      offset: 600
    });
    var wp3 = new Waypoint({
      element: document.getElementById('wp-3'),
      handler: function(direction) {
        if(direction == 'down' && !this.element.classList.contains('animated')) this.element.className += ' animated';
      },
      offset: 600
    });
    var wp4 = new Waypoint({
      element: document.getElementById('wp-4'),
      handler: function(direction) {
        if(direction == 'down' && !this.element.classList.contains('animated')) this.element.className += ' animated';
      },
      offset: 600
    });
    var wp5 = new Waypoint({
      element: document.getElementById('wp-5'),
      handler: function(direction) {
        if(direction == 'down' && !this.element.classList.contains('animated')) this.element.className += ' animated';
      },
      offset: 400
    });
    var wp6 = new Waypoint({
      element: document.getElementById('wp-6'),
      handler: function(direction) {
        if(direction == 'down' && !this.element.classList.contains('animated')) this.element.className += ' animated';
      },
      offset: 400
    });
    var wp7 = new Waypoint({
      element: document.getElementById('wp-7'),
      handler: function(direction) {
        if(direction == 'down' && !this.element.classList.contains('animated')) this.element.className += ' animated';
      },
      offset: 400
    });
    var wp8 = new Waypoint({
      element: document.getElementById('wp-8'),
      handler: function(direction) {
        if(direction == 'down' && !this.element.classList.contains('animated')) this.element.className += ' animated';
      },
      offset: 400
    });
    var wp9 = new Waypoint({
      element: document.getElementById('wp-9'),
      handler: function(direction) {
        if(direction == 'down' && !this.element.classList.contains('animated')) this.element.className += ' animated';
      },
      offset: 400
    });
});