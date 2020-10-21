/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/camelcase */
declare const __static: string;

import eventBus from '@/eventBus';
import fs from 'fs';
import path from 'path';
import notifier from 'node-notifier';
import store from '@/store/main';
import { Integration } from '../../template';
import axios, { AxiosInstance } from 'axios';
import { i18n } from '@/locales/i18n';
import sanitize from 'sanitize-filename';
import { ipcRenderer } from 'electron';

import { databases } from '@/plugins/models-db/init';
import {
  isDBModel
} from '@/functions/databases';
import { installFile } from '@/functions/archive';
import { createOSNotification } from '@/functions/notifier';
import { setTimeout } from 'timers';

/**
 * SFMLab-based site integration class
 * @param slug Site slug
 * @param name Site full name
 * @param url Site URL
 */
export default class SFMLabBaseIntegration extends Integration {
  /**
   * Site slug
   */
  slug = '';
  /**
   * Site full title
   */
  name = '';
  /**
   * Site base url (ex. https://example.com)
   */
  url = '';
  /**
   * Base axios instance
   */
  sfmlabInstance: AxiosInstance

  constructor(slug: string, name: string) {
    super(slug);
    this.slug = slug;
    this.name = name;

    this.sfmlabInstance = axios.create({
      baseURL: 'https://proxy-api.meshhouse.art',
      responseType: 'text',
      timeout: 10000,
    });

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
      const params: SFMLabParams = {};
      if (filters.where.category !== -1) {
        params.category = String(filters.where.category);
      }

      if (filters.where.license !== -1) {
        params.license = filters.where.license;
      }

      if (filters.order === 'DESC') {
        params.order_by = 'created';
      }

      if (page !== undefined) {
        params.page = Number(page);
      }

      if (filters.where.name !== '') {
        params.search_text = filters.where.name;
      }
      store.commit('setOfflineStatus', false);
      store.commit('setLoadingStatus', false);

      const fetch: SFMLabFetch = (await this.sfmlabInstance.get(`/integrations/${this.slug}/models`, {
        params: params
      })).data;

      const models: Model[] = [];

      for (const model of fetch.models) {
        const dbQuery = `SELECT * FROM models WHERE remoteId=${model.id}`;
        const item = (await this.fetchQuery(dbQuery) as Model[]);

        model.remoteId = model.id;
        model.size = item.length !== 0 ? item[0].size : 0;
        model.folderPath = item.length !== 0 ? item[0].folderPath : '';
        model.path = item.length !== 0 ? item[0].path : '';
        model.installed = item.length !== 0;

        models.push(model);
      }
      return {
        models: models,
        categories: fetch.categories,
        licenses: fetch.licenses,
        totalPages: fetch.totalPages
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

  async fetchSingleModel(model: Model): Promise<void | Error> {
    try {
      store.commit('setOfflineStatus', false);
      store.commit('setLoadingStatus', false);
      const fetch = await this.sfmlabInstance.get(`/integrations/${this.slug}/models/${model.id}`);
      const item = fetch.data;
      const installed = await this.checkIsInstalledModel(model.id);

      item.installed = installed;
      item.remoteId = item.id;

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

  dynamicQueryBuilder(params: QueryParameters): string {
    throw new Error('Method not implemented.');
  }
  updateBuilder(model: Model): string {
    throw new Error('Method not implemented.');
  }
  async reindexCatalog(files: string[]): Promise<DatabaseUpdateInformation> {
    throw new Error('Method not implemented.');
  }

  async deleteItem(item: Model): Promise<boolean | Error> {
    // Check if temp folder exists
    if (fs.existsSync(item.path)) {
      fs.rmdirSync(item.path, { recursive: true });
    }
    const dbQuery = `DELETE FROM 'models' WHERE remoteId=${item.remoteId}`;

    await this.runQuery(dbQuery);
    // Update databases record
    const db = databases.get(`databases.integrations.${this.slug}`);
    db.totalsize -= item.size ?? 0;
    db.count--;

    databases.set(`databases.integrations.${this.slug}`, db);
    store.commit('setApplicationDatabases', databases.get('databases'));
    store.commit('setCurrentDatabase', store.state.db.currentDB?.url ?? this.slug);
    eventBus.emit('item-deleted');

    const notifierObject = {
      appName: 'com.longsightedfilms.meshhouse',
      title: i18n.t('notifications.delete.title', { site: this.name }).toString(),
      message: i18n.t('notifications.delete.text', { title: item.name }).toString(),
      icon: path.join(__static, '../build/icons', '512x512.png'),
      wait: true
    };
    notifier.notify(notifierObject);

    return Promise.resolve(true);
  }

  async downloadHandle(item: Model): Promise<void | Error> {
    try {
      let links: SFMLabLink[] | undefined = undefined;
      if (!Object.hasOwnProperty.call(item, 'downloadLinks')) {
        await this.fetchSingleModel(item);
        links = store.state.controls.properties.downloadLinks;
      } else {
        links = item.downloadLinks;
      }

      if (links !== undefined) {
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
      let links: SFMLabLink[] | undefined = undefined;
      if (!Object.hasOwnProperty.call(item, 'downloadLinks')) {
        await this.fetchSingleModel(item);
        links = store.state.controls.properties.downloadLinks;
      } else {
        links = item.downloadLinks;
      }

      if (links !== undefined) {
        if (links.length > 1) {
          eventBus.emit('multiple-links');
          store.commit('setDownloadLinks', links);
        } else {
          // Notify when downloaded
          const notifierObject = {
            appName: 'com.longsightedfilms.meshhouse',
            title: i18n.t('notifications.update.title', { site: this.name }).toString(),
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
    let isNewModel = true;
    const isFolderSet = databases.get(`databases.integrations.${this.slug}`).path !== null;

    if (!isFolderSet) {
      return Promise.reject(new Error('Path not set'));
    }

    const cancelToken = axios.CancelToken.source();

    const download = {
      img: item.images !== undefined ? item.images[0] : '',
      title: item.name,
      path: path.join(databases.get(`databases.integrations.${this.slug}`).path, sanitize(item.name)),
      totalSize: 0,
      downloadedSize: 0,
      startedAt: new Date(),
      cancelToken: cancelToken
    };
    store.commit('addDownloadItem', download);

    try {
      ipcRenderer.send('set-window-progress', 2);

      const link = downloadLink.link;
      const filename = downloadLink.filename;

      const file: Blob = (await this.sfmlabInstance.get(link, {
        cancelToken: cancelToken.token,
        responseType: 'blob',
        timeout: 0,
        onDownloadProgress: (progressEvent) => {
          const loaded = Number(progressEvent.loaded);
          const total = Number(progressEvent.total);
          download.totalSize = Number(total);
          download.downloadedSize = Number(loaded);

          store.commit('updateDownloadItem', download);

          const percents = Math.round((loaded / total) * 100) / 100;

          ipcRenderer.send('set-window-progress', percents);
        }
      })).data;

      ipcRenderer.send('set-window-progress', 2);
      // Unpack archive in folder
      await installFile(file, item, filename, this.slug);

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
          isNewModel = false;
        }
      }

      // Notify when downloaded
      createOSNotification(
        i18n.t('notifications.download.title', { site: this.name }).toString(),
        i18n.t('notifications.download.text', { title: item.name }).toString()
      );
      eventBus.emit('download-completed');

      // Update databases record
      const db = databases.get(`databases.integrations.${this.slug}`);
      db.totalsize += download.totalSize;

      if (isNewModel) {
        db.count++;
      }

      databases.set(`databases.integrations.${this.slug}`, db);
      store.commit('setApplicationDatabases', databases.get('databases'));
      store.commit('setCurrentDatabase', store.state.db.currentDB?.url ?? this.slug);

      ipcRenderer.send('set-window-progress', -1);

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
