<template>
  <div v-bar>
    <div>
      <div class="tab">
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
  hideIntegrations = Boolean(this.$settingsGet('hideIntegrations'))

  handleSliderChange(event: VueToggleChangeEvent, setting: string): void {
    (this as any)[setting] = event.value;
    this.$settingsSet(setting, (this as any)[setting]);
    this.$store.commit(setting, (this as any)[setting]);
  }
}
</script>
