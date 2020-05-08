<template>
  <div v-bar>
    <div>
      <div class="tab">
        <language-selector />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import LanguageSelector from '@/components/LanguageSelector.vue'

@Component({
  components: {
    LanguageSelector
  }
})

export default class MainSettings extends Vue {}
</script>
