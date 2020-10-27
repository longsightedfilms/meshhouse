import mitt from 'mitt';
import { get } from 'lodash-es';
import { ipcRenderer } from 'electron-better-ipc';
import store from '@/store/main';
import router from '@/router';
import { i18n } from '@/locales/i18n';

const emitter = mitt();

ipcRenderer.on('vuex-commit-reply', (event, params) => {
  const { commit, args } = params;
  store.commit(commit, args);
});

ipcRenderer.answerMain('vuex-state-send', (path: string) => {
  const state = get(store, path);
  return state;
});

ipcRenderer.answerMain('i18n-t', (path: string) => {
  const str = i18n.t(path);
  return str;
});

ipcRenderer.on('event-bus-emit', (event, params) => {
  const { channel, args } = params;
  emitter.emit(channel, args);
});

ipcRenderer.on('router-push', (event, path) => {
  router.push(path);
});

export default emitter;
