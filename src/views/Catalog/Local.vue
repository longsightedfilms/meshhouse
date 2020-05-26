<template>
  <fragment>
    <categories-grid />
    <vue-context ref="categoryMenu">
      <category-context />
    </vue-context>
    <div class="button button--grid">
      <span>
        {{ $t('views.catalog.models.title') }}
      </span>
      <button
        class="button button--flat"
        @click="reindexCatalog"
      >
        <vue-icon
          icon="update"
          raster
        />
      </button>
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
  </fragment>
</template>

<script lang="ts">
import eventBus from '@/eventBus';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import VueContext from 'vue-context';
import { Fragment } from 'vue-fragment';
import CategoriesGrid from './CategoriesGrid.vue';
import EditPropertiesModal from '@/views/Modals/EditPropertiesModal.vue';
import CategoryContext from '@/components/UI/Context/CategoryContext.vue';
import ModelContext from '@/components/UI/Context/ModelContext.vue';
import ModelCard from '@/components/UI/Card/ModelCard.vue';
import Integrations from '@/plugins/models-db/integrations/main';
import { findDatabaseIndex } from '@/plugins/models-db/functions';
import { Route } from 'vue-router';

@Component({
  components: {
    CategoriesGrid,
    CategoryContext,
    Fragment,
    ModelCard,
    VueContext,
    ModelContext
  },
  async beforeRouteEnter(to: Route, from: Route, next: Function) {
    const db = new Integrations.local(to.params.database);
    const models = await db.fetchItemsFromDatabase(undefined, to.params.category);

    const categories = await db.fetchCategories();

    next((vm: Vue) => {
      vm.$store.commit('setLoadedData', models);
      vm.$store.commit('setCategories', categories);
    });
  }
})
export default class LocalDatabase extends Vue {
  @Watch('$route')
  async onRouteChanged(): Promise<void> {
    await this.databaseInitialize();
  }

  async databaseInitialize(): Promise<void> {
    const db = new Integrations.local(this.$route.params.database);
    const models = await db.fetchItemsFromDatabase(undefined, this.$route.params.category);

    const categories = await db.fetchCategories();
    this.$store.commit('setLoadedData', models);
    this.$store.commit('setCategories', categories);
  }

  reindexCatalog(): void {
    const dbIndex = findDatabaseIndex(this.$route.params.database);
    const db = this.$store.state.db.databases[dbIndex];
    this.$reindexCatalog(db).then(async() => {
      await this.databaseInitialize();
    });
  }

  mounted(): void {
    eventBus.$on('file-event', (async(database: DatabaseItem) => {
      if (database.url === this.$route.params.database) {
        await this.databaseInitialize();
      }
    }));
  }

  get gridClass(): string {
    return `models-grid ${this.$store.state.controls.thumbnailSize === 64 ? 'models-grid--table' : ''}`;
  }

  get dynamicGrid(): object {
    const { thumbnailSize } = this.$store.state.controls;

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
