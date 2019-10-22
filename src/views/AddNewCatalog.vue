<template>
  <v-row>
    <v-col cols="12">
      <h1 class="display-1">
        {{ $t('addCatalog.formTitle') }}
      </h1>
    </v-col>
    <v-col cols="12">
      <v-card>
        <v-form 
          ref="form"
          @submit.prevent="submitNewCatalog"
        >
          <v-list-item>
            <v-list-item-content>
              <v-text-field
                :value="title"
                :rules="[(value) => !!value || this.$t('addCatalog.formTitleHint')]"
                :placeholder="$t('addCatalog.formPlaceholder')"
                class="headline"
                type="text"
                @change="v => title = v"
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
            <v-container
              class="pa-0"
              fluid
            >
              <v-row>
                <v-col cols="3">
                  <p class="title">
                    {{ $t('addCatalog.formColorPicker') }}
                  </p>
                  <v-color-picker
                    v-model="color"
                    class="mb-4"
                    mode="rgba"
                    hide-inputs
                    show-swatches
                  />
                </v-col>
                <v-col cols="9">
                  <p class="title">
                    {{ $t('addCatalog.formView') }}
                  </p>
                  <v-item-group
                    :value="view"
                    mandatory
                    @change="v => view = v"
                  >
                    <v-row>
                      <v-col class="py-0">
                        <v-item v-slot:default="{ active, toggle }">
                          <div>
                            <v-card
                              :color="active ? 'primary' : ''"
                              class="d-flex align-center"
                              :class="active ? 'elevation-16': ''"
                              dark
                              height="330"
                              @click="toggle"
                            >
                              <v-scroll-y-transition>
                                <div class="display-3 flex-grow-1 text-center">
                                  <v-icon size="256">
                                    mdi-view-grid
                                  </v-icon>
                                </div>
                              </v-scroll-y-transition>
                            </v-card>
                            <p class="title text-center mt-4 mb-0">
                              {{ $t('addCatalog.formViewHint.grid') }}
                            </p>
                          </div>
                        </v-item>
                      </v-col>
                      <v-col class="py-0">
                        <v-item v-slot:default="{ active, toggle }">
                          <div>
                            <v-card
                              :color="active ? 'primary' : ''"
                              class="d-flex align-center"
                              :class="active ? 'elevation-16': ''"
                              dark
                              height="330"
                              @click="toggle"
                            >
                              <v-scroll-y-transition>
                                <div class="display-3 flex-grow-1 text-center">
                                  <v-icon size="256">
                                    mdi-view-headline
                                  </v-icon>
                                </div>
                              </v-scroll-y-transition>
                            </v-card>
                            <p class="title text-center mt-4 mb-0">
                              {{ $t('addCatalog.formViewHint.basic') }}
                            </p>
                          </div>
                        </v-item>
                      </v-col>
                    </v-row>
                  </v-item-group>
                </v-col>
              </v-row>
            </v-container>

            <v-file-input
              :label="$t('addCatalog.formFolder')"
              :rules="[(value) => !!value.path || this.$t('addCatalog.formFolder')]"
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
              {{ $t('app.buttons.add') }}
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
        {{ $t('addCatalog.formSuccess') }}
        <v-btn
          color="primary"
          text
          @click="$router.push('/db/' + url)"
        >
          {{ $t('app.buttons.show') }}
        </v-btn>
        <v-btn
          color="pink"
          text
          @click="snackbar = false"
        >
          {{ $t('app.buttons.close') }}
        </v-btn>
      </v-snackbar>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import path from 'path'
import fs from 'fs'
import { remote } from 'electron'
import { getCollection, initDB } from 'lokijs-promise'
import { Database } from '@/plugins/models-db/interfaces'

@Component({})

export default class AddNewCatalog extends Vue {
  snackbar = false
  inProgress = false
  title = ""
  color = ""
  path = ""
  view = 0
  url = ""

  viewString: string[] = ["grid", "basic"]

  async startingIndexFolder(catalog: Database): Promise<void> {
    const models = await getCollection("models")

    this.$indexFolderRecursive(this.path).then((files: string[]) => {
      files.forEach((file: string) => {
        models.insert({ name: path.parse(file).name, extension: path.parse(file).ext, path: file })
      })
      this.$addDatabase(catalog)
    })
  }

  submitNewCatalog(): void {
    if((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
      this.inProgress = true

      const catalog = {
        title: this.title,
        color: this.color,
        url: this.$stringToSlug(this.title),
        path: this.path,
        view: this.viewString[this.view]
      }
      this.url = catalog.url

      const directory = path.join(remote.app.getPath('userData'), "/databases/")
      if (!fs.existsSync(directory)){
        fs.mkdirSync(directory)
      }

      initDB(path.join(directory, catalog.url + ".db"), 1000)
      this.startingIndexFolder(catalog).then(() => {
        this.snackbar = true
        this.inProgress = false
      })
    }
  }
}
</script>

<style lang="sass">
.v-card__text
  box-sizing: border-box
</style>