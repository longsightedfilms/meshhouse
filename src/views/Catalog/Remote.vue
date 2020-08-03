<template>
  <fragment>
    <catalog-header />
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
      <button @click="downloadItem">
        Test download
      </button>
    </div>
    <div
      v-else
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
import { Vue, Component, Watch } from 'vue-property-decorator';
import { Fragment } from 'vue-fragment';
import VueContext from 'vue-context';
import ModelContext from '@/components/UI/Context/ModelContext.vue';
import ModelCard from '@/components/UI/Card/ModelCard.vue';
import Integrations from '@/plugins/models-db/integrations/main';
import { Route } from 'vue-router';

@Component({
  components: {
    Fragment,
    ModelCard,
    VueContext,
    ModelContext
  },
  async beforeRouteEnter(to: Route, from: Route, next: Function) {
    const db = new Integrations[to.params.database]();
    const data = await db.fetchItemsFromDatabase(undefined, to.params.page);

    next((vm: Vue) => {
      vm.$store.commit('setCurrentDatabase', to.params.database);
      vm.$store.commit('setLoadedData', data.models);
      vm.$store.commit('setCategories', data.categories);
    });
  },
  metaInfo() {
    return {
      title: this.$store.state.db.currentDB?.title ?? ''
    };
  }
})
export default class RemoteDatabase extends Vue {
  @Watch('$route')
  async onRouteChanged(): Promise<void> {
    await this.databaseInitialize();
  }

  async databaseInitialize(): Promise<void> {
    const db = new Integrations[this.$route.params.database]();
    const data = await db.fetchItemsFromDatabase(undefined, this.$route.params.page);

    this.$store.commit('setCurrentDatabase', this.$route.params.database);
    this.$store.commit('setLoadedData', data.models);
    this.$store.commit('setCategories', data.categories);
  }

  async downloadItem(): Promise<void> {
    const db = new Integrations[this.$route.params.database]();
    await db.downloadItem(
      'https://sfmlab.com/media/cache/bf/19/bf198e9ac86f25014bd5808883a67fd4.webp?v=0',
      'House/Room stages',
      'https://sfmlab.com/serve_file/30551/'
    );
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
