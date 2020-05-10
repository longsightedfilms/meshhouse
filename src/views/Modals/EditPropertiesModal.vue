<template>
  <div class="modal modal--sidebar modal--properties">
    <header class="modal_header">
      <h2>{{ $t('context.model.properties') }}</h2>
    </header>
    <div class="modal_content">
      <img
        class="modal_image"
        :src="forceReloadImage(properties.image)"
      >
      <div class="input-group">
        <label>{{ $t('modals.properties.title') }}</label>
        <input
          v-model="properties.name"
          type="text"
          class="input"
          required
        >
      </div>
      <div class="input-group">
        <label>{{ $t('modals.properties.category') }}</label>
        <div class="input--select">
          <select
            v-model="properties.category"
            class="input"
          >
            <option
              v-for="(category, index) in $store.state.db.categories"
              :key="index"
              :value="category"
            >
              {{ category }}
            </option>
          </select>
        </div>
      </div>
      <div class="input-group">
        <label>{{ $t('modals.properties.image') }}</label>
        <input
          ref="file"
          type="file"
          accept=".jpg, .jpeg, .png, .webp"
          hidden
          required
          @change="handleFileChange"
        >
        <button
          class="input input--file"
          @click.prevent="handleFileClick"
        >
          <span v-if="uploadImage !== ''">{{ uploadImage }}</span>
          <span
            v-else
            class="placeholder"
          >
            {{ $t('modals.properties.image') }}
          </span>
        </button>
      </div>
    </div>
    <div class="modal_actions">
      <button
        class="button button--primary"
        @click="updateItem()"
      >
        {{ $t('common.buttons.save') }}
      </button>
      <button
        class="button button--danger"
        @click="$emit('close')"
      >
        {{ $t('common.buttons.cancel') }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import uniqid from 'uniqid'
import { remote } from 'electron'
import Integrations from '@/plugins/models-db/integrations/main'

@Component({})
export default class EditPropertiesModal extends Vue {
  uploadImage = ''
  properties: ImageProperties = {
    category: '',
    extension: '',
    name: '',
    image: '',
    imageChanged: false,
    path: '',
  }

  mounted(): void {
    this.properties = this.$store.state.controls.properties
  }

  forceReloadImage(image: string): string {
    return image != ''
      ? image + '?v=' + this.$store.state.controls.imageRandomizer
      : image
  }

  handleFileChange(event: any): void {
    const file = event.target.files[0]
    this.uploadImage = file != undefined ? file.path : ''
    this.properties.imageChanged = file != undefined
  }

  handleFileClick(): void {
    (this.$refs.file as HTMLInputElement).click()
  }

  async updateItem(): Promise<void> {
    const db = new Integrations.local(this.$route.params.database)

    const query = `SELECT * FROM 'Models' WHERE path ='${this.properties.path}'`
    const models = await db.fetchItemsFromDatabase(query)

    const imageName = uniqid('image-') + '.webp'

    let imagePath = ''
    if (this.properties.imageChanged === true && this.properties.image !== '') {
      const image = path.parse(this.properties.image)
      image.ext = '.webp'
      imagePath = path.normalize(path.join(image.dir, image.name) + image.ext)
    } else {
      imagePath = path.normalize(
        path.join(remote.app.getPath('userData'), '\\imagecache\\', imageName)
      )
    }

    models[0].name = this.properties.name
    models[0].category = this.properties.category
    models[0].image =
      this.properties.imageChanged === true ? imagePath : this.properties.image

    // Create thumbnails and save in imagecache folder
    if (this.properties.imageChanged === true) {
      fs.access(imagePath, fs.constants.F_OK, (err) => {
        fs.unlinkSync(this.properties.image)
        sharp(this.uploadImage)
          .resize(1024, 1024)
          .webp({
            quality: 85,
            smartSubsample: true,
            reductionEffort: 6,
            force: true
          })
          .toFile(imagePath)
          .then(() => {
            this.$store.commit('incrementImageRandomizer')
            this.$updateItemInDatabase(this.$route.params.database, models[0])
            this.$store.commit('setLoadedData', models)
            this.$emit('close')
          })
      })
    } else {
      this.$updateItemInDatabase(this.$route.params.database, models[0])
      this.$store.commit('setLoadedData', models)
      this.$emit('close')
    }
  }
}
</script>
