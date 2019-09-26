<template>
  <v-row>
    <v-col
      v-for="item in $store.state.pageData"
      :key="item.index"
      xl="3"
      lg="4"
      cols="6"
    >
      <v-card>
        <v-img
          :src="forceReloadImage(item.image)"
          aspect-ratio="1"
          class="grey lighten-2 mb-4"
          max-height="300"
        >
          <template v-slot:placeholder>
            <v-row
              class="fill-height ma-0"
              align="center"
              justify="center"
            >
              <v-icon
                color="grey"
                size="200"
              >
                mdi-file-image
              </v-icon>
            </v-row>
          </template>
          <v-card-title class="align-end fill-height">
            <div class="v-title-dark">
              <span
                class="title"
                style="word-break: break-word;"
              >
                {{ item.name }}
              </span>
              <div class="flex-grow-1" />
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-avatar
                    class="ml-2"
                    size="24"
                    tile
                    v-on="on"
                  >
                    <img :src="$returnExtensionIcon(item.extension)">
                  </v-avatar>
                </template>
                <span>{{ $returnHumanLikeExtension(item.extension) }}</span>
              </v-tooltip>
            </div>
          </v-card-title>
        </v-img>
        <v-card-text>
          <ul class="v-ul no-dots">
            <li class="d-flex align-center">
              <v-icon>
                mdi-card-text-outline
              </v-icon>
              <p class="ma-0 ml-2">
                {{ $returnItemCategory(item.category) }}
              </p>
            </li>
            <li class="d-flex align-center">
              <v-icon>
                mdi-folder
              </v-icon>
              <v-tooltip 
                max-width="600"
                bottom
              >
                <template v-slot:activator="{ on }">
                  <p
                    class="ma-0 ml-2 text-truncate"
                    v-on="on"
                  >
                    {{ item.path }}
                  </p>
                </template>
                <span>{{ item.path }}</span>
              </v-tooltip>
            </li>
          </ul>
        </v-card-text>
        <v-card-actions>
          <v-btn
            text
            @click="$openItem(item.path)"
          >
            {{ $t('lists.local.open') }}
          </v-btn>
          <v-btn
            text
            @click="$openFolder(item.path)"
          >
            {{ $t('lists.local.openFolder') }}
          </v-btn>

          <div class="flex-grow-1" />

          <v-btn
            icon
            @click.stop="openPropertiesModal(item)"
          >
            <v-icon>mdi-pencil-box-multiple</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-dialog
      v-model="dialog"
      max-width="500"
    >
      <v-card>
        <v-card-title class="headline">
          {{ $t('lists.local.modal.title') }}
        </v-card-title>
        <v-card-text>
          <v-img
            :src="forceReloadImage(properties.image)"
            aspect-ratio="1"
            class="grey lighten-2 mb-4"
            max-height="300"
          />
          <v-text-field
            :value="properties.name"
            :label="$t('lists.local.modal.changeName')"
            @change="v => properties.name = v"
          />
          <v-combobox
            :value="properties.category"
            :items="autocompleteTips"
            :label="$t('lists.local.modal.changeCategory')"
            @change="v => properties.category = v"
          />
          <v-file-input
            :label="$t('lists.local.modal.changeImage')"
            @change="changeFile"
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
            :loading="isBusy"
            :disabled="isBusy"
            text
            @click="updateItem()"
          >
            {{ $t('app.buttons.save') }}
          </v-btn>
          <v-btn
            color="error"
            text
            @click="dialog = false"
          >
            {{ $t('app.buttons.cancel') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import fs from 'fs'
import path from 'path'
import Jimp from 'jimp'
import uniqid from 'uniqid'
import { remote } from 'electron'
import { getCollection, initDB, getDB } from 'lokijs-promise'

interface Model {
  name: string,
  category: string,
  image: string,
  extension: string,
  path: string
}

@Component({})

export default class GridPresence extends Vue {
  imageRand: number = 0

  models: any = null
  dialog: boolean = false
  imageChanged: boolean = false
  isBusy: boolean = false

  uploadImage: string = ''
  autocompleteTips: string[] = []

  properties: Model = { name: '', category: '', image: '', extension: '', path: '' }

  forceReloadImage(image: string) {
    return image != '' ? image + '?v=' + this.imageRand : image
  }

  changeFile(file: any) {
    this.uploadImage = file != undefined ? file.path : ''
    this.imageChanged = file != undefined
  }

  async openPropertiesModal(model: Model) {
    this.imageChanged = false
    this.dialog = true

    this.models = await getCollection("models")

    let categories: string[] = []
    let query = this.models.chain().find({}).simplesort('category').data()

    query.forEach((item: any) => {
      if (categories.indexOf(item.category) === -1 && item.category != '') {
        categories.push(item.category)
      }
    })

    this.autocompleteTips = categories

    this.properties.name = model.name
    this.properties.category = model.category
    this.properties.image = model.image
    this.properties.extension = model.extension
    this.properties.path = model.path
  }

  async updateItem() {
    this.isBusy = true

    this.models = await getCollection("models")
    let queryModel = this.models.findOne({ path: this.properties.path })
    let imageName = uniqid('image-') + '.jpg'
    
    let imagePath: string = ''
    if (this.imageChanged === true && this.properties.image != '') {
      imagePath = path.normalize(this.properties.image)
    } else {
      imagePath = path.normalize(path.join(remote.app.getPath('userData'), '\\imagecache\\', imageName))
    }

    queryModel.name = this.properties.name
    queryModel.category = this.properties.category
    queryModel.image = (this.imageChanged === true) ? imagePath : this.properties.image

    // Create thumbnails and save in imagecache folder
    if(this.imageChanged === true) {
      fs.access(imagePath, fs.constants.F_OK, (err) => {
        Jimp.read(this.uploadImage)
        .then((image: any) => {
          return image.cover(700, 700).quality(70).writeAsync(imagePath)
        })
        .then(() => {
          this.imageRand++
          this.models.update(queryModel)
          this.$store.commit('setPageData', this.models.chain().find({}).simplesort('name').data())
          this.isBusy = false
          this.dialog = false
        })
      })
    } else {
      this.models.update(queryModel)
      this.$store.commit('setPageData', this.models.chain().find({}).simplesort('name').data())
      this.isBusy = false
      this.dialog = false
    }
  }
}
</script>