<template>
  <v-card>
    <v-card-title
      class="headline"
      primary-title
    >
      Настройки MeshHouse
    </v-card-title>

    <v-divider></v-divider>

    <v-card-text class="pt-4 text--primary" v-bar>
      <div>
        <p class="headline">Настройка запуска 3D программ</p>

        <v-sheet color="grey darken-4" class="pa-4">
          <p class="title">Autodesk 3DS Max</p>
          <v-switch
            v-model="dcc_form.adsk_3dsmax.useSystemAssociation"
            color="primary"
            label="Использовать системную ассоциацию"
            hint="Если переключатель находится в правом положении, то при открытии файлов будет использоваться системная ассоциация для *.max файлов"
            inset
            persistent-hint
          ></v-switch>
          <v-file-input
            v-if="!dcc_form.adsk_3dsmax.useSystemAssociation"
            label="Укажите путь к исполняемому файлу"
            :hint="returnCurrentPathText(dcc_form.adsk_3dsmax.customPath)"
            @change="(file) => { dcc_form.adsk_3dsmax.customPath = file != undefined ? file.path : '' }"
            class="mt-4"
            persistent-hint
            solo
          >
            <template v-slot:selection="{ file }">
              {{ file.path }}
            </template>
          </v-file-input>
        </v-sheet>

        <v-sheet color="grey darken-4" class="pa-4 mt-4">
          <p class="title">Autodesk Maya</p>
          <v-switch
            v-model="dcc_form.adsk_maya.useSystemAssociation"
            color="primary"
            label="Использовать системную ассоциацию"
            hint="Если переключатель находится в правом положении, то при открытии файлов будет использоваться системная ассоциация для *.ma и *.mb файлов"
            inset
            persistent-hint
          ></v-switch>
          <v-file-input
            v-if="!dcc_form.adsk_maya.useSystemAssociation"
            label="Укажите путь к исполняемому файлу"
            :hint="returnCurrentPathText(dcc_form.adsk_maya.customPath)"
            @change="(file) => { dcc_form.adsk_maya.customPath = file != undefined ? file.path : '' }"
            class="mt-4"
            persistent-hint
            solo
          >
            <template v-slot:selection="{ file }">
              {{ file.path }}
            </template>
          </v-file-input>
        </v-sheet>

        <v-sheet color="grey darken-4" class="pa-4 mt-4">
          <p class="title">Blender</p>
          <v-switch
            v-model="dcc_form.blender.useSystemAssociation"
            color="primary"
            label="Использовать системную ассоциацию"
            hint="Если переключатель находится в правом положении, то при открытии файлов будет использоваться системная ассоциация для *.blend файлов"
            inset
            persistent-hint
          ></v-switch>
          <v-file-input
            v-if="!dcc_form.blender.useSystemAssociation"
            label="Укажите путь к исполняемому файлу"
            :hint="returnCurrentPathText(dcc_form.blender.customPath)"
            @change="(file) => { dcc_form.blender.customPath = file != undefined ? file.path : '' }"
            class="mt-4"
            persistent-hint
            solo
          >
            <template v-slot:selection="{ file }">
              {{ file.path }}
            </template>
          </v-file-input>
        </v-sheet>

        <v-sheet color="grey darken-4" class="pa-4 mt-4">
          <p class="title">Cinema 4D</p>
          <v-switch
            v-model="dcc_form.cinema4d.useSystemAssociation"
            color="primary"
            label="Использовать системную ассоциацию"
            hint="Если переключатель находится в правом положении, то при открытии файлов будет использоваться системная ассоциация для *.c4d файлов"
            inset
            persistent-hint
          ></v-switch>
          <v-file-input
            v-if="!dcc_form.cinema4d.useSystemAssociation"
            label="Укажите путь к исполняемому файлу"
            :hint="returnCurrentPathText(dcc_form.cinema4d.customPath)"
            @change="(file) => { dcc_form.cinema4d.customPath = file != undefined ? file.path : '' }"
            class="mt-4"
            persistent-hint
            solo
          >
            <template v-slot:selection="{ file }">
              {{ file.path }}
            </template>
          </v-file-input>
        </v-sheet>

        <v-sheet color="grey darken-4" class="pa-4 mt-4">
          <p class="title">Houdini</p>
          <v-switch
            v-model="dcc_form.houdini.useSystemAssociation"
            color="primary"
            label="Использовать системную ассоциацию"
            hint="Если переключатель находится в правом положении, то при открытии файлов будет использоваться системная ассоциация для *.hip файлов"
            inset
            persistent-hint
          ></v-switch>
          <v-file-input
            v-if="!dcc_form.houdini.useSystemAssociation"
            label="Укажите путь к исполняемому файлу"
            :hint="returnCurrentPathText(dcc_form.houdini.customPath)"
            @change="(file) => { dcc_form.houdini.customPath = file != undefined ? file.path : '' }"
            class="mt-4"
            persistent-hint
            solo
          >
            <template v-slot:selection="{ file }">
              {{ file.path }}
            </template>
          </v-file-input>
        </v-sheet>

        <v-sheet color="grey darken-4" class="pa-4 mt-4">
          <p class="title">Modo</p>
          <v-switch
            v-model="dcc_form.modo.useSystemAssociation"
            color="primary"
            label="Использовать системную ассоциацию"
            hint="Если переключатель находится в правом положении, то при открытии файлов будет использоваться системная ассоциация для *.lxo файлов"
            inset
            persistent-hint
          ></v-switch>
          <v-file-input
            v-if="!dcc_form.modo.useSystemAssociation"
            label="Укажите путь к исполняемому файлу"
            :hint="returnCurrentPathText(dcc_form.modo.customPath)"
            @change="(file) => { dcc_form.modo.customPath = file != undefined ? file.path : '' }"
            class="mt-4"
            persistent-hint
            solo
          >
            <template v-slot:selection="{ file }">
              {{ file.path }}
            </template>
          </v-file-input>
        </v-sheet>
      </div>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions>
      <div class="flex-grow-1"></div>
      <v-btn
        color="primary"
        text
        @click="saveSettingToFile"
      >
        Сохранить
      </v-btn>
      <v-btn
        color="error"
        text
        @click="$store.commit('setSettingsModal')"
      >
        Отмена
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "ModalSettings",
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
      return "Текущий путь к программе: " + path
    }
  }
}
</script>