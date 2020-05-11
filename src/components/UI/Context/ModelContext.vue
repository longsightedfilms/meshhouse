<template>
  <fragment>
    <li>
      <a @click.prevent="$openItem($store.state.controls.properties.path)">
        {{ $t('context.model.open') }}
      </a>
    </li>
    <li>
      <a @click.prevent="$openFolder($store.state.controls.properties.path)">
        <vue-icon
          icon="folder"
          inverted
        />
        {{ $t('context.model.openFolder') }}
      </a>
    </li>
    <li>
      <a @click.prevent="openProperties">
        <vue-icon
          icon="edit"
          inverted
        />
        {{ $t('context.model.properties') }}
      </a>
    </li>
  </fragment>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import EditPropertiesModal from '@/views/Modals/EditPropertiesModal.vue'
import { Fragment } from 'vue-fragment'

@Component({
  components: {
    Fragment
  }
})
export default class ModelContext extends Vue {
  openProperties(): void {
    this.$openPropertiesModal(this.$store.state.controls.properties).then(() => {
      this.$modal.show(EditPropertiesModal, {}, {
        clickToClose: true,
        height: 'auto',
        pivotX: 1.0,
        pivotY: 1.0,
      })
    })
  }
}
</script>
