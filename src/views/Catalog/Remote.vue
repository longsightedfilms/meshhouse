<template>
  <div>
    <catalog-header :database="$store.state.db.currentDB" />
    <div class="button button--grid">
      <span>
        {{ $t('views.catalog.models.title') }}
      </span>
    </div>
    <div
      v-if="models.length !== 0"
      :class="gridClass"
      :style="dynamicGrid"
    >
      <model-card-remote
        v-for="model in models"
        :key="model.title + model.id"
        :model="model"
        tabindex="0"
      />
      <vue-context ref="menu">
        <model-context />
      </vue-context>
    </div>
    <catalog-paginator
      v-if="models.length !== 0 && !$store.state.controls.isOffline"
      :total-pages="pagination.totalPages"
    />
    <div
      v-if="models.length === 0"
      class="models-empty"
    >
      <vue-icon icon="box" />
      <h1>
        {{ $t('views.catalog.empty.title') }}
      </h1>
    </div>
  </div>
</template>

<script lang="ts">
import eventBus from '@/eventBus';
import { Vue, Component, Watch } from 'vue-property-decorator';
import VueContext from 'vue-context';
import ModelContext from '@/components/UI/Context/ModelContext.vue';
import ModelCardRemote from '@/components/UI/ModelCard/ModelCardRemote.vue';
import CatalogPaginator from './CatalogPaginator.vue';
import FileSelectorModal from '@/views/Modals/FileSelectorModal.vue';
import { Route } from 'vue-router';

@Component({
  components: {
    CatalogPaginator,
    ModelCardRemote,
    VueContext,
    ModelContext
  },
  async beforeRouteEnter(to: Route, from: Route, next: Function) {
    const data: SFMLabFetch = await window.ipc.invoke('get-integration-models', {
      type: 'remote',
      title: to.params.database,
      query: to.params.page
    });

    next((vm: RemoteDatabase) => {
      vm.$store.commit('setCurrentDatabase', to.params.database);
      vm.models = data.models;
      vm.pagination = data.pagination;
    });
  },
  metaInfo() {
    return {
      title: this.$store.state.db.currentDB?.title ?? ''
    };
  }
})
export default class RemoteDatabase extends Vue {
  models: RemoteModel[] = []
  pagination = {
    page: 1,
    totalPages: 1,
    totalItems: 0
  }

  @Watch('$route')
  async onRouteChanged(): Promise<void> {
    await this.databaseInitialize();
  }

  mounted(): void {
    eventBus.on('download-completed', (() => {
      this.databaseInitialize();
    }));
    eventBus.on('filters-updated', (() => {
      this.databaseInitialize();
    }));
    eventBus.on('item-deleted', (() => {
      this.databaseInitialize();
    }));
    eventBus.on('multiple-links', (() => {
      this.$modal.show(FileSelectorModal, {}, {
        clickToClose: true,
        height: 'auto'
      });
    }));
  }

  beforeDestroy(): void {
    eventBus.all.clear();
  }

  async databaseInitialize(): Promise<void> {
    const data: SFMLabFetch = await this.$ipcInvoke('get-integration-models', {
      type: 'remote',
      title: this.$route.params.database,
      query: this.$route.params.page
    });

    this.$store.commit('setCurrentDatabase', this.$route.params.database);
    this.models = data.models;
    this.pagination = data.pagination;
  }

  get gridClass(): string {
    return `models-grid models-grid-remote ${this.$store.state.settings.thumbnailSize === 64 ? 'models-grid--table' : ''}`;
  }

  get dynamicGrid(): object {
    const { thumbnailSize } = this.$store.state.settings;

    if (thumbnailSize === 64) {
      return {
        gridTemplateColumns: '100%',
      };
    } else {
      return {
        gridTemplateColumns: `repeat(auto-fit, ${thumbnailSize}px)`,
      };
    }
  }
}
</script>
