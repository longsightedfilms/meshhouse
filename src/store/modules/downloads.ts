import { Module, Mutation, VuexModule } from 'vuex-module-decorators';
import eventBus from '@/eventBus';

@Module({ name: 'downloads' })
export default class DownloadsStore extends VuexModule {
  started = false
  completed = false
  items: Download[] = []

  @Mutation
  addDownloadItem(payload: Download): void {
    this.items.push(payload);
    this.started = true;
    eventBus.emit('download-started');
  }

  @Mutation
  cancelDownloadItem(payload: Download): void {
    const idx = this.items.findIndex((download: Download) => download.id === payload.id);
    this.items[idx].totalSize = -1;
    this.items[idx].downloadedSize = -1;
  }

  @Mutation
  clearDownloadsList(): void {
    this.items = [];
  }

  @Mutation
  deleteDownloadItem(index: number): void {
    this.items.splice(index, 1);
  }

  @Mutation
  updateDownloadItem(payload: Download): void {
    const idx = this.items.findIndex((download: Download) => download.id === payload.id);
    this.items.splice(idx, 1, payload);
  }

  @Mutation
  setStarted(payload: boolean): void {
    this.started = payload;
  }

  @Mutation
  setCompleted(payload: boolean): void {
    this.completed = payload;
  }
}
