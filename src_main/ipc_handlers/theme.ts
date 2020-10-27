import { ipcMain, nativeTheme } from 'electron';

export default function(): void {
  ipcMain.on('should-use-dark-theme', (event) => {
    const darkTheme = nativeTheme.shouldUseDarkColors;
    event.returnValue = darkTheme;
  });

  ipcMain.handle('set-theme-source', (event, theme) => {
    nativeTheme.themeSource = theme;
  });
}

