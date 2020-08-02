<template>
  <div class="card_image">
    <img
      :class="imageClass(src)"
      :src="retrieveImage(src)"
    >
    <img
      v-if="src !== ''"
      class="icon"
      :src="iconFile"
    >
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

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
      : `/assets/files/${this.$props.extension.substr(1)}.svg`;
  }

  imageClass(src: string): string {
    return `image ${src === '' ? 'image--icon' : ''}`;
  }

  get iconFile(): string {
    const extension = this.$props.extension.substr(1);
    switch (extension) {
    case 'ma':
    case 'mb':
      return '/assets/dcc/maya.svg';
    default:
      return `/assets/dcc/${extension}.svg`;
    }
  }
}
</script>
