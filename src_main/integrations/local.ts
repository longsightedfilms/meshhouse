import fs from 'fs';
import path from 'path';
import { sendVuexCommit, sendRouterPush, getVuexState } from '../ipc_handlers/eventbus';
import { Integration } from './template';
import logger from '../logger';

export default class Local extends Integration {
  constructor(name: string) {
    super(name);
  }

  async initializeLocalDatabase(): Promise<boolean> {
    let query = `CREATE TABLE 'models'(
      "id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "name"	TEXT NOT NULL,
      "extension"	TEXT NOT NULL,
      "path"	TEXT NOT NULL UNIQUE,
      "category"	INTEGER,
      "size" INTEGER,
      "image"	TEXT
    )`;
    await this.runQuery(query);
    query = `CREATE TABLE 'categories'(
      "id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "parentId"	INTEGER NOT NULL,
      "slug"	TEXT NOT NULL,
      "name"	TEXT NOT NULL
    )`;
    await this.runQuery(query);

    return Promise.resolve(true);
  }

  async updateDatabaseVersion(): Promise<void> {
    const fieldsQuery = 'PRAGMA table_info(models)';
    const fields = await this.fetchQuery(fieldsQuery);

    if (fields instanceof Array) {
      const sizeFieldExists = (fields as ModelsTablePragma[])
        .find((field: ModelsTablePragma) => field.name === 'size') !== undefined;
      if (!sizeFieldExists) {
        await this.runQuery('ALTER TABLE models ADD \'size\' INTEGER');

        sendRouterPush('/updated-database');
      }

      this.updateCategoriesTable();
    }
  }

  async updateCategoriesTable(): Promise<void> {
    const query = 'PRAGMA table_info(categories)';
    const fields = await this.fetchQuery(query);

    // For some reason if running one query instead of multiple
    // not all changes are applied
    if (fields instanceof Array && fields.length === 0) {
      let query = `CREATE TABLE 'categories'(
        "id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        "parentId"	INTEGER NOT NULL,
        "slug"	TEXT NOT NULL,
        "name"	TEXT NOT NULL
      );`;
      await this.runQuery(query);
      query = 'UPDATE \'models\' SET category = NULL';
      await this.runQuery(query);
      query = 'ALTER TABLE models RENAME to tmp';
      await this.runQuery(query);
      query = `CREATE TABLE 'models'(
        "id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        "name"	TEXT NOT NULL,
        "extension"	TEXT NOT NULL,
        "path"	TEXT NOT NULL UNIQUE,
        "category"	INTEGER,
        "size" INTEGER,
        "image"	TEXT
      )`;
      await this.runQuery(query);
      query = `INSERT INTO models(name, extension, path, category, size, image)
      SELECT name, extension, path, category, size, image
      FROM 'tmp'`;
      await this.runQuery(query);
      query = 'DROP TABLE \'tmp\'';
      await this.runQuery(query);

      sendRouterPush('/updated-database');
    }
  }

  runQuery(query: string): Promise<boolean | Error> {
    return new Promise((resolve, reject): void => {
      this.db.run(query, (err: Error) => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }

  fetchQuery(query: string): Promise<Model[] | Error> {
    return new Promise((resolve, reject): void => {
      this.db.all(query, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async fetchItemsFromDatabase(query?: string, category?: number): Promise<Model[] | Error> {
    logger.info(`Fetching items from local database "${this.name}"`);
    sendVuexCommit('setLoadingStatus', false);

    const params: FiltersState = await getVuexState('state.filters');

    if (category !== undefined) {
      params.category = category;
    }

    const whereQuery = {
      name: params.search,
      extension: params.extension,
      category: params.category,
      path: ''
    };

    let dbQuery = query;

    if (dbQuery === undefined) {
      dbQuery = 'SELECT * FROM \'models\'';
      dbQuery += this.dynamicQueryBuilder(whereQuery);
      dbQuery += ` ORDER BY name COLLATE NOCASE ${params.order}`;
    }
    sendVuexCommit('setLoadingStatus', true);

    return new Promise((resolve, reject): void => {
      this.db.all(dbQuery as string, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async fetchCategories(query?: string): Promise<Category[] | Error> {
    logger.info(`Fetching categories from local database "${this.name}"`);
    let dbQuery = '';
    const category = await getVuexState('state.filters.category');

    if(query === undefined) {
      dbQuery = `SELECT * FROM 'categories' WHERE parentId = ${category} ORDER BY name ASC`;
    } else {
      dbQuery = query;
    }

    return new Promise((resolve, reject): void => {
      this.db.all(dbQuery, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  dynamicQueryBuilder(params: QueryParameters): string {
    let query = '';
    let clause = '';
    const paramsEmpty: boolean[] = [];

    for (const [key, value] of Object.entries<string | number>(params)) {
      if (
        value !== '' &&
        value !== 'all' &&
        value !== 'none' &&
        value !== null &&
        value !== -1 &&
        value !== undefined
      ) {
        paramsEmpty.push(true);
        if (key === 'name') {
          clause += `${key} LIKE '%${value}%'`;
        } else if (key === 'category') {
          clause += `${key} = ${value}`;
        } else {
          clause += `${key} = '${value}'`;
        }
        clause += ' AND ';
      } else {
        paramsEmpty.push(false);
      }
    }
    clause = clause.substr(0, clause.length - 5);
    if (paramsEmpty.includes(true) !== false) {
      query = ' WHERE ' + clause;
    }
    return query;
  }

  updateBuilder(model: Model): string {
    let query = '';

    for (const [key, value] of Object.entries(model)) {
      if (key !== 'id') {
        query += `${key} = '${value}'`;
        query += ', ';
      }
    }

    query = query.substr(0, query.length - 2);
    return query;
  }

  async reindexCatalog(files: string[]): Promise<DatabaseUpdateInformation> {
    logger.info(`Reindexing catalog "${this.name}"`);
    let query = 'SELECT path FROM \'models\'';
    const result = await this.fetchItemsFromDatabase(query);

    if (result instanceof Array) {
      const existsModelPaths: string[] = result.map((item: Model) => item.path);
      const diffInsert: string[] = [];

      files.forEach((file: string) => {
        if (!existsModelPaths.includes(file)) {
          const size = fs.statSync(file)['size'];
          diffInsert.push(
            `(null, '${path.parse(file).name}', '${
              path.parse(file).ext
            }', '${file}', '', '${size}', '')`
          );
        }
      });

      existsModelPaths.forEach((file: string) => {
        if (!files.includes(file)) {
          const query = `DELETE FROM 'models' WHERE path='${file}'`;
          this.runQuery(query).then(() => {
            return;
          });
        }
      });

      if (diffInsert.length > 0) {
        const query = `INSERT INTO 'models' VALUES ${diffInsert}`;
        await this.runQuery(query);
      }
    }

    query = 'SELECT * FROM \'models\'';

    const items = await this.fetchItemsFromDatabase(query);
    const infoUpdate: DatabaseUpdateInformation = {
      count: 0,
      totalSize: 0
    };

    if (items instanceof Array) {
      items.forEach((element: Model) => {
        infoUpdate.count++;
        infoUpdate.totalSize += fs.statSync(element.path)['size'];
      });
    }

    return infoUpdate;
  }
}
