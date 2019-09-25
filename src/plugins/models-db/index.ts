/* eslint-disable no-unused-vars */
import fs from 'fs'
import path from 'path'
import { remote, shell } from 'electron'
import { spawn } from 'child_process'
import { transliterate as tr, slugify } from 'transliteration'
import store from '../../store'

const recursive = require('recursive-readdir')
const ElectronStore = require('electron-store')
const settings = new ElectronStore({name: "settings"})
const databases = new ElectronStore({name: "databases"})
const dcc = new ElectronStore({name: "dcc-config"})

const modelsExtensions = [".max", ".ma", ".mb", ".blend", ".c4d", ".hip", ".hiplc", ".hipnc", ".lxo"]

function filterByModels(file: string, stats: any) {
  return !stats.isDirectory() && !modelsExtensions.includes(path.extname(file))
}

function getParameterByExtension(extension: string, param: string) {
  switch (extension) {
    case ".max": 
      return dcc.get('adsk_3dsmax.' + param)
    case ".ma":
    case ".mb":
      return dcc.get('adsk_maya.' + param)
    case ".blend":
      return dcc.get('blender.' + param)
    case ".c4d":
      return dcc.get('cinema4d.' + param)
    case ".hip":
    case ".hiplc":
    case ".hipnc":
      return dcc.get('houdini.' + param)
    case ".lxo":
      return dcc.get('modo.' + param)
  }
}

// Boilerplate settings if not exists
if ( !fs.existsSync( path.join(remote.app.getPath('userData'), path.normalize("\\databases.json")) ) ) {
  databases.set({
    databases: [
      {
        title: "MeshHouse",
        color: "blue-grey",
        url: "meshhouse",
        path: null
      }
    ]
  })
  store.commit('setApplicationDatabases', databases.get('databases'))
} else {
  store.commit('setApplicationDatabases', databases.get('databases'))
}

// Boilerplate settings if not exists
if ( !fs.existsSync( path.join(remote.app.getPath('userData'), path.normalize("\\settings.json")) ) ) {
  settings.set({
    language: 'en',
    applicationWindow: {
      width: 1024,
      height: 768
    }
  })
}

// Boilerplate DCC settings if not exists
if ( !fs.existsSync( path.join(remote.app.getPath('userData'), path.normalize("\\dcc-config.json")) ) ) {
  dcc.set({
    adsk_3dsmax: {
      useSystemAssociation: true,
      customPath: ''
    },
    adsk_maya: {
      useSystemAssociation: true,
      customPath: ''
    },
    blender: {
      useSystemAssociation: true,
      customPath: ''
    },
    cinema4d: {
      useSystemAssociation: true,
      customPath: ''
    },
    houdini: {
      useSystemAssociation: true,
      customPath: ''
    },
    modo: {
      useSystemAssociation: true,
      customPath: ''
    }
  })
}

export default {
  install(Vue: any) {
    Vue.prototype.$settingsGet = function (setting: string) {
      return settings.get(setting)
    }

    Vue.prototype.$settingsSet = function (setting: Array<any>) {
      settings.set(...setting) // ['setting', variable]
    }

    Vue.prototype.$dccSet = function (setting: any) {
      dcc.set(...setting)
    }

    Vue.prototype.$dccGetConfig = function () {
      return dcc.store
    }

    Vue.prototype.$dccSetConfig = function (config: string) {
      return dcc.store = config
    }

    Vue.prototype.$stringToSlug = function(str: string) {
      return slugify(str)
    }

    Vue.prototype.$addDatabase = function(db: any) {
      let list = databases.get('databases')
      if (list) {
        databases.set('databases', list.concat(db))
      }
      store.commit('setApplicationDatabases', databases.get('databases'))
    }

    Vue.prototype.$indexFolderRecursive = function(folder: string) {
      return recursive(folder, [ filterByModels ])
    }

    Vue.prototype.$openItem = function(file: string) {
      let ext = path.extname(file)
      if (getParameterByExtension(ext, 'useSystemAssociation')) {
        shell.openItem(path.normalize(file))
      } else {
        spawn(getParameterByExtension(ext, 'customPath'), [path.normalize(file)])
      }
    }

    Vue.prototype.$openFolder = function(folder: string) {
      shell.showItemInFolder(path.normalize(folder))
    }
  }
}