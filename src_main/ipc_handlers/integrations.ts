import Integrations from '../integrations';
import { Integration } from '../integrations/template';
import { ipcMain } from 'electron';
import { watchDatabases } from '../integrations/functions';

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
}
