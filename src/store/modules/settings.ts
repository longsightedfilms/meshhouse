import { Module, Mutation, VuexModule } from 'vuex-module-decorators';

@Module({ name: 'settings' })
export default class SettingsStore extends VuexModule {
  theme = 'light'
  categoriesVisible = true
  databasesVisible = false
  hideIntegrations = false
  minimalisticHeaders = false
  lastPage = 'main'
  thumbnailSize = 256
  systemDarkTheme = false
  showInTray = false
  integrations = {
    proxy: {
      customProxy: false,
      url: ''
    },
    sfmlab: {
      showMatureContent: false
    }
  }

  @Mutation
  setApplicationSettings(payload: ApplicationSettings): void {
    Object.keys(payload).map((key) => {
      (this as any)[key] = payload[key];
    });
  }

  @Mutation
  setCurrentLastPage(payload: 'main' | 'lastCatalog'): void {
    this.lastPage = payload;
  }

  @Mutation
  setThumbnailSize(size: number): void {
    this.thumbnailSize = size;
  }

  @Mutation
  setCategoriesVisibility(visibility: boolean): void {
    this.categoriesVisible = visibility;
  }

  @Mutation
  setDBVisibility(visibility: boolean): void {
    this.databasesVisible = visibility;
  }

  @Mutation
  setTheme(payload: Theme): void {
    this.theme = payload;
  }

  @Mutation
  setSystemDarkTheme(payload: boolean): void {
    this.systemDarkTheme = payload;
  }

  @Mutation
  setIntegrationsProxy(payload: any): void {
    this.integrations.proxy = payload;
  }

  @Mutation
  setSFMLabMature(payload: boolean): void {
    this.integrations.sfmlab.showMatureContent = payload;
  }
}
