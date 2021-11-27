<template>
  <a
    :href="routerLink.path"
    :style="{'--color': navlink.color}"
    :disabled="navlink.disabled"
    :class="getRouteClass"
    @click.prevent="onClick"
  >
    <div
      class="avatar"
      :style="avatarStyle"
    >
      <img
        v-if="navlink.icon !== ''"
        :src="retrieveImage"
      >
      <p
        v-else
        :class="avatarTextColorClass"
      >
        {{ avatarTextPreview }}
      </p>
    </div>
    <div class="info">
      <div class="title">
        <b>{{ navlink.title }}</b>
        <button
          v-if="navlink.localDB"
          :title="'Удалить каталог'"
          class="button button--flat"
          @click="deleteCatalog(navlink)"
        >
          <vue-icon icon="recycle-bin" />
        </button>
      </div>
      <progress
        class="progress"
        :style="{'--color': navlink.color}"
        max="100"
        :value="progress"
      />
      <p class="count">
        {{ $tc('views.catalog.sidebar.model', Number(navlink.count || 0)) }}
        <span class="badge">
          {{ $formatSize(Number(navlink.totalsize || 0)) }}
        </span>
      </p>
    </div>
  </a>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { colorContrast } from '@/functions/image';

@Component
export default class SidebarLink extends Vue {
  @Prop({
    type: Object,
    required: true,
    default: {
      title: '',
      color: '',
      icon: '',
      url: '',
      path: null,
      count: 0,
      localDB: false,
      totalsize: 0,
      disabled: false
    }
  }) readonly navlink!: DatabaseItem;
  @Prop({
    type: Number,
    required: true
  }) readonly progress!: number;

  get routerLink(): {path: string; meta: object} {
    return {
      path: `/db/${this.navlink.localDB ? 'local' : 'remote' }/${this.navlink.url}`,
      meta: {
        title: this.navlink.title,
        localDB: this.navlink.localDB
      }
    };
  }

  get routeName(): string {
    return this.navlink.localDB ? 'LocalDatabase' : 'RemoteDatabase';
  }

  get getRouteClass(): string {
    let baseClass = 'sidebar_link';

    if (this.$route.name === this.routeName && this.$route.params.database === this.navlink.url) {
      baseClass += ' router-link-active';
    }

    return baseClass;
  }

  get avatarTextColorClass(): string {
    return colorContrast(this.navlink.color);
  }

  get avatarTextPreview(): string {
    return Array.from(this.navlink.title).slice(0, 1).join('').toUpperCase();
  }

  get avatarStyle(): object {
    return this.navlink.localDB ? { backgroundColor: this.navlink.color } : {};
  }

  get retrieveImage(): string {
    if (this.navlink.icon) {
      if (!this.navlink.icon.includes('@/')) {
        return this.$forceReloadImage(this.navlink.icon);
      } else {
        return `/assets/integrations/${this.navlink.icon.substr(2)}`;
      }
    } else {
      return '#';
    }
  }

  deleteCatalog(catalog: DatabaseItem): void {
    this.$closeSidebar();
    this.$showDialog('delete-catalog', { database: catalog.url });
  }

  onClick(): void {
    if (!this.navlink.disabled) {
      this.$router.push(this.routerLink);
    }
  }
}
</script>
