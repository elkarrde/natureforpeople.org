categories = [];

const translation = {
  noEmpty: {
    hr: "Morate upisati barem jedan pojam za pretragu!",
    en: "You must enter at least one query to search!"
  },
  totalResults: {
    hr: "rezultata",
    en: "results"
  },
  downloadDocument: {
    hr: "Preuzimanje dokumenta",
    en: "Download document"
  },
  author: {
    hr: "Autor",
    en: "Author"
  },
  size: {
    hr: "Veličina",
    en: "Size"
  },
  pageCount: {
    hr: "Br. Stranica",
    en: "Page Count"
  },
  country: {
    hr: "Država",
    en: "Country"
  },
  keywords: {
    hr: "Ključne riječi",
    en: "Keywords"
  },
  back: {
    hr: "Natrag",
    en: "Back"
  },
  next: {
    hr: "Naprijed",
    en: "Next"
  }
};

function getLocale() {
  var locale;
  if (window.location.href.indexOf("/hr/") > -1) {
    locale = "hr";
  } else {
    locale = "en";
  }
  return locale;
}

$(document).ready(function() {
  $("#searchForm").on("submit", function(event) {
    if ($(".searchForm___input").val() === "" && categories.length == 0) {
      $(
        ".searchForm___results, .searchForm__navigation, .searchForm___total"
      ).html("");
      $(".searchForm___results").append(
        '<p class="sm-col-10 mx-auto px2 mb4 center">' +
          translation.noEmpty[getLocale()] +
          "</p>"
      );
      return false;
    }
    requestData(1);
    event.preventDefault();
  });

  $('#search-bar').on("submit", function(event) {
      $('#search-bar .response').addClass('hidden');
      let query = $('#search-bar .input-query').val();
      let queryParam = $('#search-bar .input-query').attr('name');
      let lang = $('#search-bar .input-lang').val();
      let langParam = $('#search-bar .input-lang').attr('name');
      let route = $('#search-bar form').attr('action');

      let qryData = {};
      qryData[queryParam] = query.trim();
      qryData[langParam] = lang;

      if (query.trim().length > 1) {
        $.ajax({
          data: qryData,
          type: "GET",
          url: process.env.KB_URL + route
        }).done(function(data) {
          if (data.pagination.total_entries > 0) {
            $('.article-item').addClass('hidden')
            data.data.forEach(function(itm) {
              $('.article-item a.btn-learn-more[href*="' + itm.slug + '""]').closest('.article-item').removeClass('hidden')
            });
            setTimeout(function() { iso.layout(); }, 300);
          } else {
            $('#search-bar .response').removeClass('hidden');
            $('.article-item').removeClass('hidden');
            iso.layout();
          }
        });
      } else {
        $('.article-item').removeClass('hidden');
        iso.layout();
      }

      return false;
  });
});

function requestData(page) {
  $.ajax({
    data: getParams(page),
    type: "GET",
    url: "https://n4p-knowledgebase.herokuapp.com/api/search/articles" //lolcal dev environment
  }).done(function(data) {
    var total =
      data.pagination.total_entries + " " + translation.totalResults[getLocale()];
    $(".searchForm___total").html(total);
    if (data.total_entries == 0) {
      $(".no-results-block").removeClass("hide");
      $(".searchForm__navigation").addClass("hide");
      $(".searchForm___total").addClass("hide");
    } else {
      $(".no-results-block").addClass("hide");
      $(".searchForm__navigation").removeClass("hide");
      $(".searchForm___total").removeClass("hide");
    }
    drawResults(data);
  });
}

suggestedSearch = function(element) {
  $(".searchForm___input").val(element.text);
  $(".btn-blue-current").each(function() {
    this.classList.remove("btn-blue-current");
  });
  $(element).toggleClass("btn-blue-current");
  requestData(1);
};

