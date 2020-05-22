<template>
  <fragment>
    <a @click="showSettings">
      <vue-icon icon="settings" />
      {{ $t('dropdowns.mainmenu.settings') }}
    </a>
    <a @click="showAbout">
      <vue-icon icon="info" />
      {{ $t('dropdowns.mainmenu.aboutProgram') }}
    </a>
    <a @click="checkUpdates">
      <vue-icon
        icon="update"
        raster
      />
      {{ $t('dropdowns.mainmenu.checkUpdates') }}
    </a>
  </fragment>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Fragment } from 'vue-fragment'
import SettingsModal from '@/views/Modals/SettingsModal.vue'
import AboutProgramModal from '@/views/Modals/AboutProgramModal.vue'
import UpdateAvailableModal from '@/views/Modals/Updater/UpdateAvailableModal.vue'
import UpdateNotAvailableModal from '@/views/Modals/Updater/UpdateNotAvailableModal.vue'

import { ipcRenderer } from 'electron'

@Component({
  components: {
    Fragment
  }
})
export default class MainMenuDropdown extends Vue {

  showSettings(): void {
    this.$modal.show(SettingsModal, {}, {
      adaptive: true,
      clickToClose: true,
      width: '1024px',
      height: 'auto',
    })
  }

  showAbout(): void {
    this.$modal.show(AboutProgramModal, {}, {
      clickToClose: true,
      height: 'auto'
    })
  }

  checkUpdates(): void {
    ipcRenderer.send('check-update')

    ipcRenderer.on('update-available', () => {
      ipcRenderer.removeAllListeners('update-available')
      this.$modal.show(UpdateAvailableModal, {}, {
        clickToClose: true,
        height: 'auto'
      })
    })

    ipcRenderer.on('update-not-available', () => {
      ipcRenderer.removeAllListeners('update-not-available')
      this.$modal.show(UpdateNotAvailableModal, {}, {
        clickToClose: true,
        height: 'auto'
      })
    })
  }
}
</script>
