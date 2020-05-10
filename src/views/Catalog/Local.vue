<template>
  <div
    v-if="$store.state.db.loadedData.length !== 0"
    class="models-grid"
    :style="dynamicGrid"
  >
    <model-card
      v-for="item in $store.state.db.loadedData"
      :key="item.name + item.index"
      :item="item"
      tabindex="0"
    />
    <vue-context ref="menu">
      <model-context />
    </vue-context>
  </div>
  <div v-else>
    <h1>Catalog is empty</h1>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
import path from 'path'
import { remote } from 'electron'
import VueContext from 'vue-context'
import EditPropertiesModal from '@/views/Modals/EditPropertiesModal.vue'
import ModelContext from '@/components/UI/Context/ModelContext.vue'
import ModelCard from '@/components/UI/Card/ModelCard.vue'
import Integrations from '@/plugins/models-db/integrations/main'

@Component({
  components: {
    ModelCard,
    VueContext,
    ModelContext
  },
})
export default class LocalDatabase extends Vue {
  @Watch('$route')
  async onRouteChanged(): Promise<void> {
    await this.databaseInitialize()
  }

  async mounted(): Promise<void> {
    await this.databaseInitialize()
  }

  async databaseInitialize(): Promise<void> {
    const database = new Integrations.local(this.$route.params.database)

    const models = await database.fetchItemsFromDatabase()
    this.$store.commit('setLoadedData', models)
  }

  get dynamicGrid(): object {
    const { thumbnailSize } = this.$store.state.controls
    return {
      gridTemplateColumns: `repeat(auto-fit, ${thumbnailSize}px)`,
      gridAutoRows: `${thumbnailSize}px`
    }
  }
}
</script>
