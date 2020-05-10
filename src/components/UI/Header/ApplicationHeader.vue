<template>
  <header class="application__header">
    <img
      class="application__header-logo"
      src="/assets/integrations/meshhouse.svg"
      alt="Meshhouse"
    >
    <header-navigation />
    <header-window-buttons />
  </header>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import HeaderNavigation from '@/components/UI/Header/HeaderNavigation.vue'
import HeaderWindowButtons from '@/components/UI/Header/HeaderWindowButtons.vue'
import { remote } from 'electron'

@Component({
  components: {
    HeaderNavigation,
    HeaderWindowButtons
  }
})
export default class ApplicationHeader extends Vue {}
</script>
