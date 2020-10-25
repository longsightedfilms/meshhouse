<template>
  <div class="application__header-navigation">
    <div
      v-show="!$store.state.controls.isLoaded"
      class="progress__container"
    >
      <div class="progress-main" />
    </div>
    <button
      :title="$t('hints.navbar.addCatalog')"
      class="button button--flat button--icon-only"
      @click="showNewCatalog"
    >
      <vue-icon icon="add" />
    </button>
    <div class="breadcrumbs">
      <span
        v-if="$store.state.db.currentDB !== undefined"
        class="breadcrumb"
      >
        {{ $store.state.db.currentDB.title }}
      </span>
    </div>
    <div
      v-if="$store.state.db.currentDB !== undefined"
      class="buttons"
    >
      <button
        :title="$store.state.controls.filters.order === 'ASC'
          ? $t('hints.navbar.sortASC')
          : $t('hints.navbar.sortDESC')"
        class="button button--flat button--icon-only"
        @click="handleChangeOrder"
      >
        <vue-icon
          :icon="$store.state.controls.filters.order === 'ASC'
            ? 'sort-alpha-down'
            : 'sort-alpha-up'"
          raster
        />
      </button>
    </div>
    <div class="filter-field filter-field--search">
      <vue-icon
        class="decor"
        icon="search"
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
          raster
        />
      </button>
    </div>
    <div class="buttons">
      <vue-dropdown
        class="filters"
        :hint="$t('hints.navbar.filters')"
      >
        <template slot="button">
          <vue-icon
            icon="adjust"
            raster
          />
        </template>
        <filters-dropdown />
      </vue-dropdown>
      <vue-dropdown
        class="download"
        :class="downloadClass"
        :hint="$t('hints.navbar.downloads')"
      >
        <template slot="button">
          <vue-icon
            icon="downloads"
            raster
          />
        </template>
        <downloads-dropdown />
      </vue-dropdown>
      <vue-dropdown close-by-click>
        <template slot="button">
          <vue-icon icon="menu" />
        </template>
        <main-menu-dropdown />
      </vue-dropdown>
    </div>
  </div>
</template>

<script lang="ts">
import eventBus from '@/eventBus';
import Vue from 'vue';
import Component from 'vue-class-component';
import AddNewCatalogModal from '@/views/Modals/AddNewCatalogModal.vue';
import FiltersDropdown from '@/components/UI/Header/Dropdowns/Filters.vue';
import DownloadsDropdown from '@/components/UI/Header/Dropdowns/Downloads.vue';
import MainMenuDropdown from '@/components/UI/Header/Dropdowns/MainMenu.vue';
import { handleDatabases, findDatabaseIndex } from '@/plugins/models-db/functions';

@Component({
  components: {
    DownloadsDropdown,
    FiltersDropdown,
    MainMenuDropdown
  }
})
export default class HeaderNavigation extends Vue {
  downloadStarted = false
  downloadCompleted = false

  title: string[] = []

  get downloadClass(): string {
    return `${this.downloadStarted ? 'active' : ''} ${this.downloadCompleted ? 'completed' : ''}`;
  }

  mounted(): void {
    eventBus.on('download-started', () => {
      this.downloadStarted = true;
      setTimeout(() => {
        this.downloadStarted = false;
      }, 1000);
    });
    eventBus.on('download-completed', () => {
      this.downloadCompleted = true;
    });
  }

  showNewCatalog(): void {
    this.$modal.show(AddNewCatalogModal, {}, {
      adaptive: true,
      clickToClose: true,
      width: '100%',
      height: '100%',
    }, {
      'before-open': () => {
        this.$store.commit('setModalVisibility', true);
      },
      'before-close': () => {
        this.$store.commit('setModalVisibility', false);
      }
    });
  }

  updateItems(): void {
    eventBus.emit('filters-updated');
  }

  handleChangeOrder(): void {
    const order = this.$store.state.controls.filters.order;
    this.$store.commit('setFilterOrder', order === 'ASC' ? 'DESC' : 'ASC');
    this.updateItems();
  }

  handleSearchField(event: KeyboardEvent): void {
    this.$store.commit('setFilter', {
      field: 'name',
      value: (event.target as HTMLInputElement).value
    });
    this.updateItems();
  }

  handleSearchInput(event: KeyboardEvent): void {
    this.$store.commit('setFilter', {
      field: 'name',
      value: (event.target as HTMLInputElement).value
    });
  }

  clearSearchField(): void {
    this.$store.commit('setFilter', {
      field: 'name',
      value: ''
    });
    this.updateItems();
  }
}
</script>
