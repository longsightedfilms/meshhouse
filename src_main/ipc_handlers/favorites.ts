import { ipcMain } from 'electron';
import logger from '../logger';
import Favorite from '../classes/favorites';


export default function(): void {
  const list = new Favorite();

  ipcMain.handle('get-favorites-list', (event, params) => {
    logger.info('Fetching user favorites');
    return list.getList();
  });

  ipcMain.handle('add-favorite', async(event, payload) => {
    const response = await list.addItem(payload);
    return response;
  });

  ipcMain.handle('remove-favorite', async(event, payload) => {
    const response = await list.removeItem(payload);
    return response;
  });

  ipcMain.handle('is-in-favorite', (event, payload) => {
    const response = list.isInFavorite(payload);
    return response;
  });
}
