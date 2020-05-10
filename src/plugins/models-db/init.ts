import store from '@/store/main'
import fs from 'fs'
import path from 'path'
import ElectronStore from 'electron-store'
import { remote } from 'electron'
import { databaseDefault } from './defaults'

const settings: ElectronStore<any> = new ElectronStore({ name: 'settings' })
const databases: ElectronStore<any> = new ElectronStore({ name: 'databases' })
const dcc: ElectronStore<any> = new ElectronStore({ name: 'dcc-config' })

export function initDatabases(): void {
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
    store.commit('setApplicationDatabases', databases.get('databases'))
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
