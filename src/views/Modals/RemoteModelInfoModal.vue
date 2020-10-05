<template>
  <div v-bar>
    <div>
      <div class="modal modal--model-info">
        <div class="modal_header">
          <button
            class="back"
            @click="back"
          >
            <svg
              width="15"
              height="12"
              viewBox="0 0 15 12"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                y2="6"
                x2="1"
                y1="6"
                x1="15"
                fill="none"
              />
              <line
                y2="0"
                x2="6"
                y1="6"
                x1="0"
                fill="none"
              />
              <line
                y2="12"
                x2="6"
                y1="6"
                x1="0"
                fill="none"
              />
            </svg>
          </button>
          <h1>{{ $store.state.controls.properties.title }}</h1>
          <div class="catalog-header__info-block">
            <vue-icon
              icon="stack"
              raster
            />
            <p>{{ $store.state.controls.properties.size }}</p>
          </div>
          <button
            v-if="!$store.state.controls.properties.installed"
            class="button button--flat"
            @click="installModel()"
          >
            <vue-icon icon="download-from-cloud" />
            {{ $t('context.model.install') }}
          </button>
          <button
            v-if="$store.state.controls.properties.installed"
            class="button button--flat"
            @click="installOtherFileModel()"
          >
            <vue-icon icon="download-from-cloud" />
            {{ $t('context.model.update') }}
          </button>
          <button
            v-if="$store.state.controls.properties.installed"
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
                v-for="(image, idx) in $store.state.controls.properties.images"
                :key="idx"
              >
                <div class="outer">
                  <img
                    :src="image"
                    :alt="$store.state.controls.properties.title"
                  >
                </div>
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
          <div v-html="$sanitizeHTML($store.state.controls.properties.description)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Integrations from '@/plugins/models-db/integrations/main';
import getAwesomeSwiper from 'vue-awesome-swiper/dist/exporter';
import { Swiper as SwiperClass, Pagination, Navigation } from 'swiper/core';

SwiperClass.use([Pagination, Navigation]);

const { Swiper, SwiperSlide } = getAwesomeSwiper(SwiperClass);

@Component({
  components: {
    Swiper,
    SwiperSlide
  }
})
export default class RemoteModelInfoModal extends Vue {
  swiperOptions: object = {
    pagination: {
      el: '.swiper-pagination'
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    }
  }

  back(): void {
    this.$modal.hideAll();
    this.$store.commit('setModalVisibility', false);
  }

  async installModel(): Promise<void> {
    this.back();

    const item = this.$store.state.controls.properties;
    const db = new Integrations[this.$route.params.database]();
    await db.downloadHandle(item);
  }

  async installOtherFileModel(): Promise<void> {
    this.back();

    const item = this.$store.state.controls.properties;
    const db = new Integrations[this.$route.params.database]();
    await db.updateHandle(item);
  }

  async deleteModel(): Promise<void> {
    this.back();

    const item = this.$store.state.controls.properties;
    const db = new Integrations[this.$route.params.database]();
    await db.deleteItem(item);
  }
}
</script>
