<template>
  <div class="card_image">
    <img
      :class="imageClass"
      :src="imageLink"
      loading="lazy"
    >
    <img
      v-if="model.thumbnail !== ''"
      class="icon"
      :src="iconFile"
    >
    <div class="badges">
      <span
        v-if="model.mature_content"
        class="badge badge--mature"
        :title="$t('hints.navbar.matureContent')"
      >
        <vue-icon
          icon="gender"
          raster
        />
      </span>
      <span
        v-if="model.favorite"
        class="badge badge--saved"
        :title="$t('hints.navbar.favoriteItem')"
      >
        <vue-icon
          icon="bookmark"
          raster
        />
      </span>
      <span
        v-if="model.installed"
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
export default class ModelImageRemote extends Vue {
  @Prop({ type: Object, required: true }) readonly model!: RemoteModel

  get imageLink(): string {
    return getLocalLink(this.model.thumbnail);
  }

  get imageClass(): string {
    return `image ${this.model.thumbnail === '' ? 'image--icon' : ''}`;
  }

  get iconFile(): string {
    const extension = this.model.extension.substr(1);
    switch (extension) {
    case 'ma':
    case 'mb':
      return '/assets/dcc/maya.svg';
    case 'fbx':
      return '/assets/dcc/max.svg';
    default:
      return `/assets/dcc/${extension}.svg`;
    }
  }
}
</script>
