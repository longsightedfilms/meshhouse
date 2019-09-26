<template>
  <v-select
    v-model="currentLang"
    :items="langs"
    :label="$t('settings.language.title')"
    @change="onChange"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { ILanguage } from '@/plugins/models-db/interfaces'

@Component({})

export default class LanguageSelector extends Vue {
  currentLang: string =  ''
  langs: ILanguage[] = [
    {
      text: "English",
      value: "en"
    },
    {
      text: "Русский",
      value: "ru"
    }
  ]

  mounted() {
    this.currentLang = this.$i18n.locale
  }

  onChange(lang: string): void {
    this.$i18n.locale = lang
    this.$settingsSet(['language', lang])
  }
}
</script>