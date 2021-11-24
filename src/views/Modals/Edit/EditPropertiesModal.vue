<template>
  <div class="modal modal--properties">
    <header class="modal_header">
      <h2>{{ $t('context.model.properties') }}</h2>
    </header>
    <div class="modal_content">
      <model-image
        :item="properties"
      />
      <ValidationObserver
        ref="form"
        class="modal_form"
      >
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
      <v-button
        type="primary"
        :busy="busy"
        @click="handleSubmit"
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
import { Vue, Component, Watch } from 'vue-property-decorator';
import ModelImage from '@/components/UI/Image/ModelImage.vue';
import { ValidationObserver, ValidationProvider } from 'vee-validate';

@Component({
  components: {
    ModelImage,
    ValidationObserver,
    ValidationProvider
  }
})
export default class EditPropertiesModal extends Vue {
  busy = false

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
    this.properties = this.$store.state.controls.properties;

    if (this.properties.category === '') {
      this.properties.category = null;
    }

    const categories = await this.$ipcInvoke<Category[]>('get-integration-categories', {
      type: 'local',
      title: this.$route.params.database,
      query: 'SELECT * FROM \'categories\''
    });

    this.categories = categories;
  }

  rewriteOptionName(category: Category): string {
    return category.parentId !== -1
      ? `${this.getParentName(category.parentId)}${category.name}`
      : category.name;
  }

  getParentName(parentId: number): string {
    const matches: string[] = [];

    this.categories.forEach((item: Category) => {
      if (item.id === parentId) {
        matches.push(item.name);
      }
    });
    return matches.join('\\') + '\\';
  }

  forceReloadImage(image: string): string {
    return image != ''
      ? image + '?v=' + this.$store.state.controls.imageRandomizer
      : image;
  }

  handleFileChange(event: Event): void {
    const target = (event.target as HTMLInputElement);
    const file = (target.files as FileList)[0];
    this.uploadImage = file != undefined ? file.path : '';
    this.properties.imageChanged = file != undefined;
  }

  handleFileClick(): void {
    (this.$refs.file as HTMLInputElement).click();
  }

  async handleSubmit(): Promise<void> {
    const success = await (this.$refs.form as InstanceType<typeof ValidationObserver>).validate();
    if (success) {
      await this.updateItem();
    }
  }

  async updateItem(): Promise<void> {
    this.busy = true;
    const query = `SELECT * FROM 'Models' WHERE path ='${this.properties.path}'`;
    const models = await this.$ipcInvoke<Model[]>('get-integration-models', {
      type: 'local',
      title: this.$route.params.database,
      query
    });

    this.error = '';

    models[0].name = this.properties.name;
    models[0].category = this.properties.category;

    if (this.properties.imageChanged === true) {
      try {
        const response = await this.$ipcInvoke<ImageProcessorOutput>('generate-thumbnail-image', {
          item: this.properties,
          image: this.uploadImage
        });

        models[0].image = response.imgPath;
        this.$store.commit('incrementImageRandomizer');
        this.$updateItemInDatabase(this.$route.params.database, models[0]);

        const result = await this.$ipcInvoke('get-integration-models', {
          type: 'local',
          title: this.$route.params.database
        });

        this.$store.commit('setLoadedData', result);
        this.$emit('close');
      } catch (err) {
        this.error = err.name + ': ' + err.message;
        this.properties.image = '';
        this.properties.imageChanged = false;

        models[0].image = '';

        this.$updateItemInDatabase(this.$route.params.database, models[0]);

        const result = await this.$ipcInvoke('get-integration-models', {
          type: 'local',
          title: this.$route.params.database
        });

        this.$store.commit('setLoadedData', result);
      }
    } else {
      models[0].image = this.properties.image;

      this.$updateItemInDatabase(this.$route.params.database, models[0]);

      const result = await this.$ipcInvoke('get-integration-models', {
        type: 'local',
        title: this.$route.params.database
      });

      this.$store.commit('setLoadedData', result);
      this.$emit('close');
    }
    this.busy = false;
  }
}
</script>
