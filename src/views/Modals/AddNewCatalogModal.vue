<template>
  <div class="modal modal--add-catalog">
    <header class="modal_header">
      <h1>{{ $t('modals.addCatalog.title') }}</h1>
    </header>
    <div class="modal_content">
      <div class="left">
        <ValidationObserver ref="form">
          <form v-bar>
            <div>
              <div style="max-height: calc(100vh - 12rem)">
                <ValidationProvider
                  v-slot="{ errors }"
                  name="catalogTitle"
                  class="input-group"
                  rules="required|notIntegrationName"
                  immediate
                >
                  <label>{{ $t('modals.addCatalog.labels.name') }}</label>
                  <input
                    v-model.lazy="properties.title"
                    type="text"
                    class="input"
                    :placeholder="$t('modals.addCatalog.hints.name')"
                  >
                  <span class="input__message">
                    {{ errors[0] }}
                  </span>
                </ValidationProvider>
                <ValidationProvider
                  ref="directoryProvider"
                  v-slot="{ errors }"
                  name="catalogPath"
                  class="input-group"
                  rules="required"
                  immediate
                >
                  <input
                    v-model="properties.path"
                    type="hidden"
                  >
                  <label>{{ $t('modals.addCatalog.labels.folder') }}</label>
                  <button
                    :title="properties.path"
                    class="input input--file"
                    @click.prevent="handleDirectoryInputClick"
                  >
                    <span v-if="properties.path !== ''">{{ properties.path }}</span>
                    <span
                      v-else
                      class="placeholder"
                    >
                      {{ folderPlaceholder }}
                    </span>
                  </button>
                  <span class="input__message">
                    {{ errors[0] }}
                  </span>
                </ValidationProvider>
                <ValidationProvider
                  ref="imageProvider"
                  v-slot="{ errors }"
                  name="catalogImage"
                  class="input-group"
                  rules="image"
                  immediate
                >
                  <label>{{ $t('modals.addCatalog.labels.icon') }}</label>
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
                    <span v-if="properties.icon !== ''">{{ properties.icon }}</span>
                    <span
                      v-else
                      class="placeholder"
                    >
                      {{ $t('modals.addCatalog.hints.image') }}
                    </span>
                  </button>
                  <span class="input__message">
                    {{ errors[0] }}
                  </span>
                </ValidationProvider>
                <ValidationProvider
                  ref="imageProvider"
                  v-slot="{ errors }"
                  name="catalogImage"
                  class="input-group"
                  rules="image"
                  immediate
                >
                  <label>{{ $t('modals.addCatalog.labels.image') }}</label>
                  <input
                    ref="background"
                    type="file"
                    accept=".jpg, .jpeg, .png, .webp"
                    hidden
                    @change="handleBackgroundChange"
                  >
                  <button
                    class="input input--file"
                    @click.prevent="handleBackgroundFileClick"
                  >
                    <span v-if="properties.background !== ''">{{ properties.background }}</span>
                    <span
                      v-else
                      class="placeholder"
                    >
                      {{ $t('modals.addCatalog.hints.image') }}
                    </span>
                  </button>
                  <span class="input__message">
                    {{ errors[0] }}
                  </span>
                </ValidationProvider>
                <div class="input-group">
                  <label>{{ $t('modals.addCatalog.labels.color') }}</label>
                  <color-picker
                    class="input--color"
                    :value="properties.color"
                    @input="handleUpdateColor"
                  />
                </div>
              </div>
            </div>
          </form>
        </ValidationObserver>
      </div>
      <div class="right">
        <label class="label">{{ $t('modals.addCatalog.preview.title') }}</label>
        <p>{{ $t('modals.addCatalog.preview.side') }}</p>
        <sidebar-link
          :navlink="properties"
          :progress="100"
        />
        <p>{{ $t('modals.addCatalog.preview.wideCard') }}</p>
        <catalog-header
          :database="properties"
          sample
        />
      </div>
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
import Vue from 'vue';
import Component from 'vue-class-component';
import { remote } from 'electron';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import ColorPicker from 'vue-color/src/components/Chrome.vue';
import SidebarLink from '@/components/UI/Sidebar/SidebarLink.vue';
import { ValidationObserver, validate } from 'vee-validate';
import { colorContrast } from '@/plugins/models-db/functions';
import { integrationsList } from '@/functions/databases';

