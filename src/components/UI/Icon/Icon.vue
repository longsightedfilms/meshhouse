<template>
  <img
    :class="iconClass"
    :src="retrieveImage(icon)"
  >
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { remote } from 'electron';

@Component({
  props: {
    icon: {
      type: String,
      required: true,
      default: 'edit'
    },
    raster: {
      type: Boolean,
      required: false,
      default: false
    }
  }
})
export default class Icon extends Vue {
  useInvertedIcon = remote.nativeTheme.shouldUseDarkColors === true
    || this.$store.state.controls.theme === 'dark'

  @Watch('$store.state.controls.theme')
  onThemeChanged(val: string): void {
    this.useInvertedIcon = remote.nativeTheme.shouldUseDarkColors === true
    || val === 'dark';
  }


  get iconClass(): string {
    return `icon ${this.useInvertedIcon ? 'icon--inverted' : ''}`;
  }

  retrieveImage(icon: string): string {
    return `/assets/icons/${icon !== '' ? icon : 'edit'}.${this.$props.raster ? 'png' : 'svg'}`;
  }
}
</script>
