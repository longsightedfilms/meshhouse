<template>
  <fragment>
    <button
      class="button button--grid"
      @click="toggleVisibility"
    >
      <span>
        {{ $t('views.catalog.categories.title') }}
      </span>
      <div class="icon__wrapper">
        <vue-icon
          :style="flipIcon"
          icon="caret-back"
          raster
        />
      </div>
    </button>
    <div
      v-show="$store.state.controls.categoriesVisible"
      ref="categoryGrid"
      class="categories-grid"
      @mousewheel="onScroll"
    >
      <category-card
        v-if="$route.params.category !== undefined"
        type="parent"
      />
      <category-card
        v-for="category in $store.state.db.categories"
        :key="`${category.id}-${category.slug}`"
        :item="category"
      />
      <category-card type="new" />
    </div>
  </fragment>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Fragment } from 'vue-fragment'
import CategoryCard from '@/components/UI/Card/CategoryCard.vue'

@Component({
  components: {
    CategoryCard,
    Fragment
  },
})
export default class CategoriesGrid extends Vue {
  get flipIcon(): object {
    const { categoriesVisible } = this.$store.state.controls
    return !categoriesVisible ? {
      transform: `rotate(90deg) translateX(3px)`
    } : {
      transform: `rotate(-90deg)`
    }
  }

  toggleVisibility(): void {
    this.$store.commit('setCategoriesVisibility', !this.$store.state.controls.categoriesVisible)
    this.$settingsSet('categoriesVisible', this.$store.state.controls.categoriesVisible)
    this.$parent.$parent.$forceUpdate()
  }

  onScroll(event: any): void {
    (this.$refs.categoryGrid as HTMLElement).scrollLeft -= event.wheelDelta
    event.preventDefault()
  }

}
</script>
