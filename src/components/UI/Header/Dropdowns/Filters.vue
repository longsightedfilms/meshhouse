<template>
  <fragment>
    <p class="title">
      <span>{{ $t('hints.navbar.filters') }}</span>
    </p>
    <component :is="currentFilter" />
    <div class="filter">
      <label>{{ $t('views.catalog.filters.thumbnailSize') }}</label>
      <div class="slider">
        <vue-slider
          v-model="$store.state.controls.thumbnailSize"
          :drag-on-click="true"
          :min="64"
          :max="512"
          tooltip="none"
          :interval="64"
          :marks="true"
          hide-label
          @change="onSliderChange"
        />
        <div class="labels">
          <vue-icon
            icon="list"
            raster
          />
          <vue-icon
            icon="four-squares"
            raster
          />
          <vue-icon
            icon="full-image"
            raster
          />
        </div>
      </div>
    </div>
  </fragment>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import VueSlider from 'vue-slider-component'
import { Fragment } from 'vue-fragment'

import LocalFilters from '@/components/UI/Filters/LocalFilters.vue'

@Component({
  components: {
    Fragment,
    VueSlider
  }
})
export default class FiltersDropdown extends Vue {
  currentFilter = LocalFilters

  onSliderChange(val: number): void {
    this.$root.$children[0].$forceUpdate()
    this.$settingsSet('thumbnailSize', val)
    this.$store.commit('setThumbnailSize', val)
  }
}
</script>
