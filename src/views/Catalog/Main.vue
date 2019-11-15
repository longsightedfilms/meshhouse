<template>
  <div class="mr-2">
    <v-row>
      <v-col cols="12">
        <catalog-toolbar />
      </v-col>
    </v-row>
    <div v-if="$store.state.pageData.length != 0">
      <grid-presence v-show="$store.state.databases.find(db => db.url == $route.params.database).view == 'grid'" />
      <basic-presence v-show="$store.state.databases.find(db => db.url == $route.params.database).view == 'basic'" />
    </div>
    <v-row v-else>
      <v-col cols="12">
        <v-card>
          <v-card-title>This catalog is empty :(</v-card-title>
          <v-card-text>I'm card text</v-card-text>
          <v-card-actions>
            <v-btn
              text
            >
              {{ $t('lists.local.open') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
import GridPresence from './GridPresence.vue'
import BasicPresence from './BasicPresence.vue'
import CatalogToolbar from '@/components/CatalogToolbar.vue'
import path from 'path'
import { remote } from 'electron'

@Component({
  components: {
    BasicPresence,
    CatalogToolbar,
    GridPresence
  },
})

export default class DatabaseListItems extends Vue {
  @Watch('$route')
  async onRouteChanged(): Promise<void> {
    await this.databaseInitialize()
  }

  async mounted(): Promise<void> {
   await this.databaseInitialize()
  }

  async databaseInitialize(): Promise<void> {
    const models = await this.$getItemsFromDatabase(this.$route.params.database)
    this.$store.commit('setPageData', models)
    this.$store.commit('setPageLoadStatus', false)
  }
}
</script>