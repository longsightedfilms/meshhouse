import { ipcMain, app } from 'electron';

export default function(): void {
  ipcMain.on('get-os', (event) => {
    event.returnValue = process.platform;
  });

  ipcMain.handle('get-os', (event) => {
    return process.platform;
  });

  ipcMain.on('get-user-data-path', (event) => {
    event.returnValue = app.getPath('userData');
  });

  ipcMain.handle('get-user-data-path', (event) => {
    return app.getPath('userData');
  });
}
