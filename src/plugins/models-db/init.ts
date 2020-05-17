import store from '@/store/main'
import fs from 'fs'
import path from 'path'
import ElectronStore from 'electron-store'
import { remote } from 'electron'
import { databaseDefault } from './defaults'
import { handleDatabases } from './functions'

const settings: ElectronStore<any> = new ElectronStore({ name: 'settings' })
const databases: ElectronStore<any> = new ElectronStore({ name: 'databases' })
const dcc: ElectronStore<any> = new ElectronStore({ name: 'dcc-config' })

export async function initDatabases(): Promise<void> {
  if (
    !fs.existsSync(
      path.join(
        remote.app.getPath('userData'),
        path.normalize('\\databases.json')
      )
    )
  ) {
    databases.set({
      databases: databaseDefault,
    })
    store.commit('setApplicationDatabases', databases.get('databases'))
  } else {
    const db = databases.get('databases')

    // Update model count and total size
    for await (const [index, database] of db.entries()) {
      const handleDB = handleDatabases(database)

      if (handleDB !== null) {
        await handleDB.updateDatabaseVersion()

        let totalSize = 0
        const models = await handleDB.fetchItemsFromDatabase()
        
        models.forEach(async (model: Model) => {
          const stats = fs.statSync(model.path)
          model.size = stats['size']
          totalSize += stats['size']

          const query = `UPDATE models
          SET ${handleDB.updateBuilder(model)}
          WHERE id = ${model.id}`
          await handleDB.runQuery(query)
        })

        db[index].count = models.length
        db[index].totalsize = totalSize
      }
    }
    databases.store = { databases: db }
    store.commit('setApplicationDatabases', db)
  }
}

export function initAppSettings(): void {
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
}

export function initDCCSettings(): void {
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
}
