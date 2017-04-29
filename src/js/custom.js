$(function () {
    /*jqueryScrollSpeed
    * =========================*/
    jQuery.scrollSpeed(100,600);

    /*slider
    ===============================*/
    $('#js-slider').slick({
        dots: true,
        autoplay: false,
        infinite: true,
        speed: 1200,
        scrollSpeed: 1200,
        slidesToShow: 1
    });

});
