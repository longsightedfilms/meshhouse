import _Vue from 'vue'
import fs from 'fs'
import path from 'path'
import { remote, shell } from 'electron'
import { spawn } from 'child_process'
import { transliterate as tr, slugify } from 'transliteration'
import store from '../../store'
import { Extension, DatabaseItem, Model } from '@/plugins/models-db/interfaces'
import Database from './database'
// Import icons
import iconMax from '@/assets/icons/max.svg'
import iconMaya from '@/assets/icons/maya.svg'
import iconBlender from '@/assets/icons/blender.svg'
import iconC4D from '@/assets/icons/cinema4d.svg'
import iconHoudini from '@/assets/icons/houdini.svg'
import iconModo from '@/assets/icons/modo.svg'
// Initializing storages
import recursive from 'recursive-readdir'
import ElectronStore from 'electron-store'
const settings: ElectronStore<any> = new ElectronStore({ name: 'settings' })
const databases: ElectronStore<any> = new ElectronStore({ name: 'databases' })
const dcc: ElectronStore<any> = new ElectronStore({ name: 'dcc-config' })

const modelsExtensions: Extension = {
  '.max': {
    title: '3ds Max Scene',
    icon: iconMax,
  },
  '.ma': {
    title: 'Maya ASCII Scene',
    icon: iconMaya,
  },
  '.mb': {
    title: 'Maya Binary Scene',
    icon: iconMaya,
  },
  '.blend': {
    title: 'Blender Scene',
    icon: iconBlender,
  },
  '.c4d': {
    title: 'Cinema 4D Scene',
    icon: iconC4D,
  },
  '.hip': {
    title: 'Houdini Scene',
    icon: iconHoudini,
  },
  '.hiplc': {
    title: 'Houdini Scene',
    icon: iconHoudini,
  },
  '.hipnc': {
    title: 'Houdini Scene',
    icon: iconHoudini,
  },
  '.lxo': {
    title: 'Modo Scene',
    icon: iconModo,
  },
}

function filterByModels(file: string, stats: fs.Stats): boolean {
  return (
    !stats.isDirectory() && !modelsExtensions.hasOwnProperty(path.extname(file))
  )
}

function getParameterByExtension(extension: string, param: string): string {
  switch (extension) {
    case '.max':
      return dcc.get('adsk3dsmax.' + param)
    case '.ma':
    case '.mb':
      return dcc.get('adskMaya.' + param)
    case '.blend':
      return dcc.get('blender.' + param)
    case '.c4d':
      return dcc.get('cinema4d.' + param)
    case '.hip':
    case '.hiplc':
    case '.hipnc':
      return dcc.get('houdini.' + param)
    case '.lxo':
      return dcc.get('modo.' + param)
    default:
      return ''
  }
}

// Boilerplate settings if not exists
if (
  !fs.existsSync(
    path.join(
      remote.app.getPath('userData'),
      path.normalize('\\databases.json')
    )
  )
) {
  databases.set({
    databases: [
      /*{
        title: "MeshHouse",
        color: "blue-grey",
        view: "rich",
        url: "meshhouse",
        path: ""
      }*/
    ],
  })
  store.commit('setApplicationDatabases', databases.get('databases'))
} else {
  store.commit('setApplicationDatabases', databases.get('databases'))
}

// Boilerplate settings if not exists
if (
  !fs.existsSync(
    path.join(remote.app.getPath('userData'), path.normalize('\\settings.json'))
  )
) {
  settings.set({
    language: 'en',
    applicationWindow: {
      width: 1024,
      height: 768,
    },
  })
}

// Boilerplate DCC settings if not exists
if (
  !fs.existsSync(
    path.join(
      remote.app.getPath('userData'),
      path.normalize('\\dcc-config.json')
    )
  )
) {
  dcc.set({
    adsk3dsmax: {
      useSystemAssociation: true,
      customPath: '',
    },
    adskMaya: {
      useSystemAssociation: true,
      customPath: '',
    },
    blender: {
      useSystemAssociation: true,
      customPath: '',
    },
    cinema4d: {
      useSystemAssociation: true,
      customPath: '',
    },
    houdini: {
      useSystemAssociation: true,
      customPath: '',
    },
    modo: {
      useSystemAssociation: true,
      customPath: '',
    },
  })
}

