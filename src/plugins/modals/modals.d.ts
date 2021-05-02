/* eslint-disable @typescript-eslint/camelcase */
import Vue from 'vue';

declare module 'vue/types/vue' {
  interface Vue {
    $modal_AddNewCatalogModal: VueConstructor<Vue>;
    $modal_EditCatalogModal: VueConstructor<Vue>;
    $modal_DeleteCatalogModal: VueConstructor<Vue>;
    $showDialog(component: string, props: any): void;
    $hideModal(): void;
  }
}
