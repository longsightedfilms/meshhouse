<template functional>
  <header class="application__header">
    <img
      class="application__header-logo"
      src="/assets/integrations/meshhouse.svg"
      alt="Meshhouse"
    >
    <component :is="injections.components.HeaderNavigation" />
    <component :is="injections.components.HeaderWindowButtons" />
  </header>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import HeaderNavigation from '@/components/UI/Header/HeaderNavigation.vue';
import HeaderWindowButtons from '@/components/UI/Header/HeaderWindowButtons.vue';

@Component({
  inject: {
    components: {
      default: {
        HeaderNavigation,
        HeaderWindowButtons
      },
    },
  },
})
export default class ApplicationHeader extends Vue {}
</script>
