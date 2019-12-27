// Задаём пути к исходным файлам и каталог для сборки проекта.
// Указываем браузер и стартовую страницу для сервера разработки.
// Выбираем режим сборки и параметры форматирования финальных файлов
let settings = {
  source: {
    entry: 'src/index.js'
  },
  distribution: {
    baseDir: 'dist'
  },
  server: {
    browser: getBrowser('chrome'),
    startPage: 'index.html'
  },
  build: {
    mode: 'production',
    beautify: true
  }
};

// Выбираем браузер под платформу
function getBrowser(browser) {
  if (browser === 'chrome' &&
      process.platform === 'linux') {
    return 'chromium-browser';
  }
  else return browser;
}

// Загружаем модули Node.js
const path = require('path');

// Загружаем плагины Webpack
/*  */

// Разбираем параметры командной строки
module.exports = (env, argv) => {
  // Переопределяем используемый браузер.
  // Приоритетным браузером является тот, который
  // был передан в параметре командной строки --open
  if (argv.open)
    settings.server.browser = argv.open;

  // Если в командной строке задана опция --open-page,
  // то изменяем изначально выбранную стартовую страницу
  if (argv.openPage)
    settings.server.startPage = argv.openPage;

  // Задаём режим сборки учитывая параметры командной строки
  if (env && env.production || argv.mode === 'production') {
    settings.build.mode = 'production';
  }
  else if (env && env.development || argv.mode === 'development') {
    settings.build.mode = 'development';
  }

  // Вручную устанавливаем для процесса переменную NODE_ENV.
  // Если этого не сделать, то PostCSS будет использовать
  // значение 'development', которое может неправильно
  // сконфигурировать Browserslist.
  // На момент начала работы PostCSS плагин DefinePlugin
  // ещё не успеет запуститься
  process.env.NODE_ENV = settings.build.mode;

  // Экспортируем настройки в Webpack
  return {
    // Задаём имена файлов с точками входа
    entry: path.resolve(__dirname, settings.source.entry),

    // Задаём каталог и шаблоны имён для собираемых файлов
    output: {
      path: path.resolve(__dirname, settings.distribution.baseDir),
      filename: 'js/[name].js'
    },

    // Настраиваем правила для сборки файла с библиотеками
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all'
          }
        },
        name: (module, chunks, cacheGroupKey) => {
          return cacheGroupKey;
        }
      }
    },

    // Настраиваем правила обработки для различных типов файлов
    module: {
      rules: [
        // Скрипты
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        },
        // Стили
        {
          test: /\.sass$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'css/[name].css'
              }
            },
            {
              loader: 'extract-loader',
              options: {
                // Задаём пути в файле стилей относительно папки css
                publicPath: '../'
              }
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: settings.build.mode === 'development',
                importLoaders: 2
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: settings.build.mode === 'development',
                config: {
                  ctx: {
                    env: settings.build.mode,
                    minify: (settings.build.mode === 'production' && !settings.build.beautify),
                    iexplore: (settings.server.browser === 'iexplore')
                  }
                }
              }
            },
            {
              loader: 'resolve-url-loader',
              options: {
                debug: false
              }
            },
            {
              loader: 'sass-loader',
              options: {
                // Необходимо для Resolve-URL-Loader
                sourceMap: true,
                outputStyle: settings.build.beautify ? 'expanded' : 'nested',
                indentedSyntax: true
              }
            }
          ]
        },
        // Страницы
        {
          test: /\.(jade|pug)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].html'
              }
            },
            'extract-loader',
            {
              loader: 'html-loader',
              options: {
                attrs: ['img:src']
              }
            },
            {
              loader: 'pug-html-loader',
              options: {
                pretty: (settings.build.mode === 'production' && settings.build.beautify)
              }
            }
          ]
        },
        // Изображения
        {
          test: /\.(gif|jpe?g|png)$/i,
          use: {
            loader: 'file-loader',
            options: {
              name: 'img/[name].[ext]'
            }
          }
        },
        // Шрифты
        {
          test: /\.(eot|[ot]tf|svg|woff2?)$/i,
          use: {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[ext]'
            }
          }
        }
      ]
    },

    // Загружаем плагины
    plugins: [
      /*  */
    ],

    // Задаём формат карты исходных файлов для отладки
    devtool: settings.build.mode === 'development' ? 'eval-source-map' : false,

    // Настраиваем Webpack-dev-server
    devServer: {
      contentBase: path.resolve(__dirname, settings.distribution.baseDir),
      openPage: settings.server.startPage,
      open: settings.server.browser,
      overlay: true
    },

    // Задаём режим сборки
    mode: settings.build.mode
  };
};
