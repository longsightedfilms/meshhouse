import { nativeTheme } from 'electron';
import { ipcMain } from 'electron-better-ipc';

export default function(): void {
  ipcMain.on('should-use-dark-theme', (event) => {
    const darkTheme = nativeTheme.shouldUseDarkColors;
    event.returnValue = darkTheme;
  });

  ipcMain.handle('should-use-dark-theme', (event) => {
    return nativeTheme.shouldUseDarkColors;
  });

  ipcMain.handle('set-theme-source', (event, theme) => {
    nativeTheme.themeSource = theme;
  });

  nativeTheme.on('updated', () => {
    ipcMain.sendToRenderers('theme-updated');
  });
}

