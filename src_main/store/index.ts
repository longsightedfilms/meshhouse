import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store<any>({
  state: {
    downloads: []
  },
  mutations: {
    addDownloadItem(state: any, payload: any): void {
      state.downloads.push(payload);
    },
    cancelDownloadItem(state: any, id: string): void {
      const idx = state.downloads.findIndex((download: Download) => download.id === id);
      state.downloads[idx].request.cancel();
      state.downloads.splice(idx, 1);
    },
    removeDownloadItem(state: any, id: string): void {
      const idx = state.downloads.findIndex((download: Download) => download.id === id);
      state.downloads.splice(idx, 1);
    }
  }
});
