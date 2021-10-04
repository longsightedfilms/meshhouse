import { integrationsList } from '@/functions/databases';

export default {
  state: {
    currentDB: undefined,
    databases: [],
    categories: [],
    licenses: [],
    loadedData: []
  },
  mutations: {
    setApplicationDatabases(state: DatabaseState, payload: any): void {
      state.databases = payload;
    },
    setCurrentDatabase(state: DatabaseState, payload: string): void {
      if (integrationsList.filter((val: string) => val === payload).length === 0) {
        const index = state.databases.local.findIndex((db: DatabaseItem) => db.url === payload);
        state.currentDB = state.databases.local[index];
      } else {
        state.currentDB = state.databases.integrations[payload];
      }
    },
    setCategories(state: DatabaseState, payload: Category[]): void {
      state.categories = payload;
    },
    setLoadedData(state: DatabaseState, payload: Model | Model[]): void {
      state.loadedData = payload;
    },
    setLicenses(state: DatabaseState, payload: SFMLabLicense[]): void {
      state.licenses = payload;
    },
    setLocalFavorite(state: DatabaseState, payload: any): void {
      if (Array.isArray(state.loadedData)) {
        const idx = state.loadedData.findIndex((item: Model) => item.remoteId === payload.id);
        if (idx !== -1) {
          state.loadedData[idx].favorite = payload.status;
        }
      }
    }
  }
};
