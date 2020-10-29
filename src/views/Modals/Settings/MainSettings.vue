<template>
  <div v-bar>
    <div>
      <div class="tab">
        <h1>{{ $t('modals.settings.tabs.common.title') }}</h1>
        <language-selector />
        <theme-selector />
        <last-page-selector />
        <div class="setting setting--switch">
          <label class="title">{{ $t('modals.settings.tabs.common.content.hideIntegrations.title') }}</label>
          <toggle-button
            :value="hideIntegrations"
            :width="42"
            :height="18"
            :sync="true"
            @change="(event) => handleSliderChange(event, 'hideIntegrations')"
          />
        </div>
        <div class="setting setting--switch">
          <label class="title">{{ $t('modals.settings.tabs.common.content.minimalisticHeaders.title') }}</label>
          <toggle-button
            :value="minimalisticHeaders"
            :width="42"
            :height="18"
            :sync="true"
            @change="(event) => handleSliderChange(event, 'minimalisticHeaders')"
          />
        </div>
        <div class="setting setting--switch">
          <label class="title">{{ $t('modals.settings.tabs.common.content.showInTray.title') }}</label>
          <toggle-button
            :value="showInTray"
            :width="42"
            :height="18"
            :sync="true"
            @change="(event) => handleSliderChange(event, 'showInTray')"
          />
        </div>
        <i>{{ $t('modals.settings.tabs.common.content.showInTray.note') }}</i>
        <p>{{ $t('modals.settings.restartRequired') }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import LastPageSelector from '@/components/ComposedSettings/LastPageSelector.vue';
import LanguageSelector from '@/components/ComposedSettings/LanguageSelector.vue';
import ThemeSelector from '@/components/ComposedSettings/ThemeSelector.vue';
import { ToggleButton } from 'vue-js-toggle-button';

@Component({
  components: {
    LastPageSelector,
    LanguageSelector,
    ThemeSelector,
    ToggleButton
  }
})

export default class MainSettings extends Vue {
  hideIntegrations = this.$store.state.settings.hideIntegrations
  minimalisticHeaders = this.$store.state.settings.minimalisticHeaders
  showInTray = this.$store.state.settings.showInTray

  async handleSliderChange(event: VueToggleChangeEvent, setting: string): Promise<void> {
    (this as any)[setting] = event.value;
    this.$ipcInvoke('set-application-setting', {
      key: setting,
      value: (this as any)[setting]
    });

    const settings = await this.$ipcInvoke('get-all-settings');
    this.$store.commit('setApplicationSettings', settings);
  }
}
</script>
