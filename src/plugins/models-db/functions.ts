import fs from 'fs'
import path from 'path'
import ElectronStore from 'electron-store'
import Integrations from './integrations/main'

const dcc: ElectronStore<any> = new ElectronStore({ name: 'dcc-config' })
const databases: ElectronStore<any> = new ElectronStore({ name: 'databases' })

export const modelsExtensions: Extension = {
  '.3b': {
    title: '3DCoat Scene',
    icon: '3b'
  },
  '.max': {
    title: '3ds Max Scene',
    icon: 'max',
  },
  '.ma': {
    title: 'Maya ASCII Scene',
    icon: 'ma',
  },
  '.mb': {
    title: 'Maya Binary Scene',
    icon: 'mb',
  },
  '.blend': {
    title: 'Blender Scene',
    icon: 'blend',
  },
  '.c4d': {
    title: 'Cinema 4D Scene',
    icon: 'c4d',
  },
  '.hip': {
    title: 'Houdini Scene',
    icon: 'hip',
  },
  '.hiplc': {
    title: 'Houdini Scene',
    icon: 'hiplc',
  },
  '.hipnc': {
    title: 'Houdini Scene',
    icon: 'hipnc',
  },
  '.lxo': {
    title: 'Modo Scene',
    icon: 'lxo',
  },
  '.spp': {
    title: 'Substance Painter Scene',
    icon: 'spp'
  }
}

export function filterByModels(file: string, stats: fs.Stats): boolean {
  return (
    !stats.isDirectory() && !modelsExtensions.hasOwnProperty(path.extname(file))
  )
}

export function getParameterByExtension(extension: string, param: string): string {
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
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 B'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export function hexToRgb(hex: string): ColorRGB | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

export function colorContrast(hex: string): string {
  const color = hexToRgb(hex)
  if (color !== null) {
    const contrast = (Math.round(color.r * 299) + Math.round(color.g * 587) + Math.round(color.b * 114)) / 1000
    return (contrast >= 128) ? 'text--black' : 'text--white'
  } else {
    return 'text--white'
  }
}



// Database handling

export function findDatabaseIndex(url: string): number {
  return databases.get('databases').findIndex((db: DatabaseItem) => db.url === url)
}

export function handleDatabases(database: DatabaseItem | string): PossibleIntegrations {
  let searchableDB

  if (typeof database === 'string') {
    searchableDB =  databases.get('databases')[findDatabaseIndex(database)]
  } else {
    searchableDB = database
  }
  const dbType = searchableDB.localDB ? 'local' : searchableDB.url

  return dbType === 'local' ? new Integrations.local(searchableDB.url) : null//new Integrations[dbType]()
}
