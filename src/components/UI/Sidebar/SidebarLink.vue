<template>
  <router-link
    :to="routerLink"
    :style="{'--color': navlink.color}"
    :event="!navlink.disabled ? 'click' : ''"
    :disabled="navlink.disabled"
  >
    <div
      class="avatar"
      :style="avatarStyle(navlink)"
    >
      <img
        v-if="navlink.icon !== ''"
        :src="retrieveImage(navlink.icon)"
      >
      <p v-else>
        {{ navlink.title.substr(0, 1) }}
      </p>
    </div>
    <div class="info">
      <b class="title">{{ navlink.title }}</b>
      <progress
        class="progress"
        :style="{'--color': navlink.color}"
        max="100"
        :value="progress"
      />
      <p class="count">
        {{ $tc('views.catalog.sidebar.model', navlink.count) }}
        <span>{{ computeFileSize(navlink.totalsize) }}</span>
      </p>
    </div>
  </router-link>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { formatBytes } from '@/plugins/models-db/functions'

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
    }
  }

  computeFileSize(bytes: number): string {
    return formatBytes(bytes)
  }
  avatarStyle(navlink: DatabaseItem): object {
    return navlink.localDB ? { backgroundColor: navlink.color } : {}
  }

  retrieveImage(src: string): string {
    if (!this.$props.navlink.icon.includes('@/')) {
      return this.$forceReloadImage(this.$props.navlink.icon)
    } else {
      return `/assets/integrations/${this.$props.navlink.icon.substr(2)}`
    }
  }
}
</script>
