/* eslint-disable @typescript-eslint/camelcase */
import _Vue from 'vue';
// Modals import
import AddNewCatalogModal from '@/views/Modals/AddNewCatalogModal.vue';
import EditCatalogModal from '@/views/Modals/Edit/EditCatalogModal.vue';
import DeleteCatalogModal from '@/views/Modals/Delete/DeleteCatalogModal.vue';

export default function(Vue: typeof _Vue): void {
  Vue.prototype.$modal_AddNewCatalogModal = AddNewCatalogModal;
  Vue.prototype.$modal_EditCatalogModal = EditCatalogModal;
  Vue.prototype.$modal_DeleteCatalogModal = DeleteCatalogModal;
}
