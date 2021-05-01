import { ipcMain, app } from 'electron';
import { getSystemInfo } from '../functions/os';

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

  ipcMain.handle('get-machine-info', async() => {
    const info = await getSystemInfo();
    return info;
  });
}
