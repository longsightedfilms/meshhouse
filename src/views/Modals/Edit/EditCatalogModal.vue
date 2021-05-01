<template>
  <div class="modal modal--add-catalog">
    <header class="modal_header">
      <h1>{{ $t('modals.editCatalog.title') }}</h1>
    </header>
    <div class="modal_content">
      <div class="left">
        <ValidationObserver ref="form">
          <form>
            <div>
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
                  disabled
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
      <v-button
        type="primary"
        :busy="busy"
        @click="editCatalog"
      >
        {{ $t('common.buttons.save') }}
      </v-button>
      <v-button
        :disabled="busy"
        @click="$emit('close')"
      >
        {{ $t('common.buttons.cancel') }}
      </v-button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import ColorPicker from 'vue-color/src/components/Chrome.vue';
import SidebarLink from '@/components/UI/Sidebar/SidebarLink.vue';
import { ValidationObserver, validate } from 'vee-validate';
import { colorContrast } from '@/functions/image';
import { findDatabaseIndex } from '@/functions/databases';

@Component({
  components: {
    ColorPicker,
    SidebarLink,
    ValidationObserver
  }
})
export default class EditCatalogModal extends Vue {
  $refs!: {
    form: InstanceType<typeof ValidationObserver>;
    background: HTMLInputElement;
    image: HTMLInputElement;
    imageProvider: InstanceType<typeof ValidationObserver>;
  }

  busy = false
  imageChanged = false
  backgroundImage = ''

  properties: DatabaseItem = {
    title: '',
    color: '#e66465',
    icon: '',
    path: '',
    background: '',
    backgroundTall: '',
    localDB: true,
    disabled: false,
    totalsize: 0,
    url: ''
  }

  preview = ''

  mounted(): void {
    let db: DatabaseItem;
    if (this.$route.params.database === undefined) {
      db = Object.assign({}, this.$store.state.controls.properties);
    } else {
      db = Object.assign({}, this.$store.state.db.databases.local.find((db: DatabaseItem) => db.url == this.$route.params.database));
    }
    db.background = db.background ?? '';
    db.backgroundTall = db.backgroundTall ?? '';
    db.icon = db.icon ?? '';
    this.properties = db;
  }

  get folderPlaceholder(): string {
    switch(this.$ipcSendSync('get-os')) {
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
    const dialog = await this.$ipcInvoke('show-open-dialog', {
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
    this.backgroundImage = file !== undefined ? file.path : '';
    this.properties.background = file !== undefined ? file.path : '';
    this.imageChanged = file !== undefined;
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

  editCatalog(): void {
    this.$refs.form.validate()
      .then(async(success: boolean) => {
        if (success) {
          this.busy = true;
          const slug = this.properties.title.trim().replace(/[~!@#$%^&*()=+.,?/\\|]+/, '');
          if (this.imageChanged === true) {
            try {
              const backgroundObject = await this.$ipcInvoke('generate-bg-image', {
                item: this.properties,
                image: this.backgroundImage
              });
              const backgroundTallObject = await this.$ipcInvoke('generate-bg-tall-image', {
                item: this.properties,
                image: this.backgroundImage
              });


              this.properties.background = backgroundObject.imgPath;
              this.properties.backgroundTall = backgroundTallObject.imgPath;
              this.$store.commit('incrementImageRandomizer');
              await this.$editDatabase(findDatabaseIndex(this.properties.url), this.properties);
              this.$emit('close');
            } catch (err) {
              this.properties.background = '';
              this.imageChanged = false;
              console.log(err);
              this.busy = false;
            }
          } else {
            await this.$editDatabase(findDatabaseIndex(this.properties.url), this.properties);
            this.$emit('close');
            this.busy = false;
          }
        }
      });
  }
}
</script>
