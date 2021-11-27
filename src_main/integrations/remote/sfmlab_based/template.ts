/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/camelcase */

import fs from 'fs';
import path from 'path';
import got from 'got';
import type { Got, Options, CancelableRequest } from 'got';
import sanitize from 'sanitize-filename';
import { appWin as windowInstance } from '../../../background';
import { Integration } from '../../template';
import * as ApplicationStore from '../../../electron-store';
import {
  sendVuexCommit,
  getVuexState,
  sendEventBusEmit,
  getLocalizedString
} from '../../../ipc_handlers/eventbus';

import {
  isDBModel
} from '../../../functions/databases';
import { installFile } from '../../../functions/archive';
import { createOSNotification } from '../../../functions/notifier';
import uniqid from 'uniqid';
import logger from '../../../logger';
import Favorite from '../../../classes/favorites';
import DownloadManager from '../../../classes/downloadManager';


function getBaseURL(): string {
  return ApplicationStore.settings.get('integrations.proxy.customProxy')
    ? ApplicationStore.settings.get('integrations.proxy.url')
    : 'https://proxy-api.meshhouse.art';
}

function isMatureContentVisible(): boolean {
  return ApplicationStore.settings.get('integrations.sfmlab.showMatureContent') ?? false;
}

function generateUniqueId(): string {
  return uniqid('download-');
}

