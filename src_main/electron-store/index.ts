import fs from 'fs';
import path from 'path';
import ElectronStore from 'electron-store';
import { app } from 'electron';
import { sendVuexCommit } from '../ipc_handlers/eventbus';
import logger from '../logger';

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

const userDataPath = app.getPath('userData');

/**
 * Initializes default databases persisted storage if not exists
 */
export function initDatabases(): void {
  logger.info('Initializing databases');
  if (!fs.existsSync(path.join(userDataPath, 'databases.json'))) {
    databases.set({ databases: databaseDefault });
    logger.warn('Creating default database file');
  }
  sendVuexCommit('setApplicationDatabases', databases.get('databases'));
  logger.verbose('Initializing databases completed');
}

/**
 * Initializes default application settings if not exists
 */
export function initAppSettings(): void {
  logger.info('Initializing application settings');
  if (!fs.existsSync(path.join(userDataPath, 'settings.json'))) {
    settings.set(settingsDefault);
    logger.warn('Creating default settings file');
  }
}

/**
 * Initializes default DCC settings if not exists
 */
export function initDCCSettings(): void {
  logger.info('Initializing DCC settings');
  if (!fs.existsSync(path.join(userDataPath, 'dcc-config.json'))) {
    dcc.set(dccDefault);
    logger.warn('Creating default DCC settings file');
  }
}
