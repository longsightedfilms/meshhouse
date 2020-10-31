<template>
  <fragment>
    <catalog-header :database="$store.state.db.currentDB" />
    <div class="button button--grid">
      <span>
        {{ $t('views.catalog.models.title') }}
      </span>
    </div>
    <div
      v-if="$store.state.db.loadedData.length !== 0"
      :class="gridClass"
      :style="dynamicGrid"
    >
      <model-card
        v-for="item in $store.state.db.loadedData"
        :key="item.name + item.index + item.extension"
        :item="item"
        tabindex="0"
      />
      <vue-context ref="menu">
        <model-context />
      </vue-context>
    </div>
    <catalog-paginator
      v-if="$store.state.db.loadedData.length !== 0 && !$store.state.controls.isOffline"
      :total-pages="totalPages"
    />
    <div
      v-if="$store.state.db.loadedData.length === 0"
      class="models-empty"
    >
      <vue-icon icon="box" />
      <h1>
        {{ $t('views.catalog.empty.title') }}
      </h1>
    </div>
  </fragment>
</template>

<script lang="ts">
import eventBus from '@/eventBus';
import { Vue, Component, Watch } from 'vue-property-decorator';
import { Fragment } from 'vue-fragment';
import VueContext from 'vue-context';
import ModelContext from '@/components/UI/Context/ModelContext.vue';
import ModelCard from '@/components/UI/Card/ModelCard.vue';
import CatalogPaginator from './CatalogPaginator.vue';
import MultipleLinksModal from '@/views/Modals/MultipleLinksDetected.vue';
import { Route } from 'vue-router';

@Component({
  components: {
    CatalogPaginator,
    Fragment,
    ModelCard,
    VueContext,
    ModelContext
  },
  async beforeRouteEnter(to: Route, from: Route, next: Function) {
    const data = await window.ipc.invoke('get-integration-models', {
      type: 'remote',
      title: to.params.database,
      query: to.params.page
    });

    next((vm: Vue) => {
      vm.$store.commit('setCurrentDatabase', to.params.database);
      vm.$store.commit('setLoadedData', data.models);
      vm.$store.commit('setCategories', data.categories);
      (vm as RemoteDatabase).totalPages = data.totalPages;
      if (Object.hasOwnProperty.call(data, 'licenses')) {
        vm.$store.commit('setLicenses', data.licenses);
      }
    });
  },
  metaInfo() {
    return {
      title: this.$store.state.db.currentDB?.title ?? ''
    };
  }
})
export default class RemoteDatabase extends Vue {
  totalPages = 0

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
      this.$modal.show(MultipleLinksModal, {}, {
        clickToClose: true,
        height: 'auto'
      });
    }));
  }

  beforeDestroy(): void {
    eventBus.all.clear();
  }

  async databaseInitialize(): Promise<void> {
    const data = await this.$ipcInvoke('get-integration-models', {
      type: 'remote',
      title: this.$route.params.database,
      query: this.$route.params.page
    });

    this.$store.commit('setCurrentDatabase', this.$route.params.database);
    this.$store.commit('setLoadedData', data.models);
    this.$store.commit('setCategories', data.categories);
    this.totalPages = data.totalPages;
    if (Object.hasOwnProperty.call(data, 'licenses')) {
      this.$store.commit('setLicenses', data.licenses);
    }
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
