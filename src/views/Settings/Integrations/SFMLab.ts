import { Vue, Component } from 'vue-property-decorator';
import { ToggleButton } from 'vue-js-toggle-button';
import { getModule } from 'vuex-module-decorators';
import SettingsStore from '@/store/modules/settings';

@Component<IntegrationsSFMLabTab>({
  components: {
    ToggleButton
  }
})
export default class IntegrationsSFMLabTab extends Vue {
  showMatureContent = false

  get settings(): SettingsStore {
    return getModule(SettingsStore, this.$store);
  }

  mounted(): void {
    this.showMatureContent = this.settings.integrations.sfmlab.showMatureContent ?? false;
  }

  handleMatureContentChange(event: VueToggleChangeEvent): void {
    this.showMatureContent = event.value;
    this.settings.setSFMLabMature(this.showMatureContent);
    this.$ipcInvoke<void>('set-application-setting', {
      key: 'integrations.sfmlab.showMatureContent',
      value: this.showMatureContent
    });
  }
}
