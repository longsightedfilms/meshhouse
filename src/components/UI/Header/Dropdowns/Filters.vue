<template>
  <div class="filter__container">
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
          :dot-size="[8, 24]"
          :height="2"
          :direction="$isRTL() ? 'rtl' : 'ltr'"
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
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch }from 'vue-property-decorator';
import VueSlider from 'vue-slider-component';
import { Fragment } from 'vue-fragment';
import { isDatabaseRemote } from '@/plugins/models-db/functions';

import LocalFilters from '@/components/UI/Filters/LocalFilters.vue';
import RemoteFilters from '@/components/UI/Filters/RemoteFilters.vue';

@Component({
  components: {
    Fragment,
    VueSlider
  }
})
export default class FiltersDropdown extends Vue {
  currentFilter: typeof LocalFilters | typeof RemoteFilters = LocalFilters

  onSliderChange(val: number): void {
    this.$root.$children[0].$forceUpdate();
    this.$settingsSet('thumbnailSize', val);
    this.$store.commit('setThumbnailSize', val);
  }

  @Watch('$route.params.database')
  handleFiltersChange(): void {
    this.currentFilter = isDatabaseRemote(this.$route.params.database) ? RemoteFilters : LocalFilters;
  }
}
</script>
