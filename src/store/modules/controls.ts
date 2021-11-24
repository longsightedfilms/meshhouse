import { Module, Mutation, VuexModule } from 'vuex-module-decorators';

@Module({ name: 'controls' })
export default class ControlsStore extends VuexModule {
  fullscreen = false
  imageRandomizer = 0
  isOffline = false
  isLoaded = false
  isModalVisible = false
  properties: ImageProperties | object = {}
  title = 'Meshhouse'
  downloadLinks: SFMLabLink[] = []
  updates = {
    downloading: false,
    downloaded: false
  }

  @Mutation
  incrementImageRandomizer(): void {
    this.imageRandomizer++;
  }

  @Mutation
  setFullscreen(payload: boolean): void {
    this.fullscreen = payload;
  }

  @Mutation
  setLoadingStatus(status: boolean): void {
    this.isLoaded = status;
  }

  @Mutation
  setOfflineStatus(status: boolean): void {
    this.isOffline = status;
  }

  @Mutation
  setModalVisibility(payload: boolean): void {
    this.isModalVisible = payload;
  }

  @Mutation
  setProperties(payload: ImageProperties): void {
    this.properties = payload;
  }

  @Mutation
  setTitle(payload: string): void {
    this.title = payload;
  }

  @Mutation
  setUpdateDownload(payload: boolean): void {
    this.updates.downloading = payload;
  }

  @Mutation
  setUpdateDownloadComplete(payload: boolean): void {
    this.updates.downloaded = payload;
  }

  @Mutation
  setDownloadLinks(payload: SFMLabLink[]): void {
    this.downloadLinks = payload;
  }
}
