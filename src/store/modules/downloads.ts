type downloadsState = {
  img: string;
  title: string;
  path: string;
  totalSize: string;
  progress: number;
}

export default {
  state: [
    {
      img: 'https://vuetifyjs.com/apple-touch-icon-180x180.png',
      title: 'Downloads not implemented',
      path: 'H:\\TES.Long-Sighted Films\\Mods\\Defenders of Skyrim\\Assets\\Characters\\LoL\\Ahri\\Ahri Ears.max',
      totalSize: 1048576,
      progress: 100
    },
  ],
  mutations: {
    clearDownloadsList(state: downloadsState[]): void {
      state = []
    },
    deleteDownloadItem(state: downloadsState[], index: number): void {
      state.splice(index, 1)
    },
  }
}
