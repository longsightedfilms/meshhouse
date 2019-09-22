<template>
  <v-card>
    <v-card-text class="pt-4 text--primary">
      <v-img
        class="mb-4"
        src="@/assets/logo_full.svg"
      />
      <p class="text--primary">
        {{ $t('about.text_description') }}
      </p>
      <p class="text--primary">
        {{ returnContributorsAsText }}
      </p>
      <p class="text--primary">
        {{ $t('about.text_license') }}
      </p>
      <p class="text--primary">
        Github: 
        <a
          :href="githubLink"
          @click.prevent="openLink"
        >
          {{ githubLink }}
        </a>
      </p>
    </v-card-text>

    <v-divider />

    <v-card-actions>
      <div class="flex-grow-1" />
      <v-btn
        color="primary"
        text
        @click="$store.commit('setAboutProgramModal')"
      >
        {{ $t('app.buttons.close') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { shell } from 'electron'

export default {
  name: "AboutProgramModal",
  data() {
    return {
      githubContributors: [ 'Maxim Makarov' ],
      githubLink: "https://github.com/longsightedfilms/MeshHouse-desktop"
    }
  },
  computed: {
    returnContributorsAsText() {
      let contrib = ''
      this.githubContributors.forEach((contributor, index) => {
        contrib += contributor
        if (index < (this.githubContributors.length - 1)) {
          contrib += ", "
        }
      })
      return this.$t('about.text_contributors') + contrib
    }
  },
  methods: {
    openLink: function() {
      shell.openExternal(this.githubLink)
    }
  }
}
</script>