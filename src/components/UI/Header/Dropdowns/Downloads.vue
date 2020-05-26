<template>
  <fragment>
    <p class="title">
      <span>{{ $t('hints.navbar.downloads') }}</span>
    </p>
    <div
      v-for="(download, idx) in $store.state.downloads"
      :key="idx"
      class="download__item"
    >
      <div class="image">
        <img :src="download.img">
      </div>
      <div class="content">
        <p class="title">
          {{ download.title }}
        </p>
        <progress
          class="progress"
          max="100"
          :value="computeProgress(download)"
        />
        <p class="status">
          <span>{{ computeFileSize(download.downloadedSize) + ' / ' + computeFileSize(download.totalSize) }}</span>
        </p>
      </div>
      <div class="buttons">
        <button class="button button--flat">
          <vue-icon icon="settings" />
        </button>
        <button class="button button--flat button--flat-danger">
          <vue-icon icon="delete" />
        </button>
      </div>
    </div>
  </fragment>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Fragment } from 'vue-fragment';
import { formatBytes } from '@/plugins/models-db/functions';

@Component({
  components: {
    Fragment
  }
})
export default class DownloadsDropdown extends Vue {
  computeProgress(item: Download): number {
    return item.totalSize / 100 * item.downloadedSize;
  }

  computeFileSize(bytes: number): string {
    return formatBytes(bytes);
  }
}
</script>
