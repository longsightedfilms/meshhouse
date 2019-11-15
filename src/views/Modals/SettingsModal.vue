<template>
  <v-card>
    <v-card-title
      class="headline"
      primary-title
    >
      {{ $t('settings.title') }}
    </v-card-title>

    <v-divider />

    <v-card-text
      v-bar
      class="pt-4 text--primary"
    >
      <div>
        <language-selector />
        <p class="headline">
          {{ $t('settings.launchProgram') }}
        </p>
        <v-container
          class="pa-0"
          fluid
        >
          <v-row>
            <v-col cols="6">
              <v-sheet
                color="grey darken-4"
                class="pa-4"
              >
                <p class="title">
                  Autodesk 3DS Max
                </p>
                <v-switch
                  v-model="dccForm.adsk3dsmax.useSystemAssociation"
                  color="primary"
                  :label="$t('settings.useSystemAssociation')"
                  :hint="$t('settings.dcc.hint', { extension: '*.max' })"
                  inset
                  persistent-hint
                />
                <v-file-input
                  v-if="!dccForm.adsk3dsmax.useSystemAssociation"
                  :label="$t('settings.dcc.exePath')"
                  :hint="returnCurrentPathText(dccForm.adsk3dsmax.customPath)"
                  class="mt-4"
                  persistent-hint
                  solo
                  @change="(file) => { dccForm.adsk3dsmax.customPath = file != undefined ? file.path : '' }"
                >
                  <template v-slot:selection="{ file }">
                    {{ file.path }}
                  </template>
                </v-file-input>
              </v-sheet>
            </v-col>
            <v-col cols="6">
              <v-sheet
                color="grey darken-4"
                class="pa-4"
              >
                <p class="title">
                  Autodesk Maya
                </p>
                <v-switch
                  v-model="dccForm.adskMaya.useSystemAssociation"
                  color="primary"
                  :label="$t('settings.useSystemAssociation')"
                  :hint="$t('settings.dcc.hint', { extension: '*.ma, *.mb' })"
                  inset
                  persistent-hint
                />
                <v-file-input
                  v-if="!dccForm.adskMaya.useSystemAssociation"
                  :label="$t('settings.dcc.exePath')"
                  :hint="returnCurrentPathText(dccForm.adskMaya.customPath)"
                  class="mt-4"
                  persistent-hint
                  solo
                  @change="(file) => { dccForm.adskMaya.customPath = file != undefined ? file.path : '' }"
                >
                  <template v-slot:selection="{ file }">
                    {{ file.path }}
                  </template>
                </v-file-input>
              </v-sheet>
            </v-col>
            <v-col cols="6">
              <v-sheet
                color="grey darken-4"
                class="pa-4"
              >
                <p class="title">
                  Blender
                </p>
                <v-switch
                  v-model="dccForm.blender.useSystemAssociation"
                  color="primary"
                  :label="$t('settings.useSystemAssociation')"
                  :hint="$t('settings.dcc.hint', { extension: '*.blend' })"
                  inset
                  persistent-hint
                />
                <v-file-input
                  v-if="!dccForm.blender.useSystemAssociation"
                  :label="$t('settings.dcc.exePath')"
                  :hint="returnCurrentPathText(dccForm.blender.customPath)"
                  class="mt-4"
                  persistent-hint
                  solo
                  @change="(file) => { dccForm.blender.customPath = file != undefined ? file.path : '' }"
                >
                  <template v-slot:selection="{ file }">
                    {{ file.path }}
                  </template>
                </v-file-input>
              </v-sheet>
            </v-col>
            <v-col cols="6">
              <v-sheet
                color="grey darken-4"
                class="pa-4"
              >
                <p class="title">
                  Cinema 4D
                </p>
                <v-switch
                  v-model="dccForm.cinema4d.useSystemAssociation"
                  color="primary"
                  :label="$t('settings.useSystemAssociation')"
                  :hint="$t('settings.dcc.hint', { extension: '*.c4d' })"
                  inset
                  persistent-hint
                />
                <v-file-input
                  v-if="!dccForm.cinema4d.useSystemAssociation"
                  :label="$t('settings.dcc.exePath')"
                  :hint="returnCurrentPathText(dccForm.cinema4d.customPath)"
                  class="mt-4"
                  persistent-hint
                  solo
                  @change="(file) => { dccForm.cinema4d.customPath = file != undefined ? file.path : '' }"
                >
                  <template v-slot:selection="{ file }">
                    {{ file.path }}
                  </template>
                </v-file-input>
              </v-sheet>
            </v-col>
            <v-col cols="6">
              <v-sheet
                color="grey darken-4"
                class="pa-4"
              >
                <p class="title">
                  Houdini
                </p>
                <v-switch
                  v-model="dccForm.houdini.useSystemAssociation"
                  color="primary"
                  :label="$t('settings.useSystemAssociation')"
                  :hint="$t('settings.dcc.hint', { extension: '*.hip, *.hiplc, *.hipnc' })"
                  inset
                  persistent-hint
                />
                <v-file-input
                  v-if="!dccForm.houdini.useSystemAssociation"
                  :label="$t('settings.dcc.exePath')"
                  :hint="returnCurrentPathText(dccForm.houdini.customPath)"
                  class="mt-4"
                  persistent-hint
                  solo
                  @change="(file) => { dccForm.houdini.customPath = file != undefined ? file.path : '' }"
                >
                  <template v-slot:selection="{ file }">
                    {{ file.path }}
                  </template>
                </v-file-input>
              </v-sheet>
            </v-col>
            <v-col cols="6">
              <v-sheet
                color="grey darken-4"
                class="pa-4"
              >
                <p class="title">
                  Modo
                </p>
                <v-switch
                  v-model="dccForm.modo.useSystemAssociation"
                  color="primary"
                  :label="$t('settings.useSystemAssociation')"
                  :hint="$t('settings.dcc.hint', { extension: '*.lxo' })"
                  inset
                  persistent-hint
                />
                <v-file-input
                  v-if="!dccForm.modo.useSystemAssociation"
                  :label="$t('settings.dcc.exePath')"
                  :hint="returnCurrentPathText(dccForm.modo.customPath)"
                  class="mt-4"
                  persistent-hint
                  solo
                  @change="(file) => { dccForm.modo.customPath = file != undefined ? file.path : '' }"
                >
                  <template v-slot:selection="{ file }">
                    {{ file.path }}
                  </template>
                </v-file-input>
              </v-sheet>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-card-text>

    <v-divider />

    <v-card-actions>
      <div class="flex-grow-1" />
      <v-btn
        color="primary"
        text
        @click="saveSettingToFile"
      >
        {{ $t('app.buttons.save') }}
      </v-btn>
      <v-btn
        color="error"
        text
        @click="$store.commit('setSettingsModal')"
      >
        {{ $t('app.buttons.cancel') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import LanguageSelector from '@/components/LanguageSelector.vue'

@Component({
  components: {
    LanguageSelector
  }
})

export default class ModalSettings extends Vue {
  dccForm: object =  {
    adsk3dsmax: {
      useSystemAssociation: true,
      customPath: ""
    },
    adskMaya: {
      useSystemAssociation: true,
      customPath: ''
    },
    blender: {
      useSystemAssociation: true,
      customPath: ''
    },
    cinema4d: {
      useSystemAssociation: true,
      customPath: ''
    },
    houdini: {
      useSystemAssociation: true,
      customPath: ''
    },
    modo: {
      useSystemAssociation: true,
      customPath: ''
    }
  }

  mounted(): void {
    this.dccForm = this.$dccGetConfig()
  }

  saveSettingToFile(): void {
    this.$dccSetConfig(this.dccForm)
    this.$store.commit('setSettingsModal')
  }

  returnCurrentPathText(path: string): string {
    return this.$t('settings.currentPath') + path
  }
}
</script>