function getParams(page) {
  var limit = 5;
  var adTerms = $(".searchForm___input").val();
  var minScore = 0;
  var countryName = $("#selected-country")
    .attr("data-value")
    .substr(1);

  return {
    page_size: limit,
    page: page,
    search_terms: adTerms,
    country_name: countryName
  };
}

/// WIP
function categoryLink(keyword) {
  event.preventDefault();
  categories = [keyword];
  $("#searchForm").submit();
}

function drawResults(results) {
  $(".searchForm___results, .searchForm__navigation").html("");
  results.data.forEach(element => {
    $(".searchForm___results").append(
      `<div class="sm-col-10 mx-auto px2 mb4">
                <div>
                    <div class="border-bottom border-grey-light pb3 my2">
                        <h4 class="h4">${element.title}</h4>
                        <p>
                            ${element.summary}
                        </p>
                        <div class="py1 grey">
                            <div class="inline-block mr1"><span class="bold">${ translation.author[getLocale()] }:</span> ${
                              element.author? element.author : '&ndash;'
                            }</div>
                            <div class="inline-block mr1"><span class="bold">${ translation.country[getLocale()] }:</span> ${
                              element.country? element.country : '&ndash;'
                            }</div>
                            <div class="inline-block mr1"><span class="bold">${ translation.pageCount[getLocale()] }:</span> ${
                              element.page_count
                            }</div>
                            <div class="inline-block mr1"><span class="bold">${ translation.size[getLocale()] }:</span> ${
                              element.file_size
                            }</div>
                        </div>
                        <div class="py1 grey">
                            <span class="bold">${ translation.keywords[getLocale()] }:</span> ${
                              element.keywords
                            }
                        </div>
                        <a href="${
                          element.url
                        }" class="inline-block mt2 bg-si-green bg-si-green-dark-hover white bold h6 p2">
                        ${translation.downloadDocument[getLocale()]}
                        </a>
                    </div>
                </div>
            </div>`
    );
  });
  if (results.page_number != 1) {
    $(".searchForm__navigation").append(`
            <a href="#" id="prev-btn" class="inline-block mt2 bg-si-green bg-si-green-dark-hover white bold h6 p2">
                ${translation.back[getLocale()]}
            </a>
        `);
    $("#prev-btn").click(function(e) {
      e.preventDefault();
      requestData(results.page_number - 1);
      $("html,body").animate({ scrollTop: 600 }, 400);
    });
  } else {
    $(".searchForm__navigation").append(`
            <a href="#" id="prev-btn" class="inline-block mt2 bg-silver white bold h6 p2 not-allowed">
                ${translation.back[getLocale()]}
            </a>
        `);
    $("#prev-btn").click(function(e) {
      e.preventDefault();
    });
  }
  if (results.page_number < results.total_pages) {
    $(".searchForm__navigation").append(`
            <a href="#" id="next-btn" class="inline-block mt2 bg-si-green bg-si-green-dark-hover white bold h6 p2">
                ${translation.next[getLocale()]}
            </a>
        `);
    $("#next-btn").click(function(e) {
      e.preventDefault();
      requestData(results.page_number + 1);
      $("html,body").animate({ scrollTop: 600 }, 400);
    });
  } else {
    $(".searchForm__navigation").append(`
            <a href="#" id="next-btn" class="inline-block mt2 bg-silver white bold h6 p2 not-allowed">
                ${translation.next[getLocale()]}
            </a>
        `);
    $("#next-btn").click(function(e) {
      e.preventDefault();
    });
  }
}

$("#selected-country").on("click", function(e) {
  e.stopPropagation();
  $("#country-dropdown").show();
});

$("body").on("click", "#country-dropdown li", function() {
  $("#selected-country").html(this.innerHTML);
  $("#selected-country").attr("data-value", this.getAttribute("data-value"));
  if ($(".searchForm___input").val() != "") {
    requestData(1);
  }
});

$(document).click(function(e) {
  if ($("#country-dropdown").is(":visible")) {
    $("#country-dropdown").hide();
  }
});
