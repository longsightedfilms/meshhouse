<template>
  <fragment>
    <button
      class="button button--grid"
      @click="toggleVisibility"
    >
      <span>Категории</span>
      <div class="icon__wrapper">
        <vue-icon
          :style="flipIcon"
          icon="caret-back"
          inverted
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
      <div
        v-if="$route.params.category !== undefined"
        class="category"
        tabindex="0"
        @dblclick="getParentLevelLink"
      >
        <div class="category__image">
          <svg class="image" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 200"><g data-name="Layer 2"><g data-name="File icons"><path fill="#006fcc" stroke="#299eff" stroke-miterlimit="10" stroke-width="8" d="M4 196h248V4H133l-32 33H4v159z"/><path fill="#299eff" d="M179.75 73.04l-34.18 82.46h-10.4l34.02-82.46z"/><g fill="#299eff"><path d="M98.44 156.1a7 7 0 01-4.98-1.93 6.11 6.11 0 01-2.05-4.62 6.25 6.25 0 012.05-4.68 6.96 6.96 0 014.98-1.96 7.1 7.1 0 015.05 1.96 6.22 6.22 0 012.08 4.68 6.08 6.08 0 01-2.08 4.62 7.16 7.16 0 01-5.05 1.93zM122.56 156.1a7 7 0 01-4.98-1.93 6.11 6.11 0 01-2.05-4.62 6.25 6.25 0 012.05-4.68 6.96 6.96 0 014.98-1.96 7.1 7.1 0 015.05 1.96 6.22 6.22 0 012.08 4.68 6.08 6.08 0 01-2.08 4.62 7.16 7.16 0 01-5.05 1.93z"/></g></g></g></svg>
        </div>
        <p class="category__title">
          На уровень выше
        </p>
      </div>
      <div
        v-for="category in $store.state.db.categories"
        :key="`${category.id}-${category.slug}`"
        class="category"
        tabindex="0"
        @dblclick="getRouterLink(category.id)"
      >
        <div class="category__image">
          <svg class="image" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 200"><g data-name="Layer 2"><g stroke="#299eff" stroke-miterlimit="10" data-name="File icons"><path fill="#006fcc" stroke-width="8" d="M4 196h248V4H133l-32 33H4v159z"/><g fill="none" stroke-width="5"><path d="M83.48 89.55h69.83v69.83H83.48z"/><path d="M104.43 68.6h69.83v69.83h-69.83zM103.61 67.81L82.66 88.76M174.26 68.6l-20.95 20.95M154.14 160.19l20.95-20.95M83.48 158.68l20.95-20.95"/></g></g></g></svg>
        </div>
        <p class="category__title">
          {{ category.name }}
        </p>
      </div>
      <div
        class="category"
        tabindex="0"
        @dblclick="showModal"
      >
        <div class="category__image">
          <svg class="image" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 200"><g data-name="Layer 2"><g stroke="#299eff" stroke-miterlimit="10" stroke-width="8" data-name="File icons"><path fill="#006fcc" d="M4 196h248V4H133l-32 33H4v159z"/><g fill="none"><path d="M128 158V68M173 113H83"/></g></g></g></svg>
        </div>
        <p class="category__title">
          Создать новую категорию
        </p>
      </div>
    </div>
  </fragment>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Fragment } from 'vue-fragment'
import Integrations from '@/plugins/models-db/integrations/main'
import AddCategoryModal from '@/views/Modals/AddCategoryModal.vue'

@Component({
  components: {
    Fragment
  },
})
export default class CategoriesGrid extends Vue {
  getRouterLink(slug?: number): void {
    this.$store.commit('setFilter', {
      field: 'category',
      value: slug !== undefined ? slug : ''
    })
    this.$router.push({
      path: `/db/local/${this.$route.params.database}${slug !== undefined ? `/${slug}` : ''}`
    })
  }

  async getParentLevelLink(): Promise<void> {
    const query = `SELECT * FROM 'categories'
    WHERE id = ${this.$route.params.category}`

    const db = new Integrations.local(this.$route.params.database)
    const categories = await db.fetchCategories(query)

    const parentId = categories[0].parentId

    this.$store.commit('setFilter', {
      field: 'category',
      value: parentId
    })
    this.$router.push({
      path: `/db/local/${this.$route.params.database}${parentId !== -1 ? `/${parentId}` : ''}`
    })
  }


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

  showModal(): void {
    this.$modal.show(AddCategoryModal, {}, {
      clickToClose: true,
      height: 'auto'
    })
  }

  onScroll(event: any): void {
    (this.$refs.categoryGrid as HTMLElement).scrollLeft -= event.wheelDelta
    event.preventDefault()
  }
}
</script>
