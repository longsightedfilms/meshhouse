import store from '@/store/main'
import fs from 'fs'
import path from 'path'
import ElectronStore from 'electron-store'
import { remote } from 'electron'
import { databaseDefault } from './defaults'

import dccMigrations from './migrations/dccSettings'

const settings: ElectronStore<any> = new ElectronStore({
  name: 'settings',
  projectVersion: process.env.VUE_APP_VERSION
} as any)
const databases: ElectronStore<any> = new ElectronStore({
  name: 'databases',
  projectVersion: process.env.VUE_APP_VERSION
} as any)
const dcc: ElectronStore<any> = new ElectronStore({
  name: 'dcc-config',
  migrations: dccMigrations,
  projectVersion: process.env.VUE_APP_VERSION
} as any)

export function initDatabases(): void {
  if (
    !fs.existsSync(
      path.join(remote.app.getPath('userData'), 'databases.json')
    )
  ) {
    databases.set({
      databases: databaseDefault,
    })
    store.commit('setApplicationDatabases', databases.get('databases'))
  }
}

export function initAppSettings(): void {
  if (
    !fs.existsSync(
      path.join(remote.app.getPath('userData'), 'settings.json')
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
  const defaults = {
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
    threedCoat: {
      useSystemAssociation: true,
      customPath: ''
    },
    substancePainter: {
      useSystemAssociation: true,
      customPath: ''
    }
  }

  if (
    !fs.existsSync(
      path.join(remote.app.getPath('userData'), 'dcc-config.json')
    )
  ) {
    dcc.set(defaults)
  }
}
