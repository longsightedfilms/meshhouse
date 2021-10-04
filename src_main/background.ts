declare const __dirname: string;

import logger from './logger';
import path from 'path';
import {
  app,
  protocol,
  ipcMain,
} from 'electron';
import { BrowserWindow } from 'electron-acrylic-window';
import type { VibrancyOptions } from 'electron-acrylic-window';
import { autoUpdater } from 'electron-updater';

import { getVibrancyOptions } from './functions/theme';
import { isWindows10, getIconForOS } from './functions/os';
import * as ApplicationStore from './electron-store';
import * as ipcHandlers from './ipc_handlers';
import { createWindow, generateUserAgent } from './createwindow';
import { handleTray } from './tray';
import { protocolDownloadHandle } from './ipc_handlers/integrations';

const isDevelopment = process.env.NODE_ENV !== 'production';

const applicationOptions: any = {
  width: ApplicationStore.settings.get('applicationWindow.width') || 1024,
  height: ApplicationStore.settings.get('applicationWindow.height') || 768,
  minWidth: 1024,
  minHeight: 700,
  icon: getIconForOS(),
  frame: process.platform === 'win32' ? false : true,
  show: false,
  resizable: true,
  webPreferences: {
    contextIsolation: true,
    experimentalFeatures: true,
    nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
    preload: path.join(__dirname, 'preload.js')
  },
};

const loaderOptions: any = {
  frame: false,
  movable: false,
  width: 640,
  height: 640,
  show: false,
  resizable: false,
  icon: getIconForOS(),
  webPreferences: {
    nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
  },
};

const theme = ApplicationStore.settings.get('theme') || 'light';
const lock = app.requestSingleInstanceLock();
const vibrancyOptions: VibrancyOptions = getVibrancyOptions(theme);

if (isWindows10()) {
  applicationOptions.vibrancy = vibrancyOptions;
}

export let appWin: BrowserWindow | null = null;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
]);

app.setAsDefaultProtocolClient('meshhouse');

function handleProtocolURL(url: string): void {
  const strippedURL = url.substr(20);
  const urlArgs = strippedURL.split('/');

  const integration = urlArgs[0];
  const modelId = urlArgs[1];

  protocolDownloadHandle(modelId, integration);
}

if (!lock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (appWin) {
      appWin.show();
      if (appWin.isMinimized()) {
        appWin.restore();
      }
      appWin.focus();

      const url = commandLine.filter((val: string) => val.includes('meshhouse://'))[0];
      handleProtocolURL(url);
    }
  });

  app.whenReady().then(() => {
    logger.info(`Application started (version ${process.env.VUE_APP_VERSION})`);
    protocol.registerFileProtocol('local', (request, callback) => {
      const pathname = decodeURI(request.url.replace(/local:\/\/\/|\?.+/gm, ''));
      callback(pathname);
    });

    protocol.registerHttpProtocol('meshhouse', (req, cb) => {
      handleProtocolURL(req.url);
    });

    const agent = generateUserAgent(appWin?.webContents.getUserAgent() ?? '');
    appWin?.webContents.setUserAgent(agent);

    if (ApplicationStore.settings.get('showInTray')) {
      handleTray(appWin);
    }
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    logger.info('Application closed');
    app.quit();
  }
});

app.on('activate', () => {
  if (appWin === null) {
    appWin = createWindow('app', 'index.html', applicationOptions, loaderOptions);
  }
});

app.on('ready', () => {
  if(ApplicationStore.settings.get('checkForUpdatesOnStartup') === true) {
    autoUpdater.checkForUpdates();
  }
  appWin = createWindow('app', 'index.html', applicationOptions, loaderOptions);
});

if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      logger.info('Application closed');
      app.quit();
    });
  }
}

// Handling auto updates
if (isDevelopment) {
  autoUpdater.updateConfigPath = path.join(__dirname, '../', 'dev-app-update.yml');
}

autoUpdater.autoDownload = false;
autoUpdater.allowPrerelease = true;

autoUpdater.on('update-available', (info) => {
  appWin?.webContents.send('update-available', info);
});

autoUpdater.on('update-not-available', (info) => {
  appWin?.webContents.send('update-not-available');
});

autoUpdater.on('download-progress', (progressObj: ProgressInfo) => {
  appWin?.webContents.send('download-progress', progressObj);
});

ipcMain.on('check-update', () => {
  autoUpdater.checkForUpdates();
});

ipcMain.on('download-update', () => {
  autoUpdater.downloadUpdate();
});

ipcMain.on('install-update', () => {
  autoUpdater.quitAndInstall();
});

ipcHandlers.imageHandler();
ipcHandlers.integrationsHandler();
ipcHandlers.favoritesHandler();
ipcHandlers.fsHandler();
ipcHandlers.themeHandler();
ipcHandlers.shellHandler();
ipcHandlers.storeHandler();
ipcHandlers.systemInfoHandler();

ApplicationStore.initAppSettings();
ApplicationStore.initDCCSettings();
