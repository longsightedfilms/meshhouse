/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/camelcase */
declare const __static: string;

import eventBus from '@/eventBus';
import fs from 'fs';
import path from 'path';
import notifier from 'node-notifier';
import store from '@/store/main';
import { Integration } from '../template';
import axios from 'axios';
import { i18n } from '@/locales/i18n';

import sanitize from 'sanitize-filename';

const url = 'https://open3dlab.com/';

import { databases } from '@/plugins/models-db/init';
import { installFile } from '@/functions/archive';

import {
  isDownloadLink,
  isDBModel
} from '@/functions/databases';

axios.defaults.withCredentials = true;

const open3dLabInstance = axios.create({
  baseURL: url,
  responseType: 'text',
  timeout: 10000,
  withCredentials: true,
});

export default class SFMLab extends Integration {
  constructor() {
    super('open3dlab');
    this.initializeLocalDatabase();
  }
  async initializeLocalDatabase(): Promise<boolean> {
    const query = `CREATE TABLE IF NOT EXISTS 'models'(
      "id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "remoteId" INTEGER NOT NULL,
      "name"	TEXT NOT NULL,
      "extension"	TEXT NOT NULL,
      "folderPath" TEXT NOT NULL,
      "path"	TEXT NOT NULL UNIQUE,
      "category"	TEXT NOT NULL,
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

  async checkIsInstalledModel(id: number): Promise<boolean | Error> {
    try {
      const dbQuery = `SELECT * FROM models WHERE remoteId=${id}`;
      const item = (await this.fetchQuery(dbQuery) as Model[]);
      return Promise.resolve(item.length > 0);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async fetchItemsFromDatabase(page?: string): Promise<SFMLabFetch | Error> {
    try {
      const filters = store.state.controls.filters;
      const params: any = {};
      if (filters.where.category !== -1) {
        params.category = filters.where.category;
      }

      if (filters.where.license !== -1) {
        params.license = filters.where.license;
      }

      if (filters.order === 'DESC') {
        params.order_by = 'created';
      }

      if (page !== undefined) {
        params.page = page;
      }

      if (filters.where.name !== '') {
        params.search_text = filters.where.name;
      }
      store.commit('setOfflineStatus', false);
      store.commit('setLoadingStatus', false);

      const root = await open3dLabInstance.get('/', {
        params: params,
        withCredentials: true
      });

      const parser = new DOMParser();
      const dom = parser.parseFromString(root.data, 'text/html');

      const body = dom.querySelectorAll('.content-container .entry-content .entry-list .entry');
      const options = dom.querySelectorAll('.content-container .sidebar .panel .panel__body select#id_category option');
      const lics = dom.querySelectorAll('.content-container .sidebar .panel .panel__body select#id_license option');

      const paginator = dom.querySelector('.content-container .pagination');

      const models: Model[] = [];
      const licenses = this.fetchLicenses(lics);
      const categories = this.fetchCategories(options);
      const lastPage = this.detectLastPage(paginator);

      for (const element of body) {
        const title = element.querySelector('.entry__body .entry__title a')?.innerHTML;
        const link = element.querySelector('.entry__body .entry__title a')?.getAttribute('href');
        const id = (link?.match(/\d+/) as string[])[0];
        const image = element.querySelector('.entry__heading a img')?.getAttribute('src') || '';
        const category = element.querySelector('.entry__tags .entry__tag')?.innerHTML;

        const dbQuery = `SELECT * FROM models WHERE remoteId=${id}`;
        const item = (await this.fetchQuery(dbQuery) as Model[]);

        models.push({
          id: Number(id),
          remoteId: Number(id),
          name: title ?? '',
          image: image,
          extension: '.sfm',
          category: category ?? '',
          size: item.length !== 0 ? item[0].size : 0,
          folderPath: item.length !== 0 ? item[0].folderPath : '',
          path: item.length !== 0 ? item[0].path : '',
          installed: item.length !== 0,
        });
      }
      return {
        models: models,
        categories: categories,
        licenses: licenses,
        totalPages: lastPage
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
                categories: [],
                licenses: [],
                totalPages: 1
              };
              resolve(obj);
            }
          });
        });
      }
      console.log(e);
      return {
        models: [],
        categories: [],
        licenses: [],
        totalPages: 0
      };
    } finally {
      store.commit('setLoadingStatus', true);
    }
  }

  async fetchSingleModel(model: Model): Promise<any | Error> {
    try {
      store.commit('setOfflineStatus', false);
      store.commit('setLoadingStatus', false);
      const root = await open3dLabInstance.get(`/project/${model.id}`);
      const parser = new DOMParser();
      const dom = parser.parseFromString(root.data, 'text/html');

      const title = dom.querySelector('.container h1#file_title')?.innerHTML;
      const description = dom.querySelector('.content-container .main-upload .panel .panel__body')?.innerHTML;
      const fileSize = dom.querySelector('.content-container .main-upload table tbody tr td:last-child')?.innerHTML;
      const domImages = dom.querySelectorAll('.content-container .main-upload .text-center a picture.project-detail-image-main img');

      const images: string[] = [];

      domImages.forEach((element: Element) => {
        images.push(`${element.getAttribute('src')}`);
      });
      if (domImages.length === 0) {
        const thubmnail = dom.querySelector('.content-container .side-upload .panel .panel__body img')?.getAttribute('src');
        images.push(`${thubmnail}`);
      }

      const installed = await this.checkIsInstalledModel(model.id);

      const item = {
        id: model.id,
        remoteId: model.id,
        title: title,
        description: description,
        images: images,
        size: fileSize,
        installed: installed
      };

      store.commit('setProperties', item);
    } catch (e) {
      if (e.code === 'ECONNABORTED') {
        store.commit('setOfflineStatus', true);
        return Promise.reject(e);
      }
    } finally {
      store.commit('setLoadingStatus', true);
    }
  }

  fetchLicenses(options: NodeListOf<Element>): SFMLabLicense[] {
    const licenses: SFMLabLicense[] = [];

    options?.forEach((element: any) => {
      if (element.innerText !== '---------') {
        licenses.push({
          id: element.value,
          name: element.innerText
        });
      }
    });
    return licenses;
  }

  fetchCategories(options: NodeListOf<Element>): Category[] {
    const categories: Category[] = [];

    options?.forEach((element: any) => {
      if (element.innerText !== '---------') {
        categories.push({
          id: element.value,
          parentId: -1,
          slug: element.value,
          name: element.innerText
        });
      }
    });
    return categories;
  }

  detectLastPage(paginator: Element | null): number {
    const activeLink = paginator?.querySelector('li.active a')?.innerHTML;
    const lastLink = paginator?.querySelector('li.last a')?.getAttribute('href');

    return lastLink !== null
      ? Number(lastLink?.split('page=')[1])
      : Number(activeLink);
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

  async fetchDownloadLink(projectID: number): Promise<SFMLabLink[] | Error> {
    store.commit('setLoadingStatus', false);
    try {
      const root = await open3dLabInstance.get(`/project/${projectID}/`);
      const parser = new DOMParser();
      const dom = parser.parseFromString(root.data, 'text/html');

      const links = dom.querySelectorAll('.content-container .main-upload table tbody tr td a:first-child');

      const filename = dom.querySelectorAll('.content-container .main-upload table tbody tr td .js-edit-input__wrapper strong');

      if (links !== null) {
        store.commit('setLoadingStatus', true);
        const linksArray = [];

        for (let i = 0; i < links.length; i++) {
          const downloadPage = await open3dLabInstance.get((links[i].getAttribute('href') as string));
          const dom = parser.parseFromString(downloadPage.data, 'text/html');

          const downloadLink = dom.querySelector('.content-container .main-upload .project-description-div p a');

          if (downloadLink !== null) {
            linksArray.push({
              link: downloadLink.getAttribute('href') || '',
              filename: filename[i].innerHTML || ''
            });
          }
        }

        return linksArray;
      }
    } catch (e) {
      store.commit('setLoadingStatus', true);
      return Promise.reject(new Error(e));
    }
    return [
      {
        link: '',
        filename: ''
      }
    ];
  }

  async deleteItem(item: Model): Promise<boolean | Error> {
    // Check if temp folder exists
    if (fs.existsSync(item.path)) {
      fs.rmdirSync(item.path, { recursive: true });
    }
    const dbQuery = `DELETE FROM 'models' WHERE remoteId=${item.remoteId}`;

    await this.runQuery(dbQuery);
    // Update databases record
    const db = databases.get('databases.integrations.open3dlab');
    db.totalsize -= item.size ?? 0;
    db.count--;

    databases.set('databases.integrations.open3dlab', db);
    store.commit('setApplicationDatabases', databases.get('databases'));
    store.commit('setCurrentDatabase', store.state.db.currentDB?.url ?? 'sfmlab');
    eventBus.emit('item-deleted');

    const notifierObject = {
      appName: 'com.longsightedfilms.meshhouse',
      title: i18n.t('notifications.delete.title', { site: 'Open3DLab' }).toString(),
      message: i18n.t('notifications.delete.text', { title: item.name }).toString(),
      icon: path.join(__static, '../build/icons', '512x512.png'),
      wait: true
    };
    notifier.notify(notifierObject);

    return Promise.resolve(true);
  }

  async downloadHandle(item: Model): Promise<void | Error> {
    try {
      const links = await this.fetchDownloadLink(item.remoteId || 0);
      if (isDownloadLink(links)) {
        if (links.length > 1) {
          eventBus.emit('multiple-links');
          store.commit('setDownloadLinks', links);
        } else {
          await this.downloadItem(item, links[0]);
        }
      }
    } catch (e) {
      console.log(e);
      return Promise.reject(new Error(e));
    }
  }


  async updateHandle(item: Model): Promise<void | Error> {
    try {
      const links = await this.fetchDownloadLink(item.remoteId || 0);
      if (isDownloadLink(links)) {
        if (links.length > 1) {
          eventBus.emit('multiple-links');
          store.commit('setDownloadLinks', links);
        } else {
          // Notify when downloaded
          const notifierObject = {
            appName: 'com.longsightedfilms.meshhouse',
            title: i18n.t('notifications.update.title', { site: 'SFMLab' }).toString(),
            message: i18n.t('notifications.update.text', { title: item.name }).toString(),
            icon: path.join(__static, '../build/icons', '512x512.png'),
            wait: true
          };
          notifier.notify(notifierObject);
        }
      }
    } catch (e) {
      console.log(e);
      return Promise.reject(new Error(e));
    }
  }

  async downloadItem(item: Model, downloadLink: SFMLabLink): Promise<boolean | Error> {
    const isFolderSet = databases.get('databases.integrations.open3dlab').path !== null;

    if (!isFolderSet) {
      return Promise.reject(new Error('Path not set'));
    }

    const cancelToken = axios.CancelToken.source();

    const download = {
      img: item.image,
      title: item.name,
      path: path.join(databases.get('databases.integrations.open3dlab').path, sanitize(item.name)),
      totalSize: 0,
      downloadedSize: 0,
      startedAt: new Date(),
      cancelToken: cancelToken
    };
    store.commit('addDownloadItem', download);

    try {
      const link = downloadLink.link;
      const filename = downloadLink.filename;

      const file: Blob = (await open3dLabInstance.get(link, {
        cancelToken: cancelToken.token,
        responseType: 'blob',
        timeout: 0,
        onDownloadProgress: (progressEvent) => {
          const loaded = progressEvent.loaded;
          const total = progressEvent.total;
          download.totalSize = Number(total);
          download.downloadedSize = Number(loaded);

          store.commit('updateDownloadItem', download);
        }
      })).data;
      // Unpack archive in folder
      await installFile(file, item, filename, 'open3dlab');

      // Check if file exists in DB and update it
      const checkQuery = `SELECT * FROM 'models'
        WHERE remoteId=${item.id}
      `;

      const result = await this.fetchQuery(checkQuery);

      if (isDBModel(result)) {
        if (result.length === 0) {
          const dbQuery = `INSERT INTO 'models' VALUES
          (null, ${item.id}, '${item.name}', '${item.extension}', '${download.path}',
          '${download.path}', '${item.category}', ${download.totalSize}, '${item.image}', 1)`;

          await this.runQuery(dbQuery);
        } else {
          const totalSize = (result[0].size || 0) + download.totalSize;
          const updateQuery = `UPDATE 'models'
            SET size=${totalSize}
            WHERE remoteId=${result[0].remoteId}
          `;
          await this.runQuery(updateQuery);
        }
      }

      // Notify when downloaded
      const notifierObject = {
        appName: 'com.longsightedfilms.meshhouse',
        title: i18n.t('notifications.download.title', { site: 'Open3DLab' }).toString(),
        message: i18n.t('notifications.download.text', { title: item.name }).toString(),
        icon: path.join(__static, '../build/icons', '512x512.png'),
        wait: true
      };
      notifier.notify(notifierObject);
      eventBus.emit('download-completed');

      // Update databases record
      const db = databases.get('databases.integrations.open3dlab');
      db.totalsize += download.totalSize;
      db.count++;

      databases.set('databases.integrations.open3dlab', db);
      store.commit('setApplicationDatabases', databases.get('databases'));
      store.commit('setCurrentDatabase', store.state.db.currentDB?.url ?? 'open3dlab');

      return Promise.resolve(true);
    } catch (e) {
      if (axios.isCancel(e)) {
        return Promise.resolve(true);
      } else {
        console.log(e);
        download.totalSize = -1;
        download.downloadedSize = -1;
        store.commit('updateDownloadItem', download);
        return Promise.reject(new Error(e));
      }
    }
  }
}
