import { ipcMain } from 'electron';
import {
  generateBackgroundImage,
  generateBackgroundTallImage,
  generateThumbnailImage
} from '../functions/image';

export default function(): void {
  ipcMain.handle('generate-bg-image', async(event, params) => {
    const { item, image } = params;
    return await generateBackgroundImage(item, image);
  });

  ipcMain.handle('generate-bg-tall-image', async(event, params) => {
    const { item, image } = params;
    return await generateBackgroundTallImage(item, image);
  });

  ipcMain.handle('generate-thumbnail-image', async(event, params) => {
    const { item, image } = params;
    return await generateThumbnailImage(item, image);
  });
}
