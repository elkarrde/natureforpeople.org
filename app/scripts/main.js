$(function() {
    window.onload = function() {
  scrollTo(0,0);
}
    function mapInit() {
        var width = $('.map-wrapper').width();
        var height = $(window).height();

        var projection = d3.geo.mercator()
        .center([18.23, 43.3])
        .scale([(Math.min(height,width)*0.75)*6])
        .translate([width/2,height/2]);

        var path = d3.geo.path().projection(projection);

        // Append map object to DOM element with necessary attributes
        var svg = d3.select(".map-wrapper")
        .append("svg")
        .attr('viewBox','0 0 '+Math.min(width,height) +' '+Math.min(width,height) )
        .attr('preserveAspectRatio','xMinYMin')
        .attr("width",width)
        .attr("height",height);

        d3.json("scripts/regions_simple.json", function(error, dinarides) {
            if (error) return console.error(error);

            // Draw whole topo in one path
            var other = topojson.feature(dinarides, dinarides.objects.other);

            svg.append("path")
                .datum(other)
                .attr("class", "others-all")
                .attr("d", path);

            // Separate paths by states

            svg.selectAll(".subunit")
            .data(topojson.feature(dinarides, dinarides.objects.subunits).features)
            .enter().append("path")
            .attr("class", function(d) { return "subunit " + d.id; })
            .attr("d", path);

            // Country borders
            svg.append("path")
            .datum(topojson.mesh(dinarides, dinarides.objects.subunits))
            .attr("d", path)
            .attr("class", "subunit-boundary");

            svg.append("path")
            .datum(topojson.mesh(dinarides, dinarides.objects.other))
            .attr("d", path)
            .attr("class", "others-boundary");

            // Country names

            //   svg.selectAll(".subunit-label")
            //   .data(topojson.feature(dinarides, dinarides.objects.subunits).features)
            // .enter().append("text")
            //   .attr("class", function(d) { return "subunit-label " + d.id; })
            //   .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
            //   .attr("dy", ".35em")
            //   .text(function(d) { return d.properties.name; });


            svg.selectAll('.subunit').on('click', function(country) {
                var url = country.id.toLowerCase() + ".html";
                window.location.href = url;
                //replace with pushstate in future
            });
        });

        d3.select(window).on('resize', resize);

        function resize() {
            width = $('.map-wrapper').width();
            height = $(window).height();

            projection
            .scale([(Math.min(height,width)*0.75)*6])
            .translate([width/2,height/2]);

            d3.select(".map-wrapper").attr("width",width).attr("height",height);
            d3.select(".map-wrapper svg").attr("width",width).attr("height",height);

            d3.selectAll(".map-wrapper path").attr('d', path);
        }
    }
    function navMobileCollapse() {
        // avoid having both mobile navs opened at the same time
        $('#collapsingMobileUser').on('show.bs.collapse', function () {
            $('#collapsingNavbar').removeClass('in');
            $('[data-target="#collapsingNavbar"]').attr('aria-expanded', 'false');
        });

        $('#collapsingNavbar').on('show.bs.collapse', function () {
            $('#collapsingMobileUser').removeClass('in');
            $('[data-target="#collapsingMobileUser"]').attr('aria-expanded', 'false');
        });

        // dark navbar
        $('#collapsingMobileUserInverse').on('show.bs.collapse', function () {
            $('#collapsingNavbarInverse').removeClass('in');
            $('[data-target="#collapsingNavbarInverse"]').attr('aria-expanded', 'false');
        });

        $('#collapsingNavbarInverse').on('show.bs.collapse', function () {
            $('#collapsingMobileUserInverse').removeClass('in');
            $('[data-target="#collapsingMobileUserInverse"]').attr('aria-expanded', 'false');
        });
    }

    function navSearch() {
        // hide first nav items when search is opened
        $('.nav-dropdown-search').on('show.bs.dropdown', function () {
            $(this).siblings().not('.navbar-nav .dropdown').addClass('sr-only');
        });

        // cursor focus
        $('.nav-dropdown-search').on('shown.bs.dropdown', function () {
            $('.navbar-search-input').focus();

        });

        // show all nav items when search is closed
        $('.nav-dropdown-search').on('hide.bs.dropdown', function () {
            $(this).siblings().removeClass('sr-only');
        });
    }

    function drawCharts() {
        drawDonutChart(
          '#donut39',
          $('#donut39').data('donut'),
          200,
          200,
          ".4em"
        );

        drawDonutChart(
          '#pie25',
          $('#pie25').data('donut'),
          200,
          200,
          ".4em"
        );

        drawBarChart('#chart', [7, 14]);
        animateValue("counter", 0, parseInt($('#counter').html()), 4000);

    }

    function init() {
        navMobileCollapse();
        navSearch();
        mapInit();
        drawCharts();
    }

    init();
});
