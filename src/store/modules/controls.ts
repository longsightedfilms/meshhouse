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
    categoriesVisible: true,
    databasesVisible: false,
    imageRandomizer: 0,
    isLoaded: false,
    lastPage: 'main',
    properties: {},
    thumbnailSize: 256,
    theme: 'light',
    updates: {
      downloading: false,
      downloaded: false
    }
  },
  mutations: {
    incrementImageRandomizer(state: ControlsState): void {
      state.imageRandomizer++
    },
    setCurrentLastPage(state: ControlsState, payload: 'main' | 'lastCatalog'): void {
      state.lastPage = payload
    },
    setThumbnailSize(state: ControlsState, size: number): void {
      state.thumbnailSize = size
    },
    setCategoriesVisibility(state: ControlsState, visibility: boolean): void {
      state.categoriesVisible = visibility
    },
    setDBVisibility(state: ControlsState, visibility: boolean): void {
      state.databasesVisible = visibility
    },
    setFilterOrder(state: ControlsState, payload: string): void {
      state.filters.order = payload
    },
    setFilter(state: ControlsState, payload: FilterPayload): void {
      state.filters.where[payload.field] = payload.value
    },
    setFilters(state: ControlsState, payload: Filters): Promise<boolean> {
      state.filters = payload
      return Promise.resolve(true)
    },
    setLoadStatus(state: ControlsState, status: boolean): void {
      state.isLoaded = status
    },
    setProperties(state: ControlsState, payload: ImageProperties): void {
      state.properties = payload
    },
    setTheme(state: ControlsState, payload: string): void {
      state.theme = payload
    },
    setUpdateDownload(state: ControlsState, payload: boolean): void {
      state.updates.downloading = payload
    },
    setUpdateDownloadComplete(state: ControlsState, payload: boolean): void {
      state.updates.downloaded = payload
    }
  },
}
