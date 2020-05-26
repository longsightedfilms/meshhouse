<template>
  <div class="modal modal--sidebar modal--properties">
    <header class="modal_header">
      <h2>{{ $t('context.model.properties') }}</h2>
    </header>
    <div class="modal_content">
      <model-image
        :src="properties.image"
        :extension="properties.extension"
      />
      <ValidationObserver ref="form">
        <ValidationProvider
          v-slot="{ classes }"
          name="modelTitle"
          class="input-group"
          rules="required"
          immediate
        >
          <label>{{ $t('modals.properties.title') }}</label>
          <input
            v-model="properties.name"
            type="text"
            class="input"
            :class="classes"
            :placeholder="$t('modals.properties.title')"
          >
        </ValidationProvider>
        <div class="input-group">
          <label>{{ $t('modals.properties.category') }}</label>
          <div class="input--select">
            <select
              v-model="properties.category"
              class="input"
            >
              <option :value="null">
                {{ $t('views.catalog.categories.noCategory') }}
              </option>
              <option
                v-for="category in categories"
                :key="category.id"
                :value="category.id"
              >
                {{ rewriteOptionName(category) }}
              </option>
            </select>
            <vue-icon
              icon="caret-forward"
              raster
            />
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
        <div class="info">
          <dd>{{ $t('views.catalog.models.path') }}</dd>
          <dt>{{ properties.path }}</dt>
        </div>
        <div class="info">
          <dd>{{ $t('views.catalog.models.size') }}</dd>
          <dt>{{ $formatSize(properties.size) }}</dt>
        </div>
        <div class="errors">
          {{ error }}
        </div>
      </ValidationObserver>
    </div>
    <div class="modal_actions">
      <button
        class="button button--primary"
        @click="handleSubmit"
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
import ModelImage from '@/components/UI/Image/ModelImage.vue'
import { ValidationObserver, ValidationProvider } from 'vee-validate'

@Component({
  components: {
    ModelImage,
    ValidationObserver,
    ValidationProvider
  }
})
export default class EditPropertiesModal extends Vue {
  error = ''
  categories: Category[] = []
  uploadImage = ''
  properties: ImageProperties = {
    id: 0,
    category: null,
    extension: '',
    name: '',
    image: '',
    imageChanged: false,
    path: '',
    size: 0
  }

  async mounted(): Promise<void> {
    this.properties = this.$store.state.controls.properties

    if (this.properties.category === '') {
      this.properties.category = null
    }

    const db = new Integrations.local(this.$route.params.database)
    const categories = await db.fetchCategories(`SELECT * FROM 'categories'`)

    this.categories = categories
  }

  rewriteOptionName(category: Category): string {
    return category.parentId !== -1
    ? `${this.getParentName(category.parentId)}${category.name}`
    : category.name
  }

  getParentName(parentId: number): string {
    const matches: string[] = []

    this.categories.forEach((item: Category) => {
      if (item.id === parentId) {
        matches.push(item.name)
      }
    })
    return matches.join('\\') + '\\'
  }

  forceReloadImage(image: string): string {
    return image != ''
      ? image + '?v=' + this.$store.state.controls.imageRandomizer
      : image
  }

  handleFileChange(event: Event): void {
    const target = (event.target as HTMLInputElement)
    const file = (target.files as FileList)[0]
    this.uploadImage = file != undefined ? file.path : ''
    this.properties.imageChanged = file != undefined
  }

  handleFileClick(): void {
    (this.$refs.file as HTMLInputElement).click()
  }

  async handleSubmit(): Promise<void> {
    const success = await (this.$refs.form as InstanceType<typeof ValidationObserver>).validate()
    if (success) {
      await this.updateItem()
    }
  }

  async updateItem(): Promise<void> {
    const db = new Integrations.local(this.$route.params.database)

    const query = `SELECT * FROM 'Models' WHERE path ='${this.properties.path}'`
    const models = await db.fetchItemsFromDatabase(query)

    const imageName = uniqid('image-') + '.webp'

    let imagePath = ''
    this.error = ''
    if (this.properties.imageChanged === true && this.properties.image !== '') {
      const image = path.parse(this.properties.image)
      image.ext = '.webp'
      imagePath = path.join(image.dir, image.name) + image.ext
    } else {
      imagePath = path.join(remote.app.getPath('userData'), '\\imagecache\\', imageName)
    }

    models[0].name = this.properties.name
    models[0].category = this.properties.category
    models[0].image =
      this.properties.imageChanged === true ? imagePath : this.properties.image

    // Create thumbnails and save in imagecache folder
    if (this.properties.imageChanged === true) {
      fs.access(imagePath, fs.constants.F_OK, (err) => {
        if(fs.existsSync(this.properties.image)) {
          fs.unlinkSync(this.properties.image)
        }
        sharp(this.uploadImage)
          .resize(1024, 1024)
          .webp({
            quality: 85,
            smartSubsample: true,
            reductionEffort: 6,
            force: true
          })
          .toFile(imagePath)
          .then(async () => {
            this.$store.commit('incrementImageRandomizer')
            this.$updateItemInDatabase(this.$route.params.database, models[0])
            const result = await db.fetchItemsFromDatabase()
            this.$store.commit('setLoadedData', result)
            this.$emit('close')
          })
          .catch(async (err: Error) => {
            this.error = err.name + ': ' + err.message
            this.properties.image = ''
            this.properties.imageChanged = false

            models[0].image = ''

            this.$updateItemInDatabase(this.$route.params.database, models[0])
            const result = await db.fetchItemsFromDatabase()
            this.$store.commit('setLoadedData', result)
          })
      })
    } else {
      this.$updateItemInDatabase(this.$route.params.database, models[0])
      const result = await db.fetchItemsFromDatabase()
      this.$store.commit('setLoadedData', result)
      this.$emit('close')
    }
  }
}
</script>
