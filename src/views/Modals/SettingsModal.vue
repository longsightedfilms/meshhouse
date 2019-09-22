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
                  v-model="dcc_form.adsk_3dsmax.useSystemAssociation"
                  color="primary"
                  :label="$t('settings.useSystemAssociation')"
                  hint="Если переключатель находится в правом положении, то при открытии файлов будет использоваться системная ассоциация для *.max файлов"
                  inset
                  persistent-hint
                />
                <v-file-input
                  v-if="!dcc_form.adsk_3dsmax.useSystemAssociation"
                  label="Укажите путь к исполняемому файлу"
                  :hint="returnCurrentPathText(dcc_form.adsk_3dsmax.customPath)"
                  class="mt-4"
                  persistent-hint
                  solo
                  @change="(file) => { dcc_form.adsk_3dsmax.customPath = file != undefined ? file.path : '' }"
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
                  v-model="dcc_form.adsk_maya.useSystemAssociation"
                  color="primary"
                  :label="$t('settings.useSystemAssociation')"
                  hint="Если переключатель находится в правом положении, то при открытии файлов будет использоваться системная ассоциация для *.ma и *.mb файлов"
                  inset
                  persistent-hint
                />
                <v-file-input
                  v-if="!dcc_form.adsk_maya.useSystemAssociation"
                  label="Укажите путь к исполняемому файлу"
                  :hint="returnCurrentPathText(dcc_form.adsk_maya.customPath)"
                  class="mt-4"
                  persistent-hint
                  solo
                  @change="(file) => { dcc_form.adsk_maya.customPath = file != undefined ? file.path : '' }"
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
                  v-model="dcc_form.blender.useSystemAssociation"
                  color="primary"
                  :label="$t('settings.useSystemAssociation')"
                  hint="Если переключатель находится в правом положении, то при открытии файлов будет использоваться системная ассоциация для *.blend файлов"
                  inset
                  persistent-hint
                />
                <v-file-input
                  v-if="!dcc_form.blender.useSystemAssociation"
                  label="Укажите путь к исполняемому файлу"
                  :hint="returnCurrentPathText(dcc_form.blender.customPath)"
                  class="mt-4"
                  persistent-hint
                  solo
                  @change="(file) => { dcc_form.blender.customPath = file != undefined ? file.path : '' }"
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
                  v-model="dcc_form.cinema4d.useSystemAssociation"
                  color="primary"
                  :label="$t('settings.useSystemAssociation')"
                  hint="Если переключатель находится в правом положении, то при открытии файлов будет использоваться системная ассоциация для *.c4d файлов"
                  inset
                  persistent-hint
                />
                <v-file-input
                  v-if="!dcc_form.cinema4d.useSystemAssociation"
                  label="Укажите путь к исполняемому файлу"
                  :hint="returnCurrentPathText(dcc_form.cinema4d.customPath)"
                  class="mt-4"
                  persistent-hint
                  solo
                  @change="(file) => { dcc_form.cinema4d.customPath = file != undefined ? file.path : '' }"
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
                  v-model="dcc_form.houdini.useSystemAssociation"
                  color="primary"
                  :label="$t('settings.useSystemAssociation')"
                  hint="Если переключатель находится в правом положении, то при открытии файлов будет использоваться системная ассоциация для *.hip файлов"
                  inset
                  persistent-hint
                />
                <v-file-input
                  v-if="!dcc_form.houdini.useSystemAssociation"
                  label="Укажите путь к исполняемому файлу"
                  :hint="returnCurrentPathText(dcc_form.houdini.customPath)"
                  class="mt-4"
                  persistent-hint
                  solo
                  @change="(file) => { dcc_form.houdini.customPath = file != undefined ? file.path : '' }"
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
                  v-model="dcc_form.modo.useSystemAssociation"
                  color="primary"
                  :label="$t('settings.useSystemAssociation')"
                  hint="Если переключатель находится в правом положении, то при открытии файлов будет использоваться системная ассоциация для *.lxo файлов"
                  inset
                  persistent-hint
                />
                <v-file-input
                  v-if="!dcc_form.modo.useSystemAssociation"
                  label="Укажите путь к исполняемому файлу"
                  :hint="returnCurrentPathText(dcc_form.modo.customPath)"
                  class="mt-4"
                  persistent-hint
                  solo
                  @change="(file) => { dcc_form.modo.customPath = file != undefined ? file.path : '' }"
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

<script>
import LanguageSelector from '../../components/LanguageSelector'

export default {
  name: "ModalSettings",
  components: {
    LanguageSelector
  },
  data() {
    return {
      dcc_form: {
        adsk_3dsmax: {
          useSystemAssociation: true,
          customPath: ""
        },
        adsk_maya: {
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
    }
  },
  mounted() {
    this.dcc_form = this.$dccGetConfig()
  },
  methods: {
    saveSettingToFile: function() {
      this.$dccSetConfig(this.dcc_form)
      this.$store.commit('setSettingsModal')
    },
    returnCurrentPathText(path) {
      return this.$t('settings.currentPath') + path
    }
  }
}
</script>