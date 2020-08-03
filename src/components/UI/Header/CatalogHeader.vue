<template>
  <header
    v-if="$store.state.db.currentDB !== undefined"
    class="catalog-header"
  >
    <div class="catalog-header__image">
      <img
        class="catalog-header__image-background"
        :style="blur"
        :src="catalogBackground"
      >
      <div class="catalog-header__logo">
        <img
          v-if="$store.state.db.currentDB.icon !== ''"
          class="catalog-header__logo-image"
          :src="catalogIcon"
        >
        <div
          v-else
          class="avatar"
          :style="avatarStyle($store.state.db.currentDB)"
        >
          <p
            :class="avatarTextColorClass"
          >
            {{ avatarTextPreview }}
          </p>
        </div>
        <p
          v-if="$store.state.db.currentDB.localDB"
          class="catalog-header__logo-title"
        >
          {{ $store.state.db.currentDB.title }}
        </p>
      </div>
    </div>
    <div class="catalog-header__info">
      <div class="catalog-header__info-block">
        <vue-icon
          icon="stack"
          raster
        />
        <p>{{ $formatSize($store.state.db.currentDB.totalsize) }}</p>
      </div>
      <div
        v-if="$store.state.db.currentDB.localDB"
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
import Vue from 'vue';
import Component from 'vue-class-component';
import { colorContrast } from '@/plugins/models-db/functions';
import EditCatalogModal from '@/views/Modals/Edit/EditCatalogModal.vue';

@Component({
  props: {
    database: {
      type: Object,
      required: false
    }
  }
})
export default class CatalogHeader extends Vue {
  blur = 'filter: blur(0px); transform: scale(1.0);'

  get avatarTextColorClass(): string {
    return colorContrast(this.$store.state.db.currentDB.color);
  }

  get avatarTextPreview(): string {
    return Array.from(this.$store.state.db.currentDB.title).slice(0, 1).join('').toUpperCase();
  }

  avatarStyle(navlink: DatabaseItem): object {
    return navlink.localDB ? { backgroundColor: navlink.color } : {};
  }

  get catalogBackground(): string {
    if (this.$store.state.db.currentDB.background !== '') {
      if (!this.$store.state.db.currentDB.background.includes('@/')) {
        return this.$forceReloadImage(this.$store.state.db.currentDB.background);
      } else {
        return `/assets/integrations/backgrounds/${this.$store.state.db.currentDB.url}.webp`;
      }
    } else {
      return "data:image/svg+xml,%3Csvg width='2560' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3ClinearGradient id='lg'%3E%3Cstop offset='0%25' stop-color='%232db8e7'/%3E%3Cstop offset='100%25' stop-color='%233081e2'/%3E%3C/linearGradient%3E%3Crect x='2' y='2' width='2556' height='396' style='fill:url(%23lg);stroke:%23555555;stroke-width:2'/%3E%3Ctext x='50%25' y='50%25' font-size='18' text-anchor='middle' alignment-baseline='middle' font-family='monospace, sans-serif' fill='%23555555'%3E2560&%23215;400%3C/text%3E%3C/svg%3E";
    }
  }

  get catalogIcon(): string {
    if (this.$store.state.db.currentDB.icon !== undefined) {
      if (!this.$store.state.db.currentDB.icon.includes('@/')) {
        return this.$forceReloadImage(this.$store.state.db.currentDB.icon);
      } else {
        return `/assets/integrations/wide/${this.$store.state.db.currentDB.url}.svg`;
      }
    } else {
      return '';
    }
  }

  mounted(): void {
    const element = (this as any).$root.$children[0].$refs.inner;
    element.addEventListener('scroll', () => {
      this.dynamicBlur(element);
    }, { passive: true });
  }

  beforeDestroy(): void {
    const element = (this as any).$root.$children[0].$refs.inner;
    element.removeEventListener('scroll', () => {
      this.dynamicBlur(element);
    }, { passive: true });
  }

  dynamicBlur(element: HTMLElement): void {
    if (element.scrollTop >= 400) {
      this.blur = 'filter: blur(20px); transform: scale(1.09);';
    } else {
      this.blur = `filter: blur(${0 + (element.scrollTop / 20)}px); transform: scale(${1 + (element.scrollTop / 5000)})`;
    }
  }

  openEditCatalog(): void {
    this.$modal.show(EditCatalogModal, {}, {
      clickToClose: true,
      width: '1024px',
      height: 'auto'
    });
  }
}
</script>
