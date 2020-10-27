<template>
  <div>
    <application-header />
    <span class="application__main">
      <application-sidebar />
      <main
        v-bar
        class="application__content"
      >
        <div ref="inner">
          <div class="application__inner">
            <router-view />
          </div>
        </div>
      </main>
    </span>
  </div>
</template>

<style lang="sass">
@import 'sass/main'
</style>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import ApplicationHeader from '@/components/UI/Header/ApplicationHeader.vue';
import ApplicationSidebar from '@/components/UI/Sidebar/ApplicationSidebar.vue';

@Component({
  components: {
    ApplicationHeader,
    ApplicationSidebar,
  },
  metaInfo() {
    return {
      htmlAttrs: {
        dir: this.$isRTL() ? 'rtl' : 'ltr',
        lang: this.$i18n.locale
      },
      bodyAttrs: {
        class: ((this as App).applicationClass())
      },
      titleTemplate: ((chunk): string => (chunk !== '' ? `${chunk} - Meshhouse` : 'Meshhouse')),
      changed: (newInfo): void => {
        this.$store.commit('setTitle', newInfo.title);
      }
    };
  }
})
export default class App extends Vue {
  @Watch('$store.state.controls.fullscreen')
  applicationClass(): string {
    let bodyClass = 'application';
    let cssTheme = '';

    const theme = this.$ipcSendSync('get-application-setting', 'theme') || 'light';
    const isFullScreen = this.$store.state.controls.fullscreen;

    const systemThemeDark = this.$ipcSendSync('should-use-dark-theme');
    const os = this.$ipcSendSync('get-os');

    this.$ipcInvoke('set-theme-source', this.$store.state.settings.theme);

    if (theme !== 'system') {
      cssTheme = this.$store.state.settings.theme === 'light' ? 'theme--light' : 'theme--dark';
    } else {
      cssTheme = systemThemeDark ? 'theme--dark' : 'theme--light';
    }

    switch(os) {
    case 'win32':
      if(!isFullScreen) {
        bodyClass += ' application--windows';
      } else {
        bodyClass = `${bodyClass} ${bodyClass}--fullscreen`;
      }
      break;
    case 'linux':
      bodyClass += ' application--linux';
      break;
    case 'darwin':
      bodyClass += ' application--mac';
      break;
    default:
      bodyClass = String(bodyClass);
      break;
    }
    return `${bodyClass} ${cssTheme}`;
  }

  mounted(): void {
    this.loadStartupSettings();
  }

  async loadStartupSettings(): Promise<void> {
    this.$i18n.locale = this.$ipcSendSync('get-application-setting', 'language');
    const settings = this.$ipcSendSync('get-all-settings');

    this.$store.commit('setApplicationSettings', settings);

    await this.$ipcInvoke('watch-databases');

    if (settings.lastPage === 'lastCatalog') {
      if (this.$route.fullPath !== settings.applicationWindow.lastOpened) {
        this.$router.push(settings.applicationWindow.lastOpened);
      }
    } else {
      this.$router.push('/');
    }
  }
}
</script>
