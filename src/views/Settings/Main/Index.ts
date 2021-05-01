import { Vue, Component } from 'vue-property-decorator';
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

export default class MainSettingsTab extends Vue {
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
