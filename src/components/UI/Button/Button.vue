<template>
  <button
    v-bind="$attrs"
    :class="buttonClass"
    :disabled="$props.disabled"
    @click="$emit('click', $event)"
  >
    <v-loader
      v-if="$props.busy"
      size="sm"
    />
    <slot />
  </button>
</template>

<style lang="sass">
@import 'Button'
</style>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
  props: {
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    type: {
      type: String,
      required: false,
      default: ''
    },
    busy: {
      type: Boolean,
      required: false,
      default: false
    }
  }
})
export default class Button extends Vue {
  get buttonClass(): string {
    let fullClass = 'v-button';

    const type = this.$props.type.trim();
    const isBusy = this.$props.busy;

    if(type !== '') {
      fullClass += ` v-button--${this.$props.type.trim()}`;
    }

    if (isBusy) {
      fullClass += ' v-button--busy';
    }
    return fullClass;
  }
}
</script>
