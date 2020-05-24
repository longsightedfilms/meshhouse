export default {
  state: {
    databases: [],
    categories: [],
    loadedData: [],
  },
  mutations: {
    setApplicationDatabases(state: DatabaseState, payload: DatabaseItem[]): void {
      state.databases = payload
    },
    setCategories(state: DatabaseState, payload: Category[]): void {
      state.categories = payload
    },
    setLoadedData(state: DatabaseState, payload: Model | Model[]): void {
      state.loadedData = payload
    },
  }
}
