import { Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { INTEGRATIONS } from '@/constants';

@Module({ name: 'db' })
export default class DatabaseStore extends VuexModule {
  currentDB: DatabaseItem | undefined = undefined
  databases: DatabasesState = {
    local: [],
    integrations: {}
  }
  categories: Category[] = []
  licenses: SFMLabLicense[] = []
  loadedData: Model | Model[] = []

  @Mutation
  setApplicationDatabases(payload: DatabasesState): void {
    this.databases = payload;
  }

  @Mutation
  setCurrentDatabase(payload: string): void {
    if (INTEGRATIONS.filter((val: string) => val === payload).length === 0) {
      const index = this.databases.local.findIndex((db: DatabaseItem) => db.url === payload);
      this.currentDB = this.databases.local[index];
    } else {
      this.currentDB = this.databases.integrations[payload];
    }
  }

  @Mutation
  setCategories(payload: Category[]): void {
    this.categories = payload;
  }

  @Mutation
  setLoadedData(payload: Model | Model[]): void {
    this.loadedData = payload;
  }

  @Mutation
  setLicenses(payload: SFMLabLicense[]): void {
    this.licenses = payload;
  }

  @Mutation
  setLocalFavorite(payload: any): void {
    if (Array.isArray(this.loadedData)) {
      const idx = this.loadedData.findIndex((item: Model) => item.remoteId === payload.id);
      if (idx !== -1) {
        this.loadedData[idx].favorite = payload.status;
      }
    }
  }
}
