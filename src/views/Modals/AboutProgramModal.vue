<template>
  <div class="modal modal--about">
    <div class="logo">
      <img src="/assets/integrations/wide/meshhouse.svg">
      <p>v{{ applicationVersion }}</p>
    </div>
    <div class="modal_content">
      <p>{{ $t('modals.about.textDescription') }}</p>
      <p>{{ returnContributorsAsText }}</p>
      <p>{{ $t('modals.about.textLicense') }}</p>
      <p>
        Github:
        <a
          href="https://github.com/longsightedfilms/meshhouse"
          @click="openLink"
        >
          https://github.com/longsightedfilms/meshhouse
        </a>
      </p>
      <p>
        <a
          href="https://icons8.ru/icons/windows"
          @click="openLink"
        >
          Using Windows 10 style icons from
          <a
            href="https://icons8.ru"
            @click="openLink"
          >
            Icons8
          </a>
        </a>
      </p>
      <p>
        Icons made by <a href="http://www.freepik.com/" title="Freepik">Freepik</a>from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
      </p>
    </div>
    <div class="modal_actions">
      <v-button @click="$emit('close')">
        {{ $t('common.buttons.close') }}
      </v-button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({})
export default class AboutProgramModal extends Vue {
  githubContributors: string[] = ['Maxim Makarov']

  get applicationVersion(): string {
    return process.env.VUE_APP_VERSION !== undefined ? process.env.VUE_APP_VERSION : '0.0.0';
  }

  get returnContributorsAsText(): string {
    let contrib = '';
    this.githubContributors.forEach((contributor, index) => {
      contrib += contributor;
      if (index < this.githubContributors.length - 1) {
        contrib += ', ';
      }
    });
    return this.$t('modals.about.textContributors') + contrib;
  }

  openLink(event: Event): void {
    const target = (event.target as HTMLAnchorElement);
    this.$ipcInvoke('open-external', target.href);
    event.preventDefault();
  }
}
</script>
