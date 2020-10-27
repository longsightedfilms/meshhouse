<template>
  <div :class="loaderClass">
    <div class="circle" />
    <div class="circle" />
    <div class="circle" />
    <div class="circle" />
    <div class="circle" />
  </div>
</template>

<style lang="sass">
@import 'Loader'
</style>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
  props: {
    size: {
      type: String,
      required: false
    }
  }
})
export default class Loader extends Vue {
  get loaderClass(): string {
    const baseClass = 'loader';

    let fullClass = baseClass;
    if (this.$props.size !== undefined) {
      fullClass += ` loader--${this.$props.size}`;
    }

    return fullClass;
  }
}
</script>
