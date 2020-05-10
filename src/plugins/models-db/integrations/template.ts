import { remote } from 'electron'
import fs from 'fs'
import path from 'path'
import sqlite3 from 'sqlite3'

export abstract class Integration {
  directory = path.join(remote.app.getPath('userData'), '/databases/')
  db: sqlite3.Database

  constructor(name: string) {
    if (!fs.existsSync(this.directory)) {
      fs.mkdirSync(this.directory)
    }
    this.db = new (sqlite3.cached.Database as any)(
      path.resolve(`${this.directory}`, `${name}.sqlite3`)
    )
  }

  /**
   * Initializing default 'models' table
   */
  abstract initializeLocalDatabase(): Promise<Error | boolean>
  /**
   * Run query without rows feedback
   * @param query - query string
   */
  abstract runQuery(query: string): Promise<any>
  /**
   * Get all items from remote site
   * @param params - any parameters
   */
  abstract fetchItemsRemote(params: any): Promise<any>
  /**
   * Get all items from database
   * @param query - query string
   */
  abstract fetchItemsFromDatabase(query: string): Promise<any>
  /**
   * Dynamic SQL query builder if user set filters
   * @param params - query object
   */
  abstract dynamicQueryBuilder(params: any): string
  /**
   * Destructurize model object to SQL 'UPDATE' string
   * @param model - model object
   */
  abstract updateBuilder(model: Model): string
  /**
   * Incremental reindex catalog (inserts only difference)
   * @param files - files array
   */
  abstract async reindexCatalog(files: string[]): Promise<any>
}
