<template>
  <div class="setting">
    <label>{{ $t('modals.settings.tabs.common.content.theme.title') }}</label>
    <div class="input--select">
      <select
        v-model="currentTheme"
        class="input"
        @change="onChange"
      >
        <option value="light">
          {{ $t('modals.settings.tabs.common.content.theme.content.light') }}
        </option>
        <option value="dark">
          {{ $t('modals.settings.tabs.common.content.theme.content.dark') }}
        </option>
        <option value="system">
          {{ $t('modals.settings.tabs.common.content.theme.content.system') }}
        </option>
      </select>
      <vue-icon
        icon="caret-forward"
        raster
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { remote } from 'electron'

@Component({})

export default class ThemeSelector extends Vue {
  currentTheme =  ''

  mounted(): void {
    this.currentTheme = this.$store.state.controls.theme
  }

  onChange(event: Event): void {
    const target = (event.target as HTMLInputElement);
    const theme = (target.value as Theme)

    remote.nativeTheme.themeSource = theme
    this.$store.commit('setTheme', theme)
    this.$settingsSet('theme', theme)
  }
}
</script>
