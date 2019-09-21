<template>
  <v-card>
    <v-card-title>
      {{ $store.state.databases.find(db => db.url == $route.params.database).title }}
      <div class="flex-grow-1"></div>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            @click="reindexModels"
            color="primary"
            class="mr-2"
            :loading="inProgress"
            :disabled="inProgress"
            v-on="on"
            fab
          >
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </template>
        <span>Переиндексировать каталог</span>
      </v-tooltip>
      <v-text-field
        v-model="search"
        append-icon="mda-search"
        label="Поиск"
        solo
        single-line
        hide-details
      ></v-text-field>
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
        <v-menu absolute right>
          <template v-slot:activator="{ on }">
            <v-btn
              class="text-none text-left d-inline-block"
              block
              text
              v-on="on"
            >
              {{ item.name }}
            </v-btn>
          </template>

          <v-list>
            <v-list-item @click="$openItem(item.path, item.extension)">
              <v-list-item-title>Открыть файл</v-list-item-title>
            </v-list-item>
            <v-list-item @click="$openFolder(item.path)">
              <v-list-item-title>Открыть папку с моделью</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        
      </template>

      <template v-slot:item.extension="{ item }">
        <p class="ma-0">{{ returnHumanLikeExt(item.extension) }}</p>
      </template>

      <template v-slot:item.path="{ item }">
        <p class="ma-0">{{ item.path }}</p>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import path from 'path'
import { remote } from 'electron'
import { getCollection, initDB, getDB } from 'lokijs-promise'

const modelsExtensions = {
  ".max": "3ds Max Scene",
  ".ma": "Maya ASCII Scene",
  ".mb": "Maya Binary Scene",
  ".blend": "Blender Scene",
  ".c4d": "Cinema 4D Scene", 
  ".hip": "Houdini Scene",
  ".hiplc": "Houdini Scene",
  ".hipnc": "Houdini Scene",
  ".lxo": "Modo Scene"
  }

export default {
  name: "LocalFolder",
  data() {
    return {
      inProgress: false,
      search: "",
      headers: [
        { text: 'Название', align: 'left', width: '300', value: 'name'},
        { text: 'Тип файла', width: '160', value: 'extension' },
        { text: 'Полный путь к файлу', value: 'path' }
      ],
    }
  },
  methods: {
    returnHumanLikeExt: function(extension) {
      return modelsExtensions[extension]
    },
    reindexModels() {
      initDB(path.join(remote.app.getPath('userData'), "/databases/" + this.$route.params.database + ".db"), 1000)
      this.reindexModelsCallBack()
    },
    reindexModelsCallBack: async function() {
      this.$store.commit('setPageData', [])
      
      let db = await getDB()
      db.removeCollection('models')
      let models = await getCollection('models')
      let directory = this.$store.state.databases.find(base => base.url === this.$route.params.database).path

      this.$indexFolderRecursive(directory).then((files) => {
        files.forEach((file) => {
          models.insert({ name: path.parse(file).name, extension: path.parse(file).ext, path: file })
        })
        
        models = models.find({})
        this.$store.commit('setPageData', models)
      })
    }
  }
}
</script>

<style lang="sass">
.v-btn.text-left
  .v-btn__content
    justify-content: flex-start
</style>