<template>
  <router-link
    :to="routerLink"
    :style="{'--color': navlink.color}"
    :event="!navlink.disabled ? 'click' : ''"
    :disabled="navlink.disabled"
    class="sidebar_link"
  >
    <div
      class="avatar"
      :style="avatarStyle(navlink)"
    >
      <img
        v-if="navlink.icon !== ''"
        :src="retrieveImage(navlink.icon)"
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
        {{ $tc('views.catalog.sidebar.model', navlink.count) }}
        <span class="badge">
          {{ $formatSize(navlink.totalsize) }}
        </span>
      </p>
    </div>
  </router-link>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { colorContrast } from '@/functions/image';

@Component({
  props: {
    navlink: {
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
    },
    progress: {
      type: Number,
      required: true
    }
  }
})
export default class SidebarLink extends Vue {
  get routerLink(): object {
    return {
      path: `/db/${this.$props.navlink.localDB ? 'local' : 'remote' }/${this.$props.navlink.url}`,
      meta: {
        title: this.$props.navlink.title,
        localDB: this.$props.navlink.localDB
      }
    };
  }

  get avatarTextColorClass(): string {
    return colorContrast(this.$props.navlink.color);
  }

  get avatarTextPreview(): string {
    return Array.from(this.$props.navlink.title).slice(0, 1).join('').toUpperCase();
  }

  avatarStyle(navlink: DatabaseItem): object {
    return navlink.localDB ? { backgroundColor: navlink.color } : {};
  }

  retrieveImage(src: string): string {
    if (!this.$props.navlink.icon.includes('@/')) {
      return this.$forceReloadImage(this.$props.navlink.icon);
    } else {
      return `/assets/integrations/${this.$props.navlink.icon.substr(2)}`;
    }
  }

  deleteCatalog(catalog: DatabaseItem): void {
    console.log(catalog);
  }
}
</script>