@Component({
  components: {
    ColorPicker,
    SidebarLink,
    ValidationObserver
  }
})
export default class AddNewCatalogModal extends Vue {
  $refs!: {
    form: InstanceType<typeof ValidationObserver>;
    background: HTMLInputElement;
    image: HTMLInputElement;
    imageProvider: InstanceType<typeof ValidationObserver>;
  }

  imageChanged = false
  backgroundImage = ''

  properties: DatabaseItem = {
    title: '',
    color: '#e66465',
    icon: '',
    path: '',
    background: '',
    localDB: true,
    disabled: false,
    totalsize: 0,
    url: ''
  }

  preview = ''

  get folderPlaceholder(): string {
    switch(remote.process.platform) {
    case 'win32':
      return 'C:\\Models\\My fancy models';
    case 'linux':
      return '/home/user/my fancy models';
    case 'darwin':
      return '~/Library/My fancy models';
    default:
      return 'C:\\Models\\My fancy models';
    }
  }

  get catalogBackgroundColor(): object {
    return {
      backgroundColor: this.properties.color
    };
  }

  get avatarTextColorClass(): string {
    return colorContrast(this.properties.color);
  }

  get avatarTextPreview(): string {
    return Array.from(this.properties.title).slice(0, 1).join('').toUpperCase();
  }

  async handleDirectoryInputClick(): Promise<void> {
    const dialog = await remote.dialog.showOpenDialog({
      properties: ['openDirectory']
    });
    const folderPath = dialog.filePaths.length !== 0 ? dialog.filePaths[0].toString() : '';
    const validation = await validate(folderPath, 'required', {
      name: 'catalogPath'
    });
    this.properties.path = validation.valid ? folderPath : '';
  }

  handleImageInputClick(): void {
    this.$refs.image.click();
  }

  handleBackgroundFileClick(): void {
    this.$refs.background.click();
  }

  handleUpdateColor(color: VueColor): void {
    this.properties.color = color.hex;
  }

  handleBackgroundChange(event: Event): void {
    const target = (event.target as HTMLInputElement);
    const file = (target.files as FileList)[0];
    this.backgroundImage = file != undefined ? file.path : '';
    this.properties.background = file != undefined ? file.path : '';
    this.imageChanged = file != undefined;
  }

  async handleImageChange(event: Event): Promise<void> {
    const valid = await this.$refs.imageProvider.validate();
    if (valid) {
      const target = event.target as HTMLInputElement;
      const file = (target.files as FileList)[0];
      this.properties.icon = file !== undefined ? file.path : '';
      this.preview = '';

      // Handle preview image
      const reader = new FileReader();
      reader.onload = ((): void => {
        if (typeof reader.result === 'string') {
          this.preview = reader.result;
        }
      });

      if (file !== undefined) {
        reader.readAsDataURL(file);
      }
    }
  }

  submitNewCatalog(): void {
    const slug = this.properties.title.trim().replace(/[~!@#$%^&*()=+.,?/\\|]+/, '');
    const url = this.$stringToSlug(slug);

    this.$refs.form.validate()
      .then(async(success: boolean) => {
        if (success) {
          const catalog = {
            title: this.properties.title.trim(),
            color: this.properties.color,
            url: url,
            background: this.properties.background,
            icon: this.properties.icon,
            path: this.properties.path,
            localDB: true,
            disabled: false
          };
          this.properties.url = catalog.url;

          // Handle background generation
          const imageFolder = path.join(remote.app.getPath('userData'),
            '\\imagecache\\',
            '\\backgrounds\\'
          );
          const imagePath = path.join(imageFolder, `${this.properties.url}.webp`);
          this.properties.background = this.imageChanged === true ? imagePath : this.properties.background;

          // Create thumbnails and save in imagecache folder
          if (this.imageChanged === true) {
            fs.access(imagePath, fs.constants.F_OK, (err) => {
              if (err) {
                this.properties.background = '';
                this.imageChanged = false;
                this.$emit('close');
              }
              if(fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
              } else {
                fs.mkdirSync(imagePath, 0x777);
              }
              sharp(this.backgroundImage)
                .resize(2560, 400)
                .webp({
                  quality: 99,
                  smartSubsample: true,
                  reductionEffort: 6,
                  force: true
                })
                .toFile(imagePath)
                .then(async() => {
                  catalog.background = this.properties.background;
                  await this.$addDatabase(catalog);
                  this.$emit('close');
                })
                .catch((err: Error) => {
                  this.properties.background = '';
                  this.imageChanged = false;
                  this.$emit('close');
                });
            });
          } else {
            await this.$addDatabase(catalog);
            this.$emit('close');
          }
        }
      });
  }
}
</script>
