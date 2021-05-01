import { app } from 'electron';
import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';
import logger from '../logger';

export abstract class Integration {
  directory = path.join(app.getPath('userData'), '/databases/')
  db: sqlite3.Database
  name = ''

  constructor(name: string) {
    if (!fs.existsSync(this.directory)) {
      fs.mkdirSync(this.directory);
    }
    this.name = name;
    this.db = sqlite3.cached.Database(path.resolve(`${this.directory}`, `${name}.sqlite3`));
  }

  /**
   * Initializing default 'models' table
   */
  abstract initializeLocalDatabase(): Promise<Error | boolean>
  /**
   * Run query without rows feedback
   * @param query - query string
   */
  runQuery(query: string): Promise<boolean | Error> {
    return new Promise((resolve, reject): void => {
      this.db.run(query, (err: Error) => {
        if (err) {
          logger.error(err);
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }
  /**
   * Run query with rows feedback
   * @param query - query string
   */
  fetchQuery(query: string): Promise<Model[] | Error> {
    return new Promise((resolve, reject): void => {
      this.db.all(query, (err, rows) => {
        if (err) {
          logger.error(err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
  /**
   * Closing database descriptor
   */
  closeDatabase(): Promise<void | Error> {
    return new Promise((resolve, reject): void => {
      this.db.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
  abstract fetchCategories(query?: string): Promise<Category[] | Error>
  /**
   * Get all items from database
   * @param query - query string
   */
  abstract fetchItemsFromDatabase(query: string): Promise<IntegrationFetch | Error>
  /**
   * Dynamic SQL query builder if user set filters
   * @param params - query object
   */
  abstract dynamicQueryBuilder(params: QueryParameters): string
  /**
   * Destructurize model object to SQL 'UPDATE' string
   * @param model - model object
   */
  abstract updateBuilder(model: Model): string
  /**
   * Incremental reindex catalog (inserts only difference)
   * @param files - files array
   */
  abstract reindexCatalog(files: string[]): Promise<DatabaseUpdateInformation>
}
