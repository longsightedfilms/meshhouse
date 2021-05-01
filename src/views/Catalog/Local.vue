<template>
  <div>
    <catalog-header :database="$store.state.db.currentDB" />
    <categories-grid />
    <vue-context ref="categoryMenu">
      <category-context />
    </vue-context>
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
    <div
      v-else
      class="models-empty"
    >
      <vue-icon icon="box" />
      <h1>
        {{ $t('views.catalog.empty.title') }}
      </h1>
      <p>
        {{ $t('views.catalog.empty.description') }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import eventBus from '@/eventBus';
import { Vue, Component, Watch } from 'vue-property-decorator';
import VueContext from 'vue-context';
import CategoriesGrid from './CategoriesGrid.vue';
import CategoryContext from '@/components/UI/Context/CategoryContext.vue';
import ModelContext from '@/components/UI/Context/ModelContext.vue';
import ModelCard from '@/components/UI/Card/ModelCard.vue';
import { Route } from 'vue-router';

@Component({
  components: {
    CategoriesGrid,
    CategoryContext,
    ModelCard,
    VueContext,
    ModelContext
  },
  async beforeRouteEnter(to: Route, from: Route, next: Function) {
    const models = await window.ipc.invoke('get-integration-models', {
      type: 'local',
      title: to.params.database,
      category: to.params.category
    });

    const categories = await window.ipc.invoke('get-integration-categories', {
      type: 'local',
      title: to.params.database
    });

    next((vm: Vue) => {
      vm.$store.commit('setCurrentDatabase', to.params.database);
      vm.$store.commit('setLoadedData', models);
      vm.$store.commit('setCategories', categories);
    });
  },
  metaInfo() {
    return {
      title: this.$store.state.db.currentDB?.title ?? ''
    };
  }
})
export default class LocalDatabase extends Vue {
  @Watch('$route')
  async onRouteChanged(): Promise<void> {
    await this.databaseInitialize();
  }

  async databaseInitialize(): Promise<void> {
    const models = await this.$ipcInvoke('get-integration-models', {
      type: 'local',
      title: this.$route.params.database,
      category: this.$route.params.category
    });

    const categories = await this.$ipcInvoke('get-integration-categories', {
      type: 'local',
      title: this.$route.params.database
    });

    this.$store.commit('setCurrentDatabase', this.$route.params.database);
    this.$store.commit('setLoadedData', models);
    this.$store.commit('setCategories', categories);
  }

  mounted(): void {
    eventBus.on('file-event', (database: DatabaseItem | any) => {
      if (database.url === this.$route.params.database) {
        this.databaseInitialize();
      }
    });
    eventBus.on('filters-updated', (() => {
      this.databaseInitialize();
    }));
  }

  beforeDestroy(): void {
    eventBus.all.clear();
  }

  get gridClass(): string {
    return `models-grid ${this.$store.state.settings.thumbnailSize === 64 ? 'models-grid--table' : ''}`;
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
