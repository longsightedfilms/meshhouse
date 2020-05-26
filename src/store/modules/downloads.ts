export default {
  state: [
    {
      img: 'https://vuetifyjs.com/apple-touch-icon-180x180.png',
      title: 'Test item',
      path: 'H:\\TES.Long-Sighted Films\\Mods\\Defenders of Skyrim\\Assets\\Characters\\LoL\\Ahri\\Ahri Ears.max',
      totalSize: 1048576,
      downloadedSize: 0
    },
  ],
  mutations: {
    clearDownloadsList(state: Download[]): void {
      state = [];
    },
    deleteDownloadItem(state: Download[], index: number): void {
      state.splice(index, 1);
    },
  }
};
