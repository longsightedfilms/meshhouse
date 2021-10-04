<template>
  <div>
    <div class="modal modal--model-info">
      <div class="modal_header">
        <h1>{{ model.name }}</h1>
        <div class="catalog-header__info-block">
          <vue-icon
            icon="stack"
            raster
          />
          <p>{{ model.size }}</p>
        </div>
        <button
          class="button button--flat button--icon-only"
          @click="handleFavorites"
        >
          <span
            v-if="isCurrentFavorite"
            class="button__notify"
          />
          <vue-icon
            icon="bookmark"
            raster
          />
        </button>
        <button
          v-if="!model.installed"
          class="button button--flat"
          @click="installModel()"
        >
          <vue-icon icon="download-from-cloud" />
          {{ $t('context.model.install') }}
        </button>
        <button
          v-if="model.installed"
          class="button button--flat"
          @click="installOtherFileModel()"
        >
          <vue-icon icon="download-from-cloud" />
          {{ $t('context.model.update') }}
        </button>
        <button
          v-if="model.installed"
          class="button button--flat"
          @click="deleteModel()"
        >
          <vue-icon icon="recycle-bin" />
          {{ $t('context.model.delete') }}
        </button>
      </div>
      <div class="modal_content">
        <div class="model-info__image">
          <swiper :options="swiperOptions">
            <swiper-slide
              v-for="(image, idx) in model.images || []"
              :key="idx"
            >
              <img
                class="slide-image"
                :src="image"
                :alt="model.name"
                loading="lazy"
              >
              <img
                class="slide-image--background"
                :src="image"
                :alt="model.name"
                loading="lazy"
              >
            </swiper-slide>
            <div
              slot="button-prev"
              class="swiper-button-prev"
            >
              <vue-icon
                icon="caret-back"
                raster
              />
            </div>
            <div
              slot="button-next"
              class="swiper-button-next"
            >
              <vue-icon
                icon="caret-forward"
                raster
              />
            </div>
            <div
              slot="pagination"
              class="swiper-pagination"
            />
          </swiper>
        </div>
        <h1>{{ $t('modals.model.description') }}</h1>
        <div
          class="model-info__description"
          @click="handleClicks"
          v-html="$sanitizeHTML(model.description || '')"
        />
        <div class="commentaries">
          <h1>{{ $t('modals.model.comments') }}</h1>
          <div
            v-for="(comment, idx) in model.comments || []"
            :key="`comment-${idx}`"
            class="commentary"
          >
            <div class="commentary__info">
              <b class="commentary__username">
                {{ comment.username }}
              </b>
              <p class="commentary__date">
                {{ $formatDateRelative(comment.date) }}
              </p>
              <img
                :src="comment.avatar"
                :alt="comment.username"
                class="commentary__avatar"
                loading="lazy"
              >
            </div>
            <p class="commentary__message">
              {{ comment.message }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import eventBus from '@/eventBus';
import { Vue, Component } from 'vue-property-decorator';
import getAwesomeSwiper from 'vue-awesome-swiper/dist/exporter';
import FileSelectorModal from '@/views/Modals/FileSelectorModal.vue';
import { Swiper as SwiperClass, Pagination, Navigation } from 'swiper/core';
import { Route } from 'vue-router';

SwiperClass.use([Pagination, Navigation]);

const { Swiper, SwiperSlide } = getAwesomeSwiper(SwiperClass);

@Component<ModelPage>({
  components: {
    Swiper,
    SwiperSlide
  },
  async beforeRouteEnter(to: Route, from: Route, next: Function) {
    const isFavorite = await window.ipc.invoke('is-in-favorite', {
      database: to.params.database,
      remoteId: to.params.id
    });

    const data = await window.ipc.invoke('get-single-model-integration', {
      type: 'remote',
      title: to.params.database,
      item: {
        id: to.params.id
      }
    });

    next((vm: ModelPage) => {
      vm.isCurrentFavorite = isFavorite;
      vm.model = data;
    });
  },
  metaInfo() {
    return {
      title: this.model.name ?? ''
    };
  }
})
export default class ModelPage extends Vue {
  swiperOptions: object = {
    pagination: {
      el: '.swiper-pagination'
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    }
  }

  isCurrentFavorite = false

  model: Model = {
    id: -1,
    remoteId: -1,
    name: '',
    extension: '',
    path: '',
    category: '',
    image: '',
    images: []
  }

  mounted(): void {
    eventBus.on('multiple-links', (() => {
      this.$modal.show(FileSelectorModal, { item: this.model }, {
        clickToClose: true,
        height: 'auto'
      });
    }));
  }

  beforeDestroy(): void {
    eventBus.all.clear();
  }

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
      thumbnail: this.model.images ? this.model.images[0] : this.model.image ?? '',
      title: this.model.name
    };

    try {
      const method = this.isCurrentFavorite
        ? 'remove-favorite'
        : 'add-favorite';

      await this.$ipcInvoke(method, payload);
      this.isCurrentFavorite = !this.isCurrentFavorite;
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
      this.$openItem(target.href);
    }
  }
}
</script>
