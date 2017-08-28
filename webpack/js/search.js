$(document).ready(function() {
    $("#searchForm").on("submit", function(event) {
        var c1= "true";
        var c2= "true";
        var c3= "true";
        var c4= "true";
        var c5= "true";
        $.ajax({
            data : {
                c1 : c1,
                c2 : c2,
                c3 : c3,
                c4 : c4,
                c5 : c5,
                size : 1000,
                adTerms : ($(".searchForm___input").val()),
                minScore : 0.1,
                countryName : "croatia" //hardcoded will need a dropdown
            },
            type : "POST",
            url : "http://127.0.0.1:3000/search" //lolcal dev environment
        })
        .done(function(data) {
            var total = data.results.length;
            $(".searchForm___total").html(`Total ${total} search results`)
            $(".searchForm___results").html("")
            data.results.forEach(function(element) {
                $(".searchForm___results").append(
                    `<div class="sm-col-10 mx-auto px2 mb4">
                        <div>
                            <div class="border-bottom border-grey-light pb3 my2">
                                <h4 class="h4">${element.title}</h4>
                                <p>
                                    ${(element.keywords).join()}
                                </p>
                                <div class="py1 grey">
                                    <div class="inline-block mr1"><span class="bold">Author:</span> Austin Wright</div>
                                    <div class="inline-block mr1"><span class="bold">Date:</span> July 17th, 2017</div>
                                    <div class="inline-block mr1"><span class="bold">Category:</span> Sustainable business</div>
                                    <div class="inline-block mr1"><span class="bold">Size:</span> 10 MB</div>
                                </div>

                                <a href="${element.url}" class="inline-block mt2 bg-si-green bg-si-green-dark-hover white bold h6 p2">Download document</a>
                            </div>
                        </div>
                    </div>`  
                )
            });
        });
        event.preventDefault();
    });
});