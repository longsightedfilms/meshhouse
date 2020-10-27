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
  useInvertedIcon = this.$ipcSendSync('should-use-dark-theme') === true
    || this.$store.state.settings.theme === 'dark'

  @Watch('$store.state.settings.theme')
  onThemeChanged(val: string): void {
    this.useInvertedIcon = this.$ipcSendSync('should-use-dark-theme') === true
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
