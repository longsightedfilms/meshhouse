<template>
  <v-app>
    <v-navigation-drawer
      color="blue-grey darken-4"
      mini-variant-width="80"
      app
      clipped
      dark
      mini-variant
      permanent
    >
      <v-list>
        <v-tooltip 
          v-for="item in $store.state.databases"
          :key="item.title"
          right
        >
          <template v-slot:activator="{ on }">
            <v-list-item
              link
              :to="{ path: '/db/' + item.url, meta: { title: item.title } }"
              v-on="on"
            >
              <v-avatar
                class="my-2"
                :color="item.color"
                width="48"
                height="48"
              >
                <p class="white--text ma-0">
                  {{ item.title.substr(0,1) }}
                </p>
              </v-avatar>
            </v-list-item>
          </template>
          <span>{{ item.title }}</span>
        </v-tooltip>

        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <v-list-item
              link
              to="/add-new-catalog"
              v-on="on"
            >
              <v-avatar
                class="my-2"
                color="primary"
                width="48"
                height="48"
              >
                <v-icon class="white--text">
                  mdi-plus
                </v-icon>
              </v-avatar>
            </v-list-item>
          </template>
          <span>{{ $t('app.buttons.addCatalog') }}</span>
        </v-tooltip>
      </v-list>
    </v-navigation-drawer>

    <application-bar />
    <v-content>
      <div v-bar>
        <div>
          <div style="max-height: calc(100vh - 64px)">
            <router-view />
          </div>
        </div>
      </div>
    </v-content>
  </v-app>
</template>

<style lang="sass">
@import 'sass/vuebar'
@import 'sass/vuetify'
</style>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import ApplicationBar from '@/components/ApplicationBar.vue'

@Component({
  components: {
    ApplicationBar
  }
})

export default class App extends Vue {
  mounted(): void {
    this.$i18n.locale = this.$settingsGet('language')
    const lastOpened = this.$settingsGet('applicationWindow.lastOpened')
    this.$router.push(lastOpened)
  }
}
</script>