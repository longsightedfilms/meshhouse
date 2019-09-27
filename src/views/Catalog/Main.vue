<template>
  <div class="mr-2">
    <v-row>
      <v-col cols="12">
        <div class="d-flex">
          <h1 class="display-1">
            {{ $store.state.databases.find(db => db.url == $route.params.database).title }}
          </h1>

          <div class="flex-grow-1" />

          <v-btn-toggle
            v-model="view"
            class="mr-4"
            mandatory
          >
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  text
                  v-on="on"
                  @click="changePresence('grid')"
                >
                  <v-icon>mdi-view-grid</v-icon>
                </v-btn>
              </template>
              <span>{{ $t('addCatalog.formViewHint.grid') }}</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  text
                  v-on="on"
                  @click="changePresence('basic')"
                >
                  <v-icon>mdi-view-headline</v-icon>
                </v-btn>
              </template>
              <span>{{ $t('addCatalog.formViewHint.basic') }}</span>
            </v-tooltip>
          </v-btn-toggle>

          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                color="primary"
                height="48"
                width="48"
                @click="reindexModels"
                v-on="on"
              >
                <v-icon>
                  mdi-refresh
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $t('lists.local.reindex') }}</span>
          </v-tooltip>
        </div>
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
import GridPresence from './GridPresence.vue'
import BasicPresence from './BasicPresence.vue'
import path from 'path'
import { remote } from 'electron'
import { getCollection, initDB, getDB } from 'lokijs-promise'
import { Database } from '@/plugins/models-db/interfaces'

@Component({
  components: {
    BasicPresence,
    GridPresence
  },
  watch: {
    '$route' (to, from) {
      initDB(path.join(remote.app.getPath('userData'), "/databases/" + this.$route.params.database + ".db"), 1000)
      this.databaseInitialize()
    }
  }
})

export default class DatabaseListItems extends Vue {
  view: number = 0
  views: string[] = ['grid', 'basic']
  models: any = []

  async mounted() {
    initDB(path.join(remote.app.getPath('userData'), "/databases/" + this.$route.params.database + ".db"), 1000)
    await this.databaseInitialize()
  }

  async databaseInitialize(): Promise<any> {
    this.models = await getCollection("models")
    let results = this.models.chain().find({}).simplesort('name').data()

    this.$store.commit('setPageData', results)
    this.$store.commit('setPageStatus', true)
  }

  reindexModels(): void {
    initDB(path.join(remote.app.getPath('userData'), "/databases/" + this.$route.params.database + ".db"), 1000)
    this.reindexModelsCallBack()
  }

  async reindexModelsCallBack(): Promise<any> {
    this.$store.commit('setPageStatus', false)
    
    let db = await getDB()
    db.removeCollection('models')
    this.models = await getCollection('models')
    let directory = this.$store.state.databases.find((base: Database) => base.url === this.$route.params.database).path

    this.$indexFolderRecursive(directory).then((files) => {
      files.forEach((file: string) => {
        this.models.insert({ name: path.parse(file).name, extension: path.parse(file).ext, path: file, category: '', image: '' })
      })
      
      this.models = this.models.chain().find({}).simplesort('name').data()
      this.$store.commit('setPageData', this.models)
      this.$store.commit('setPageStatus', true)
    })
  }

  changePresence(view: string) {
    let index = this.$store.state.databases.findIndex((db: Database) => db.url == this.$route.params.database)
    this.view = this.views.indexOf(view)
    this.$editDatabase(index, 'view', this.views[this.view])
  }
}
</script>