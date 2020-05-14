<template>
  <fragment>
    <div class="filter">
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
        <vue-icon
          icon="caret-forward"
          inverted
          raster
        />
      </div>
    </div>
  </fragment>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Fragment } from 'vue-fragment'
import { handleDatabases, findDatabaseIndex } from '@/plugins/models-db/functions'

@Component({
  components: {
    Fragment
  }
})
export default class LocalFilters extends Vue {
  scene = 'none'
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
    if(this.$settingsGet('thumbnailSize') !== undefined) {
      this.$store.commit('setThumbnailSize', this.$settingsGet('thumbnailSize'))
    }
  }

  handleDccSelect(event: any): void {
    this.$store.commit('setFilter', {
      field: 'extension',
      value: event.target.value
    })
    this.setFilters()
  }

  setFilters(): void {
    const db = handleDatabases(this.$route.params.database)

    db.fetchItemsFromDatabase().then((result: Model[]): void => {
      this.$store.commit('setLoadedData', result)
    })
  }
}
</script>
