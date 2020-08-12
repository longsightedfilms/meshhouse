<template>
  <fragment>
    <div class="filter">
      <label>{{ $t('views.catalog.filters.dcc') }}</label>
      <multiselect
        v-model="scene"
        track-by="id"
        label="title"
        :options="sceneTypes"
        :searchable="false"
        :show-labels="false"
        @select="handleDccSelect"
      />
    </div>
    <div
      v-if="isLicensesVisible"
      class="filter"
    >
      <label>{{ $t('views.catalog.filters.license') }}</label>
      <multiselect
        v-model="license"
        track-by="id"
        label="name"
        :options="licenseTypes"
        :searchable="false"
        :show-labels="false"
        @select="handleLicenseSelect"
      />
    </div>
  </fragment>
</template>

<script lang="ts">
import EventBus from '@/eventBus';
import { Vue, Component ,Watch } from 'vue-property-decorator';
import Multiselect from 'vue-multiselect';
import { Fragment } from 'vue-fragment';
import { handleDatabases, findDatabaseIndex } from '@/plugins/models-db/functions';
import * as Filters from '@/functions/filters';

@Component({
  components: {
    Fragment,
    Multiselect
  }
})
export default class RemoteFilters extends Vue {
  scene: object = {
    title: this.$root.$t('common.list.all').toString(),
    id: -1
  }
  license: object = {
    name: this.$root.$t('common.list.all').toString(),
    id: -1
  }

  sceneTypes: object[] = []
  licenseTypes: SFMLabLicense[] = []

  mounted(): void {
    if(this.$settingsGet('thumbnailSize') !== undefined) {
      this.$store.commit('setThumbnailSize', this.$settingsGet('thumbnailSize'));
    }
    this.handleFiltersUpdate();
  }

  get isLicensesVisible(): boolean {
    return Filters.showLicenseField(this.$route.params.database);
  }

  @Watch('$store.state.db.categories')
  handleFiltersUpdate(): void {
    this.handleDccFill();
    if (this.isLicensesVisible) {
      this.handleLicensesFill();
    }
  }

  handleDccFill(): void {
    this.sceneTypes = [
      {
        title: this.$root.$t('common.list.all').toString(),
        id: -1
      }
    ];

    this.$store.state.db.categories.forEach((element: Category) => {
      this.sceneTypes.push({
        title: element.name,
        id: element.id
      });
    });
  }

  handleLicensesFill(): void {
    this.licenseTypes = [
      {
        name: this.$root.$t('common.list.all').toString(),
        id: -1
      }
    ];

    this.$store.state.db.licenses.forEach((element: SFMLabLicense) => {
      this.licenseTypes.push({
        name: element.name,
        id: element.id
      });
    });
  }

  handleDccSelect(select: Category): void {
    this.$store.commit('setFilter', {
      field: 'category',
      value: select.id
    });
    EventBus.$emit('filters-updated');
  }

  handleLicenseSelect(select: SFMLabLicense): void {
    this.$store.commit('setFilter', {
      field: 'license',
      value: select.id
    });
    EventBus.$emit('filters-updated');
  }

}
</script>
