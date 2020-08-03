<template>
  <div class="home">
    <img
      class="logo"
      src="/assets/integrations/meshhouse.svg"
    >
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({
  metaInfo: {
    title: 'Meshhouse',
    titleTemplate: ''
  }
})
export default class Home extends Vue {}
</script>
