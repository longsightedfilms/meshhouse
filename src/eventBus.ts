import mitt from 'mitt';
import { get } from 'lodash-es';
import store from '@/store/main';
import router from '@/router';
import { i18n } from '@/locales/i18n';

const emitter = mitt();

window.ipc.answerMain('vuex-commit-reply', (params: any) => {
  const { commit, args } = params;
  store.commit(commit, args);
  return true;
});

window.ipc.answerMain('vuex-state-send', (path: string) => {
  const state = get(store, path);
  return state;
});

window.ipc.answerMain('i18n-t', (args: any) => {
  const { path, params } = args;
  return args !== undefined ? i18n.t(path, params) : i18n.t(path);
});

window.ipc.answerMain('event-bus-emit', (params: any) => {
  const { channel, args } = params;
  emitter.emit(channel, args);
  return true;
});

window.ipc.answerMain('router-push', (path: string) => {
  router.push(path);
  return true;
});

window.ipc.answerMain('theme-updated', (shouldUseDarkColors: boolean) => {
  store.commit('setSystemDarkTheme', shouldUseDarkColors);
  return true;
});

emitter.on('download-started', () => {
  store.commit('setStarted', true);
});
emitter.on('download-completed', () => {
  store.commit('setCompleted', true);
});

export default emitter;
