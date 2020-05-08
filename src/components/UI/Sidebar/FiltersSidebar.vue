<template>
  <aside class="application__sidebar-filters">
    <button
      class="show-filters"
      @click="toggleVisibility"
    >
      <font-awesome-icon
        icon="angle-left"
        size="2x"
        :style="flipIcon"
      />
    </button>
    <div class="filter-field">
      <label>{{ $t('views.catalog.filters.dcc') }}</label>
      <div class="input--select">
        <select
          v-model="scene"
          class="input"
          @change="handleDccSelect"
        >
          <option value="none">
            {{ $t('common.list.all') }}
          </option>
          <option
            v-for="(sceneType, index) in sceneTypes"
            :key="index"
            :value="sceneType.value"
          >
            {{ sceneType.text }}
          </option>
        </select>
      </div>
    </div>
    <div class="settings">
      <label>{{ $t('views.catalog.filters.thumbnailSize') }}</label>
      <div class="slider">
        <vue-slider
          v-model="$store.state.controls.thumbnailSize"
          :drag-on-click="true"
          :min="128"
          :max="512"
          tooltip="none"
          :interval="64"
          :marks="true"
          @change="onSliderChange"
        />
      </div>
    </div>
  </aside>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import VueSlider from 'vue-slider-component'
import { DatabaseItem, Model, QueryFilters } from '@/plugins/models-db/interfaces'

@Component({
  components: {
    VueSlider
  }
})
export default class FiltersSidebar extends Vue {
  filters = this.$store.state.controls.filters

  category = ''
  scene = 'none'
  databaseIndex = ''
  search = ''

  sceneTypes = [
    {
      text: '3ds Max Scene (.max)',
      value: '.max',
    },
    {
      text: 'Maya ASCII Scene (.ma)',
      value: '.ma',
    },
    {
      text: 'Maya Binary Scene (.mb)',
      value: '.mb',
    },
    {
      text: 'Blender Scene (.blend)',
      value: '.blend',
    },
    {
      text: 'Cinema 4D Scene (.c4d)',
      value: '.c4d',
    },
    {
      text: 'Houdini Scene (.hip)',
      value: '.hip',
    },
    {
      text: 'Houdini Scene (.hiplc)',
      value: '.hiplc',
    },
    {
      text: 'Houdini Scene (.hipnc)',
      value: '.hipnc',
    },
    {
      text: 'Modo Scene (.lxo)',
      value: '.lxo',
    },
  ]

  mounted(): void {
    this.databaseIndex = this.$store.state.db.databases
      .findIndex((db: DatabaseItem) => db.url == this.$route.params.database)

    const db = this.$store.state.db.databases[this.databaseIndex]
    if(this.$settingsGet('thumbnailSize') !== undefined) {
      this.$store.commit('setThumbnailSize', this.$settingsGet('thumbnailSize'))
    }

    if(this.$settingsGet('filtersVisible') !== undefined) {
      this.$store.commit('setFilterVisibility', this.$settingsGet('filtersVisible'))
    }
  }

  reindexModels(): void {
    this.$reindexCatalog(this.$store.state.db.databases[this.databaseIndex])
  }

  filterByCategory(option: string): void {
    this.filters.where.category = option
    this.setFilters()
  }

  handleDccSelect(event: any): void {
    this.$store.commit('setFilter', {
      field: 'extension',
      value: event.target.value
    })
    this.setFilters()
  }

  setFilters(): void {
    this.$getItemsFromDatabase(this.$route.params.database).then((result) => {
      this.$store.commit('setLoadedData', result)
    })
  }

  get flipIcon(): object {
    const { filtersVisible } = this.$store.state.controls
    return filtersVisible ? {
      transform: `rotate(180deg)`
    } : {}
  }

  onSliderChange(val: number): void {
    this.$settingsSet('thumbnailSize', val)
    this.$store.commit('setThumbnailSize', val)
  }

  toggleVisibility(val: boolean): void {
    this.$store.commit('setFilterVisibility', !this.$store.state.controls.filtersVisible)
    this.$settingsSet('filtersVisible', this.$store.state.controls.filtersVisible)
  }
}
</script>
