<template>
  <v-row>
    <v-col>
      <v-card>
        <v-form 
          ref="form"
          @submit.prevent="submitNewCatalog"
        >
          <v-list-item three-line>
            <v-list-item-content>
              <div class="overline">
                Добавить новый каталог
              </div>
              <v-text-field
                v-model="title"
                :rules="[rules.required]"
                placeholder="Новый каталог"
                class="headline"
                type="text"
              />
            </v-list-item-content>

            <v-list-item-avatar
              size="80"
              :color="color"
            >
              <p class="white--text ma-0">
                {{ title.substr(0,1) }}
              </p>
            </v-list-item-avatar>
          </v-list-item>
          <v-card-text>
            <p>Выберите цвет подложки каталога:</p>
            <v-color-picker
              v-model="color"
              class="mb-4"
              mode="rgba"
              hide-inputs
              show-swatches
            />
            <v-file-input
              label="Укажите путь к корневой папке с моделями"
              :rules="[rules.file]"
              solo
              webkitdirectory
              @change="(file) => { path = file != undefined ? file.path : '' }"
            >
              <template v-slot:selection="{ file }">
                {{ file.path }}
              </template>
            </v-file-input>
          </v-card-text>
          <v-card-actions>
            <div class="flex-grow-1" />
            <v-btn
              color="primary"
              type="submit"
              :loading="inProgress"
            >
              Добавить
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
      <v-snackbar
        v-model="snackbar"
        :timeout="0"
        right
        vertical
      >
        Каталог успешно добавлен
        <v-btn
          color="primary"
          text
          @click="$router.push('/db/' + url)"
        >
          Перейти
        </v-btn>
        <v-btn
          color="pink"
          text
          @click="snackbar = false"
        >
          Закрыть
        </v-btn>
      </v-snackbar>
    </v-col>
  </v-row>
</template>

<script>
import path from 'path'
import fs from 'fs'
import { remote } from 'electron'
import { getCollection, initDB } from 'lokijs-promise'

export default {
  name: "AddNewCatalog",
  data() {
    return {
      snackbar: false,
      inProgress: false,
      title: "",
      color: "",
      path: "",
      url: "",
      rules: {
        required: value => !!value || 'Введите название каталога',
        file: value => !!value.path || 'Выберите путь к каталогу с моделями'
      }
    }
  },
  methods: {
    submitNewCatalog() {
      if(this.$refs.form.validate()) {
        this.inProgress = true

        const catalog = {
          title: this.title,
          color: this.color,
          url: this.$stringToSlug(this.title),
          path: this.path
        }

        this.url = catalog.url

        let directory = path.join(remote.app.getPath('userData'), "/databases/")
        if (!fs.existsSync(directory)){
          fs.mkdirSync(directory)
        }

        initDB(path.join(directory, catalog.url + ".db"), 1000)
        this.startingIndexFolder(catalog).then(() => {
          this.snackbar = true
          this.inProgress = false
        })
      }
    },

    startingIndexFolder: async function(catalog) {
      let models = await getCollection("models")

      this.$indexFolderRecursive(this.path).then((files) => {
        files.forEach((file) => {
          models.insert({ name: path.parse(file).name, extension: path.parse(file).ext, path: file })
        })
        this.$addDatabase(catalog)
      })
    }
  }
}
</script>

<style lang="sass">
.v-card__text
  box-sizing: border-box
</style>