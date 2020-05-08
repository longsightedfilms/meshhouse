'use strict'

declare const __static: string

import path from 'path'
import { app, protocol, BrowserWindow } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
const isDevelopment = process.env.NODE_ENV !== 'production'

const ElectronStore = require('electron-store')
const settings = new ElectronStore({
  name: 'settings',
})

const applicationOptions = {
  width: settings.get('applicationWindow.width') || 1024,
  height: settings.get('applicationWindow.height') || 768,
  minWidth: 1024,
  minHeight: 768,
  icon: path.join(__static, 'icon.png'),
  frame: false,
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
const appWin: any = null
let createdAppProtocol = false

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
])

function createWindow(
  winVar: any,
  devPath: string,
  prodPath: string,
  options: object
): void {
  // Create the browser window.
  winVar = new BrowserWindow(options)
  winVar.setMenu(null)

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    winVar.loadURL(process.env.WEBPACK_DEV_SERVER_URL + devPath)
    if (!process.env.IS_TEST) winVar.webContents.openDevTools()
  } else {
    if (!createdAppProtocol) {
      createProtocol('app')
      createdAppProtocol = true
    }
    // Load the index.html when not in development
    winVar.loadURL(`app://./${prodPath}`)
  }

  winVar.on('close', () => {
    settings.set('applicationWindow.width', winVar.getBounds().width)
    settings.set('applicationWindow.height', winVar.getBounds().height)
  })

  winVar.on('closed', () => {
    winVar = null
  })

  winVar.once('ready-to-show', () => {
    winVar.show()
  })
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
    createWindow(appWin, 'app', 'index.html', applicationOptions)
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow(appWin, 'app', 'index.html', applicationOptions)
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
