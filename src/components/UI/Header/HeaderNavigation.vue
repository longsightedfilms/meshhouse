<template>
  <div class="application__header-navigation">
    <div class="buttons">
      <button @click="showNewCatalog">
        <vue-icon
          icon="add"
          inverted
        />
      </button>
    </div>
    <div class="breadcrumbs">
      <span
        v-if="selectedDB !== undefined"
        class="breadcrumb"
      >
        {{ selectedDB.title }}
      </span>
    </div>
    <div class="buttons">
      <button @click="handleChangeOrder">
        <vue-icon
          :icon="$store.state.controls.filters.order === 'ASC'
            ? 'sort-alpha-down'
            : 'sort-alpha-up'"
          inverted
          raster
        />
      </button>
    </div>
    <div class="filter-field filter-field--search">
      <vue-icon
        class="decor"
        icon="search"
        inverted
      />
      <input
        type="text"
        class="input"
        size="1"
        :value="$store.state.controls.filters.where.name"
        :placeholder="$t('common.labels.search')"
        @input="handleSearchInput"
        @change="handleSearchField"
      >
      <button
        v-if="$store.state.controls.filters.where.name !== ''"
        class="clear"
        @click="clearSearchField"
      >
        <vue-icon
          icon="clear"
          inverted
          raster
        />
      </button>
    </div>
    <div class="buttons">
      <button>
        <vue-icon
          icon="downloads"
          inverted
          raster
        />
      </button>
      <button @click="showSettings">
        <vue-icon
          icon="settings"
          inverted
        />
      </button>
      <button @click="showAbout">
        <vue-icon
          icon="info"
          inverted
        />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import SettingsModal from '@/views/Modals/SettingsModal.vue'
import AboutProgramModal from '@/views/Modals/AboutProgramModal.vue'
import AddNewCatalogModal from '@/views/Modals/AddNewCatalogModal.vue'
import { remote } from 'electron'
import { handleDatabases, findDatabaseIndex } from '@/plugins/models-db/functions'

@Component({})
export default class HeaderNavigation extends Vue {
  get selectedDB(): DatabaseItem {
    return this.$store.state.db.databases.find((db: DatabaseItem) => db.url == this.$route.params.database)
  }

  showSettings(): void {
    this.$modal.show(SettingsModal, {}, {
      adaptive: true,
      clickToClose: true,
      width: '1024px',
      height: 'auto',
    })
  }

  showAbout(): void {
    this.$modal.show(AboutProgramModal, {}, {
      clickToClose: true,
      height: 'auto'
    })
  }

  showNewCatalog(): void {
    this.$modal.show(AddNewCatalogModal, {}, {
      clickToClose: true,
      width: '800px',
      height: 'auto'
    })
  }

  updateItems(): void {
    const db = handleDatabases(this.$route.params.database)

    db.fetchItemsFromDatabase().then((result: Model[]): void => {
      this.$store.commit('setLoadedData', result)
    })
  }

  handleChangeOrder(): void {
    const order = this.$store.state.controls.filters.order
    this.$store.commit('setFilterOrder', order === 'ASC' ? 'DESC' : 'ASC')
    this.updateItems()
  }

  handleSearchField(event: KeyboardEvent): void {
    this.$store.commit('setFilter', {
      field: 'name',
      value: (event.target as HTMLInputElement).value
    })
    this.updateItems()
  }

  handleSearchInput(event: KeyboardEvent): void {
    this.$store.commit('setFilter', {
      field: 'name',
      value: (event.target as HTMLInputElement).value
    })
  }

  clearSearchField(): void {
    this.$store.commit('setFilter', {
      field: 'name',
      value: ''
    })
    this.updateItems()
  }
}
</script>
