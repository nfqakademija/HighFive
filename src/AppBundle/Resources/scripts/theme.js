"use strict";

$(document).ready(function() {

    // fullscreen menu
    $('.menu-hamburger').on('click', function(){
        $(this).toggleClass('clicked');
        $('.navbar-hamb').toggleClass('navbarWhite');
        $('.fullscreen-menu').toggleClass('menu-opened');
    });

    // open left menu
    $('.menu-left').on('click', function(){
        $(this).toggleClass('clicked');
        $('#page-content').toggleClass('show-menu');
    });

    // ScrollUp btn
    $('.scrollUp').on('click', function(){
        $("html, body").animate({ scrollTop: 0 }, 600);
        return false;
    });

});