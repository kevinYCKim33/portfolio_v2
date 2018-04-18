// icon fades first, then the background
$(window).on("load", function() {
  $(".loader .inner").fadeOut(500, function() {
    $(".loader").fadeOut(750);
  });

  //fixes mobile issues
  $(".items").isotope({
    filter: '*',
    animationOptions: {
      duration: 1500,
      easing: 'linear',
      queue: false
    }
  });
})

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
// if width is 480px, then show 2 items
  $('.owl-carousel').owlCarousel({
    loop:true,
    items: 4,
    responsive:{
        0:{
            items:1
        },
        480:{
            items:2
        },
        768:{
            items:3
        },
        938:{
            items:4
        }
    }
  });



  var skillsTopOffset = $(".skillsSection").offset().top;
  var statsTopOffset = $(".statsSection").offset().top;
  var countUpFinished = false;

  $(window).scroll(function() {
    // console.log(window.pageYOffset);
    // make the numbers in pie chart rise up once you scroll down to it
    if(window.pageYOffset > skillsTopOffset - $(window).height() + 200) {
      $('.chart').easyPieChart({
        easing: 'easeInOut',
        barColor: '#fff',
        trackColor: false,
        scaleColor: false,
        lineWidth: 4,
        size: 152,
        onStep: function(from, to, percent) {
          $(this.el).find('.percent').text(Math.round(percent));
        }
      });
    }

    if(!countUpFinished && window.pageYOffset > statsTopOffset - $(window).height() + 200) {
      $(".counter").each(function(){
        let element= $(this);
        let endVal = parseInt(element.text());

        element.countup(endVal);
      });
      // scrolling magic to prevent the numbers from going down to 0 again.
      countUpFinished = true;
    }




  });

  $("[data-fancybox]").fancybox();



  //filter function to sort out relevant portfolios
  $("#filters a").click(function(){
    $("#filters .current").removeClass("current");
    $(this).addClass("current");

    var selector = $(this).attr("data-filter");

    $(".items").isotope({
      filter: selector,
      animationOptions: {
        duration: 1500,
        easing: 'linear',
        queue: false
      }
    });

    return false;

  });

  // code that scrolls down to the clicked link instead of jumping to it
  $("#navigation li a").click(function(e) {
    e.preventDefault();
    var targetElement = $(this).attr("href");
    var targetPosition = $(targetElement).offset().top;
    $("html, body").animate({ scrollTop: targetPosition - 50 }, "slow");
  });

  const nav = $("#navigation");
  const navTop = nav.offset().top; //moment at which to add or remove the sticky class;

  $(window).on("scroll", stickyNavigation);

  function stickyNavigation() {
    var body = $("body");

    if($(window).scrollTop() >= navTop) {
      body.css("padding-top", nav.outerHeight() + "px")
      body.addClass("fixedNav");
    }
    else {
      body.css("padding-top", 0);
      body.removeClass("fixedNav");

    }
  }

});
