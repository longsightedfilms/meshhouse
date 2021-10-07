import { ipcMain, dialog } from 'electron';
import type { BrowserWindow as NativeWindow } from 'electron';
import { BrowserWindow, setVibrancy } from 'electron-acrylic-window';
import { isWindows10 } from '../functions/os';
import { getVibrancyOptions } from '../functions/theme';

export default function(windowInstance: BrowserWindow | null): void {
  ipcMain.on('is-fullscreen', (event) => {
    const isInFullscreen = windowInstance?.isFullScreen() || false;
    event.returnValue = isInFullscreen;
  });

  ipcMain.handle('is-fullscreen', (event) => {
    return windowInstance?.isFullScreen() || false;
  });

  ipcMain.handle('set-fullscreen', () => {
    if (windowInstance !== null) {
      const isInFullscreen = windowInstance.isFullScreen();
      windowInstance.setFullScreen(!isInFullscreen);
      return Promise.resolve();
    }
  });

  ipcMain.handle('minimize', () => {
    windowInstance?.minimize();
  });

  ipcMain.handle('maximize', () => {
    windowInstance?.maximize();
  });

  ipcMain.handle('unmaximize', () => {
    windowInstance?.unmaximize();
  });

  ipcMain.handle('close', () => {
    windowInstance?.close();
  });

  ipcMain.handle('set-window-progress', (event, value) => {
    windowInstance?.setProgressBar(value);
  });

  ipcMain.handle('set-window-vibrance', (event, theme) => {
    if (isWindows10()) {
      if (windowInstance !== null) {
        const vibrancy = getVibrancyOptions(theme);
        windowInstance.setVibrancy((vibrancy as any));
      }
    }
  });

  ipcMain.handle('show-open-dialog', async(event, args) => {
    if (windowInstance !== null) {
      return await dialog.showOpenDialog((windowInstance as NativeWindow), args);
    }
  });

  ipcMain.handle('open-dev-tools', (event, value) => {
    windowInstance?.webContents.openDevTools();
  });
}
