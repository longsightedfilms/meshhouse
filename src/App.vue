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
  @Watch('$store.state.settings.systemDarkTheme')
  async updateApplicationClass(): Promise<void> {
    await this.handleApplicationClass();
  }

  async handleApplicationClass(): Promise<void> {
    let bodyClass = 'application';
    let cssTheme = '';

    const theme = this.$store.state.settings.theme;
    const os = this.$store.getters.currentOS;
    const isFullScreen = await this.$ipcInvoke<boolean>('is-fullscreen');

    this.$ipcInvoke<void>('set-theme-source', theme);
    this.$ipcInvoke<void>('set-window-vibrance', theme);

    const systemDarkTheme = await this.$ipcInvoke<boolean>('should-use-dark-theme');
    this.$store.commit('setSystemDarkTheme', systemDarkTheme);

    if (theme !== 'system') {
      cssTheme = this.$store.state.settings.theme === 'light' ? 'theme--light' : 'theme--dark';
    } else {
      cssTheme = systemDarkTheme ? 'theme--dark' : 'theme--light';
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

  created(): void {
    this.loadStartupSettings();
  }

  get contentClass(): string {
    let baseClass = 'application__content';
    if (!this.$route.meta.toolbar) {
      baseClass += ' application__content--lg';
    }

    return baseClass;
  }

  async loadStartupSettings(): Promise<void> {
    this.$ipcInvoke<void>('watch-databases');

    const promises = [
      this.handleApplicationClass(),
      this.$store.dispatch('getOS'),
      this.$ipcInvoke<ApplicationSettings>('get-all-settings')
        .then(async(settings) => {
          this.$i18n.locale = settings.language;
          this.$store.commit('setApplicationSettings', settings);

          if (settings.lastPage === 'lastCatalog') {
            if (this.$route.fullPath !== settings.applicationWindow.lastOpened) {
              await this.$router.push(settings.applicationWindow.lastOpened);
            }
          } else {
            await this.$router.push('/library');
          }
        })
    ];
    // Get machine info in unblocking way
    this.$ipcInvoke<any>('get-machine-info').then((currentDevice) => {
      this.$store.commit('setCurrentDevice', currentDevice);
    });

    await Promise.allSettled(promises);

    try {
      await this.$ipcInvoke('app-loaded');
    } catch (err) {
      console.warn(err);
    }
  }
}
</script>
