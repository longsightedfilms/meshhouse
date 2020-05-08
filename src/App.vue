<template>
  <div :class="detectUserOS">
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
      <filters-sidebar />
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
import FiltersSidebar from '@/components/UI/Sidebar/FiltersSidebar.vue'

import { remote } from 'electron'

@Component({
  components: {
    ApplicationHeader,
    ApplicationSidebar,
    FiltersSidebar,
  },
})
export default class App extends Vue {
  get detectUserOS(): string {
    let bodyClass = 'application'
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
    return bodyClass
  }

  get contentStyles(): object {
    const filtersVisible = this.$store.state.controls.filtersVisible ? '300px' : '1rem'
    const databasesVisible = this.$store.state.controls.databasesVisible ? '300px' : '1rem'
    return {
      gridTemplateColumns: `${databasesVisible} 1fr ${filtersVisible}`
    }
  }

  mounted(): void {
    this.$i18n.locale = this.$settingsGet('language')
    const lastOpened = this.$settingsGet('applicationWindow.lastOpened')
    this.$router.push(lastOpened)
  }
}
</script>
