<template>
  <v-app-bar
    color="blue-grey darken-4"
    app
    clipped-left
    dark
  >
    <v-toolbar-title>
      <v-img src="@/assets/logo_text.svg" />
    </v-toolbar-title>

    <v-progress-linear
      :active="!$store.state.pageLoaded"
      :indeterminate="!$store.state.pageLoaded"
      absolute
      bottom
      color="primary accent-4"
    />
    <div class="flex-grow-1" />

    <v-menu
      left
      bottom
      :close-on-content-click="false"
      nudge-bottom="14"
      offset-y
    >
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          v-on="on"
        >
          <v-icon>mdi-download</v-icon>
        </v-btn>
      </template>

      <v-list
        width="540"
        two-line
      >
        <v-sheet
          v-for="(item, index) in $store.state.downloads"
          :key="index"
          class="mx-2"
          :class="{'mb-2': index != ($store.state.downloads.length - 1) }"
          color="grey darken-2"
        >
          <v-list-item>
            <v-list-item-avatar>
              <v-avatar color="primary">
                <img :src="item.img">
              </v-avatar>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
              <v-list-item-subtitle v-if="item.status.finished">
                Downloads not implemented
              </v-list-item-subtitle>
              <v-list-item-subtitle v-else>
                <v-progress-linear
                  color="light-blue"
                  height="12"
                  :value="item.status.percentage"
                  rounded
                  striped
                >
                  <template v-slot="{ value }">
                    <strong class="caption">
                      {{ Math.ceil(value) }}%
                    </strong>
                  </template>
                </v-progress-linear>
              </v-list-item-subtitle>
            </v-list-item-content>
            
            <v-list-item-action>
              <v-btn-toggle rounded>
                <v-btn 
                  :disabled="!item.status.finished"
                  @click="$openItem(item.path)"
                >
                  <v-icon color="grey lighten-1">
                    mdi-folder
                  </v-icon>
                </v-btn>
                <v-btn 
                  :disabled="!item.status.finished"
                  color="error darken-4"
                  @click="$store.commit('deleteItemFromDownloadsList', index)"
                >
                  <v-icon color="grey lighten-1">
                    mdi-close
                  </v-icon>
                </v-btn>
              </v-btn-toggle>
            </v-list-item-action>
          </v-list-item>
        </v-sheet>
      </v-list>
    </v-menu>

    <v-dialog
      v-model="$store.state.settingModalOpened"
      scrollable
      max-width="1200"
    >
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          v-on="on"
        >
          <v-icon>mdi-settings</v-icon>
        </v-btn>
      </template>

      <modal-settings />
    </v-dialog>

    <v-dialog
      v-model="$store.state.aboutModalOpened"
      scrollable
      max-width="600"
    >
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          v-on="on"
        >
          <v-icon>mdi-help-circle</v-icon>
        </v-btn>
      </template>

      <modal-about />
    </v-dialog>
  </v-app-bar>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import ModalAbout from '@/views/Modals/AboutProgramModal'
import ModalSettings from '@/views/Modals/SettingsModal'

@Component({
  components: {
    ModalAbout,
    ModalSettings
  }
})

export default class ApplicationBar extends Vue {}
</script>