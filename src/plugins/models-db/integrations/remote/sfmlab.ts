/* eslint-disable @typescript-eslint/require-await */
import fs from 'fs';
import path from 'path';
import store from '@/store/main';
import { Integration } from '../template';
import axios from 'axios';

const url = 'https://sfmlab.com';

import { databases } from '@/plugins/models-db/init';

const sfmlabInstance = axios.create({
  method: 'get',
  baseURL: url,
  responseType: 'text',
  timeout: 10000
});

export default class SFMLab extends Integration {
  constructor() {
    super('sfmlab');
    this.initializeLocalDatabase();
  }
  async initializeLocalDatabase(): Promise<boolean> {
    const query = `CREATE TABLE IF NOT EXISTS 'models'(
      "id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "remoteId" INTEGER NOT NULL,
      "name"	TEXT NOT NULL,
      "extension"	TEXT NOT NULL,
      "path"	TEXT NOT NULL UNIQUE,
      "category"	INTEGER,
      "size" INTEGER,
      "image"	TEXT,
      "installed" INTEGER NOT NULL
    )`;
    await this.runQuery(query);
    return Promise.resolve(true);
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
  async fetchItemsFromDatabase(category?: string, page?: string): Promise<any | Error> {
    try {
      const params: any = {};
      if (category !== undefined) {
        params.category = category;
      }

      if (page !== undefined) {
        params.page = page;
      }

      const root = await sfmlabInstance.get('/', {
        params: params
      });
      const parser = new DOMParser();
      const dom = parser.parseFromString(root.data, 'text/html');

      const body = dom.querySelectorAll('.content-container .entry-content .entry-list .entry');
      const options = dom.querySelectorAll('.content-container .sidebar .panel .panel__body select#id_category option:not(:checked)');

      const models: Model[] = [];
      const categories = this.fetchCategories(options);

      body?.forEach((element: Element) => {
        const title = element.querySelector('.entry__body .entry__title a')?.innerHTML;
        const link = element.querySelector('.entry__body .entry__title a')?.getAttribute('href');
        const id = (link?.match(/\d+/) as any[])[0];
        const image = url + element.querySelector('.entry__heading a img')?.getAttribute('src');
        const category = element.querySelector('.entry__tags .entry__tag')?.innerHTML;
        models.push({
          id: Number(id),
          remoteId: Number(id),
          name: title ?? '',
          image: image,
          extension: '.max',
          category: category ?? '',
          size: 0,
          path: '',
          installed: false,
        });
      });
      // Test download
      //await this.downloadItem('');
      return {
        models: models,
        categories: categories
      };
    } catch (e) {
      if (e.code === 'ECONNABORTED') {
        store.commit('setOfflineStatus', true);
        const dbQuery = 'SELECT * FROM models';
        return new Promise((resolve, reject): void => {
          this.db.all(dbQuery as string, (err, rows) => {
            if (err) {
              reject(err);
            } else {
              const obj = {
                models: rows,
                categories: []
              };
              resolve(obj);
            }
          });
        });
      }
      console.log(e);
      return [];
    }
  }

  async login(): Promise<void> {
    try {
      const csrf = await sfmlabInstance.get('/accounts/login');
      console.log(csrf);
      const root = await sfmlabInstance.post('/accounts/login/?next=/', {
        csrfmiddlewaretoken: 'o4va504jx1VkqCKcHcHR7xyamV5tBEVYXjNySZPqB4kKdY7FwpBMwmSc3ceWI4eC',
        login: 'aks113',
        remember: true,
        password: '2GGyq9jvkYHiTjFXSq4E'
      });

      console.log(root);
    } catch (e) {
      console.log(e);
    }
  }

  fetchCategories(options: NodeListOf<Element>): Category[] {
    const categories: any[] = [];

    options?.forEach((element: any) => {
      categories.push({
        id: element.value,
        parentId: -1,
        slug: element.value,
        name: element.innerText
      });
    });
    return categories;
  }

  dynamicQueryBuilder(params: QueryParameters): string {
    throw new Error('Method not implemented.');
  }
  updateBuilder(model: Model): string {
    throw new Error('Method not implemented.');
  }
  async reindexCatalog(files: string[]): Promise<DatabaseUpdateInformation> {
    throw new Error('Method not implemented.');
  }

  async downloadItem(img: string, title: string, link: string): Promise<boolean | Error> {
    const isFolderSet = databases.get('databases.integrations.sfmlab').path !== null;

    if (!isFolderSet) {
      return Promise.reject(new Error('Path not set'));
    }

    const path = databases.get('databases.integrations.sfmlab').path ?? '';

    const download = {
      img: img,
      title: title,
      tmp: path,
      path: path,
      totalSize: 0,
      downloadedSize: 0
    };
    store.commit('addDownloadItem', download);

    const file = await axios.get('https://sfmlab.com/serve_file/30551/', {
      responseType: 'blob',
      onDownloadProgress: (progressEvent: any) => {
        const loaded = progressEvent.loaded;
        const total = progressEvent.total;
        download.totalSize = Number(total);
        download.downloadedSize = Number(loaded);

        store.commit('updateDownloadItem', download);
      }
    });
    return Promise.resolve(true);
  }
}
