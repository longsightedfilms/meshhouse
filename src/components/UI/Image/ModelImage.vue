<template>
  <div class="card_image">
    <img
      :class="imageClass"
      :src="retrieveImage"
    >
    <img
      v-if="item.image !== ''"
      class="icon"
      :src="iconFile"
    >
    <span
      v-if="isLocalItem && item.installed"
      class="icon-badge"
    >
      <vue-icon icon="checked" />
    </span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
  props: {
    item: {
      type: Object,
      required: true
    }
  }
})
export default class ModelImage extends Vue {
  get isLocalItem(): boolean {
    return Object.hasOwnProperty.call(this.$props.item, 'installed');
  }

  get retrieveImage(): string {
    return this.$props.item.image !== ''
      ? this.$forceReloadImage(this.$props.item.image)
      : `/assets/files/${this.$props.item.extension.substr(1)}.svg`;
  }

  get imageClass(): string {
    return `image ${this.$props.item.image === '' ? 'image--icon' : ''}`;
  }

  get iconFile(): string {
    const extension = this.$props.item.extension.substr(1);
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
