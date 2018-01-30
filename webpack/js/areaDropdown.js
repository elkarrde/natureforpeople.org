require("./areaTemplates");
const Control = require("can-control");

function getLocale() {
  var locale;
  if (window.location.href.indexOf("/hr/") > -1) {
    locale = "hr";
  } else {
    locale = "en";
  }
  return locale;
}

var areasData;

function countryDropdown() {
  dataLoader.loadJSON("/static/countries-parks.json", function(cp) {
    var countriesList = [];
    areasData = cp;
    let locale = getLocale();
    areasData.forEach(function(element) {
      countriesList.push({ name: element.name[locale], code: element.code });
    });
    $("#graphs-country-picker").generateDropdown(countriesList, selectCountry);
  });
}

(function($) {
  $.fn.generateDropdown = function(itemList, callback, options) {
    var root = this;
    var settings = $.extend({}, options);
    this.append(
      "<ul class='z2 m0 absolute bg-hr-blue list-reset' style='display:none'></ul>"
    );
    itemList.forEach(function(item) {
      root
        .find("ul")
        .append(
          "<li data-name='" +
            item.name +
            "' data-code='" +
            item.code +
            "' ><a href='javascript://'>" +
            item.name +
            "</a></li>"
        );
    });
    this.on("click", "li", callback);
    this.on("click", (this, "button"), function(event) {
      event.preventDefault();
      if (event.currentTarget === event.target) {
        root.find("ul").toggle();
      }
    });
    return this;
  };
})(jQuery);

function selectCountry() {
  let country = this.dataset.name;
  let code = this.dataset.code;
  $(this)
    .closest("div")
    .find(".btn span")
    .text(country);
  $(this)
    .closest("ul")
    .toggle();

  let paList = [];
  let locale = getLocale();

  areasData.forEach(function(element) {
    if (element.code === code) {
      element.protected_areas.forEach(function(paItem) {
        paList.push({ name: paItem.name[locale], code: paItem.code });
      });
      return false;
    }
  });
  $("#graphs-pa-picker").generateDropdown(paList, printSwag);
  $("#graphs-pa-picker .btn span").text("Choose PA");
}
ƒ;
var ProtectedAreasControl = Control.extend({
  init(element, options) {
    this.$element = $(element);
    this.countriesList = [];
    this.state = {};
    this.loadCountriesParks();
  },
  initCountryDropdown() {
    this.initDropdown("#graphs-country-picker", this.countriesList);
  },
  initProtectedAreasDropdown(protectedAreas) {
    this.initDropdown("#graphs-pa-picker", protectedAreas, "Choose PA");
  },
  initDropdown(selector, items, title = "Please Choose") {
    const $el = this.$element.find(selector);

    $el.find("[data-dropdown-container]").remove();

    $el.append(
      "<ul class='z2 m0 absolute bg-hr-blue list-reset' data-dropdown-container style='display:none'></ul>"
    );

    const $container = $el.find("[data-dropdown-container]");

    items.forEach(function(item) {
      $container.append(
        "<li data-name='" +
          item.name +
          "' data-code='" +
          item.code +
          "' ><a href='javascript://'>" +
          item.name +
          "</a></li>"
      );
    });

    $el.find(".btn span").text(title);
  },
  "#graphs-country-picker [data-dropdown-container] li click": function(el) {
    const code = el.dataset.code;
    const name = el.dataset.name;
    const locale = getLocale();

    let protectedAreas = [];

    this.countriesList.forEach(function(element) {
      if (element.code === code) {
        element.protected_areas.forEach(function(paItem) {
          protectedAreas.push({
            name: paItem.name[locale],
            code: paItem.code
          });
        });
        return false;
      }
    });

    this.initProtectedAreasDropdown(protectedAreas);
    this.$element.find("#graphs-country-picker .btn span").text(name);
    this.state = { country: code };
  },
  "#graphs-pa-picker [data-dropdown-container] li click": function(el) {
    const code = el.dataset.code;
    const name = el.dataset.name;

    this.$element.find("#graphs-pa-picker .btn span").text(name);
    this.state.pa = code;
  },
  "{document.body} click": function(el, ev) {
    const $target = $(ev.target);

    if (!this.$element.find($target).length) {
      this.$element.find("[data-dropdown-container]").hide();
    }
  },
  "[data-graphid] click": function(el) {
    const country = this.state.country;
    const pa = this.state.pa;
    const graphid = el.dataset.graphid;

    if (country && pa && graphid) {
      const state = {
        country,
        protected_area: pa,
        graph_type: graphid
      };
      renderGraph({
        state,
        toChoice: function() {
          return state;
        }
      });
    }
  },
  ".picker click": function(el) {
    $(el)
      .find("[data-dropdown-container]")
      .toggle();
  },
  loadCountriesParks() {
    dataLoader.loadJSON("/static/countries-parks.json", cp => {
      const locale = getLocale();

      cp.forEach(element => {
        this.countriesList.push({
          name: element.name[locale],
          code: element.code,
          protected_areas: element.protected_areas
        });
      });

      this.initCountryDropdown();
    });
  }
});

$(function() {
  new ProtectedAreasControl(document.getElementById("pa-pickers"));
});

// ---------------------------------------------------------
// Functions for manipulating graphs on Protected Areas page
// ---------------------------------------------------------

var pabat_data;

dataLoader.loadJSON("/static/pabat-all.json", function(pd) {
  pabat_data = pd;
});

function renderGraph(store) {
  if (!graphRenderable(store)) {
    $(".graphs-container .pabat-chart").addClass("hide");
    $(".no-graphs").removeClass("hide");
  } else {
    graphs.renderGraph(pabat_data, store.toChoice(), locale);
    $(".graphs-container .pabat-chart").addClass("hide");
    $(".no-graphs").addClass("hide");
    $(graphId(store)).removeClass("hide");
    $("#pav-graph-gen-title")
      .html(generatedTitle(store))
      .removeClass("hide");
  }
}

function graphRenderable(store) {
  return store.state.country && store.state.graph_type;
}

function graphId(store) {
  var graph_prefix = store.state.protected_area ? "pa" : "country";
  return "#" + graph_prefix + "_chart_" + store.state.graph_type;
}

function generatedTitle(store) {
  var title = null,
    choices = store.toChoice(),
    templates = countryTemplates,
    graph_type_name = graphNameTemplates,
    countries = countriesList;

  if (choices.protected_area) {
    title = (" " + templates.country_with_pa[locale]).slice(1);
    title = title.replace(
      "{VALUE}",
      graph_type_name[locale][choices.graph_type]
    );
    title = title.replace(
      "{PA}",
      pabat_data[choices.country][choices.protected_area]["name"]
    );
  } else {
    title = (" " + templates.country[locale]).slice(1);
    title = title.replace(
      "{VALUE}",
      graph_type_name[locale][choices.graph_type]
    );
    title = title.replace("{COUNTRY}", countries[choices.country][locale]);
    title = title.replace(
      "{PA_CNT}",
      _.size(_.keys(pabat_data[choices.country]))
    );
  }

  return title;
}
