<template>
  <fragment>
    <li>
      <a
        v-t="'context.model.open'"
        @click.prevent="$openItem($store.state.controls.properties.path)"
      />
    </li>
    <li>
      <a
        v-t="'context.model.openFolder'"
        @click.prevent="$openFolder($store.state.controls.properties.path)"
      />
    </li>
    <li>
      <a
        v-t="'context.model.properties'"
        @click.prevent="openProperties"
      />
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
