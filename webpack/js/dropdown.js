$("#selected-country").on('click', function(e){
    e.stopPropagation()
    $("#country-dropdown").show();
});

$("#country-dropdown li").on('click', function(e){
    $("#selected-country").html(this.innerHTML);
    $("#selected-country").attr("data-value", this.getAttribute('data-value'));
});

$(document).click(function(e){    
    if($("#country-dropdown").is(":visible")){
        $("#country-dropdown").hide();
    }
});