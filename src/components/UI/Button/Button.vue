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
<style src="./Button.sass" lang="sass"></style>
<script src="./Button.ts" lang="ts"></script>
