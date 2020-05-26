import eventBus from '@/eventBus';
import store from '@/store/main';
import fs from 'fs';
import path from 'path';
import Integrations from './integrations/main';
import recursive from 'recursive-readdir';
import chokidar from 'chokidar';

import {
  dcc,
  databases
} from './init';

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
};

export function filterByModels(file: string, stats: fs.Stats): boolean {
  return (
    !stats.isDirectory() && !modelsExtensions.hasOwnProperty(path.extname(file))
  );
}

export function generateIncludePattern(path: string): string[] {
  const array: string[] = [];

  Object.keys(modelsExtensions).forEach((extension: string) => {
    array.push(`${path}/**/*${extension}`);
  });

  return array;
}

export function getParameterByExtension(extension: string, param: string): string {
  switch (extension) {
  case '.3b':
    return dcc.get('threedCoat.' + param);
  case '.max':
    return dcc.get('adsk3dsmax.' + param);
  case '.ma':
  case '.mb':
    return dcc.get('adskMaya.' + param);
  case '.blend':
    return dcc.get('blender.' + param);
  case '.c4d':
    return dcc.get('cinema4d.' + param);
  case '.hip':
  case '.hiplc':
  case '.hipnc':
    return dcc.get('houdini.' + param);
  case '.lxo':
    return dcc.get('modo.' + param);
  case '.spp':
    return dcc.get('substancePainter.' + param);
  default:
    return 'nondefault';
  }
}
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) {
    return '0 B';
  }

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function hexToRgb(hex: string): ColorRGB | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function colorContrast(hex: string): string {
  const color = hexToRgb(hex);
  if (color !== null) {
    const contrast = (Math.round(color.r * 299) + Math.round(color.g * 587) + Math.round(color.b * 114)) / 1000;
    return (contrast >= 128) ? 'text--black' : 'text--white';
  } else {
    return 'text--white';
  }
}

// Database handling

export function findDatabaseIndex(url: string): number {
  return databases.get('databases').findIndex((db: DatabaseItem) => db.url === url);
}

export function handleDatabases(database: DatabaseItem | string): Integrations {
  let searchableDB;

  if (typeof database === 'string') {
    searchableDB = databases.get('databases')[findDatabaseIndex(database)];
  } else {
    searchableDB = database;
  }
  const dbType = searchableDB.localDB ? 'local' : searchableDB.url;

  return dbType === 'local' ? new Integrations.local(searchableDB.url) : null;//new Integrations[dbType]()
}


export async function updateDatabases(): Promise<boolean> {
  const db = databases.get('databases');

  // Update model count and total size
  for await (const [index, database] of db.entries()) {
    const handleDB = handleDatabases(database);

    if (handleDB !== null) {
      await handleDB.updateDatabaseVersion();

      let totalSize = 0;
      const files = await recursive(database.path, [filterByModels]);
      await handleDB.reindexCatalog(files);
      const models = await handleDB.fetchItemsFromDatabase('SELECT * FROM \'models\'');

      models.forEach(async(model: Model) => {
        const stats = fs.statSync(model.path);
        model.size = stats['size'];
        totalSize += stats['size'];

        const query = `UPDATE models
        SET ${handleDB.updateBuilder(model)}
        WHERE id = ${model.id}`;
        await handleDB.runQuery(query);
      });

      db[index].count = models.length;
      db[index].totalsize = totalSize;
    }
  }
  databases.store = { databases: db };
  store.commit('setApplicationDatabases', db);
  return Promise.resolve(true);
}

function handleUpdate(database: DatabaseItem, handleDB: Integrations, db: DatabaseItem[], index: number): Promise<void> {
  return recursive(database.path, [filterByModels])
    .then((files: string[]) => {
      return handleDB.reindexCatalog(files);
    })
    .then((items: DatabaseUpdateInformation) => {
      db[index].count = items.count;
      db[index].totalsize = items.totalSize;

      databases.store = { databases: db };
      store.commit('setApplicationDatabases', db);
      eventBus.$emit('file-event', database);
    });
}

export async function watchDatabases(): Promise<boolean> {
  const db = databases.get('databases');

  for await (const [index, database] of db.entries()) {
    const handleDB = handleDatabases(database);


    if (handleDB !== null) {
      const paths = generateIncludePattern(String(database.path));
      const watcher = chokidar.watch(paths, {
        ignoreInitial: true,
        awaitWriteFinish: true
      });

      watcher
        .on('add', (() => {
          handleUpdate(database, handleDB, db, index)
            .then(() => {
              store.commit('setApplicationDatabases', db);
              eventBus.$emit('file-event', database);
            });
        }))
        .on('unlink', (() => {
          handleUpdate(database, handleDB, db, index)
            .then(() => {
              store.commit('setApplicationDatabases', db);
              eventBus.$emit('file-event', database);
            });
        }));
    }
  }
  return Promise.resolve(true);
}
