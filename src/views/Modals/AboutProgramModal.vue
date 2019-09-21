<template>
  <v-card>
    <v-card-text class="pt-4 text--primary">
      <v-img
        class="mb-4"
        src="@/assets/logo_full.svg"
      />
      <p class="text--primary">Open-source каталогизатор 3d моделей, сделан преимущественно для одноименного сервиса meshhouse.com</p>
      <p class="text--primary">Контрибъюторы: {{ returnContributorsAsText }}</p>
      <p class="text--primary">Распространяется под лицензией Mozilla Public License 2.0</p>
      <p class="text--primary">Github: <a :href="githubLink" @click.prevent="openLink">{{ githubLink }}</a></p>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions>
      <div class="flex-grow-1"></div>
      <v-btn
        color="primary"
        text
        @click="$store.commit('setAboutProgramModal')"
      >
        Закрыть
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
      let text = ''
      this.githubContributors.forEach((contributor, index) => {
        text += contributor
        if (index < (this.githubContributors.length - 1)) {
          text += ", "
        }
      })
      return text
    }
  },
  methods: {
    openLink: function() {
      shell.openExternal(this.githubLink)
    }
  }
}
</script>