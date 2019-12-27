import jQuery from 'jquery';

(function($) {
  $.fn.smoothScroll = function(options) {
    // Указатель на экземпляр плагина
    let plugin = this;

    // Разбираем параметры
    let settings = $.extend({
      duration: 500
    }, options);

    // Коллекция внутренних ссылок на странице
    let $collection = $(plugin);

    $collection.click(function(event) {
      event.preventDefault();

      $('html, body').animate({
        scrollTop: $(this.hash).offset().top
      }, settings.duration);
    });
  };
}) (jQuery);
