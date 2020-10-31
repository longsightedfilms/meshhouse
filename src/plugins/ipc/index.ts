import _Vue from 'vue';

export default function(Vue: typeof _Vue): void {
  Vue.prototype.$ipcInvoke = async function(channel: string, args?: any): Promise<any> {
    return await window.ipc.invoke(channel, args);
  };

  Vue.prototype.$ipcSendSync = function(channel: string, args?: any): any {
    return window.ipc.sendSync(channel, args);
  };
}
