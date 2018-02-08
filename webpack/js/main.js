$ = require("jquery");
d3 = require("d3");
c3 = require("c3");
_ = require("lodash");

jQuery = $;

animationHelpers = require("./navigation");
animationHelpers = require("./animationHelpers");
dataLoader = require("./dataLoader");
graphs = require("./graphs");

require("./modal.js");
require("./search.js");
require("./dropdown.js");
require("waypoints/lib/jquery.waypoints");
require("./areaDropdown");

translations = {
  default_choice: {
    en: "Please choose",
    hr: "Izaberite"
  }
};

geolocation = null;
locale = determineLocale();

countriesOrder = ["si", "hr", "ba", "rs", "xk", "me", "al", "mk"];
currentCountry = randomElement(countriesOrder);

function instWaypoint(id, method) {
  new window.Waypoint({
    element: document.getElementById(id),
    handler: function(direction) {
      animationHelpers.drawDonutChart(
        "#" + id,
        $("#" + id).data(method),
        200,
        200,
        ".4em"
      );
      this.destroy();
    },
    offset: "right-in-view"
  });
}

jQuery(document).ready(function() {
  setGeolocation();

  $("#homepage-view-map-btn").click(function() {
    $("html,body").animate(
      { scrollTop: $("#homepage-map").offset().top },
      "slow"
    );
  });

  if ($("#bosnia-fact-1")[0]) {
    instWaypoint("bosnia-fact-1", "percent");

    instWaypoint("bosnia-fact-4", "percent");
  }
  if ($("#croatia-fact-1")[0]) {
    instWaypoint("croatia-fact-2", "bars");

    instWaypoint("croatia-fact-3", "percent");

    instWaypoint("croatia-fact-4", "percent");
  }
  if ($("#montenegro-fact-1")[0]) {
    instWaypoint("montenegro-fact-5", "percent");

    instWaypoint("montenegro-fact-7", "percent");
  }
  if ($("#homepage-fact-graph-1")[0]) {
    instWaypoint("homepage-fact-graph-1", "donut");

    instWaypoint("homepage-fact-graph-3", "donut");
  }

  $("#homepage-map .country").click(function() {
    panToCountry(this);
  });

  $("#homepage-map-desc .country-prev").click(function() {
    currentCountry =
      countriesOrder[
        crawlArray(countriesOrder, countriesOrder.indexOf(currentCountry), -1)
      ];
    $("#homepage-map ." + currentCountry).click();
  });

  $("#homepage-map-desc .country-next").click(function() {
    currentCountry =
      countriesOrder[
        crawlArray(countriesOrder, countriesOrder.indexOf(currentCountry), 1)
      ];
    $("#homepage-map ." + currentCountry).click();
  });

  $(document).keyup(function(e) {
    if (e.which === 37) {
      currentCountry =
        countriesOrder[
          crawlArray(countriesOrder, countriesOrder.indexOf(currentCountry), -1)
        ];
      $("#homepage-map ." + currentCountry).click();
    } else if (e.which === 39) {
      currentCountry =
        countriesOrder[
          crawlArray(countriesOrder, countriesOrder.indexOf(currentCountry), 1)
        ];
      $("#homepage-map ." + currentCountry).click();
    }
  });

  // initialize modals
  $('[data-toggle="modal"]').modal();
});

// ------------------------------------------------------
// Functions for manipulating the map on the landing page
// ------------------------------------------------------

function panToViewBox(vpx, vpy) {
  var svg = d3.select(".map-wrapper svg");
  panMapToPoint(svg, vpx, vpy);
}

function panToCountry(country) {
  var svg = d3.select("#homepage-map"),
    currentViewBox = svg[0][0].viewBox.baseVal,
    country_group = d3.select(country),
    country_node = country_group.node(),
    vpx = country_node.getAttribute("mydata:vpx"),
    vpy = country_node.getAttribute("mydata:vpy");

  switchCountry.call(window, country_node);
  d3.selectAll("svg .country").style("opacity", 1);
  country_group.style("opacity", 0.5);
  panMapToPoint(svg, vpx, vpy);
}

function switchCountry(country_node) {
  [country_name, country_btn, country_url] = countryInfo(country_node);
  $("#homepage-map-desc h2").html(country_name);
  $("#homepage-map-desc a").html(country_btn);
  $("#homepage-map-desc a").attr("href", country_url);
}

function countryInfo(country_node) {
  var $c = $(country_node),
    country_name = $c.attr("mydata:country_name"),
    country_btn = $c.attr("mydata:country_btn"),
    country_url = $c.attr("mydata:country_url");

  return [country_name, country_btn, localizedUrl(country_url, locale)];
}

function panMapToPoint(svg, x, y) {
  var $svg = $(d3.select("#homepage-map")[0]),
    x = parseInt(x, 10),
    y = parseInt(y, 10),
    w = $svg.width(),
    h = $svg.height(),
    vb = parseViewBox($svg.attr("viewBox"));

  var real_x = x * (w / vb.w),
    real_y = y * (h / vb.h);

  svg.style(
    "transform",
    "translate3d(" + real_x * -1 + "px, " + real_y * -1 + "px, 0.1px)"
  );
}

function parseViewBox(viewBoxStr) {
  var vbAttrs = viewBoxStr.split(" ").map(function(istr) {
    return parseInt(istr, 10);
  });
  return { w: vbAttrs[2], h: vbAttrs[3] };
}

function parseDataSet(bars) {
  if (!bars) {
    return;
  }
  return _.map(bars.split(","), function(num) {
    return parseInt(num, 10);
  });
}

function determineLocale() {
  if (window.location.pathname.split("/")[1] == "hr") {
    $(".local-dropdown button span").html("HR");
    return "hr";
  } else {
    $(".local-dropdown button span").html("EN");
    return "en";
  }
}

function setGeolocation() {
  $.getJSON(
    {
      url:
        "https://eu-js-geolocation.appspot.com/api/geolocation?format=jsonp&callback=?",
      dataType: "jsonp"
    },
    function(json) {
      geolocation = json;
      var currentCountry = json.country.toLowerCase();
      var $country = $("." + currentCountry);
      switchCountry($country);
    }
  );
}

function randomElement(array) {
  var idx = Math.floor(Math.random() * array.length);
  return array[idx];
}

function localizedUrl(url, locale) {
  if (locale == "hr") {
    return "/" + locale + url;
  } else {
    return url;
  }
}

function crawlArray(array, index, step) {
  return ((index + step) % array.length + array.length) % array.length;
}
