<template>
  <div class="modal modal--add-catalog">
    <header class="modal_header">
      <h2>{{ $t('modals.addCatalog.title') }}</h2>
    </header>
    <div class="modal_content">
      <form>
        <div class="catalog-preview">
          <img
            v-if="preview !== ''"
            :src="preview"
          >
          <span v-else>{{ title.substr(0, 1) }}</span>
        </div>
        <div class="input-group">
          <label>{{ $t('modals.addCatalog.labels.name') }}</label>
          <input
            v-model="title"
            type="text"
            class="input"
            :placeholder="$t('modals.addCatalog.hints.name')"
            required
          >
        </div>
        <div class="input-group">
          <label>{{ $t('modals.addCatalog.labels.folder') }}</label>
          <input
            ref="directory"
            type="file"
            webkitdirectory
            hidden
            required
            @change="handleDirectoryChange"
          >
          <button
            class="input input--file"
            @click.prevent="handleDirectoryInputClick"
          >
            <span v-if="path !== ''">{{ path }}</span>
            <span
              v-else
              class="placeholder"
            >
              {{ folderPlaceholder }}
            </span>
          </button>
        </div>
        <div class="input-group">
          <label>{{ $t('modals.addCatalog.labels.image') }}</label>
          <input
            ref="image"
            type="file"
            accept=".jpg, .jpeg, .png, .svg, .webp"
            hidden
            @change="handleImageChange"
          >
          <button
            class="input input--file"
            @click.prevent="handleImageInputClick"
          >
            <span v-if="image !== ''">{{ image }}</span>
            <span
              v-else
              class="placeholder"
            >
              {{ $t('modals.addCatalog.hints.image') }}
            </span>
          </button>
        </div>
      </form>
    </div>
    <div class="modal_actions">
      <button
        class="button button--primary"
        @click="submitNewCatalog"
      >
        {{ $t('common.buttons.add') }}
      </button>
      <button
        class="button button--danger"
        @click="$emit('close')"
      >
        {{ $t('common.buttons.close') }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { remote } from 'electron'

@Component({})
export default class AddNewCatalogModal extends Vue {
  title = ''
  color = ''
  image = ''
  path = ''
  url = ''

  preview = ''

  get folderPlaceholder(): string {
    switch(remote.process.platform) {
      case "win32":
        return 'C:\\Models\\My fancy models'
      case "linux":
        return '/home/user/my fancy models'
      case "darwin":
        return '~/Library/My fancy models'
      default:
        return 'C:\\Models\\My fancy models'
    }
  }

  handleDirectoryInputClick(): void {
    (this.$refs.directory as HTMLInputElement).click()
  }

  handleDirectoryChange(event: any): void {
    const file = event.target.files[0]
    this.path = file !== undefined ? file.path : ''
  }

  handleImageInputClick(): void {
    (this.$refs.image as HTMLInputElement).click()
  }

  handleImageChange(event: any): void {
    const file = event.target.files[0]
    this.image = file !== undefined ? file.path : ''
    this.preview = ''

    // Handle preview image
    const reader = new FileReader()
    reader.onload = ((): void => {
      if (typeof reader.result === 'string') {
        this.preview = reader.result
      }
    })

    if (file !== undefined) {
      reader.readAsDataURL(file)
    }
  }

  submitNewCatalog(): void {
    if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
      const catalog = {
        title: this.title,
        color: this.color,
        url: this.$stringToSlug(this.title),
        path: this.path,
        localDB: true,
        disabled: false
      }
      this.url = catalog.url

      this.$addDatabase(catalog)
        .then(() => {
          this.$emit('close')
        })
        .catch((err: Error) => {
          console.log(err)
        })
    }
  }
}
</script>
