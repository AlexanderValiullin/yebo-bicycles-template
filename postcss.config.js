// Задаём настройки для минификации стилей и
// добавления в них специфичных для браузеров префиксов
let settings = {
  autoprefixer: false,
  cssnano: false
};

// Разбираем опции
module.exports = ({ file, options, env }) => {
  // Минификация стилей
  if (options['minify']) {
    settings.cssnano = {};
  }

  // Если разработка идёт под Internet Explorer,
  // то добавляем префиксы для Flexbox и CSS Grid.
  // Иначе получаем опцию browserslist из package.json
  if (options['iexplore'] && env === 'development') {
    settings.autoprefixer = {
      overrideBrowserslist: ['ie >= 10'],
      grid: 'autoplace'
    };
  }
  else {
    settings.autoprefixer = {
      grid: env === 'production' ? 'autoplace' : false
    };
  }

  // Экспортируем настройки в PostCSS
  return {
    plugins: {
      'postcss-preset-env': {
        autoprefixer: settings.autoprefixer
      },
      'cssnano': settings.cssnano
    }
  };
};
