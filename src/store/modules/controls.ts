type controlsState = {
  filters: {
    order: string;
    where: {
      [key: string]: any;
      category: string;
      extension: string;
      name: string;
      path: string;
    };
  };
  databasesVisible: boolean;
  filtersVisible: boolean;
  imageRandomizer: number;
  properties: any;
  thumbnailSize: string | number;
}

type fieldPayload = {
  field: string;
  value: string | number | boolean | object;
}

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
    filtersVisible: false,
    imageRandomizer: 0,
    properties: {},
    thumbnailSize: 256
  },
  mutations: {
    incrementImageRandomizer(state: controlsState): void {
      state.imageRandomizer++
    },
    setThumbnailSize(state: controlsState, size: number): void {
      state.thumbnailSize = size
    },
    setDBVisibility(state: controlsState, visibility: boolean): void {
      state.databasesVisible = visibility
    },
    setFilterOrder(state: controlsState, payload: string): void {
      state.filters.order = payload
    },
    setFilter(state: controlsState, payload: fieldPayload): void {
      state.filters.where[payload.field] = payload.value
    },
    setFilters(state: controlsState, payload: any): Promise<boolean> {
      state.filters = payload
      return Promise.resolve(true)
    },
    setFilterVisibility(state: controlsState, visibility: boolean): void {
      state.filtersVisible = visibility
    },
    setProperties(state: controlsState, payload: any): void {
      state.properties = payload
    },
  },
}
