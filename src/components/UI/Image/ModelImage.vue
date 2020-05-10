<template>
  <div class="card_image">
    <img
      class="image"
      :src="retrieveImage(src)"
    >
    <img
      v-if="src !== ''"
      class="icon"
      :src="$returnExtensionIcon(extension)"
    >
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  props: {
    src: {
      type: String,
      required: true,
      default: ''
    },
    extension: {
      type: String,
      required: true,
      default: ''
    }
  }
})
export default class ModelImage extends Vue {
  retrieveImage(src: string): string {
    return src !== '' ? this.$forceReloadImage(src) : '/assets/integrations/meshhouse.svg'
  }
}
</script>
