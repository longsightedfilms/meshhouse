declare const __static: string;

import path from 'path';
import ElectronStore from 'electron-store';
import { app, protocol, BrowserWindow, ipcMain } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import { autoUpdater } from 'electron-updater';
const isDevelopment = process.env.NODE_ENV !== 'production';

const settings: ElectronStore<ApplicationSettings> = new ElectronStore({
  name: 'settings',
} as StoreSettings);

const applicationOptions = {
  width: settings.get('applicationWindow.width') || 1024,
  height: settings.get('applicationWindow.height') || 768,
  minWidth: 1024,
  minHeight: 700,
  icon: path.join(__static, '../build/icons', '512x512.png'),
  frame: process.platform === 'win32' ? false : true,
  show: false,
  resizable: true,
  backgroundColor: '#2e3131',
  webPreferences: {
    experimentalFeatures: true,
    nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
    webSecurity: false,
  },
};

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let appWin: BrowserWindow | null = null;
let createdAppProtocol = false;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
]);

function createWindow(
  devPath: string,
  prodPath: string,
  options: object
): BrowserWindow {
  // Create the browser window.
  appWin = new BrowserWindow(options);
  appWin.setMenu(null);

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    appWin.loadURL(process.env.WEBPACK_DEV_SERVER_URL + devPath);
    if (!process.env.IS_TEST) {
      appWin.webContents.openDevTools();
    }
  } else {
    if (!createdAppProtocol) {
      createProtocol('app');
      createdAppProtocol = true;
    }
    // Load the index.html when not in development
    appWin.loadURL(`app://./${prodPath}`);
  }

  appWin.on('close', () => {
    settings.set('applicationWindow.width', appWin?.getBounds().width ?? 1024);
    settings.set('applicationWindow.height', appWin?.getBounds().height ?? 768);
  });

  appWin.on('closed', () => {
    appWin = null;
  });

  appWin.once('ready-to-show', () => {
    appWin?.show();
  });
  return appWin;
}

app.disableHardwareAcceleration();
//app.commandLine.appendSwitch('disable-software-rasterizer')
//app.commandLine.appendSwitch('disable-gpu')
// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (appWin === null) {
    createWindow('app', 'index.html', applicationOptions);
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  if(settings.get('checkForUpdatesOnStartup') === true) {
    autoUpdater.checkForUpdates();
  }
  createWindow('app', 'index.html', applicationOptions);
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}

app.allowRendererProcessReuse = false;

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

// Handle drag model to OS or DCC
ipcMain.on('dropOut', (event, filePath) => {
  event.sender.startDrag({
    file: filePath,
    icon: path.join(__static, '../build/icons', '64x64.png')
  });
});
