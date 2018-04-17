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

// ---------------------------------------------------------
// Functions for manipulating graphs on Protected Areas page
// ---------------------------------------------------------

function graphRenderable(state) {
  return state.country && state.graph_type;
}

function graphId(state) {
  var graph_prefix = state.protected_area ? "pa" : "country";
  return "#" + graph_prefix + "_chart_" + state.graph_type;
}

function generatedTitle(choices, pabatData) {
  var title = null,
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
      pabatData[choices.country][choices.protected_area]["name"]
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
      _.size(_.keys(pabatData[choices.country]))
    );
  }

  return title;
}

var ProtectedAreasControl = Control.extend({
  init(element, options) {
    this.$element = $(element);
    this.countriesList = [];
    this.state = {};
    this.loadCountriesParks(() => {
      this.initCountryDropdown();
    });
    this.loadPabatData();
  },
  initCountryDropdown() {
    this.initDropdown("#graphs-country-picker", this.countriesList);
  },
  initProtectedAreasDropdown(protectedAreas) {
    this.initDropdown(
      "#graphs-pa-picker",
      protectedAreas,
      pickerText.choosePA[getLocale()]
    );
  },
  initDropdown(selector, items, title = pickerText.pleaseChoose[getLocale()]) {
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

    delete this.state.pa;
    this.state.country = code;
    this.renderGraph();
  },
  "#graphs-pa-picker [data-dropdown-container] li click": function(el) {
    const code = el.dataset.code;
    const name = el.dataset.name;

    this.$element.find("#graphs-pa-picker .btn span").text(name);
    this.state.pa = code;
    this.renderGraph();
  },
  "{document.body} click": function(el, ev) {
    const $target = $(ev.target);

    if (!this.$element.find($target).length) {
      this.$element.find("[data-dropdown-container]").hide();
    }
  },
  "[data-graphid] click": function(el) {
    this.state.graphid = el.dataset.graphid;
    this.renderGraph();
  },
  ".picker click": function(el) {
    $(el)
      .find("[data-dropdown-container]")
      .toggle();
  },
  renderGraph() {
    const country = this.state.country;
    const pa = this.state.pa;
    const graphid = this.state.graphid;

    if (country && graphid) {
      const state = {
        country,
        protected_area: pa,
        graph_type: graphid
      };

      graphs.renderGraph(this.pabatData, state, locale);
      this.$element.find(".graphs-container .pabat-chart").addClass("hide");
      this.$element.find(".no-graphs").addClass("hide");
      this.$element.find(graphId(state)).removeClass("hide");
      this.$element
        .find("#pav-graph-gen-title")
        .html(generatedTitle(state, this.pabatData))
        .removeClass("hide");
    } else {
      this.$element.find("#pav-graph-gen-title").addClass("hide");
      this.$element.find(".graphs-container .pabat-chart").addClass("hide");
      this.$element.find(".no-graphs").removeClass("hide");
    }
  },
  loadCountriesParks(doneCb) {
    dataLoader.loadJSON("/static/countries-parks.json", cp => {
      const locale = getLocale();

      cp.forEach(element => {
        this.countriesList.push({
          name: element.name[locale],
          code: element.code,
          protected_areas: element.protected_areas
        });
      });

      doneCb && doneCb();
    });
  },
  loadPabatData() {
    dataLoader.loadJSON("/static/pabat-all.json", pd => {
      this.pabatData = pd;
    });
  }
});

$(function() {
  const paContainer = document.getElementById("pa-container");
  if (paContainer) {
    new ProtectedAreasControl(paContainer);
  }
});
