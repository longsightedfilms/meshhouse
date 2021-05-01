<template>
  <div>
    <application-header />
    <span class="application__main">
      <notification-container />
      <application-sidebar v-if="$route.meta.sidebar" />
      <main :class="contentClass">
        <transition
          name="v-transition-fluent-screen"
          mode="out-in"
          appear
        >
          <router-view />
        </transition>
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
import NotificationContainer from '@/components/UI/Notification/NotificationContainer.vue';

@Component({
  components: {
    ApplicationHeader,
    ApplicationSidebar,
    NotificationContainer
  },
  metaInfo() {
    return {
      htmlAttrs: {
        dir: this.$isRTL() ? 'rtl' : 'ltr',
        lang: this.$i18n.locale
      },
      bodyAttrs: {
        class: ((this as App).bodyClass)
      },
      titleTemplate: ((chunk): string => (chunk !== '' ? `${chunk} - Meshhouse` : 'Meshhouse')),
      changed: (newInfo): void => {
        this.$store.commit('setTitle', newInfo.title);
      }
    };
  }
})
export default class App extends Vue {
  bodyClass = 'application';

  @Watch('$store.state.controls.fullscreen')
  @Watch('$store.state.settings.theme')
  async updateApplicationClass(): Promise<void> {
    await this.handleApplicationClass();
  }

  async handleApplicationClass(): Promise<void> {
    let bodyClass = 'application';
    let cssTheme = '';

    const theme = await this.$ipcInvoke('get-application-setting', 'theme');
    const isFullScreen = await this.$ipcInvoke('is-fullscreen');

    const systemThemeDark = await this.$ipcInvoke('should-use-dark-theme');
    this.$store.commit('setSystemDarkTheme', systemThemeDark);
    const os = await this.$ipcInvoke('get-os');

    this.$ipcInvoke('set-theme-source', theme);
    this.$ipcInvoke('set-window-vibrance', theme);

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
    this.bodyClass = `${bodyClass} ${cssTheme}`;
  }

  async mounted(): Promise<void> {
    await this.loadStartupSettings();

    window.ipc.on('theme-updated', () => {
      this.handleApplicationClass();
    });
  }

  beforeDestroy(): void {
    window.ipc.removeAllListeners('theme-updated');
  }

  get contentClass(): string {
    let baseClass = 'application__content';
    if (this.$route.path === '/settings') {
      baseClass += ' application__content--lg';
    }

    return baseClass;
  }

  async loadStartupSettings(): Promise<void> {
    this.$i18n.locale = await this.$ipcInvoke('get-application-setting', 'language');
    const settings = await this.$ipcInvoke('get-all-settings');

    this.$store.commit('setApplicationSettings', settings);
    const currentDevice = await this.$ipcInvoke('get-machine-info');
    this.$store.commit('setCurrentDevice', currentDevice);

    await this.handleApplicationClass();
    await this.$ipcInvoke('watch-databases');
    if (settings.lastPage === 'lastCatalog') {
      if (this.$route.fullPath !== settings.applicationWindow.lastOpened) {
        await this.$router.push(settings.applicationWindow.lastOpened);
      }
    } else {
      await this.$router.push('/library');
    }

    await this.$ipcInvoke('app-loaded');
  }
}
</script>
