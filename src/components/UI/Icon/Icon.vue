<template>
  <img
    :class="iconClass"
    :src="retrieveImage(icon)"
  >
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  props: {
    icon: {
      type: String,
      required: true,
      default: 'edit'
    },
    inverted: {
      type: Boolean,
      required: false,
      default: false
    },
    raster: {
      type: Boolean,
      required: false,
      default: false
    }
  }
})
export default class ModelImage extends Vue {
  get iconClass(): string {
    return `icon ${this.$props.inverted ? 'icon--inverted' : ''}`
  }

  retrieveImage(icon: string): string {
    return `/assets/icons/${icon !== '' ? icon : 'edit'}.${this.$props.raster ? 'png' : 'svg'}`
  }
}
</script>
