<template>
  <div v-bar>
    <div>
      <div class="tab">
        <language-selector />
        <theme-selector />
        <last-page-selector />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import LastPageSelector from '@/components/ComposedSettings/LastPageSelector.vue';
import LanguageSelector from '@/components/ComposedSettings/LanguageSelector.vue';
import ThemeSelector from '@/components/ComposedSettings/ThemeSelector.vue';

@Component({
  components: {
    LastPageSelector,
    LanguageSelector,
    ThemeSelector
  }
})

export default class MainSettings extends Vue {}
</script>
