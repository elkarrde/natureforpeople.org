$(document).ready(function() {
    $("#searchForm").on("submit", function(event) {
        $.ajax({
            data : getParams(),
            type : "POST",
            url : "http://127.0.0.1:3000/search" //lolcal dev environment
        })
        .done(function(data) {
            var total = `Total ${data.results.length} search results`;
            $(".searchForm___total").html(total)
            $(".searchForm___results").html("")
            drawResults(data.results)
        });
        event.preventDefault();
    });
});

suggestedSearch = function(element){
    $(".searchForm___input").val(element.text);
    $("#searchForm").submit();
}

function getParams(){
    var categories = [true, true, true, true, true];
    var size = 1000;
    var adTerms = ($(".searchForm___input").val());
    var minScore = 0.1
    var countryName = "croatia"
    
    return {
        c1: categories[0],
        c2: categories[1],
        c3: categories[2],
        c4: categories[3],
        c5: categories[4],
        size: size,
        adTerms: adTerms,
        minScore: minScore,
        countryName: countryName
    }
}

function drawResults(results){
    results.forEach(element => {
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
}