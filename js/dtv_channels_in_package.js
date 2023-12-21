(function ($, Drupal) {
  "use strict";

  jQuery(document).ready(function ($) {
    $('.list-of-channels-section .slick-nav-list').slick({
      dots: false,
      infinite: false,
      speed: 300,
      slidesToShow: 6,
      slidesToScroll: 1,
      prevArrow: '<button class="slick-slide-arrow prev-arrow" label="Left"></button>',
      nextArrow: '<button class="slick-slide-arrow next-arrow" label="Right"></button>',
      responsive: [
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: 5,
            slidesToScroll: 1,
          }
        },
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 4.5,
            slidesToScroll: 1,
            prevArrow: '<button class="slick-slide-arrow prev-arrow" label="Left"></button>',
            nextArrow: '<button class="slick-slide-arrow next-arrow" label="Right"></button>'
          }
        },
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 4.5,
            slidesToScroll: 1,
            prevArrow: '<button class="slick-slide-arrow prev-arrow" label="Left"></button>',
            nextArrow: '<button class="slick-slide-arrow next-arrow" label="Right"></button>'
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 3.5,
            slidesToScroll: 1,
            prevArrow: '<button class="slick-slide-arrow prev-arrow" label="Left"></button>',
            nextArrow: '<button class="slick-slide-arrow next-arrow" label="Right"></button>'
          }
        },
        {
          breakpoint: 576,
          settings: {
            slidesToShow: 3.5,
            slidesToScroll: 1,
            prevArrow: '<button class="slick-slide-arrow prev-arrow" label="Left"></button>',
            nextArrow: '<button class="slick-slide-arrow next-arrow" label="Right"></button>'
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 2.5,
            slidesToScroll: 1,
            prevArrow: '<button class="slick-slide-arrow prev-arrow" label="Left"></button>',
            nextArrow: '<button class="slick-slide-arrow next-arrow" label="Right"></button>'
          }
        },
      ]
    });

    $(".nav-link").on("click", function () {
      // Store a reference to 'this' in a variable
      var $this = $(this);

      // Remove 'active' class from all other nav links
      $(".nav-link").not($this).removeClass('active');

      setTimeout(function () {
        // Now use the stored reference to add 'active' class
        $this.addClass('active');
      }, 500);
    });
  });
})(jQuery, Drupal);