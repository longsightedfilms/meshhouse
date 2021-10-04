import { promises as fs } from 'fs';
import path from 'path';
import { app } from 'electron';
import uniqid from 'uniqid';

export default class Favorite {
  private filename = path.resolve(app.getPath('userData'), 'user-favorites.mshdb')
  private content: any[] = []

  constructor() {
    this.initializeFile();
  }

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

  private async saveChanges(): Promise<boolean | Error> {
    try {
      const buffer = Buffer.from(JSON.stringify(this.content));
      await fs.writeFile(this.filename, buffer, 'binary');
      return true;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private generateUniqueId(): string {
    return uniqid('favorite-');
  }

  public getList(): any {
    return this.content;
  }

  public addItem(payload: any): Promise<boolean | Error> {
    const addedItem = {
      id: this.generateUniqueId(),
      database: payload.database,
      remoteId: Number(payload.remoteId),
      thumbnail: payload.thumbnail,
      title: payload.title,
      createdAt: new Date().toISOString()
    };

    this.content.push(addedItem);
    return this.saveChanges();
  }

  public removeItem(payload: any): Promise<boolean | Error> {
    const idx = this.content.findIndex((item) => {
      return item.database === payload.database
        && Number(item.remoteId) === Number(payload.remoteId);
    });

    if (idx !== -1) {
      this.content.splice(idx, 1);
      return this.saveChanges();
    }

    return Promise.reject('Item not found');
  }

  public isInFavorite(payload: any): boolean {
    return this.content.find((item) => {
      return item.database === payload.database
        && Number(item.remoteId) === Number(payload.remoteId);
    }) !== undefined;
  }
}
