require("./areaTemplates");

function getLocale() {
  var locale;
  if (window.location.href.indexOf("/hr/") > -1) {
    locale = "hr";
  } else {
    locale = "en";
  }
  return locale;
}

function countryDropdown() {
  dataLoader.loadJSON("/static/countries-parks.json", function(cp) {
    var countriesList = [];
    let countries = cp;
    let locale = getLocale();
    countries.forEach(function(element) {
      countriesList.push(element.name[locale]);
    });
    $("#graphs-country-picker").generateDropdown(countriesList, printSwag);
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
        .append("<li data-name='" + item + "'><a>" + item + "</a></li>");
    });
    this.on("click", "li", callback);
    this.on("click", (this, "button"), function(event) {
      if (event.currentTarget === event.target) {
        root.find("ul").toggle();
      }
    });
    return this;
  };
})(jQuery);

function printSwag() {
  console.log(this);
}

countryDropdown();

// DEPRECATED VUE STUFF
/*
Vue = require("vue");


pabat_data = null;
graph_types = null;
countries = null;
store = null;

store = {
  debug: true,
  state: {
    country: null,
    protected_area: null,
    graph_type: null
  },
  setState: function(prop, newValue) {
    if (prop == "country") {
      this.state.protected_area = null;
    }
    if (prop == "graph_type") {
      $(".graph-card").removeClass("active");
      $("#graph-card-" + newValue.code).addClass("active");
    }
    this.state[prop] = newValue;
    renderGraph(this);
  },
  toChoice: function() {
    return {
      country: this.state.country["code"],
      protected_area:
        this.state.protected_area && this.state.protected_area["code"],
      graph_type: this.state["graph_type"]["code"]
    };
  }
};

var Dropdown = Vue.extend({
  template: pickerTemplate,
  filters: {
    localize: function(value) {
      return value[this.locale];
    }
  },
  methods: {
    pick: function(picked, code, event) {
      var selected = _.first(_.filter(this.choices, { code: code }));
      this.picked = picked[this.locale];
      this.shared.setState(this.prop_name, selected);
    }
  }
});

dataLoader.loadJSON("/static/pabat-all.json", function(pd) {
  pabat_data = pd;
});

dataLoader.loadJSON("/static/graph-types.json", function(gt) {
  graph_types = gt;

  dataLoader.loadJSON("/static/countries-parks.json", function(cp) {
    countries = cp;

    new Dropdown({
      el: "#graphs-country-picker",
      data: function() {
        return {
          toggled: false,
          picked: translations.default_choice[locale],
          shared: store,
          prop_name: "country",
          choices: countries,
          locale: locale
        };
      },
      computed: {
        pickedText: function() {
          return this.picked;
        }
      }
    });

    new Dropdown({
      el: "#graphs-pa-picker",
      data: function() {
        return {
          toggled: false,
          picked: "-",
          shared: store,
          prop_name: "protected_area",
          locale: locale
        };
      },
      computed: {
        choices: function() {
          var country = this.shared.state.country;
          return (country && country.protected_areas) || [];
        },

        pickedText: function() {
          var pa = this.shared.state[this.prop_name];
          return pa ? this.picked : "-";
        }
      }
    });

    new Dropdown({
      el: "#graphs-type-picker-narrow",
      data: function() {
        return {
          toggled: false,
          picked: translations.default_choice[locale],
          shared: store,
          prop_name: "graph_type",
          choices: graph_types,
          locale: locale
        };
      },
      computed: {
        pickedText: function() {
          return this.picked;
        }
      }
    });
  });
});

// ---------------------------------------------------------
// Functions for manipulating graphs on Protected Areas page
// ---------------------------------------------------------

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
  var graph_prefix = !!store.state.protected_area ? "pa" : "country";
  return "#" + graph_prefix + "_chart_" + store.state.graph_type.code;
}

function generatedTitle() {
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
$(document).ready(function() {
  $("body").on("click", ".country-picker", function() {
    $(this)
      .children("ul")
      .toggle();
  });
});
*/
