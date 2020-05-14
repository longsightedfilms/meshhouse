<template>
  <div v-bar>
    <div>
      <div class="tab">
        <language-selector />
        <theme-selector />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import LanguageSelector from '@/components/ComposedSettings/LanguageSelector.vue'
import ThemeSelector from '@/components/ComposedSettings/ThemeSelector.vue'

@Component({
  components: {
    LanguageSelector,
    ThemeSelector
  }
})

export default class MainSettings extends Vue {}
</script>
