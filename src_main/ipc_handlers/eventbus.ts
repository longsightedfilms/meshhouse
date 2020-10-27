import { ipcMain } from 'electron-better-ipc';
import { appWin } from '../background';

/**
 * Emit event to renderer vuex instance
 * @param commit commit name
 * @param params commit arguments
 */
export function sendVuexCommit(commit: string, params: any): void {
  appWin?.webContents.send('vuex-commit-reply', {
    commit,
    args: params
  });
}
/**
 * Fetch vuex state from renderer process
 * @param path vuex path to state
 */
export async function getVuexState(path: string): Promise<any> {
  if (appWin !== null) {
    const result = await ipcMain.callRenderer(appWin, 'vuex-state-send', path);
    return result;
  }
}
/**
 * Fetch localized string from renderer process
 * @param path object notation path
 */
export async function getLocalizedString(path: string): Promise<any> {
  if (appWin !== null) {
    const result = await ipcMain.callRenderer(appWin, 'i18n-t', path);
    return result;
  }
}
/**
 * Emit event to eventbus
 * @param channel emitter channel
 * @param params emitter arguments
 */
export function sendEventBusEmit(channel: string, params: any): void {
  appWin?.webContents.send('event-bus-emit', {
    channel,
    args: params
  });
}

/**
 * Emit event to vue router
 * @param path url
 */
export function sendRouterPush(path: string): void {
  appWin?.webContents.send('router-push', path);
}
