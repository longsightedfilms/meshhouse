import Vue from 'vue';
import Vuex from 'vuex';
import { appWin as windowInstance } from '../background';

Vue.use(Vuex);

export default new Vuex.Store<any>({
  state: {
    downloads: []
  },
  mutations: {
    addDownloadItem(state: any, payload: any): void {
      state.downloads.push(payload);
      console.log(state.downloads.map((item: Download) => item.id));
    },
    cancelDownloadItem(state: any, id: string): void {
      const idx = state.downloads.findIndex((download: Download) => download.id === id);
      state.downloads[idx].request.cancel();
      state.downloads.splice(idx, 1);
    },
    removeDownloadItem(state: any, id: string): void {
      const idx = state.downloads.findIndex((download: Download) => download.id === id);
      state.downloads.splice(idx, 1);
    },
    updateProgressItem(state: any, payload: Download): void {
      const idx = state.downloads.findIndex((download: Download) => download.id === payload.id);
      if (idx !== -1) {
        state.downloads[idx].totalSize = payload.totalSize;
        state.downloads[idx].downloadedSize = payload.downloadedSize;
      }
    },
    updateProgressPercent(state: any): void {
      if (state.downloads.length > 0) {
        const totalDownloadsSize = state.downloads.map((item: Download) => item.totalSize).reduce((prev: number, next: number) => prev + next, 0);
        const totalDownloadedSize = state.downloads.map((item: Download) => item.downloadedSize).reduce((prev: number, next: number) => prev + next, 0);

        const percent = (totalDownloadedSize * 100 / totalDownloadsSize) / 100;

        windowInstance?.setProgressBar(percent);
      } else {
        windowInstance?.setProgressBar(0);
      }
    }
  },
  actions: {
    cancelItem({ commit }, id: string): void {
      commit('cancelDownloadItem', id);
      commit('updateProgressPercent');
    }
  }
});
