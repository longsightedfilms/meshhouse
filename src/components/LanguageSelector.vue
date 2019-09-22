<template>
  <v-select
    v-model="currentLang"
    :items="langs"
    :label="$t('settings.language.title')"
    @change="onChange"
  />
</template>

<script>
export default {
  name: "LanguageSelector",
  data() {
    return {
      currentLang: '',
      langs: [
        {
          text: "English",
          value: "en"
        },
        {
          text: "Русский",
          value: "ru"
        }
      ]
    }
  },
  mounted() {
    this.currentLang = this.$i18n.locale
  },
  methods: {
    onChange(lang) {
      this.$i18n.locale = lang
      this.$settingsSet(['language', lang])
    }
  }
}
</script>