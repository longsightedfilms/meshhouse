<template>
  <div class="card_image">
    <img
      class="image"
      :src="retrieveImage(src)"
    >
    <img
      v-if="src !== ''"
      class="icon"
      :src="`/assets/files/${extension.substr(1)}.svg`"
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
    return src !== ''
      ? this.$forceReloadImage(src)
      : `/assets/files/${this.$props.extension.substr(1)}.svg`
  }
}
</script>
