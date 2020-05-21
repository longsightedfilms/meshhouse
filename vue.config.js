process.env.VUE_APP_VERSION = require('./package.json').version

module.exports = {
  configureWebpack: {
    resolve: {
      mainFields: ['module', 'main'],
    },
  },
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true
    },
    electronBuilder: {
      externals: ['node-notifier', 'electron-store', 'sqlite3', 'sharp', 'axios'],
      nodeModulesPath: ['../../node_modules', './node_modules'],
      builderOptions: {
        appId: 'com.longsightedfilms.meshhouse',
        productName: 'MeshHouse',
        compression: 'maximum',
        asar: true,
        mac: {
          category: 'public.app-category.graphics-design',
          target: 'dmg'
        },
        linux: {
          category: 'Graphics',
          executableName: 'MeshHouse',
          icon: './build/icons/512x512.png',
          target: 'AppImage'
        },
        nsis: {
          oneClick: false,
          installerIcon: './build/icons/icon.ico',
          license: './build/license.txt',
          allowToChangeInstallationDirectory: true
        }
      }
    }
  },

  productionSourceMap: false
}
