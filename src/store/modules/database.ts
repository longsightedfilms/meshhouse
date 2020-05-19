export default {
  state: {
    databases: [],
    categories: [],
    loadedData: [],
  },
  mutations: {
    setApplicationDatabases(state: any, payload: any): void {
      state.databases = payload
    },
    setCategories(state: any, payload: string[]): void {
      state.categories = payload
    },
    setLoadedData(state: any, payload: any): void {
      state.loadedData = payload
    },
  }
}
