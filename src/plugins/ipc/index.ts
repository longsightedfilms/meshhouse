import _Vue from 'vue';

export default function(Vue: typeof _Vue): void {
  Vue.prototype.$ipcInvoke = async function<T>(channel: string, args?: any): Promise<T> {
    return await window.ipc.invoke(channel, args);
  };

  Vue.prototype.$ipcSendSync = function<T>(channel: string, args?: any): T {
    return window.ipc.sendSync(channel, args);
  };
}
