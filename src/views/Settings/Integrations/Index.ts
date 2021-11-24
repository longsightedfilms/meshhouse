import { Vue, Component } from 'vue-property-decorator';
import { ToggleButton } from 'vue-js-toggle-button';
import { getModule } from 'vuex-module-decorators';
import { validate } from 'vee-validate';
import SettingsStore from '@/store/modules/settings';
import DatabaseStore from '@/store/modules/database';

@Component({
  components: {
    ToggleButton
  }
})

export default class IntegrationsIndexTab extends Vue {
  $refs!: {
    [key: string]: HTMLInputElement[];
  }

  integrations: any = {}
  proxy: any = {}

  get settings(): SettingsStore {
    return getModule(SettingsStore, this.$store);
  }

  get db(): DatabaseStore {
    return getModule(DatabaseStore, this.$store);
  }

  mounted(): void {
    this.integrations = this.db.databases.integrations;
    this.proxy = this.settings.integrations.proxy;
  }

  handleSliderChange(event: VueToggleChangeEvent, integration: string): void {
    this.integrations[integration].disabled = !event.value;
    this.$setIntegrationsDB(this.integrations);
  }

  handleServerChange(event: VueToggleChangeEvent): void {
    this.proxy.customProxy = event.value;
    this.settings.setIntegrationsProxy(this.proxy);
    this.$ipcInvoke<void>('set-application-setting', {
      key: 'integrations.proxy',
      value: this.proxy
    });
  }

  handleServerInput(event: any): void {
    this.proxy.url = event.target.value;
    this.settings.setIntegrationsProxy(this.proxy);
    this.$ipcInvoke<void>('set-application-setting', {
      key: 'integrations.proxy',
      value: this.proxy
    });
  }

  async handleDirectoryClick(integration: string): Promise<void> {
    const dialog = await this.$ipcInvoke<Electron.OpenDialogReturnValue>('show-open-dialog', {
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
