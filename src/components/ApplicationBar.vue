<template>
  <v-app-bar
    color="blue-grey darken-4"
    app
    clipped-left
    dark
  >
    <v-toolbar-title>
      <v-img src="@/assets/logo_text.svg"/>
    </v-toolbar-title>
    <div class="flex-grow-1"></div>

    <v-menu
      left
      bottom
    >
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon>mdi-download</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          v-for="n in 5"
          :key="n"
          @click="() => {}"
        >
          <v-list-item-title>Option {{ n }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-dialog
      v-model="$store.state.settingModalOpened"
      scrollable
      max-width="1200"
    >
      <template v-slot:activator="{ on }">
        <v-btn
          v-on="on"
          icon
        >
          <v-icon>mdi-settings</v-icon>
        </v-btn>
      </template>

      <modal-settings/>
    </v-dialog>

    <v-dialog
      v-model="$store.state.aboutModalOpened"
      scrollable
      max-width="600"
    >
      <template v-slot:activator="{ on }">
        <v-btn
          v-on="on"
          icon
        >
          <v-icon>mdi-help-circle</v-icon>
        </v-btn>
      </template>

      <modal-about/>
    </v-dialog>
  </v-app-bar>
</template>

<script>
import ModalAbout from '../views/Modals/AboutProgramModal'
import ModalSettings from '../views/Modals/SettingsModal'

export default {
  name: "ApplicationBar",
  components: {
    ModalAbout,
    ModalSettings
  }
}
</script>