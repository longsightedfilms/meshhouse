<template>
  <img
    v-bind="$attrs"
    :class="iconClass"
    :src="retrieveImage(icon)"
  >
</template>
<style src="./Icon.sass" lang="sass"></style>
<script src="./Icon.ts" lang="ts"></script>
