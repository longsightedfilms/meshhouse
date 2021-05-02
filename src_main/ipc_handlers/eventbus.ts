import { ipcMain } from 'electron-better-ipc';
import { appWin } from '../background';
import type { BrowserWindow } from 'electron';

/**
 * Emit event to renderer vuex instance
 * @param commit commit name
 * @param params commit arguments
 */
export function sendVuexCommit(commit: string, params: any): void {
  if (appWin !== null) {
    ipcMain.callRenderer((appWin as BrowserWindow), 'vuex-commit-reply', {
      commit,
      args: params
    });
  }
}
/**
 * Fetch vuex state from renderer process
 * @param path vuex path to state
 */
export async function getVuexState(path: string): Promise<any> {
  if (appWin !== null) {
    const result = await ipcMain.callRenderer((appWin as BrowserWindow), 'vuex-state-send', path);
    return result;
  }
}
/**
 * Fetch localized string from renderer process
 * @param path object notation path
 */
export async function getLocalizedString(path: string, params?: object): Promise<any> {
  if (appWin !== null) {
    const result = await ipcMain.callRenderer((appWin as BrowserWindow), 'i18n-t', {
      path,
      params
    });
    return result;
  }
}
/**
 * Emit event to eventbus
 * @param channel emitter channel
 * @param params emitter arguments
 */
export function sendEventBusEmit(channel: string, params: any): void {
  if (appWin !== null) {
    ipcMain.callRenderer((appWin as BrowserWindow), 'event-bus-emit', {
      channel,
      args: params
    });
  }
}

/**
 * Emit event to vue router
 * @param path url
 */
export function sendRouterPush(path: string): void {
  if (appWin !== null) {
    ipcMain.callRenderer((appWin as BrowserWindow), 'router-push', path);
  }
}
