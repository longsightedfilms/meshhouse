<template>
  <div class="card_image">
    <img
      :class="imageClass"
      :src="retrieveImage"
      :loading="isRemoteItem ? 'lazy' : 'eager'"
    >
    <img
      v-if="item.image !== ''"
      class="icon"
      :src="iconFile"
    >
    <div class="badges">
      <span
        v-if="item.mature_content"
        class="badge badge--mature"
        :title="$t('hints.navbar.matureContent')"
      >
        <vue-icon
          icon="gender"
          raster
        />
      </span>
      <span
        v-if="isRemoteItem && item.favorite"
        class="badge badge--saved"
        :title="$t('hints.navbar.favoriteItem')"
      >
        <vue-icon
          icon="bookmark"
          raster
        />
      </span>
      <span
        v-if="isRemoteItem && item.installed"
        class="badge badge--saved"
        :title="$t('hints.navbar.savedItem')"
      >
        <vue-icon
          icon="save-close"
          raster
        />
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { getLocalLink } from '@/functions/image';

@Component({})
export default class ModelImage extends Vue {
  @Prop({ type: Object, required: true }) readonly item!: Model

  get imageLink(): string {
    return getLocalLink(this.$props.item.image);
  }

  get isRemoteItem(): boolean {
    return Object.hasOwnProperty.call(this.$props.item, 'installed');
  }

  get retrieveImage(): string {
    if (this.isRemoteItem) {
      return this.imageLink;
    }
    return this.$props.item.image !== ''
      ? this.$forceReloadImage(this.imageLink)
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
