<template functional>
  <header class="application__header">
    <component :is="injections.components.HeaderNavigation" />
    <component :is="injections.components.HeaderWindowTitle" />
    <component :is="injections.components.HeaderWindowButtons" />
  </header>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import HeaderNavigation from '@/components/UI/Header/HeaderNavigation.vue';
import HeaderWindowTitle from '@/components/UI/Header/HeaderWindowTitle.vue';
import HeaderWindowButtons from '@/components/UI/Header/HeaderWindowButtons.vue';

@Component({
  inject: {
    components: {
      default: {
        HeaderNavigation,
        HeaderWindowButtons,
        HeaderWindowTitle
      },
    },
  },
})
export default class ApplicationHeader extends Vue {}
</script>
