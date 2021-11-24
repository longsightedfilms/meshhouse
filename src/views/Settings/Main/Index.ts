import { Vue, Component } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import LastPageSelector from '@/components/ComposedSettings/LastPageSelector.vue';
import LanguageSelector from '@/components/ComposedSettings/LanguageSelector.vue';
import ThemeSelector from '@/components/ComposedSettings/ThemeSelector.vue';
import { ToggleButton } from 'vue-js-toggle-button';
import SettingsStore from '@/store/modules/settings';

@Component<MainSettingsTab>({
  components: {
    LastPageSelector,
    LanguageSelector,
    ThemeSelector,
    ToggleButton
  }
})
export default class MainSettingsTab extends Vue {
  get settings(): SettingsStore {
    return getModule(SettingsStore, this.$store);
  }

  hideIntegrations = this.settings.hideIntegrations
  minimalisticHeaders = this.settings.minimalisticHeaders
  showInTray = this.settings.showInTray

  async handleSliderChange(event: VueToggleChangeEvent, setting: string): Promise<void> {
    (this as any)[setting] = event.value;
    this.$ipcInvoke<void>('set-application-setting', {
      key: setting,
      value: (this as any)[setting]
    });

    const settings = await this.$ipcInvoke<ApplicationSettings>('get-all-settings');
    this.settings.setApplicationSettings(settings);
  }
}
