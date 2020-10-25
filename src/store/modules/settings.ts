export default {
  state: {
    theme: 'light',
    categoriesVisible: true,
    databasesVisible: false,
    hideIntegrations: false,
    minimalisticHeaders: false,
    lastPage: 'main',
    thumbnailSize: 256,
  },
  mutations:{
    setApplicationSettings(state: SettingsState, payload: Settings): void {
      Object.assign(state, payload);
    },
    setCurrentLastPage(state: SettingsState, payload: 'main' | 'lastCatalog'): void {
      state.lastPage = payload;
    },
    setThumbnailSize(state: SettingsState, size: number): void {
      state.thumbnailSize = size;
    },
    setCategoriesVisibility(state: SettingsState, visibility: boolean): void {
      state.categoriesVisible = visibility;
    },
    setDBVisibility(state: SettingsState, visibility: boolean): void {
      state.databasesVisible = visibility;
    },
    setTheme(state: SettingsState, payload: Theme): void {
      state.theme = payload;
    },
  }
};
