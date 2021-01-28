// packages
import $ from 'jquery'; 

// Fix for # href
$('a[href="#"]').click(function (e) {
    e.preventDefault();
})

// Header Scrolled
// Animated header style
$(window).scroll(function() {     
    var scroll = $(window).scrollTop();

    if (scroll >= 1) {
        $(".top-nav").addClass("active");
    } else {
        $(".top-nav").removeClass("active");
    }
});


$(".trigger-menu").click(function(){
    var body = $("body")
    if(body.hasClass("menu-open")){
        body.removeClass("menu-open")
    }
    else{
        body.addClass("menu-open")
    }
});