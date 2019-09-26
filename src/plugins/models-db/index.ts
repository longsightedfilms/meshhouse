/* eslint-disable no-unused-vars */
import fs from 'fs'
import path from 'path'
import { remote, shell } from 'electron'
import { spawn } from 'child_process'
import { transliterate as tr, slugify } from 'transliteration'
import store from '../../store'
import { IExtension, IDatabase } from '@/plugins/models-db/interfaces'
// Import icons
import iconMax from '@/assets/icons/max.svg'
import iconMaya from '@/assets/icons/maya.svg'
import iconBlender from '@/assets/icons/blender.svg'
import iconC4D from '@/assets/icons/cinema4d.svg'
import iconHoudini from '@/assets/icons/houdini.svg'
import iconModo from '@/assets/icons/modo.svg'
// Initializing storages
const recursive = require('recursive-readdir')
const ElectronStore = require('electron-store')
const settings = new ElectronStore({name: "settings"})
const databases = new ElectronStore({name: "databases"})
const dcc = new ElectronStore({name: "dcc-config"})

const modelsExtensions: IExtension = {
  ".max": {
    title: "3ds Max Scene",
    icon: iconMax
  },
  ".ma": {
    title: "Maya ASCII Scene",
    icon: iconMaya
  },
  ".mb": {
    title: "Maya Binary Scene",
    icon: iconMaya
  },
  ".blend": {
    title: "Blender Scene",
    icon: iconBlender
  },
  ".c4d": {
    title: "Cinema 4D Scene",
    icon: iconC4D
  },
  ".hip": {
    title: "Houdini Scene",
    icon: iconHoudini
  },
  ".hiplc": {
    title: "Houdini Scene",
    icon: iconHoudini
  },
  ".hipnc": {
    title: "Houdini Scene",
    icon: iconHoudini
  },
  ".lxo": {
    title: "Modo Scene",
    icon: iconModo
  },
}

function filterByModels(file: string, stats: any): boolean {
  return !stats.isDirectory() && !modelsExtensions.hasOwnProperty(path.extname(file))
}

function getParameterByExtension(extension: string, param: string): string {
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
    default:
      return ''
  }
}

// Boilerplate settings if not exists
if ( !fs.existsSync( path.join(remote.app.getPath('userData'), path.normalize("\\databases.json")) ) ) {
  databases.set({
    databases: [
      {
        title: "MeshHouse",
        color: "blue-grey",
        view: "rich",
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
    Vue.prototype.$settingsGet = function (setting: string): string {
      return settings.get(setting)
    }

    Vue.prototype.$settingsSet = function (setting: string[]): void {
      settings.set(...setting)
    }

    Vue.prototype.$dccSet = function (setting: any): void {
      dcc.set(...setting)
    }

    Vue.prototype.$dccGetConfig = function (): object {
      return dcc.store
    }

    Vue.prototype.$dccSetConfig = function (config: object): void {
      dcc.store = config
    }

    Vue.prototype.$stringToSlug = function(str: string): string {
      return slugify(str)
    }

    Vue.prototype.$returnItemCategory = function(category: string): string {
      return category || this.$t('lists.local.noCategory')
    }

    Vue.prototype.$returnHumanLikeExtension = function(extension: string): string {
      return modelsExtensions[extension].title
    }

    Vue.prototype.$returnExtensionIcon = function(extension: string): any {
      return modelsExtensions[extension].icon
    }

    Vue.prototype.$addDatabase = function (db: IDatabase): void {
      let list = databases.get('databases')
      if (list) {
        databases.set('databases', list.concat(db))
      }
      store.commit('setApplicationDatabases', databases.get('databases'))
    }

    Vue.prototype.$editDatabase = function (database: string, setting: string, value: string): void {
      databases.set('databases.' + database + '.' + setting, value)
      store.commit('setApplicationDatabases', databases.get('databases'))
    }

    Vue.prototype.$indexFolderRecursive = function(folder: string): Promise<any> {
      return recursive(folder, [ filterByModels ])
    }

    Vue.prototype.$openItem = function(file: string): void {
      let ext = path.extname(file)
      if (getParameterByExtension(ext, 'useSystemAssociation')) {
        shell.openItem(path.normalize(file))
      } else {
        spawn(getParameterByExtension(ext, 'customPath'), [path.normalize(file)])
      }
    }

    Vue.prototype.$openFolder = function(folder: string): void {
      shell.showItemInFolder(path.normalize(folder))
    }
  }
}