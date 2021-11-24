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
import { EXTENSIONS } from '@/constants';

@Component<LocalFilters>({
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
    const thumbnailSize = this.$store.state.settings.thumbnailSize;

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

    this.sceneTypes = Object.values(EXTENSIONS).map((element: ExtensionProperty) => {
      return {
        title: `${element.title} (.${element.icon})`,
        icon: `.${element.icon}`
      };
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
    this.$ipcInvoke<Model[]>('get-integration-models', {
      type: 'local',
      title: this.$route.params.database
    }).then((result): void => {
      this.$store.commit('setLoadedData', result);
    });
  }
}
</script>
