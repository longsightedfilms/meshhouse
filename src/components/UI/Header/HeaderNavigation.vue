<template>
  <div class="application__header-navigation">
    <div class="buttons">
      <button @click="showNewCatalog">
        <font-awesome-icon icon="plus" />
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
      <button
        :class="$store.state.controls.filters.order === 'ASC' ? 'active' : ''"
        @click="handleChangeOrder('ASC')"
      >
        <font-awesome-icon icon="sort-alpha-up" />
      </button>
      <button
        :class="$store.state.controls.filters.order === 'DESC' ? 'active' : ''"
        @click="handleChangeOrder('DESC')"
      >
        <font-awesome-icon icon="sort-alpha-down-alt" />
      </button>
    </div>
    <div class="filter-field">
      <input
        type="text"
        class="input"
        :value="$store.state.controls.filters.where.name"
        :placeholder="$t('common.labels.search')"
        @change="handleSearchField"
      >
    </div>
    <div class="buttons">
      <button>
        <font-awesome-icon icon="download" />
      </button>
      <button @click="showSettings">
        <font-awesome-icon icon="cog" />
      </button>
      <button @click="showAbout">
        <font-awesome-icon icon="question-circle" />
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

import Integrations from '@/plugins/models-db/integrations/main'

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

  handleChangeOrder(order: string): void {
    this.$store.commit('setFilterOrder', order)

    const dbType = this.$route.meta.localDB ? 'local' : this.$route.params.database
    let db

    if (dbType === 'local') {
      db = new Integrations.local(this.$route.params.database)
    } else {
      db = new Integrations[dbType]()
    }

    db.fetchItemsFromDatabase().then((result: Model[]): void => {
      this.$store.commit('setLoadedData', result)
    })
  }

  handleSearchField(event: KeyboardEvent): void {
    this.$store.commit('setFilter', {
      field: 'name',
      value: (event.target as HTMLInputElement).value
    })

    const dbType = this.$route.meta.localDB ? 'local' : this.$route.params.database
    let db

    if (dbType === 'local') {
      db = new Integrations.local(this.$route.params.database)
    }

    db.fetchItemsFromDatabase().then((result: Model[]): void => {
      this.$store.commit('setLoadedData', result)
    })
  }
}
</script>
