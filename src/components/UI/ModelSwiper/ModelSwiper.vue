<template>
  <div class="model-swiper">
    <swiper
      ref="swiperTop"
      class="model-swiper__top"
      :options="swiperOptionTop"
    >
      <swiper-slide
        v-for="(image, idx) in images"
        :key="idx"
      >
        <img
          class="slide-image"
          :src="image"
          loading="lazy"
        >
        <img
          class="slide-image--background"
          :src="image"
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

    <swiper
      ref="swiperBottom"
      class="model-swiper__bottom"
      :options="swiperOptionBottom"
    >
      <swiper-slide
        v-for="(image, idx) in thumbnails"
        :key="idx"
      >
        <img
          class="slide-image"
          :src="image"
        >
      </swiper-slide>
    </swiper>
  </div>
</template>
<style src="./ModelSwiper.sass" lang="sass"></style>
<script src="./ModelSwiper.ts" lang="ts"></script>
