<template>
  <fragment>
    <p class="title">
      <span>{{ $t('dropdowns.mainmenu.title.header') }}</span>
    </p>
    <a
      v-if="currentOS !== 'darwin'"
      @click="toggleFullscreen"
    >
      <vue-icon
        icon="full-screen"
        raster
      />
      {{ $t('dropdowns.mainmenu.fullscreen') }}
    </a>
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

import { ipcRenderer } from 'electron';

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
      }, {
        'before-open': () => {
          this.$store.commit('setModalVisibility', true);
        },
        'before-close': () => {
          this.$store.commit('setModalVisibility', false);
        }
      });
    });

    ipcRenderer.on('update-not-available', () => {
      this.$modal.show(UpdateNotAvailableModal, {}, {
        clickToClose: true,
        height: 'auto'
      }, {
        'before-open': () => {
          this.$store.commit('setModalVisibility', true);
        },
        'before-close': () => {
          this.$store.commit('setModalVisibility', false);
        }
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
      width: '100%',
      height: '100%',
    }, {
      'before-open': () => {
        this.$store.commit('setModalVisibility', true);
      },
      'before-close': () => {
        this.$store.commit('setModalVisibility', false);
      }
    });
  }

  showAbout(): void {
    this.$modal.show(AboutProgramModal, {}, {
      clickToClose: true,
      height: 'auto'
    }, {
      'before-open': () => {
        this.$store.commit('setModalVisibility', true);
      },
      'before-close': () => {
        this.$store.commit('setModalVisibility', false);
      }
    });
  }

  openHelp(): void {
    ipcRenderer.invoke('open-external', 'https://docs.meshhouse.art/');
  }

  openReleaseNotes(): void {
    let version = process.env.VUE_APP_VERSION !== undefined ? process.env.VUE_APP_VERSION : '0.0.0';
    version = version.replace(/\./gm, '-');
    ipcRenderer.invoke('open-external', `https://docs.meshhouse.art/changelog#v-${version}`);
  }

  checkUpdates(): void {
    ipcRenderer.send('check-update');
  }

  async toggleFullscreen(): Promise<void> {
    await ipcRenderer.invoke('set-fullscreen');
    this.$store.commit('setFullscreen', ipcRenderer.sendSync('is-fullscreen'));
  }

  get currentOS(): string {
    return ipcRenderer.sendSync('get-os');
  }
}
</script>
