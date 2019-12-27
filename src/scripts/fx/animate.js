import { calcOffsetInPx, calcDurationInMs } from '../utilities/values';
import jQuery from 'jquery';

(function($) {
  $.fn.animateIt = function(options) {
    // Указатель на экземпляр плагина
    let plugin = this;

    // Разбираем параметры
    let settings = $.extend({
      animateClass: undefined,
      defaultAnimation: undefined,
      offset:         0, // число (px) или строка (px/%)
      repeat:     false,
      duration:       0, // число (ms) или строка (s/ms)
      delay:          0, // число (ms) или строка (s/ms)
      disableOn:      0  // число (px)
    }, options);

    // jQuery объекты документа и окна
    let $document = $(document);
    let $window = $(window);

    // Набор анимируемых блоков и данных для их анимации
    let $collection = $(plugin);
    let data = new Map();

    // Таймеры и продолжительность их паузы
    const timers = {
      resize: null,
      scroll: null,
      delay: 100
    };

    // Текущее состояние анимируемого блока
    const itemState = {
      INITIALIZED: 1,
      READY: 2,
      RUNNING: 3,
      DONE: 4,
      FINISHED: 5
    };

    // Инициализируем анимируемые блоки
    plugin.init = function() {
      let name, offset, repeat, duration, delay;
      let $item;

      $collection.each(function(index, element) {
        $item = $(element);

        // Скрываем блоки
        $item.addClass('hidden');

        // Разбираем data-атрибуты блока
        if ($item.is('[data-animate-name]')) {
          name = $item.data('animate-name');
        }
        else {
          name = settings.defaultAnimation;
        }
        if ($item.is('[data-animate-offset]')) {
          offset = calcOffsetInPx($item.data('animate-offset'), $item.height());
        }
        else {
          offset = settings.offset;
        }
        if ($item.is('[data-animate-repeat]')) {
          repeat = $item.data('animate-repeat');
        }
        else {
          repeat = settings.repeat;
        }
        if ($item.is('[data-animate-duration]')) {
          duration = calcDurationInMs($item.data('animate-duration'));
        }
        else {
          duration = (settings.duration > 0) ? settings.duration : undefined;
        }
        if ($item.is('[data-animate-delay]')) {
          delay = calcDurationInMs($item.data('animate-delay'));
        }
        else {
          delay = (settings.delay > 0) ? settings.delay : undefined;
        }

        // Сохраняем данные блока
        data.set(this, {
          state: itemState.INITIALIZED,
          animation: name,
          offset: offset,
          repeat: repeat,
          duration: duration,
          delay: delay
        });
      });
    };

    // Делаем доступной анимацию блоков
    plugin.enable = function() {
      let $item, value;

      $collection.each(function(index, element) {
        $item = $(element);
        value = data.get(element);

        // Добавляем к блоку классы и встроенные стили
        $item.addClass('hidden');
        $item.addClass(settings.animateClass);
        if (value.duration)
          $item.css('animation-duration', value.duration + 'ms');
        if (value.delay)
          $item.css('animation-delay', value.delay + 'ms');

        // Сохраняем информацию о состоянии блока
        value.state = itemState.READY;
        data.set(this, value);
      });
    };

    // Отключаем анимацию, отображаем блоки
    plugin.disable = function() {
      let $item, value;

      $collection.each(function(index, element) {
        $item = $(element);
        value = data.get(element);

        // Удаляем у блока классы и встроенные стили
        $item.removeClass(settings.animateClass);
        $item.removeClass(value.animation);
        $item.removeClass('hidden');
        if (value.duration)
          $item.css('animation-duration', '');
        if (value.delay)
          $item.css('animation-delay', '');

        // Сохраняем информацию о состоянии блока
        value.state = itemState.INITIALIZED;
        data.set(this, value);
      });
    };

    // Анимируем видимые блоки
    plugin.animate = function() {
      let viewTop, viewBottom, itemTop, itemBottom;
      let visible, hidden;
      let $item, value;

      $collection.each(function(index, element) {
        $item = $(element);
        value = data.get(element);

        viewTop = $window.scrollTop();
        viewBottom = viewTop + $window.height();
        itemTop = $item.offset().top + value.offset;
        itemBottom = itemTop + $item.height() - value.offset;

        visible = ((itemTop > viewTop && itemTop < viewBottom) ||
          (itemBottom < viewTop && itemBottom > viewBottom));
        hidden = ((itemTop > viewBottom && itemBottom > viewBottom) ||
          (itemTop < viewTop && itemBottom < viewTop));

        if (visible && value.state === itemState.READY) {
          $item.removeClass('hidden');
          $item.addClass(value.animation);

          value.state = itemState.RUNNING;
          data.set(element, value);
        }
        else if (hidden && value.state === itemState.DONE) {
          if (value.repeat) {
            $item.addClass('hidden');
            $item.removeClass(value.animation);

            value.state = itemState.READY;
            data.set(element, value);
          }
          else {
            value.state = itemState.FINISHED;
            data.set(element, value);
          }
        }
      });
    };

    // Обрабатываем завершение анимации
    $collection.on('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function() {
      let value = data.get(this);

      value.state = itemState.DONE;
      data.set(this, value);
    });

    // Задаём начальное состояние
    $document.ready(function() {
      plugin.init();

      if ($window.width() > settings.disableOn) {
        plugin.enable();
        plugin.animate();
      }
      else {
        plugin.disable();
      }
    });

    // Обрабатываем изменение ширины окна
    $window.resize(function() {
      if (timers.resize) clearTimeout(timers.resize);

      timers.resize = setTimeout(function() {
        timers.resize = null;

        if ($window.width() > settings.disableOn) {
          plugin.enable();
          plugin.animate();
        }
        else {
          plugin.disable();
        }
      }, timers.delay);
    });

    // Обрабатываем прокрутку окна
    $window.scroll(function() {
      if (timers.scroll) clearTimeout(timers.scroll);

      timers.scroll = setTimeout(function() {
        timers.scroll = null;

        if ($window.width() > settings.disableOn) {
          plugin.animate();
        }
      }, timers.delay);
    });
  };
}) (jQuery);
