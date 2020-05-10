import { remote } from 'electron'
import fs from 'fs'
import path from 'path'
import sqlite3 from 'sqlite3'

type QueryParameters = {
  category: string;
  extension: string;
  name: string;
  path: string;
}

export default class Database {
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
  createTable(): Promise<Error | boolean> {
    const query = `CREATE TABLE 'models'(
      "id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "name"	TEXT NOT NULL,
      "extension"	TEXT NOT NULL,
      "path"	TEXT NOT NULL UNIQUE,
      "category"	TEXT,
      "size" TEXT,
      "image"	TEXT
    )`

    return this.runQuery(query)
  }
  /**
   * Run query without rows feedback
   * @param query - query string
   */
  runQuery(query: string): Promise<any> {
    return new Promise((resolve, reject): void => {
      this.db.run(query, (err: Error) => {
        if (err) {
          console.log(err)
          reject(err)
        } else {
          resolve(true)
        }
      })
    })
  }
  /**
   * Get all items from database
   * @param query - query string
   */
  getAllFromDatabase(query: string): Promise<any> {
    return new Promise((resolve, reject): void => {
      this.db.all(query, (err, rows) => {
        if (err) {
          console.log(err)
          reject(err)
        } else {
          resolve(rows)
        }
      })
    })
  }
  /**
   * Dynamic SQL query builder if user set filters
   * @param params - query object
   */
  dynamicQueryBuilder(params: QueryParameters): string {
    let query = ''
    let clause = ''
    const paramsEmpty: boolean[] = []

    for (const [key, value] of Object.entries(params)) {
      if (
        value !== '' &&
        value !== 'all' &&
        value !== 'none' &&
        value !== null &&
        value !== undefined
      ) {
        paramsEmpty.push(true)
        if (key === 'name') {
          clause += `${key} LIKE '%${value}%'`
        } else {
          clause += `${key} = '${value}'`
        }
        clause += ` AND `
      } else {
        paramsEmpty.push(false)
      }
    }
    clause = clause.substr(0, clause.length - 5)
    if (paramsEmpty.includes(true) !== false) {
      query = ' WHERE ' + clause
    }
    return query
  }
  /**
   * Destructurize model object to SQL 'UPDATE' string
   * @param model - model object
   */
  updateBuilder(model: Model): string {
    let query = ''

    for (const [key, value] of Object.entries(model)) {
      if (key !== 'id') {
        query += `${key} = '${value}'`
        query += ', '
      }
    }

    query = query.substr(0, query.length - 2)
    return query
  }
  /**
   * Incremental reindex catalog (inserts only difference)
   * @param files - files array
   */
  async reindexCatalog(files: string[]): Promise<any> {
    let query = `SELECT path FROM 'models'`
    const result: Model[] = await this.getAllFromDatabase(query)

    const res = result.map((item: Model) => item.path)
    const diff: string[] = []
    files.forEach((file: string) => {
      if (!res.includes(file)) {
        const size = fs.statSync(file)['size']
        diff.push(
          `(null, '${path.parse(file).name}', '${
            path.parse(file).ext
          }', '${file}', '', '${size}', '')`
        )
      }
    })
    if (diff.length > 0) {
      const query = `INSERT INTO 'models' VALUES ${diff}`
      this.runQuery(query)
    }

    query = `SELECT size FROM 'models'`
    const items = await this.getAllFromDatabase(query)
    const infoUpdate = {
      count: 0,
      totalSize: 0
    }

    items.forEach((element: Model) => {
      infoUpdate.count++
      infoUpdate.totalSize += parseInt(element.size)
    })
    return items
  }
}
