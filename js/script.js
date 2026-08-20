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

  const nav = document.getElementById("navigation");
  const navCollapse = $("#navbarNav");

  // code that scrolls down to the clicked link instead of jumping to it
  $("#navigation li a").click(function (e) {
    e.preventDefault();
    var targetElement = $(this).attr("href");

    function scrollToTarget() {
      // clear the sticky bar rather than the flat 50px this used to assume —
      // the bar is 69px on mobile, so headings landed underneath it
      var targetPosition =
        $(targetElement).offset().top - nav.offsetHeight - 12;
      $("html, body").animate({ scrollTop: targetPosition }, "slow");
    }

    // on mobile the open menu is part of the page flow until the bar sticks,
    // so every section below it sits lower than it will once the menu closes.
    // measuring before the collapse finishes lands the scroll short.
    if (navCollapse.hasClass("show")) {
      navCollapse.one("hidden.bs.collapse", scrollToTarget).collapse("hide");
    } else {
      scrollToTarget();
    }
  });

  // reveal sections on first scroll into view
  if ("IntersectionObserver" in window) {
    const revealTargets = document.querySelectorAll(
      "#about .about-container, .section-head, .skills-grid > div, #portfolio .row:not(:first-of-type), #contact .col-md-12",
    );

    revealTargets.forEach(function (el) {
      el.classList.add("reveal");
    });

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px" },
    );

    revealTargets.forEach(function (el) {
      observer.observe(el);
    });
  }

  // sticky nav.
  //
  // This used to cache the nav's document offset once at ready and compare
  // scrollTop against it on every scroll event. Two things made that cached
  // number wrong: `.splash` is 100vh, so on mobile the hero grows and shrinks
  // every time the browser hides or reveals its address bar, and the
  // carousels lazy-load their images long after ready. Either one moves the
  // nav without updating the trigger point, which is what made the bar drop
  // in and out while scrolling. A sentinel sitting where the nav lives in the
  // flow is read live, so it cannot go stale.
  // two injected divs, deliberately separate. the sentinel is the trigger and
  // never changes size, so the observer keeps getting clean crossings at the
  // top of the viewport. the spacer sits after the nav and takes over its
  // height, so nothing below jumps when the nav leaves the flow. doing both
  // jobs with one element (or with padding on <body>, as this used to) moves
  // the trigger point as a side effect of tripping it, which oscillates.
  const sentinel = document.createElement("div");
  sentinel.className = "nav-sentinel";
  nav.parentNode.insertBefore(sentinel, nav);

  const spacer = document.createElement("div");
  spacer.className = "nav-spacer";
  nav.parentNode.insertBefore(spacer, nav.nextSibling);

  function measureNav() {
    if (navCollapse.hasClass("show")) return; // open menu is not the resting height
    document.documentElement.style.setProperty(
      "--nav-h",
      nav.offsetHeight + "px",
    );
  }

  function setStuck(isStuck) {
    document.body.classList.toggle("fixedNav", isStuck);
  }

  measureNav();
  // webfonts and the hero image both settle after ready and can change the
  // bar's height
  $(window).on("load resize orientationchange", measureNav);

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      function (entries) {
        // stick once the sentinel has passed above the top of the viewport
        setStuck(entries[0].boundingClientRect.top < 0);
      },
      { threshold: 0 },
    ).observe(sentinel);
  } else {
    let ticking = false;
    $(window).on("scroll", function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        setStuck(sentinel.getBoundingClientRect().top < 0);
        ticking = false;
      });
    });
  }
});
