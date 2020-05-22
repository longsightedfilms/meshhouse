declare const __static: string

import path from 'path'
import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import ElectronStore from 'electron-store'
import { autoUpdater } from 'electron-updater'
const isDevelopment = process.env.NODE_ENV !== 'production'

const settings: ElectronStore<any> = new ElectronStore({
  name: 'settings',
})

const applicationOptions = {
  width: settings.get('applicationWindow.width') || 1024,
  height: settings.get('applicationWindow.height') || 768,
  minWidth: 1024,
  minHeight: 600,
  icon: path.join(__static, '../build/icons', '512x512.png'),
  frame: process.platform === 'win32' ? false : true,
  show: false,
  resizable: true,
  backgroundColor: '#2e3131',
  webPreferences: {
    nodeIntegration: true,
    webSecurity: false,
  },
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let appWin: any = null
let createdAppProtocol = false

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
])

function createWindow(
  devPath: string,
  prodPath: string,
  options: object
): BrowserWindow {
  // Create the browser window.
  appWin = new BrowserWindow(options)
  appWin.setMenu(null)

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    appWin.loadURL(process.env.WEBPACK_DEV_SERVER_URL + devPath)
    if (!process.env.IS_TEST) appWin.webContents.openDevTools()
  } else {
    if (!createdAppProtocol) {
      createProtocol('app')
      createdAppProtocol = true
    }
    // Load the index.html when not in development
    appWin.loadURL(`app://./${prodPath}`)
  }

  appWin.on('close', () => {
    settings.set('applicationWindow.width', appWin.getBounds().width)
    settings.set('applicationWindow.height', appWin.getBounds().height)
  })

  appWin.on('closed', () => {
    appWin = null
  })

  appWin.once('ready-to-show', () => {
    appWin.show()
  })
  return appWin
}

app.disableHardwareAcceleration()
//app.commandLine.appendSwitch('disable-software-rasterizer')
//app.commandLine.appendSwitch('disable-gpu')
// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (appWin === null) {
    createWindow('app', 'index.html', applicationOptions)
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  autoUpdater.checkForUpdatesAndNotify()
  createWindow('app', 'index.html', applicationOptions)
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

app.allowRendererProcessReuse = false

// Handling auto updates
autoUpdater.autoDownload = false

autoUpdater.on('update-available', (info) => {
  appWin.webContents.send('update-available', info)
})

autoUpdater.on('update-not-available', (info) => {
  appWin.webContents.send('update-not-available')
})

autoUpdater.on('download-progress', (progressObj) => {
  appWin.webContents.send('download-progress', progressObj)
})

ipcMain.on('check-update', () => {
  autoUpdater.checkForUpdatesAndNotify()
})

ipcMain.on('download-update', () => {
  autoUpdater.downloadUpdate()
})

ipcMain.on('install-update', () => {
  autoUpdater.quitAndInstall()
})
