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
import eventBus from '@/eventBus';
import { Vue, Component } from 'vue-property-decorator';
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

  mounted(): void {
    const thumbnailSize = this.$store.state.settings.thumbnailSize;

    if(thumbnailSize !== undefined) {
      this.$store.commit('setThumbnailSize', thumbnailSize);
    }

    this.scene = {
      title: this.$i18n.t('common.list.all').toString(),
      icon: 'none'
    };
  }

  get sceneTypes(): ExtensionProperty[] {
    const extensions = Object.values(EXTENSIONS).map((element: ExtensionProperty) => {
      return {
        title: `${element.title} (.${element.icon})`,
        icon: `.${element.icon}`
      };
    });

    return [
      {
        title: this.$i18n.t('common.list.all').toString(),
        icon: 'none'
      },
      ...extensions
    ];
  }

  handleDccSelect(select: ExtensionProperty): void {
    this.$store.commit('setFilter', {
      field: 'extension',
      value: select.icon
    });
    eventBus.emit('filters-updated');
  }
}
</script>
