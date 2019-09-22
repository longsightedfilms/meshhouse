<template>
  <div>
    <local-folder v-if="$route.params.database != 'meshhouse'" />
  </div>
</template>

<script>
import LocalFolder from './LocalFolder'
import path from 'path'
import { remote } from 'electron'
import { getCollection, initDB } from 'lokijs-promise'

export default {
  name: "DatabaseListItems",
  components: {
    LocalFolder
  },
  data() {
    return {
      isReady: false
    }
  },
  async mounted() {
    initDB(path.join(remote.app.getPath('userData'), "/databases/" + this.$route.params.database + ".db"), 1000)
    await this.databaseInitialize()
  },
  async updated() {
    initDB(path.join(remote.app.getPath('userData'), "/databases/" + this.$route.params.database + ".db"), 1000)
    await this.databaseInitialize()
  },
  methods: {
    databaseInitialize: async function() {
      let models = await getCollection("models")
      models = models.find({})

      this.$store.commit('setPageData', models)
      this.isReady = true
    }
  }
}
</script>