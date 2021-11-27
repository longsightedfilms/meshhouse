import fs from 'fs';
import path from 'path';
import Integrations from './index';
import IntegrationLocal from './local';
import { Integration } from './template';
import recursive from 'recursive-readdir';
import chokidar from 'chokidar';
import { databases } from '../electron-store';
import { modelsExtensions } from '../extensions/models';
import { sendVuexCommit, sendEventBusEmit } from '../ipc_handlers/eventbus';
import logger from '../logger';

let watcher: chokidar.FSWatcher;

export const integrationsList = [
  'meshhouse',
  'sfmlab',
  'smutbase',
  'open3dlab'
];

/**
 * Returns true if is file and it has appropriate extension
 * @param file file full path
 * @param stats file stats
 */
export function filterByModels(file: string, stats: fs.Stats): boolean {
  return (
    !stats.isDirectory() && !Object.hasOwnProperty.call(modelsExtensions, path.extname(file))
  );
}

/**
 * Used by chokidar
 * @param path folder path
 */
export function generateIncludePattern(path: string): string[] {
  const array: string[] = [];

  Object.keys(modelsExtensions).forEach((extension: string) => {
    array.push(`${path}/**/*${extension}`);
  });

  return array;
}

/**
 * Find database index in persisted storage by URL
 * @param url database url or slug
 */
export function findDatabaseIndex(url: string): number {
  return databases.get('databases').local.findIndex((db: DatabaseItem) => db.url === url);
}

/**
 * Returns true if url exists in integrations list
 * @param url database url or slug
 */
export function isDatabaseRemote(url: string): boolean {
  return integrationsList.findIndex((value: string) => value === url) !== -1;
}

/**
 * Creates appropriate integration class instance
 * @param database database object or database url
 */
export function handleDatabases(database: DatabaseItem | string): Integration | IntegrationLocal | null {
  let searchableDB;

  if (typeof database === 'string') {
    if (integrationsList.findIndex((val: string) => val === database) === -1) {
      searchableDB = databases.get('databases.local')[findDatabaseIndex(database)];
    } else {
      searchableDB = databases.get(`databases.integrations.${database}`);
    }
  } else {
    searchableDB = database;
  }
  const dbType = searchableDB.localDB ? 'local' : searchableDB.url;

  if (dbType === 'meshhouse') {
    return null;
  }
  return dbType === 'local' ? new Integrations.local(searchableDB.url) : new Integrations[dbType]();
}

/**
 * Update database handler
 * @param database database object
 * @returns database update result
 */
async function handleUpdateDatabase(database: DatabaseItem): Promise<{count: number; totalsize: number}> {
  const handleDB = handleDatabases(database);

  if (handleDB !== null && handleDB instanceof IntegrationLocal) {
    await handleDB.updateDatabaseVersion();

    let totalSize = 0;
    const files = await recursive(database.path, [filterByModels]);
    await handleDB.reindexCatalog(files);
    const models = await handleDB.fetchItemsFromDatabase('SELECT * FROM \'models\'');

    if (Array.isArray(models)) {
      const promises: Promise<any>[] = [];

      models.map((model: Model) => {
        const stats = fs.statSync(model.path);
        model.size = stats['size'];
        totalSize += stats['size'];

        const query = `UPDATE models
        SET ${handleDB.updateBuilder(model)}
        WHERE id = ${model.id}`;

        promises.push(handleDB.runQuery(query));
      });

      await Promise.all(promises);

      return {
        count: models.length,
        totalsize: totalSize
      };
    }

    logger.error(models);

    return {
      count: 0,
      totalsize: 0
    };
  }

  return {
    count: 0,
    totalsize: 0
  };
}

/**
 * Apply migration to databases if needed and search new files
 */
export async function updateDatabases(): Promise<boolean> {
  const db = databases.get('databases');

  // Update model count and total size
  const promises: Promise<any>[] = [];
  for (const [index, database] of db.local.entries()) {
    promises.push(handleUpdateDatabase(database));
  }

  const results = await Promise.all(promises);

  for (const [index, database] of db.local.entries()) {
    db.local[index].count = results[index].count;
    db.local[index].totalsize = results[index].totalsize;
  }

  databases.set('databases', db);
  sendVuexCommit('setApplicationDatabases', db);
  return Promise.resolve(true);
}

/**
 * Find all files that matches extension and updates database with changes
 * @param database database item
 * @param handleDB integration object
 * @param db database persisted store
 * @param index
 */
function handleUpdate(database: DatabaseItem, handleDB: Integrations, db: any, index: number): Promise<void> {
  return recursive(database.path, [filterByModels])
    .then((files: string[]) => {
      return handleDB.reindexCatalog(files);
    })
    .then((items: DatabaseUpdateInformation) => {
      db.local[index].count = items.count;
      db.local[index].totalsize = items.totalSize;

      databases.set('databases', db);
      sendVuexCommit('setApplicationDatabases', db);
      sendEventBusEmit('file-event', database);
    });
}

/**
 * Adds FS listener on databases folders and auto-updated database
 */
export async function watchDatabases(): Promise<boolean> {
  await updateDatabases();
  const db = databases.get('databases');

  for await (const [index, database] of db.local.entries()) {
    const handleDB = handleDatabases(database);


    if (handleDB !== null) {
      const paths = generateIncludePattern(String(database.path));
      watcher = chokidar.watch(paths, {
        ignoreInitial: true,
        awaitWriteFinish: true
      });

      watcher
        .on('add', (() => {
          handleUpdate(database, handleDB, db, index)
            .then(() => {
              sendVuexCommit('setApplicationDatabases', db);
              sendEventBusEmit('file-event', database);
            });
        }))
        .on('unlink', (() => {
          handleUpdate(database, handleDB, db, index)
            .then(() => {
              sendVuexCommit('setApplicationDatabases', db);
              sendEventBusEmit('file-event', database);
            });
        }));
    }
  }
  return Promise.resolve(true);
}

/**
 * Close all FS wathers on databases folder
 */
export async function unwatchDatabases(): Promise<void> {
  await watcher.close();
}
