<template>
  <div class="setting">
    <label>{{ $t('modals.settings.tabs.common.content.language') }}</label>
    <div class="input--select">
      <select
        v-model="currentLang"
        class="input"
        @change="onChange"
      >
        <option
          v-for="(lang, index) in langs"
          :key="index"
          :value="lang.value"
        >
          {{ lang.text }}
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

@Component({})

export default class LanguageSelector extends Vue {
  currentLang =  ''
  langs: Language[] = [
    {
      text: "English",
      value: "en"
    },
    {
      text: "Русский",
      value: "ru"
    }
  ]

  mounted(): void {
    this.currentLang = this.$i18n.locale
  }

  onChange(event: Event): void {
    const target = (event.target as HTMLInputElement)

    this.$i18n.locale = target.value
    this.$settingsSet('language', target.value)
  }
}
</script>
