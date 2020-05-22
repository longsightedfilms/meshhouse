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
        <p>{{ computeFileSize(progress.transferred) }}/{{ computeFileSize(progress.total) }}</p>
      </div>
    </div>
    <div class="modal_actions">
      <button
        v-if="$store.state.controls.updates.downloaded"
        class="button button--primary"
        @click="installUpdate"
      >
        {{ $t('common.buttons.install') }}
      </button>
      <button
        v-if="!$store.state.controls.updates.downloaded"
        class="button button--primary"
        :disabled="$store.state.controls.updates.downloading"
        @click="downloadUpdate"
      >
        {{ $t('common.buttons.download') }}
      </button>
      <button
        class="button button--danger"
        @click="$emit('close')"
      >
        {{ $t('common.buttons.close') }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { formatBytes } from '@/plugins/models-db/functions'
import { ipcRenderer } from 'electron'

@Component({})
export default class UpdateAvailableModal extends Vue {
  progress = {
    bytesPerSecond: 0,
    percent: 0,
    total: 0,
    transferred: 0
  }

  mounted(): void {
    ipcRenderer.on('download-progress', (progress: any) => {
      this.$store.commit('setUpdateDownload', true)
      this.progress = progress
    })

    ipcRenderer.on('update-downloaded', () => {
      this.$store.commit('setUpdateDownload', false)
      this.$store.commit('setUpdateDownloadComplete', true)
    })
  }

  computeFileSize(bytes: number): string {
    return formatBytes(bytes)
  }

  downloadUpdate(): void {
    ipcRenderer.send('download-update')
    this.$store.commit('setUpdateDownload', true)
  }

  installUpdate(): void {
    ipcRenderer.send('install-update')
  }
}
</script>
