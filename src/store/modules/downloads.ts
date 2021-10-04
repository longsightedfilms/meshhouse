import eventBus from '@/eventBus';

export default {
  state: {
    started: false,
    completed: false,
    items: []
  },
  mutations: {
    addDownloadItem(state: DownloadState, payload: Download): void {
      state.items.push(payload);
      state.started = true;
      eventBus.emit('download-started');
    },
    cancelDownloadItem(state: DownloadState, payload: Download): void {
      const idx = state.items.findIndex((download: Download) => download.id === payload.id);
      state.items[idx].totalSize = -1;
      state.items[idx].downloadedSize = -1;
    },
    clearDownloadsList(state: DownloadState): void {
      state.items = [];
    },
    deleteDownloadItem(state: DownloadState, index: number): void {
      state.items.splice(index, 1);
    },
    updateDownloadItem(state: DownloadState, payload: Download): void {
      const idx = state.items.findIndex((download: Download) => download.id === payload.id);
      state.items.splice(idx, 1, payload);
    },
    setStarted(state: DownloadState, payload: boolean): void {
      state.started = payload;
    },
    setCompleted(state: DownloadState, payload: boolean): void {
      state.completed = payload;
    }
  }
};
