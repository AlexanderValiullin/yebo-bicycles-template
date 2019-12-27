global.jQuery = require('jquery');
global.$ = jQuery;

require('./scroll.js');
require('./components/navbar.js');
require('./fx/animate.js');
require('./fx/hover.js');
require('owl.carousel');

$(document).ready(function() {
  let mobileOn = 992;

  // Плавная прокрутка
  let $links = $('.navbar a[href^="#"]');
  $links.smoothScroll();

  // Панель навигации
  let $navbar = $('#main-navbar');
  $navbar.navBar({
    desktopStylesClass: 'navbar-desktop',
    mobileStylesClass: 'navbar-mobile',
    preToggle: function(state) {
      if (state.maximized) {
        $(this).css('background-color', 'rgba(255, 255, 255, 0.76)');
      }
      else {
        $(this).css('background-color', 'transparent');
      }
    },
    collapseOn: mobileOn
  });

  $(window).resize(function() {
    $navbar.removeAttr('style');
  });

  // Анимация появляющихся секций
  let $animate = $('.animate-it');
  $animate.animateIt({
    animateClass: 'animated',
    defaultAnimation: 'zoomIn',
    //repeat: true,
    disableOn: mobileOn
  });

  // Слайдер с твиттами
  let $slider = $('#tweets-slider');
  $slider.owlCarousel({
    loop: true,
    dots: true,
    autoplayTimeout: 7000,
    smartSpeed: 500,
    items: 1,
    responsive: {
      0: {
        autoplay: false
      },
      992: {
        autoplay: true,
        autoplayHoverPause: true
      }
    }
  });

  // Затенение c анимацией в секции "Shop"
  let $hover = $('.hover-it');
  $hover.hoverIt({
    animateClass: 'animated',
    contentAnimation: 'bounceInDown',
    disableOn: mobileOn
  });
});

// Выводим диагностическое сообщение в консоль
if (process.env.NODE_ENV === 'development') {
  console.log('It\'s alive!');
}