async function sfmlabRequest(url: string, params?: Options): Promise<any> {
  const instance = got.extend({
    prefixUrl: 'https://sfmlab-api.meshhouse.art',
    responseType: 'json'
  });

  const response = await instance(url, params);

  return response;
}

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

  constructor(slug: string, name: string) {
    super(slug);
    this.slug = slug;
    this.name = name;

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
    const start = process.hrtime();
    try {
      const filters: FiltersState = await getVuexState('state.filters');
      const params: SFMLabParams = {
        adult_content: isMatureContentVisible() ? 'included' : 'excluded',
        page: Number(page || 1),
        search: filters.search,
        limit: 50
      };

      sendVuexCommit('setOfflineStatus', false);
      sendVuexCommit('setLoadingStatus', false);

      logger.verbose(`HTTP GET ${`${this.slug}/models`}`);
      const fetch: SFMLabFetch = (await sfmlabRequest(`${this.slug}/models`, {
        searchParams: params
      })).body;

      const models: RemoteModel[] = [];
      const favoriteList = new Favorite();

      for (const model of fetch.models) {
        const dbQuery = `SELECT * FROM models WHERE remoteId=${model.id}`;
        const item = (await this.fetchQuery(dbQuery) as Model[]);
        const isFavorite = favoriteList.isInFavorite({
          database: this.slug,
          remoteId: model.id
        });

        model.remoteId = model.id;
        model.size = item.length !== 0 ? item[0].size : 0;
        model.folderPath = item.length !== 0 ? item[0].folderPath : '';
        model.path = item.length !== 0 ? item[0].path : '';
        model.installed = item.length !== 0;
        model.favorite = isFavorite;

        models.push(model);
      }
      return {
        models: models,
        pagination: fetch.pagination
      };
    } catch (err) {
      if (err.code === 'ECONNABORTED') {
        logger.warn('Internet connection or server is offline');
        sendVuexCommit('setOfflineStatus', true);
        const dbQuery = 'SELECT * FROM models';
        return new Promise((resolve, reject): void => {
          this.db.all(dbQuery as string, (err, rows) => {
            if (err) {
              logger.error(err);
              reject(err);
            } else {
              const obj = {
                models: rows,
                pagination: {
                  page: 1,
                  totalPages: 1,
                  totalItems: rows.length
                }
              };
              resolve(obj);
            }
          });
        });
      }
      sendVuexCommit('addNotification', {
        type: 'error',
        message: err
      });
      logger.error(new Error(err));
      return {
        models: [],
        pagination: {
          page: 1,
          totalPages: 1,
          totalItems: 0
        }
      };
    } finally {
      logger.verbose(`HTTP GET ${`${this.slug}/models`} completed`);
      const end = process.hrtime(start);
      logger.verbose(`HTTP GET ${`${this.slug}/models`} takes ${((end[0] / 1000) + (end[1] / 1000000) / 1000)} seconds`);
      sendVuexCommit('setLoadingStatus', true);
    }
  }

  async fetchSingleModel(id: number): Promise<SFMLabModel | void | Error> {
    try {
      sendVuexCommit('setOfflineStatus', false);
      sendVuexCommit('setLoadingStatus', false);
      logger.verbose(`HTTP GET ${this.slug}/models/${id}}`);
      const item = (await sfmlabRequest(`${this.slug}/models/${id}`)).body;
      const installed = await this.checkIsInstalledModel(id);

      item.installed = (installed as boolean);
      item.remoteId = item.id;

      return item;
    } catch (err) {
      if (err.code === 'ECONNABORTED') {
        logger.warn('Internet connection or server is offline');
        sendVuexCommit('setOfflineStatus', true);
        return Promise.reject(err);
      }
      sendVuexCommit('addNotification', {
        type: 'error',
        message: err
      });
      logger.error(new Error(err));
    } finally {
      logger.verbose(`HTTP GET ${this.slug}/models/${id}} completed`);
      sendVuexCommit('setLoadingStatus', true);
    }
  }
  fetchCategories(query?: string | undefined): Promise<Category[] | Error> {
    throw new Error('Method not implemented.');
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
    logger.info(`Deleting item ${item.name}`);
    // Check if temp folder exists
    if (fs.existsSync(item.path)) {
      fs.rmdirSync(item.path, { recursive: true });
    }
    const dbQuery = `DELETE FROM 'models' WHERE remoteId=${item.remoteId}`;
    logger.verbose('Deleting item from local database');
    await this.runQuery(dbQuery);
    // Update databases record
    logger.verbose('Updating database settings');
    const db = ApplicationStore.databases.get(`databases.integrations.${this.slug}`);
    db.totalsize -= item.size ?? 0;
    db.count--;

    ApplicationStore.databases.set(`databases.integrations.${this.slug}`, db);

    const currentDB = await getVuexState('state.db.currentDB.url');

    sendVuexCommit('setApplicationDatabases', ApplicationStore.databases.get('databases'));
    sendVuexCommit('setCurrentDatabase', currentDB ?? this.slug);
    sendEventBusEmit('item-deleted', {});

    const notificationTitle = await getLocalizedString('notifications.delete.title', { site: this.name });
    const notificationMessage = await getLocalizedString('notifications.delete.text', { title: item.name });
    createOSNotification(notificationTitle, notificationMessage);
    logger.info(`Item ${item.name} has been deleted`);
    return Promise.resolve(true);
  }

  async downloadHandle(id: number): Promise<void | Error> {
    try {
      let links: SFMLabLink[] | undefined = undefined;
      const item: any = await this.fetchSingleModel(id);
      links = item.downloadLinks;

      if (links !== undefined) {
        if (links.length > 1) {
          sendEventBusEmit('multiple-links', {});
          sendVuexCommit('setDownloadLinks', links);
        } else {
          await this.downloadItem(item, links[0]);
        }
      }
    } catch (err) {
      sendVuexCommit('addNotification', {
        type: 'error',
        message: err
      });
      logger.error(new Error(err));
      return Promise.reject(new Error(err));
    }
  }

  async updateHandle(item: Model): Promise<void | Error> {
    try {
      let links: SFMLabLink[] | undefined = undefined;
      if (!Object.hasOwnProperty.call(item, 'downloadLinks')) {
        await this.fetchSingleModel(item.id);
        links = await getVuexState('state.controls.properties.downloadLinks');
      } else {
        links = item.downloadLinks;
      }

      if (links !== undefined) {
        if (links.length > 1) {
          sendEventBusEmit('multiple-links', {});
          sendVuexCommit('setDownloadLinks', links);
        } else {
          // Notify when downloaded
          const notificationTitle = await getLocalizedString('notifications.update.title', { site: this.name });
          const notificationMessage = await getLocalizedString('notifications.update.text', { title: item.name });
          createOSNotification(notificationTitle, notificationMessage);
        }
      }
    } catch (err) {
      sendVuexCommit('addNotification', {
        type: 'error',
        message: err
      });
      logger.error(new Error(err));
      return Promise.reject(new Error(err));
    }
  }

  async downloadItem(item: Model, downloadLink: SFMLabLink): Promise<boolean | Error> {
    logger.info(`Added item ${item.name} to download query`);
    let isNewModel = true;
    const isFolderSet = ApplicationStore.databases.get(`databases.integrations.${this.slug}`).path !== null;

    if (!isFolderSet) {
      return Promise.reject(new Error('Path not set'));
    }

    const download: DownloadItem = {
      thumbnail: item.images !== undefined ? item.images[0] : item.image ?? '',
      title: item.name,
      path: path.join(ApplicationStore.databases.get(`databases.integrations.${this.slug}`).path, sanitize(item.name)),
      integration: this.slug,
      totalSize: 0,
      downloadedSize: 0,
      projectId: String(item.remoteId),
      startedAt: new Date().getTime(),
      completedAt: 0,
      id: generateUniqueId()
    };

    DownloadManager.addItem(download);

    const link = downloadLink.link;
    const filename = downloadLink.filename;

    const request = got.get(link, {
      responseType: 'buffer'
    })
      .on('downloadProgress', (progress) => {
        const loaded = progress.transferred;
        const total = progress.total;
        download.totalSize = Number(total);
        download.downloadedSize = Number(loaded);

        DownloadManager.updateProgress(download);
      });

    DownloadManager.addItemRequest({
      id: download.id,
      request
    });
    try {
      windowInstance?.setProgressBar(2);
      logger.info(`Downloading item ${item.name}`);
      const file = await request;

      windowInstance?.setProgressBar(2);
      await installFile(file.body, item, filename, this.slug);

      logger.verbose(`Check if item ${item.name} is installed`);
      const checkQuery = `SELECT * FROM 'models'
        WHERE remoteId=${item.id}
      `;

      const result = await this.fetchQuery(checkQuery);

      if (isDBModel(result)) {
        if (result.length === 0) {
          logger.verbose(`Add item ${item.name} to local database`);
          const dbQuery = `INSERT INTO 'models' VALUES
          (null, ${item.id}, '${item.name}', '${item.extension}', '${download.path}',
          '${download.path}', '${item.category}', ${download.totalSize}, '${item.image}', 1)`;

          await this.runQuery(dbQuery);
        } else {
          logger.verbose(`Updating item ${item.name} in local database`);
          const totalSize = (result[0].size || 0) + download.totalSize;
          const updateQuery = `UPDATE 'models'
            SET size=${totalSize}
            WHERE remoteId=${result[0].remoteId}
          `;
          await this.runQuery(updateQuery);
          isNewModel = false;
        }
      }

      const notificationTitle = await getLocalizedString('notifications.download.title', { site: this.name });
      const notificationMessage = await getLocalizedString('notifications.download.text', { title: item.name });
      createOSNotification(notificationTitle, notificationMessage);
      sendEventBusEmit('download-completed', undefined);
      DownloadManager.updateProgressPercent();

      logger.verbose('Updating database settings');
      const db = ApplicationStore.databases.get(`databases.integrations.${this.slug}`);
      db.totalsize += download.totalSize;

      if (isNewModel) {
        db.count++;
      }

      ApplicationStore.databases.set(`databases.integrations.${this.slug}`, db);

      const currentDB = await getVuexState('state.db.currentDB.url');

      sendVuexCommit('setApplicationDatabases', ApplicationStore.databases.get('databases'));
      sendVuexCommit('setCurrentDatabase', currentDB ?? this.slug);

      windowInstance?.setProgressBar(-1, {
        mode: 'none'
      });
      logger.info(`Item ${item.name} has been downloaded`);
      return Promise.resolve(true);
    } catch (err) {
      if (request.isCanceled) {
        logger.warn(`Downloading item ${item.name} has been canceled`);
        return Promise.resolve(true);
      } else {
        sendVuexCommit('addNotification', {
          type: 'error',
          message: err
        });
        logger.error(new Error(err));
        download.totalSize = -1;
        download.downloadedSize = -1;
        windowInstance?.setProgressBar(-1, {
          mode: 'error'
        });

        DownloadManager.updateProgress(download);
        DownloadManager.updateProgressPercent();
        return Promise.reject(new Error(err));
      }
    }
  }
}
