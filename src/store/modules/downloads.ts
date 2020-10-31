import eventBus from '@/eventBus';

export default {
  state: [
    /*{
      img: 'https://vuetifyjs.com/apple-touch-icon-180x180.png',
      title: 'Test item',
      tmp: '',
      path: 'H:\\TES.Long-Sighted Films\\Mods\\Defenders of Skyrim\\Assets\\Characters\\LoL\\Ahri\\Ahri Ears.max',
      totalSize: 1048576,
      downloadedSize: 0,
      startedAt: new Date(),
      cancelToken: undefined
    },*/
  ],
  mutations: {
    addDownloadItem(state: Download[], payload: Download): void {
      state.push(payload);
      eventBus.emit('download-started');
    },
    cancelDownloadItem(state: Download[], payload: Download): void {
      const idx = state.findIndex((download: Download) => download.id === payload.id);
      window.ipc.invoke('cancel-download-item', payload.id);
      state[idx].totalSize = -1;
      state[idx].downloadedSize = -1;
      window.ipc.send('set-window-progress', -1);
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
