import Vue from 'vue';

declare module 'vue/types/vue' {
  interface Vue {
    /**
     * Sends async message to main process
     */
    $ipcInvoke<T>(channel: string, args?: any): Promise<T>;
    /**
     * Sends sync message to main process
     */
    $ipcSendSync<T>(channel: string, args?: any): T;
  }
}
