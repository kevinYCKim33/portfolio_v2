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

});
