process.env.VUE_APP_VERSION = require('./package.json').version;
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  configureWebpack: {
    plugins: [
      new BundleAnalyzerPlugin({
        openAnalyzer: false
      })
    ],
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
      externals: ['node-notifier', 'electron-store', 'sqlite3', 'sharp', 'axios', 'chokidar'],
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
          icon: './build/icons/256x256.png',
          target: 'AppImage'
        },
        nsis: {
          oneClick: false,
          installerIcon: './build/icons/icon.ico',
          license: './build/license.txt',
          allowToChangeInstallationDirectory: true
        }
      },
      publish: {
        provider: 'github',
        owner: 'longsightedfilms'
      }
    }
  },

  productionSourceMap: false
}
