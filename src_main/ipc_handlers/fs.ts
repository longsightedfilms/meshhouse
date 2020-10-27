import path from 'path';
import { ipcMain } from 'electron';
import { installFile } from '../functions/archive';

export default function(): void {
  ipcMain.handle('unpack-archive', async(event, params) => {
    const { blob, item, filename, databaseURL } = params;
    return await installFile(blob, item, filename, databaseURL);
  });

  ipcMain.on('get-extension', (event, file) => {
    const extension = path.extname(file);
    event.returnValue = extension;
  });
}
