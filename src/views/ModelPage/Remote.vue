<template>
  <main class="layout layout--model">
    <main class="layout__content">
      <header class="model-header">
        <h1>{{ model.title }}</h1>

        <button
          class="button button--flat button--icon-only"
          @click="handleFavorites"
        >
          <span
            v-if="favorite"
            class="button__notify"
          />
          <vue-icon
            icon="bookmark"
            raster
          />
        </button>
      </header>

      <model-swiper
        :images="model.images"
        :thumbnails="model.image_thumbs"
      />
      <article class="model-description">
        <h1 class="heading">
          {{ $t('modals.model.description') }}
        </h1>
        <div
          class="description"
          @click="handleClicks"
          v-html="$sanitizeHTML(model.description || '')"
        />
      </article>
    </main>
    <model-sidebar-remote
      :model="model"
      @install="installModel"
      @install-other="installOtherFileModel"
      @delete="deleteModel"
    />
  </main>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import ModelSwiper from '@/components/UI/ModelSwiper/ModelSwiper.vue';
import ModelSidebarRemote from '@/components/UI/ModelSidebar/ModelSidebarRemote.vue';

@Component<Remote>({
  components: {
    ModelSwiper,
    ModelSidebarRemote
  }
})
export default class Remote extends Vue {
  @Prop({ type: Object, required: true }) model!: RemoteModel
  @Prop({ type: Boolean, required: true, default: false }) favorite!: boolean

  async installModel(): Promise<void> {
    this.$router.back();

    await this.$ipcInvoke('download-handle-integration', {
      type: 'remote',
      title: this.$route.params.database,
      item: this.model
    });
  }

  async installOtherFileModel(): Promise<void> {
    this.$router.back();

    await this.$ipcInvoke('update-handle-integration', {
      type: 'remote',
      title: this.$route.params.database,
      item: this.model
    });
  }

  async deleteModel(): Promise<void> {
    await this.$ipcInvoke('delete-item-integration', {
      type: 'remote',
      title: this.$route.params.database,
      item: this.model
    });
  }

  async handleFavorites(): Promise<void> {
    const payload = {
      database: this.$route.params.database,
      remoteId: this.$route.params.id,
      thumbnail: this.model.thumbnail,
      title: this.model.title
    };

    try {
      const method = this.favorite
        ? 'remove-favorite'
        : 'add-favorite';

      await this.$ipcInvoke(method, payload);
      this.$emit('update:favorite', !this.favorite);
    } catch (err) {
      console.error(err);
    }
  }

  handleClicks(event: any): void {
    event.preventDefault();

    let { target } = event;
    while (target && target.tagName !== 'A') {
      target = target.parentNode;
    }

    if (target && target.href) {
      this.handleRedirectToModelPage(target.href);
    }
  }

  handleRedirectToModelPage(href: string): void {
    let isIntegration = false;
    console.log(href);

    const MODEL_PAGES = [
      'https://sfmlab.com/project/',
      'https://smutba.se/project/',
      'https://open3dlab.com/project/'
    ];

    const INTEGRATION_NAMES = [
      'sfmlab',
      'smutbase',
      'open3dlab'
    ];

    MODEL_PAGES.map((page, idx) => {
      if (href.startsWith(page)) {
        const id = href.substring(page.length).replace('/', '');
        if (id) {
          isIntegration = true;
          this.$router.push(`/model/${INTEGRATION_NAMES[idx]}/${id}`);
        }
      }
    });

    if (!isIntegration) {
      this.$openItem(href);
    }
  }
}
</script>
