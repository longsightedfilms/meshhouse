<template>
  <v-toolbar
    color="grey darken-4"
    class="py-4"
    height="auto"
    :tile="false"
    prominent
    flat
  >
    <v-toolbar-title>
      {{ $store.state.databases.find(db => db.url == $route.params.database).title }}
    </v-toolbar-title>

    <template #extension>
      <div class="d-flex" style="width: 100%">
        <v-text-field
          :value="search"
          label="Search..."
          hide-details
          solo
          @change="v => search = v"
        ></v-text-field>

        <v-combobox
          :value="category"
          :items="$store.state.pageCategories"
          :label="$t('lists.local.modal.changeCategory')"
          class="flex-grow-0 mx-2"
          hide-details
          solo
          @change="v => category = v"
        />

        <v-select
          v-model="scene"
          :value="scene"
          :items="$store.state.pageSceneTypes"
          :label="'Scene type filter'"
          class="flex-grow-0"
          hide-details
          solo
          @change="filterByDCC"
        />

        <v-btn-toggle
          v-model="view"
          class="mx-2"
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
              style="min-width: 0px"
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
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              color="error darken-1"
              class="ml-2"
              style="min-width: 0px"
              height="48"
              width="48"
              @click="$deleteDatabase(databaseIndex)"
              v-on="on"
            >
              <v-icon>
                mdi-delete-forever
              </v-icon>
            </v-btn>
          </template>
          <span>{{ $t('lists.local.delete') }}</span>
        </v-tooltip>
      </div>
    </template>
  </v-toolbar>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import path from 'path'
import { remote } from 'electron'
import { getCollection, initDB, getDB } from 'lokijs-promise'
import { Database, Model } from '@/plugins/models-db/interfaces'
import Vuetify from 'vuetify'

@Component({})

export default class CatalogToolbar extends Vue {
  category = ''
  scene = 'none'
  databaseIndex = ''
  view = 0
  search = ''
  views: string[] = ['grid', 'basic']

  mounted(): void {
    this.databaseIndex = this.$store.state.databases.findIndex((db: Database) => db.url == this.$route.params.database)
  }

  async reindexModels(): Promise<any> {
    initDB(path.join(remote.app.getPath('userData'), "/databases/" + this.$route.params.database + ".db"), 1000)
    await this.reindexModelsCallBack()
  }

  async reindexModelsCallBack(): Promise<any> {
    this.$store.commit('setPageLoadStatus', true)
    
    const db = await getDB()
    db.removeCollection('models')
    let models = await getCollection('models')
    const directory = this.$store.state.databases.find((base: Database) => base.url === this.$route.params.database).path

    this.$indexFolderRecursive(directory).then((files) => {
      files.forEach((file: string) => {
        models.insert({ name: path.parse(file).name, extension: path.parse(file).ext, path: file, category: '', image: '' })
      })
      
      models = models.chain().find({}).simplesort('name').data()
      this.$store.commit('setPageData', models)
      this.$store.commit('setPageLoadStatus', false)
    })
  }

  changePresence(view: string): void {
    this.$store.commit('setPageLoadStatus', true)
    this.view = this.views.indexOf(view)
    this.$editDatabase(this.databaseIndex, 'view', this.views[this.view]).then(() => {
      this.$store.commit('setPageLoadStatus', false)
    })
  }

  filterByDCC(option: any): void {
    const collection = this.$store.state.pageRawData
    const ext = option

    let results: any[] = []

    if (ext != 'none') {
      results = collection.chain().find({ extension: ext })
    } else {
      results = collection.chain().find({})
    }
    this.$store.commit('setPageData', results)
  }
}
</script>