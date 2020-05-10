export default {
  state: {
    databases: [],
    categories: [''],
    loadedData: [],
  },
  mutations: {
    setApplicationDatabases(state: any, payload: any): void {
      state.databases = payload
    },
    setCategories(state: any, payload: string[]): void {
      state.pageCategories = payload
    },
    setLoadedData(state: any, payload: any): void {
      const categories: string[] = []
      payload.forEach((item: Model) => {
        if (!categories.includes(item.category) && item.category != '') {
          categories.push(item.category)
        }
      })

      state.categories = categories
      state.loadedData = payload
    },
  }
}
