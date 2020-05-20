<template>
  <fragment>
    <li>
      <a @click.prevent="openCatalog">
        <vue-icon
          icon="folder"
          inverted
        />
        {{ $t('context.catalog.open') }}
      </a>
    </li>
    <li>
      <a @click.prevent="openEditCatalog">
        <vue-icon
          icon="edit"
          inverted
        />
        {{ $t('context.catalog.properties') }}
      </a>
    </li>
    <li>
      <a @click.prevent="openDeleteCatalog">
        <vue-icon
          icon="recycle-bin"
          inverted
        />
        {{ $t('context.catalog.delete') }}
      </a>
    </li>
  </fragment>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Fragment } from 'vue-fragment'
import EditCategoryModal from '@/views/Modals/Edit/EditCategoryModal.vue'
import DeleteCategoryModal from '@/views/Modals/Delete/DeleteCategoryModal.vue'

@Component({
  components: {
    Fragment
  }
})
export default class CategoryContext extends Vue {
  openCatalog(): void {
    const { id } = this.$store.state.controls.properties
    this.$store.commit('setFilter', {
      field: 'category',
      value: id !== undefined ? id : ''
    })
    this.$router.push({
      path: `/db/local/${this.$route.params.database}${id !== undefined ? `/${id}` : ''}`
    })
  }

  openDeleteCatalog(): void {
    this.$modal.show(DeleteCategoryModal, {}, {
      clickToClose: true,
      height: 'auto'
    })
  }

  openEditCatalog(): void {
    this.$modal.show(EditCategoryModal, {}, {
      clickToClose: true,
      height: 'auto'
    })
  }
}
</script>
