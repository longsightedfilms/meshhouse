import fs from 'fs';
import path from 'path';
import { ipcMain, app } from 'electron';
import * as ApplicationStore from '../electron-store';
import { sendVuexCommit } from './eventbus';
import Integrations from '../integrations';
import { recursiveIndexFolder } from '../functions/fs';
import { unwatchDatabases, watchDatabases, handleDatabases } from '../integrations/functions';

export default function(): void {
  ipcMain.on('get-application-setting', (event, key) => {
    const setting = ApplicationStore.settings.get(key);
    event.returnValue = setting;
  });

  ipcMain.handle('get-application-setting', (event, key) => {
    return ApplicationStore.settings.get(key);
  });

  ipcMain.on('get-all-settings', (event) => {
    const settings = ApplicationStore.settings.store;
    event.returnValue = settings;
  });

  ipcMain.handle('get-all-settings', () => {
    return ApplicationStore.settings.store;
  });

  ipcMain.handle('set-application-setting', (event, params) => {
    const { key, value } = params;
    ApplicationStore.settings.set(key, value);
  });

  ipcMain.on('get-all-dcc-settings', (event) => {
    const settings = ApplicationStore.dcc.store;
    event.returnValue = settings;
  });

  ipcMain.on('get-dcc-setting', (event, key) => {
    const setting = ApplicationStore.dcc.get(key);
    event.returnValue = setting;
  });

  ipcMain.handle('set-all-dcc-settings', (event, store) => {
    ApplicationStore.dcc.store = store;
  });

  ipcMain.handle('set-dcc-setting', (event, params) => {
    const { key, value } = params;
    ApplicationStore.dcc.set(key, value);
  });

  ipcMain.on('get-database', (event, key) => {
    const db = ApplicationStore.databases.get(key);
    event.returnValue = db;
  });

  ipcMain.handle('set-database', (event, params) => {
    const { key, value } = params;
    ApplicationStore.databases.set(key, value);
  });

  ipcMain.handle('set-all-databases', (event, state) => {
    ApplicationStore.databases.store = state;
  });

  ipcMain.handle('add-database', async(event, db) => {
    const file = path.join(
      app.getPath('userData'),
      `/databases/${db.url}.sqlite3`
    );

    if (!fs.existsSync(file)) {
      const database = new Integrations.local(db.url);
      await database.initializeLocalDatabase();

      const files = await recursiveIndexFolder(db.path);

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

      if (models.length > 0) {
        const query = `INSERT INTO 'models' VALUES ${models}`;
        await database.runQuery(query);
      }

      const list = ApplicationStore.databases.get('databases.local');
      if (list) {
        db.count = models.length;
        db.totalsize = totalSize;
        ApplicationStore.databases.set('databases.local', list.concat(db));
      }
      sendVuexCommit('setApplicationDatabases', ApplicationStore.databases.get('databases'));

      await unwatchDatabases();
      await watchDatabases();

      return Promise.resolve(true);
    } else {
      return Promise.reject('Database exists');
    }
  });

  ipcMain.handle('init-databases', () => {
    ApplicationStore.initDatabases();
  });

  ipcMain.handle('handle-databases', (event, db) => {
    return handleDatabases(db);
  });
}
