<template>
  <div class="model-image">
    <img
      :class="imageClass"
      :src="retrieveImage"
      loading="eager"
    >
    <img
      v-if="model.image !== ''"
      class="icon"
      :src="iconFile"
    >
    <div class="badges">
      <span
        v-if="model.mature_content"
        class="badge badge--mature"
        :title="$t('hints.navbar.matureContent')"
      >
        <vue-icon
          icon="gender"
          raster
        />
      </span>
    </div>
  </div>
</template>
<style src="./ModelImage.sass" lang="sass"></style>
<script src="./ModelImageLocal.ts" lang="ts"></script>
