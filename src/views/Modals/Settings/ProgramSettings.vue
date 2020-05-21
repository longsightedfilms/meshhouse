<template>
  <div v-bar>
    <div>
      <div class="tab tab--programs">
        <div class="programs">
          <div class="program">
            <div class="program-header">
              <label class="title">Autodesk 3DS Max</label>
              <toggle-button
                :value="dccForm.adsk3dsmax.useSystemAssociation"
                :width="42"
                :height="18"
                :sync="true"
                @change="(event) => handleSliderChange(event, 'adsk3dsmax')"
              />
            </div>
            <div class="input-group">
              <input
                ref="adsk3dsmax"
                type="file"
                webkitdirectory
                hidden
                required
                @change="(event) => handleDirectoryChange(event, 'adsk3dsmax')"
              >
              <button
                v-if="dccForm.adsk3dsmax.useSystemAssociation === false"
                class="input input--file"
                @click.prevent="(event) => handleDirectoryClick(event, 'adsk3dsmax')"
              >
                <span v-if="dccForm.adsk3dsmax.customPath !== ''">
                  {{ dccForm.adsk3dsmax.customPath }}
                </span>
                <span
                  v-else
                  class="placeholder"
                >
                  {{ $t('modals.settings.tabs.dcc.content.exePath') }}
                </span>
              </button>
            </div>
            <label class="hint">{{ $t('modals.settings.tabs.dcc.content.hint', { extension: '*.max' }) }}</label>
          </div>

          <div class="program">
            <div class="program-header">
              <label class="title">Autodesk Maya</label>
              <toggle-button
                :value="dccForm.adskMaya.useSystemAssociation"
                :width="42"
                :height="18"
                :sync="true"
                @change="(event) => handleSliderChange(event, 'adskMaya')"
              />
            </div>
            <div class="input-group">
              <input
                ref="adskMaya"
                type="file"
                webkitdirectory
                hidden
                required
                @change="(event) => handleDirectoryChange(event, 'adskMaya')"
              >
              <button
                v-if="dccForm.adskMaya.useSystemAssociation === false"
                class="input input--file"
                @click.prevent="(event) => handleDirectoryClick(event, 'adskMaya')"
              >
                <span v-if="dccForm.adskMaya.customPath !== ''">
                  {{ dccForm.adskMaya.customPath }}
                </span>
                <span
                  v-else
                  class="placeholder"
                >
                  {{ $t('modals.settings.tabs.dcc.content.exePath') }}
                </span>
              </button>
            </div>
            <label class="hint">{{ $t('modals.settings.tabs.dcc.content.hint', { extension: '*.ma, *.mb' }) }}</label>
          </div>

          <div class="program">
            <div class="program-header">
              <label class="title">Blender</label>
              <toggle-button
                :value="dccForm.blender.useSystemAssociation"
                :width="42"
                :height="18"
                :sync="true"
                @change="(event) => handleSliderChange(event, 'blender')"
              />
            </div>
            <div class="input-group">
              <input
                ref="blender"
                type="file"
                webkitdirectory
                hidden
                required
                @change="(event) => handleDirectoryChange(event, 'blender')"
              >
              <button
                v-if="dccForm.blender.useSystemAssociation === false"
                class="input input--file"
                @click.prevent="(event) => handleDirectoryClick(event, 'blender')"
              >
                <span v-if="dccForm.blender.customPath !== ''">
                  {{ dccForm.blender.customPath }}
                </span>
                <span
                  v-else
                  class="placeholder"
                >
                  {{ $t('modals.settings.tabs.dcc.content.exePath') }}
                </span>
              </button>
            </div>
            <label class="hint">{{ $t('modals.settings.tabs.dcc.content.hint', { extension: '*.blend' }) }}</label>
          </div>

          <div class="program">
            <div class="program-header">
              <label class="title">Cinema 4D</label>
              <toggle-button
                :value="dccForm.cinema4d.useSystemAssociation"
                :width="42"
                :height="18"
                :sync="true"
                @change="(event) => handleSliderChange(event, 'cinema4d')"
              />
            </div>
            <div class="input-group">
              <input
                ref="cinema4d"
                type="file"
                webkitdirectory
                hidden
                required
                @change="(event) => handleDirectoryChange(event, 'cinema4d')"
              >
              <button
                v-if="dccForm.cinema4d.useSystemAssociation === false"
                class="input input--file"
                @click.prevent="(event) => handleDirectoryClick(event, 'cinema4d')"
              >
                <span v-if="dccForm.cinema4d.customPath !== ''">
                  {{ dccForm.cinema4d.customPath }}
                </span>
                <span
                  v-else
                  class="placeholder"
                >
                  {{ $t('modals.settings.tabs.dcc.content.exePath') }}
                </span>
              </button>
            </div>
            <label class="hint">{{ $t('modals.settings.tabs.dcc.content.hint', { extension: '*.c4d' }) }}</label>
          </div>

          <div class="program">
            <div class="program-header">
              <label class="title">Houdini</label>
              <toggle-button
                :value="dccForm.houdini.useSystemAssociation"
                :width="42"
                :height="18"
                :sync="true"
                @change="(event) => handleSliderChange(event, 'houdini')"
              />
            </div>
            <div class="input-group">
              <input
                ref="houdini"
                type="file"
                webkitdirectory
                hidden
                required
                @change="(event) => handleDirectoryChange(event, 'houdini')"
              >
              <button
                v-if="dccForm.houdini.useSystemAssociation === false"
                class="input input--file"
                @click.prevent="(event) => handleDirectoryClick(event, 'houdini')"
              >
                <span v-if="dccForm.houdini.customPath !== ''">
                  {{ dccForm.houdini.customPath }}
                </span>
                <span
                  v-else
                  class="placeholder"
                >
                  {{ $t('modals.settings.tabs.dcc.content.exePath') }}
                </span>
              </button>
            </div>
            <label class="hint">{{ $t('modals.settings.tabs.dcc.content.hint', { extension: '*.hip, *.hiplc, *.hipnc' }) }}</label>
          </div>

          <div class="program">
            <div class="program-header">
              <label class="title">Modo</label>
              <toggle-button
                :value="dccForm.modo.useSystemAssociation"
                :width="42"
                :height="18"
                :sync="true"
                @change="(event) => handleSliderChange(event, 'modo')"
              />
            </div>
            <div class="input-group">
              <input
                ref="modo"
                type="file"
                webkitdirectory
                hidden
                required
                @change="(event) => handleDirectoryChange(event, 'modo')"
              >
              <button
                v-if="dccForm.modo.useSystemAssociation === false"
                class="input input--file"
                @click.prevent="(event) => handleDirectoryClick(event, 'modo')"
              >
                <span v-if="dccForm.modo.customPath !== ''">
                  {{ dccForm.modo.customPath }}
                </span>
                <span
                  v-else
                  class="placeholder"
                >
                  {{ $t('modals.settings.tabs.dcc.content.exePath') }}
                </span>
              </button>
            </div>
            <label class="hint">{{ $t('modals.settings.tabs.dcc.content.hint', { extension: '*.lxo' }) }}</label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { ToggleButton } from 'vue-js-toggle-button'

