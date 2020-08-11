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
  </fragment>
</template>

<script lang="ts">
import EventBus from '@/eventBus';
import { Vue, Component ,Watch } from 'vue-property-decorator';
import Multiselect from 'vue-multiselect';
import { Fragment } from 'vue-fragment';
import { handleDatabases, findDatabaseIndex} from '@/plugins/models-db/functions';


@Component({
  components: {
    Fragment,
    Multiselect
  }
})
export default class RemoteFilters extends Vue {
  scene: any = {
    title: this.$root.$t('common.list.all').toString(),
    id: -1
  }
  sceneTypes: any[] = []

  mounted(): void {
    if(this.$settingsGet('thumbnailSize') !== undefined) {
      this.$store.commit('setThumbnailSize', this.$settingsGet('thumbnailSize'));
    }
    this.handleDccFill();
  }

  @Watch('$store.state.db.categories')
  handleDccFill(): void {
    this.sceneTypes = [
      {
        title: this.$root.$t('common.list.all').toString(),
        id: -1
      }
    ];

    this.$store.state.db.categories.forEach((element: any) => {
      this.sceneTypes.push({
        title: element.name,
        id: element.id
      });
    });
  }

  handleDccSelect(select: any): void {
    this.$store.commit('setFilter', {
      field: 'category',
      value: select.id
    });
    EventBus.$emit('filters-updated');
  }

}
</script>
