<template>
  <v-dialog
    v-model="$store.state.editPropertiesModalOpened"
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
          :items="$store.state.pageCategories"
          :label="$t('lists.local.modal.changeCategory')"
          @change="v => properties.category = v"
        />
        <v-file-input
          :label="$t('lists.local.modal.changeImage')"
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
          @click="$store.commit('setEditPropsModal', false)"
        >
          {{ $t('app.buttons.cancel') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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

@Component({
  watch: {
    '$store.state.editPropertiesModalOpened'(): void {
      this.properties = this.$store.state.properties
    }
  }
})
export default class EditPresenceModal extends Vue {
  isBusy = false 
  uploadImage = ''
  properties: any = {}

  forceReloadImage(image: string): string {
    return image != '' ? image + '?v=' + this.$store.state.imageRandomizer : image
  }

  changeFile(file: any): void {
    this.uploadImage = file != undefined ? file.path : ''
    this.properties.imageChanged = file != undefined
  }

  async updateItem(): Promise<any> {
    this.properties.isBusy = true

    const models = await getCollection("models")
    const queryModel = models.findOne({ path: this.properties.path })
    const imageName = uniqid('image-') + '.jpg'
    
    let imagePath = ''
    if (this.properties.imageChanged === true && this.properties.image != '') {
      imagePath = path.normalize(this.properties.image)
    } else {
      imagePath = path.normalize(path.join(remote.app.getPath('userData'), '\\imagecache\\', imageName))
    }

    queryModel.name = this.properties.name
    queryModel.category = this.properties.category
    queryModel.image = (this.properties.imageChanged === true) ? imagePath : this.properties.image

    // Create thumbnails and save in imagecache folder
    if(this.properties.imageChanged === true) {
      fs.access(imagePath, fs.constants.F_OK, (err) => {
        Jimp.read(this.uploadImage)
        .then((image: any) => {
          return image.cover(700, 700).quality(70).writeAsync(imagePath)
        })
        .then(() => {
          this.$store.commit('incrementImageRandomizer')
          models.update(queryModel)
          this.$store.commit('setPageData', models.chain().find({}).simplesort('name').data())
          this.isBusy = false
          this.$store.commit('setEditPropsModal', false)
        })
      })
    } else {
      models.update(queryModel)
      this.$store.commit('setPageData', models.chain().find({}).simplesort('name').data())
      this.isBusy = false
      this.$store.commit('setEditPropsModal', false)
    }
  }
}
</script>