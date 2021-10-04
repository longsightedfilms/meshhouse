import Integrations from '../integrations';
import { Integration } from '../integrations/template';
import { ipcMain } from 'electron';
import { watchDatabases } from '../integrations/functions';
import DownloadManager from '../classes/downloadManager';
import logger from '../logger';

export async function protocolDownloadHandle(id: number | string, integration: string): Promise<void> {
  const db = new Integrations[integration];
  logger.info(`Handling external URL request: Integration name - ${integration}, model id/slug - ${id}`);
  const item = await db.fetchSingleModel(id);
  await db.downloadHandle(item);
}

export default function(): void {
  ipcMain.handle('get-integration-categories', async(event, params) => {
    let db: Integration;
    let categories;
    const {
      type,
      title,
      query
    } = params;
    if (type === 'local') {
      db = new Integrations.local(title);
    } else {
      db = new Integrations[title];
    }

    if (query !== undefined) {
      categories = await db.fetchCategories(query);
    } else {
      categories = await db.fetchCategories();
    }
    return categories;
  });

  ipcMain.handle('add-category', async(event, params) => {
    let db: Integration;
    const {
      type,
      title,
      slug,
      categoryTitle,
      parentId
    } = params;

    if (type !== 'local') {
      return Promise.reject('database is not local');
    }

    try {
      db = new Integrations.local(title);
      const query = `INSERT INTO categories
      VALUES (null, ${parentId}, '${slug}', '${categoryTitle}')`;

      await db.runQuery(query);

      const categories = await db.fetchCategories();

      return categories;
    } catch (err) {
      return Promise.reject(err);
    }
  });

  ipcMain.handle('update-category', async(event, params) => {
    let db: Integration;
    const {
      type,
      title,
      slug,
      categoryTitle,
      id
    } = params;

    if (type !== 'local') {
      return Promise.reject('database is not local');
    }

    try {
      db = new Integrations.local(title);
      const query = `UPDATE categories
      SET slug = '${slug}', name = '${categoryTitle}'
      WHERE id = ${id}`;

      await db.runQuery(query);

      const categories = await db.fetchCategories();

      return categories;
    } catch (err) {
      return Promise.reject(err);
    }
  });

  ipcMain.handle('delete-category', async(event, params) => {
    let db: Integration;
    const {
      type,
      title,
      id
    } = params;

    if (type !== 'local') {
      return Promise.reject('database is not local');
    }

    try {
      db = new Integrations.local(title);
      let query = `UPDATE models
      SET category = NULL
      WHERE category in (
        SELECT id from categories
        WHERE id = ${id}
        or parentId = ${id}
      )`;

      await db.runQuery(query);

      query = `DELETE FROM categories
      WHERE id = ${id}
      OR parentId = ${id}`;

      await db.runQuery(query);

      const categories = await db.fetchCategories();

      return categories;
    } catch (err) {
      return Promise.reject(err);
    }
  });

  ipcMain.handle('watch-databases', async(event) => {
    await watchDatabases();
  });

  ipcMain.handle('get-integration-models', async(event, params) => {
    let db;
    const {
      type,
      title,
      query,
      category
    } = params;
    if (type === 'local') {
      db = new Integrations.local(title);
    } else {
      db = new Integrations[title];
    }

    const models = await db.fetchItemsFromDatabase(query, category);
    return models;
  });

  ipcMain.handle('update-item-in-integration', async(event, params) => {
    let db: Integration;
    const {
      type,
      title,
      model
    } = params;

    if (type !== 'local') {
      return Promise.reject('database is not local');
    }

    try {
      db = new Integrations.local(title);
      let query = 'UPDATE \'models\' SET ';
      query += db.updateBuilder(model);
      query += ` WHERE id = ${model.id}`;

      await db.runQuery(query);
    } catch (err) {
      return Promise.reject(err);
    }
  });

  ipcMain.handle('get-single-model-integration', async(event, params) => {
    const {
      type,
      title,
      item
    } = params;

    if (type !== 'remote') {
      return Promise.reject('database is not remote');
    }

    try {
      const db = new Integrations[title];
      const response = await db.fetchSingleModel(item.id);
      return response;
    } catch (err) {
      return Promise.reject(err);
    }
  });

  ipcMain.handle('download-handle-integration', async(event, params) => {
    const {
      type,
      title,
      item
    } = params;

    if (type !== 'remote') {
      return Promise.reject('database is not remote');
    }

    try {
      const db = new Integrations[title];
      await db.downloadHandle(item.id);
    } catch (err) {
      return Promise.reject(err);
    }
  });

  ipcMain.handle('download-item-integration', async(event, params) => {
    const {
      type,
      title,
      item,
      link
    } = params;

    if (type !== 'remote') {
      return Promise.reject('database is not remote');
    }

    try {
      const db = new Integrations[title];
      await db.downloadItem(item, link);
    } catch (err) {
      return Promise.reject(err);
    }
  });

  ipcMain.handle('update-handle-integration', async(event, params) => {
    const {
      type,
      title,
      item
    } = params;

    if (type !== 'remote') {
      return Promise.reject('database is not remote');
    }

    try {
      const db = new Integrations[title];
      await db.updateHandle(item);
    } catch (err) {
      return Promise.reject(err);
    }
  });

  ipcMain.handle('delete-item-integration', async(event, params) => {
    const {
      type,
      title,
      item
    } = params;

    if (type !== 'remote') {
      return Promise.reject('database is not remote');
    }

    try {
      const db = new Integrations[title];
      await db.deleteItem(item);
    } catch (err) {
      return Promise.reject(err);
    }
  });

  ipcMain.handle('cancel-download-item', (event, id) => {
    DownloadManager.cancelItem(id);
    return true;
  });
}
