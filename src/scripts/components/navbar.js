import jQuery from 'jquery';

(function($) {
  $.fn.navBar = function(options) {
    // Указатель на экземпляр панели навигации
    let plugin = this;

    // Разбираем параметры
    let settings = $.extend({
      desktopStylesClass: undefined,
      mobileStylesClass: undefined,
      preToggle: null,
      collapseOn: 0
    }, options);

    // jQuery объекты документа и окна
    let $document = $(document);
    let $window = $(window);

    // jQuery объекты для интерактивных элементов панели навигации
    let $navbar = $(plugin);
    let $toggler = $(plugin).find('[data-target]');
    let $collapse = $(plugin).find($toggler.data('target'));

    // Таймер и продолжительность его паузы
    const timer = {
      resize: null,
      delay: 200
    };

    // Текущее состояние навигационной панели
    const currentState = {
      mobile: false,
      maximized: false
    };

    // Изменяем стили оформления панели навигации
    plugin.toggleStyles = function(state) {
      if (state.mobile) {
        if (settings.desktopStylesClass)
          $navbar.removeClass(settings.desktopStylesClass);

        if (settings.mobileStylesClass)
          $navbar.addClass(settings.mobileStylesClass);
      }
      else {
        if (settings.mobileStylesClass)
          $navbar.removeClass(settings.mobileStylesClass);

        if (settings.desktopStylesClass)
          $navbar.addClass(settings.desktopStylesClass);
      }
    };

    // Скрываем меню и отображаем кнопку переключения
    plugin.toggleNavbar = function(state) {
      if (!$toggler || !$collapse) return;

      if (state.mobile) {
        $collapse.hide();
        $toggler.show();
      }
      else {
        $toggler.hide();
        $collapse.show();
      }
    };

    // Очищаем случайно оставшиеся стили
    plugin.clearStyles = function(state) {
      if (!$toggler || !$collapse) return;

      $toggler.removeClass('active');
      $collapse.removeAttr('style');
      $collapse.removeClass('show');
    };

    // Разворачиваем меню в мобильной версии
    plugin.maximizeMenu = function(state) {
      if (!$toggler || !$collapse) return;

      if (state.mobile) {
        if (state.maximized) {
          $toggler.addClass('active');
          let height = Math.floor($window.height() - $navbar.outerHeight());
          $collapse.height(height);
          $collapse.show();
          $collapse.addClass('show');
        }
        else {
          $toggler.removeClass('active');
          $collapse.removeAttr('style');
          $collapse.removeClass('show');
          $collapse.hide();
        }
      }
    };

    // Вызываем обработчик нажатия на кнопку/пункт меню
    plugin.preToggleHook = function(state) {
      if (typeof settings.preToggle === 'function')
        settings.preToggle.call(this, state);
    };

    // Задаём начальное состояние
    $document.ready(function() {
      currentState.mobile = $window.width() <= settings.collapseOn;
      currentState.maximized = false;

      plugin.toggleNavbar(currentState);
      plugin.toggleStyles(currentState);
    });

    // Обрабатываем изменение ширины окна
    $window.resize(function() {
      if (timer.resize) clearTimeout(timer.resize);

      timer.resize = setTimeout(function() {
        timer.resize = null;

        if ($window.width() <= settings.collapseOn)
          currentState.mobile = true;
        else
          currentState.mobile = false;

        currentState.maximized = false;
        plugin.clearStyles(currentState);
        plugin.toggleNavbar(currentState);
        plugin.toggleStyles(currentState);
      }, timer.delay);
    });

    // Обрабатываем нажатие на кнопку вызова меню
    $toggler.click(function() {
      currentState.maximized = !currentState.maximized;
      plugin.preToggleHook(currentState);
      plugin.maximizeMenu(currentState);
    });

    // Обрабатываем нажатие по ссылкам в меню
    $collapse.click(function() {
      let $target = $(event.target);

      if ($target.is('a')) {
        currentState.maximized = false;
        plugin.preToggleHook(currentState);
        plugin.maximizeMenu(currentState);
      }
    });
  };
}) (jQuery);
