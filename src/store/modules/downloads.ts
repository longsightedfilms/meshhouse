export default {
  state: [
    {
      img: 'https://vuetifyjs.com/apple-touch-icon-180x180.png',
      title: 'Test item',
      tmp: '',
      path: 'H:\\TES.Long-Sighted Films\\Mods\\Defenders of Skyrim\\Assets\\Characters\\LoL\\Ahri\\Ahri Ears.max',
      totalSize: 1048576,
      downloadedSize: 0
    },
  ],
  mutations: {
    addDownloadItem(state: Download[], payload: Download): void {
      state.push(payload);
    },
    clearDownloadsList(state: Download[]): void {
      state = [];
    },
    deleteDownloadItem(state: Download[], index: number): void {
      state.splice(index, 1);
    },
    updateDownloadItem(state: Download[], payload: Download): void {
      const idx = state.findIndex((download: Download) => download.title === payload.title);
      state[idx] = payload;
    }
  }
};
