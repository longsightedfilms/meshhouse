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
    categoriesVisible: true,
    databasesVisible: false,
    hideIntegrations: false,
    imageRandomizer: 0,
    isOffline: false,
    isLoaded: false,
    isModalVisible: false,
    lastPage: 'main',
    properties: {},
    thumbnailSize: 256,
    theme: 'light',
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
    setCurrentLastPage(state: ControlsState, payload: 'main' | 'lastCatalog'): void {
      state.lastPage = payload;
    },
    setThumbnailSize(state: ControlsState, size: number): void {
      state.thumbnailSize = size;
    },
    setCategoriesVisibility(state: ControlsState, visibility: boolean): void {
      state.categoriesVisible = visibility;
    },
    setDBVisibility(state: ControlsState, visibility: boolean): void {
      state.databasesVisible = visibility;
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
    setTheme(state: ControlsState, payload: Theme): void {
      state.theme = payload;
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
    hideIntegrations(state: ControlsState, payload: boolean): void {
      state.hideIntegrations = payload;
    },
    setDownloadLinks(state: ControlsState, payload: SFMLabLink[]): void {
      state.downloadLinks = payload;
    }
  },
};
