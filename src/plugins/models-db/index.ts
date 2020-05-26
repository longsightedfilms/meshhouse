import _Vue from 'vue';
import fs from 'fs';
import path from 'path';
import { remote, shell } from 'electron';
import { spawn } from 'child_process';
import { transliterate as tr, slugify } from 'transliteration';
import store from '@/store/main';
import Integration from '@/plugins/models-db/integrations/main';
import recursive from 'recursive-readdir';
import {
  settings,
  databases,
  dcc
} from './init';

import {
  getParameterByExtension,
  filterByModels,
  modelsExtensions,
  formatBytes,
  findDatabaseIndex,
  watchDatabases
} from './functions';

import {
  initDatabases,
  initAppSettings,
  initDCCSettings,
} from './init';

initDatabases();
initAppSettings();
initDCCSettings();

export function ModelsDB(Vue: typeof _Vue): void {
  Vue.prototype.$settingsGet = function(setting: string): string {
    return settings.get(setting);
  };

  Vue.prototype.$settingsSet = function(
    key: string,
    value: string | number | boolean
  ): void {
    settings.set(key, value);
  };

  Vue.prototype.$dccGetConfig = function(): object {
    return dcc.store;
  };

  Vue.prototype.$dccSetConfig = function(config: object): void {
    dcc.store = config;
  };

  Vue.prototype.$stringToSlug = function(str: string): string {
    return slugify(str);
  };

  Vue.prototype.$returnHumanLikeExtension = function(
    extension: string
  ): string {
    return modelsExtensions[extension].title;
  };

  Vue.prototype.$forceReloadImage = function(image: string): string {
    return image !== '' ? image + '?v=' + store.state.controls.imageRandomizer : image;
  };

  Vue.prototype.$addDatabase = async function(db: DatabaseItem): Promise<void> {
    const file = path.join(
      remote.app.getPath('userData'),
      `/databases/${db.url}.sqlite3`
    );

    if (!fs.existsSync(file)) {
      const database = new Integration.local(db.url);
      await database.initializeLocalDatabase();

      return this.$indexFolderRecursive(db.path).then((files: string[]) => {
        const models: string[] = [];
        let totalSize = 0;
        files.forEach((file: string) => {
          const size = fs.statSync(file)['size'];
          totalSize += size;
          models.push(
            `(null, '${path.parse(file).name}', '${
              path.parse(file).ext
            }', '${file}', '', '${size}','')`
          );
        });

        const query = `INSERT INTO 'models' VALUES ${models}`;
        database.runQuery(query).then(() => {
          const list = databases.get('databases');
          if (list) {
            db.count = models.length;
            db.totalsize = totalSize;
            databases.set('databases', list.concat(db));
          }
          store.commit('setApplicationDatabases', databases.get('databases'));
        });
      });
    } else {
      return Promise.reject('Database exists');
    }
  };

  Vue.prototype.$reindexCatalog = function(db: DatabaseItem): Promise<void> {
    store.commit('setLoadingStatus', false);
    const database = new Integration.local(db.url);

    return this.$indexFolderRecursive(db.path)
      .then((files: string[]) => {
        return database.reindexCatalog(files).then((items: DatabaseUpdateInformation) => {
          const list = databases.get('databases');
          const dbIndex = findDatabaseIndex(db.url);
          if (list) {
            list[dbIndex].count = items.count;
            list[dbIndex].totalsize = items.totalSize;
            databases.set('databases', list);
          }
          store.commit('setApplicationDatabases', databases.get('databases'));
          store.commit('setLoadingStatus', true);
        });
      });
  };

  Vue.prototype.$updateItemInDatabase = function(
    dbName: string,
    model: Model
  ): Promise<void> {
    const database = new Integration.local(dbName);

    let query = 'UPDATE \'models\' SET ';
    query += database.updateBuilder(model);
    query += ` WHERE id = ${model.id}`;

    return database.runQuery(query);
  };

  Vue.prototype.$editDatabase = function(
    database: string,
    setting: string,
    value: string
  ): Promise<boolean> {
    databases.set(`databases.${database}.${setting}`, value);
    store.commit('setApplicationDatabases', databases.get('databases'));
    return Promise.resolve(true);
  };

  Vue.prototype.$deleteDatabase = function(database: string): Promise<boolean> {
    return Promise.resolve(true);
  };

  Vue.prototype.$watchDatabases = async function(): Promise<void> {
    await watchDatabases();
  };

  Vue.prototype.$indexFolderRecursive = function(
    folder: string
  ): Promise<string[]> {
    return recursive(folder, [filterByModels]);
  };

  Vue.prototype.$openItem = function(file: string): void {
    const extension = path.extname(file);
    if (getParameterByExtension(extension, 'useSystemAssociation')) {
      shell.openItem(path.normalize(file));
    } else {
      spawn(getParameterByExtension(extension, 'customPath'), [
        path.normalize(file),
      ]);
    }
  };

  Vue.prototype.$openFolder = function(folder: string): void {
    shell.showItemInFolder(path.normalize(folder));
  };

  Vue.prototype.$openPropertiesModal = async function(
    model: Model
  ): Promise<boolean> {
    const properties: ImageProperties = {
      imageChanged: false,
      ...model
    };

    store.commit('setProperties', properties);

    return Promise.resolve(true);
  };

  Vue.prototype.$formatSize = function(size: number): string {
    return formatBytes(size);
  };
}
