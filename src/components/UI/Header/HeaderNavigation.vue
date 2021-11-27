<template>
  <div class="application__header-navigation">
    <button
      :title="$t('views.catalog.library.title')"
      class="button button--flat button--icon-only"
      @click="$router.push('/library')"
    >
      <vue-icon icon="home" />
    </button>
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
        :title="$store.state.filters.order === 'ASC'
          ? $t('hints.navbar.sortASC')
          : $t('hints.navbar.sortDESC')"
        class="button button--flat button--icon-only"
        @click="handleChangeOrder"
      >
        <vue-icon
          :icon="$store.state.filters.order === 'ASC'
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
        :value="$store.state.filters.search"
        :placeholder="$t('common.labels.search')"
        @input="handleSearchInput"
        @change="handleSearchField"
      >
      <button
        v-if="$store.state.filters.search !== ''"
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
      <div class="dropdown">
        <button
          :title="$t('views.favorites.title')"
          class="button button--flat button--icon-only"
          @click="$router.push('/favorites')"
        >
          <vue-icon
            icon="bookmarks"
            raster
          />
        </button>
      </div>
      <vue-dropdown
        class="download"
        :class="downloadClass"
        :hint="$t('hints.navbar.downloads')"
        :notify="$store.state.downloads.started || $store.state.downloads.finished"
        @click="clearDownloadClass"
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
import FiltersDropdown from '@/components/UI/Header/Dropdowns/Filters.vue';
import DownloadsDropdown from '@/components/UI/Header/Dropdowns/Downloads.vue';
import MainMenuDropdown from '@/components/UI/Header/Dropdowns/MainMenu.vue';

@Component({
  components: {
    DownloadsDropdown,
    FiltersDropdown,
    MainMenuDropdown
  }
})
export default class HeaderNavigation extends Vue {
  title: string[] = []

  get downloadClass(): string {
    return `${this.$store.state.downloads.completed ? 'completed' : ''}`;
  }

  showNewCatalog(): void {
    this.$modal.show(this.$modal_AddNewCatalogModal, {}, {
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

  clearDownloadClass(): void {
    this.$store.commit('setStarted', false);
    this.$store.commit('setCompleted', false);
  }

  handleChangeOrder(): void {
    const order = this.$store.state.filters.order;
    this.$store.commit('setFilterOrder', order === 'ASC' ? 'DESC' : 'ASC');
    eventBus.emit('filters-updated');
  }

  handleSearchField(event: KeyboardEvent): void {
    this.$store.commit('setFilter', {
      field: 'search',
      value: (event.target as HTMLInputElement).value
    });
    eventBus.emit('filters-updated');
  }

  handleSearchInput(event: KeyboardEvent): void {
    this.$store.commit('setFilter', {
      field: 'search',
      value: (event.target as HTMLInputElement).value
    });
  }

  clearSearchField(): void {
    this.$store.commit('setFilter', {
      field: 'search',
      value: ''
    });
    eventBus.emit('filters-updated');
  }
}
</script>
