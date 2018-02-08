categories = [];

$(document).ready(function() {
  $("#searchForm").on("submit", function(event) {
    if ($(".searchForm___input").val() === "" && categories.length == 0) {
      $(
        ".searchForm___results, .searchForm__navigation, .searchForm___total"
      ).html("");
      $(".searchForm___results").append(
        '<p class="sm-col-10 mx-auto px2 mb4">You must select at least one filter or write one query!'
      );
      return false;
    }
    requestData(1);
    event.preventDefault();
  });
});

function requestData(page) {
  $.ajax({
    data: getParams(page),
    type: "GET",
    url: process.env.KB_URL + "/search" //lolcal dev environment
  }).done(function(data) {
    var total = `Total ${data.total_entries} search results`;
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
    filters: categories,
    limit: limit,
    page: page,
    adTerms: adTerms,
    minScore: minScore,
    countryName: countryName
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
                            <div class="inline-block mr1"><span class="bold">Author:</span> ${
                              element.author
                            }</div>
                            <div class="inline-block mr1"><span class="bold">Country:</span> ${
                              element.country
                            }</div>
                            <div class="inline-block mr1"><span class="bold">Page Count:</span> ${
                              element.page_count
                            }</div>
                            <div class="inline-block mr1"><span class="bold">Size:</span> ${
                              element.file_size
                            }</div>
                        </div>
                        <div class="py1 grey">
                            <span class="bold">Keywords:</span> ${
                              element.keywords
                            }
                        </div>
                        <a href="${
                          element.url
                        }" class="inline-block mt2 bg-si-green bg-si-green-dark-hover white bold h6 p2">Download document</a>
                    </div>
                </div>
            </div>`
    );
  });
  if (results.page_number != 1) {
    $(".searchForm__navigation").append(`
            <a href="#" id="prev-btn" class="inline-block mt2 bg-si-green bg-si-green-dark-hover white bold h6 p2">
                Back
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
                Back
            </a>
        `);
    $("#prev-btn").click(function(e) {
      e.preventDefault();
    });
  }
  if (results.page_number < results.total_pages) {
    $(".searchForm__navigation").append(`
            <a href="#" id="next-btn" class="inline-block mt2 bg-si-green bg-si-green-dark-hover white bold h6 p2">
                Next
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
                Next
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