export function ModelsDB(Vue: typeof _Vue): void {
  Vue.prototype.$settingsGet = function(setting: string): string {
    return settings.get(setting)
  }

  Vue.prototype.$settingsSet = function(
    key: string,
    value: string | number
  ): void {
    settings.set(key, value)
  }

  Vue.prototype.$dccGetConfig = function(): object {
    return dcc.store
  }

  Vue.prototype.$dccSetConfig = function(config: object): void {
    dcc.store = config
  }

  Vue.prototype.$stringToSlug = function(str: string): string {
    return slugify(str)
  }

  Vue.prototype.$returnHumanLikeExtension = function(
    extension: string
  ): string {
    return modelsExtensions[extension].title
  }

  Vue.prototype.$returnExtensionIcon = function(extension: string): '*.svg' {
    return modelsExtensions[extension].icon
  }

  Vue.prototype.$forceReloadImage = function(image: string): string {
    return image !== '' ? image + '?v=' + store.state.imageRandomizer : image
  }

  Vue.prototype.$addDatabase = function(db: DatabaseItem): Promise<void> {
    const file = path.join(
      remote.app.getPath('userData'),
      `/databases/${db.url}.sqlite3`
    )

    if (!fs.existsSync(file)) {
      const database = new Database(db.url)
      database.createTable()

      return this.$indexFolderRecursive(db.path).then((files: string[]) => {
        const models: string[] = []
        files.forEach((file: string) => {
          models.push(
            `(null, '${path.parse(file).name}', '${
              path.parse(file).ext
            }', '${file}', '', '')`
          )
        })

        const query = `INSERT INTO 'models' VALUES ${models}`
        database.runQuery(query).then(() => {
          const list = databases.get('databases')
          if (list) {
            databases.set('databases', list.concat(db))
          }
          store.commit('setApplicationDatabases', databases.get('databases'))
        })
      })
    } else {
      return Promise.reject('Database exists')
    }
  }

  Vue.prototype.$reindexCatalog = function(db: DatabaseItem): Promise<void> {
    const database = new Database(db.url)

    return this.$indexFolderRecursive(db.path).then((files: string[]) => {
      database.reindexCatalog(files)
    })
  }

  Vue.prototype.$getItemsFromDatabase = function(
    dbName: string
  ): Promise<void> {
    const database = new Database(dbName)
    const params = this.$store.state.pageFilters

    let query = `SELECT * FROM 'models'`
    query += database.dynamicQueryBuilder(params.where)
    query += ` ORDER BY name COLLATE NOCASE ${params.order}`

    return database.getAllFromDatabase(query)
  }

  Vue.prototype.$updateItemInDatabase = function(
    dbName: string,
    model: Model
  ): Promise<void> {
    const database = new Database(dbName)

    let query = `UPDATE 'models' SET `
    query += database.updateBuilder(model)
    query += ` WHERE id = ${model.id}`

    return database.runQuery(query)
  }

  Vue.prototype.$editDatabase = function(
    database: string,
    setting: string,
    value: string
  ): Promise<boolean> {
    databases.set('databases.' + database + '.' + setting, value)
    store.commit('setApplicationDatabases', databases.get('databases'))
    return Promise.resolve(true)
  }

  Vue.prototype.$deleteDatabase = function(database: string): Promise<boolean> {
    console.log('deleted')
    return Promise.resolve(true)
  }

  Vue.prototype.$indexFolderRecursive = function(
    folder: string
  ): Promise<string[]> {
    return recursive(folder, [filterByModels])
  }

  Vue.prototype.$openItem = function(file: string): void {
    const extension = path.extname(file)
    if (getParameterByExtension(extension, 'useSystemAssociation')) {
      shell.openItem(path.normalize(file))
    } else {
      spawn(getParameterByExtension(extension, 'customPath'), [
        path.normalize(file),
      ])
    }
  }

  Vue.prototype.$openFolder = function(folder: string): void {
    shell.showItemInFolder(path.normalize(folder))
  }

  Vue.prototype.$openPropertiesModal = async function(
    model: Model
  ): Promise<boolean> {
    const properties = {
      imageChanged: false,
      name: model.name,
      category: model.category,
      image: model.image,
      extension: model.extension,
      path: model.path,
    }

    store.commit('setProperties', properties)
    store.commit('setEditPropsModal', true)

    return Promise.resolve(true)
  }
}
