export default {
  state: {
    filters: {
      order: 'ASC',
      where: {
        category: '',
        extension: 'none',
        name: '',
        path: '',
      },
    },
    databasesVisible: false,
    imageRandomizer: 0,
    isLoaded: false,
    properties: {},
    thumbnailSize: 256,
    theme: 'light'
  },
  mutations: {
    incrementImageRandomizer(state: ControlsState): void {
      state.imageRandomizer++
    },
    setThumbnailSize(state: ControlsState, size: number): void {
      state.thumbnailSize = size
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
    }
  },
}
