<template>
  <div class="modal modal--add-catalog">
    <header class="modal_header">
      <h2>{{ $t('modals.addCatalog.title') }}</h2>
    </header>
    <div class="modal_content">
      <ValidationObserver ref="form">
        <form>
          <div class="form-header">
            <div
              class="catalog-preview"
              :style="catalogBackgroundColor"
            >
              <img
                v-if="preview !== ''"
                :src="preview"
              >
              <span
                v-else
                :class="avatarTextColorClass"
              >
                {{ title.substr(0, 1).toUpperCase() }}
              </span>
            </div>
            <div class="input-group input-group--column">
              <label>{{ $t('modals.addCatalog.labels.color') }}</label>
              <color-picker
                class="input--color"
                :value="color"
                @input="handleUpdateColor"
              />
            </div>
          </div>
          <ValidationProvider
            v-slot="{ errors }"
            name="catalogTitle"
            class="input-group"
            :rules="{
              required: true,
              alpha_spaces: true
            }"
            immediate
          >
            <label>{{ $t('modals.addCatalog.labels.name') }}</label>
            <input
              v-model="title"
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
            v-slot="{ validate, errors }"
            name="catalogPath"
            class="input-group"
            rules="required"
            immediate
          >
            <input
              v-model="path"
              type="hidden"
            >
            <label>{{ $t('modals.addCatalog.labels.folder') }}</label>
            <button
              :title="path"
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
            <span class="input__message">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <ValidationProvider
            ref="imageProvider"
            v-slot="{ validate, errors }"
            name="catalogImage"
            class="input-group"
            rules="image"
            immediate
          >
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
            <span class="input__message">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
        </form>
      </ValidationObserver>
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
import ColorPicker from 'vue-color/src/components/Chrome.vue';
import { ValidationObserver, validate } from 'vee-validate';
import { colorContrast } from '@/plugins/models-db/functions';

@Component({
  components: {
    ColorPicker,
    ValidationObserver
  }
})
export default class AddNewCatalogModal extends Vue {
  $refs!: {
    form: InstanceType<typeof ValidationObserver>;
    image: HTMLInputElement;
    imageProvider: InstanceType<typeof ValidationObserver>;
  }

  title = ''
  color = '#e66465'
  image = ''
  path = ''
  url = ''

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
      backgroundColor: this.color
    };
  }

  get avatarTextColorClass(): string {
    return colorContrast(this.color);
  }

  async handleDirectoryInputClick(): Promise<void> {
    const dialog = await remote.dialog.showOpenDialog({
      properties: ['openDirectory']
    });
    const folderPath = dialog.filePaths.length !== 0 ? dialog.filePaths[0].toString() : '';
    const validation = await validate(folderPath, 'required', {
      name: 'catalogPath'
    });
    this.path = validation.valid ? folderPath : '';
  }

  handleImageInputClick(): void {
    this.$refs.image.click();
  }

  handleUpdateColor(color: VueColor): void {
    this.color = color.hex;
  }

  async handleImageChange(event: Event): Promise<void> {
    const valid = await this.$refs.imageProvider.validate();
    if (valid) {
      const target = event.target as HTMLInputElement;
      const file = (target.files as FileList)[0];
      this.image = file !== undefined ? file.path : '';
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
    this.$refs.form.validate()
      .then(async(success: boolean) => {
        if (success) {
          const catalog = {
            title: this.title,
            color: this.color,
            url: this.$stringToSlug(this.title),
            icon: this.image,
            path: this.path,
            localDB: true,
            disabled: false
          };
          this.url = catalog.url;

          await this.$addDatabase(catalog);
          this.$emit('close');
        }
      });
  }
}
</script>
