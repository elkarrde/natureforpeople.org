$(function() {
    /**
     * Init map (Dinarides for now)
     */
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

        d3.json("scripts/dinarides.json", function(error, dinarides) {
            if (error) return console.error(error);

            // Whole region in one path
            // var subunits = topojson.feature(dinarides, dinarides.objects.subunits);

            // svg.append("path")
            //     .datum(subunits)
            //     .attr("d", path);

            // Separate states
            svg.selectAll(".subunit")
                .data(topojson.feature(dinarides, dinarides.objects.subunits).features)
                .enter().append("path")
                .attr("class", function(d) { return "subunit " + d.id; })
                .attr("d", path);

            // Borders
            svg.append("path")
                .datum(topojson.mesh(dinarides, dinarides.objects.subunits, function(a, b) { return a !== b; }))
                .attr("d", path)
                .attr("class", "subunit-boundary");

            svg.selectAll('.subunit').on('click', function(country) {
                window.history.pushState({url: "" + country.id + ".html"}, country.id, country.id+'.html');
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
            d3.select("svg").attr("width",width).attr("height",height);

            d3.selectAll("path").attr('d', path);
        }
    }

    function changeURL() {
        $('.subunit').on('click', function(){
            console.log('test');
        });
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

    function init() {
        navMobileCollapse();
        navSearch();
        mapInit();
        changeURL();
    }

    init();
});