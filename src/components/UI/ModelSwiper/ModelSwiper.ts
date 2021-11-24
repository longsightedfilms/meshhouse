import { Vue, Component, Prop } from 'vue-property-decorator';
import getAwesomeSwiper from 'vue-awesome-swiper/dist/exporter';
import { Swiper as SwiperClass, Pagination, Navigation, Controller } from 'swiper/core';

SwiperClass.use([Pagination, Navigation, Controller]);

const { Swiper, SwiperSlide } = getAwesomeSwiper(SwiperClass);

@Component({
  components: {
    Swiper,
    SwiperSlide
  }
})
export default class ModelSwiper extends Vue {
  @Prop({
    required: true,
    type: Array,
    default: () => []
  }) readonly images!: string[];

  @Prop({
    required: true,
    type: Array,
    default: () => []
  }) readonly thumbnails!: string[];

  swiperOptionTop = {
    pagination: {
      el: '.swiper-pagination'
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    }
  }

  swiperOptionBottom = {
    centeredSlides: true,
    slidesPerView: 'auto',
    spaceBetween: 10,
    touchRatio: 0.2,
    slideToClickedSlide: true
  }

  mounted(): void {
    this.$nextTick(() => {
      if (this.$refs.swiperTop !== undefined && this.$refs.swiperBottom !== undefined) {
        const swiperTop = (this.$refs.swiperTop as any).$swiper;
        const swiperBottom = (this.$refs.swiperBottom as any).$swiper;
        swiperTop.controller.control = swiperBottom;
        swiperBottom.controller.control = swiperTop;
      }
    });
  }
}
