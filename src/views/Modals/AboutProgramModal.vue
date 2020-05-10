<template>
  <div class="modal modal--about">
    <img
      class="logo"
      src="/assets/integrations/meshhouse.svg"
    >
    <h1>Meshhouse</h1>
    <span>Version 0.2.0</span>
    <div class="modal_content">
      <p>{{ $t('modals.about.textDescription') }}</p>
      <p>{{ returnContributorsAsText }}</p>
      <p>{{ $t('modals.about.textLicense') }}</p>
      <p>
        Github:
        <a
          :href="githubLink"
          @click.prevent="openLink"
        >
          {{ githubLink }}
        </a>
      </p>
    </div>
    <div class="modal_actions">
      <button
        class="button button--primary"
        @click="$emit('close')"
      >
        {{ $t('common.buttons.close') }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { shell } from 'electron'

@Component({})
export default class AboutProgramModal extends Vue {
  githubContributors: string[] = ['Maxim Makarov']
  githubLink = 'https://github.com/longsightedfilms/meshhouse'

  get returnContributorsAsText(): string {
    let contrib = ''
    this.githubContributors.forEach((contributor, index) => {
      contrib += contributor
      if (index < this.githubContributors.length - 1) {
        contrib += ', '
      }
    })
    return this.$t('modals.about.textContributors') + contrib
  }

  openLink(): void {
    shell.openExternal(this.githubLink)
  }
}
</script>
