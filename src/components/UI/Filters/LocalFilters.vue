<template>
  <fragment>
    <div class="filter">
      <label>{{ $t('views.catalog.filters.dcc') }}</label>
      <multiselect
        v-model="scene"
        track-by="icon"
        label="title"
        :options="sceneTypes"
        :searchable="false"
        :show-labels="false"
        @select="handleDccSelect"
      />
    </div>
  </fragment>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Multiselect from 'vue-multiselect';
import { Fragment } from 'vue-fragment';
import { handleDatabases, findDatabaseIndex } from '@/plugins/models-db/functions';
import { modelsExtensions } from '@/functions/extension';

@Component({
  components: {
    Fragment,
    Multiselect
  }
})
export default class LocalFilters extends Vue {
  scene: ExtensionProperty = {
    title: this.$i18n.t('common.list.all').toString(),
    icon: 'none'
  }
  sceneTypes: ExtensionProperty[] = []

  mounted(): void {
    const thumbnailSize = this.$ipcSendSync('get-application-setting', 'thumbnailSize');

    if(thumbnailSize !== undefined) {
      this.$store.commit('setThumbnailSize', thumbnailSize);
    }
    this.scene = {
      title: this.$i18n.t('common.list.all').toString(),
      icon: 'none'
    };
    this.sceneTypes = [
      {
        title: this.$i18n.t('common.list.all').toString(),
        icon: 'none'
      }
    ];
    Object.values(modelsExtensions).forEach((element: ExtensionProperty) => {
      this.sceneTypes.push({
        title: `${element.title} (.${element.icon})`,
        icon: `.${element.icon}`
      });
    });
  }

  handleDccSelect(select: ExtensionProperty): void {
    this.$store.commit('setFilter', {
      field: 'extension',
      value: select.icon
    });
    this.setFilters();
  }

  setFilters(): void {
    const db = handleDatabases(this.$route.params.database);

    db?.fetchItemsFromDatabase().then((result: Model[]): void => {
      this.$store.commit('setLoadedData', result);
    });
  }
}
</script>
