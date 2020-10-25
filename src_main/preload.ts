import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld(
  'ipc', {
    invoke: async(channel: string, data: any) => {
      return await ipcRenderer.invoke(channel, data);
    },
    send: (channel: string, data: any) => {
      ipcRenderer.send(channel, data);
    },
    receive: (channel: string, func: any) => {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  }
);
