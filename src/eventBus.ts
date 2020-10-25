import mitt from 'mitt';
import { ipcRenderer } from 'electron';
import store from '@/store/main';

const emitter = mitt();

ipcRenderer.on('vuex-commit-reply', (event, params) => {
  const { commit, args } = params;
  store.commit(commit, args);
});

export default emitter;
