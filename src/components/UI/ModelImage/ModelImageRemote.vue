<template>
  <div class="model-image">
    <img
      :class="imageClass"
      :src="imageLink"
      loading="lazy"
    >
    <img
      v-if="model.thumbnail !== ''"
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
      <span
        v-if="model.favorite"
        class="badge badge--saved"
        :title="$t('hints.navbar.favoriteItem')"
      >
        <vue-icon
          icon="bookmark"
          raster
        />
      </span>
      <span
        v-if="model.installed"
        class="badge badge--saved"
        :title="$t('hints.navbar.savedItem')"
      >
        <vue-icon
          icon="save-close"
          raster
        />
      </span>
    </div>
  </div>
</template>
<style src="./ModelImage.sass" lang="sass"></style>
<script src="./ModelImageRemote.ts" lang="ts"></script>
