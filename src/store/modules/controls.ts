export default {
  state: {
    filters: {
      order: 'ASC',
      where: {
        category: -1,
        extension: 'none',
        name: '',
        path: '',
      },
    },
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
    setFilterOrder(state: ControlsState, payload: string): void {
      state.filters.order = payload;
    },
    setFilter(state: ControlsState, payload: FilterPayload): void {
      state.filters.where[payload.field] = payload.value;
    },
    setFilters(state: ControlsState, payload: Filters): Promise<boolean> {
      state.filters = payload;
      return Promise.resolve(true);
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
