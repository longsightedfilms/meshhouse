import store from '@/store/main';
import fs from 'fs';
import path from 'path';
import ElectronStore from 'electron-store';
import { ipcRenderer } from 'electron';

// Import defaults
import databaseDefault from './defaults/database';
import dccDefault from './defaults/dcc';
import settingsDefault from './defaults/settings';

// Import migrations
import databaseMigrations from './migrations/database';
import settingsMigrations from './migrations/settings';
import dccMigrations from './migrations/dccSettings';

export const settings: ElectronStore<ApplicationSettings> = new ElectronStore({
  name: 'settings',
  migrations: settingsMigrations,
  projectVersion: process.env.VUE_APP_VERSION
} as StoreSettings);
export const databases: ElectronStore<DatabaseSettings> = new ElectronStore({
  name: 'databases',
  migrations: databaseMigrations,
  projectVersion: process.env.VUE_APP_VERSION
} as StoreSettings);
export const dcc: ElectronStore<DCCSettings> = new ElectronStore({
  name: 'dcc-config',
  migrations: dccMigrations,
  projectVersion: process.env.VUE_APP_VERSION
} as StoreSettings);

const userDataPath = ipcRenderer.sendSync('get-user-data-path');

export function initDatabases(): void {
  if (!fs.existsSync(path.join(userDataPath, 'databases.json'))) {
    databases.set({ databases: databaseDefault });
  }
  store.commit('setApplicationDatabases', databases.get('databases'));
}

export function initAppSettings(): void {
  if (!fs.existsSync(path.join(userDataPath, 'settings.json'))) {
    settings.set(settingsDefault);
  }
}

export function initDCCSettings(): void {
  if (!fs.existsSync(path.join(userDataPath, 'dcc-config.json'))) {
    dcc.set(dccDefault);
  }
}
