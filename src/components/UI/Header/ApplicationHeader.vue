<template>
  <header class="application__header">
    <div
      v-show="!$store.state.controls.isLoaded"
      class="progress__container"
    >
      <div class="progress-main" />
    </div>
    <header-navigation
      v-if="$route.meta.toolbar"
    />
    <header-window-title />
    <header-window-buttons />
  </header>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import HeaderNavigation from '@/components/UI/Header/HeaderNavigation.vue';
import HeaderWindowTitle from '@/components/UI/Header/HeaderWindowTitle.vue';
import HeaderWindowButtons from '@/components/UI/Header/HeaderWindowButtons.vue';

@Component({
  components: {
    HeaderNavigation,
    HeaderWindowButtons,
    HeaderWindowTitle
  },
})
export default class ApplicationHeader extends Vue {}
</script>
