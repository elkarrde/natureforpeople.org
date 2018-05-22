$ = require("jquery");
d3 = require("d3");
c3 = require("c3");
_ = require("lodash");
slick = require("slick-carousel");
lightbox = require('lightbox2');

Isotope = require('isotope-layout');
require('isotope-packery')
var IsoParams = {
  layoutMode: 'packery',
  itemSelector: '.article-item',
  percentPosition: true
}

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
    bcs: "Izaberite"
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

function setupArticleImages() {
  let images = $('#article-single .article-image-full, #article-single .article-body img')
  images.each(function() {
    let imgSrc = $(this).attr('src')
    let imgTitle = $(this).attr('title')
    $(this).addClass('image-lightbox').wrap('<a href="' + imgSrc + '" data-lightbox="article-single" data-title="' + imgTitle + '"></a>')
  })

  lightbox.option({
    'wrapAround': true,
    'disableScrolling': false
  })
}

jQuery(window).on('load', function() {
    setupArticleImages()
})

window.iso = null;

// ---------- ON DOCUMENT LOAD ----------
jQuery(document).ready(function() {
  setGeolocation();

  if (mobilecheck()) {
    $('html').addClass('device-mobile');
  } else {
    $('html').addClass('device-desktop');
  }
  if (window.innerWidth > 640) {
    if ($('.articles-grid').length > 0) {
      iso = new Isotope('.articles-grid', IsoParams);
    }
    $('html').addClass('screen-wide');
  } else {
    $('html').addClass('screen-narrow');
  }
  $('.articles-grid').removeClass('loading');

  $('[data-article-filter]').attr('data-filter-active', 'false');
  $('[data-article-filter]').click(function() {
    let filter = $(this).attr('data-article-filter');
    let classSelector = '.' + filter;
    let attrSelector = '[data-article-filter="' + filter + '"]';

    $('.article-item').addClass('hidden');
    $(classSelector).removeClass('hidden');

    let isActive = $(this).attr('data-filter-active') !== 'false';
    if (isActive) {
      $('.article-item').removeClass('hidden');
      $(attrSelector).attr('data-filter-active', 'false');
      $(attrSelector).removeClass('active');

      if ($(this).hasClass('img-filter')) {
        $('.partners-list').slick('slickPlay');
        $('.img-filter.active').attr('data-filter-active', 'false');
        $('.img-filter.active').removeClass('active');
      } else {
        $('.partners-list').slick('slickPlay');
        $('[data-article-filter]').attr('data-filter-active', 'false');
        $('[data-article-filter]').removeClass('active');
      }
    } else {
      if ($(this).hasClass('img-filter')) {
        $('.partners-list').slick('slickPause');
        $('.img-filter.active').attr('data-filter-active', 'false');
        $('.img-filter.active').removeClass('active');
        $(this).addClass('active');
      } else {
        $('.img-filter.active').attr('data-filter-active', 'false');
        $('.img-filter.active').removeClass('active');
        $('.partners-list').slick('slickPlay');
      }
      $('[data-article-filter]').attr('data-filter-active', 'false');
      $('[data-article-filter]').removeClass('active');
      $(attrSelector).attr('data-filter-active', 'true');
      $(attrSelector).addClass('active');
    }

    try { iso.layout(); } catch(e) {}
    return false;
  })

  $('.js-expand-facts').click(function() {
    let isOpen = $(this).find('.icon').hasClass('open');
    if (isOpen) {
      $(this).find('.icon').removeClass('open').removeClass('i-folder-open').addClass('i-folder');
      $('.factsheet').addClass('hidden')
    } else {
      $(this).find('.icon').addClass('open').removeClass('i-folder').addClass('i-folder-open');
      $('.factsheet').removeClass('hidden');
    }
    return false;
  })

  makeEmailsClickable();
  setupLogoSlider();

  $('.js-sig-generate').click(function() {
    $('#signature-form form input').each(function() {
      let name = $(this).attr('name');
      let value = $(this).val().trim();
      let attr = '#' + name;
      $(attr).text(value);
      if (name === 's-email') { $(attr).attr('href', 'mailto:' + value); }
      if (value.length < 1 && !$(this).hasClass('required')) { $(attr).closest('tr').remove(); }
    })
    $('#raw .js-content [id]').removeAttr('id');
    let html = $('#raw .js-content').html();
    $('#signature textarea').val(html.trim());

    $('#signature-form').addClass('hide');
    $('#signature').removeClass('hide');
    $('#raw').removeClass('hide');
    return false;
  })
  $('.js-sig-back').click(function() {
    $('#signature-form').removeClass('hide');
    $('#signature').addClass('hide');
    $('#raw').addClass('hide');
  })

  window.addEventListener("orientationchange", function() {
    try { iso.layout(); } catch(e) {}
    setTimeout(function() {
      $('.partners-list').slick('unslick');
      setupLogoSlider();
    }, 150);
  });

  $("#homepage-view-map-btn").click(function() {
    $("html,body").animate(
      { scrollTop: $("#homepage-map").offset().top },
      "slow"
    );
  });

  if ($('#similar-articles').length) {
    fetchSimilarArticles();
  }

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
  if (window.location.pathname.split("/")[1] == "bcs") {
    $(".local-dropdown button span").html("BCS");
    return "bcs";
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
  if (locale == "bcs") {
    return "/" + locale + url;
  } else {
    return url;
  }
}

function crawlArray(array, index, step) {
  return ((index + step) % array.length + array.length) % array.length;
}

function makeEmailsClickable() {
  $('#article-single .author-content a').addClass('pink pink-hover');
}

function makeShareArticleLinks() {
  $('.social a').each(function() {
    let href = $(this).attr('href').replace(/(\.\.\/){1,}/, '')
    $(this).attr('href', href);
  })
  $('head meta[property*=":url"]').each(function() {
    let href = $(this).attr('content').replace(/(\.\.\/){1,}/, '')
    $(this).attr('content', href);
  })
}

function setupLogoSlider() {
  let maxLogos = Math.floor(window.innerWidth / 180);
  $('.partners-list').slick({
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: true,
    dots: true,
    appendArrows: $('.partners-list'),
    slidesToShow: maxLogos > 6? 6 : maxLogos,
    slidesToScroll: 1,
    swipe: true,
    swipeToSlide: true,
    pauseOnHover: true
  });
}

function fetchSimilarArticles() {
  let max = $('#tags .tag').length - 1;
  let min = 0;
  let rndItem = Math.floor(Math.random() * (max - min + 1)) + min;
  let rndTag = $('#tags .tag').eq(rndItem).text();
  let locale = determineLocale() === 'bcs'? 'bcs' : '';
  console.log('ARTICLES', rndTag)
  console.time('FETCH');
  $.get('/' + locale).done(function(res) {
    let content = $(res).find('.article-' + rndTag);
    items = [];
    content.each(function(pc) {
      if ($('#article-heading').text().trim() !== $(this).find('.title').text().trim()) {
        items.push({
          title: $(this).find('.title').html(),
          lead: $(this).find('.lead').html(),
          tags: $(this).find('.tags').html(),
          more: $(this).find('.learn-more').html(),
          moreLnk: $(this).find('.learn-more').attr('href'),
          study: $(this).find('.view-study').html(),
          studyLnk: $(this).find('.view-study').attr('href')
        });
      }
    })
    items.sort(function() { return 0.5 - Math.random() });
    let rndItems = items.splice(0, 3);
    let i = 0;
    rndItems.forEach(function(itm) {
      let out = $('.article-item-template').html();
      $('#similar-articles .articles .article-item').eq(i).find('.title').html(itm.title);
      $('#similar-articles .articles .article-item').eq(i).find('.lead').html(itm.lead);
      $('#similar-articles .articles .article-item').eq(i).find('.tags').html(itm.tags);
      if (itm.more) {
        $('#similar-articles .articles .article-item').eq(i).find('.learn-more').html(itm.more);
        $('#similar-articles .articles .article-item').eq(i).find('.learn-more').attr('href', itm.moreLnk);
      } else {
        $('#similar-articles .articles .article-item').eq(i).find('.learn-more').remove()
      }
      if (itm.study) {
        $('#similar-articles .articles .article-item').eq(i).find('.view-study').html(itm.study);
        $('#similar-articles .articles .article-item').eq(i).find('.view-study').attr('href', itm.studyLnk);
      } else {
        $('#similar-articles .articles .article-item').eq(i).find('.view-study').remove();
      }
      $('#similar-articles .articles .article-item').eq(i).removeClass('empty');
      i++;
    })
    $('#similar-articles .articles .article-item').css({display: 'block'});
    $('#similar-articles .articles .article-item [data-article-filter="article-' + rndTag + '"]').addClass('active')
    $('#similar-articles .articles .article-item a').each(function() {
      let href = $(this).attr('href');
      $(this).attr('href', href.replace(/^\.\./, ''))
    });
    console.timeEnd('FETCH');
  })
}

window.mobilecheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};
