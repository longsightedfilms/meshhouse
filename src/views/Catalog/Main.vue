<template>
  <div class="mr-2">
    <v-row>
      <v-col cols="12">
        <catalog-toolbar />
      </v-col>
    </v-row>
    <div v-if="$store.state.pageData.length != 0">
      <grid-presence v-if="$store.state.databases.find(db => db.url == $route.params.database).view == 'grid'" />
      <basic-presence v-else-if="$store.state.databases.find(db => db.url == $route.params.database).view == 'basic'" />
      <div v-else />
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
import { getCollection, initDB, getDB } from 'lokijs-promise'
import { Database, Model } from '@/plugins/models-db/interfaces'

@Component({
  components: {
    BasicPresence,
    CatalogToolbar,
    GridPresence
  },
})

export default class DatabaseListItems extends Vue {
  @Watch('$route')
  onRouteChanged(): void {
    initDB(path.join(remote.app.getPath('userData'), "/databases/" + this.$route.params.database + ".db"), 1000)
    this.databaseInitialize()
  }

  async mounted(): Promise<void> {
    initDB(path.join(remote.app.getPath('userData'), "/databases/" + this.$route.params.database + ".db"), 1000)
    await this.databaseInitialize()
  }

  async databaseInitialize(): Promise<void> {
    const categories: string[] = []

    const models = await getCollection("models")
    const results = models.chain().find({})

    this.$store.commit('setPageRawData', models)
    this.$store.commit('setPageData', results)
    this.$store.commit('setPageLoadStatus', false)
  }
}
</script>