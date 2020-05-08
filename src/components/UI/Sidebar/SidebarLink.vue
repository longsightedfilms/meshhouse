<template>
  <router-link
    :to="{ path: '/db/' + navlink.url, meta: { title: navlink.title }}"
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
        {{ navlink.count }} models <span>({{ computeFileSize(navlink.totalsize) }} used)</span>
      </p>
    </div>
  </router-link>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { formatBytes } from '@/plugins/functions'

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
        totalsize: 0,
        disabled: true
      }
    },
    progress: {
      type: Number,
      required: true
    }
  }
})
export default class SidebarLink extends Vue {
  mounted(): void {
    console.log(this.$props.navlink.icon)
  }

  computeFileSize(bytes: number): string {
    return formatBytes(bytes)
  }
  avatarStyle(navlink: any): object {
    return navlink.localDB ? { backgroundColor: navlink.color } : { backgroundColor: '#2e3131' }
  }

  retrieveImage(src: string): any {
    if (!this.$props.navlink.icon.includes('@/')) {
      return this.$forceReloadImage(this.$props.navlink.icon)
    } else {
      return require('@/assets/logo-icon.svg')
    }
  }
}
</script>
