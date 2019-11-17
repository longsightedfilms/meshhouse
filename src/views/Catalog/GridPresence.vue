<template>
  <v-container>
    <v-row>
      <v-col
        v-for="item in displayedModels"
        :key="item.name + item.index"
        xl="3"
        lg="4"
        cols="6"
      >
        <v-lazy min-height="400">
          <grid-card :item="item" />
        </v-lazy>
      </v-col>
      <v-col cols="12">
        <v-pagination
          v-model="page"
          class="large"
          color="primary"
          total-visible="10"
          :value="page"
          :length="computePaginationLength"
        />
      </v-col>
      <edit-properties-modal />
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import EditPropertiesModal from '@/views/Modals/EditPropertiesModal.vue'
import GridCard from '@/components/Catalog/GridCard.vue'
import { Model } from '@/plugins/models-db/interfaces'

@Component({
  components: {
    EditPropertiesModal,
    GridCard
  }
})

export default class GridPresence extends Vue {
  page = 1

  get computePaginationLength(): number {
    const len = this.$store.state.pageData.length
    return Math.ceil(len / this.itemsPerPage)
  }

  get displayedModels(): Model[] {
    const page = this.page
    const from = (page * this.itemsPerPage) - this.itemsPerPage
    const to = (page * this.itemsPerPage)
    return this.$store.state.pageData.slice(from, to)
  }

  get itemsPerPage (): number {
    switch (this.$vuetify.breakpoint.name) {
      case 'xs': return 18
      case 'sm': return 18
      case 'md': return 18
      case 'lg': return 18
      case 'xl': return 20
      default: return 18
    }
  }
}
</script>