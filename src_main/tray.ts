import {
  Menu,
  Tray,
} from 'electron';
import { BrowserWindow } from 'electron-acrylic-window';
import { getIconForOS } from './functions/os';

export function handleTray(appWin: BrowserWindow | null): void {
  const tray = new Tray(getIconForOS());
  tray.setToolTip(`Meshhouse ${process.env.VUE_APP_VERSION}`);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show window',
      type: 'normal',
      click: ((): void => {
        appWin?.show();
        appWin?.focus();
      })
    },
    {
      type: 'separator'
    },
    {
      role: 'quit'
    }
  ]);

  tray.setContextMenu(contextMenu);
  tray.addListener('double-click', (() => {
    appWin?.show();
    appWin?.focus();
  }));
}
