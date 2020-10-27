<template>
  <div v-bar>
    <div>
      <div class="tab tab--programs">
        <h1>{{ $t('modals.settings.tabs.integrations.title') }}</h1>
        <div class="programs">
          <div
            v-for="(obj, key) in integrations"
            :key="key"
            class="program"
          >
            <div class="program-header">
              <label class="title">{{ obj.title }}</label>
              <toggle-button
                :value="!obj.disabled"
                :width="42"
                :height="18"
                :sync="true"
                :disabled="obj.path === null"
                @change="(event) => handleSliderChange(event, obj.url)"
              />
            </div>
            <div class="input-group">
              <input
                :ref="obj.url"
                type="file"
                webkitdirectory
                hidden
                required
                @change="(event) => handleDirectoryChange(event, obj.url)"
              >
              <button
                class="input input--file"
                @click.prevent="() => handleDirectoryClick(obj.url)"
              >
                <span v-if="obj.path !== null">
                  {{ obj.path }}
                </span>
                <span
                  v-else
                  class="placeholder"
                >
                  {{ $t('modals.settings.tabs.integrations.content.path') }}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { ToggleButton } from 'vue-js-toggle-button';
import { validate } from 'vee-validate';

@Component({
  components: {
    ToggleButton
  }
})

export default class ProgramSettings extends Vue {
  $refs!: {
    [key: string]: HTMLInputElement[];
  }

  integrations: any = {}

  mounted(): void {
    this.integrations = this.$store.state.db.databases.integrations;
  }

  handleSliderChange(event: VueToggleChangeEvent, integration: string): void {
    this.integrations[integration].disabled = !event.value;
    this.$setIntegrationsDB(this.integrations);
  }

  async handleDirectoryClick(integration: string): Promise<void> {
    const dialog = await this.$ipcInvoke('show-open-dialog', {
      properties: ['openDirectory']
    });

    const folderPath = dialog.filePaths.length !== 0 ? dialog.filePaths[0].toString() : '';
    const validation = await validate(folderPath, 'required', {
      name: 'catalogPath'
    });
    this.integrations[integration].path = validation.valid ? folderPath : null;
    this.$setIntegrationsDB(this.integrations);
  }
}
</script>
