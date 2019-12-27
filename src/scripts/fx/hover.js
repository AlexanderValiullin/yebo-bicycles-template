import { isTouchDevice } from '../utilities/detect';
import jQuery from 'jquery';

(function($) {
  $.fn.hoverIt = function(options) {
    // Указатель на экземпляр плагина
    let plugin = this;

    // Разбираем параметры
    let settings = $.extend({
      closeButtonSelector:     '[data-hover-close]',
      animatedContentSelector: '[data-hover-animated]',
      animateClass:            undefined,
      contentAnimation:        undefined,
      disableOn:        0 // число (px)
    }, options);

    // jQuery объекты документа и окна
    let $document = $(document);
    let $window = $(window);

    // Набор анимируемых блоков
    let $collection = $(plugin);

    // Таймер и продолжительность его паузы
    const timer = {
      resize: null,
      delay: 10
    };

    // Инициализируем анимируемые блоки
    plugin.init = function() {
      let $item;

      // Скрываем кнопки и ссылки
      $collection.each(function(index, element) {
        $item = $(element);

        $item.find(settings.closeButtonSelector)
          .hide();
        $item.find(settings.animatedContentSelector)
          .hide();
      });
    };

    // Делаем доступной анимацию блоков
    plugin.enableAnimation = function() {
      $collection.each(function(index, element) {
        $(element).find(settings.animatedContentSelector)
          .addClass(settings.contentAnimation);
      });
    };

    // Отключаем анимацию
    plugin.disableAnimation = function() {
      $collection.each(function(index, element) {
        $(element).find(settings.animatedContentSelector)
          .removeClass(settings.contentAnimation);
      });
    };

    // Показываем оверлей с анимацией
    plugin.showOverlay = function(element) {
      let $item = $(element);

      if (isTouchDevice()) {
        $item.find(settings.closeButtonSelector)
          .show();
      }

      $item.find(settings.animatedContentSelector)
        .show();
      $item.addClass('active');
    };

    // Скрываем оверлей
    plugin.hideOverlay = function(element) {
      let $item = $(element);

      $item.find(settings.closeButtonSelector)
        .hide();

      $item.find(settings.animatedContentSelector)
        .hide();
      $item.removeClass('active');
    };

    // Анимируем иконку
    plugin.startAnimation = function(element) {
      $(element).find(settings.animatedContentSelector)
        .addClass(settings.animateClass);
    };

    // Удаляем название анимации у иконки
    plugin.stopAnimation = function(element) {
      $(element).find(settings.animatedContentSelector)
        .removeClass(settings.animateClass);
    };

    // Задаём начальное состояние
    $document.ready(function() {
      plugin.init();

      if ($window.width() > settings.disableOn) {
        plugin.enableAnimation();
      }
      else {
        plugin.disableAnimation();
      }
    });

    // Обрабатываем изменение ширины окна
    $window.resize(function() {
      if (timer.resize) clearTimeout(timer.resize);

      timer.resize = setTimeout(function() {
        timer.resize = null;

        if ($window.width() > settings.disableOn) {
          plugin.enableAnimation();
        }
        else {
          plugin.disableAnimation();
        }
      }, timer.delay);
    });

    // Обрабатываем щелчок мыши ил касание на блоке
    $collection.click(function(event) {
      let $target = $(event.target);

      // Если щелчок был на кнопке или ссылке, то скрываем все элементы.
      // В противном случае показываем их
      if ($target.closest(settings.closeButtonSelector).length ||
        $target.closest(settings.animatedContentSelector).length) {
        plugin.hideOverlay(this);
        plugin.stopAnimation(this);
      }
      else {
        plugin.showOverlay(this);
        plugin.startAnimation(this);
      }
    });

    // Обрабатываем наведение курсора мыши на блок
    $collection.mouseenter(function() {
      plugin.showOverlay(this);
      plugin.startAnimation(this);
    });

    // Обрабатываем уход курсора мыши за пределы блока
    $collection.mouseleave(function() {
      plugin.hideOverlay(this);
      plugin.stopAnimation(this);
    });
  };
}) (jQuery);
