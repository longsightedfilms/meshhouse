<template>
  <header
    v-if="database !== undefined"
    :class="mainClass"
  >
    <div class="catalog-header__image">
      <img
        class="catalog-header__image-background"
        :src="catalogBackground"
      >
      <div class="catalog-header__logo">
        <img
          v-if="database.icon !== ''"
          class="catalog-header__logo-image"
          :src="catalogIcon"
        >
        <div
          v-else
          class="avatar"
          :style="avatarStyle(database)"
        >
          <p
            :class="avatarTextColorClass"
          >
            {{ avatarTextPreview }}
          </p>
        </div>
        <p
          v-if="database.localDB"
          class="catalog-header__logo-title"
        >
          {{ database.title }}
        </p>
      </div>
    </div>
    <div class="catalog-header__info">
      <div class="catalog-header__info-logo">
        <img
          v-if="database.icon !== ''"
          class="catalog-header__info-logo-image"
          :src="catalogIcon"
        >
        <div
          v-else
          class="avatar"
          :style="avatarStyle(database)"
        >
          <p
            :class="avatarTextColorClass"
          >
            {{ avatarTextPreview }}
          </p>
        </div>
        <p
          v-if="database.localDB"
          class="catalog-header__info-logo-title"
        >
          {{ database.title }}
        </p>
      </div>
      <span
        v-if="!database.localDB && $store.state.controls.isOffline"
        class="badge"
      >
        OFFLINE
      </span>
      <div class="catalog-header__info-block">
        <vue-icon
          icon="stack"
          raster
        />
        <p>{{ $formatSize(database.totalsize) }}</p>
      </div>
      <div
        v-if="!database.localDB"
        class="catalog-header__info-block"
      >
        <button
          :title="$t('hints.navbar.refreshCatalog')"
          class="button button--flat"
          @click="refreshRemoteCatalog"
        >
          <vue-icon
            icon="update"
            raster
          />
        </button>
      </div>
      <div
        v-if="database.localDB"
        class="catalog-header__info-block"
      >
        <button
          :title="$t('modals.editCatalog.title')"
          class="button button--flat"
          @click="openEditCatalog"
        >
          <vue-icon
            icon="edit"
          />
        </button>
      </div>
    </div>
  </header>
  <header
    v-else
    class="catalog-header"
  />
</template>

<script lang="ts">
import EventBus from '@/eventBus';
import Vue from 'vue';
import Component from 'vue-class-component';
import { colorContrast } from '@/plugins/models-db/functions';
import { getLocalLink } from '@/functions/image';
import EditCatalogModal from '@/views/Modals/Edit/EditCatalogModal.vue';

@Component({
  props: {
    database: {
      type: Object,
      required: false
    },
    sample: {
      type: Boolean,
      required: false,
      default: false
    }
  }
})
export default class CatalogHeader extends Vue {
  get mainClass(): string {
    return `catalog-header ${!this.$props.sample
    && this.$store.state.settings.minimalisticHeaders
      ? 'catalog-header--minimal'
      : ''}`;
  }

  get imageLink(): string {
    return getLocalLink(this.$props.database.background);
  }

  get avatarTextColorClass(): string {
    return colorContrast(this.$props.database.color);
  }

  get avatarTextPreview(): string {
    return Array.from(this.$props.database.title).slice(0, 1).join('').toUpperCase();
  }

  avatarStyle(navlink: DatabaseItem): object {
    return navlink.localDB ? { backgroundColor: navlink.color } : {};
  }

  get catalogBackground(): string {
    if (this.$props.database.background !== '') {
      if (!this.$props.database.background.includes('@/')) {
        return this.$forceReloadImage(this.imageLink);
      } else {
        return `/assets/integrations/backgrounds/${this.$props.database.url}.webp`;
      }
    } else {
      return "data:image/svg+xml,%3Csvg width='2560' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3ClinearGradient id='lg'%3E%3Cstop offset='0%25' stop-color='%232db8e7'/%3E%3Cstop offset='100%25' stop-color='%233081e2'/%3E%3C/linearGradient%3E%3Crect x='2' y='2' width='2556' height='396' style='fill:url(%23lg);stroke:%23555555;stroke-width:2'/%3E%3Ctext x='50%25' y='50%25' font-size='18' text-anchor='middle' alignment-baseline='middle' font-family='monospace, sans-serif' fill='%23555555'%3E2560&%23215;400%3C/text%3E%3C/svg%3E";
    }
  }

  get catalogIcon(): string {
    if (this.$props.database.icon !== undefined) {
      if (!this.$props.database.icon.includes('@/')) {
        return this.$forceReloadImage(this.$props.database.icon);
      } else {
        return `/assets/integrations/wide/${this.$props.database.url}.svg`;
      }
    } else {
      return '';
    }
  }

  openEditCatalog(): void {
    this.$modal.show(EditCatalogModal, {}, {
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

  refreshRemoteCatalog(): void {
    EventBus.emit('filters-updated');
  }
}
</script>
