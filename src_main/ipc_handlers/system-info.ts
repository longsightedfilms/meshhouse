import { ipcMain, app } from 'electron';

export default function(): void {
  ipcMain.on('get-os', (event) => {
    event.returnValue = process.platform;
  });

  ipcMain.on('get-user-data-path', (event) => {
    event.returnValue = app.getPath('userData');
  });
}
