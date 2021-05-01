<template>
  <button
    v-if="!isAddButton"
    class="library__entry"
    :class="database.disabled ? 'library__entry--disabled' : ''"
    @dblclick="onDoubleClick"
    @contextmenu="(e) => $emit('contextmenu', e)"
  >
    <img
      class="background"
      :src="catalogBackground"
    >
    <div class="content">
      <div class="logo">
        <img
          v-if="database.icon !== ''"
          class="logo__image"
          :src="catalogIcon"
        >
        <div
          v-else
          class="logo__avatar"
          :style="avatarStyle(database)"
        >
          <p
            :class="avatarTextColorClass"
          >
            {{ avatarTextPreview }}
          </p>
        </div>
        <p class="logo__title">
          {{ database.title }}
        </p>
      </div>
      <p class="count">
        {{ $tc('views.catalog.sidebar.model', database.count) }}
        <span class="badge">
          {{ $formatSize(database.totalsize) }}
        </span>
      </p>
    </div>
  </button>
  <button
    v-else
    class="library__entry"
    @dblclick="showNewCatalog"
  >
    <img
      class="background"
      src="#"
    >
    <div class="content">
      <div class="logo">
        <vue-icon
          class="logo__image"
          icon="add"
        />
        <p class="logo__title">
          {{ $t('hints.navbar.addCatalog') }}
        </p>
      </div>
    </div>
  </button>
</template>

<style lang="sass">
@import './LibraryCard'
</style>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import { getLocalLink, colorContrast } from '@/functions/image';

@Component
export default class LibraryCard extends Vue {
  @Prop({ type: Object, required: false }) readonly database!: DatabaseItem;
  @Prop({ type: Boolean, required: false, default: false }) readonly isAddButton!: boolean;

  get routerLink(): object {
    return {
      path: `/db/${this.database.localDB ? 'local' : 'remote' }/${this.database.url}`,
      meta: {
        title: this.database.title,
        localDB: this.database.localDB
      }
    };
  }

  get imageLink(): string {
    return getLocalLink(this.database?.backgroundTall ?? this.database.background);
  }

  get avatarTextColorClass(): string {
    return colorContrast(this.database.color);
  }

  get avatarTextPreview(): string {
    return Array.from(this.database.title).slice(0, 1).join('').toUpperCase();
  }

  avatarStyle(navlink: DatabaseItem): object {
    return navlink.localDB ? { backgroundColor: navlink.color } : {};
  }

  get catalogTallBackground(): string | undefined {
    if (this.database.backgroundTall && this.database.backgroundTall !== '') {
      if (!this.database.backgroundTall.includes('@/')) {
        return this.$forceReloadImage(this.imageLink);
      } else {
        return `/assets/integrations/backgrounds/tall/${this.database.url}.webp`;
      }
    }
    return undefined;
  }

  get catalogWideBackground(): string | undefined {
    if (this.database.background && this.database.background !== '') {
      if (!this.database.background.includes('@/')) {
        return this.$forceReloadImage(this.imageLink);
      } else {
        return `/assets/integrations/backgrounds/${this.database.url}.webp`;
      }
    }
    return undefined;
  }

  get catalogBackground(): string {
    if (this.catalogTallBackground !== undefined) {
      return this.catalogTallBackground;
    } else if (this.catalogWideBackground !== undefined) {
      return this.catalogWideBackground;
    } else {
      return "data:image/svg+xml,%3Csvg width='2560' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3ClinearGradient id='lg'%3E%3Cstop offset='0%25' stop-color='%232db8e7'/%3E%3Cstop offset='100%25' stop-color='%233081e2'/%3E%3C/linearGradient%3E%3Crect x='2' y='2' width='2556' height='396' style='fill:url(%23lg);stroke:%23555555;stroke-width:2'/%3E%3Ctext x='50%25' y='50%25' font-size='18' text-anchor='middle' alignment-baseline='middle' font-family='monospace, sans-serif' fill='%23555555'%3E2560&%23215;400%3C/text%3E%3C/svg%3E";
    }
  }

  get catalogIcon(): string {
    if (this.database.icon && this.database.icon !== '') {
      if (!this.database.icon.includes('@/')) {
        return this.$forceReloadImage(this.database.icon);
      } else {
        return `/assets/integrations/${this.database.url}.svg`;
      }
    } else {
      return '';
    }
  }

  onDoubleClick(): void {
    if (!this.database.disabled) {
      this.$router.push(this.routerLink);
    }
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
}
</script>
