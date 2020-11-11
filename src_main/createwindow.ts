import { UAParser } from 'ua-parser-js';
import { BrowserWindow } from 'electron-acrylic-window';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';

import * as ApplicationStore from './electron-store';
import * as ipcHandlers from './ipc_handlers';

export function createWindow(
  devPath: string,
  prodPath: string,
  options: object
): BrowserWindow | null {
  let createdAppProtocol = false;
  let window: BrowserWindow | null = new BrowserWindow(options);
  window.setMenu(null);

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    window.loadURL(process.env.WEBPACK_DEV_SERVER_URL + devPath);
    if (!process.env.IS_TEST) {
      window.webContents.openDevTools();
    }
  } else {
    if (!createdAppProtocol) {
      createProtocol('app');
      createdAppProtocol = true;
    }
    // Load the index.html when not in development
    window.loadURL(`app://./${prodPath}`);
  }

  if (ApplicationStore.settings.get('showInTray')) {
    window.on('minimize', (event: Electron.Event) => {
      event.preventDefault();
      window?.hide();
    });
  }

  window.on('close', () => {
    ApplicationStore.settings.set('applicationWindow.width', window?.getBounds().width ?? 1024);
    ApplicationStore.settings.set('applicationWindow.height', window?.getBounds().height ?? 768);

    const session = window?.webContents.session;
    // Debloat local cache on app exit
    session?.clearCache().then(() => {
      session?.clearStorageData({
        storages: ['appcache', 'shadercache', 'cachestorage']
      });
    });
  });

  window.on('closed', () => {
    window = null;
  });

  window.once('ready-to-show', () => {
    window?.show();
    ipcHandlers.windowHandler(window);
  });

  return window;
}

export function generateUserAgent(originAgent: string): string {
  const parser = new UAParser(originAgent);
  const { browser } = parser.getResult();
  const originAgentOS = originAgent.match(/\([a-zA-Z\s0-9_.;]+\)/gm) ?? [];

  return `Mozilla/5.0 ${originAgentOS[0]} MeshHouseClient/${process.env.VUE_APP_VERSION} ${browser.name}/${browser.version}`;
}
