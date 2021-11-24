<template>
  <aside class="layout__sidebar layout__sidebar--model">
    <div class="model-thumbnail">
      <img
        class="thumbnail"
        :src="model.thumbnail"
      >
      <img
        v-if="model.thumbnail !== ''"
        class="icon"
        :src="iconFile"
      >
      <div class="model-badges">
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
    <div class="catalog-header__info-block">
      <vue-icon
        icon="stack"
        raster
      />
      <p>{{ model.file_size }}</p>
    </div>
    <button
      v-if="!model.installed"
      class="button button--flat"
      @click="$emit('install')"
    >
      <vue-icon icon="download-from-cloud" />
      {{ $t('context.model.install') }}
    </button>
    <button
      v-if="model.installed"
      class="button button--flat"
      @click="$emit('install-other')"
    >
      <vue-icon icon="download-from-cloud" />
      {{ $t('context.model.update') }}
    </button>
    <button
      v-if="model.installed"
      class="button button--flat"
      @click="$emit('delete')"
    >
      <vue-icon icon="recycle-bin" />
      {{ $t('context.model.delete') }}
    </button>
    <model-comments :comments="model.commentaries" />
  </aside>
</template>
<style src="./ModelSidebar.sass" lang="sass"></style>
<script src="./ModelSidebarRemote.ts" lang="ts"></script>
