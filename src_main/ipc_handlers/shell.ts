declare const __static: string;

import { ipcMain, shell } from 'electron';
import { spawn } from 'child_process';
import path from 'path';
import { createOSNotification } from '../functions/notifier';

export default function(): void {
  ipcMain.handle('open-external', (event, url) => {
    shell.openExternal(url);
  });

  ipcMain.handle('open-item', async(event, file) => {
    const filePath = path.normalize(file);
    await shell.openPath(filePath);
  });

  ipcMain.handle('open-folder', (event, folder) => {
    const folderPath = path.normalize(folder);
    shell.showItemInFolder(folderPath);
  });

  ipcMain.handle('shell-spawn', (event, params) => {
    const { command, args } = params;
    args.forEach((element: string, index: number) => {
      args[index] = path.normalize(element);
    });
    spawn(command, args);
  });

  ipcMain.handle('show-notification', (event, params) => {
    const { title, message } = params;
    createOSNotification(title, message);
  });

  ipcMain.handle('dropOut', (event, filePath) => {
    event.sender.startDrag({
      file: filePath,
      icon: path.join(__static, '../build/icons', '64x64.png')
    });
  });
}
