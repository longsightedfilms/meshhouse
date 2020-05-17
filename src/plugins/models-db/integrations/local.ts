import fs from 'fs'
import path from 'path'
import store from '@/store/main'
import { Integration } from './template'

export default class Local extends Integration {
  constructor(name: string) {
    super(name)
  }

  initializeLocalDatabase(): Promise<Error | boolean> {
    const query = `CREATE TABLE 'models'(
      "id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "name"	TEXT NOT NULL,
      "extension"	TEXT NOT NULL,
      "path"	TEXT NOT NULL UNIQUE,
      "category"	TEXT,
      "size" INTEGER,
      "image"	TEXT
    )`

    return this.runQuery(query)
  }

  async updateDatabaseVersion(): Promise<any> {
    const fieldsQuery = `PRAGMA table_info(models)`
    const fields = await this.fetchQuery(fieldsQuery)

    const sizeFieldExists = fields.find((field: any) => field.name === 'size') !== undefined
    if (!sizeFieldExists) {
      await this.runQuery(`ALTER TABLE models ADD 'size' INTEGER`)
    }
  }

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

  fetchQuery(query: string): Promise<any> {
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

  fetchItemsRemote(params: any): Promise<boolean> {
    return Promise.resolve(true)
  }

  fetchItemsFromDatabase(query?: string): Promise<any> {
    const params = (store as any).state.controls.filters
    let dbQuery = query

    if (dbQuery === undefined) {
      dbQuery = `SELECT * FROM 'Models'`
      dbQuery += this.dynamicQueryBuilder(params.where)
      dbQuery += ` ORDER BY name COLLATE NOCASE ${params.order}`
    }

    return new Promise((resolve, reject): void => {
      this.db.all(dbQuery as string, (err, rows) => {
        if (err) {
          console.log(err)
          reject(err)
        } else {
          resolve(rows)
        }
      })
    })
  }

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

  async reindexCatalog(files: string[]): Promise<Model[]> {
    let query = `SELECT path FROM 'models'`
    const result: Model[] = await this.fetchItemsFromDatabase(query)

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
    const items = await this.fetchItemsFromDatabase(query)
    const infoUpdate = {
      count: 0,
      totalSize: 0
    }

    items.forEach((element: Model) => {
      infoUpdate.count++
      infoUpdate.totalSize += fs.statSync(element.path)['size']
    })
    return items
  }
}
