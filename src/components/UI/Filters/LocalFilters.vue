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
            :value="`.${sceneType.icon}`"
          >
            {{ sceneType.title }} (.{{ sceneType.icon }})
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
import Vue from 'vue';
import Component from 'vue-class-component';
import { Fragment } from 'vue-fragment';
import { handleDatabases, findDatabaseIndex, modelsExtensions } from '@/plugins/models-db/functions';

@Component({
  components: {
    Fragment
  }
})
export default class LocalFilters extends Vue {
  scene = 'none'
  sceneTypes: ExtensionProperty[] = Object.values(modelsExtensions)

  mounted(): void {
    if(this.$settingsGet('thumbnailSize') !== undefined) {
      this.$store.commit('setThumbnailSize', this.$settingsGet('thumbnailSize'));
    }
  }

  handleDccSelect(event: Event): void {
    this.$store.commit('setFilter', {
      field: 'extension',
      value: (event.target as HTMLInputElement).value
    });
    this.setFilters();
  }

  setFilters(): void {
    const db = handleDatabases(this.$route.params.database);

    db.fetchItemsFromDatabase().then((result: Model[]): void => {
      this.$store.commit('setLoadedData', result);
    });
  }
}
</script>
