/* eslint-disable @typescript-eslint/camelcase */
import _Vue from 'vue';
// Modals import
import AddNewCatalogModal from '@/views/Modals/AddNewCatalogModal.vue';
import EditCatalogModal from '@/views/Modals/Edit/EditCatalogModal.vue';
import DeleteCatalogModal from '@/views/Modals/Delete/DeleteCatalogModal.vue';

export default function(Vue: typeof _Vue): void {
  let activeModal: string | null = null;

  Vue.prototype.$modal_AddNewCatalogModal = AddNewCatalogModal;
  Vue.prototype.$modal_EditCatalogModal = EditCatalogModal;
  Vue.prototype.$modal_DeleteCatalogModal = DeleteCatalogModal;

  Vue.prototype.$showDialog = function(component: string, props: any): void {
    let modalComponent;
    switch (component) {
    case 'delete-catalog': {
      modalComponent = DeleteCatalogModal;
    }
    }

    activeModal = String(component);

    this.$modal.show(modalComponent, props, {
      adaptive: true,
      clickToClose: false,
      maxHeight: 300,
      height: 'auto',
      transition: ''
    });
  };

  Vue.prototype.$hideModal = function(): void {
    this.$modal.hide(activeModal);
  };
}
