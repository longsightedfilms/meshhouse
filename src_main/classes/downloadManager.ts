import { promises as fs } from 'fs';
import path from 'path';
import { app } from 'electron';
import { appWin as windowInstance } from '../background';
import {
  sendVuexCommit
} from '../ipc_handlers/eventbus';

class DownloadManager {
  private filename = path.resolve(app.getPath('userData'), 'download-history.mshdb')
  private content: DownloadItem[] = []
  private requests: DownloadRequest[] = []

  constructor() {
    this.initializeFile();
  }
  /**
   * Initializes download history persistent file
   */
  private async initializeFile(): Promise<void> {
    try {
      await fs.access(this.filename);

      const buffer = await fs.readFile(this.filename);
      this.content = JSON.parse(buffer.toString());
    } catch {
      const templateBuffer = Buffer.from(JSON.stringify([]));

      await fs.writeFile(this.filename, templateBuffer, 'binary');
    }
  }
  /**
   * Save download history to disk
   * @returns true if success or error
   */
  private async saveChanges(): Promise<boolean | Error> {
    try {
      const buffer = Buffer.from(JSON.stringify(this.stripHistory()));
      await fs.writeFile(this.filename, buffer, 'binary');
      return true;
    } catch (error) {
      return Promise.reject(error);
    }
  }
  /**
   * Adds new item to download history
   * @param payload download item
   * @returns true if success or error
   */
  public addItem(payload: DownloadItem): Promise<boolean | Error> {
    this.content.push(payload);
    this.clientCommit(payload, 'addDownloadItem');

    return this.saveChanges();
  }
  /**
   * Adds new item request
   * @param payload download request
   */
  public addItemRequest(payload: DownloadRequest): void {
    this.requests.push(payload);
  }
  /**
   * Completely replaces download item in history
   * @param payload download item
   * @returns true if success or error
   */
  public replaceItem(payload: DownloadItem): Promise<boolean | Error> {
    const idx = this.content.findIndex((download: DownloadItem) => download.id === payload.id);

    if (idx !== -1) {
      this.content[idx] = payload;
      return this.saveChanges();
    }

    return Promise.reject('Item not found');
  }
  /**
   * Cancel current download
   * @param id download item id
   */
  public cancelItem(id: string): void {
    const idx = this.requests.findIndex((request: DownloadRequest) => request.id === id);

    if (idx !== -1) {
      this.requests[idx].request.cancel();
      this.requests.splice(idx, 1);
      this.content.splice(idx, 1);

      this.updateProgressPercent();
    }
  }
  /**
   * Permanently delete download item history
   * @param id download id
   * @returns true if success or error
   */
  public deleteFromHistory(id: string): Promise<boolean | Error> {
    const idx = this.content.findIndex((item) => {
      return item.id === id;
    });

    if (idx !== -1) {
      this.content.splice(idx, 1);
      return this.saveChanges();
    }

    return Promise.reject('Item not found');
  }
  /**
   * Updates download item progress
   * @param payload download item
   */
  public updateProgress(payload: DownloadItem): void {
    const idx = this.content.findIndex((download: DownloadItem) => download.id === payload.id);

    if (idx !== -1) {
      this.content[idx].totalSize = payload.totalSize;
      this.content[idx].downloadedSize = payload.downloadedSize;

      this.clientCommit(this.content[idx], 'updateDownloadItem');
      this.updateProgressPercent();
    }
  }
  /**
   * Updates window taskbar progress
   */
  public updateProgressPercent(): void {
    if (this.content.length > 0) {
      const totalDownloadsSize = this.content.map((item: DownloadItem) => item.totalSize).reduce((prev: number, next: number) => prev + next, 0);
      const totalDownloadedSize = this.content.map((item: DownloadItem) => item.downloadedSize).reduce((prev: number, next: number) => prev + next, 0);

      const percent = (totalDownloadedSize * 100 / totalDownloadsSize) / 100;

      windowInstance?.setProgressBar(percent);
    } else {
      windowInstance?.setProgressBar(0);
    }
  }
  /**
   * Send IPC request to front-end to update Vuex state
   * @param payload commit payload
   * @param type commit type
   */
  private clientCommit(payload: DownloadItem, type: string): void {
    const item = {
      ...payload
    };

    sendVuexCommit(type, item);
  }
  private stripHistory(): DownloadItem[] {
    return this.content.map((item) => {
      return item;
    });
  }
  /**
   * Returns download history items
   * @returns download history
   */
  get history(): DownloadItem[] {
    return this.content;
  }
}


const manager = new DownloadManager();

export default manager;