@Component({
  components: {
    ToggleButton
  }
})

export default class ProgramSettings extends Vue {
  dccForm: object = {
    adsk3dsmax: {
      useSystemAssociation: true,
      customPath: '',
    },
    adskMaya: {
      useSystemAssociation: true,
      customPath: '',
    },
    blender: {
      useSystemAssociation: true,
      customPath: '',
    },
    cinema4d: {
      useSystemAssociation: true,
      customPath: '',
    },
    houdini: {
      useSystemAssociation: true,
      customPath: '',
    },
    modo: {
      useSystemAssociation: true,
      customPath: '',
    },
  }

  mounted(): void {
    this.dccForm = this.$dccGetConfig()
  }

  saveSettingToFile(): void {
    this.$dccSetConfig(this.dccForm)
    this.$emit('close')
  }

  handleSliderChange(event: any, dcc: string): void {
    (this as any).dccForm[dcc].useSystemAssociation = event.value
    this.$dccSetConfig(this.dccForm)
  }

  handleDirectoryChange(event: any, dcc: string): void {
    const file = event.target.files[0];
    (this as any).dccForm[dcc].customPath = file !== undefined ? file.path : ''
  }

  handleDirectoryClick(event: any, dcc: string): void {
    (this.$refs[dcc] as HTMLInputElement).click()
  }
}
</script>
