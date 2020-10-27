import _Vue from 'vue';
import { ipcRenderer } from 'electron';

export default function(Vue: typeof _Vue): void {
  Vue.prototype.$ipcInvoke = async function(channel: string, args?: any): Promise<any> {
    return await ipcRenderer.invoke(channel, args);
  };

  Vue.prototype.$ipcSendSync = function(channel: string, args?: any): any {
    return ipcRenderer.sendSync(channel, args);
  };
}
