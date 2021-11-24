export default {
  state: {
    fullscreen: false,
    imageRandomizer: 0,
    isOffline: false,
    isLoaded: false,
    isModalVisible: false,
    properties: {},
    title: 'Meshhouse',
    downloadLinks: [],
    updates: {
      downloading: false,
      downloaded: false
    }
  },
  mutations: {
    incrementImageRandomizer(state: ControlsState): void {
      state.imageRandomizer++;
    },
    setFullscreen(state: ControlsState, payload: boolean): void {
      state.fullscreen = payload;
    },
    setLoadingStatus(state: ControlsState, status: boolean): void {
      state.isLoaded = status;
    },
    setOfflineStatus(state: ControlsState, status: boolean): void {
      state.isOffline = status;
    },
    setModalVisibility(state: ControlsState, payload: boolean): void {
      state.isModalVisible = payload;
    },
    setProperties(state: ControlsState, payload: ImageProperties): void {
      state.properties = payload;
    },
    setTitle(state: ControlsState, payload: string): void {
      state.title = payload;
    },
    setUpdateDownload(state: ControlsState, payload: boolean): void {
      state.updates.downloading = payload;
    },
    setUpdateDownloadComplete(state: ControlsState, payload: boolean): void {
      state.updates.downloaded = payload;
    },
    setDownloadLinks(state: ControlsState, payload: SFMLabLink[]): void {
      state.downloadLinks = payload;
    },
  },
};
