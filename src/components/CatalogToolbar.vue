<template>
  <v-toolbar
    color="grey darken-4"
    class="py-4"
    height="auto"
    extension-height="64"
    prominent
    flat
  >
    <v-toolbar-title class="mr-2">
      {{ $store.state.databases.find(db => db.url == $route.params.database).title }}
    </v-toolbar-title>
    
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          color="primary"
          style="min-width: 0px"
          height="48"
          width="48"
          @click="reindexModels"
          v-on="on"
          icon
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
          icon
        >
          <v-icon>
            mdi-delete-forever
          </v-icon>
        </v-btn>
      </template>
      <span>{{ $t('lists.local.delete') }}</span>
    </v-tooltip>

    <v-spacer></v-spacer>
    
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
        <span v-t="'addCatalog.formViewHint.grid'" />
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
        <span v-t="'addCatalog.formViewHint.basic'" />
      </v-tooltip>
    </v-btn-toggle>

    <template #extension>
      <div
        class="d-flex mt-4"
        style="width: 100%; align-items: flex-start;"
      >
        <v-text-field
          :value="search"
          :label="$t('app.labels.search')"
          prepend-inner-icon="mdi-magnify"
          hide-details
          clearable
          solo
          @input="filterBySearch"
        />

        <v-combobox
          :value="category"
          :items="$store.state.pageCategories"
          :label="$t('lists.local.modal.changeCategory')"
          class="flex-grow-0 mx-2"
          prepend-inner-icon="mdi-palette-swatch"
          clearable
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
          prepend-inner-icon="mdi-file-compare"
          hide-details
          solo
          @change="filterByDCC"
        />

        <v-btn-toggle
          v-model="orderby"
          class="mx-2"
          mandatory
        >
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                text
                v-on="on"
                @click="changeOrder('ASC')"
              >
                <v-icon>mdi-format-font-size-increase</v-icon>
              </v-btn>
            </template>
            <span v-t="'lists.local.order.asc'" />
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                text
                v-on="on"
                @click="changeOrder('DESC')"
              >
                <v-icon>mdi-format-font-size-decrease</v-icon>
              </v-btn>
            </template>
            <span v-t="'lists.local.order.desc'" />
          </v-tooltip>
        </v-btn-toggle>
      </div>
    </template>
  </v-toolbar>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import path from 'path'
import { remote } from 'electron'
import { DatabaseItem, Model, QueryFilters } from '@/plugins/models-db/interfaces'
import Vuetify from 'vuetify'

@Component({})

export default class CatalogToolbar extends Vue {
  filters = this.$store.state.pageFilters

  category = ''
  scene = 'none'
  databaseIndex = ''
  view = 0
  orderby = 0
  search = ''
  views: string[] = ['grid', 'basic']
  orders: string[] = ['ASC', 'DESC']

  mounted(): void {
    this.databaseIndex = this.$store.state.databases.findIndex((db: DatabaseItem) => db.url == this.$route.params.database)
    const db = this.$store.state.databases[this.databaseIndex]
    this.view = this.views.indexOf(db.view)
    this.orderby = this.orders.indexOf(this.filters.order)
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

  changeOrder(order: string): void {
    this.filters.order = order
    this._setFilters(this.filters)
  }

  filterBySearch(option: string): void {
    this.filters.where.name = option
    this._setFilters(this.filters)
  }

  filterByCategory(option: string): void {
    this.filters.where.category = option
    this._setFilters(this.filters)
  }

  filterByDCC(option: string): void {
    this.filters.where.extension = option
    this._setFilters(this.filters)
  }

  _setFilters(filters: QueryFilters): void {
    this.$store.commit('setPageLoadStatus', true)
    this.$store.commit('setPageFilters', filters)
    this.$getItemsFromDatabase(this.$route.params.database).then((result) => {
      this.$store.commit('setPageData', result)
      this.$store.commit('setPageLoadStatus', false)
    })
  }
}
</script>