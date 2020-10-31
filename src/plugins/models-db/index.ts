import _Vue from 'vue';
import { i18n } from '@/locales/i18n';
import { transliterate as tr, slugify } from 'transliteration';
import store from '@/store/main';
import sanitizeHTML from 'sanitize-html';

import { formatBytes } from '@/functions/format';
import { modelsExtensions, getParameterByExtension } from '@/functions/extension';
import { formatDateRelative } from '@/functions/date';

window.ipc.invoke('init-databases');

export function ModelsDB(Vue: typeof _Vue): void {
  Vue.prototype.$isRTL = function(): boolean {
    return i18n.locale === 'ar';
  };

  Vue.prototype.$stringToSlug = function(str: string): string {
    return slugify(str);
  };

  Vue.prototype.$returnHumanLikeExtension = function(
    extension: string
  ): string {
    return modelsExtensions[extension].title ?? '';
  };

  Vue.prototype.$forceReloadImage = function(image: string): string {
    return image !== '' ? image + '?v=' + store.state.controls.imageRandomizer : image;
  };

  Vue.prototype.$addDatabase = async function(db: DatabaseItem): Promise<void> {
    return await window.ipc.invoke('add-database', db);
  };

  Vue.prototype.$updateItemInDatabase = async function(
    dbName: string,
    model: Model
  ): Promise<void> {
    return await window.ipc.invoke('update-item-in-integration', {
      type: 'local',
      title: dbName,
      model
    });
  };

  Vue.prototype.$editDatabase = function(
    index: number,
    payload: DatabaseItem
  ): Promise<boolean> {
    window.ipc.invoke('set-database', {
      key: `databases.local.${index}`,
      value: payload
    });
    store.commit('setApplicationDatabases', window.ipc.sendSync('get-database', 'databases'));
    store.commit('setCurrentDatabase', payload.url);
    return Promise.resolve(true);
  };

  Vue.prototype.$setIntegrationsDB = function(payload: any): void {
    window.ipc.invoke('set-database', {
      key: 'databases.integrations',
      value: payload
    });
  };

  Vue.prototype.$deleteDatabase = function(database: string): Promise<boolean> {
    return Promise.resolve(true);
  };

  Vue.prototype.$openItem = function(file: string): void {
    const extension = window.ipc.sendSync('get-extension', file);
    if (getParameterByExtension(extension, 'useSystemAssociation')) {
      window.ipc.invoke('open-item', file);
    } else {
      window.ipc.invoke('shell-spawn', {
        command: getParameterByExtension(extension, 'customPath'),
        args:[file]
      });
    }
  };

  Vue.prototype.$openFolder = function(folder: string): void {
    window.ipc.invoke('open-folder', folder);
  };

  Vue.prototype.$openPropertiesModal = async function(
    model: Model
  ): Promise<boolean> {
    const properties: ImageProperties = {
      imageChanged: false,
      ...model
    };

    store.commit('setProperties', properties);

    return Promise.resolve(true);
  };

  Vue.prototype.$formatSize = function(size: number): string {
    return formatBytes(size);
  };

  Vue.prototype.$sanitizeHTML = function(html: string): string {
    return sanitizeHTML(html);
  };

  Vue.prototype.$formatDateRelative = function(timestamp: number): string {
    return formatDateRelative(timestamp);
  };
}
