$('#mobile-burger').click(function() {
    $(this).toggleClass('is-active');

    $("#lang-dropdown button").prop("disabled", !($("#lang-dropdown button").prop("disabled")));

    $('#mobile-nav-dropdown').animate({
        height: 'toggle'
    }, 'fast');
});

$("#select-country").click(function(){
    $(".mobile-submenu").toggleClass('translate100');
});

$("#select-country-back").click(function(){
    $(".mobile-submenu").toggleClass('translate100');
});

$(document).click(function(e){    
    if($("#countries-dropdown .nav-dropdown-options").is(":visible")){
        $("#countries-dropdown .nav-dropdown-options").hide();
    }
    if($("#lang-dropdown .nav-dropdown-options").is(":visible")){
        $("#lang-dropdown .nav-dropdown-options").hide();
    }
});

$("#lang-dropdown button").click(function(e){
    e.stopPropagation();
    $("#lang-dropdown .nav-dropdown-options").toggle();
});

$("#countries-dropdown button").click(function(e){
    e.stopPropagation();
    $("#countries-dropdown .nav-dropdown-options").toggle();
});