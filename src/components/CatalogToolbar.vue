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
      <div
        class="d-flex"
        style="width: 100%"
      >
        <v-text-field
          :value="search"
          label="Search..."
          hide-details
          solo
          @input="filterBySearch"
        />

        <v-combobox
          :value="category"
          :items="$store.state.pageCategories"
          :label="$t('lists.local.modal.changeCategory')"
          class="flex-grow-0 mx-2"
          hide-details
          solo
          @change="filterByCategory"
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
import { DatabaseItem, Model } from '@/plugins/models-db/interfaces'
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
    this.databaseIndex = this.$store.state.databases.findIndex((db: DatabaseItem) => db.url == this.$route.params.database)
  }

  reindexModels(): void {
    this.$store.commit('setPageLoadStatus', true)
    this.$reindexCatalog(this.$store.state.databases[this.databaseIndex]).then(() => {
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

  filterBySearch(option: string): void {
    const category = option
    const filters = this.$store.state.pageFilters
    filters.where.name = option

    this.$store.commit('setPageFilters', filters)
    this.$getItemsFromDatabase(this.$route.params.database).then((result) => {
      this.$store.commit('setPageData', result)
    })
  }

  filterByCategory(option: string): void {
    const category = option
    const filters = this.$store.state.pageFilters
    filters.where.category = option

    this.$store.commit('setPageFilters', filters)
    this.$getItemsFromDatabase(this.$route.params.database).then((result) => {
      this.$store.commit('setPageData', result)
    })
  }

  filterByDCC(option: string): void {
    const ext = option
    const filters = this.$store.state.pageFilters
    filters.where.extension = ext

    this.$store.commit('setPageFilters', filters)
    this.$getItemsFromDatabase(this.$route.params.database).then((result) => {
      this.$store.commit('setPageData', result)
    })
  }
}
</script>