export default {
  state: {
    theme: 'light',
    categoriesVisible: true,
    databasesVisible: false,
    hideIntegrations: false,
    minimalisticHeaders: false,
    lastPage: 'main',
    thumbnailSize: 256,
    systemDarkTheme: false,
    integrations: {
      proxy: {
        customProxy: false,
        url: ''
      },
      sfmlab: {
        showMatureContent: false
      }
    }
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
    setSystemDarkTheme(state: SettingsState, payload: boolean): void {
      state.systemDarkTheme = payload;
    },
    setIntegrationsProxy(state: SettingsState, payload: any): void {
      state.integrations.proxy = payload;
    },
    setSFMLabMature(state: SettingsState, payload: boolean): void {
      state.integrations.sfmlab.showMatureContent = payload;
    }
  }
};
