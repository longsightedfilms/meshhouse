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
    <router-link to="/settings">
      <vue-icon icon="settings" />
      {{ $t('dropdowns.mainmenu.settings') }}
    </router-link>
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
    <a
      v-if="showDevTools"
      @click="$ipcInvoke('open-dev-tools')"
    >
      <vue-icon
        icon="update"
        raster
      />
      Open Chrome DevTools
    </a>
  </fragment>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Fragment } from 'vue-fragment';
import AboutProgramModal from '@/views/Modals/AboutProgramModal.vue';
import UpdateAvailableModal from '@/views/Modals/Updater/UpdateAvailableModal.vue';
import UpdateNotAvailableModal from '@/views/Modals/Updater/UpdateNotAvailableModal.vue';

@Component({
  components: {
    Fragment
  }
})
export default class MainMenuDropdown extends Vue {

  mounted(): void {
    window.ipc.on('update-available', () => {
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

    window.ipc.on('update-not-available', () => {
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
    window.ipc.removeAllListeners('update-available');
    window.ipc.removeAllListeners('update-not-available');
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
    window.ipc.invoke('open-external', 'https://docs.meshhouse.art/');
  }

  openReleaseNotes(): void {
    let version = process.env.VUE_APP_VERSION !== undefined ? process.env.VUE_APP_VERSION : '0.0.0';
    version = version.replace(/\./gm, '-');
    window.ipc.invoke('open-external', `https://docs.meshhouse.art/changelog#v-${version}`);
  }

  checkUpdates(): void {
    window.ipc.send('check-update');
  }

  async toggleFullscreen(): Promise<void> {
    await this.$ipcInvoke('set-fullscreen');
    this.$store.commit('setFullscreen', await this.$ipcInvoke('is-fullscreen'));
  }

  get currentOS(): string {
    return this.$store.getters.currentOS;
  }

  get showDevTools(): boolean {
    return process.env.NODE_ENV === 'development';
  }
}
</script>
