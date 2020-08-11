<template>
  <fragment>
    <p class="title">
      <span>{{ $t('hints.navbar.downloads') }}</span>
    </p>
    <div v-if="$store.state.downloads.length > 0">
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
          <p
            v-if="download.downloadedSize !== -1"
            class="status"
          >
            <span>{{ computeFileSize(download.downloadedSize) + ' / ' + computeFileSize(download.totalSize) }}</span>
          </p>
          <p
            v-else
            class="status"
          >
            <span>{{ $t('dropdowns.download.canceled') }}</span>
          </p>
        </div>
        <div class="buttons">
          <button
            v-if="!isFinished(download)"
            class="button button--flat button--flat-danger button--icon-only"
            @click="$store.commit('cancelDownloadItem', download)"
          >
            <vue-icon
              icon="stop"
              raster
            />
          </button>
          <button
            v-if="isFinished(download) && !isCanceled(download)"
            class="button button--flat button--icon-only"
            @click="$openFolder(download.path)"
          >
            <vue-icon icon="folder" />
          </button>
          <button
            v-if="isFinished(download) || isCanceled(download)"
            class="button button--flat button--flat-danger button--icon-only"
            @click="$store.commit('deleteDownloadItem', idx)"
          >
            <vue-icon icon="delete" />
          </button>
        </div>
      </div>
    </div>
    <div
      v-else
      class="download__empty"
    >
      <vue-icon icon="box" />
      <p>
        {{ $t('dropdowns.download.empty') }}
      </p>
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
  isFinished(item: Download): boolean {
    return item.downloadedSize === item.totalSize;
  }

  isCanceled(item: Download): boolean {
    return item.downloadedSize === -1 && item.totalSize === -1;
  }

  computeProgress(item: Download): number {
    return item.downloadedSize / item.totalSize * 100;
  }

  computeFileSize(bytes: number): string {
    return formatBytes(bytes);
  }
}
</script>
