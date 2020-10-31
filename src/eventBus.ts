import mitt from 'mitt';
import { get } from 'lodash-es';
import store from '@/store/main';
import router from '@/router';
import { i18n } from '@/locales/i18n';

const emitter = mitt();

window.ipc.on('vuex-commit-reply', (event: any, params: any) => {
  const { commit, args } = params;
  store.commit(commit, args);
});

window.ipc.answerMain('vuex-state-send', (path: string) => {
  const state = get(store, path);
  return state;
});

window.ipc.answerMain('i18n-t', (args: any) => {
  const { path, params } = args;
  return args !== undefined ? i18n.t(path, params) : i18n.t(path);
});

window.ipc.on('event-bus-emit', (event: any, params: any) => {
  const { channel, args } = params;
  emitter.emit(channel, args);
});

window.ipc.on('router-push', (event: any, path: string) => {
  router.push(path);
});

export default emitter;
