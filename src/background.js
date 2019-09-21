'use strict'

import path from 'path'
import { app, protocol, BrowserWindow } from 'electron'
import {
  createProtocol
} from 'vue-cli-plugin-electron-builder/lib'
const isDevelopment = process.env.NODE_ENV !== 'production'

const ElectronStore = require('electron-store')
const settings = new ElectronStore({
  name: "settings"
})

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let appWin
let createdAppProtocol = false

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: { secure: true, standard: true } }])

function createWindow(winVar, devPath, prodPath, options) {
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
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  let windowWidth = settings.get('applicationWindow.width') || 1024
  let windowHeight = settings.get('applicationWindow.height') || 768

  // Create auth window
  createWindow(appWin, 'app', 'index.html', {
    width: windowWidth,
    height: windowHeight,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__static, 'icon.png'),
    frame: true,
    show: false,
    resizable: true,
    webPreferences: {
      nodeIntegration: true
    }
  })
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
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
