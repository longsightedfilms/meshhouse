<template>
  <div class="py-4">
    <v-card>
      <v-card-title>
        {{ $store.state.databases.find(db => db.url == $route.params.database).title }}
        <div class="flex-grow-1" />
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              color="primary"
              class="mr-2"
              height="48"
              :loading="inProgress"
              :disabled="inProgress"
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
        <v-text-field
          v-model="search"
          append-icon="mda-search"
          :label="$t('search')"
          solo
          single-line
          hide-details
        />
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="$store.state.pageData"
        :items-per-page="50"
        :footer-props="{
          'items-per-page-options': [10, 25, 50, 100, -1]
        }"
        :search="search"
        sort-by="name"
      >
        <template v-slot:item.name="{ item }">
          <v-menu
            absolute
            right
          >
            <template v-slot:activator="{ on }">
              <v-btn
                class="text-none text-left d-inline-block btn-avatar"
                block
                text
                v-on="on"
              >
                <v-avatar
                  size="24"
                  tile
                >
                  <img :src="returnExtensionIcon(item.extension)">
                </v-avatar>
                {{ item.name }}
              </v-btn>
            </template>

            <v-list>
              <v-list-item @click="$openItem(item.path)">
                <v-list-item-title>{{ $t('lists.local.open') }}</v-list-item-title>
              </v-list-item>
              <v-list-item @click="$openFolder(item.path)">
                <v-list-item-title>{{ $t('lists.local.openFolder') }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>

        <template v-slot:item.extension="{ item }">
          <p class="ma-0">
            {{ returnHumanLikeExt(item.extension) }}
          </p>
        </template>

        <template v-slot:item.path="{ item }">
          <p class="ma-0">
            {{ item.path }}
          </p>
        </template>
      </v-data-table>
      <p class="text-right pa-4 font-italic">
        {{ $t('presence.basic') }}
      </p>
    </v-card>
  </div>
</template>

<script>
import path from 'path'
import { remote } from 'electron'
import { getCollection, initDB, getDB } from 'lokijs-promise'

export default {
  name: "LocalFolder",
  data() {
    return {
      inProgress: false,
      search: "",
      headers: [
        { text: this.$t('lists.local.datatable.title'), align: 'left', width: '300', value: 'name'},
        { text: this.$t('lists.local.datatable.filetype'), width: '160', value: 'extension' },
        { text: this.$t('lists.local.datatable.path'), value: 'path' }
      ],
    }
  }
}
</script>

<style lang="sass">
.v-btn.text-left
  .v-btn__content
    justify-content: flex-start
.v-btn.btn-avatar
  .v-btn__content
    .v-avatar
      margin-right: 1rem
      margin-left: -1rem
</style>