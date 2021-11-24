import { Vue, Component } from 'vue-property-decorator';
import { ToggleButton } from 'vue-js-toggle-button';
import { validate } from 'vee-validate';

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

  mounted(): void {
    this.integrations = this.$store.state.db.databases.integrations;
    this.proxy = this.$store.state.settings.integrations.proxy;
  }

  handleSliderChange(event: VueToggleChangeEvent, integration: string): void {
    this.integrations[integration].disabled = !event.value;
    this.$setIntegrationsDB(this.integrations);
  }

  handleServerChange(event: VueToggleChangeEvent): void {
    this.proxy.customProxy = event.value;
    this.$store.commit('setIntegrationsProxy', this.proxy);
    this.$ipcInvoke('set-application-setting', {
      key: 'integrations.proxy',
      value: this.proxy
    });
  }

  handleServerInput(event: any): void {
    this.proxy.url = event.target.value;
    this.$store.commit('setIntegrationsProxy', this.proxy);
    this.$ipcInvoke('set-application-setting', {
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
