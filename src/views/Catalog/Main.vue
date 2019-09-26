<template>
  <div class="mr-2">
    <v-row>
      <v-col cols="12">
        <div class="d-flex">
          <h1 class="display-1">
            {{ $store.state.databases.find(db => db.url == $route.params.database).title }}
          </h1>

          <div class="flex-grow-1" />
          
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                color="primary"
                height="48"
                width="48"
                fab
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
    <grid-presence v-if="$store.state.pageData.length != 0" />
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

<script>
import GridPresence from './GridPresence'
import path from 'path'
import { remote } from 'electron'
import { getCollection, initDB, getDB } from 'lokijs-promise'

export default {
  name: "DatabaseListItems",
  components: {
    GridPresence
  },
  data() {
    return {
      models: null
    }
  },
  watch: {
    '$route' (to, from) {
      initDB(path.join(remote.app.getPath('userData'), "/databases/" + this.$route.params.database + ".db"), 1000)
      this.databaseInitialize()
    }
  },
  async mounted() {
    initDB(path.join(remote.app.getPath('userData'), "/databases/" + this.$route.params.database + ".db"), 1000)
    await this.databaseInitialize()
  },
  methods: {
    databaseInitialize: async function() {
      this.models = await getCollection("models")
      let results = this.models.chain().find({}).simplesort('name').data()

      this.$store.commit('setPageData', results)
      this.$store.commit('setPageStatus', true)
    },
    reindexModels() {
      initDB(path.join(remote.app.getPath('userData'), "/databases/" + this.$route.params.database + ".db"), 1000)
      this.reindexModelsCallBack()
    },
    reindexModelsCallBack: async function() {
      this.$store.commit('setPageStatus', false)
      
      let db = await getDB()
      db.removeCollection('models')
      this.models = await getCollection('models')
      let directory = this.$store.state.databases.find(base => base.url === this.$route.params.database).path

      this.$indexFolderRecursive(directory).then((files) => {
        files.forEach((file) => {
          this.models.insert({ name: path.parse(file).name, extension: path.parse(file).ext, path: file, category: '', image: '' })
        })
        
        this.models = this.models.chain().find({}).simplesort('name').data()
        this.$store.commit('setPageData', this.models)
        this.$store.commit('setPageStatus', true)
      })
    }
  }
}
</script>