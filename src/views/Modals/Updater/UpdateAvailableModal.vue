<template>
  <div class="modal modal--updater">
    <header class="modal_header">
      <h2>{{ $t('modals.updater.title') }}</h2>
    </header>
    <div class="modal_content">
      <p>{{ $t('modals.updater.available') }}</p>
      <div
        v-if="$store.state.controls.updates.downloading"
        class="updater"
      >
        <progress
          class="progress"
          max="100"
          :value="progress.percent"
        />
        <p>{{ $formatSize(progress.transferred) }}/{{ $formatSize(progress.total) }}</p>
      </div>
    </div>
    <div class="modal_actions">
      <v-button
        v-if="$store.state.controls.updates.downloaded"
        type="primary"
        @click="installUpdate"
      >
        {{ $t('common.buttons.install') }}
      </v-button>
      <v-button
        v-if="!$store.state.controls.updates.downloaded"
        type="primary"
        :busy="$store.state.controls.updates.downloading"
        @click="downloadUpdate"
      >
        {{ $t('common.buttons.download') }}
      </v-button>
      <v-button
        :disabled="$store.state.controls.updates.downloading"
        @click="$emit('close')"
      >
        {{ $t('common.buttons.close') }}
      </v-button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import type { IpcRendererEvent } from 'electron';

@Component({})
export default class UpdateAvailableModal extends Vue {
  progress = {
    bytesPerSecond: 0,
    percent: 0,
    total: 0,
    transferred: 0
  }

  mounted(): void {
    window.ipc.on('download-progress', (event: IpcRendererEvent, progress: ProgressInfo): void => {
      this.$store.commit('setUpdateDownload', true);
      this.progress = progress;
    });

    window.ipc.on('update-downloaded', () => {
      this.$store.commit('setUpdateDownload', false);
      this.$store.commit('setUpdateDownloadComplete', true);
    });
  }

  downloadUpdate(): void {
    window.ipc.send('download-update');
    this.$store.commit('setUpdateDownload', true);
  }

  installUpdate(): void {
    window.ipc.send('install-update');
  }
}
</script>
