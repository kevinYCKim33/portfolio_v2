$(document).ready(function(){
  $('#slides').superslides({
    animation: 'fade',
    play: 5000,
    pagination: false
  });

// https://github.com/mattboldt/typed.js/
  let typed = new Typed(".typed", {
    strings: ["Software Engineer.", "Full Stack Developer.", "Tech Blogger."],
    typeSpeed: 70,
    loop: true,
    startDelay: 1000,
    showCursor: false
  });

// https://owlcarousel2.github.io/OwlCarousel2/demos/basic.html
  $('.owl-carousel').owlCarousel({
    loop:true,
    margin:10,
    nav:true,
    responsive:{
        0:{
            items:1
        },
        600:{
            items:3
        },
        1000:{
            items:5
        }
    }
  });

});
