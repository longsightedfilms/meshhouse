import eventBus from '@/eventBus';

export default {
  state: [],
  mutations: {
    addDownloadItem(state: Download[], payload: Download): void {
      state.push(payload);
      eventBus.emit('download-started');
    },
    cancelDownloadItem(state: Download[], payload: Download): void {
      const idx = state.findIndex((download: Download) => download.id === payload.id);
      state[idx].totalSize = -1;
      state[idx].downloadedSize = -1;
    },
    clearDownloadsList(state: Download[]): void {
      state = [];
    },
    deleteDownloadItem(state: Download[], index: number): void {
      state.splice(index, 1);
    },
    updateDownloadItem(state: Download[], payload: Download): void {
      const idx = state.findIndex((download: Download) => download.id === payload.id);
      state.splice(idx, 1, payload);
    }
  }
};
