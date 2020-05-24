<template>
  <div :class="applicationClass">
    <application-header />
    <span
      class="application__main"
      :style="contentStyles"
    >
      <application-sidebar />
      <main
        v-bar
        class="application__content"
      >
        <div>
          <div style="max-height: calc(100vh - 80px)">
            <router-view />
          </div>
        </div>
      </main>
    </span>
    <modals-container />
  </div>
</template>

<style lang="sass">
@import 'sass/main'
</style>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import ApplicationHeader from '@/components/UI/Header/ApplicationHeader.vue'
import ApplicationSidebar from '@/components/UI/Sidebar/ApplicationSidebar.vue'

import { remote } from 'electron'

@Component({
  components: {
    ApplicationHeader,
    ApplicationSidebar,
  },
})
export default class App extends Vue {

  get applicationClass(): string {
    let bodyClass = 'application'
    const systemThemeDark = (remote as any).nativeTheme.shouldUseDarkColors
    const theme = this.$settingsGet('theme') || 'light'
    let cssTheme = '';

    (remote as any).nativeTheme.themeSource = this.$store.state.controls.theme

    if (theme !== 'system') {
      cssTheme = this.$store.state.controls.theme === 'light' ? 'theme--light' : 'theme--dark'
    } else {
      cssTheme = systemThemeDark ? 'theme--dark' : 'theme--light'
    }

    switch(remote.process.platform) {
      case "win32":
        bodyClass += ' application--windows'
        break
      case "linux":
        bodyClass += ' application--linux'
        break
      case "darwin":
        bodyClass += ' application--mac'
        break
      default:
        bodyClass += ''
        break
    }
    return `${bodyClass} ${cssTheme}`
  }

  get contentStyles(): object {
    const databasesVisible = this.$store.state.controls.databasesVisible ? 'minmax(300px, 17vw)' : '1rem'
    return {
      gridTemplateColumns: `${databasesVisible} 1fr`
    }
  }

  mounted(): void {
    this.loadStartupSettings()
  }

  async loadStartupSettings(): Promise<void> {
    this.$i18n.locale = this.$settingsGet('language')
    const theme = this.$settingsGet('theme') || 'light'
    const lastOpened = this.$settingsGet('applicationWindow.lastOpened')
    const pageOpened = this.$settingsGet('lastPage') || 'main'

    this.$store.commit('setTheme', theme)
    this.$store.commit('setCurrentLastPage', pageOpened)

    await this.$initDatabases()
    await this.$watchDatabases()

    if (pageOpened === 'lastCatalog') {
      this.$router.push(lastOpened)
    } else {
      this.$router.push('/')
    }
  }
}
</script>
