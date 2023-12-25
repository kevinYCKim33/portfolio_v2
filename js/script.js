jQuery.event.special.touchstart = {
  setup: function (_, ns, handle) {
    this.addEventListener("touchstart", handle, {
      passive: !ns.includes("noPreventDefault"),
    });
  },
};

$(document).ready(function () {
  // https://owlcarousel2.github.io/OwlCarousel2/demos/basic.html
  $(".owl-carousel").owlCarousel({
    loop: false,
    items: 1,
    dots: true,
    lazyLoad: true,
  });

  var skillsTopOffset = $(".skillsSection").offset().top;

  $("[data-fancybox]").fancybox({
    transitionIn: "fade",
    transitionOut: "fade",
  });

  // code that scrolls down to the clicked link instead of jumping to it
  $("#navigation li a").click(function (e) {
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

    if ($(window).scrollTop() >= navTop) {
      body.css("padding-top", nav.outerHeight() - 10 + "px"); //fix for content jumping on scroll lock trigger
      body.addClass("fixedNav");
    } else {
      body.css("padding-top", 0);
      body.removeClass("fixedNav");
    }
  }
});
