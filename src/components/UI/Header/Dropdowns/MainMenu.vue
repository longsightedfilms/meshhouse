<template>
  <fragment>
    <p class="title">
      <span>{{ $t('dropdowns.mainmenu.title.header') }}</span>
    </p>
    <a @click="showSettings">
      <vue-icon icon="settings" />
      {{ $t('dropdowns.mainmenu.settings') }}
    </a>
    <p class="title">
      <span>{{ $t('dropdowns.mainmenu.title.help') }}</span>
    </p>
    <a @click="openHelp">
      <vue-icon
        icon="user-manual"
        raster
      />
      {{ $t('dropdowns.mainmenu.help') }}
    </a>
    <a @click="openReleaseNotes">
      <vue-icon icon="news" />
      {{ $t('dropdowns.mainmenu.releaseNotes') }}
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
import Vue from 'vue';
import Component from 'vue-class-component';
import { Fragment } from 'vue-fragment';
import SettingsModal from '@/views/Modals/SettingsModal.vue';
import AboutProgramModal from '@/views/Modals/AboutProgramModal.vue';
import UpdateAvailableModal from '@/views/Modals/Updater/UpdateAvailableModal.vue';
import UpdateNotAvailableModal from '@/views/Modals/Updater/UpdateNotAvailableModal.vue';

import { shell, ipcRenderer } from 'electron';

@Component({
  components: {
    Fragment
  }
})
export default class MainMenuDropdown extends Vue {

  mounted(): void {
    ipcRenderer.on('update-available', () => {
      this.$modal.show(UpdateAvailableModal, {}, {
        clickToClose: true,
        height: 'auto'
      });
    });

    ipcRenderer.on('update-not-available', () => {
      this.$modal.show(UpdateNotAvailableModal, {}, {
        clickToClose: true,
        height: 'auto'
      });
    });
  }

  destroyed(): void {
    ipcRenderer.removeAllListeners('update-available');
    ipcRenderer.removeAllListeners('update-not-available');
  }

  showSettings(): void {
    this.$modal.show(SettingsModal, {}, {
      adaptive: true,
      clickToClose: true,
      width: '1024px',
      height: 'auto',
    });
  }

  showAbout(): void {
    this.$modal.show(AboutProgramModal, {}, {
      clickToClose: true,
      height: 'auto'
    });
  }

  openHelp(): void {
    shell.openExternal('https://github.com/longsightedfilms/meshhouse/wiki');
  }

  openReleaseNotes(): void {
    const version = process.env.VUE_APP_VERSION !== undefined ? process.env.VUE_APP_VERSION : '0.0.0';
    shell.openExternal(`https://github.com/longsightedfilms/meshhouse/releases/tag/v${version}`);
  }

  checkUpdates(): void {
    ipcRenderer.send('check-update');
  }
}
</script>
